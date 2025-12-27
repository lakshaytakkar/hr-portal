"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Briefcase,
  MapPin,
  Eye,
  UserPlus,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { JobPosting } from "@/lib/types/recruitment"
import { getJobPostings } from "@/lib/actions/recruitment"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { RowActionsMenu } from "@/components/actions/RowActionsMenu"
import { CreateJobPostingDialog } from "@/components/recruitment/CreateJobPostingDialog"
import { getAvatarForUser } from "@/lib/utils/avatars"

async function fetchJobPostings() {
  return await getJobPostings()
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  closed: { label: "Closed", variant: "secondary" },
}

export default function JobPostingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateJobPostingOpen, setIsCreateJobPostingOpen] = useState(false)
  const searchParams = useSearchParams()
  const viewMode = searchParams.get("view") || "team"
  const isMyView = viewMode === "my"
  const { data: jobPostings, isLoading, error, refetch } = useQuery({
    queryKey: ["job-postings"],
    queryFn: fetchJobPostings,
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
        title="Failed to load job postings"
        message="We couldn't load job postings. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  // Filter by view mode (my vs team) - would filter by postedBy in real app
  const filteredPostings = jobPostings?.filter(
    (posting) =>
      posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">
          {isMyView ? "My Job Postings" : "Job Postings"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isMyView
            ? "View job postings and manage recruitment listings"
            : "Manage all job postings, create new listings, and track application status"}
        </p>
      </div>

      <Card className="border border-border rounded-[14px]">
        <div className="flex h-16 items-center justify-between border-b border-border px-5 py-2 bg-white">
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
          <Button onClick={() => setIsCreateJobPostingOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Job Posting
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="w-[200px] px-3">
                  <span className="text-sm font-medium text-muted-foreground">Title</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Department</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Location</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Type</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Posted By</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Views</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Applications</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </TableHead>
                <TableHead className="w-[44px] px-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPostings.length > 0 ? (
                filteredPostings.map((posting) => {
                  const status = statusConfig[posting.status] || statusConfig.draft
                  return (
                    <TableRow key={posting.id} className="border-b border-border">
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{posting.title}</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant="primary" className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                          {posting.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{posting.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant="outline" className="h-5 px-2 py-0.5 rounded-2xl text-xs capitalize">
                          {posting.employmentType}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getAvatarForUser(posting.postedBy.id || posting.postedBy.name)} alt={posting.postedBy.name} />
                            <AvatarFallback className="text-xs">
                              {posting.postedBy.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{posting.postedBy.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{posting.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center gap-1.5">
                          <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{posting.applications || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant={status.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <RowActionsMenu
                          entityType="job-posting"
                          entityId={posting.id}
                          entityName={posting.title}
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
                  <TableCell colSpan={9} className="h-24">
                    <EmptyState
                      icon={Briefcase}
                      title="No job postings yet"
                      description="Create your first job posting to attract candidates."
                      action={{
                        label: "Create Job Posting",
                        onClick: () => setIsCreateJobPostingOpen(true),
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateJobPostingDialog open={isCreateJobPostingOpen} onOpenChange={setIsCreateJobPostingOpen} />
    </div>
  )
}

