'use client';

import React from 'react';
import { Navbar } from '../../components/navbar';
import { Dashboard } from '../../components/dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="py-6">
        <Dashboard />
      </main>
    </div>
  );
}
