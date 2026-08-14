---
id: skill-0347
title: "Analysis-plan development"
source: "Introduction to Business Data Analytics"
number: 347
category: ""
tags: ["data-analytics", "business-analysis"]
---
# Analysis-plan development

## Overview

Laying out, before analysis runs, exactly how each research question will be answered: the technique to be used, the variables and their roles (inputs, target, controls), the metrics that constitute an answer, the assumptions being made, and the checks that will confirm the result is sound. A well-formed analysis plan states the hypothesis where one exists, defines success and significance thresholds up front, and specifies validation steps (holdouts, cross-checks) so the analyst cannot unconsciously fish for a convenient result after seeing the data.

## Context & Usage

The opening activity of the Analyze domain, translating the analytics-approach decision from the Identify phase into a concrete method spec before data preparation and modeling (identify → source → analyze → interpret & report → use). Concrete example: the churn analysis plan specifies a logistic regression predicting a churn flag, lists candidate drivers (delivery delay, discount frequency, support contacts), sets the train/holdout split by time period, fixes the decision threshold and the metric (AUC plus recall on the premium segment), and names the sanity checks to run before the model's output is believed.

## Related Techniques / Tools

* Analytics-approach planning (336), Exploratory data analysis (349), Data preparation — joins/normalization/cleansing/weighting (348), Regression analysis (354), Data integrity/validity/reliability/bias assessment (350); BABOK: Data Mining (43), Metrics/KPIs (57), Decision Analysis (40)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (analysis-plan development)
