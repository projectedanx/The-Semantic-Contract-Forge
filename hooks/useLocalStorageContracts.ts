import { useState, useEffect, useCallback } from 'react';
import { SavedPromptContract, PromptData } from '../types';
import { loggingService } from '../services/loggingService';

const STORAGE_KEY = 'semantic-contract-forge-contracts';

export function useLocalStorageContracts(
  setUserError: (message: string | null) => void
) {
  const [contracts, setContracts] = useState<SavedPromptContract[]>([]);

  useEffect(() => {
    try {
      const storedContracts = window.localStorage.getItem(STORAGE_KEY);
      if (storedContracts) {
        setContracts(JSON.parse(storedContracts));
      }
    } catch (e) {
      loggingService.error("Failed to load contracts from localStorage", e);
      setUserError("Could not load saved contracts. Your browser's storage might be disabled or full.");
    }
  }, [setUserError]);

  const saveContract = useCallback((contractToSave: PromptData, id: string | null, name: string): SavedPromptContract => {
    try {
      let newContract: SavedPromptContract = null!;
      setContracts(prevContracts => {
        const existingContractIndex = id ? prevContracts.findIndex(c => c.id === id) : -1;
        let updatedContracts: SavedPromptContract[];

        if (existingContractIndex > -1) {
          // Update existing contract
          newContract = { ...prevContracts[existingContractIndex], ...contractToSave, name };
          updatedContracts = [...prevContracts];
          updatedContracts[existingContractIndex] = newContract;
        } else {
          // Create new contract
          newContract = { ...contractToSave, id: `scf-${Date.now()}`, name };
          updatedContracts = [...prevContracts, newContract];
        }
        
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));
        return updatedContracts;
      });
      return newContract;
    } catch (e) {
      loggingService.error("Failed to save contract to localStorage", e);
      // Re-throw to be caught by the calling component
      throw new Error("Could not save the contract. Your browser's storage might be full.");
    }
  }, []);

  const deleteContract = useCallback((id: string) => {
    try {
      setContracts(prevContracts => {
        const updatedContracts = prevContracts.filter(c => c.id !== id);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));
        return updatedContracts;
      });
    } catch (e) {
      loggingService.error("Failed to delete contract from localStorage", e);
      throw new Error("Could not delete the contract.");
    }
  }, []);

  return { contracts, saveContract, deleteContract };
}
