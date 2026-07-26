'use client';

import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, ShieldCheck, TrendingUp, DollarSign, Zap, 
  Award, AlertTriangle, ArrowUpRight, CheckCircle2, RefreshCw, FileText, Download, UserCheck
} from 'lucide-react';

export function CfoAiAdvisor() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; category?: string }>>([
    {
      role: 'assistant',
      text: 'Greetings! I am your Senior Fintech & CFO Financial Advisor. I monitor your cash flow, GST compliance, credit health, and MSME Govt subsidies in real time. How can I accelerate your business growth today?',
      category: 'System'
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Scenario Simulator State
  const [revenueGrowth, setRevenueGrowth] = useState<number>(20); // 20%
  const [delayDays, setDelayDays] = useState<number>(15);
  const [inventoryDays, setInventoryDays] = useState<number>(30);

  const samplePrompts = [
    { label: '💡 Maximize GSTR-3B Input Tax Credit (ITC)', prompt: 'How can I optimize my GST Input Tax Credit (ITC) for this month and avoid GSTR-2B mismatches?' },
    { label: '💰 Calculate Borrowing Capacity & Loan Eligibility', prompt: 'Based on my ₹12.48 Lakh monthly revenue, what is my maximum collateral-free loan eligibility under Mudra & CGTMSE?' },
    { label: '🚀 Best Govt Grant for Factory Expansion', prompt: 'I want to purchase ₹25 Lakhs of new machinery. Which MSME scheme offers the highest capital subsidy?' },
    { label: '⚡ Fast Working Capital via TReDS Invoice Cash', prompt: 'How can I convert ₹15 Lakhs of unpaid corporate invoices into cash within 24 hours without taking bank debt?' }
  ];

  const handleSend = (textToSend?: string) => {
    const userPrompt = textToSend || query;
    if (!userPrompt.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setQuery('');
    setIsAnalyzing(true);

    setTimeout(() => {
      let advice = '';
      let category = 'Fintech Strategy';

      if (userPrompt.includes('GST') || userPrompt.includes('ITC')) {
        advice = `📊 **GST & ITC Optimization Audit:**\n\n1. **Reconcile GSTR-2B vs Purchases:** You have ₹42,850 of eligible ITC. Ensure suppliers file GSTR-1 by the 11th to avoid blocking.\n2. **Capital Goods Credit:** Claim 100% ITC on machinery and office electronics purchased this quarter.\n3. **Cashflow Protection:** Utilize ITC credit pool before making cash electronic liability payments. Estimated net GST payable: ₹1,47,599.`;
        category = 'GST & Tax Compliance';
      } else if (userPrompt.includes('loan') || userPrompt.includes('Mudra') || userPrompt.includes('borrowing')) {
        advice = `🏦 **Pre-Approved MSME Borrowing Capacity:**\n\n- **Mudra Tarun Loan:** Eligible for ₹10,00,000 (100% Collateral-Free @ 8.9% p.a.).\n- **CGTMSE Cover:** Pre-cleared for credit guarantee up to ₹50,00,000 without property mortgage.\n- **DSCR Rating:** Your Debt Service Coverage Ratio is 2.45x (Bank benchmark is >1.5x). Approval probability: 96%.`;
        category = 'Working Capital & Credit';
      } else if (userPrompt.includes('machinery') || userPrompt.includes('subsidy') || userPrompt.includes('grant')) {
        advice = `🏛️ **Recommended Govt Subsidy: PMEGP Capital Grant**\n\n- **Grant Percentage:** 35% Margin Money Subsidy (Rural/Special Category) or 25% (Urban).\n- **Grant Amount:** On a ₹25 Lakh project, Govt provides **₹8,75,000 non-refundable grant**.\n- **Own Contribution:** Only 5% (₹1,25,000).\n- **Action:** Apply via KVIC JanSamarth portal. Udyam Registration & Project Report (DPR) are pre-verified!`;
        category = 'Govt Subsidies';
      } else if (userPrompt.includes('TReDS') || userPrompt.includes('invoice') || userPrompt.includes('cash')) {
        advice = `⚡ **RBI TReDS Instant Invoice Discounting:**\n\n1. **90% Cash Advance:** Upload your accepted B2B invoice of ₹15,00,000 to receive **₹13,50,000 within 24-48 hours**.\n2. **Without Recourse:** The corporate buyer pays the financier. No liability on your balance sheet.\n3. **Cost of Funds:** Discounting rate is low (6.5% - 8% p.a. pro-rata). Save on bank interest!`;
        category = 'Cash Flow Acceleration';
      } else {
        advice = `🚀 **Strategic CFO Recommendations for Enterprise Scale:**\n\n1. **Working Capital Runway:** Current cash reserve supports 45 days of operations. Maintain a 60-day buffer.\n2. **Receivable Days (DSO):** Your average DSO is 14 days, outperforming the industry average of 35 days.\n3. **Action Plan:** Expand into new B2B markets using PMEGP capital subsidy and register for ZED Gold Quality certification to unlock 0.5% interest rate discount from nationalized banks.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: advice, category }]);
      setIsAnalyzing(false);
    }, 1200);
  };

  // Scenario Calculation
  const projectedRevenue = 1248500 * (1 + revenueGrowth / 100);
  const workingCapitalGap = Math.round((projectedRevenue / 30) * delayDays);
  const healthIndex = Math.min(950, Math.max(600, Math.round(860 + revenueGrowth * 2 - delayDays * 3)));

  return (
    <div className="space-y-8 font-['Montserrat',sans-serif]">
      
      {/* Top Banner: Credit Score & Health Radar Division */}
      <section className="division-box border border-[#00A3E0]/30 bg-gradient-to-r from-[#003B71] via-[#081630] to-[#030914]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#030914] border border-[#00A3E0]/30 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00A3E0]/15 blur-2xl pointer-events-none" />
            
            <span className="rounded-full bg-[#00A3E0]/15 px-3 py-0.5 text-[10px] font-black text-[#00A3E0] border border-[#00A3E0]/30 uppercase tracking-widest mb-3">
              LIVE CIBIL MSME CREDIT INDEX
            </span>

            <div className="relative h-36 w-36 flex items-center justify-center my-2">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-900"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#00A3E0]"
                  strokeDasharray={`${(healthIndex / 1000) * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white font-mono">{healthIndex}</span>
                <span className="text-[10px] font-extrabold text-[#00A3E0]">AAA RATED</span>
              </div>
            </div>

            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="h-4 w-4" /> Bank Collateral-Free Approved
            </p>
          </div>

          {/* Right: CFO Telemetry Metrics */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Sparkles className="h-4 w-4 text-[#E2A925] animate-pulse" />
                <span className="text-xs font-black uppercase text-[#E2A925] tracking-wider">MSME FINANCIAL ADVISORY RADAR</span>
              </div>
              <h2 className="text-2xl font-black text-white">Executive CFO Growth Engine</h2>
              <p className="text-xs text-slate-300 font-medium mt-1">
                Real-time debt coverage audit, scenario stress-testing & AI strategic capital advisory.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#030914] border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">DSCR Ratio</span>
                <span className="text-lg font-black text-white font-mono">2.45x</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Prime Loan Tier</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#030914] border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Max Mudra Cover</span>
                <span className="text-lg font-black text-[#E2A925] font-mono">₹10 Lakhs</span>
                <span className="text-[10px] text-[#E2A925] font-bold block">0% Collateral</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#030914] border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">PMEGP Grant Eligibility</span>
                <span className="text-lg font-black text-[#00A3E0] font-mono">35% Subsidy</span>
                <span className="text-[10px] text-[#00A3E0] font-bold block">Max ₹17.5L Grant</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#030914] border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">DSO Speed</span>
                <span className="text-lg font-black text-emerald-400 font-mono">14 Days</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Fast Liquidity</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Grid: Interactive Chat Advisor (Left) + Working Capital Stress Test Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: CFO AI Copilot Interactive Assistant (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#00A3E0]/30 bg-[#081630] p-6 shadow-2xl flex flex-col justify-between h-[600px] relative overflow-hidden">
          
          {/* Header */}
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#003B71] to-[#00A3E0] text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">AI CFO Financial Advisor</h3>
                <p className="text-[11px] text-slate-400">Trained on Indian MSME Tax, GST, TReDS & Banking Regulations</p>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ONLINE</span>
            </span>
          </div>

          {/* Sample Strategic Prompts */}
          <div className="py-3 flex items-center space-x-2 overflow-x-auto border-b border-slate-800/80">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sp.prompt)}
                className="px-3 py-1.5 rounded-xl bg-[#030914] border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white hover:border-[#00A3E0] whitespace-nowrap transition-all"
              >
                {sp.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#003B71] to-[#00A3E0] text-white font-semibold shadow-md'
                      : 'bg-[#030914] border border-slate-800 text-slate-200 shadow-xl'
                  }`}
                >
                  {msg.category && (
                    <span className="text-[10px] font-black uppercase text-[#E2A925] block mb-1.5 tracking-wider">
                      {msg.category}
                    </span>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl bg-[#030914] border border-slate-800 w-fit">
                <RefreshCw className="h-4 w-4 text-[#00A3E0] animate-spin" />
                <span className="text-xs font-bold text-slate-300">CFO AI Analyzing Financial Telemetry...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about GST, Mudra loans, PMEGP subsidy, TReDS..."
              className="flex-1 rounded-2xl bg-[#030914] border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#00A3E0] focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="button-primary px-5 py-2.5 text-xs font-black"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Right: Working Capital Stress Test & Scenario Simulator (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#E2A925]/30 bg-gradient-to-b from-[#081630] via-[#030914] to-[#081630] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E2A925]/10 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-[#E2A925]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#E2A925] border border-[#E2A925]/30">
                SCENARIO STRESS TESTER
              </span>
              <span className="text-xs font-bold text-[#00A3E0] flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> Interactive Model
              </span>
            </div>

            <h3 className="text-lg font-black text-white">Working Capital Simulator</h3>
            <p className="text-xs text-slate-300 mt-1">Simulate revenue acceleration vs customer payment delays</p>

            <div className="space-y-4 my-6">
              
              {/* Revenue Growth Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Projected Revenue Growth</span>
                  <span className="font-mono text-[#00A3E0]">+{revenueGrowth}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={revenueGrowth}
                  onChange={(e) => setRevenueGrowth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#00A3E0]"
                />
              </div>

              {/* Receivable Delay Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Customer Payment Delay (Days)</span>
                  <span className="font-mono text-[#E2A925]">{delayDays} Days</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={delayDays}
                  onChange={(e) => setDelayDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#E2A925]"
                />
              </div>

            </div>

            {/* Simulation Results Display Box */}
            <div className="p-4 rounded-2xl bg-[#030914] border border-slate-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Projected Monthly Turnover:</span>
                <span className="font-mono font-bold text-white">₹{Math.round(projectedRevenue).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Estimated Working Capital Gap:</span>
                <span className="font-mono font-bold text-[#E2A925]">₹{workingCapitalGap.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Recommended Buffer Loan</p>
                  <p className="text-lg font-black text-emerald-400">₹{(workingCapitalGap * 1.2).toLocaleString('en-IN')}</p>
                </div>
                <span className="text-[10px] font-bold text-white bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Pre-Cleared Mudra
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => alert('MSME Financial Health & Credit Report generated! Pre-configured for Mudra & PMEGP submissions.')}
              className="w-full button-secondary py-3 text-xs flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4 text-[#00A3E0]" />
              <span>EXPORT BANK-READY FINANCIAL REPORT (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
