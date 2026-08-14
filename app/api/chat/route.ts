import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai"
import { z } from "zod"
import { AI_NOT_CONFIGURED_MESSAGE, aiModel, aiProvider, isAIConfigured } from "@/lib/ai"
import { streamClaudeText } from "@/lib/claude-agent"

// The Claude Agent SDK runs the harness in a subprocess, so this route cannot
// run on the edge runtime.
export const runtime = "nodejs"
export const maxDuration = 30

// useChat sends parts-based UIMessages. Validate the shape loosely but keep the
// size guards so a runaway client can't push an unbounded prompt to the model.
const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string().optional(),
        role: z.enum(["system", "user", "assistant"]),
        parts: z.array(z.record(z.any())).optional(),
        content: z.string().max(20_000).optional(),
      }),
    )
    .min(1)
    .max(50),
})

const SYSTEM_PROMPT = `You are an expert Business Analyst AI assistant. You help with:

- Requirements gathering and documentation
- Stakeholder analysis and management
- Process modeling and improvement
- User story creation and backlog refinement
- Business analysis methodologies (BABOK, Agile BA, etc.)
- AI adoption in business processes
- Template creation and best practices

Provide practical, actionable advice with specific examples when possible.
Keep responses concise but comprehensive. Never invent metrics or research
findings — where a number would help, use a bracketed placeholder instead.`

type ParsedMessage = z.infer<typeof requestSchema>["messages"][number]

/** useChat sends parts-based messages; older clients send a plain `content` string. */
function messageText(message: ParsedMessage) {
  if (message.parts?.length) {
    return message.parts
      .filter((part) => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text as string)
      .join("")
  }
  return message.content ?? ""
}

/**
 * The Agent SDK takes a single prompt string, so prior turns are rendered as a
 * transcript. A first message needs no framing.
 */
function toTranscript(messages: ParsedMessage[]) {
  const turns = messages.filter((message) => message.role !== "system")
  const latest = turns.at(-1)
  if (!latest) return ""
  if (turns.length === 1) return messageText(latest)

  const history = turns
    .slice(0, -1)
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${messageText(message)}`)
    .join("\n\n")

  return `Conversation so far:\n\n${history}\n\nUser: ${messageText(latest)}`
}

export async function POST(req: Request) {
  try {
    if (!isAIConfigured()) {
      return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 })
    }

    const parsed = requestSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return new Response("Invalid chat request", { status: 400 })
    }

    const totalChars = JSON.stringify(parsed.data.messages).length
    if (totalChars > 200_000) {
      return new Response("Conversation is too long. Start a new chat.", { status: 413 })
    }

    if (aiProvider() === "claude") {
      const prompt = toTranscript(parsed.data.messages)
      if (!prompt.trim()) {
        return new Response("Empty chat request", { status: 400 })
      }

      // useChat speaks the UI message stream protocol, so the Agent SDK's raw
      // text deltas are re-emitted as a single streamed text part.
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          const id = crypto.randomUUID()
          writer.write({ type: "text-start", id })
          for await (const delta of streamClaudeText({
            system: SYSTEM_PROMPT,
            prompt,
            signal: req.signal,
          })) {
            writer.write({ type: "text-delta", id, delta })
          }
          writer.write({ type: "text-end", id })
        },
        onError: (error) => {
          console.error("Error in chat API (claude):", error)
          return error instanceof Error ? error.message : "Error processing request"
        },
      })

      return createUIMessageStreamResponse({ stream })
    }

    const result = streamText({
      model: aiModel(),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(parsed.data.messages as unknown as UIMessage[]),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
