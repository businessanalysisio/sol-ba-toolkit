---
id: skill-0170
title: "State machine diagrams (SMDs) / State transition diagrams / Statecharts"
source: "Business Analysis Techniques"
number: 170
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "modeling", "change-management"]
---
# State machine diagrams (SMDs) / State transition diagrams / Statecharts

## Overview

Charts the complete lifecycle of one entity or object — an Order, a Claim, a Job Application — as the set of states it can occupy and the legal moves between them. States are rounded rectangles; transitions are arrows labelled in the form event [guard] / action ("payment received [amount = balance] / issue receipt"); a filled circle marks the initial pseudo-state where the object is created, a bullseye the final state where its lifecycle ends. The model's power is in what it forbids as much as what it allows: if no arrow runs from Despatched back to Draft, that path is impossible by specification. David Harel's statechart extensions, adopted into UML, add nested (composite) states so that behaviour common to several states — "cancel from anywhere before despatch" — is drawn once on the enclosing state instead of repeated on every inner one.

## Context & Usage

Reached for whenever an important entity has status-dependent behaviour — the same request being editable in Draft, locked in Review, immutable once Approved — which prose requirements express clumsily and inconsistently. Building the diagram interrogates completeness systematically: for every state, ask what happens if each possible event arrives; unhandled combinations are precisely the corner cases that later surface as production defects. Each significant entity in the data or class model deserves this check, and transitions map directly onto test cases (every legal transition exercised, illegal ones proven blocked).

## Related Techniques / Tools

* Business event analysis (130), Class modelling (167), Entity relationship modelling (168), CRUD matrix (171), Activity diagrams (131); BABOK: State Modelling (73), Sequence Diagrams (71), Business Rules Analysis (38)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
