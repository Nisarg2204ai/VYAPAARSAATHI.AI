'use client';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  return <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><Languages size={18} aria-hidden="true" /><span className="sr-only">{t('language')}</span>
    <select aria-label={t('language')} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5" value={i18n.language} onChange={(event) => { void i18n.changeLanguage(event.target.value); window.localStorage.setItem('vyapaarsathi-language', event.target.value); }}>
      <option value="en">{t('english')}</option><option value="hi">{t('hindi')}</option>
    </select>
  </label>;
}
