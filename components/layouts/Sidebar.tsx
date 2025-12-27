"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Briefcase,
  Calendar,
  Clock,
  CheckSquare,
  Folder,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Phone,
  Key,
  Users,
  TrendingUp,
  Settings,
  Shield,
  BarChart3,
  UserCheck,
  UserPlus,
  FileText,
  ClipboardList,
  MessageSquare,
  Globe,
  UserCog,
  List,
  ClipboardCheck,
  Target,
  Award,
  StickyNote,
  Search,
  Building2,
  PieChart,
  FileBarChart,
  Receipt,
  DollarSign,
  Wallet,
  ArrowLeftRight,
  Store,
  Calculator,
  Mail,
  Zap,
  Layers,
  Megaphone,
  Activity,
  LayoutDashboard,
  Link as LinkIcon,
  Edit,
  FileEdit,
  Network,
  Rocket,
  Code,
  Grid3x3,
  Package,
  Palette,
  Sparkles,
  ExternalLink,
  FileCheck,
  NotebookPen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  section?: string
  subSection?: string
  description?: string
}

interface SidebarProps {
  selectedRoles: string[]
  selectedDepartments: string[]
  isSuperAdminView: boolean
  isCeoView: boolean
  isFilterHeaderCollapsed?: boolean
}

export function Sidebar({ selectedRoles, selectedDepartments, isSuperAdminView, isCeoView, isFilterHeaderCollapsed = false }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  // Base menu items - always visible
  const baseMenuItems: MenuItem[] = [
    // Dashboard
    { label: "Dashboard", href: "/", icon: Home, section: "dashboard", description: "View your overview and quick stats" },
    
    // My Workspace - Work
    { label: "Projects", href: "/projects", icon: Briefcase, section: "my-workspace", subSection: "work", description: "Manage and track your projects" },
    { label: "Tasks", href: "/tasks", icon: CheckSquare, section: "my-workspace", subSection: "work", description: "View and update your assigned tasks" },
    { label: "Calls", href: "/my-calls", icon: Phone, section: "my-workspace", subSection: "work", description: "Track and manage your sales and outreach calls" },
    { label: "Training", href: "/my-training", icon: GraduationCap, section: "my-workspace", subSection: "work", description: "Access daily training materials and courses" },
    { label: "Daily Reporting", href: "/my-daily-reporting", icon: FileCheck, section: "my-workspace", subSection: "work", description: "Submit and track your daily reports" },
    { label: "Meeting Notes", href: "/my-meeting-notes", icon: NotebookPen, section: "my-workspace", subSection: "work", description: "View and manage your meeting notes" },
    
    // My Workspace - Time & Attendance
    { label: "Attendance", href: "/my-attendance", icon: Clock, section: "my-workspace", subSection: "time", description: "Check in, check out, and view attendance history" },
    { label: "Leave Requests", href: "/my-leave-requests", icon: CalendarDays, section: "my-workspace", subSection: "time", description: "Request time off and view leave status" },
    { label: "Calendar", href: "/my-calendar", icon: Calendar, section: "my-workspace", subSection: "time", description: "View your schedule and upcoming events" },
    
    // My Workspace - Personal
    { label: "Documents", href: "/my-documents", icon: Folder, section: "my-workspace", subSection: "personal", description: "Access and manage your files" },
    { label: "Goals", href: "/my-goals", icon: Target, section: "my-workspace", subSection: "personal", description: "View and manage your goals and OKRs" },
    { label: "Performance Reviews", href: "/my-performance-reviews", icon: Award, section: "my-workspace", subSection: "personal", description: "View your performance reviews and feedback" },
    { label: "Notes", href: "/my-notes", icon: StickyNote, section: "my-workspace", subSection: "personal", description: "Your personal notes" },
    
    // Team & Organization
    { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen, section: "team", description: "Browse company documentation and guides" },
    { label: "Resources", href: "/my-resources", icon: Key, section: "team", description: "Access external apps, credentials, and integrations" },
  ]

  // Team Management items (for managers)
  const teamManagementItems: MenuItem[] = [
    { label: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard, section: "team-management", description: "Team metrics and performance overview" },
    { label: "Team Tasks", href: "/tasks", icon: CheckSquare, section: "team-management", description: "View and manage team tasks" },
    { label: "Team Projects", href: "/projects", icon: Briefcase, section: "team-management", description: "View and manage team projects" },
    { label: "Team Attendance", href: "/manager/attendance", icon: Clock, section: "team-management", description: "Track team attendance and approvals" },
    { label: "Team Performance", href: "/manager/performance", icon: TrendingUp, section: "team-management", description: "View team performance metrics" },
  ]

  // Sales department pages
  const salesPages = {
    executive: [
      { label: "Dashboard", href: "/sales/dashboard", icon: LayoutDashboard, description: "Sales metrics and revenue overview" },
      { label: "My Leads", href: "/sales/leads?view=my", icon: TrendingUp, description: "Manage your sales leads" },
      { label: "My Pipeline", href: "/sales/pipeline?view=my", icon: BarChart3, description: "Track your sales pipeline" },
      { label: "My Deals", href: "/sales/deals?view=my", icon: Briefcase, description: "Manage your deals" },
      { label: "My Calls", href: "/my-calls", icon: Phone, description: "Track and manage your sales and outreach calls" },
      { label: "My Quotations", href: "/sales/quotations?view=my", icon: FileText, description: "Create and track your quotations" },
      { label: "Templates", href: "/sales/templates", icon: FileEdit, description: "Access quotation and email templates" },
    ],
    manager: [
      { label: "Dashboard", href: "/sales/dashboard", icon: LayoutDashboard, description: "Sales metrics and revenue overview" },
      { label: "Leads", href: "/sales/leads", icon: TrendingUp, description: "View and manage team leads" },
      { label: "Pipeline", href: "/sales/pipeline", icon: BarChart3, description: "Track team sales pipeline" },
      { label: "Deals", href: "/sales/deals", icon: Briefcase, description: "Manage team deals" },
      { label: "Calls", href: "/my-calls", icon: Phone, description: "View and manage team sales calls" },
      { label: "Quotations", href: "/sales/quotations", icon: FileText, description: "View and manage team quotations" },
      { label: "Templates", href: "/sales/templates", icon: FileEdit, description: "Access quotation and email templates" },
      { label: "Automation Logs", href: "/sales/automation-logs", icon: Activity, description: "Track team automation activity and messages" },
    ],
  }

  // HR & Recruitment pages
  const hrRecruitmentPages = {
    hr: [
      { label: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard, description: "HR metrics and employee overview" },
      { label: "Employees", href: "/hr/employees", icon: Users, description: "Manage employees" },
      { label: "Onboarding", href: "/hr/onboarding", icon: UserCheck, description: "Manage employee onboarding" },
      { label: "Templates", href: "/hr/templates", icon: FileText, description: "Manage HR templates" },
    ],
    recruitment: [
      { label: "Candidates", href: "/recruitment/candidates", icon: UserPlus, description: "Manage candidates" },
      { label: "Applications", href: "/recruitment/applications", icon: ClipboardList, description: "View and manage job applications" },
      { label: "Interviews", href: "/recruitment/interviews", icon: MessageSquare, description: "Schedule and manage interviews" },
      { label: "Job Postings", href: "/recruitment/job-postings", icon: List, description: "Create and manage job postings" },
      { label: "Job Roles", href: "/recruitment/job-roles", icon: UserCog, description: "Define and manage job roles" },
      { label: "Job Portals", href: "/recruitment/job-portals", icon: Globe, description: "Manage job portal integrations" },
      { label: "Evaluations", href: "/recruitment/evaluations", icon: ClipboardCheck, description: "Review candidate evaluations" },
    ],
  }

  // Finance pages (Accountant access)
  const financePages = {
    accountant: [
      { label: "Dashboard", href: "/finance/dashboard", icon: LayoutDashboard, description: "Financial metrics and transaction overview" },
      { label: "Sales Orders", href: "/finance/sales-orders", icon: ClipboardList, description: "Manage sales orders and convert to invoices" },
      { label: "Invoices", href: "/finance/invoices", icon: Receipt, description: "Manage invoices, payments, and billing" },
      { label: "Expenses", href: "/finance/expenses", icon: DollarSign, description: "Track and approve expenses" },
      { label: "Payroll", href: "/finance/payroll", icon: Wallet, description: "Employee payroll management" },
      { label: "Transactions", href: "/finance/transactions", icon: ArrowLeftRight, description: "All financial transactions" },
      { label: "Vendors", href: "/finance/vendors", icon: Store, description: "Vendor management" },
      { label: "Taxes", href: "/finance/taxes", icon: Calculator, description: "Tax management and filing" },
      { label: "Financial Reports", href: "/finance/reports", icon: BarChart3, description: "P&L, balance sheets, and financial reports" },
    ],
  }

  // Marketing pages (Marketing role access) - organized by sub-sections
  const marketingPages = {
    dashboard: [
      { label: "Dashboard", href: "/marketing/dashboard", icon: LayoutDashboard, description: "Campaign performance and metrics overview" },
    ],
    templates: [
      { label: "Email Templates", href: "/marketing/email-templates", icon: Mail, description: "Create and manage reusable email templates" },
      { label: "WhatsApp Templates", href: "/marketing/whatsapp-templates", icon: MessageSquare, description: "Create and manage reusable WhatsApp templates" },
    ],
    automations: [
      { label: "Email Automations", href: "/marketing/email-automations", icon: Zap, description: "Create automated email workflows triggered by lead events" },
      { label: "WhatsApp Automations", href: "/marketing/whatsapp-automations", icon: Zap, description: "Create automated WhatsApp workflows triggered by lead events" },
      { label: "Drips", href: "/marketing/drips", icon: Layers, description: "Create email sequence campaigns (multi-step automated sequences)" },
    ],
    campaigns: [
      { label: "Campaigns", href: "/marketing/campaigns", icon: Megaphone, description: "Multi-channel campaign management (email + WhatsApp)" },
      { label: "Automation Logs", href: "/marketing/automation-logs", icon: Activity, description: "Track sent messages, opens, clicks, responses" },
    ],
    content: [
      { label: "Content Editor", href: "/marketing/content-editor", icon: Edit, description: "Edit website content, pages, blog posts" },
      { label: "Page Management", href: "/marketing/pages", icon: FileText, description: "Create, edit, delete website pages" },
    ],
  }

  // Analytics pages (Marketing role access)
  const analyticsPages = {
    analytics: [
      { label: "Dashboard", href: "/analytics/dashboard", icon: LayoutDashboard, description: "Overview dashboard for all managed websites" },
      { label: "Website Traffic", href: "/analytics/website-traffic", icon: TrendingUp, description: "View website traffic analytics (visitors, page views, sessions)" },
      { label: "Conversion Tracking", href: "/analytics/conversions", icon: Target, description: "Track conversions, leads, and sales from websites" },
      { label: "Client Reports", href: "/analytics/client-reports", icon: FileBarChart, description: "Generate and manage client reports" },
      { label: "Domains", href: "/analytics/domains", icon: LinkIcon, description: "Manage domains, track expiry dates, DNS settings" },
    ],
  }

  // R&D pages (CEO/Managers access)
  const rndPages = {
    rnd: [
      { label: "Research Docs", href: "/rnd/research-docs", icon: BookOpen, description: "Research findings, papers, studies" },
      { label: "Mindmaps", href: "/rnd/mindmaps", icon: Network, description: "Visual research planning, brainstorming" },
      { label: "Financial Planning", href: "/rnd/financial-planning", icon: DollarSign, description: "Budget planning for new verticals" },
      { label: "New Verticals", href: "/rnd/new-verticals", icon: Rocket, description: "Exploring new business opportunities" },
      { label: "Suggestions", href: "/rnd/suggestions", icon: MessageSquare, description: "Enhancement suggestions for current systems" },
      { label: "Strategic Planning", href: "/rnd/strategic-planning", icon: Target, description: "High-level strategic initiatives" },
      { label: "Market Research", href: "/rnd/market-research", icon: Search, description: "Market analysis, competitor research" },
    ],
  }

  // Development pages (Developer role access) - grouped by type
  const developmentPages = {
    projects: [
      { label: "Projects", href: "/development/projects", icon: Briefcase, description: "Development projects and roadmap" },
      { label: "Tasks", href: "/development/tasks", icon: CheckSquare, description: "Development tasks and issues" },
    ],
    design: [
      { label: "Foundations", href: "/development/design-system/foundations", icon: Palette, description: "Design system foundations" },
      { label: "Components", href: "/development/design-system/components", icon: Code, description: "Component library" },
    ],
    resources: [
      { label: "Stack", href: "/development/stack", icon: Grid3x3, description: "Technology stack" },
      { label: "Prompts", href: "/development/prompts", icon: Sparkles, description: "AI prompts library" },
      { label: "UI Libraries", href: "/development/ui-libraries", icon: Package, description: "Component libraries" },
      { label: "External Apps", href: "/development/external-apps", icon: ExternalLink, description: "Quick links to external tools" },
    ],
    docs: [
      { label: "Docs", href: "/development/docs", icon: BookOpen, description: "Project documentation" },
      { label: "Credentials", href: "/development/credentials", icon: Key, description: "Environment variables and setup" },
    ],
  }

  // CEO view pages
  const ceoPages = {
    summary: [
      { label: "Executive Dashboard", href: "/ceo/dashboard", icon: Home, description: "Cross-department overview and executive summaries" },
      { label: "Sales Summary", href: "/ceo/sales-summary", icon: TrendingUp, description: "Sales department summary and metrics" },
      { label: "HR Summary", href: "/ceo/hr-summary", icon: UserCheck, description: "HR department summary and metrics" },
      { label: "Recruitment Summary", href: "/ceo/recruitment-summary", icon: UserPlus, description: "Recruitment pipeline summary" },
      { label: "Operations Summary", href: "/ceo/operations-summary", icon: Building2, description: "Operations and business metrics" },
    ],
    explorers: [
      { label: "All Projects", href: "/ceo/explorers/projects", icon: Briefcase, description: "Explore all projects across the organization" },
      { label: "All Tasks", href: "/ceo/explorers/tasks", icon: CheckSquare, description: "Explore all tasks across the organization" },
      { label: "All Calls", href: "/ceo/explorers/calls", icon: Phone, description: "Explore all calls across the organization" },
      { label: "All Employees", href: "/ceo/explorers/employees", icon: Users, description: "Explore all employees and teams" },
      { label: "All Deals", href: "/ceo/explorers/deals", icon: Briefcase, description: "Explore all deals across the organization" },
    ],
    controls: [
      { label: "Team Management", href: "/ceo/team-management", icon: Users, description: "Access all team management functions" },
      { label: "Department Oversight", href: "/ceo/department-oversight", icon: Building2, description: "Access all department dashboards" },
      { label: "Performance Analytics", href: "/ceo/performance-analytics", icon: PieChart, description: "View comprehensive performance analytics" },
      { label: "Reports & Insights", href: "/ceo/reports", icon: FileBarChart, description: "Generate and view executive reports" },
    ],
  }

  // Admin view pages
  const adminPages: MenuItem[] = [
    { label: "User Management", href: "/admin/users", icon: Users, section: "admin-view", description: "Manage users and roles" },
    { label: "Permissions", href: "/admin/permissions", icon: Shield, section: "admin-view", description: "Manage permission matrix" },
    { label: "System Settings", href: "/admin/settings", icon: Settings, section: "admin-view", description: "Configure system settings" },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3, section: "admin-view", description: "View system analytics and reports" },
  ]

  // Generate filtered menu items
  const getFilteredMenuItems = (): MenuItem[] => {
    const filtered: MenuItem[] = []
    
    // Filter baseMenuItems for sales executives and managers (remove Projects, Meeting Notes, Calls for executives only)
    const isSalesDept = selectedDepartments.includes("sales") && (selectedRoles.includes("executive") || selectedRoles.includes("manager"))
    const isHrRecruitmentDept = selectedDepartments.includes("hr") || selectedDepartments.includes("recruitment")
    
    const filteredBaseItems = isSalesDept || isHrRecruitmentDept
      ? baseMenuItems.filter(item => {
          // Remove Projects and Meeting Notes for both Sales and HR & Recruitment
          if (item.href === "/projects" || item.href === "/my-meeting-notes") return false
          
          // For Sales managers, keep Calls in My Workspace (it will also be added to Sales section)
          // For Sales executives, remove Calls from My Workspace (it's only in Sales section)
          // For HR & Recruitment, remove Calls (not needed)
          if (item.href === "/my-calls") {
            if (isHrRecruitmentDept) return false
            if (isSalesDept && selectedRoles.includes("manager")) return true
            if (isSalesDept && selectedRoles.includes("executive")) return false
          }
          
          return true
        })
      : baseMenuItems
    
    // Always add base items (dashboard, my-workspace, team)
    filtered.push(...filteredBaseItems)
    
    // CEO View (when CEO toggle is on)
    if (isCeoView) {
      // CEO view shows CEO pages + base items (dashboard, my-workspace, team)
      ceoPages.summary.forEach(page => {
        filtered.push({ ...page, section: "ceo-view", subSection: "summary" })
      })
      ceoPages.explorers.forEach(page => {
        filtered.push({ ...page, section: "ceo-view", subSection: "explorers" })
      })
      ceoPages.controls.forEach(page => {
        filtered.push({ ...page, section: "ceo-view", subSection: "controls" })
      })
      return filtered // Base items already added above
    }
    
    // SuperAdmin View (when SuperAdmin toggle is on)
    if (isSuperAdminView) {
      filtered.push(...adminPages)
      return filtered // SuperAdmin view shows admin pages + base
    }
    
    // Team Management (when manager role is selected)
    if (selectedRoles.includes("manager")) {
      filtered.push(...teamManagementItems)
    }
    
    // Department-specific pages
    let hrRecruitmentAdded = false
    
    selectedDepartments.forEach(dept => {
      // Handle HR and Recruitment as merged group
      if ((dept === "hr" || dept === "recruitment") && !hrRecruitmentAdded) {
        // Add HR sub-section items
        hrRecruitmentPages.hr.forEach(page => {
          filtered.push({
            ...page,
            section: "hr-recruitment",
            subSection: "hr",
          })
        })
        // Add Recruitment sub-section items
        hrRecruitmentPages.recruitment.forEach(page => {
          filtered.push({
            ...page,
            section: "hr-recruitment",
            subSection: "recruitment",
          })
        })
        hrRecruitmentAdded = true
        return
      }
      
      if (dept === "hr" || dept === "recruitment") return
      
      // Sales department
      if (dept === "sales") {
        if (selectedRoles.includes("executive") && salesPages.executive) {
          salesPages.executive.forEach(page => {
            filtered.push({
              ...page,
              section: "sales",
            })
          })
        }
        
        if (selectedRoles.includes("manager") && salesPages.manager) {
          salesPages.manager.forEach(page => {
            filtered.push({
              ...page,
              section: "sales",
            })
          })
        }
      }
      
      // Finance department
      if (dept === "finance") {
        financePages.accountant.forEach(page => {
          filtered.push({
            ...page,
            section: "finance",
          })
        })
      }
      
      // Marketing department
      if (dept === "marketing") {
        marketingPages.dashboard.forEach(page => {
          filtered.push({
            ...page,
            section: "marketing",
            subSection: "dashboard",
          })
        })
        marketingPages.templates.forEach(page => {
          filtered.push({
            ...page,
            section: "marketing",
            subSection: "templates",
          })
        })
        marketingPages.automations.forEach(page => {
          filtered.push({
            ...page,
            section: "marketing",
            subSection: "automations",
          })
        })
        marketingPages.campaigns.forEach(page => {
          filtered.push({
            ...page,
            section: "marketing",
            subSection: "campaigns",
          })
        })
        marketingPages.content.forEach(page => {
          filtered.push({
            ...page,
            section: "marketing",
            subSection: "content",
          })
        })
      }
      
      // Analytics department
      if (dept === "analytics") {
        analyticsPages.analytics.forEach(page => {
          filtered.push({
            ...page,
            section: "analytics",
          })
        })
      }
      
      // R&D department (CEO and Managers only)
      if (dept === "rnd") {
        // R&D is accessible when CEO view is on OR Manager role is selected
        // CEO view toggle gives access, or Manager role selection
        if (isCeoView || selectedRoles.includes("manager")) {
          rndPages.rnd.forEach(page => {
            filtered.push({
              ...page,
              section: "rnd",
            })
          })
        }
      }
      
      // Development department (Developer role only)
      if (dept === "development") {
        // For now, show if development is selected (role filtering will be handled separately)
        developmentPages.projects.forEach(page => {
          filtered.push({
            ...page,
            section: "development",
            subSection: "projects",
          })
        })
        developmentPages.design.forEach(page => {
          filtered.push({
            ...page,
            section: "development",
            subSection: "design",
          })
        })
        developmentPages.resources.forEach(page => {
          filtered.push({
            ...page,
            section: "development",
            subSection: "resources",
          })
        })
        developmentPages.docs.forEach(page => {
          filtered.push({
            ...page,
            section: "development",
            subSection: "docs",
          })
        })
      }
    })
    
    return filtered
  }

  const filteredMenuItems = getFilteredMenuItems()
  
  // Get sections in order
  const getSections = (): string[] => {
    const sectionsSet = new Set<string>()
    
    filteredMenuItems.forEach(item => {
      if (item.section) {
        sectionsSet.add(item.section)
      }
    })
    
    // For sales executives and managers, prioritize sales section
    const isSalesRole = selectedDepartments.includes("sales") && (selectedRoles.includes("executive") || selectedRoles.includes("manager"))
    
    const sectionOrder = isSalesRole
      ? [
          "dashboard",
          "sales",
          "hr-recruitment",
          "my-workspace",
          "team-management",
          "finance",
          "marketing",
          "analytics",
          "rnd",
          "development",
          "ceo-view",
          "admin-view",
          "team",
        ]
      : [
          "dashboard",
          "hr-recruitment",
          "my-workspace",
          "team-management",
          "sales",
          "finance",
          "marketing",
          "analytics",
          "rnd",
          "development",
          "ceo-view",
          "admin-view",
          "team",
        ]
    
    return sectionOrder.filter(section => sectionsSet.has(section))
  }

  const sections = getSections()
  
  // Get section label
  const getSectionLabel = (section: string): string => {
    const labels: Record<string, string> = {
      dashboard: "",
      "my-workspace": "MY WORKSPACE",
      "team-management": "TEAM MANAGEMENT",
      "ceo-view": "CEO VIEW",
      "admin-view": "SYSTEM ADMINISTRATION",
      sales: "SALES",
      "hr-recruitment": "HR & RECRUITMENT",
      finance: "FINANCE",
      marketing: "MARKETING",
      analytics: "ANALYTICS",
      rnd: "RESEARCH & DEVELOPMENT",
      development: "DEVELOPMENT",
      team: "TEAM & ORGANIZATION",
    }
    return labels[section] || ""
  }


  // Get sub-section label
  const getSubSectionLabel = (subSection: string): string => {
    const labels: Record<string, string> = {
      work: "TASKS & REPORTS",
      time: "TIME & ATTENDANCE",
      personal: "PERSONAL",
      summary: "EXECUTIVE SUMMARY",
      explorers: "EXPLORERS",
      controls: "MANAGERIAL CONTROLS",
      templates: "TEMPLATES & CONTENT",
      automations: "AUTOMATIONS",
      campaigns: "CAMPAIGNS & TRACKING",
      content: "WEBSITE CONTENT",
      projects: "PROJECTS & TASKS",
      design: "DESIGN SYSTEM",
      resources: "RESOURCES",
      docs: "DOCUMENTATION",
      hr: "HR",
      recruitment: "RECRUITMENT",
    }
    return labels[subSection] || ""
  }

  // Group items by section and sub-section
  const getGroupedItems = (section: string) => {
    const items = filteredMenuItems.filter(item => item.section === section)
    
    // Sections that use sub-section grouping
    if (section === "my-workspace" || section === "ceo-view" || section === "marketing" || section === "development" || section === "hr-recruitment") {
      // Group by sub-section
      const grouped: Record<string, MenuItem[]> = {}
      items.forEach(item => {
        const subSection = item.subSection || "default"
        if (!grouped[subSection]) {
          grouped[subSection] = []
        }
        grouped[subSection].push(item)
      })
      
      // For hr-recruitment, ensure HR appears before Recruitment
      if (section === "hr-recruitment") {
        const ordered: Record<string, MenuItem[]> = {}
        if (grouped["hr"]) ordered["hr"] = grouped["hr"]
        if (grouped["recruitment"]) ordered["recruitment"] = grouped["recruitment"]
        // Add any other sub-sections that might exist
        Object.keys(grouped).forEach(key => {
          if (key !== "hr" && key !== "recruitment") {
            ordered[key] = grouped[key]
          }
        })
        return ordered
      }
      
      return grouped
    }
    
    return { default: items }
  }

  return (
    <TooltipProvider delayDuration={500}>
      <div className={`fixed left-0 ${isFilterHeaderCollapsed ? 'top-0' : 'top-[48px]'} bottom-0 w-[272px] bg-card flex flex-col py-5 z-30 transition-all duration-300`}>
        {/* Header */}
        <div className="flex flex-col h-16 items-start justify-center px-2 shrink-0 w-full">
          <div className="flex h-14 items-center px-3 w-full">
            <div className="flex flex-1 gap-2.5 items-center">
              <div className="relative shrink-0 size-8">
                <div className="absolute inset-0 bg-primary rounded" />
              </div>
              <p className="font-semibold leading-[1.35] text-foreground text-xl">Team Portal</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-1 flex-col gap-4 items-start px-4 py-0 w-full overflow-y-auto">
          {sections.map((section) => {
            const groupedItems = getGroupedItems(section)
            const sectionLabel = getSectionLabel(section)
            const hasSubSections = Object.keys(groupedItems).length > 1 || (Object.keys(groupedItems)[0] !== "default")

            if (Object.keys(groupedItems).length === 0) return null

            return (
              <div key={section} className="flex flex-col gap-1 items-start w-full">
                {sectionLabel && (
                  <div className="flex items-center justify-center px-3 py-1 w-full">
                    <p className="flex-1 font-medium text-muted-foreground text-sm tracking-[0.28px]">
                      {sectionLabel}
                    </p>
                  </div>
                )}
                
                {hasSubSections ? (
                  // Render with sub-sections
                  Object.entries(groupedItems).map(([subSection, items]) => {
                    const subSectionLabel = getSubSectionLabel(subSection)
                    return (
                      <div key={subSection} className="flex flex-col gap-1 items-start w-full">
                        {subSectionLabel && subSection !== "default" && (
                          <div className="flex items-center justify-center px-3 py-1.5 w-full pl-6">
                            <p className="flex-1 font-medium text-muted-foreground text-xs tracking-[0.24px]">
                              {subSectionLabel}
                            </p>
                          </div>
                        )}
                        <div className="flex flex-col items-start w-full">
                          {items.map((item) => {
                            const active = isActive(item.href)
                            return (
                              <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      "relative flex gap-2 h-10 items-center px-3 py-2 rounded-lg w-[240px] transition-colors",
                                      subSection !== "default" && "pl-6",
                                      active
                                        ? "bg-muted text-foreground"
                                        : "bg-card text-muted-foreground hover:bg-muted"
                                    )}
                                  >
                                    <item.icon
                                      className={cn(
                                        "shrink-0 size-4",
                                        active ? "text-foreground" : "text-muted-foreground"
                                      )}
                                    />
                                    <p className="flex-1 font-medium text-base tracking-[0.32px]">{item.label}</p>
                                    {active && (
                                      <div className="absolute bg-primary h-6 left-[-16px] rounded-br-lg rounded-tr-lg top-1/2 -translate-y-1/2 w-1" />
                                    )}
                                  </Link>
                                </TooltipTrigger>
                                {item.description && (
                                  <TooltipContent 
                                    side="right" 
                                    sideOffset={8}
                                    className="animate-in fade-in-0 zoom-in-95 duration-200"
                                  >
                                    <p className="text-sm">{item.description}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  // Render without sub-sections
                  <div className="flex flex-col items-start w-full">
                    {groupedItems.default?.map((item) => {
                      const active = isActive(item.href)
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "relative flex gap-2 h-10 items-center px-3 py-2 rounded-lg w-[240px] transition-colors",
                                active
                                  ? "bg-muted text-foreground"
                                  : "bg-card text-muted-foreground hover:bg-muted"
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "shrink-0 size-4",
                                  active ? "text-foreground" : "text-muted-foreground"
                                )}
                              />
                              <p className="flex-1 font-medium text-base tracking-[0.32px]">{item.label}</p>
                              {active && (
                                <div className="absolute bg-primary h-6 left-[-16px] rounded-br-lg rounded-tr-lg top-1/2 -translate-y-1/2 w-1" />
                              )}
                            </Link>
                          </TooltipTrigger>
                          {item.description && (
                            <TooltipContent side="right">
                              <p className="text-sm">{item.description}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
