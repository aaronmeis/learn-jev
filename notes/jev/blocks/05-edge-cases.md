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
