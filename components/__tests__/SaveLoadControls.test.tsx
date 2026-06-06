/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SaveLoadControls from '../SaveLoadControls';
import { AppContext } from '../../App';
import { SavedPromptContract, PromptData } from '../../types';

describe('SaveLoadControls', () => {
    const mockOnSave = vi.fn();
    const mockOnLoad = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNew = vi.fn();
    const mockOnSaveTemplate = vi.fn();
    const mockOnOpenTemplateLibrary = vi.fn();

    const mockPromptData: PromptData = {
        context: 'test context',
        role: { name: 'test role', description: 'test description' },
        task: 'test task',
        format: {
            outputType: 'JSON',
            schema: 'test schema',
            instructions: 'test instructions'
        },
        constraints: ['test constraint'],
        examples: [],
        metadata: {
            tier: 'starter',
            targetModel: 'test model'
        }
    };

    const mockContracts: SavedPromptContract[] = [
        {
            id: 'contract-1',
            name: 'Test Contract 1',
            version: 1,
            data: mockPromptData,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
        },
        {
            id: 'contract-2',
            name: 'Test Contract 2',
            version: 1,
            data: mockPromptData,
            createdAt: '2023-01-02T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z'
        }
    ];

    const defaultProps = {
        contracts: mockContracts,
        activeContract: null,
        onSave: mockOnSave,
        onLoad: mockOnLoad,
        onDelete: mockOnDelete,
        onNew: mockOnNew,
        promptData: mockPromptData,
        onSaveTemplate: mockOnSaveTemplate
    };

    const renderWithContext = (props = defaultProps) => {
        return render(
            <AppContext.Provider value={{
                onOpenTemplateLibrary: mockOnOpenTemplateLibrary,
                theme: 'dark',
                toggleTheme: vi.fn(),
                isCompactMode: false,
                toggleCompactMode: vi.fn()
            }}>
                <SaveLoadControls {...props} />
            </AppContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders correctly with default state', () => {
        renderWithContext();
        expect(screen.getByText('Templates')).toBeDefined();
        expect(screen.getByRole('combobox')).toBeDefined();
        expect(screen.getByText('Save As...')).toBeDefined();
        expect(screen.getByText('Save as Template')).toBeDefined();
        // Delete button should not be visible when no active contract
        expect(screen.queryByTitle('Delete Contract')).toBeNull();
    });

    it('handles opening template library', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('Templates'));
        expect(mockOnOpenTemplateLibrary).toHaveBeenCalledTimes(1);
    });

    it('handles loading an existing contract', () => {
        renderWithContext();
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'contract-1' } });
        expect(mockOnLoad).toHaveBeenCalledWith(mockContracts[0]);
    });

    it('handles starting a new contract', () => {
        renderWithContext({ ...defaultProps, activeContract: mockContracts[0] });
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'new' } });
        expect(mockOnNew).toHaveBeenCalledTimes(1);
    });

    it('handles "Save As..." for new contracts', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('Save As...'));

        // Modal should be open
        expect(screen.getByText('Save New Contract')).toBeDefined();

        const input = screen.getByPlaceholderText('e.g., React Component Generator');
        fireEvent.change(input, { target: { value: 'New Test Contract' } });

        fireEvent.click(screen.getByText('Save', { selector: 'button' })); // The button in the modal

        expect(mockOnSave).toHaveBeenCalledWith(mockPromptData, null, 'New Test Contract');
        // Modal should be closed
        expect(screen.queryByText('Save New Contract')).toBeNull();
    });

    it('handles "Save" for existing contracts', () => {
        renderWithContext({ ...defaultProps, activeContract: mockContracts[0] });

        fireEvent.click(screen.getByText('Save'));

        expect(mockOnSave).toHaveBeenCalledWith(mockPromptData, 'contract-1', 'Test Contract 1');
        // Modal should not open
        expect(screen.queryByText('Save New Contract')).toBeNull();
    });

    it('handles "Save as Template"', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('Save as Template'));

        // Modal should be open
        expect(screen.getByText('Save New Template')).toBeDefined();

        const input = screen.getByPlaceholderText('e.g., Python FastAPI Endpoint');
        fireEvent.change(input, { target: { value: 'New Test Template' } });

        fireEvent.click(screen.getByText('Save Template', { selector: 'button' }));

        expect(mockOnSaveTemplate).toHaveBeenCalledWith(mockPromptData, 'New Test Template');
        // Modal should be closed
        expect(screen.queryByText('Save New Template')).toBeNull();
    });

    it('handles deleting an active contract', () => {
        renderWithContext({ ...defaultProps, activeContract: mockContracts[0] });

        fireEvent.click(screen.getByTitle('Delete Contract'));

        // Confirmation modal should be open
        expect(screen.getByText('Delete Contract')).toBeDefined();
        expect(screen.getByText(/Are you sure you want to delete "Test Contract 1"\?/)).toBeDefined();

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(mockOnDelete).toHaveBeenCalledWith('contract-1');
        // Modal should be closed
        expect(screen.queryByText(/Are you sure you want to delete/)).toBeNull();
    });

    it('disables save buttons when input is empty in modals', () => {
        renderWithContext();

        // Check Save As modal
        fireEvent.click(screen.getByText('Save As...'));
        const saveButton = screen.getByText('Save', { selector: 'button' }) as HTMLButtonElement;
        expect(saveButton.disabled).toBe(true);
        fireEvent.click(screen.getByText('Cancel'));

        // Check Save as Template modal
        fireEvent.click(screen.getByText('Save as Template'));
        const saveTemplateButton = screen.getByText('Save Template', { selector: 'button' }) as HTMLButtonElement;
        expect(saveTemplateButton.disabled).toBe(true);
    });
});
