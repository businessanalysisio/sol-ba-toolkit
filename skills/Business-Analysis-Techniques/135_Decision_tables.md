---
id: skill-0135
title: "Decision tables"
source: "Business Analysis Techniques"
number: 135
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools"]
---
# Decision tables

## Overview

A tabular notation for documenting complex business rules: the upper rows list conditions, the lower rows list actions, and each column is a rule — one unique combination of condition outcomes and the actions that follow. With n yes/no conditions the full table has 2^n rule columns, which gives the technique its distinctive power: it forces every combination to be considered, exposing gaps and contradictions that prose descriptions miss. Tables are then consolidated by merging columns whose outcome is identical regardless of one condition (marked with a dash, "don't care"). Limited-entry tables use only Y/N in condition cells; extended-entry tables allow values such as ranges or categories.

## Context & Usage

Best deployed when processing logic depends on several interacting conditions — pricing rules, eligibility checks, discount schemes, claim adjudication. The BA drafts the table from elicited rules, walks stakeholders through each column, and asks about the combinations no one had mentioned; those conversations frequently surface policy decisions the business has never actually made. The finished table doubles as a specification for developers and a ready-made test matrix, since each rule column is a test scenario. Where stakeholders find sequential logic easier to follow, the same rules can be redrawn as a decision tree.

## Related Techniques / Tools

* Decision trees (136), Acceptance criteria definition (160), Requirements documentation (161); BABOK: Business Rules Analysis (38), Decision Modelling (46), Process Analysis (63); Writing well-formed individual requirements (203)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
