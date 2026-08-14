---
id: skill-0130
title: "Business event analysis / System event analysis"
source: "Business Analysis Techniques"
number: 130
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "solution-design"]
---
# Business event analysis / System event analysis

## Overview

Identifies every event the business (or system) must respond to, on the principle that each event triggers exactly one process — so a complete event list defines a complete process set. Events come in three types: external events, originating outside the business system (a customer places an order, a supplier submits an invoice); internal decision events, where someone inside decides to act (a manager decides to discontinue a product line); and time-based or scheduled events, fired by the calendar or clock (month-end arrives, a policy reaches its renewal date). For each event the analyst records the trigger, the required response and the outcome, and asks the completeness questions the types make systematic: what can arrive from outside? what do we decide? what happens on a schedule?

## Context & Usage

Applied at process-scoping time to carve a business area into the right set of process models — one per event — instead of one sprawling everything-diagram, and again at system level where events become the triggers of use cases and the transitions of state machines. Time-based events are the classic omission (nobody "does" them, so nobody mentions them in interviews), followed by unhappy-path externals such as "customer cancels" or "payment fails"; deliberately hunting these prevents whole processes going unmodelled.

## Related Techniques / Tools

* Business process modelling (132), Context diagram (116), Business use case modelling (166), State machine diagrams (170), Business Activity Model (123); BABOK: Process Modelling (64), Scope Modelling (70), Business Rules Analysis (38); Process modelling and levels of detail (198)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — Analyse Needs: process analysis (identifying process triggers)
