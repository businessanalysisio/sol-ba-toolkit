---
id: skill-0352
title: "Classification tree analysis"
source: "Introduction to Business Data Analytics"
number: 352
category: ""
tags: ["data-analytics", "business-analysis"]
---
# Classification tree analysis

## Overview

A supervised technique that predicts a categorical outcome by recursively splitting data on the input variable that best separates the classes at each step, producing a tree of if-then decision rules. Each internal node tests a feature (e.g. "delivery delay > 3 days?"), each branch a possible answer, and each leaf a predicted class with its probability. Splits are chosen to maximize purity (via measures such as Gini impurity or information gain), and the tree is pruned to avoid overfitting. Its great virtue is interpretability: the resulting rules are transparent and can be read and challenged by non-technical stakeholders.

## Context & Usage

An Analyze-domain predictive technique chosen when the target is a category and the audience needs to see the reasoning, not just the score (identify → source → analyze → interpret & report → use). Concrete example: for the churn question, a classification tree predicts churn/retain and reveals a readable path — premium customers with delivery delays over three days and two or more support contacts churn 61% of the time — a rule the business can immediately understand, trust, and turn into a targeted intervention.

## Related Techniques / Tools

* Analytics-approach planning (336), Regression analysis (354), K-means clustering (353), Association-rule learning (351), Data integrity/validity/reliability/bias assessment (350); BABOK: Data Mining (43), Decision Analysis (40), Decision Modelling (39)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (classification tree analysis)
