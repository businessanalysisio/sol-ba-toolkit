"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useObject } from "@ai-sdk/react";
import {
  ArrowLeft,
  Clipboard,
  CircleAlert,
  FileText,
  Lightbulb,
  ListChecks,
  RefreshCw,
  Sparkles,
  Square,
  Target,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { frameworks } from "@/lib/brief-frameworks";
import { decisionBriefSchema } from "@/lib/brief-schema";
import { fadeUp, staggerContainer } from "@/lib/animations";

const problemTypes = [
  "Customer discovery",
  "Requirements conflict",
  "Market strategy",
  "Process bottleneck",
  "MVP scope",
  "Stakeholder alignment",
];

const defaultInputs = {
  problem:
    "Users are asking for faster onboarding, but the sales team wants more qualification steps before accounts reach activation.",
  audience: "Product manager, founder, sales lead, implementation lead",
  constraints: "Two-week sprint, small engineering team, activation rate must improve without lowering lead quality.",
  evidence:
    "Support tickets mention setup confusion. Sales notes mention poor-fit leads. Analytics show a 38% drop-off during workspace setup.",
  problemType: "Requirements conflict",
};

function scoreFramework(name: string, category: string, problemType: string, evidence: string) {
  const text = `${problemType} ${evidence}`.toLowerCase();
  let score = 0;

  if (text.includes("customer") || text.includes("user") || text.includes("onboarding")) {
    if (["Jobs-to-be-Done", "Value Proposition Canvas", "Kano Model", "User Story Mapping"].includes(name)) score += 3;
  }
  if (text.includes("market") || text.includes("strategy") || text.includes("compet")) {
    if (category === "Strategy") score += 3;
  }
  if (text.includes("process") || text.includes("handoff") || text.includes("bottleneck")) {
    if (category === "Process") score += 3;
  }
  if (text.includes("scope") || text.includes("mvp") || text.includes("requirement")) {
    if (category === "Requirements") score += 3;
  }
  if (problemType.toLowerCase().includes("conflict") && ["MoSCoW Prioritization", "RACI Matrix", "User Story Mapping"].includes(name)) {
    score += 2;
  }

  return score;
}

/**
 * Turn SDK-level failures into something a practitioner can act on. Schema
 * validation dumps and transport errors are accurate but unreadable.
 */
function readableFailure(raw: string) {
  if (raw.includes("not configured")) {
    return "AI isn't configured. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart the server.";
  }
  if (raw.includes("Type validation failed") || raw.includes("invalid_type")) {
    return "The model didn't return a usable brief. This usually means the API key is invalid or the configured model isn't available to your project — check the server logs.";
  }
  if (raw.includes("429") || raw.toLowerCase().includes("quota") || raw.toLowerCase().includes("rate limit")) {
    return "The AI provider is rate-limiting this key. Wait a moment and try again.";
  }
  if (raw.includes("Failed to fetch") || raw.includes("NetworkError")) {
    return "Couldn't reach the server. Check that the dev server is still running.";
  }
  return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
}

/** Shape the two brief sources are normalised into before rendering. */
type BriefView = {
  decisionQuestion: string;
  situation: string;
  recommendation: string;
  frameworks: { name: string; category: string; note: string }[];
  assumptions: string[];
  risks: string[];
  nextActions: string[];
};

export default function DecisionBriefBuilder() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [copied, setCopied] = useState(false);

  // useObject surfaces transport errors, but a stream that opens and then yields
  // nothing usable ends silently — onFinish is where that shows up.
  const [failure, setFailure] = useState<string | null>(null);

  const {
    object: aiBrief,
    submit,
    isLoading,
    stop,
    error,
  } = useObject({
    api: "/api/brief",
    schema: decisionBriefSchema,
    onError: (err) => setFailure(err.message),
    onFinish: ({ object, error: finishError }) => {
      if (!object) {
        setFailure(
          finishError?.message ??
            "The model did not return a usable brief. Check that your API key is valid and the configured model is available to your project.",
        );
      }
    },
  });

  const recommended = useMemo(() => {
    return frameworks
      .map((framework) => ({
        ...framework,
        score: scoreFramework(framework.name, framework.category, inputs.problemType, inputs.evidence),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [inputs.problemType, inputs.evidence]);

  const brief = useMemo(() => {
    const primary = recommended[0];
    const tension =
      inputs.problem.length > 0
        ? inputs.problem
        : "The team has a business question that needs clearer framing before decisions are made.";

    return {
      decisionQuestion: `How should we respond to this ${inputs.problemType.toLowerCase()} problem without creating avoidable delivery risk?`,
      situation: tension,
      audience: inputs.audience || "Decision owners and impacted stakeholders",
      constraints: inputs.constraints || "No explicit constraints captured yet.",
      evidence: inputs.evidence || "Evidence still needs to be collected and validated.",
      recommendedFramework: primary?.name ?? "MoSCoW Prioritization",
      recommendation: `Use ${primary?.name ?? "a prioritization framework"} first, then turn the result into a one-page decision brief with tradeoffs, owners, and next actions.`,
      assumptions: [
        "The current evidence represents repeated behavior, not a one-off complaint.",
        "Stakeholders agree on the business outcome before debating solution scope.",
        "The team can run a short validation cycle before committing build capacity.",
      ],
      risks: [
        "Optimizing one workflow may move friction into another team.",
        "The loudest stakeholder request may not match the highest-value customer problem.",
        "A vague decision owner can delay approval even when the analysis is strong.",
      ],
      nextActions: [
        `Run a 45-minute ${primary?.name ?? "framework"} session with the named audience.`,
        "Convert evidence into 3 measurable decision criteria.",
        "Write a must/should/could cut and identify the owner for each tradeoff.",
        "Validate the preferred option with one customer signal and one operational signal.",
      ],
    };
  }, [inputs, recommended]);

  // The deterministic brief renders instantly and needs no API key. The AI brief
  // replaces it field by field as the object streams in, so the panel never
  // flashes empty mid-generation.
  const view: BriefView = useMemo(() => {
    const fallback: BriefView = {
      decisionQuestion: brief.decisionQuestion,
      situation: brief.situation,
      recommendation: brief.recommendation,
      frameworks: recommended.map((f) => ({
        name: f.name,
        category: f.category,
        note: f.best_for,
      })),
      assumptions: brief.assumptions,
      risks: brief.risks,
      nextActions: brief.nextActions,
    };

    if (!aiBrief) return fallback;

    const clean = (items: unknown): string[] =>
      Array.isArray(items) ? items.filter((i): i is string => typeof i === "string" && i.length > 0) : [];

    const aiFrameworks = Array.isArray(aiBrief.recommendedFrameworks)
      ? aiBrief.recommendedFrameworks
          .filter((f): f is { name: string; category?: string; why?: string } => Boolean(f?.name))
          .map((f) => ({ name: f.name, category: f.category ?? "Recommended", note: f.why ?? "" }))
      : [];

    return {
      decisionQuestion: aiBrief.decisionQuestion || fallback.decisionQuestion,
      situation: aiBrief.situation || fallback.situation,
      recommendation: aiBrief.recommendation || fallback.recommendation,
      frameworks: aiFrameworks.length ? aiFrameworks : fallback.frameworks,
      assumptions: clean(aiBrief.assumptions).length ? clean(aiBrief.assumptions) : fallback.assumptions,
      risks: clean(aiBrief.risks).length ? clean(aiBrief.risks) : fallback.risks,
      nextActions: clean(aiBrief.nextActions).length ? clean(aiBrief.nextActions) : fallback.nextActions,
    };
  }, [aiBrief, brief, recommended]);

  const isAI = Boolean(aiBrief);

  function generateWithAI() {
    setFailure(null);
    submit({
      problemType: inputs.problemType,
      problem: inputs.problem,
      audience: inputs.audience,
      constraints: inputs.constraints,
      evidence: inputs.evidence,
    });
  }

  const briefText = `Decision question: ${view.decisionQuestion}

Situation:
${view.situation}

Audience:
${inputs.audience}

Constraints:
${inputs.constraints}

Evidence:
${inputs.evidence}

Recommended frameworks:
${view.frameworks.map((f) => `- ${f.name} (${f.category})${f.note ? ` — ${f.note}` : ""}`).join("\n")}

Recommendation:
${view.recommendation}

Assumptions:
- ${view.assumptions.join("\n- ")}

Risks:
- ${view.risks.join("\n- ")}

Next actions:
- ${view.nextActions.join("\n- ")}

---
Generated by Sol Decision Brief Builder (${isAI ? "AI-generated" : "structural template"}).`;

  async function copyBrief() {
    await navigator.clipboard.writeText(briefText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-night-950 text-zinc-200">
      <div className="bg-grid mask-fade-y pointer-events-none fixed inset-0 opacity-70" aria-hidden />
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Sol
        </Link>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <motion.div variants={fadeUp}>
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              Sol tool
            </span>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Decision Brief Builder
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Turn a messy business problem into a concise BA brief with recommended frameworks, assumptions, risks, and next actions.
            </p>

            <div className="mt-10 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-zinc-300">Problem type</span>
                <select
                  value={inputs.problemType}
                  onChange={(event) => setInputs({ ...inputs, problemType: event.target.value })}
                  className="rounded-2xl border border-white/10 bg-night-900 px-4 py-3 text-white outline-none transition focus:border-sol-400"
                >
                  {problemTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>

              <TextArea
                label="Business problem"
                value={inputs.problem}
                onChange={(problem) => setInputs({ ...inputs, problem })}
                rows={5}
              />
              <TextArea
                label="Decision audience"
                value={inputs.audience}
                onChange={(audience) => setInputs({ ...inputs, audience })}
                rows={3}
              />
              <TextArea
                label="Constraints"
                value={inputs.constraints}
                onChange={(constraints) => setInputs({ ...inputs, constraints })}
                rows={4}
              />
              <TextArea
                label="Evidence"
                value={inputs.evidence}
                onChange={(evidence) => setInputs({ ...inputs, evidence })}
                rows={5}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:sticky lg:top-8 lg:h-fit">
            <div className="glass rounded-[2rem] p-4 shadow-2xl shadow-black/40 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm text-sol-300">
                    {isAI ? "AI-generated brief" : "Structural draft"}
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sol-400/10 px-2.5 py-0.5 text-xs text-sol-300">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Writing
                      </span>
                    ) : null}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Decision-ready structure</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <button
                      onClick={() => stop()}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/10"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={generateWithAI}
                      disabled={!inputs.problem.trim()}
                      className="inline-flex items-center gap-2 rounded-full border border-sol-400/30 bg-sol-400/10 px-5 py-3 text-sm font-medium text-sol-300 transition hover:bg-sol-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isAI ? "Regenerate" : "Generate with AI"}
                    </button>
                  )}
                  <button onClick={copyBrief} className="btn-primary px-5 py-3">
                    <Clipboard className="h-4 w-4" />
                    {copied ? "Copied" : "Copy brief"}
                  </button>
                </div>
              </div>

              {!isAI && !isLoading ? (
                <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-500">
                  This draft is assembled from your inputs by rule, so it works instantly and offline.
                  Press <span className="text-sol-300">Generate with AI</span> to have Sol reason about your
                  specific tension, pick frameworks with justification, and write falsifiable assumptions.
                </p>
              ) : null}

              {(() => {
                const raw = failure ?? error?.message;
                if (!raw || isLoading) return null;
                return (
                  <div
                    role="alert"
                    className="mt-4 flex items-start gap-3 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3"
                  >
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                    <p className="text-sm leading-6 text-zinc-300">
                      {readableFailure(raw)}{" "}
                      <span className="text-zinc-500">The structural draft below still works.</span>
                    </p>
                  </div>
                );
              })()}

              <div className="mt-6 grid gap-4">
                <BriefBlock icon={Target} title="Decision question" content={view.decisionQuestion} />
                <BriefBlock icon={FileText} title="Situation" content={view.situation} />
                <BriefBlock icon={Lightbulb} title="Recommendation" content={view.recommendation} highlight />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {view.frameworks.map((framework) => (
                  <div key={framework.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-sol-300">{framework.category}</p>
                    <h3 className="mt-2 font-semibold text-white">{framework.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{framework.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ListPanel icon={ListChecks} title="Next actions" items={view.nextActions} />
                <ListPanel icon={TriangleAlert} title="Risks to manage" items={view.risks} />
              </div>

              <div className="mt-4">
                <ListPanel icon={Lightbulb} title="Assumptions to test" items={view.assumptions} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="resize-none rounded-2xl border border-white/10 bg-night-900 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-sol-400"
      />
    </label>
  );
}

function BriefBlock({
  icon: Icon,
  title,
  content,
  highlight = false,
}: {
  icon: typeof Target;
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <section className={`rounded-2xl border p-5 ${highlight ? "border-sol-400/30 bg-sol-400/10" : "border-white/10 bg-white/[0.035]"}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="h-4 w-4 text-sol-300" />
        {title}
      </div>
      <p className="mt-3 leading-7 text-zinc-400">{content}</p>
    </section>
  );
}

function ListPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof ListChecks;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="h-4 w-4 text-sol-300" />
        {title}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-zinc-400">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
