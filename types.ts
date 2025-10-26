
export type Tier = 'starter' | 'pro' | 'enterprise';

export interface Role {
  name: string;
  description: string;
}

export interface PromptData {
  context: string;
  role: Role;
  instruction: string;
  specification: string;
  performance: string;
  preconditions: string;
  postconditions: string;
  schema: string;
  governance: string;
}

export interface SavedPromptContract extends PromptData {
  id: string;
  name: string;
}

export type ValidationResult =
  | { success: true; data: any }
  | { success: false; error: string };

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  tier: Tier;
  prompt: Partial<PromptData>;
}
