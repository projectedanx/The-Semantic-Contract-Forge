import React from 'react';
import { Tier } from '../types';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

/**
 * @file components/TierSelector.tsx
 * @description Provides the UI for users to select their service tier (Starter, Pro, Enterprise).
 * The selected tier acts as a global state gate, unlocking advanced fields like schemas and governance.
 */

/**
 * Props for the TierSelector component.
 */
export interface TierSelectorProps {
  /** The currently active tier state. */
  currentTier: Tier;
  /** State setter callback to update the active tier. */
  setTier: (tier: Tier) => void;
}

/**
 * Configuration object defining the UI content and Tailwind color families for each tier.
 */
const tiers = {
  starter: {
    name: "Starter",
    description: "Basic prompt patterns for individuals and small projects.",
    features: ["CRISP Framework Templates", "Zero-Shot/Few-Shot Patterns"],
    color: "slate",
  },
  pro: {
    name: "Pro",
    description: "Advanced contract-based prompts for professional developers.",
    features: ["Full PRP Generator", "Pre/Postcondition Fields", "JSON Schema Enforcement"],
    color: "cyan",
  },
  enterprise: {
    name: "Enterprise",
    description: "Governance and compliance for high-stakes AI systems.",
    features: ["CI/CD Integration", "Constitutional AI Templates", "Semantic Governance Modules"],
    color: "amber",
  },
};

/**
 * A static array of tier keys hoisted outside the component.
 * This prevents redundant `Object.keys()` calculations on every React render cycle.
 */
const TIER_KEYS = Object.keys(tiers) as Tier[];

/**
 * Renders a grid of selectable cards representing the available service tiers.
 * Visual feedback indicates the currently active tier.
 *
 * @param {TierSelectorProps} props - The current tier state and updater callback.
 * @returns {React.ReactElement} The grid of tier selection buttons.
 */
const TierSelector: React.FC<TierSelectorProps> = ({ currentTier, setTier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TIER_KEYS.map((tierKey) => {
        const tierInfo = tiers[tierKey];
        const isActive = currentTier === tierKey;
        return (
          <button
            key={tierKey}
            onClick={() => setTier(tierKey)}
            className={`relative p-6 rounded-lg text-left transition-all duration-300 transform hover:-translate-y-1 group
              ${isActive
                ? `ring-2 ring-offset-2 ring-offset-slate-900 ring-${tierInfo.color}-400 bg-${tierInfo.color}-500/10`
                : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
              }`}
          >
            <h3 className={`text-xl font-bold text-${tierInfo.color}-300`}>{tierInfo.name}</h3>
            <p className="text-slate-400 mt-1 text-sm">{tierInfo.description}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {tierInfo.features.map(feature => (
                <li key={feature} className="flex items-start">
                  <CheckCircleIcon className={`w-5 h-5 mr-2 flex-shrink-0 text-${tierInfo.color}-400`} />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
             {isActive && (
              <div className="absolute -top-3 -right-3 bg-slate-900 rounded-full p-1">
                <CheckCircleIcon className={`w-6 h-6 text-${tierInfo.color}-400`} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TierSelector;
