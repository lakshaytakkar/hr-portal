/**
 * Tasks Module Adapters
 * Convert between database types and frontend task types
 */

import type { Task as DbTask, Profile } from '../schema'
import type {
  TaskLevel0,
  TaskLevel1,
  TaskLevel2,
  TaskResource,
} from '@/lib/types/task'
import { getAvatarForUser } from '@/lib/utils/avatars'

interface TaskWithRelations extends DbTask {
  assignedTo?: Profile | null
  children?: TaskWithRelations[]
}

/**
 * Convert a Profile to a TaskResource
 */
function toTaskResource(profile: Profile | null | undefined): TaskResource | undefined {
  if (!profile) return undefined
  return {
    id: profile.id,
    name: profile.fullName ?? 'Unknown',
    email: profile.email,
    avatar: profile.avatarUrl ?? getAvatarForUser(profile.fullName ?? 'U'),
  }
}

/**
 * Convert a database Task (level 2) to frontend TaskLevel2
 */
function toFrontendTaskLevel2(task: TaskWithRelations): TaskLevel2 {
  return {
    id: task.id,
    level: 2,
    name: task.name,
    description: task.description ?? undefined,
    status: task.status,
    priority: task.priority,
    resource: toTaskResource(task.assignedTo),
    figmaLink: task.figmaLink ?? undefined,
    dueDate: task.dueDate ?? undefined,
    commentsCount: task.commentsCount,
    progress: task.progress,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}

/**
 * Convert a database Task (level 1) to frontend TaskLevel1
 */
function toFrontendTaskLevel1(task: TaskWithRelations): TaskLevel1 {
  const subtasks = task.children
    ?.filter((child) => child.level === 2)
    .map(toFrontendTaskLevel2)
    .sort((a, b) => (task.sortOrder ?? 0) - (task.sortOrder ?? 0))

  return {
    id: task.id,
    level: 1,
    name: task.name,
    description: task.description ?? undefined,
    status: task.status,
    priority: task.priority,
    resource: toTaskResource(task.assignedTo),
    figmaLink: task.figmaLink ?? undefined,
    dueDate: task.dueDate ?? undefined,
    commentsCount: task.commentsCount,
    progress: task.progress,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    subtasks: subtasks?.length ? subtasks : undefined,
  }
}

/**
 * Convert a database Task (level 0) to frontend TaskLevel0
 */
export function toFrontendTaskLevel0(task: TaskWithRelations): TaskLevel0 {
  const subtasks = task.children
    ?.filter((child) => child.level === 1)
    .map(toFrontendTaskLevel1)
    .sort((a, b) => (task.sortOrder ?? 0) - (task.sortOrder ?? 0))

  return {
    id: task.id,
    level: 0,
    name: task.name,
    description: task.description ?? undefined,
    status: task.status,
    priority: task.priority,
    resource: toTaskResource(task.assignedTo),
    figmaLink: task.figmaLink ?? undefined,
    dueDate: task.dueDate ?? undefined,
    commentsCount: task.commentsCount,
    progress: task.progress,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    subtasks: subtasks?.length ? subtasks : undefined,
  }
}

/**
 * Build a hierarchical task tree from a flat list of tasks
 */
export function buildTaskTree(flatTasks: TaskWithRelations[]): TaskLevel0[] {
  // Create a map for quick lookup
  const taskMap = new Map<string, TaskWithRelations>()
  flatTasks.forEach((task) => {
    taskMap.set(task.id, { ...task, children: [] })
  })

  // Build the hierarchy
  const rootTasks: TaskWithRelations[] = []

  flatTasks.forEach((task) => {
    const taskWithChildren = taskMap.get(task.id)!
    if (task.parentId) {
      const parent = taskMap.get(task.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(taskWithChildren)
      }
    } else {
      rootTasks.push(taskWithChildren)
    }
  })

  // Sort and convert to frontend format
  return rootTasks
    .filter((task) => task.level === 0)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(toFrontendTaskLevel0)
}

/**
 * Convert a flat list of tasks to frontend hierarchical format
 */
export function toFrontendTasks(tasks: TaskWithRelations[]): TaskLevel0[] {
  return buildTaskTree(tasks)
}
