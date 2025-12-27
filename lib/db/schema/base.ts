/**
 * Base Schema Definitions
 *
 * Contains:
 * - Audit field helpers (created_at, updated_at, etc.)
 * - Departments table (foundational, no FKs initially)
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core'

// ============================================================================
// AUDIT FIELD HELPERS
// ============================================================================

/**
 * Standard audit fields to spread into all tables
 * Provides created_at, updated_at, created_by, updated_by
 */
export const auditFields = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
}

/**
 * Soft delete field for tables that support it
 * Records are not deleted, just marked with a timestamp
 */
export const softDeleteField = {
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}

// ============================================================================
// DEPARTMENTS TABLE
// ============================================================================

/**
 * Departments table
 *
 * Formalizes department structure that was previously hardcoded.
 * Supports hierarchy through parent_id self-reference.
 *
 * Note: manager_id FK to profiles is added via ALTER after profiles table exists
 */
export const departments = pgTable(
  'departments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    code: text('code'), // Short code like "ENG", "HR", "MKT"
    description: text('description'),
    parentId: uuid('parent_id'), // Self-referential for hierarchy
    managerId: uuid('manager_id'), // FK to profiles (added later)
    isActive: boolean('is_active').default(true).notNull(),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_departments_parent').on(table.parentId),
    index('idx_departments_name').on(table.name),
    index('idx_departments_active').on(table.isActive),
    index('idx_departments_manager').on(table.managerId),
  ]
)

// ============================================================================
// OFFICE UNITS TABLE
// ============================================================================

/**
 * Office Units table
 *
 * Tracks physical office locations for the organization.
 * Employees can be assigned to an office unit.
 */
export const officeUnits = pgTable(
  'office_units',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(), // "Gurugram Office"
    code: text('code').notNull().unique(), // "GGN", "RWR"
    address: text('address'),
    city: text('city'),
    state: text('state'),
    country: text('country').default('India'),
    phone: text('phone'),
    isActive: boolean('is_active').default(true).notNull(),
    ...auditFields,
  },
  (table) => [
    index('idx_office_units_code').on(table.code),
    index('idx_office_units_city').on(table.city),
    index('idx_office_units_active').on(table.isActive),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Department = typeof departments.$inferSelect
export type NewDepartment = typeof departments.$inferInsert

export type OfficeUnit = typeof officeUnits.$inferSelect
export type NewOfficeUnit = typeof officeUnits.$inferInsert
