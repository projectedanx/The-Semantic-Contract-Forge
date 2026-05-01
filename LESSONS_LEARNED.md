# Lessons Learned

## Structural Analogy Mapping and TACT Lens
By breaking down workflows into modular contracts (specialized specification blocks) and applying the Technology Affordance and Constraints Theory (TACT) lens (a non-obvious analytical lens), we found deeper tensions and structural insights into human-AI interactions. The TACT lens specifically exposes the affordances and constraints on both sides, ensuring they augment rather than overwrite each other.

The implementation of `SynergyAnalyzer` components proved that rendering this non-obvious analysis back to the prompt engineer helps clarify their architectural approach.

## Pluriversal Schema Synthesis and TACT Synergy
Applying the TACT lens revealed a core tension: humans excel at providing unstructured, contextual examples, while the AI requires strict, deterministic formal constraints (JSON Schema). By holding this Golden Scar [Φ] instead of forcing the human to write schema manually, we created the `SchemaSynthesizer`. This maps human affordances (messy examples) directly to AI formal structure (schema generation), embodying true Human-AI synergy where neither can operate alone.
