import re

with open('constants/templates.ts', 'r') as f:
    content = f.read()

new_templates = """  {
    id: 'template-ptolemaic-over-fitting-vs-keplerian-parsimony',
    name: 'Ptolemaic Over-Fitting vs. Keplerian Parsimony',
    description: 'Specify a computational reasoning harness that programmatically distinguishes between "epicyclic curve-fitting" and "parsimonious law discovery".',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'Isomorphic Anomaly Tracker'),
      context: 'In the history of science, Ptolemy\\'s geocentric model was an extremely flexible curve-fitting machine. By multiplying ad-hoc parameters (epicycles, deferents, and equants), geocentric astronomers could fit any planetary trajectory to arbitrary accuracy, despite resting on a false physical foundation (Earth\\'s immobility). This over-fitting failure mode is highly isomorphic to the Lambda-CDM model\\'s introduction of dark-sector parameters to save the idealized, averaged FRW metric when confronted with cosmological anomalies.',
      instruction: 'Specify a computational reasoning harness that programmatically distinguishes between "epicyclic curve-fitting" and "parsimonious law discovery."',
      specification: `1. Construct a typed schema that ingests planetary orbital telemetry.
2. Specify an "Occam-Loss Compiler" that calculates the Bayesian Information Criterion (BIC) of two competing models: Model A (multi-nested geocentric epicycles with 20+ free parameters) and Model B (Keplerian ellipses with the Sun at one focus).
3. Simulate Galileo-type "Model Breaking" by introducing Venusian phase-angle constraints into the data stream. Show how the harness executes a Modus Tollens falsification to decisively reject the geocentric coordinate frame, forcing an abductive transition to heliocentric coordinate systems.`,
      performance: 'Harness must cleanly and programmatically distinguish curve fitting from actual law discovery.',
      preconditions: 'Must be dealing with planetary orbital telemetry data and Venusian phase-angle constraints.',
      postconditions: 'Output must be a completed Invariant Verification Harness specification demonstrating Model Breaking via Modus Tollens.',
      governance: 'Must rely on logical, verifiable mathematical principles rather than ad hoc parameter fitting.',
    },
  },
  {
    id: 'template-factive-knowledge-vs-non-factive-understanding',
    name: 'Factive Knowledge vs Non-Factive Understanding',
    description: 'Design an active-inference reasoning framework for LLM-based scientific agents that formalizes the transition from propositional fact-gathering to holistic, causal understanding.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'Cognitive Architecture Compiler'),
      context: 'Contemporary epistemology draws a sharp distinction between propositional knowledge (which is factive and requires strict truth) and understanding (which is non-factive and tolerates approximation, idealization, and the use of "fictive principles"). Science routinely generates genuine understanding of physical systems utilizing models (such as the Ideal Gas Law or Newtonian gravity) that are known to be strictly false at fundamental scales but possess high explanatory power.',
      instruction: 'Design an active-inference reasoning framework for LLM-based scientific agents that formalizes the transition from propositional fact-gathering to holistic, causal understanding.',
      specification: `1. Specify an ontology of "Fictive Principles," explicitly mapping idealized assumptions (e.g., zero molecular volume, frictionless surfaces, point masses) to their computational and explanatory utility.
2. Formulate a quantitative "Grasping Metric" that evaluates the agent\\'s capacity to competently manipulate variables, identify causal dependencies, and successfully transfer the model\\'s core relational structure to an entirely new, unencountered domain.
3. Simulate a scenario where the agent uses a strictly Newtonian gravitational framework to solve an astrophysical trajectory problem, demonstrating how the system retains a high "Understanding Score" despite the presence of General Relativistic defeaters.`,
      performance: 'Ensure high grasping metrics can be retained even with underlying fictive principles.',
      preconditions: 'Requires definitions mapping idealized assumptions.',
      postconditions: 'The framework correctly handles and differentiates factive constraints and non-factive approximations with transfer capability to a new domain.',
      governance: 'Must preserve epistemic distinction without collapsing understanding into false certainty.',
    },
  },
  {
    id: 'template-automating-de-idealization-loop',
    name: 'Automating the De-Idealization Loop',
    description: 'Formulate a systems engineering specification for an automated "De-Idealization Engine" designed to govern model refinement.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'Systemic De-Idealization Engine'),
      context: 'To make complex, high-dimensional physical systems tractable, scientific modelers utilize Aristotelian idealization ("stripping away" irrelevant properties) and Galilean idealization (deliberately introducing distortions). For instance, in systems biology, researchers simplify complex, flexible protein structures into static "ribbon diagrams" or "bead-rod polymers" to isolate key structural elements. However, these models break down when applied outside their specified "domain of validity" (e.g., when protein dynamics and conformational flexibility become the dominant physical drivers).',
      instruction: 'Formulate a systems engineering specification for an automated "De-Idealization Engine" designed to govern model refinement.',
      specification: `1. Build a formal representation of an idealized model as a Directed Acyclic Graph (DAG) of logical constraints and simplifying assumptions.
2. Specify a "Boundary Auditor" that programmatically evaluates the model at extreme limits using bounding and asymptotic analysis.
3. Design a feedback loop that detects when the prediction error of the idealized model diverges by more than 3-sigma from high-fidelity experimental data. The engine must automatically locate the specific faulty assumption (e.g., "zero friction" or "zero flexibility") and execute a targeted "De-Idealization" routine—re-injecting the omitted variables back into the model to construct a higher-dimensional, more accurate representation of the target system.`,
      performance: 'Must programmatically detect 3-sigma predictive divergence and locate the specific faulty assumption.',
      preconditions: 'System requires formal input models structured as a DAG of logical constraints.',
      postconditions: 'The engine re-injects omitted variables seamlessly to produce a higher-fidelity model without manual intervention.',
      governance: 'Ensures strict boundary auditing and bounding checks prior to automated model correction.',
    },
  },
];"""

content = content.replace('];', new_templates)

with open('constants/templates.ts', 'w') as f:
    f.write(content)
