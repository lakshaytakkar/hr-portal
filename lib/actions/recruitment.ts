'use server'

import { revalidatePath } from 'next/cache'
import { eq, and, isNull, desc, asc } from 'drizzle-orm'
import { resolveDepartmentId, resolveProfileId, normalizeOptional } from '@/lib/utils/foreign-keys'
import { getUserFriendlyErrorMessage, logDatabaseError } from '@/lib/utils/errors'
import {
  db,
  candidates,
  applications,
  interviews,
  evaluations,
  jobRoles,
  jobPostings,
  jobPortals,
  profiles,
  departments,
} from '@/lib/db'
import {
  toFrontendApplication,
  toFrontendInterview,
  toFrontendEvaluation,
  toFrontendJobRole,
  toFrontendJobPosting,
  toFrontendJobPortal,
} from '@/lib/db/adapters/recruitment'
import type {
  Application as FrontendApplication,
  Interview as FrontendInterview,
  Evaluation as FrontendEvaluation,
  JobRole as FrontendJobRole,
  JobPosting as FrontendJobPosting,
  JobPortal as FrontendJobPortal,
} from '@/lib/types/recruitment'
import type { Candidate, CandidateStatus, CandidateSource } from '@/lib/types/candidate'

// ============================================================================
// CANDIDATES
// ============================================================================

