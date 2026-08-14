---
id: skill-0160
title: "Acceptance criteria definition"
source: "Business Analysis Techniques"
number: 160
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "requirements"]
---
# Acceptance criteria definition

## Overview

States, for each requirement or user story, the objectively testable conditions under which the business will accept the delivered solution — turning "the system should be fast" into "search results return within 2 seconds for 95% of queries at peak load". In agile settings the dominant format is the Gherkin scenario: Given a context, When an action occurs, Then an observable outcome results — each scenario becoming a candidate test case. Good criteria share four properties: they describe *what* is observed, not *how* it is implemented; they are binary (pass or fail, no "mostly works"); they cover the unhappy paths (invalid input, boundary values, failures) as well as the success case; and for non-functional requirements they carry a number and a measurement method.

## Context & Usage

Written when a requirement or story is defined and refined before development starts — the act of drafting criteria is itself a validation technique, since a requirement whose acceptance cannot be stated is not yet understood. Criteria are agreed between the business (who will accept), the analyst (who drafts) and testers/developers (who confirm testability), then drive user acceptance testing and the story's definition of done. A story accumulating a dozen scenarios is signalling it should be split.

## Related Techniques / Tools

* User stories (156), Requirements validation (165), Scenarios (154), Requirements documentation (161), Prototyping (159); BABOK: Acceptance and Evaluation Criteria (30), Non-Functional Requirements Analysis (59), Use Cases and Scenarios (76); Documenting functional requirements (206), Agile-specific requirements approaches (210)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
