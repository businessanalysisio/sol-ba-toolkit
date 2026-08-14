---
id: skill-0341
title: "Data sampling"
source: "Introduction to Business Data Analytics"
number: 341
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data sampling

## Overview

Selecting a subset of records that stands in for the full population so analysis is faster and cheaper without materially distorting conclusions. It spans techniques — simple random, systematic, stratified (sampling within subgroups to preserve their proportions), and cluster sampling — and the judgment behind them: choosing a sample size that gives adequate statistical power, and guarding against sampling bias that would make the subset unrepresentative. Done well, a sample supports valid inference about the whole; done carelessly, it bakes in error that no downstream analysis can remove.

## Context & Usage

A Source Data activity used when the full dataset is too large or costly to analyze wholesale, or when a controlled subset is needed for model training/testing (identify → source → analyze → interpret & report → use). Concrete example: with tens of millions of transactions, the churn study draws a stratified sample across regions and value tiers so each premium sub-segment is represented in proportion, then reserves a time-based holdout period as a test set — avoiding a naive random pull that could under-represent smaller high-value segments.

## Related Techniques / Tools

* Source Data (328), Data profiling (340), Data preparation — joins/normalization/cleansing/weighting (348), Data integrity/validity/reliability/bias assessment (350), Regression analysis (354); BABOK: Data Mining (43), Estimation (49)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (data sampling)
