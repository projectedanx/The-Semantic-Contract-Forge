import { SavedPromptContract, PromptTemplate, Role, PromptData, Tier } from '../types';

/**
 * Validates if the given object is a valid Role.
 * @param obj The object to validate.
 * @returns True if the object is a valid Role, false otherwise.
 */
function isRole(obj: unknown): obj is Role {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const role = obj as Record<string, unknown>;
  return typeof role.name === 'string' && typeof role.description === 'string';
}

/**
 * Validates if the given object is a valid PromptData.
 * @param obj The object to validate.
 * @returns True if the object is a valid PromptData, false otherwise.
 */
function isPromptData(obj: unknown): obj is PromptData {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const data = obj as Record<string, unknown>;
  return (
    typeof data.context === 'string' &&
    isRole(data.role) &&
    typeof data.instruction === 'string' &&
    typeof data.specification === 'string' &&
    typeof data.performance === 'string' &&
    typeof data.preconditions === 'string' &&
    typeof data.postconditions === 'string' &&
    typeof data.schema === 'string' &&
    typeof data.governance === 'string'
  );
}

/**
 * Validates if the given object is a valid SavedPromptContract.
 * @param obj The object to validate.
 * @returns True if the object is a valid SavedPromptContract, false otherwise.
 */
export function isSavedPromptContract(obj: unknown): obj is SavedPromptContract {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const contract = obj as Record<string, unknown>;
  return (
    typeof contract.id === 'string' &&
    typeof contract.name === 'string' &&
    isPromptData(obj)
  );
}

/**
 * Validates if the given value is an array of SavedPromptContract.
 * @param arr The value to validate.
 * @returns True if the value is an array of SavedPromptContract, false otherwise.
 */
export function isSavedPromptContractArray(arr: unknown): arr is SavedPromptContract[] {
  return Array.isArray(arr) && arr.every(isSavedPromptContract);
}

/**
 * Validates if the given string is a valid Tier.
 * @param t The value to validate.
 * @returns True if the value is a valid Tier, false otherwise.
 */
function isTier(t: unknown): t is Tier {
  return t === 'starter' || t === 'pro' || t === 'enterprise';
}

/**
 * Validates if the given object is a valid PromptTemplate.
 * @param obj The object to validate.
 * @returns True if the object is a valid PromptTemplate, false otherwise.
 */
export function isPromptTemplate(obj: unknown): obj is PromptTemplate {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const template = obj as Record<string, unknown>;
  return (
    typeof template.id === 'string' &&
    typeof template.name === 'string' &&
    typeof template.description === 'string' &&
    isTier(template.tier) &&
    !!template.prompt &&
    typeof template.prompt === 'object'
  );
}

/**
 * Validates if the given value is an array of PromptTemplate.
 * @param arr The value to validate.
 * @returns True if the value is an array of PromptTemplate, false otherwise.
 */
export function isPromptTemplateArray(arr: unknown): arr is PromptTemplate[] {
  return Array.isArray(arr) && arr.every(isPromptTemplate);
}
