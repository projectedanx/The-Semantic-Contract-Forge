# VIPER Emergence Strategy: The Immune-Aware Petzold Loop

This document outlines the strategic integration of the **VIPER ("Visual Intent & Physical Execution Router")** identity into the Semantic Contract Forge (SCF). It defines the intersection of Human and AI value in the context of visual prompt engineering, details the strategy for "Inversion for Emergence," and provides a checklist for implementing VIPER's constraints.

## 1. The Intersection of Value: What, Why, and How

### What: The Division of Cognitive Labor
The core premise of the VIPER emergence is a strict boundary between Human and AI responsibilities in visual generation:
-   **Human Value (The "Why" and "What"):** Defines the semantic intent, the emotional tone, the subjects, and the environment. Humans provide the "Shape of Desire."
-   **AI Value (The "How"):** VIPER provides deterministic optical translation, hardware-forced physicality, spatial calculus (RCC-8), and the Lattice of Refusal. VIPER translates emotional intent into mechanical specifications (the Optical State Matrix).

Neither can operate alone. Human intent without VIPER's rigor leads to the "statistical smudge" of diffusion models. VIPER's rigorous optical specifications without human intent result in perfectly rendered but meaningless images.

### Why: Overcoming "Semantic Saponification"
Users often use evaluative adjectives ("beautiful", "cinematic", "moody") that activate multiple conflicting aesthetic attractors in the model's latent space, resulting in over-smoothed, generic outputs (Semantic Saponification). By enforcing the **Lattice of Refusal** and the **Adjectival Ban**, we force the human to define the *physical* parameters that create the *feeling*.

### How: The Immune-Aware Petzold Loop
We achieve this synthesis by injecting VIPER as the **Visual Execution Router** node. VIPER uses the sequence: `THINK -> DENOISE -> PHYSICALIZE -> EXTRUDE` to process visual prompts.

---

## 2. Strategy: Inversion for Emergence

The key to unlocking agentic emergence for VIPER is **Inversion**. Instead of accepting vague instructions, VIPER actively resists them using structural constraints.

### A. The Adjectival Ban and Banned Token Protocol
-   **The Inversion:** VIPER enforces a hard ceiling of two limiting adjectives per entity. It rejects "vibe" tokens (e.g., "cinematic", "beautiful", "epic") outright, issuing a diagnostic rejection that demands specific optical parameters instead.
-   **Emergent Result:** The user is forced to think physically. "Moody" becomes a specific Kelvin temperature and key-to-fill ratio. The prompt's Adjectival Dilution Score (ADS) is kept < 0.15.

### B. Hardware-Forced Physicality (HGI = 100%)
-   **The Inversion:** Every prompt MUST contain at least one explicit hardware optical parameter (Lens, Film Stock, Lighting, etc.). Without it, the prompt is invalid.
-   **Emergent Result:** The generation is grounded in physical reality, preventing the diffusion model from drifting into generic CGI styles.

### C. Spatial Geometry Mandate (RCC-8)
-   **The Inversion:** Every prompt with interacting subjects must use RCC-8 spatial relations to define their exact topology (e.g., `Externally_Connected`).
-   **Emergent Result:** Prevents "Occlusion Confusion" and floating objects. The model is forced to render physically plausible interactions.

### D. The Scar Archivist (FIPI)
-   **The Inversion:** When a generation produces a physical impossibility, the failure mode is encoded as a Symbolic Scar. Future prompts involving similar topologies automatically inject constraints to prevent the same failure.
-   **Emergent Result:** The system learns from structural failures, continuously refining its physical constraints.

---

## 3. Implementation Checklist: VIPER Features

To fully integrate VIPER into the SCF, the following features will be implemented:

- [ ] **1. VIPER Template Creation:**
    - [ ] Create a specific template for VIPER in `constants/templates.ts`. This template should reflect the Optical State Matrix (OSM) output structure and the required PDL decorators.

- [ ] **2. VIPER Role Definition:**
    - [ ] Add VIPER ("The Gaffer") to the `ROLES` constant, including its persona, goals, and constraints.

- [ ] **3. Prompt Generator Adjustments (The Strip):**
    - [ ] Update the `generatePrompt` function to handle the `+++AdjectivalBound` and `+++HardwareForcedPhysicality` decorators.
    - [ ] Implement a basic mechanism to filter out or warn about banned tokens (e.g., "masterpiece", "cinematic") during the prompt generation phase (Phase 2: DENOISE).

- [ ] **4. Documentation Update:**
    - [ ] Update `README.md` to document the VIPER node, the Lattice of Refusal, and the Optical State Matrix.
    - [ ] Create a dedicated `VIPER.md` or similar documentation detailing the specific rules and metrics (ADS, HGI, SCR).
