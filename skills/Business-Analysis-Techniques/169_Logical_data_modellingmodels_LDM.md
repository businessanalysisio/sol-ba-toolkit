---
id: skill-0169
title: "Logical data modelling/models (LDM)"
source: "Business Analysis Techniques"
number: 169
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "analytics", "modeling"]
---
# Logical data modelling/models (LDM)

## Overview

The technology-independent, rigorous tier of data modelling: it takes the conceptual entity-relationship picture and completes it into a buildable specification — every entity fully attributed, a primary key chosen to identify each occurrence uniquely, relationships implemented through foreign keys, all many-to-many relationships resolved, and the structure normalised (commonly to third normal form) so that every attribute depends on the key, the whole key, and nothing but the key. What the LDM deliberately excludes is implementation: no DBMS choice, no denormalisation for performance, no indexes or partitioning — those belong to the physical data model derived from it. Alongside the diagram sits the supporting data dictionary defining each entity, attribute (format, length, permitted values) and relationship.

## Context & Usage

Produced once requirements are stable enough to say definitively what information the solution must keep, serving three masters at once: stakeholders confirm the rules it encodes, database designers transform it into a physical schema, and the project gains a single agreed definition of its data that outlives any one system. Because logical structure changes far more slowly than processes or interfaces, an LDM is durable analysis capital — the same model supports successive systems, migrations and integrations. Completeness is checked against processing with a CRUD matrix: data nothing creates, or nothing ever reads, is a specification error on one side or the other.

## Related Techniques / Tools

* Entity relationship modelling (168), Class modelling (167), CRUD matrix (171), Requirements documentation (161); BABOK: Data Modelling (44), Data Dictionary (41), Data Flow Diagrams (42), Business Rules Analysis (38)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
