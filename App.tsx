import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import TierSelector from './components/TierSelector';
import PromptEditor from './components/PromptEditor';
import GeneratedPrompt from './components/GeneratedPrompt';
import ErrorToast from './components/ErrorToast';
import { Tier, PromptData, ValidationResult, SavedPromptContract, PromptTemplate, Role } from './types';
import { ROLES } from './constants';
import { generatePromptText } from './utils/promptGenerator';
import { validatePromptOutput } from './services/geminiService';
import { useLocalStorageContracts } from './hooks/useLocalStorageContracts';
import { loggingService } from './services/loggingService';
import { useLocalStorageTemplates } from './hooks/useLocalStorageTemplates';
import TemplateLibraryModal from './components/TemplateLibraryModal';

/**
 * @file App.tsx
 * @description The root component of the Semantic Contract Forge. Orchestrates global state,
 * manages the Bring Your Own Key (BYOK) lifecycle, and binds the modular UI components together.
 */

/**
 * @const {string} DEFAULT_SCHEMA
 * @description A fallback JSON schema used when initializing a new prompt editor state.
 * Specifies a basic file-generation structure.
 */
const DEFAULT_SCHEMA = JSON.stringify({
  type: "object",
  properties: {
    fileName: {
      type: "string",
      description: "The name of the file to be created, e.g., 'ProductCard.tsx'"
    },
    content: {
      type: "string",
      description: "The source code or content for the file."
    }
  },
  required: ["fileName", "content"]
}, null, 2);

/**
 * @const {PromptData} INITIAL_PROMPT_DATA
 * @description The initial scaffold state for the prompt editor when the application loads
 * or when a user clicks "New Contract".
 */
const INITIAL_PROMPT_DATA: PromptData = {
  context: 'You are building a component for an e-commerce dashboard.',
  role: ROLES[0],
  instruction: 'Generate a React functional component named \'ProductCard\'.',
  specification: 'The component must use Tailwind CSS, accept props \'name\' (string) and \'price\' (number).',
  performance: 'The generated code should be WCAG AA compliant; Lighthouse score ≥ 90, efficient, and well-commented.',
  preconditions: '',
  postconditions: '',
  schema: DEFAULT_SCHEMA,
  governance: '',
};

/**
 * Defines the shape of the global React Context used to bypass prop-drilling
 * for top-level UI actions (like opening modals from nested headers).
 */
export interface AppContextType {
  /** Callback to open the global Template Library modal. */
  onOpenTemplateLibrary: () => void;
  /** Callback to toggle the global Admin Dashboard. */
  onToggleAdmin: () => void;
}

/**
 * Global React context providing application-level actions to nested components.
 */
export const AppContext = React.createContext<AppContextType | null>(null);

/**
 * The core application container. Manages all primary state including user tier,
 * active editor data, persistence coordination, and Gemini API keys.
 *
 * @returns {React.ReactElement} The mounted application root.
 */
