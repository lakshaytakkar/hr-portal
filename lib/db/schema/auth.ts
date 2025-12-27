/**
 * Auth & User Schema Definitions
 *
 * Contains:
 * - profiles: User profiles (extends Supabase auth.users)
 * - roles: Custom role definitions (for future permission matrix)
 * - permissions: Permission definitions
 * - rolePermissions: Junction table for role → permissions
 * - userRoles: Junction table for user → roles
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
  unique,
} from 'drizzle-orm/pg-core'
import { departments, officeUnits, auditFields } from './base'
import { userRoleEnum } from './enums'

// ============================================================================
// PROFILES TABLE
// ============================================================================

/**
 * User profiles table
 *
 * Extends Supabase auth.users with additional profile data.
 * The id references auth.users(id) but we don't use .references()
 * for Supabase compatibility (Supabase handles the auth.users FK).
 *
 * Current RBAC uses the 'role' enum column.
 * For future flexible permissions, use the roles/permissions tables.
 */
export const profiles = pgTable(
  'profiles',
  {
    // Primary key references Supabase auth.users(id)
    id: uuid('id').primaryKey(),
    email: text('email').unique().notNull(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),

    // Current simple RBAC via enum
    role: userRoleEnum('role').default('executive').notNull(),

    // Department association
    departmentId: uuid('department_id').references(() => departments.id, {
      onDelete: 'set null',
    }),

    // Office unit association
    // TODO: Add office_unit_id column to database before uncommenting
    // officeUnitId: uuid('office_unit_id').references(() => officeUnits.id, {
    //   onDelete: 'set null',
    // }),

    // Manager hierarchy (self-referential)
    managerId: uuid('manager_id'),

    // Additional profile fields
    position: text('position'),
    phone: text('phone'),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),

    // Audit fields
    ...auditFields,
  },
  (table) => [
    index('idx_profiles_email').on(table.email),
    index('idx_profiles_role').on(table.role),
    index('idx_profiles_department').on(table.departmentId),
    // index('idx_profiles_office_unit').on(table.officeUnitId),
    index('idx_profiles_manager').on(table.managerId),
    index('idx_profiles_active').on(table.isActive),
  ]
)

// ============================================================================
// ROLES TABLE (For Future Permission Matrix)
// ============================================================================

/**
 * Custom roles table
 *
 * Allows defining custom roles beyond the basic 3-tier enum.
 * Each role can have multiple permissions assigned.
 *
 * System roles (isSystem=true) cannot be deleted.
 */
export const roles = pgTable(
  'roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    isSystem: boolean('is_system').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    ...auditFields,
  },
  (table) => [
    unique('uq_roles_name').on(table.name),
    index('idx_roles_active').on(table.isActive),
  ]
)

// ============================================================================
// PERMISSIONS TABLE
// ============================================================================

/**
 * Permissions table
 *
 * Defines granular permissions for resources and actions.
 * Format: resource.action (e.g., "projects.create", "tasks.delete")
 */
export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').unique().notNull(), // e.g., "projects.create"
    resource: text('resource').notNull(), // e.g., "projects"
    action: text('action').notNull(), // e.g., "create"
    description: text('description'),
    ...auditFields,
  },
  (table) => [
    index('idx_permissions_resource').on(table.resource),
    unique('uq_permissions_resource_action').on(table.resource, table.action),
  ]
)

// ============================================================================
// ROLE_PERMISSIONS TABLE (Junction)
// ============================================================================

/**
 * Role → Permissions junction table
 *
 * Associates permissions with roles.
 */
export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique('uq_role_permissions').on(table.roleId, table.permissionId),
    index('idx_role_permissions_role').on(table.roleId),
    index('idx_role_permissions_permission').on(table.permissionId),
  ]
)

// ============================================================================
// USER_ROLES TABLE (Junction)
// ============================================================================

/**
 * User → Roles junction table
 *
 * Assigns custom roles to users.
 * This is for the future flexible permission system.
 * Currently, the profiles.role enum is used.
 */
export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    assignedAt: timestamp('assigned_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    assignedBy: uuid('assigned_by').references(() => profiles.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    unique('uq_user_roles').on(table.userId, table.roleId),
    index('idx_user_roles_user').on(table.userId),
    index('idx_user_roles_role').on(table.roleId),
  ]
)

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
export type Permission = typeof permissions.$inferSelect
export type NewPermission = typeof permissions.$inferInsert
export type RolePermission = typeof rolePermissions.$inferSelect
export type NewRolePermission = typeof rolePermissions.$inferInsert
export type UserRole = typeof userRoles.$inferSelect
export type NewUserRole = typeof userRoles.$inferInsert
