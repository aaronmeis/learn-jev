# Pedagogy blocks — Jev (TypeSafe System One) — typed decisions for software

# Block 1: Core concepts

**Time:** 60 minutes  
**Goal:** Lock vocabulary so later blocks hang on a shared glossary.  
**Pack:** Jev (TypeSafe System One) — typed decisions for software (`jev-system-one`)

## Focus from mind map

- TypeSafe AI / System One model class / Jev (`jev-latest`)
- State in → typed probabilistic decisions out (no chat, no code, no explanations)
- Three primitives: Choice, Score, Noul
- Sibling context only: [[ai-assistance-vs-automation]] (Almeida / automation gap) — not today’s deep dive

## Sources

- [System One concepts](https://docs.typesafe.ai/concepts/system-one)
- [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [Quickstart](https://docs.typesafe.ai/introduction/quickstart)
- [Choice primitive](https://docs.typesafe.ai/primitives/choice)
- Optional video: [Live demos on OpenRouter](https://www.youtube.com/watch?v=QKafJHkYrRE) (first ~10 min)

## Actions

1. Skim System One concepts + launch blog for definitions only (no deep agent patterns yet).
2. Write a one-page concept list with one-line meanings:
   - System One model
   - Jev
   - State
   - Choice / Score / Noul
   - Confidence / calibrated probability
   - Parallel questions (one round trip)
3. Draw the contrast table from memory: **LLM generates text** vs **Jev returns typed probs**.
4. Mark three terms you still cannot explain aloud.

## Seed brief

Jev is a frontier-intelligence **function call**: messy program state plus questions you define → answers your code can branch on. It is not a chatbot. “Zero hallucination” in marketing means **no free-text invention outside the schema**, not perfect truth.

## Retrieval check

> [!question]
> Name the three primitives. In one sentence each: What does Jev return? What can it never do?

%% fold answer after attempt %%
> [!success]- Answer cues
> Choice / Score / Noul. Returns typed decisions + probabilities. Never writes replies, code, or reasoning prose.

## Exit criteria

- [ ] Concept list written
- [ ] Contrast table drawn
- [ ] Three weak terms marked


---

# Block 2: Mental models

**Time:** 45 minutes  
**Goal:** Internalize the decision-layer patterns and what calibration actually means.  
**Pack:** Jev (TypeSafe System One) (`jev-system-one`)

## Focus from mind map

- Decision layer, not narrator
- Confidence gate (act vs escalate)
- Schema is the product
- Calibration ≠ correctness (aggregate frequencies)
- Agent co-pilot: LLM plans/writes; Jev answers bounded questions

## Sources

- [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one)
- [[../reference/elicit-light-research]] (selective classification / calibration hits)
- Optional: Fisch et al. Calibrated Selective Classification — https://arxiv.org/abs/2208.12084 (abstract only)

## Actions

1. Capture **five named models** with When / How / Failure:
   1. Decision layer vs narrator
   2. Confidence gate / selective abstention
   3. Schema-as-product
   4. Calibration ≠ single-call truth
   5. LLM + Jev split brain (generate vs decide)
2. Sketch: `state → Jev(questions) → {answer, p} → if p ≥ τ then act else escalate`.
3. Write one line: “A 0.9 is a calibrated frequency claim across many trials, not a warranty on this ticket.”
4. Relate to sibling pack: preference-trained LLMs optimize looking good to humans; System One optimizes **bounded decisions for code**.

## Retrieval check

> [!question]
> Which mental model do you reach for first when an agent keeps burning LLM calls on yes/no checks — and why?

%% fold answer after attempt %%
> [!success]- Answer cues
> Confidence gate + decision layer: replace the LLM call with a Noul/Choice; escalate only when probability is below threshold.

## Exit criteria

- [ ] 5 models with when/how/fail
- [ ] Act/escalate sketch done
- [ ] Calibration one-liner written


---

# Block 3: Active practice

**Time:** 90 minutes  
**Goal:** Design real questions and thresholds — schema under your fingers.  
**Pack:** Jev (TypeSafe System One) (`jev-system-one`)

## Focus from mind map

- Support-ticket triple: department Choice + severity Score + escalate Noul
- Confidence thresholds and fallbacks
- Map one agent-loop decision that today costs an LLM call

## Sources

- [Quickstart](https://docs.typesafe.ai/introduction/quickstart)
- [Choice](https://docs.typesafe.ai/primitives/choice) (+ Score / Noul pages as needed)
- Video drill: [I tried TypeSafe’s System One Model: Jev](https://www.youtube.com/watch?v=CcmqPS6q9Gw) (TypeScript app segment) **or** [Live demos](https://www.youtube.com/watch?v=QKafJHkYrRE)

## Actions

1. **Ticket router drill (45m):** Invent 3 sample tickets. For each, define:
   - `state` fields (message, plan, amount, …)
   - `department`: Choice with ≥3 labelled options (good labels, not vague)
   - `severity`: Score with ordered levels
   - `escalate`: Noul (“Should a human take this before auto-refund?”)
   - Thresholds: e.g. act if Choice confidence ≥ 0.85 and escalate Noul < 0.4
2. **Agent loop map (30m):** Pick one loop (support agent, code agent, or browser agent). List 5 decision points. Mark which are Jev-shaped vs must stay LLM.
3. **Error pass (15m):** Deliberately write a bad Choice set (overlapping options, missing “other”). Note how the schema fails before the model does.
4. Optional live call only if you already have `TYPESAFE_API_KEY` / OpenRouter access — **never** put keys in the vault.

## Retrieval check

> [!question]
> What was the hardest practice step, and what mistake in the schema did you correct?

%% fold answer after attempt %%
> [!success]- Answer cues
> Typical miss: fuzzy option labels, no escalate path, treating Score like free-form severity text, or putting open-ended “write the reply” on Jev.

## Exit criteria

- [ ] Three tickets designed with primitives + thresholds
- [ ] Agent loop map with Jev vs LLM marks
- [ ] One bad-schema failure noted


---

# Block 4: Teach it

**Time:** 30 minutes  
**Goal:** A clean 5-minute teach-back a peer could follow.  
**Pack:** Jev (TypeSafe System One) (`jev-system-one`)

## Focus from mind map

Teach-back spine: “Jev is a frontier-intelligence **function call**: state in, typed probs out. Use it where the answer space is known and you need speed + a confidence number — not where you need a paragraph.”

## Sources

- Your Block 1 concept list + Block 2 models
- One demo clip if helpful: [Jev Explained (agents / Browser Use)](https://www.youtube.com/watch?v=We5igFMqZe8)

## Actions

1. Speak or write a **5-minute teach-back** covering:
   - What System One is (and is not)
   - Three primitives with one example each
   - Contrast vs LLM agent
   - One “when not to use” rule
2. Record gaps you could not explain without notes.
3. Fix gaps with a short source check — not a full re-read.
4. Optional: 30-second “elevator” version for a skeptical engineer.

## Retrieval check

> [!question]
> Explain Jev to a sharp beginner in under two minutes. Where did you stall?

%% fold answer after attempt %%
> [!success]- Answer cues
> Stall points often: Noul naming, calibration vs correctness, or why “zero hallucination” is a schema claim.

## Exit criteria

- [ ] Teach-back done
- [ ] Gaps listed and spot-fixed


---

# Block 5: Edge cases

**Time:** 45 minutes  
**Goal:** Trap sheet — where Jev (and your reading of it) fails.  
**Pack:** Jev (TypeSafe System One) (`jev-system-one`)

## Focus from mind map

- Jev as sole agent brain / chatbot
- Kahneman System 1 confusion vs TypeSafe “System One”
- Over-trusting one high probability
- Tiny Choice sets for open-ended work
- Vendor speed/cost multiples unmeasured
- Text-only state; multimodal limits
- TypeSafe ≠ Typeface

## Sources

- Launch FAQ / docs caveats via [System One concepts](https://docs.typesafe.ai/concepts/system-one)
- Skeptical explainer tone: [Schema-safe / caveats videos](https://www.youtube.com/watch?v=BGDd26FiOm4) or [Fully explained caveats](https://www.youtube.com/watch?v=NIlQsncfVYs)
- [[../reference/elicit-light-research]]

## Actions

1. Build a trap sheet (symptom → cause → fix) for at least **eight** traps from the focus list + your practice errors.
2. Add three **product-claim** traps: 193× faster, 0% type error, “cannot hallucinate” — rewrite each as a precise engineering statement.
3. Write the falsifier aloud: contrast System One vs LLM agent with examples; name when **not** to use Jev.
4. Add top three traps to a cheatsheet in NOTES.md.

## Retrieval check

> [!question]
> What edge case breaks a naive “replace every LLM call with Jev” plan?

%% fold answer after attempt %%
> [!success]- Answer cues
> Any step that must produce language (plan, tool call prose, user reply) or an unbounded answer space. Also low-confidence decisions treated as auto-approve.

## Exit criteria

- [ ] Trap sheet ≥8 rows
- [ ] Three claim rewrites
- [ ] Top traps on cheatsheet


---

# Block 6: Spaced review

**Time:** 20 minutes  
**Goal:** Closed-book retrieval; schedule 24h / 7d micro-reviews.  
**Pack:** Jev (TypeSafe System One) (`jev-system-one`)

## Quiz bank (close notes)

1. What company ships Jev, and what is the model class name?
2. Name the three primitives and one example question each.
3. What does a System One call take as input and return as output?
4. Calibration ≠ ________. Fill the blank and give an example.
5. Give two agent-loop decisions that fit Jev and two that must stay on an LLM.
6. Rewrite “zero hallucinations” as an accurate engineering claim.
7. What is your default escalate rule (threshold pattern)?
8. Name one Elicit-grounded idea that supports confidence gating.

## Actions

1. Answer quiz closed-book; grade yourself.
2. Restudy **only** misses (docs snippets, not full re-read).
3. Calendar: 24h and 7d 10-minute micro-review (quiz items 1–5).

## Retrieval check

> [!question]
> From memory: three facts and one process you must not forget about Jev.

%% fold answer after attempt %%
> [!success]- Answer cues
> Facts: typed probs not text; Choice/Score/Noul; early-access hosted API. Process: state + questions → answers → threshold → act/escalate.

## Exit criteria

- [ ] Quiz attempted closed-book
- [ ] Misses restudied
- [ ] 24h / 7d reviews scheduled


---

# Block 7: Application

**Time:** 60 minutes  
**Goal:** Ship a durable one-pager proving working fluency.  
**Pack:** Jev (TypeSafe System One) (`jev-system-one`)

## Focus from mind map

Ticket router **or** agent middleware decision map — state fields, three primitives, thresholds, escalate path, what stays on the LLM. Pattern-only mention of LangChain middleware (model router / tool guard) if useful — no full platform build.

## Sources

- Your Block 3 drills
- [How to build with System One](https://docs.typesafe.ai/concepts/how-to-build-with-system-one)
- Optional: [Agents / Browser Use explainer](https://www.youtube.com/watch?v=We5igFMqZe8)

## Actions

1. Produce **`learning-records/2026-09-20 - Jev decision layer one-pager.md`** (or today’s date) with:
   - Problem statement (one concrete workflow)
   - State schema
   - Questions (Choice / Score / Noul) with labels
   - Thresholds + escalate / LLM handoff
   - Explicit non-goals (what Jev will not do)
   - Falsifier check: can you contrast System One vs LLM with examples from this design?
2. Optional diagram (Mermaid) of the loop.
3. Learning-record footer: what evidence shows fluency (teach-back + this artifact + trap sheet).

## Retrieval check

> [!question]
> What did you ship today that proves working fluency in Jev / System One?

%% fold answer after attempt %%
> [!success]- Answer cues
> The one-pager with schema + thresholds + escalate path, plus ability to say when not to use Jev.

## Exit criteria

- [ ] Application artifact saved under learning-records/
- [ ] Learning record written
- [ ] Falsifier (System One vs LLM contrast) passes


---
