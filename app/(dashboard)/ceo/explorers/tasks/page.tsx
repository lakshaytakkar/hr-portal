"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare } from "lucide-react"

export default function CeoAllTasksExplorerPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">All Tasks Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore all tasks across the organization</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">All Tasks Explorer</p>
            <p className="text-sm text-muted-foreground mb-4">
              Explorer view for all tasks across the organization
            </p>
            <Link href="/tasks" className="text-primary hover:underline text-sm font-medium inline-block mt-6">
              View All Tasks →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
