import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as geminiService from '../services/geminiService';

// Mock the geminiService
vi.mock('../services/geminiService', () => ({
  validatePromptOutput: vi.fn(),
  generateRole: vi.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    // Mock local storage
    Storage.prototype.getItem = vi.fn(() => '[]');
    Storage.prototype.setItem = vi.fn();
  });

  it('should render the header and initial components', () => {
    render(<App />);
    expect(screen.getByText('Semantic Contract Forge')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., You are building a component for an e-commerce dashboard...")).toBeInTheDocument();
  });

  it('should switch tiers when a new tier is selected', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Pro'));
    expect(screen.getByText('Preconditions')).toBeInTheDocument();
  });

  it('should call validatePromptOutput when the validate button is clicked', async () => {
    (geminiService.validatePromptOutput as vi.Mock).mockResolvedValue({ success: true, data: { result: 'valid' } });

    render(<App />);
    await userEvent.click(screen.getByText('Pro'));
    await userEvent.click(screen.getByText('Validate Output with Gemini'));

    expect(geminiService.validatePromptOutput).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/Validation Successful/)).toBeInTheDocument();
  });

  it('should display an error message if validation fails', async () => {
    const errorMessage = 'Validation failed';
    (geminiService.validatePromptOutput as vi.Mock).mockRejectedValue(new Error(errorMessage));

    render(<App />);
    await userEvent.click(screen.getByText('Pro'));
    await userEvent.click(screen.getByText('Validate Output with Gemini'));

    await waitFor(() => {
      const toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveTextContent(errorMessage);
    });
  });

  it('should allow creating and loading a new contract', async () => {
    render(<App />);
    const contextTextarea = screen.getByPlaceholderText("e.g., You are building a component for an e-commerce dashboard...");
    await userEvent.clear(contextTextarea);
    await userEvent.type(contextTextarea, 'New contract context');

    expect(contextTextarea).toHaveValue('New contract context');
  });
});
