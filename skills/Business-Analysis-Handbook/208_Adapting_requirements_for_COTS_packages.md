---
id: skill-0208
title: "Adapting requirements for COTS packages"
source: "The Business Analysis Handbook"
number: 208
category: "Core BA Skills"
tags: ["ba-handbook", "business-analysis", "core-ba-skills", "requirements"]
---
# Adapting requirements for COTS packages

## Overview

When the solution will be a commercial off-the-shelf package, requirements change job: instead of specifying what to build, they become evaluation criteria for what to buy. That shifts the emphasis — skip exhaustive specification of commodity functionality every package has (login, audit logs) and concentrate on what differentiates the organisation: unusual processes, local regulatory needs, integration points, data volumes, and the global NFRs. Requirements must stay strictly solution-agnostic or they will smuggle in one vendor's design and rig the evaluation. After selection, run a gap-fit analysis: for each gap, decide between configuring the package, changing the business process to match the package (often the right answer — packages embody industry-standard process), customising (expensive and upgrade-hostile, a last resort), or accepting a documented workaround. Record every deviation from vanilla, because each customisation is a recurring tax on every future upgrade.

## Context & Usage

Applies the moment a buy decision is plausible — ERP, CRM, HR, claims platforms — and should reshape elicitation before the RFP goes out, not after. The BA's hardest conversations here are process-change ones: stakeholders who want the £2m package bent to replicate their current screens need to hear the customisation cost and upgrade implications in business terms. Total cost of ownership (licences, per-user fees, upgrade cycles, customisation maintenance) belongs in the comparison, not just implementation price.

## Related Techniques / Tools

* Vendor procurement and response evaluation (209), Handling NFRs globally (207), Identifying solution constraints (195); BA Techniques: Gap analysis (137), Feasibility analysis (141); BABOK: Vendor Assessment (78)

## Resources

* The Business Analysis Handbook (Helen Winter) — Requirements: adapting requirements for COTS packages

