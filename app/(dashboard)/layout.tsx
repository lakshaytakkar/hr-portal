import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export const dynamic = 'force-dynamic'

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <DashboardLayout>{children}</DashboardLayout>
    </ErrorBoundary>
  )
}

