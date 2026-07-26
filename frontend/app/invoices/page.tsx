'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/navbar';
import { InvoiceForm } from '../../components/invoice-form';
import { Mic, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export default function InvoicesPage() {
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedFacts, setTranscribedFacts] = useState<{ merchant?: string; amount?: number } | null>(null);

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setVoiceText('Listening in Hindi / Hinglish...');
    setTimeout(() => {
      setIsRecording(false);
      setVoiceText('Ram Kirana Store ko ₹14,500 ka bill 18% GST ke saath banao');
      setTranscribedFacts({
        merchant: 'Ram Kirana Store',
        amount: 14500,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <FileText className="h-8 w-8 text-amber-400" />
              <span>Voice & Manual GST Invoice Suite</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create GST 18% compliant invoices using manual entry or voice notes powered by OpenAI Whisper.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={simulateVoiceRecording}
              disabled={isRecording}
              className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
                isRecording
                  ? 'bg-rose-600 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-rose-600/20'
              }`}
            >
              <Mic className="h-4 w-4" />
              <span>{isRecording ? 'Recording Speech...' : 'Record Voice Note (Hindi/EN)'}</span>
            </button>
          </div>
        </div>

        {/* Voice Note Result Banner */}
        {voiceText && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-4">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-300">Whisper Voice AI Transcription</h3>
              <p className="text-xs text-slate-200 mt-1 font-mono">&quot;{voiceText}&quot;</p>

              {transcribedFacts && (
                <div className="mt-3 flex items-center space-x-4 text-xs font-semibold text-emerald-400">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Extracted Merchant: {transcribedFacts.merchant}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Extracted Amount: ₹{transcribedFacts.amount}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice Creation Form */}
        <InvoiceForm />
      </main>
    </div>
  );
}
