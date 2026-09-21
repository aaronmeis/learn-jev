# Technical Briefing: Implementing Jev (TypeSafe System One) for Programmatic Decision Layers

## 1. The System One Paradigm: Identity and Core Rationale

### The Model Class: Reflexive Intelligence
"System One" models represent a specialized class of frontier AI designed for fast, structured decision-making within software workflows. Drawing from Daniel Kahneman’s dual-process theory, these models serve as a "reflex layer"—providing the fast, intuitive judgment necessary for autonomous automation. Unlike LLMs, which are optimized for conversation, System One models are built to bridge the "automation gap" by providing the reliable, typed outputs required by deterministic code.

### The Flagship: Jev
**Jev** (specifically `jev-latest`) is the flagship model from **TypeSafe AI**. Founded by Diogo Almeida—the former OpenAI researcher behind the RLHF methods used in ChatGPT—TypeSafe was established to move beyond the limitations of chat-centric models. Jev is named after the Jevons Paradox: as the efficiency and cost of intelligence drop by orders of magnitude, the demand for embedded intelligence in software will explode.

### Contrast: Standard LLMs vs. Jev (System One)

| Dimension | Standard LLMs (System Two-ish) | Jev (System One) |
| :--- | :--- | :--- |
| **Optimization** | RLHF (Human Preference/Chat) | RLCD (Calibrated Decisions) |
| **Performance** | Owning the Reasoning Frontier | Owning the **Pareto Frontier** (Intelligence vs. Speed) |
| **Sampling** | Sequential (Token-by-token) | **Parallel** (Single-pass evaluation) |
| **Output Type** | Unstructured Generated Text | **Typed Probabilistic Decisions** |
| **Pricing** | Input + Output Tokens ($0.20–$10.00/MTok) | **$42 per Billion Input Tokens**; **Output is FREE** |
| **Latency** | 3 to 300+ Seconds | **70ms to 500ms** |

### The Core Claim
Jev functions as a **frontier-intelligence function call**: It ingests unstructured program state (strings, JSON, or arrays) and returns typed, probabilistic decisions. It allows for **deterministic control flow** around **fuzzy logic**, keeping the code in control of the workflow while the model handles the common-sense "System 1" judgments.

---

## 2. Core Vocabulary and Component Definitions

### Glossary of Primitives
Jev restricts model outputs to three type-safe "primitives" to ensure zero structural hallucinations:

*   **Choice:** Used for picking one option from a defined set of labeled labels (up to 255). It returns the selection, the full probability distribution, and a confidence score.
*   **Score:** Used for evaluations on an ordered scale (e.g., 0–5). It returns a continuous number representing the model's judgment on that scale based on provided descriptions.
*   **Noul:** Used to evaluate the **truth of a statement** or a binary yes/no. It returns an epistemically honest probability in the range of [0, 1].

### Technical Terms
*   **State:** The unstructured context provided for evaluation. This represents the environment (raw text, JSON blobs, or tool-call traces) the model must judge.
*   **Calibrated Confidence:** A value from 0 to 1 indicating **epistemic honesty**. A confidence of 0.90 is a calibrated frequency claim: it means that across an aggregate of many similar trials, the model expects to be correct 90% of the time.
*   **RLCD (Reinforcement Learning for Calibrated Decisions):** TypeSafe’s proprietary training method. Unlike RLHF, which optimizes for what sounds good to humans, RLCD optimizes for accurate probability distributions and consistent decision-making.

---

## 3. Structural Architecture: API and SDK Integration

### Request Schema
The request encapsulates the `state`, the `model` identifier, and a `questions` map.

```json
{
  "state": "Ticket: My flight was cancelled. Can I get a refund? Policy: Cancelled flights are eligible for a full refund.",
  "model": "jev-latest",
  "questions": {
    "policy_supports_refund": {
      "type": "noul",
      "instructions": "Does the refund policy support the refund requested in the ticket?"
    }
  }
}
```

