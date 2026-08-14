---
id: skill-0344
title: "Data quality dimensions: Accuracy, Completeness, Consistency, Uniqueness, Timeliness"
source: "Introduction to Business Data Analytics"
number: 344
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data quality dimensions: Accuracy, Completeness, Consistency, Uniqueness, Timeliness

## Overview

The standard vocabulary for describing how fit-for-purpose a dataset is, dimension by dimension. Accuracy is whether values correctly reflect reality; completeness is whether all required data is present (no missing fields or records); consistency is whether the same fact agrees across systems and formats; uniqueness is the absence of unintended duplicates; and timeliness is whether data is current enough for the decision at hand (validity — conformance to defined formats and ranges — is often added as a sixth). Naming quality this way lets teams measure it, set thresholds, and target remediation rather than treating "bad data" as a single vague complaint.

## Context & Usage

Applied in the Source Data domain during quality validation and revisited whenever a result looks suspect (identify → source → analyze → interpret & report → use). Concrete example: assessing the churn dataset, accuracy is tested by reconciling order totals against finance; completeness flags the 30% missing delivery dates; consistency checks that region codes match across order and CRM tables; uniqueness catches duplicated customer records from a past migration; and timeliness confirms the feed is current to last month — each dimension yielding a specific fix before modeling proceeds.

## Related Techniques / Tools

* Source Data (328), Data profiling (340), Business validation of data sources (345), Technical validation of data quality (346), Data preparation — joins/normalization/cleansing/weighting (348); BABOK: Data Dictionary (41), Metrics/KPIs (57), Business Rules Analysis (30)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (data quality dimensions)
