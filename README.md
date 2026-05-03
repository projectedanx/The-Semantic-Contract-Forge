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
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    ```
    *Note: The application uses Vite, which automatically loads environment variables from `.env` files.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Compiles the TypeScript and builds the application for production.
-   `npm run lint`: Lints the codebase for potential errors.
-   `npm run preview`: Serves the production build locally for previewing.

---

## ✨ Features

The Forge is structured into tiers, offering progressively powerful features for different use cases.

### Core Features
-   **WHIMSY — The Affective Topologist:** An enterprise-tier template (WHIMSY Injector Specification) that uses the Petzold Loop to inject measurable delight and brand-sovereign personality into digital components. It strictly enforces the Incremental Isolation Principle, outputting either a Manifold α payload (copy/content) OR a Manifold β module (CSS/JS structure), never both simultaneously. This prevents the "projection tax" while maintaining low Confidence-Fidelity Divergence Index (CFDI) values.

-   **Tiered System:** Progress from basic prompts to enterprise-grade governance.
    -   **Starter Tier:** CRISP Framework templates.
    -   **Pro Tier:** Pre/Postconditions and JSON Schema Enforcement.
    -   **Enterprise Tier:** Constitutional AI and governance constraints.
-   **Dynamic Prompt Generation:** Automatically builds a structured, high-fidelity prompt based on your inputs.
-   **Pluriversal Schema Synthesis:** Automatically generate formal OpenAPI JSON schemas from raw user-provided examples, demonstrating structural Human-AI synergy.
-   **Gemini-Powered Validation:** For Pro and Enterprise tiers, validates a sample AI output against your defined JSON schema.
-   **Save & Load Contracts:** Persist your prompt contracts in the browser's local storage for later use.
-   **Template Library:** Kickstart your work by loading pre-defined, best-practice templates. You can also save your own contracts as custom templates.

### Error Handling & Stability

-   **Global Error Boundary:** The application is wrapped in an error boundary, preventing crashes from unhandled errors and providing a user-friendly recovery screen.
-   **Centralized Logging:** A unified logging service captures structured error information for easier debugging.
-   **User-Facing Toasts:** Non-critical errors (e.g., API failures) are communicated to the user via non-intrusive toast notifications.

---

## 🛠️ Technology Stack

-   **Framework:** React with Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
-   **State Management:** React Hooks (`useState`, `useMemo`, `useCallback`, `useContext`)
-   **Persistence:** Browser Local Storage

---

## 📖 How It Works

1.  **Select a Tier:** Choose the tier that matches your project's complexity.
2.  **Define the Contract:** Fill out the fields in the **Prompt Contract Editor**, or select a pre-built template from the **Template Library**.
3.  **Save Your Work:** Use the "Save As..." button to name your contract and store it locally. You can create new contracts or load existing ones from the dropdown.
4.  **Generate the Prompt:** The SCF automatically assembles a meticulously structured prompt based on your inputs.
5.  **Validate the Output:** For Pro/Enterprise tiers, use the **"Validate Output with Gemini"** feature to verify the AI's sample output against your defined JSON schema.
6.  **Iterate and Deploy:** Use the validated, high-fidelity prompt in your applications.

---

## 核心概念 (Core Concepts)

-   **Product-Requirements Prompt (PRP):** A highly-structured prompt that serves as an executable specification for an AI's task, detailing not just *what* to do, but the *conditions* and *constraints* under which it must operate.
-   **Design by Contract (DbC):** A software design methodology that uses preconditions, postconditions, and invariants to ensure code correctness. SCF applies this principle to prompt engineering.
-   **Semantic Integrity Constraints (SICs):** Rules embedded within a prompt that mandate adherence to specific standards, such as using only approved UI components or following a coding style guide.
## New Feature: Human-AI Synergy Analyzer (TACT Lens)
The platform now includes an Enterprise-tier feature that applies the Technology Affordance and Constraints Theory (TACT). It analyzes the prompt contract to evaluate the structural analogy mapping of responsibilities between human judgment and AI deterministic execution. This helps identify where neither can operate alone and surfaces operational friction and constraints.

---

## 🔬 Advanced Research: Project Aurelius (Meta-Architect Intelligence)

The Semantic Contract Forge serves as the foundation for **Project Aurelius**, an experimental initiative aimed at bridging the causal intent gap in generative AI, specifically regarding non-Euclidean spatial reasoning.

While current diffusion models rely on visual correlations (the "statistical smudge"), Project Aurelius seeks to invert this paradigm. By encoding explicit geometric and physical rules (e.g., manifold topologies, Gaussian curvature) as **Semantic Integrity Constraints (SICs)** within prompt contracts, we force the AI to act as a deterministic geometry engine rather than a mere image generator.

This initiative also explores an **Agentic Auto-Optimization** loop (a "Plausibility Oracle") to provide continuous feedback on physical realism, and advanced material specifications targeting cross-modal perceptual fusion. For details, see the `project_aurelius` directory.
