'use client';

import React, { useState, useEffect, useRef } from 'react';
import { parseInvoiceGrammar, generateWhatsAppSummary, ParsedItem } from '../lib/invoiceParser';
import { reconcileSmsWithInvoices, MatchBreakdown } from '../lib/reconcile';
import { OpenInvoice, getInitialInvoices, saveInvoicesToStorage } from '../lib/seedData';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Share2,
  CheckCircle2,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  Globe,
  RotateCcw,
  Bot,
  User,
  AlertCircle
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  type: 'text' | 'invoice_created' | 'reconciliation_result' | 'ledger_summary';
  text?: string;
  invoice?: OpenInvoice;
  matches?: MatchBreakdown[];
  timestamp: string;
}

interface VyapariChatProps {
  invoices: OpenInvoice[];
  setInvoices: React.Dispatch<React.SetStateAction<OpenInvoice[]>>;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
}

export function VyapariChat({ invoices, setInvoices, lang, setLang }: VyapariChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isHi = lang === 'hi';

  // Feature detect Web Speech API on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Initialize seed welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome',
      sender: 'assistant',
      type: 'text',
      text: isHi
        ? 'राम-राम! 🙏 मैं हूँ आपका व्यापारी (Vyapari) सहायक। आप यहाँ साधारण भाषा में बिल बना सकते हैं (उदा. "2 kg cheeni 90, 1 Parle-G 10, chai 20"), बैंक SMS पेस्ट करके पेमेंट मिला सकते हैं, या पूछ सकते हैं "कौन कितना देय है"।'
        : 'Namaste! 🙏 I am your Vyapari Kirana Assistant. You can create invoices in plain text (e.g. "2 kg cheeni 90, 1 Parle-G 10, chai 20"), paste bank SMS to reconcile payments, or ask "Who owes me".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
  }, [lang]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Speech Recognition toggle
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isHi
          ? 'आपके वेब ब्राउज़र में Web Speech API समर्थन उपलब्ध नहीं है। कृपया लिखकर टाइप करें।'
          : 'Web Speech API is not supported in this browser. Please type your message.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = isHi ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Analyze intent:
    const lowerText = text.toLowerCase();

    // Intent 1: Reconciliation (Bank / UPI SMS string containing credit/debited/ref)
    if (
      lowerText.includes('credited') ||
      lowerText.includes('credit') ||
      lowerText.includes('vpa') ||
      lowerText.includes('upi ref')
    ) {
      const matchResults = reconcileSmsWithInvoices(text, invoices);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        type: 'reconciliation_result',
        matches: matchResults,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    // Intent 2: Ledger Query ("Who owes me", "dues", "kitna baki")
    if (
      lowerText.includes('who owes me') ||
      lowerText.includes('owes') ||
      lowerText.includes('dues') ||
      lowerText.includes('baki') ||
      lowerText.includes('बकाया')
    ) {
      const openOnly = invoices.filter((i) => i.status === 'OPEN');
      const totalOutstanding = openOnly.reduce((acc, curr) => acc + curr.balanceDue, 0);

      const responseText = isHi
        ? `📊 *खाता-बही रिपोर्ट*\nकुल बकाया: ₹${totalOutstanding}\nलंबित ग्राहक: ${openOnly.length}\n` +
          openOnly.map((i) => `• ${i.customerName}: ₹${i.balanceDue} (#${i.id})`).join('\n')
        : `📊 *Ledger Summary*\nTotal Outstanding: ₹${totalOutstanding}\nPending Customers: ${openOnly.length}\n` +
          openOnly.map((i) => `• ${i.customerName}: ₹${i.balanceDue} (#${i.id})`).join('\n');

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        type: 'text',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    // Intent 3: Weekly sales total ("weekly sales", "total sales", "sale")
    if (lowerText.includes('weekly') || lowerText.includes('sales') || lowerText.includes('बिक्री')) {
      const totalSales = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const paidSales = invoices
        .filter((i) => i.status === 'PAID')
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

      const responseText = isHi
        ? `📈 *साप्ताहिक बिक्री कुल:*\nकुल बिक्री: ₹${totalSales}\nप्राप्त भुगतान (Paid): ₹${paidSales}\nकुल बिल: ${invoices.length}`
        : `📈 *Weekly Sales Summary:*\nTotal Sales: ₹${totalSales}\nCollected: ₹${paidSales}\nTotal Invoices: ${invoices.length}`;

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        type: 'text',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    // Intent 4: Invoice creation via Grammar Parser ("2 kg cheeni 90, 1 Parle-G 10, chai 20")
    const parsed = parseInvoiceGrammar(text);

    if (parsed.items.length > 0 && parsed.totalAmount > 0) {
      const newInvoiceId = `INV-${1000 + invoices.length + 1}`;
      const newInvoice: OpenInvoice = {
        id: newInvoiceId,
        customerName: isHi ? 'किराना ग्राहक' : 'Kirana Customer',
        items: parsed.items,
        totalAmount: parsed.totalAmount,
        amountPaid: 0,
        balanceDue: parsed.totalAmount,
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'OPEN',
        upiVpa: 'kirana@upi',
      };

      const updated = [newInvoice, ...invoices];
      setInvoices(updated);
      saveInvoicesToStorage(updated);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        type: 'invoice_created',
        invoice: newInvoice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    // Default Fallback
    const fallbackText = isHi
      ? 'क्षमा करें, मैं समझ नहीं पाया। कृपया बिल बनाने के लिए लिखें: "2 kg cheeni 90, 1 Parle-G 10", या बैंक SMS पेस्ट करें।'
      : 'Could not parse clearly. Try format: "2 kg cheeni 90, 1 Parle-G 10, chai 20" or paste a UPI Bank SMS.';

    setMessages((prev) => [
      ...prev,
      {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        type: 'text',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleShareWhatsApp = (inv: OpenInvoice) => {
    const summaryText = generateWhatsAppSummary(
      {
        id: inv.id,
        customerName: inv.customerName,
        items: inv.items.map((i) => ({
          qty: i.qty,
          unit: (i.unit as any) || 'pc',
          item: i.item,
          price: i.price,
          total: i.total || i.price,
        })),
        totalAmount: inv.totalAmount,
        upiVpa: inv.upiVpa,
      },
      lang
    );
    window.open(`https://wa.me/?text=${encodeURIComponent(summaryText)}`, '_blank');
  };

  const handleConfirmReconcileFromChat = (invoiceId: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, status: 'PAID' as const, balanceDue: 0, amountPaid: inv.totalAmount } : inv
    );
    setInvoices(updated);
    saveInvoicesToStorage(updated);

    setMessages((prev) => [
      ...prev,
      {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        type: 'text',
        text: isHi
          ? `✅ बिल #${invoiceId} सफलतापूर्वक भुगतान किया गया (Marked PAID)!`
          : `✅ Invoice #${invoiceId} marked as PAID via UPI reconciliation!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[650px] max-w-2xl mx-auto rounded-3xl border border-slate-800 bg-[#0B141A] text-slate-100 shadow-2xl overflow-hidden relative">
      {/* WhatsApp Green Top Header */}
      <div className="bg-[#128C7E] px-4 py-3.5 flex items-center justify-between border-b border-emerald-700/50 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-extrabold text-sm shadow-inner">
              <Bot className="h-6 w-6 text-emerald-300" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#128C7E]"></span>
          </div>

          <div>
            <h1 className="text-base font-extrabold text-white leading-tight">
              {isHi ? 'व्यापारी (Vyapari) सहायक' : 'Vyapari Assistant'}
            </h1>
            <p className="text-[11px] text-emerald-100/90 font-medium">
              {isHi ? 'ऑनलाइन • किराना स्मार्ट व्हाट्सएप' : 'Online • Kirana WhatsApp Assistant'}
            </p>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher Button */}
          <button
            onClick={() => setLang(isHi ? 'en' : 'hi')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-900/40 text-white border border-white/20 text-xs font-bold hover:bg-slate-900/60 transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-amber-300" />
            <span>{isHi ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-[#005C4B] text-white rounded-tr-none'
                    : 'bg-[#202C33] text-slate-100 rounded-tl-none border border-slate-700/60'
                }`}
              >
                {/* Standard Text Message */}
                {msg.text && (
                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                )}

                {/* Parsed Invoice Card Message */}
                {msg.type === 'invoice_created' && msg.invoice && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                      <span className="font-extrabold text-emerald-400 font-mono">{msg.invoice.id}</span>
                      <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase">
                        {isHi ? 'नया बिल तैयार' : 'Invoice Created'}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      {msg.invoice.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            • {it.qty} {it.unit || 'pc'} {it.item}
                          </span>
                          <span className="font-bold">₹{it.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-700/80 font-bold">
                      <span>{isHi ? 'कुल योग:' : 'Total Amount:'}</span>
                      <span className="text-base text-emerald-400">₹{msg.invoice.totalAmount}</span>
                    </div>

                    <button
                      onClick={() => handleShareWhatsApp(msg.invoice!)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{isHi ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</span>
                    </button>
                  </div>
                )}

                {/* Reconciliation Match Result Card Message */}
                {msg.type === 'reconciliation_result' && msg.matches && (
                  <div className="space-y-3">
                    <div className="font-extrabold text-white text-xs border-b border-slate-700/80 pb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>{isHi ? 'UPI भुगतान मिलान परिणाम:' : 'Fuzzy UPI Match Results:'}</span>
                    </div>

                    {msg.matches.slice(0, 2).map((m) => {
                      const isAuto = m.band === 'AUTO_MATCH';
                      const isConfirm = m.band === 'ASK_TO_CONFIRM';

                      return (
                        <div
                          key={m.invoice.id}
                          className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-emerald-400">{m.invoice.id}</span>
                            <span className="font-extrabold text-white">{Math.round(m.score * 100)}% Match</span>
                          </div>

                          <div className="text-xs text-slate-300">
                            {m.invoice.customerName} (Due: ₹{m.invoice.balanceDue})
                          </div>

                          <div className="text-[10px] text-slate-400 font-mono">
                            Amount(50%): {m.amountExact * 100}% | Name(30%): {Math.round(m.nameScore * 100)}% | Keyword(20%): {Math.round(m.keywordScore * 100)}%
                          </div>

                          {m.invoice.status !== 'PAID' && (
                            <button
                              onClick={() => handleConfirmReconcileFromChat(m.invoice.id)}
                              className={`w-full py-1.5 rounded-lg text-xs font-bold text-slate-950 flex items-center justify-center space-x-1 ${
                                isAuto ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-amber-400 hover:bg-amber-300'
                              }`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{isAuto ? 'Auto Confirm Paid' : 'Confirm & Mark Paid'}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Preset Quick Chips */}
      <div className="bg-[#111B21] px-3 py-2 border-t border-slate-800 flex overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => handleSendMessage('2 kg cheeni 90, 1 Parle-G 10, chai 20')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-[#202C33] hover:bg-slate-700 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center space-x-1"
        >
          <span>🧾 2 kg cheeni 90, 1 Parle-G 10</span>
        </button>
        <button
          onClick={() =>
            handleSendMessage(
              'Rs.200.00 credited to a/c XX1234 on 30-07-26 from VPA parleg@okaxis (Ramesh Kumar) UPI Ref 123456789012'
            )
          }
          className="whitespace-nowrap px-3 py-1 rounded-full bg-[#202C33] hover:bg-slate-700 text-[11px] font-semibold text-amber-300 border border-amber-500/30 flex items-center space-x-1"
        >
          <span>📱 Paste UPI SMS</span>
        </button>
        <button
          onClick={() => handleSendMessage('Who owes me money?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-[#202C33] hover:bg-slate-700 text-[11px] font-semibold text-sky-300 border border-sky-500/30 flex items-center space-x-1"
        >
          <span>💰 Who owes me?</span>
        </button>
        <button
          onClick={() => handleSendMessage('Weekly sales total')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-[#202C33] hover:bg-slate-700 text-[11px] font-semibold text-purple-300 border border-purple-500/30 flex items-center space-x-1"
        >
          <span>📊 Weekly sales</span>
        </button>
      </div>

      {/* Speech & Input Control Bar */}
      <div className="bg-[#202C33] p-3 border-t border-slate-800 flex items-center space-x-2">
        {/* Voice Input Mic Button */}
        <button
          onClick={toggleSpeechRecognition}
          title={speechSupported ? (isListening ? 'Listening...' : 'Hold / Click to Voice Input') : 'Web Speech API unavailable'}
          className={`p-3 rounded-full transition-all shadow-md ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : speechSupported
              ? 'bg-slate-700 text-emerald-400 hover:bg-slate-600'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Text Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            isListening
              ? isHi
                ? 'सुन रहा हूँ... बोलिए...'
                : 'Listening... speak now...'
              : isHi
              ? 'संदेश लिखें (उदा. 2 kg cheeni 90, chai 20)...'
              : 'Type invoice (e.g. 2 kg cheeni 90, chai 20)...'
          }
          className="flex-1 bg-[#2A3942] border border-slate-700/80 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          className="p-3 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Send className="h-5 w-5 fill-current" />
        </button>
      </div>
    </div>
  );
}
