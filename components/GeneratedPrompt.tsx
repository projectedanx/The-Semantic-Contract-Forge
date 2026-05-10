import React, { useState } from 'react';
import { ValidationResult, Tier, PromptData } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import SynergyAnalyzer from './SynergyAnalyzer';

/**
 * @file components/GeneratedPrompt.tsx
 * @description Renders the compiled prompt string in a readable code block.
 * Provides functionality to copy the prompt to the clipboard and triggers
 * the schema validation process against the Gemini API.
 */

/**
 * Props for the GeneratedPrompt component.
 */
export interface GeneratedPromptProps {
  /** The complete, underlying data object defining the prompt contract. */
  promptData: PromptData;
  /** The user's Gemini API key required for validation and analysis calls. */
  apiKey: string;
  /** The fully compiled, formatted prompt string ready to be copied or executed. */
  promptText: string;
  /** Async callback fired when the user clicks the "Validate Output" button. */
  onValidate: () => Promise<void>;
  /** Flag indicating if a validation network request is currently in flight. */
  isLoading: boolean;
  /** The resulting data payload or error message from the last validation attempt. */
  validationResult: ValidationResult | null;
  /** The user's current service tier, restricting access to the validation feature. */
  tier: Tier;
}

/**
 * Displays the final generated prompt text. Includes a copy button and a validation
 * panel that conditionally renders based on the user's tier. Integrates the
 * `SynergyAnalyzer` for advanced contract evaluation.
 *
 * @param {GeneratedPromptProps} props - Configuration and state props.
 * @returns {React.ReactElement} The rendered prompt display and validation UI.
 */
const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ promptText, onValidate, isLoading, validationResult, tier, promptData, apiKey }) => {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the compiled prompt text to the system clipboard and temporarily changes
   * the button state to indicate success.
   * @returns {void}
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canValidate = tier === 'pro' || tier === 'enterprise';

  return (
    <div className="sticky top-24">
      <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-300">Generated Prompt Contract</h2>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition text-sm"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <pre className="bg-slate-900/70 p-4 rounded-md overflow-x-auto text-sm text-slate-200 whitespace-pre-wrap break-words max-h-[400px]">
          <code>{promptText}</code>
        </pre>
        <div className="mt-6">
          <button
            onClick={onValidate}
            disabled={!canValidate || isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-md transition font-semibold"
          >
            <ShieldCheckIcon className="w-5 h-5" />
            <span>
              {isLoading ? 'Validating...' : (canValidate ? 'Validate Output with Gemini' : 'Validation requires Pro Tier')}
            </span>
          </button>
        </div>
        {validationResult && (
          <div className="mt-4 p-4 rounded-lg border bg-slate-900/50 border-slate-700">
            <h3 className="font-semibold text-lg mb-2">Validation Result:</h3>
            {/* Check for the failure case first to ensure TypeScript correctly narrows the discriminated union type. */}
            {validationResult.success === false ? (
              <div className="space-y-2">
                <p className="text-red-400">❌ Validation Failed</p>
                <pre className="bg-slate-800 text-red-300 p-3 rounded-md overflow-x-auto text-sm">
                  <code>{validationResult.error}</code>
                </pre>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-green-400">✅ Validation Successful</p>
                <pre className="bg-slate-800 p-3 rounded-md overflow-x-auto text-sm">
                  <code>{JSON.stringify(validationResult.data, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        )}
        <SynergyAnalyzer promptData={promptData} apiKey={apiKey} tier={tier} />
      </div>
    </div>
  );
};

export default GeneratedPrompt;
