---
id: skill-0201
title: "Requirements hierarchy and structuring"
source: "The Business Analysis Handbook"
number: 201
category: "Core BA Skills"
tags: ["ba-handbook", "business-analysis", "core-ba-skills", "requirements"]
---
# Requirements hierarchy and structuring

## Overview

Requirements need scaffolding before they need polish. The standard hierarchy runs: business objectives at the top; business requirements (what the organisation must be able to do to meet them); stakeholder requirements; then solution requirements split into functional and non-functional; plus transition requirements (migration, training, cutover) that exist only to get from old world to new. Each level decomposes into the one below with parent–child links, so coverage can be checked in both directions — an objective with no requirements beneath it is a delivery gap, a requirement with no parent is scope creep. Structure within a level matters too: group by business process, function, or stakeholder area (pick one scheme and hold it), and use a hierarchical numbering convention (BR-3, FR-3.2) so any requirement can be referenced unambiguously in reviews, testing, and change discussions.

## Context & Usage

Set up the structure early in requirements definition, before volume accumulates — retro-fitting a hierarchy onto 400 flat requirements is painful and error-prone. The hierarchy is what makes prioritisation, traceability, and impact analysis mechanically possible: when a business requirement is descoped, its children fall with it visibly. It also disciplines granularity, since a "requirement" that sits awkwardly at any level is usually several requirements or a design decision in disguise.

## Related Techniques / Tools

* Writing well-formed requirements (203), Structuring a BRD (204), Requirements traceability (214); BA Techniques: Requirements organisation (162), Requirements management (163); BABOK: Functional Decomposition (51)

## Resources

* The Business Analysis Handbook (Helen Winter) — Requirements: hierarchy and structuring

