# Vyapari Implementation Plan & Acceptance Milestones

## Milestones & Acceptance Criteria

### Milestone 1: Deterministic Invoice Parser & UPI Fuzzy Reconciler Core
- **Goal:** Implement deterministic grammar parser for `<qty><unit?> <item> <price>` and multi-factor fuzzy reconciliation formula ($0.5\times \text{amount} + 0.3\times \text{JaroWinkler} + 0.2\times \text{keywords}$).
- **Files:** `frontend/lib/invoiceParser.ts`, `frontend/lib/reconcile.ts`, `data/seed.json`, `frontend/lib/seedData.ts`.
- **Acceptance Command:** `npm test` (passes Vitest unit test suite).

### Milestone 2: Mobile-First WhatsApp Assistant UI & Ledger Components
- **Goal:** Build WhatsApp-style chat interface, open invoice manager, reconciliation workbench, and GST ledger dues panel with Web Speech API voice input and English/Hindi toggle.
- **Files:** `frontend/components/vyapari-chat.tsx`, `open-invoices-panel.tsx`, `reconciler-panel.tsx`, `ledger-gst-panel.tsx`, `frontend/app/vyapari/page.tsx`.
- **Acceptance Command:** `npm run check` (TypeScript typecheck succeeds without errors).

### Milestone 3: End-to-End Smoke Testing & Production Build
- **Goal:** Add Playwright smoke tests, verify full build pipeline, static export / Vercel compatibility.
- **Files:** `frontend/tests/smoke.spec.ts`, `frontend/playwright.config.ts`.
- **Acceptance Command:** `npm run build` (Next.js production build completes clean).

---

## Acceptance Run Commands

```bash
# 1. Run Unit Tests (Vitest)
npm test

# 2. Run TypeScript Typecheck
npm run check

# 3. Run Production Build
npm run build
```
