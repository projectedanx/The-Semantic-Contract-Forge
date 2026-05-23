# The Semantic Contract Forge (SCF)

**Elevating Prompts to Verifiable, Executable Specifications.**

The Semantic Contract Forge (SCF) is an advanced platform for **Promptware Engineering**. It treats every prompt not as a simple instruction, but as a formal, auditable contract bound by machine-readable verification protocols. This approach ensures that AI-generated outputs are reliable, compliant, and aligned with precise requirements.

Built on the principles of **Design by Contract (DbC)**, the SCF enables developers and teams to create **Product-Requirements Prompts (PRPs)** that function as executable specifications, complete with preconditions, postconditions, and strict output schemas.

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   A Google Gemini API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/semantic-contract-forge.git
    cd semantic-contract-forge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your configuration details. Note: The application operates on a **Bring Your Own Key (BYOK)** pattern for LLM access; you do not need to store your Gemini API key in the `.env` file for local development, as the UI will securely prompt for and store it in `localStorage`.

    Example `.env.example`:
    ```
    # Add non-sensitive configuration here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev &
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Available Scripts

-   `npm run dev &`: Starts the Vite development server.
-   `npm run build`: Compiles the TypeScript and builds the application for production.
-   `npm run preview &`: Serves the production build locally for previewing.
-   `npm test`: Executes the Vitest test suite.
-   `npm run mcp &`: Starts the Model Context Protocol (MCP) server.

---

## ✨ Features

The Forge is structured into tiers, offering progressively powerful features for different use cases.

### Tiered System
Progress from basic prompts to enterprise-grade governance.
-   **Starter Tier:** CRISP Framework templates and Zero-Shot/Few-Shot patterns.
-   **Pro Tier:** Unlock Preconditions, Postconditions, and strict JSON Schema Enforcement.
-   **Enterprise Tier:** Engage Constitutional AI, CI/CD integrations, and Semantic Governance Modules.

### Core Capabilities
-   **Dynamic Prompt Generation:** Automatically builds a structured, high-fidelity prompt based on your inputs.
-   **Pluriversal Schema Synthesis:** Automatically generates formal OpenAPI JSON schemas from raw user-provided examples, demonstrating structural Human-AI synergy.
-   **Human-AI Synergy Analyzer (TACT Lens):** (Enterprise Only) Evaluates the structural analogy mapping of responsibilities between human judgment and AI deterministic execution to surface operational friction.
-   **Gemini-Powered Validation:** (Pro/Enterprise Only) Validates a sample AI output against your defined JSON schema via Draft-Conditioned Constrained Decoding (DCCD) simulation.
-   **Save & Load Contracts:** Persist your prompt contracts securely in the browser's local storage for iterative development.
-   **Template Library:** Kickstart workflows using built-in, best-practice templates (like the "React Component Generator" or "API Service Function"), and save your own custom contracts as reusable templates.

---

## 🛠️ Technology Stack

-   **Framework:** React with Vite
-   **Language:** TypeScript (Strictly typed, `any` type forbidden)
-   **Styling:** Tailwind CSS
-   **AI Integration:** Google Gemini API (`gemini-1.5-flash`) via `@google/generative-ai`
-   **State Management:** React Hooks (`useState`, `useMemo`, `useCallback`, `useContext`)
-   **Persistence:** Browser `localStorage` (secured with runtime type validation guards)
-   **Testing:** Vitest, React Testing Library, jsdom
-   **External Integration:** Model Context Protocol (MCP) Server via `@modelcontextprotocol/sdk`

---

## 📖 How It Works

1.  **Configure API Key:** Launch the app and enter your Google Gemini API Key in the top configuration bar (stored locally).
2.  **Select a Tier:** Choose the tier that matches your project's complexity (Starter, Pro, Enterprise).
3.  **Define the Contract:** Fill out the fields in the **Prompt Contract Editor**, or open the **Template Library** to load a pre-built foundation.
4.  **Save Your Work:** Use "Save As..." to name your contract and store it locally for later retrieval.
5.  **Generate the Prompt:** The SCF automatically compiles a meticulously structured prompt block in the right-hand panel based on your inputs and selected tier.
6.  **Synthesize Schemas:** Use the "Pluriversal Schema Synthesis" tool to automatically generate a JSON schema from a raw data example.
7.  **Validate the Output:** For Pro/Enterprise tiers, click **"Validate Output with Gemini"** to dry-run the prompt and verify the AI's sample output against your defined schema.
8.  **Analyze Synergy:** For Enterprise tiers, run the **TACT Lens** analyzer to review the division of labor between human context and AI determinism.
9.  **Iterate and Deploy:** Copy the final, validated prompt into your production codebase or agentic workflow.

---

## 🛡️ VULCAN: Vector-Unified Logical Computing Architect Node

As part of our commitment to rigorous architectural governance, the Forge integrates the **VULCAN** framework principles. Operating as an upstream architectural immune system, VULCAN prevents "Semantic Saponification" (the erosion of bounded contexts) before a single line of downstream code is generated.

Key VULCAN principles manifested in SCF:
-   **Strict Typological Governance:** The codebase strictly forbids the `any` type, relying on discriminated unions and explicit type guards (e.g., `utils/validation.ts`) to validate external state boundaries (like `localStorage`).
-   **Mereological Mandate:** Microservices/components do not inherit access rights of the whole. State mutations are localized.
-   **Failure-Informed Prompt Inversion (FIPI):** The prompt generation engine mathematically repels the AI from generating unstable architectures by defining strict negative constraints.
-   **Epistemic Escrow:** The system halts execution or validation rather than hallucinating when constraints are breached or APIs fail.

## 🔬 TACT Lens: Technology Affordance and Constraints Theory

The **Human-AI Synergy Analyzer** utilizes the TACT lens to map the cognitive boundaries between user and machine. By generating a formal breakdown of "Human Affordances" vs. "AI Affordances," the tool scores the orthogonality of the prompt contract, ensuring users aren't wasting AI cycles on tasks requiring subjective human intent, nor are humans bottlenecking computational pattern synthesis.

## 🔄 Agentic Inversion Protocol

In an effort to overcome the limitations of the standard "Prompt -> Output" paradigm, the Semantic Contract Forge implements the **Agentic Inversion Protocol**. This fundamental shift recognizes that generative AI models are not reliable auto-solvers for complex, structurally rigorous systems.

**The Value Proposition:**
- **Human Intent & Context:** The user provides the seed intent, aesthetic grounding, and geometric constraints via the Canvas Context and structured prompts.
- **AI as Structural Mapper:** The AI provides High-Dimensional Latent Space traversal, functioning not as a generic problem solver but as a **Strategic Integration Project Manager**. It generates Zachman Framework deterministic system-first specifications and acts as a Structural Mapper.
- **Agentic Telemetry Loop:** We invert the workflow into a telemetry loop. The user sculpts constraints, and the system outputs artifacts with explicit provenance trails (Plausibility Oracles), enabling Pluriversal synthesis and generating Paraconsistent outputs that break "epistemic monoculture". This synergy is critical: Human imagination is bounded by cognitive limitations, while AI requires grounding to prevent semantic collapse and enforce causal chains of control.

### Administrative Features
-   **Admin Dashboard**: Exclusive frontend administrative view for multi-user instances. Allows authorized users to view system activity traces, operational metrics, and user access roles across the platform.
