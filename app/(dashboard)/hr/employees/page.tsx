"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
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
  Users,
  UserCheck,
  Clock,
  Building2,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Employee } from "@/lib/types/hr"
import { initialEmployees } from "@/lib/data/hr"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { RowActionsMenu } from "@/components/actions/RowActionsMenu"
import { CreateEmployeeDialog } from "@/components/hr/CreateEmployeeDialog"
import { getAvatarForUser } from "@/lib/utils/avatars"

async function fetchEmployees() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return initialEmployees
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Active", variant: "default" },
  "on-leave": { label: "On Leave", variant: "secondary" },
  terminated: { label: "Terminated", variant: "outline" },
  resigned: { label: "Resigned", variant: "outline" },
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: React.ElementType
}) {
  return (
    <Card className="border border-border rounded-[14px] flex-1">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="bg-primary/10 rounded-full w-9 h-9 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground flex-1">{title}</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-foreground leading-[1.3]">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HREmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false)
  const { data: employees, isLoading, error, refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  })

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-border rounded-[14px]">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
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
        title="Failed to load employees"
        message="We couldn't load employees. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    )
  }

  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const activeCount = employees?.filter(e => e.status === "active").length || 0
  const totalCount = employees?.length || 0
  const onLeaveCount = employees?.filter(e => e.status === "on-leave").length || 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-[1.35]">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage employee information and records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="default" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateEmployeeOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Total Employees" value={totalCount.toString()} icon={Users} />
        <StatCard title="Active" value={activeCount.toString()} icon={UserCheck} />
        <StatCard title="On Leave" value={onLeaveCount.toString()} icon={Clock} />
      </div>

      <Card className="border border-border rounded-[14px]">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Employees List</h2>
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
                  <span className="text-sm font-medium text-muted-foreground">Employee</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Employee ID</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Department</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Position</span>
                </TableHead>
                <TableHead className="w-[144px] px-3">
                  <span className="text-sm font-medium text-muted-foreground">Hire Date</span>
                </TableHead>
                <TableHead className="px-3">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </TableHead>
                <TableHead className="w-[44px] px-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const status = statusConfig[employee.status] || statusConfig.active
                  return (
                    <TableRow key={employee.id} className="border-b border-border">
                      <TableCell className="px-3">
                        <Link href={`/hr/employees/${employee.id}`} className="flex items-center gap-2.5 hover:underline">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar || getAvatarForUser(employee.id)} alt={employee.fullName} />
                            <AvatarFallback className="text-xs">
                              {employee.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{employee.fullName}</span>
                            <span className="text-xs text-muted-foreground">{employee.email}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{employee.employeeId}</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant="primary" className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                          {employee.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">{employee.position}</span>
                      </TableCell>
                      <TableCell className="px-3">
                        <span className="text-sm font-medium text-foreground">
                          {new Date(employee.hireDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge variant={status.variant} className="h-5 px-2 py-0.5 rounded-2xl text-xs">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <RowActionsMenu
                          entityType="employee"
                          entityId={employee.id}
                          entityName={employee.fullName}
                          detailUrl={`/hr/employees/${employee.id}`}
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
                      icon={Users}
                      title="No employees yet"
                      description="Get started by adding your first employee."
                      action={{
                        label: "Add Employee",
                        onClick: () => setIsCreateEmployeeOpen(true),
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateEmployeeDialog open={isCreateEmployeeOpen} onOpenChange={setIsCreateEmployeeOpen} />
    </div>
  )
}
