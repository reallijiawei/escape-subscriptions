'use client';

import { useState } from 'react';
import { subscriptionTools } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface CalculatorItem {
  id: string;
  name: string;
  monthlyCost: number;
}

const PRESETS = [
  {
    label: 'Designer',
    items: [
      { name: 'Adobe Photoshop', monthlyCost: 22.99 },
      { name: 'Adobe Illustrator', monthlyCost: 22.99 },
      { name: 'Canva', monthlyCost: 12.99 },
    ],
  },
  {
    label: 'Developer',
    items: [
      { name: 'GitHub Copilot', monthlyCost: 10 },
      { name: 'Notion', monthlyCost: 10 },
      { name: '1Password', monthlyCost: 3 },
    ],
  },
  {
    label: 'Freelancer',
    items: [
      { name: 'Grammarly', monthlyCost: 12 },
      { name: 'Dropbox', monthlyCost: 9.99 },
      { name: 'Todoist', monthlyCost: 4 },
    ],
  },
];

const COMPARISONS = [
  { threshold: 500, text: 'That\'s a new pair of AirPods every year.' },
  { threshold: 1000, text: 'That\'s a new iPad every year.' },
  { threshold: 2000, text: 'That\'s a round-trip flight to Europe.' },
  { threshold: 3000, text: 'That\'s a decent laptop every 2 years.' },
];

function getComparison(yearly: number): string | null {
  const match = [...COMPARISONS].reverse().find((c) => yearly >= c.threshold);
  return match?.text || null;
}

export default function SubscriptionCalculator() {
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: '1', name: '', monthlyCost: 0 },
  ]);
  const [copied, setCopied] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', monthlyCost: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof CalculatorItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setItems(preset.items.map((item, i) => ({ id: `preset-${i}`, ...item })));
  };

  const totalMonthly = items.reduce((sum, item) => sum + (item.monthlyCost || 0), 0);
  const totalYearly = totalMonthly * 12;
  const total3Year = totalYearly * 3;
  const total5Year = totalYearly * 5;

  const filledItems = items.filter((item) => item.name && item.monthlyCost > 0);
  const comparison = getComparison(totalYearly);

  const handleShare = async () => {
    const params = new URLSearchParams();
    filledItems.forEach((item) => params.append(item.name, String(item.monthlyCost)));
    const url = `${window.location.origin}/calculator?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm spending ${formatPrice(totalYearly)}/year on software subscriptions. Find cheaper alternatives:`)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Preset buttons */}
      <div className="px-6 sm:px-8 pt-6 pb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick start</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => loadPreset(preset)}
              aria-label={`Load ${preset.label} preset with ${preset.items.length} subscriptions`}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-slate-200 rounded-xl transition-all"
            >
              {preset.label} stack
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Software name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                  list="software-presets"
                />
              </div>
              <div className="w-24 sm:w-32 shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={item.monthlyCost || ''}
                    onChange={(e) => updateItem(item.id, 'monthlyCost', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                disabled={items.length === 1}
                aria-label="Remove"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <datalist id="software-presets">
          {subscriptionTools.map((tool) => (
            <option key={tool.id} value={tool.name} />
          ))}
        </datalist>

        <button
          onClick={addItem}
          className="mb-8 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Subscription
        </button>
      </div>

      {/* Results */}
      <div className="bg-slate-900 p-6 sm:p-8 grain-bg">
        <div className="relative z-10">
          {totalYearly > 0 && (
            <div className="mb-6">
              <p className="text-2xl sm:text-3xl font-bold text-white font-display mb-1">
                You're spending {formatPrice(totalYearly)}<span className="text-slate-400 text-lg">/year</span>
              </p>
              <p className="text-slate-400 text-sm">
                on {filledItems.length} subscription{filledItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Monthly</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-display">{formatPrice(totalMonthly)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Yearly</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-display">{formatPrice(totalYearly)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">3-Year</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-400 font-display">{formatPrice(total3Year)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">5-Year</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-400 font-display">{formatPrice(total5Year)}</p>
            </div>
          </div>

          {comparison && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm text-amber-300">
                {comparison} Over 5 years, that's <strong className="text-amber-200">{formatPrice(total5Year)}</strong> on software subscriptions.
              </p>
            </div>
          )}

          {totalYearly > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-colors"
              >
                Find alternatives
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Link copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                    Share your result
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Your data stays in your browser. We do not store anything.
        </p>
      </div>
    </div>
  );
}
