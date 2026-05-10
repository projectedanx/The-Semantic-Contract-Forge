import React, { useState, useMemo } from 'react';
import { PromptTemplate, Tier } from '../types';

/**
 * @file components/TemplateLibraryModal.tsx
 * @description Provides a modal interface for browsing, filtering, and managing prompt templates.
 * Merges system-level built-in templates with user-created ones.
 */

/**
 * Props for the TemplateLibraryModal component.
 */
export interface TemplateLibraryModalProps {
  /** Indicates whether the modal should be rendered. */
  isOpen: boolean;
  /** Callback fired to close the modal. */
  onClose: () => void;
  /** Callback fired when a user selects a template to load into the editor. */
  onSelect: (template: PromptTemplate) => void;
  /** The combined list of system and user prompt templates. */
  templates: PromptTemplate[];
  /** The user's current service tier, determining which templates are unlocked. */
  currentTier: Tier;
  /** Callback to rename a user-defined template. */
  onRenameTemplate: (id: string, newName: string) => void;
  /** Callback to delete a user-defined template. */
  onDeleteTemplate: (id: string) => void;
}

/**
 * Maps Tier levels to Tailwind CSS color families for styling template badges.
 */
const tierColors: Record<Tier, string> = {
  starter: 'slate',
  pro: 'cyan',
  enterprise: 'amber',
};

/**
 * Props for the internal TemplateCard component.
 */
export interface TemplateCardProps {
  /** The specific template data to render. */
  template: PromptTemplate;
  /** Callback fired when the card is clicked. */
  onSelect: () => void;
  /** Indicates if the template exceeds the user's current tier, disabling selection. */
  isLocked: boolean;
  /** Callback to rename the template (if custom). */
  onRename: (id: string, newName: string) => void;
  /** Callback to delete the template (if custom). */
  onDelete: (id: string) => void;
}

/**
 * Renders an individual template card within the library list.
 * Includes inline editing for custom templates and visual locking based on tier.
 *
 * @param {TemplateCardProps} props - Configuration and data for the card.
 * @returns {React.ReactElement} The styled template card.
 */
const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, isLocked, onRename, onDelete }) => {
  const isCustom = template.id.startsWith('scf-template-');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(template.name);

  /**
   * Finalizes the inline renaming process, firing the callback if the name changed.
   * @returns {void}
   */
  const handleRename = () => {
    if (newName.trim() && newName.trim() !== template.name) {
      onRename(template.id, newName.trim());
    }
    setIsRenaming(false);
  };

  return (
  <div
    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 group relative
      ${isLocked
        ? 'bg-slate-800/30 border-slate-700 opacity-60'
        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-cyan-400/50'
      }`}
  >
    <button
      onClick={onSelect}
      disabled={isLocked || isRenaming}
      className="w-full h-full absolute inset-0 z-0 cursor-pointer disabled:cursor-not-allowed"
    />
    <div className="relative z-10">
      <div className="flex justify-between items-start">
        <div>
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-slate-900 border-b border-cyan-400 text-slate-100 focus:outline-none"
              autoFocus
            />
          ) : (
            <h3 className="font-bold text-slate-100 group-hover:text-cyan-300">{template.name}</h3>
          )}
          <p className="text-sm text-slate-400 mt-1">{template.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-${tierColors[template.tier]}-500/20 text-${tierColors[template.tier]}-300 border border-${tierColors[template.tier]}-500/30`}>
            {template.tier}
          </span>
          {isCustom && !isRenaming && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsRenaming(true)}
                className="p-1 hover:bg-slate-700 rounded"
                title="Rename Template"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(template.id)}
                className="p-1 hover:bg-red-500/20 rounded"
                title="Delete Template"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
      {isLocked && <p className="text-xs text-amber-400 mt-2">Requires {template.tier.charAt(0).toUpperCase() + template.tier.slice(1)} Tier</p>}
    </div>
  </div>
  )
};

/**
 * A modal dialog for browsing, searching, and selecting prompt templates.
 * Includes text search and tier filtering capabilities.
 *
 * @param {TemplateLibraryModalProps} props - Modal configuration and state callbacks.
 * @returns {React.ReactElement | null} The rendered modal overlay, or null if closed.
 */
const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({ isOpen, onClose, onSelect, templates, currentTier, onRenameTemplate, onDeleteTemplate }) => {
  if (!isOpen) return null;

  const tierLevels: Record<Tier, number> = { starter: 0, pro: 1, enterprise: 2 };
  const currentTierLevel = tierLevels[currentTier];
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all');

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const nameMatch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
      const tierMatch = tierFilter === 'all' || template.tier === tierFilter;
      return nameMatch && tierMatch;
    });
  }, [templates, searchTerm, tierFilter]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-slate-100">Prompt Template Library</h2>
            <p className="text-slate-400 mt-1">Select a template to kickstart your contract.</p>
            <div className="mt-4 flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                />
                <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as Tier | 'all')}
                    className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                >
                    <option value="all">All Tiers</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                </select>
            </div>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={() => onSelect(template)}
                        isLocked={tierLevels[template.tier] > currentTierLevel}
                        onRename={onRenameTemplate}
                        onDelete={onDeleteTemplate}
                    />
                ))
            ) : (
                <p className="text-slate-500 text-center py-8">No templates match your search.</p>
            )}
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
