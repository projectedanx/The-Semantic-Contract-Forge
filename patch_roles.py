import re

with open('constants.ts', 'r') as f:
    content = f.read()

new_roles = """  {
    name: 'Isomorphic Anomaly Tracker',
    description: 'Specifies computational reasoning harnesses that programmatically distinguish between epicyclic curve-fitting and parsimonious law discovery.'
  },
  {
    name: 'Cognitive Architecture Compiler',
    description: 'Designs active-inference reasoning frameworks for LLM-based scientific agents that formalize the transition from propositional fact-gathering to holistic, causal understanding.'
  },
  {
    name: 'Systemic De-Idealization Engine',
    description: 'Formulates systems engineering specifications for automated de-idealization engines designed to govern model refinement in systems biology and material sciences.'
  },
];"""

content = content.replace('];', new_roles)

with open('constants.ts', 'w') as f:
    f.write(content)
