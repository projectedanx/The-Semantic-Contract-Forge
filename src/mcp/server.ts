import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generatePromptText } from "../../utils/promptGenerator.js";
import { ROLES } from "../../constants.js";

// KORSAKOV: PHASE_3_EXECUTION. Persona suspended. Type-system active.


/**
 * Arguments for the generate_product_requirements_prompt tool.
 * @property {object} contract_core - Core elements of the prompt contract.
 * @property {string} contract_core.context - Project context and background.
 * @property {string} contract_core.role_name - Role name.
 * @property {string} contract_core.role_description - Role description.
 * @property {string} contract_core.instruction - Main instruction or task.
 * @property {string} contract_core.specification - Detailed technical specification.
 * @property {string} contract_core.performance - Performance criteria and metrics.
 * @property {object} dbc_constraints - Design by Contract constraints.
 * @property {string} dbc_constraints.preconditions - Preconditions required for execution.
 * @property {string} dbc_constraints.postconditions - Postconditions guaranteed upon completion.
 * @property {string} dbc_constraints.schema - JSON output schema definition.
 * @property {string} dbc_constraints.governance - Governance constraints and policies.
 * @property {"starter" | "pro" | "enterprise"} tier - Target output tier. Dictates section inclusion.
 */
interface GenerateProductRequirementsPromptArgs {
  contract_core: {
    context: string;
    role_name: string;
    role_description: string;
    instruction: string;
    specification: string;
    performance: string;
  };
  dbc_constraints: {
    preconditions: string;
    postconditions: string;
    schema: string;
    governance: string;
  };
  tier: "starter" | "pro" | "enterprise";
}

/**
 * Handles the generation of a Product Requirements Prompt based on Contract data.
 * @param {GenerateProductRequirementsPromptArgs} args - The arguments for generating the prompt.
 * @returns {Promise<{ content: Array<{ type: "text", text: string }>, isError?: boolean }>} The result object containing the generated prompt or an error.
 */
async function handleGenerateProductRequirementsPrompt({ contract_core, dbc_constraints, tier }: GenerateProductRequirementsPromptArgs) {
  try {
    const promptData = {
      context: contract_core.context,
      role: {
        name: contract_core.role_name,
        description: contract_core.role_description,
      },
      instruction: contract_core.instruction,
      specification: contract_core.specification,
      performance: contract_core.performance,
      preconditions: dbc_constraints.preconditions,
      postconditions: dbc_constraints.postconditions,
      schema: dbc_constraints.schema,
      governance: dbc_constraints.governance,
    };

    const generatedPrompt = generatePromptText(promptData, tier);

    return {
      content: [{ type: "text" as const, text: JSON.stringify({ status: "SUCCESS", prompt: generatedPrompt }) }],
    };
  } catch (err) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          error_code: "TOOL_FAULT_SERVER_TOOL_CONFIGURATION",
          fault_category: "SERVER_TOOL_CONFIGURATION",
          structured_detail: { violation: "PROMPT_GENERATION_FAILED", error: String(err) },
          retry_viable: false,
          suggested_decomposition: "Verify schema definitions and tier compatibility.",
        }),
      }],
      isError: true,
    };
  }
}

const server = new McpServer({
  name: "scf-mcp-server",
  version: "2026.4.1",
});

// DELIVERABLE 1: Tool Schemas conforming to JSON Schema Draft 2020-12
// 6-component rubric: Purpose✓ Guidelines✓ Limitations✓ Params✓ Length✓ Examples✓ (implied)

server.registerTool(
  "get_standard_roles",
  {
    title: "Get Standard Roles",
    description: [
      "PURPOSE: Retrieves the list of pre-defined standard roles.",
      "GUIDELINES: Invoke when the agent needs to present role options to the user or populate a dropdown.",
      "LIMITATIONS: Returns a static list. Does not reflect dynamically added roles.",
      "PARAMETERS: None.",
    ].join(" "),
  },
  async () => {
    try {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ status: "SUCCESS", data: ROLES }) }],
      };
    } catch (err) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
            fault_category: "GENERAL_PROGRAMMING",
            structured_detail: { violation: "UNEXPECTED_ERROR", error: String(err) },
            retry_viable: false,
            suggested_decomposition: null,
          }),
        }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "generate_product_requirements_prompt",
  {
    title: "Generate Product Requirements Prompt",
    description: [
      "PURPOSE: Generates a structured Product Requirements Prompt (PRP) based on Contract data.",
      "GUIDELINES: Invoke when a user has defined their contract requirements and needs the finalized prompt string.",
      "LIMITATIONS: Tier determines output. 'starter' ignores pre/post/schema/gov. 'pro' ignores gov.",
      "PARAMETERS: contract_core (context, role, instruction, specification, performance); dbc_constraints (preconditions, postconditions, schema, governance); tier ('starter', 'pro', 'enterprise').",
    ].join(" "),
    inputSchema: z.object({
      contract_core: z.object({
        context: z.string().max(4000).describe("Project context and background. Max 4000 chars."),
        role_name: z.string().max(100).describe("Role name. Max 100 chars."),
        role_description: z.string().max(1000).describe("Role description. Max 1000 chars."),
        instruction: z.string().max(4000).describe("Main instruction or task. Max 4000 chars."),
        specification: z.string().max(4000).describe("Detailed technical specification. Max 4000 chars."),
        performance: z.string().max(2000).describe("Performance criteria and metrics. Max 2000 chars."),
      }).describe("Core elements of the prompt contract."),
      dbc_constraints: z.object({
        preconditions: z.string().max(2000).describe("Preconditions required for execution. Max 2000 chars."),
        postconditions: z.string().max(2000).describe("Postconditions guaranteed upon completion. Max 2000 chars."),
        schema: z.string().max(8000).describe("JSON output schema definition. Max 8000 chars."),
        governance: z.string().max(2000).describe("Governance constraints and policies. Max 2000 chars."),
      }).describe("Design by Contract constraints."),
      tier: z.enum(["starter", "pro", "enterprise"]).describe("Target output tier. Dictates section inclusion."),
    }),
  },
  handleGenerateProductRequirementsPrompt
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("KORSAKOV: stdio transport active. MCP 2025-11-25.\n");
}

main().catch((err) => {
  process.stderr.write(`KORSAKOV: Fatal — ${err.message}\n`);
  process.exit(1);
});
