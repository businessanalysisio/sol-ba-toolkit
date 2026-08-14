---
id: skill-0203
title: "Writing well-formed individual requirements"
source: "The Business Analysis Handbook"
number: 203
category: "Core BA Skills"
tags: ["ba-handbook", "business-analysis", "core-ba-skills", "requirements"]
---
# Writing well-formed individual requirements

## Overview

A well-formed requirement passes a specific set of tests. Atomic: one statement, one obligation — if it contains "and", it is probably two requirements that will be built, tested, and prioritised separately. Testable: a tester can construct a pass/fail check from the words alone, which outlaws vapour terms like "user-friendly", "fast", "flexible", "etc.", and "where appropriate"; write "search results return within 2 seconds for up to 10,000 records" instead. Unambiguous: active voice with an explicit actor ("the system shall...", "the claims handler shall..."), no pronouns whose referent is unclear. Solution-agnostic at the business level: state the need ("the ability to capture a delivery address"), not the design ("a pop-up with a dropdown"). Complete in its metadata: unique ID, source, rationale, priority, and acceptance criteria — the rationale being what lets a future reader decide whether the requirement still applies when circumstances change.

## Context & Usage

Applied when converting raw elicitation notes into the requirements catalogue, and enforced during peer review before anything reaches stakeholders. The economics are stark: an ambiguous requirement costs minutes to fix at writing time, hours in design, and days once code and test scripts embody the wrong reading. In agile settings the same rigour lives in the acceptance criteria attached to each story rather than in "shall" statements — the discipline transfers, the format changes.

## Related Techniques / Tools

* Requirements hierarchy (201), Documenting functional requirements (206), Handling NFRs (207); BA Techniques: Acceptance criteria definition (160), Requirements documentation (161), Requirements validation (165); BABOK: Acceptance and Evaluation Criteria (30)

## Resources

* The Business Analysis Handbook (Helen Winter) — Requirements: writing well-formed requirements

