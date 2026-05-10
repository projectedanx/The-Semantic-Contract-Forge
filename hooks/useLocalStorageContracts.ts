import { useCallback, useMemo } from 'react';
import { SavedPromptContract, PromptData } from '../types';
import { loggingService } from '../services/loggingService';
import { isSavedPromptContractArray } from '../utils/validation';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'semantic-contract-forge-contracts';

/**
 * @file hooks/useLocalStorageContracts.ts
 * @description Provides a custom React hook for managing the user's saved `PromptData`
 * contracts. Utilizes the generic `useLocalStorage` hook and optimizes React rendering
 * by storing contracts internally as a Record (O(1) lookups) while exposing them as an Array.
 */

/**
 * Custom hook for managing prompt contracts persisted in the browser's local storage.
 * It handles creating, reading, updating, and deleting (CRUD) contracts securely,
 * leveraging centralized validation guards.
 *
 * @param {(message: string | null) => void} setUserError - Callback to surface human-readable storage errors to the UI.
 * @returns {{
 *   contracts: SavedPromptContract[],
 *   saveContract: (contractToSave: PromptData, id: string | null, name: string) => SavedPromptContract,
 *   deleteContract: (id: string) => void
 * }} An object containing the list of available contracts and functions to mutate them.
 */
export function useLocalStorageContracts(
  setUserError: (message: string | null) => void
) {
  // Store as Record for O(1) mutations, serialize/deserialize to Array for storage.
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
   * Saves a new prompt contract or updates an existing one in local storage.
   * If a valid `id` is provided that exists in storage, it merges updates.
   * Otherwise, it generates a new UUID and creates a new entry.
   *
   * @param {PromptData} contractToSave - The transient prompt data payload to persist.
   * @param {string | null} id - The unique UUID of the contract to update, or null if creating anew.
   * @param {string} name - The user-defined display name for the contract.
   * @returns {SavedPromptContract} The resulting contract object as saved in storage.
   * @throws {Error} Re-throws storage constraint errors to be handled by the UI.
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
   * Permanently deletes a contract from local storage.
   *
   * @param {string} id - The unique UUID of the contract to delete.
   * @returns {void}
   * @throws {Error} Re-throws storage write errors.
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

  // Memoize the conversion back to an array for UI consumption to prevent unnecessary re-renders.
  const contractsArray = useMemo(() => Object.values(contracts), [contracts]);

  return { contracts: contractsArray, saveContract, deleteContract };
}
