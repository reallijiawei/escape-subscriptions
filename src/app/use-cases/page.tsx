import Link from 'next/link';
import type { Metadata } from 'next';
import { useCases, software, subscriptionTools } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Subscription-Free Software by Use Case',
  description: 'Find the best free, open-source, and one-time purchase software for your specific needs. Stop renting your tools.',
  alternates: { canonical: '/use-cases' },
};

export default function UseCasesPage() {
  return (
    <div>
      <section className="bg-slate-900 grain-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Software that works<br />
              <span className="text-amber-400">for your life</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Whether you're a freelancer, student, or developer — stop paying monthly for tools you should own.
            </p>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((uc) => {
            const ucSoftware = uc.softwareIds.map((id) => software.find((s) => s.id === id)).filter(Boolean);
            const ucTools = uc.toolIds.map((id) => subscriptionTools.find((t) => t.id === id)).filter(Boolean);
            const yearlyCost = ucTools.reduce((sum, t) => sum + (t!.monthlyPrice || 0) * 12, 0);

            return (
              <Link
                key={uc.id}
                href={`/use-cases/${uc.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift transition-all"
              >
                <span className="text-3xl mb-3 block">{uc.icon}</span>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                  {uc.title}
                </h2>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {uc.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{ucSoftware.length} alternatives</span>
                  {yearlyCost > 0 && (
                    <span className="text-emerald-600 font-semibold">Save ~${yearlyCost}/yr</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
