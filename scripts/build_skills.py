#!/usr/bin/env python3
"""Parse BUSINESS_ANALYSIS_MASTER_SKILLS_SOL.md and generate:
   - skills/manifest.json
   - skills/index.md
   - skills/<source>/<number>_<title>.md  (one markdown skill file per entry)
"""

import re
import json
import pathlib
import textwrap

BASE = pathlib.Path(__file__).resolve().parent.parent
SKILLS_DIR = BASE / "skills"
MASTER_FILE = BASE / "BUSINESS_ANALYSIS_MASTER_SKILLS_SOL.md"

# ── mapping from source header to folder name ──────────────────────────
SOURCE_FOLDER_MAP = {
    "BABOK Guide v3": "BABOK-v3",
    "Business Analysis Techniques": "Business-Analysis-Techniques",
    "The Business Analysis Handbook": "Business-Analysis-Handbook",
    "PMI": "PMI-Business-Analysis-for-Practitioners",
    "Seven Steps to Mastering Business Analysis": "Seven-Steps-to-Mastering-Business-Analysis",
    "Guide to Product Ownership Analysis": "Guide-to-Product-Ownership-Analysis",
    "Introduction to Business Data Analytics": "Introduction-to-Business-Data-Analytics",
    "The Personal MBA": "The-Personal-MBA",
    "How to Start Your Own Business": "How-to-Start-Your-Own-Business",
}

def normalize_source(raw: str) -> str:
    """Normalise the source part of a header to a key in SOURCE_FOLDER_MAP."""
    raw = raw.strip()
    # strip leading number + dot
    raw = re.sub(r'^\d+\.\s*', '', raw)
    # handle known variations
    if raw.startswith("BABOK"):
        return "BABOK Guide v3"
    if raw.startswith("Business Analysis Techniques"):
        return "Business Analysis Techniques"
    if raw.startswith("The Business Analysis Handbook"):
        return "The Business Analysis Handbook"
    if raw.startswith("PMI"):
        return "PMI"
    if raw.startswith("Seven Steps"):
        return "Seven Steps to Mastering Business Analysis"
    if raw.startswith("IIBA Guide to Product Ownership Analysis") or raw.startswith("Guide to Product Ownership Analysis"):
        return "Guide to Product Ownership Analysis"
    if raw.startswith("Introduction to Business Data Analytics"):
        return "Introduction to Business Data Analytics"
    if raw.startswith("The Personal MBA"):
        return "The Personal MBA"
    if raw.startswith("How to Start Your Own Business"):
        return "How to Start Your Own Business"
    return raw


def parse():
    lines = MASTER_FILE.read_text().splitlines()
    entries = []
    current_source = ""
    current_category = ""
    skipping = False  # skip Summary section etc.
    for line in lines:
        # detect section headers like "## 1. BABOK …"
        m = re.match(r'^##\s+(\d+\.\s+.+)$', line)
        if m:
            header = m.group(1).strip()
            if header.lower().startswith("summary"):
                current_source = ""
                current_category = ""
                skipping = True
                continue
            skipping = False

            # check if there's an em-dash separating source and category
            if '—' in header:
                parts = header.split('—', 1)
                source_part = parts[0].strip()
                current_category = parts[1].strip()
            else:
                source_part = header
                current_category = ""
            current_source = normalize_source(source_part)
            continue

        if skipping:
            continue

        # match skill lines: optional whitespace, number, dot, space, title
        m = re.match(r'^\s*(\d+)\.\s+(.+)$', line)
        if m and current_source:
            num = int(m.group(1))
            title = m.group(2).strip()
            entries.append({
                "number": num,
                "title": title,
                "source": current_source,
                "category": current_category,
                "folder": SOURCE_FOLDER_MAP.get(current_source, "Other"),
            })
    return entries


def sanitize_name(name: str) -> str:
    """Turn any string into a filesystem-friendly slug."""
    s = re.sub(r'[^\w\s-]', '', name).strip()
    s = re.sub(r'[-\s]+', '_', s)
    return s


def generate_file_name(entry):
    return f"{entry['number']:03d}_{sanitize_name(entry['title'])}.md"


def make_manifest(entries):
    manifest_path = SKILLS_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(entries, indent=2, ensure_ascii=False))
    print(f"✓ manifest.json  ({len(entries)} entries)")


def make_index(entries):
    """Generate skills/index.md – a table of all entries."""
    lines = [
        "# Business Analysis Skills — Index",
        "",
        "All ~650 skills indexed from 11 source texts.  "
        "Each entry links to its own markdown skill file.",
        "",
        f"Total entries: **{len(entries)}**",
        "",
        "| # | Skill | Source | Category |",
        "|---|-------|--------|----------|",
    ]
    for e in entries:
        folder = SOURCE_FOLDER_MAP.get(e["source"], "Other")
        fname = generate_file_name(e)
        link = f"{folder}/{fname}"
        lines.append(
            f"| {e['number']} | [{e['title']}]({link}) | {e['source']} | {e['category']} |"
        )
    (SKILLS_DIR / "index.md").write_text("\n".join(lines) + "\n")
    print("✓ index.md")


def make_stubs(entries):
    """Create one starter .md file per entry, organised in source folders."""
    count = 0
    for e in entries:
        folder = SOURCE_FOLDER_MAP.get(e["source"], "Other")
        fname = generate_file_name(e)
        path = SKILLS_DIR / folder / fname
        if path.exists():
            continue  # don't overwrite existing stubs
        content = textwrap.dedent(f"""\
        ---
        id: skill-{e['number']:04d}
        title: "{e['title']}"
        source: "{e['source']}"
        number: {e['number']}
        category: "{e['category']}"
        tags: []
        ---
        # {e['title']}

        ## Overview
        *(Add brief description here)*

        ## Context & Usage
        *(When and why this skill is applied)*

        ## Related Techniques / Tools
        * * *

        ## Resources
        * [{e['source']}](#) – *add section / page reference*
        """)
        path.write_text(content)
        count += 1
    print(f"✓ {count} starter files created (skipped existing)")


def main():
    entries = parse()
    make_manifest(entries)
    make_index(entries)
    make_stubs(entries)
    print("\nDone.")


if __name__ == "__main__":
    main()
