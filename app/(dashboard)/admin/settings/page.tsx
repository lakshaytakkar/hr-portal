"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure system-wide settings, organization details, and integrations</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Settings}
            title="System Settings"
            description="Configure system-wide settings, organization details, and integrations. This feature will be available soon."
          />
        </CardContent>
      </Card>
    </div>
  )
}
