#!/usr/bin/env python3
"""Build searchable metadata for the generated skill library.

The script updates empty front-matter tags in skill markdown files and writes
skills/catalog.json for programmatic lookup by agents and UI code.
"""

from __future__ import annotations

import json
import pathlib
import re
from collections import Counter, defaultdict


BASE = pathlib.Path(__file__).resolve().parent.parent
SKILLS_DIR = BASE / "skills"
MANIFEST_PATH = SKILLS_DIR / "manifest.json"
CATALOG_PATH = SKILLS_DIR / "catalog.json"
README_PATH = SKILLS_DIR / "README.md"


SOURCE_TAGS = {
    "BABOK Guide v3": ["babok", "business-analysis"],
    "Business Analysis Techniques": ["ba-techniques", "business-analysis"],
    "The Business Analysis Handbook": ["ba-handbook", "business-analysis"],
    "PMI": ["pmi", "business-analysis"],
    "Seven Steps to Mastering Business Analysis": ["seven-steps", "business-analysis"],
    "Guide to Product Ownership Analysis": ["product-ownership", "product-analysis"],
    "Introduction to Business Data Analytics": ["data-analytics", "business-analysis"],
    "The Personal MBA": ["personal-mba", "business-models"],
    "How to Start Your Own Business": ["startup", "entrepreneurship"],
}

KEYWORD_TAGS = [
    (["requirement", "acceptance", "user stor", "traceability"], ["requirements"]),
    (["stakeholder", "persona", "communication", "facilitation", "interview", "workshop"], ["stakeholders"]),
    (["process", "workflow", "activity", "value stream", "journey"], ["process-analysis"]),
    (["data", "analytics", "metric", "kpi", "measurement", "sampling"], ["analytics"]),
    (["risk", "issue", "conflict", "crisis"], ["risk"]),
    (["strategy", "market", "competition", "competitive", "swot", "pestle"], ["strategy"]),
    (["customer", "consumer", "sales", "marketing", "brand"], ["customer-growth"]),
    (["finance", "financial", "cost", "budget", "cash", "funding", "pricing"], ["finance"]),
    (["product", "mvp", "roadmap", "backlog"], ["product"]),
    (["governance", "approval", "ethics", "audit", "sign off", "sign-off"], ["governance"]),
    (["team", "leadership", "management", "culture", "talent"], ["organization"]),
    (["solution", "vendor", "technology", "technical", "system"], ["solution-design"]),
    (["model", "modelling", "diagram", "map", "canvas"], ["modeling"]),
    (["change", "transformation", "transition"], ["change-management"]),
]


def slug(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value


def parse_front_matter(text: str) -> tuple[str, str] | None:
    match = re.match(r"^---\n(?P<meta>.*?)\n---\n(?P<body>.*)$", text, re.DOTALL)
    if not match:
        return None
    return match.group("meta"), match.group("body")


def parse_meta(meta_text: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    for line in meta_text.splitlines():
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        meta[key.strip()] = raw_value.strip().strip('"')
    return meta


def derive_tags(meta: dict[str, str]) -> list[str]:
    title = meta.get("title", "")
    source = meta.get("source", "")
    category = meta.get("category", "")
    searchable = f"{title} {category}".lower()

    tags: list[str] = []
    tags.extend(SOURCE_TAGS.get(source, [slug(source)] if source else []))
    if category:
        category_tag = slug(category)
        if category_tag:
            tags.append(category_tag)

    for keywords, derived in KEYWORD_TAGS:
        if any(keyword in searchable for keyword in keywords):
            tags.extend(derived)

    deduped: list[str] = []
    for tag in tags:
        if tag and tag not in deduped:
            deduped.append(tag)
    return deduped[:8]


def update_tags(meta_text: str, tags: list[str]) -> str:
    tag_literal = "[" + ", ".join(f'"{tag}"' for tag in tags) + "]"
    if re.search(r"^tags:\s*\[.*?\]\s*$", meta_text, re.MULTILINE):
        return re.sub(r"^tags:\s*\[.*?\]\s*$", f"tags: {tag_literal}", meta_text, flags=re.MULTILINE)
    return meta_text + f"\ntags: {tag_literal}"


def first_paragraph(body: str) -> str:
    overview = body.split("## Overview", 1)
    if len(overview) < 2:
        return ""
    after = overview[1].split("##", 1)[0]
    lines = [line.strip() for line in after.splitlines() if line.strip()]
    return " ".join(lines[:2])


def write_skill(path: pathlib.Path) -> dict[str, object] | None:
    text = path.read_text()
    parsed = parse_front_matter(text)
    if not parsed:
        return None

    meta_text, body = parsed
    meta = parse_meta(meta_text)
    tags = derive_tags(meta)
    new_meta = update_tags(meta_text, tags)
    if new_meta != meta_text:
        path.write_text(f"---\n{new_meta}\n---\n{body}")

    rel_path = path.relative_to(SKILLS_DIR).as_posix()
    return {
        "id": meta.get("id", ""),
        "number": int(meta.get("number", "0")),
        "title": meta.get("title", ""),
        "source": meta.get("source", ""),
        "category": meta.get("category", ""),
        "path": rel_path,
        "tags": tags,
        "summary": first_paragraph(body),
    }


def write_manifest_with_tags(catalog: list[dict[str, object]]) -> None:
    if not MANIFEST_PATH.exists():
        return

    by_number = {item["number"]: item for item in catalog}
    manifest = json.loads(MANIFEST_PATH.read_text())
    for entry in manifest:
        item = by_number.get(entry.get("number"))
        if item:
            entry["path"] = item["path"]
            entry["tags"] = item["tags"]
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")


def write_readme(catalog: list[dict[str, object]]) -> None:
    source_counts = Counter(item["source"] for item in catalog)
    tag_counts = Counter(tag for item in catalog for tag in item["tags"])
    categories_by_source: dict[str, set[str]] = defaultdict(set)
    for item in catalog:
        category = str(item["category"])
        if category:
            categories_by_source[str(item["source"])].add(category)

    lines = [
        "# Skill Library",
        "",
        "This directory contains the Sol business-analysis skill library: 651 markdown skills generated from the master skill map and enriched for agent use.",
        "",
        "## Lookup Files",
        "",
        "* `index.md` - human-readable table of all skills.",
        "* `manifest.json` - source manifest with paths and tags.",
        "* `catalog.json` - searchable catalog with summaries, paths, and tags.",
        "",
        "## Sources",
        "",
    ]
    for source, count in sorted(source_counts.items()):
        lines.append(f"* {source}: {count} skills")

    lines.extend(["", "## Common Tags", ""])
    for tag, count in tag_counts.most_common(20):
        lines.append(f"* `{tag}`: {count}")

    lines.extend(["", "## Categories By Source", ""])
    for source in sorted(categories_by_source):
        categories = ", ".join(sorted(categories_by_source[source]))
        lines.append(f"* {source}: {categories}")

    README_PATH.write_text("\n".join(lines) + "\n")


def main() -> None:
    catalog = []
    for path in sorted(SKILLS_DIR.glob("*/*.md")):
        item = write_skill(path)
        if item:
            catalog.append(item)

    catalog.sort(key=lambda item: int(item["number"]))
    CATALOG_PATH.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")
    write_manifest_with_tags(catalog)
    write_readme(catalog)
    print(f"Cataloged {len(catalog)} skills.")


if __name__ == "__main__":
    main()
