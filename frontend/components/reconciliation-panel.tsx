'use client';
import { ChangeEvent, useState } from 'react';
import { FileUp, WandSparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export function ReconciliationPanel({ onUpdated }: { onUpdated: () => Promise<void> }) {
  const { t } = useTranslation(); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null);
  async function upload() { if (!file) return; setBusy(true); setMessage(''); try { const result = await api.uploadCsv(file); await onUpdated(); setMessage(t('importSuccess', { count: result.imported })); } catch { setMessage(t('error')); } finally { setBusy(false); } }
  async function reconcile() { setBusy(true); setMessage(''); try { const result = await api.reconcile(); await onUpdated(); setMessage(t('reconcileSuccess', { count: result.matched })); } catch { setMessage(t('error')); } finally { setBusy(false); } }
  return <section className="card" aria-labelledby="reconciliation-heading"><div className="mb-4 flex items-center gap-2"><WandSparkles className="text-brand-blue" aria-hidden="true" /><h2 id="reconciliation-heading" className="text-lg font-bold">{t('reconciliation')}</h2></div>
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><label className="text-sm font-medium" htmlFor="upi-csv">{t('chooseFile')}</label><input id="upi-csv" className="mt-2 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={chooseFile} /><p className="mt-1 text-xs text-slate-500">{t('csvHelp')}</p><div className="mt-4 flex flex-wrap gap-3"><button disabled={busy || !file} onClick={upload} className="button-secondary" type="button"><FileUp size={17} aria-hidden="true" />{t('uploadCsv')}</button><button disabled={busy} onClick={reconcile} className="button-primary" type="button"><WandSparkles size={17} aria-hidden="true" />{t('runReconciliation')}</button></div></div>
    <p className="mt-3 text-sm text-slate-600" aria-live="polite">{message}</p>
  </section>;
}
