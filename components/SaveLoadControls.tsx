import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AppContext } from '../App';
import { SavedPromptContract, PromptData } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import ConfirmationModal from './ConfirmationModal';

/**
 * @file components/SaveLoadControls.tsx
 * @description Provides the UI layer for managing saved prompt contracts. Handles saving, loading,
 * and deleting contracts via a dropdown and modals.
 */

/**
 * Props for the SaveLoadControls component.
 */
export interface SaveLoadControlsProps {
    /** The complete list of saved prompt contracts from local storage. */
    contracts: SavedPromptContract[];
    /** The currently loaded active contract, or null if starting a new one. */
    activeContract: SavedPromptContract | null;
    /** Callback to execute when saving a contract. */
    onSave: (promptData: PromptData, id: string | null, name: string) => SavedPromptContract;
    /** Callback to execute when a user selects a contract to load. */
    onLoad: (contract: SavedPromptContract) => void;
    /** Callback to execute when a user confirms contract deletion. */
    onDelete: (id: string) => void;
    /** Callback to execute to clear the current editor and start a new contract. */
    onNew: () => void;
    /** The current state of the editor data, required for saving operations. */
    promptData: PromptData;
    /** Callback to save the current editor state as a reusable template. */
    onSaveTemplate: (promptData: PromptData, name: string) => void;
}

/**
 * Renders the top-level controls for persistence: a dropdown to select contracts,
 * buttons to save, save as template, and delete. Handles user confirmation Modals.
 *
 * @param {SaveLoadControlsProps} props - Callbacks and state for persistence.
 * @returns {React.ReactElement} The rendered control strip and associated modals.
 */
const SaveLoadControls: React.FC<SaveLoadControlsProps> = ({ contracts, activeContract, onSave, onLoad, onDelete, onNew, promptData, onSaveTemplate }) => {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<string | null>(null);
    const [contractName, setContractName] = useState('');
    const appContext = useContext(AppContext);

    /**
     * Memoized name of the contract currently selected for deletion.
     * Prevents an O(N) array search on every render.
     */
    const contractToDeleteName = useMemo(() => {
        if (!contractToDelete) return '';
        return contracts.find(c => c.id === contractToDelete)?.name || '';
    }, [contracts, contractToDelete]);

    useEffect(() => {
        if (activeContract) {
            setContractName(activeContract.name);
        } else {
            setContractName('');
        }
    }, [activeContract]);
    
    /**
     * Handles the logic when the Save button is clicked. If an active contract exists,
     * it overwrites it. Otherwise, it prompts for a new name.
     */
    const handleSaveClick = () => {
        if (activeContract) {
            onSave(promptData, activeContract.id, activeContract.name);
        } else {
            setIsSaveModalOpen(true);
        }
    };

    /**
     * Confirms the save operation from the "Save As..." modal.
     */
    const handleConfirmSave = () => {
        if (contractName.trim()) {
            onSave(promptData, null, contractName.trim());
            setIsSaveModalOpen(false);
        }
    };

    /**
     * Opens the modal to save the current state as a new template.
     */
    const handleSaveTemplateClick = () => {
        setContractName(''); // Reset name for template
        setIsTemplateModalOpen(true);
    };

    /**
     * Confirms saving the current editor state as a template.
     */
    const handleConfirmSaveTemplate = () => {
        if (contractName.trim()) {
            onSaveTemplate(promptData, contractName.trim());
            setIsTemplateModalOpen(false);
        }
    };
    
    /**
     * Stages a contract for deletion and opens the confirmation modal.
     * @param {string} id - The ID of the contract to delete.
     */
    const handleDeleteClick = (id: string) => {
        setContractToDelete(id);
        setIsDeleteModalOpen(true);
    };

    /**
     * Executes the deletion after user confirmation.
     */
    const handleConfirmDelete = () => {
        if (contractToDelete) {
            onDelete(contractToDelete);
            setContractToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };
    
    /**
     * Handles selection changes in the contracts dropdown.
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the select element.
     */
    const handleLoad = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === 'new') {
            onNew();
            return;
        }

        const contract = contracts.find(c => c.id === selectedId);
        if (contract) {
            onLoad(contract);
        }
    };

    return (
        <>
            <div className="flex items-center space-x-4">
                 <button 
                    onClick={appContext?.onOpenTemplateLibrary}
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition text-sm font-semibold"
                >
                    <LibraryIcon className="w-5 h-5" />
                    <span>Templates</span>
                </button>

                <select
                    value={activeContract?.id || 'new'}
                    onChange={handleLoad}
                    className="min-w-[150px] bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                >
                    <option value="new">-- New Contract --</option>
                    {contracts.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <button onClick={handleSaveClick} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md transition font-semibold">
                    {activeContract ? 'Save' : 'Save As...'}
                </button>
                <button
                    onClick={handleSaveTemplateClick}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition font-semibold"
                    title="Save the current contract as a reusable template"
                >
                    Save as Template
                </button>
                 {activeContract && (
                    <button
                        onClick={() => handleDeleteClick(activeContract.id)}
                        className="p-2 bg-slate-700 hover:bg-red-600/50 text-slate-300 hover:text-red-300 rounded-md transition"
                        title="Delete Contract"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            {/* Save Modal */}
            {isSaveModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" aria-modal="true" role="dialog">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                        <h2 className="text-xl font-bold text-slate-100">Save New Contract</h2>
                        <p className="text-slate-400 mt-2">Enter a name for your new contract.</p>
                        <input
                            type="text"
                            value={contractName}
                            onChange={(e) => setContractName(e.target.value)}
                            className="w-full mt-4 p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                            placeholder="e.g., React Component Generator"
                        />
                        <div className="mt-6 flex justify-end space-x-4">
                        <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition font-semibold">Cancel</button>
                        <button onClick={handleConfirmSave} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md transition font-semibold" disabled={!contractName.trim()}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Template Modal */}
            {isTemplateModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" aria-modal="true" role="dialog">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                        <h2 className="text-xl font-bold text-slate-100">Save New Template</h2>
                        <p className="text-slate-400 mt-2">Enter a name for your new template.</p>
                        <input
                            type="text"
                            value={contractName}
                            onChange={(e) => setContractName(e.target.value)}
                            className="w-full mt-4 p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                            placeholder="e.g., Python FastAPI Endpoint"
                        />
                        <div className="mt-6 flex justify-end space-x-4">
                        <button onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition font-semibold">Cancel</button>
                        <button onClick={handleConfirmSaveTemplate} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition font-semibold" disabled={!contractName.trim()}>Save Template</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Contract"
                message={`Are you sure you want to delete "${contractToDeleteName}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </>
    );
};

export default SaveLoadControls;
