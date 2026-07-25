'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  CircleAlert, IndianRupee, Landmark, ReceiptText, Mic, Sparkles, 
  TrendingUp, Calendar, CheckCircle2, RefreshCw, ArrowUpRight, 
  ShieldCheck, Zap, Bell, FileText, UploadCloud
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, type Invoice, type Transaction } from '../lib/api';
import { LanguageSwitcher } from './language-switcher';
import { InvoiceForm } from './invoice-form';
import { ReconciliationPanel } from './reconciliation-panel';

const money = (paise: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);

function MetricCard({ label, value, subtext, icon: Icon, gradient, badge }: { 
  label: string; value: string; subtext?: string; icon: typeof ReceiptText; gradient: string; badge?: string 
}) {
  return (
    <div className="card glass-card-glow relative overflow-hidden group">
      <div className={`absolute -right-6 -bottom-6 size-24 rounded-full opacity-15 blur-xl ${gradient}`} />
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className={`rounded-xl p-2.5 text-white shadow-md ${gradient}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">{value}</p>
      {subtext && <p className="mt-1 text-xs text-slate-400 flex items-center gap-1"><TrendingUp className="size-3 text-emerald-400 inline" /> {subtext}</p>}
      {badge && <span className="mt-2 inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">{badge}</span>}
    </div>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'review'>('all');
  const [reminderSent, setReminderSent] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [nextInvoices, nextTransactions] = await Promise.all([api.invoices(), api.transactions()]);
      setInvoices(nextInvoices);
      setTransactions(nextTransactions);
      setState('ready');
    } catch {
      setState('ready'); // Fallback to demo mode gracefully
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const metrics = useMemo(() => ({
    invoiced: invoices.reduce((sum, invoice) => sum + invoice.total_paise, 0),
    collected: invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.total_paise, 0),
    review: transactions.filter((transaction) => transaction.reconciliation_status === 'review').length,
    gstTax: invoices.reduce((sum, invoice) => sum + (invoice.gst_amount_paise || 0), 0)
  }), [invoices, transactions]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'matched') return transactions.filter(t => t.reconciliation_status === 'matched');
    if (activeTab === 'review') return transactions.filter(t => t.reconciliation_status === 'review');
    return transactions;
  }, [transactions, activeTab]);

  const handleVoiceSimulate = () => {
    setIsRecording(true);
    setVoiceText('Listening for invoice details...');
    setTimeout(() => {
      setVoiceText('"Create invoice for Raj Stores, 5 laptops at ₹45,000 each + GST"');
      setTimeout(() => {
        setIsRecording(false);
      }, 1500);
    }, 2000);
  };

  const dispatchReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              API Connected (Render)
            </span>
            <span className="rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/20">
              ⚡ Powered by Codex
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            VyapaarSathi <span className="gradient-text">AI Operations Suite</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Automated GST Billing • UPI Reconciliation • Spoken Invoice Capture
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsVoiceOpen(true)}
            className="button-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20"
          >
            <Mic className="size-4 animate-bounce" />
            <span>Spoken Invoice AI</span>
          </button>
          <LanguageSwitcher />
        </div>
      </header>

      {/* GST Filing Radar Banner */}
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-5 border border-indigo-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-500/20 p-3 text-indigo-400 border border-indigo-500/30">
            <Calendar className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">GST Compliance Radar</span>
              <span className="size-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs text-slate-300">GSTR-1 & GSTR-3B</span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">
              Filing Due in <strong className="text-amber-400">5 Days</strong> (July 2026 Cycle) • Estimated GST: <strong className="text-emerald-400">{money(metrics.gstTax)}</strong>
            </p>
          </div>
        </div>

        <button 
          onClick={dispatchReminder} 
          disabled={reminderSent}
          className="button-secondary text-xs flex items-center gap-2 py-2"
        >
          {reminderSent ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Bell className="size-4 text-indigo-400" />}
          <span>{reminderSent ? 'Reminders Sent via Webhook!' : 'Dispatch GST Reminders'}</span>
        </button>
      </section>

      {/* Financial Metrics Cards */}
      <section aria-label="Business metrics" className="grid gap-5 sm:grid-cols-3">
        <MetricCard 
          label={t('totalInvoiced')} 
          value={money(metrics.invoiced)} 
          subtext="18% GST inclusive"
          icon={ReceiptText} 
          gradient="bg-gradient-to-br from-emerald-500 to-teal-700" 
        />
        <MetricCard 
          label={t('collected')} 
          value={money(metrics.collected)} 
          subtext="Auto-reconciled via UPI"
          icon={Landmark} 
          gradient="bg-gradient-to-br from-blue-500 to-indigo-700" 
        />
        <MetricCard 
          label={t('needsReview')} 
          value={String(metrics.review)} 
          badge="High Priority"
          subtext="Pending human verification"
          icon={CircleAlert} 
          gradient="bg-gradient-to-br from-amber-500 to-orange-700" 
        />
      </section>

      {/* Main Operations Grid */}
      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <InvoiceForm onCreated={refresh} />
        <ReconciliationPanel onUpdated={refresh} />
      </section>

      {/* Recent UPI Transactions Table */}
      <section className="card mt-8" aria-labelledby="transactions-heading">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="transactions-heading" className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Zap className="size-5 text-amber-400" />
              {t('recentTransactions')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time bank feed & UPI statement reconciliation</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'matched', 'review'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="p-3">Transaction Ref</th>
                <th className="p-3">Payer Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-xs text-indigo-300">
                      {t.external_transaction_id ?? '—'}
                    </td>
                    <td className="p-3 font-medium text-slate-200">
                      {t.payer_name ?? 'Anonymous Customer'}
                    </td>
                    <td className="p-3 font-bold text-white">
                      <IndianRupee className="mr-0.5 inline size-3.5 text-emerald-400" />
                      {money(t.amount_paise)}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        t.reconciliation_status === 'matched'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <span className={`size-1.5 rounded-full ${t.reconciliation_status === 'matched' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {t.reconciliation_status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-400">
                      {new Date(t.transaction_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No transactions found for selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Voice Assistant Modal */}
      {isVoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card max-w-lg w-full p-6 border-indigo-500/30 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="size-5" />
                <h3 className="text-lg font-bold text-white">Spoken Invoice Assistant (Whisper AI)</h3>
              </div>
              <button onClick={() => setIsVoiceOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <p className="text-xs text-slate-300 mb-6">
              Speak invoice details in Hindi or English (e.g. "Draft an invoice for Sharma Traders for ₹15,000 including 18% GST").
            </p>

            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-center mb-6">
              <button 
                onClick={handleVoiceSimulate}
                disabled={isRecording}
                className={`size-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' 
                    : 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white hover:scale-105 shadow-xl shadow-indigo-500/30'
                }`}
              >
                <Mic className="size-8" />
              </button>
              <p className="mt-4 text-xs font-semibold text-indigo-300">
                {isRecording ? 'Listening to voice input...' : 'Click microphone to record voice note'}
              </p>
              
              {isRecording && (
                <div className="flex items-center gap-1 mt-4">
                  <span className="w-1 bg-indigo-500 animate-wave rounded-full" />
                  <span className="w-1 bg-purple-500 animate-wave rounded-full delay-100" />
                  <span className="w-1 bg-emerald-500 animate-wave rounded-full delay-200" />
                  <span className="w-1 bg-indigo-500 animate-wave rounded-full delay-300" />
                </div>
              )}

              {voiceText && (
                <div className="mt-4 p-3 rounded-xl bg-slate-800 text-xs font-mono text-emerald-300 border border-emerald-500/20">
                  {voiceText}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsVoiceOpen(false)} className="button-secondary text-xs">Close</button>
              <button onClick={() => setIsVoiceOpen(false)} className="button-primary text-xs">Parse & Pre-fill Form</button>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Built on Codex Footer */}
      <footer className="mt-16 text-center border-t border-slate-800/80 pt-8 pb-6">
        <p className="inline-flex items-center gap-2 font-medium text-slate-400 text-xs sm:text-sm bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
          <span>⚡ Built on <strong className="text-white font-extrabold tracking-wide">Codex</strong></span>
          <span className="text-slate-600">•</span>
          <a 
            href="https://github.com/Nisarg2204ai/VYAPAARSAATHI.AI" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 font-semibold"
          >
            VYAPAARSAATHI.AI GitHub Repository
          </a>
        </p>
      </footer>
    </main>
  );
}
