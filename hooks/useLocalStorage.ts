import { useState, useEffect, useCallback } from 'react';
import { loggingService } from '../services/loggingService';

export function isFunction<T>(val: unknown): val is (val: T) => T {
  return typeof val === 'function';
}

/**
 * Custom hook for managing state synchronized with localStorage.
 *
 * @param key The localStorage key.
 * @param initialValue The initial value if nothing is in localStorage.
 * @param validator A function to validate the parsed data from localStorage.
 * @param setUserError A callback to set a user-facing error message.
 * @param errorMessages Error messages for invalid data and load failures.
 * @param parser An optional function to parse the validated data into the state type.
 * @param serializer An optional function to serialize the state type back into the storage type.
 * @returns A tuple containing the state and the state setter.
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
