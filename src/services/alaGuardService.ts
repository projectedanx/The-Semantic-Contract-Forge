import { ActionVector, HitlVerdict, AlaState, AlaAdaptationEvent } from '../../types';

/**
 * @file src/services/alaGuardService.ts
 * @description The ALA (Anomaly Learning Agent) Guard service.
 * Implements the Run-Time Verification Loop Algorithm for monitoring agent workflows.
 */

// Operational Parameters
const WARNING_THRESHOLD = 0.40;
const BREACH_THRESHOLD = 0.80;
const LEARNING_RATE_FP = 0.12;
const LEARNING_RATE_TP = 0.25;

export interface RiskAssessment {
  riskScore: number;
  status: 'LAMINAR' | 'BREACH';
  traceback?: string;
}

/** Interface for injecting neural-symbolic evaluation dependencies. */
export interface NeuralSymbolicEvaluator {
  evaluateNeuralSequence(action: ActionVector): number;
  evaluateGraphReconstruction(action: ActionVector): number;
}

export class AlaGuardService {
  private affordanceWatchlist: Set<string>;
  private evaluator: NeuralSymbolicEvaluator;

  constructor(evaluator: NeuralSymbolicEvaluator) {
    this.affordanceWatchlist = new Set<string>();
    this.evaluator = evaluator;
  }

  /**
   * Adds a tool to the affordance watchlist.
   * @param tool The name of the tool to monitor closely.
   */
  public addToWatchlist(tool: string): void {
    this.affordanceWatchlist.add(tool);
  }

  /**
   * Executes the Run-Time Verification Loop Algorithm on an incoming action.
   * @param action The 5-dimensional Action Vector to evaluate.
   * @returns The outcome of the risk assessment.
   */
  public verifyAction(action: ActionVector): RiskAssessment {
    let requiresHeavyEvaluation = false;

    // Step 2: Verify watchlists
    if (this.affordanceWatchlist.has(action.tool)) {
      requiresHeavyEvaluation = true;
    } else {
      // Calculate instantaneous Toolchain Entropy Gradient (simplified using state)
      if (action.entropyGradient > WARNING_THRESHOLD) {
        requiresHeavyEvaluation = true;
      }
    }

    if (!requiresHeavyEvaluation) {
      return {
        riskScore: action.entropyGradient,
        status: 'LAMINAR'
      };
    }

    // Step 3: Execute NeSy ALA Synthesis (Injected dependencies)
    const sNeural = this.evaluator.evaluateNeuralSequence(action);
    const sBicm = action.bicmIntentCoherence;
    const sRecon = this.evaluator.evaluateGraphReconstruction(action);
    const fSymbolic = this.affordanceWatchlist.has(action.tool) ? 0.9 : 0.2;

    // Weights for synthesizing risk
    const w1 = 0.25, w2 = 0.25, w3 = 0.25, w4 = 0.25;

    // Step 4: Synthesize Risk
    const riskScore = w1 * sNeural + w2 * sBicm + w3 * sRecon + w4 * fSymbolic;

    // Step 5: Evaluate Thresholds
    if (riskScore < BREACH_THRESHOLD) {
      return {
        riskScore,
        status: 'LAMINAR'
      };
    } else {
      return {
        riskScore,
        status: 'BREACH',
        traceback: `Ontological Traceback for tool: ${action.tool} (Trace: ${action.executionTrace})`
      };
    }
  }

  /**
   * Handles the HITL triage verdict and generates an adaptation event.
   * @param verdict The HITL verdict (Quarantine, Override, Terminate).
   * @param state The captured AlaState at the time of the event.
   * @returns The generated PROV-AGENT schema adaptation event.
   */
  public handleHitlVerdict(verdict: HitlVerdict, state: AlaState): AlaAdaptationEvent {
    let fingerprint: string | undefined;

    // Simulate updating parameters based on verdict
    let newEntropyThreshold = WARNING_THRESHOLD;
    let newIntentWeight = 1.0;

    if (verdict === 'Terminate') {
        fingerprint = `SM-03_toolchain_surprise_${Math.floor(Math.random() * 1000).toString(16)}`;
        // Shift threshold down (more restrictive) based on True Positive learning rate
        newEntropyThreshold -= LEARNING_RATE_TP * 0.1;
        newIntentWeight += LEARNING_RATE_TP * 0.5;
    } else if (verdict === 'Override') {
         // Shift threshold up (more permissive) based on False Positive learning rate
         newEntropyThreshold += LEARNING_RATE_FP * 0.1;
         newIntentWeight -= LEARNING_RATE_FP * 0.5;
    }

    const event: AlaAdaptationEvent = {
      'prov:type': 'ala_adaptation_event',
      ala_state: state,
      hitl_verdict: verdict.toUpperCase() + (verdict === 'Terminate' ? '_CONFIRMED_MISUSE' : '_CONFIRMED'),
      ala_action: {
        recalibrated_weights: {
          intent_divergence_weight: Number(newIntentWeight.toFixed(2)),
          toolchain_entropy_threshold: Number(newEntropyThreshold.toFixed(2))
        },
        exploit_fingerprint_generated: fingerprint
      }
    };

    return event;
  }
}
