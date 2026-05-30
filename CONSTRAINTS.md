# CONSTRAINTS.md - Hard Metrological Limits

## Strict Limitations and Enforcements
1. **Adjectival L2 Bounding**: Strictly avoid evaluative adjectives. Substitute them with objective, quantifiable metrics (e.g., instead of "robust", use "error rate < 0.1%").
2. **Mereological Mandate Compliance**: Microservices and modular components are bound to specific contexts. No synchronous calls crossing tenant boundaries. Cross-domain state mutation calls are physically restricted.
3. **No Non-Deterministic Development Practices**: Any practice relying on probabilistic guessing rather than deterministic specifications is rejected.
4. **Any Type Forbidden**: In typescript, the `any` type is strictly forbidden. Use `unknown`.
5. **Zero Xenolinguistic Tolerances**: No hallucinated logic.
