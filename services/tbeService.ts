import { CausalState, CausalAction, CausalTrace, SAAEvaluationResult, TBEOutput } from '../types';
import { loggingService } from './loggingService';

/**
 * Validates if the given state satisfies the provided partial preconditions.
 * @param state The current full causal state.
 * @param preconditions The required partial state.
 */
function satisfies(state: CausalState, preconditions: Partial<CausalState>): boolean {
  for (const key in preconditions) {
    if (state[key] !== preconditions[key]) {
      return false;
    }
  }
  return true;
}

/**
 * Represents the System Assurance Agent (SAA)
 * Evaluates the Causal Path Integrity (CPI) of a generated trace.
 */
export class SystemAssuranceAgent {
  /**
   * Calculates the Causal Path Integrity (CPI) score of a given trace.
   * Ensures preconditions, effects, and the Frame Operator hold for each transition.
   */
  public evaluateTrace(trace: CausalTrace): SAAEvaluationResult {
    const { states, actions } = trace;
    const N = states.length;

    if (N < 2 || actions.length !== N - 1) {
      return {
        cpiScore: 0,
        passed: false,
        contradictions: ['Invalid trace length. Must have N states and N-1 actions.']
      };
    }

    let validTransitions = 0;
    const contradictions: string[] = [];

    for (let k = 0; k < N - 1; k++) {
      const s_k = states[k];
      const a_k = actions[k];
      const s_k_plus_1 = states[k + 1];

      let transitionValid = true;

      // 1. Preconditions must be satisfied
      if (!satisfies(s_k, a_k.preconditions)) {
        transitionValid = false;
        contradictions.push(`Step ${k}: Preconditions for action ${a_k.id} not met in state s_${k}`);
      }

      // 2. Effects must be applied
      if (!satisfies(s_k_plus_1, a_k.effects)) {
        transitionValid = false;
        contradictions.push(`Step ${k}: Effects of action ${a_k.id} not found in state s_${k+1}`);
      }

      // 3. Frame Operator: Unmodified fluents must remain unchanged
      for (const fluent in s_k) {
        if (!(fluent in a_k.effects)) {
          if (s_k[fluent] !== s_k_plus_1[fluent]) {
            transitionValid = false;
            contradictions.push(`Step ${k}: Frame operator violation for fluent '${fluent}'`);
          }
        }
      }

      if (transitionValid) {
        validTransitions++;
      }
    }

    const cpiScore = validTransitions / (N - 1);
    const passed = cpiScore >= 0.95;

    return {
      cpiScore,
      passed,
      contradictions
    };
  }
}

/**
 * Represents the Temporal Blending Engine (TBE)
 * Enforces the CPI constraint and routes states.
 */
export class TemporalBlendingEngine {
  private saa: SystemAssuranceAgent;

  constructor() {
    this.saa = new SystemAssuranceAgent();
  }

  /**
   * Processes a blended causal trace.
   * If CPI >= 0.95, it releases the state.
   * Otherwise, it routes to EPISTEMIC_ESCROW.
   */
  public processBlend(trace: CausalTrace): TBEOutput {
    loggingService.info('TBE: Starting blend processing.');

    const evaluation = this.saa.evaluateTrace(trace);

    if (evaluation.passed) {
      loggingService.info(`TBE: Blend passed with CPI ${evaluation.cpiScore}. State released.`);
      return {
        status: 'RELEASE',
        trace,
        evaluation
      };
    } else {
      loggingService.warn(`TBE: Blend failed with CPI ${evaluation.cpiScore}. Routing to Epistemic Escrow.`);
      return {
        status: 'EPISTEMIC_ESCROW',
        trace,
        evaluation
      };
    }
  }
}
