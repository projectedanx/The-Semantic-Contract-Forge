import re

with open('components/__tests__/SaveLoadControls.test.tsx', 'r') as f:
    content = f.read()

# Fix mockPromptData
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
    r"    const mockPromptData: PromptData = \{[^}]*metadata: \{[^}]*\}\s*\};",
    new_mockPromptData,
    content
)

# Fix SavedPromptContract mocks
new_mockContracts = """    const mockContracts: SavedPromptContract[] = [
        {
            ...mockPromptData,
            id: 'contract-1',
            name: 'Test Contract 1'
        },
        {
            ...mockPromptData,
            id: 'contract-2',
            name: 'Test Contract 2'
        }
    ];"""

content = re.sub(
    r"    const mockContracts: SavedPromptContract\[\] = \[\s*\{\s*id: 'contract-1',[^}]*\},[^}]*\}\s*\];",
    new_mockContracts,
    content
)

with open('components/__tests__/SaveLoadControls.test.tsx', 'w') as f:
    f.write(content)
