'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
}

export default function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="w-full py-5 text-left flex items-start justify-between gap-4 group"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
              {item.question}
            </span>
            <span
              className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all ${
                openIndex === index
                  ? 'border-amber-500 bg-amber-500 text-white rotate-0'
                  : 'text-slate-400 rotate-0'
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              >
                {openIndex === index ? (
                  <path d="M5 12h14" />
                ) : (
                  <>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </>
                )}
              </svg>
            </span>
          </button>
          {openIndex === index && (
            <div className="pb-5 pr-10 animate-fade-in">
              <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
