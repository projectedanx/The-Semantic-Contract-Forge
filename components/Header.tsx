import React from 'react';
import { ForgeIcon } from './icons/ForgeIcon';
import SaveLoadControls from './SaveLoadControls';
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
        <SaveLoadControls {...props} />
      </div>
    </header>
  );
};

export default Header;
