// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, FileText, Download, Share, Edit, CheckCircle, Clock, Target, Zap, Loader2 } from "lucide-react"
import { fetchDocumentTemplates, fetchRecentDocuments, generateDocumentContent } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

export default function Documentation() {
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [contextInput, setContextInput] = useState("")
  const [stakeholderInput, setStakeholderInput] = useState("")
  const [priorityInput, setPriorityInput] = useState("medium")
  const [generatedDoc, setGeneratedDoc] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [documentTemplates, setDocumentTemplates] = useState([])
  const [recentDocuments, setRecentDocuments] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [isLoadingRecentDocs, setIsLoadingRecentDocs] = useState(true)

  useEffect(() => {
    const loadDocumentData = async () => {
      setIsLoadingTemplates(true)
      const templates = await fetchDocumentTemplates()
      setDocumentTemplates(templates)
      setIsLoadingTemplates(false)

      setIsLoadingRecentDocs(true)
      const recent = await fetchRecentDocuments()
      setRecentDocuments(recent)
      setIsLoadingRecentDocs(false)
    }
    loadDocumentData()
  }, [])

  const currentTemplate = documentTemplates.find((t) => t.id === selectedTemplate)

  const handleGenerateDocument = async () => {
    if (!selectedTemplate || !contextInput) return
    setIsGenerating(true)
    setGeneratedDoc("") // Clear previous generation

    const result = await generateDocumentContent(selectedTemplate, contextInput, stakeholderInput, priorityInput)

    if (result.success) {
      setGeneratedDoc(result.content)
      toast({
        title: "Document Generated!",
        description: "Your document content is ready.",
      })
      // Refresh recent documents
      const updatedRecent = await fetchRecentDocuments()
      setRecentDocuments(updatedRecent)
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Could not generate document. Check API key.",
        variant: "destructive",
      })
    }
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Document Generator</TabsTrigger>
          <TabsTrigger value="recent">Recent Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Document Generator
                </CardTitle>
                <CardDescription>Generate context-aware documentation from requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-type">Document Type</Label>
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center h-10">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {currentTemplate && (
                  <div className="space-y-2">
                    <Label>Template Sections</Label>
                    <div className="text-sm space-y-1">
                      {currentTemplate.sections.map((section, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="context">Project Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe the project, features, and any specific requirements (e.g., 'E-commerce platform with B2C and B2B capabilities, tiered pricing, and admin panel')..."
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stakeholder">Primary Stakeholder</Label>
                    <Input
                      id="stakeholder"
                      placeholder="e.g., Product Manager"
                      value={stakeholderInput}
                      onChange={(e) => setStakeholderInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={priorityInput} onValueChange={setPriorityInput}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateDocument}
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
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Generated Document
                  </span>
                  {generatedDoc && (
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
                <CardDescription>AI-generated documentation based on your inputs</CardDescription>
              </CardHeader>
              <CardContent>
                {!generatedDoc ? (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a template and generate to see results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">{generatedDoc}</pre>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Generated: Just now</span>
                      <span>Word count: ~{generatedDoc.split(" ").length}</span>
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
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Your recently created and modified documents</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecentDocs ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading recent documents...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDocuments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No recent documents found.</div>
                  ) : (
                    recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{doc.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {doc.author} • {doc.lastModified} • {doc.version}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{doc.type}</Badge>
                          <Badge
                            variant={
                              doc.status === "Approved" ? "secondary" : doc.status === "Review" ? "default" : "outline"
                            }
                          >
                            {doc.status === "Approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {doc.status === "Review" && <Clock className="h-3 w-3 mr-1" />}
                            {doc.status === "Draft" && <Edit className="h-3 w-3 mr-1" />}
                            {doc.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Open
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
              documentTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Included Sections:</h4>
                        <div className="space-y-1">
                          {template.sections.map((section, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <Target className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span>{section}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template.id)}>
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
