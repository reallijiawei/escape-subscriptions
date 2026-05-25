import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 grain-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
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
              Stop renting your tools. Find one-time purchase, open-source, and lifetime alternatives to expensive software subscriptions.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Navigate</h4>
            <ul className="space-y-3">
              {[
                { href: '/search', label: 'Browse' },
                { href: '/calculator', label: 'Calculator' },
                { href: '/categories/design', label: 'Categories' },
                { href: '/about', label: 'About' },
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
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Get weekly no-subscription software picks.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm rounded-lg transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Escape Subscriptions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Privacy</span>
            <span className="text-xs text-slate-500">Terms</span>
            <span className="text-xs text-slate-500">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
