import { describe, it, expect } from 'vitest';
import { generatePromptText } from '../promptGenerator';
import { PromptData, Tier } from '../../types';

const mockRole = { name: 'Test Role', description: 'A role for testing.' };

const basePromptData: PromptData = {
  context: 'Test Context',
  role: mockRole,
  instruction: 'Test Instruction',
  specification: 'Test Specification',
  performance: 'Test Performance',
  preconditions: 'Test Preconditions',
  postconditions: 'Test Postconditions',
  schema: '{ "type": "string" }',
  governance: 'Test Governance',
};

describe('generatePromptText', () => {
  it('should include all sections for the enterprise tier', () => {
    const prompt = generatePromptText(basePromptData, 'enterprise');
    expect(prompt).toContain('--- CONTEXT ---');
    expect(prompt).toContain('--- ROLE ---');
    expect(prompt).toContain('--- INSTRUCTION ---');
    expect(prompt).toContain('--- SPECIFICATION ---');
    expect(prompt).toContain('--- PERFORMANCE CRITERIA ---');
    expect(prompt).toContain('--- PRECONDITIONS ---');
    expect(prompt).toContain('--- POSTCONDITIONS ---');
    expect(prompt).toContain('--- OUTPUT SCHEMA (JSON) ---');
    expect(prompt).toContain('--- GOVERNANCE CONSTRAINTS ---');
  });

  it('should include pro sections for the pro tier', () => {
    const prompt = generatePromptText(basePromptData, 'pro');
    expect(prompt).toContain('--- PRECONDITIONS ---');
    expect(prompt).toContain('--- POSTCONDITIONS ---');
    expect(prompt).toContain('--- OUTPUT SCHEMA (JSON) ---');
    expect(prompt).not.toContain('--- GOVERNANCE CONSTRAINTS ---');
  });

  it('should only include starter sections for the starter tier', () => {
    const prompt = generatePromptText(basePromptData, 'starter');
    expect(prompt).toContain('--- CONTEXT ---');
    expect(prompt).not.toContain('--- PRECONDITIONS ---');
    expect(prompt).not.toContain('--- GOVERNANCE CONSTRAINTS ---');
  });

  it('should exclude empty sections', () => {
    const sparseData: PromptData = {
      ...basePromptData,
      context: '',
      governance: ' ',
    };
    const prompt = generatePromptText(sparseData, 'enterprise');
    expect(prompt).not.toContain('--- CONTEXT ---');
    expect(prompt).not.toContain('--- GOVERNANCE CONSTRAINTS ---');
  });
});
