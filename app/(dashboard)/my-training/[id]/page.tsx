"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, Clock, Calendar, CheckCircle2, Play, ArrowLeft } from "lucide-react"
import { Training, TrainingStatus } from "@/lib/types/my-workspace"
import { initialTrainings } from "@/lib/data/my-workspace"
import { cn } from "@/lib/utils"
import { ErrorState } from "@/components/ui/error-state"
import { QuickDetailModal } from "@/components/details"
import { useDetailNavigation } from "@/lib/hooks/useDetailNavigation"

const statusConfig: Record<TrainingStatus, { label: string; variant: "neutral-outline" | "primary-outline" | "green-outline" }> = {
  "not-started": { label: "Not Started", variant: "neutral-outline" },
  "in-progress": { label: "In Progress", variant: "primary-outline" },
  completed: { label: "Completed", variant: "green-outline" },
}

async function fetchTraining(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const training = initialTrainings.find((t) => t.id === id)
  if (!training) throw new Error("Training not found")
  return training
}

async function fetchAllTrainings() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return initialTrainings
}

export default function TrainingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const trainingId = params.id as string
  const [isOpen, setIsOpen] = useState(true)

  const { data: training, isLoading, error, refetch } = useQuery({
    queryKey: ["training", trainingId],
    queryFn: () => fetchTraining(trainingId),
  })

  const { data: allTrainings } = useQuery({
    queryKey: ["all-trainings"],
    queryFn: fetchAllTrainings,
  })

  // Handle 404 for missing trainings
  useEffect(() => {
    if (error && error instanceof Error && error.message.toLowerCase().includes("not found")) {
      notFound()
    }
    if (!isLoading && !error && !training) {
      notFound()
    }
  }, [error, isLoading, training])

  const navigation = useDetailNavigation({
    currentId: trainingId,
    items: allTrainings || [],
    getId: (t) => t.id,
    basePath: "/my-training",
    onNavigate: (id) => {
      router.push(`/my-training/${id}`)
    },
  })

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      router.push("/my-training")
    }, 200)
  }

  if (isLoading) {
    return (
      <QuickDetailModal open={isOpen} onOpenChange={handleClose} title="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </QuickDetailModal>
    )
  }

  if (error && (!(error instanceof Error) || !error.message.toLowerCase().includes("not found"))) {
    return (
      <QuickDetailModal open={isOpen} onOpenChange={handleClose} title="Error">
        <ErrorState
          title="Failed to load training"
          message="We couldn't load this training. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </QuickDetailModal>
    )
  }

  if (!training) {
    return null
  }

  const status = statusConfig[training.status]

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
        {training.status !== "completed" && (
          <Button>
            <Play className="h-4 w-4 mr-2" />
            {training.status === "not-started" ? "Start Training" : "Continue Training"}
          </Button>
        )}
        {training.status === "completed" && (
          <Button variant="outline">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <QuickDetailModal
      open={isOpen}
      onOpenChange={handleClose}
      title={training.title}
      footer={footer}
    >
      <div className="space-y-4">
        {/* Status and Category */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={status.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs">
            {status.label}
          </Badge>
          <Badge variant="outline" className="h-5 px-2 py-0.5 rounded-2xl text-xs">
            {training.category}
          </Badge>
          {training.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{training.duration} minutes</span>
            </div>
          )}
        </div>

        {/* Description */}
        {training.description && (
          <div>
            <p className="text-sm text-foreground leading-relaxed">{training.description}</p>
          </div>
        )}

        {/* Progress */}
        {training.status === "in-progress" && training.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Progress</span>
              <span className="text-sm text-foreground font-medium">{training.progress}%</span>
            </div>
            <div className="relative w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-l-full transition-all",
                  training.progress === 100 ? "bg-status-completed-foreground" : "bg-primary"
                )}
                style={{ width: `${training.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-xs text-muted-foreground font-medium">Started</span>
              <p className="text-sm text-foreground font-medium">
                {new Date(training.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {training.completedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-status-completed-foreground" />
              <div>
                <span className="text-xs text-muted-foreground font-medium">Completed</span>
                <p className="text-sm text-foreground font-medium">
                  {new Date(training.completedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-xs text-muted-foreground font-medium">Last Updated</span>
              <p className="text-sm text-foreground font-medium">
                {new Date(training.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Training Link */}
        {training.url && (
          <div className="pt-2 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <a href={training.url} target="_blank" rel="noopener noreferrer">
                <GraduationCap className="h-4 w-4 mr-2" />
                Open Training Course
              </a>
            </Button>
          </div>
        )}
      </div>
    </QuickDetailModal>
  )
}

