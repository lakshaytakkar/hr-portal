/**
 * Recruitment Module Schema Definitions
 *
 * Contains:
 * - jobPortals: External job posting platforms
 * - jobRoles: Position definitions
 * - jobPostings: Published job listings
 * - jobPostingPortals: Junction for multi-portal posting
 * - candidates: Applicant profiles
 * - applications: Links candidates to job postings
 * - interviews: Interview scheduling
 * - evaluations: Interview evaluations/feedback
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  time,
  integer,
  real,
  index,
  unique,
} from 'drizzle-orm/pg-core'
import { profiles } from './auth'
import { departments, auditFields, softDeleteField } from './base'
import {
  candidateStatusEnum,
  candidateSourceEnum,
  applicationStatusEnum,
  interviewStatusEnum,
  interviewTypeEnum,
  evaluationRecommendationEnum,
  jobRoleStatusEnum,
  jobPortalStatusEnum,
  jobPostingStatusEnum,
  employmentTypeEnum,
} from './enums'

// ============================================================================
// JOB_PORTALS TABLE
// ============================================================================

/**
 * Job portals table
 *
 * External job posting platforms (LinkedIn, Indeed, etc.)
 * Can store API credentials for integration.
 */
export const jobPortals = pgTable(
  'job_portals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    url: text('url'),
    status: jobPortalStatusEnum('status').default('active').notNull(),
    apiKey: text('api_key'), // Should be encrypted in production
    notes: text('notes'),
    ...auditFields,
  },
  (table) => [
    index('idx_job_portals_status').on(table.status),
    index('idx_job_portals_name').on(table.name),
  ]
)

// ============================================================================
// JOB_ROLES TABLE
// ============================================================================

/**
 * Job roles table
 *
 * Defines positions/roles in the organization.
 * Used as templates for job postings.
 */
export const jobRoles = pgTable(
  'job_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    departmentId: uuid('department_id').references(() => departments.id, {
      onDelete: 'set null',
    }),
    title: text('title').notNull(),
    description: text('description'),
    requirements: text('requirements'),
    status: jobRoleStatusEnum('status').default('active').notNull(),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_job_roles_department').on(table.departmentId),
    index('idx_job_roles_status').on(table.status),
    index('idx_job_roles_title').on(table.title),
  ]
)

// ============================================================================
// JOB_POSTINGS TABLE
// ============================================================================

/**
 * Job postings table
 *
 * Published job listings. Can be linked to a job role
 * or created independently.
 */
export const jobPostings = pgTable(
  'job_postings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    jobRoleId: uuid('job_role_id').references(() => jobRoles.id, {
      onDelete: 'set null',
    }),
    title: text('title').notNull(),
    departmentId: uuid('department_id').references(() => departments.id, {
      onDelete: 'set null',
    }),
    location: text('location'),
    employmentType: employmentTypeEnum('employment_type')
      .default('full-time')
      .notNull(),
    status: jobPostingStatusEnum('status').default('draft').notNull(),
    postedDate: date('posted_date'),
    closingDate: date('closing_date'),
    description: text('description'),
    requirements: text('requirements'),
    responsibilities: text('responsibilities'),
    salaryMin: integer('salary_min'),
    salaryMax: integer('salary_max'),
    postedById: uuid('posted_by_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    views: integer('views').default(0).notNull(),
    applicationsCount: integer('applications_count').default(0).notNull(),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_job_postings_job_role').on(table.jobRoleId),
    index('idx_job_postings_department').on(table.departmentId),
    index('idx_job_postings_status').on(table.status),
    index('idx_job_postings_posted_by').on(table.postedById),
    index('idx_job_postings_dates').on(table.postedDate, table.closingDate),
  ]
)

// ============================================================================
// JOB_POSTING_PORTALS TABLE (Junction)
// ============================================================================

/**
 * Job posting → Portal junction table
 *
 * Tracks which portals a job has been posted to
 * and the external ID on each portal.
 */
export const jobPostingPortals = pgTable(
  'job_posting_portals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    jobPostingId: uuid('job_posting_id')
      .notNull()
      .references(() => jobPostings.id, { onDelete: 'cascade' }),
    jobPortalId: uuid('job_portal_id')
      .notNull()
      .references(() => jobPortals.id, { onDelete: 'cascade' }),
    externalId: text('external_id'), // ID on the external portal
    postedAt: timestamp('posted_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    ...auditFields,
  },
  (table) => [
    unique('uq_job_posting_portals').on(table.jobPostingId, table.jobPortalId),
    index('idx_job_posting_portals_posting').on(table.jobPostingId),
    index('idx_job_posting_portals_portal').on(table.jobPortalId),
  ]
)

// ============================================================================
// CANDIDATES TABLE
// ============================================================================

/**
 * Candidates table
 *
 * Stores applicant information.
 * A candidate can apply to multiple job postings via applications table.
 */
