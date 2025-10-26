
import React from 'react';
import { PromptTemplate, Tier } from '../types';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: PromptTemplate) => void;
  templates: PromptTemplate[];
  currentTier: Tier;
}

const tierColors: Record<Tier, string> = {
  starter: 'slate',
  pro: 'cyan',
  enterprise: 'amber',
};

const TemplateCard: React.FC<{ template: PromptTemplate; onSelect: () => void; isLocked: boolean }> = ({ template, onSelect, isLocked }) => (
  <button
    onClick={onSelect}
    disabled={isLocked}
    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 group
      ${isLocked
        ? 'bg-slate-800/30 border-slate-700 opacity-60 cursor-not-allowed'
        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-cyan-400/50 transform hover:-translate-y-0.5'
      }`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-slate-100 group-hover:text-cyan-300">{template.name}</h3>
        <p className="text-sm text-slate-400 mt-1">{template.description}</p>
      </div>
      <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-${tierColors[template.tier]}-500/20 text-${tierColors[template.tier]}-300 border border-${tierColors[template.tier]}-500/30`}>
        {template.tier}
      </span>
    </div>
    {isLocked && <p className="text-xs text-amber-400 mt-2">Requires {template.tier.charAt(0).toUpperCase() + template.tier.slice(1)} Tier</p>}
  </button>
);


const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({ isOpen, onClose, onSelect, templates, currentTier }) => {
  if (!isOpen) return null;

  const tierLevels: Record<Tier, number> = { starter: 0, pro: 1, enterprise: 2 };
  const currentTierLevel = tierLevels[currentTier];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-slate-100">Prompt Template Library</h2>
            <p className="text-slate-400 mt-1">Select a template to kickstart your contract.</p>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            {templates.map(template => (
                <TemplateCard 
                    key={template.id}
                    template={template}
                    onSelect={() => onSelect(template)}
                    isLocked={tierLevels[template.tier] > currentTierLevel}
                />
            ))}
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end">
             <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition font-semibold"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibraryModal;
