import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '../components/i18n-provider';
import { DeepFlowBackground } from '../components/deepflow-background';

export const metadata: Metadata = {
  title: 'VyapaarSathi AI — Claude Amber MSME Intelligence Ecosystem',
  description: 'AI-powered GST invoicing, UPI reconciliation, compliance reminders, Paytm soundbox & MSME Govt Schemes portal.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#121110] text-[#F5F2EC] font-['Montserrat','Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#DA7756] selection:text-white relative min-h-screen">
        <DeepFlowBackground />
        <div className="relative z-10">
          <I18nProvider>{children}</I18nProvider>
        </div>
      </body>
    </html>
  );
}
