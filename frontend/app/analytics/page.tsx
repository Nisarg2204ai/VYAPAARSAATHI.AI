'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { AdvancedVisualizations } from '../../components/advanced-visualizations';
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#030914] text-slate-100 font-['Montserrat',sans-serif]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Division 1: Executive Analytics Header */}
        <section className="division-box border border-[#00A3E0]/30 bg-gradient-to-r from-[#003B71] via-[#081630] to-[#030914]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="rounded-full bg-[#00A3E0]/20 px-3 py-0.5 text-xs font-black text-[#00A3E0] border border-[#00A3E0]/40">
                  ADANI EXECUTIVE TELEMETRY
                </span>
              </div>
              <h1 className="text-3xl font-black text-white flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-[#00A3E0]" />
                <span>MSME Financial Analytics & Growth Telemetry</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                Real-time revenue performance, GST liability forecasting, and AI profit margin optimization.
              </p>
            </div>
          </div>
        </section>

        {/* Division 2: Key Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#081630] border border-[#00A3E0]/20 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
              <span>Gross Monthly Revenue</span>
              <DollarSign className="h-4 w-4 text-[#00A3E0]" />
            </div>
            <div className="text-2xl font-black text-white mt-2">₹12,48,500.00</div>
            <div className="flex items-center space-x-1 text-xs text-[#00A3E0] font-bold mt-2">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.4% vs last month</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#081630] border border-[#E2A925]/20 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
              <span>Collected GST (18%)</span>
              <TrendingUp className="h-4 w-4 text-[#E2A925]" />
            </div>
            <div className="text-2xl font-black text-[#E2A925] mt-2">₹2,24,730.00</div>
            <div className="flex items-center space-x-1 text-xs text-[#E2A925] font-bold mt-2">
              <span>Remittance Ready</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#081630] border border-cyan-500/20 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
              <span>Reconciled UPI Ratio</span>
              <PieChart className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">94.2%</div>
            <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold mt-2">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+3.1% match efficiency</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#081630] border border-emerald-500/20 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
              <span>Average DSO (Days)</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">14 Days</div>
            <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold mt-2">
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>-4 days faster collection</span>
            </div>
          </div>
        </div>

        {/* Division 3: Interactive Visualizations Suite */}
        <AdvancedVisualizations />

        {/* Division 4: Customer Revenue Distribution & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue Breakdown */}
          <div className="p-6 rounded-3xl bg-[#081630] border border-[#00A3E0]/20 shadow-xl">
            <h3 className="text-base font-black text-white mb-4 uppercase tracking-wider text-[#00A3E0]">Monthly Revenue Trajectory</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>July 2026</span>
                  <span className="font-mono text-[#00A3E0]">₹12,48,500</span>
                </div>
                <div className="w-full bg-[#030914] h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-[#003B71] to-[#00A3E0] h-full w-[85%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>June 2026</span>
                  <span className="font-mono text-[#00A3E0]">₹10,54,000</span>
                </div>
                <div className="w-full bg-[#030914] h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-[#003B71] to-[#00A3E0] h-full w-[72%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>May 2026</span>
                  <span className="font-mono text-[#00A3E0]">₹9,82,000</span>
                </div>
                <div className="w-full bg-[#030914] h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-[#003B71] to-[#00A3E0] h-full w-[67%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>April 2026</span>
                  <span className="font-mono text-[#00A3E0]">₹8,90,000</span>
                </div>
                <div className="w-full bg-[#030914] h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-[#003B71] to-[#00A3E0] h-full w-[60%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Concentration & Category Share */}
          <div className="p-6 rounded-3xl bg-[#081630] border border-[#E2A925]/20 shadow-xl">
            <h3 className="text-base font-black text-white mb-4 uppercase tracking-wider text-[#E2A925]">Customer Portfolio Share</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#030914] border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="h-3 w-3 rounded-full bg-[#E2A925]"></span>
                  <span className="text-xs font-bold text-white">Acme Enterprises</span>
                </div>
                <span className="text-xs font-mono font-black text-[#E2A925]">₹4,20,000 (33.6%)</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#030914] border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="h-3 w-3 rounded-full bg-[#00A3E0]"></span>
                  <span className="text-xs font-bold text-white">Rajesh Traders</span>
                </div>
                <span className="text-xs font-mono font-black text-[#00A3E0]">₹3,15,000 (25.2%)</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#030914] border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-white">Bharat Supplies</span>
                </div>
                <span className="text-xs font-mono font-black text-emerald-400">₹2,80,000 (22.4%)</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#030914] border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="h-3 w-3 rounded-full bg-slate-400"></span>
                  <span className="text-xs font-bold text-white">Others</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">₹2,33,500 (18.8%)</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
