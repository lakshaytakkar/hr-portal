/**
 * Profile Seed Data - StartupSquad Employees
 */

import { randomUUID } from 'crypto'
import type { Database } from '../index'
import { profiles, type Profile, type Department, type OfficeUnit } from '../schema'
import { findDepartmentByName } from './departments'
import { findOfficeUnitByCode } from './office-units'

export interface ProfileSeedItem {
  id: string
  email: string
  fullName: string
  role: 'executive' | 'manager' | 'superadmin'
  departmentName: string
  secondaryDepartmentName?: string // For multi-department employees
  position: string
  phone: string
  officeUnitCode: string
}

// Pre-generate UUIDs for consistent references
export const profileIds = {
  // Gurugram Office
  akansha_pandey: randomUUID(),
  neetu_kumari: randomUUID(),
  babita_mehta: randomUUID(),
  naveen_rawat: randomUUID(),
  aditya: randomUUID(),
  rudraksh: randomUUID(),
  love: randomUUID(),
  prachi_bisht: randomUUID(),
  himanshu_pandey: randomUUID(),
  abhinandan: randomUUID(),
  simran: randomUUID(),
  sumit: randomUUID(),
  punit: randomUUID(),
  aayan_khastagir: randomUUID(),
  // Rewari Office
  nitin_kumari: randomUUID(),
  krish_verma: randomUUID(),
  yash_jain: randomUUID(),
  vikash_yadav: randomUUID(),
  payal_rani: randomUUID(),
  parthiv_kataria: randomUUID(),
  sahil_solanki: randomUUID(),
  yash: randomUUID(),
}

