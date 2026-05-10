import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorageTemplates } from '../useLocalStorageTemplates';
import { loggingService } from '../../services/loggingService';
import { TEMPLATES } from '../../constants/templates';

// Setup jsdom environment for window
/**
 * @vitest-environment jsdom
 */

// Mock loggingService
vi.mock('../../services/loggingService', () => ({
  loggingService: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

const STORAGE_KEY = 'semantic-contract-forge-user-templates';

const validPromptData = {
  context: 'Context',
  role: { name: 'Role', description: 'Desc' },
  instruction: 'Inst',
  specification: 'Spec',
  performance: 'Perf',
  preconditions: 'Pre',
  postconditions: 'Post',
  schema: 'Schema',
  governance: 'Gov'
};

const validCustomTemplate = {
  id: 'scf-template-123',
  name: 'Custom Template 1',
  description: 'User-defined custom template.',
  tier: 'starter',
  prompt: validPromptData
};

describe('useLocalStorageTemplates', () => {
  let mockGetItem: any;
  let mockSetItem: any;

  beforeEach(() => {
    mockGetItem = vi.spyOn(Storage.prototype, 'getItem');
    mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with built-in templates if localStorage is empty', () => {
    mockGetItem.mockReturnValue(null);
    const mockSetUserError = vi.fn();

    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    expect(result.current.templates).toEqual(TEMPLATES);
    expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(mockSetUserError).not.toHaveBeenCalled();
  });

  it('should load user templates and append them to built-in templates', () => {
    mockGetItem.mockReturnValue(JSON.stringify([validCustomTemplate]));
    const mockSetUserError = vi.fn();

    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    expect(result.current.templates).toHaveLength(TEMPLATES.length + 1);
    expect(result.current.templates).toContainEqual(validCustomTemplate);
  });

  it('should handle invalid template data in localStorage', () => {
    const invalidTemplates = [{ id: 'scf-template-123' }]; // Missing required fields
    mockGetItem.mockReturnValue(JSON.stringify(invalidTemplates));
    const mockSetUserError = vi.fn();

    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    expect(result.current.templates).toEqual(TEMPLATES);
    expect(loggingService.error).toHaveBeenCalled();
    expect(mockSetUserError).toHaveBeenCalledWith("Could not load some prompt templates. The stored data is invalid.");
  });

  it('should save a new custom template', () => {
    mockGetItem.mockReturnValue(null);
    const mockSetUserError = vi.fn();
    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    let savedTemplate: any;
    act(() => {
      savedTemplate = result.current.saveTemplate(validPromptData as any, 'New Custom Template');
    });

    expect(savedTemplate).toMatchObject({
      name: 'New Custom Template',
      description: 'User-defined custom template.',
      tier: 'starter',
      prompt: validPromptData
    });
    expect(savedTemplate.id).toMatch(/^scf-template-\d+$/);

    expect(result.current.templates).toHaveLength(TEMPLATES.length + 1);
    expect(result.current.templates).toContainEqual(savedTemplate);

    expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEY, expect.stringContaining('"name":"New Custom Template"'));
  });

  it('should rename an existing custom template', () => {
    mockGetItem.mockReturnValue(JSON.stringify([validCustomTemplate]));
    const mockSetUserError = vi.fn();
    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    act(() => {
      result.current.renameTemplate(validCustomTemplate.id, 'Renamed Template');
    });

    const updatedTemplate = result.current.templates.find(t => t.id === validCustomTemplate.id);
    expect(updatedTemplate?.name).toBe('Renamed Template');
    expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEY, expect.stringContaining('"name":"Renamed Template"'));
  });

  it('should delete a custom template', () => {
    mockGetItem.mockReturnValue(JSON.stringify([validCustomTemplate]));
    const mockSetUserError = vi.fn();
    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    act(() => {
      result.current.deleteTemplate(validCustomTemplate.id);
    });

    expect(result.current.templates).toHaveLength(TEMPLATES.length);
    const deletedTemplate = result.current.templates.find(t => t.id === validCustomTemplate.id);
    expect(deletedTemplate).toBeUndefined();
    expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEY, "[]");
  });

  it('should ignore rename requests for non-existent templates', () => {
    mockGetItem.mockReturnValue(JSON.stringify([validCustomTemplate]));
    const mockSetUserError = vi.fn();
    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    act(() => {
      result.current.renameTemplate('non-existent-id', 'Renamed Template');
    });

    const originalTemplate = result.current.templates.find(t => t.id === validCustomTemplate.id);
    expect(originalTemplate?.name).toBe('Custom Template 1');
  });

    it('should ignore rename requests for built in templates', () => {
    mockGetItem.mockReturnValue(JSON.stringify([validCustomTemplate]));
    const mockSetUserError = vi.fn();
    const { result } = renderHook(() => useLocalStorageTemplates(mockSetUserError));

    const builtInTemplateId = TEMPLATES[0].id;
    act(() => {
      result.current.renameTemplate(builtInTemplateId, 'Renamed Template');
    });

    const originalTemplate = result.current.templates.find(t => t.id === builtInTemplateId);
    expect(originalTemplate?.name).toBe(TEMPLATES[0].name);
  });
});
