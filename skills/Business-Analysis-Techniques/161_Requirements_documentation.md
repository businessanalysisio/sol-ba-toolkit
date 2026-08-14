---
id: skill-0161
title: "Requirements documentation"
source: "Business Analysis Techniques"
number: 161
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "requirements"]
---
# Requirements documentation

## Overview

Records elicited requirements in a form rigorous enough to be validated, traced and built from. The core artefact is the requirements catalogue, where every requirement carries a standard set of attributes: unique identifier, name, description, source (who raised it), owner (who can decide about it), type (general, technical, functional, non-functional), priority, rationale/business justification, acceptance criteria, related requirements and documents, resolution of any conflicts, and version history. The catalogue sits inside a wider requirements document whose typical skeleton is: introduction and scope, business context, function models (use cases or process models), data model, and the catalogue itself — prose for context, models for precision, catalogue for management.

## Context & Usage

Compiled progressively during elicitation rather than written up at the end, because attributes like source and rationale are lost within weeks if not captured immediately. Each entry should be atomic (one requirement, one statement), free of design ("the system shall record…" not "a dropdown shall…"), unambiguous, and testable — the standard well-formedness checks applied at review. The same content may be sliced differently by audience: a signed baseline document for a contractual development, a living backlog of stories for an agile team, but the attribute discipline transfers to both.

## Related Techniques / Tools

* Requirements organisation (162), Requirements management (163), Acceptance criteria definition (160), Requirements validation (165), User stories (156), Business use case modelling (166); BABOK: Written Communication (20), Data Dictionary (41), Glossary (52); Writing well-formed individual requirements (203), Structuring a business requirements document (204)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
