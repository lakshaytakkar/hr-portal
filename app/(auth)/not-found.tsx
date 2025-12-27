"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
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
        </div>

        <div className="mt-10 flex justify-center flex-1 flex-col">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-foreground">404</h1>
              <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
              <p className="text-sm text-muted-foreground">
                The authentication page you're looking for doesn't exist.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/sign-in">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Sign In
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

