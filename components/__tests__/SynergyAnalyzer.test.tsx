/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SynergyAnalyzer from '../SynergyAnalyzer';
import { analyzeSynergy } from '../../services/geminiService';
import { PromptData, Tier } from '../../types';

vi.mock('../../services/geminiService', () => ({
    analyzeSynergy: vi.fn(),
}));

const mockPromptData: PromptData = {
    context: 'Test Context',
    role: { name: 'Tester', description: 'Tests things' },
    instruction: 'Test instruction',
    specification: 'Test spec',
    performance: 'Test perf',
    preconditions: 'Test pre',
    postconditions: 'Test post',
    schema: '{}',
    governance: 'Test gov'
};

describe('SynergyAnalyzer', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the header and description', () => {
        render(<SynergyAnalyzer promptData={mockPromptData} apiKey="test-key" tier="enterprise" />);
        expect(screen.getByText('Human-AI Synergy Analyzer')).toBeInTheDocument();
        expect(screen.getByText(/Applies the Technology Affordance/i)).toBeInTheDocument();
    });

    it('disables the button and shows correct text when tier is not enterprise', () => {
        render(<SynergyAnalyzer promptData={mockPromptData} apiKey="test-key" tier="pro" />);
        const button = screen.getByRole('button', { name: /Analysis requires Enterprise Tier/i }) as HTMLButtonElement;
        expect(button).toBeInTheDocument();
        expect(button.disabled).toBe(true);
    });

    it('handles successful analysis flow', async () => {
        const mockSynergyAnalysis = {
            humanAffordances: ['Domain expertise'],
            aiAffordances: ['Fast computation'],
            operationalConstraints: ['Data privacy'],
            synergyScore: 85
        };

        (analyzeSynergy as ReturnType<typeof vi.fn>).mockResolvedValue(mockSynergyAnalysis);

        render(<SynergyAnalyzer promptData={mockPromptData} apiKey="test-key" tier="enterprise" />);

        const button = screen.getByRole('button', { name: /Run TACT Synergy Analysis/i }) as HTMLButtonElement;
        expect(button.disabled).toBe(false);

        fireEvent.click(button);

        expect(button.textContent).toMatch(/Analyzing TACT Geometry/i);
        expect(button.disabled).toBe(true);

        await waitFor(() => {
            expect(analyzeSynergy).toHaveBeenCalledWith(mockPromptData, 'test-key');
            expect(screen.getByText('Domain expertise')).toBeInTheDocument();
            expect(screen.getByText('Fast computation')).toBeInTheDocument();
            expect(screen.getByText('Data privacy')).toBeInTheDocument();
            expect(screen.getByText('85/100')).toBeInTheDocument();
        });
    });

    it('handles API error flow', async () => {
        (analyzeSynergy as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Mock API Error'));

        render(<SynergyAnalyzer promptData={mockPromptData} apiKey="test-key" tier="enterprise" />);

        const button = screen.getByRole('button', { name: /Run TACT Synergy Analysis/i }) as HTMLButtonElement;
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('❌ Analysis Failed')).toBeInTheDocument();
            expect(screen.getByText('Mock API Error')).toBeInTheDocument();
        });
    });

    it('handles missing API key', async () => {
        render(<SynergyAnalyzer promptData={mockPromptData} apiKey="" tier="enterprise" />);

        const button = screen.getByRole('button', { name: /Run TACT Synergy Analysis/i }) as HTMLButtonElement;
        fireEvent.click(button);

        await waitFor(() => {
            expect(analyzeSynergy).not.toHaveBeenCalled();
            expect(screen.getByText('❌ Analysis Failed')).toBeInTheDocument();
            expect(screen.getByText('API Key is required for Synergy Analysis.')).toBeInTheDocument();
        });
    });
});
