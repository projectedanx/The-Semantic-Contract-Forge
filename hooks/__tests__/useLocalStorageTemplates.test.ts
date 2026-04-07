/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageTemplates } from '../useLocalStorageTemplates';
import { TEMPLATES } from '../../constants/templates';
import { loggingService } from '../../services/loggingService';

import { PromptData, PromptTemplate } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorageTemplates', () => {
  const setUserErrorMock = vi.fn();
  const TEMPLATE_STORAGE_KEY = 'semantic-contract-forge-user-templates';

  const mockPromptData: PromptData = {
    context: 'Test context',
    role: { name: 'Test Role', description: 'Test Description' },
    instruction: 'Test Instruction',
    specification: 'Test Specification',
    performance: 'Test Performance',
    preconditions: 'Test Preconditions',
    postconditions: 'Test Postconditions',
    schema: '',
    governance: 'Test Governance'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should load initial built-in templates', () => {
    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));
    expect(result.current.templates).toEqual(expect.arrayContaining(TEMPLATES));
    expect(setUserErrorMock).not.toHaveBeenCalled();
  });

  it('should load user templates from localStorage on mount', () => {
    const userTemplates: PromptTemplate[] = [
      {
        id: 'scf-template-123',
        name: 'User Template',
        description: 'User-defined custom template.',
        tier: 'starter',
        prompt: { ...mockPromptData },
      }
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(userTemplates));

    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));

    expect(result.current.templates).toEqual([...TEMPLATES, ...userTemplates]);
    expect(setUserErrorMock).not.toHaveBeenCalled();
  });

  it('should save a new template to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));

    let newTemplate: PromptTemplate | undefined;
    act(() => {
      newTemplate = result.current.saveTemplate(mockPromptData, 'New Template');
    });

    expect(newTemplate).toBeDefined();
    expect(newTemplate?.name).toBe('New Template');
    expect(newTemplate?.id).toMatch(/^scf-template-/);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      TEMPLATE_STORAGE_KEY,
      expect.stringContaining('New Template')
    );

    expect(result.current.templates).toContainEqual(newTemplate);
  });

  it('should delete a template from localStorage', () => {
    // Start with a user template in storage
    const userTemplate: PromptTemplate = {
      id: 'scf-template-123',
      name: 'User Template',
      description: 'User-defined custom template.',
      tier: 'starter',
      prompt: { ...mockPromptData },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userTemplate]));

    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));

    act(() => {
      result.current.deleteTemplate('scf-template-123');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(TEMPLATE_STORAGE_KEY, JSON.stringify([]));
    expect(result.current.templates).toEqual(TEMPLATES);
  });

  it('should rename a user template and update localStorage', () => {
    const userTemplate: PromptTemplate = {
      id: 'scf-template-123',
      name: 'Old Name',
      description: 'User-defined custom template.',
      tier: 'starter',
      prompt: { ...mockPromptData },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userTemplate]));

    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));

    act(() => {
      result.current.renameTemplate('scf-template-123', 'New Name');
    });

    const updatedTemplate = { ...userTemplate, name: 'New Name' };
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      TEMPLATE_STORAGE_KEY,
      JSON.stringify([updatedTemplate])
    );
    expect(result.current.templates).toContainEqual(updatedTemplate);
  });

  it('should not change state or localStorage if renaming a non-existent ID', () => {
    const userTemplate: PromptTemplate = {
      id: 'scf-template-123',
      name: 'Old Name',
      description: 'User-defined custom template.',
      tier: 'starter',
      prompt: { ...mockPromptData },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userTemplate]));

    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));
    const initialState = result.current.templates;

    act(() => {
      result.current.renameTemplate('non-existent-id', 'New Name');
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(result.current.templates).toEqual(initialState);
  });


  it('should catch and rethrow error when saving to localStorage fails', () => {
    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));

    // Mock setItem to throw an error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    // Spy on loggingService.error
    const loggingSpy = vi.spyOn(loggingService, 'error').mockImplementation(() => {});

    expect(() => {
      result.current.saveTemplate(mockPromptData, 'Failing Template');
    }).toThrowError("Could not save the template. Your browser's storage might be full.");

    expect(loggingSpy).toHaveBeenCalledWith(
      "Failed to save template to localStorage",
      expect.any(Error)
    );

    loggingSpy.mockRestore();
  });

  it('should not rename a built-in template', () => {
    const { result } = renderHook(() => useLocalStorageTemplates(setUserErrorMock));
    const builtInId = TEMPLATES[0].id;
    const initialState = [...result.current.templates];

    act(() => {
      result.current.renameTemplate(builtInId, 'Modified Name');
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(result.current.templates).toEqual(initialState);
  });
});
