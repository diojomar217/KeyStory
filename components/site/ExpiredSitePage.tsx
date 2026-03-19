import Link from 'next/link';

type Props = {
  websiteName?: string;
  status: 'expired' | 'archived';
  expiresAt?: string;
};

export default function ExpiredSitePage({ websiteName, status, expiresAt }: Props) {
  const title = status === 'archived' ? 'This memory has been archived' : 'Keep your memory alive ❤️';
  const message =
    status === 'archived'
      ? 'This site has been archived and is not publicly available. Contact support to reactivate if needed.'
      : 'This website is temporarily unavailable because its hosting period has ended. Renew to keep the memory accessible.';

  const subtitle = expiresAt
    ? `Original expiration: ${new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
    : '';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-100 p-6">
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl shadow-2xl border border-rose-100 dark:border-zinc-700 p-10 max-w-xl text-center">
        <p className="text-5xl leading-none">❤️</p>
        <h1 className="mt-4 text-3xl font-bold text-rose-700 dark:text-rose-300">{title}</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        {websiteName && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Site: {websiteName}</p>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/websites"
            className="rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 px-4 py-2 text-sm font-medium"
          >
            Manage and Renew
          </Link>
          <a
            href="/"
            className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 text-sm font-medium"
          >
            Explore other stories
          </a>
        </div>

        {status === 'expired' && (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Renewing will restore this page immediately.</p>
        )}
      </div>
    </main>
  );
}
