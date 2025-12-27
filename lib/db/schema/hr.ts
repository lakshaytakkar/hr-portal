/**
 * HR Module Schema Definitions
 *
 * Contains:
 * - employees: Employee records extending profiles
 * - employeeDepartments: Multi-department assignments
 * - onboardings: New hire onboarding process
 * - onboardingTasks: Individual onboarding tasks
 * - attendance: Daily attendance records
 * - attendanceCorrections: Correction requests
 * - leaveRequests: Leave/vacation requests
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  date,
  integer,
  index,
  unique,
} from 'drizzle-orm/pg-core'
import { profiles } from './auth'
import { departments, auditFields, softDeleteField } from './base'
import {
  employeeStatusEnum,
  employmentTypeEnum,
  onboardingStatusEnum,
  attendanceStatusEnum,
  correctionStatusEnum,
  leaveTypeEnum,
  leaveRequestStatusEnum,
} from './enums'

// ============================================================================
// EMPLOYEES TABLE
// ============================================================================

/**
 * Employees table
 *
 * Extends profiles with HR-specific data.
 * One-to-one relationship with profiles via profileId.
 */
export const employees = pgTable(
  'employees',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id')
      .unique()
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    employeeId: text('employee_id').unique().notNull(), // e.g., "EMP001"
    status: employeeStatusEnum('status').default('active').notNull(),
    hireDate: date('hire_date').notNull(),
    terminationDate: date('termination_date'),
    employmentType: employmentTypeEnum('employment_type').default('full-time'),
    salary: integer('salary'),
    bankAccount: text('bank_account'),
    emergencyContact: text('emergency_contact'),
    emergencyPhone: text('emergency_phone'),
    address: text('address'),
    notes: text('notes'),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_employees_profile').on(table.profileId),
    index('idx_employees_employee_id').on(table.employeeId),
    index('idx_employees_status').on(table.status),
    index('idx_employees_hire_date').on(table.hireDate),
  ]
)

// ============================================================================
// EMPLOYEE_DEPARTMENTS TABLE (Junction)
// ============================================================================

/**
 * Employee → Departments junction table
 *
 * Allows employees to belong to multiple departments.
 * isPrimary indicates the main department.
 */
export const employeeDepartments = pgTable(
  'employee_departments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id')
      .notNull()
      .references(() => employees.id, { onDelete: 'cascade' }),
    departmentId: uuid('department_id')
      .notNull()
      .references(() => departments.id, { onDelete: 'cascade' }),
    isPrimary: boolean('is_primary').default(false).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    ...auditFields,
  },
  (table) => [
    index('idx_employee_departments_employee').on(table.employeeId),
    index('idx_employee_departments_department').on(table.departmentId),
    unique('uq_employee_departments').on(table.employeeId, table.departmentId),
  ]
)

// ============================================================================
// ONBOARDINGS TABLE
// ============================================================================

/**
 * Onboarding processes table
 *
 * Tracks the onboarding process for new employees.
 * Each employee can have one active onboarding.
 */
export const onboardings = pgTable(
  'onboardings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id')
      .notNull()
      .references(() => employees.id, { onDelete: 'cascade' }),
    status: onboardingStatusEnum('status').default('pending').notNull(),
    startDate: date('start_date').notNull(),
    completionDate: date('completion_date'),
    assignedToId: uuid('assigned_to_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'set null' }),
    notes: text('notes'),
    ...auditFields,
  },
  (table) => [
    index('idx_onboardings_employee').on(table.employeeId),
    index('idx_onboardings_status').on(table.status),
    index('idx_onboardings_assigned_to').on(table.assignedToId),
  ]
)

// ============================================================================
// ONBOARDING_TASKS TABLE
// ============================================================================

/**
 * Onboarding tasks table
 *
 * Individual tasks within an onboarding process.
 * Tasks can be assigned to different HR members.
 */
