---
id: skill-0353
title: "K-means clustering"
source: "Introduction to Business Data Analytics"
number: 353
category: ""
tags: ["data-analytics", "business-analysis"]
---
# K-means clustering

## Overview

An unsupervised technique that partitions records into k groups so that members of each group are as similar to one another as possible and as different as possible from other groups. It works iteratively: pick k initial centroids, assign each point to its nearest centroid, recompute centroids as the mean of their members, and repeat until assignments stabilize. The analyst must choose k (often guided by the elbow method or silhouette scores) and scale variables first so no single dimension dominates the distance calculation. The output is a set of data-driven segments with no predefined labels.

## Context & Usage

An Analyze-domain technique chosen when the goal is to discover natural groupings — segmentation — rather than predict a known outcome (identify → source → analyze → interpret & report → use). Concrete example: rather than relying on the pre-existing "premium" label, the churn study runs k-means on spend, frequency, tenure, and delivery experience, surfacing a distinct cluster of high-value, delay-sensitive customers whose churn behavior differs sharply from the rest — a segment the business had not named but can now target specifically.

## Related Techniques / Tools

* Analytics-approach planning (336), Classification-tree analysis (352), Association-rule learning (351), Regression analysis (354), Exploratory data analysis (349), Data preparation — joins/normalization/cleansing/weighting (348); BABOK: Data Mining (43), Metrics/KPIs (57)

## Resources

* IIBA Introduction to Business Data Analytics — Analyze Data (k-means clustering)
