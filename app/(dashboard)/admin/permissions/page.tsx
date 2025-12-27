"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function AdminPermissionsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage permission matrix, role capabilities, and access control policies</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Shield}
            title="Permissions Management"
            description="Manage permission matrix, role capabilities, and access control policies. This feature will be available soon."
          />
        </CardContent>
      </Card>
    </div>
  )
}
