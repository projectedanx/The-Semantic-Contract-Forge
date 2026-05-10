import React, { useCallback, useState, useMemo } from 'react';
import { PromptData, Tier, Role } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import RoleGenerator from './RoleGenerator';
import SchemaSynthesizer from './SchemaSynthesizer';
import { generateRole } from '../services/geminiService';

/**
 * @file components/PromptEditor.tsx
 * @description Provides the central form interface for editing a `PromptData` contract.
 * Manages tiered feature locks, dynamic role generation, and schema synthesis integration.
 */

/**
 * Props for the PromptEditor component.
 */
export interface PromptEditorProps {
  /** The current state of the prompt data contract being edited. */
  promptData: PromptData;
  /** React state setter function to update the prompt data locally. */
  setPromptData: React.Dispatch<React.SetStateAction<PromptData>>;
  /** The currently active Tier level, determining which fields are editable. */
  currentTier: Tier;
  /** The array of available AI personas/roles. */
  roles: Role[];
  /** Callback fired when a new role is synthesized via the API. */
  onRoleGenerated: (newRole: Role) => void;
  /** The user's Gemini API key, passed down to generation sub-components. */
  apiKey: string;
}

/**
 * A reusable sub-component for rendering a labeled section of the editor.
 * Includes optional visual locking mechanisms for tiered feature gates.
 *
 * @param {object} props - Section configuration props.
 * @param {string} props.title - The main heading for the section.
 * @param {string} props.description - Helper text explaining the section's purpose.
 * @param {React.ReactNode} props.children - The form controls inside the section.
 * @param {boolean} [props.isLocked] - If true, visually dims the section and prevents interaction.
 * @returns {React.ReactElement} The styled section container.
 */
const Section: React.FC<{ title: string; description: string; children: React.ReactNode; isLocked?: boolean }> = ({ title, description, children, isLocked }) => (
  <div className={`relative p-4 border border-slate-700 rounded-lg ${isLocked ? 'opacity-50' : ''}`}>
    {isLocked && <div className="absolute inset-0 bg-slate-900/50 z-10 rounded-lg"></div>}
    <label className="block text-lg font-semibold text-slate-100">{title}</label>
    <p className="text-sm text-slate-400 mb-3">{description}</p>
    {children}
  </div>
);

/**
 * A styled, reusable textarea component that forwards all standard HTML attributes.
 *
 * @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - Standard textarea props.
 * @returns {React.ReactElement} The styled textarea element.
 */
const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
    rows={4}
  />
);

/**
 * The main component for editing the fields of a prompt contract.
 * Conditionally enables/disables sections (Preconditions, Schema, Governance)
 * based on the user's selected tier.
 *
 * @param {PromptEditorProps} props - Configuration and state control props.
 * @returns {React.ReactElement} The complete editor form UI.
 */
const PromptEditor: React.FC<PromptEditorProps> = ({ promptData, setPromptData, currentTier, roles, onRoleGenerated, apiKey }) => {

  /**
   * Memoized map of roles for O(1) lookups during dropdown selection.
   */
  const roleMap = useMemo(() => {
    const map = new Map<string, Role>();
    for (let i = 0; i < roles.length; i++) {
        map.set(roles[i].name, roles[i]);
    }
    return map;
  }, [roles]);

  /**
   * Generic change handler for textareas and selects, updating the central `PromptData` state.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>} e - The change event.
   * @returns {void}
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'role') {
        const selectedRole = roleMap.get(value) || roles[0];
        setPromptData(prev => ({ ...prev, role: selectedRole }));
    } else {
        setPromptData(prev => ({ ...prev, [name]: value }));
    }
  }, [setPromptData, roleMap, roles]);

  const isProOrEnterprise = currentTier === 'pro' || currentTier === 'enterprise';
  const isEnterprise = currentTier === 'enterprise';
  const [isRoleGeneratorVisible, setRoleGeneratorVisible] = useState(false);

  return (
    <div className="space-y-6 bg-slate-800/30 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-amber-300 border-b border-amber-300/20 pb-2">Prompt Contract Editor</h2>

      <Section title="Context" description="Set the background and scope for the AI.">
        <TextArea name="context" value={promptData.context} onChange={handleChange} placeholder="e.g., You are building a component for an e-commerce dashboard..." />
      </Section>

      <Section title="Role" description="Assign a specific persona to the AI.">
        <div className="flex gap-2">
          <select name="role" value={promptData.role.name} onChange={handleChange} className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition">
            {roles.map(role => <option key={role.name} value={role.name}>{role.name}</option>)}
          </select>
          <button
            onClick={() => setRoleGeneratorVisible(!isRoleGeneratorVisible)}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition font-semibold"
            title="Generate a new custom role"
          >
            <SparklesIcon className="w-5 h-5" />
          </button>
        </div>
        {isRoleGeneratorVisible && (
            <div className="mt-4">
                <RoleGenerator
                    disabled={!apiKey}
                    onGenerate={(persona) => generateRole(persona, apiKey)}
                    onRoleGenerated={(newRole) => {
                        onRoleGenerated(newRole);
                        setPromptData(prev => ({ ...prev, role: newRole }));
                        setRoleGeneratorVisible(false);
                    }}
                />
            </div>
        )}
      </Section>

      <Section title="Instruction" description="The main goal or action.">
        <TextArea name="instruction" value={promptData.instruction} onChange={handleChange} placeholder="e.g., Generate a React functional component..." />
      </Section>

      <Section title="Specification" description="Detailed steps, formats, or logic rules.">
        <TextArea name="specification" value={promptData.specification} onChange={handleChange} rows={6} placeholder="e.g., 1. The component must accept `title` and `data` props.\n2. Use Tailwind for styling..." />
      </Section>

      <Section title="Performance Criteria" description="Quantifiable metrics for success.">
        <TextArea name="performance" value={promptData.performance} onChange={handleChange} placeholder="e.g., The code must be fully typed without 'any'. Component must render under 10ms." />
      </Section>

      <Section title="Preconditions [PRO+]" description="Conditions that must be true before execution." isLocked={!isProOrEnterprise}>
        <TextArea name="preconditions" value={promptData.preconditions} onChange={handleChange} disabled={!isProOrEnterprise} placeholder="e.g., The provided API endpoint must be accessible." />
      </Section>

      <Section title="Postconditions [PRO+]" description="Conditions that must be true after execution." isLocked={!isProOrEnterprise}>
        <TextArea name="postconditions" value={promptData.postconditions} onChange={handleChange} disabled={!isProOrEnterprise} placeholder="e.g., The component must not mutate the original data prop." />
      </Section>

      <Section title="Output Schema [PRO+]" description="Strict JSON schema for the final output." isLocked={!isProOrEnterprise}>
        <SchemaSynthesizer
            currentSchema={promptData.schema}
            onSchemaUpdate={(schema) => setPromptData(prev => ({ ...prev, schema }))}
            disabled={!isProOrEnterprise || !apiKey}
            apiKey={apiKey}
        />
      </Section>

      <Section title="Governance [ENTERPRISE]" description="High-level rules, compliance, and architectural boundaries." isLocked={!isEnterprise}>
        <TextArea name="governance" value={promptData.governance} onChange={handleChange} disabled={!isEnterprise} placeholder="e.g., Must adhere to the VULCAN framework and prevent cross-domain state mutation calls." />
      </Section>
    </div>
  );
};

export default PromptEditor;
