"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function CeoDepartmentOversightPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Department Oversight</h1>
        <p className="text-sm text-muted-foreground mt-1">Access all department dashboards</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">Department Oversight</p>
            <p className="text-sm text-muted-foreground mb-4">
              Access to all department dashboards and oversight functions
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Link href="/departments/hr" className="text-primary hover:underline text-sm font-medium">
                HR Department →
              </Link>
              <Link href="/departments/sales" className="text-primary hover:underline text-sm font-medium">
                Sales Department →
              </Link>
              <Link href="/departments/recruitment" className="text-primary hover:underline text-sm font-medium">
                Recruitment Department →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
