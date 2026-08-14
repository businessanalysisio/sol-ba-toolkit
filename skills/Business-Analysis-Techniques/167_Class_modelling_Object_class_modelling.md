---
id: skill-0167
title: "Class modelling / Object class modelling"
source: "Business Analysis Techniques"
number: 167
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "modeling"]
---
# Class modelling / Object class modelling

## Overview

The UML approach to modelling the things a business must hold information about. Each class is drawn as a rectangle with up to three compartments — name, attributes, operations (the behaviour the class offers, which is what distinguishes a class model from a purely data-oriented ERD). Classes connect through associations annotated with multiplicities at each end (1, 0..1, *, 1..*): "a Customer places 0..* Orders; an Order is placed by exactly 1 Customer". Richer structure comes from generalisation (a triangle-headed arrow — Corporate Customer and Personal Customer specialise Customer, inheriting its attributes), aggregation (hollow diamond, loose whole–part) and composition (filled diamond, parts that cannot outlive the whole). An association class captures data that belongs to the relationship itself, such as the grade on a Student–Course enrolment.

## Context & Usage

Built by an analyst to pin down the business vocabulary precisely — every class defined, every multiplicity a business rule that stakeholders can confirm or correct ("can an order really have no lines?") — and to give object-oriented developers a domain model that carries straight into design. It pairs with use case modelling (use cases describe behaviour, the class model the structure that behaviour manipulates) and cross-checks against it: any class no use case touches, or any use case referring to concepts missing from the model, indicates a gap. Analysis-level models legitimately omit the operations compartment until design.

## Related Techniques / Tools

* Entity relationship modelling (168), Logical data modelling (169), State machine diagrams (170), CRUD matrix (171), Business use case modelling (166); BABOK: Data Modelling (44), Concept Modelling (40), Glossary (52), Data Dictionary (41)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
