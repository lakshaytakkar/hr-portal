"use client"

import { useQuery } from "@tanstack/react-query"
import { TrendingUp, Users, DollarSign, Briefcase, Target, Activity as ActivityIcon } from "lucide-react"
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
import { LineChart, Line, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, Label } from "recharts"
import { revenueData } from "@/lib/data/dashboard/sales-dashboard"
import { recentActivities, type Activity } from "@/lib/data/dashboard/main-dashboard"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

async function fetchExecutiveDashboard() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    totalRevenue: 2450000,
    totalEmployees: 142,
    activeProjects: 28,
    dealsInPipeline: 156,
    conversionRate: 34.2,
    teamProductivity: 87.5,
    revenue: revenueData,
    activities: recentActivities,
  }
}

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const projectHealthData = [
  { status: "On Track", count: 18, color: "var(--chart-4)" },
  { status: "At Risk", count: 7, color: "var(--chart-3)" },
  { status: "Blocked", count: 3, color: "var(--chart-5)" },
]

const projectHealthChartConfig = {
  "On Track": {
    label: "On Track",
    color: "var(--chart-4)",
  },
  "At Risk": {
    label: "At Risk",
    color: "var(--chart-3)",
  },
  Blocked: {
    label: "Blocked",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const PROJECT_COLORS = [
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-5)",
]

export default function CeoDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: dashboard, isLoading, error, refetch } = useQuery({
    queryKey: ["executive-dashboard"],
    queryFn: fetchExecutiveDashboard,
  })

  const filteredActivities = dashboard?.activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const totalProjects = projectHealthData.reduce((sum, item) => sum + item.count, 0)

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Executive Dashboard"
        onManageDashboard={() => {}}
        onExport={() => {}}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardStatCard
          title="Total Revenue"
          value={`$${(dashboard?.totalRevenue || 0).toLocaleString("en-US")}`}
          change="+12.5%"
          changeLabel="vs last quarter"
          icon={DollarSign}
          variant="positive"
        />
        <DashboardStatCard
          title="Total Employees"
          value={(dashboard?.totalEmployees || 0).toString()}
          change="+8.2%"
          changeLabel="vs last month"
          icon={Users}
          variant="positive"
        />
        <DashboardStatCard
          title="Active Projects"
          value={(dashboard?.activeProjects || 0).toString()}
          change="+5.1%"
          changeLabel="vs last month"
          icon={Briefcase}
          variant="positive"
        />
        <DashboardStatCard
          title="Deals in Pipeline"
          value={(dashboard?.dealsInPipeline || 0).toString()}
          change="+15.3%"
          changeLabel="vs last month"
          icon={Target}
          variant="positive"
        />
        <DashboardStatCard
          title="Conversion Rate"
          value={`${dashboard?.conversionRate || 0}%`}
          change="+2.3%"
          changeLabel="vs last month"
          icon={TrendingUp}
          variant="positive"
        />
        <DashboardStatCard
          title="Team Productivity"
          value={`${dashboard?.teamProductivity || 0}%`}
          change="+4.1%"
          changeLabel="vs last month"
          icon={ActivityIcon}
          variant="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardChartWidget
          title="Revenue Trend"
          timePeriod={{
            value: "monthly",
            options: [
              { label: "Monthly", value: "monthly" },
              { label: "Quarterly", value: "quarterly" },
            ],
          }}
          onRefresh={() => refetch()}
          className="h-[400px]"
        >
          <ChartContainer config={revenueChartConfig} className="h-full">
            <LineChart
              data={dashboard?.revenue || []}
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
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </DashboardChartWidget>

        <DashboardChartWidget
          title="Project Health"
          onRefresh={() => refetch()}
          className="h-[400px]"
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <ChartContainer config={projectHealthChartConfig} className="w-full max-w-[232px] aspect-square">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={projectHealthData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-muted-foreground text-xs"
                            >
                              Total Projects
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 16}
                              className="fill-foreground text-2xl font-semibold"
                            >
                              {totalProjects}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                  {projectHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PROJECT_COLORS[index % PROJECT_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex gap-6 items-center justify-center flex-wrap">
              {projectHealthData.map((item, index) => (
                <div key={item.status} className="flex gap-2 items-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length] }}
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
        title="Recent Company Activities"
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