import { describe, it, expect } from 'vitest';
import { generatePromptText } from '../promptGenerator';
import { PromptData } from '../../types';

describe('generatePromptText', () => {
  const fullPromptData: PromptData = {
    context: 'Test Context',
    role: { name: 'Test Role', description: 'Test Description' },
    instruction: 'Test Instruction',
    specification: 'Test Specification',
    performance: 'Test Performance',
    preconditions: 'Test Preconditions',
    postconditions: 'Test Postconditions',
    schema: 'Test Schema',
    governance: 'Test Governance'
  };

  it('should include only starter sections for starter tier', () => {
    const result = generatePromptText(fullPromptData, 'starter');

    // Should include starter sections
    expect(result).toContain('--- CONTEXT ---');
    expect(result).toContain('Test Context');
    expect(result).toContain('--- ROLE ---');
    expect(result).toContain('You are a "Test Role".\nDescription: Test Description');
    expect(result).toContain('--- INSTRUCTION ---');
    expect(result).toContain('Test Instruction');
    expect(result).toContain('--- SPECIFICATION ---');
    expect(result).toContain('Test Specification');
    expect(result).toContain('--- PERFORMANCE CRITERIA ---');
    expect(result).toContain('Test Performance');

    // Should NOT include pro or enterprise sections
    expect(result).not.toContain('--- PRECONDITIONS ---');
    expect(result).not.toContain('--- POSTCONDITIONS ---');
    expect(result).not.toContain('--- OUTPUT SCHEMA (JSON) ---');
    expect(result).not.toContain('--- GOVERNANCE CONSTRAINTS ---');
  });

  it('should include starter and pro sections for pro tier', () => {
    const result = generatePromptText(fullPromptData, 'pro');

    // Should include pro sections
    expect(result).toContain('--- PRECONDITIONS ---');
    expect(result).toContain('Test Preconditions');
    expect(result).toContain('--- POSTCONDITIONS ---');
    expect(result).toContain('Test Postconditions');
    expect(result).toContain('--- OUTPUT SCHEMA (JSON) ---');
    expect(result).toContain('The final output MUST be a valid JSON object that strictly conforms to the following schema:\nTest Schema');

    // Should NOT include enterprise sections
    expect(result).not.toContain('--- GOVERNANCE CONSTRAINTS ---');
  });

  it('should include all sections for enterprise tier', () => {
    const result = generatePromptText(fullPromptData, 'enterprise');

    // Should include enterprise sections
    expect(result).toContain('--- GOVERNANCE CONSTRAINTS ---');
    expect(result).toContain('Test Governance');
  });

  it('should exclude empty sections', () => {
    const emptyPromptData: PromptData = {
      context: '   ', // whitespace only
      role: { name: '', description: '' },
      instruction: '', // empty string
      specification: 'Valid spec', // only valid section
      performance: '',
      preconditions: '',
      postconditions: '',
      schema: '',
      governance: ''
    };

    const result = generatePromptText(emptyPromptData, 'enterprise');

    // Should include non-empty sections
    expect(result).toContain('--- SPECIFICATION ---');
    expect(result).toContain('Valid spec');

    // Should exclude empty sections
    expect(result).not.toContain('--- CONTEXT ---');
    expect(result).not.toContain('--- INSTRUCTION ---');

    // Role is a bit special because of formatting.
    // If name and description are empty, the entire section should be excluded.
    expect(result).not.toContain('--- ROLE ---');

    // Output schema is also formatted.
    // If schema is empty, the entire section should be excluded.
    expect(result).not.toContain('--- OUTPUT SCHEMA (JSON) ---');
  });

  it('should exclude role section if name and description result in empty string, otherwise keep it', () => {
    const emptyRoleData: PromptData = {
      ...fullPromptData,
      role: { name: '', description: '' },
    };

    const result = generatePromptText(emptyRoleData, 'starter');
    expect(result).not.toContain('--- ROLE ---');

    const partiallyFilledRoleData: PromptData = {
      ...fullPromptData,
      role: { name: 'Assistant', description: '' },
    };
    const result2 = generatePromptText(partiallyFilledRoleData, 'starter');
    expect(result2).toContain('--- ROLE ---');
    expect(result2).toContain('You are a "Assistant".\nDescription:');
  });

  it('should format sections correctly with newlines', () => {
    const data: PromptData = {
      ...fullPromptData,
      context: 'Line 1\nLine 2',
      role: { name: 'Role', description: 'Desc' }
    };
    const result = generatePromptText(data, 'starter');

    expect(result).toContain('--- CONTEXT ---\nLine 1\nLine 2');
    // Ensure separate sections are separated by \n\n
    expect(result).toContain('\n\n--- ROLE ---');
  });
});
