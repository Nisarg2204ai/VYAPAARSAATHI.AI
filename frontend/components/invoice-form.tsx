'use client';
import { FormEvent, useState } from 'react';
import { Minus, Plus, ReceiptText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

type Line = { description: string; quantity: number; unitPrice: number };
const today = new Date().toISOString().slice(0, 10);

export function InvoiceForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState(''); const [invoiceDate, setInvoiceDate] = useState(today); const [dueDate, setDueDate] = useState(''); const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Line[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const updateLine = (index: number, key: keyof Line, value: string) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, [key]: key === 'description' ? value : Number(value) } : line));
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      await api.createInvoice({ customerName, invoiceDate, dueDate: dueDate || undefined, notes: notes || undefined, lineItems: lines.map((line) => ({ description: line.description, quantity: line.quantity, unitPricePaise: Math.round(line.unitPrice * 100) })) });
      setCustomerName(''); setDueDate(''); setNotes(''); setLines([{ description: '', quantity: 1, unitPrice: 0 }]);
      await onCreated(); setMessage('Invoice created.');
    } catch { setMessage(t('error')); } finally { setBusy(false); }
  }
  return <section className="card" aria-labelledby="invoice-heading"><div className="mb-5 flex items-center gap-2"><ReceiptText className="text-brand-orange" aria-hidden="true" /><h2 id="invoice-heading" className="text-lg font-bold">{t('createInvoice')}</h2></div>
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">{t('customer')}<input required className="field" value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label><label className="text-sm font-medium">{t('invoiceDate')}<input required type="date" className="field" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /></label><label className="text-sm font-medium">{t('dueDate')}<input min={invoiceDate} type="date" className="field" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label className="text-sm font-medium">{t('notes')}<input className="field" maxLength={2000} value={notes} onChange={(event) => setNotes(event.target.value)} /></label></div>
      <fieldset><legend className="text-sm font-semibold">Items</legend><div className="mt-2 space-y-2">{lines.map((line, index) => <div key={index} className="grid grid-cols-[1fr_72px_110px_36px] gap-2"><input required aria-label={`${t('description')} ${index + 1}`} placeholder={t('description')} className="field" value={line.description} onChange={(event) => updateLine(index, 'description', event.target.value)} /><input required aria-label={`${t('quantity')} ${index + 1}`} className="field" min="0.01" step="0.01" type="number" value={line.quantity} onChange={(event) => updateLine(index, 'quantity', event.target.value)} /><input required aria-label={`${t('unitPrice')} ${index + 1}`} className="field" min="0.01" step="0.01" type="number" value={line.unitPrice || ''} onChange={(event) => updateLine(index, 'unitPrice', event.target.value)} /><button type="button" className="mt-1 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" disabled={lines.length === 1} aria-label={`Remove item ${index + 1}`} onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}><Minus size={18} aria-hidden="true" /></button></div>)}</div>
        <button type="button" className="button-secondary mt-3 text-sm" onClick={() => setLines((current) => [...current, { description: '', quantity: 1, unitPrice: 0 }])}><Plus size={16} aria-hidden="true" />{t('addItem')}</button></fieldset>
      <div className="flex items-center gap-3"><button disabled={busy} className="button-primary" type="submit">{t('create')}</button><p aria-live="polite" className="text-sm text-slate-600">{message}</p></div>
    </form>
  </section>;
}
