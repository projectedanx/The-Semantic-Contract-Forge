
import React, { useState, useEffect, useContext } from 'react';
import { SavedPromptContract, PromptData } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { TrashIcon } from './icons/TrashIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { AppContext } from '../App';

interface SaveLoadControlsProps {
    contracts: SavedPromptContract[];
    activeContract: SavedPromptContract | null;
    onSave: (promptData: PromptData, id:string | null, name: string) => SavedPromptContract;
    onLoad: (contract: SavedPromptContract) => void;
    onDelete: (id: string) => void;
    onNew: () => void;
    promptData: PromptData;
    onSaveTemplate: (promptData: PromptData, name: string) => void;
}

const SaveLoadControls: React.FC<SaveLoadControlsProps> = ({ contracts, activeContract, onSave, onLoad, onDelete, onNew, promptData, onSaveTemplate }) => {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<string | null>(null);
    const [contractName, setContractName] = useState('');
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (activeContract) {
            setContractName(activeContract.name);
        } else {
            setContractName('');
        }
    }, [activeContract]);
    
    const handleSaveClick = () => {
        if (activeContract) {
            onSave(promptData, activeContract.id, activeContract.name);
        } else {
            setIsSaveModalOpen(true);
        }
    };

    const handleConfirmSave = () => {
        if (contractName.trim()) {
            onSave(promptData, null, contractName.trim());
            setIsSaveModalOpen(false);
        }
    };

    const handleSaveTemplateClick = () => {
        setContractName(''); // Reset name for template
        setIsTemplateModalOpen(true);
    };

    const handleConfirmSaveTemplate = () => {
        if (contractName.trim()) {
            onSaveTemplate(promptData, contractName.trim());
            setIsTemplateModalOpen(false);
        }
    };
    
    const handleDeleteClick = (id: string) => {
        setContractToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (contractToDelete) {
            onDelete(contractToDelete);
            setContractToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };
    
    const handleLoad = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === 'new') {
            onNew();
        } else {
            const contract = contracts.find(c => c.id === selectedId);
            if (contract) {
                onLoad(contract);
            }
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
                message={`Are you sure you want to delete "${contracts.find(c => c.id === contractToDelete)?.name}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </>
    );
};

export default SaveLoadControls;
