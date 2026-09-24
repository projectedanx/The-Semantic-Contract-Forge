import { describe, it, expect, vi } from 'vitest';
import { SystemAssuranceAgent, TemporalBlendingEngine } from '../tbeService';
import { CausalTrace, CausalState, CausalAction } from '../../types';

// Mock logging service
vi.mock('../loggingService', () => ({
  loggingService: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
}));

describe('SystemAssuranceAgent', () => {
  it('Theorem 3.1: The Security Camera Lemma - Cascading Contradiction Boundary', () => {
    // We construct a trace where a security camera is disabled at step 1.
    // At step k (where k < 21, i.e., total trace length N=20), an action demands the camera to be active.
    // We expect CPI < 0.95 and status EPISTEMIC_ESCROW.

    const N = 20; // trace length
    const states: CausalState[] = [];
    const actions: CausalAction[] = [];

    // Initial state: Camera is active (1)
    let currentState: CausalState = { f_cam: 1, f_other: 0 };
    states.push({ ...currentState });

    // Step 1: Disable camera
    const actionDisable: CausalAction = {
      id: 'a_disable',
      preconditions: {}, // No specific precondition
      effects: { f_cam: 0 }
    };
    actions.push(actionDisable);
    currentState = { f_cam: 0, f_other: 0 };
    states.push({ ...currentState });

    // Fill steps 2 to N-2 with valid generic actions that do not affect f_cam
    for (let i = 2; i < N - 1; i++) {
      actions.push({
        id: `a_generic_${i}`,
        preconditions: { f_cam: 0 }, // It's disabled, and they know it
        effects: { f_other: i }      // Affects some other fluent
      });
      currentState = { f_cam: 0, f_other: i };
      states.push({ ...currentState });
    }

    // At step N-1: LLM hallucination - requires f_cam = 1
    const actionHallucination: CausalAction = {
      id: 'a_contradiction',
      preconditions: { f_cam: 1 }, // Contradiction! Camera is 0.
      effects: { f_other: 999 }
    };
    actions.push(actionHallucination);
    currentState = { f_cam: 0, f_other: 999 }; // Let's say the effect happens, but precondition failed
    states.push({ ...currentState });

    const trace: CausalTrace = { states, actions };

    const saa = new SystemAssuranceAgent();
    const result = saa.evaluateTrace(trace);

    // One contradiction in N-1=19 actions. 18/19 = 0.947... < 0.95
    expect(result.cpiScore).toBeLessThan(0.95);
    expect(result.passed).toBe(false);
    expect(result.contradictions.length).toBeGreaterThan(0);
    expect(result.contradictions.some(c => c.includes('Preconditions for action a_contradiction not met'))).toBe(true);

    const tbe = new TemporalBlendingEngine();
    const tbeOutput = tbe.processBlend(trace);

    expect(tbeOutput.status).toBe('EPISTEMIC_ESCROW');
  });

  it('Verifies the Frame Operator', () => {
    // Trace where an action modifies a fluent, but the next state also mutates an unrelated fluent
    const states: CausalState[] = [
      { f1: 1, f2: 1 },
      { f1: 0, f2: 0 } // f2 changed from 1 to 0 without being in effects
    ];
    const actions: CausalAction[] = [
      {
        id: 'a1',
        preconditions: { f1: 1 },
        effects: { f1: 0 }
      }
    ];

    const trace: CausalTrace = { states, actions };
    const saa = new SystemAssuranceAgent();
    const result = saa.evaluateTrace(trace);

    expect(result.passed).toBe(false);
    expect(result.contradictions.some(c => c.includes("Frame operator violation for fluent 'f2'"))).toBe(true);
  });

  it('Releases a valid trace with CPI >= 0.95', () => {
    const states: CausalState[] = [
      { f1: 0 },
      { f1: 1 },
      { f1: 1 }
    ];
    const actions: CausalAction[] = [
      { id: 'a1', preconditions: { f1: 0 }, effects: { f1: 1 } },
      { id: 'a2', preconditions: { f1: 1 }, effects: { f1: 1 } }
    ];

    const trace: CausalTrace = { states, actions };
    const tbe = new TemporalBlendingEngine();
    const result = tbe.processBlend(trace);

    expect(result.status).toBe('RELEASE');
    expect(result.evaluation.cpiScore).toBe(1);
    expect(result.evaluation.passed).toBe(true);
  });
});
