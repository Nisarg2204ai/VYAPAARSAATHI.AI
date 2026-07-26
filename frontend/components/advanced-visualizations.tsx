'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, PieChart, Activity, Layers, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, Zap, Info, Calendar, DollarSign
} from 'lucide-react';

export function AdvancedVisualizations() {
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'gst' | 'reconciliation' | 'risk'>('revenue');

  // Simulated monthly revenue trendline data
  const revenueTrend = [
    { month: 'Feb', revenue: 640000, gst: 97627, matched: 92 },
    { month: 'Mar', revenue: 780000, gst: 118983, matched: 94 },
    { month: 'Apr', revenue: 890000, gst: 135762, matched: 95 },
    { month: 'May', revenue: 982000, gst: 149796, matched: 96 },
    { month: 'Jun', revenue: 1054000, gst: 160779, matched: 97 },
    { month: 'Jul', revenue: 1248500, gst: 190449, matched: 99 },
  ];

  // GST Tax Slab distribution data
  const gstSlabs = [
    { slab: '18% Standard GST (IT & Electronics)', amount: 749100, pct: 60, color: '#00A3E0' }, // Adani Cyan
    { slab: '12% Service Tax (Logistics)', amount: 249700, pct: 20, color: '#E2A925' }, // Adani Gold
    { slab: '5% Essential Goods', amount: 187275, pct: 15, color: '#10B981' }, // Emerald
    { slab: '28% Luxury & Motors', amount: 62425, pct: 5, color: '#9E1B32' }, // Adani Crimson
  ];

  // SVG Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const maxRev = 1400000;

  // Calculate SVG Points for Revenue Line
  const points = revenueTrend.map((d, index) => {
    const x = (index / (revenueTrend.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - (d.revenue / maxRev) * (svgHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  // Calculate Area Polygon
  const firstX = 30;
  const lastX = svgWidth - 30;
  const bottomY = svgHeight - 20;
  const areaPoints = `${firstX},${bottomY} ${points} ${lastX},${bottomY}`;

  return (
    <div className="division-box border border-cyan-500/30 bg-slate-900/90 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#003B71]/40 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#00A3E0]/20 blur-3xl pointer-events-none" />

      {/* Division Header */}
      <div className="division-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#00A3E0] animate-pulse" />
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#00A3E0]" />
              <span>DIVISION 3: Advanced Data Visualization Suite</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial telemetry • Dynamic SVG trendlines • GST Slab decomposition • AI Reconciliation Gauge
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1.5 bg-[#030914] p-1.5 rounded-2xl border border-cyan-500/30">
          <button
            onClick={() => setActiveChartTab('revenue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeChartTab === 'revenue'
                ? 'bg-gradient-to-r from-[#003B71] to-[#00A3E0] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenue Growth
          </button>
          <button
            onClick={() => setActiveChartTab('gst')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeChartTab === 'gst'
                ? 'bg-gradient-to-r from-[#003B71] to-[#E2A925] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GST Decompositions
          </button>
          <button
            onClick={() => setActiveChartTab('reconciliation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeChartTab === 'reconciliation'
                ? 'bg-gradient-to-r from-[#003B71] to-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reconciliation Meter
          </button>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeChartTab === 'revenue' && (
        <div className="space-y-6">
          
          {/* Metrics Quick Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#030914] border border-cyan-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Current Quarter Revenue</span>
              <span className="text-2xl font-black text-white mt-1 block">₹32,84,500</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" /> +24.8% growth trajectory
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030914] border border-amber-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Annualized Run-Rate</span>
              <span className="text-2xl font-black text-[#E2A925] mt-1 block">₹1.49 Crore</span>
              <span className="text-xs font-bold text-[#E2A925] flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3.5 w-3.5" /> High Credit Rating
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030914] border border-emerald-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Payment Velocity</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">1.8 Days</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <Zap className="h-3.5 w-3.5" /> Instant UPI Settlement
              </span>
            </div>
          </div>

          {/* Interactive Vector SVG Trendline Chart */}
          <div className="p-5 rounded-2xl bg-[#030914] border border-slate-800 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Monthly Revenue Stream (Feb 2026 - Jul 2026)</span>
              <span className="text-xs font-bold text-[#00A3E0] bg-[#00A3E0]/10 px-3 py-1 rounded-full border border-[#00A3E0]/30">
                CYBER-PRECISION ANALYTICS
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
                <defs>
                  <linearGradient id="revAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00A3E0" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#003B71" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00A3E0" />
                    <stop offset="50%" stopColor="#E2A925" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75].map((ratio, idx) => {
                  const y = svgHeight - ratio * (svgHeight - 40) - 20;
                  return (
                    <line
                      key={idx}
                      x1="30"
                      y1={y}
                      x2={svgWidth - 30}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Filled Area */}
                <polygon points={areaPoints} fill="url(#revAreaGradient)" />

                {/* Polyline */}
                <polyline
                  fill="none"
                  stroke="url(#lineStroke)"
                  strokeWidth="3.5"
                  points={points}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Nodes & Labels */}
                {revenueTrend.map((d, idx) => {
                  const x = (idx / (revenueTrend.length - 1)) * (svgWidth - 60) + 30;
                  const y = svgHeight - (d.revenue / maxRev) * (svgHeight - 40) - 20;
                  return (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-[#00A3E0] stroke-slate-950 stroke-2 group-hover:r-8 transition-all"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="fill-white font-black text-[10px] font-mono"
                      >
                        ₹{(d.revenue / 100000).toFixed(2)}L
                      </text>
                      <text
                        x={x}
                        y={svgHeight - 2}
                        textAnchor="middle"
                        className="fill-slate-400 font-bold text-[10px]"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

        </div>
      )}

      {activeChartTab === 'gst' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: GST Slab Decomposition Bars */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider">GST Tax Liability by Tax Slab (July 2026)</h3>
            {gstSlabs.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#030914] border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.slab}
                  </span>
                  <span className="font-mono font-black text-amber-400">₹{item.amount.toLocaleString('en-IN')} ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Tax Credit Optimization Summary */}
          <div className="p-5 rounded-2xl bg-[#030914] border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black text-[#E2A925] border border-amber-500/20 mb-3">
                <ShieldCheck className="h-4 w-4" />
                <span>INPUT TAX CREDIT (ITC) OPTIMIZER</span>
              </div>
              <h4 className="text-lg font-black text-white">Eligible ITC Claim: ₹42,850.00</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                VyapaarSathi AI automatically cross-references purchase invoices with supplier GSTR-2B filing to prevent tax leakages and claim full input tax credit.
              </p>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Output Tax (GSTR-1):</span>
                <span className="font-mono font-bold text-rose-400">₹1,90,449.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claimable ITC Credit (GSTR-2B):</span>
                <span className="font-mono font-bold text-emerald-400">-₹42,850.00</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm">
                <span className="text-white">Net Payable GST (GSTR-3B):</span>
                <span className="font-mono text-[#00A3E0]">₹1,47,599.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeChartTab === 'reconciliation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#030914] border border-cyan-500/30 text-center flex flex-col items-center justify-center">
            <div className="relative h-32 w-32 flex items-center justify-center">
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
                  strokeDasharray="99, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-2xl font-black text-white font-mono">99%</span>
            </div>
            <h4 className="text-sm font-black text-white mt-2">Auto-Match Accuracy</h4>
            <p className="text-[11px] text-slate-400 mt-1">Matched via UPI Reference & Invoice Amounts</p>
          </div>

          <div className="md:col-span-2 p-5 rounded-2xl bg-[#030914] border border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">AI Anomaly & Risk Detection Telemetry</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Duplicate UPI Reference Check</p>
                  <p className="text-[11px] text-slate-400">Scanned 1,480 transactions • 0 duplicates detected</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  PASSED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Partial Customer Name Discrepancy</p>
                  <p className="text-[11px] text-slate-400">1 transaction requires 1-click human verification</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                  1 REVIEW
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
