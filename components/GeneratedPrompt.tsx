import React, { useState } from 'react';
import { ValidationResult, Tier } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

/**
 * @interface GeneratedPromptProps
 * @description Props for the GeneratedPrompt component.
 * @property {string} promptText - The text of the generated prompt to be displayed.
 * @property {() => Promise<void>} onValidate - Async function to be called when the user initiates a validation.
 * @property {boolean} isLoading - Flag indicating if the validation process is currently in progress.
 * @property {ValidationResult | null} validationResult - The result of the last validation, or null if no validation has been performed.
 * @property {Tier} tier - The user's current tier, which determines if validation is available.
 */
interface GeneratedPromptProps {
  promptText: string;
  onValidate: () => Promise<void>;
  isLoading: boolean;
  validationResult: ValidationResult | null;
  tier: Tier;
}

/**
 * @component GeneratedPrompt
 * @description A component that displays the generated prompt text, allows copying it to the clipboard,
 * and provides a button to trigger validation of the prompt's output against a schema.
 * @param {GeneratedPromptProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered component for displaying and validating the generated prompt.
 */
const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ promptText, onValidate, isLoading, validationResult, tier }) => {
  const [copied, setCopied] = useState(false);

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
            {/* FIX: Check for the failure case first to ensure TypeScript correctly narrows the discriminated union type. */}
            {!validationResult.success ? (
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
      </div>
    </div>
  );
};

export default GeneratedPrompt;