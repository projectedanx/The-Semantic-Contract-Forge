
import { useState, useEffect, useCallback } from 'react';
import { PromptTemplate, PromptData } from '../types';
import { TEMPLATES } from '../constants/templates';
import { loggingService } from '../services/loggingService';

const TEMPLATE_STORAGE_KEY = 'semantic-contract-forge-user-templates';

// This hook provides the set of prompt templates.
// It loads a static list and any user-created templates from localStorage.
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
