import re

with open('services/geminiService.ts', 'r') as f:
    content = f.read()

new_function = """
/**
 * Project Aurelius - Phase 2: Plausibility Oracle
 * Validates the physical and geometric "truth" of the generated output against physical laws.
 *
 * @param {PromptData} promptData - The original prompt data including geometric constraints.
 * @param {string} generatedOutput - The output generated from the initial prompt.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<{score: number, suggestedConstraints: string}>} The evaluation result.
 */
export async function validatePlausibility(promptData: PromptData, generatedOutput: string, apiKey: string): Promise<{score: number, suggestedConstraints: string}> {
    if (!apiKey) throw new Error("API Key is required.");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const oracleSchema = {
        type: "object",
        properties: {
            score: {
                type: "number",
                description: "A physical plausibility score from 0 to 100 assessing geometric consistency and structural integrity based on the requested topology."
            },
            suggestedConstraints: {
                type: "string",
                description: "Specific actionable constraints to append to the prompt to correct any physical or geometric anomalies detected in the output."
            }
        },
        required: ["score", "suggestedConstraints"]
    };

    const geometryContext = promptData.geometryMatrix ? `Target Topology: ${promptData.geometryMatrix.topologyType}, Curvature: ${promptData.geometryMatrix.curvature}` : 'Standard Euclidean Geometry';

    const prompt = `
        You are the Plausibility Oracle. Your task is to act as a proxy for a physics and ray-tracing engine.
        Critique the following generated output based on strict physical laws and the requested geometric constraints.

        GEOMETRIC CONTEXT:
        ${geometryContext}

        GENERATED OUTPUT TO EVALUATE:
        ${generatedOutput}

        Return a JSON object with a 'score' (0-100) indicating physical plausibility and 'suggestedConstraints' to fix any detected errors.
    `;

    try {
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: oracleSchema as unknown as import("@google/generative-ai").ResponseSchema } });

        const response = result.response;
        const jsonText = response.text().trim();
        const parsedEvaluation = JSON.parse(jsonText) as Record<string, unknown>;

        if (typeof parsedEvaluation.score !== 'number' || typeof parsedEvaluation.suggestedConstraints !== 'string') {
            throw new Error("API returned an invalid oracle evaluation structure.");
        }

        return {
            score: parsedEvaluation.score as number,
            suggestedConstraints: parsedEvaluation.suggestedConstraints as string
        };

    } catch (error) {
        loggingService.error("Gemini Oracle Validation Error", new Error(error instanceof Error ? error.message : "Unknown error"));
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                throw new Error(`Gemini API Error: Invalid or missing API Key.`);
            }
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during Oracle validation.");
    }
}
"""

content = content + "\n" + new_function

with open('services/geminiService.ts', 'w') as f:
    f.write(content)
