'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, ShieldCheck, Award, Building2, QrCode, Volume2, 
  CheckCircle2, FileText, Download, Key, Lock, RefreshCw, Sparkles, Save
} from 'lucide-react';
import { Navbar } from '../../components/navbar';
import { VyapaarSathiLogo } from '../../components/vyapaar-sathi-logo';

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: 'Ramesh Patel',
    businessName: 'Patel Enterprises & Retail',
    gstin: '24AAAAA0000A1Z5',
    udyamNo: 'UDYAM-MH-03-0098765',
    pan: 'ABCDE1234F',
    phone: '+91 98765 43210',
    vpa: 'patel.traders@upi',
    soundboxLang: 'hi'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vyapaar_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('vyapaar_user', JSON.stringify(user));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#F5F2EC] font-['Montserrat',sans-serif]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Header Banner */}
        <section className="division-box border border-[#DA7756]/30 bg-gradient-to-r from-[#1A1816] via-[#121110] to-[#1A1816]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-[#DA7756] to-[#D97706] flex items-center justify-center text-white font-black text-2xl shadow-xl border border-[#DA7756]/40">
                {user.businessName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black text-white">{user.businessName}</h1>
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-3 w-3" />
                    <span>UDYAM VERIFIED</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Proprietor: <strong className="text-[#DA7756]">{user.username}</strong> • Phone: <span className="font-mono text-white">{user.phone}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="button-primary text-xs flex items-center space-x-2 py-3 px-5"
            >
              <Award className="h-4 w-4" />
              <span>VIEW MSME CERTIFICATE</span>
            </button>
          </div>
        </section>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Credentials & Business Data (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-[#DA7756]/30 bg-[#1A1816] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#DA7756]" />
                <span>Enterprise Credentials & Tax Data</span>
              </h2>
              {isSaved && (
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Proprietor Name</label>
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    className="field"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Business Name</label>
                  <input
                    type="text"
                    value={user.businessName}
                    onChange={(e) => setUser({ ...user, businessName: e.target.value })}
                    className="field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">GSTIN Number</label>
                  <input
                    type="text"
                    value={user.gstin}
                    onChange={(e) => setUser({ ...user, gstin: e.target.value })}
                    className="field font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Udyam Registration No.</label>
                  <input
                    type="text"
                    value={user.udyamNo}
                    onChange={(e) => setUser({ ...user, udyamNo: e.target.value })}
                    className="field font-mono text-[#DA7756]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">PAN Number</label>
                  <input
                    type="text"
                    value={user.pan}
                    onChange={(e) => setUser({ ...user, pan: e.target.value })}
                    className="field font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase text-slate-300 mb-1 block">Merchant VPA (UPI ID)</label>
                  <input
                    type="text"
                    value={user.vpa}
                    onChange={(e) => setUser({ ...user, vpa: e.target.value })}
                    className="field font-mono text-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>SAVE ENTERPRISE PROFILE</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Soundbox Hardware & Supabase Auth (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Soundbox Hardware Settings */}
            <div className="p-6 rounded-3xl bg-[#1A1816] border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-base font-black text-white">Soundbox Hardware Preferences</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  4G SIM ONLINE
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Default Announcement Voice Language</label>
                  <select
                    value={user.soundboxLang}
                    onChange={(e) => setUser({ ...user, soundboxLang: e.target.value })}
                    className="field"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English (India)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-[#121110] border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speaker Output:</span>
                    <span className="font-bold text-white">85 dB Dual Speakers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Backup:</span>
                    <span className="font-bold text-emerald-400">24-Hour Battery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase Security Status */}
            <div className="p-6 rounded-3xl bg-[#1A1816] border border-emerald-500/30 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Lock className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Security & Encryption</h3>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Supabase JWT Encryption:</span>
                  <span className="font-mono text-emerald-400 font-bold">256-Bit Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cloud Ledger Sync:</span>
                  <span className="font-mono text-white font-bold">Real-time</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal: Printable Official MSME Certificate Preview */}
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-2xl rounded-3xl border border-[#DA7756]/40 bg-[#1A1816] p-8 shadow-2xl relative text-center space-y-6">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>

              <div className="border-4 border-[#DA7756]/40 p-6 rounded-2xl bg-[#121110] relative">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <VyapaarSathiLogo size="sm" showText={true} />
                  <span className="text-[10px] font-mono font-black text-[#DA7756] bg-[#DA7756]/15 px-3 py-1 rounded-full border border-[#DA7756]/30">
                    GOVT COMPLIANT VERIFIED
                  </span>
                </div>

                <div className="my-6 space-y-2">
                  <h3 className="text-xl font-black text-white tracking-widest uppercase">MSME VITALITY CERTIFICATE</h3>
                  <p className="text-xs text-slate-300">This certifies that the enterprise below is officially registered & compliant.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left text-xs bg-[#1A1816] p-4 rounded-xl border border-slate-800 my-4 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Enterprise Name</span>
                    <span className="font-black text-white">{user.businessName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Proprietor Name</span>
                    <span className="font-black text-[#DA7756]">{user.username}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Udyam Reg. Number</span>
                    <span className="font-black text-emerald-400">{user.udyamNo}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">GSTIN</span>
                    <span className="font-black text-cyan-400">{user.gstin}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Issued via VyapaarSathi AI Operations Engine</span>
                  <span className="font-bold text-emerald-400">Verified Seal Active ✓</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="flex-1 button-secondary text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => { window.print(); }}
                  className="flex-1 button-primary text-xs flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>PRINT / DOWNLOAD CERTIFICATE</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
