export type EmployeeStatus = "active" | "on-leave" | "terminated" | "resigned"
export type OnboardingStatus = "pending" | "in-progress" | "completed" | "on-hold"

export interface HRUser {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface Employee {
  id: string
  employeeId: string
  fullName: string
  email: string
  phone?: string
  department: string
  position: string
  status: EmployeeStatus
  hireDate: string
  manager?: HRUser
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface OnboardingTask {
  id: string
  title: string
  description?: string
  assignedTo?: HRUser
  dueDate?: string
  completed: boolean
  completedAt?: string
}

export interface Onboarding {
  id: string
  employeeId: string
  employeeName: string
  status: OnboardingStatus
  startDate: string
  completionDate?: string
  tasks: OnboardingTask[]
  assignedTo: HRUser
  notes?: string
  createdAt: string
  updatedAt: string
}

