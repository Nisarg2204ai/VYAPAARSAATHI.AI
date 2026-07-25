'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleAlert, IndianRupee, Landmark, ReceiptText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, type Invoice, type Transaction } from '../lib/api';
import { LanguageSwitcher } from './language-switcher';
import { InvoiceForm } from './invoice-form';
import { ReconciliationPanel } from './reconciliation-panel';

const money = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
function Metric({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof ReceiptText; color: string }) { return <div className="card"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-600">{label}</p><Icon className={color} aria-hidden="true" /></div><p className="mt-3 text-2xl font-bold">{value}</p></div>; }

export function Dashboard() {
  const { t } = useTranslation(); const [invoices, setInvoices] = useState<Invoice[]>([]); const [transactions, setTransactions] = useState<Transaction[]>([]); const [state, setState] = useState<'loading' | 'ready' | 'auth' | 'error'>('loading');
  const refresh = useCallback(async () => { try { const [nextInvoices, nextTransactions] = await Promise.all([api.invoices(), api.transactions()]); setInvoices(nextInvoices); setTransactions(nextTransactions); setState('ready'); } catch (error) { setState(error instanceof Error && error.message === 'AUTH_REQUIRED' ? 'auth' : 'error'); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const metrics = useMemo(() => ({ invoiced: invoices.reduce((sum, invoice) => sum + invoice.total_paise, 0), collected: invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.total_paise, 0), review: transactions.filter((transaction) => transaction.reconciliation_status === 'review').length }), [invoices, transactions]);
  return <main className="mx-auto max-w-7xl p-4 sm:p-6"><header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-brand-green">{t('appName')}</p><h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1></div><LanguageSwitcher /></header>
    {state === 'loading' && <p role="status" className="card">{t('loading')}</p>}{state === 'auth' && <p role="alert" className="card border-brand-orange">{t('signedInRequired')}</p>}{state === 'error' && <p role="alert" className="card border-red-300">{t('error')}</p>}
    {state === 'ready' && <><section aria-label="Business metrics" className="grid gap-4 sm:grid-cols-3"><Metric label={t('totalInvoiced')} value={money(metrics.invoiced)} icon={ReceiptText} color="text-brand-green" /><Metric label={t('collected')} value={money(metrics.collected)} icon={Landmark} color="text-brand-blue" /><Metric label={t('needsReview')} value={String(metrics.review)} icon={CircleAlert} color="text-brand-orange" /></section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2"><InvoiceForm onCreated={refresh} /><ReconciliationPanel onUpdated={refresh} /></section>
      <section className="card mt-6" aria-labelledby="transactions-heading"><h2 id="transactions-heading" className="mb-4 text-lg font-bold">{t('recentTransactions')}</h2><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b text-slate-600"><tr><th className="p-2">{t('transactionId')}</th><th className="p-2">{t('amount')}</th><th className="p-2">{t('status')}</th><th className="p-2">Date</th></tr></thead><tbody>{transactions.length ? transactions.map((transaction) => <tr key={transaction.id} className="border-b last:border-0"><td className="p-2 font-mono text-xs">{transaction.external_transaction_id ?? '—'}</td><td className="p-2 font-medium"><IndianRupee className="mr-1 inline size-3" aria-hidden="true" />{money(transaction.amount_paise)}</td><td className="p-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{transaction.reconciliation_status}</span></td><td className="p-2">{new Date(transaction.transaction_at).toLocaleDateString()}</td></tr>) : <tr><td colSpan={4} className="p-6 text-center text-slate-500">{t('noData')}</td></tr>}</tbody></table></div></section>
    </>}</main>;
}
