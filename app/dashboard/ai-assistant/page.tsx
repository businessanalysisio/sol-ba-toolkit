"use client"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Send, Sparkles, FileText, Users, GitBranch, Lightbulb, CircleAlert } from "lucide-react"

const starterPrompts = [
  {
    icon: FileText,
    title: "Generate Requirements",
    description: "Create user stories and acceptance criteria",
    prompt: "Help me create user stories for a customer portal login feature with acceptance criteria",
  },
  {
    icon: Users,
    title: "Stakeholder Analysis",
    description: "Analyze project stakeholders",
    prompt: "Guide me through creating a stakeholder analysis matrix for a CRM implementation project",
  },
  {
    icon: GitBranch,
    title: "Process Modeling",
    description: "Design business processes",
    prompt: "Help me model the order fulfillment process from customer order to delivery",
  },
  {
    icon: Lightbulb,
    title: "BA Best Practices",
    description: "Learn methodologies and techniques",
    prompt: "What are the key techniques for effective requirements elicitation in agile projects?",
  },
]

/** In AI SDK v5+ a message carries an array of parts rather than a single string. */
function messageText(message: UIMessage) {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, error } = useChat()

  const isLoading = status === "submitted" || status === "streaming"

  const handleStarterPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    void sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">AI Copilot</h1>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by {process.env.NEXT_PUBLIC_AI_PROVIDER === "google" ? "Gemini" : "Claude"}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Your intelligent assistant for business analysis tasks, requirements generation, and methodology guidance.
        </p>
      </div>

      {messages.length === 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Get started with these prompts:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {starterPrompts.map((prompt, index) => {
              const Icon = prompt.icon
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleStarterPrompt(prompt.prompt)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{prompt.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">{prompt.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    {message.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-medium">{message.role === "user" ? "You" : "AI Copilot"}</div>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap break-words">{messageText(message)}</div>
                    </div>
                  </div>
                </div>
              ))}
              {status === "submitted" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">AI Copilot</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <Separator />
          {error && (
            <div
              role="alert"
              className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
            >
              <CircleAlert className="h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Could not reach the AI</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error.message?.includes("not configured") || error.message?.includes("Agent SDK")
                    ? "Sign in with `claude` to use your Claude subscription, or add GOOGLE_GENERATIVE_AI_API_KEY to .env.local — then restart the dev server."
                    : error.message || "Something went wrong. Try sending the message again."}
                </p>
              </div>
            </div>
          )}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about requirements, stakeholders, processes, or BA methodologies..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
