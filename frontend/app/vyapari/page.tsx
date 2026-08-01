'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar';
import { VyapariChat } from '../../components/vyapari-chat';
import { OpenInvoicesPanel } from '../../components/open-invoices-panel';
import { ReconcilerPanel } from '../../components/reconciler-panel';
import { LedgerGstPanel } from '../../components/ledger-gst-panel';
import { getInitialInvoices, saveInvoicesToStorage, OpenInvoice } from '../../lib/seedData';
import {
  MessageSquare,
  FileText,
  ShieldCheck,
  Users,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

export default function VyapariPage() {
  const [invoices, setInvoices] = useState<OpenInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'invoices' | 'reconcile' | 'ledger'>('chat');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const isHi = lang === 'hi';

  useEffect(() => {
    setInvoices(getInitialInvoices());
  }, []);

  const handleMarkPaid = (invoiceId: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, status: 'PAID' as const, balanceDue: 0, amountPaid: inv.totalAmount } : inv
    );
    setInvoices(updated);
    saveInvoicesToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-['Montserrat',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">
              <Zap className="h-3.5 w-3.5" />
              <span>{isHi ? 'किराना स्मार्ट व्हाट्सऐप बिलिंग' : 'AI AGENTS FOR BHARAT\'S BUSINESSES'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Vyapari <span className="text-emerald-400 font-extrabold">Kirana Assistant</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              {isHi
                ? 'व्हाट्सएप-शैली बिलिंग, UPI पेमेंट ऑटो-मैच (Reconciliation), GST तकादा रिमाइंडर्स एवं हिंदी Voice Assistant।'
                : 'WhatsApp-style invoicing, fuzzy UPI reconciliation formula, text GST reminders & bilingual voice.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10">
            <button
              onClick={() => setLang(isHi ? 'en' : 'hi')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-extrabold text-slate-200 hover:border-emerald-500 hover:text-white transition-all shadow-md"
            >
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>{isHi ? 'Language: Hindi (हिंदी)' : 'Language: English'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{isHi ? 'व्हाट्सऐप सहायक (Chat)' : 'WhatsApp Chat Assistant'}</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>
              {isHi ? 'खुले बिल (Open Invoices)' : 'Open Invoices'} ({invoices.filter((i) => i.status === 'OPEN').length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reconcile')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'reconcile'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isHi ? 'UPI रीकॉन्सिलेशन (Fuzzy Match)' : 'Fuzzy UPI Reconciler'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isHi ? 'खाता-बही एवं GST तकादा (Ledger)' : 'Ledger & GST Dues'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'chat' && (
          <VyapariChat
            invoices={invoices}
            setInvoices={setInvoices}
            lang={lang}
            setLang={setLang}
          />
        )}

        {activeTab === 'invoices' && (
          <OpenInvoicesPanel
            invoices={invoices}
            onMarkPaid={handleMarkPaid}
            lang={lang}
          />
        )}

        {activeTab === 'reconcile' && (
          <ReconcilerPanel
            invoices={invoices}
            onConfirmPayment={handleMarkPaid}
            lang={lang}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerGstPanel
            invoices={invoices}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
