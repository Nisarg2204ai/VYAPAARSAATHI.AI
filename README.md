# Vyapari — WhatsApp-Style Kirana Assistant (Full-Stack Supabase & Neon)
> **TRACK:** AI Agents for Bharat's Businesses  
> **Tagline:** Plain-language invoicing, fuzzy UPI reconciliation, GST reminders, and bilingual Hindi voice assistant for Kirana stores.

---

## 🌐 Free Live Web Application & Repository
- **GitHub Repository:** [https://github.com/Nisarg2204ai/VYAPAARSAATHI.AI.io](https://github.com/Nisarg2204ai/VYAPAARSAATHI.AI.io)
- **GitHub Pages Live App:** [https://nisarg2204ai.github.io/VYAPAARSAATHI.AI.io/](https://nisarg2204ai.github.io/VYAPAARSAATHI.AI.io/)
- **Zero-Permission Access:** Open directly in any browser — no logins, authentication, or API keys required!

---

## 🗄️ Full-Stack Database Architecture (Supabase & Serverless Neon PostgreSQL)
Vyapari is built as a complete full-stack web application supporting dual PostgreSQL cloud databases:
- **Supabase Integration:** Client & Admin SDK (`@supabase/supabase-js`) in `frontend/lib/supabase.ts` and `backend/src/lib/supabase.ts`.
- **Neon Serverless PostgreSQL:** Connection pool and serverless driver helper in `backend/src/lib/neon.ts` and `frontend/lib/db.ts`.
- **SQL Database Migrations:** Production DDL migrations in `supabase/migrations/202608020001_neon_supabase_sync.sql` defining `invoices`, `invoice_items`, `reconciliations`, and `gst_ledger` tables with public Row-Level Security (RLS) policies.
- **Graceful Zero-Permission Fallback:** When database environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEON_DATABASE_URL`) are omitted, the application operates 100% locally with `localStorage` and seeded data (`/data/seed.json`).

---

## 🚀 Quick Start (Local Run)


The demo application deploys and runs **with ZERO login and ZERO API key**.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# Open http://localhost:3000 or http://localhost:3000/vyapari
```

---

## 🧪 Testing & Verification

```bash
# Run Vitest unit test suite (invoiceParser + reconcile bands)
npm test

# Run TypeScript typechecking
npm run check

# Build production bundle
npm run build
```

---

## ⚡ 5-Minute Vercel Deployment Guide

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: Vyapari WhatsApp assistant, fuzzy UPI reconciler & GST ledger"
   git push origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Project**.
3. Select your repository, set root directory to `./frontend` (or default root with workspace detection).
4. Click **Deploy**. (No environment variables required for standard demo mode!)

---

## 📋 API PREREQUISITES & DISCLOSURES

- **Deploy / Live Demo:** **None** — deploys and runs the full interactive demo with **NO login and NO API key** (deterministic parser + fuzzy reconciliation formula + `localStorage` + seeded bank SMS data).
- **Live Mode (Optional):** `OPENAI_API_KEY` (optional) for enhanced natural language parsing in server routes.
- **Production WhatsApp Cloud API Disclosure:** A real WhatsApp production implementation requires Meta WhatsApp Cloud API (business verification takes ~2–7 business days).
- **Production Indic Voice Disclosure:** Production Indic voice requires Bhashini (currently in PoC/non-production tier, not free for enterprise production).
- **Demo Scope:** **Neither WhatsApp Cloud API nor Bhashini is required or used in this web/PWA demo**; this application mimics the full WhatsApp UX natively with zero external cloud dependencies.

---

## 🎙️ Web Speech API & Browser Compatibility Notes

- Vyapari implements native feature detection for Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- Supported in modern Chrome, Edge, and Android WebView for Hindi (`hi-IN`) and English (`en-IN`) voice-to-text input.
- If Web Speech API is not supported in the host browser, Vyapari gracefully presents an inline typing interface without interrupting the workflow.
- Transcripts in Devanagari script are automatically transliterated to Latin script before passing into the deterministic parser.

---

## 🧮 Fuzzy UPI Reconciliation Scoring Formula

Reconciliation calculates similarity scores between incoming Bank SMS strings and open invoices using:

$$\text{Score} = 0.5 \times \text{amountExact} + 0.3 \times \text{JaroWinkler}(\text{payerName}, \text{customerName}) + 0.2 \times \text{keywordOverlap}(\text{narration}, \text{invoiceContext})$$

### Match Bands:
1. **`AUTO_MATCH` (Score $\ge 0.8$):** High confidence match. Automatically matches invoice and offers 1-click confirmation.
2. **`ASK_TO_CONFIRM` (Score $0.5 - 0.79$):** Partial or ambiguous match (e.g. truncated SMS "Rs 100 from R. K."). Prompts merchant to confirm match.
3. **`NO_MATCH` (Score $< 0.5$):** Insufficient confidence. Flagged as un-matched.

---

## 🤖 How Codex Built This

1. **Architecture Planning:** Designed a mobile-first WhatsApp chat layout backed by deterministic parsing to guarantee 100% accuracy on prices and quantities without LLM hallucination risks.
2. **Grammar Engineering:** Created `/lib/invoiceParser.ts` supporting standard Indian units (`kg`, `g`, `l`, `ml`, `pc`, `pkt`, `dozen`) while flagging unparseable tokens for merchant manual entry.
3. **Fuzzy Reconciliation Implementation:** Built Jaro-Winkler string distance and keyword overlap algorithms in `/lib/reconcile.ts` to solve messy, truncated bank SMS strings (SBI, Axis, HDFC formats).
4. **Bilingual & Voice Integration:** Added Web Speech voice recognition and a 1-click English/Hindi toggle across the chat UI, invoices, and GST payment reminder message drafter.
5. **Testing & QA:** Covered edge cases using Vitest unit tests for parser/reconciliation bands and Playwright for E2E smoke verification.

---

## 📹 5-Line Demo Video Script

1. *"Namaste! Meet Vyapari, the WhatsApp-style AI assistant built for 60 million Kirana shops across India."*
2. *"Just type or speak item lists like '2 kg cheeni 90, 1 Parle-G 10, chai 20' to generate instant WhatsApp-shareable invoices."*
3. *"Paste messy bank SMS notifications, and our fuzzy matching formula automatically reconciles payments with exact scores."*
4. *"Track customer dues in 'Who Owes Me' and send polite, text-only GST reminders with a single tap."*
5. *"Vyapari runs 100% locally with zero login and zero API keys — empowering small businesses across Bharat!"*
