'use client';

import React, { useState } from 'react';
import { reconcileSmsWithInvoices, MatchBreakdown, parseBankSms } from '../lib/reconcile';
import { OpenInvoice, SEED_DATA } from '../lib/seedData';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCw,
  FileText,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ReconcilerPanelProps {
  invoices: OpenInvoice[];
  onConfirmPayment: (invoiceId: string) => void;
  lang: 'en' | 'hi';
}

export function ReconcilerPanel({ invoices, onConfirmPayment, lang }: ReconcilerPanelProps) {
  const [smsInput, setSmsInput] = useState(
    'Rs.200.00 credited to a/c XX1234 on 30-07-26 from VPA parleg@okaxis (Ramesh Kumar) UPI Ref 123456789012'
  );
  const [results, setResults] = useState<MatchBreakdown[] | null>(null);

  const isHi = lang === 'hi';

  const handleRunReconciliation = () => {
    if (!smsInput.trim()) return;
    const matchResults = reconcileSmsWithInvoices(smsInput, invoices);
    setResults(matchResults);
  };

  const handleLoadSample = (sampleText: string) => {
    setSmsInput(sampleText);
    const matchResults = reconcileSmsWithInvoices(sampleText, invoices);
    setResults(matchResults);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">
              {isHi ? 'UPI एवं बैंक SMS मिलान (Reconciliation)' : 'Fuzzy UPI & Bank SMS Reconciler'}
            </h2>
            <p className="text-xs text-slate-400">
              {isHi
                ? 'राशि (50%), JaroWinkler नाम मैच (30%) और कीवर्ड (20%) सूत्र द्वारा स्वचालित मिलान।'
                : 'Scored by Formula: 0.5×Amount + 0.3×JaroWinkler(Name) + 0.2×Keywords.'}
            </p>
          </div>
        </div>

        {/* Preset Sample SMS Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            {isHi ? 'नमूना बैंक SMS चुनें:' : 'Try Sample Bank SMS Presets:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {SEED_DATA.sampleSmsStrings.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample.rawText)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 hover:border-emerald-500 hover:text-white transition-all flex items-center space-x-1.5"
              >
                <Building2 className="h-3 w-3 text-emerald-400" />
                <span className="font-semibold">{sample.bankFormat}:</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{sample.rawText}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <label className="block text-xs font-extrabold text-white uppercase tracking-wider mb-2">
          {isHi ? 'बैंक / UPI SMS संदेश यहाँ पेस्ट करें:' : 'Paste Bank / UPI Payment SMS:'}
        </label>
        <textarea
          rows={3}
          value={smsInput}
          onChange={(e) => setSmsInput(e.target.value)}
          placeholder={
            isHi
              ? 'उदा. Rs.200.00 credited to a/c XX1234 on 30-07-26 from VPA parleg@okaxis (Ramesh Kumar)...'
              : 'e.g. Rs.200.00 credited to a/c XX1234 on 30-07-26 from VPA parleg@okaxis (Ramesh Kumar)...'
          }
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleRunReconciliation}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isHi ? 'मिलान जांचें (Reconcile)' : 'Run Fuzzy Match'}</span>
          </button>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {isHi ? 'मिलान परिणाम (Match Analysis):' : 'Reconciliation Analysis Results:'}
          </h3>

          {results.map((res) => {
            const isAuto = res.band === 'AUTO_MATCH';
            const isConfirm = res.band === 'ASK_TO_CONFIRM';
            const isNoMatch = res.band === 'NO_MATCH';

            return (
              <div
                key={res.invoice.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isAuto
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isConfirm
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-white">{res.invoice.id}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isAuto
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isConfirm
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isAuto
                          ? isHi
                            ? '🟢 ऑटो-मैच (Auto Match)'
                            : '🟢 AUTO_MATCH (≥0.8)'
                          : isConfirm
                          ? isHi
                            ? '🟡 पुष्टि करें (Ask-to-Confirm)'
                            : '🟡 ASK_TO_CONFIRM (0.5–0.8)'
                          : isHi
                          ? '🔴 कोई मैच नहीं (No Match)'
                          : '🔴 NO_MATCH (<0.5)'}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-white mt-1">
                      {res.invoice.customerName} (₹{res.invoice.balanceDue})
                    </h4>
                  </div>

                  {/* Match Score Badge */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{Math.round(res.score * 100)}%</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{isHi ? 'मैच स्कोर' : 'Confidence'}</div>
                    </div>

                    {!isNoMatch && res.invoice.status !== 'PAID' && (
                      <button
                        onClick={() => onConfirmPayment(res.invoice.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 ${
                          isAuto
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isAuto ? (isHi ? 'स्वचालित भुगतान दर्ज करें' : 'Auto Confirm') : (isHi ? 'पुष्टि करें एवं भुगतान दर्ज करें' : 'Confirm Payment')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Score Factor Breakdown Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>{isHi ? 'राशि मिलान (50% weight):' : 'Amount Exact (50%):'}</span>
                      <span className="font-mono font-bold text-white">{res.amountExact * 100}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${res.amountExact * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>{isHi ? 'नाम Jaro-Winkler (30%):' : 'JaroWinkler Name (30%):'}</span>
                      <span className="font-mono font-bold text-white">{Math.round(res.nameScore * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all"
                        style={{ width: `${res.nameScore * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>{isHi ? 'कीवर्ड ओवरलैप (20%):' : 'Keyword Overlap (20%):'}</span>
                      <span className="font-mono font-bold text-white">{Math.round(res.keywordScore * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full transition-all"
                        style={{ width: `${res.keywordScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Parsed Info Footnote */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>
                    Parsed Amount: ₹{res.parsedDetails.amount ?? 'N/A'} | Payer: {res.parsedDetails.payerName || 'N/A'}
                  </span>
                  <span>Ref: {res.parsedDetails.refNo || 'N/A'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
