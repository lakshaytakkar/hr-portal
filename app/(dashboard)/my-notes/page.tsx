"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StickyNote } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function MyNotesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Notes</h1>
        <p className="text-sm text-muted-foreground mt-1">Create and manage your personal notes</p>
      </div>
      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={StickyNote}
            title="My Notes"
            description="Your personal notes will be available here."
          />
        </CardContent>
      </Card>
    </div>
  )
}
