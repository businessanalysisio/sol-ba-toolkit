---
id: skill-0164
title: "Requirements traceability matrix"
source: "Business Analysis Techniques"
number: 164
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "requirements"]
---
# Requirements traceability matrix

## Overview

A grid — one row per requirement — that records where each requirement came from and where it went: backward trace to the originating business objective, stakeholder or source document, and forward trace to the design element, build component and test case that realise and verify it. Vertical traceability runs up and down the hierarchy (business need → stakeholder requirement → solution requirement); horizontal traceability runs across the lifecycle (requirement → design → code → test). Reading the matrix in each direction answers a different audit question: an empty forward cell is a requirement nobody is delivering or testing (a coverage gap); a deliverable with no backward trace is gold-plating or scope creep (an orphan); and when a change arrives, the row shows exactly what it touches.

## Context & Usage

Populated as artefacts are produced, not reconstructed before an audit — retrofitted traceability is guesswork. The matrix is the operational core of requirements management and the impact-assessment engine for change control; on regulated, contractual or safety-critical work it is usually mandatory evidence. Granularity is the practical decision: tracing every sentence to every line of code is unaffordable, so most teams trace at requirement-to-test-case and requirement-to-design-component level, held in a tool rather than a spreadsheet once the set grows.

## Related Techniques / Tools

* Requirements management (163), Requirements validation (165), Requirements organisation (162), Acceptance criteria definition (160), Impact analysis (145); BABOK: Item Tracking (55), Scope Modelling (70); Requirements traceability (214), Requirements change management (215)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
