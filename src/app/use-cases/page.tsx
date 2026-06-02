import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema, itemListSchema, faqSchema } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import FAQSection from '@/components/FAQSection';
import { useCases, software, subscriptionTools } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Subscription-Free Software by Use Case',
  description: 'Find the best free, open-source, and one-time purchase software for your specific needs — freelancers, students, developers, designers, and more. Stop renting your tools.',
  alternates: { canonical: '/use-cases' },
  openGraph: {
    title: 'Subscription-Free Software by Use Case | Escape Subscriptions',
    description: 'Find the best free, open-source, and one-time purchase software for your specific needs. Stop renting your tools.',
    url: '/use-cases',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subscription-Free Software by Use Case',
    description: 'Find the best free, open-source, and one-time purchase software for your specific needs.',
  },
};

const useCaseFaq = [
  {
    question: 'What are use-case-based software recommendations?',
    answer: 'Instead of browsing by category (e.g., "design tools"), use-case pages group software by who you are and what you need. For example, the "Freelancers" page lists tools that freelancers commonly need — design, accounting, project management — all as one-time purchases.',
  },
  {
    question: 'How are the use cases determined?',
    answer: 'Each use case is based on common workflows for that persona. We identify the most popular subscription tools people in that role use, then find the best one-time purchase and open-source alternatives for each.',
  },
  {
    question: 'Can I suggest a new use case?',
    answer: 'Yes! If you have a specific workflow or persona that isn\'t covered, you can submit a recommendation through the site. We regularly add new use cases based on user feedback.',
  },
  {
    question: 'How much can I save by switching per use case?',
    answer: 'Savings vary by use case, but most users save $300–$1,500 per year. Each use case page shows the estimated annual savings based on the subscription tools it replaces.',
  },
];

export default function UseCasesPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Use Cases', url: '/use-cases' },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          useCases.map((u, i) => ({ name: u.title, url: `/use-cases/${u.slug}`, position: i + 1 }))
        )}
      />
      <JsonLd data={faqSchema(useCaseFaq)} />
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
        <Breadcrumb items={[{ name: 'Use Cases' }]} />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <p className="text-slate-700 leading-relaxed">
            Different roles need different tools. Instead of searching for alternatives one by one, browse by your use case to find curated software collections for freelancers, students, developers, designers, and more. Each page lists the subscription tools commonly used in that role and the best one-time purchase or open-source alternatives available.
          </p>
        </div>
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

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Frequently Asked Questions</h2>
          <FAQSection items={useCaseFaq} />
        </div>
      </div>
    </div>
  );
}
