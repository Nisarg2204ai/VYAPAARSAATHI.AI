'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  FileText,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Settings,
  UserCheck,
  UserPlus,
  LogOut,
  Sparkles,
  Landmark,
  Bot,
  Info,
  PhoneCall,
  User,
} from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { SearchModal } from './search-modal';
import { AuthModal } from './auth-modal';
import { VyapaarSathiLogo } from './vyapaar-sathi-logo';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isWelcomePage = pathname === '/';

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; businessName: string; gstin: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vyapaar_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vyapaar_user');
    localStorage.removeItem('vyapaar_token');
    setUser(null);
    router.push('/');
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!user && href !== '/' && href !== '/about' && href !== '/contact') {
      e.preventDefault();
      setIsAuthOpen(true);
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/advisor', label: 'CFO AI Advisor', icon: Bot },
    { href: '/schemes', label: 'MSME Schemes', icon: Landmark },
    { href: '/invoices', label: 'Invoices', icon: FileText },
    { href: '/reconciliation', label: 'Reconciliation', icon: TrendingUp },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#DA7756]/20 bg-[#161412]/85 backdrop-blur-2xl transition-all shadow-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          
          {/* Brand Logo rendering provided logo */}
          <Link href="/" className="flex items-center">
            <VyapaarSathiLogo size="md" showText={true} />
          </Link>

          {/* Main Navigation Tabs with Advanced Hover Effects */}
          {!isWelcomePage && (
            <nav className="hidden xl:flex items-center space-x-1 bg-[#121110]/80 p-1.5 rounded-2xl border border-[#DA7756]/25 shadow-inner">
              {/* FIRST ITEM: Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#DA7756]/15 text-[#DA7756] border border-[#DA7756]/30 hover:bg-[#DA7756]/25 hover:border-[#DA7756] transition-all font-bold text-xs mr-1 shadow-sm group"
                aria-label="Open Search"
              >
                <Search className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                <span>Search...</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-[#1A1816] border border-[#DA7756]/30 rounded text-[#DA7756]">
                  ⌘K
                </kbd>
              </button>

              {/* Feature Tabs with Magnetic Hover Effect */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-tab-link flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold relative z-10 transition-all ${
                      isActive
                        ? 'nav-tab-link-active'
                        : 'text-slate-300 hover:text-[#DA7756]'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 relative z-10 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Section: Multi-lingual Switcher & Merchant Profile Badge */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1A1816] border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm hover:border-emerald-400 transition-all"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="max-w-[110px] truncate">{user.businessName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log Out & Return to Welcome Screen"
                  className="p-2 rounded-xl bg-[#1A1816] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-[#DA7756] to-[#D97706] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#DA7756]/20 hover:from-[#E07A5F] hover:to-[#F59E0B] active:scale-[0.98] transition-all"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </>
  );
}
