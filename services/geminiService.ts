import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptData, Tier, Role } from '../types';
import { generatePromptText } from '../utils/promptGenerator';
import { loggingService } from './loggingService';

/**
 * Validates the output of a prompt against a JSON schema using the Gemini API.
 * This function is only available for Pro and Enterprise tiers. It constructs a full prompt,
 * sends it to the Gemini API with the specified schema, and returns the parsed JSON response.
 *
 * @param {PromptData} promptData - The data object for the prompt contract.
 * @param {Tier} tier - The user's current tier.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<unknown>} A promise that resolves to the parsed JSON object from the API response.
 * @throws {Error} Throws an error if the tier is not Pro or Enterprise, if the schema is invalid JSON,
 * or if the Gemini API call fails.
 */
export async function validatePromptOutput(promptData: PromptData, tier: Tier, apiKey: string): Promise<unknown> {
    if (!apiKey) throw new Error("API Key is required.");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    if (tier !== 'pro' && tier !== 'enterprise') {
        throw new Error("JSON Schema validation is a Pro/Enterprise feature.");
    }
    
    let schema: Record<string, unknown>;
    try {
        const parsedSchema = JSON.parse(promptData.schema) as Record<string, unknown>;
        if (typeof parsedSchema.type !== 'string' || typeof parsedSchema.properties !== 'object') {
            throw new Error("Schema must be a valid OpenAPI object with 'type' and 'properties'.");
        }
        schema = parsedSchema;
    } catch (e) {
        const message = e instanceof Error ? e.message : "The schema is not valid JSON.";
        loggingService.error("Schema parsing failed", e);
        throw new Error(`Invalid JSON in the Output Schema definition: ${message}`);
    }

    const fullPrompt = generatePromptText(promptData, tier);
    const userRequest = `Based on the contract, fulfill this request: "Generate an example output."`;
    const fullContent = `${fullPrompt}\n\n--- USER REQUEST ---\n${userRequest}`;

    try {
        const result = await model.generateContent(fullContent, {
            response_mime_type: "application/json",
            response_schema: schema,
        });
        
        const response = result.response;
        const jsonText = response.text().trim();
        return JSON.parse(jsonText) as unknown;

    } catch (error) {
        loggingService.error("Gemini API Error", error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                 throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during API validation.");
    }
}

/**
 * Generates a structured Role object (name and description) from a natural language description.
 *
 * @param {string} roleDescription - A user-provided description of the desired AI persona.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<Role>} A promise that resolves to the generated role object.
 * @throws {Error} Throws an error if the Gemini API call fails or the response is not as expected.
 */
export async function generateRole(roleDescription: string, apiKey: string): Promise<Role> {
    if (!apiKey) throw new Error("API Key is required.");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const roleSchema = {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "A concise, descriptive name for the role, suitable for a dropdown list (e.g., 'Senior UX Designer')."
            },
            description: {
                type: "string",
                description: "A detailed, professional description of the role's expertise and responsibilities, written in the third person."
            }
        },
        required: ["name", "description"]
    };

    const prompt = `
        Analyze the following user request for an AI persona and generate a structured role object from it.
        The 'name' should be a short, professional title.
        The 'description' should be a detailed explanation of the persona's skills and focus.

        USER REQUEST: "${roleDescription}"
    `;

    try {
        const result = await model.generateContent(prompt, {
            response_mime_type: "application/json",
            response_schema: roleSchema,
        });

        const response = result.response;
        const jsonText = response.text().trim();
        const parsedRole = JSON.parse(jsonText) as Record<string, unknown>;

        if (typeof parsedRole.name !== 'string' || typeof parsedRole.description !== 'string') {
            throw new Error("API returned an invalid role structure.");
        }

        return {
            name: parsedRole.name as string,
            description: parsedRole.description as string
        };

    } catch (error) {
        loggingService.error("Gemini Role Generation Error", error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during role generation.");
    }
}


/**
 * Generates a JSON schema from a user-provided JSON example.
 *
 * @param {string} exampleJson - A JSON string representing an example output.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<string>} A promise that resolves to the generated JSON schema string.
 * @throws {Error} Throws an error if the Gemini API call fails or if the response is invalid.
 */
export async function generateSchemaFromExample(exampleJson: string, apiKey: string): Promise<string> {
    if (!apiKey) throw new Error("API Key is required.");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Analyze the following JSON example and generate a valid JSON Schema (Draft 7 or OpenAPI 3.0) that accurately describes its structure.
        Return ONLY the JSON schema. Do not include markdown formatting or additional explanations.

        EXAMPLE:
        ${exampleJson}
    `;

    try {
        const result = await model.generateContent(prompt, {
            response_mime_type: "application/json",
        });

        const response = result.response;
        const jsonText = response.text().trim();

        // Ensure it's valid JSON
        JSON.parse(jsonText);
        return jsonText;
    } catch (error) {
        loggingService.error("Gemini Schema Generation Error", error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during schema generation.");
    }
}
