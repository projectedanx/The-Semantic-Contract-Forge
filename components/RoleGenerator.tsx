
import React, { useState } from 'react';
import { Role } from '../types';

interface RoleGeneratorProps {
  onGenerate: (persona: string) => Promise<Role>;
  onRoleGenerated: (newRole: Role) => void;
  disabled?: boolean;
}

const RoleGenerator: React.FC<RoleGeneratorProps> = ({ onGenerate, onRoleGenerated, disabled }) => {
  const [persona, setPersona] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!persona.trim()) {
      setError('Persona description cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newRole = await onGenerate(persona);
      onRoleGenerated(newRole);
      setPersona(''); // Clear input on success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-300">Generate New Role</h3>
      <div className="space-y-2">
        <textarea
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="e.g., 'A witty pirate captain who explains things in nautical terms.'"
          className="w-full h-24 p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          disabled={disabled || isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={disabled || isLoading || !persona.trim()}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
            'Generate Role'
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default RoleGenerator;
