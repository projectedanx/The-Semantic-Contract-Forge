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
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: fullContent }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema as unknown as import("@google/generative-ai").ResponseSchema } });
        
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
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: roleSchema as unknown as import("@google/generative-ai").ResponseSchema } });

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
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } });

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

/**
 * Evaluates the human-AI synergy of a prompt contract using the TACT (Technology Affordance and Constraints Theory) lens.
 *
 * @param {PromptData} promptData - The data object for the prompt contract.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<unknown>} A promise that resolves to the parsed SynergyAnalysis JSON object.
 * @throws {Error} Throws an error if the API key is missing, or if the Gemini API call fails.
 */
export async function analyzeSynergy(promptData: PromptData, apiKey: string): Promise<unknown> {
    if (!apiKey) throw new Error("API Key is required.");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const synergySchema = {
        type: "object",
        properties: {
            humanAffordances: {
                type: "array",
                items: { type: "string" },
                description: "List of explicit values the human provides that the AI cannot (e.g., local context, ethical judgment, strategic intent)."
            },
            aiAffordances: {
                type: "array",
                items: { type: "string" },
                description: "List of explicit values the AI provides that the human cannot scale (e.g., pattern synthesis across millions of files, high-speed computational geometry)."
            },
            operationalConstraints: {
                type: "array",
                items: { type: "string" },
                description: "List of constraints or tensions identified between the human's unstructured workflow and the AI's deterministic logic."
            },
            synergyScore: {
                type: "number",
                description: "A numerical score (0-100) representing the orthogonality and complementary nature of the Human/AI responsibilities defined in the contract."
            }
        },
        required: ["humanAffordances", "aiAffordances", "operationalConstraints", "synergyScore"]
    };

    const promptText = generatePromptText(promptData, 'enterprise'); // Always use enterprise tier to see all fields for analysis

    const prompt = `
        Analyze the following Prompt Contract using the Technology Affordance and Constraints Theory (TACT) lens.
        Determine exactly what value the Human is bringing to this workflow, and what value the AI is bringing.
        Identify where neither can operate alone. Identify the operational friction or constraints present in the task.
        Return the analysis strictly conforming to the provided JSON schema.

        PROMPT CONTRACT:
        ${promptText}
    `;

    try {
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: synergySchema as unknown as import("@google/generative-ai").ResponseSchema } });

        const response = result.response;
        const jsonText = response.text().trim();
        const parsedSynergy = JSON.parse(jsonText) as unknown;

        return parsedSynergy;

    } catch (error) {
        loggingService.error("Gemini Synergy Analysis Error", error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during synergy analysis.");
    }
}
