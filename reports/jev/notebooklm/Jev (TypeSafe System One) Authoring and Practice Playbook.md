# Jev (TypeSafe System One) Authoring & Practice Playbook

### 1. The System One Paradigm: Core Concepts and Contrast

**The System One Model Class**
Jev is a "System One" model, a technical classification defined by frontier-intelligence functions optimized for fast, intuitive, and structured judgments. Drawing from the Kahneman metaphor, Jev handles "Reflex" labor—rapidly evaluating an unstructured state and returning typed probabilities rather than generating autoregressive tokens. It is not a chatbot; it is a frontier-intelligence function call: unstructured program state in, typed probabilistic decisions out.

**LLM vs. System One Contrast Table**

| Dimension | LLM (System Two-ish) | Jev (System One) |
| :--- | :--- | :--- |
| **Optimization** | RLHF / RLVR (Human Preference) | RLCD (Calibrated Decisions) |
| **Output Type** | Sequential Prose / Tokens | Parallel Typed Probabilities |
| **Latency** | Seconds (3s – 329s) | Milliseconds (70ms – 500ms) |
| **Cost Structure** | $0.20 – $10.00 / MTok | $0.042 / MTok ($42 / Billion) |
| **Schema Safety** | Parsing/Validation hacks | Type-safe by construction |
| **Output Cost** | ~5x higher than input | **FREE** (Too cheap to meter) |

**The "Decision Layer" Philosophy**
Jev is a decision layer, not a narrator. It never writes code, generates emails, or provides reasoning explanations. Its architectural purpose is to provide "programmable common sense" over unstructured data that hand-written logic cannot parse. Jev returns structured numbers specifically for software to branch on. Code handles the side effects; Jev handles the "fuzzy" logic branching.

---

### 2. The Three Primitives: Atomic Question Design

**Choice Primitive**
Used to select a single option from a pre-defined set of up to 255 labeled options. 
*   **Request Structure:** Requires `instructions` and a `criteria` map.
*   **Output Components:** The selected `choice`, a full distribution of `probabilities`, and a `confidence` score.
*   **Example Response:** `{"choice": "billing", "confidence": 0.92, "probabilities": {"billing": 0.92, "shipping": 0.08}}`

**Score Primitive**
An ordered scale with described levels used for assessing spectrums (e.g., customer frustration, bug severity). 
*   **Weighted Logic:** Unlike a simple integer, Score returns a continuous number (e.g., 1.4) representing the weighted probability across all defined levels.

**Noul Primitive**
A yes/no truth probability in the [0, 1] range. 
*   **Enforced Structure:** Requests must explicitly define `true` and `false` keys within the `criteria` object to bound the decision space.
*   **Contrast:** Unlike a binary Boolean, a Noul communicates epistemic uncertainty, allowing code to see *how* true a statement appears.

**Mandatory Referencing Syntax**
Architects must use **backticked dot-and-index paths** (e.g., `` `support.tickets[0].message` ``) within question instructions to point the model at specific state values. This prevents ambiguity and ensures the model evaluates the correct nested variable within a complex state object.

**Structured Instructions and Criteria**
For complex or similar options (e.g., "Return Policy" vs "Return Status"), utilize nested JSON objects instead of strings. Mandate the use of keys like `question`, `focus`, `what`, `not_for`, and `examples` to provide contrastive guidance and minimize confusion.

---

### 3. The Five-Step Authoring Workflow

**Step 1: Deterministic Filtering**
Mandate the use of standard code for all deterministic rules, control flow, and side effects. If an invoice check can be handled by `if days_overdue > 30`, use code. Jev is reserved for unstructured judgments where code is too brittle.

**Step 2: State Decomposition**
Mandate "State Pruning" to prevent context rot. Include only the fields absolutely necessary for the questions at hand. Stripping distracting tokens minimizes noise and optimizes token costs.

**Step 3: Question Decomposition**
This is the **most important concept** in the workflow. Broad judgments (e.g., "Is this spam?") must be broken into narrow, atomic, specific questions (e.g., "Does the sender identity mismatch?"). Decomposing the problem exposes underlying judgments, making the system inspectable and tunable via code.

**Step 4: Parallelization Strategy (Speculative Fan-Out)**
Avoid serial requests. Send multiple independent questions (Choice, Score, Noul) in a single request. Jev’s parallel sampler evaluates these simultaneously, maintaining 100ms speeds regardless of question count.

