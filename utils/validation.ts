import { SavedPromptContract, PromptTemplate, Role, PromptData, Tier } from '../types';

/**
 * Validates if the given object is a valid Role.
 * @param obj The object to validate.
 * @returns True if the object is a valid Role, false otherwise.
 */
function isRole(obj: any): obj is Role {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string'
  );
}

/**
 * Validates if the given object is a valid PromptData.
 * @param obj The object to validate.
 * @returns True if the object is a valid PromptData, false otherwise.
 */
function isPromptData(obj: any): obj is PromptData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.context === 'string' &&
    isRole(obj.role) &&
    typeof obj.instruction === 'string' &&
    typeof obj.specification === 'string' &&
    typeof obj.performance === 'string' &&
    typeof obj.preconditions === 'string' &&
    typeof obj.postconditions === 'string' &&
    typeof obj.schema === 'string' &&
    typeof obj.governance === 'string'
  );
}

/**
 * Validates if the given object is a valid SavedPromptContract.
 * @param obj The object to validate.
 * @returns True if the object is a valid SavedPromptContract, false otherwise.
 */
export function isSavedPromptContract(obj: any): obj is SavedPromptContract {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    isPromptData(obj)
  );
}

/**
 * Validates if the given value is an array of SavedPromptContract.
 * @param arr The value to validate.
 * @returns True if the value is an array of SavedPromptContract, false otherwise.
 */
export function isSavedPromptContractArray(arr: any): arr is SavedPromptContract[] {
  return Array.isArray(arr) && arr.every(isSavedPromptContract);
}

/**
 * Validates if the given string is a valid Tier.
 * @param t The value to validate.
 * @returns True if the value is a valid Tier, false otherwise.
 */
function isTier(t: any): t is Tier {
  return t === 'starter' || t === 'pro' || t === 'enterprise';
}

/**
 * Validates if the given object is a valid PromptTemplate.
 * @param obj The object to validate.
 * @returns True if the object is a valid PromptTemplate, false otherwise.
 */
export function isPromptTemplate(obj: any): obj is PromptTemplate {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    isTier(obj.tier) &&
    obj.prompt &&
    typeof obj.prompt === 'object'
  );
}

/**
 * Validates if the given value is an array of PromptTemplate.
 * @param arr The value to validate.
 * @returns True if the value is an array of PromptTemplate, false otherwise.
 */
export function isPromptTemplateArray(arr: any): arr is PromptTemplate[] {
  return Array.isArray(arr) && arr.every(isPromptTemplate);
}
