---
id: skill-0214
title: "Requirements traceability"
source: "The Business Analysis Handbook"
number: 214
category: "Core BA Skills"
tags: ["ba-handbook", "business-analysis", "core-ba-skills", "requirements"]
---
# Requirements traceability

## Overview

Traceability is the maintained web of links running business objective → business requirement → solution requirement → design element → test case → delivered feature, navigable in both directions. Backward tracing answers "why does this requirement exist?" and exposes orphans with no business justification — prime scope-creep suspects. Forward tracing answers "where is this requirement delivered and tested?" and exposes gaps — requirements that quietly fell out of design or have no test coverage, which otherwise surface as go-live surprises. The working artifact is the requirements traceability matrix (RTM): one row per requirement, columns linking source, priority, design reference, test case IDs, and status. Horizontal traceability (requirement-to-requirement dependencies) supplements the vertical chain and is what makes impact analysis fast when change requests arrive. Scale the machinery to the stakes — a spreadsheet suffices for a small project; regulated or safety-critical work justifies a requirements-management tool with automated link integrity.

## Context & Usage

Links are cheapest to create at the moment each artifact is born, so traceability starts with the hierarchy (201) and grows with the catalogue; retrofitting an RTM onto a finished project is archaeology. It earns its keep at three moments: impact analysis for change requests ("this touches FR-12, which feeds four test cases and the finance interface"), test-coverage verification before UAT, and audit or regulatory review, where "show me how this control requirement was tested" must have a two-minute answer. An RTM that is not maintained through change is worse than none — it answers those questions confidently and wrongly.

## Related Techniques / Tools

* Requirements hierarchy (201), Requirements change management (215), Handling review feedback (212); BA Techniques: Requirements traceability matrix (164), Requirements management (163), CRUD matrix (171); BABOK: Item Tracking (55)

## Resources

* The Business Analysis Handbook (Helen Winter) — Requirements: traceability

