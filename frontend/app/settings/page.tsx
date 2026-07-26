'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar';
import { Settings, Save, ShieldCheck, Building2, Phone, FileCheck, Globe2, KeyRound } from 'lucide-react';
import { LanguageSwitcher } from '../../components/language-switcher';

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('Rajesh Trading Co.');
  const [gstin, setGstin] = useState('27AAAAA0000A1Z5');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Shop #12, APMC Market, Vashi, Navi Mumbai, MS 400703');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vyapaar_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.gstin) setGstin(parsed.gstin);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'vyapaar_user',
      JSON.stringify({
        username: 'merchant_admin',
        businessName,
        gstin,
        phone,
        address,
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <Settings className="h-8 w-8 text-rose-400" />
              <span>Business Settings & Profile</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure MSME business credentials, GST taxpayer defaults, regional localization, and API keys.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Business Profile & GST Settings saved securely!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Section 1: Business Identity */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-amber-400" />
              <span>Business Credentials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Registered Business / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  GSTIN Tax Identification Number
                </label>
                <div className="relative">
                  <FileCheck className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Mobile / Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Business Operating State & Timezone
                </label>
                <input
                  type="text"
                  disabled
                  value="Maharashtra (27) • Asia/Kolkata (IST)"
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Registered Business Address (Appears on Invoices)
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Regional & Language Preferences */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Globe2 className="h-5 w-5 text-teal-400" />
              <span>Language & Regional Settings</span>
            </h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-sm font-bold text-white">Default Interface Language</div>
                <div className="text-xs text-slate-400">Switch between English and Hindi across all views</div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Section 3: API Security Keys */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <KeyRound className="h-5 w-5 text-rose-400" />
              <span>Security & Integration Keys</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Supabase REST API Endpoint
                </label>
                <input
                  type="text"
                  disabled
                  value="https://vyapaarsathi-prod.supabase.co"
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  OpenAI Whisper Audio API Key
                </label>
                <input
                  type="password"
                  disabled
                  value="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 py-3.5 text-base font-extrabold text-white shadow-xl shadow-rose-600/30 hover:from-amber-400 hover:to-pink-500 transition-all"
          >
            <Save className="h-5 w-5" />
            <span>Save All Settings & Profile</span>
          </button>
        </form>
      </main>
    </div>
  );
}
