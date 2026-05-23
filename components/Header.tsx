import React, { useContext } from 'react';
import { ForgeIcon } from './icons/ForgeIcon';
import SaveLoadControls from './SaveLoadControls';
import { AppContext } from '../App';
import { SavedPromptContract, PromptData } from '../types';

/**
 * @file components/Header.tsx
 * @description The main navigation and application header. Hosts the application branding
 * and the `SaveLoadControls` module for contract management.
 */

/**
 * Props for the Header component.
 * It primarily acts as a pass-through layer, delegating contract management state and callbacks
 * to the `SaveLoadControls` child component.
 */
export interface HeaderProps {
    /** An array of all saved prompt contracts currently in storage. */
    contracts: SavedPromptContract[];
    /** The currently active prompt contract, or null if the user is working on an unsaved contract. */
    activeContract: SavedPromptContract | null;
    /** Callback to save or update a prompt contract in storage. */
    onSave: (promptData: PromptData, id: string | null, name: string) => SavedPromptContract;
    /** Callback to load an existing contract from storage into the editor. */
    onLoad: (contract: SavedPromptContract) => void;
    /** Callback to permanently delete a contract from storage. */
    onDelete: (id: string) => void;
    /** Callback to reset the editor state to a blank contract. */
    onNew: () => void;
    /** The current state of the prompt editor data. */
    promptData: PromptData;
    /** Callback to save the current editor state as a reusable template. */
    onSaveTemplate: (promptData: PromptData, name: string) => void;
}

/**
 * Renders the top application header, branding, and delegates user contract operations.
 *
 * @param {HeaderProps} props - The props required for routing state to the SaveLoadControls.
 * @returns {React.ReactElement} The rendered header section.
 */
const Header: React.FC<HeaderProps> = (props) => {
  const context = useContext(AppContext);

  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ForgeIcon className="w-10 h-10 text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold font-orbitron text-slate-100 tracking-wider">
              Semantic Contract Forge
            </h1>
            <p className="text-sm text-slate-400">
              Elevating Prompts to Verifiable, Executable Specifications.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {context && (
            <button
              onClick={context.onToggleAdmin}
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm font-medium"
              title="Toggle Admin Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Admin
            </button>
          )}
          <SaveLoadControls {...props} />
        </div>

      </div>
    </header>
  );
};

export default Header;
