"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function MyMeetingNotesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Meeting Notes</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage your meeting notes</p>
      </div>
      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={FileText}
            title="My Meeting Notes"
            description="Meeting notes and summaries will be available here."
          />
        </CardContent>
      </Card>
    </div>
  )
}
