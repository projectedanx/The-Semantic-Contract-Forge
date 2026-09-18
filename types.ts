/**
 * @file types.ts
 * @description Core TypeScript types, interfaces, and discriminated unions used throughout
 * the Semantic Contract Forge (SCF) application. These types ensure strict type safety,
 * avoiding the `any` type per GEMINI.md guidelines, and provide a unified contract
 * for prompt generation, template handling, and validation.
 */

/**
 * Represents the tiers of service available in the application, determining access
 * to advanced features like schemas, preconditions, and governance constraints.
 */
export type Tier = 'starter' | 'pro' | 'enterprise';

/**
 * Represents an AI persona or role that can be assigned to influence the style,
 * expertise, and constraints of the generated output.
 */
export interface Role {
  /**
   * The display name of the role (e.g., "The Technical Lead").
   * @type {string}
   */
  name: string;
  /**
   * A detailed description of the role's purpose, expertise, and specific operational constraints or metrics.
   * @type {string}
   */
  description: string;
}

/**
 * Represents geometric and topological constraints for non-Euclidean latent space navigation.
 * Part of Project Aurelius (Phase 1).
 */
export interface GeometricConstraints {
  /** The type of manifold or topology (e.g., 'Euclidean', 'Hyperbolic', 'Spherical'). */
  topologyType: string;
  /** The Gaussian curvature value. */
  curvature: number;
  /** The coordinate system to use (e.g., 'Cartesian', 'Polar', 'Poincare Disk'). */
  coordinateSystem: string;
  /** The number of spatial dimensions. */
  dimensions: number;
}

/**
 * Represents all the fields in the prompt editor, forming the core of a prompt contract.
 * This acts as an executable specification detailing what, how, and under what constraints the AI should operate.
 */
export interface PromptData {
  /** The overall context or background information for the prompt. */
  context: string;
  /** The specific AI persona assigned to execute the prompt. */
  role: Role;
  /** The main instruction or goal for the AI to accomplish. */
  instruction: string;
  /** Detailed specifications, step-by-step logic, or formatting requirements. */
  specification: string;
  /** Objective, quantifiable performance metrics (e.g., "p95 latency < 50ms"). */
  performance: string;
  /** Strict conditions that must be true *before* the AI executes the task. */
  preconditions: string;
  /** Strict conditions that must be true *after* the AI executes the task. */
  postconditions: string;
  /** A strict JSON schema defining the required structure of the AI's output. */
  schema: string;
  /** High-level governance constraints, security rules, or constitutional AI bounds. */
  governance: string;
  /** Optional geometric and topological constraints to enforce spatial structure. */
  geometryMatrix?: GeometricConstraints;
}

/**
 * Represents a prompt contract that has been saved to local storage.
 * It extends `PromptData` with identification and user-defined naming.
 */
export interface SavedPromptContract extends PromptData {
  /** A unique identifier (UUID) for the saved contract. */
  id: string;
  /** A user-provided name to identify the contract in the UI. */
  name: string;
}

/**
 * Represents the outcome of a validation attempt (e.g., JSON schema validation).
 * Implemented as a discriminated union for safe type narrowing.
 */
export type ValidationResult =
  | {
      /** Indicates a successful validation. */
      success: true;
      /** The successfully validated data payload. Cast explicitly when using. */
      data: unknown;
    }
  | {
      /** Indicates a failed validation. */
      success: false;
      /** A descriptive error message detailing why validation failed. */
      error: string;
    };

/**
 * Represents a pre-defined or user-defined template for a prompt contract.
 * Used to kickstart the contract creation process.
 */
export interface PromptTemplate {
  /** A unique identifier for the template (e.g., 'scf-template-xxx' for user templates). */
  id: string;
  /** The display name of the template. */
  name: string;
  /** A short description of the template's purpose and intended use case. */
  description: string;
  /** The minimum tier required to effectively use this template. */
  tier: Tier;
  /** The partial or complete prompt data pre-filled by the template. */
  prompt: Partial<PromptData>;
}

/**
 * Represents the structured analysis of Human-AI synergy within a prompt contract,
 * utilized by the TACT Lens feature.
 */
export interface SynergyAnalysis {
  /** A list of responsibilities or tasks explicitly afforded to the human. */
  humanAffordances: string[];
  /** A list of responsibilities or tasks explicitly afforded to the AI. */
  aiAffordances: string[];
  /** A list of operational constraints or friction points identified in the contract. */
  operationalConstraints: string[];
  /** A quantified score (e.g., 0-100) representing the synergy or balance of the contract. */
  synergyScore: number;
}

/**
 * Represents the outcome of a synergy analysis attempt.
 * Implemented as a discriminated union for safe type narrowing.
 */
export type SynergyResult =
  | {
      /** Indicates successful analysis. */
      success: true;
      /** The detailed synergy analysis data. */
      data: SynergyAnalysis;
    }
  | {
      /** Indicates the analysis failed. */
      success: false;
      /** A descriptive error message detailing why the analysis failed. */
      error: string;
    };

/**
 * Represents an administrative user instance for the multi-user dashboard.
 */
export interface UserInstance {
  /** The unique identifier of the user. */
  id: string;
  /** The email address of the user. */
  email: string;
  /** The administrative role of the user. */
  role: 'admin' | 'user';
  /** The subscribed tier of the user. */
  tier: Tier;
  /** The current account status. */
  status: 'active' | 'inactive';
  /** The last login timestamp. */
  lastLogin: string;
}

/**
 * Represents system metrics for the administrative dashboard.
 */
export interface AdminMetrics {
  /** The number of currently active user instances. */
  activeInstances: number;
  /** Total queries processed in the last 24 hours. */
  totalQueries24h: number;
  /** Average response latency in milliseconds. */
  avgLatencyMs: number;
  /** System error rate as a decimal (e.g., 0.012 for 1.2%). */
  errorRate: number;
}

/**
 * Represents the Minimal Explainability Metadata Schema (MEMS) for Qualitative Ingestion.
 * A structured, version-controlled, and cryptographically verifiable repository designed
 * to compile "lived experience" into highly grounded, drift-resistant context payloads.
 */
export interface QualitativeExperienceNode {
  /** A unique identifier for the node matching pattern "^QEN-{8}-[a-f0-9]{4}$". */
  node_id: string;
  /** ISO 8601 date-time string anchoring the experience. */
  temporal_anchor: string;
  /** The payload containing the raw lived experience and counterfactuals. */
  qualitative_payload: {
    /** The type of the experience recorded. */
    experience_type: 'Direct_Trial' | 'Failure_Incident' | 'Socratic_Review';
    /** Unfiltered, jargon-free log of the qualitative phenomenon. */
    raw_observation: string;
    /** What failed to occur, documenting unchosen trajectories. */
    counterfactual_variance: string;
  };
  /** Indicators tracking sensory perturbation and structural variations. */
  sensory_causal_indicators: {
    /** A numeric index from 0 to 10. */
    causal_perturbation_index: number;
    /** A numeric value from 0 to 1. */
    structural_roughness: number;
  };
  /** Explicit links to baseline semantic genome schemas. */
  ontological_alignments: string[];
  /** Cryptographic attestation of the creator's identity. */
  cryptographic_provenance: {
    /** Decentralized Identifier of the agent/creator. */
    agent_did: string;
    /** Verifiable signature securing the payload. */
    verifiable_signature: string;
  };
}
