# Mind map — Jev (TypeSafe System One)

> [!warning] Agent draft — review before GO
>
> Drafted from Mode B interview + public TypeSafe / explainer sources (Sep 2026). Edit freely, then check Progress Log.

**Slug:** `jev-system-one` · **Sibling:** [[ai-assistance-vs-automation]] (Almeida talk → assistance vs automation; Jev/RLCD as the “beyond RLHF” branch)

## Day outcome
Explain and teach Jev: System One = fast typed decisions for software; contrast vs LLM / System Two agents; three primitives; act-vs-escalate on confidence.

## Central claim
LLMs generate text (and often overconfident prose). **Jev** is TypeSafe’s first **System One** model: unstructured state in → **typed probabilistic decisions** out — no chat, no code, no explanations. Software branches on the numbers.

## Branch A — Product & naming
- **TypeSafe AI** (typesafe.ai) — not “typescript.ai”
- **System One** model class (Kahneman metaphor: fast structured decisions)
- **Jev** = flagship model (`jev-latest`); name nod to Jevons (cheaper intelligence → more demand)
- Founder lineage: Diogo Almeida / RLHF history → automation gap thesis (sibling pack)
- Launch ~2026-09-15 early access; hosted API

## Branch B — How it differs from an LLM
| LLM (System Two-ish in product use) | System One / Jev |
|-------------------------------------|------------------|
| Autoregressive text generation | Parallel typed answers |
| Open-ended replies, plans, tool prose | Closed answer spaces you define |
| Parse/JSON-mode / structured-output hacks | Native Choice / Score / Noul |
| Hallucinate free text | Cannot invent options outside the schema |
| Seconds + output tokens | ~70–500 ms; input-priced; output free (vendor claim) |

## Branch C — Three primitives (core vocab)
- **Choice** — pick among labelled options (up to ~255); per-option probs + confidence
- **Score** — ordered scale with described levels
- **Noul** — yes/no / statement truth → probability in [0,1]
- One request: state + many questions → all answers in one round trip

## Branch D — Mental models
1. **Decision layer, not narrator** — Jev never writes the email; code does
2. **Confidence gate** — high confidence → automate; low → human / LLM escalate
3. **Schema is the product** — bad option labels = bad decisions
4. **Calibration ≠ correctness** — 0.9 means calibrated uncertainty across many trials, not “this one is true”
5. **Agent co-pilot** — LLM plans/writes; Jev answers “which queue / safe to run / done?”

## Branch E — Active practice targets
- Design 3 questions for a support ticket (dept Choice + severity Score + escalate Noul)
- Sketch confidence thresholds and fallback paths
- Map one agent loop step that today burns an LLM call onto a Jev question
- Read API shape: `POST …/v1/systemone`, state object, questions map

## Branch F — Teach-back angle (30m)
“Jev is a frontier-intelligence **function call**: state in, typed probs out. Use it where you already know the answer space and need speed + a confidence number — not where you need a paragraph.”

## Branch G — Edge cases / traps
- Treating Jev as a chatbot or sole agent brain
- Confusing System One branding with Kahneman’s error-prone System 1
- Over-trusting a single high probability (calibration is aggregate)
- Open-ended tasks forced into tiny Choice sets (garbage schema)
- Vendor speed/cost multiples without independent measurement
- Ignoring multimodal limits (text/JSON state today; no images/audio yet)
- Mixing up TypeSafe vs Typeface; System One vs System 1 spelling in docs

## Branch H — Application (60m sketch)
One-pager: **ticket router or agent middleware** — state fields, three primitives, thresholds, escalate path, what stays on the LLM. Optional: LangChain middleware story (model router / tool guard) as pattern only — no full platform build.

## Branch I — Falsifiers
- Cannot contrast System One vs LLM agent with examples
- Cannot name when **not** to use Jev
- Cannot sketch perceive → typed decide → act/escalate without inventing prose output from Jev

## Pedagogy coverage hints
- Core concepts → A–C
- Mental models → D
- Active practice → E
- Teach it → F
- Edge cases → G
- Spaced review → vocab + contrast table
- Application → H
