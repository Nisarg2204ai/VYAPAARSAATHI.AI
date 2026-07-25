import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '../components/i18n-provider';

export const metadata: Metadata = {
  title: 'VyapaarSathi AI — Bilingual Business Operations Suite',
  description: 'AI-powered GST invoicing, UPI reconciliation, compliance reminders & voice capture built on Codex.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#090D16] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-emerald-500 selection:text-white">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
