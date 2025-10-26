import { GoogleGenAI, Type } from '@google/genai';
import { PromptData, Tier } from '../types';
import { generatePromptText } from '../utils/promptGenerator';
import { loggingService } from './loggingService';

// We assume `process.env.API_KEY` is available in the environment, as per project guidelines.

/**
 * Validates the output of a prompt against a JSON schema using the Gemini API.
 * This function is only available for Pro and Enterprise tiers. It constructs a full prompt,
 * sends it to the Gemini API with the specified schema, and returns the parsed JSON response.
 *
 * @param {PromptData} promptData - The data object for the prompt contract.
 * @param {Tier} tier - The user's current tier.
 * @returns {Promise<any>} A promise that resolves to the parsed JSON object from the API response.
 * @throws {Error} Throws an error if the tier is not Pro or Enterprise, if the schema is invalid JSON,
 * or if the Gemini API call fails.
 */
export async function validatePromptOutput(promptData: PromptData, tier: Tier): Promise<any> {
    if (tier !== 'pro' && tier !== 'enterprise') {
        throw new Error("JSON Schema validation is a Pro/Enterprise feature.");
    }
    
    let schema: Record<string, any>;
    try {
        const parsedSchema = JSON.parse(promptData.schema);
        // A simple structural check for a valid OpenAPI schema object
        if (typeof parsedSchema.type !== 'string' || typeof parsedSchema.properties !== 'object') {
            throw new Error("Schema must be a valid OpenAPI object with 'type' and 'properties'.");
        }
        schema = parsedSchema;
    } catch (e) {
        const message = e instanceof Error ? e.message : "The schema is not valid JSON.";
        loggingService.error("Schema parsing failed", e, { schema: promptData.schema });
        throw new Error(`Invalid JSON in the Output Schema definition: ${message}`);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const fullPrompt = generatePromptText(promptData, tier);

    // To make validation more concrete, we add a simple user request.
    const userRequest = `Based on the contract, fulfill this request: "Generate an example output."`;
    const fullContent = `${fullPrompt}\n\n--- USER REQUEST ---\n${userRequest}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullContent,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema as any, // Cast to any to satisfy the SDK's expected type
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        loggingService.error("Gemini API Error", error, { prompt: fullPrompt });
        if (error instanceof Error) {
            // Provide a more user-friendly message for common issues.
            if (error.message.includes('API_KEY')) {
                 throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during API validation.");
    }
}
