/**
 * Projects Seed Data - StartupSquad
 * - Projects
 * - Project Members
 */

import type { Database } from '../index'
import {
  projects,
  projectMembers,
  type Project,
  type Profile,
} from '../schema'
import { profileIds } from './profiles'

export async function seedProjects(
  db: Database,
  profiles: Profile[]
): Promise<Project[]> {
  const projectSeedData = [
    {
      name: 'SiteCraft - Client Web Development',
      description: 'Complete web development project including frontend, backend, and deployment',
      status: 'active' as const,
      priority: 'high' as const,
      progress: 50,
      startDate: '2024-07-15',
      dueDate: '2024-08-20',
      ownerId: profileIds.akansha_pandey, // Operations Manager
    },
    {
      name: 'HR Portal Development',
      description: 'Complete HR management system with employee management, attendance tracking, and payroll features',
      status: 'active' as const,
      priority: 'high' as const,
      progress: 65,
      startDate: '2024-01-01',
      dueDate: '2024-06-30',
      ownerId: profileIds.prachi_bisht, // HR Executive
    },
    {
      name: 'Digital Marketing Campaign - Q4',
      description: 'Launch marketing campaign for Q4 client acquisitions',
      status: 'active' as const,
      priority: 'high' as const,
      progress: 35,
      startDate: '2024-10-01',
      dueDate: '2024-12-31',
      ownerId: profileIds.naveen_rawat, // Meta Ads Executive
    },
    {
      name: 'Sales Pipeline Automation',
      description: 'Automate sales processes and CRM integration',
      status: 'planning' as const,
      priority: 'medium' as const,
      progress: 15,
      startDate: '2024-11-01',
      dueDate: '2025-02-28',
      ownerId: profileIds.himanshu_pandey, // Sales Executive
    },
    {
      name: 'Video Content Production',
      description: 'Create promotional videos and content for social media',
      status: 'active' as const,
      priority: 'medium' as const,
      progress: 40,
      startDate: '2024-09-01',
      dueDate: '2024-11-30',
      ownerId: profileIds.rudraksh, // Video Editor
    },
    {
      name: 'Rewari Office Tech Setup',
      description: 'IT infrastructure and system setup for Rewari office',
      status: 'completed' as const,
      priority: 'high' as const,
      progress: 100,
      startDate: '2024-06-01',
      endDate: '2024-07-31',
      ownerId: profileIds.vikash_yadav, // Rewari Operations Manager
    },
  ]

  const projectsResult = await db
    .insert(projects)
    .values(projectSeedData)
    .returning()

  // Create project member assignments
  const memberAssignments = [
    // SiteCraft project team
    { projectId: projectsResult[0]?.id!, userId: profileIds.akansha_pandey, role: 'owner' as const },
    { projectId: projectsResult[0]?.id!, userId: profileIds.neetu_kumari, role: 'member' as const },
    { projectId: projectsResult[0]?.id!, userId: profileIds.love, role: 'member' as const },

    // HR Portal team
    { projectId: projectsResult[1]?.id!, userId: profileIds.prachi_bisht, role: 'owner' as const },
    { projectId: projectsResult[1]?.id!, userId: profileIds.vikash_yadav, role: 'member' as const },
    { projectId: projectsResult[1]?.id!, userId: profileIds.love, role: 'member' as const },

    // Digital Marketing Campaign team
    { projectId: projectsResult[2]?.id!, userId: profileIds.naveen_rawat, role: 'owner' as const },
    { projectId: projectsResult[2]?.id!, userId: profileIds.rudraksh, role: 'member' as const },

    // Sales Pipeline team
    { projectId: projectsResult[3]?.id!, userId: profileIds.himanshu_pandey, role: 'owner' as const },
    { projectId: projectsResult[3]?.id!, userId: profileIds.abhinandan, role: 'member' as const },
    { projectId: projectsResult[3]?.id!, userId: profileIds.simran, role: 'member' as const },

    // Video Content team
    { projectId: projectsResult[4]?.id!, userId: profileIds.rudraksh, role: 'owner' as const },
    { projectId: projectsResult[4]?.id!, userId: profileIds.naveen_rawat, role: 'member' as const },

    // Rewari Tech Setup team
    { projectId: projectsResult[5]?.id!, userId: profileIds.vikash_yadav, role: 'owner' as const },
    { projectId: projectsResult[5]?.id!, userId: profileIds.yash_jain, role: 'member' as const },
    { projectId: projectsResult[5]?.id!, userId: profileIds.krish_verma, role: 'member' as const },
  ]

  await db.insert(projectMembers).values(memberAssignments)

  return projectsResult
}
