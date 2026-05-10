import { useState, useEffect, useCallback } from 'react';
import { loggingService } from '../services/loggingService';

/**
 * @file hooks/useLocalStorage.ts
 * @description Provides a generic, type-safe React custom hook for synchronizing state with the
 * browser's localStorage. Includes robust error handling and type-validation guards.
 */

/**
 * Type guard to check if a provided value is a function. Used to support React's functional
 * state updates (e.g., `setState(prev => prev + 1)`).
 *
 * @template T - The expected type if the value is not a function.
 * @param {unknown} val - The value to check.
 * @returns {val is (val: T) => T} True if the value is a function, false otherwise.
 */
export function isFunction<T>(val: unknown): val is (val: T) => T {
  return typeof val === 'function';
}

/**
 * A generic custom hook for managing state synchronized with localStorage.
 * It strictly validates data parsed from storage to prevent runtime errors from malformed data.
 *
 * @template T The internal state type used by the React component.
 * @template S The serialized state type stored in localStorage (defaults to T).
 *
 * @param {string} key - The unique key used to store/retrieve data in localStorage.
 * @param {T} initialValue - The fallback initial value if nothing is found in localStorage.
 * @param {(data: unknown) => data is S} validator - A strict type guard function to validate parsed JSON.
 * @param {(message: string | null) => void} setUserError - Callback to surface human-readable errors to the UI.
 * @param {{ invalidData: string; loadError: string }} errorMessages - Predefined error messages for UI display.
 * @param {(data: S) => T} [parser] - Optional transformer to convert storage type (S) to state type (T).
 * @param {(data: T) => S} [serializer] - Optional transformer to convert state type (T) to storage type (S).
 * @returns {readonly [T, (value: T | ((val: T) => T)) => void]} A tuple containing the current state and a setter function.
 */
export function useLocalStorage<T, S = T>(
  key: string,
  initialValue: T,
  validator: (data: unknown) => data is S,
  setUserError: (message: string | null) => void,
  errorMessages: { invalidData: string; loadError: string },
  parser?: (data: S) => T,
  serializer?: (data: T) => S
) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed: unknown = JSON.parse(item);
        if (validator(parsed)) {
          setStoredValue(parser ? parser(parsed) : (parsed as unknown as T));
        } else {
          loggingService.error(`Invalid data in localStorage for key ${key}`, new Error("Invalid data in localStorage for key " + key));
          setUserError(errorMessages.invalidData);
        }
      }
    } catch (e) {
      loggingService.error(`Failed to load data from localStorage for key ${key}`, e);
      setUserError(errorMessages.loadError);
    }
  }, [key, validator, setUserError, errorMessages, parser]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = isFunction<T>(value) ? value(prev) : value;
        const serializedValue = serializer ? serializer(valueToStore) : (valueToStore as unknown as S);
        window.localStorage.setItem(key, JSON.stringify(serializedValue));
        return valueToStore;
      });
    } catch (e) {
      loggingService.error(`Failed to save data to localStorage for key ${key}`, e);
      throw new Error("Could not save to local storage.");
    }
  }, [key, serializer]);

  return [storedValue, setValue] as const;
}
