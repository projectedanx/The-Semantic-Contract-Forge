
import { useState, useEffect } from 'react';
import { PromptTemplate } from '../types';
import { TEMPLATES } from '../constants/templates';
import { loggingService } from '../services/loggingService';

// This hook provides the set of prompt templates.
// Currently, it loads a static list, but could be extended to allow user-created templates in localStorage.
export function useLocalStorageTemplates(
  setUserError: (message: string | null) => void
) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);

  useEffect(() => {
    try {
      // Load the built-in templates from constants.
      setTemplates(TEMPLATES);
    } catch (e) {
      loggingService.error("Failed to load templates", e);
      setUserError("Could not load prompt templates.");
    }
  }, [setUserError]);

  return { templates };
}
