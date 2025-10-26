
import React from 'react';
import { Tier } from '../types';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

/**
 * @interface TierSelectorProps
 * @description Props for the TierSelector component.
 * @property {Tier} currentTier - The currently selected tier.
 * @property {(tier: Tier) => void} setTier - Callback function to update the selected tier.
 */
interface TierSelectorProps {
  currentTier: Tier;
  setTier: (tier: Tier) => void;
}

/**
 * @const tiers
 * @description An object containing the definitions for each tier, including name, description, features, and color.
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
 * @component TierSelector
 * @description A component that allows the user to select a tier (Starter, Pro, Enterprise).
 * The selected tier controls which features are available in the prompt editor.
 * @param {TierSelectorProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered tier selector component.
 */
const TierSelector: React.FC<TierSelectorProps> = ({ currentTier, setTier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(Object.keys(tiers) as Tier[]).map((tierKey) => {
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
