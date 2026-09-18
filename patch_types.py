import re

with open('types.ts', 'r') as f:
    content = f.read()

geometric_constraints_interface = """
/**
 * Represents geometric and topological constraints for non-Euclidean latent space navigation.
 * Part of Project Aurelius (Phase 1).
 */
export interface GeometricConstraints {
  /** The type of manifold or topology (e.g., 'Euclidean', 'Hyperbolic', 'Spherical'). */
  topologyType: string;
  /** The Gaussian curvature value. */
  curvature: number;
  /** The coordinate system to use (e.g., 'Cartesian', 'Polar', 'Poincare Disk'). */
  coordinateSystem: string;
  /** The number of spatial dimensions. */
  dimensions: number;
}
"""

# Insert GeometricConstraints before PromptData
content = re.sub(
    r'(/\*\*\n \* Represents all the fields in the prompt editor)',
    f'{geometric_constraints_interface.strip()}\n\n\\1',
    content,
    count=1
)

# Add geometryMatrix to PromptData
prompt_data_update = """  /** High-level governance constraints, security rules, or constitutional AI bounds. */
  governance: string;
  /** Optional geometric and topological constraints to enforce spatial structure. */
  geometryMatrix?: GeometricConstraints;
}"""

content = re.sub(
    r'  /\*\* High-level governance constraints, security rules, or constitutional AI bounds\. \*/\n  governance: string;\n}',
    prompt_data_update,
    content,
    count=1
)

with open('types.ts', 'w') as f:
    f.write(content)
