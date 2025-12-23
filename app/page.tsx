"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data type
interface User {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

// Mock API function
async function fetchUsers(): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  return [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", status: "inactive" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Developer", status: "active" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "Designer", status: "active" },
  ]
}

export default function Home() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  const foundations = [
    {
      title: "Typography",
      description: "Font families, sizes, weights, and line heights",
      href: "/design-system/foundations/typography",
    },
    {
      title: "Colors",
      description: "Color palette including primary, greyscale, and alert colors",
      href: "/design-system/foundations/colors",
    },
    {
      title: "Shadow",
      description: "Elevation and depth through shadow utilities",
      href: "/design-system/foundations/shadow",
    },
    {
      title: "Icons",
      description: "Icon library and usage",
      href: "/design-system/foundations/icons",
    },
    {
      title: "Logos & Cursor",
      description: "Brand logos and cursor styles",
      href: "/design-system/foundations/logos-cursor",
    },
  ]

  const components = [
    {
      title: "Buttons",
      description: "Button variants, sizes, and states",
      href: "/design-system/components/buttons",
    },
    {
      title: "Forms",
      description: "Input fields, selects, checkboxes, and more",
      href: "/design-system/components/forms",
    },
    {
      title: "Badges",
      description: "Badge variants and styles",
      href: "/design-system/components/badges",
    },
    {
      title: "Avatar",
      description: "User avatars with sizes and presence",
      href: "/design-system/components/avatar",
    },
    {
      title: "Composites",
      description: "Higher-level UI components and layouts",
      href: "/design-system/components/composites",
    },
  ]

  const auth = [
    {
      title: "Sign in",
      description: "Login form (frontend-only)",
      href: "/sign-in",
    },
    {
      title: "Sign up",
      description: "Registration form (frontend-only)",
      href: "/sign-up",
    },
  ]

  const dashboard = [
    {
      title: "Attendance",
      description: "Employee attendance tracking and management",
      href: "/attendance",
    },
    {
      title: "Projects",
      description: "Project management and task tracking",
      href: "/projects",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HR Portal</h1>
            <p className="text-muted-foreground">
              Employee management system built with Next.js, Tailwind CSS, shadcn/ui, and TanStack Query
            </p>
          </div>
          <Link href="/design-system" className="shrink-0">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Design System</CardTitle>
                <CardDescription>View design tokens and components</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pages index</CardTitle>
            <CardDescription>All Design System routes currently implemented</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                  Foundations
                </h2>
                <Link
                  href="/design-system"
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  Open Design System →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foundations.map((item) => (
                  <Link key={item.href} href={item.href} className="block">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                Components
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.map((item) => (
                  <Link key={item.href} href={item.href} className="block">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                Auth
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auth.map((item) => (
                  <Link key={item.href} href={item.href} className="block">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboard.map((item) => (
                  <Link key={item.href} href={item.href} className="block">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    Error loading data
                  </TableCell>
                </TableRow>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
