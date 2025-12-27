"use client"

import { Button } from "@/components/ui/button"
import { Settings, FileDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  title: string
  onManageDashboard?: () => void
  onExport?: () => void
  className?: string
}

export function DashboardHeader({
  title,
  onManageDashboard,
  onExport,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between relative shrink-0 w-full",
        className
      )}
    >
      <h2 className="text-xl font-semibold text-foreground leading-[1.35] tracking-[0.32px]">
        {title}
      </h2>
      <div className="flex gap-3 items-start relative shrink-0">
        {onManageDashboard && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onManageDashboard}
            className="h-10 px-4 py-2 gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm font-semibold leading-[1.5] tracking-[0.28px]">
              Manage Dashboard
            </span>
          </Button>
        )}
        {onExport && (
          <Button
            variant="default"
            size="sm"
            onClick={onExport}
            className="h-10 px-4 py-2 gap-2"
          >
            <FileDown className="h-4 w-4" />
            <span className="text-sm font-semibold leading-[1.5] tracking-[0.28px]">
              Export
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
