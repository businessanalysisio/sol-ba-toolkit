---
id: skill-0207
title: "Handling non-functional requirements globally"
source: "The Business Analysis Handbook"
number: 207
category: "Core BA Skills"
tags: ["ba-handbook", "business-analysis", "core-ba-skills", "requirements"]
---
# Handling non-functional requirements globally

## Overview

Most non-functional requirements — performance, availability, security, usability, accessibility, capacity, auditability, data retention, regulatory compliance — apply across the whole solution, so the efficient pattern is to document them once as a global set rather than repeating (or worse, varying) them per feature, and then record only the genuine feature-level exceptions ("month-end reporting may take up to 4 hours" against a global 2-second response standard). Work from an NFR category checklist so nothing is skipped by accident, and source the answers from the people who actually own them: security and compliance teams, IT operations (availability, backup, DR), legal (retention, privacy), and corporate standards documents. Every NFR must be measurable — "the system shall be available 99.5% during business hours, measured monthly" — because an untestable NFR is an argument scheduled for after go-live.

## Context & Usage

Drafted early, not as a pre-sign-off afterthought, because NFRs drive architecture: a 10,000-concurrent-user target or a data-residency rule shapes the design more than most functional requirements do, and late NFRs force expensive rework. They also dominate COTS selection (see 208), where functional fit is often adequate across vendors and the NFRs — security model, scalability, accessibility compliance — are what actually differentiate. In agile contexts, global NFRs typically live in the definition of done or as explicit constraints on every story.

## Related Techniques / Tools

* Writing well-formed requirements (203), Structuring a BRD (204), Adapting requirements for COTS (208); BA Techniques: Acceptance criteria definition (160); BABOK: Non-Functional Requirements Analysis (59)

## Resources

* The Business Analysis Handbook (Helen Winter) — Requirements: handling non-functional requirements

