# Block 2: Mental models

**Context:** Untimed reference section (from study pack; ignore any minute targets).
**Goal:** Internalize the decision-layer patterns and what calibration actually means.  
**Hub:** Learn Jev reference

## Focus from mind map

- Decision layer, not narrator
- Confidence gate (act vs escalate)
- Schema is the product
- Calibration â‰  correctness (aggregate frequencies)
- Agent co-pilot: LLM plans/writes; Jev answers bounded questions

## Sources

- [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one)
- [[../reference/elicit-light-research]] (selective classification / calibration hits)
- Optional: Fisch et al. Calibrated Selective Classification â€” https://arxiv.org/abs/2208.12084 (abstract only)

## Actions

1. Capture **five named models** with When / How / Failure:
   1. Decision layer vs narrator
   2. Confidence gate / selective abstention
   3. Schema-as-product
   4. Calibration â‰  single-call truth
   5. LLM + Jev split brain (generate vs decide)
2. Sketch: `state â†’ Jev(questions) â†’ {answer, p} â†’ if p â‰¥ Ï„ then act else escalate`.
3. Write one line: â€œA 0.9 is a calibrated frequency claim across many trials, not a warranty on this ticket.â€
4. Relate to sibling pack: preference-trained LLMs optimize looking good to humans; System One optimizes **bounded decisions for code**.

## Retrieval check

> [!question]
> Which mental model do you reach for first when an agent keeps burning LLM calls on yes/no checks â€” and why?

%% fold answer after attempt %%
> [!success]- Answer cues
> Confidence gate + decision layer: replace the LLM call with a Noul/Choice; escalate only when probability is below threshold.

## Exit criteria

- [ ] 5 models with when/how/fail
- [ ] Act/escalate sketch done
- [ ] Calibration one-liner written

