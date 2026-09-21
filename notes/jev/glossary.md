---
type: learning
layer: learning
topic: jev-system-one
tags: [learning, one-day-mastery, glossary, jev-system-one]
ontology_version: "1.0"
description: "Terms earned after demonstrated understanding."
---
# GLOSSARY — Jev (TypeSafe System One) — typed decisions for software

Add terms only after the learner can use them correctly. Seed list for study day:

| Term | Definition | Block |
|------|------------|-------|
| System One (TypeSafe) | Model class for fast structured decisions software consumes directly (Kahneman metaphor; not “error-prone System 1”) | 1 |
| Jev | TypeSafe’s flagship System One model (`jev-latest`); typed probs out, no free text | 1 |
| State | Unstructured / structured context sent with questions (text, JSON, arrays of text) | 1 |
| Choice | Primitive: pick among labelled options; returns winner, per-option probs, confidence | 1 |
| Score | Primitive: ordered scale with described levels | 1 |
| Noul | Primitive: yes/no / statement → probability in [0,1] | 1 |
| Calibration | Long-run match of stated probs to frequencies; not a warranty on one answer | 2 |
| Confidence gate | Act when confidence ≥ τ; else escalate to human/LLM | 2 |
| RLCD | TypeSafe’s “Reinforcement Learning for Calibrated Decisions” (vendor claim; light peer review so far) | 2 / 5 |
| Decision layer | Jev (or similar) as the decide step; LLM remains narrator/planner when needed | 2 |
