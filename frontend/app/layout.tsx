import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '../components/i18n-provider';

export const metadata: Metadata = { title: 'VyapaarSathi AI', description: 'Business management for Indian small businesses' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><I18nProvider>{children}</I18nProvider></body></html>;
}
