"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus } from "lucide-react"

export default function RecruitmentDashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Recruitment Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Recruitment pipeline, candidate management, and hiring metrics</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">Recruitment Department Dashboard</p>
            <p className="text-sm text-muted-foreground mb-4">
              Recruitment pipeline, candidate management, and hiring metrics
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Link href="/recruitment/candidates" className="text-primary hover:underline text-sm font-medium">
                View Candidates →
              </Link>
              <Link href="/recruitment/applications" className="text-primary hover:underline text-sm font-medium">
                View Applications →
              </Link>
              <Link href="/recruitment/job-postings" className="text-primary hover:underline text-sm font-medium">
                View Job Postings →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
