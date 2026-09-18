import re

with open('components/__tests__/SaveLoadControls.test.tsx', 'r') as f:
    content = f.read()

# Completely replace mockPromptData
new_mockPromptData = """    const mockPromptData: PromptData = {
        context: 'test context',
        role: { name: 'test role', description: 'test description' },
        instruction: 'test instruction',
        specification: 'test spec',
        performance: 'test perf',
        preconditions: 'test pre',
        postconditions: 'test post',
        schema: 'test schema',
        governance: 'test gov'
    };"""

content = re.sub(
    r"    const mockPromptData: PromptData = \{\s*context: 'test context',\s*role: \{ name: 'test role', description: 'test description' \},\s*task: 'test task',\s*format: \{\s*outputType: 'JSON',\s*schema: 'test schema',\s*instructions: 'test instructions'\s*\},\s*constraints: \['test constraint'\],\s*examples: \[\],\s*metadata: \{\s*tier: 'starter',\s*targetModel: 'test model'\s*\}\s*\};",
    new_mockPromptData,
    content
)

with open('components/__tests__/SaveLoadControls.test.tsx', 'w') as f:
    f.write(content)
