"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, Linkedin, FileText, Briefcase, GraduationCap, Award, User } from "lucide-react"
import { Candidate, CandidateStatus } from "@/lib/types/candidate"
import { initialCandidates } from "@/lib/data/candidates"
import { ErrorState } from "@/components/ui/error-state"
import { DetailDialog } from "@/components/details"
import { useDetailNavigation } from "@/lib/hooks/useDetailNavigation"

const statusConfig: Record<CandidateStatus, { label: string; variant: "default" | "secondary" | "primary-outline" | "green-outline" | "red-outline" }> = {
  new: { label: "New", variant: "default" },
  screening: { label: "Screening", variant: "secondary" },
  interview: { label: "Interview", variant: "primary-outline" },
  offer: { label: "Offer", variant: "green-outline" },
  hired: { label: "Hired", variant: "green-outline" },
  rejected: { label: "Rejected", variant: "red-outline" },
}

async function fetchCandidate(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const candidate = initialCandidates.candidates.find((c) => c.id === id)
  if (!candidate) throw new Error("Candidate not found")
  return candidate
}

async function fetchAllCandidates() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return initialCandidates.candidates
}

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const candidateId = params.id as string
  const [isOpen, setIsOpen] = useState(true)
  const [notes, setNotes] = useState("")

  const { data: candidate, isLoading, error, refetch } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => fetchCandidate(candidateId),
  })

  const { data: allCandidates } = useQuery({
    queryKey: ["all-candidates"],
    queryFn: fetchAllCandidates,
  })

  // Handle 404 for missing candidates
  useEffect(() => {
    if (error && error instanceof Error && error.message.toLowerCase().includes("not found")) {
      notFound()
    }
    if (!isLoading && !error && !candidate) {
      notFound()
    }
  }, [error, isLoading, candidate])

  const navigation = useDetailNavigation({
    currentId: candidateId,
    items: allCandidates || [],
    getId: (c) => c.id,
    basePath: "/recruitment/candidates",
    onNavigate: (id) => {
      router.push(`/recruitment/candidates/${id}`)
    },
  })

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      router.push("/recruitment/candidates")
    }, 200)
  }

  if (isLoading) {
    return (
      <DetailDialog open={isOpen} onOpenChange={handleClose} title="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DetailDialog>
    )
  }

  if (error && (!(error instanceof Error) || !error.message.toLowerCase().includes("not found"))) {
    return (
      <DetailDialog open={isOpen} onOpenChange={handleClose} title="Error">
        <ErrorState
          title="Failed to load candidate"
          message="We couldn't load this candidate. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </DetailDialog>
    )
  }

  if (!candidate) {
    return null
  }

  const status = statusConfig[candidate.status]

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Contact Information</span>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <a href={`mailto:${candidate.email}`} className="text-sm text-primary hover:text-primary/80">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <a href={`tel:${candidate.phone}`} className="text-sm text-primary hover:text-primary/80">
                  {candidate.phone}
                </a>
              </div>
              {candidate.linkedIn && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                  <a
                    href={candidate.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Position</span>
            </div>
            <div className="pl-6">
              <p className="text-sm text-foreground font-medium">{candidate.positionApplied}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Status</span>
            </div>
            <div className="pl-6">
              <Badge variant={status.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                {status.label}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "experience",
      label: "Experience",
      content: (
        <div className="space-y-4">
          {candidate.experience ? (
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2 block">Experience</Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.experience}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No experience information provided.</p>
          )}

          {candidate.education && (
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.education}</p>
            </div>
          )}

          {candidate.skills && (
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2 block">Skills</Label>
              <p className="text-sm text-muted-foreground">{candidate.skills}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <div className="space-y-4">
          {candidate.resume ? (
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resume
              </Label>
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Resume
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No resume uploaded.</p>
          )}

          {candidate.coverLetter && (
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2 block">Cover Letter</Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.coverLetter}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "notes",
      label: "Notes",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">Add Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this candidate..."
              className="min-h-[150px]"
            />
          </div>
          {candidate.notes && (
            <div>
              <Label className="text-sm font-semibold text-foreground mb-2 block">Existing Notes</Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.notes}</p>
            </div>
          )}
        </div>
      ),
    },
  ]

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={navigation.navigatePrev}
          disabled={!navigation.hasPrev}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={navigation.navigateNext}
          disabled={!navigation.hasNext}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleClose}>
          Close
        </Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )

  return (
    <DetailDialog
      open={isOpen}
      onOpenChange={handleClose}
      title={candidate.fullName}
      tabs={tabs}
      footer={footer}
    />
  )
}

