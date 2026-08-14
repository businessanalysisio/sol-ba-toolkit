---
id: skill-0311
title: "Non-Functional Requirements Analysis"
source: "Guide to Product Ownership Analysis"
number: 311
category: ""
tags: ["product-ownership", "product-analysis", "requirements"]
---
# Non-Functional Requirements Analysis

## Overview

Analysis of the requirements that define how well functional requirements must perform — criteria for judging the operation of a product rather than specific behaviours. The POA angle the Guide adds: in a product context, NFRs have a longer-term effect than in projects, constraining PBIs and even determining foundational choices such as which hosting or cloud platform to adopt for scale, security, accessibility, and serviceability. Practitioners are urged to broaden NFR categories to cover new technological challenges — it may not suffice to say APIs "must be secure"; the practitioner may need to analyze detailed threat vectors for data protection. NFR thresholds are typically expressed as a value or range, e.g., "the product should be able to support 10,000 users in the first three months of launch."

## Context & Usage

In a product setting NFRs are captured in Definition Concepts (Definition of Done, etc.) or acceptance criteria, but the Guide recommends also aggregating all NFRs in one place for a holistic picture. Quality criteria belong in iteration, release, and story-level discussions as routinely as features do, because most quality requirements augment the product experience — the right features delivered slowly still generate friction and churn, so NFR analysis must also be done from the customer's point of view. It often needs technical expertise the POA Practitioner lacks, making whole-team validation of feasibility essential; when thresholds are missed, root cause analysis follows. A cautionary pattern from the Guide: marketing positions the product as always-available while availability NFRs were never analyzed, risking serious brand damage.

## Related Techniques / Tools

* Definition Concepts (303), Backlog Refinement (298), Risk Analysis and Management (319); BABOK: Non-Functional Requirements Analysis (59), Acceptance and Evaluation Criteria (30), Root Cause Analysis (69)

## Resources

* IIBA Guide to Product Ownership Analysis — Chapter 6: POA Techniques, Section 6.14 Non-Functional Requirements Analysis (cross-referenced to BABOK Guide v3, section 10.30)
