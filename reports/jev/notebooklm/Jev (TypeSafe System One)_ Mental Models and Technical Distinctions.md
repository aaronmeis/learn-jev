# Jev (TypeSafe System One): Mental Models and Technical Distinctions

### 1. Defining the System One Paradigm

**The Core Definition**
Jev represents a shift from generative text to a "frontier-intelligence function call." Developed by TypeSafe AI, it is the flagship model in the **System One** class—an architectural departure designed to bridge the "automation gap." While traditional Large Language Models (LLMs) optimize for human-centric dialogue, Jev is built for the machine-to-machine boundary, transforming "unstructured state in" to "typed probabilistic decisions out."

**The Decision Layer vs. Narrator Model**
Architecturally, Jev is a **reflex layer**, not a narrator. It lacks the mechanism to write emails, generate code, or provide prose reasoning. It is the "smart if-statement" of the agentic stack. By "giving up" string generation, Jev achieves a Pareto frontier of intelligence-per-dollar that allows it to act as a dependency-chain guard, protecting downstream software from the hallucinations inherent in tool-calling LLMs.

**Naming and Lineage**
The nomenclature reflects both cognitive science and economic theory:
*   **System One:** A class of models inspired by Daniel Kahneman’s "System 1" (fast, intuitive, non-deliberative).
*   **Jev:** The flagship implementation (currently `jev-latest`).
*   **The Jevons Paradox:** The name is a nod to William Stanley Jevons; the underlying thesis is that making intelligence two orders of magnitude cheaper will drive a massive increase in total demand for automated decisions.
*   **Lineage:** Founded by Diogo Almeida (formerly OpenAI RLHF lead), the system is built on the premise that RLHF optimizes for "looking good" to humans, whereas automation requires models optimized for being right.

---

### 2. The Three Primitives: Bounded Answer Spaces

Jev restricts output to three type-safe primitives, ensuring the model never returns a value that violates the developer's schema.

| Primitive | Question Type | Output Shape |
| :--- | :--- | :--- |
| **Choice** | Categorical selection from a defined set. | `choice` (string), `probabilities` (distribution), `confidence` (float). |
| **Score** | Ordered positioning on a described spectrum. | `score` (float), `confidence` (float). |
| **Noul** | Probabilistic truth of a yes/no statement. | `noul` (float [0,1]), representing P(True). |

**Choice Model (Parallel Selection)**
Choice handles selection from sets of up to 255 options. Because Jev cannot invent options, a "None of the Above" or "Other" label is required in the schema to prevent "garbage in, garbage out" results where the model is forced into a false categorization.

**Score Model (Ordered Scales)**
Score maps input to a numerical spectrum (e.g., 0.0 to 2.0). It is optimized for subjective qualities like severity or frustration, where position is more important than category.

**Noul Model (Probabilistic Truth)**
A unique boolean-adjacent type, Noul returns the probability that a statement is true. It is the fundamental building block for intent routing and safety gating.

---

### 3. Key Mental Models for Implementation

**The Confidence Gate (Act vs. Escalate)**
To maintain system reliability, architects should implement the **Selective Classification** pattern. Logic must branch based on the probability ($p$) and the developer-defined threshold ($\tau$):
*   $p \ge \tau \implies \text{Act}$ (Automate the decision)
*   $p < \tau \implies \text{Escalate}$ (Human-in-the-loop or high-reasoning LLM review)

**Calibration ≠ Correctness**
A confidence score of 0.90 is not a "warranty" for a single call; it is a claim of **long-run frequency matching**. In a calibrated system, across 100 cases where the model reports 0.90 confidence, it should be correct exactly 90 times. This distinction is vital for setting risk-aware thresholds.

**Schema-as-Product**
The schema is the primary architectural lever. If option labels are fuzzy or overlapping, the model will split its probability mass, lowering confidence and triggering unnecessary escalations. Precision in the `criteria` field is the "prompt engineering" of System One.

**Hardware-Aware Parallelism**
Unlike LLMs that generate tokens sequentially (autoregressive), Jev utilizes a **Hardware-aware Parallel Sampler**. This allows developers to evaluate dozens of independent, **atomic questions**—such as "Is this spam?", "What is the sentiment?", and "Which department?"—in a single round trip (~100ms) for the same cost as a single question. Decomposing broad judgments into atomic questions is the primary path to efficiency.

---

### 4. Technical Distinctions: System One vs. LLM Agents

| Dimension | LLM (System Two-style) | System One (Jev) |
| :--- | :--- | :--- |
| **Optimization Goal** | Human Preference (RLHF) | Calibrated Decisions (RLCD) |
| **Output Type** | Unstructured Strings / Text | Type-safe Structured Values |
| **Sampling Method** | Sequential (Token-by-token) | **Hardware-aware Parallel Sampler** |
| **Latency** | Seconds to Minutes | 70ms – 500ms |
| **Cost** | High (per I/O token) | **$42/B input; Output is FREE** |

**The "Automation Gap" Thesis**
Diogo Almeida’s thesis posits that LLMs are ill-suited for automation because RLHF optimizes for "preference" (looking good to a human), which encourages overconfidence. System One uses **Reinforcement Learning for Calibrated Decisions (RLCD)** to optimize for "epistemic honesty," providing the reliable, sortable, and composable data needed for autonomous software loops.

---

### 5. Common Failure Modes and Traps

*   **The Chatbot Fallacy:** Attempting to force Jev to generate replies or plans. Jev is a decision engine; if your agent needs to "write," it must hand off the task to a traditional LLM.
*   **The "Zero Hallucination" Misinterpretation:** While Jev provides **Type Safety and Schema Adherence** (it will never return an undefined category), it does not provide **Logical Infallibility**. It can still make the "wrong" choice within the permitted schema.
*   **Schema Overlap:** Defining categories that are not mutually exclusive (e.g., "Billing" and "Refunds"). This leads to split confidence and breaks the automation loop.
*   **Naming Confusion:** Developers frequently confuse **TypeSafe AI** (typesafe.ai) with "Typeface" or the "typescript.ai" domain. Ensure your SDK configurations point to the correct endpoint.
*   **Economic Fallacies:** Vendor claims of 193x speed gains are workload-dependent. Architects must measure speed/cost multiples independently before moving to production.

---

### 6. Limitations and Sourced Silences

**Current Constraints**
*   **Text-only state:** No current support for multi-modal (images/audio/video) inputs.
*   **Cardinality Limits:** Choice primitives are capped at 255 options.
*   **Hosted Service:** No local weights or open-source versions; available only via TypeSafe API or OpenRouter.

**Marked Silences**
*   **Peer Review:** There are currently no peer-reviewed papers regarding the internal RLCD architecture or specific System One weights.
*   **Independent Benchmarks:** Large-scale, third-party replications of the "444x cheaper" and "193x faster" claims are absent from the current source context.
*   **Neuro-scholarship:** Beyond the naming metaphor, sources are silent on the specific academic relationship to Kahneman’s work.