'use client';

import { useState, useEffect, useCallback } from 'react';

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

  // Fetch shared vote count from API
  const fetchVotes = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/vote?softwareId=${encodeURIComponent(softwareId)}&subscriptionToolId=${encodeURIComponent(subscriptionToolId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
      }
    } catch {
      // Keep initialVotes on failure
    }
  }, [softwareId, subscriptionToolId]);

  useEffect(() => {
    // Load user's own vote state from localStorage
    const stored = localStorage.getItem(storageKey);
    if (stored === 'up' || stored === 'down') {
      setUserVote(stored);
    }
    // Fetch shared vote count
    fetchVotes();
  }, [storageKey, fetchVotes]);

  async function handleVote(vote: 'up' | 'down') {
    if (userVote === vote) return;

    // Calculate optimistic delta
    const delta = vote === 'up' ? 1 : -1;
    const adjustedDelta = userVote ? delta * 2 : delta;

    const prevVote = userVote;
    const prevVotes = votes;

    // Optimistic update
    setUserVote(vote);
    setVotes((v) => v + adjustedDelta);
    localStorage.setItem(storageKey, vote);

    // Persist to API
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ softwareId, subscriptionToolId, vote }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Rollback on failure
      setUserVote(prevVote);
      setVotes(prevVotes);
      if (prevVote) {
        localStorage.setItem(storageKey, prevVote);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
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
        aria-label="Vote up — this alternative is useful"
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
        aria-label="Vote down — this alternative is not useful"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14V2M9 22.01l1-8H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.99Z" />
        </svg>
      </button>
    </div>
  );
}
