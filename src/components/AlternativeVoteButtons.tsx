'use client';

import { useState, useEffect } from 'react';

interface AlternativeVoteButtonsProps {
  softwareId: string;
  subscriptionToolId: string;
  initialVotes?: number;
}

export default function AlternativeVoteButtons({
  softwareId,
  subscriptionToolId,
  initialVotes = 0,
}: AlternativeVoteButtonsProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [votes, setVotes] = useState(initialVotes);

  const storageKey = `vote-${subscriptionToolId}-${softwareId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'up' || stored === 'down') {
      setUserVote(stored);
    }
  }, [storageKey]);

  function handleVote(vote: 'up' | 'down') {
    if (userVote === vote) return;

    const delta = vote === 'up' ? 1 : -1;
    const adjustedDelta = userVote ? delta * 2 : delta;

    setUserVote(vote);
    setVotes((v) => v + adjustedDelta);
    localStorage.setItem(storageKey, vote);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => handleVote('up')}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          userVote === 'up'
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
        }`}
        title="This alternative is useful"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
        {votes > 0 ? votes : ''}
      </button>
      <button
        onClick={() => handleVote('down')}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          userVote === 'down'
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
        }`}
        title="This alternative is not useful"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14V2M9 22.01l1-8H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.99Z" />
        </svg>
      </button>
    </div>
  );
}
