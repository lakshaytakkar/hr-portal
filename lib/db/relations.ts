/**
 * Drizzle Relations Definitions
 *
 * Defines relationships between tables for type-safe queries with joins.
 * All relations are defined here to avoid circular dependencies.
 */

import { relations } from 'drizzle-orm'
import {
  // Base
  departments,
  officeUnits,
  // Auth
  profiles,
  roles,
  permissions,
  rolePermissions,
  userRoles,
  // HR
  employees,
  employeeDepartments,
  onboardings,
  onboardingTasks,
  attendance,
  attendanceCorrections,
  leaveRequests,
  // Recruitment
  jobPortals,
  jobRoles,
  jobPostings,
  jobPostingPortals,
  candidates,
  applications,
  interviews,
  evaluations,
  // Projects
  projects,
  projectMembers,
  tasks,
  // Contacts
  contacts,
  // Calls
  calls,
  // Workspace
  trainings,
  personalDocuments,
  personalNotes,
  meetingNotes,
  goals,
  dailyReports,
  knowledgeBaseArticles,
} from './schema'

// ============================================================================
// DEPARTMENT RELATIONS
// ============================================================================

// ============================================================================
// OFFICE UNITS RELATIONS
// ============================================================================

export const officeUnitsRelations = relations(officeUnits, ({ many }) => ({
  profiles: many(profiles),
}))

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  // Self-referential hierarchy
  parent: one(departments, {
    fields: [departments.parentId],
    references: [departments.id],
    relationName: 'departmentHierarchy',
  }),
  children: many(departments, { relationName: 'departmentHierarchy' }),
  // Manager (profile)
  manager: one(profiles, {
    fields: [departments.managerId],
    references: [profiles.id],
  }),
  // Related entities
  profiles: many(profiles),
  jobRoles: many(jobRoles),
  jobPostings: many(jobPostings),
  employeeDepartments: many(employeeDepartments),
}))

// ============================================================================
// PROFILE RELATIONS
// ============================================================================

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  // Department
  department: one(departments, {
    fields: [profiles.departmentId],
    references: [departments.id],
  }),
  // Office unit (TODO: uncomment after adding office_unit_id column to database)
  // officeUnit: one(officeUnits, {
  //   fields: [profiles.officeUnitId],
  //   references: [officeUnits.id],
  // }),
  // Manager hierarchy (self-referential)
  manager: one(profiles, {
    fields: [profiles.managerId],
    references: [profiles.id],
    relationName: 'managerHierarchy',
  }),
  directReports: many(profiles, { relationName: 'managerHierarchy' }),
  // Custom roles (future permission matrix)
  userRoles: many(userRoles),
  // HR
  employee: one(employees, {
    fields: [profiles.id],
    references: [employees.profileId],
  }),
  attendanceRecords: many(attendance),
  leaveRequests: many(leaveRequests),
  // Projects
  projectsOwned: many(projects),
  projectMemberships: many(projectMembers),
  tasksAssigned: many(tasks),
  // Calls
  callsAssigned: many(calls),
  // Workspace
  trainings: many(trainings),
  personalDocuments: many(personalDocuments),
  personalNotes: many(personalNotes),
  meetingNotes: many(meetingNotes),
  goals: many(goals),
  dailyReports: many(dailyReports),
  knowledgeBaseArticles: many(knowledgeBaseArticles),
}))

// ============================================================================
// ROLE & PERMISSION RELATIONS
// ============================================================================

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}))

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(profiles, {
    fields: [userRoles.userId],
    references: [profiles.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  assignedByUser: one(profiles, {
    fields: [userRoles.assignedBy],
    references: [profiles.id],
    relationName: 'assignedByUser',
  }),
}))

// ============================================================================
// HR RELATIONS
// ============================================================================

export const employeesRelations = relations(employees, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [employees.profileId],
    references: [profiles.id],
  }),
  departments: many(employeeDepartments),
  onboardings: many(onboardings),
}))

export const employeeDepartmentsRelations = relations(
  employeeDepartments,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeDepartments.employeeId],
      references: [employees.id],
    }),
    department: one(departments, {
      fields: [employeeDepartments.departmentId],
      references: [departments.id],
    }),
  })
)

export const onboardingsRelations = relations(onboardings, ({ one, many }) => ({
  employee: one(employees, {
    fields: [onboardings.employeeId],
    references: [employees.id],
  }),
  assignedTo: one(profiles, {
    fields: [onboardings.assignedToId],
    references: [profiles.id],
  }),
  tasks: many(onboardingTasks),
}))

export const onboardingTasksRelations = relations(onboardingTasks, ({ one }) => ({
  onboarding: one(onboardings, {
    fields: [onboardingTasks.onboardingId],
    references: [onboardings.id],
  }),
  assignedTo: one(profiles, {
    fields: [onboardingTasks.assignedToId],
    references: [profiles.id],
  }),
}))

export const attendanceRelations = relations(attendance, ({ one, many }) => ({
  user: one(profiles, {
    fields: [attendance.userId],
    references: [profiles.id],
  }),
  corrections: many(attendanceCorrections),
}))

