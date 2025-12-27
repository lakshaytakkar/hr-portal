"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileBarChart } from "lucide-react"

export default function CeoReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Reports & Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and view executive reports</p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <CardContent className="p-12">
          <div className="text-center">
            <FileBarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">Executive Reports</p>
            <p className="text-sm text-muted-foreground">
              Generate and view executive reports and insights
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
