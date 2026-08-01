'use client';

import React, { useState } from 'react';
import { OpenInvoice } from '../lib/seedData';
import { generateWhatsAppSummary } from '../lib/invoiceParser';
import {
  FileText,
  Share2,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Search,
  Check,
  Send,
  AlertCircle
} from 'lucide-react';

interface OpenInvoicesPanelProps {
  invoices: OpenInvoice[];
  onMarkPaid: (invoiceId: string) => void;
  lang: 'en' | 'hi';
}

export function OpenInvoicesPanel({ invoices, onMarkPaid, lang }: OpenInvoicesPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isHi = lang === 'hi';

  const calculateAgeDays = (dateStr: string) => {
    const created = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShareWhatsApp = (inv: OpenInvoice) => {
    const summaryText = generateWhatsAppSummary(
      {
        id: inv.id,
        customerName: inv.customerName,
        items: inv.items.map((i) => ({
          qty: i.qty,
          unit: (i.unit as any) || 'pc',
          item: i.item,
          price: i.price,
          total: i.total || i.price,
        })),
        totalAmount: inv.totalAmount,
        upiVpa: inv.upiVpa,
      },
      lang
    );

    const encodedText = encodeURIComponent(summaryText);
    const whatsappUrl = `https://wa.me/${inv.customerPhone?.replace(/[^\d]/g, '') || ''}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopySummary = (inv: OpenInvoice) => {
    const summaryText = generateWhatsAppSummary(
      {
        id: inv.id,
        customerName: inv.customerName,
        items: inv.items.map((i) => ({
          qty: i.qty,
          unit: (i.unit as any) || 'pc',
          item: i.item,
          price: i.price,
          total: i.total || i.price,
        })),
        totalAmount: inv.totalAmount,
        upiVpa: inv.upiVpa,
      },
      lang
    );

    navigator.clipboard.writeText(summaryText);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isHi ? 'ग्राहक का नाम या बिल नंबर खोजें...' : 'Search customer or invoice #...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>{isHi ? 'कुल खुले बिल:' : 'Total Open Invoices:'}</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            {invoices.filter((i) => i.status === 'OPEN').length}
          </span>
        </div>
      </div>

      {/* Invoices Grid */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">
            {isHi ? 'कोई बकाया बिल नहीं मिला।' : 'No open invoices found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInvoices.map((inv) => {
            const ageDays = calculateAgeDays(inv.date);
            const isPaid = inv.status === 'PAID';

            return (
              <div
                key={inv.id}
                className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isPaid
                    ? 'bg-slate-900/40 border-slate-800 opacity-75'
                    : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 shadow-lg'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{inv.id}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isPaid
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : ageDays > 5
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isPaid ? (isHi ? 'भुगतान पूर्ण' : 'PAID') : `${ageDays} ${isHi ? 'दिन पुराना' : 'days old'}`}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-emerald-400 inline" />
                      {inv.customerName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white">₹{inv.balanceDue}</div>
                    <div className="text-[11px] text-slate-400">{isHi ? 'बकाया राशि' : 'Balance Due'}</div>
                  </div>
                </div>

                {/* Items Summary List */}
                <div className="bg-slate-950/60 rounded-xl p-3 mb-4 space-y-1.5 border border-slate-800/80">
                  {inv.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-300">
                      <span>
                        • {item.qty} {item.unit || 'pc'} {item.item}
                      </span>
                      <span className="font-semibold text-slate-200">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShareWhatsApp(inv)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                      title={isHi ? 'व्हाट्सएप शेयर करें' : 'Share on WhatsApp'}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleCopySummary(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium hover:text-white transition-colors"
                    >
                      {copiedId === inv.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : (isHi ? 'कॉपी' : 'Copy')}
                    </button>
                  </div>

                  {!isPaid && (
                    <button
                      onClick={() => onMarkPaid(inv.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isHi ? 'भुगतान दर्ज करें' : 'Mark Paid'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
