import re

with open('README.md', 'r') as f:
    readme = f.read()

# Make sure we don't duplicate
if 'Project Aurelius Non-Euclidean Latent Space Navigation' not in readme:
    readme += """
## Project Aurelius (Meta-Architect Intelligence)

- **Geometric Cognition (Non-Euclidean API):** Encodes geometric constraints (e.g., Hyperbolic/Spherical curvature, coordinate systems) to steer models toward spatial rigor using the `geometryMatrix` data model extension in PromptContracts.
- **Agentic Auto-Optimization (Plausibility Oracle):** An autonomous execution loop (`usePlausibilityLoop`) that verifies physical consistency using Gemini acting as a proxy physics engine, correcting constraints recursively to hit specific logic thresholds.
"""
    with open('README.md', 'w') as f:
        f.write(readme)
