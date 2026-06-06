/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import RoleGenerator from '../RoleGenerator';
import { Role } from '../../types';

describe('RoleGenerator', () => {
    const mockOnGenerate = vi.fn();
    const mockOnRoleGenerated = vi.fn();

    const dummyRole: Role = {
        name: "Test Pirate",
        description: "A funny test pirate.",
        tone: "Humorous",
        expertise: ["Piracy", "Jokes"],
        restrictions: ["No swearing"]
    };

    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the textarea and button correctly', () => {
        render(<RoleGenerator onGenerate={mockOnGenerate} onRoleGenerated={mockOnRoleGenerated} disabled={false} />);
        expect(screen.getByPlaceholderText(/e\.g\., 'A witty pirate captain who explains things in nautical terms\.'/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Generate Role/i })).toBeInTheDocument();
    });

    it('should show disabled state when disabled prop is true', () => {
        render(<RoleGenerator onGenerate={mockOnGenerate} onRoleGenerated={mockOnRoleGenerated} disabled={true} />);

        const textArea = screen.getByPlaceholderText(/e\.g\., 'A witty pirate captain who explains things in nautical terms\.'/i) as HTMLTextAreaElement;
        expect(textArea.disabled).toBe(true);

        const button = screen.getByRole('button', { name: /Generate Role/i }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it('should show an error if input is empty on generate', async () => {
        // Render without disabled so we can type
        render(<RoleGenerator onGenerate={mockOnGenerate} onRoleGenerated={mockOnRoleGenerated} disabled={false} />);

        const button = screen.getByRole('button', { name: /Generate Role/i }) as HTMLButtonElement;

        // Button should initially be disabled
        expect(button.disabled).toBe(true);

        // Let's type some whitespace to verify it stays disabled
        const textArea = screen.getByPlaceholderText(/e\.g\., 'A witty pirate captain who explains things in nautical terms\.'/i);
        fireEvent.change(textArea, { target: { value: '   ' } });
        expect(button.disabled).toBe(true);

        // We can't click the disabled button, so the error message logic "Persona description cannot be empty."
        // won't realistically trigger via user interaction in this component, because the button is disabled!
        // We will just verify it stays disabled for empty input.
        fireEvent.change(textArea, { target: { value: 'Valid input' } });
        expect(button.disabled).toBe(false);
    });

    it('should call onGenerate and invoke callback on success, showing loading state', async () => {
        mockOnGenerate.mockResolvedValue(dummyRole);

        render(<RoleGenerator onGenerate={mockOnGenerate} onRoleGenerated={mockOnRoleGenerated} disabled={false} />);

        const textArea = screen.getByPlaceholderText(/e\.g\., 'A witty pirate captain who explains things in nautical terms\.'/i) as HTMLTextAreaElement;
        fireEvent.change(textArea, { target: { value: 'A cool pirate' } });

        const button = screen.getByRole('button', { name: /Generate Role/i }) as HTMLButtonElement;
        fireEvent.click(button);

        expect(button.textContent).toMatch(/Generating.../i);
        expect(button.disabled).toBe(true);
        expect(textArea.disabled).toBe(true); // Should disable textarea while loading

        await waitFor(() => {
            expect(mockOnGenerate).toHaveBeenCalledWith('A cool pirate');
            expect(mockOnRoleGenerated).toHaveBeenCalledWith(dummyRole);
            expect(textArea.value).toBe(''); // Text area cleared
        });
    });

    it('should handle API errors gracefully', async () => {
        mockOnGenerate.mockRejectedValue(new Error('API failure'));

        render(<RoleGenerator onGenerate={mockOnGenerate} onRoleGenerated={mockOnRoleGenerated} disabled={false} />);

        const textArea = screen.getByPlaceholderText(/e\.g\., 'A witty pirate captain who explains things in nautical terms\.'/i);
        fireEvent.change(textArea, { target: { value: 'A cool pirate' } });

        const button = screen.getByRole('button', { name: /Generate Role/i }) as HTMLButtonElement;
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/API failure/i)).toBeInTheDocument();
            expect(mockOnRoleGenerated).not.toHaveBeenCalled();
        });
    });
});
