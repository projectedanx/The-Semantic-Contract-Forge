
import React, { useCallback, useState } from 'react';
import { PromptData, Tier, Role } from '../types';
import { ROLES } from '../constants';
import RoleGenerationModal from './RoleGenerationModal';
import { generateRole } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

/**
 * @interface PromptEditorProps
 * @description Props for the PromptEditor component.
 * @property {PromptData} promptData - The current state of the prompt contract data.
 * @property {React.Dispatch<React.SetStateAction<PromptData>>} setPromptData - The state setter function to update the prompt data.
 * @property {Tier} currentTier - The user's current tier, used to lock/unlock features.
 */
interface PromptEditorProps {
  promptData: PromptData;
  setPromptData: React.Dispatch<React.SetStateAction<PromptData>>;
  currentTier: Tier;
  roles: Role[];
  onRoleGenerated: (newRole: Role) => void;
}

/**
 * @component Section
 * @description A reusable component for creating a labeled section with a title and description.
 * It can be visually locked based on the `isLocked` prop.
 * @param {{ title: string; description: string; children: React.ReactNode; isLocked?: boolean }} props - The props for the component.
 * @returns {React.ReactElement} The rendered section component.
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
 * @component TextArea
 * @description A styled, reusable textarea component that forwards all standard textarea attributes.
 * @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - The props for the textarea element.
 * @returns {React.ReactElement} The rendered textarea component.
 */
const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
    rows={4}
  />
);

/**
 * @component PromptEditor
 * @description The main component for editing the fields of a prompt contract.
 * It is composed of multiple sections, some of which are conditionally disabled based on the user's tier.
 * @param {PromptEditorProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered prompt editor form.
 */
const PromptEditor: React.FC<PromptEditorProps> = ({ promptData, setPromptData, currentTier, roles, onRoleGenerated }) => {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'role') {
        const selectedRole = roles.find(r => r.name === value) || roles[0];
        setPromptData(prev => ({ ...prev, role: selectedRole }));
    } else {
        setPromptData(prev => ({ ...prev, [name]: value }));
    }
  }, [setPromptData, roles]);

  const isProOrEnterprise = currentTier === 'pro' || currentTier === 'enterprise';
  const isEnterprise = currentTier === 'enterprise';
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleRoleSuccess = (newRole: Role) => {
    onRoleGenerated(newRole);
    setIsRoleModalOpen(false); // Close modal on success
  };

  return (
    <>
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
              onClick={() => setIsRoleModalOpen(true)}
              className="px-3 py-2 bg-amber-500/10 text-amber-300 rounded-md border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-2"
              title="Generate Role with AI"
            >
              <SparklesIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 p-2 bg-slate-900/50 rounded">{promptData.role.description}</p>
        </Section>

        <Section title="Instruction" description="The primary task or command for the AI.">
          <TextArea name="instruction" value={promptData.instruction} onChange={handleChange} placeholder="e.g., Generate a React functional component named 'ProductCard'..." />
      </Section>

      <Section title="Specification" description="Detailed requirements, constraints, and output format.">
        <TextArea name="specification" value={promptData.specification} onChange={handleChange} placeholder="e.g., The component must use Tailwind CSS, accept props 'name' (string) and 'price' (number)..." />
      </Section>

      <Section title="Performance" description="Define the quality criteria for the AI's output.">
        <TextArea name="performance" value={promptData.performance} onChange={handleChange} />
      </Section>

      <Section title="Preconditions" description="Conditions that must be true before execution (Pro Tier)." isLocked={!isProOrEnterprise}>
        <TextArea name="preconditions" value={promptData.preconditions} onChange={handleChange} disabled={!isProOrEnterprise} placeholder="e.g., The 'product' prop object must not be null."/>
      </Section>

      <Section title="Postconditions" description="Conditions that must be true after execution (Pro Tier)." isLocked={!isProOrEnterprise}>
        <TextArea name="postconditions" value={promptData.postconditions} onChange={handleChange} disabled={!isProOrEnterprise} placeholder="e.g., The output must be a single, valid TSX file content." />
      </Section>
      
      <Section title="JSON Output Schema" description="Enforce a specific JSON structure for the output (Pro Tier)." isLocked={!isProOrEnterprise}>
        <textarea name="schema" value={promptData.schema} onChange={handleChange} disabled={!isProOrEnterprise} className="w-full p-2 bg-slate-900 border font-mono text-sm border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" rows={8}/>
      </Section>

      <Section title="Governance" description="Constitutional principles and safety constraints (Enterprise Tier)." isLocked={!isEnterprise}>
        <TextArea name="governance" value={promptData.governance} onChange={handleChange} disabled={!isEnterprise} />
      </Section>
    </div>
    <RoleGenerationModal
      isOpen={isRoleModalOpen}
      onClose={() => setIsRoleModalOpen(false)}
      onGenerate={generateRole}
      onSuccess={handleRoleSuccess}
    />
  </>
  );
};

export default PromptEditor;
