
import React, { useState } from 'react';
import { Role } from '../types';
import { generateRole } from '../services/geminiService'; // This service will be created in the next step

/**
 * @interface RoleGeneratorProps
 * @description Props for the RoleGenerator component.
 * @property {(newRole: Role) => void} onRoleGenerated - Callback function to be invoked when a new role is successfully generated.
 */
interface RoleGeneratorProps {
  onRoleGenerated: (newRole: Role) => void;
}

/**
 * @const {string} EMOJI_BRAIN
 * @description Unicode emoji for a brain, used for the generate button.
 */
const EMOJI_BRAIN = '🧠';

/**
 * @component RoleGenerator
 * @description A component that allows users to generate a new AI role persona by describing it in natural language.
 * It interfaces with an AI service to create a structured Role object.
 * @param {RoleGeneratorProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered RoleGenerator component.
 */
const RoleGenerator: React.FC<RoleGeneratorProps> = ({ onRoleGenerated }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a description for the role.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newRole = await generateRole(description);
      onRoleGenerated(newRole);
      setDescription('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">Generate New Role</h3>
      <div className="flex flex-col gap-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., 'A cynical history professor who specializes in the fall of the Roman Empire'"
          className="bg-slate-900 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-full h-24 resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md text-sm flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>{EMOJI_BRAIN} Generate Role</>
          )}
        </button>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default RoleGenerator;
