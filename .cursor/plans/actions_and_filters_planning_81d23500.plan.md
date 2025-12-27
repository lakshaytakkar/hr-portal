---
name: Actions and Filters Planning
overview: Comprehensive plan for implementing row-level actions, topbar actions (primary/secondary), export buttons, filters, sorting, and datepickers across all pages with role-based, department-based, and page-specific contextual logic.
todos:
  - id: create-permission-utils
    content: Create lib/utils/permissions.ts with role-based permission check functions for all entity types and actions
    status: completed
  - id: create-action-utils
    content: Create lib/utils/actions.ts with action context resolution functions that return appropriate actions based on role, department, and page
    status: completed
    dependencies:
      - create-permission-utils
  - id: create-filter-utils
    content: Create lib/utils/filters.ts with filter definition functions that return available filters based on page, role, and department
    status: completed
  - id: create-export-utils
    content: Create lib/utils/exports.ts with CSV export functionality and export button visibility logic
    status: completed
  - id: create-date-range-picker
    content: Create components/filters/DateRangePicker.tsx with date range selection, presets, and single date support
    status: completed
  - id: create-filter-panel
    content: Create components/filters/FilterPanel.tsx as reusable filter component with active filter chips and clear functionality
    status: completed
    dependencies:
      - create-filter-utils
      - create-date-range-picker
  - id: create-row-actions-menu
    content: Create components/actions/RowActionsMenu.tsx that displays contextual row actions based on entity, role, and permissions
    status: completed
    dependencies:
      - create-action-utils
  - id: create-topbar-actions
    content: Create components/actions/TopbarActions.tsx that displays primary and secondary actions based on page, role, and permissions
    status: completed
    dependencies:
      - create-action-utils
  - id: create-export-button
    content: Create components/exports/ExportButton.tsx with CSV export functionality and permission-based visibility
    status: completed
    dependencies:
      - create-export-utils
  - id: implement-projects-actions
    content: Implement row actions, topbar actions, filters, sort, and export for /projects page
    status: completed
    dependencies:
      - create-row-actions-menu
      - create-topbar-actions
      - create-filter-panel
      - create-export-button
  - id: implement-tasks-actions
    content: Implement row actions, topbar actions, filters, sort, and export for /tasks page
    status: completed
    dependencies:
      - create-row-actions-menu
      - create-topbar-actions
      - create-filter-panel
      - create-export-button
  - id: implement-calls-actions
    content: Implement row actions, topbar actions, filters, sort, and export for /my-calls page
    status: completed
    dependencies:
      - create-row-actions-menu
      - create-topbar-actions
      - create-filter-panel
      - create-export-button
  - id: implement-attendance-actions
    content: Implement row actions, topbar actions, filters, sort, and export for /my-attendance page
    status: completed
    dependencies:
      - create-row-actions-menu
      - create-topbar-actions
      - create-filter-panel
      - create-export-button
  - id: implement-recruitment-actions
    content: Implement actions, filters, and exports for all recruitment pages (job-listings, candidates, applications, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-sales-actions
    content: Implement actions, filters, and exports for all sales pages (leads, deals, quotations, pipeline, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-finance-actions
    content: Implement actions, filters, and exports for all finance pages (invoices, expenses, transactions, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-marketing-actions
    content: Implement actions, filters, and exports for all marketing pages (campaigns, email-templates, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-hr-actions
    content: Implement actions, filters, and exports for all HR pages (employees, onboarding, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-admin-actions
    content: Implement actions, filters, and exports for all admin pages (users, permissions, settings, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-ceo-actions
    content: Implement actions, filters, and exports for all CEO pages (dashboard, team-management, reports, etc.)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-manager-actions
    content: Implement actions, filters, and exports for all manager pages (team-tasks, team-projects, performance, attendance)
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: implement-department-actions
    content: Implement actions, filters, and exports for department overview pages
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: test-permissions
    content: Test all permission checks across different roles and scenarios
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
      - implement-calls-actions
      - implement-attendance-actions
  - id: test-filters
    content: Test filter combinations, date ranges, and filter persistence across page navigation
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
  - id: test-exports
    content: Test CSV exports with various data sizes, filtered data, and permission-based visibility
    status: completed
    dependencies:
      - implement-projects-actions
      - implement-tasks-actions
---

# Comprehensive Actions, Filters, and Export Planning

## Overview

This plan defines row-level actions, topbar actions (primary/secondary), export functionality, filters, sorting, and datepickers for all pages in the HR Portal. All features are implemented contextually based on user role, department, and page type.

## Architecture

### Permission System

- Create `lib/utils/permissions.ts` with role-based permission checks
- Create `lib/utils/actions.ts` for action definitions and context resolution
- Create `lib/utils/filters.ts` for filter definitions and context resolution
- Create `lib/utils/exports.ts` for export functionality

### Component Structure

- `components/actions/RowActionsMenu.tsx` - Contextual row action menu
- `components/actions/TopbarActions.tsx` - Primary and secondary topbar actions
- `components/filters/FilterPanel.tsx` - Reusable filter panel component
- `components/filters/DateRangePicker.tsx` - Date range picker component
- `components/exports/ExportButton.tsx` - Export button with format selection

## Role-Based Action Matrix

### Core Roles

- **executive**: Standard user, own data only
- **manager**: Team oversight, can manage team data
- **superadmin**: Full system access

### Department Context

Departments: sales, hr, recruitment, finance, marketing, analytics, rnd, development

## Page-by-Page Action Planning

### 1. Projects List (`/projects`)

#### Topbar Actions

**Primary:**

- Create Project (Manager, SuperAdmin) - Prominent button

**Secondary:**

- Export to CSV (Manager, SuperAdmin) - Icon button
- View Toggle (List/Kanban) - Icon button
- Bulk Actions (Manager, SuperAdmin) - Dropdown when items selected

#### Row-Level Actions

- View Detail (All) - Card click
- Edit (Manager+ for own/team, SuperAdmin for all) - Menu item
- Delete (SuperAdmin only) - Menu item with confirmation
- Duplicate (Manager, SuperAdmin) - Menu item
- Archive (Manager, SuperAdmin) - Menu item

#### Filters

- Status (planning, active, on-hold, completed, cancelled)
- Priority (low, medium, high, urgent)
- Owner (Manager+ can filter by team member)
- Date Range (start date, due date)
- Search (name, description)

#### Sort Options

- Name (A-Z, Z-A)
- Status
- Priority
- Due Date (ascending, descending)
- Progress (ascending, descending)
- Created Date (newest, oldest)

#### Export

- CSV export with columns: Name, Status, Priority, Owner, Progress, Due Date, Created Date
- Filtered data only (respects current filters)

---

### 2. Tasks List (`/tasks`)

#### Topbar Actions

**Primary:**

- Create Task (Manager, SuperAdmin) - Prominent button

**Secondary:**

- Export to CSV (Manager, SuperAdmin) - Icon button
- Bulk Status Update (Manager, SuperAdmin) - Dropdown when items selected
- Bulk Assign (Manager, SuperAdmin) - Dropdown when items selected

#### Row-Level Actions

- View Detail (All) - Row click
- Edit (Executive for own, Manager+ for team, SuperAdmin for all) - Menu item
- Delete (SuperAdmin only) - Menu item with confirmation
- Update Status (All for own, Manager+ for team) - Quick action dropdown
- Change Priority (Manager, SuperAdmin) - Menu item
- Reassign (Manager, SuperAdmin) - Menu item
- Add Subtask (Manager, SuperAdmin) - Menu item
- Duplicate (Manager, SuperAdmin) - Menu item

#### Filters

- Status (not-started, in-progress, in-review, completed, blocked)
- Priority (low, medium, high, urgent)
- Assigned To (Executive sees self only, Manager+ sees team, SuperAdmin sees all)
- Project (filter by project)
- Due Date Range
- Search (name, description)

#### Sort Options

- Name (A-Z, Z-A)
- Status
- Priority
- Due Date (ascending, descending)
- Assigned To
- Last Updated (newest, oldest)

#### Export

- CSV export with columns: Name, Status, Priority, Assigned To, Project, Due Date, Last Updated
- Include subtasks (indented in export)

---

### 3. Calls List (`/my-calls`)

#### Topbar Actions

**Primary:**

- Schedule Call (All) - Prominent button

**Secondary:**

- Export to CSV (Manager, SuperAdmin) - Icon button
- Bulk Log Outcome (All) - Dropdown when items selected
- Import Calls (Manager, SuperAdmin) - Icon button

#### Row-Level Actions

- View Detail (All) - Row click
- Edit (Executive for own, Manager+ for team, SuperAdmin for all) - Menu item
- Delete (Executive for own, Manager+ for team, SuperAdmin for all) - Menu item with confirmation
- Log Outcome (All) - Quick action button
- Schedule Follow-up (All) - Menu item
- Reschedule (All) - Menu item
- Mark Complete (All) - Quick action button

#### Filters

- Status (scheduled, completed, cancelled, rescheduled)
- Outcome (connected, voicemail, no-answer, busy, callback-requested, not-interested, interested, meeting-scheduled)
- Assigned To (Executive sees self only, Manager+ sees team, SuperAdmin sees all)
- Date Range (call date)
- Company
- Search (contact name, company, notes)

#### Sort Options

- Date/Time (newest, oldest)
- Status
- Outcome
- Contact Name (A-Z, Z-A)
- Company (A-Z, Z-A)

#### Export

- CSV export with columns: Date, Time, Contact, Company, Phone, Email, Outcome, Status, Assigned To, Notes

---

### 4. Attendance (`/my-attendance`)

#### Topbar Actions

**Primary:**

- Check In/Out (All) - Prominent button (contextual: Check In or Check Out)

**Secondary:**

- Export to CSV (All) - Icon button
- Request Correction (All) - Icon button
- View Team Attendance (Manager, SuperAdmin) - Icon button

#### Row-Level Actions

- View Detail (All) - Row click
- Request Correction (All for own) - Menu item
- Approve Correction (Manager, SuperAdmin) - Menu item (if pending correction)
- Edit (SuperAdmin only) - Menu item

#### Filters

- Date Range (required - default: current month)
- Status (present, absent, late, half-day, leave)
- User (Manager+ can filter by team member, SuperAdmin sees all)
- Department (Manager, SuperAdmin)
- Search (user name)

#### Sort Options

- Date (newest, oldest)
- User Name (A-Z, Z-A)
- Status
- Check In Time (earliest, latest)

#### Export

- CSV export with columns: Date, User, Check In, Check Out, Status, Notes
- Date range required for export

---

### 5. Recruitment Pages

#### 5a. Job Listings (`/recruitment/job-listings`)

**Topbar Actions:**

- Primary: Create Job Listing (HR, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (activate/deactivate)

**Row Actions:**

- View Detail, Edit, Delete, Duplicate, Activate/Deactivate, View Applications

**Filters:**

- Status (draft, active, closed, archived)
- Department
- Date Posted Range
- Search (title, description)

#### 5b. Candidates (`/recruitment/candidates`)

**Topbar Actions:**

- Primary: Add Candidate (HR, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (tag, status update)

**Row Actions:**

- View Detail, Edit, Delete, Schedule Interview, Add Note, Change Status, Tag

**Filters:**

- Status (new, screening, interview, offer, hired, rejected)
- Job Role
- Department
- Date Applied Range
- Search (name, email, phone)

#### 5c. Applications (`/recruitment/applications`)

**Topbar Actions:**

- Primary: Create Application (HR, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Status Update

**Row Actions:**

- View Detail, Edit, Change Status, Schedule Interview, Add Note, Reject, Hire

**Filters:**

- Status (applied, screening, interview, offer, hired, rejected)
- Job Role
- Date Applied Range
- Search (candidate name, job title)

---

### 6. Sales Pages

#### 6a. Leads (`/sales/leads`)

**Topbar Actions:**

- Primary: Add Lead (Sales, Manager, SuperAdmin)
- Secondary: Export to CSV, Import Leads, Bulk Actions (assign, tag)

**Row Actions:**

- View Detail, Edit, Delete, Convert to Deal, Assign, Add Note, Change Status

**Filters:**

- Status (new, contacted, qualified, unqualified, converted)
- Source
- Assigned To (Sales sees own, Manager+ sees team, SuperAdmin sees all)
- Date Created Range
- Search (name, company, email, phone)

#### 6b. Deals (`/sales/deals`)

**Topbar Actions:**

- Primary: Create Deal (Sales, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (update stage, assign)

**Row Actions:**

- View Detail, Edit, Delete, Update Stage, Assign, Add Note, Convert to Order

**Filters:**

- Stage (prospecting, qualification, proposal, negotiation, closed-won, closed-lost)
- Value Range
- Assigned To
- Expected Close Date Range
- Search (deal name, company, contact)

#### 6c. Quotations (`/sales/quotations`)

**Topbar Actions:**

- Primary: Create Quotation (Sales, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (send, convert to order)

**Row Actions:**

- View Detail, Edit, Delete, Send, Convert to Order, Duplicate, Print

**Filters:**

- Status (draft, sent, accepted, rejected, expired)
- Date Range
- Assigned To
- Search (quotation number, customer)

---

### 7. Finance Pages

#### 7a. Invoices (`/finance/invoices`)

**Topbar Actions:**

- Primary: Create Invoice (Finance, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (send, mark paid)

**Row Actions:**

- View Detail, Edit, Delete, Send, Mark Paid, Print, Duplicate

**Filters:**

- Status (draft, sent, paid, overdue, cancelled)
- Date Range (invoice date, due date)
- Customer
- Amount Range
- Search (invoice number, customer)

#### 7b. Expenses (`/finance/expenses`)

**Topbar Actions:**

- Primary: Add Expense (All)
- Secondary: Export to CSV, Bulk Actions (approve, reject)

**Row Actions:**

- View Detail, Edit, Delete, Approve (Manager, SuperAdmin), Reject (Manager, SuperAdmin), Add Receipt

**Filters:**

- Status (pending, approved, rejected, paid)
- Category
- Submitted By (Manager+ sees team, SuperAdmin sees all)
- Date Range
- Amount Range
- Search (description, category)

#### 7c. Transactions (`/finance/transactions`)

**Topbar Actions:**

- Primary: Record Transaction (Finance, Manager, SuperAdmin)
- Secondary: Export to CSV, Reconcile

**Row Actions:**

- View Detail, Edit, Delete, Reconcile, Add Note

**Filters:**

- Type (income, expense, transfer)
- Account
- Date Range
- Amount Range
- Search (description, reference)

---

### 8. Marketing Pages

#### 8a. Campaigns (`/marketing/campaigns`)

**Topbar Actions:**

- Primary: Create Campaign (Marketing, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (activate, pause)

**Row Actions:**

- View Detail, Edit, Delete, Activate/Pause, Duplicate, View Analytics

**Filters:**

- Status (draft, active, paused, completed)
- Type (email, social, paid ads)
- Date Range
- Search (campaign name)

#### 8b. Email Templates (`/marketing/email-templates`)

**Topbar Actions:**

- Primary: Create Template (Marketing, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (activate, deactivate)

**Row Actions:**

- View Detail, Edit, Delete, Duplicate, Preview, Activate/Deactivate

**Filters:**

- Status (active, inactive)
- Category
- Search (template name)

---

### 9. HR Pages

#### 9a. Employees (`/hr/employees`)

**Topbar Actions:**

- Primary: Add Employee (HR, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (activate, deactivate, assign department)

**Row Actions:**

- View Detail, Edit, Delete, Activate/Deactivate, Assign Manager, Change Department, View Profile

**Filters:**

- Status (active, inactive, on-leave)
- Department
- Role (executive, manager)
- Date Joined Range
- Search (name, email, employee ID)

#### 9b. Onboarding (`/hr/onboarding`)

**Topbar Actions:**

- Primary: Start Onboarding (HR, Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (complete, cancel)

**Row Actions:**

- View Detail, Edit, Complete, Cancel, Send Reminder

**Filters:**

- Status (pending, in-progress, completed, cancelled)
- Department
- Date Started Range
- Search (employee name)

---

### 10. Admin Pages

#### 10a. Users (`/admin/users`)

**Topbar Actions:**

- Primary: Add User (SuperAdmin only)
- Secondary: Export to CSV, Bulk Actions (activate, deactivate, assign role)

**Row Actions:**

- View Detail, Edit, Delete, Activate/Deactivate, Assign Role, Reset Password, View Activity

**Filters:**

- Role (executive, manager, superadmin)
- Status (active, inactive)
- Department
- Date Created Range
- Search (name, email)

#### 10b. Permissions (`/admin/permissions`)

**Topbar Actions:**

- Primary: Save Changes (SuperAdmin only)
- Secondary: Export Permission Matrix, Reset to Default

**Row Actions:**

- Edit Permission (toggle checkboxes)

**Filters:**

- Role
- Module
- Search (permission name)

---

### 11. CEO Pages

#### 11a. Dashboard (`/ceo/dashboard`)

**Topbar Actions:**

- Primary: Generate Report (CEO, SuperAdmin)
- Secondary: Export Dashboard, Refresh Data

**Filters:**

- Date Range (required)
- Department (multi-select)
- View Type (summary, detailed)

#### 11b. Team Management (`/ceo/team-management`)

**Topbar Actions:**

- Primary: Generate Team Report (CEO, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (assign manager, change department)

**Row Actions:**

- View Detail, Edit, Assign Manager, Change Department, View Performance

**Filters:**

- Department
- Role
- Manager
- Date Joined Range
- Search (name, email)

---

### 12. Manager Pages

#### 12a. Team Tasks (`/manager/tasks`)

**Topbar Actions:**

- Primary: Create Task (Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Assign, Bulk Status Update

**Row Actions:**

- View Detail, Edit, Delete, Assign, Update Status, Change Priority

**Filters:**

- Status
- Priority
- Team Member (filter by direct reports)
- Project
- Due Date Range
- Search (task name)

#### 12b. Team Projects (`/manager/projects`)

**Topbar Actions:**

- Primary: Create Project (Manager, SuperAdmin)
- Secondary: Export to CSV, Bulk Actions (assign team, update status)

**Row Actions:**

- View Detail, Edit, Delete, Assign Team, Update Status

**Filters:**

- Status
- Priority
- Team Member
- Date Range
- Search (project name)

---

### 13. Department Pages

#### 13a. Department Overview (`/departments/[dept]`)

**Topbar Actions:**

- Primary: Department-specific action (varies by department)
- Secondary: Export to CSV, View Analytics

**Filters:**

- Department-specific filters
- Date Range
- Search

## Implementation Details

### Permission Helper Functions

Create `lib/utils/permissions.ts`:

```typescript
export function canCreateProject(role: string): boolean
export function canEditProject(role: string, ownerId: string, currentUserId: string): boolean
export function canDeleteProject(role: string): boolean
export function canViewTeamData(role: string): boolean
export function canExportData(role: string, page: string): boolean
// ... more permission checks
```



### Action Context Resolution

Create `lib/utils/actions.ts`:

```typescript
export function getRowActions(
  entityType: string,
  entity: any,
  userRole: string,
  userDepartment: string,
  currentUserId: string
): Action[]

export function getTopbarActions(
  page: string,
  userRole: string,
  userDepartment: string
): { primary: Action[], secondary: Action[] }
```



### Filter Definitions

Create `lib/utils/filters.ts`:

```typescript
export function getAvailableFilters(
  page: string,
  userRole: string,
  userDepartment: string
): FilterDefinition[]

export interface FilterDefinition {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'daterange' | 'date' | 'text' | 'number'
  options?: FilterOption[]
  dependsOn?: string[]
}
```



### Export Functionality

Create `lib/utils/exports.ts`:

```typescript
export async function exportToCSV(
  data: any[],
  columns: ColumnDefinition[],
  filename: string
): Promise<void>

export function shouldShowExportButton(
  page: string,
  userRole: string,
  hasData: boolean
): boolean
```



### Date Range Picker

Create `components/filters/DateRangePicker.tsx`:

- Support for single date, date range
- Presets: Today, Yesterday, This Week, This Month, Last Month, Custom Range
- Integration with filter system

### Filter Panel Component

Create `components/filters/FilterPanel.tsx`:

- Collapsible filter panel
- Active filter chips
- Clear all filters
- Apply filters button
- Context-aware filter options based on role/department

## Contextual Logic Rules

### Role-Based Visibility

1. **Executive**: See only own data, limited actions
2. **Manager**: See team + own data, can manage team
3. **SuperAdmin**: See all data, full access

### Department-Based Filters

- Users see department filter only if they have access to multiple departments
- Manager sees team members' departments
- SuperAdmin sees all departments

### Page-Specific Rules

- Some pages require date range (attendance, reports)
- Some pages have bulk actions only when items selected
- Export buttons only show when data exists and user has permission

## Implementation Order

1. **Phase 1**: Create utility functions (permissions, actions, filters, exports)
2. **Phase 2**: Create reusable components (RowActionsMenu, TopbarActions, FilterPanel, DateRangePicker, ExportButton)
3. **Phase 3**: Implement for core pages (Projects, Tasks, Calls, Attendance)
4. **Phase 4**: Implement for department-specific pages
5. **Phase 5**: Implement for admin/CEO pages
6. **Phase 6**: Testing and refinement

## Testing Considerations

- Test permission checks for each role
- Test filter combinations
- Test export functionality with various data sizes
- Test date range picker with different timezones