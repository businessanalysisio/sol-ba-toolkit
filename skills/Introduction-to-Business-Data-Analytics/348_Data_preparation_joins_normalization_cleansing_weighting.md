---
id: skill-0348
title: "Data preparation (joins, normalization, cleansing, weighting)"
source: "Introduction to Business Data Analytics"
number: 348
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data preparation (joins, normalization, cleansing, weighting)

## Overview

Transforming validated raw data into the analysis-ready form a technique requires — typically the most time-consuming part of the whole effort. Joins combine records across tables into a single analytical dataset; normalization rescales or standardizes values so variables on different scales are comparable (and, in a modeling sense, reshapes structure); cleansing fixes or removes errors, nulls, outliers, and duplicates surfaced during profiling; and weighting adjusts records so an over- or under-represented group contributes in proportion to its true share. The output is a clean, consistent, correctly structured table on which analysis can run reliably.

## Context & Usage

An Analyze-domain activity, following the analysis plan and preceding exploration and modeling (identify → source → analyze → interpret & report → use). Concrete example: for the churn model, preparation joins orders, customers, delivery events, and support tickets to one customer-month row; imputes or drops the missing delivery dates found in profiling; caps extreme order values; normalizes spend and tenure for the regression; and weights the sample so a small but high-value premium region is not swamped by high-volume low-value segments.

## Related Techniques / Tools

* Analysis-plan development (347), Data profiling (340), Data sampling (341), Exploratory data analysis (349), Data quality dimensions (344), Regression analysis (354); BABOK: Data Modelling (44), Data Mining (43), Data Dictionary (41)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (data preparation)
