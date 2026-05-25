import type { Metadata } from 'next';
import SubscriptionCalculator from '@/components/SubscriptionCalculator';

export const metadata: Metadata = {
  title: 'Software Subscription Cost Calculator',
  description:
    'See how much you spend on software subscriptions every year and discover one-time or open-source alternatives.',
};

export default function CalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Free tool
        </span>
        <h1 className="heading-editorial text-4xl text-slate-900 mb-4">
          Subscription Cost Calculator
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          See how much you spend on software subscriptions every year and discover one-time or open-source alternatives.
        </p>
      </div>
      <SubscriptionCalculator />
    </div>
  );
}
