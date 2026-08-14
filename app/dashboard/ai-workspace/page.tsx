"use client"

import { useCallback, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Bot,
  Sparkles,
  FileText,
  Target,
  MessageSquare,
  Wand2,
  BookOpen,
  Download,
  Copy,
  Check,
  RefreshCw,
  CircleAlert,
  Square,
} from "lucide-react"
import Link from "next/link"

type ToolId = "copilot" | "requirements" | "advisor" | "templates"

const aiTools = [
  {
    id: "copilot" as const,
    title: "AI Copilot",
    description: "Chat-style assistant for live queries and task automation",
    icon: MessageSquare,
    href: "/dashboard/ai-assistant",
  },
  {
    id: "requirements" as const,
    title: "Generate Requirements",
    description: "Use prompts to draft user stories, epics, and specifications",
    icon: FileText,
    href: "#requirements",
  },
  {
    id: "advisor" as const,
    title: "BA Method Advisor",
    description: "Learn and apply methodologies like BABOK, Agile, etc.",
    icon: BookOpen,
    href: "#advisor",
  },
  {
    id: "templates" as const,
    title: "Analysis Templates",
    description: "Auto-generate SWOT, PESTLE, impact analysis, etc.",
    icon: Target,
    href: "#templates",
  },
]

const requirementTemplates = [
  {
    id: "user-story",
    title: "User Story",
    description: "Generate user stories with acceptance criteria",
    placeholder:
      "a login system with multi-factor authentication for the customer portal. Users are enterprise admins; SSO is out of scope this quarter.",
  },
  {
    id: "epic",
    title: "Epic",
    description: "Generate high-level epics with breakdown",
    placeholder:
      "consolidating three regional checkout flows into one. Goal is to cut cart abandonment; must not disrupt the EU launch in Q3.",
  },
  {
    id: "acceptance-criteria",
    title: "Acceptance Criteria",
    description: "Generate detailed acceptance criteria",
    placeholder:
      "a bulk CSV import of product records, max 10k rows, with partial-failure reporting and an audit trail.",
  },
  {
    id: "functional-req",
    title: "Functional Requirements",
    description: "Generate functional requirements document",
    placeholder:
      "a role-based approval workflow for purchase orders above $5,000, with delegation and a full audit history.",
  },
]

const analysisTemplates = [
  {
    id: "swot",
    title: "SWOT Analysis",
    description: "Strengths, Weaknesses, Opportunities, Threats",
    fields: ["Project/Initiative", "Context"],
  },
  {
    id: "pestle",
    title: "PESTLE Analysis",
    description: "Political, Economic, Social, Technological, Legal, Environmental",
    fields: ["Industry/Market", "Scope"],
  },
  {
    id: "impact",
    title: "Impact Analysis",
    description: "Assess impact of proposed changes",
    fields: ["Change Description", "Affected Areas"],
  },
  {
    id: "stakeholder",
    title: "Stakeholder Analysis",
    description: "Identify and analyze project stakeholders",
    fields: ["Project Name", "Scope"],
  },
]

