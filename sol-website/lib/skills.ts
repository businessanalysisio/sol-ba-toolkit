import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import skillsDb from "./generated/skills-db.json";

export interface SkillMeta {
  slug: string;
  number: number;
  title: string;
  source: string;
  category: string;
  tags: string[];
  summary: string;
  minutes: number;
  related: string[];
  path: string;
}

const db = skillsDb as Record<string, SkillMeta>;
const ordered = Object.values(db).sort((a, b) => a.number - b.number);

export function getAllSkills(): SkillMeta[] {
  return ordered;
}

export function getSkill(slug: string): SkillMeta | undefined {
  return db[slug];
}

export function getAdjacentSkills(slug: string): {
  prev: SkillMeta | null;
  next: SkillMeta | null;
} {
  const i = ordered.findIndex((s) => s.slug === slug);
  return {
    prev: i > 0 ? ordered[i - 1] : null,
    next: i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : null,
  };
}

/** Reads a skill's markdown body (frontmatter + H1 stripped) and renders it to HTML. */
export function renderSkillHtml(skill: SkillMeta): string {
  const file = path.join(process.cwd(), "content", "skills", skill.path);
  const raw = fs.readFileSync(file, "utf8");
  const body = raw
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/^#\s+.*\n/, "");
  return marked.parse(body, { async: false }) as string;
}
