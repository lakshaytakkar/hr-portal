import { config } from 'dotenv'
import type { Config } from 'drizzle-kit'

// Load .env.local
config({ path: '.env.local' })

// TIP: For faster migrations, set DIRECT_URL in .env.local with the direct connection
// (found in Supabase Dashboard > Project Settings > Database > Connection string > URI)
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

export default {
  schema: './lib/db/schema/index.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config
