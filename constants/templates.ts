
import { PromptTemplate } from '../types';
import { ROLES } from '../constants';

export const TEMPLATES: PromptTemplate[] = [
  {
    id: 'template-react-component',
    name: 'React Component Generator',
    description: 'A starter template for generating a React functional component using TypeScript and Tailwind CSS.',
    tier: 'starter',
    prompt: {
      role: ROLES.find(r => r.name === 'The Web App Designer'),
      context: 'You are building a reusable component for a modern web application using React, TypeScript, and Tailwind CSS.',
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
      performance: 'The query should be performant and use appropriate indexes if mentioned.',
      governance: 'The query MUST NOT select Personally Identifiable Information (PII) other than `email`.\nAll table access must be through the `read_only` database role.',
    },
  },
];
