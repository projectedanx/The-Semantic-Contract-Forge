import re

with open('components/__tests__/RoleGenerator.test.tsx', 'r') as f:
    content = f.read()

# Fix mock role
new_dummyRole = """    const dummyRole: Role = {
        name: "Test Pirate",
        description: "A funny test pirate."
    };"""

content = re.sub(
    r"    const dummyRole: Role = \{\s*name: \"Test Pirate\",\s*description: \"A funny test pirate\.\",\s*tone: \"Humorous\",\s*expertise: \[\"Piracy\", \"Jokes\"\],\s*restrictions: \[\"No swearing\"\]\s*\};",
    new_dummyRole,
    content
)

with open('components/__tests__/RoleGenerator.test.tsx', 'w') as f:
    f.write(content)
