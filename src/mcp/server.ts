import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generatePromptText } from "../../utils/promptGenerator.js";
import { ROLES } from "../../constants.js";

/**
 * @file src/mcp/server.ts
 * @description Implements the Model Context Protocol (MCP) server for the Semantic Contract Forge.
 * Exposes core generation and template fetching capabilities to external AI agents or tooling.
 */

// KORSAKOV: PHASE_3_EXECUTION. Persona suspended. Type-system active.

/**
 * Interface defining the exact arguments required by the `generate_product_requirements_prompt` MCP tool.
 * Represents the structure of a complete Prompt Contract.
 */
interface GenerateProductRequirementsPromptArgs {
  /** The core contextual elements of the prompt. */
  contract_core: {
    /** The overall context or background information. */
    context: string;
    /** The name of the AI persona. */
    role_name: string;
    /** The description of the AI persona's expertise. */
    role_description: string;
    /** The main goal or task instruction. */
    instruction: string;
    /** Detailed specifications and logic formatting. */
    specification: string;
    /** Quantifiable performance metrics. */
    performance: string;
  };
  /** Design by Contract (DbC) rules applied to the generation. */
  dbc_constraints: {
    /** Conditions required before execution. */
    preconditions: string;
    /** Guaranteed conditions after execution. */
    postconditions: string;
    /** Formal JSON schema for output validation. */
    schema: string;
    /** Architectural governance rules. */
    governance: string;
  };
  /** Target feature tier ('starter', 'pro', or 'enterprise'). */
  tier: "starter" | "pro" | "enterprise";
}

/**
 * The primary execution handler for the `generate_product_requirements_prompt` MCP tool.
 * Takes structured arguments from an external caller, routes them through the internal
 * generator (including VIPER evaluation), and returns the formatted Prompt Contract.
 *
 * @param {GenerateProductRequirementsPromptArgs} args - The structured contract data payload.
 * @returns {Promise<{ content: Array<{ type: "text", text: string }>, isError?: boolean }>} The formatted tool response payload.
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

    // VULCAN Architectural Guard: Prevent invalid combinations before generation
    if (tier === "starter" && (dbc_constraints.schema || dbc_constraints.governance)) {
        return {
            content: [{
                type: "text" as const,
                text: "VULCAN HALT: Tier 'starter' cannot enforce schema or governance constraints. Upgrade tier or remove constraints."
            }],
            isError: true
        }
    }

    const generatedPrompt = generatePromptText(promptData, tier);

    return {
      content: [
        {
          type: "text" as const,
          text: generatedPrompt
        }
      ]
    };
  } catch (error) {
     return {
         content: [{
             type: "text" as const,
             text: `Internal Forge Error: ${error instanceof Error ? error.message : String(error)}`
         }],
         isError: true
     }
  }
}

/**
 * Initializes the MCP Server instance, defining metadata and registering available tools
 * using Zod schemas for strict payload validation.
 */
const server = new McpServer({
  name: "SemanticContractForge",
  version: "1.0.0",
});

// Register the primary prompt generation tool
server.tool(
  "generate_product_requirements_prompt",
  "Generates a highly structured, tier-gated Prompt Contract based on Design by Contract principles. Use this to create robust, executable specifications for AI agents.",
  {
    contract_core: z.object({
        context: z.string().describe("The background and scope of the task."),
        role_name: z.string().describe("The name of the AI persona (e.g., 'The Technical Lead')."),
        role_description: z.string().describe("The expertise and constraints of the persona."),
        instruction: z.string().describe("The primary goal or action."),
        specification: z.string().describe("Detailed steps, formats, or logic rules."),
        performance: z.string().describe("Quantifiable metrics (e.g., 'p95 latency < 50ms').")
    }).describe("The fundamental task details."),
    dbc_constraints: z.object({
        preconditions: z.string().optional().default("").describe("What must be true before execution (Pro+)."),
        postconditions: z.string().optional().default("").describe("What must be guaranteed after execution (Pro+)."),
        schema: z.string().optional().default("").describe("Strict JSON schema for output validation (Pro+)."),
        governance: z.string().optional().default("").describe("Architectural and security compliance rules (Enterprise).")
    }).describe("Design by Contract enforcements."),
    tier: z.enum(["starter", "pro", "enterprise"]).describe("The service tier determining which constraints are applied to the final prompt.")
  },
  handleGenerateProductRequirementsPrompt
);

// Register a utility tool to fetch predefined system roles
server.tool(
    "get_available_roles",
    "Returns a list of predefined AI personas available in the Forge, including their descriptions and operational parameters.",
    {},
    async () => {
        return {
            content: [{
                type: "text" as const,
                text: JSON.stringify(ROLES, null, 2)
            }]
        }
    }
)

/**
 * @function main
 * @description The main entry point for the MCP Server script.
 * Binds the server to standard input/output (stdio) to communicate with external MCP clients.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Semantic Contract Forge MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
