import Link from 'next/link';
import PricingBadge from './PricingBadge';
import PlatformBadges from './PlatformBadges';
import type { Software } from '@/types/software';

interface SoftwareCardProps {
  software: Software;
  showReplaces?: boolean;
}

export default function SoftwareCard({ software, showReplaces = false }: SoftwareCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift transition-all">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          <Link
            href={`/software/${software.slug}`}
            className="hover:text-amber-600 transition-colors"
          >
            {software.name}
          </Link>
        </h3>
      </div>

      <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
        {software.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <PricingBadge type={software.pricingType} priceText={software.priceText} />
      </div>

      <PlatformBadges platforms={software.platforms} />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {software.isOpenSource && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20"/></svg>
            Open Source
          </span>
        )}
        {software.isOfflineSupported && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/50">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/></svg>
            Offline
          </span>
        )}
      </div>

      {showReplaces && software.replaces.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Replaces</p>
          <div className="flex flex-wrap gap-1.5">
            {software.replaces.map((replace) => (
              <Link
                key={replace}
                href={`/alternatives/${replace}`}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                {replace.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
