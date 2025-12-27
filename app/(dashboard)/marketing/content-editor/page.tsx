"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Edit } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function MarketingContentEditorPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Content Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit website content, pages, blog posts</p>
        </div>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <EmptyState
            icon={Edit}
            title="Content Editor"
            description="Rich content editor for editing website content, pages, and blog posts. This feature will be available soon."
          />
        </CardContent>
      </Card>
    </div>
  )
}
