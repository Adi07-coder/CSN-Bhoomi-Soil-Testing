# Agronomic Anti-Hallucination Guardrails

## 1. Strict Deterministic Boundary Enforcement
Large Language Models can occasionally hallucinate extreme chemical dosages or hazardous mixtures. AI Bhoomi eliminates this through deterministic agronomic safety wrappers:

1. **Upper Dosage Boundaries**:
   - Urea: Strictly capped at $\le 150\text{ kg/acre}$.
   - DAP: Strictly capped at $\le 100\text{ kg/acre}$.
   - MOP: Strictly capped at $\le 60\text{ kg/acre}$.
   - Zinc Sulphate: Strictly capped at $\le 15\text{ kg/acre}$.
   Any LLM output or recommendation that exceeds these thresholds is automatically clamped to ICAR safety limits.

2. **Incompatible Mixture Prevention**:
   - Flagging direct mixing of DAP with Zinc Sulphate (which precipitates insoluble zinc phosphate).
   - Flagging urea application under extreme waterlogging conditions to prevent denitrification loss.

3. **Resilient Google Gemini Architecture**:
   - Primary: Google Gemini API using candidate models `models/gemini-flash-latest` and `models/gemini-2.5-flash`.
   - Timeout: Hard 2.0-second timeout per candidate.
   - Deterministic Fallback: If Google servers return HTTP 503, 429, or timeout, the engine immediately yields ICAR-IISS verified agronomic rules, guaranteeing zero downtime and 100% adherence to verified scientific guidelines.
