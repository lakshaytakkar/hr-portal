/**
 * HR Module Seed Data - StartupSquad Employees
 * - Employees
 * - Employee Departments (junction table for multi-dept assignments)
 * - Onboardings
 * - Onboarding Tasks
 */

import type { Database } from '../index'
import {
  employees,
  employeeDepartments,
  onboardings,
  onboardingTasks,
  type Employee,
  type Onboarding,
  type Profile,
  type Department,
} from '../schema'
import { profileIds, getMultiDepartmentProfiles } from './profiles'
import { findDepartmentByName } from './departments'

export interface HRSeedResult {
  employees: Employee[]
  onboardings: Onboarding[]
}

// Employee records for all 22 StartupSquad team members
const employeeSeedData = [
  // ========== GURUGRAM OFFICE ==========
  {
    profileId: profileIds.akansha_pandey,
    employeeId: 'EMP001',
    status: 'active' as const,
    hireDate: '2023-01-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.neetu_kumari,
    employeeId: 'EMP002',
    status: 'active' as const,
    hireDate: '2023-03-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.babita_mehta,
    employeeId: 'EMP003',
    status: 'active' as const,
    hireDate: '2024-06-01',
    employmentType: 'internship' as const,
  },
  {
    profileId: profileIds.naveen_rawat,
    employeeId: 'EMP004',
    status: 'active' as const,
    hireDate: '2023-05-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.aditya,
    employeeId: 'EMP005',
    status: 'active' as const,
    hireDate: '2023-07-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.rudraksh,
    employeeId: 'EMP006',
    status: 'active' as const,
    hireDate: '2023-08-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.love,
    employeeId: 'EMP007',
    status: 'active' as const,
    hireDate: '2024-07-01',
    employmentType: 'internship' as const,
  },
  {
    profileId: profileIds.prachi_bisht,
    employeeId: 'EMP008',
    status: 'active' as const,
    hireDate: '2023-04-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.himanshu_pandey,
    employeeId: 'EMP009',
    status: 'active' as const,
    hireDate: '2023-06-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.abhinandan,
    employeeId: 'EMP010',
    status: 'active' as const,
    hireDate: '2023-09-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.simran,
    employeeId: 'EMP011',
    status: 'active' as const,
    hireDate: '2023-10-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.sumit,
    employeeId: 'EMP012',
    status: 'active' as const,
    hireDate: '2023-11-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.punit,
    employeeId: 'EMP013',
    status: 'active' as const,
    hireDate: '2023-12-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.aayan_khastagir,
    employeeId: 'EMP014',
    status: 'active' as const,
    hireDate: '2024-08-01',
    employmentType: 'internship' as const,
  },

  // ========== REWARI OFFICE ==========
  {
    profileId: profileIds.nitin_kumari,
    employeeId: 'EMP015',
    status: 'active' as const,
    hireDate: '2023-02-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.krish_verma,
    employeeId: 'EMP016',
    status: 'active' as const,
    hireDate: '2023-04-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.yash_jain,
    employeeId: 'EMP017',
    status: 'active' as const,
    hireDate: '2022-06-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.vikash_yadav,
    employeeId: 'EMP018',
    status: 'active' as const,
    hireDate: '2022-08-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.payal_rani,
    employeeId: 'EMP019',
    status: 'active' as const,
    hireDate: '2023-05-01',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.parthiv_kataria,
    employeeId: 'EMP020',
    status: 'active' as const,
    hireDate: '2023-07-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.sahil_solanki,
    employeeId: 'EMP021',
    status: 'active' as const,
    hireDate: '2023-09-15',
    employmentType: 'full-time' as const,
  },
  {
    profileId: profileIds.yash,
    employeeId: 'EMP022',
    status: 'active' as const,
    hireDate: '2024-01-15',
    employmentType: 'full-time' as const,
  },
]

const onboardingTaskTemplates = [
  {
    title: 'Complete employment forms',
    description: 'Fill out tax forms and employment documents',
    sortOrder: 1,
  },
  {
    title: 'Set up IT access',
    description: 'Email, Slack, and system accounts',
    sortOrder: 2,
  },
  {
    title: 'Equipment setup',
    description: 'Laptop, monitor, and accessories',
    sortOrder: 3,
  },
  {
    title: 'Orientation meeting',
    description: 'Meet with HR and team',
    sortOrder: 4,
  },
  {
    title: 'Complete security training',
    description: 'Mandatory security awareness training',
    sortOrder: 5,
  },
  {
    title: 'Review company policies',
    description: 'Read and acknowledge employee handbook',
    sortOrder: 6,
  },
]

export async function seedHR(
  db: Database,
  profiles: Profile[],
  departments: Department[]
): Promise<HRSeedResult> {
  // Seed employees
  const employeeResult = await db
    .insert(employees)
    .values(employeeSeedData)
    .returning()

  // Create employee-department junction entries for multi-department employees
  const multiDeptProfiles = getMultiDepartmentProfiles()

  for (const { profileId, secondaryDepartmentName } of multiDeptProfiles) {
    const employee = employeeResult.find((e) => e.profileId === profileId)
    const secondaryDept = findDepartmentByName(departments, secondaryDepartmentName)

    if (employee && secondaryDept) {
      // Find primary department from profile
      const profile = profiles.find((p) => p.id === profileId)
      const primaryDept = profile?.departmentId
        ? departments.find((d) => d.id === profile.departmentId)
        : null

      // Insert primary department assignment
      if (primaryDept) {
        await db.insert(employeeDepartments).values({
          employeeId: employee.id,
          departmentId: primaryDept.id,
          isPrimary: true,
          startDate: employee.hireDate,
        })
      }

      // Insert secondary department assignment
      await db.insert(employeeDepartments).values({
        employeeId: employee.id,
        departmentId: secondaryDept.id,
        isPrimary: false,
        startDate: employee.hireDate,
      })
    }
  }

  // Create onboarding for the newest intern (Aayan Khastagir - EMP014)
  const newEmployee = employeeResult.find((e) => e.employeeId === 'EMP014')
  // Prachi Bisht is the HR Executive
  const hrExecutive = profiles.find((p) => p.id === profileIds.prachi_bisht)

  if (!newEmployee || !hrExecutive) {
    return { employees: employeeResult, onboardings: [] }
  }

  const onboardingResult = await db
    .insert(onboardings)
    .values({
      employeeId: newEmployee.id,
      status: 'in-progress' as const,
      startDate: '2024-08-01',
      assignedToId: hrExecutive.id,
      notes: 'New intern onboarding for Aayan Khastagir - Sales Department',
    })
    .returning()

  // Seed onboarding tasks
  if (onboardingResult.length > 0) {
    const onboarding = onboardingResult[0]
    const taskValues = onboardingTaskTemplates.map((task, index) => ({
      onboardingId: onboarding.id,
      title: task.title,
      description: task.description,
      sortOrder: task.sortOrder,
      assignedToId: hrExecutive.id,
      completed: index < 3, // First 3 tasks completed
      completedAt: index < 3 ? new Date() : null,
    }))

    await db.insert(onboardingTasks).values(taskValues)
  }

  return {
    employees: employeeResult,
    onboardings: onboardingResult,
  }
}
