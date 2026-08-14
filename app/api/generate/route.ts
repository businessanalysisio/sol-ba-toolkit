import { streamText } from "ai"
import { z } from "zod"
import { AI_NOT_CONFIGURED_MESSAGE, aiModel, aiProvider, isAIConfigured } from "@/lib/ai"
import { claudeTextStream } from "@/lib/claude-agent"

// The Claude Agent SDK runs the harness in a subprocess, so this route cannot
// run on the edge runtime.
export const runtime = "nodejs"
export const maxDuration = 30

const requestSchema = z.object({
  kind: z.enum(["requirement", "analysis", "advisor"]),
  template: z.string().min(1).max(120),
  input: z.string().max(8_000).optional(),
  fields: z.record(z.string().max(2_000)).optional(),
})

const BASE_SYSTEM = `You are a senior business analyst with deep BABOK v3 fluency.
You produce artifacts that a BA could take into a stakeholder meeting without editing.

Rules that apply to every response:
- Output GitHub-flavored Markdown. Start directly with the artifact — no preamble, no "Here is...".
- Be concrete. Prefer specific, testable statements over generic advice.
- Where the user's input is too thin to be specific, state the assumption you made
  under an "## Assumptions" heading rather than inventing facts silently.
- Never fabricate metrics, dates, names, or research findings. If a number would
  strengthen the artifact, write it as a bracketed placeholder like [baseline conversion %].
- End with "## Open questions" listing what you would ask stakeholders next.`

const REQUIREMENT_GUIDES: Record<string, string> = {
  "User Story": `Produce a user story set.
For each story: a numbered ID (US-01), the "As a <role>, I want <capability>, so that <outcome>" line,
then acceptance criteria written in Given/When/Then form, then a Definition of Done checklist.
Cover the happy path plus at least two edge/error cases. Flag any story that is too large
to fit one sprint and suggest how to split it.`,

  Epic: `Produce an epic.
Include: epic ID and title, the business outcome it serves, the problem statement,
in-scope and explicitly out-of-scope items, a breakdown into 4-8 candidate user stories
(ID + one-line summary each), dependencies, and measurable success criteria.`,

  "Acceptance Criteria": `Produce acceptance criteria only.
Use Given/When/Then. Number each criterion. Cover: happy path, boundary conditions,
validation/error handling, permissions, and any non-functional constraint implied by the request
(performance, accessibility, auditability). Mark each as [Functional] or [Non-functional].`,

  "Functional Requirements": `Produce a functional requirements section.
Use a numbered hierarchy (FR-1, FR-1.1). Each requirement must be atomic, testable, and
written with "shall". Add a table with columns: ID, Requirement, Priority (MoSCoW), Source, Verification method.
Follow with a short "## Non-functional requirements" section covering the relevant quality attributes.`,
}

const ANALYSIS_GUIDES: Record<string, string> = {
  "SWOT Analysis": `Produce a SWOT analysis.
Give a four-section breakdown (Strengths, Weaknesses, Opportunities, Threats) with 3-5 specific
entries each — internal factors under S/W, external under O/T. Then add a "## Strategic implications"
section pairing factors into SO/ST/WO/WT moves. Close with the single most important decision this raises.
The expected output artifact is a one-page strategy brief.`,

  "PESTLE Analysis": `Produce a PESTLE analysis.
Cover Political, Economic, Social, Technological, Legal, and Environmental factors — 2-4 entries each,
specific to the stated industry and scope. For each factor note the likely direction of impact
(+/-/neutral) and the time horizon (near/mid/long). Close with the two factors that most warrant monitoring.`,

  "Impact Analysis": `Produce a change impact analysis.
Include: change summary, affected business processes, affected systems/data, affected stakeholder groups,
a risk table (Risk, Likelihood, Impact, Mitigation, Owner), effort indication, and a recommended
sequencing of the change. Explicitly call out anything that looks like an irreversible or hard-to-rollback step.`,

  "Stakeholder Analysis": `Produce a stakeholder analysis.
Include a table with columns: Stakeholder, Role/Interest, Influence (H/M/L), Interest (H/M/L),
Current stance, Desired stance, Engagement approach. Then map them to a power/interest grid described in text
(Manage closely / Keep satisfied / Keep informed / Monitor). Add a RACI for the key decisions.`,
}

function buildPrompt(parsed: z.infer<typeof requestSchema>): { system: string; prompt: string } {
  const { kind, template, input, fields } = parsed

  const context = [
    input?.trim() ? `Request:\n${input.trim()}` : null,
    fields && Object.keys(fields).length
      ? Object.entries(fields)
          .filter(([, v]) => v.trim())
          .map(([k, v]) => `${k}: ${v.trim()}`)
          .join("\n")
      : null,
  ]
    .filter(Boolean)
    .join("\n\n")

  if (kind === "advisor") {
    return {
      system: `${BASE_SYSTEM}

You are answering a methodology question. Ground your answer in named techniques
(BABOK knowledge areas, Agile BA practice, or a named framework) and say when each applies
AND when it does not. Give the practitioner a concrete next step they can take today.`,
      prompt: context || "Explain how to choose a business analysis technique for an unclear problem.",
    }
  }

  const guide =
    kind === "requirement"
      ? REQUIREMENT_GUIDES[template] ?? `Produce a "${template}" requirements artifact.`
      : ANALYSIS_GUIDES[template] ?? `Produce a "${template}" analysis artifact.`

  return {
    system: `${BASE_SYSTEM}\n\nArtifact-specific instructions:\n${guide}`,
    prompt: context || `Produce a ${template} for an unspecified initiative. State your assumptions clearly.`,
  }
}

export async function POST(req: Request) {
  try {
    if (!isAIConfigured()) {
      return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 })
    }

    const parsed = requestSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return new Response("Invalid generation request", { status: 400 })
    }

    const { system, prompt } = buildPrompt(parsed.data)

    if (aiProvider() === "claude") {
      return new Response(claudeTextStream({ system, prompt, signal: req.signal }), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
    }

    const result = streamText({
      model: aiModel(),
      system,
      prompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in generate API:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
