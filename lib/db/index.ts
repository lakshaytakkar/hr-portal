/**
 * Database Connection & Exports
 *
 * This file provides the database connection and re-exports all schema types.
 * Currently configured as a placeholder until Supabase is connected.
 *
 * To connect to Supabase:
 * 1. Set DATABASE_URL environment variable
 * 2. Run: bun drizzle-kit push
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import * as relations from './relations'

// Database connection URL from environment
const connectionString = process.env.DATABASE_URL

// Create postgres client (null if no connection string)
const client = connectionString
  ? postgres(connectionString, { prepare: false })
  : null

// Create drizzle instance with schema and relations
// Will be null during development without database
export const db = client
  ? drizzle(client, {
      schema: { ...schema, ...relations },
      logger: process.env.NODE_ENV === 'development',
    })
  : null

// Re-export all schema types and tables
export * from './schema'
export * from './relations'
export * from './adapters'

// Helper type for database instance
export type Database = NonNullable<typeof db>

// Check if database is connected
export function isDatabaseConnected(): boolean {
  return db !== null
}
