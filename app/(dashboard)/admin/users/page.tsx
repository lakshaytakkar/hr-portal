"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { CreateUserDialog } from "@/components/admin/CreateUserDialog"

export default function AdminUsersPage() {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage users, assign roles, and configure user permissions</p>
        </div>
        <Button onClick={() => setIsCreateUserOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Users}
            title="User Management"
            description="Manage users, assign roles, and configure user permissions. This feature will be available soon."
            action={{
              label: "Create User",
              onClick: () => setIsCreateUserOpen(true),
            }}
          />
        </CardContent>
      </Card>

      <CreateUserDialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen} />
    </div>
  )
}