export const profileSeedData: ProfileSeedItem[] = [
  // ========== GURUGRAM OFFICE ==========
  // Managers
  {
    id: profileIds.akansha_pandey,
    email: 'akansha.pandey@startupsquad.in',
    fullName: 'Akansha Pandey',
    role: 'manager',
    departmentName: 'Operations',
    position: 'Operations Manager',
    phone: '+91 6284846470',
    officeUnitCode: 'GGN',
  },
  // Executives
  {
    id: profileIds.neetu_kumari,
    email: 'neetu.kumari@startupsquad.in',
    fullName: 'Neetu Kumari',
    role: 'executive',
    departmentName: 'Operations',
    position: 'Operations Executive',
    phone: '+91 7413997101',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.babita_mehta,
    email: 'babita.mehta@startupsquad.in',
    fullName: 'Babita Mehta',
    role: 'executive',
    departmentName: 'Operations',
    position: 'Operations Intern',
    phone: '+91 9625546735',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.naveen_rawat,
    email: 'naveen.rawat@startupsquad.in',
    fullName: 'Naveen Singh Rawat',
    role: 'executive',
    departmentName: 'Marketing',
    position: 'Meta Ads Executive',
    phone: '+91 9891367044',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.aditya,
    email: 'aditya@startupsquad.in',
    fullName: 'Aditya',
    role: 'executive',
    departmentName: 'Operations',
    position: 'Operations Executive',
    phone: '+91 8800991161',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.rudraksh,
    email: 'rudraksh@startupsquad.in',
    fullName: 'Rudraksh',
    role: 'executive',
    departmentName: 'Marketing',
    position: 'Video Editor',
    phone: '+91 8585977525',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.love,
    email: 'love@startupsquad.in',
    fullName: 'Love',
    role: 'executive',
    departmentName: 'Engineering',
    position: 'Tech Intern',
    phone: '+91 9643906583',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.prachi_bisht,
    email: 'prachi.bisht@startupsquad.in',
    fullName: 'Prachi Bisht',
    role: 'executive',
    departmentName: 'HR',
    position: 'HR Executive',
    phone: '+91 9899287209',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.himanshu_pandey,
    email: 'himanshu.pandey@startupsquad.in',
    fullName: 'Himanshu Pandey',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 9956609923',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.abhinandan,
    email: 'abhinandan@startupsquad.in',
    fullName: 'Abhinandan',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 8130249937',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.simran,
    email: 'simran@startupsquad.in',
    fullName: 'Simran',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 7393973404',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.sumit,
    email: 'sumit@startupsquad.in',
    fullName: 'Sumit',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 9877978889',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.punit,
    email: 'punit@startupsquad.in',
    fullName: 'Punit',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 9728087600',
    officeUnitCode: 'GGN',
  },
  {
    id: profileIds.aayan_khastagir,
    email: 'aayan.khastagir@startupsquad.in',
    fullName: 'Aayan Khastagir',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Intern',
    phone: '+91 9810609469',
    officeUnitCode: 'GGN',
  },

  // ========== REWARI OFFICE ==========
  {
    id: profileIds.nitin_kumari,
    email: 'nitin.kumari@startupsquad.in',
    fullName: 'Nitin Kumari',
    role: 'executive',
    departmentName: 'Operations',
    position: 'Operations Executive',
    phone: '+91 9050120065',
    officeUnitCode: 'RWR',
  },
  {
    id: profileIds.krish_verma,
    email: 'krish.verma@startupsquad.in',
    fullName: 'Krish Verma',
    role: 'executive',
    departmentName: 'Operations',
    position: 'Operations Executive',
    phone: '+91 9588380227',
    officeUnitCode: 'RWR',
  },
  // Managers with dual departments
  {
    id: profileIds.yash_jain,
    email: 'yash.jain@startupsquad.in',
    fullName: 'Yash Jain',
    role: 'manager',
    departmentName: 'Operations',
    secondaryDepartmentName: 'Finance',
    position: 'Operations & Accounts Manager',
    phone: '+91 8221885828',
    officeUnitCode: 'RWR',
  },
  {
    id: profileIds.vikash_yadav,
    email: 'vikash.yadav@startupsquad.in',
    fullName: 'Vikash Yadav',
    role: 'manager',
    departmentName: 'Operations',
    secondaryDepartmentName: 'HR',
    position: 'Operations & HR Manager',
    phone: '+91 8607778348',
    officeUnitCode: 'RWR',
  },
  // Executives
  {
    id: profileIds.payal_rani,
    email: 'payal.rani@startupsquad.in',
    fullName: 'Payal Rani',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 8607549467',
    officeUnitCode: 'RWR',
  },
  {
    id: profileIds.parthiv_kataria,
    email: 'parthiv.kataria@startupsquad.in',
    fullName: 'Parthiv Kataria',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 8708926920',
    officeUnitCode: 'RWR',
  },
  {
    id: profileIds.sahil_solanki,
    email: 'sahil.solanki@startupsquad.in',
    fullName: 'Sahil Solanki',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 8168592944',
    officeUnitCode: 'RWR',
  },
  {
    id: profileIds.yash,
    email: 'yash@startupsquad.in',
    fullName: 'Yash',
    role: 'executive',
    departmentName: 'Sales',
    position: 'Sales Executive',
    phone: '+91 9783366576',
    officeUnitCode: 'RWR',
  },
]

export async function seedProfiles(
  db: Database,
  departments: Department[],
  officeUnits: OfficeUnit[]
): Promise<Profile[]> {
  const values = profileSeedData.map((p) => {
    const dept = findDepartmentByName(departments, p.departmentName)
    const officeUnit = findOfficeUnitByCode(officeUnits, p.officeUnitCode)

    return {
      id: p.id,
      email: p.email,
      fullName: p.fullName,
      role: p.role as 'executive' | 'manager' | 'superadmin',
      departmentId: dept?.id,
      officeUnitId: officeUnit?.id,
      position: p.position,
      phone: p.phone,
      isActive: true,
    }
  })

  const result = await db.insert(profiles).values(values).returning()

  return result
}

/**
 * Find profile by email
 */
export function findProfileByEmail(
  profs: Profile[],
  email: string
): Profile | undefined {
  return profs.find(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  )
}

/**
 * Find profile by name
 */
export function findProfileByName(
  profs: Profile[],
  name: string
): Profile | undefined {
  return profs.find(
    (p) => p.fullName?.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Get profiles with secondary departments for multi-department assignments
 */
export function getMultiDepartmentProfiles(): Array<{
  profileId: string
  secondaryDepartmentName: string
}> {
  return profileSeedData
    .filter((p) => p.secondaryDepartmentName)
    .map((p) => ({
      profileId: p.id,
      secondaryDepartmentName: p.secondaryDepartmentName!,
    }))
}
