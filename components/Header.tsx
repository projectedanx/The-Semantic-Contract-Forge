import React from 'react';
import { ForgeIcon } from './icons/ForgeIcon';
import SaveLoadControls from './SaveLoadControls';
import { SavedPromptContract, PromptData } from '../types';

/**
 * @interface HeaderProps
 * @description Props for the Header component. These props are primarily for managing prompt contracts and templates.
 * @property {SavedPromptContract[]} contracts - An array of saved prompt contracts.
 * @property {SavedPromptContract | null} activeContract - The currently active prompt contract, or null if none is active.
 * @property {(promptData: PromptData, id: string | null, name: string) => SavedPromptContract} onSave - Callback function to save a prompt contract.
 * @property {(contract: SavedPromptContract) => void} onLoad - Callback function to load a prompt contract.
 * @property {(id: string) => void} onDelete - Callback function to delete a prompt contract.
 * @property {() => void} onNew - Callback function to create a new prompt contract.
 * @property {PromptData} promptData - The current prompt data.
 * @property {(promptData: PromptData, name: string) => void} onSaveTemplate - Callback function to save the current prompt data as a new template.
 */
interface HeaderProps {
    contracts: SavedPromptContract[];
    activeContract: SavedPromptContract | null;
    onSave: (promptData: PromptData, id: string | null, name: string) => SavedPromptContract;
    onLoad: (contract: SavedPromptContract) => void;
    onDelete: (id: string) => void;
    onNew: () => void;
    promptData: PromptData;
    onSaveTemplate: (promptData: PromptData, name: string) => void;
}

/**
 * @component Header
 * @description The main header component for the application. It displays the application title and
 * includes the SaveLoadControls for managing contracts.
 * @param {HeaderProps} props - The props for the component, which are passed down to SaveLoadControls.
 * @returns {React.ReactElement} The rendered header component.
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
