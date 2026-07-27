'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { INDIAN_LANGUAGES } from '../lib/i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = INDIAN_LANGUAGES.find(l => l.code === i18n.language) || INDIAN_LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    void i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vyapaarsathi-language', code);

      const domain = window.location.hostname;
      if (code === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
        document.cookie = 'googtrans=/en/en; path=/;';
      } else {
        document.cookie = `googtrans=/en/${code}; path=/;`;
        document.cookie = `googtrans=/en/${code}; domain=.${domain}; path=/;`;
      }

      // Trigger Google Translate live update if combo exists, else reload for cookie application
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectElem) {
        selectElem.value = code;
        selectElem.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="relative inline-block text-left font-['Montserrat',sans-serif]">
      <div className="flex items-center space-x-1.5 bg-[#1A1816] p-1 rounded-2xl border border-[#DA7756]/30 shadow-md">
        <div className="flex items-center space-x-1 px-2.5 py-1 text-xs font-extrabold text-[#DA7756]">
          <Globe className="h-3.5 w-3.5" />
          <span>{currentLang.flag}</span>
        </div>
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="rounded-xl bg-[#121110] border border-[#DA7756]/20 px-3 py-1 text-xs font-bold text-[#F5F2EC] focus:border-[#DA7756] focus:outline-none cursor-pointer"
        >
          {INDIAN_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#1A1816] text-[#F5F2EC] py-1">
              {lang.flag} {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

