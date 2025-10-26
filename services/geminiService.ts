import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptData, Tier, Role } from '../types';
import { generatePromptText } from '../utils/promptGenerator';
import { loggingService } from './loggingService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

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
        if (typeof parsedSchema.type !== 'string' || typeof parsedSchema.properties !== 'object') {
            throw new Error("Schema must be a valid OpenAPI object with 'type' and 'properties'.");
        }
        schema = parsedSchema;
    } catch (e) {
        const message = e instanceof Error ? e.message : "The schema is not valid JSON.";
        loggingService.error("Schema parsing failed", e, { schema: promptData.schema });
        throw new Error(`Invalid JSON in the Output Schema definition: ${message}`);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
        return JSON.parse(jsonText);

    } catch (error) {
        loggingService.error("Gemini API Error", error, { prompt: fullPrompt });
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
 * @returns {Promise<Role>} A promise that resolves to the generated role object.
 * @throws {Error} Throws an error if the Gemini API call fails or the response is not as expected.
 */
export async function generateRole(roleDescription: string): Promise<Role> {
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
        const parsedRole = JSON.parse(jsonText);

        if (typeof parsedRole.name !== 'string' || typeof parsedRole.description !== 'string') {
            throw new Error("API returned an invalid role structure.");
        }

        return parsedRole;

    } catch (error) {
        loggingService.error("Gemini Role Generation Error", error, { description: roleDescription });
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during role generation.");
    }
}