export async function getCandidates(): Promise<Candidate[]> {
  if (!db) throw new Error('Database not connected')

  // Get candidates with their most recent application to get positionApplied
  const result = await db
    .select({
      candidate: candidates,
      application: applications,
    })
    .from(candidates)
    .leftJoin(applications, eq(applications.candidateId, candidates.id))
    .where(isNull(candidates.deletedAt))
    .orderBy(desc(candidates.createdAt))

  // Group by candidate and get the most recent application for position
  const candidateMap = new Map<string, { candidate: typeof result[0]['candidate']; position?: string }>()
  for (const row of result) {
    if (!candidateMap.has(row.candidate.id)) {
      candidateMap.set(row.candidate.id, {
        candidate: row.candidate,
        position: undefined,
      })
    }
    // Get position from application if exists (most recent will be first due to ordering)
    if (row.application && !candidateMap.get(row.candidate.id)!.position) {
      candidateMap.set(row.candidate.id, {
        ...candidateMap.get(row.candidate.id)!,
        position: row.application.id, // Will fetch actual position title below
      })
    }
  }

  // For now, return with a placeholder for positionApplied
  // In a real implementation, you'd fetch the job posting title
  return Array.from(candidateMap.values()).map(({ candidate: c }) => ({
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone ?? '',
    positionApplied: 'Open Application', // Default - would be fetched from applications/job_postings
    status: c.status as CandidateStatus,
    source: c.source as CandidateSource | undefined,
    resume: c.resume ?? undefined,
    coverLetter: undefined,
    linkedIn: c.linkedIn ?? undefined,
    skills: c.skills ?? undefined,
    experience: c.experience ?? undefined,
    education: c.education ?? undefined,
    notes: c.notes ?? undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  if (!db) throw new Error('Database not connected')

  const result = await db
    .select()
    .from(candidates)
    .where(and(eq(candidates.id, id), isNull(candidates.deletedAt)))
    .limit(1)

  if (result.length === 0) return null

  const c = result[0]
  return {
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone ?? '',
    positionApplied: 'Open Application', // Default - would be fetched from applications
    status: c.status as CandidateStatus,
    source: c.source as CandidateSource | undefined,
    resume: c.resume ?? undefined,
    coverLetter: undefined,
    linkedIn: c.linkedIn ?? undefined,
    skills: c.skills ?? undefined,
    experience: c.experience ?? undefined,
    education: c.education ?? undefined,
    notes: c.notes ?? undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }
}

interface CreateCandidateInput {
  fullName: string
  email: string
  phone?: string
  source?: 'linkedin' | 'referral' | 'job-board' | 'website' | 'other'
  resume?: string
  linkedIn?: string
  skills?: string
  experience?: string
  education?: string
  expectedSalary?: number
  notes?: string
}

export async function createCandidate(input: CreateCandidateInput): Promise<Candidate> {
  if (!db) throw new Error('Database not connected')

  const [newCandidate] = await db
    .insert(candidates)
    .values({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      source: input.source,
      resume: input.resume,
      linkedIn: input.linkedIn,
      skills: input.skills,
      experience: input.experience,
      education: input.education,
      expectedSalary: input.expectedSalary,
      notes: input.notes,
      status: 'new',
    })
    .returning()

  revalidatePath('/recruitment/candidates')

  return {
    id: newCandidate.id,
    fullName: newCandidate.fullName,
    email: newCandidate.email,
    phone: newCandidate.phone ?? '',
    positionApplied: 'Open Application',
    status: newCandidate.status as CandidateStatus,
    source: newCandidate.source as CandidateSource | undefined,
    resume: newCandidate.resume ?? undefined,
    coverLetter: undefined,
    linkedIn: newCandidate.linkedIn ?? undefined,
    skills: newCandidate.skills ?? undefined,
    experience: newCandidate.experience ?? undefined,
    education: newCandidate.education ?? undefined,
    notes: newCandidate.notes ?? undefined,
    createdAt: newCandidate.createdAt.toISOString(),
    updatedAt: newCandidate.updatedAt.toISOString(),
  }
}

interface UpdateCandidateInput {
  id: string
  fullName?: string
  email?: string
  phone?: string
  status?: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  source?: 'linkedin' | 'referral' | 'job-board' | 'website' | 'other'
  resume?: string
  linkedIn?: string
  skills?: string
  experience?: string
  education?: string
  expectedSalary?: number
  notes?: string
}

export async function updateCandidate(input: UpdateCandidateInput): Promise<Candidate> {
  if (!db) throw new Error('Database not connected')

  const [updated] = await db
    .update(candidates)
    .set({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      status: input.status,
      source: input.source,
      resume: input.resume,
      linkedIn: input.linkedIn,
      skills: input.skills,
      experience: input.experience,
      education: input.education,
      expectedSalary: input.expectedSalary,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(eq(candidates.id, input.id))
    .returning()

  revalidatePath('/recruitment/candidates')
  revalidatePath(`/recruitment/candidates/${input.id}`)

  return {
    id: updated.id,
    fullName: updated.fullName,
    email: updated.email,
    phone: updated.phone ?? '',
    positionApplied: 'Open Application',
    status: updated.status as CandidateStatus,
    source: updated.source as CandidateSource | undefined,
    resume: updated.resume ?? undefined,
    coverLetter: undefined,
    linkedIn: updated.linkedIn ?? undefined,
    skills: updated.skills ?? undefined,
    experience: updated.experience ?? undefined,
    education: updated.education ?? undefined,
    notes: updated.notes ?? undefined,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }
}

export async function deleteCandidate(id: string): Promise<void> {
  if (!db) throw new Error('Database not connected')

  await db
    .update(candidates)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(candidates.id, id))

  revalidatePath('/recruitment/candidates')
}

// ============================================================================
// APPLICATIONS
// ============================================================================

export async function getApplications(): Promise<FrontendApplication[]> {
  if (!db) throw new Error('Database not connected')

  const result = await db.query.applications.findMany({
    with: {
      candidate: true,
      jobPosting: true,
      assignedTo: true,
    },
    where: isNull(applications.deletedAt),
    orderBy: [desc(applications.createdAt)],
  })

  return result.map(toFrontendApplication)
}

interface CreateApplicationInput {
  candidateId: string
  jobPostingId: string
  source?: string
  assignedToId?: string
  notes?: string
}

export async function createApplication(input: CreateApplicationInput): Promise<FrontendApplication> {
  if (!db) throw new Error('Database not connected')

  const [newApp] = await db
    .insert(applications)
    .values({
      candidateId: input.candidateId,
      jobPostingId: input.jobPostingId,
      appliedDate: new Date().toISOString().split('T')[0],
      source: input.source,
      assignedToId: input.assignedToId,
      notes: input.notes,
      status: 'applied',
    })
    .returning()

  // Increment applications count on job posting
  await db
    .update(jobPostings)
    .set({
      applicationsCount: db.$count(applications, eq(applications.jobPostingId, input.jobPostingId)),
    })
    .where(eq(jobPostings.id, input.jobPostingId))

  revalidatePath('/recruitment/applications')
  revalidatePath('/recruitment/job-postings')

  const result = await db.query.applications.findFirst({
    where: eq(applications.id, newApp.id),
    with: {
      candidate: true,
      jobPosting: true,
      assignedTo: true,
    },
  })

  if (!result) throw new Error('Failed to create application')
  return toFrontendApplication(result)
}

interface UpdateApplicationInput {
  id: string
  status?: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  assignedToId?: string
  notes?: string
}

export async function updateApplication(input: UpdateApplicationInput): Promise<FrontendApplication> {
  if (!db) throw new Error('Database not connected')

  await db
    .update(applications)
    .set({
      status: input.status,
      assignedToId: input.assignedToId,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, input.id))

  revalidatePath('/recruitment/applications')

  const result = await db.query.applications.findFirst({
    where: eq(applications.id, input.id),
    with: {
      candidate: true,
      jobPosting: true,
      assignedTo: true,
    },
  })

  if (!result) throw new Error('Application not found')
  return toFrontendApplication(result)
}

// ============================================================================
// INTERVIEWS
// ============================================================================

export async function getInterviews(): Promise<FrontendInterview[]> {
  if (!db) throw new Error('Database not connected')

  const result = await db.query.interviews.findMany({
    with: {
      application: {
        with: {
          candidate: true,
          jobPosting: true,
        },
      },
      interviewer: true,
    },
    orderBy: [desc(interviews.interviewDate)],
  })

  return result.map(toFrontendInterview)
}

interface CreateInterviewInput {
  applicationId: string
  interviewerId: string
  interviewDate: string
  interviewTime: string
  interviewType: 'phone' | 'video' | 'in-person'
  location?: string
  notes?: string
}

export async function createInterview(input: CreateInterviewInput): Promise<FrontendInterview> {
  if (!db) throw new Error('Database not connected')

  const [newInterview] = await db
    .insert(interviews)
    .values({
      applicationId: input.applicationId,
      interviewerId: input.interviewerId,
      interviewDate: input.interviewDate,
      interviewTime: input.interviewTime,
      interviewType: input.interviewType,
      location: input.location,
      notes: input.notes,
      status: 'scheduled',
    })
    .returning()

  // Update application status to interview
  await db
    .update(applications)
    .set({ status: 'interview', updatedAt: new Date() })
    .where(eq(applications.id, input.applicationId))

  revalidatePath('/recruitment/interviews')
  revalidatePath('/recruitment/applications')

  const result = await db.query.interviews.findFirst({
    where: eq(interviews.id, newInterview.id),
    with: {
      application: {
        with: {
          candidate: true,
          jobPosting: true,
        },
      },
      interviewer: true,
    },
  })

  if (!result) throw new Error('Failed to create interview')
  return toFrontendInterview(result)
}

interface UpdateInterviewInput {
  id: string
  interviewDate?: string
  interviewTime?: string
  interviewType?: 'phone' | 'video' | 'in-person'
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  location?: string
  notes?: string
  feedback?: string
}

export async function updateInterview(input: UpdateInterviewInput): Promise<FrontendInterview> {
  if (!db) throw new Error('Database not connected')

  await db
    .update(interviews)
    .set({
      interviewDate: input.interviewDate,
      interviewTime: input.interviewTime,
      interviewType: input.interviewType,
      status: input.status,
      location: input.location,
      notes: input.notes,
      feedback: input.feedback,
      updatedAt: new Date(),
    })
    .where(eq(interviews.id, input.id))

  revalidatePath('/recruitment/interviews')

  const result = await db.query.interviews.findFirst({
    where: eq(interviews.id, input.id),
    with: {
      application: {
        with: {
          candidate: true,
          jobPosting: true,
        },
      },
      interviewer: true,
    },
  })

  if (!result) throw new Error('Interview not found')
  return toFrontendInterview(result)
}

// ============================================================================
// EVALUATIONS
// ============================================================================

export async function getEvaluations(): Promise<FrontendEvaluation[]> {
  if (!db) throw new Error('Database not connected')

  const result = await db.query.evaluations.findMany({
    with: {
      interview: {
        with: {
          application: {
            with: {
              candidate: true,
              jobPosting: true,
            },
          },
        },
      },
      evaluatedBy: true,
    },
    orderBy: [desc(evaluations.evaluatedAt)],
  })

  return result.map(toFrontendEvaluation)
}

interface CreateEvaluationInput {
  interviewId: string
  evaluatedById: string
  technicalScore: number
  communicationScore: number
  culturalFitScore: number
  overallScore: number
  strengths?: string
  weaknesses?: string
  feedback: string
  recommendation: 'hire' | 'maybe' | 'no-hire'
}

export async function createEvaluation(input: CreateEvaluationInput): Promise<FrontendEvaluation> {
  if (!db) throw new Error('Database not connected')

  const [newEval] = await db
    .insert(evaluations)
    .values({
      interviewId: input.interviewId,
      evaluatedById: input.evaluatedById,
      technicalScore: input.technicalScore,
      communicationScore: input.communicationScore,
      culturalFitScore: input.culturalFitScore,
      overallScore: input.overallScore,
      strengths: input.strengths,
      weaknesses: input.weaknesses,
      feedback: input.feedback,
      recommendation: input.recommendation,
      evaluatedAt: new Date(),
    })
    .returning()

  // Update interview status to completed
  await db
    .update(interviews)
    .set({ status: 'completed', updatedAt: new Date() })
    .where(eq(interviews.id, input.interviewId))

  revalidatePath('/recruitment/evaluations')
  revalidatePath('/recruitment/interviews')

  const result = await db.query.evaluations.findFirst({
    where: eq(evaluations.id, newEval.id),
    with: {
      interview: {
        with: {
          application: {
            with: {
              candidate: true,
              jobPosting: true,
            },
          },
        },
      },
      evaluatedBy: true,
    },
  })

  if (!result) throw new Error('Failed to create evaluation')
  return toFrontendEvaluation(result)
}

// ============================================================================
// JOB ROLES
// ============================================================================

export async function getJobRoles(): Promise<FrontendJobRole[]> {
  if (!db) throw new Error('Database not connected')

  const result = await db.query.jobRoles.findMany({
    with: {
      department: true,
    },
    where: isNull(jobRoles.deletedAt),
    orderBy: [asc(jobRoles.title)],
  })

  return result.map(toFrontendJobRole)
}

interface CreateJobRoleInput {
  title: string
  departmentId?: string
  description?: string
  requirements?: string
  status?: 'active' | 'inactive' | 'filled'
}

export async function createJobRole(input: CreateJobRoleInput): Promise<FrontendJobRole> {
  if (!db) throw new Error('Database not connected')

  try {
    // Normalize optional fields
    const normalizedDescription = normalizeOptional(input.description)
    const normalizedRequirements = normalizeOptional(input.requirements)

    // Resolve foreign keys
    const resolvedDepartmentId = await resolveDepartmentId(input.departmentId, false)

    // Validate required fields
    if (!input.title) {
      throw new Error('Job role title is required')
    }

    const [newRole] = await db
      .insert(jobRoles)
      .values({
        title: input.title,
        departmentId: resolvedDepartmentId,
        description: normalizedDescription,
        requirements: normalizedRequirements,
        status: input.status || 'active',
      })
      .returning()

    revalidatePath('/recruitment/job-roles')

    const result = await db.query.jobRoles.findFirst({
      where: eq(jobRoles.id, newRole.id),
      with: { department: true },
    })

    if (!result) throw new Error('Failed to create job role')
    return toFrontendJobRole(result)
  } catch (error) {
    logDatabaseError(error, 'createJobRole')
    const friendlyMessage = getUserFriendlyErrorMessage(error)
    throw new Error(friendlyMessage)
  }
}

interface UpdateJobRoleInput {
  id: string
  title?: string
  departmentId?: string
  description?: string
  requirements?: string
  status?: 'active' | 'inactive' | 'filled'
}

export async function updateJobRole(input: UpdateJobRoleInput): Promise<FrontendJobRole> {
  if (!db) throw new Error('Database not connected')

  try {
    // Normalize optional fields
    const normalizedDescription = normalizeOptional(input.description)
    const normalizedRequirements = normalizeOptional(input.requirements)

    // Resolve foreign keys
    const resolvedDepartmentId = input.departmentId !== undefined
      ? await resolveDepartmentId(input.departmentId, false)
      : undefined

    await db
      .update(jobRoles)
      .set({
        title: input.title,
        departmentId: resolvedDepartmentId,
        description: normalizedDescription,
        requirements: normalizedRequirements,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(jobRoles.id, input.id))

    revalidatePath('/recruitment/job-roles')

    const result = await db.query.jobRoles.findFirst({
      where: eq(jobRoles.id, input.id),
      with: { department: true },
    })

    if (!result) throw new Error('Job role not found')
    return toFrontendJobRole(result)
  } catch (error) {
    logDatabaseError(error, 'updateJobRole')
    const friendlyMessage = getUserFriendlyErrorMessage(error)
    throw new Error(friendlyMessage)
  }
}

// ============================================================================
// JOB POSTINGS
// ============================================================================

export async function getJobPostings(): Promise<FrontendJobPosting[]> {
  if (!db) throw new Error('Database not connected')

  const result = await db.query.jobPostings.findMany({
    with: {
      department: true,
      postedBy: true,
    },
    where: isNull(jobPostings.deletedAt),
    orderBy: [desc(jobPostings.createdAt)],
  })

  return result.map(toFrontendJobPosting)
}

interface CreateJobPostingInput {
  title: string
  departmentId?: string
  location?: string
  employmentType?: 'full-time' | 'part-time' | 'contract'
  description?: string
  requirements?: string
  responsibilities?: string
  salaryMin?: number
  salaryMax?: number
  postedById?: string
  status?: 'draft' | 'published' | 'closed'
  closingDate?: string
}

export async function createJobPosting(input: CreateJobPostingInput): Promise<FrontendJobPosting> {
  if (!db) throw new Error('Database not connected')

  try {
    // Normalize optional fields
    const normalizedLocation = normalizeOptional(input.location)
    const normalizedDescription = normalizeOptional(input.description)
    const normalizedRequirements = normalizeOptional(input.requirements)
    const normalizedResponsibilities = normalizeOptional(input.responsibilities)

    // Resolve foreign keys
    const resolvedDepartmentId = await resolveDepartmentId(input.departmentId, false)
    const resolvedPostedById = input.postedById
      ? await resolveProfileId(input.postedById, false)
      : null

    // Get a default poster if not provided (first profile)
    let postedById = resolvedPostedById
    if (!postedById) {
      const firstProfile = await db.query.profiles.findFirst()
      postedById = firstProfile?.id || null
    }

    // Validate required fields
    if (!input.title) {
      throw new Error('Job posting title is required')
    }

    const status = input.status || 'draft'
    const postedDate = status === 'published' ? new Date().toISOString().split('T')[0] : null

    const [newPosting] = await db
      .insert(jobPostings)
      .values({
        title: input.title,
        departmentId: resolvedDepartmentId,
        location: normalizedLocation,
        employmentType: input.employmentType || 'full-time',
        description: normalizedDescription,
        requirements: normalizedRequirements,
        responsibilities: normalizedResponsibilities,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        postedById: postedById,
        closingDate: input.closingDate,
        status,
        postedDate,
        views: 0,
        applicationsCount: 0,
      })
      .returning()

    revalidatePath('/recruitment/job-postings')

    const result = await db.query.jobPostings.findFirst({
      where: eq(jobPostings.id, newPosting.id),
      with: {
        department: true,
        postedBy: true,
      },
    })

    if (!result) throw new Error('Failed to create job posting')
    return toFrontendJobPosting(result)
  } catch (error) {
    logDatabaseError(error, 'createJobPosting')
    const friendlyMessage = getUserFriendlyErrorMessage(error)
    throw new Error(friendlyMessage)
  }
}

interface UpdateJobPostingInput {
  id: string
  title?: string
  departmentId?: string
  location?: string
  employmentType?: 'full-time' | 'part-time' | 'contract'
  description?: string
  requirements?: string
  responsibilities?: string
  salaryMin?: number
  salaryMax?: number
  status?: 'draft' | 'published' | 'closed'
  closingDate?: string
}

export async function updateJobPosting(input: UpdateJobPostingInput): Promise<FrontendJobPosting> {
  if (!db) throw new Error('Database not connected')

  try {
    // Normalize optional fields
    const normalizedLocation = normalizeOptional(input.location)
    const normalizedDescription = normalizeOptional(input.description)
    const normalizedRequirements = normalizeOptional(input.requirements)
    const normalizedResponsibilities = normalizeOptional(input.responsibilities)

    // Resolve foreign keys
    const resolvedDepartmentId = input.departmentId !== undefined
      ? await resolveDepartmentId(input.departmentId, false)
      : undefined

    // If publishing for first time, set posted date
    let postedDate: string | undefined
    if (input.status === 'published') {
      const existing = await db.query.jobPostings.findFirst({
        where: eq(jobPostings.id, input.id),
      })
      if (existing && !existing.postedDate) {
        postedDate = new Date().toISOString().split('T')[0]
      }
    }

    await db
      .update(jobPostings)
      .set({
        title: input.title,
        departmentId: resolvedDepartmentId,
        location: normalizedLocation,
        employmentType: input.employmentType,
        description: normalizedDescription,
        requirements: normalizedRequirements,
        responsibilities: normalizedResponsibilities,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        status: input.status,
        closingDate: input.closingDate,
        postedDate,
        updatedAt: new Date(),
      })
      .where(eq(jobPostings.id, input.id))

    revalidatePath('/recruitment/job-postings')

    const result = await db.query.jobPostings.findFirst({
      where: eq(jobPostings.id, input.id),
      with: {
        department: true,
        postedBy: true,
      },
    })

    if (!result) throw new Error('Job posting not found')
    return toFrontendJobPosting(result)
  } catch (error) {
    logDatabaseError(error, 'updateJobPosting')
    const friendlyMessage = getUserFriendlyErrorMessage(error)
    throw new Error(friendlyMessage)
  }
}

export async function deleteJobPosting(id: string): Promise<void> {
  if (!db) throw new Error('Database not connected')

  await db
    .update(jobPostings)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(jobPostings.id, id))

  revalidatePath('/recruitment/job-postings')
}

// ============================================================================
// JOB PORTALS
// ============================================================================

export async function getJobPortals(): Promise<FrontendJobPortal[]> {
  if (!db) throw new Error('Database not connected')

  const result = await db
    .select()
    .from(jobPortals)
    .orderBy(asc(jobPortals.name))

  return result.map(toFrontendJobPortal)
}

interface CreateJobPortalInput {
  name: string
  url?: string
  status?: 'active' | 'inactive'
  apiKey?: string
  notes?: string
}

export async function createJobPortal(input: CreateJobPortalInput): Promise<FrontendJobPortal> {
  if (!db) throw new Error('Database not connected')

  const [newPortal] = await db
    .insert(jobPortals)
    .values({
      name: input.name,
      url: input.url,
      status: input.status || 'active',
      apiKey: input.apiKey,
      notes: input.notes,
    })
    .returning()

  revalidatePath('/recruitment/job-portals')
  return toFrontendJobPortal(newPortal)
}

interface UpdateJobPortalInput {
  id: string
  name?: string
  url?: string
  status?: 'active' | 'inactive'
  apiKey?: string
  notes?: string
}

export async function updateJobPortal(input: UpdateJobPortalInput): Promise<FrontendJobPortal> {
  if (!db) throw new Error('Database not connected')

  const [updated] = await db
    .update(jobPortals)
    .set({
      name: input.name,
      url: input.url,
      status: input.status,
      apiKey: input.apiKey,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(eq(jobPortals.id, input.id))
    .returning()

  revalidatePath('/recruitment/job-portals')
  return toFrontendJobPortal(updated)
}
