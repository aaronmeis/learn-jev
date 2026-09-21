# Elicit light research — Jev / System One calibration framing

**Query:** `calibrated probabilistic classification selective prediction confidence for decision making`  
**Run:** 2026-09-20 via `elicit_hermes.py search --max-results 8`  
**Role:** Ground TypeSafe’s “calibrated decisions / confidence gate” story in published ML literature (not product marketing).

## Hit table

| Year | Title | Authors | Why it matters | Link |
|------|-------|---------|----------------|------|
| 2021 | Calibrating Predictions to Decisions: A Novel Approach to Multi-Class Calibration | Zhao et al. | Calibration tied to downstream decisions, not only score reliability | NeurIPS 2021 |
| 2019 | Calibration Techniques for Binary Classification Problems: A Comparative Analysis | Martino et al. | Survey of turning classifier scores into probabilities | https://doi.org/10.5220/0008165504870495 |
| 2004 | Properties and Benefits of Calibrated Classifiers | Cohen & Goldszmidt | Classic: calibrated probs ≈ true class frequency | https://doi.org/10.1007/978-3-540-30116-5_14 |
| 2022 | Calibrated Selective Classification | Fisch, Jaakkola, Barzilay | Abstain / “I don’t know” with calibrated coverage — maps to escalate-on-low-confidence | https://doi.org/10.48550/arXiv.2208.12084 |
| 2021 | Classifier calibration: a survey… | Filho et al. | Broad how-to assess and improve predicted probabilities | https://doi.org/10.1007/s10994-023-06336-7 |
| 2023 | Human-Aligned Calibration for AI-Assisted Decision Making | Corvelo Benz & Gomez Rodriguez | Calibration when a human still decides with the score | https://doi.org/10.48550/arXiv.2306.00074 |

## Takeaways for the day plan

1. **Calibration ≠ correctness.** Literature treats calibration as long-run frequency matching; TypeSafe’s FAQ aligns: shape is guaranteed, individual answers can still be wrong.
2. **Selective classification ≈ confidence gate.** Fisch et al. formalize abstention — the same pattern as “low Noul/Choice confidence → human or LLM.”
3. **Use papers for Block 2 (mental models) and Block 5 (traps).** Use TypeSafe docs + demos for primitives/API; use Elicit hits to avoid over-reading a single 0.92.

## Gaps Elicit did not fill

- No peer-reviewed paper yet on **RLCD** or **System One Models** as TypeSafe defines them (vendor-primary; treat claims as early-access).
- No independent large-scale benchmark replication in this hit set — keep speed/cost multiples as **vendor-reported** until measured on your workflow.
