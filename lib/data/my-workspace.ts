import {
  Training,
  PersonalDocument,
  PersonalNote,
  MeetingNote,
  Goal,
  LeaveRequest,
  DailyReport,
  KnowledgeBaseArticle,
} from "@/lib/types/my-workspace"

export const initialTrainings: Training[] = [
  {
    id: "train-1",
    title: "React Advanced Patterns",
    description: "Learn advanced React patterns and best practices including hooks, context, and performance optimization",
    category: "Development",
    status: "in-progress",
    progress: 45,
    duration: 120,
    url: "/training/react-advanced",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "train-2",
    title: "TypeScript Fundamentals",
    description: "Master TypeScript basics, type system, and advanced features for better JavaScript development",
    category: "Development",
    status: "completed",
    progress: 100,
    duration: 90,
    url: "/training/typescript-fundamentals",
    completedAt: "2024-01-15T00:00:00Z",
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "train-3",
    title: "Project Management Essentials",
    description: "Learn core project management principles, agile methodologies, and team collaboration",
    category: "Business",
    status: "not-started",
    progress: 0,
    duration: 150,
    url: "/training/project-management",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "train-4",
    title: "UI/UX Design Principles",
    description: "Understand user-centered design, wireframing, prototyping, and design systems",
    category: "Design",
    status: "in-progress",
    progress: 30,
    duration: 180,
    url: "/training/ui-ux-design",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "train-5",
    title: "Communication & Leadership",
    description: "Develop leadership skills, effective communication, and team management techniques",
    category: "Business",
    status: "in-progress",
    progress: 60,
    duration: 120,
    url: "/training/communication-leadership",
    createdAt: "2023-12-15T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },
  {
    id: "train-6",
    title: "Next.js Full Stack Development",
    description: "Build full-stack applications with Next.js, including API routes, server components, and deployment",
    category: "Development",
    status: "not-started",
    progress: 0,
    duration: 200,
    url: "/training/nextjs-fullstack",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: "train-7",
    title: "Data Analytics & Reporting",
    description: "Learn data analysis techniques, visualization, and creating impactful business reports",
    category: "Analytics",
    status: "completed",
    progress: 100,
    duration: 100,
    url: "/training/data-analytics",
    completedAt: "2023-11-30T00:00:00Z",
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-11-30T00:00:00Z",
  },
  {
    id: "train-8",
    title: "Customer Success Management",
    description: "Master customer relationship management, retention strategies, and success metrics",
    category: "Business",
    status: "in-progress",
    progress: 25,
    duration: 140,
    url: "/training/customer-success",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
  },
]

export const initialPersonalDocuments: PersonalDocument[] = [
  {
    id: "doc-1",
    name: "Resume_2024.pdf",
    type: "pdf",
    size: 245000,
    url: "/documents/resume-2024.pdf",
    uploadedAt: "2024-01-15T00:00:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

export const initialPersonalNotes: PersonalNote[] = [
  {
    id: "note-1",
    title: "Project Ideas",
    content: "List of ideas for new projects...",
    type: "personal",
    tags: ["ideas", "projects"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

export const initialMeetingNotes: MeetingNote[] = [
  {
    id: "mnote-1",
    title: "Team Standup - Jan 20",
    content: "Discussion about sprint progress...",
    meetingDate: "2024-01-20",
    attendees: ["Sarah", "Mike", "Alex"],
    tags: ["standup", "sprint"],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]

export const initialGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Complete React Certification",
    description: "Finish the advanced React course",
    status: "in-progress",
    progress: 60,
    targetDate: "2024-03-31",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    type: "vacation",
    startDate: "2024-02-15",
    endDate: "2024-02-20",
    days: 5,
    status: "pending",
    reason: "Family vacation",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

export const initialDailyReports: DailyReport[] = [
  {
    id: "report-1",
    date: "2024-01-20",
    tasksCompleted: ["Implemented user authentication", "Fixed bug in dashboard"],
    tasksPlanned: ["Code review", "Write documentation"],
    blockers: [],
    notes: "Good progress today",
    status: "submitted",
    createdAt: "2024-01-20T17:00:00Z",
    updatedAt: "2024-01-20T17:00:00Z",
  },
]

export const initialKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: "kb-1",
    title: "Getting Started Guide",
    content: "Welcome to the platform...",
    category: "Onboarding",
    tags: ["getting-started", "onboarding"],
    views: 250,
    createdBy: {
      id: "user-2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
]

