"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  FileDown,
  Search,
  Filter,
  UserPlus,
  FileText,
  Phone,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Candidate } from "@/lib/types/candidate"
import { getCandidates } from "@/lib/actions/recruitment"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { RowActionsMenu } from "@/components/actions/RowActionsMenu"
import { CreateCandidateDialog } from "@/components/recruitment/CreateCandidateDialog"

async function fetchCandidates() {
  return await getCandidates()
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "New", variant: "default" },
  screening: { label: "Screening", variant: "secondary" },
  interview: { label: "Interview", variant: "default" },
  offer: { label: "Offer", variant: "secondary" },
  hired: { label: "Hired", variant: "default" },
  rejected: { label: "Rejected", variant: "outline" },
}

const sourceConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  linkedin: { label: "LinkedIn", variant: "default" },
  referral: { label: "Referral", variant: "secondary" },
  "job-board": { label: "Job Board", variant: "outline" },
  website: { label: "Website", variant: "default" },
  other: { label: "Other", variant: "outline" },
}

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateCandidateOpen, setIsCreateCandidateOpen] = useState(false)
  const searchParams = useSearchParams()
  const viewMode = searchParams.get("view") || "team"
  const isMyView = viewMode === "my"
  const { data: candidates, isLoading, error, refetch } = useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  })

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="border border-border rounded-[14px]">
          <CardContent className="p-5">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load candidates"
        message="We couldn't load candidates. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  // Filter by view mode (my vs team) - for now, show all, but this would filter by assignedTo in real app
  const filteredCandidates = candidates?.filter(
    (candidate) =>
      candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.positionApplied.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.status.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const newCount = candidates?.filter(c => c.status === "new").length || 0
  const interviewCount = candidates?.filter(c => c.status === "interview").length || 0
  const hiredCount = candidates?.filter(c => c.status === "hired").length || 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">
          {isMyView ? "My Candidates" : "Candidates"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isMyView
            ? "Manage your candidates and track recruitment pipeline"
            : "Manage all team candidates, track recruitment pipeline, and monitor hiring progress"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            New
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">
              {newCount}
            </p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            In Interview
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">
              {interviewCount}
            </p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="border border-border rounded-2xl p-[18px] bg-white">
          <p className="text-sm text-muted-foreground font-medium leading-5 tracking-[0.28px] mb-0.5">
            Hired
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xl font-semibold text-foreground leading-[1.35]">
              {hiredCount}
            </p>
            <div className="bg-primary/10 rounded-lg w-9 h-9 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-border rounded-[14px]">
        <div className="flex items-center justify-between border-b border-border px-5 pt-0 pb-2 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-[38px] border-border rounded-lg"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 h-[38px]">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          <Button onClick={() => setIsCreateCandidateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Candidate
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-0">
                <TableHead className="w-[200px] px-3 py-0">
                  <span className="text-sm font-medium text-muted-foreground">Name</span>
                </TableHead>
                <TableHead className="px-3 py-0">
                  <span className="text-sm font-medium text-muted-foreground">Position</span>
                </TableHead>
                <TableHead className="px-3 py-0">
                  <span className="text-sm font-medium text-muted-foreground">Contact</span>
                </TableHead>
                <TableHead className="px-3 py-0">
                  <span className="text-sm font-medium text-muted-foreground">Source</span>
                </TableHead>
                <TableHead className="px-3 py-0">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </TableHead>
                <TableHead className="w-[144px] px-3 py-0">
                  <span className="text-sm font-medium text-muted-foreground">Applied</span>
                </TableHead>
                <TableHead className="w-[44px] px-3 py-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => {
                  const status = statusConfig[candidate.status] || statusConfig.new
                  const source = candidate.source ? (sourceConfig[candidate.source] || sourceConfig.other) : null
                  return (
                    <TableRow key={candidate.id} className="border-b border-border">
                      <TableCell className="px-3">
                        <Link href={`/recruitment/candidates/${candidate.id}`} className="hover:underline">
                          <span className="text-sm font-medium text-foreground">{candidate.fullName}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{candidate.positionApplied}</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{candidate.email}</span>
                          </div>
                          {candidate.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{candidate.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        {source ? (
                          <Badge variant={source.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                            {source.label}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant={status.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">
                          {new Date(candidate.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-3">
                        <RowActionsMenu
                          entityType="candidate"
                          entityId={candidate.id}
                          entityName={candidate.fullName}
                          detailUrl={`/recruitment/candidates/${candidate.id}`}
                          canView={true}
                          canEdit={true}
                          canDelete={false}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24">
                    <EmptyState
                      icon={UserPlus}
                      title="No candidates yet"
                      description="Get started by adding your first candidate."
                      action={{
                        label: "Add Candidate",
                        onClick: () => setIsCreateCandidateOpen(true),
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateCandidateDialog open={isCreateCandidateOpen} onOpenChange={setIsCreateCandidateOpen} />
    </div>
  )
}

