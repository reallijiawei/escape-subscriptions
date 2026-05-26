'use client';

import { useState } from 'react';

interface Props {
  toolSlug: string;
  toolName: string;
}

export default function EmailSubscribe({ toolSlug, toolName }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), toolSlug, toolName }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(`Subscribed! We'll notify you about new ${toolName} alternatives.`);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <p className="text-sm font-semibold text-emerald-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing...' : 'Get Updates'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
