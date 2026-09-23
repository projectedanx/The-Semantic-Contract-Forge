import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AlaGuardService } from '../src/services/alaGuardService';
import { ActionVector, AlaState } from '../types';
import { NeuralSymbolicEvaluator } from '../src/services/alaGuardService';

describe('AlaGuardService', () => {
  let service: AlaGuardService;
  let mockEvaluator: NeuralSymbolicEvaluator;

  beforeEach(() => {
    mockEvaluator = {
      evaluateNeuralSequence: vi.fn().mockReturnValue(0.55),
      evaluateGraphReconstruction: vi.fn().mockReturnValue(0.4)
    };
    service = new AlaGuardService(mockEvaluator);
    // Mock Math.random to make tests deterministic

  });

  it('should allow laminar pass if tool not in watchlist and entropy <= 0.40', () => {
    const action: ActionVector = {
      tool: 'safe_tool',
      arguments: {},
      executionTrace: 'start -> safe_tool',
      entropyGradient: 0.20,
      bicmIntentCoherence: 0.1
    };

    const result = service.verifyAction(action);
    expect(result.status).toBe('LAMINAR');
    expect(result.riskScore).toBe(0.20);
  });

  it('should trigger heavy evaluation and allow if risk < 0.80 for high entropy tool', () => {
    const action: ActionVector = {
      tool: 'safe_tool',
      arguments: {},
      executionTrace: 'start -> safe_tool',
      entropyGradient: 0.50, // > 0.40 WARNING_THRESHOLD
      bicmIntentCoherence: 0.1 // Low divergence
    };

    const result = service.verifyAction(action);

    expect(result.status).toBe('LAMINAR');
    expect(result.riskScore).toBeCloseTo(0.3125);
  });

  it('should trigger heavy evaluation and HALT (BREACH) if risk >= 0.80', () => {
    service.addToWatchlist('dangerous_tool');

    const action: ActionVector = {
      tool: 'dangerous_tool',
      arguments: {},
      executionTrace: 'start -> dangerous_tool',
      entropyGradient: 0.90, // Very high
      bicmIntentCoherence: 0.9 // Very high divergence
    };

    (mockEvaluator.evaluateNeuralSequence as any).mockReturnValue(0.75);
    (mockEvaluator.evaluateGraphReconstruction as any).mockReturnValue(0.56);

    // To breach (>=0.80), let's manually override
    (mockEvaluator.evaluateNeuralSequence as any).mockReturnValue(0.795);
    (mockEvaluator.evaluateGraphReconstruction as any).mockReturnValue(0.596);
    // Let's set sBicm = 1.0 (max)
    action.bicmIntentCoherence = 1.0;

    const result = service.verifyAction(action);

    expect(result.status).toBe('BREACH');
    expect(result.riskScore).toBeGreaterThanOrEqual(0.80);
    expect(result.traceback).toContain('Ontological Traceback for tool: dangerous_tool');
  });

  it('should handle Terminate HITL verdict correctly', () => {
    const state: AlaState = {
      target_agent_id: 'agent_01',
      entropy_gradient: 0.85,
      bicm_intent_coherence: 0.9,
      time_to_decision_lag_ms: 1200
    };

    const event = service.handleHitlVerdict('Terminate', state);

    expect(event['prov:type']).toBe('ala_adaptation_event');
    expect(event.hitl_verdict).toBe('TERMINATE_CONFIRMED_MISUSE');
    expect(event.ala_action.exploit_fingerprint_generated).toContain('SM-03_toolchain_surprise_');
    // Threshold shifts down by 0.25 * 0.1 = 0.025 (0.40 - 0.025 = 0.375 -> rounded 0.37/0.38)
    expect(event.ala_action.recalibrated_weights.toolchain_entropy_threshold).toBeCloseTo(0.37, 1);
  });

  it('should handle Override HITL verdict correctly', () => {
    const state: AlaState = {
      target_agent_id: 'agent_01',
      entropy_gradient: 0.45,
      bicm_intent_coherence: 0.2,
      time_to_decision_lag_ms: 800
    };

    const event = service.handleHitlVerdict('Override', state);

    expect(event['prov:type']).toBe('ala_adaptation_event');
    expect(event.hitl_verdict).toBe('OVERRIDE_CONFIRMED');
    expect(event.ala_action.exploit_fingerprint_generated).toBeUndefined();
    // Threshold shifts up by 0.12 * 0.1 = 0.012 (0.40 + 0.012 = 0.412 -> rounded 0.41)
    expect(event.ala_action.recalibrated_weights.toolchain_entropy_threshold).toBeCloseTo(0.41, 1);
  });
});
