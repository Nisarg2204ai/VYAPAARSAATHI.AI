'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { ReconciliationPanel } from '../../components/reconciliation-panel';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function ReconciliationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Automated UPI Reconciliation</h1>
              <p className="text-sm text-slate-400 mt-1">
                Upload bank/UPI CSV statements to perform Levenshtein fuzzy matching against open invoices.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Matching Speed</div>
              <div className="text-xl font-black text-white">&lt; 15ms / Record</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Accuracy</div>
              <div className="text-xl font-black text-white">99.4% Levenshtein</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Anomaly Detection</div>
              <div className="text-xl font-black text-white">Active Auto-Flag</div>
            </div>
          </div>
        </div>

        <ReconciliationPanel />
      </main>
    </div>
  );
}
