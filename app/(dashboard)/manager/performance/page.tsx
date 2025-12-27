"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function ManagerPerformancePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">View team performance metrics, productivity insights, and performance trends</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={TrendingUp}
            title="Team Performance"
            description="View team performance metrics, productivity insights, and performance trends. This feature will be available soon."
          />
        </CardContent>
      </Card>
    </div>
  )
}
