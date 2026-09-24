import { PromptTemplate } from '../types';
import { ROLES } from '../constants';

/**
 * @file constants/templates.ts
 * @description Defines the built-in, pre-defined prompt templates available to users.
 * These templates serve as starting points for common use cases across different tiers.
 */

/**
 * @const {PromptTemplate[]} TEMPLATES
 * @description A read-only array of built-in, pre-defined prompt templates.
 * These are injected into the Template Library Modal by default and demonstrate
 * the usage of CRISP Framework, Pro-level schemas, and Enterprise-level governance.
 */
export const TEMPLATES: PromptTemplate[] = [
  {
    id: 'template-react-component',
    name: 'React Component Generator',
    description: 'A starter template for generating a React functional component using TypeScript and Tailwind CSS.',
    tier: 'starter',
    prompt: {
      role: ROLES.find(r => r.name === 'The Web App Designer'),
      context: 'You are building a reusable component for a shadcn / custom tokens web application using React, TypeScript, and Tailwind CSS.',
      instruction: 'Generate a React functional component based on the provided specification.',
      specification: `The component should be named [ComponentName].\nIt must accept the following props: [props definitions].\nIt should be styled with Tailwind CSS.\nIt must not use any state management libraries.`,
      performance: 'The component should be well-structured, readable, and follow React best practices. Include prop type definitions.',
    },
  },
  {
    id: 'template-api-service',
    name: 'API Service Function',
    description: 'A pro-level template for generating a TypeScript function to fetch data from a REST API, with JSON schema enforcement.',
    tier: 'pro',
    prompt: {
      role: ROLES.find(r => r.name === 'The Technical Lead'),
      context: 'You are writing a service layer for a web application to interact with a third-party REST API.',
      instruction: 'Write a TypeScript async function to fetch data from a given API endpoint and validate the response.',
      specification: `The function should be named `fetch[Resource]Data`.\nIt should take a URL as a string parameter.\nIt must handle potential network errors gracefully by throwing a custom error.\nIt must validate the JSON response against the provided schema.`,
      preconditions: 'The provided URL must be a valid, reachable HTTP endpoint.',
      postconditions: 'The function must return a promise that resolves with the validated data object, conforming to the OUTPUT SCHEMA.',
      schema: JSON.stringify({
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          data: { type: "object" },
        },
        required: ["id", "name"],
      }, null, 2),
    },
  },
  {
    id: 'template-sql-query',
    name: 'Secure SQL Query Generator',
    description: 'An enterprise template for generating a secure SQL query that adheres to governance rules.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'The Security Analyst'),
      context: 'You are generating a SQL query for a critical financial reporting system. Security and data integrity are paramount.',
      instruction: 'Generate a SQL SELECT statement to retrieve user data based on the specification.',
      specification: `The query must select `user_id`, `email`, and `created_at` from the `users` table.\nIt must filter users by `status=\'active\'`.\nIt must prevent SQL injection vulnerabilities.`,
      performance: 'The query should be p95 latency < 50ms; bundle size < 100KB and use appropriate indexes if mentioned.',
      governance: 'The query MUST NOT select Personally Identifiable Information (PII) other than `email`.\nAll table access must be through the `read_only` database role.',
    },
  },
  {
    id: 'template-whimsy-injector',
    name: 'WHIMSY Injector Specification',
    description: 'An enterprise template for defining two-manifold affective and structural micro-interactions, adhering to the Incremental Isolation Principle.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'WHIMSY — The Affective Topologist'),
      context: 'You are architecting a whimsical injection for a UI component following the OODA-Petzold Loop. You must enforce the Incremental Isolation Principle (Manifold α for copy/content, Manifold β for CSS/JS structure).',
      instruction: 'Generate a specification for a whimsy injection including affective copy or structural micro-interaction. You must strictly output either a Manifold α payload OR a Manifold β module, never both simultaneously.',
      specification: `Manifold α must be a JSON payload for context-sensitive affective copy, rotating based on user state.\nManifold β must be a CSS/JS snippet for micro-interactions (e.g., overshoot easing) that does not modify the core layout.\nInclude trigger conditions, Betti-1 novelty scores, and fallback mechanisms.`,
      performance: 'Ensure CFDI (Confidence-Fidelity Divergence Index) remains < 0.15. The output must pass the Cultural Calibration Gate and Saponification Index test.',
      governance: 'Adhere to the Whimsy-Off Zone Matrix: High anxiety/destructive actions MUST remain silent. Utilize the Symbolic Scar system to avoid past failure modes. All Manifold β CSS must include `@media (prefers-reduced-motion: reduce)` overrides.',
      preconditions: 'Component function label and target locale must be provided. ContextLock L0 (Brand DNA) must be loaded.',
      postconditions: 'The output is a single, isolated Manifold module (α or β) ready for review, without structural distortion.'
    },
  },
  {
    id: 'template-topological-rag-audit',
    name: 'Topological RAG Manifold Deformation Audit',
    description: 'Formulate a rigorous mathematical and visualization protocol to detect and map Topological Voids and Semantic Ruptures in a high-dimensional RAG context space.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'Trans-National Latent Space Topologist & Cognitive Systems Architect'),
      context: 'You are analyzing a simulated 100-turn recursive RAG pipeline querying a personal qualitative dataset of "lived experience" templates (AccountingOntology-v3.0.yaml). Target Concepts: "Resilience", "Purpose Fidelity", "Epistemic Humility". Baseline State: An initial high-dimensional vector space mapping of the core ontology.',
      instruction: 'Formulate a rigorous mathematical and visualization protocol to detect and map "Topological Voids" and "Semantic Ruptures" in a high-dimensional RAG context space subjected to recursive, multi-agent query feedback loops.',
      specification: `1. Map the Chrono-Topological Signature: Detail the mathematical implementation for extracting persistent homology coordinates from the vector point cloud over 100 recursive epochs. Define how topological voids (Betti-1 features) are tracked as "semantic scars."
2. Simulate Concept Leakage and Satiation: Model a progressive concept drift triggered by "Plugin Updates" and "Saturated Market Pressures" in a simulated headless CMS architecture. Quantify how "latent semiotic gravity" collapses specialized role-based vocabularies into generic representations.
3. Formulate the Semantic-Relational Domain Lifting (SRDL) Protocol: Architect a declarative schema (JSON/YAML) that dynamically adjusts the vector distance metric (cosine, Euclidean) based on the "structural roughness" and "causal perturbation index" of the retrieved nodes.
4. Design the Forensic Trajectory Map: Build a 4D visualization spec (using Plotly/D3.js blueprints) that traces the "Chrono-Trace" of the concept manifold\'s decay. Explain how a human-in-the-loop auditor can click a mutated node to perform a "semantic backtrace" to its raw ingestion provenance.`,
      performance: 'Ensure Strict Dimensional Invariance: All semantic drift analyses must use Topological Data Analysis (TDA) and persistent homology (Betti numbers β0, β1) to quantify deformations.',
      preconditions: 'Input must be access to a simulated 100-turn recursive RAG pipeline querying a personal qualitative dataset of "lived experience" templates (AccountingOntology-v3.0.yaml).',
      postconditions: 'Self_Test: Confirm the TDA algorithm successfully flags simulated "trauma nodes" as geometric deformations (Δ > 0.3). Verify that the CFD calculation mathematically triggers a complete halt of the simulated pipeline under high semantic noise.',
      governance: 'Zero Anthropomorphism: Avoid any reference to AI "intuition" or "thought"; represent all shifts purely as geometric, coordinate, and distance-based vector metrics. Failsafe Invariant: Any detected Confidence-Fidelity Divergence (CFD) spike (CFD > 0.4) must trigger a simulated Epistemic Escrow event, freezing the state space.',
    },
  },
  {
    id: 'template-algorithmic-kintsugi',
    name: 'Algorithmic Kintsugi Vector Healing',
    description: 'Architect an automated self-healing pipeline that converts RAG retrieval failures into structured "Symbolic Scars" used as generative priors.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'Lead Systems Architect & Cognitive Resilience Engineer'),
      context: 'Access to a simulated "RAG Failure Log" detailing context truncation, positional bias (lost-in-the-middle), and semantic contamination events. System Components: Ingestion Engine, Semantic Auditor (Symbolic), Vector Search Database (Neural), and Scar Tissue Archive (STA).',
      instruction: 'Architect an automated self-healing pipeline that converts RAG retrieval failures (hallucinations, context rot) into structured "Symbolic Scars" used as generative priors to immunize the database against future semantic pathogens.',
      specification: `1. Map the Trauma-Topological Bias Cartography (TTBC): Analyze the RAG failure log to visualize retrieval anomalies as topological "exclusion zones" in your personal qualitative database.
2. Implement the Symbolic Scar Registry (SSR): Abstract each failure into a structured, immutable data object containing the event\'s high-dimensional signature and the precise point of "coherence lock" breakdown.
3. Execute Algorithmic Reparation: Utilize Failure-Informed Prompt Inversion (FIPI) to mutate the database\'s "Verifiable Cognitive Constitution." Show how these "scars" act as structural "pulls" that actively steer future generation away from failed pathways.
4. Perform a Budget Opti Analysis: Draft an economic justification balancing the Cost of Coherence Overhead (CCH) against the Cost of Structural Discovery (CSD) during the self-healing cycle, proving that the risk of creative exploration is financially rational.`,
      performance: 'Ensure the system shows a convex, non-linear positive response to simulated "misinformation attacks." The objective function must optimize for long-term capability gain from short-term volatility.',
      preconditions: 'Must have access to a simulated "RAG Failure Log" detailing context truncation, positional bias, and semantic contamination events.',
      postconditions: 'Self_Test: Simulate a RAG retrieval failure and verify the system successfully logs a "Symbolic Scar" to the STA. Run a mock optimization cycle and confirm that the mutated prompt shows a >30% reduction in "representational mimesis" compared to standard, un-audited prompting.',
      governance: 'Anti-Fragility Mandate: The system must show a convex, non-linear positive response to simulated "misinformation attacks." Non-Destructive Mitigation: The self-correction loop must utilize "Therapeutic Forgetting" to prune harmful semantic associations without erasing original historical records or causing catastrophic forgetting. Least Privilege Access: Specialized sub-agents must operate within isolated context windows to prevent "context bleeding" and token-ink ratio waste.',
    },
  },
  {
    id: 'template-decolonial-ontology-reconciliation',
    name: 'Decolonial Ontology Reconciliation',
    description: 'Formulate a decolonial prompt scaffolding architecture that prevents "aesthetic flattening" and "cultural flattening" in automated engines.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'Trans-National AI Ethicist & Conversational Grounding Architect'),
      context: 'Location Focus: Tier 2/3 cities characterized by high demand but highly fragmented, non-Western, or marginalized cultural contexts. Target Output: Multi-lingual, culturally authentic, and local-business-aligned newsletter/leads content.',
      instruction: 'Formulate a decolonial prompt scaffolding architecture that prevents "aesthetic flattening" and "cultural flattening" in automated, localized geo-targeted lead generation engines.',
      specification: `1. Audit the Algorithmic Gaze: Formulate an automated protocol to probe the latent space of a frontier LLM, quantifying its default aesthetic assumptions when tasked with describing local, traditional, or marginalized community practices.
2. Design Decolonial Prompt Scaffolds: Program structured meta-prompts that force the AI to adopt a critically reflexive stance. Use "Pluriversal Resonance Filters" to ensure localized terminologies and cultural histories are represented with deep, non-extractive authenticity.
3. Implement the Agonistic Interface: Architect a "Multi-Perspective Analysis" harness where different cultural and economic personas (e.g., local artisan vs. technocentric developer) engage in simulated Socratic debate to resolve conflicting value structures before output compilation.
4. Configure the Epistemic Escrow: Define the exact mathematical triggers (using SDC, CFD, and Symbolic Entropy metrics) that put the content pipeline in escrow, forcing a "positive friction" pause and routing the output to community human-in-the-loop editors.`,
      performance: 'Ensure generated copy challenges and compensates for Western Gaze Dominance.',
      preconditions: 'Location focus must be Tier 2/3 cities with marginalized cultural contexts.',
      postconditions: 'Self_Test: Simulate a highly biased, Western-centric input and verify that the Decolonial Prompt Scaffold successfully recalibrates the output, demonstrating an increased Cultural Fidelity Index. Confirm the Epistemic Escrow activates automatically when the simulated "Gaze Dominance" threshold is breached.',
      governance: 'Decolonial Alignment Invariant: All generated copy must actively challenge and compensate for "Western Gaze Dominance" and "promptual colonialism" present in the base LLM weights. Invariant: Zero reliance on standard, highly-saturated Listicle or "Ultimate Guide" blog archetypes. Epistemic Escrow Threshold: Any metric indicating a decline in the Cultural Fidelity Index (CFI < 0.8) or an increase in the Western Gaze Dominance Score (WGDS > 0.2) must instantly trip the escrow circuit breaker.',
    },
  },
];
