---
id: skill-0073
slug: "73-state-modelling"
title: "State Modelling"
source: "BABOK Guide v3"
number: 73
category: "The 50 Named Techniques"
tags: ["babok","business-analysis","the-50-named-techniques","modeling"]
reading_minutes: 1
summary: "Depicting the states an object can occupy and the valid transitions between them. State modelling (UML State Machine Diagrams) reveals complex object behaviour that flow-based models miss."
related: ["71-sequence-diagrams","76-use-cases-and-scenarios","64-process-modelling","44-data-modelling","46-decision-modelling"]
---
# State Modelling

## Overview

Depicting the states an object can occupy and the valid transitions between them. State modelling (UML State Machine Diagrams) reveals complex object behaviour that flow-based models miss.

## Context & Usage

Applied during RADD when requirements involve objects that change state in response to events (e.g., an order: New → Submitted → Paid → Shipped → Delivered → Cancelled/Returned). Each state diagram includes: states (rounded rectangles), transitions (arrows labelled with events/conditions), start state (filled circle), and end state (bullseye). Essential for systems with complex lifecycle management.

## Related Techniques / Tools

* Sequence Diagrams (71), Use Cases and Scenarios (76), Process Modelling (64), Data Modelling (44), Decision Modelling (46)

## Resources

* BABOK v3 Ch10 — Technique 10.44
