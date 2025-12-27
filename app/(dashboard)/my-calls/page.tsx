"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, CalendarPlus } from "lucide-react"
import { ScheduleCallDialog } from "@/components/calls/ScheduleCallDialog"
import { EditCallDialog } from "@/components/calls/EditCallDialog"
import { LogOutcomeDialog } from "@/components/calls/LogOutcomeDialog"
import { RowActionsMenu } from "@/components/actions/RowActionsMenu"
import { FileText } from "lucide-react"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"

type CallFilter = "all" | "scheduled" | "today" | "this-week" | "completed"

async function fetchCalls() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [] // Empty for now - will be replaced with actual data
}

export default function MyCallsPage() {
  const [activeFilter, setActiveFilter] = useState<CallFilter>("all")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isLogOutcomeOpen, setIsLogOutcomeOpen] = useState(false)
  const [editingCallId, setEditingCallId] = useState<string | null>(null)
  const [loggingOutcomeCallId, setLoggingOutcomeCallId] = useState<string | null>(null)
  const { data: calls, isLoading, error, refetch } = useQuery({
    queryKey: ["calls"],
    queryFn: fetchCalls,
  })

  const handleEditCall = (callId: string) => {
    setEditingCallId(callId)
    setIsEditDrawerOpen(true)
  }

  const handleLogOutcome = (callId: string) => {
    setLoggingOutcomeCallId(callId)
    setIsLogOutcomeOpen(true)
  }

  const handleDeleteCall = async (callId: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Delete call:", callId)
        refetch()
        resolve()
      }, 500)
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border rounded-2xl p-[18px] bg-white">
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex items-center justify-between mt-0.5">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="border border-border rounded-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-4 pb-2 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-5 gap-4 py-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load calls"
        message="We couldn't load your calls. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">My Calls</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View call history and schedule upcoming calls
          </p>
        </div>
        <Button 
          onClick={() => setIsDrawerOpen(true)}
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Schedule Call
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            Total Calls
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">0</p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            Today
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">0</p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            This Week
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">0</p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            Completed
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">0</p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as CallFilter)}>
        <TabsList className="bg-muted p-0.5 rounded-xl h-auto border-0">
          <TabsTrigger
            value="all"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            All Calls
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="today"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="this-week"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            This Week
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="all" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle>All Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="h-24">
                        <EmptyState
                          icon={Phone}
                          title="No calls yet"
                          description="All your calls (scheduled and completed) will appear here."
                          action={{
                            label: "Schedule Your First Call",
                            onClick: () => setIsDrawerOpen(true),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle>Upcoming Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="h-24">
                        <EmptyState
                          icon={Phone}
                          title="No scheduled calls"
                          description="Schedule calls to manage your upcoming outreach activities."
                          action={{
                            label: "Schedule Your First Call",
                            onClick: () => setIsDrawerOpen(true),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle>Calls Today</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="h-24">
                        <EmptyState
                          icon={Phone}
                          title="No calls scheduled for today"
                          description="Calls happening today will appear here."
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="this-week" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle>This Week's Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="h-24">
                        <EmptyState
                          icon={Phone}
                          title="No calls scheduled for this week"
                          description="Calls scheduled this week will appear here."
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle>Call History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="h-24">
                        <EmptyState
                          icon={Phone}
                          title="No completed calls"
                          description="View your call history here. Completed calls from external sources will appear automatically."
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Schedule Call Drawer */}
      <ScheduleCallDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      
      {/* Edit Call Dialog */}
      <EditCallDialog
        open={isEditDrawerOpen}
        onOpenChange={(open) => {
          setIsEditDrawerOpen(open)
          if (!open) {
            setEditingCallId(null)
          }
        }}
        call={editingCallId ? { id: editingCallId, contactName: "", phone: "", date: "", time: "" } : null}
      />
      
      {/* Log Outcome Dialog */}
      <LogOutcomeDialog
        open={isLogOutcomeOpen}
        onOpenChange={(open) => {
          setIsLogOutcomeOpen(open)
          if (!open) {
            setLoggingOutcomeCallId(null)
          }
        }}
        callId={loggingOutcomeCallId || undefined}
      />
    </div>
  )
}

