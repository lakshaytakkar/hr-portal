/**
 * HR Module Adapters
 * Convert between database types and frontend HR types
 */

import type {
  Employee as DbEmployee,
  Profile,
  Department,
  Onboarding as DbOnboarding,
  OnboardingTask as DbOnboardingTask,
} from '../schema'
import type {
  Employee as FrontendEmployee,
  Onboarding as FrontendOnboarding,
  OnboardingTask as FrontendOnboardingTask,
  HRUser,
} from '@/lib/types/hr'
import { getAvatarForUser } from '@/lib/utils/avatars'

/**
 * Convert a Profile to an HRUser
 */
export function toHRUser(profile: Profile | null | undefined): HRUser | undefined {
  if (!profile) return undefined
  return {
    id: profile.id,
    name: profile.fullName ?? 'Unknown',
    email: profile.email,
    avatar: profile.avatarUrl ?? getAvatarForUser(profile.fullName ?? 'U'),
  }
}

interface EmployeeWithRelations extends DbEmployee {
  profile: Profile
  profile_department?: Department | null
  profile_manager?: Profile | null
}

/**
 * Convert a database Employee (with profile) to frontend Employee
 */
export function toFrontendEmployee(
  employee: EmployeeWithRelations
): FrontendEmployee {
  const profile = employee.profile

  return {
    id: employee.id,
    employeeId: employee.employeeId,
    fullName: profile.fullName ?? '',
    email: profile.email,
    phone: profile.phone ?? undefined,
    department: employee.profile_department?.name ?? 'Unknown',
    position: profile.position ?? '',
    status: employee.status,
    hireDate: employee.hireDate,
    manager: employee.profile_manager
      ? toHRUser(employee.profile_manager)
      : undefined,
    avatar: profile.avatarUrl ?? getAvatarForUser(profile.fullName ?? 'U'),
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  }
}

interface OnboardingTaskWithRelations extends DbOnboardingTask {
  assignedTo?: Profile | null
}

/**
 * Convert a database OnboardingTask to frontend OnboardingTask
 */
export function toFrontendOnboardingTask(
  task: OnboardingTaskWithRelations
): FrontendOnboardingTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    assignedTo: toHRUser(task.assignedTo),
    dueDate: task.dueDate ?? undefined,
    completed: task.completed,
    completedAt: task.completedAt?.toISOString(),
  }
}

interface OnboardingWithRelations extends DbOnboarding {
  employee: DbEmployee & { profile: Profile }
  assignedTo: Profile
  tasks: OnboardingTaskWithRelations[]
}

/**
 * Convert a database Onboarding to frontend Onboarding
 */
export function toFrontendOnboarding(
  onboarding: OnboardingWithRelations
): FrontendOnboarding {
  return {
    id: onboarding.id,
    employeeId: onboarding.employee.id,
    employeeName: onboarding.employee.profile.fullName ?? '',
    status: onboarding.status,
    startDate: onboarding.startDate,
    completionDate: onboarding.completionDate ?? undefined,
    tasks: onboarding.tasks.map(toFrontendOnboardingTask),
    assignedTo: toHRUser(onboarding.assignedTo)!,
    notes: onboarding.notes ?? undefined,
    createdAt: onboarding.createdAt.toISOString(),
    updatedAt: onboarding.updatedAt.toISOString(),
  }
}
