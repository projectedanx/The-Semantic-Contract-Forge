import React, { useState } from 'react';
import { SynergyAnalysis, SynergyResult, Tier, PromptData } from '../types';
import { analyzeSynergy } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

/**
 * @file components/SynergyAnalyzer.tsx
 * @description Implements the TACT (Technology Affordance and Constraints Theory) Lens UI.
 * Allows Enterprise users to analyze a prompt contract to determine the optimal mapping of
 * responsibilities between human judgment and AI deterministic execution.
 */

/**
 * Props for the SynergyAnalyzer component.
 */
export interface SynergyAnalyzerProps {
  /** The fully populated data object for the prompt contract to analyze. */
  promptData: PromptData;
  /** The user's Gemini API key for executing the analysis. */
  apiKey: string;
  /** The user's current service tier, restricting access to this Enterprise feature. */
  tier: Tier;
}

/**
 * A specialized component that triggers and displays a structured Human-AI synergy analysis.
 * It renders a dashboard showing affordances, constraints, and a calculated synergy score.
 *
 * @param {SynergyAnalyzerProps} props - Configuration and data dependencies.
 * @returns {React.ReactElement} The TACT Lens analysis dashboard.
 */
const SynergyAnalyzer: React.FC<SynergyAnalyzerProps> = ({ promptData, apiKey, tier }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SynergyResult | null>(null);

  const canAnalyze = tier === 'enterprise';

  /**
   * Initiates the TACT synergy analysis via the Gemini service and updates local state
   * with the `SynergyResult`.
   * @returns {Promise<void>}
   */
  const handleAnalyze = async () => {
    if (!apiKey) {
      setResult({ success: false, error: 'API Key is required for Synergy Analysis.' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const data = await analyzeSynergy(promptData, apiKey);
      setResult({ success: true, data: data as SynergyAnalysis });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown analysis error';
      setResult({ success: false, error: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-slate-800/30 p-6 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-400">Human-AI Synergy Analyzer</h2>
        <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full font-semibold border border-indigo-700">Enterprise</span>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Applies the Technology Affordance and Constraints Theory (TACT) to evaluate the structural analogy mapping of responsibilities between human judgment and AI deterministic execution.
      </p>

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || isLoading}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-md transition font-semibold"
      >
        <SparklesIcon className="w-5 h-5" />
        <span>
          {isLoading ? 'Analyzing TACT Geometry...' : (canAnalyze ? 'Run TACT Synergy Analysis' : 'Analysis requires Enterprise Tier')}
        </span>
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Explicit boolean check to satisfy discriminated union narrowing */}
          {result.success === false ? (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 font-semibold mb-1">❌ Analysis Failed</p>
              <p className="text-sm text-red-300">{result.error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-emerald-900 text-emerald-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">H</span>
                  Human Affordances
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {result.data.humanAffordances.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <h3 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-cyan-900 text-cyan-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">AI</span>
                  AI Affordances
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {result.data.aiAffordances.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-900/50 border border-amber-900/50 rounded-lg md:col-span-2">
                <h3 className="text-amber-400 font-semibold mb-2">Operational Constraints & Tensions</h3>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {result.data.operationalConstraints.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg md:col-span-2 flex justify-between items-center">
                <div>
                  <h3 className="text-indigo-300 font-semibold">Synergy Score</h3>
                  <p className="text-xs text-indigo-400">Orthogonality of responsibilities</p>
                </div>
                <div className="text-3xl font-bold text-indigo-400">
                  {result.data.synergyScore}/100
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SynergyAnalyzer;
