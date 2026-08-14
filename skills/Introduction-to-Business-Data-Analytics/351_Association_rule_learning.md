---
id: skill-0351
title: "Association rule learning"
source: "Introduction to Business Data Analytics"
number: 351
category: ""
tags: ["data-analytics", "business-analysis"]
---
# Association rule learning

## Overview

An unsupervised technique that discovers "if-then" co-occurrence patterns among items in transactional data — the classic market-basket analysis. It generates rules of the form "if a customer buys A, they also buy B," each scored by support (how often the itemset appears), confidence (how often B follows A), and lift (how much more likely B is given A than by chance). Algorithms such as Apriori prune the vast space of possible itemsets to those frequent enough to matter. The output is a ranked set of actionable associations, not a prediction of any single outcome.

## Context & Usage

An Analyze-domain technique chosen when the diagnostic or descriptive question is about what goes together, typically in retail, recommendation, and cross-sell contexts (identify → source → analyze → interpret & report → use). Concrete example: extending the churn study, association-rule learning on order baskets shows that customers who buy a starter kit and later a specific accessory rarely churn, whereas single-category buyers do — suggesting a cross-sell nudge (high lift, adequate support) as a concrete retention lever the prescriptive phase can act on.

## Related Techniques / Tools

* Analytics-approach planning (336), K-means clustering (353), Classification-tree analysis (352), Exploratory data analysis (349), Recommending solution options from analytics results (360); BABOK: Data Mining (43), Metrics/KPIs (57)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (association rule learning)
