'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, FileText, ArrowRight, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockSearchDatabase = [
  { id: '1', title: 'GST Invoice #VS-20260725-001', category: 'Invoices', href: '/invoices', detail: '₹45,000.00 • Acme Corp' },
  { id: '2', title: 'GST Invoice #VS-20260724-002', category: 'Invoices', href: '/invoices', detail: '₹12,400.00 • Rajesh Traders' },
  { id: '3', title: 'UPI UTR #420918239012', category: 'Reconciliation', href: '/reconciliation', detail: 'Matched with 98% Confidence' },
  { id: '4', title: 'GSTR-3B Monthly Return Draft', category: 'Reports', href: '/reports', detail: 'Due in 3 days (17th July)' },
  { id: '5', title: 'Revenue vs Expense Analytics', category: 'Analytics', href: '/analytics', detail: '+18.4% Revenue Growth YoY' },
  { id: '6', title: 'Business GSTIN & Tax Profile', category: 'Settings', href: '/settings', detail: '27AAAAA0000A1Z5 • Active' },
  { id: '7', title: 'Voice-to-Invoice Whisper Engine', category: 'Invoices', href: '/invoices', detail: 'Hindi / Hinglish Voice Input' },
  { id: '8', title: 'Report System Bug / Issue', category: 'Reports', href: '/reports', detail: 'Submit ticket to Support' },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? mockSearchDatabase.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.detail.toLowerCase().includes(query.toLowerCase())
      )
    : mockSearchDatabase.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950 shadow-2xl shadow-amber-500/10 text-slate-100">
        {/* Search Bar Header */}
        <div className="relative flex items-center border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-amber-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices, GST reports, UPI transactions, settings..."
            className="w-full bg-transparent text-base text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400/80">
            {query ? `Search Results (${results.length})` : 'Quick Navigation Shortcuts'}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching records found for "{query}"
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-amber-500/20 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.category === 'Invoices' && <FileText className="h-4 w-4" />}
                    {item.category === 'Reconciliation' && <TrendingUp className="h-4 w-4" />}
                    {item.category === 'Reports' && <AlertTriangle className="h-4 w-4" />}
                    {item.category === 'Settings' && <ShieldCheck className="h-4 w-4" />}
                    {item.category === 'Analytics' && <TrendingUp className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400">{item.detail}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 group-hover:text-amber-400 transition-colors">
                  <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {item.category}
                  </span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="border-t border-slate-800/80 px-4 py-2.5 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">ESC</kbd> to exit</span>
          <span>Instant VyapaarSathi Global Search</span>
        </div>
      </div>
    </div>
  );
}