export const onboardingTasks = pgTable(
  'onboarding_tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    onboardingId: uuid('onboarding_id')
      .notNull()
      .references(() => onboardings.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    assignedToId: uuid('assigned_to_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    dueDate: date('due_date'),
    completed: boolean('completed').default(false).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    sortOrder: integer('sort_order').default(0).notNull(),
    ...auditFields,
  },
  (table) => [
    index('idx_onboarding_tasks_onboarding').on(table.onboardingId),
    index('idx_onboarding_tasks_assigned_to').on(table.assignedToId),
    index('idx_onboarding_tasks_completed').on(table.completed),
  ]
)

// ============================================================================
// ATTENDANCE TABLE
// ============================================================================

/**
 * Attendance records table
 *
 * Daily attendance tracking for employees.
 * One record per user per day (enforced by unique constraint).
 */
export const attendance = pgTable(
  'attendance',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    checkInTime: timestamp('check_in_time', { withTimezone: true }),
    checkOutTime: timestamp('check_out_time', { withTimezone: true }),
    status: attendanceStatusEnum('status').default('present').notNull(),
    notes: text('notes'),
    ...auditFields,
  },
  (table) => [
    unique('uq_attendance_user_date').on(table.userId, table.date),
    index('idx_attendance_user').on(table.userId),
    index('idx_attendance_date').on(table.date),
    index('idx_attendance_status').on(table.status),
  ]
)

// ============================================================================
// ATTENDANCE_CORRECTIONS TABLE
// ============================================================================

/**
 * Attendance correction requests table
 *
 * Employees can request corrections to their attendance records.
 * Managers approve or reject the requests.
 */
export const attendanceCorrections = pgTable(
  'attendance_corrections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    attendanceId: uuid('attendance_id')
      .notNull()
      .references(() => attendance.id, { onDelete: 'cascade' }),
    requestedById: uuid('requested_by_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    requestedDate: date('requested_date').notNull(),
    requestedCheckIn: timestamp('requested_check_in', { withTimezone: true }),
    requestedCheckOut: timestamp('requested_check_out', { withTimezone: true }),
    reason: text('reason').notNull(),
    status: correctionStatusEnum('status').default('pending').notNull(),
    reviewedById: uuid('reviewed_by_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    reviewNotes: text('review_notes'),
    ...auditFields,
  },
  (table) => [
    index('idx_attendance_corrections_attendance').on(table.attendanceId),
    index('idx_attendance_corrections_requested_by').on(table.requestedById),
    index('idx_attendance_corrections_status').on(table.status),
    index('idx_attendance_corrections_reviewed_by').on(table.reviewedById),
  ]
)

// ============================================================================
// LEAVE_REQUESTS TABLE
// ============================================================================

/**
 * Leave requests table
 *
 * Employees submit leave requests (vacation, sick, etc.).
 * Managers approve or reject the requests.
 */
export const leaveRequests = pgTable(
  'leave_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    type: leaveTypeEnum('type').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    days: integer('days').notNull(),
    status: leaveRequestStatusEnum('status').default('pending').notNull(),
    reason: text('reason'),
    approvedById: uuid('approved_by_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    approvalNotes: text('approval_notes'),
    ...auditFields,
  },
  (table) => [
    index('idx_leave_requests_user').on(table.userId),
    index('idx_leave_requests_status').on(table.status),
    index('idx_leave_requests_dates').on(table.startDate, table.endDate),
    index('idx_leave_requests_approved_by').on(table.approvedById),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert
export type EmployeeDepartment = typeof employeeDepartments.$inferSelect
export type NewEmployeeDepartment = typeof employeeDepartments.$inferInsert
export type Onboarding = typeof onboardings.$inferSelect
export type NewOnboarding = typeof onboardings.$inferInsert
export type OnboardingTask = typeof onboardingTasks.$inferSelect
export type NewOnboardingTask = typeof onboardingTasks.$inferInsert
export type Attendance = typeof attendance.$inferSelect
export type NewAttendance = typeof attendance.$inferInsert
export type AttendanceCorrection = typeof attendanceCorrections.$inferSelect
export type NewAttendanceCorrection = typeof attendanceCorrections.$inferInsert
export type LeaveRequest = typeof leaveRequests.$inferSelect
export type NewLeaveRequest = typeof leaveRequests.$inferInsert