**Step 5: Confidence-Gated Routing**
Implement "Act vs. Escalate" logic. Use the calibrated `confidence` score to determine the path:
```python
# Confidence-Gated Pattern
if response.answers["is_safe"].confidence < 0.85:
    route_to_human_review(ticket) # Escalate
else:
    execute_action(response.answers["is_safe"].choice) # Act
```

---

### 4. Mental Models for High-Competence Practice

*   **Calibration vs. Correctness:** A 0.9 confidence score is a calibrated frequency claim—meaning that across many trials, the model will be accurate 90% of the time. It is an estimate of uncertainty, not a single-instance truth warranty.
*   **Schema-as-Product:** The output is only as good as the labels. Use the **Error Pass** technique: create a **"Garbage Schema"** with overlapping or vague options to identify where the model's calibration fails, then refine for mutual exclusivity.
*   **Agent Co-pilot Split:** Distinguish labor between System Two (LLM) and System One (Jev). The LLM handles planning and generation; Jev handles the "Reflex" checks: "Is the page loaded?", "Which queue?", "Is this command dangerous?".
*   **Selective Classification:** Grounded in **Fisch et al. (2022)**, this model allows the system to abstain from a decision when uncertainty is too high, maintaining high reliability for automated actions by routing the "I don't know" cases to humans or reasoning models.

---

### 5. Required Practitioner Artifacts

**The Decision Layer One-Pager**
*   **Problem Statement:** The specific automated workflow.
*   **State Schema:** The JSON structure being sent.
*   **Typed Questions:** The Choice/Score/Noul questions with backticked paths and labels.
*   **Threshold Paths:** Explicit `if confidence > τ` logic for automation vs escalation.

**The Trap Sheet**

| Symptom | Root Cause | Mitigation |
| :--- | :--- | :--- |
| 404/Connection Error | Using `typescript.ai` | Use **`typesafe.ai`** |
| High Hallucination Rate | Treating Jev as a Chatbot | Enforce schema; Jev cannot generate text |
| Over-confidence in single errors | Confusing Calibration with Correctness | Use confidence gates; cite Fisch et al. |
| Inconsistent Decisions | Vague or "Garbage" Schema labels | Perform Error Pass; refine criteria |
| Unmeasured Speed/Cost | Trusting vendor-reported multiples | Conduct independent measurement |
| System Failure on Images | Ignoring multi-modal limits | Jev is **Text/JSON only** today |
| Naming Confusion | Mix-up with "Typeface" | Verify vendor: TypeSafe AI |

**The Agent Loop Map**
Mark all workflow steps. Categorize "Reflex" steps (routing, safety checks, state verification) for Jev and "Brain" steps (content generation, planning) for the LLM.

---

### 6. Falsification Test for Shallow Fluency

**The "Contrast Test"**
Replace hand-written logic with Jev for these three fuzzy decision rules without using prose:
1.  **Security:** State (Shell Command) -> Noul (Is this dangerous?).
2.  **Routing:** State (Customer Email) -> Choice (Identify department).
3.  **Triage:** State (Server Logs) -> Score (Severity levels 0-5).
*Logic: No sentences. Just types and probabilities.*

**The "When Not to Use" Challenge**
Identify four scenarios where Jev is the incorrect tool:
1.  Summarizing a transcript (Prose generation).
2.  Writing a Python script (Code generation).
3.  Analyzing a security camera feed (Multimodal).
4.  Open-ended strategic planning (No bounded answer space).

**The Engineering Statement Task**
*Marketing Claim:* "Zero hallucinations."
*Engineering Statement:* "Jev enforces strict schema-safety and type-safety by construction; because it lacks an autoregressive string generator, it is mathematically impossible for the model to return a value or type outside the pre-defined answer space."

---

### 7. Silence and Out-of-Scope

**Categorical Silences**
Sources currently do **not** cover:
*   Multi-modal inputs (Image/Video/Audio).
*   Independent, third-party speed/cost audits.
*   Deep academic scholarship on Kahneman’s neuroscience.

**Uncertainty Register**

| Gap | Why it Matters | Status |
| :--- | :--- | :--- |
| **Peer-reviewed RLCD Paper** | Validates training method over RLHF | **UNKNOWN** |
| **Independent Benchmarks** | Verifies 193x speed/444x cost claims | **VENDOR-REPORTED** |
| **Multi-modal Release** | Essential for visual computer-use agents | **UNKNOWN** |
| **RLCD Validation Gap** | Proves long-term decision reliability | **UNKNOWN** |