function App() {
  const [currentTier, setCurrentTier] = useState<Tier>('starter');
  const [promptData, setPromptData] = useState<PromptData>(INITIAL_PROMPT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [activeContract, setActiveContract] = useState<SavedPromptContract | null>(null);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [roles, setRoles] = useState<Role[]>(ROLES);

  // Bring Your Own Key (BYOK) state initialization from local storage
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');

  // Hook integrations for persistent storage
  const { contracts, saveContract, deleteContract } = useLocalStorageContracts(setUserError);
  const { templates, saveTemplate, renameTemplate, deleteTemplate } = useLocalStorageTemplates(setUserError);
  
  /**
   * Memoized derivation of the final text prompt from the current editor state and tier.
   */
  const generatedPromptText = useMemo(() => generatePromptText(promptData, currentTier), [promptData, currentTier]);
  
  /**
   * Initiates the schema validation process by calling the Gemini service.
   * Handles loading states, error surfacing, and result storage.
   * @returns {Promise<void>}
   */
  const handleValidate = async () => {
    if (!apiKey) {
      setUserError("Please enter your Gemini API Key.");
      return;
    }
    setIsLoading(true);
    setValidationResult(null);
    setUserError(null);
    try {
      const result = await validatePromptOutput(promptData, currentTier, apiKey);
      setValidationResult({ success: true, data: result });
      loggingService.info("Validation successful", result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed.';
      setValidationResult({ success: false, error: message });
      setUserError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates the global API key state and persists it to local storage.
   * @param {string} newKey - The new Gemini API key.
   * @returns {void}
   */
  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
  };

  /**
   * Persists the current editor state as a contract in local storage.
   *
   * @param {PromptData} data - The editor data payload.
   * @param {string | null} id - The ID of the contract to overwrite, or null to create new.
   * @param {string} name - The human-readable name of the contract.
   * @returns {SavedPromptContract | undefined} The saved contract, or undefined if save failed.
   */
  const handleSaveContract = useCallback((data: PromptData, id: string | null, name: string) => {
      try {
          const saved = saveContract(data, id, name);
          setActiveContract(saved);
          return saved;
      } catch (e) {
          // Error is handled by the hook and set in userError
      }
  }, [saveContract]);

  /**
   * Loads an existing contract from local storage into the editor.
   *
   * @param {SavedPromptContract} contract - The contract object to load.
   * @returns {void}
   */
  const handleLoadContract = useCallback((contract: SavedPromptContract) => {
      setPromptData({
          context: contract.context,
          role: contract.role,
          instruction: contract.instruction,
          specification: contract.specification,
          performance: contract.performance,
          preconditions: contract.preconditions,
          postconditions: contract.postconditions,
          schema: contract.schema,
          governance: contract.governance,
      });
      setActiveContract(contract);
      setValidationResult(null);
  }, []);

  /**
   * Deletes a contract and clears the editor if the deleted contract was active.
   *
   * @param {string} id - The ID of the contract to delete.
   * @returns {void}
   */
  const handleDeleteContract = useCallback((id: string) => {
      try {
          deleteContract(id);
          if (activeContract?.id === id) {
              setActiveContract(null);
              setPromptData(INITIAL_PROMPT_DATA);
              setValidationResult(null);
          }
      } catch(e) {
           // Error is handled by the hook
      }
  }, [deleteContract, activeContract]);

  /**
   * Resets the editor to a blank slate, clearing the active contract.
   * @returns {void}
   */
  const handleNewContract = useCallback(() => {
      setActiveContract(null);
      setPromptData(INITIAL_PROMPT_DATA);
      setValidationResult(null);
  }, []);

  /**
   * Saves the current editor state as a reusable template.
   *
   * @param {PromptData} data - The editor state to save.
   * @param {string} name - The display name for the template.
   * @returns {void}
   */
  const handleSaveTemplate = useCallback((data: PromptData, name: string) => {
      try {
          saveTemplate(data, name);
          setUserError(null);
      } catch (e) {
         // Error handled by hook
      }
  }, [saveTemplate]);

  /**
   * Loads a template into the editor, adjusting the active tier if necessary.
   *
   * @param {PromptTemplate} template - The template to apply.
   * @returns {void}
   */
  const handleLoadTemplate = useCallback((template: PromptTemplate) => {
    // Determine the highest tier between the current tier and the template's required tier
    const tierLevels = { starter: 0, pro: 1, enterprise: 2 };
    if (tierLevels[template.tier] > tierLevels[currentTier]) {
        setCurrentTier(template.tier);
    }

    setPromptData(prev => ({
        ...prev,
        ...template.prompt
    }));

    setIsTemplateLibraryOpen(false);
    setActiveContract(null); // Loading a template clears the active contract state
    setValidationResult(null);
  }, [currentTier]);
  
  const contextValue = useMemo(() => ({
    onOpenTemplateLibrary: () => setIsTemplateLibraryOpen(true),
      onToggleAdmin: () => setIsAdminMode(prev => !prev),
}), []);

  return (
    <AppContext.Provider value={contextValue}>
        <div className="min-h-screen bg-slate-900 text-slate-300 font-inter pb-24 selection:bg-cyan-500/30">
        <Header
            contracts={contracts}
            activeContract={activeContract}
            onSave={handleSaveContract}
            onLoad={handleLoadContract}
            onDelete={handleDeleteContract}
            onNew={handleNewContract}
            promptData={promptData}
            onSaveTemplate={handleSaveTemplate}
        />


        <main className="container mx-auto px-4 py-8">
            {isAdminMode ? (
              <AdminDashboard />
            ) : (
              <>
                <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
                    <div className="flex-grow max-w-xl">
                        <label htmlFor="apiKey" className="block text-sm font-semibold text-slate-300 mb-1">Google Gemini API Key (BYOK)</label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => handleApiKeyChange(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition font-mono text-sm"
                        />
                        <p className="text-xs text-slate-500 mt-1">Your key is stored locally in your browser and never sent to our servers.</p>
                    </div>
                </div>

                <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 text-slate-100 border-b border-slate-700 pb-2">Select Tier & Features</h2>
                <TierSelector currentTier={currentTier} setTier={setCurrentTier} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <PromptEditor
                        promptData={promptData}
                        setPromptData={setPromptData}
                        currentTier={currentTier}
                        roles={roles}
                        onRoleGenerated={(newRole) => setRoles(prev => [...prev, newRole])}
                        apiKey={apiKey}
                    />
                </div>

                <div>
                    <GeneratedPrompt
                        promptData={promptData}
                        apiKey={apiKey}
                        promptText={generatedPromptText}
                        onValidate={handleValidate}
                        isLoading={isLoading}
                        validationResult={validationResult}
                        tier={currentTier}
                    />
                </div>
                </div>
              </>
            )}
        </main>


        <TemplateLibraryModal
            isOpen={isTemplateLibraryOpen}
            onClose={() => setIsTemplateLibraryOpen(false)}
            onSelect={handleLoadTemplate}
            templates={templates}
            currentTier={currentTier}
            onRenameTemplate={renameTemplate}
            onDeleteTemplate={deleteTemplate}
        />

        <ErrorToast message={userError} onDismiss={() => setUserError(null)} />
        </div>
    </AppContext.Provider>
  );
}

export default App;
