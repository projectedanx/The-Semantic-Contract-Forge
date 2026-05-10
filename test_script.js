import { isSavedPromptContract } from './utils/validation.ts';

const validPromptData = {
  context: 'Context',
  role: { name: 'Role', description: 'Desc' },
  instruction: 'Inst',
  specification: 'Spec',
  performance: 'Perf',
  preconditions: 'Pre',
  postconditions: 'Post',
  schema: 'Schema',
  governance: 'Gov'
};

const validContract = {
  id: 'scf-123',
  name: 'Test Contract',
  ...validPromptData
};

console.log("Validation Result: ", isSavedPromptContract(validContract));
