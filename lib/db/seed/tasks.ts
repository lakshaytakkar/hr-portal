/**
 * Tasks Seed Data
 * Hierarchical tasks with 3 levels (0, 1, 2)
 */

import type { Database } from '../index'
import {
  tasks,
  type Task,
  type Project,
  type Profile,
} from '../schema'
import { profileIds } from './profiles'

interface TaskSeedData {
  name: string
  description?: string
  status: 'not-started' | 'in-progress' | 'in-review' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  level: number
  progress?: number
  assignedToId?: string
  figmaLink?: string
  subtasks?: TaskSeedData[]
}

// Using real StartupSquad employees:
// - love: Tech Intern (Engineering)
// - rudraksh: Video Editor (Marketing - handles design)
// - prachi_bisht: HR Executive
// - aditya: Operations Executive

const taskSeedData: TaskSeedData[] = [
  {
    name: 'Frontend Development',
    description: 'All frontend-related development tasks including UI components, pages, and integrations',
    status: 'in-progress',
    priority: 'high',
    level: 0,
    progress: 35,
    assignedToId: profileIds.love, // Tech Intern
    subtasks: [
      {
        name: 'Design System Implementation',
        description: 'Implement reusable UI components based on design system',
        status: 'in-progress',
        priority: 'high',
        level: 1,
        progress: 60,
        assignedToId: profileIds.love,
        subtasks: [
          {
            name: 'Button Components',
            description: 'Create all button variants (primary, secondary, outline, etc.)',
            status: 'completed',
            priority: 'high',
            level: 2,
            progress: 100,
            assignedToId: profileIds.love,
          },
          {
            name: 'Form Components',
            description: 'Implement input, select, checkbox, radio, and textarea components',
            status: 'in-progress',
            priority: 'high',
            level: 2,
            progress: 50,
            assignedToId: profileIds.love,
          },
          {
            name: 'Table Component',
            description: 'Create data table with sorting, filtering, and pagination',
            status: 'not-started',
            priority: 'medium',
            level: 2,
          },
        ],
      },
      {
        name: 'Authentication Pages',
        description: 'Sign in, sign up, forgot password, and password reset flows',
        status: 'in-progress',
        priority: 'high',
        level: 1,
        progress: 70,
        assignedToId: profileIds.love,
        subtasks: [
          {
            name: 'Sign In Page',
            description: 'Implement sign in form with email/password and social login options',
            status: 'completed',
            priority: 'high',
            level: 2,
            progress: 100,
            assignedToId: profileIds.love,
          },
          {
            name: 'Sign Up Page',
            description: 'Create registration form with validation',
            status: 'completed',
            priority: 'high',
            level: 2,
            progress: 100,
            assignedToId: profileIds.love,
          },
          {
            name: 'Forgot Password Flow',
            description: 'Implement password recovery flow with email verification',
            status: 'in-progress',
            priority: 'medium',
            level: 2,
            progress: 40,
            assignedToId: profileIds.love,
          },
        ],
      },
      {
        name: 'Dashboard Pages',
        description: 'Main dashboard and feature pages',
        status: 'not-started',
        priority: 'high',
        level: 1,
        assignedToId: profileIds.love,
      },
      {
        name: 'Employee Management Pages',
        description: 'Employee list, profile, add/edit employee pages',
        status: 'not-started',
        priority: 'high',
        level: 1,
        assignedToId: profileIds.love,
      },
    ],
  },
  {
    name: 'Backend Development',
    description: 'API development, database setup, authentication, and business logic',
    status: 'not-started',
    priority: 'high',
    level: 0,
    assignedToId: profileIds.love,
    subtasks: [
      {
        name: 'Database Schema',
        description: 'Design and implement database schema for HR portal',
        status: 'completed',
        priority: 'high',
        level: 1,
        progress: 100,
        assignedToId: profileIds.love,
        subtasks: [
          {
            name: 'User & Authentication Tables',
            description: 'Create users, sessions, and password reset tables',
            status: 'completed',
            priority: 'high',
            level: 2,
            progress: 100,
          },
          {
            name: 'Employee Management Tables',
            description: 'Design tables for employees, departments, roles, and hierarchies',
            status: 'completed',
            priority: 'high',
            level: 2,
            progress: 100,
          },
        ],
      },
      {
        name: 'Authentication API',
        description: 'Implement JWT-based authentication endpoints',
        status: 'not-started',
        priority: 'high',
        level: 1,
        assignedToId: profileIds.love,
      },
      {
        name: 'Employee Management API',
        description: 'CRUD endpoints for employee management',
        status: 'not-started',
        priority: 'high',
        level: 1,
      },
    ],
  },
  {
    name: 'Design & UX',
    description: 'UI/UX design, Figma mockups, and design system creation',
    status: 'in-progress',
    priority: 'high',
    level: 0,
    progress: 75,
    assignedToId: profileIds.rudraksh, // Video Editor (handles design)
    subtasks: [
      {
        name: 'Design System',
        description: 'Create comprehensive design system in Figma',
        status: 'completed',
        priority: 'high',
        level: 1,
        progress: 100,
        assignedToId: profileIds.rudraksh,
        figmaLink: 'https://figma.com/design/example/design-system',
      },
      {
        name: 'Authentication Pages Design',
        description: 'Design sign in, sign up, and password recovery pages',
        status: 'completed',
        priority: 'high',
        level: 1,
        progress: 100,
        assignedToId: profileIds.rudraksh,
      },
      {
        name: 'Dashboard Layout Design',
        description: 'Design main dashboard layout with sidebar and navigation',
        status: 'in-progress',
        priority: 'high',
        level: 1,
        progress: 80,
        assignedToId: profileIds.rudraksh,
        figmaLink: 'https://figma.com/design/example/dashboard-layout',
      },
    ],
  },
  {
    name: 'Testing & QA',
    description: 'Unit tests, integration tests, E2E tests, and quality assurance',
    status: 'not-started',
    priority: 'medium',
    level: 0,
    assignedToId: profileIds.prachi_bisht, // HR Executive
    subtasks: [
      {
        name: 'Unit Tests',
        description: 'Write unit tests for utility functions and components',
        status: 'not-started',
        priority: 'medium',
        level: 1,
      },
      {
        name: 'Integration Tests',
        description: 'Test API endpoints and database interactions',
        status: 'not-started',
        priority: 'medium',
        level: 1,
      },
      {
        name: 'E2E Tests',
        description: 'End-to-end testing of critical user flows',
        status: 'not-started',
        priority: 'low',
        level: 1,
      },
    ],
  },
]

export async function seedTasks(
  db: Database,
  projectsResult: Project[],
  profiles: Profile[]
): Promise<Task[]> {
  const hrPortalProject = projectsResult.find((p) => p.name === 'HR Portal Development')
  const allTasks: Task[] = []

  async function insertTaskWithChildren(
    taskData: TaskSeedData,
    parentId: string | null,
    sortOrder: number
  ): Promise<void> {
    const [insertedTask] = await db
      .insert(tasks)
      .values({
        projectId: hrPortalProject?.id,
        parentId: parentId,
        name: taskData.name,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        level: taskData.level,
        progress: taskData.progress ?? 0,
        assignedToId: taskData.assignedToId,
        figmaLink: taskData.figmaLink,
        sortOrder: sortOrder,
      })
      .returning()

    if (insertedTask) {
      allTasks.push(insertedTask)

      if (taskData.subtasks) {
        for (let i = 0; i < taskData.subtasks.length; i++) {
          await insertTaskWithChildren(taskData.subtasks[i], insertedTask.id, i)
        }
      }
    }
  }

  // Insert all tasks hierarchically
  for (let i = 0; i < taskSeedData.length; i++) {
    await insertTaskWithChildren(taskSeedData[i], null, i)
  }

  return allTasks
}
