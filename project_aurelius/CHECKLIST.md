# Project Aurelius: Implementation Checklist

This checklist adapts the Meta-Architect Intelligence goals into actionable React/TypeScript engineering tasks within the Semantic Contract Forge (SCF) platform.

## Pre-requisites
- [ ] Ensure all current documentation (README, ROADMAP, LESSONS_LEARNED) is updated with Project Aurelius context.

## Phase 1: Geometric Cognition (Non-Euclidean API Prototype)
*Objective: Build UI and schemas to define spatial contracts.*

- [ ] **Data Model Extension:** Update `types.ts` to include a `GeometricConstraints` interface (e.g., curvature, topology type, coordinate system) as part of the `PromptData` payload.
- [ ] **UI Component:** Create a new React component (`components/GeometricEditor.tsx`) to allow users to input non-Euclidean parameters (e.g., sliders for Gaussian curvature, dropdowns for manifold types).
- [ ] **Schema Synthesis Update:** Modify `SchemaSynthesizer.tsx` to explicitly generate JSON Schema output constraints that force the LLM to return data adhering to the specified geometric rules.
- [ ] **Prompt Generator Update:** Update `utils/promptGenerator.ts` to inject the new `GeometricConstraints` directly into the "preconditions" block of the contract.

## Phase 2: Agentic Auto-Optimization (Plausibility Oracle Prototype)
*Objective: Implement an autonomous feedback loop based on physical validation.*

- [ ] **Validation Service Extension:** Expand `services/geminiService.ts` to include a `validatePlausibility` function. This will act as the mock "Oracle," asking Gemini to critique its own (or another model's) structural/spatial output against physical laws.
- [ ] **Feedback Loop Logic:** Implement a new React hook (`hooks/usePlausibilityLoop.ts`) that handles the iterative process:
    1. Send prompt.
    2. Receive response.
    3. Send response to Oracle for scoring (UIQI/SSIM proxy).
    4. If score < threshold, auto-append Oracle's critique as a new constraint and retry (up to N times).
- [ ] **UI Integration:** Add a "Run Oracle Optimization" button to the `PromptEditor` (Enterprise tier only) that visualizes this multi-step iteration and displays the final "Physical Plausibility Score."
- [ ] **Provenance Trail:** Implement a basic logging mechanism within the loop that records which specific training data biases the Oracle identified and instructed the model to ignore (Attribution Amplification tracking).

## Phase 3: Cross-Modal Perceptual Fusion (Conceptual Framework)
*Objective: Prepare the prompt architecture for advanced rendering specifications.*

- [ ] **Material Specification Update:** Add support in the contract UI for defining materials via "Multispectral Reflectance" profiles rather than simple RGB values.
- [ ] **Quantum Dot Target Flag:** Add a Boolean constraint flag in the prompt structure: `optimize_for_quantum_dot_display`.
- [ ] **Prompt Template:** Create a specific "Hyper-Spectral HDRi" template in `TemplateLibraryModal.tsx` that pre-loads these advanced perceptual requirements.

## Validation & Commit
- [ ] Run test suite (`npm test -- --isolate=false`).
- [ ] Ensure `any` type is not used; rely on `unknown` and type guards.
- [ ] Complete pre-commit review.
