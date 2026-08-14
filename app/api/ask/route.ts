import { NextResponse } from "next/server"
import { z } from "zod"
import { streamText } from "ai"
import { AI_NOT_CONFIGURED_MESSAGE, aiModel, aiProvider, isAIConfigured } from "@/lib/ai"
import { streamClaudeText } from "@/lib/claude-agent"
import { citedAnswerPrompt, retrieve } from "@/lib/retrieval/ask"

// Retrieval talks to Qdrant and Ollama over the network, and the Claude path
// spawns a subprocess — neither works on the edge runtime.
export const runtime = "nodejs"
export const maxDuration = 60

const requestSchema = z.object({
  question: z.string().trim().min(3).max(2_000),
})

/**
 * Answer a question from the indexed corpus, or refuse.
 *
 * The response is a single JSON object rather than a stream: the client needs
 * the citations and the rejected candidates together with the prose to render
 * either panel, and streaming prose whose citations arrive later would let a
 * half-rendered answer look sourced before it is.
 */
export async function POST(req: Request) {
  try {
    const parsed = requestSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: "Ask a question of at least three characters." }, { status: 400 })
    }

    let outcome
    try {
      outcome = await retrieve(parsed.data.question)
    } catch (error) {
      // A retrieval stack that is down must not silently degrade into an
      // unsourced answer — that is precisely the failure this route prevents.
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Retrieval is unavailable." },
        { status: 503 },
      )
    }

    if (outcome.kind === "refused") {
      return NextResponse.json({
        state: "refused",
        reason: outcome.reason,
        rejected: outcome.rejected,
        threshold: outcome.threshold,
      })
    }

    if (!isAIConfigured()) {
      return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 })
    }

    const system = citedAnswerPrompt(outcome.citations)
    let answer = ""

    if (aiProvider() === "claude") {
      for await (const delta of streamClaudeText({
        system,
        prompt: parsed.data.question,
        signal: req.signal,
      })) {
        answer += delta
      }
    } else {
      const result = streamText({ model: aiModel(), system, prompt: parsed.data.question })
      for await (const delta of result.textStream) answer += delta
    }

    // How much of the answer is actually attributed. The reference surfaces
    // this as "3 of 3 sentences carry a source", and it is worth measuring
    // rather than asserting: a model can ignore the citation instruction.
    const sentences = answer.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 12)
    const cited = sentences.filter((s) => /\[\d+\]/.test(s)).length

    return NextResponse.json({
      state: "answered",
      answer: answer.trim(),
      citations: outcome.citations,
      rejected: outcome.rejected,
      coverage: { sentences: sentences.length, cited },
    })
  } catch (error) {
    console.error("Error in ask API:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}
