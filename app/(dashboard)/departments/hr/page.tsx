"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function HRDashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">HR Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">HR department overview, employee management, and HR metrics</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">HR Department Dashboard</p>
            <p className="text-sm text-muted-foreground mb-4">
              HR department overview, employee management, and HR metrics
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Link href="/hr/employees" className="text-primary hover:underline text-sm font-medium">
                View Employees →
              </Link>
              <Link href="/hr/onboarding" className="text-primary hover:underline text-sm font-medium">
                View Onboarding →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
