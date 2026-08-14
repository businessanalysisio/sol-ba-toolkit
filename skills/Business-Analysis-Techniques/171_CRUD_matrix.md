---
id: skill-0171
title: "CRUD matrix"
source: "Business Analysis Techniques"
number: 171
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools"]
---
# CRUD matrix

## Overview

A cross-validation grid with processes (or use cases, or functions) as rows and data entities as columns, each cell marked with which of Create, Read, Update, Delete the process performs on the entity. Once populated, mechanical completeness checks expose specification defects: an entity column with no C means data the system needs but nothing ever creates; a column with C but no R means data captured and never used — question why it is being collected; no D (or archive) means unbounded growth with no retention story; a process row touching no entities, or an entity touched by every process, both invite a second look at scoping and cohesion. The matrix thereby proves the process model and the data model describe the same system — each built independently, reconciled here.

## Context & Usage

Compiled once both a function/process view and a data view exist, typically late in requirements modelling as a quality gate before design, and revisited when either model changes. Beyond gap-finding it earns extra duty in three places: scoping increments (a release must include the C for any entity its processes R), access control ground-work (the same grid with roles as rows becomes a permissions matrix), and migration planning (columns show which entities carry history that must be converted). Cheap to build with a spreadsheet, and one of the highest defect-yield-per-hour techniques in the modelling toolkit.

## Related Techniques / Tools

* Logical data modelling (169), Entity relationship modelling (168), Business process modelling (132), Business use case modelling (166), State machine diagrams (170); BABOK: Data Modelling (44), Process Modelling (64), Roles and Permissions Matrix (68), Scope Modelling (70)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
