"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, FileText, Mail, FileCheck, Shield, Printer } from "lucide-react"
import { CreateTemplateDialog } from "@/components/hr/CreateTemplateDrawer"

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("message")
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-[1.35]">
          Templates
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage HR templates, forms, policies, and printables
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted p-0.5 rounded-xl h-auto border-0">
          <TabsTrigger
            value="message"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Message Templates
          </TabsTrigger>
          <TabsTrigger
            value="forms"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Form Templates
          </TabsTrigger>
          <TabsTrigger
            value="policies"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Policy Templates
          </TabsTrigger>
          <TabsTrigger
            value="printables"
            className="h-10 px-6 py-0 rounded-[10px] text-sm font-semibold leading-5 tracking-[0.28px] data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium"
          >
            Printables
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Message Templates Tab */}
          <TabsContent value="message" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Message Templates</CardTitle>
                <Button onClick={() => setIsCreateTemplateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground mb-2">Coming Soon</p>
                  <p className="text-sm text-muted-foreground">
                    Create reusable email, SMS, and notification templates for HR communications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Templates Tab */}
          <TabsContent value="forms" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Form Templates</CardTitle>
                <Button onClick={() => setIsCreateTemplateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <FileCheck className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground mb-2">Coming Soon</p>
                  <p className="text-sm text-muted-foreground">
                    Create templates for onboarding forms, exit forms, and other HR documents.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policy Templates Tab */}
          <TabsContent value="policies" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Policy Templates</CardTitle>
                <Button onClick={() => setIsCreateTemplateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground mb-2">Coming Soon</p>
                  <p className="text-sm text-muted-foreground">
                    Create templates for company policies, guidelines, and compliance documents.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Printables Tab */}
          <TabsContent value="printables" className="mt-0">
            <Card className="border border-border rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Printables</CardTitle>
                <Button onClick={() => setIsCreateTemplateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Printer className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground mb-2">Coming Soon</p>
                  <p className="text-sm text-muted-foreground">
                    Create printable templates for certificates, letters, and other HR documents.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <CreateTemplateDialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen} />
    </div>
  )
}

