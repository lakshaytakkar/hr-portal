/**
 * Office Units Seed Data
 */

import { randomUUID } from 'crypto'
import type { Database } from '../index'
import { officeUnits, type OfficeUnit } from '../schema'

// Pre-generated UUIDs for consistent references
export const officeUnitIds = {
  gurugram: randomUUID(),
  rewari: randomUUID(),
}

export const officeUnitSeedData = [
  {
    id: officeUnitIds.gurugram,
    name: 'Gurugram Office',
    code: 'GGN',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    isActive: true,
  },
  {
    id: officeUnitIds.rewari,
    name: 'Rewari Office',
    code: 'RWR',
    city: 'Rewari',
    state: 'Haryana',
    country: 'India',
    isActive: true,
  },
]

export async function seedOfficeUnits(db: Database): Promise<OfficeUnit[]> {
  const result = await db
    .insert(officeUnits)
    .values(officeUnitSeedData)
    .returning()

  return result
}

/**
 * Get office unit by code from seeded data
 */
export function findOfficeUnitByCode(
  units: OfficeUnit[],
  code: string
): OfficeUnit | undefined {
  return units.find(
    (u) => u.code.toLowerCase() === code.toLowerCase()
  )
}
