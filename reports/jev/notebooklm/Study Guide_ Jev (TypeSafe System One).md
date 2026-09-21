# Study Guide: Jev (TypeSafe System One)

This study guide provides a comprehensive overview of **Jev**, the flagship **System One** model developed by **TypeSafe AI**. It is designed to move learners from foundational vocabulary to architectural application, focusing on the transition from text-generating LLMs to typed, probabilistic decision-making software.

---

## Core Concepts and Architecture

### What is Jev?
Jev is a "System One" model—a class of frontier AI designed for fast, structured decisions rather than chat. It functions as a frontier-intelligence **function call**: it takes unstructured program state as input and returns typed probabilistic decisions that software can branch on directly.

### The System One Metaphor
Named after Daniel Kahneman’s work in *Thinking, Fast and Slow*, System One refers to fast, intuitive, and reflexive judgments. In the context of TypeSafe AI, it contrasts with "System Two" reasoning (handled by traditional LLMs), which is slower and more deliberate. Jev provides a "reflex layer" for software.

### The Three Primitives
Jev evaluates information through three core question types, or primitives:

1.  **Choice**: Selecting one option from a defined set (up to 255 options). It returns the selected choice, a probability distribution for all options, and a confidence score.
2.  **Score**: Placing an input on an ordered scale with described levels (e.g., severity 0-4).
3.  **Noul**: A "Yes/No" or statement truth evaluation that returns a probability in the range of [0, 1].

---

## System One vs. Large Language Models (LLMs)

| Feature | LLM (System Two-ish) | System One (Jev) |
| :--- | :--- | :--- |
| **Output Type** | Autoregressive text (strings) | Parallel typed answers/probabilities |
| **Logic Mode** | Open-ended reasoning/narration | Bounded, structured decisions |
| **Speed** | Seconds to minutes | 70ms – 500ms |
| **Cost** | High (Input + Output tokens) | Low ($42/B input tokens; Output is FREE) |
| **Hallucination** | Risk of "free-text" invention | Schema-bound (cannot invent new types) |
| **Architecture** | Sequential token generation | Parallel question evaluation |

---

## Mental Models for Implementation

*   **Decision Layer, Not Narrator**: Jev should not be used to write emails or code. It is used to decide *which* email to send or *whether* code is safe to run.
*   **Confidence Gating**: Implementation follows a specific logic: `State → Jev → Probability → Threshold Check`. If confidence is high, automate; if low, escalate to a human or a System Two LLM.
*   **Schema is the Product**: Because Jev is bound by the schema, the quality of decisions depends on the clarity of option labels and descriptions.
*   **Calibration ≠ Correctness**: A 0.9 probability means the model is epistemically honest across many trials (90% of such cases should be true), not that the individual answer is guaranteed to be correct.

---

## Short-Answer Practice Quiz

**1. What is the primary difference between how an LLM generates an answer and how Jev generates an answer?**
LLMs are autoregressive, generating one token at a time conditioned on the previous one. Jev uses a parallel sampler to generate all typed outputs in a single, hardware-aware query, returning a full probability distribution across defined options.

**2. Define the "Noul" primitive and explain what it returns.**
A Noul is a primitive used for Yes/No questions or determining the truth of a statement. It returns a probability between 0 and 1, representing the likelihood that the statement is true based on the provided state.

**3. Why is Jev described as "hallucination-free" in the context of type safety?**
Jev is "schema-safe" by construction. Because possible outputs are defined in advance as part of the question's criteria, it is mathematically impossible for the model to return a type error or an option that does not exist within the defined schema.

**4. What are the three specific data types Jev can currently evaluate as input "state"?**
Jev currently accepts text-only inputs, specifically strings, JSON objects, and arrays of text. It does not yet support multimodal inputs like images, audio, or video.

**5. How does the "Confidence Gate" mental model affect software workflow design?**
The confidence gate allows developers to set a threshold (e.g., 0.85). If Jev's confidence in a decision meets that threshold, the software executes the action automatically. If it falls below, the software "escalates," routing the task to a human reviewer or a more expensive reasoning model.

