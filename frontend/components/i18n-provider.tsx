'use client';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../lib/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyLanguage = (language: string) => { document.documentElement.lang = language; };
    const saved = window.localStorage.getItem('vyapaarsathi-language');
    if (saved === 'en' || saved === 'hi') void i18n.changeLanguage(saved);
    applyLanguage(i18n.language);
    i18n.on('languageChanged', applyLanguage);
    return () => { i18n.off('languageChanged', applyLanguage); };
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
