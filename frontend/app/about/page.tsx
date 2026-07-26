'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Zap, Award, Building2, TrendingUp, Users, 
  CheckCircle2, ArrowRight, Heart, Sparkles, Volume2, Landmark, Bot
} from 'lucide-react';
import { Navbar } from '../../components/navbar';
import { VyapaarSathiLogo } from '../../components/vyapaar-sathi-logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#121110] text-[#F5F2EC] font-['Montserrat',sans-serif]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#DA7756]/40 bg-[#DA7756]/15 px-4 py-1 text-xs font-black text-[#DA7756]">
            <Sparkles className="h-4 w-4" />
            <span>BUILDING THE FUTURE OF BHARAT'S MSMEs</span>
          </div>

          <div className="flex justify-center my-4">
            <VyapaarSathiLogo size="xl" showText={true} />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Empowering 6.3+ Crore Enterprises with <span className="gradient-text-claude">AI Financial Intelligence</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            VyapaarSathi AI is India&apos;s flagship MSME vitality ecosystem — combining Paytm-style smart voice soundbox payment alerts, automated GST reconciliation, collateral-free Mudra credit lines, and PMEGP capital subsidies into a single unified platform.
          </p>
        </section>

        {/* Vitality Metrics Impact Division */}
        <section className="division-box border border-[#DA7756]/30 bg-gradient-to-r from-[#1A1816] via-[#121110] to-[#1A1816]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#121110] border border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-[#DA7756] font-mono">10,000+</span>
              <span className="text-xs font-extrabold uppercase text-slate-400 block mt-1">Verified MSMEs</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#121110] border border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-[#D97706] font-mono">₹500+ Cr</span>
              <span className="text-xs font-extrabold uppercase text-slate-400 block mt-1">UPI Reconciled</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#121110] border border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">₹45+ Cr</span>
              <span className="text-xs font-extrabold uppercase text-slate-400 block mt-1">Subsidies Unlocked</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#121110] border border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">99.8%</span>
              <span className="text-xs font-extrabold uppercase text-slate-400 block mt-1">AI Match Accuracy</span>
            </div>
          </div>
        </section>

        {/* Four Core Pillars of VyapaarSathi AI */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-white">Four Core Pillars of Our Ecosystem</h2>
            <p className="text-xs text-slate-400 mt-2">Designed specifically for Indian Kirana stores, Manufacturers, Traders & Service Enterprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#1A1816] border border-[#DA7756]/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="p-3.5 rounded-2xl bg-[#DA7756]/15 text-[#DA7756] w-fit mb-4 border border-[#DA7756]/30">
                  <Volume2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">Smart Voice Soundbox</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Real-time spoken payment announcements in 12 Indian languages with dynamic NPCI UPI 2.0 QR generator.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-[#DA7756] uppercase tracking-wider mt-4">Zero Hardware Lag</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#1A1816] border border-[#D97706]/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="p-3.5 rounded-2xl bg-[#D97706]/15 text-[#D97706] w-fit mb-4 border border-[#D97706]/30">
                  <Landmark className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">Govt Subsidies Engine</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Direct PMEGP 35% margin money grants, Mudra collateral-free credit & RBI TReDS 24-hr invoice cash.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-[#D97706] uppercase tracking-wider mt-4">JanSamarth Integrated</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#1A1816] border border-cyan-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="p-3.5 rounded-2xl bg-cyan-500/15 text-cyan-400 w-fit mb-4 border border-cyan-500/30">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">AI CFO Advisor</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Real-time CIBIL MSME credit score radar, GSTR-2B input tax credit optimization & scenario stress testing.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider mt-4">Instant Advisory</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#1A1816] border border-emerald-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 w-fit mb-4 border border-emerald-500/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">GST Billing & Ledger</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Bilingual GST compliance, spoken invoice capture, auto-reconciliation, and e-way bill readiness.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider mt-4">100% Tax Compliant</span>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-3xl border border-[#DA7756]/40 bg-gradient-to-r from-[#DA7756] via-[#D97706] to-[#0F4C81] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl font-black text-white">Ready to scale your business with AI?</h3>
            <p className="text-xs text-white/90 mt-1 font-medium">Join 10,000+ MSMEs enjoying zero payment friction and maximum Govt subsidies.</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl bg-[#121110] hover:bg-[#1A1816] px-8 py-3.5 text-xs font-black text-[#F5F2EC] transition-all shadow-xl whitespace-nowrap"
          >
            Launch Dashboard Now
          </Link>
        </section>

      </main>
    </div>
  );
}
