"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function MyLeaveRequestsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Leave Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage your leave requests</p>
      </div>
      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Calendar}
            title="My Leave Requests"
            description="Leave requests and time off will be available here."
          />
        </CardContent>
      </Card>
    </div>
  )
}