export const attendanceCorrectionsRelations = relations(
  attendanceCorrections,
  ({ one }) => ({
    attendance: one(attendance, {
      fields: [attendanceCorrections.attendanceId],
      references: [attendance.id],
    }),
    requestedBy: one(profiles, {
      fields: [attendanceCorrections.requestedById],
      references: [profiles.id],
    }),
    reviewedBy: one(profiles, {
      fields: [attendanceCorrections.reviewedById],
      references: [profiles.id],
      relationName: 'reviewedByUser',
    }),
  })
)

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  user: one(profiles, {
    fields: [leaveRequests.userId],
    references: [profiles.id],
  }),
  approvedBy: one(profiles, {
    fields: [leaveRequests.approvedById],
    references: [profiles.id],
    relationName: 'approvedByUser',
  }),
}))

// ============================================================================
// RECRUITMENT RELATIONS
// ============================================================================

export const jobPortalsRelations = relations(jobPortals, ({ many }) => ({
  postings: many(jobPostingPortals),
}))

export const jobRolesRelations = relations(jobRoles, ({ one, many }) => ({
  department: one(departments, {
    fields: [jobRoles.departmentId],
    references: [departments.id],
  }),
  postings: many(jobPostings),
}))

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  jobRole: one(jobRoles, {
    fields: [jobPostings.jobRoleId],
    references: [jobRoles.id],
  }),
  department: one(departments, {
    fields: [jobPostings.departmentId],
    references: [departments.id],
  }),
  postedBy: one(profiles, {
    fields: [jobPostings.postedById],
    references: [profiles.id],
  }),
  portals: many(jobPostingPortals),
  applications: many(applications),
}))

export const jobPostingPortalsRelations = relations(
  jobPostingPortals,
  ({ one }) => ({
    jobPosting: one(jobPostings, {
      fields: [jobPostingPortals.jobPostingId],
      references: [jobPostings.id],
    }),
    jobPortal: one(jobPortals, {
      fields: [jobPostingPortals.jobPortalId],
      references: [jobPortals.id],
    }),
  })
)

export const candidatesRelations = relations(candidates, ({ many }) => ({
  applications: many(applications),
}))

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  candidate: one(candidates, {
    fields: [applications.candidateId],
    references: [candidates.id],
  }),
  jobPosting: one(jobPostings, {
    fields: [applications.jobPostingId],
    references: [jobPostings.id],
  }),
  assignedTo: one(profiles, {
    fields: [applications.assignedToId],
    references: [profiles.id],
  }),
  interviews: many(interviews),
}))

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  interviewer: one(profiles, {
    fields: [interviews.interviewerId],
    references: [profiles.id],
  }),
  evaluations: many(evaluations),
}))

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  interview: one(interviews, {
    fields: [evaluations.interviewId],
    references: [interviews.id],
  }),
  evaluatedBy: one(profiles, {
    fields: [evaluations.evaluatedById],
    references: [profiles.id],
  }),
}))

// ============================================================================
// PROJECT RELATIONS
// ============================================================================

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [projects.ownerId],
    references: [profiles.id],
  }),
  members: many(projectMembers),
  tasks: many(tasks),
}))

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(profiles, {
    fields: [projectMembers.userId],
    references: [profiles.id],
  }),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  // Self-referential hierarchy
  parent: one(tasks, {
    fields: [tasks.parentId],
    references: [tasks.id],
    relationName: 'taskHierarchy',
  }),
  subtasks: many(tasks, { relationName: 'taskHierarchy' }),
  // Assignment
  assignedTo: one(profiles, {
    fields: [tasks.assignedToId],
    references: [profiles.id],
  }),
}))

// ============================================================================
// CONTACT RELATIONS
// ============================================================================

export const contactsRelations = relations(contacts, ({ many }) => ({
  calls: many(calls),
}))

// ============================================================================
// CALL RELATIONS
// ============================================================================

export const callsRelations = relations(calls, ({ one }) => ({
  contact: one(contacts, {
    fields: [calls.contactId],
    references: [contacts.id],
  }),
  assignedTo: one(profiles, {
    fields: [calls.assignedToId],
    references: [profiles.id],
  }),
}))

// ============================================================================
// WORKSPACE RELATIONS
// ============================================================================

export const trainingsRelations = relations(trainings, ({ one }) => ({
  user: one(profiles, {
    fields: [trainings.userId],
    references: [profiles.id],
  }),
}))

export const personalDocumentsRelations = relations(
  personalDocuments,
  ({ one }) => ({
    user: one(profiles, {
      fields: [personalDocuments.userId],
      references: [profiles.id],
    }),
  })
)

export const personalNotesRelations = relations(personalNotes, ({ one }) => ({
  user: one(profiles, {
    fields: [personalNotes.userId],
    references: [profiles.id],
  }),
}))

export const meetingNotesRelations = relations(meetingNotes, ({ one }) => ({
  user: one(profiles, {
    fields: [meetingNotes.userId],
    references: [profiles.id],
  }),
}))

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(profiles, {
    fields: [goals.userId],
    references: [profiles.id],
  }),
}))

export const dailyReportsRelations = relations(dailyReports, ({ one }) => ({
  user: one(profiles, {
    fields: [dailyReports.userId],
    references: [profiles.id],
  }),
}))

export const knowledgeBaseArticlesRelations = relations(
  knowledgeBaseArticles,
  ({ one }) => ({
    createdBy: one(profiles, {
      fields: [knowledgeBaseArticles.createdById],
      references: [profiles.id],
    }),
  })
)
