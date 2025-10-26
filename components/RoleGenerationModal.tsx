
import React, { useState } from 'react';
import { Role } from '../types';

interface RoleGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (description: string) => Promise<Role>;
  onSuccess: (role: Role) => void;
}

const RoleGenerationModal: React.FC<RoleGenerationModalProps> = ({ isOpen, onClose, onGenerate, onSuccess }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    if (!description.trim()) {
      setError('Please enter a description for the role.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newRole = await onGenerate(description);
      onSuccess(newRole);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold text-amber-300 mb-4">Generate AI Role</h2>
        <p className="text-slate-400 mb-4">Describe the desired persona or expertise for the AI. A concise, descriptive role will be generated based on your input.</p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., A senior software architect specializing in cloud-native applications."
          className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          rows={4}
          disabled={isLoading}
        />

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleGenerationModal;
