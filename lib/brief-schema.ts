import { z } from "zod"

/**
 * Shape of an AI-generated decision brief. Shared by the /api/brief route
 * (via streamObject) and the client (via useObject), so the two can never
 * drift apart.
 */
export const decisionBriefSchema = z.object({
  decisionQuestion: z
    .string()
    .describe("The single question this brief exists to answer, phrased as a decision, not a topic."),
  situation: z
    .string()
    .describe("2-4 sentences framing the tension. Name the competing forces explicitly."),
  recommendation: z
    .string()
    .describe(
      "The recommended course of action and, in one clause, why it beats the obvious alternative.",
    ),
  recommendedFrameworks: z
    .array(
      z.object({
        name: z.string().describe("Must be chosen from the supplied Sol framework catalog."),
        category: z.string(),
        why: z.string().describe("Why this framework fits THIS problem specifically, not in general."),
      }),
    )
    .min(1)
    .max(3),
  assumptions: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("What must be true for the recommendation to hold. Things that could be wrong."),
  risks: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("What could go wrong, each paired with what it would cost."),
  nextActions: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe("Concrete, assignable steps. Start each with a verb."),
})

export type DecisionBrief = z.infer<typeof decisionBriefSchema>
