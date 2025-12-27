"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function CeoPerformanceAnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Performance Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">View comprehensive performance analytics</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">Performance Analytics</p>
            <p className="text-sm text-muted-foreground">
              Comprehensive performance analytics and insights will be available here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
