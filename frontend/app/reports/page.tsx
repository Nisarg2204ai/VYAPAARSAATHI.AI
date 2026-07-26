'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/navbar';
import { AlertTriangle, Send, CheckCircle2, FileSpreadsheet, Calendar, BellRing } from 'lucide-react';

export default function ReportsPage() {
  const [issueType, setIssueType] = useState('bug');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubject('');
      setDescription('');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-rose-400" />
              <span>GST Compliance Reports & Issue Center</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View automated GSTR-3B filings, set cron reminders, and submit system issues to engineering.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: GST Filing Reports */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* GSTR Filing Status Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Upcoming GSTR-3B Filing</h3>
                    <p className="text-xs text-slate-400">Monthly Tax Return • July 2026</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  Due in 3 Days (20th July)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 my-6 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400">Total Taxable Value</div>
                  <div className="text-lg font-extrabold text-white mt-1">₹3,45,000.00</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-amber-400">Calculated GST (18%)</div>
                  <div className="text-lg font-extrabold text-amber-400 mt-1">₹62,100.00</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-emerald-400">ITC Claimable</div>
                  <div className="text-lg font-extrabold text-emerald-400 mt-1">₹14,200.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <BellRing className="h-4 w-4 text-emerald-400 animate-bounce" />
                  <span>Automated WhatsApp & Email Alert Cron Active</span>
                </div>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-md">
                  Generate GSTR Summary JSON
                </button>
              </div>
            </div>

            {/* Past Reports Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Historical Tax Filing Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-3 px-2">Period</th>
                      <th className="py-3 px-2">Return Type</th>
                      <th className="py-3 px-2">Net Tax Paid</th>
                      <th className="py-3 px-2">ARN Number</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">June 2026</td>
                      <td className="py-3 px-2">GSTR-3B</td>
                      <td className="py-3 px-2 font-mono">₹48,900.00</td>
                      <td className="py-3 px-2 font-mono">AA2706261092831</td>
                      <td className="py-3 px-2"><span className="text-emerald-400 font-bold">Filed ✓</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">May 2026</td>
                      <td className="py-3 px-2">GSTR-3B</td>
                      <td className="py-3 px-2 font-mono">₹52,400.00</td>
                      <td className="py-3 px-2 font-mono">AA2705260982173</td>
                      <td className="py-3 px-2"><span className="text-emerald-400 font-bold">Filed ✓</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">April 2026</td>
                      <td className="py-3 px-2">GSTR-1</td>
                      <td className="py-3 px-2 font-mono">₹41,200.00</td>
                      <td className="py-3 px-2 font-mono">AA2704260871264</td>
                      <td className="py-3 px-2"><span className="text-emerald-400 font-bold">Filed ✓</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Col: Report System Issue Portal */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Report System Issue</h3>
                  <p className="text-xs text-slate-400">Direct Engineering Support Ticket</p>
                </div>
              </div>

              {submitted && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Issue report submitted successfully! Ticket #VS-8923 logged.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Issue Classification
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="bug">Software Bug / Error</option>
                    <option value="reconciliation">UPI Reconciliation Discrepancy</option>
                    <option value="gstin">GSTIN Validation Failure</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Subject / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. CSV upload failed on SBI format"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the steps to reproduce or issue details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-pink-500 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Ticket to Support</span>
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              VyapaarSathi AI Support Response SLA: &lt; 2 Hours
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
