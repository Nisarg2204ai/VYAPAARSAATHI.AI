'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Landmark,
  ShieldCheck,
  Zap,
  Sparkles,
  Calculator,
  ArrowRight,
  CheckCircle2,
  FileText,
  Building2,
  Award,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
  HelpCircle,
  Clock,
  BadgeCheck
} from 'lucide-react';
import { Navbar } from '../../components/navbar';
import { GoldRupeeRain } from '../../components/gold-rupee-rain';

export type Scheme = {
  id: string;
  name: string;
  shortName: string;
  category: 'subsidy' | 'loan' | 'certification' | 'discounting';
  ministry: string;
  maxAmount: string;
  subsidyRate: string;
  targetAudience: string;
  description: string;
  keyBenefits: string[];
  documentsRequired: string[];
  applyUrl: string;
  badge: string;
};

const SCHEMES_DATA: Scheme[] = [
  {
    id: 'pmegp',
    name: "Prime Minister's Employment Generation Programme",
    shortName: 'PMEGP Capital Subsidy',
    category: 'subsidy',
    ministry: 'Ministry of MSME / KVIC',
    maxAmount: '₹50 Lakhs (Manufacturing) / ₹20 Lakhs (Service)',
    subsidyRate: '15% to 35% Govt Subsidy',
    targetAudience: 'Micro Enterprises, New Startups, Women, SC/ST, Rural Entrepreneurs',
    description: 'Credit-linked subsidy scheme offering up to 35% margin money subsidy on project cost for setting up new micro-enterprises in manufacturing or service sectors.',
    keyBenefits: [
      '35% subsidy for Rural & Special Category (Women/SC/ST/OBC/Minority)',
      '25% subsidy for Urban General Category',
      'No collateral required for loans up to ₹10 Lakhs',
      'Own contribution required is only 5% to 10%'
    ],
    documentsRequired: ['Aadhaar Card', 'PAN Card', 'Project Report (DPR)', 'Educational Qualification (Class 8th+)', 'Caste/Category Certificate'],
    applyUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    badge: 'TOP GOVT SUBSIDY'
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana',
    shortName: 'PMMY Mudra Loans',
    category: 'loan',
    ministry: 'Ministry of Finance / SIDBI',
    maxAmount: 'Up to ₹10 Lakhs Collateral-Free',
    subsidyRate: '2% Interest Subvention',
    targetAudience: 'Small Shopkeepers, Traders, Artisans, Small Manufacturers',
    description: 'Collateral-free working capital and term loans divided into 3 categories: Shishu (up to ₹50k), Kishore (₹50k to ₹5L), and Tarun (₹5L to ₹10L).',
    keyBenefits: [
      '100% Collateral-Free working capital loan',
      'Nil processing fees for Shishu & Kishore loans',
      'MUDRA Card for instant cash withdrawals',
      '2% interest subvention for prompt repayers'
    ],
    documentsRequired: ['Udyam Registration', 'Identity Proof', 'Bank Statement (Last 6 months)', 'Business Ownership Proof'],
    applyUrl: 'https://www.mudra.org.in/',
    badge: 'POPULAR COLLATERAL-FREE'
  },
  {
    id: 'cgtmse',
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises',
    shortName: 'CGTMSE Credit Guarantee',
    category: 'loan',
    ministry: 'Ministry of MSME & SIDBI',
    maxAmount: 'Up to ₹5 Crore Credit Coverage',
    subsidyRate: '85% Govt Guarantee Cover',
    targetAudience: 'Existing & New Micro & Small Enterprises seeking growth loans',
    description: 'Govt guarantees up to 85% of credit facility extended by commercial banks to MSMEs without third-party collateral or land pledge.',
    keyBenefits: [
      'Get up to ₹5 Crore loan without mortgaging land/property',
      '85% guarantee for loans up to ₹5L and women entrepreneurs',
      'Covered across 130+ nationalized, private and regional banks',
      'Hybrid security options for larger credit lines'
    ],
    documentsRequired: ['Udyam Registration', 'Audited Financials (2 Yrs)', 'GST Returns', 'Detailed Business Growth Plan'],
    applyUrl: 'https://www.cgtmse.in/',
    badge: 'HIGH CAPACITY CREDIT'
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    shortName: 'PM Vishwakarma Artisan Loan',
    category: 'loan',
    ministry: 'Ministry of MSME',
    maxAmount: '₹3 Lakhs @ 5% Concessional Interest',
    subsidyRate: '₹15,000 Toolkit Incentive + 5% Interest Rate',
    targetAudience: 'Artisans, Craftsmen, Carpenters, Blacksmiths, Tailors, Goldsmiths (18 Trades)',
    description: 'Comprehensive support scheme for traditional artisans providing skill upgrade training, ₹15,000 digital toolkit voucher, and collateral-free loans up to ₹3 Lakhs at 5% interest.',
    keyBenefits: [
      'Concessional interest rate capped at only 5%',
      '₹15,000 e-voucher for modern toolkits',
      'PM Vishwakarma Certificate & ID Card',
      '₹1 per digital transaction incentive (up to 100 txns/mo)'
    ],
    documentsRequired: ['Aadhaar Card', 'Ration Card', 'Bank Passbook', 'Skill Verification by Gram Panchayat/ULB'],
    applyUrl: 'https://pmvishwakarma.gov.in/',
    badge: 'ARTISAN SPECIAL'
  },
  {
    id: 'zed',
    name: 'MSME Sustainable (ZED) Certification Scheme',
    shortName: 'ZED Zero Defect Zero Effect',
    category: 'certification',
    ministry: 'Ministry of MSME',
    maxAmount: 'Up to 80% Subsidy on Certification Fee',
    subsidyRate: '80% Fee Concession + ₹5 Lakh Technology Subsidy',
    targetAudience: 'Manufacturing MSMEs aiming for international quality standards',
    description: 'Encourages Indian manufacturers to adopt Zero Defect Zero Effect processes. Offers Bronze, Silver, and Gold ZED certifications with high fee subsidies and bank concessions.',
    keyBenefits: [
      '80% subsidy for Micro, 60% for Small, 50% for Medium Enterprises',
      'Additional 10% subsidy for Women / SC / ST / NER entrepreneurs',
      '0.5% interest rate concession on bank credit for ZED certified units',
      'Up to ₹5 Lakhs financial assistance for testing equipment'
    ],
    documentsRequired: ['Udyam Registration', 'Factory/Unit Photograph', 'Self-Assessment Quality Checklist'],
    applyUrl: 'https://zed.msme.gov.in/',
    badge: 'QUALITY & EXPORT'
  },
  {
    id: 'treds',
    name: 'Trade Receivables Discounting System (TReDS)',
    shortName: 'TReDS MSME Invoice Cash',
    category: 'discounting',
    ministry: 'Reserve Bank of India (RBI) & MSME',
    maxAmount: 'Up to 90% Immediate Advance on Invoices',
    subsidyRate: 'Without Recourse Discounting',
    targetAudience: 'MSMEs facing delayed payments from Corporates, PSUs & Govt Depts',
    description: 'Official RBI-approved electronic platform allowing MSMEs to auction unpaid invoices to multiple financiers and get paid within 24-48 hours.',
    keyBenefits: [
      'Get 90% cash within 48 hours of invoice upload',
      'Without Recourse: Buyer is responsible for final repayment, not you',
      'Collateral-free liquidity without taking bank debt',
      'Compliant with MSME Samadhaan 45-day payment rule'
    ],
    documentsRequired: ['Udyam Certificate', 'Accepted E-Invoice / Purchase Order', 'GSTIN Details'],
    applyUrl: 'https://samadhaan.msme.gov.in/',
    badge: 'INSTANT CASHFLOW'
  }
];

