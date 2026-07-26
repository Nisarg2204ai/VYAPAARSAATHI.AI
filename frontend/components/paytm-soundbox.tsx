'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, QrCode, Play, Sparkles, CheckCircle2, ShieldCheck, Smartphone, Zap, IndianRupee, ArrowDownRight } from 'lucide-react';

interface PaytmSoundboxProps {
  onPaymentReceived?: (amount: number, payer: string) => void;
}

export function PaytmSoundbox({ onPaymentReceived }: PaytmSoundboxProps) {
  const [amount, setAmount] = useState<string>('500');
  const [payerName, setPayerName] = useState<string>('Rahul Sharma');
  const [language, setLanguage] = useState<'hi' | 'en' | 'gu' | 'mr'>('hi');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAnnouncing, setIsAnnouncing] = useState<boolean>(false);
  const [lastPayment, setLastPayment] = useState<{ amount: number; payer: string; time: string } | null>(null);
  const [qrVpa, setQrVpa] = useState<string>('vyapaar.msme@upi');

  // Speak voice notification
  const speakAnnouncement = (payAmount: number, payLanguage: string) => {
    if (isMuted) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current sound

      let text = `VyapaarSathi Pay par ${payAmount} rupaye praapt hue. Dhanyawad!`;
      let langCode = 'hi-IN';

      if (payLanguage === 'en') {
        text = `Received ${payAmount} Rupees on VyapaarSathi Pay. Thank you!`;
        langCode = 'en-IN';
      } else if (payLanguage === 'gu') {
        text = `VyapaarSathi Pay par ${payAmount} rupiya malya. Aabhar!`;
        langCode = 'gu-IN';
      } else if (payLanguage === 'mr') {
        text = `VyapaarSathi Pay var ${payAmount} rupaye praapt dhale. Dhanyawaad!`;
        langCode = 'mr-IN';
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      // Try finding Indian English or Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.includes(langCode) || v.lang.includes('hi') || v.lang.includes('IN')
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsAnnouncing(true);
      utterance.onend = () => setIsAnnouncing(false);
      utterance.onerror = () => setIsAnnouncing(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSimulatePayment = () => {
    const numericAmount = parseFloat(amount) || 500;
    const currentPayer = payerName.trim() || 'UPI Customer';
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setLastPayment({ amount: numericAmount, payer: currentPayer, time: now });
    speakAnnouncement(numericAmount, language);

    if (onPaymentReceived) {
      onPaymentReceived(numericAmount, currentPayer);
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Volume2 className={`h-6 w-6 ${isAnnouncing ? 'animate-bounce text-yellow-300' : ''}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-black tracking-tight text-white">VyapaarSathi <span className="text-cyan-400">Smart Soundbox</span></h3>
              <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-cyan-400 border border-cyan-500/20">
                PAYTM & PHONEPE READY
              </span>
            </div>
            <p className="text-xs text-slate-400">Instant Multi-lingual Voice Payment Alerts • MSME Verified Terminal</p>
          </div>
        </div>

        {/* Audio Mute & Language Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
            {(['hi', 'en', 'gu', 'mr'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                  language === lang
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'hi' ? 'हिंदी' : lang === 'en' ? 'ENG' : lang === 'gu' ? 'ગુજ' : 'मरा'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
            title={isMuted ? 'Unmute Soundbox' : 'Mute Soundbox'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: QR Code + Soundbox Hardware Simulator */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Dynamic UPI QR Terminal */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center relative group">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>NPCI / UPI 2.0 Dynamic Merchant QR</span>
          </div>

          {/* QR Code Container */}
          <div className="relative p-4 rounded-2xl bg-white shadow-xl shadow-cyan-950/40 my-2">
            <div className="h-44 w-44 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
              {/* Simulated QR Pattern */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white rounded">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i % 2 === 0 || i % 5 === 0) ? 'bg-slate-950' : 'bg-cyan-600'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">
                  UPI
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-300 mt-2">VPA: <span className="text-cyan-400">{qrVpa}</span></p>
          <p className="text-[11px] text-slate-400 mt-0.5">Accepts Paytm, PhonePe, Google Pay, BHIM & All UPI Apps</p>
        </div>

        {/* Right: Soundbox Speaker & Live Simulator Controls */}
        <div className="flex flex-col justify-between space-y-4">
          
          {/* Soundbox Speaker Visual Box */}
          <div className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
            isAnnouncing 
              ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20' 
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${isAnnouncing ? 'bg-yellow-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  {isAnnouncing ? '🔊 Soundbox Announcing...' : 'Standby • Soundbox Online'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                4G SIM Connected
              </span>
            </div>

            {/* Last Announcement Display */}
            {lastPayment ? (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Last Received ({lastPayment.time})</p>
                  <p className="text-base font-extrabold text-emerald-400 flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" /> {lastPayment.amount.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-300 font-normal">from {lastPayment.payer}</span>
                  </p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-400 animate-pulse" />
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400 italic">No payments received yet. Click simulate below to test audio alert!</p>
            )}
          </div>

          {/* Test Controls */}
          <div className="space-y-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Simulate Customer UPI Payment
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-bold"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Payer Name</label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Customer Name"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {[100, 500, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="flex-1 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleSimulatePayment}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] transition-all mt-2"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>TEST SOUNDBOX VOICE ALERT</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
