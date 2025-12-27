/**
 * Foreign Key Resolution Utilities
 *
 * Provides helper functions to resolve user-friendly identifiers (names, codes, emails)
 * to UUIDs required for database foreign key relationships.
 *
 * This prevents errors from passing string values directly to foreign key fields.
 */

import { eq, ilike, and, or, isNull } from 'drizzle-orm'
import { db, departments, profiles } from '@/lib/db'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Validates if a string is a valid UUID format
 */
export function isValidUUID(value: string | null | undefined): boolean {
  if (!value) return false
  return UUID_REGEX.test(value)
}

/**
 * Normalizes empty strings to undefined for optional fields
 */
export function normalizeOptional<T>(value: T | string | null | undefined): T | undefined {
  if (value === null || value === '') return undefined
  return value as T
}

/**
 * Resolves a department identifier to a department UUID
 *
 * Supports:
 * - UUID (if already a valid UUID, returns as-is)
 * - Department name (case-insensitive)
 * - Department code (case-insensitive)
 *
 * @param identifier - Department UUID, name, or code
 * @param required - If true, throws error if not found. If false, returns null for optional fields.
 * @returns Department UUID or null if not found and not required
 * @throws Error if required and not found
 */
export async function resolveDepartmentId(
  identifier: string | null | undefined,
  required: boolean = false
): Promise<string | null> {
  if (!identifier) {
    if (required) {
      throw new Error('Department is required')
    }
    return null
  }

  // If already a valid UUID, return it
  if (isValidUUID(identifier)) {
    // Verify it exists
    if (!db) {
      throw new Error('Database not connected')
    }

    const dept = await db
      .select({ id: departments.id })
      .from(departments)
      .where(and(eq(departments.id, identifier), isNull(departments.deletedAt)))
      .limit(1)

    if (dept.length === 0) {
      if (required) {
        throw new Error(`Department with ID ${identifier} not found`)
      }
      return null
    }

    return dept[0].id
  }

  // Lookup by name or code
  if (!db) {
    throw new Error('Database not connected')
  }

  const result = await db
    .select({ id: departments.id })
    .from(departments)
    .where(
      and(
        isNull(departments.deletedAt),
        // Match by name (case-insensitive) or code (case-insensitive)
        or(ilike(departments.name, identifier), ilike(departments.code, identifier))
      )
    )
    .limit(1)

  if (result.length === 0) {
    if (required) {
      throw new Error(`Department "${identifier}" not found`)
    }
    return null
  }

  return result[0].id
}

/**
 * Resolves a manager/profile identifier to a profile UUID
 *
 * Supports:
 * - UUID (if already a valid UUID, returns as-is)
 * - Email address
 * - Full name (fuzzy match - exact match preferred)
 *
 * @param identifier - Profile UUID, email, or name
 * @param required - If true, throws error if not found. If false, returns null for optional fields.
 * @returns Profile UUID or null if not found and not required
 * @throws Error if required and not found
 */
export async function resolveProfileId(
  identifier: string | null | undefined,
  required: boolean = false
): Promise<string | null> {
  if (!identifier) {
    if (required) {
      throw new Error('Manager/Profile is required')
    }
    return null
  }

  // If already a valid UUID, return it
  if (isValidUUID(identifier)) {
    // Verify it exists
    if (!db) {
      throw new Error('Database not connected')
    }

    const profile = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, identifier))
      .limit(1)

    if (profile.length === 0) {
      if (required) {
        throw new Error(`Profile with ID ${identifier} not found`)
      }
      return null
    }

    return profile[0].id
  }

  // Lookup by email or name
  if (!db) {
    throw new Error('Database not connected')
  }

  // Try email first (exact match)
  const byEmail = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(ilike(profiles.email, identifier))
    .limit(1)

  if (byEmail.length > 0) {
    return byEmail[0].id
  }

  // Try name (case-insensitive)
  const byName = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(ilike(profiles.fullName, identifier))
    .limit(1)

  if (byName.length > 0) {
    return byName[0].id
  }

  // Not found
  if (required) {
    throw new Error(`Profile "${identifier}" not found`)
  }
  return null
}

/**
 * Resolves multiple department identifiers to UUIDs
 *
 * @param identifiers - Array of department identifiers
 * @param required - If true, throws error if any not found
 * @returns Array of department UUIDs (nulls filtered out if not required)
 */
export async function resolveDepartmentIds(
  identifiers: (string | null | undefined)[],
  required: boolean = false
): Promise<(string | null)[]> {
  return Promise.all(identifiers.map((id) => resolveDepartmentId(id, required)))
}

/**
 * Resolves multiple profile identifiers to UUIDs
 *
 * @param identifiers - Array of profile identifiers
 * @param required - If true, throws error if any not found
 * @returns Array of profile UUIDs (nulls filtered out if not required)
 */
export async function resolveProfileIds(
  identifiers: (string | null | undefined)[],
  required: boolean = false
): Promise<(string | null)[]> {
  return Promise.all(identifiers.map((id) => resolveProfileId(id, required)))
}