const advisorPrompts = [
  {
    title: "BABOK Guide",
    description: "Business Analysis Body of Knowledge",
    blurb: "Get guidance on BABOK knowledge areas and techniques.",
    cta: "Explore BABOK",
    prompt:
      "Walk me through the six BABOK v3 knowledge areas and, for a mid-size software project, which techniques from each I should actually use and which I can safely skip.",
  },
  {
    title: "Agile BA Practices",
    description: "Agile business analysis methods",
    blurb: "Learn agile BA techniques and best practices.",
    cta: "Learn Agile BA",
    prompt:
      "How does the BA role change on an agile team versus a waterfall project? Cover backlog refinement, just-in-time elicitation, and how much documentation is enough.",
  },
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function AIWorkspacePage() {
  const [selectedTool, setSelectedTool] = useState<ToolId>("requirements")
  const [requirementTab, setRequirementTab] = useState(requirementTemplates[0].id)
  const [analysisTab, setAnalysisTab] = useState(analysisTemplates[0].id)

  // Per-template input state, keyed so switching tabs doesn't lose what you typed.
  const [requirementInputs, setRequirementInputs] = useState<Record<string, string>>({})
  const [analysisInputs, setAnalysisInputs] = useState<Record<string, string>>({})
  const [advisorInput, setAdvisorInput] = useState("")

  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsGenerating(false)
  }, [])

  const generate = useCallback(
    async (body: { kind: "requirement" | "analysis" | "advisor"; template: string; input?: string; fields?: Record<string, string> }) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsGenerating(true)
      setError(null)
      setGeneratedContent("")
      setGeneratedTitle(body.template)
      setCopied(false)

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        if (!response.ok) {
          const detail = await response.text()
          setError(
            response.status === 503
              ? "AI is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart the dev server."
              : detail || `Request failed with status ${response.status}`,
          )
          return
        }

        if (!response.body) {
          setError("The server returned an empty response.")
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let received = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          received += chunk
          setGeneratedContent((prev) => prev + chunk)
        }

        // A 200 that streams zero bytes means the model call failed after the
        // response headers were sent — surface it instead of showing an empty panel.
        if (!received.trim()) {
          setError(
            "The model returned nothing. This usually means the API key is invalid or the configured model is unavailable for your project. Check the server logs and GOOGLE_GENERATIVE_AI_API_KEY.",
          )
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return
        setError(err instanceof Error ? err.message : "Something went wrong while generating.")
      } finally {
        if (abortRef.current === controller) abortRef.current = null
        setIsGenerating(false)
      }
    },
    [],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Could not copy to the clipboard. Select the text and copy it manually.")
    }
  }, [generatedContent])

  const handleExport = useCallback(() => {
    const blob = new Blob([generatedContent], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${slugify(generatedTitle) || "sol-artifact"}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [generatedContent, generatedTitle])

  const activeTool = aiTools.find((tool) => tool.id === selectedTool)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">AI Workspace</h1>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Gemini
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Leverage AI to accelerate your business analysis work with intelligent automation and guidance.
          </p>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiTools.map((tool) => {
          const Icon = tool.icon
          const isSelected = selectedTool === tool.id
          const isLink = tool.href.startsWith("/")

          return (
            <Card
              key={tool.id}
              className={`transition-all hover:shadow-md ${isSelected && !isLink ? "ring-2 ring-blue-500" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline" className="text-xs">
                    {isLink ? "chat" : "generator"}
                  </Badge>
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {isLink ? (
                  <Link href={tool.href}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Open Tool
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tool Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            {selectedTool === "requirements" && "Requirements Generator"}
            {selectedTool === "advisor" && "BA Method Advisor"}
            {selectedTool === "templates" && "Analysis Templates"}
            {selectedTool === "copilot" && "AI Copilot"}
          </CardTitle>
          {activeTool ? <CardDescription>{activeTool.description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          {selectedTool === "requirements" && (
            <Tabs value={requirementTab} onValueChange={setRequirementTab}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                {requirementTemplates.map((template) => (
                  <TabsTrigger key={template.id} value={template.id}>
                    {template.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {requirementTemplates.map((template) => {
                const value = requirementInputs[template.id] ?? ""
                return (
                  <TabsContent key={template.id} value={template.id} className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`req-input-${template.id}`}>Describe what you need:</Label>
                        <Textarea
                          id={`req-input-${template.id}`}
                          placeholder={template.placeholder}
                          className="mt-2 min-h-[120px]"
                          value={value}
                          onChange={(event) =>
                            setRequirementInputs((prev) => ({ ...prev, [template.id]: event.target.value }))
                          }
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                          The more context you give — actors, constraints, what is out of scope — the more specific the
                          output.
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          generate({ kind: "requirement", template: template.title, input: value })
                        }
                        disabled={isGenerating || !value.trim()}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate {template.title}
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          )}

          {selectedTool === "templates" && (
            <Tabs value={analysisTab} onValueChange={setAnalysisTab}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                {analysisTemplates.map((template) => (
                  <TabsTrigger key={template.id} value={template.id}>
                    {template.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {analysisTemplates.map((template) => {
                const fieldValues = template.fields.map(
                  (field) => analysisInputs[`${template.id}:${field}`] ?? "",
                )
                const hasInput = fieldValues.some((v) => v.trim())

                return (
                  <TabsContent key={template.id} value={template.id} className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    </div>
                    <div className="space-y-4">
                      {template.fields.map((field) => {
                        const key = `${template.id}:${field}`
                        return (
                          <div key={key}>
                            <Label htmlFor={key}>{field}:</Label>
                            <Input
                              id={key}
                              placeholder={`Enter ${field.toLowerCase()}...`}
                              className="mt-2"
                              value={analysisInputs[key] ?? ""}
                              onChange={(event) =>
                                setAnalysisInputs((prev) => ({ ...prev, [key]: event.target.value }))
                              }
                            />
                          </div>
                        )
                      })}
                      <Button
                        onClick={() =>
                          generate({
                            kind: "analysis",
                            template: template.title,
                            fields: Object.fromEntries(
                              template.fields.map((field) => [
                                field,
                                analysisInputs[`${template.id}:${field}`] ?? "",
                              ]),
                            ),
                          })
                        }
                        disabled={isGenerating || !hasInput}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate {template.title}
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          )}

          {selectedTool === "advisor" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advisorPrompts.map((item) => (
                  <Card key={item.title}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{item.blurb}</p>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        disabled={isGenerating}
                        onClick={() => {
                          setAdvisorInput(item.prompt)
                          generate({ kind: "advisor", template: item.title, input: item.prompt })
                        }}
                      >
                        {item.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ask the BA Advisor</CardTitle>
                  <CardDescription>Get personalized guidance on BA methodologies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Ask about BA techniques, methodologies, or best practices..."
                    className="min-h-[100px]"
                    value={advisorInput}
                    onChange={(event) => setAdvisorInput(event.target.value)}
                  />
                  <Button
                    className="w-full"
                    disabled={isGenerating || !advisorInput.trim()}
                    onClick={() =>
                      generate({ kind: "advisor", template: "BA Method Advisor", input: advisorInput })
                    }
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Get Advice
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTool === "copilot" && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Copilot</h3>
              <p className="text-muted-foreground mb-4">
                Your intelligent assistant for business analysis tasks and queries.
              </p>
              <Link href="/dashboard/ai-assistant">
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open AI Copilot
                </Button>
              </Link>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
            >
              <CircleAlert className="h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Generation failed</p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {/* Generated Content */}
          {(generatedContent || isGenerating) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    {generatedTitle || "Generated Content"}
                    {isGenerating ? (
                      <Badge variant="secondary">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Streaming
                      </Badge>
                    ) : null}
                  </span>
                  <div className="flex gap-2">
                    {isGenerating ? (
                      <Button variant="outline" size="sm" onClick={stop}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!generatedContent}>
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={!generatedContent}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                    {generatedContent || "Waiting for the first tokens..."}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
