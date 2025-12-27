"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function ManagerAttendancePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Track team attendance, approve corrections, and view attendance reports</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Clock}
            title="Team Attendance"
            description="Track team attendance, approve corrections, and view attendance reports. This feature will be available soon."
          />
        </CardContent>
      </Card>
    </div>
  )
}
