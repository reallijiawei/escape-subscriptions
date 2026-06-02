import { formatPricingType } from '@/lib/utils';

interface PricingBadgeProps {
  type: string;
  priceText?: string;
}

export default function PricingBadge({ type, priceText }: PricingBadgeProps) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    ONE_TIME_PURCHASE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    LIFETIME_DEAL: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    OPEN_SOURCE: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    FREE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    FREEMIUM: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
    SUBSCRIPTION_WITH_FREE_PLAN: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    SUBSCRIPTION: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };

  const style = styles[type] || { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {formatPricingType(type)}
      {priceText && type !== 'FREE' && type !== 'OPEN_SOURCE' && (
        <span className="opacity-60 ml-0.5">· {priceText}</span>
      )}
    </span>
  );
}
