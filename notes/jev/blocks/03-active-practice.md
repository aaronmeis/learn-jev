# Block 3: Active practice

**Context:** Untimed reference section (from study pack; ignore any minute targets).
**Goal:** Design real questions and thresholds â€” schema under your fingers.  
**Hub:** Learn Jev reference

## Focus from mind map

- Support-ticket triple: department Choice + severity Score + escalate Noul
- Confidence thresholds and fallbacks
- Map one agent-loop decision that today costs an LLM call

## Sources

- [Quickstart](https://docs.typesafe.ai/introduction/quickstart)
- [Choice](https://docs.typesafe.ai/primitives/choice) (+ Score / Noul pages as needed)
- Video drill: [I tried TypeSafeâ€™s System One Model: Jev](https://www.youtube.com/watch?v=CcmqPS6q9Gw) (TypeScript app segment) **or** [Live demos](https://www.youtube.com/watch?v=QKafJHkYrRE)

## Actions

1. **Ticket router drill (45m):** Invent 3 sample tickets. For each, define:
   - `state` fields (message, plan, amount, â€¦)
   - `department`: Choice with â‰¥3 labelled options (good labels, not vague)
   - `severity`: Score with ordered levels
   - `escalate`: Noul (â€œShould a human take this before auto-refund?â€)
   - Thresholds: e.g. act if Choice confidence â‰¥ 0.85 and escalate Noul < 0.4
2. **Agent loop map (30m):** Pick one loop (support agent, code agent, or browser agent). List 5 decision points. Mark which are Jev-shaped vs must stay LLM.
3. **Error pass (15m):** Deliberately write a bad Choice set (overlapping options, missing â€œotherâ€). Note how the schema fails before the model does.
4. Optional live call only if you already have `TYPESAFE_API_KEY` / OpenRouter access â€” **never** put keys in the vault.

## Retrieval check

> [!question]
> What was the hardest practice step, and what mistake in the schema did you correct?

%% fold answer after attempt %%
> [!success]- Answer cues
> Typical miss: fuzzy option labels, no escalate path, treating Score like free-form severity text, or putting open-ended â€œwrite the replyâ€ on Jev.

## Exit criteria

- [ ] Three tickets designed with primitives + thresholds
- [ ] Agent loop map with Jev vs LLM marks
- [ ] One bad-schema failure noted

