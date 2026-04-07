import { useCallback, useMemo } from 'react';
import { SavedPromptContract, PromptData } from '../types';
import { loggingService } from '../services/loggingService';
import { isSavedPromptContractArray } from '../utils/validation';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'semantic-contract-forge-contracts';

/**
 * Custom hook for managing prompt contracts in the browser's local storage.
 * It handles loading, saving, and deleting contracts, while also providing error handling.
 *
 * @param {(message: string | null) => void} setUserError - A callback function to set user-facing error messages.
 * @returns {{
 *   contracts: SavedPromptContract[],
 *   saveContract: (contractToSave: PromptData, id: string | null, name: string) => SavedPromptContract,
 *   deleteContract: (id: string) => void
 * }} An object containing the list of contracts and functions to manage them.
 */
export function useLocalStorageContracts(
  setUserError: (message: string | null) => void
) {
  const [contracts, setContracts] = useLocalStorage<Record<string, SavedPromptContract>, SavedPromptContract[]>(
    STORAGE_KEY,
    {},
    isSavedPromptContractArray,
    setUserError,
    {
      invalidData: "Could not load saved contracts. The stored data is invalid.",
      loadError: "Could not load saved contracts. Your browser's storage might be disabled or full."
    },
    useCallback((parsedContracts: SavedPromptContract[]) => {
      const contractsMap: Record<string, SavedPromptContract> = {};
      parsedContracts.forEach((contract: SavedPromptContract) => {
        contractsMap[contract.id] = contract;
      });
      return contractsMap;
    }, []),
    useCallback((contractsMap: Record<string, SavedPromptContract>) => {
      return Object.values(contractsMap);
    }, [])
  );

  /**
   * Saves or updates a prompt contract in local storage.
   * If an `id` is provided, it updates the existing contract. Otherwise, it creates a new one.
   *
   * @param {PromptData} contractToSave - The prompt data to be saved.
   * @param {string | null} id - The ID of the contract to update, or null for a new contract.
   * @param {string} name - The name of the contract.
   * @returns {SavedPromptContract} The newly saved or updated contract.
   * @throws {Error} If saving to localStorage fails.
   */
  const saveContract = useCallback((contractToSave: PromptData, id: string | null, name: string): SavedPromptContract => {
    let newContract: SavedPromptContract = null!;
    try {
      setContracts(prevContracts => {
        let updatedContracts: Record<string, SavedPromptContract>;

        if (id && prevContracts[id]) {
          // Update existing contract
          newContract = { ...prevContracts[id], ...contractToSave, name };
          updatedContracts = { ...prevContracts, [id]: newContract };
        } else {
          // Create new contract
          const newId = `scf-${Date.now()}`;
          newContract = { ...contractToSave, id: newId, name };
          updatedContracts = { ...prevContracts, [newId]: newContract };
        }
        
        return updatedContracts;
      });
      return newContract;
    } catch (e) {
      // Re-throw to be caught by the calling component
      throw new Error("Could not save the contract. Your browser's storage might be full.");
    }
  }, [setContracts]);

  /**
   * Deletes a contract from local storage by its ID.
   *
   * @param {string} id - The ID of the contract to delete.
   * @throws {Error} If deleting from localStorage fails.
   */
  const deleteContract = useCallback((id: string) => {
    try {
      setContracts(prevContracts => {
        const updatedContracts = { ...prevContracts };
        delete updatedContracts[id];
        return updatedContracts;
      });
    } catch (e) {
      throw new Error("Could not delete the contract.");
    }
  }, [setContracts]);

  const contractsArray = useMemo(() => Object.values(contracts), [contracts]);

  return { contracts: contractsArray, saveContract, deleteContract };
}
