"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { CreateDailyReportDialog } from "@/components/my/CreateDailyReportDialog"

export default function MyDailyReportingPage() {
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Daily Reporting</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit and track your daily work reports</p>
        </div>
        <Button onClick={() => setIsCreateReportOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Daily Report
        </Button>
      </div>
      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={FileText}
            title="My Daily Reporting"
            description="Daily reports and updates will be available here."
            action={{
              label: "Create Report",
              onClick: () => setIsCreateReportOpen(true),
            }}
          />
        </CardContent>
      </Card>
      <CreateDailyReportDialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen} />
    </div>
  )
}
