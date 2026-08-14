"use client"

import { useCallback, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eyebrow, LetterTile } from "@/components/sol/status"
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
    description: "Ask BA questions in context of the workspace",
    icon: MessageSquare,
    href: "/dashboard/ai-assistant",
    letter: "C",
    tone: "gold" as const,
  },
  {
    id: "requirements" as const,
    title: "Generate Requirements",
    description: "Draft functional requirements from a business context",
    icon: FileText,
    href: "#requirements",
    letter: "G",
    tone: "info" as const,
  },
  {
    id: "advisor" as const,
    title: "BA Method Advisor",
    description: "Recommend the elicitation or analysis method to use next",
    icon: BookOpen,
    href: "#advisor",
    letter: "M",
    tone: "mint" as const,
  },
  {
    id: "templates" as const,
    title: "Analysis Templates",
    description: "Start from user story, SWOT, PESTLE, or impact analysis",
    icon: Target,
    href: "#templates",
    letter: "T",
    tone: "violet" as const,
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
              ? "AI is not configured. Sign in with `claude` to use your Claude subscription, or add GOOGLE_GENERATIVE_AI_API_KEY to .env.local, then restart the server."
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
            "The model returned nothing. Check the server logs — usually the Claude sign-in has expired, or the configured Gemini key or model is unavailable.",
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
    <div className="mx-auto max-w-[1380px] space-y-7 p-5 md:p-9 lg:p-12">
      <header>
        <Eyebrow>AI workspace</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
          Evidence first. Every answer carries its source.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Generate requirements, choose a method, or ask the copilot — each answer names the
          context it was drawn from.
        </p>
      </header>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {aiTools.map((tool) => {
          const isSelected = selectedTool === tool.id
          const isLink = tool.href.startsWith("/")
          const body = (
            <>
              <LetterTile letter={tool.letter} tone={tool.tone} />
              <h2 className="mt-4 font-semibold text-white">{tool.title}</h2>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{tool.description}</p>
            </>
          )
          const shell = `rounded-2xl border p-5 text-left transition ${
            isSelected && !isLink
              ? "border-sol-gold/45 bg-sol-gold/[0.06]"
              : "border-white/[0.09] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]"
          }`

          return isLink ? (
            <Link key={tool.id} href={tool.href} className={`${shell} block`}>
              {body}
            </Link>
          ) : (
            <button
              key={tool.id}
              type="button"
              onClick={() => setSelectedTool(tool.id)}
              aria-pressed={isSelected}
              className={`${shell} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol-gold`}
            >
              {body}
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-start">
        {/* Form column */}
          <Card className="rounded-2xl border-white/[0.09] bg-white/[0.02]">
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
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                  {requirementTemplates.map((template) => (
                    <TabsTrigger
                    key={template.id}
                    value={template.id}
                    className="rounded-full border border-white/[0.14] px-3.5 py-1.5 text-sm text-muted-foreground data-[state=active]:border-sol-gold/50 data-[state=active]:bg-sol-gold/10 data-[state=active]:text-sol-gold data-[state=active]:shadow-none"
                  >
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
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                  {analysisTemplates.map((template) => (
                    <TabsTrigger
                    key={template.id}
                    value={template.id}
                    className="rounded-full border border-white/[0.14] px-3.5 py-1.5 text-sm text-muted-foreground data-[state=active]:border-sol-gold/50 data-[state=active]:bg-sol-gold/10 data-[state=active]:text-sol-gold data-[state=active]:shadow-none"
                  >
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


        </CardContent>
      </Card>

        {/* Evidence column — what the model produced, and what it drew on */}
        <section className="space-y-4" aria-live="polite">

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
            <Card className="rounded-2xl border-white/[0.09] bg-white/[0.02]">
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

          {!error && !generatedContent && !isGenerating && (
            <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center">
              <p className="font-medium text-white">Nothing generated yet</p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
                Fill in the context on the left and run it. The result appears here with the
                template it came from, ready to copy or export.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