export const candidates = pgTable(
  'candidates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    email: text('email').unique().notNull(),
    phone: text('phone'),
    status: candidateStatusEnum('status').default('new').notNull(),
    source: candidateSourceEnum('source'),
    resume: text('resume'), // URL or file path
    coverLetter: text('cover_letter'),
    linkedIn: text('linkedin'),
    portfolio: text('portfolio'),
    experience: text('experience'),
    education: text('education'),
    skills: text('skills'),
    expectedSalary: integer('expected_salary'),
    notes: text('notes'),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_candidates_email').on(table.email),
    index('idx_candidates_status').on(table.status),
    index('idx_candidates_source').on(table.source),
    index('idx_candidates_name').on(table.fullName),
  ]
)

// ============================================================================
// APPLICATIONS TABLE
// ============================================================================

/**
 * Applications table
 *
 * Junction table linking candidates to job postings.
 * Tracks the application status through the hiring pipeline.
 */
export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    jobPostingId: uuid('job_posting_id')
      .notNull()
      .references(() => jobPostings.id, { onDelete: 'cascade' }),
    status: applicationStatusEnum('status').default('applied').notNull(),
    appliedDate: date('applied_date').notNull(),
    source: text('source'), // How they applied (portal name, direct, etc.)
    assignedToId: uuid('assigned_to_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    notes: text('notes'),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    unique('uq_applications_candidate_posting').on(
      table.candidateId,
      table.jobPostingId
    ),
    index('idx_applications_candidate').on(table.candidateId),
    index('idx_applications_job_posting').on(table.jobPostingId),
    index('idx_applications_status').on(table.status),
    index('idx_applications_assigned_to').on(table.assignedToId),
    index('idx_applications_applied_date').on(table.appliedDate),
    // Composite indexes for common queries
    index('idx_applications_status_date').on(table.status, table.appliedDate),
    index('idx_applications_posting_status').on(table.jobPostingId, table.status),
  ]
)

// ============================================================================
// INTERVIEWS TABLE
// ============================================================================

/**
 * Interviews table
 *
 * Schedules interviews for applications.
 * Multiple interviews can be scheduled for one application
 * (phone screen, technical, on-site, etc.).
 */
export const interviews = pgTable(
  'interviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    interviewerId: uuid('interviewer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    interviewDate: date('interview_date').notNull(),
    interviewTime: time('interview_time').notNull(),
    interviewType: interviewTypeEnum('interview_type')
      .default('video')
      .notNull(),
    status: interviewStatusEnum('status').default('scheduled').notNull(),
    location: text('location'), // Physical address or meeting link
    duration: integer('duration'), // Duration in minutes
    notes: text('notes'),
    feedback: text('feedback'),
    ...auditFields,
  },
  (table) => [
    index('idx_interviews_application').on(table.applicationId),
    index('idx_interviews_interviewer').on(table.interviewerId),
    index('idx_interviews_date').on(table.interviewDate),
    index('idx_interviews_status').on(table.status),
  ]
)

// ============================================================================
// EVALUATIONS TABLE
// ============================================================================

/**
 * Evaluations table
 *
 * Post-interview evaluations with scoring.
 * Each interviewer can submit one evaluation per interview.
 */
export const evaluations = pgTable(
  'evaluations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    interviewId: uuid('interview_id')
      .notNull()
      .references(() => interviews.id, { onDelete: 'cascade' }),
    evaluatedById: uuid('evaluated_by_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    technicalScore: real('technical_score'), // 0-10
    communicationScore: real('communication_score'), // 0-10
    culturalFitScore: real('cultural_fit_score'), // 0-10
    overallScore: real('overall_score'), // 0-10
    strengths: text('strengths'),
    weaknesses: text('weaknesses'),
    feedback: text('feedback').notNull(),
    recommendation: evaluationRecommendationEnum('recommendation').notNull(),
    evaluatedAt: timestamp('evaluated_at', { withTimezone: true }).notNull(),
    ...auditFields,
  },
  (table) => [
    index('idx_evaluations_interview').on(table.interviewId),
    index('idx_evaluations_evaluated_by').on(table.evaluatedById),
    index('idx_evaluations_recommendation').on(table.recommendation),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type JobPortal = typeof jobPortals.$inferSelect
export type NewJobPortal = typeof jobPortals.$inferInsert
export type JobRole = typeof jobRoles.$inferSelect
export type NewJobRole = typeof jobRoles.$inferInsert
export type JobPosting = typeof jobPostings.$inferSelect
export type NewJobPosting = typeof jobPostings.$inferInsert
export type JobPostingPortal = typeof jobPostingPortals.$inferSelect
export type NewJobPostingPortal = typeof jobPostingPortals.$inferInsert
export type Candidate = typeof candidates.$inferSelect
export type NewCandidate = typeof candidates.$inferInsert
export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
export type Interview = typeof interviews.$inferSelect
export type NewInterview = typeof interviews.$inferInsert
export type Evaluation = typeof evaluations.$inferSelect
export type NewEvaluation = typeof evaluations.$inferInsert
