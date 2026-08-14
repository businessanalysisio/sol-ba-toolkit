---
id: skill-0354
title: "Regression analysis (prediction/forecasting)"
source: "Introduction to Business Data Analytics"
number: 354
category: ""
tags: ["data-analytics", "business-analysis"]
---
# Regression analysis (prediction/forecasting)

## Overview

A supervised technique that models the relationship between a dependent (outcome) variable and one or more independent (predictor) variables, both to explain which factors drive the outcome and to forecast it for new cases. Linear regression fits a continuous target; logistic regression estimates the probability of a binary outcome; time-series regression projects a metric forward. Each fitted coefficient quantifies a predictor's effect and its statistical significance, while goodness-of-fit measures (R², error metrics, AUC for classification) indicate how well the model holds. Its power comes with obligations: checking assumptions, guarding against multicollinearity, and validating on held-out data.

## Context & Usage

An Analyze-domain technique central to predictive analytics and forecasting, applied after the analysis plan fixes the target and predictors (identify → source → analyze → interpret & report → use). Concrete example: the churn study fits a logistic regression estimating each premium customer's probability of churning next quarter from delivery delay, discount frequency, tenure, and support contacts; delivery delay emerges as the largest significant driver, and the model — validated on a later time period — both quantifies the effect and scores who is most at risk.

## Related Techniques / Tools

* Analytics-approach planning (336), Analysis-plan development (347), Classification-tree analysis (352), Simulation (355), Data integrity/validity/reliability/bias assessment (350), Data preparation — joins/normalization/cleansing/weighting (348); BABOK: Data Mining (43), Metrics/KPIs (57), Estimation (49)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (regression analysis)
