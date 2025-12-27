/**
 * Contacts Schema Definitions
 *
 * Contains:
 * - contacts: Global contact entity used across modules
 * - addresses: Polymorphic address storage
 * - phoneNumbers: Polymorphic phone number storage
 */

import {
  pgTable,
  uuid,
  text,
  boolean,
  index,
} from 'drizzle-orm/pg-core'
import { auditFields, softDeleteField } from './base'

// ============================================================================
// CONTACTS TABLE
// ============================================================================

/**
 * Global contacts table
 *
 * Used across domains (sales, calls, recruitment referrals, etc.)
 * Provides a centralized contact management system.
 */
export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    position: text('position'),
    website: text('website'),
    linkedIn: text('linkedin'),
    notes: text('notes'),
    isActive: boolean('is_active').default(true).notNull(),
    ...auditFields,
    ...softDeleteField,
  },
  (table) => [
    index('idx_contacts_email').on(table.email),
    index('idx_contacts_company').on(table.company),
    index('idx_contacts_name').on(table.fullName),
    index('idx_contacts_active').on(table.isActive),
  ]
)

// ============================================================================
// ADDRESSES TABLE
// ============================================================================

/**
 * Polymorphic addresses table
 *
 * Stores addresses for any entity type (contact, employee, organization).
 * Uses entityType and entityId for polymorphic association.
 */
export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Polymorphic references
    entityType: text('entity_type').notNull(), // 'contact', 'employee', 'organization'
    entityId: uuid('entity_id').notNull(),
    type: text('type').default('primary').notNull(), // 'primary', 'billing', 'shipping'
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city'),
    state: text('state'),
    postalCode: text('postal_code'),
    country: text('country'),
    isPrimary: boolean('is_primary').default(false).notNull(),
    ...auditFields,
  },
  (table) => [
    index('idx_addresses_entity').on(table.entityType, table.entityId),
    index('idx_addresses_primary').on(table.isPrimary),
  ]
)

// ============================================================================
// PHONE_NUMBERS TABLE
// ============================================================================

/**
 * Polymorphic phone numbers table
 *
 * Stores multiple phone numbers for any entity.
 * Supports different types (mobile, work, home).
 */
export const phoneNumbers = pgTable(
  'phone_numbers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Polymorphic references
    entityType: text('entity_type').notNull(), // 'contact', 'employee'
    entityId: uuid('entity_id').notNull(),
    type: text('type').default('mobile').notNull(), // 'mobile', 'work', 'home', 'fax'
    number: text('number').notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    ...auditFields,
  },
  (table) => [
    index('idx_phone_numbers_entity').on(table.entityType, table.entityId),
    index('idx_phone_numbers_primary').on(table.isPrimary),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
export type PhoneNumber = typeof phoneNumbers.$inferSelect
export type NewPhoneNumber = typeof phoneNumbers.$inferInsert
