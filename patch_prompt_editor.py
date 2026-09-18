import re

with open('components/PromptEditor.tsx', 'r') as f:
    content = f.read()

# Add imports
content = re.sub(
    r"import SchemaSynthesizer from './SchemaSynthesizer';",
    "import SchemaSynthesizer from './SchemaSynthesizer';\nimport GeometricEditor from './GeometricEditor';\nimport { usePlausibilityLoop } from '../hooks/usePlausibilityLoop';",
    content
)

# Update PromptEditor component body
new_body = """
      <Section title="Governance [ENTERPRISE]" description="High-level rules, compliance, and architectural boundaries." isLocked={!isEnterprise}>
        <TextArea name="governance" value={promptData.governance} onChange={handleChange} disabled={!isEnterprise} placeholder="e.g., Must adhere to the VULCAN framework and prevent cross-domain state mutation calls." />
      </Section>

      <Section title="Geometric Matrix Constraints [ENTERPRISE]" description="Non-Euclidean Latent Space Navigation (Project Aurelius)" isLocked={!isEnterprise}>
        <GeometricEditor
          constraints={promptData.geometryMatrix}
          onChange={(constraints) => setPromptData(prev => ({ ...prev, geometryMatrix: constraints }))}
          disabled={!isEnterprise}
        />
      </Section>
    </div>
"""

content = re.sub(
    r'<Section title="Governance \[ENTERPRISE\]" description="High-level rules, compliance, and architectural boundaries\." isLocked=\{\!isEnterprise\}>\s*<TextArea name="governance" value=\{promptData\.governance\} onChange=\{handleChange\} disabled=\{\!isEnterprise\} placeholder="e\.g\., Must adhere to the VULCAN framework and prevent cross-domain state mutation calls\." />\s*</Section>\s*</div>',
    new_body.strip(),
    content
)

# Insert plausibility hook and button rendering
hook_code = """
  const {
    isOptimizing,
    optimizationIterations,
    plausibilityScore,
    runOptimization
  } = usePlausibilityLoop({ promptData, setPromptData, apiKey });
"""

content = re.sub(
    r'  const \[isRoleGeneratorVisible, setRoleGeneratorVisible\] = useState\(false\);',
    '  const [isRoleGeneratorVisible, setRoleGeneratorVisible] = useState(false);\n' + hook_code,
    content
)

button_html = """
      <div className="flex items-center justify-between border-b border-amber-300/20 pb-2">
        <h2 className="text-2xl font-bold text-amber-300">Prompt Contract Editor</h2>
        {isEnterprise && (
          <div className="flex items-center gap-4">
            {plausibilityScore !== null && (
              <span className={`text-sm font-semibold ${plausibilityScore >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
                Plausibility Score: {plausibilityScore}
              </span>
            )}
            <button
              onClick={runOptimization}
              disabled={!apiKey || isOptimizing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-md transition font-semibold flex items-center gap-2"
            >
              {isOptimizing ? `Optimizing (Iter ${optimizationIterations})...` : 'Run Oracle Optimization'}
            </button>
          </div>
        )}
      </div>
"""

content = re.sub(
    r'<h2 className="text-2xl font-bold text-amber-300 border-b border-amber-300/20 pb-2">Prompt Contract Editor</h2>',
    button_html.strip(),
    content
)

with open('components/PromptEditor.tsx', 'w') as f:
    f.write(content)
