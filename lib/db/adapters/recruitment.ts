/**
 * Recruitment Module Adapters
 * Convert between database types and frontend recruitment types
 */

import type {
  Candidate as DbCandidate,
  Application as DbApplication,
  Interview as DbInterview,
  Evaluation as DbEvaluation,
  JobRole as DbJobRole,
  JobPosting as DbJobPosting,
  JobPortal as DbJobPortal,
  Profile,
  Department,
} from '../schema'
import type {
  Application as FrontendApplication,
  Interview as FrontendInterview,
  Evaluation as FrontendEvaluation,
  JobRole as FrontendJobRole,
  JobPosting as FrontendJobPosting,
  JobPortal as FrontendJobPortal,
  RecruitmentUser,
} from '@/lib/types/recruitment'
import { getAvatarForUser } from '@/lib/utils/avatars'

/**
 * Convert a Profile to a RecruitmentUser
 */
export function toRecruitmentUser(
  profile: Profile | null | undefined
): RecruitmentUser | undefined {
  if (!profile) return undefined
  return {
    id: profile.id,
    name: profile.fullName ?? 'Unknown',
    email: profile.email,
    avatar: profile.avatarUrl ?? getAvatarForUser(profile.fullName ?? 'U'),
  }
}

interface ApplicationWithRelations extends DbApplication {
  candidate: DbCandidate
  jobPosting: DbJobPosting
  assignedTo?: Profile | null
}

/**
 * Convert a database Application to frontend Application
 */
export function toFrontendApplication(
  application: ApplicationWithRelations
): FrontendApplication {
  return {
    id: application.id,
    candidateName: application.candidate.fullName,
    candidateEmail: application.candidate.email,
    position: application.jobPosting.title,
    status: application.status,
    appliedDate: application.appliedDate,
    source: application.candidate.source ?? 'other',
    resume: application.candidate.resume ?? undefined,
    assignedTo: toRecruitmentUser(application.assignedTo),
    notes: application.notes ?? undefined,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  }
}

interface InterviewWithRelations extends DbInterview {
  application: DbApplication & {
    candidate: DbCandidate
    jobPosting: DbJobPosting
  }
  interviewer: Profile
}

/**
 * Convert a database Interview to frontend Interview
 */
export function toFrontendInterview(
  interview: InterviewWithRelations
): FrontendInterview {
  return {
    id: interview.id,
    candidateName: interview.application.candidate.fullName,
    candidateEmail: interview.application.candidate.email,
    position: interview.application.jobPosting.title,
    interviewDate: interview.interviewDate,
    interviewTime: interview.interviewTime,
    interviewType: interview.interviewType,
    interviewer: toRecruitmentUser(interview.interviewer)!,
    status: interview.status,
    location: interview.location ?? undefined,
    notes: interview.notes ?? undefined,
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
  }
}

interface EvaluationWithRelations extends DbEvaluation {
  interview: DbInterview & {
    application: DbApplication & {
      candidate: DbCandidate
      jobPosting: DbJobPosting
    }
  }
  evaluatedBy: Profile
}

/**
 * Convert a database Evaluation to frontend Evaluation
 */
export function toFrontendEvaluation(
  evaluation: EvaluationWithRelations
): FrontendEvaluation {
  return {
    id: evaluation.id,
    candidateName: evaluation.interview.application.candidate.fullName,
    candidateEmail: evaluation.interview.application.candidate.email,
    position: evaluation.interview.application.jobPosting.title,
    evaluatedBy: toRecruitmentUser(evaluation.evaluatedBy)!,
    technicalScore: evaluation.technicalScore ?? 0,
    communicationScore: evaluation.communicationScore ?? 0,
    culturalFitScore: evaluation.culturalFitScore ?? 0,
    overallScore: evaluation.overallScore ?? 0,
    feedback: evaluation.feedback,
    recommendation: evaluation.recommendation,
    evaluatedAt: evaluation.evaluatedAt.toISOString(),
    createdAt: evaluation.createdAt.toISOString(),
    updatedAt: evaluation.updatedAt.toISOString(),
  }
}

interface JobRoleWithRelations extends DbJobRole {
  department?: Department | null
}

/**
 * Convert a database JobRole to frontend JobRole
 */
export function toFrontendJobRole(jobRole: JobRoleWithRelations): FrontendJobRole {
  return {
    id: jobRole.id,
    title: jobRole.title,
    department: jobRole.department?.name ?? 'Unknown',
    status: jobRole.status,
    description: jobRole.description ?? undefined,
    requirements: jobRole.requirements ?? undefined,
    createdAt: jobRole.createdAt.toISOString(),
    updatedAt: jobRole.updatedAt.toISOString(),
  }
}

/**
 * Convert a database JobPortal to frontend JobPortal
 */
export function toFrontendJobPortal(jobPortal: DbJobPortal): FrontendJobPortal {
  return {
    id: jobPortal.id,
    name: jobPortal.name,
    url: jobPortal.url ?? '',
    status: jobPortal.status,
    apiKey: jobPortal.apiKey ?? undefined,
    notes: jobPortal.notes ?? undefined,
    createdAt: jobPortal.createdAt.toISOString(),
    updatedAt: jobPortal.updatedAt.toISOString(),
  }
}

interface JobPostingWithRelations extends DbJobPosting {
  department?: Department | null
  postedBy?: Profile | null
}

/**
 * Convert a database JobPosting to frontend JobPosting
 */
export function toFrontendJobPosting(
  jobPosting: JobPostingWithRelations
): FrontendJobPosting {
  return {
    id: jobPosting.id,
    title: jobPosting.title,
    department: jobPosting.department?.name ?? 'Unknown',
    location: jobPosting.location ?? '',
    employmentType: jobPosting.employmentType,
    status: jobPosting.status,
    postedDate: jobPosting.postedDate ?? undefined,
    closingDate: jobPosting.closingDate ?? undefined,
    description: jobPosting.description ?? undefined,
    requirements: jobPosting.requirements ?? undefined,
    postedBy: toRecruitmentUser(jobPosting.postedBy)!,
    views: jobPosting.views,
    applications: jobPosting.applicationsCount,
    createdAt: jobPosting.createdAt.toISOString(),
    updatedAt: jobPosting.updatedAt.toISOString(),
  }
}
