---
id: skill-0345
title: "Business validation of data sources"
source: "Introduction to Business Data Analytics"
number: 345
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Business validation of data sources

## Overview

Confirming, with the people who own and use the data day-to-day, that a source genuinely means what the analyst thinks it means and is fit for the business question. Where technical validation checks the data mechanically, business validation checks it against domain reality: do the field definitions match how the business actually operates, are the values plausible to someone who lives in the process, are known exceptions and edge cases accounted for, and is this the authoritative source rather than a shadow copy? It closes the gap between what a column is called and what it truly represents.

## Context & Usage

A Source Data activity, run in partnership with business subject-matter experts before the data is trusted for analysis, complementing the technical checks (identify → source → analyze → interpret & report → use). Concrete example: the churn analyst shows the operations lead a sample of the "delivered" status; the lead explains that a legacy warehouse marks orders "delivered" at dispatch, not receipt — meaning the delivery-delay metric is understated for one fulfillment center, a distortion no purely technical test would have caught.

## Related Techniques / Tools

* Source Data (328), Data-source evaluation — cost/value/timing/risk/feasibility (338), Technical validation of data quality (346), Data quality dimensions (344), Stakeholder identification and analysis for analytics initiatives (356); BABOK: Interviews (23), Data Dictionary (41), Business Rules Analysis (30)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (business validation)
