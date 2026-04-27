
import { PromptTemplate } from '../types';
import { ROLES } from '../constants';

/**
 * @const {PromptTemplate[]} TEMPLATES
 * @description A list of built-in, pre-defined prompt templates available to all users.
 * Each template provides a starting point for a common use case.
 */
export const TEMPLATES: PromptTemplate[] = [
  {
    id: 'template-react-component',
    name: 'React Component Generator',
    description: 'A starter template for generating a React functional component using TypeScript and Tailwind CSS.',
    tier: 'starter',
    prompt: {
      role: ROLES.find(r => r.name === 'The Web App Designer'),
      context: 'You are building a reusable component for a shadcn / custom tokens web application using React, TypeScript, and Tailwind CSS.',
      instruction: 'Generate a React functional component based on the provided specification.',
      specification: 'The component should be named [ComponentName].\nIt must accept the following props: [props definitions].\nIt should be styled with Tailwind CSS.\nIt must not use any state management libraries.',
      performance: 'The component should be well-structured, readable, and follow React best practices. Include prop type definitions.',
    },
  },
  {
    id: 'template-api-service',
    name: 'API Service Function',
    description: 'A pro-level template for generating a TypeScript function to fetch data from a REST API, with JSON schema enforcement.',
    tier: 'pro',
    prompt: {
      role: ROLES.find(r => r.name === 'The Technical Lead'),
      context: 'You are writing a service layer for a web application to interact with a third-party REST API.',
      instruction: 'Write a TypeScript async function to fetch data from a given API endpoint and validate the response.',
      specification: 'The function should be named `fetch[Resource]Data`.\nIt should take a URL as a string parameter.\nIt must handle potential network errors gracefully by throwing a custom error.\nIt must validate the JSON response against the provided schema.',
      preconditions: 'The provided URL must be a valid, reachable HTTP endpoint.',
      postconditions: 'The function must return a promise that resolves with the validated data object, conforming to the OUTPUT SCHEMA.',
      schema: JSON.stringify({
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          data: { type: "object" },
        },
        required: ["id", "name"],
      }, null, 2),
    },
  },
  {
    id: 'template-sql-query',
    name: 'Secure SQL Query Generator',
    description: 'An enterprise template for generating a secure SQL query that adheres to governance rules.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'The Security Analyst'),
      context: 'You are generating a SQL query for a critical financial reporting system. Security and data integrity are paramount.',
      instruction: 'Generate a SQL SELECT statement to retrieve user data based on the specification.',
      specification: 'The query must select `user_id`, `email`, and `created_at` from the `users` table.\nIt must filter users by `status=\'active\'`.\nIt must prevent SQL injection vulnerabilities.',
      performance: 'The query should be p95 latency < 50ms; bundle size < 100KB and use appropriate indexes if mentioned.',
      governance: 'The query MUST NOT select Personally Identifiable Information (PII) other than `email`.\nAll table access must be through the `read_only` database role.',
    },
  },
  {
    id: 'template-whimsy-injector',
    name: 'WHIMSY Injector Specification',
    description: 'An enterprise template for defining two-manifold affective and structural micro-interactions, adhering to the Incremental Isolation Principle.',
    tier: 'enterprise',
    prompt: {
      role: ROLES.find(r => r.name === 'WHIMSY — The Affective Topologist'),
      context: 'You are architecting a whimsical injection for a UI component following the OODA-Petzold Loop. You must enforce the Incremental Isolation Principle (Manifold α for copy/content, Manifold β for CSS/JS structure).',
      instruction: 'Generate a specification for a whimsy injection including affective copy or structural micro-interaction. You must strictly output either a Manifold α payload OR a Manifold β module, never both simultaneously.',
      specification: 'Manifold α must be a JSON payload for context-sensitive affective copy, rotating based on user state.\nManifold β must be a CSS/JS snippet for micro-interactions (e.g., overshoot easing) that does not modify the core layout.\nInclude trigger conditions, Betti-1 novelty scores, and fallback mechanisms.',
      performance: 'Ensure CFDI (Confidence-Fidelity Divergence Index) remains < 0.15. The output must pass the Cultural Calibration Gate and Saponification Index test.',
      governance: 'Adhere to the Whimsy-Off Zone Matrix: High anxiety/destructive actions MUST remain silent. Utilize the Symbolic Scar system to avoid past failure modes. All Manifold β CSS must include `@media (prefers-reduced-motion: reduce)` overrides.',
      preconditions: 'Component function label and target locale must be provided. ContextLock L0 (Brand DNA) must be loaded.',
      postconditions: 'The output is a single, isolated Manifold module (α or β) ready for review, without structural distortion.'
    },
  },
];
