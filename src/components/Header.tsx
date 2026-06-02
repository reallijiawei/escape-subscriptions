'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Escape<span className="text-amber-600">Subscriptions</span>
              </span>
            </Link>
          </div>

          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            <Link
              href="/search"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/calculator"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Calculator
            </Link>
            <Link
              href="/categories"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/stacks"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Stacks
            </Link>
            <Link
              href="/use-cases"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Use Cases
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay + dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 md:hidden animate-fade-in">
            <nav aria-label="Mobile navigation" className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {[
                { href: '/search', label: 'Browse Alternatives' },
                { href: '/calculator', label: 'Calculator' },
                { href: '/categories', label: 'Categories' },
                { href: '/stacks', label: 'Stacks' },
                { href: '/use-cases', label: 'Use Cases' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
