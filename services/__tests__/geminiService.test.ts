import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePromptOutput } from '../geminiService';
import { loggingService } from '../loggingService';
import { PromptData } from '../../types';

// Mock the external dependencies
vi.mock('@google/generative-ai');
vi.mock('../loggingService');
vi.mock('../../utils/promptGenerator');

/**
 * @file Unit tests for validatePromptOutput in geminiService.
 * Focuses on error handling for JSON schema parsing.
 */

describe('geminiService', () => {
    /**
     * @const {PromptData} mockPromptData
     * @description A base mock object for PromptData to be used across tests.
     */
    const mockPromptData: PromptData = {
        context: 'test context',
        role: { name: 'test role', description: 'test description' },
        instruction: 'test instruction',
        specification: 'test specification',
        performance: 'test performance',
        preconditions: 'test pre',
        postconditions: 'test post',
        schema: '',
        governance: 'test gov'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validatePromptOutput', () => {
        /**
         * Test Case: Invalid JSON Schema
         * Scenario: The user provides a schema string that is not valid JSON.
         * Expected: The function should catch the SyntaxError and throw a new Error with a descriptive message.
         */
        it('should throw an error when the schema is invalid JSON', async () => {
            const dataWithInvalidJson = { ...mockPromptData, schema: '{ invalid json }' };

            await expect(validatePromptOutput(dataWithInvalidJson, 'pro'))
                .rejects.toThrow(/Invalid JSON in the Output Schema definition/);

            expect(loggingService.error).toHaveBeenCalledWith(
                "Schema parsing failed",
                expect.any(Error),
                expect.objectContaining({ schema: '{ invalid json }' })
            );
        });

        /**
         * Test Case: Incomplete OpenAPI Schema
         * Scenario: The user provides valid JSON, but it lacks 'type' or 'properties'.
         * Expected: The function should throw an Error stating that the schema must be a valid OpenAPI object.
         */
        it('should throw an error when the schema is missing required OpenAPI fields', async () => {
            const dataWithIncompleteSchema = { ...mockPromptData, schema: JSON.stringify({ not: "a schema" }) };

            await expect(validatePromptOutput(dataWithIncompleteSchema, 'pro'))
                .rejects.toThrow("Invalid JSON in the Output Schema definition: Schema must be a valid OpenAPI object with 'type' and 'properties'.");

            expect(loggingService.error).toHaveBeenCalledWith(
                "Schema parsing failed",
                expect.any(Error),
                expect.objectContaining({ schema: dataWithIncompleteSchema.schema })
            );
        });

        /**
         * Test Case: Restricted Tier Access
         * Scenario: A user with a 'starter' tier tries to use JSON schema validation.
         * Expected: The function should throw an Error stating it's a Pro/Enterprise feature.
         */
        it('should throw an error if the tier is not pro or enterprise', async () => {
            await expect(validatePromptOutput(mockPromptData, 'starter'))
                .rejects.toThrow("JSON Schema validation is a Pro/Enterprise feature.");
        });
    });
});
