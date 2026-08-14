import { streamObject, zodSchema } from "ai"
import { z } from "zod"
import { AI_NOT_CONFIGURED_MESSAGE, aiModel, aiProvider, isAIConfigured } from "@/lib/ai"
import { claudeJsonStream } from "@/lib/claude-agent"
import { decisionBriefSchema } from "@/lib/brief-schema"
import { frameworks } from "@/lib/brief-frameworks"

// The Claude Agent SDK runs the harness in a subprocess, so this route cannot
// run on the edge runtime.
export const runtime = "nodejs"
export const maxDuration = 60

const requestSchema = z.object({
  problemType: z.string().min(1).max(120),
  problem: z.string().min(1).max(6_000),
  audience: z.string().max(2_000).optional(),
  constraints: z.string().max(2_000).optional(),
  evidence: z.string().max(6_000).optional(),
})

// Ground the model in Sol's actual catalog so it can only recommend frameworks
// the product genuinely ships — otherwise it invents plausible-sounding ones.
const CATALOG = frameworks
  .map((f) => `- ${f.name} (${f.category}) — ${f.best_for}. Use cases: ${f.use_cases.join("; ")}`)
  .join("\n")

const SYSTEM = `You are a senior business analyst writing a one-page decision brief.
The reader is a busy decision-maker who will act on this in the next few days.

You may ONLY recommend frameworks from this catalog:
${CATALOG}

Rules:
- Be specific to the problem given. A brief that could apply to any company is a failed brief.
- Never invent metrics, research findings, dates, or customer quotes. If a number would
  strengthen the brief, write a bracketed placeholder such as [current activation rate].
- Assumptions must be genuinely falsifiable — things that could turn out to be wrong and
  would change the recommendation. Not platitudes.
- Risks must name a consequence, not just a hazard.
- Next actions must be assignable to a person and doable within two weeks.
- Choose frameworks because they fit this specific tension, and say why in those terms.`

export async function POST(req: Request) {
  try {
    if (!isAIConfigured()) {
      return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 })
    }

    const parsed = requestSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return new Response("Invalid brief request", { status: 400 })
    }

    const { problemType, problem, audience, constraints, evidence } = parsed.data

    const prompt = [
      `Problem type: ${problemType}`,
      `Business problem: ${problem}`,
      audience?.trim() ? `Decision audience: ${audience}` : "Decision audience: not stated — infer and flag it.",
      constraints?.trim() ? `Constraints: ${constraints}` : "Constraints: none stated.",
      evidence?.trim() ? `Evidence available: ${evidence}` : "Evidence: none supplied — treat evidence gathering as a next action.",
    ].join("\n\n")

    if (aiProvider() === "claude") {
      // streamObject's schema enforcement is a Vercel AI SDK feature; the Agent
      // SDK path gets the same shape by putting the JSON Schema in the prompt.
      // The client parses partial JSON, so the object fills in as it streams.
      const schema = JSON.stringify(zodSchema(decisionBriefSchema).jsonSchema)
      return new Response(
        claudeJsonStream({
          system: `${SYSTEM}

Respond with a single JSON object and nothing else — no prose, no markdown code fence.
It must validate against this JSON Schema:
${schema}

Every property is required, and every "minItems" is a floor you must actually reach:
never return an empty array, and never stop an array short because the input was
thin. If the problem statement is sparse, infer plausible risks and next actions
and say so inside the text of those items.`,
          prompt,
          signal: req.signal,
        }),
        { headers: { "content-type": "text/plain; charset=utf-8" } },
      )
    }

    const result = streamObject({
      model: aiModel(),
      schema: decisionBriefSchema,
      system: SYSTEM,
      prompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in brief API:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