### Response Schema
The response includes the `usage` object, which highlights that while input tokens are metered, **output tokens are free** (too cheap to meter).

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "policy_supports_refund": {
      "type": "noul",
      "noul": 0.98,
      "confidence": 0.98
    }
  },
  "usage": {
    "input_tokens": 412,
    "output_tokens": 12
  }
}
```

### Integration Rules
1.  **Parallelism:** Adding multiple questions to a single request does not significantly increase latency. Jev uses a parallel sampler to evaluate the state across the entire question map simultaneously.
2.  **Speculative Execution:** Architects should "over-ask." Request every question the code *might* need for any branch. Because output is free and parallel, it is more efficient to ignore an answer in code than to make a secondary serial API call.
3.  **Typed SDKs:** Use the Python or JavaScript SDKs to enforce type-safety during question construction. This eliminates the need for brittle regex parsing or JSON-mode hacks required by traditional LLMs.

---

## 4. Expert Domain Chunking: How Practitioners Categorize Use Cases

> **Architect's Rule of Thumb:** Jev is for the **Decision Layer** (branching logic), while LLMs are for the **Narrator Layer** (language generation). Jev determines *if* a process should run; an LLM determines *how* to explain the result to a human.

### Confidence-Gated Routing: Act vs. Escalate
A core pattern is the "Confidence Gate," where the model's uncertainty dictates the code path. Practitioners determine a threshold ($\tau$) based on the **risk-reward profiling** of the specific business action:
*   **If $p \ge \tau$:** **Act** (e.g., auto-approve the refund).
*   **Else ($p < \tau$):** **Escalate** (e.g., send to a human for review or a high-reasoning LLM like GPT-6 for deeper analysis).

### Schema-as-Product
TypeSafe’s "Zero Hallucination" claim is a **structural guarantee**. Because Jev is mathematically restricted to the provided primitives, it cannot invent a value outside your defined schema. This is an **Output Shape Guarantee**, not an accuracy guarantee. Accuracy is managed via RLCD and confidence thresholds.

### Decomposition vs. Monolithic Prompting
Senior Architects avoid asking monolithic questions like "Is this spam?". Instead, they decompose judgments into "atomic questions" that provide signals. These signals are then recombined in code via **weighted sums or deterministic rules**.
*   *Example:* `Spam_Risk = (0.45 * credentials_check) + (0.30 * identity_mismatch) + (0.25 * urgency_check)`.

---

## 5. Implementation Playbook and Active Practice Targets

### Playbook: Designing the "Support Ticket Triple"
Follow these steps to implement a triage layer for support automation:
1.  **Step 1: Define Choice Labels:** Create a `department` question. Use distinct, contrastive labels (e.g., `billing`, `tech`, `returns`). If options are similar, use an object to define `what` it covers vs `not_for` to separate guidance.
2.  **Step 2: Calibrate the Score Scale:** Define a `severity` scale (0–5). Assign explicit meanings to levels (e.g., `5 = System Down`, `1 = UI cosmetic issue`) to anchor the model’s judgment.
3.  **Step 3: Establish the Noul Truth-Check:** Create an `escalate` question using a statement: "This ticket contains hostile language or threats to churn."
4.  **Step 4: Integrate Logic:** In code, define your $\tau$. If `escalate.noul > 0.8`, route to a Senior Agent immediately, regardless of other scores.

### Reference Patterns
*   **Speculative Fan-out:** Asking dozens of questions about a state simultaneously to cover every possible code path at ~100ms speeds.
*   **Intent Routing:** Using a high-cardinality `Choice` (up to 255 options) to route an agent's next action without the latency of a planning LLM.

### Expert Examples
*   **Doom:** Demonstrates real-time reflex logic. Jev makes move/shoot decisions based on structured game state (enemy coordinates, health) rather than pixels.
*   **Wikiracing:** Showcases handling high-cardinality links. Jev navigates Wikipedia by choosing from hundreds of real links without the "hallucination" of non-existent URLs common in LLMs.

---

## 6. Critical Limitations and Known Gaps

### The Trap Sheet

| Trap | Root Cause | Fix |
| :--- | :--- | :--- |
| **Chatbot Usage** | Attempting to generate prose. | Use Jev for the numbers; use an LLM to "Narrate" the decision. |
| **Over-reliance** | Treating a single 0.9 as a truth guarantee. | Implement **risk-reward thresholds ($\tau$)** with selective escalation paths. |
| **Multimodal Attempt** | Inputting images or audio. | Jev is **text-only** (Strings/JSON/Arrays) today. |
| **Kahneman Confusion** | Assuming "System One" means "Error Prone." | Use RLCD's **calibrated honesty** to detect when the model is likely to be wrong. |

### Official Silence Markers
Architects should note the following areas where TypeSafe documentation and sources remain silent:
*   **Independent Benchmarking:** Claims of 193x speed and 444x cost advantages are **vendor-reported** based on TypeSafe’s own "Workflow Evals." Independent replication is currently unavailable.
*   **RLCD Methodology:** While calibration is a known academic concept, the proprietary RLCD training method remains a **"black box"** with no peer-reviewed papers published.
*   **Future Modalities:** There is no official timeline or roadmap for image, audio, or video input support.
*   **Deployment:** Sources are silent on local or on-premise deployment; the system is currently **hosted-only** via the TypeSafe API.