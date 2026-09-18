import re

with open('utils/promptGenerator.ts', 'r') as f:
    content = f.read()

# Update generatePromptText to include GEOMETRIC CONSTRAINTS
new_generate_logic = """
  const sections: { title: string; content: string; minTier: Tier }[] = [
    { title: 'CONTEXT', content: data.context, minTier: 'starter' },
    {
      title: 'ROLE',
      content:
        data.role.name.trim() === '' && data.role.description.trim() === ''
          ? ''
          : `You are a "${data.role.name}".\nDescription: ${data.role.description}`,
      minTier: 'starter',
    },
    { title: 'INSTRUCTION', content: data.instruction, minTier: 'starter' },
    { title: 'SPECIFICATION', content: data.specification, minTier: 'starter' },
    { title: 'PERFORMANCE CRITERIA', content: data.performance, minTier: 'starter' },
    { title: 'PRECONDITIONS', content: data.preconditions, minTier: 'pro' },
    { title: 'POSTCONDITIONS', content: data.postconditions, minTier: 'pro' },
    {
      title: 'OUTPUT SCHEMA (JSON)',
      content:
        data.schema.trim() === ''
          ? ''
          : `The final output MUST be a valid JSON object that strictly conforms to the following schema:\n${data.schema}`,
      minTier: 'pro',
    },
    { title: 'GOVERNANCE CONSTRAINTS', content: data.governance, minTier: 'enterprise' },
    {
      title: 'GEOMETRIC CONSTRAINTS',
      content: data.geometryMatrix
        ? `Topology Type: ${data.geometryMatrix.topologyType}\nCoordinate System: ${data.geometryMatrix.coordinateSystem}\nDimensions: ${data.geometryMatrix.dimensions}\nGaussian Curvature: ${data.geometryMatrix.curvature}`
        : '',
      minTier: 'enterprise'
    }
  ];
"""

content = re.sub(
    r'  const sections: { title: string; content: string; minTier: Tier }\[\] = \[\n(?:.*?\n)+?  \];',
    new_generate_logic.strip(),
    content
)

with open('utils/promptGenerator.ts', 'w') as f:
    f.write(content)
