"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Target, TrendingUp, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { initialProjects } from "@/lib/data/projects"
import { initialTasks } from "@/lib/data/tasks"

async function fetchOperationsSummary() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const completedProjects = initialProjects.projects.filter(p => p.status === "completed").length
  const activeProjects = initialProjects.projects.filter(p => p.status === "active").length
  const completedTasks = initialTasks.tasks.filter(t => t.status === "completed").length
  const totalTasks = initialTasks.tasks.length
  return {
    activeProjects,
    completedProjects,
    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    onTimeDelivery: 87.5,
  }
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: React.ElementType
}) {
  return (
    <Card className="border border-border rounded-[14px] flex-1">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="bg-primary/10 rounded-full w-9 h-9 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground flex-1">{title}</p>
        </div>
        <p className="text-2xl font-semibold text-foreground leading-[1.3]">{value}</p>
      </CardContent>
    </Card>
  )
}

export default function CeoOperationsSummaryPage() {
  const { data: summary, isLoading, error, refetch } = useQuery({
    queryKey: ["operations-summary"],
    queryFn: fetchOperationsSummary,
  })

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border rounded-[14px]">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load operations summary"
        message="We couldn't load operations summary data. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Operations Summary</h1>
        <p className="text-sm text-muted-foreground mt-1">Operations and business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Projects"
          value={(summary?.activeProjects || 0).toString()}
          icon={Activity}
        />
        <StatCard
          title="Completed Projects"
          value={(summary?.completedProjects || 0).toString()}
          icon={CheckCircle2}
        />
        <StatCard
          title="Task Completion Rate"
          value={`${summary?.taskCompletionRate || 0}%`}
          icon={Target}
        />
        <StatCard
          title="On-Time Delivery"
          value={`${summary?.onTimeDelivery || 0}%`}
          icon={TrendingUp}
        />
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-base font-medium text-muted-foreground mb-2">Operations Summary</p>
            <p className="text-sm text-muted-foreground">
              Comprehensive operations and business metrics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
