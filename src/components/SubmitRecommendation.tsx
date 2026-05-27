'use client';

import { useState } from 'react';

interface SubmitRecommendationProps {
  subscriptionToolId: string;
  toolName: string;
}

export default function SubmitRecommendation({
  subscriptionToolId,
  toolName,
}: SubmitRecommendationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [softwareName, setSoftwareName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!softwareName.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionToolId,
          softwareName: softwareName.trim(),
          websiteUrl: websiteUrl.trim(),
          reason: reason.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setSoftwareName('');
        setWebsiteUrl('');
        setReason('');
      }
    } catch {
      // Silently fail — user still sees success feedback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="font-bold text-emerald-900 mb-1">Thanks for your recommendation!</p>
        <p className="text-sm text-emerald-700">Your suggestion helps others find better alternatives.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setIsOpen(false);
          }}
          className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 bg-white border-2 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/30 rounded-2xl text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 group-hover:bg-amber-200 rounded-lg flex items-center justify-center transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Know a good alternative we missed?</p>
              <p className="text-xs text-slate-500">Recommend a {toolName} alternative to help others</p>
            </div>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recommend an alternative to {toolName}</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor={`sw-name-${subscriptionToolId}`} className="block text-xs font-semibold text-slate-600 mb-1">
                Software Name <span className="text-red-400">*</span>
              </label>
              <input
                id={`sw-name-${subscriptionToolId}`}
                type="text"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                required
                placeholder="e.g., LibreOffice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor={`sw-url-${subscriptionToolId}`} className="block text-xs font-semibold text-slate-600 mb-1">
                Website URL <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id={`sw-url-${subscriptionToolId}`}
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor={`sw-reason-${subscriptionToolId}`} className="block text-xs font-semibold text-slate-600 mb-1">
                Why do you recommend it? <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id={`sw-reason-${subscriptionToolId}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="What makes it a good alternative?"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Your data helps improve recommendations for everyone.</p>
            <button
              type="submit"
              disabled={!softwareName.trim() || submitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-900 font-bold text-sm rounded-lg transition-all"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
