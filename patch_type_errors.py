import re

with open('hooks/usePlausibilityLoop.ts', 'r') as f:
    content = f.read()

# Fix React import
content = re.sub(
    r"import { useState, useCallback } from 'react';",
    "import React, { useState, useCallback } from 'react';",
    content
)

# Fix validateSchema import to validatePromptOutput
content = re.sub(
    r"import { validatePlausibility, validateSchema } from '\.\./services/geminiService';",
    "import { validatePlausibility, validatePromptOutput } from '../services/geminiService';",
    content
)

# Fix validateSchema call to validatePromptOutput
content = re.sub(
    r"const executionResult = await validateSchema\(currentPromptData, 'enterprise', mockSchema, apiKey\);",
    "const executionResult = await validatePromptOutput(currentPromptData, 'enterprise', apiKey);",
    content
)

with open('hooks/usePlausibilityLoop.ts', 'w') as f:
    f.write(content)


with open('services/loggingService.ts', 'r') as f:
    content = f.read()

# Remove unused @ts-expect-error
content = re.sub(
    r"// @ts-expect-error - testing mock\n",
    "",
    content
)

with open('services/loggingService.ts', 'w') as f:
    f.write(content)
