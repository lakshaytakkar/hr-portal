/**
 * PostgreSQL Enum Definitions
 *
 * All enums are defined here for consistency across the schema.
 * Enums provide type safety and database-level validation.
 */

import { pgEnum } from 'drizzle-orm/pg-core'

// ============================================================================
// CORE / AUTH ENUMS
// ============================================================================

/**
 * User roles for RBAC
 * - executive: Individual contributor, can only view/edit own data
 * - manager: Can manage team, approve requests, view team data
 * - superadmin: Full system access
 */
export const userRoleEnum = pgEnum('user_role', [
  'executive',
  'manager',
  'superadmin',
])

// ============================================================================
// HR MODULE ENUMS
// ============================================================================

/**
 * Employee employment status
 */
export const employeeStatusEnum = pgEnum('employee_status', [
  'active',
  'on-leave',
  'terminated',
  'resigned',
])

/**
 * Onboarding process status
 */
export const onboardingStatusEnum = pgEnum('onboarding_status', [
  'pending',
  'in-progress',
  'completed',
  'on-hold',
])

/**
 * Daily attendance status
 */
export const attendanceStatusEnum = pgEnum('attendance_status', [
  'present',
  'absent',
  'late',
  'half-day',
  'leave',
])

/**
 * Attendance correction request status
 */
export const correctionStatusEnum = pgEnum('correction_status', [
  'pending',
  'approved',
  'rejected',
])

/**
 * Types of leave requests
 */
export const leaveTypeEnum = pgEnum('leave_type', [
  'vacation',
  'sick',
  'personal',
  'other',
])

/**
 * Leave request approval status
 */
export const leaveRequestStatusEnum = pgEnum('leave_request_status', [
  'pending',
  'approved',
  'rejected',
  'cancelled',
])

// ============================================================================
// RECRUITMENT MODULE ENUMS
// ============================================================================

/**
 * Candidate pipeline status
 */
export const candidateStatusEnum = pgEnum('candidate_status', [
  'new',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
])

/**
 * How the candidate found us
 */
export const candidateSourceEnum = pgEnum('candidate_source', [
  'linkedin',
  'referral',
  'job-board',
  'website',
  'other',
])

/**
 * Application status in hiring pipeline
 */
export const applicationStatusEnum = pgEnum('application_status', [
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
])

/**
 * Interview scheduling status
 */
export const interviewStatusEnum = pgEnum('interview_status', [
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled',
])

/**
 * Type of interview
 */
export const interviewTypeEnum = pgEnum('interview_type', [
  'phone',
  'video',
  'in-person',
])

/**
 * Evaluator's hiring recommendation
 */
export const evaluationRecommendationEnum = pgEnum('evaluation_recommendation', [
  'hire',
  'maybe',
  'no-hire',
])

/**
 * Job role definition status
 */
export const jobRoleStatusEnum = pgEnum('job_role_status', [
  'active',
  'inactive',
  'filled',
])

/**
 * External job portal status
 */
export const jobPortalStatusEnum = pgEnum('job_portal_status', [
  'active',
  'inactive',
])

/**
 * Job posting publication status
 */
export const jobPostingStatusEnum = pgEnum('job_posting_status', [
  'draft',
  'published',
  'closed',
])

/**
 * Employment type for job postings
 */
export const employmentTypeEnum = pgEnum('employment_type', [
  'full-time',
  'part-time',
  'contract',
  'internship',
])

// ============================================================================
// PROJECT / TASK ENUMS
// ============================================================================

/**
 * Project lifecycle status
 */
export const projectStatusEnum = pgEnum('project_status', [
  'planning',
  'active',
  'on-hold',
  'completed',
  'cancelled',
])

/**
 * Project priority level
 */
export const projectPriorityEnum = pgEnum('project_priority', [
  'low',
  'medium',
  'high',
  'urgent',
])

/**
 * Role of a member in a project
 */
export const projectMemberRoleEnum = pgEnum('project_member_role', [
  'owner',
  'member',
  'viewer',
])

/**
 * Task workflow status
 */
export const taskStatusEnum = pgEnum('task_status', [
  'not-started',
  'in-progress',
  'in-review',
  'completed',
  'blocked',
])

/**
 * Task priority level
 */
export const taskPriorityEnum = pgEnum('task_priority', [
  'low',
  'medium',
  'high',
  'urgent',
])

// ============================================================================
// CALL / COMMUNICATION ENUMS
// ============================================================================

/**
 * Outcome of a call
 */
export const callOutcomeEnum = pgEnum('call_outcome', [
  'connected',
  'voicemail',
  'no-answer',
  'busy',
  'callback-requested',
  'not-interested',
  'interested',
  'meeting-scheduled',
])

/**
 * Call scheduling status
 */
export const callStatusEnum = pgEnum('call_status', [
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled',
])

// ============================================================================
// WORKSPACE / PERSONAL ENUMS
// ============================================================================

/**
 * Training completion status
 */
export const trainingStatusEnum = pgEnum('training_status', [
  'not-started',
  'in-progress',
  'completed',
])

/**
 * Document type classification
 */
export const documentTypeEnum = pgEnum('document_type', [
  'pdf',
  'doc',
  'image',
  'video',
  'other',
])

/**
 * Personal note type
 */
export const noteTypeEnum = pgEnum('note_type', [
  'personal',
  'meeting',
  'project',
  'other',
])

/**
 * Goal tracking status
 */
export const goalStatusEnum = pgEnum('goal_status', [
  'not-started',
  'in-progress',
  'completed',
  'on-hold',
  'cancelled',
])

/**
 * Goal priority level
 */
export const goalPriorityEnum = pgEnum('goal_priority', [
  'low',
  'medium',
  'high',
])

/**
 * Daily report submission status
 */
export const dailyReportStatusEnum = pgEnum('daily_report_status', [
  'draft',
  'submitted',
])
