'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type AuthProviders = {
  google: boolean;
  password: boolean;
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providers, setProviders] = useState<AuthProviders>({ google: true, password: false });
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load enabled auth providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await fetch('/api/admin/auth', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data?.providers) {
          setProviders({
            google: Boolean(data.providers.google),
            password: Boolean(data.providers.password),
          });
        }
      } catch {
        setProviders({ google: true, password: false });
      } finally {
        setProvidersLoading(false);
      }
    };

    loadProviders();
  }, []);

  // Check if already logged in or returned from OAuth callback
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      router.push('/admin/dashboard');
      return;
    }

    const oauth = searchParams.get('oauth');
    if (oauth === 'error') {
      const reason = searchParams.get('reason') || 'Google sign-in failed.';
      setError(`Google sign-in failed: ${reason.replaceAll('_', ' ')}`);
      return;
    }

    if (oauth === 'success') {
      const bootstrap = async () => {
        setGoogleLoading(true);
        try {
          const res = await fetch('/api/admin/auth/session', { cache: 'no-store' });
          const data = await res.json();

          if (res.ok && data.success && data.token) {
            localStorage.setItem(
              'admin_session',
              JSON.stringify({
                email: data.email || 'admin',
                token: data.token,
                expiresAt: Date.now() + 24 * 60 * 60 * 1000,
              })
            );
            router.push('/admin/dashboard');
            return;
          }

          setError(data.message || 'Google sign-in session bootstrap failed.');
        } catch {
          setError('Google sign-in session bootstrap failed.');
        } finally {
          setGoogleLoading(false);
        }
      };

      bootstrap();
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providers.password) {
      setError('Password login is disabled. Use Google sign-in.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store session
        localStorage.setItem('admin_session', JSON.stringify({ 
          email, 
          token: data.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        // Set cookie for server-side checks
        document.cookie = `admin_session=${data.token}; path=/; max-age=${24 * 60 * 60}`;
        
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!providers.google) {
      setError('Google sign-in is not configured.');
      return;
    }
    setError('');
    setGoogleLoading(true);
    window.location.href = '/api/admin/auth/google/start';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">KeyStory Admin</h1>
          <p className="text-slate-400 mt-2">Sign in to manage your websites securely</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {providersLoading && (
              <p className="text-sm text-slate-500">Checking sign-in methods...</p>
            )}

            {providers.google && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading || providersLoading}
                className="w-full py-3 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 2.8 14.7 2 12 2 6.9 2 2.8 6.3 2.8 11.8S6.9 21.6 12 21.6c6.9 0 9.2-4.9 9.2-7.5 0-.5-.1-.8-.1-1.2H12z"/>
                  </svg>
                  {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </span>
              </button>
            )}

            {providers.password && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Emergency fallback</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={providers.password}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={providers.password}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading || providersLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In with Password'
                  )}
                </button>
              </>
            )}

            {!providersLoading && !providers.google && !providers.password && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No admin sign-in provider is configured. Set up Google OAuth or enable password fallback.
              </p>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              Protected area. Only authorized administrators can access.
            </p>
          </div>
        </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              ← Back to Website
            </Link>
          </div>
      </div>
    </div>
  );
}

