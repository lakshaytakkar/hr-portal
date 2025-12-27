'use server'

import { revalidatePath } from 'next/cache'
import { eq, and, isNull, desc, asc, inArray, sql } from 'drizzle-orm'
import { db, employees, profiles, departments, onboardings, onboardingTasks } from '@/lib/db'
import { toFrontendEmployee, toFrontendOnboarding } from '@/lib/db/adapters/hr'
import type { Employee as FrontendEmployee, Onboarding as FrontendOnboarding } from '@/lib/types/hr'
import { resolveDepartmentId, resolveProfileId, normalizeOptional } from '@/lib/utils/foreign-keys'
import { getUserFriendlyErrorMessage, logDatabaseError } from '@/lib/utils/errors'

// ============================================================================
// HELPER FUNCTIONS FOR FORMS
// ============================================================================

/**
 * Get all active departments for dropdowns
 */
export async function getDepartments() {
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db
    .select({
      id: departments.id,
      name: departments.name,
      code: departments.code,
    })
    .from(departments)
    .where(and(isNull(departments.deletedAt), eq(departments.isActive, true)))
    .orderBy(asc(departments.name))

  return result
}

/**
 * Get all active managers/profiles for dropdowns
 */
export async function getManagers() {
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      email: profiles.email,
      role: profiles.role,
    })
    .from(profiles)
    .where(and(eq(profiles.isActive, true), inArray(profiles.role, ['manager', 'superadmin'])))
    .orderBy(asc(profiles.fullName))

  return result
}

// ============================================================================
// EMPLOYEES
// ============================================================================

export async function getEmployees(): Promise<FrontendEmployee[]> {
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db
    .select({
      employee: employees,
      profile: profiles,
      department: departments,
      manager: profiles,
    })
    .from(employees)
    .innerJoin(profiles, eq(employees.profileId, profiles.id))
    .leftJoin(departments, eq(profiles.departmentId, departments.id))
    .leftJoin(
      sql`${profiles} as manager`,
      eq(profiles.managerId, sql`manager.id`)
    )
    .where(isNull(employees.deletedAt))
    .orderBy(asc(employees.employeeId))

  return result.map((row) =>
    toFrontendEmployee({
      ...row.employee,
      profile: row.profile,
      profile_department: row.department,
      profile_manager: row.manager as typeof profiles.$inferSelect | null,
    })
  )
}

export async function getEmployeeById(id: string): Promise<FrontendEmployee | null> {
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db
    .select({
      employee: employees,
      profile: profiles,
      department: departments,
    })
    .from(employees)
    .innerJoin(profiles, eq(employees.profileId, profiles.id))
    .leftJoin(departments, eq(profiles.departmentId, departments.id))
    .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
    .limit(1)

  if (result.length === 0) return null

  const row = result[0]
  return toFrontendEmployee({
    ...row.employee,
    profile: row.profile,
    profile_department: row.department,
    profile_manager: null,
  })
}

interface CreateEmployeeInput {
  fullName: string
  email: string
  phone?: string
  departmentId?: string
  position?: string
  managerId?: string
  hireDate: string
  employmentType?: 'full-time' | 'part-time' | 'contract'
  salary?: number
  status?: 'active' | 'on-leave' | 'terminated' | 'resigned'
}

export async function createEmployee(input: CreateEmployeeInput): Promise<FrontendEmployee> {
  if (!db) {
    throw new Error('Database not connected')
  }

  try {
    // Normalize optional fields (convert empty strings to undefined)
    const normalizedPhone = normalizeOptional(input.phone)
    const normalizedPosition = normalizeOptional(input.position)
    const normalizedSalary = normalizeOptional(input.salary)

    // Resolve foreign keys from user-friendly identifiers to UUIDs
    const resolvedDepartmentId = await resolveDepartmentId(input.departmentId, false)
    const resolvedManagerId = await resolveProfileId(input.managerId, false)

    // Validate required fields
    if (!input.fullName || !input.email || !input.hireDate) {
      throw new Error('Full name, email, and hire date are required')
    }

    // Generate next employee ID
    const lastEmployee = await db
      .select({ employeeId: employees.employeeId })
      .from(employees)
      .orderBy(desc(employees.employeeId))
      .limit(1)

    let nextId = 'EMP001'
    if (lastEmployee.length > 0) {
      const lastNum = parseInt(lastEmployee[0].employeeId.replace('EMP', ''))
      nextId = `EMP${String(lastNum + 1).padStart(3, '0')}`
    }

    // Create profile first
    const [newProfile] = await db
      .insert(profiles)
      .values({
        id: crypto.randomUUID(),
        email: input.email,
        fullName: input.fullName,
        phone: normalizedPhone,
        departmentId: resolvedDepartmentId,
        position: normalizedPosition,
        managerId: resolvedManagerId,
        role: 'executive',
        isActive: true,
      })
      .returning()

    // Create employee record
    const [newEmployee] = await db
      .insert(employees)
      .values({
        profileId: newProfile.id,
        employeeId: nextId,
        hireDate: input.hireDate,
        employmentType: input.employmentType || 'full-time',
        salary: normalizedSalary,
        status: input.status || 'active',
      })
      .returning()

    revalidatePath('/hr/employees')

    return toFrontendEmployee({
      ...newEmployee,
      profile: newProfile,
      profile_department: null,
      profile_manager: null,
    })
  } catch (error) {
    // Log error for debugging
    logDatabaseError(error, 'createEmployee')

    // Re-throw with user-friendly message
    const friendlyMessage = getUserFriendlyErrorMessage(error)
    throw new Error(friendlyMessage)
  }
}

