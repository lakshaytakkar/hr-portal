/**
 * Database Seed Runner - StartupSquad HR Portal
 *
 * Populates the database with real StartupSquad employee data.
 * Run with: bun run lib/db/seed/index.ts
 *
 * Note: Requires DATABASE_URL to be set in .env.local
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { db } from '../index'
import { seedOfficeUnits } from './office-units'
import { seedDepartments } from './departments'
import { seedProfiles } from './profiles'
import { seedHR } from './hr'
import { seedRecruitment } from './recruitment'
import { seedProjects } from './projects'
import { seedTasks } from './tasks'

async function main() {
  if (!db) {
    console.error('❌ Database not connected. Set DATABASE_URL environment variable.')
    process.exit(1)
  }

  console.log('🌱 Starting database seed for StartupSquad HR Portal...\n')

  try {
    // Seed in order of dependencies
    console.log('🏢 Seeding office units...')
    const officeUnits = await seedOfficeUnits(db)
    console.log(`   ✓ Created ${officeUnits.length} office units (Gurugram, Rewari)\n`)

    console.log('📁 Seeding departments...')
    const departments = await seedDepartments(db)
    console.log(`   ✓ Created ${departments.length} departments\n`)

    console.log('👤 Seeding profiles (22 employees)...')
    const profiles = await seedProfiles(db, departments, officeUnits)
    console.log(`   ✓ Created ${profiles.length} profiles\n`)

    console.log('🏢 Seeding HR data (employees, onboarding)...')
    const hrData = await seedHR(db, profiles, departments)
    console.log(`   ✓ Created ${hrData.employees.length} employees`)
    console.log(`   ✓ Created ${hrData.onboardings.length} onboardings\n`)

    console.log('📋 Seeding recruitment data...')
    const recruitmentData = await seedRecruitment(db, profiles, departments)
    console.log(`   ✓ Created ${recruitmentData.candidates.length} candidates`)
    console.log(`   ✓ Created ${recruitmentData.jobPostings.length} job postings\n`)

    console.log('📊 Seeding projects...')
    const projects = await seedProjects(db, profiles)
    console.log(`   ✓ Created ${projects.length} projects\n`)

    console.log('✅ Seeding tasks...')
    const tasks = await seedTasks(db, projects, profiles)
    console.log(`   ✓ Created ${tasks.length} tasks\n`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   • Office Units: ${officeUnits.length}`)
    console.log(`   • Departments: ${departments.length}`)
    console.log(`   • Profiles/Employees: ${profiles.length}`)
    console.log(`   • Onboardings: ${hrData.onboardings.length}`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
