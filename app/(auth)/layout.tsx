import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-6 py-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">L</span>
            </div>
            <div className="leading-tight">
              <p className="font-semibold">LuminHR</p>
              <p className="text-xs text-muted-foreground">HR Portal</p>
            </div>
          </Link>
          <Link
            href="/design-system"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Design System
          </Link>
        </div>

        <div className="mt-10 flex justify-center flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}


