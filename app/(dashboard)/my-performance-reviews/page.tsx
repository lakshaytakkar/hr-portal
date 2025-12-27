"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function MyPerformanceReviewsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Performance Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">View and track your performance reviews</p>
      </div>
      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Star}
            title="My Performance Reviews"
            description="Performance reviews and feedback will be available here."
          />
        </CardContent>
      </Card>
    </div>
  )
}
