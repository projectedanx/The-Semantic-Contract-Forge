import { SavedPromptContract, PromptTemplate, Role, PromptData, Tier } from '../types';

/**
 * @file utils/validation.ts
 * @description Centralized type guard functions used to validate incoming data structures,
 * especially those parsed from `localStorage` where type safety is not guaranteed.
 * Prevents runtime errors by explicitly asserting object shapes before use.
 */

/**
 * Type guard to validate if a given object conforms to the `Role` interface.
 *
 * @param {unknown} obj - The loosely-typed object to validate.
 * @returns {obj is Role} True if the object matches the `Role` structure, false otherwise.
 */
function isRole(obj: unknown): obj is Role {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const role = obj as Record<string, unknown>;
  return typeof role.name === 'string' && typeof role.description === 'string';
}

/**
 * Type guard to validate if a given object conforms to the core `PromptData` interface.
 *
 * @param {unknown} obj - The loosely-typed object to validate.
 * @returns {obj is PromptData} True if the object matches the `PromptData` structure, false otherwise.
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
 * Type guard to validate if a given object conforms to the `SavedPromptContract` interface.
 * Ensures the object has the required base prompt fields plus ID and Name.
 *
 * @param {unknown} obj - The loosely-typed object to validate, typically retrieved from storage.
 * @returns {obj is SavedPromptContract} True if the object is a valid `SavedPromptContract`, false otherwise.
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
 * Type guard to validate if a given value is an array of `SavedPromptContract` objects.
 *
 * @param {unknown} arr - The value to validate.
 * @returns {arr is SavedPromptContract[]} True if the value is an array and all elements are valid contracts.
 */
export function isSavedPromptContractArray(arr: unknown): arr is SavedPromptContract[] {
  return Array.isArray(arr) && arr.every(isSavedPromptContract);
}

/**
 * Type guard to validate if a given string matches the defined `Tier` union type.
 *
 * @param {unknown} t - The value to validate.
 * @returns {t is Tier} True if the value is 'starter', 'pro', or 'enterprise'.
 */
function isTier(t: unknown): t is Tier {
  return t === 'starter' || t === 'pro' || t === 'enterprise';
}

/**
 * Type guard to validate if a given object conforms to the `PromptTemplate` interface.
 *
 * @param {unknown} obj - The loosely-typed object to validate.
 * @returns {obj is PromptTemplate} True if the object is a valid `PromptTemplate`, false otherwise.
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
 * Type guard to validate if a given value is an array of `PromptTemplate` objects.
 *
 * @param {unknown} arr - The value to validate.
 * @returns {arr is PromptTemplate[]} True if the value is an array and all elements are valid templates.
 */
export function isPromptTemplateArray(arr: unknown): arr is PromptTemplate[] {
  return Array.isArray(arr) && arr.every(isPromptTemplate);
}
