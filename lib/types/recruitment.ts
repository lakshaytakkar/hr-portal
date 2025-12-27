export type ApplicationStatus = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected"
export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "rescheduled"
export type JobRoleStatus = "active" | "inactive" | "filled"
export type JobPortalStatus = "active" | "inactive"

export interface RecruitmentUser {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface Application {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  status: ApplicationStatus
  appliedDate: string
  source: string
  resume?: string
  assignedTo?: RecruitmentUser
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Interview {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  interviewDate: string
  interviewTime: string
  interviewType: "phone" | "video" | "in-person"
  interviewer: RecruitmentUser
  status: InterviewStatus
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Evaluation {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  evaluatedBy: RecruitmentUser
  technicalScore: number
  communicationScore: number
  culturalFitScore: number
  overallScore: number
  feedback: string
  recommendation: "hire" | "maybe" | "no-hire"
  evaluatedAt: string
  createdAt: string
  updatedAt: string
}

export interface JobRole {
  id: string
  title: string
  department: string
  status: JobRoleStatus
  description?: string
  requirements?: string
  createdAt: string
  updatedAt: string
}

export interface JobPortal {
  id: string
  name: string
  url: string
  status: JobPortalStatus
  apiKey?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  employmentType: "full-time" | "part-time" | "contract" | "internship"
  status: "draft" | "published" | "closed"
  postedDate?: string
  closingDate?: string
  description?: string
  requirements?: string
  postedBy: RecruitmentUser
  views?: number
  applications?: number
  createdAt: string
  updatedAt: string
}

