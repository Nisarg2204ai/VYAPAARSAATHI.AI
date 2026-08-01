'use client';

import React, { useState } from 'react';
import { OpenInvoice } from '../lib/seedData';
import {
  Users,
  Send,
  Share2,
  TrendingUp,
  DollarSign,
  Clock,
  Check,
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface LedgerGstPanelProps {
  invoices: OpenInvoice[];
  lang: 'en' | 'hi';
}

export function LedgerGstPanel({ invoices, lang }: LedgerGstPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isHi = lang === 'hi';

  const openInvoices = invoices.filter((inv) => inv.status === 'OPEN');
  const totalOutstanding = openInvoices.reduce((acc, curr) => acc + curr.balanceDue, 0);

  // Weekly Sales total calculation
  const totalSales = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const paidSales = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const calculateAgeDays = (dateStr: string) => {
    const created = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  /**
   * Drafts a text-only GST & payment reminder message for WhatsApp (NO rate math as specified)
   */
  const draftGstReminderText = (inv: OpenInvoice) => {
    const ageDays = calculateAgeDays(inv.date);
    if (isHi) {
      return `नमस्ते ${inv.customerName} जी,\nव्यापारी (GST पंजीकृत किराना स्टोर) से आपका बिल #${inv.id} पिछले ${ageDays} दिनों से कुल ₹${inv.balanceDue} का बकाया है।\n\nकृपया UPI द्वारा भुगतान करें: ${inv.upiVpa || 'kirana@upi'}\n\nधन्यवाद! 🙏`;
    }
    return `Hello ${inv.customerName},\nThis is a friendly payment & GST billing reminder from Vyapari Kirana Store regarding Invoice #${inv.id} for ₹${inv.balanceDue} (Pending since ${ageDays} days).\n\nPlease send payment via UPI to: ${inv.upiVpa || 'kirana@upi'}\n\nThank you! 🙏`;
  };

  const handleSendReminder = (inv: OpenInvoice) => {
    const text = draftGstReminderText(inv);
    const encoded = encodeURIComponent(text);
    const phone = inv.customerPhone?.replace(/[^\d]/g, '') || '';
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleCopyReminder = (inv: OpenInvoice, idx: number) => {
    const text = draftGstReminderText(inv);
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Outstanding */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {isHi ? 'कुल बकाया (Who Owes Me)' : 'Total Outstanding Dues'}
            </span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">₹{totalOutstanding}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {openInvoices.length} {isHi ? 'ग्राहकों पर बकाया' : 'customers pending'}
          </div>
        </div>

        {/* Weekly Sales Total */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {isHi ? 'साप्ताहिक बिक्री (Weekly Sales)' : 'Weekly Sales Total'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">₹{totalSales}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            ₹{paidSales} {isHi ? 'प्राप्त (Paid)' : 'collected'}
          </div>
        </div>

        {/* GST Reminder Quick Counter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {isHi ? 'GST तकादा (GST Reminders)' : 'GST Payment Reminders'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Send className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{openInvoices.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isHi ? 'टेक्स्ट रिमाइंडर्स तैयार' : 'Text-only message drafts ready'}
          </div>
        </div>
      </div>

      {/* Dues Table / Cards ("Who Owes Me") */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>{isHi ? 'खाता-बही: कौन कितना देय है (Who Owes Me)' : 'Ledger: Customer Dues & Aging'}</span>
          </h3>
        </div>

        {openInvoices.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            {isHi ? 'सभी बिलों का भुगतान हो चुका है!' : 'All invoices are fully paid!'}
          </div>
        ) : (
          <div className="space-y-3">
            {openInvoices.map((inv, idx) => {
              const ageDays = calculateAgeDays(inv.date);
              const reminderDraft = draftGstReminderText(inv);

              return (
                <div
                  key={inv.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{inv.customerName}</span>
                      <span className="text-xs font-mono text-emerald-400">({inv.id})</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ageDays > 5
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ageDays} {isHi ? 'दिन पुराना' : 'days old'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 max-w-xl">
                      {reminderDraft}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div className="text-right">
                      <div className="text-lg font-black text-white">₹{inv.balanceDue}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{isHi ? 'देय राशि' : 'Balance'}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSendReminder(inv)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors flex items-center space-x-1"
                      >
                        <Send className="h-3 w-3" />
                        <span>{isHi ? 'GST तकादा भेजें' : 'Send Reminder'}</span>
                      </button>
                      <button
                        onClick={() => handleCopyReminder(inv, idx)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:text-white"
                      >
                        {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-400" /> : (isHi ? 'कॉपी' : 'Copy')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
