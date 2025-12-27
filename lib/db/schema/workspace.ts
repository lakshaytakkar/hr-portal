/**
 * Workspace Schema Definitions
 *
 * Personal workspace tables for employees:
 * - trainings: Training/course progress
 * - personalDocuments: Personal file storage
 * - personalNotes: Personal notes
 * - meetingNotes: Meeting notes
 * - goals: Goal tracking
 * - dailyReports: Daily status reports
 * - knowledgeBaseArticles: Shared knowledge base
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  boolean,
  index,
  jsonb,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { profiles } from './auth'
import { auditFields, softDeleteField } from './base'
import {
  trainingStatusEnum,
  documentTypeEnum,
  noteTypeEnum,
  goalStatusEnum,
  goalPriorityEnum,
  dailyReportStatusEnum,
} from './enums'

// ============================================================================
// TRAININGS TABLE
// ============================================================================

/**
 * Trainings table
 *
 * Tracks employee training and course progress.
 */
export const trainings = pgTable(
  'trainings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    category: text('category'),
    status: trainingStatusEnum('status').default('not-started').notNull(),
    progress: integer('progress').default(0).notNull(), // 0-100
    duration: integer('duration'), // Duration in minutes
    url: text('url'), // External training URL
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...auditFields,
  },
  (table) => [
    index('idx_trainings_user').on(table.userId),
    index('idx_trainings_status').on(table.status),
    index('idx_trainings_category').on(table.category),
    // Check constraint for progress range
    check('chk_trainings_progress', sql`${table.progress} >= 0 AND ${table.progress} <= 100`),
  ]
)

// ============================================================================
// PERSONAL_DOCUMENTS TABLE
// ============================================================================

/**
 * Personal documents table
 *
 * Stores personal files for each employee.
 */
export const personalDocuments = pgTable(
  'personal_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: documentTypeEnum('type').default('other').notNull(),
    size: integer('size'), // Size in bytes
    url: text('url').notNull(),
    mimeType: text('mime_type'),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_personal_documents_user').on(table.userId),
    index('idx_personal_documents_type').on(table.type),
  ]
)

// ============================================================================
// PERSONAL_NOTES TABLE
// ============================================================================

/**
 * Personal notes table
 *
 * Private notes for employees.
 */
export const personalNotes = pgTable(
  'personal_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    type: noteTypeEnum('type').default('personal').notNull(),
    tags: jsonb('tags').$type<string[]>().default([]),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_personal_notes_user').on(table.userId),
    index('idx_personal_notes_type').on(table.type),
  ]
)

// ============================================================================
// MEETING_NOTES TABLE
// ============================================================================

/**
 * Meeting notes table
 *
 * Notes from meetings with attendee tracking.
 */
export const meetingNotes = pgTable(
  'meeting_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    meetingDate: date('meeting_date').notNull(),
    attendees: jsonb('attendees').$type<string[]>().default([]),
    tags: jsonb('tags').$type<string[]>().default([]),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_meeting_notes_user').on(table.userId),
    index('idx_meeting_notes_date').on(table.meetingDate),
  ]
)

// ============================================================================
// GOALS TABLE
// ============================================================================

/**
 * Goals table
 *
 * Personal and professional goal tracking.
 */
export const goals = pgTable(
  'goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    status: goalStatusEnum('status').default('not-started').notNull(),
    priority: goalPriorityEnum('priority').default('medium').notNull(),
    progress: integer('progress').default(0).notNull(), // 0-100
    targetDate: date('target_date'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_goals_user').on(table.userId),
    index('idx_goals_status').on(table.status),
    index('idx_goals_target_date').on(table.targetDate),
    // Check constraint for progress range
    check('chk_goals_progress', sql`${table.progress} >= 0 AND ${table.progress} <= 100`),
  ]
)

// ============================================================================
// DAILY_REPORTS TABLE
// ============================================================================

/**
 * Daily reports table
 *
 * Daily status updates from employees.
 */
export const dailyReports = pgTable(
  'daily_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    tasksCompleted: jsonb('tasks_completed').$type<string[]>().default([]),
    tasksPlanned: jsonb('tasks_planned').$type<string[]>().default([]),
    blockers: jsonb('blockers').$type<string[]>().default([]),
    notes: text('notes'),
    status: dailyReportStatusEnum('status').default('draft').notNull(),
    ...auditFields,
  },
  (table) => [
    index('idx_daily_reports_user').on(table.userId),
    index('idx_daily_reports_date').on(table.date),
    index('idx_daily_reports_status').on(table.status),
    // Composite index for user's reports by date
    index('idx_daily_reports_user_date').on(table.userId, table.date),
  ]
)

// ============================================================================
// KNOWLEDGE_BASE_ARTICLES TABLE
// ============================================================================

/**
 * Knowledge base articles table
 *
 * Shared articles and documentation.
 */
export const knowledgeBaseArticles = pgTable(
  'knowledge_base_articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdById: uuid('created_by_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    category: text('category'),
    tags: jsonb('tags').$type<string[]>().default([]),
    views: integer('views').default(0).notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_kb_articles_created_by').on(table.createdById),
    index('idx_kb_articles_category').on(table.category),
    index('idx_kb_articles_published').on(table.isPublished),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Training = typeof trainings.$inferSelect
export type NewTraining = typeof trainings.$inferInsert
export type PersonalDocument = typeof personalDocuments.$inferSelect
export type NewPersonalDocument = typeof personalDocuments.$inferInsert
export type PersonalNote = typeof personalNotes.$inferSelect
export type NewPersonalNote = typeof personalNotes.$inferInsert
export type MeetingNote = typeof meetingNotes.$inferSelect
export type NewMeetingNote = typeof meetingNotes.$inferInsert
export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
export type DailyReport = typeof dailyReports.$inferSelect
export type NewDailyReport = typeof dailyReports.$inferInsert
export type KnowledgeBaseArticle = typeof knowledgeBaseArticles.$inferSelect
export type NewKnowledgeBaseArticle = typeof knowledgeBaseArticles.$inferInsert
