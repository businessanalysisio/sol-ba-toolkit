#!/usr/bin/env python3
"""Search the Sol skill catalog from the command line."""

from __future__ import annotations

import argparse
import json
import pathlib
import re


BASE = pathlib.Path(__file__).resolve().parent.parent
CATALOG_PATH = BASE / "skills" / "catalog.json"


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value.lower()).strip()


def score(item: dict[str, object], query_terms: list[str], tag: str | None, source: str | None) -> int:
    title = normalize(str(item.get("title", "")))
    summary = normalize(str(item.get("summary", "")))
    category = normalize(str(item.get("category", "")))
    tags = [normalize(str(tag_value)) for tag_value in item.get("tags", [])]
    item_source = normalize(str(item.get("source", "")))

    if tag and normalize(tag) not in tags:
        return 0
    if source and normalize(source) not in item_source:
        return 0

    if not query_terms:
        return 1

    total = 0
    for term in query_terms:
        if term in title:
            total += 8
        if term in tags:
            total += 6
        if term in category:
            total += 3
        if term in summary:
            total += 1
    return total


def load_catalog() -> list[dict[str, object]]:
    return json.loads(CATALOG_PATH.read_text())


def main() -> None:
    parser = argparse.ArgumentParser(description="Search skills/catalog.json")
    parser.add_argument("query", nargs="*", help="Search terms")
    parser.add_argument("--tag", help="Filter by exact tag")
    parser.add_argument("--source", help="Filter by source substring")
    parser.add_argument("--limit", type=int, default=10, help="Maximum results to print")
    args = parser.parse_args()

    terms = [normalize(term) for term in args.query]
    results = []
    for item in load_catalog():
        item_score = score(item, terms, args.tag, args.source)
        if item_score > 0:
            results.append((item_score, item))

    results.sort(key=lambda entry: (-entry[0], int(entry[1]["number"])))
    for item_score, item in results[: args.limit]:
        tags = ", ".join(item.get("tags", []))
        print(f"{item['number']:>3}  {item['title']}  [{item['source']}]")
        print(f"     path: skills/{item['path']}")
        print(f"     tags: {tags}")
        print(f"     score: {item_score}")


if __name__ == "__main__":
    main()
