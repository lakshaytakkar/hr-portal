"use client"

import { useQuery } from "@tanstack/react-query"
import { CheckSquare, Briefcase, Phone, Clock, Users, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import {
  DashboardStatCard,
  DashboardHeader,
  DashboardChartWidget,
  DashboardTable,
} from "@/components/dashboard"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import {
  mainDashboardStats,
  taskCompletionData,
  projectStatusData,
  recentActivities,
  type Activity,
} from "@/lib/data/dashboard/main-dashboard"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

async function fetchMainDashboard() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    stats: mainDashboardStats,
    taskData: taskCompletionData,
    projectData: projectStatusData,
    activities: recentActivities,
  }
}

const taskChartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-4)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const projectChartConfig = {
  Active: {
    label: "Active",
    color: "var(--chart-2)",
  },
  Completed: {
    label: "Completed",
    color: "var(--chart-4)",
  },
  "On Hold": {
    label: "On Hold",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const COLORS = [
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-3)",
]

export default function MainDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: dashboard, isLoading, error, refetch } = useQuery({
    queryKey: ["main-dashboard"],
    queryFn: fetchMainDashboard,
  })

  const filteredActivities = dashboard?.activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const activityColumns = [
    {
      key: "type",
      label: "Type",
      render: (activity: Activity) => (
        <Badge variant="outline" className="capitalize">
          {activity.type}
        </Badge>
      ),
    },
    { key: "title", label: "Title" },
    { key: "assignee", label: "Assignee" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ]

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="We couldn't load dashboard data. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  // Role-based stats (defaulting to Executive view for now)
  const stats = dashboard?.stats

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Dashboard"
        onManageDashboard={() => {}}
        onExport={() => {}}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardStatCard
          title="My Tasks"
          value={stats?.myTasks || 0}
          change={`+${stats?.myTasksChange || 0}%`}
          changeLabel="vs last month"
          icon={CheckSquare}
          variant="positive"
        />
        <DashboardStatCard
          title="My Projects"
          value={stats?.myProjects || 0}
          change={`+${stats?.myProjectsChange || 0}%`}
          changeLabel="vs last month"
          icon={Briefcase}
          variant="positive"
        />
        <DashboardStatCard
          title="My Calls"
          value={stats?.myCalls || 0}
          change={`+${stats?.myCallsChange || 0}%`}
          changeLabel="vs last month"
          icon={Phone}
          variant="positive"
        />
        <DashboardStatCard
          title="Attendance"
          value={stats?.myAttendance || "Present"}
          change={`${stats?.myAttendanceChange || 0}%`}
          changeLabel="this month"
          icon={Clock}
          variant="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardChartWidget
          title="Task Completion"
          timePeriod={{
            value: "monthly",
            options: [
              { label: "Monthly", value: "monthly" },
              { label: "Weekly", value: "weekly" },
              { label: "Daily", value: "daily" },
            ],
          }}
          onRefresh={() => refetch()}
          className="h-[400px]"
        >
          <ChartContainer config={taskChartConfig} className="h-full">
            <LineChart
              data={dashboard?.taskData || []}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--color-completed)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="var(--color-pending)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </DashboardChartWidget>

        <DashboardChartWidget
          title="Project Status"
          onRefresh={() => refetch()}
          className="h-[400px]"
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <ChartContainer config={projectChartConfig} className="w-full max-w-[232px] aspect-square">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={dashboard?.projectData || []}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {(dashboard?.projectData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex gap-6 items-center justify-center">
              {(dashboard?.projectData || []).map((item, index) => (
                <div key={item.status} className="flex gap-2 items-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardChartWidget>
      </div>

      {/* Table */}
      <DashboardTable
        title="Recent Activities"
        columns={activityColumns}
        data={filteredActivities}
        searchPlaceholder="Search activities..."
        onSearch={setSearchQuery}
        onFilter={() => {}}
        onSort={() => {}}
        className="h-[436px]"
      />
    </div>
  )
}
