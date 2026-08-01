'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  Bot,
  Layers,
  FileText,
  Zap,
  Lock,
  UserCheck,
  Landmark,
  Volume2,
} from 'lucide-react';
import { GoldRupeeRain } from '../components/gold-rupee-rain';
import { Navbar } from '../components/navbar';
import { AuthModal } from '../components/auth-modal';
import { VyapaarSathiLogo } from '../components/vyapaar-sathi-logo';

export default function WelcomePage() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; businessName: string; gstin: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vyapaar_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleEnterDashboard = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsAuthOpen(true);
    } else {
      router.push('/dashboard');
    }
  };

  const handleFeatureClick = (e: React.MouseEvent, targetHref: string) => {
    if (!user) {
      e.preventDefault();
      setIsAuthOpen(true);
    } else {
      router.push(targetHref);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121110] text-[#F5F2EC] font-['Montserrat',sans-serif] selection:bg-[#DA7756] selection:text-white overflow-hidden">
      {/* Background Gold Rupee Particle Rain */}
      <GoldRupeeRain />

      {/* Ultra-Clean Header Navigation */}
      <Navbar />

      {/* Central Hero Container */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
        
        {/* Top Logo Card rendering user's provided logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#DA7756] via-[#D97706] to-[#0F4C81] blur-lg opacity-50 group-hover:opacity-85 transition duration-500"></div>
            <div className="relative flex items-center space-x-3 rounded-3xl bg-[#1A1816]/90 border border-[#DA7756]/40 px-8 py-4 shadow-2xl backdrop-blur-2xl">
              <VyapaarSathiLogo size="lg" showText={true} />
            </div>
          </div>
        </div>

        {/* Central Hero Card */}
        <div className="w-full max-w-xl rounded-3xl border border-[#DA7756]/30 bg-[#1A1816]/85 p-8 sm:p-10 text-center shadow-2xl shadow-black/80 backdrop-blur-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#DA7756]/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#0F4C81]/20 blur-3xl pointer-events-none"></div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#DA7756]/40 bg-[#DA7756]/15 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-[#DA7756] mb-5">
            <Zap className="h-3.5 w-3.5" />
            <span>CLAUDE AMBER MSME VITALITY ECOSYSTEM</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Welcome to <br />
            <span className="gradient-text-claude">
              VyapaarSathi AI
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6 font-medium">
            Paytm & PhonePe style Smart Voice Soundbox, MSME Govt Schemes (PMEGP, Mudra), Automated GST Billing & AI CFO Financial Advisor for Bharat&apos;s enterprises.
          </p>

          {/* Enter Dashboard, Vyapari Demo & Auth Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link
              href="/vyapari"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-8 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 fill-current" />
              <span>Launch Vyapari Assistant</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={handleEnterDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-full border border-slate-700 bg-slate-800/80 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>{user ? 'Enter Full Dashboard' : 'Sign In / Register'}</span>
            </button>
          </div>

          {/* Avatar Social Proof */}
          <div className="flex items-center justify-center space-x-3 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full bg-amber-500 ring-2 ring-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-950">
                R
              </span>
              <span className="inline-block h-6 w-6 rounded-full bg-rose-500 ring-2 ring-slate-900 flex items-center justify-center text-[9px] font-bold text-white">
                S
              </span>
              <span className="inline-block h-6 w-6 rounded-full bg-teal-500 ring-2 ring-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-950">
                A
              </span>
            </div>
            <span className="font-semibold text-slate-300 text-xs">
              Trusted by <strong className="text-amber-400 font-extrabold">10,000+ MSMEs</strong> across India
            </span>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
