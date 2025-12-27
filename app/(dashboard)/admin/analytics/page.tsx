"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">View system-wide analytics, reports, and performance metrics</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={BarChart3}
            title="System Analytics"
            description="View system-wide analytics, reports, and performance metrics. This feature will be available soon."
          />
        </CardContent>
      </Card>
    </div>
  )
}