interface UpdateEmployeeInput {
  id: string
  fullName?: string
  email?: string
  phone?: string
  departmentId?: string
  position?: string
  managerId?: string
  hireDate?: string
  employmentType?: 'full-time' | 'part-time' | 'contract'
  salary?: number
  status?: 'active' | 'on-leave' | 'terminated' | 'resigned'
}

export async function updateEmployee(input: UpdateEmployeeInput): Promise<FrontendEmployee> {
  if (!db) {
    throw new Error('Database not connected')
  }

  try {
    // Get employee to find profile
    const [existingEmployee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, input.id))
      .limit(1)

    if (!existingEmployee) {
      throw new Error('Employee not found')
    }

    // Normalize optional fields
    const normalizedPhone = normalizeOptional(input.phone)
    const normalizedPosition = normalizeOptional(input.position)
    const normalizedSalary = normalizeOptional(input.salary)

    // Resolve foreign keys from user-friendly identifiers to UUIDs
    const resolvedDepartmentId = input.departmentId !== undefined
      ? await resolveDepartmentId(input.departmentId, false)
      : undefined
    const resolvedManagerId = input.managerId !== undefined
      ? await resolveProfileId(input.managerId, false)
      : undefined

    // Update profile
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        fullName: input.fullName,
        email: input.email,
        phone: normalizedPhone,
        departmentId: resolvedDepartmentId,
        position: normalizedPosition,
        managerId: resolvedManagerId,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, existingEmployee.profileId))
      .returning()

    // Update employee
    const [updatedEmployee] = await db
      .update(employees)
      .set({
        hireDate: input.hireDate,
        employmentType: input.employmentType,
        salary: normalizedSalary,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, input.id))
      .returning()

    revalidatePath('/hr/employees')
    revalidatePath(`/hr/employees/${input.id}`)

    return toFrontendEmployee({
      ...updatedEmployee,
      profile: updatedProfile,
      profile_department: null,
      profile_manager: null,
    })
  } catch (error) {
    // Log error for debugging
    logDatabaseError(error, 'updateEmployee')

    // Re-throw with user-friendly message
    const friendlyMessage = getUserFriendlyErrorMessage(error)
    throw new Error(friendlyMessage)
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  if (!db) {
    throw new Error('Database not connected')
  }

  // Soft delete
  await db
    .update(employees)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(employees.id, id))

  revalidatePath('/hr/employees')
}

// ============================================================================
// ONBOARDING
// ============================================================================

export async function getOnboardings(): Promise<FrontendOnboarding[]> {
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db.query.onboardings.findMany({
    with: {
      employee: {
        with: {
          profile: true,
        },
      },
      assignedTo: true,
      tasks: {
        with: {
          assignedTo: true,
        },
        orderBy: [asc(onboardingTasks.sortOrder)],
      },
    },
    orderBy: [desc(onboardings.createdAt)],
  })

  return result.map(toFrontendOnboarding)
}

export async function getOnboardingById(id: string): Promise<FrontendOnboarding | null> {
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db.query.onboardings.findFirst({
    where: eq(onboardings.id, id),
    with: {
      employee: {
        with: {
          profile: true,
        },
      },
      assignedTo: true,
      tasks: {
        with: {
          assignedTo: true,
        },
        orderBy: [asc(onboardingTasks.sortOrder)],
      },
    },
  })

  if (!result) return null
  return toFrontendOnboarding(result)
}

interface CreateOnboardingInput {
  employeeId: string
  assignedToId: string
  startDate: string
  notes?: string
  tasks?: Array<{
    title: string
    description?: string
    assignedToId?: string
    dueDate?: string
  }>
}

export async function createOnboarding(input: CreateOnboardingInput): Promise<FrontendOnboarding> {
  if (!db) {
    throw new Error('Database not connected')
  }

  // Create onboarding
  const [newOnboarding] = await db
    .insert(onboardings)
    .values({
      employeeId: input.employeeId,
      assignedToId: input.assignedToId,
      startDate: input.startDate,
      status: 'pending',
      notes: input.notes,
    })
    .returning()

  // Create tasks if provided
  if (input.tasks && input.tasks.length > 0) {
    await db.insert(onboardingTasks).values(
      input.tasks.map((task, index) => ({
        onboardingId: newOnboarding.id,
        title: task.title,
        description: task.description,
        assignedToId: task.assignedToId,
        dueDate: task.dueDate,
        sortOrder: index,
        completed: false,
      }))
    )
  }

  revalidatePath('/hr/onboarding')

  // Fetch complete onboarding with relations
  const result = await getOnboardingById(newOnboarding.id)
  if (!result) throw new Error('Failed to create onboarding')
  return result
}

interface UpdateOnboardingInput {
  id: string
  status?: 'pending' | 'in-progress' | 'completed' | 'on-hold'
  completionDate?: string
  notes?: string
}

export async function updateOnboarding(input: UpdateOnboardingInput): Promise<FrontendOnboarding> {
  if (!db) {
    throw new Error('Database not connected')
  }

  await db
    .update(onboardings)
    .set({
      status: input.status,
      completionDate: input.completionDate,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(eq(onboardings.id, input.id))

  revalidatePath('/hr/onboarding')

  const result = await getOnboardingById(input.id)
  if (!result) throw new Error('Onboarding not found')
  return result
}

interface UpdateOnboardingTaskInput {
  id: string
  completed?: boolean
  completedAt?: string
}

export async function updateOnboardingTask(input: UpdateOnboardingTaskInput): Promise<void> {
  if (!db) {
    throw new Error('Database not connected')
  }

  await db
    .update(onboardingTasks)
    .set({
      completed: input.completed,
      completedAt: input.completed ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(onboardingTasks.id, input.id))

  revalidatePath('/hr/onboarding')
}
