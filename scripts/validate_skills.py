#!/usr/bin/env python3
"""Validate the Sol skill library structure and generated metadata."""

from __future__ import annotations

import json
import pathlib
import re
import sys


BASE = pathlib.Path(__file__).resolve().parent.parent
SKILLS_DIR = BASE / "skills"
MANIFEST_PATH = SKILLS_DIR / "manifest.json"
CATALOG_PATH = SKILLS_DIR / "catalog.json"
PLACEHOLDER_RE = re.compile(
    r"Add brief description here|When and why this skill is applied|add section / page reference"
)


def parse_front_matter(path: pathlib.Path) -> dict[str, object] | None:
    text = path.read_text()
    match = re.match(r"^---\n(?P<meta>.*?)\n---\n", text, re.DOTALL)
    if not match:
        return None

    meta: dict[str, object] = {}
    for line in match.group("meta").splitlines():
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        value = raw_value.strip()
        if key.strip() == "tags":
            meta["tags"] = re.findall(r'"([^"]+)"', value)
        else:
            meta[key.strip()] = value.strip('"')
    return meta


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def main() -> None:
    errors: list[str] = []
    skill_paths = sorted(SKILLS_DIR.glob("*/*.md"))

    if not skill_paths:
        fail(errors, "No skill markdown files found.")

    seen_ids: set[str] = set()
    seen_numbers: set[int] = set()
    for path in skill_paths:
        text = path.read_text()
        if PLACEHOLDER_RE.search(text):
            fail(errors, f"Placeholder text remains in {path.relative_to(BASE)}")

        meta = parse_front_matter(path)
        if not meta:
            fail(errors, f"Missing front matter: {path.relative_to(BASE)}")
            continue

        for required in ["id", "title", "source", "number", "tags"]:
            if required not in meta:
                fail(errors, f"Missing {required}: {path.relative_to(BASE)}")

        skill_id = str(meta.get("id", ""))
        if skill_id in seen_ids:
            fail(errors, f"Duplicate id {skill_id}")
        seen_ids.add(skill_id)

        try:
            number = int(str(meta.get("number", "0")))
        except ValueError:
            fail(errors, f"Invalid number: {path.relative_to(BASE)}")
            continue
        if number in seen_numbers:
            fail(errors, f"Duplicate number {number}")
        seen_numbers.add(number)

        if not meta.get("tags"):
            fail(errors, f"Empty tags: {path.relative_to(BASE)}")

    try:
        manifest = json.loads(MANIFEST_PATH.read_text())
        catalog = json.loads(CATALOG_PATH.read_text())
    except Exception as exc:  # noqa: BLE001 - command-line validator should report any parse failure
        fail(errors, f"Unable to parse manifest/catalog JSON: {exc}")
        manifest = []
        catalog = []

    if len(manifest) != len(skill_paths):
        fail(errors, f"Manifest count {len(manifest)} does not match markdown count {len(skill_paths)}")
    if len(catalog) != len(skill_paths):
        fail(errors, f"Catalog count {len(catalog)} does not match markdown count {len(skill_paths)}")

    catalog_numbers = set()
    for item in catalog:
        rel_path = item.get("path")
        if not rel_path or not (SKILLS_DIR / str(rel_path)).exists():
            fail(errors, f"Catalog path missing on disk: {rel_path}")
        if not item.get("tags"):
            fail(errors, f"Catalog item has empty tags: {item.get('number')}")
        try:
            catalog_numbers.add(int(item.get("number", 0)))
        except (TypeError, ValueError):
            fail(errors, f"Catalog item has invalid number: {item}")

    if catalog_numbers != seen_numbers:
        fail(errors, "Catalog numbers do not match markdown numbers.")

    if errors:
        print("Skill validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    print(f"Skill validation passed: {len(skill_paths)} markdown files, {len(catalog)} catalog entries.")


if __name__ == "__main__":
    main()
