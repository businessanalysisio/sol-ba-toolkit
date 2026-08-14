---
id: skill-0168
title: "Entity relationship modelling / diagrams (ERDs)"
source: "Business Analysis Techniques"
number: 168
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "modeling"]
---
# Entity relationship modelling / diagrams (ERDs)

## Overview

Introduced by Peter Chen in 1976, the ERD models a domain's data as entities (things of interest the business keeps information about — Customer, Order, Product), their attributes, and the relationships between them. Cardinality and optionality are most often drawn in crow's foot notation: the three-pronged "foot" marks the many end, a bar marks exactly one, a circle marks optional — so a line can state, in one glance, "each Order must be placed by exactly one Customer; a Customer may have placed many Orders". Many-to-many relationships, which cannot be implemented directly and usually conceal missing data, are resolved by inserting a link (intersection) entity — Order Line between Order and Product — which typically turns out to carry attributes of its own, such as quantity and agreed price.

## Context & Usage

Drawn while investigating any solution that stores data, both to specify what the future system must hold and to document what an existing system actually holds (existing screens, forms and files are prime evidence). Every relationship is a testable business rule, which makes walking the diagram with stakeholders a remarkably efficient elicitation session — "you're telling me an invoice can exist without a customer?" surfaces policy questions prose requirements bury. The ERD feeds the logical data model and, via normalisation, physical database design, and cross-validates against process models through a CRUD matrix.

## Related Techniques / Tools

* Logical data modelling (169), Class modelling (167), CRUD matrix (171), State machine diagrams (170), Business process modelling (132); BABOK: Data Modelling (44), Data Dictionary (41), Data Flow Diagrams (42)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
