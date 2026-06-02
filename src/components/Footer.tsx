import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 grain-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Escape<span className="text-amber-400">Subscriptions</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              A site for people tired of software subscriptions. Find free, open-source, and one-time purchase alternatives to the tools draining your wallet.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Browse</h4>
            <ul className="space-y-3">
              {[
                { href: '/search', label: 'All Alternatives' },
                { href: '/calculator', label: 'Calculator' },
                { href: '/categories', label: 'Categories' },
                { href: '/stacks', label: 'Stacks' },
                { href: '/use-cases', label: 'Use Cases' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">By Type</h4>
            <ul className="space-y-3">
              {[
                { href: '/free-alternatives-to/1password', label: 'Free Alternatives' },
                { href: '/open-source-alternatives-to/notion', label: 'Open Source' },
                { href: '/compare/gimp-vs-adobe-photoshop', label: 'Comparisons' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-3">
              {[
                { href: '/categories/design', label: 'Design' },
                { href: '/categories/productivity', label: 'Productivity' },
                { href: '/categories/writing', label: 'Writing' },
                { href: '/categories/developer-tools', label: 'Developer Tools' },
                { href: '/categories/security', label: 'Security' },
                { href: '/categories/video-audio', label: 'Video & Audio' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Popular</h4>
            <ul className="space-y-3">
              {[
                { href: '/alternatives/adobe-photoshop', label: 'Photoshop Alternatives' },
                { href: '/alternatives/notion', label: 'Notion Alternatives' },
                { href: '/alternatives/canva', label: 'Canva Alternatives' },
                { href: '/alternatives/grammarly', label: 'Grammarly Alternatives' },
                { href: '/alternatives/1password', label: '1Password Alternatives' },
                { href: '/alternatives/figma', label: 'Figma Alternatives' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Escape Subscriptions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">About</Link>
            <Link href="/use-cases" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Use Cases</Link>
            <Link href="mailto:hello@escapesubscriptions.online" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
