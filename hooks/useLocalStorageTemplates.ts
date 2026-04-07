import { useCallback, useMemo } from 'react';
import { PromptTemplate, PromptData } from '../types';
import { TEMPLATES } from '../constants/templates';
import { loggingService } from '../services/loggingService';
import { isPromptTemplateArray } from '../utils/validation';
import { useLocalStorage } from './useLocalStorage';

const TEMPLATE_STORAGE_KEY = 'semantic-contract-forge-user-templates';

/**
 * Custom hook for managing prompt templates.
 * It loads a static, built-in list of templates and combines them with user-created templates
 * stored in the browser's local storage.
 *
 * @param {(message: string | null) => void} setUserError - A callback function to set user-facing error messages.
 * @returns {{
 *   templates: PromptTemplate[],
 *   saveTemplate: (promptData: PromptData, name: string) => PromptTemplate,
 *   deleteTemplate: (id: string) => void,
 *   renameTemplate: (id: string, newName: string) => void
 * }} An object containing the list of all templates and functions to manage user-created templates.
 */
export function useLocalStorageTemplates(
  setUserError: (message: string | null) => void
) {
  const [userTemplates, setUserTemplates] = useLocalStorage<PromptTemplate[]>(
    TEMPLATE_STORAGE_KEY,
    [],
    isPromptTemplateArray,
    setUserError,
    {
      invalidData: "Could not load some prompt templates. The stored data is invalid.",
      loadError: "Could not load prompt templates."
    }
  );

  const templates = useMemo(() => {
    return [...TEMPLATES, ...userTemplates];
  }, [userTemplates]);

  /**
   * Saves a new custom template to local storage.
   *
   * @param {PromptData} promptData - The prompt data to be saved as a template.
   * @param {string} name - The name for the new template.
   * @returns {PromptTemplate} The newly created template object.
   * @throws {Error} If saving to localStorage fails.
   */
  const saveTemplate = useCallback((promptData: PromptData, name: string): PromptTemplate => {
    try {
        const newTemplate: PromptTemplate = {
            id: `scf-template-${Date.now()}`,
            name,
            description: "User-defined custom template.",
            tier: 'starter', // Assuming custom templates are available on any tier
            prompt: { ...promptData },
        };

        setUserTemplates(prevTemplates => {
            const currentUsers = prevTemplates.filter(t => t.id.startsWith('scf-template-'));
            return [...currentUsers, newTemplate];
        });

        return newTemplate;
    } catch (e) {
        loggingService.error("Failed to save template to localStorage", e);
        throw new Error("Could not save the template. Your browser's storage might be full.");
    }
  }, [setUserTemplates]);

  /**
   * Deletes a custom template from local storage by its ID.
   *
   * @param {string} id - The ID of the template to delete.
   * @throws {Error} If deleting from localStorage fails.
   */
  const deleteTemplate = useCallback((id: string) => {
    try {
        setUserTemplates(prevTemplates => {
            return prevTemplates.filter(
              t => t.id.startsWith('scf-template-') && t.id !== id
            );
        });
    } catch (e) {
        loggingService.error("Failed to delete template from localStorage", e);
        throw new Error("Could not delete the template.");
    }
  }, [setUserTemplates]);

  /**
   * Renames a custom template in local storage.
   *
   * @param {string} id - The ID of the template to rename.
   * @param {string} newName - The new name for the template.
   * @throws {Error} If renaming in localStorage fails.
   */
  const renameTemplate = useCallback((id: string, newName: string) => {
    try {
        setUserTemplates(prevTemplates => {
            const templateIndex = prevTemplates.findIndex(t => t.id === id);

            if (templateIndex === -1 || !prevTemplates[templateIndex].id.startsWith('scf-template-')) {
                return prevTemplates;
            }

            const updatedTemplates = [...prevTemplates];
            updatedTemplates[templateIndex] = { ...updatedTemplates[templateIndex], name: newName };

            return updatedTemplates.filter(t => t.id.startsWith('scf-template-'));
        });
    } catch (e) {
        loggingService.error("Failed to rename template in localStorage", e);
        throw new Error("Could not rename the template.");
    }
  }, [setUserTemplates]);

  return { templates, saveTemplate, deleteTemplate, renameTemplate };
}
