import { describe, it, expect } from 'vitest';
import {
  isSavedPromptContract,
  isSavedPromptContractArray,
  isPromptTemplate,
  isPromptTemplateArray
} from '../validation';
import { SavedPromptContract, PromptTemplate } from '../../types';

describe('validation utils', () => {
  const validRole = {
    name: 'Test Role',
    description: 'Test Description'
  };

  const validPromptData = {
    context: 'Test Context',
    role: validRole,
    instruction: 'Test Instruction',
    specification: 'Test Specification',
    performance: 'Test Performance',
    preconditions: 'Test Preconditions',
    postconditions: 'Test Postconditions',
    schema: 'Test Schema',
    governance: 'Test Governance'
  };

  const validSavedPromptContract: SavedPromptContract = {
    id: 'test-id',
    name: 'Test Name',
    ...validPromptData
  };

  const validPromptTemplate: PromptTemplate = {
    id: 'template-id',
    name: 'Template Name',
    description: 'Template Description',
    tier: 'pro',
    prompt: {
      context: 'Template Context'
    }
  };

  describe('isSavedPromptContract', () => {
    it('should return true for a valid SavedPromptContract', () => {
      expect(isSavedPromptContract(validSavedPromptContract)).toBe(true);
    });

    it('should return false if id is missing', () => {
      const invalid = { ...validSavedPromptContract };
      delete (invalid as any).id;
      expect(isSavedPromptContract(invalid)).toBe(false);
    });

    it('should return false if name is missing', () => {
      const invalid = { ...validSavedPromptContract };
      delete (invalid as any).name;
      expect(isSavedPromptContract(invalid)).toBe(false);
    });

    it('should return false if role is invalid', () => {
      const invalid = { ...validSavedPromptContract, role: { name: 'missing description' } };
      expect(isSavedPromptContract(invalid)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isSavedPromptContract(null)).toBe(false);
      expect(isSavedPromptContract(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(isSavedPromptContract('string')).toBe(false);
      expect(isSavedPromptContract(123)).toBe(false);
    });
  });

  describe('isSavedPromptContractArray', () => {
    it('should return true for a valid array of SavedPromptContracts', () => {
      expect(isSavedPromptContractArray([validSavedPromptContract])).toBe(true);
    });

    it('should return true for an empty array', () => {
      expect(isSavedPromptContractArray([])).toBe(true);
    });

    it('should return false if any element is invalid', () => {
      expect(isSavedPromptContractArray([validSavedPromptContract, {}])).toBe(false);
    });

    it('should return false for non-array inputs', () => {
      expect(isSavedPromptContractArray(validSavedPromptContract)).toBe(false);
    });
  });

  describe('isPromptTemplate', () => {
    it('should return true for a valid PromptTemplate', () => {
      expect(isPromptTemplate(validPromptTemplate)).toBe(true);
    });

    it('should return false for an invalid tier', () => {
      const invalid = { ...validPromptTemplate, tier: 'invalid-tier' };
      expect(isPromptTemplate(invalid)).toBe(false);
    });

    it('should return false if description is missing', () => {
      const invalid = { ...validPromptTemplate };
      delete (invalid as any).description;
      expect(isPromptTemplate(invalid)).toBe(false);
    });

    it('should return false if prompt is missing', () => {
      const invalid = { ...validPromptTemplate };
      delete (invalid as any).prompt;
      expect(isPromptTemplate(invalid)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isPromptTemplate(null)).toBe(false);
    });
  });

  describe('isPromptTemplateArray', () => {
    it('should return true for a valid array of PromptTemplates', () => {
      expect(isPromptTemplateArray([validPromptTemplate])).toBe(true);
    });

    it('should return true for an empty array', () => {
      expect(isPromptTemplateArray([])).toBe(true);
    });

    it('should return false if any element is invalid', () => {
      expect(isPromptTemplateArray([validPromptTemplate, {}])).toBe(false);
    });

    it('should return false for non-array inputs', () => {
      expect(isPromptTemplateArray(validPromptTemplate)).toBe(false);
    });
  });
});
