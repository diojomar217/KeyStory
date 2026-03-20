'use client';

import { useState } from 'react';

interface PasswordGateProps {
  slug: string;
  passwordHash?: string;
  onUnlock: () => void;
}

export default function PasswordGate({ slug, passwordHash, onUnlock }: PasswordGateProps) {  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(`unlocked_${slug}`, 'true');
          if (passwordHash) {
            window.localStorage.setItem(`unlocked_hash_${slug}`, passwordHash);
          }
        }
        onUnlock();
      } else {
        setError(data.message || 'Incorrect password');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to verify password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-lg backdrop-blur-md">
        <h2 className="text-xl font-bold text-rose-700 mb-4">🔒 This page is private</h2>
        <p className="text-sm text-slate-600 mb-4">Enter the password to view this website.</p>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="flex gap-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-rose-600 animate-shake">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 disabled:opacity-60"
        >
          {loading ? 'Unlocking...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
