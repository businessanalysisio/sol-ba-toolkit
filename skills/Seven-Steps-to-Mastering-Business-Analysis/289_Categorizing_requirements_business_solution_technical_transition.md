---
id: skill-0289
title: "Categorizing requirements (business / solution / technical / transition)"
source: "Seven Steps to Mastering Business Analysis"
number: 289
category: ""
tags: ["seven-steps", "business-analysis", "requirements", "solution-design", "change-management"]
---
# Categorizing requirements (business / solution / technical / transition)

## Overview

Carkenord's four-way split sorts every captured statement by what kind of thing it is. Business requirements state what the enterprise needs independent of any solution ("reduce order-to-cash from 12 days to 5") — sourced from sponsors, stable for the project's life, the layer everything else traces to. Solution requirements describe what the chosen solution must do and be — the functional behavior and qualities the build team implements, sourced from users and SMEs. Technical requirements are constraints from the environment, not the business need ("must run on the approved platform stack, integrate via the enterprise bus") — sourced from architects and standards. Transition requirements exist only to get from old to new — data conversion, migration reconciliation, training, parallel running, cutover — and are the perishable category: they die at go-live, are elicited from operations and change management rather than end users, and are the ones every project forgets until the conversion weekend. Categorizing matters practically because each type has a different author, approver, lifespan, and place in the document — and because mislabeling ("the vendor's product does X" recorded as a business requirement) locks in solutions nobody chose.

## Context & Usage

Apply while recording, not as a later cleanup: the category question — "is this a need, a solution behavior, a constraint, or a one-time bridge?" — is itself an analysis probe that exposes disguised design decisions. The classification then powers traceability (every solution requirement should trace up to a business requirement; orphans are scope creep with paperwork) and completeness checks (a replacement project with zero transition requirements is a red flag, not a tidy backlog).

## Related Techniques / Tools

* Organizing requirements on iterative/incremental projects (290), Understanding technical architecture (284), Elicitation technique: Job and Persona Analysis (281); BABOK: Business Rules Analysis (38), Non-Functional Requirements Analysis (59); BA Techniques: Requirements organisation (162), Requirements traceability matrix (164); BA Handbook: Requirements hierarchy and structuring (201)

## Resources

* Seven Steps to Mastering Business Analysis (Carkenord) — Step 6: Know Your Analysis Techniques (requirement types and classification)
