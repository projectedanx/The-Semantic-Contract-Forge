import React, { useState } from 'react';
import { generateSchemaFromExample } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

/**
 * @file components/SchemaSynthesizer.tsx
 * @description Provides a UI for the "Pluriversal Schema Synthesis" feature. Allows users to
 * paste raw JSON examples and delegates to the Gemini service to generate a formal OpenAPI/JSON schema.
 */

/**
 * Props for the SchemaSynthesizer component.
 * Note: `disabled` replaces `tier` checks from older versions to rely on parent component logic.
 */
export interface SchemaSynthesizerProps {
  /** The current schema string from the editor state. */
  currentSchema: string;
  /** Callback fired when a new schema is successfully synthesized from an example. */
  onSchemaUpdate: (schema: string) => void;
  /** Disables the input and synthesis button (e.g., when API keys are missing or tier is insufficient). */
  disabled: boolean;
  /** The user's Gemini API key for the network call. */
  apiKey: string;
}

/**
 * A sub-component integrated into the PromptEditor's Schema section.
 * Manages the input state for JSON examples and handles the synthesis API lifecycle.
 *
 * @param {SchemaSynthesizerProps} props - Configuration, state callbacks, and dependencies.
 * @returns {React.ReactElement} The schema synthesis tool UI.
 */
const SchemaSynthesizer: React.FC<SchemaSynthesizerProps> = ({ currentSchema, onSchemaUpdate, disabled, apiKey }) => {
  const [exampleInput, setExampleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the synthesis request, calling the Gemini API and passing the result up.
   * @returns {Promise<void>}
   */
  const handleSynthesize = async () => {
    if (!apiKey) {
      setError("API Key is required to synthesize schema.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const generatedSchema = await generateSchemaFromExample(exampleInput, apiKey);
      onSchemaUpdate(generatedSchema);
      setExampleInput(''); // Clear input on success
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to synthesize schema.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <textarea
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition font-mono text-sm"
            rows={10}
            value={currentSchema}
            onChange={(e) => onSchemaUpdate(e.target.value)}
            disabled={disabled}
            placeholder={`e.g., {\n  "type": "object",\n  "properties": {\n    "data": { "type": "string" }\n  }\n}`}
        />

        <div className="p-4 border border-indigo-700/50 bg-indigo-900/20 rounded-lg">
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
                disabled={disabled || isLoading}
            />

            <div className="flex items-center justify-between">
                <button
                    onClick={handleSynthesize}
                    disabled={disabled || isLoading || !exampleInput.trim()}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-md transition text-sm font-semibold"
                >
                    {isLoading ? (
                    'Synthesizing...'
                    ) : disabled ? (
                    'Requires Pro/Enterprise & API Key'
                    ) : (
                    'Synthesize Schema'
                    )}
                </button>
                {error && <span className="text-xs text-red-400 max-w-[50%] break-words">{error}</span>}
            </div>
        </div>
    </div>
  );
};

export default SchemaSynthesizer;
