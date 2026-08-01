# AGENTS.md — Vyapari Architecture & Agent Guidelines

## System Overview
Vyapari is a mobile-first, WhatsApp-style Kirana assistant built for Indian MSMEs under the **AI Agents for Bharat's Businesses** track. It operates with zero external login or API key dependencies.

### Technical Architecture
- **Framework:** Next.js (App Router, React 19) + TypeScript + Tailwind CSS
- **State Management:** `localStorage` persistence with seeded fallback (`/data/seed.json`)
- **Deterministic Grammar Parser:** `/frontend/lib/invoiceParser.ts`
  - Pattern: `<qty><unit?> <item> <price>`
  - Allowed Units: `{kg, g, l, ml, pc, pkt, dozen}`
  - Unparseable segments are flagged as `requiresManualEntry: true` without guessing.
- **Fuzzy Reconciliation Engine:** `/frontend/lib/reconcile.ts`
  - Formula: $\text{Score} = 0.5 \times \text{amountExact} + 0.3 \times \text{JaroWinkler}(\text{payerName}) + 0.2 \times \text{keywordOverlap}$
  - Bands:
    - $\ge 0.8$: `AUTO_MATCH`
    - $0.5 - 0.79$: `ASK_TO_CONFIRM`
    - $< 0.5$: `NO_MATCH`
- **Voice Support:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) with graceful UI fallbacks.

## Guidelines for Modifying Code
1. **Preserve Determinism:** Never insert probabilistic guesses in `invoiceParser.ts`. If a token does not conform to the grammar, set `requiresManualEntry: true`.
2. **Preserve Multi-Factor Scoring Formula:** Any changes to `reconcile.ts` must maintain the exact $50\%$ Amount, $30\%$ Jaro-Winkler, $20\%$ Keyword Overlap breakdown.
3. **Bilingual Requirement:** Ensure both English and Hindi strings are maintained across UI components and generated WhatsApp messages.
