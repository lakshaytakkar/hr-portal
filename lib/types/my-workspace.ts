export type TrainingStatus = "not-started" | "in-progress" | "completed"
export type DocumentType = "pdf" | "doc" | "image" | "video" | "other"
export type NoteType = "personal" | "meeting" | "project" | "other"
export type GoalStatus = "not-started" | "in-progress" | "completed" | "on-hold"
export type LeaveRequestStatus = "pending" | "approved" | "rejected" | "cancelled"
export type DailyReportStatus = "draft" | "submitted"

export interface WorkspaceUser {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface Training {
  id: string
  title: string
  description?: string
  category: string
  status: TrainingStatus
  progress?: number
  duration?: number
  url?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PersonalDocument {
  id: string
  name: string
  type: DocumentType
  size?: number
  url: string
  uploadedAt: string
  createdAt: string
  updatedAt: string
}

export interface PersonalNote {
  id: string
  title: string
  content: string
  type: NoteType
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface MeetingNote {
  id: string
  title: string
  content: string
  meetingDate: string
  attendees?: string[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  title: string
  description?: string
  status: GoalStatus
  progress?: number
  targetDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface LeaveRequest {
  id: string
  type: "vacation" | "sick" | "personal" | "other"
  startDate: string
  endDate: string
  days: number
  status: LeaveRequestStatus
  reason?: string
  approvedBy?: WorkspaceUser
  createdAt: string
  updatedAt: string
}

export interface DailyReport {
  id: string
  date: string
  tasksCompleted: string[]
  tasksPlanned: string[]
  blockers?: string[]
  notes?: string
  status: DailyReportStatus
  createdAt: string
  updatedAt: string
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category: string
  tags?: string[]
  views?: number
  createdAt: string
  updatedAt: string
  createdBy: WorkspaceUser
}

