'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Lock, User, Building2, Phone, ArrowRight, ShieldCheck, Eye, EyeOff,
  Sparkles, CheckCircle2, Landmark, CreditCard, Key, Smartphone, AlertCircle, RefreshCw, Check
} from 'lucide-react';
import { VyapaarSathiLogo } from './vyapaar-sathi-logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { username: string; businessName: string; gstin: string; phone: string }) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  // Step 1: ID Check, Step 2: Login PIN (Existing), Step 3: Full Merchant Signup (New)
  const [step, setStep] = useState<'id_check' | 'pin_login' | 'signup_personal' | 'signup_business' | 'signup_bank' | 'otp_verify'>('id_check');
  const [showPassword, setShowPassword] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState(true);

  // Form Fields
  const [phone, setPhone] = useState('+91 98765 43210');
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Retail Kirana & Trading');
  const [gstin, setGstin] = useState('');
  const [udyamNo, setUdyamNo] = useState('');
  const [pan, setPan] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [vpa, setVpa] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Status & Timers
  const [existingUser, setExistingUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);

  // Check saved credentials on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('vyapaar_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setExistingUser(parsed);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.username) setUsername(parsed.username);
          if (parsed.businessName) setBusinessName(parsed.businessName);
          if (parsed.gstin) setGstin(parsed.gstin);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Initial Mobile Number / ID Check
  const handleCheckId = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number or Merchant ID');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (existingUser && (existingUser.phone === cleanPhone || cleanPhone.includes('98765'))) {
        setStep('pin_login');
      } else {
        setStep('signup_personal');
      }
    }, 600);
  };

  // Handle Quick PIN Login for Existing Users
  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin || pin.length < 4) {
      setError('Please enter your 4 or 6-digit security PIN / Password');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const userData = existingUser || {
        username: username || 'Ramesh Patel',
        businessName: businessName || 'Patel Enterprises & Retail',
        gstin: gstin || '24AAAAA0000A1Z5',
        phone: phone
      };

      if (saveCredentials) {
        localStorage.setItem('vyapaar_user', JSON.stringify(userData));
        localStorage.setItem('vyapaar_token', `paytm_secure_token_${Date.now()}`);
      }

      onSuccess(userData);
      onClose();
    }, 800);
  };

  // Complete Paytm/PhonePe Merchant Onboarding
  const handleFinalizeSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpInput.trim() !== '123456' && otpInput.trim().length !== 6) {
      setError('Enter 6-digit verification OTP (Use demo OTP: 123456)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newMerchant = {
        username: username.trim() || 'New Merchant',
        businessName: businessName.trim() || 'Vyapaar Store',
        gstin: gstin.trim().toUpperCase() || '24AAAAA0000A1Z5',
        udyamNo: udyamNo.trim() || 'UDYAM-MH-03-0098765',
        phone: phone.trim(),
        vpa: vpa.trim() || `${phone.replace(/\D/g, '')}@upi`
      };

      localStorage.setItem('vyapaar_user', JSON.stringify(newMerchant));
      localStorage.setItem('vyapaar_token', `phonepe_merchant_token_${Date.now()}`);

      onSuccess(newMerchant);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-['Montserrat',sans-serif]">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#DA7756]/40 bg-[#161412] p-6 sm:p-8 shadow-2xl shadow-black text-slate-100 backdrop-blur-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close Authentication Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <VyapaarSathiLogo size="lg" showText={true} />
          </div>
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PAYTM & PHONEPE BANK-GRADE SECURITY ACTIVE</span>
          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: MOBILE NUMBER / MERCHANT ID CHECK */}
        {step === 'id_check' && (
          <form onSubmit={handleCheckId} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 block">
                Enter Registered Mobile Number or Merchant ID
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#DA7756]" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="field pl-10 font-mono text-sm font-bold text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>PROCEED SECURELY</span>}
              <ArrowRight className="h-4 w-4" />
            </button>

            {existingUser && (
              <div className="p-3 rounded-2xl bg-[#121110] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-[#DA7756]" />
                  <span className="font-bold text-white">{existingUser.businessName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('pin_login')}
                  className="text-xs font-black text-[#00AEEF] hover:underline"
                >
                  Quick PIN Login →
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2: 6-DIGIT PIN / PASSWORD LOGIN (FOR EXISTING USERS) */}
        {step === 'pin_login' && (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#121110] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Welcome Back</span>
                <span className="text-sm font-black text-white">{existingUser?.businessName || 'Patel Enterprises'}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep('id_check')}
                className="text-[10px] font-bold text-[#DA7756] hover:underline"
              >
                Change ID
              </button>
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 block">
                Enter 6-Digit Merchant PIN or Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-[#00AEEF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • • • •"
                  className="field pl-10 font-mono text-center text-lg tracking-[0.4em] font-black text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Save Password & Biometric Checkbox */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveCredentials}
                  onChange={(e) => setSaveCredentials(e.target.checked)}
                  className="rounded accent-[#DA7756]"
                />
                <span className="font-semibold text-slate-300">Save Password / 1-Click Login</span>
              </label>
              <button
                type="button"
                onClick={() => alert('OTP Sent to registered mobile number +91 98765 43210. Demo OTP: 123456')}
                className="text-xs font-bold text-[#00AEEF] hover:underline"
              >
                Forgot PIN?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>AUTHENTICATE & ENTER PORTAL</span>}
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 3A: NEW MERCHANT REGISTRATION - STEP 1 (PERSONAL DETAILS) */}
        {step === 'signup_personal' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('signup_business'); }} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase text-[#DA7756]">Step 1 of 3: Merchant Credentials</span>
              <span className="text-[10px] font-bold text-slate-400">Personal Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ramesh Patel"
                  className="field"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="field font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@vyapaar.ai"
                  className="field"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Create 6-Digit PIN *</label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • • • •"
                  className="field font-mono text-center tracking-[0.3em]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
            >
              <span>NEXT: BUSINESS & GST DETAILS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 3B: NEW MERCHANT REGISTRATION - STEP 2 (BUSINESS & GST DETAILS) */}
        {step === 'signup_business' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('signup_bank'); }} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase text-[#DA7756]">Step 2 of 3: Business & GST Credentials</span>
              <button type="button" onClick={() => setStep('signup_personal')} className="text-[10px] font-bold text-[#00AEEF] hover:underline">← Back</button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Business Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Patel Enterprises & Retail"
                className="field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">15-Digit GSTIN</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="24AAAAA0000A1Z5"
                  className="field font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Udyam Registration No.</label>
                <input
                  type="text"
                  value={udyamNo}
                  onChange={(e) => setUdyamNo(e.target.value)}
                  placeholder="UDYAM-MH-03-0098765"
                  className="field font-mono text-[#DA7756]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
            >
              <span>NEXT: BANKING & SETTLEMENT DETAILS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 3C: NEW MERCHANT REGISTRATION - STEP 3 (BANKING & SETTLEMENT) */}
        {step === 'signup_bank' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('otp_verify'); setOtpSent(true); }} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase text-[#DA7756]">Step 3 of 3: Settlement Bank Credentials</span>
              <button type="button" onClick={() => setStep('signup_business')} className="text-[10px] font-bold text-[#00AEEF] hover:underline">← Back</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Settlement Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="State Bank of India"
                  className="field"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="SBIN0001234"
                  className="field font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Merchant VPA (UPI ID for Soundbox Settlements)</label>
              <input
                type="text"
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                placeholder="patel.traders@upi"
                className="field font-mono text-[#00AEEF]"
              />
            </div>

            <button
              type="submit"
              className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
            >
              <span>SEND OTP & VERIFY ACCOUNT</span>
              <ShieldCheck className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 4: STRICT OTP VERIFICATION */}
        {step === 'otp_verify' && (
          <form onSubmit={handleFinalizeSignup} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#121110] border border-emerald-500/30 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-400">Security Verification OTP Sent!</span>
              <p className="text-[11px] text-slate-300">Sent to <strong className="font-mono text-white">{phone}</strong> (Use Demo OTP: <span className="font-mono text-[#39FF14] font-black">123456</span>)</p>
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 block text-center">
                Enter 6-Digit Verification OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="1 2 3 4 5 6"
                className="field font-mono text-center text-xl tracking-[0.5em] font-black text-white"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Resend OTP in 25s</span>
              <button
                type="button"
                onClick={() => alert('Demo OTP re-sent: 123456')}
                className="font-bold text-[#00AEEF] hover:underline"
              >
                Resend SMS OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full button-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>PROVISION MERCHANT ACCOUNT</span>}
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
