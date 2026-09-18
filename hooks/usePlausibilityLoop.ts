import React, { useState, useCallback } from 'react';
import { PromptData } from '../types';
import { validatePlausibility, validatePromptOutput } from '../services/geminiService';
import { generatePromptText } from '../utils/promptGenerator';

/**
 * @file hooks/usePlausibilityLoop.ts
 * @description Manages the iterative Plausibility Oracle feedback loop for Project Aurelius.
 */

interface UsePlausibilityLoopProps {
  promptData: PromptData;
  setPromptData: React.Dispatch<React.SetStateAction<PromptData>>;
  apiKey: string;
}

export function usePlausibilityLoop({ promptData, setPromptData, apiKey }: UsePlausibilityLoopProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationIterations, setOptimizationIterations] = useState(0);
  const [plausibilityScore, setPlausibilityScore] = useState<number | null>(null);
  const [oracleFeedback, setOracleFeedback] = useState<string>('');

  const runOptimization = useCallback(async () => {
    if (!apiKey) return;

    setIsOptimizing(true);
    setOptimizationIterations(0);
    setPlausibilityScore(null);
    setOracleFeedback('');

    let currentPromptData = { ...promptData };
    let currentScore = 0;
    let iterations = 0;
    const maxIterations = 3;
    const targetScore = 90;

    try {
      while (currentScore < targetScore && iterations < maxIterations) {
        iterations++;
        setOptimizationIterations(iterations);

        // 1. Generate a mock output using the current contract
        // In a real system, this would call a downstream diffusion model or rendering engine.
        // Here, we use the schema validator endpoint as a proxy to "execute" the prompt.
        let generatedOutput: string;
        try {
             // Mock execution: we just ask the model to generate an example based on the prompt
             // Reusing the validateSchema functionality which generates an example output
             const mockSchema = currentPromptData.schema || '{"type": "object"}';
             const executionResult = await validatePromptOutput(currentPromptData, 'enterprise', apiKey);
             generatedOutput = JSON.stringify(executionResult, null, 2);
        } catch (e) {
             generatedOutput = "Execution Failed: " + (e instanceof Error ? e.message : String(e));
        }

        // 2. Oracle Validation
        const evaluation = await validatePlausibility(currentPromptData, generatedOutput, apiKey);

        currentScore = evaluation.score;
        setPlausibilityScore(currentScore);

        if (currentScore < targetScore && evaluation.suggestedConstraints) {
            // 3. Append constraints and retry
            const updatedGovernance = currentPromptData.governance
                ? `${currentPromptData.governance}\n\n[ORACLE CORRECTION]: ${evaluation.suggestedConstraints}`
                : `[ORACLE CORRECTION]: ${evaluation.suggestedConstraints}`;

            currentPromptData = {
                ...currentPromptData,
                governance: updatedGovernance
            };

            setPromptData(currentPromptData);
            setOracleFeedback(evaluation.suggestedConstraints);
        }
      }
    } catch (error) {
        console.error("Optimization Loop Error:", error);
        setOracleFeedback("Optimization loop failed due to an error.");
    } finally {
        setIsOptimizing(false);
    }

  }, [promptData, setPromptData, apiKey]);

  return {
    isOptimizing,
    optimizationIterations,
    plausibilityScore,
    oracleFeedback,
    runOptimization
  };
}
