import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePromptOutput, generateRole } from '../geminiService';
import { loggingService } from '../loggingService';
import { PromptData } from '../../types';

// Mock the external dependencies

const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel() {
                return {
                    generateContent: (...args: any[]) => mockGenerateContent(...args)
                };
            }
        }
    };
});

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
        mockGenerateContent.mockReset();
    });

    describe('validatePromptOutput', () => {
        /**
         * Test Case: Invalid JSON Schema
         * Scenario: The user provides a schema string that is not valid JSON.
         * Expected: The function should catch the SyntaxError and throw a new Error with a descriptive message.
         */
        it('should throw an error when the schema is invalid JSON', async () => {
            const dataWithInvalidJson = { ...mockPromptData, schema: '{ invalid json }' };

            await expect(validatePromptOutput(dataWithInvalidJson, 'pro', 'dummy_key'))
                .rejects.toThrow(/Invalid JSON in the Output Schema definition/);

            expect(loggingService.error).toHaveBeenCalledWith(
                "Schema parsing failed",
                expect.any(Error)
            );
        });

        /**
         * Test Case: Incomplete OpenAPI Schema
         * Scenario: The user provides valid JSON, but it lacks 'type' or 'properties'.
         * Expected: The function should throw an Error stating that the schema must be a valid OpenAPI object.
         */
        it('should throw an error when the schema is missing required OpenAPI fields', async () => {
            const dataWithIncompleteSchema = { ...mockPromptData, schema: JSON.stringify({ not: "a schema" }) };

            await expect(validatePromptOutput(dataWithIncompleteSchema, 'pro', 'dummy_key'))
                .rejects.toThrow("Invalid JSON in the Output Schema definition: Schema must be a valid OpenAPI object with 'type' and 'properties'.");

            expect(loggingService.error).toHaveBeenCalledWith(
                "Schema parsing failed",
                expect.any(Error)
            );
        });

        /**
         * Test Case: Restricted Tier Access
         * Scenario: A user with a 'starter' tier tries to use JSON schema validation.
         * Expected: The function should throw an Error stating it's a Pro/Enterprise feature.
         */
        it('should throw an error if the tier is not pro or enterprise', async () => {
            await expect(validatePromptOutput(mockPromptData, 'starter', 'dummy_key'))
                .rejects.toThrow("JSON Schema validation is a Pro/Enterprise feature.");
        });

        /**
         * Test Case: Sensitive Data Leakage in Logging (Reproduction)
         * Scenario: The Gemini API returns an error.
         * Expected: The fullPrompt should NOT be in the logging context.
         */
        it('should NOT log the full prompt when the Gemini API returns an error', async () => {
            const validSchema = JSON.stringify({ type: 'object', properties: { test: { type: 'string' } } });
            const dataWithValidSchema = { ...mockPromptData, schema: validSchema };

            mockGenerateContent.mockRejectedValue(new Error('API Error'));

            await expect(validatePromptOutput(dataWithValidSchema, 'pro', 'dummy_key'))
                .rejects.toThrow(/Gemini API Error/);

            expect(loggingService.error).toHaveBeenCalledWith(
                "Gemini API Error",
                expect.any(Error)
            );
            // Verify that no third argument (context with prompt) was passed
            const calls = (loggingService.error as unknown as { mock: { calls: unknown[][] } }).mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall.length).toBe(2);
        });
    });

    describe('generateRole', () => {
        it('should return a parsed role on success', async () => {
            mockGenerateContent.mockResolvedValue({
                response: {
                    text: () => JSON.stringify({ name: 'Test Role', description: 'Test Description' })
                }
            });

            const result = await generateRole('Test request', 'dummy_key');
            expect(result).toEqual({ name: 'Test Role', description: 'Test Description' });
        });

        it('should throw an error for invalid structure', async () => {
            mockGenerateContent.mockResolvedValue({
                response: {
                    text: () => JSON.stringify({ invalid: 'structure' })
                }
            });

            await expect(generateRole('Test request', 'dummy_key'))
                .rejects.toThrow('API returned an invalid role structure.');
            expect(loggingService.error).toHaveBeenCalledWith(
                "Gemini Role Generation Error",
                expect.any(Error)
            );
        });

        it('should throw API Key error', async () => {
            mockGenerateContent.mockRejectedValue(new Error('Invalid API_KEY'));

            await expect(generateRole('Test request', 'dummy_key'))
                .rejects.toThrow('Gemini API Error: Invalid or missing API Key.');
        });

        it('should throw general API error', async () => {
            mockGenerateContent.mockRejectedValue(new Error('Some other error'));

            await expect(generateRole('Test request', 'dummy_key'))
                .rejects.toThrow('Gemini API Error: Some other error');
        });

        it('should throw unknown error if not an Error object', async () => {
            mockGenerateContent.mockRejectedValue('String error');

            await expect(generateRole('Test request', 'dummy_key'))
                .rejects.toThrow('An unknown error occurred during role generation.');
        });
    });
});
