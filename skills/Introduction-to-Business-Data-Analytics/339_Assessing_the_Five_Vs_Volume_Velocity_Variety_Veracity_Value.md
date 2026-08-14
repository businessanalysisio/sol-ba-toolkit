---
id: skill-0339
title: "Assessing the Five Vs: Volume, Velocity, Variety, Veracity, Value"
source: "Introduction to Business Data Analytics"
number: 339
category: ""
tags: ["data-analytics", "business-analysis"]
---
# Assessing the Five Vs: Volume, Velocity, Variety, Veracity, Value

## Overview

A framework for characterizing a dataset — especially big-data sources — along five dimensions so the team understands what it is dealing with before committing to it. Volume is how much data there is (and whether infrastructure can hold and process it); velocity is how fast it arrives and must be handled (batch vs. streaming); variety is the mix of structured, semi-structured, and unstructured formats; veracity is how trustworthy and clean it is; and value is whether, after all that, the data actually helps answer the question. The Five Vs turn a vague sense of "big data" into concrete engineering and quality implications.

## Context & Usage

A Source Data assessment applied when sizing up a source's practical demands, alongside profiling and quality checks (identify → source → analyze → interpret & report → use). Concrete example: a clickstream feed for the churn study scores high on volume and velocity (millions of events per day, near-real-time), high on variety (nested JSON events), uncertain on veracity (bot traffic, dropped events), and only moderate on value once aggregated to the monthly grain — telling the team it needs stream tooling and heavy filtering before the source earns its place.

## Related Techniques / Tools

* Source Data (328), Data-source evaluation — cost/value/timing/risk/feasibility (338), Data profiling (340), Data quality dimensions (344), Data-collection planning (337); BABOK: Data Mining (43), Non-Functional Requirements Analysis (58)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (the Five Vs)
