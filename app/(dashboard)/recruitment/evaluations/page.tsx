"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
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
  FileDown,
  Search,
  Filter,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  UserCheck,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Evaluation } from "@/lib/types/recruitment"
import { getEvaluations } from "@/lib/actions/recruitment"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { RowActionsMenu } from "@/components/actions/RowActionsMenu"
import { getAvatarForUser } from "@/lib/utils/avatars"

async function fetchEvaluations() {
  return await getEvaluations()
}

const recommendationConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ElementType }> = {
  hire: { label: "Hire", variant: "default", icon: UserCheck },
  maybe: { label: "Maybe", variant: "secondary", icon: TrendingUp },
  "no-hire": { label: "No Hire", variant: "outline", icon: X },
}

export default function RecruitmentEvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: evaluations, isLoading, error, refetch } = useQuery({
    queryKey: ["evaluations"],
    queryFn: fetchEvaluations,
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
        title="Failed to load evaluations"
        message="We couldn't load evaluations. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  const filteredEvaluations = evaluations?.filter(
    (eval_) =>
      eval_.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eval_.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eval_.position.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">Review candidate evaluations and feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="default" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border border-border rounded-[14px]">
        <div className="flex h-16 items-center justify-between border-b border-border px-5 py-2 bg-white">
          <h2 className="text-base font-semibold text-foreground">Candidate Evaluations</h2>
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
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="w-[200px] px-3">
                  <span className="text-sm font-medium text-muted-foreground">Candidate</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Position</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Evaluated By</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Technical</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Communication</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Cultural Fit</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Overall</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Recommendation</span>
                </TableHead>
                <TableHead className="w-[44px] px-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((evaluation) => {
                  const recommendation = recommendationConfig[evaluation.recommendation] || recommendationConfig.maybe
                  const RecommendationIcon = recommendation.icon
                  return (
                    <TableRow key={evaluation.id} className="border-b border-border">
                      <TableCell className="px-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{evaluation.candidateName}</span>
                          <span className="text-xs text-muted-foreground">{evaluation.candidateEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{evaluation.position}</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getAvatarForUser(evaluation.evaluatedBy.id || evaluation.evaluatedBy.name)} alt={evaluation.evaluatedBy.name} />
                            <AvatarFallback className="text-xs">
                              {evaluation.evaluatedBy.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{evaluation.evaluatedBy.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{evaluation.technicalScore}/10</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{evaluation.communicationScore}/10</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{evaluation.culturalFitScore}/10</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-semibold text-foreground">{evaluation.overallScore}/10</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant={recommendation.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs gap-1">
                          <RecommendationIcon className="h-3 w-3" />
                          {recommendation.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <RowActionsMenu
                          entityType="evaluation"
                          entityId={evaluation.id}
                          entityName={evaluation.candidateName}
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
                      icon={ClipboardCheck}
                      title="No evaluations yet"
                      description="Candidate evaluations will appear here once they are submitted."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
