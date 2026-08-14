---
id: skill-0349
title: "Exploratory data analysis"
source: "Introduction to Business Data Analytics"
number: 349
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Exploratory data analysis

## Overview

Investigating a prepared dataset with summaries and visuals to understand its shape and relationships before committing to formal modeling. EDA computes distributions and summary statistics, plots histograms, box plots, and scatterplots, examines correlations, and looks for patterns, clusters, outliers, and anomalies. Its purpose is to build intuition, test the assumptions the analysis plan rests on, and reveal features or data issues that would otherwise be missed — it is deliberately open-ended, letting the data suggest what deserves closer, more rigorous analysis.

## Context & Usage

An Analyze-domain activity that sits between data preparation and formal technique application, and often loops back to refine both (identify → source → analyze → interpret & report → use). Concrete example: exploring the prepared churn dataset, the analyst plots churn rate against delivery-delay buckets and sees a sharp rise beyond three days, notices two suspicious spikes in the monthly trend traceable to a data-load gap, and finds discount frequency correlates with churn only in one segment — insights that reshape which variables the regression will test and confirm assumptions before modeling.

## Related Techniques / Tools

* Data preparation — joins/normalization/cleansing/weighting (348), Analysis-plan development (347), Regression analysis (354), K-means clustering (353), Deriving insights via data visualization (358), Data profiling (340); BABOK: Data Mining (43), Metrics/KPIs (57)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (exploratory data analysis)