**6. Describe the cost structure of Jev compared to traditional frontier LLMs.**
Jev is significantly cheaper, priced at approximately $42 per billion input tokens. Unlike LLMs, which charge a premium for output tokens, Jev's output tokens are provided for free ("too cheap to meter").

**7. In a support ticket routing scenario, why is it considered "good practice" to ask multiple questions in one call?**
Questions are evaluated in parallel and adding extra questions barely changes response time. Asking for the department, severity, and urgency in one round trip is more efficient and cost-effective than making three serial requests.

**8. What does "Calibration" mean in the context of Reinforcement Learning for Calibrated Decisions (RLCD)?**
Calibration means the model’s predicted probabilities align with observed frequencies over time. For example, across all instances where the model claims 90% confidence, it should be correct approximately 90% of the time. It is a measure of epistemic honesty, not a guarantee of single-call truth.

**9. When should a developer use a "Score" primitive instead of a "Choice" primitive?**
A developer should use a Score when the answer represents a position on a continuous or ordered spectrum (e.g., a scale of 0 to 4 for frustration). Choice is used for selecting one distinct, non-ordered label from a set (e.g., routing to "Billing" vs. "Technical Support").

**10. Name one specific scenario where Jev should NOT be used.**
Jev should not be used for any task requiring the generation of free-form text, such as writing a customer reply, producing a project plan, or explaining the reasoning behind a decision. It is a decision layer, not a narrator.

---

## Essay Prompts for Deeper Exploration

1.  **The Automation Gap**: Discuss Diogo Almeida’s thesis regarding the "automation gap" in current AI. How does the transition from "human-preference" training (RLHF) to "calibrated decision" training (RLCD) address the requirements of autonomous software systems?
2.  **Architectural Decomposition**: Explain the principle of "Decomposing the Questions." Why is it architecturally superior to ask ten narrow, atomic questions rather than one broad, "reasoning" question? Use a spam-detection or security-filtering example to illustrate your points.
3.  **The Reflex Layer in Agentic Systems**: Analyze Jev’s role as a "reflex layer" in computer-use agents (e.g., the Doom or Browser Use demos). How does offloading low-level tactical decisions to a System One model improve the performance and reliability of high-level System Two planners?
4.  **Economic Impacts of Jevons Paradox**: TypeSafe AI named their model after William Stanley Jevons. Explore the economic argument that making intelligence "too cheap to meter" will lead to a massive increase in demand for AI-powered "smart if-statements" within traditional software.
5.  **Schema-Driven Engineering**: Traditional software relies on deterministic rules. System One introduces "programmable common sense." Argue for or against the idea that the primary job of a future software engineer will be "schema design" rather than "logic branching."

---

## Glossary of Important Terms

*   **Calibration**: The alignment between a model's predicted probability and the actual frequency of correct outcomes.
*   **Choice**: A primitive used to select one option from a fixed set of labeled categories.
*   **Confidence**: A value from 0 to 1 derived from the spread of the probability distribution; high confidence indicates a single clear peak in probability.
*   **Jev**: TypeSafe AI’s flagship System One model, optimized for speed, cost, and structured output.
*   **Noul**: A primitive for Boolean (Yes/No) or truth-statement questions; returns a probability of truth.
*   **Parallel Sampling**: A hardware-aware methodology that generates all outputs for multiple questions in a single query rather than one token at a time.
*   **RLCD (Reinforcement Learning for Calibrated Decisions)**: A training method that optimizes models to provide epistemically honest probabilities rather than just human-preferred text.
*   **Score**: A primitive used to evaluate an input against an ordered scale with defined levels.
*   **State**: The unstructured input (text or JSON) provided to the model for evaluation.
*   **System One**: A class of AI models built for fast, intuitive, and structured decision-making, as opposed to slow, generative reasoning.
*   **TypeSafe AI**: The company (typesafe.ai) founded by Diogo Almeida that developed the System One model architecture.
*   **Zero Hallucination**: A marketing and technical claim referring specifically to the fact that System One models cannot return an output that violates the provided schema or type definition.