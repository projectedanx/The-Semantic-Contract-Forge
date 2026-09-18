import re

# Fix RoleGenerator.test.tsx
with open('components/__tests__/RoleGenerator.test.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"tone: 'professional',?",
    "",
    content
)

with open('components/__tests__/RoleGenerator.test.tsx', 'w') as f:
    f.write(content)

# Fix SaveLoadControls.test.tsx
with open('components/__tests__/SaveLoadControls.test.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"task: 'test',?",
    "instruction: 'test',",
    content
)

content = re.sub(
    r"version: 1,?",
    "",
    content
)

with open('components/__tests__/SaveLoadControls.test.tsx', 'w') as f:
    f.write(content)

# Fix loggingService.ts again just in case there are multiple
with open('services/loggingService.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"\s*// @ts-expect-error.*?\n",
    "\n",
    content
)

with open('services/loggingService.ts', 'w') as f:
    f.write(content)
