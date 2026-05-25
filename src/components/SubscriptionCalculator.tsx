'use client';

import { useState } from 'react';
import { subscriptionTools } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface CalculatorItem {
  id: string;
  name: string;
  monthlyCost: number;
}

export default function SubscriptionCalculator() {
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: '1', name: '', monthlyCost: 0 },
  ]);

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

  const totalMonthly = items.reduce((sum, item) => sum + (item.monthlyCost || 0), 0);
  const totalYearly = totalMonthly * 12;
  const total3Year = totalYearly * 3;
  const total5Year = totalYearly * 5;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex-1">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Software name (e.g., Photoshop)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                  list="software-presets"
                />
              </div>
              <div className="w-32">
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
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                disabled={items.length === 1}
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
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Your Subscription Costs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Monthly</p>
              <p className="text-2xl font-bold text-white font-display">{formatPrice(totalMonthly)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Yearly</p>
              <p className="text-2xl font-bold text-white font-display">{formatPrice(totalYearly)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">3-Year</p>
              <p className="text-2xl font-bold text-amber-400 font-display">{formatPrice(total3Year)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">5-Year</p>
              <p className="text-2xl font-bold text-amber-400 font-display">{formatPrice(total5Year)}</p>
            </div>
          </div>

          {totalYearly > 0 && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm text-amber-300">
                You&apos;re spending <strong className="text-amber-200">{formatPrice(totalYearly)}/year</strong> on subscriptions.
                That&apos;s <strong className="text-amber-200">{formatPrice(total5Year)}</strong> over 5 years.
              </p>
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
