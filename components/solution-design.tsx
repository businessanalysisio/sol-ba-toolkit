// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LayoutTemplate,
  Workflow,
  Database,
  TestTube,
  Lightbulb,
  Download,
  Share,
  Edit,
  CheckCircle,
  Clock,
  Loader2,
  BarChart3,
  GitMerge,
  AlertTriangle,
} from "lucide-react"
import { fetchDesignTemplates, fetchRecentDesigns, generateMockup } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

export default function SolutionDesign() {
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [contextInput, setContextInput] = useState("")
  const [generatedDesign, setGeneratedDesign] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [designTemplates, setDesignTemplates] = useState([])
  const [recentDesigns, setRecentDesigns] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [isLoadingRecentDesigns, setIsLoadingRecentDesigns] = useState(true)

  useEffect(() => {
    const loadDesignData = async () => {
      setIsLoadingTemplates(true)
      const templates = await fetchDesignTemplates()
      setDesignTemplates(templates)
      setIsLoadingTemplates(false)

      setIsLoadingRecentDesigns(true)
      const recent = await fetchRecentDesigns()
      setRecentDesigns(recent)
      setIsLoadingRecentDesigns(false)
    }
    loadDesignData()
  }, [])

  const handleGenerateMockup = async () => {
    if (!selectedTemplate || !contextInput) return
    setIsGenerating(true)
    setGeneratedDesign("") // Clear previous generation

    const result = await generateMockup(selectedTemplate, contextInput)

    if (result.success) {
      setGeneratedDesign(result.content)
      toast({
        title: "Mockup Generated!",
        description: "Your design description is ready.",
      })
      // Optionally refresh recent designs if the action adds to it
      const updatedRecent = await fetchRecentDesigns()
      setRecentDesigns(updatedRecent)
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Could not generate mockup. Check API key.",
        variant: "destructive",
      })
    }
    setIsGenerating(false)
  }

  const getDesignIcon = (type: string) => {
    switch (type) {
      case "Layout":
        return <LayoutTemplate className="h-4 w-4 mr-2" />
      case "Workflow":
        return <Workflow className="h-4 w-4 mr-2" />
      case "Data Model":
        return <Database className="h-4 w-4 mr-2" />
      default:
        return <Lightbulb className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Design Generator</TabsTrigger>
          <TabsTrigger value="recent">Recent Designs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LayoutTemplate className="h-5 w-5 mr-2" />
                  AI Design Generator
                </CardTitle>
                <CardDescription>Generate layout mockups, workflows, or data models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="design-type">Design Type / Template</Label>
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center h-10">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select design type" />
                      </SelectTrigger>
                      <SelectContent>
                        {designTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Context / Specifics</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe the specific page, flow, or data entities (e.g., 'B2C product details page with image gallery and add to cart', 'User registration workflow with email verification')..."
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleGenerateMockup}
                  disabled={!selectedTemplate || !contextInput || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Generate Design
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Generated Design Description
                  </span>
                  {generatedDesign && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>AI-generated textual description of your design</CardDescription>
              </CardHeader>
              <CardContent>
                {!generatedDesign ? (
                  <div className="text-center text-muted-foreground py-8">
                    <LayoutTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a template and generate to see results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">{generatedDesign}</pre>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Generated: Just now</span>
                      <span>Word count: ~{generatedDesign.split(" ").length}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Designs</CardTitle>
              <CardDescription>Your recently generated and modified designs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecentDesigns ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading recent designs...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDesigns.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No recent designs found.</div>
                  ) : (
                    recentDesigns.map((design) => (
                      <div key={design.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getDesignIcon(design.type)}
                          <div>
                            <h4 className="font-medium">{design.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {design.lastModified} • {design.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{design.type}</Badge>
                          <Badge
                            variant={
                              design.status === "Approved"
                                ? "secondary"
                                : design.status === "Review"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {design.status === "Approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {design.status === "Review" && <Clock className="h-3 w-3 mr-1" />}
                            {design.status === "Draft" && <Edit className="h-3 w-3 mr-1" />}
                            {design.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoadingTemplates ? (
              <div className="text-center py-8 col-span-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                <p className="text-muted-foreground mt-2">Loading templates...</p>
              </div>
            ) : (
              designTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template.id)}>
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Impact Analysis & Test Cases
          </CardTitle>
          <CardDescription>Simulate system behavior and draft test cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <GitMerge className="h-4 w-4 mr-2 text-blue-500" />
              Potential Integration Issues
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Payment Gateway API rate limits might impact high transaction volumes.</li>
              <li>Data synchronization challenges between Product Catalog and ERP system.</li>
              <li>Authentication token expiry handling across B2C and B2B apps.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Scaling Concerns
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Database read/write contention during peak order processing.</li>
              <li>Notification service scalability for large-scale marketing campaigns.</li>
              <li>Load balancing for tiered partner pricing calculations.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <TestTube className="h-4 w-4 mr-2 text-green-500" />
              Draft Test Cases
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>**B2C Checkout:** Verify successful purchase with various payment methods.</li>
              <li>**B2B Tiered Pricing:** Confirm correct pricing applied for Silver, Gold, Platinum partners.</li>
              <li>**Back-Order Request:** Test submission, admin approval/denial, and partner notification.</li>
              <li>**RBAC Security:** Ensure unauthorized users cannot access B2B portal or Admin Panel features.</li>
              <li>**Product Search Performance:** Measure response time for large catalog searches.</li>
              <li>**User Registration:** Test edge cases for invalid email formats and existing users.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
