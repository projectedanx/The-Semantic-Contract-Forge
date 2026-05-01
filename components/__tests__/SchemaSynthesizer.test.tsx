/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SchemaSynthesizer from '../SchemaSynthesizer';
import { generateSchemaFromExample } from '../../services/geminiService';

vi.mock('../../services/geminiService', () => ({
    generateSchemaFromExample: vi.fn(),
}));

describe('SchemaSynthesizer', () => {
    const mockOnSchemaGenerated = vi.fn();
    const apiKey = 'dummy_key';

    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render a text area and a button', () => {
        render(<SchemaSynthesizer onSchemaGenerated={mockOnSchemaGenerated} apiKey={apiKey} tier="enterprise" />);
        expect(screen.getByPlaceholderText(/Paste an example output here/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Synthesize Schema/i })).toBeInTheDocument();
    });

    it('should show disabled state for non-Pro/Enterprise tiers', () => {
        render(<SchemaSynthesizer onSchemaGenerated={mockOnSchemaGenerated} apiKey={apiKey} tier="starter" />);
        const button = screen.getByRole('button', { name: /Requires Pro\/Enterprise/i }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it('should call generateSchemaFromExample and invoke callback on success', async () => {
        const mockSchema = '{"type":"object"}';
        (generateSchemaFromExample as ReturnType<typeof vi.fn>).mockResolvedValue(mockSchema);

        render(<SchemaSynthesizer onSchemaGenerated={mockOnSchemaGenerated} apiKey={apiKey} tier="enterprise" />);

        const textArea = screen.getByPlaceholderText(/Paste an example output here/i);
        fireEvent.change(textArea, { target: { value: '{"a": 1}' } });

        const button = screen.getByRole('button', { name: /Synthesize Schema/i }) as HTMLButtonElement;
        fireEvent.click(button);

        expect(button.textContent).toMatch(/Synthesizing.../i);
        expect(button.disabled).toBe(true);

        await waitFor(() => {
            expect(generateSchemaFromExample).toHaveBeenCalledWith('{"a": 1}', apiKey);
            expect(mockOnSchemaGenerated).toHaveBeenCalledWith(mockSchema);
            expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
        });
    });

    it('should handle API errors gracefully', async () => {
        (generateSchemaFromExample as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API failure'));

        render(<SchemaSynthesizer onSchemaGenerated={mockOnSchemaGenerated} apiKey={apiKey} tier="enterprise" />);

        const textArea = screen.getByPlaceholderText(/Paste an example output here/i);
        fireEvent.change(textArea, { target: { value: '{"a": 1}' } });

        const button = screen.getByRole('button', { name: /Synthesize Schema/i }) as HTMLButtonElement;
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText(/API failure/i)).not.toBeNull();
            expect(mockOnSchemaGenerated).not.toHaveBeenCalled();
        });
    });
});
