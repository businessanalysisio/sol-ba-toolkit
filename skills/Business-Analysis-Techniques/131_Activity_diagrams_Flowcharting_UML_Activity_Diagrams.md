---
id: skill-0131
title: "Activity diagrams / Flowcharting / UML Activity Diagrams"
source: "Business Analysis Techniques"
number: 131
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "process-analysis", "modeling"]
---
# Activity diagrams / Flowcharting / UML Activity Diagrams

## Overview

The UML activity diagram is the modern descendant of the classic flowchart, with a small, precise notation: a filled circle for the initial node; rounded rectangles for actions; diamonds acting as decision nodes (outgoing flows labelled with guard conditions such as [approved] / [rejected]) and as merge nodes where alternative paths rejoin; thick horizontal or vertical bars as forks and joins, which flowcharts lack, allowing genuinely parallel streams of work to be shown; and a bullseye for the final node. Partitions (swimlanes) may be overlaid to allocate actions to actors or departments, at which point the diagram doubles as a lightweight process map.

## Context & Usage

Suited to any procedure with meaningful branching or concurrency: the detailed logic inside one step of a business process, the merged flows of a use case (main success scenario plus alternatives on one page), or a business rule too tangled for prose. Two disciplines keep the diagrams honest — every decision's guards must be mutually exclusive and jointly exhaustive, and every fork should eventually meet its join. The notation's weakness is data: it shows control flow, not the information consumed and produced, so complex data movement calls for a data flow or sequence model instead.

## Related Techniques / Tools

* Business process modelling / Swimlane diagrams (132), Task analysis (134), Business use case modelling (166), State machine diagrams (170), Decision tables (135), Decision trees (136); BABOK: Process Modelling (64), Sequence Diagrams (71), Data Flow Diagrams (42); Process map notation and symbol standards (199)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — Analyse Needs: process analysis (modelling flow logic)
