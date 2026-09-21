# Jev cheatsheet — typed decisions for software

Quick reference. No timed study plan — use as a standing map.

## One-liner

**Jev** (TypeSafe **System One**) takes program **state** + typed **questions** and returns **Choice / Score / Noul** answers with probabilities. It does **not** chat, write code, or explain itself. Your code branches on the numbers.

## Three primitives

| Primitive | Ask | Get back |
|-----------|-----|----------|
| **Choice** | Which labelled option? | Winner + per-option probs + confidence |
| **Score** | Where on an ordered scale? | Level / weighted score |
| **Noul** | Is this true / yes? | Probability in [0, 1] |

Many questions can share one state in **one round trip**.

## Mental models

1. **Decision layer, not narrator** — LLM (or humans) still write plans and replies.
2. **Confidence gate** — act if confidence ≥ τ; else escalate to human or LLM.
3. **Schema is the product** — bad option labels → bad decisions.
4. **Calibration ≠ correctness** — a 0.9 is a long-run frequency claim, not a warranty on this ticket.
5. **Agent co-pilot** — LLM plans/writes; Jev answers “which queue / safe / done?”

## Act vs escalate (default pattern)

```
state → Jev(questions) → {answer, p}
if p >= τ and schema is closed → act in code
else → human review or LLM handoff
```

## When to use Jev

- Closed answer spaces you can label
- Routing, severity, yes/no gates, tool-guard checks
- High volume / low latency decisions where prose is waste

## When **not** to use Jev

- Open-ended writing, plans, tool-call prose, user-facing explanations
- Forcing a tiny Choice set onto an unbounded problem
- Treating Jev as the sole agent brain
- Trusting vendor 193× / “zero hallucination” claims without measuring your workload  
  (“Zero hallucination” ≈ **no free-text outside the schema**, not perfect truth)

## Common traps

| Trap | Fix |
|------|-----|
| Jev as chatbot | Keep generation on an LLM |
| Confusing Kahneman “System 1” with TypeSafe **System One** | Product class = fast structured decisions for software |
| Auto-approving a single high p | Threshold + escalate path; calibration is aggregate |
| Vague Choice labels / missing “other” | Rewrite schema before blaming the model |
| TypeSafe vs Typeface | Company is **typesafe.ai** |

## Falsifier (you “get” it when…)

You can contrast System One (Jev) vs an LLM agent with examples, and name when **not** to use Jev.

## Primary docs

- https://docs.typesafe.ai/concepts/system-one
- https://typesafe.ai/blog/introducing-system-one-models-and-jev
- https://docs.typesafe.ai/introduction/quickstart
