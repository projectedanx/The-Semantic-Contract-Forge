
/**
 * Represents the tiers of service available in the application.
 */
export type Tier = 'starter' | 'pro' | 'enterprise';

/**
 * Represents an AI persona or role that can be assigned.
 */
export interface Role {
  name: string;
  description: string;
}

/**
 * Represents all the fields in the prompt editor, forming the core of a prompt contract.
 */
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

/**
 * Represents a prompt contract that has been saved to local storage.
 * It includes all the prompt data plus a unique ID and a user-assigned name.
 */
export interface SavedPromptContract extends PromptData {
  id: string;
  name: string;
}

/**
 * Represents the outcome of a validation attempt.
 * It's a discriminated union type, indicating either success with data or failure with an error message.
 */
export type ValidationResult =
  | { success: true; data: any }
  | { success: false; error: string };

/**
 * Represents a pre-defined or user-defined template for a prompt contract.
 */
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  tier: Tier;
  prompt: Partial<PromptData>;
}
