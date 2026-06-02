'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import SoftwareCard from '@/components/SoftwareCard';
import { searchSoftware } from '@/lib/data';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Hide default content when searching, show it when not
  useEffect(() => {
    const defaultContent = document.getElementById('default-content');
    if (defaultContent) {
      defaultContent.style.display = query ? 'none' : 'block';
    }
  }, [query]);

  if (!query) return null;

  const results = searchSoftware(query);
  const toolResults = results.filter((r) => 'monthlyPrice' in r);
  const softwareResults = results.filter((r) => 'pricingType' in r);

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-editorial text-3xl text-slate-900 mb-2">
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-slate-500">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="text-slate-500 mb-4">No results found for &quot;{query}&quot;</p>
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
            Back to home
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {toolResults.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
                Subscription Software ({toolResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolResults.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/alternatives/${tool.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {tool.name}
                      </h3>
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        ${tool.monthlyPrice}/mo
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3 leading-relaxed">{tool.description}</p>
                    <span className="text-sm text-amber-600 font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Find alternatives
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {softwareResults.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
                Alternative Software ({softwareResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {softwareResults.map((sw) => (
                  <SoftwareCard key={sw.id} software={sw} showReplaces />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
