
import { useState, useEffect, useCallback } from 'react';
import { PromptTemplate, PromptData } from '../types';
import { TEMPLATES } from '../constants/templates';
import { loggingService } from '../services/loggingService';

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
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);

  useEffect(() => {
    try {
      const storedTemplates = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
      const userTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
      // Combine built-in templates with user-created templates
      setTemplates([...TEMPLATES, ...userTemplates]);
    } catch (e) {
      loggingService.error("Failed to load templates", e);
      setUserError("Could not load prompt templates.");
    }
  }, [setUserError]);

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

        setTemplates(prevTemplates => {
            const userTemplates = prevTemplates.filter(t => t.id.startsWith('scf-template-'));
            const updatedUserTemplates = [...userTemplates, newTemplate];
            window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updatedUserTemplates));
            return [...TEMPLATES, ...updatedUserTemplates];
        });

        return newTemplate;
    } catch (e) {
        loggingService.error("Failed to save template to localStorage", e);
        throw new Error("Could not save the template. Your browser's storage might be full.");
    }
  }, []);

  /**
   * Deletes a custom template from local storage by its ID.
   *
   * @param {string} id - The ID of the template to delete.
   * @throws {Error} If deleting from localStorage fails.
   */
  const deleteTemplate = useCallback((id: string) => {
    try {
        setTemplates(prevTemplates => {
            const userTemplates = prevTemplates.filter(t => t.id.startsWith('scf-template-'));
            const updatedUserTemplates = userTemplates.filter(t => t.id !== id);
            window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updatedUserTemplates));
            return [...TEMPLATES, ...updatedUserTemplates];
        });
    } catch (e) {
        loggingService.error("Failed to delete template from localStorage", e);
        throw new Error("Could not delete the template.");
    }
  }, []);

  /**
   * Renames a custom template in local storage.
   *
   * @param {string} id - The ID of the template to rename.
   * @param {string} newName - The new name for the template.
   * @throws {Error} If renaming in localStorage fails.
   */
  const renameTemplate = useCallback((id: string, newName: string) => {
    try {
        setTemplates(prevTemplates => {
            const userTemplates = prevTemplates.filter(t => t.id.startsWith('scf-template-'));
            const templateIndex = userTemplates.findIndex(t => t.id === id);
            if (templateIndex === -1) return prevTemplates;

            const updatedUserTemplates = [...userTemplates];
            updatedUserTemplates[templateIndex] = { ...updatedUserTemplates[templateIndex], name: newName };

            window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updatedUserTemplates));
            return [...TEMPLATES, ...updatedUserTemplates];
        });
    } catch (e) {
        loggingService.error("Failed to rename template in localStorage", e);
        throw new Error("Could not rename the template.");
    }
  }, []);

  return { templates, saveTemplate, deleteTemplate, renameTemplate };
}
