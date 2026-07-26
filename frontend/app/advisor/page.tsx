'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { CfoAiAdvisor } from '../../components/cfo-ai-advisor';
import { GoldRupeeRain } from '../../components/gold-rupee-rain';

export default function AdvisorPage() {
  return (
    <div className="min-h-screen bg-[#030914] text-slate-100 font-['Montserrat',sans-serif]">
      <GoldRupeeRain />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CfoAiAdvisor />
      </main>
    </div>
  );
}
