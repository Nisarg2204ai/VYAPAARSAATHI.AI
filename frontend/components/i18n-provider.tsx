'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../lib/i18n';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          containerId: string
        ) => unknown;
      };
    };
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedLang = localStorage.getItem('vyapaarsathi-language') || 'en';
    void i18n.changeLanguage(savedLang);
    document.documentElement.lang = savedLang;

    // Initialize Google Translate Cookie if language selected
    if (savedLang !== 'en') {
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${savedLang}; path=/;`;
      document.cookie = `googtrans=/en/${savedLang}; domain=.${domain}; path=/;`;
    }

    // Google Translate script callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,gu,mr,bn,ta,te,kn,ml,pa,or,as',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div id="google_translate_element" style={{ display: 'none' }} className="hidden" />
      {children}
    </I18nextProvider>
  );
}

