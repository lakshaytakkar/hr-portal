/**
 * Projects Module Adapters
 * Convert between database types and frontend project types
 */

import type {
  Project as DbProject,
  ProjectMember as DbProjectMember,
  Profile,
} from '../schema'
import type {
  Project as FrontendProject,
  ProjectMember as FrontendProjectMember,
} from '@/lib/types/project'
import { getAvatarForUser } from '@/lib/utils/avatars'

/**
 * Convert a database ProjectMember to frontend ProjectMember
 */
export function toFrontendProjectMember(
  member: DbProjectMember & { user: Profile }
): FrontendProjectMember {
  return {
    id: member.user.id,
    name: member.user.fullName ?? 'Unknown',
    email: member.user.email,
    avatar: member.user.avatarUrl ?? getAvatarForUser(member.user.fullName ?? 'U'),
    role: member.role,
  }
}

interface ProjectWithRelations extends DbProject {
  owner: Profile
  members: Array<DbProjectMember & { user: Profile }>
  _count?: {
    tasks: number
    completedTasks: number
  }
}

/**
 * Convert a database Project to frontend Project
 */
export function toFrontendProject(project: ProjectWithRelations): FrontendProject {
  const owner = project.owner

  return {
    id: project.id,
    name: project.name,
    description: project.description ?? undefined,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    startDate: project.startDate ?? '',
    endDate: project.endDate ?? undefined,
    dueDate: project.dueDate ?? undefined,
    team: project.members.map(toFrontendProjectMember),
    owner: {
      id: owner.id,
      name: owner.fullName ?? 'Unknown',
      email: owner.email,
      avatar: owner.avatarUrl ?? getAvatarForUser(owner.fullName ?? 'U'),
      role: 'owner',
    },
    tasksCount: project._count?.tasks,
    completedTasksCount: project._count?.completedTasks,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

/**
 * Convert an array of projects to frontend format
 */
export function toFrontendProjects(
  projects: ProjectWithRelations[]
): FrontendProject[] {
  return projects.map(toFrontendProject)
}
