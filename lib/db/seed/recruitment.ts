/**
 * Recruitment Module Seed Data
 * - Candidates
 * - Job Postings
 * - Job Roles
 * - Applications
 */

import type { Database } from '../index'
import {
  candidates,
  jobRoles,
  jobPostings,
  applications,
  type Candidate,
  type JobPosting,
  type Profile,
  type Department,
} from '../schema'
import { profileIds } from './profiles'
import { findDepartmentByName } from './departments'

export interface RecruitmentSeedResult {
  candidates: Candidate[]
  jobPostings: JobPosting[]
}

const candidateSeedData = [
  {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    status: 'interview' as const,
    source: 'linkedin' as const,
    resume: '/resumes/john-doe.pdf',
    coverLetter: 'I am excited to apply for the Senior Developer position...',
    linkedin: 'https://linkedin.com/in/johndoe',
    experience: '5+ years of experience in full-stack development',
    education: 'BS in Computer Science, MIT',
    skills: 'React, TypeScript, Node.js, Python',
    notes: 'Strong technical background, good communication skills',
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0102',
    status: 'screening' as const,
    source: 'job-board' as const,
    resume: '/resumes/jane-smith.pdf',
    linkedin: 'https://linkedin.com/in/janesmith',
    experience: '3 years of experience in UI/UX design',
    education: 'BA in Design, Art Institute',
    skills: 'Figma, Adobe XD, Sketch, Prototyping',
  },
  {
    fullName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1-555-0103',
    status: 'new' as const,
    source: 'referral' as const,
    resume: '/resumes/mike-johnson.pdf',
    experience: '7 years of product management experience',
    education: 'MBA, Stanford University',
    skills: 'Product Strategy, Agile, Analytics',
    notes: 'Referred by Sarah Williams',
  },
  {
    fullName: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '+1-555-0104',
    status: 'offer' as const,
    source: 'linkedin' as const,
    resume: '/resumes/emily-chen.pdf',
    linkedin: 'https://linkedin.com/in/emilychen',
    experience: '4 years of backend development experience',
    education: 'MS in Computer Science, Stanford',
    skills: 'Go, Rust, PostgreSQL, Redis',
    notes: 'Excellent systems design skills',
  },
  {
    fullName: 'Robert Williams',
    email: 'robert.williams@example.com',
    phone: '+1-555-0105',
    status: 'rejected' as const,
    source: 'website' as const,
    resume: '/resumes/robert-williams.pdf',
    experience: '2 years of marketing experience',
    education: 'BA in Marketing, UCLA',
    skills: 'SEO, Content Marketing, Analytics',
    notes: 'Not enough technical experience for the role',
  },
]

export async function seedRecruitment(
  db: Database,
  profiles: Profile[],
  departments: Department[]
): Promise<RecruitmentSeedResult> {
  const engDept = findDepartmentByName(departments, 'Engineering')
  const designDept = findDepartmentByName(departments, 'Design')
  const marketingDept = findDepartmentByName(departments, 'Marketing')
  // Akansha Pandey is the HR Manager
  const hrManager = profiles.find((p) => p.id === profileIds.akansha_pandey)

  // Seed job roles
  const jobRoleValues = [
    {
      title: 'Senior Developer',
      departmentId: engDept?.id,
      description: 'Lead development of key product features',
      requirements: '5+ years experience, strong TypeScript/React skills',
      status: 'active' as const,
    },
    {
      title: 'UI/UX Designer',
      departmentId: designDept?.id,
      description: 'Create beautiful and intuitive user experiences',
      requirements: '3+ years experience, proficiency in Figma',
      status: 'active' as const,
    },
    {
      title: 'Marketing Specialist',
      departmentId: marketingDept?.id,
      description: 'Drive growth through digital marketing',
      requirements: '2+ years experience in B2B marketing',
      status: 'active' as const,
    },
  ]

  const jobRolesResult = await db
    .insert(jobRoles)
    .values(jobRoleValues)
    .returning()

  // Seed job postings
  const jobPostingValues = [
    {
      jobRoleId: jobRolesResult[0]?.id,
      title: 'Senior Developer',
      departmentId: engDept?.id,
      location: 'Remote',
      employmentType: 'full-time' as const,
      status: 'published' as const,
      postedDate: '2024-01-10',
      closingDate: '2024-03-10',
      description: 'We are looking for a senior developer to join our team...',
      requirements: '5+ years of experience with React and TypeScript',
      responsibilities: 'Lead development of key product features, mentor junior developers',
      salaryMin: 120000,
      salaryMax: 160000,
      postedById: hrManager?.id,
    },
    {
      jobRoleId: jobRolesResult[1]?.id,
      title: 'UI/UX Designer',
      departmentId: designDept?.id,
      location: 'Hybrid - New York',
      employmentType: 'full-time' as const,
      status: 'published' as const,
      postedDate: '2024-01-12',
      closingDate: '2024-03-12',
      description: 'Join our design team to create amazing user experiences...',
      requirements: '3+ years of experience in UI/UX design',
      responsibilities: 'Design user interfaces, conduct user research',
      salaryMin: 90000,
      salaryMax: 130000,
      postedById: hrManager?.id,
    },
    {
      jobRoleId: jobRolesResult[2]?.id,
      title: 'Marketing Specialist',
      departmentId: marketingDept?.id,
      location: 'On-site - San Francisco',
      employmentType: 'full-time' as const,
      status: 'draft' as const,
      description: 'Drive growth through digital marketing campaigns...',
      requirements: '2+ years of experience in B2B marketing',
      responsibilities: 'Plan and execute marketing campaigns',
      salaryMin: 70000,
      salaryMax: 100000,
      postedById: hrManager?.id,
    },
  ]

  const jobPostingsResult = await db
    .insert(jobPostings)
    .values(jobPostingValues)
    .returning()

  // Seed candidates
  const candidatesResult = await db
    .insert(candidates)
    .values(candidateSeedData)
    .returning()

  // Seed applications (linking candidates to job postings)
  const applicationValues = [
    {
      candidateId: candidatesResult[0]?.id!,
      jobPostingId: jobPostingsResult[0]?.id!,
      status: 'interview' as const,
      appliedDate: '2024-01-15',
      assignedToId: hrManager?.id,
      notes: 'Passed initial screening, scheduled for technical interview',
    },
    {
      candidateId: candidatesResult[1]?.id!,
      jobPostingId: jobPostingsResult[1]?.id!,
      status: 'screening' as const,
      appliedDate: '2024-01-18',
      assignedToId: hrManager?.id,
    },
    {
      candidateId: candidatesResult[2]?.id!,
      jobPostingId: jobPostingsResult[0]?.id!,
      status: 'applied' as const,
      appliedDate: '2024-01-20',
    },
    {
      candidateId: candidatesResult[3]?.id!,
      jobPostingId: jobPostingsResult[0]?.id!,
      status: 'offer' as const,
      appliedDate: '2024-01-10',
      assignedToId: hrManager?.id,
      notes: 'Offer extended, waiting for response',
    },
  ]

  await db.insert(applications).values(applicationValues)

  return {
    candidates: candidatesResult,
    jobPostings: jobPostingsResult,
  }
}
