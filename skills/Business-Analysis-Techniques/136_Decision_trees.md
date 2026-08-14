---
id: skill-0136
title: "Decision trees"
source: "Business Analysis Techniques"
number: 136
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools"]
---
# Decision trees

## Overview

Shows conditional business logic as a branching diagram read from a root node: each node poses a question about one condition, each branch carries a possible answer, and every root-to-leaf path ends in the action or outcome that applies. The same rules a decision table holds in columns appear here as visible paths, which many stakeholders follow more naturally because the question sequence mirrors how they think through a case ("Is the customer a member? If yes, is the order over £100?"). A second, quantitative variant supports options evaluation: decision nodes (squares) and chance nodes (circles) carry probabilities and payoffs, and multiplying along the branches yields an expected value for each choice.

## Context & Usage

Choose a tree over a table when conditions are naturally evaluated in order, when many combinations are impossible (the tree simply omits those paths), or when the audience needs to trace individual cases during validation workshops. Its weakness mirrors its strength: unlike a 2^n table, nothing in the notation proves every combination has been covered, so a tree used for rule documentation should be cross-checked for completeness. The probabilistic form appears in business cases when comparing candidate options under uncertainty.

## Related Techniques / Tools

* Decision tables (135), Risk analysis (146), Options identification (140); BABOK: Decision Analysis (45), Decision Modelling (46), Business Rules Analysis (38)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