export default function SchemesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<Scheme | null>(null);

  // Calculator State
  const [projectCost, setProjectCost] = useState<number>(1000000); // 10 Lakhs default
  const [applicantCategory, setApplicantCategory] = useState<'general' | 'special'>('special'); // Special = Women, SC/ST, Rural
  const [locationType, setLocationType] = useState<'urban' | 'rural'>('rural');
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(9.5);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATA.filter((scheme) => {
      const matchesSearch =
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.shortName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || scheme.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Dynamic Calculator Results (PMEGP / Govt Subsidy Math)
  const calculatorResults = useMemo(() => {
    let subsidyPercentage = 15;
    if (locationType === 'rural') {
      subsidyPercentage = applicantCategory === 'special' ? 35 : 25;
    } else {
      subsidyPercentage = applicantCategory === 'special' ? 25 : 15;
    }

    const ownContributionPct = applicantCategory === 'special' ? 5 : 10;
    const ownContributionAmount = (projectCost * ownContributionPct) / 100;
    const estimatedSubsidy = (projectCost * subsidyPercentage) / 100;
    const netLoanAmount = projectCost - ownContributionAmount;

    // Monthly EMI Calculation
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;
    const emi =
      netLoanAmount > 0
        ? Math.round(
            (netLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
              (Math.pow(1 + monthlyRate, totalMonths) - 1)
          )
        : 0;

    return {
      subsidyPercentage,
      ownContributionPct,
      ownContributionAmount,
      estimatedSubsidy,
      netLoanAmount,
      monthlyEmi: emi
    };
  }, [projectCost, applicantCategory, locationType, tenureYears, interestRate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      <GoldRupeeRain />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        
        {/* Header Hero Section */}
        <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-amber-500/20 pb-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold text-amber-400 mb-3">
              <BadgeCheck className="h-4 w-4" />
              <span>OFFICIAL MSME APPOVED SCHEMES & SUBSIDIES PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Govt MSME <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">Schemes & Subsidies</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-medium">
              Access Ministry of MSME subsidies up to 35%, PMEGP, Mudra collateral-free loans, CGTMSE credit guarantees & RBI TReDS invoice cash within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 px-6 py-3 text-xs font-black text-white shadow-xl shadow-rose-600/20 hover:from-rose-500 hover:to-amber-400 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Live Subsidy & EMI Calculator Tool */}
        <section className="mb-12 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/30">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">MSME Govt Subsidy & EMI Estimator</h2>
              <p className="text-xs text-amber-300/80">Calculate your eligible PMEGP capital subsidy amount, net loan & monthly EMI</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Project Cost Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-slate-300">Total Project / Machinery Cost (₹)</label>
                  <span className="text-base font-black text-amber-400 font-mono">₹{projectCost.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={projectCost}
                  onChange={(e) => setProjectCost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
                  <span>₹1 Lakh</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs (Max PMEGP)</span>
                </div>
              </div>

              {/* Applicant Category & Location Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-300 mb-1.5 block">Applicant Category</label>
                  <select
                    value={applicantCategory}
                    onChange={(e) => setApplicantCategory(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="special">Special (Women / SC / ST / OBC / Ex-Servicemen)</option>
                    <option value="general">General Category</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-300 mb-1.5 block">Unit Location</label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="rural">Rural Area (35% / 25% Subsidy)</option>
                    <option value="urban">Urban Area (25% / 15% Subsidy)</option>
                  </select>
                </div>
              </div>

              {/* Loan Tenure & Interest Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-300 mb-1.5 block">Loan Tenure (Years)</label>
                  <select
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value={3}>3 Years</option>
                    <option value={5}>5 Years (Standard)</option>
                    <option value={7}>7 Years</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-300 mb-1.5 block">Bank Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-slate-950 border border-amber-500/30 text-center sm:text-left shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-extrabold uppercase text-slate-400">PMEGP Grant Eligibility</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-black text-emerald-400 border border-emerald-500/20">
                    {calculatorResults.subsidyPercentage}% GOVT SUBSIDY
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Estimated Govt Subsidy Grant:</span>
                    <span className="text-lg font-black text-emerald-400">₹{calculatorResults.estimatedSubsidy.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Your Own Contribution ({calculatorResults.ownContributionPct}%):</span>
                    <span className="text-sm font-bold text-amber-400">₹{calculatorResults.ownContributionAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Bank Loan Required:</span>
                    <span className="text-sm font-bold text-slate-200">₹{calculatorResults.netLoanAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase text-slate-400">Estimated Monthly EMI</p>
                      <p className="text-2xl font-black text-white">₹{calculatorResults.monthlyEmi.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                    </div>
                    <Link
                      href="https://www.kviconline.gov.in/pmegpeportal/"
                      target="_blank"
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                    >
                      <span>Claim Subsidy</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[10px] text-slate-400 italic">
                *Subsidy is provided as Margin Money by Govt of India & locked in bank subsidy savings account for 3 years.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Category Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scheme name, subsidy, collateral..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Schemes' },
              { id: 'subsidy', label: 'Capital Subsidies' },
              { id: 'loan', label: 'Collateral-Free Loans' },
              { id: 'certification', label: 'Quality & ZED' },
              { id: 'discounting', label: 'Invoice Cash' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:bg-slate-900 transition-all shadow-xl group relative overflow-hidden"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border border-amber-500/20">
                  {scheme.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-400">{scheme.ministry}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {scheme.name}
                </h3>
                <p className="text-xs font-semibold text-rose-400 mt-1 mb-3">{scheme.subsidyRate}</p>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">{scheme.description}</p>

                {/* Key Metrics Pill */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 mb-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Max Limit:</span>
                    <span className="font-bold text-emerald-400">{scheme.maxAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Eligibility:</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[170px]">{scheme.targetAudience}</span>
                  </div>
                </div>

                {/* Benefits Bullet Points */}
                <div className="space-y-1.5 mb-6">
                  {scheme.keyBenefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedSchemeForApply(scheme)}
                  className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  Document Checklist
                </button>
                <Link
                  href={scheme.applyUrl}
                  target="_blank"
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-2.5 text-xs font-black text-white hover:from-rose-500 hover:to-amber-400 transition-all shadow-md shadow-rose-600/20"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Document Checklist & Application Guide */}
        {selectedSchemeForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedSchemeForApply(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedSchemeForApply.shortName}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{selectedSchemeForApply.ministry}</p>
                </div>
              </div>

              <div className="space-y-4 my-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">Required Document Checklist</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedSchemeForApply.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <strong className="block font-bold mb-1">💡 VyapaarSathi AI Pro Tip:</strong>
                  Your Udyam Registration Certificate & GST returns can be auto-attached during submission on the official portal!
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedSchemeForApply(null)}
                  className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <Link
                  href={selectedSchemeForApply.applyUrl}
                  target="_blank"
                  className="flex-1 inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-600/20"
                >
                  <span>Proceed to Official Govt Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
