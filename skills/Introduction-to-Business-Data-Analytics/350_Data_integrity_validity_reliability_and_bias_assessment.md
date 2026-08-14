---
id: skill-0350
title: "Data-integrity, validity, reliability, and bias assessment"
source: "Introduction to Business Data Analytics"
number: 350
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data-integrity, validity, reliability, and bias assessment

## Overview

Judging whether analytical results can be trusted by interrogating four properties. Integrity is whether the data remained complete and uncorrupted through collection and transformation; validity is whether the analysis actually measures what it claims to (are the variables the right proxies, does the design support the causal or predictive claim); reliability is whether the same method on comparable data would yield consistent results; and bias is systematic error — sampling bias, survivorship bias, measurement bias, confirmation bias — that skews findings in a particular direction. Assessing these guards against confidently reporting conclusions that the data cannot support.

## Context & Usage

An Analyze-domain discipline applied throughout modeling and again before results are handed to interpretation (identify → source → analyze → interpret & report → use). Concrete example: reviewing the churn model, the analyst catches survivorship bias (customers who already left were excluded from a key table), questions whether "support-ticket count" validly proxies dissatisfaction, tests reliability by re-running on an earlier period, and documents that the delivery-delay finding holds only where receipt timestamps are accurate — so interpretation carries the caveats rather than overstating certainty.

## Related Techniques / Tools

* Analysis-plan development (347), Data sampling (341), Data preparation — joins/normalization/cleansing/weighting (348), Regression analysis (354), Interpret and Report Results (330); BABOK: Data Mining (43), Risk Analysis and Management (75), Metrics/KPIs (57)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (integrity, validity, reliability, bias)
