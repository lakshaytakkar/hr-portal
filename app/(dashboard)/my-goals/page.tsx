"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { CreateGoalDialog } from "@/components/my/CreateGoalDialog"

export default function MyGoalsPage() {
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Goals</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your personal and professional goals</p>
        </div>
        <Button onClick={() => setIsCreateGoalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>
      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Target}
            title="My Goals"
            description="Your goals and OKRs will be available here."
            action={{
              label: "Create Goal",
              onClick: () => setIsCreateGoalOpen(true),
            }}
          />
        </CardContent>
      </Card>
      <CreateGoalDialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen} />
    </div>
  )
}
