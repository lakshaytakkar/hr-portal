/**
 * Department Seed Data
 */

import type { Database } from '../index'
import { departments, type Department } from '../schema'

export const departmentSeedData = [
  {
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development and technical operations',
  },
  {
    name: 'Design',
    code: 'DSN',
    description: 'UI/UX design and creative services',
  },
  {
    name: 'Sales',
    code: 'SLS',
    description: 'Sales and business development',
  },
  {
    name: 'Marketing',
    code: 'MKT',
    description: 'Marketing and communications',
  },
  {
    name: 'HR',
    code: 'HR',
    description: 'Human resources and talent management',
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Finance and accounting',
  },
  {
    name: 'Operations',
    code: 'OPS',
    description: 'Business operations and administration',
  },
]

export async function seedDepartments(db: Database): Promise<Department[]> {
  const result = await db
    .insert(departments)
    .values(departmentSeedData)
    .returning()

  return result
}

/**
 * Get department by name from seeded data
 */
export function findDepartmentByName(
  depts: Department[],
  name: string
): Department | undefined {
  return depts.find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  )
}
