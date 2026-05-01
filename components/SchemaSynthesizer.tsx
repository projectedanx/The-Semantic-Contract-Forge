import React, { useState } from 'react';
import { Tier } from '../types';
import { generateSchemaFromExample } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface SchemaSynthesizerProps {
  onSchemaGenerated: (schema: string) => void;
  apiKey: string;
  tier: Tier;
}

const SchemaSynthesizer: React.FC<SchemaSynthesizerProps> = ({ onSchemaGenerated, apiKey, tier }) => {
  const [exampleInput, setExampleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUseFeature = tier === 'pro' || tier === 'enterprise';

  const handleSynthesize = async () => {
    if (!apiKey) {
      setError("API Key is required to synthesize schema.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const generatedSchema = await generateSchemaFromExample(exampleInput, apiKey);
      onSchemaGenerated(generatedSchema);
      setExampleInput(''); // Clear input on success
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to synthesize schema.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-indigo-700/50 bg-indigo-900/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <SparklesIcon className="w-4 h-4 text-indigo-400" />
        <h4 className="text-sm font-semibold text-indigo-300">Pluriversal Schema Synthesis</h4>
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Provide an example of the desired output. The AI will synthesize a strict JSON Schema from it.
      </p>

      <textarea
        className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-300 font-mono text-sm mb-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600 disabled:opacity-50"
        placeholder="Paste an example output here (e.g., {'fileName': 'test.ts', 'content': '...'})"
        value={exampleInput}
        onChange={(e) => setExampleInput(e.target.value)}
        disabled={!canUseFeature || isLoading}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handleSynthesize}
          disabled={!canUseFeature || isLoading || !exampleInput.trim()}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-md transition text-sm font-semibold"
        >
          {isLoading ? (
            'Synthesizing...'
          ) : !canUseFeature ? (
            'Requires Pro/Enterprise'
          ) : (
            'Synthesize Schema'
          )}
        </button>
        {error && <span className="text-xs text-red-400 max-w-[50%] break-words">{error}</span>}
      </div>
    </div>
  );
};

export default SchemaSynthesizer;
