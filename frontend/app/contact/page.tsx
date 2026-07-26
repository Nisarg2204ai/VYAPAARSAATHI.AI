'use client';

import React, { useState } from 'react';
import { 
  Phone, Mail, MessageSquare, MapPin, Send, CheckCircle2, 
  HelpCircle, Clock, ShieldCheck, Sparkles, Building2
} from 'lucide-react';
import { Navbar } from '../../components/navbar';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('gst');
  const [message, setMessage] = useState('');
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const ticketId = `VS-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketCreated(ticketId);
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#F5F2EC] font-['Montserrat',sans-serif]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#DA7756]/40 bg-[#DA7756]/15 px-4 py-1 text-xs font-black text-[#DA7756]">
            <HelpCircle className="h-4 w-4" />
            <span>24/7 BHARAT MSME HELPDESK</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            We are here to support your <span className="gradient-text-claude">Business Growth</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Have questions about GST filing, PMEGP capital subsidies, Mudra loans, or Paytm Soundbox setup? Contact our expert advisory team.
          </p>
        </section>

        {/* Quick Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#1A1816] border border-[#DA7756]/30 flex items-center space-x-4 shadow-xl">
            <div className="p-3.5 rounded-2xl bg-[#DA7756]/15 text-[#DA7756] border border-[#DA7756]/30">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Toll-Free MSME Helpline</span>
              <span className="text-lg font-black text-white font-mono">1800-889-MSME</span>
              <span className="text-[11px] text-emerald-400 block font-semibold">Mon - Sat (9 AM - 8 PM)</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1A1816] border border-[#D97706]/30 flex items-center space-x-4 shadow-xl">
            <div className="p-3.5 rounded-2xl bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">WhatsApp Merchant Support</span>
              <span className="text-lg font-black text-white font-mono">+91 98765 43210</span>
              <span className="text-[11px] text-emerald-400 block font-semibold">Instant AI Auto-Reply</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1A1816] border border-cyan-500/30 flex items-center space-x-4 shadow-xl">
            <div className="p-3.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Official Support Email</span>
              <span className="text-sm font-black text-white font-mono">support@vyapaarsathi.ai</span>
              <span className="text-[11px] text-cyan-400 block font-semibold">Max 2-Hour Response Time</span>
            </div>
          </div>
        </div>

        {/* Main Form & Office Hubs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Helpdesk Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-[#DA7756]/30 bg-[#1A1816] p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-2">Submit Support Request</h2>
            <p className="text-xs text-slate-300 mb-6 font-medium">Generate a support ticket. Our MSME Financial Officer will reach out shortly.</p>

            {ticketCreated ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-pulse" />
                <h3 className="text-lg font-black text-white">Support Ticket Created Successfully!</h3>
                <p className="text-xs text-slate-300">Ticket ID: <strong className="font-mono text-emerald-400 text-sm">{ticketCreated}</strong></p>
                <p className="text-xs text-slate-400">Our MSME Specialist will call you at <span className="text-white font-bold">{phone}</span> within 60 minutes.</p>
                <button
                  onClick={() => setTicketCreated(null)}
                  className="button-secondary text-xs mt-2"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-Digit Mobile"
                      className="field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Business / Store Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Patel Traders"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Issue Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="field"
                    >
                      <option value="gst">GST Filing & Invoicing</option>
                      <option value="schemes">PMEGP / Mudra Scheme Eligibility</option>
                      <option value="soundbox">Paytm / Soundbox Integration</option>
                      <option value="treds">TReDS Invoice Discounting</option>
                      <option value="other">General Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Describe Your Request</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your query details here..."
                    className="field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full button-primary py-3 text-xs font-black"
                >
                  <Send className="h-4 w-4" />
                  <span>SUBMIT SUPPORT TICKET</span>
                </button>
              </form>
            )}
          </div>

          {/* Regional Hubs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[#1A1816] border border-[#DA7756]/30 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#DA7756]" />
                <span>Regional MSME Officer Hubs</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#121110] border border-slate-800">
                  <p className="font-bold text-[#DA7756]">Western Region (HQ - Mumbai)</p>
                  <p className="text-slate-300 mt-0.5">BKC Financial District, Bandra East, Mumbai, MH 400051</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#121110] border border-slate-800">
                  <p className="font-bold text-[#D97706]">Gujarat & North Hub (Ahmedabad)</p>
                  <p className="text-slate-300 mt-0.5">SG Highway MSME Tower, Ahmedabad, GJ 380054</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#121110] border border-slate-800">
                  <p className="font-bold text-cyan-400">Southern Region (Bengaluru)</p>
                  <p className="text-slate-300 mt-0.5">Indiranagar Tech Corridor, Bengaluru, KA 560038</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
