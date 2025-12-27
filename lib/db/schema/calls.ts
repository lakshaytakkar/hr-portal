/**
 * Calls Schema Definition
 *
 * Contains:
 * - calls: Call tracking and scheduling
 */

import {
  pgTable,
  uuid,
  text,
  date,
  time,
  integer,
  index,
} from 'drizzle-orm/pg-core'
import { profiles } from './auth'
import { contacts } from './contacts'
import { auditFields, softDeleteField } from './base'
import { callOutcomeEnum, callStatusEnum } from './enums'

// ============================================================================
// CALLS TABLE
// ============================================================================

/**
 * Calls table
 *
 * Tracks scheduled and completed calls.
 * Can optionally reference a contact record or store inline contact info.
 */
export const calls = pgTable(
  'calls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    date: date('date').notNull(),
    time: time('time').notNull(),
    // Optional reference to contacts table
    contactId: uuid('contact_id').references(() => contacts.id, {
      onDelete: 'set null',
    }),
    // Inline contact info (used if no contactId or for display)
    contactName: text('contact_name').notNull(),
    company: text('company'),
    phone: text('phone'),
    email: text('email'),
    // Call details
    outcome: callOutcomeEnum('outcome'),
    notes: text('notes'),
    nextAction: text('next_action'),
    nextActionDate: date('next_action_date'),
    // Assignment
    assignedToId: uuid('assigned_to_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    status: callStatusEnum('status').default('scheduled').notNull(),
    // Duration in minutes (for completed calls)
    duration: integer('duration'),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_calls_date').on(table.date),
    index('idx_calls_assigned_to').on(table.assignedToId),
    index('idx_calls_status').on(table.status),
    index('idx_calls_outcome').on(table.outcome),
    index('idx_calls_contact').on(table.contactId),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Call = typeof calls.$inferSelect
export type NewCall = typeof calls.$inferInsert
