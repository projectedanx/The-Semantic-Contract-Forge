
import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TierSelector from './components/TierSelector';
import PromptEditor from './components/PromptEditor';
import GeneratedPrompt from './components/GeneratedPrompt';
import ErrorToast from './components/ErrorToast';
import { Tier, PromptData, ValidationResult, SavedPromptContract, PromptTemplate } from './types';
import { ROLES } from './constants';
import { generatePromptText } from './utils/promptGenerator';
import { validatePromptOutput } from './services/geminiService';
import { useLocalStorageContracts } from './hooks/useLocalStorageContracts';
import { loggingService } from './services/loggingService';
import { useLocalStorageTemplates } from './hooks/useLocalStorageTemplates';
import TemplateLibraryModal from './components/TemplateLibraryModal';

/**
 * @const {string} DEFAULT_SCHEMA
 * @description The default JSON schema for prompt outputs.
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
 * @description The initial state for the prompt editor when the application loads or a new contract is created.
 */
const INITIAL_PROMPT_DATA: PromptData = {
  context: 'You are building a component for an e-commerce dashboard.',
  role: ROLES[0],
  instruction: 'Generate a React functional component named \'ProductCard\'.',
  specification: 'The component must use Tailwind CSS, accept props \'name\' (string) and \'price\' (number).',
  performance: 'The generated code should be clean, efficient, and well-commented.',
  preconditions: '',
  postconditions: '',
  schema: DEFAULT_SCHEMA,
  governance: '',
};

/**
 * @interface AppContextType
 * @description The shape of the context provided by the App component.
 * @property {() => void} onOpenTemplateLibrary - Function to open the template library modal.
 */
interface AppContextType {
  onOpenTemplateLibrary: () => void;
}

/**
 * @const {React.Context<AppContextType | null>} AppContext
 * @description React context to provide application-level actions to nested components.
 */
export const AppContext = React.createContext<AppContextType | null>(null);

/**
 * @component App
 * @description The main component of the application. It orchestrates the entire UI and manages the application's state,
 * including the current tier, prompt data, validation results, and user-saved contracts and templates.
 * @returns {React.ReactElement} The rendered application.
 */
function App() {
  const [currentTier, setCurrentTier] = useState<Tier>('starter');
  const [promptData, setPromptData] = useState<PromptData>(INITIAL_PROMPT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [activeContract, setActiveContract] = useState<SavedPromptContract | null>(null);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);

  const { contracts, saveContract, deleteContract } = useLocalStorageContracts(setUserError);
  const { templates, saveTemplate, renameTemplate, deleteTemplate } = useLocalStorageTemplates(setUserError);
  
  const generatedPromptText = useMemo(() => generatePromptText(promptData, currentTier), [promptData, currentTier]);
  
  const handleValidate = async () => {
    setIsLoading(true);
    setValidationResult(null);
    setUserError(null);
    try {
      const result = await validatePromptOutput(promptData, currentTier);
      setValidationResult({ success: true, data: result });
      loggingService.info("Validation successful", result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown validation error occurred.";
      setValidationResult({ success: false, error: message });
      setUserError(message);
      loggingService.error("Validation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = useCallback(() => {
    setPromptData(INITIAL_PROMPT_DATA);
    setActiveContract(null);
    setValidationResult(null);
  }, []);

  const handleSave = useCallback((data: PromptData, id: string | null, name: string): SavedPromptContract => {
    try {
      const saved = saveContract(data, id, name);
      setActiveContract(saved);
      return saved;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save contract.";
      setUserError(message);
      throw e;
    }
  }, [saveContract]);

  const handleSaveTemplate = useCallback((data: PromptData, name: string): PromptTemplate => {
    try {
      const saved = saveTemplate(data, name);
      // Maybe show a confirmation toast?
      return saved;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save template.";
      setUserError(message);
      throw e;
    }
  }, [saveTemplate]);

  const handleLoad = useCallback((contract: SavedPromptContract) => {
    setPromptData(contract);
    setActiveContract(contract);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteContract(id);
    if (activeContract?.id === id) {
      handleNew();
    }
  }, [activeContract, deleteContract, handleNew]);

  const handleOpenTemplateLibrary = () => {
    setIsTemplateLibraryOpen(true);
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setPromptData(prev => ({
        ...INITIAL_PROMPT_DATA,
        ...template.prompt,
        role: template.prompt.role || ROLES[0],
    }));
    setActiveContract(null);
    setIsTemplateLibraryOpen(false);
  };
  
  return (
    <AppContext.Provider value={{ onOpenTemplateLibrary: handleOpenTemplateLibrary }}>
      <div className="bg-slate-900 min-h-screen text-slate-300 font-sans">
        <Header
          contracts={contracts}
          activeContract={activeContract}
          onSave={handleSave}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onNew={handleNew}
          promptData={promptData}
          onSaveTemplate={handleSaveTemplate}
        />
        <main className="container mx-auto p-4 md:p-8">
          <div className="space-y-8">
            <TierSelector currentTier={currentTier} setTier={setCurrentTier} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <PromptEditor
                promptData={promptData}
                setPromptData={setPromptData}
                currentTier={currentTier}
              />
              <GeneratedPrompt
                promptText={generatedPromptText}
                onValidate={handleValidate}
                isLoading={isLoading}
                validationResult={validationResult}
                tier={currentTier}
              />
            </div>
          </div>
        </main>
        <TemplateLibraryModal
          isOpen={isTemplateLibraryOpen}
          onClose={() => setIsTemplateLibraryOpen(false)}
          onSelect={handleTemplateSelect}
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