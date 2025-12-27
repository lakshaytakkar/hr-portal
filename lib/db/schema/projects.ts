/**
 * Projects & Tasks Schema Definitions
 *
 * Contains:
 * - projects: Project management
 * - projectMembers: Team assignments (junction)
 * - tasks: Hierarchical task management (3-level depth)
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  index,
  unique,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { profiles } from './auth'
import { auditFields, softDeleteField } from './base'
import {
  projectStatusEnum,
  projectPriorityEnum,
  projectMemberRoleEnum,
  taskStatusEnum,
  taskPriorityEnum,
} from './enums'

// ============================================================================
// PROJECTS TABLE
// ============================================================================

/**
 * Projects table
 *
 * Main project management table.
 * Each project has an owner and can have multiple team members.
 */
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    status: projectStatusEnum('status').default('planning').notNull(),
    priority: projectPriorityEnum('priority').default('medium').notNull(),
    progress: integer('progress').default(0).notNull(), // 0-100
    startDate: date('start_date'),
    endDate: date('end_date'),
    dueDate: date('due_date'),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_projects_status').on(table.status),
    index('idx_projects_owner').on(table.ownerId),
    index('idx_projects_due_date').on(table.dueDate),
    index('idx_projects_priority').on(table.priority),
    // Check constraint for progress range
    check('chk_projects_progress', sql`${table.progress} >= 0 AND ${table.progress} <= 100`),
  ]
)

// ============================================================================
// PROJECT_MEMBERS TABLE (Junction)
// ============================================================================

/**
 * Project members junction table
 *
 * Associates users with projects and their role within the project.
 */
export const projectMembers = pgTable(
  'project_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    role: projectMemberRoleEnum('role').default('member').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...auditFields,
  },
  (table) => [
    unique('uq_project_members').on(table.projectId, table.userId),
    index('idx_project_members_project').on(table.projectId),
    index('idx_project_members_user').on(table.userId),
  ]
)

// ============================================================================
// TASKS TABLE
// ============================================================================

/**
 * Tasks table
 *
 * Hierarchical task management with 3 levels:
 * - Level 0: Top-level tasks (parent_id is null)
 * - Level 1: Subtasks (parent is level 0)
 * - Level 2: Sub-subtasks (parent is level 1)
 *
 * Tasks can be associated with a project or standalone.
 */
export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'set null',
    }),
    parentId: uuid('parent_id'), // Self-referential for subtasks
    name: text('name').notNull(),
    description: text('description'),
    status: taskStatusEnum('status').default('not-started').notNull(),
    priority: taskPriorityEnum('priority').default('medium').notNull(),
    level: integer('level').default(0).notNull(), // 0, 1, or 2
    progress: integer('progress').default(0).notNull(), // 0-100
    assignedToId: uuid('assigned_to_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    dueDate: date('due_date'),
    figmaLink: text('figma_link'),
    commentsCount: integer('comments_count').default(0).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_tasks_project').on(table.projectId),
    index('idx_tasks_parent').on(table.parentId),
    index('idx_tasks_status').on(table.status),
    index('idx_tasks_assigned_to').on(table.assignedToId),
    index('idx_tasks_due_date').on(table.dueDate),
    index('idx_tasks_priority').on(table.priority),
    index('idx_tasks_level').on(table.level),
    // Composite indexes for common queries
    index('idx_tasks_status_due_date').on(table.status, table.dueDate),
    index('idx_tasks_project_status').on(table.projectId, table.status),
    index('idx_tasks_assigned_status').on(table.assignedToId, table.status),
    // Check constraints
    check('chk_tasks_progress', sql`${table.progress} >= 0 AND ${table.progress} <= 100`),
    check('chk_tasks_level', sql`${table.level} >= 0 AND ${table.level} <= 2`),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectMember = typeof projectMembers.$inferSelect
export type NewProjectMember = typeof projectMembers.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
