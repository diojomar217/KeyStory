'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { getSite } from '@/lib/api/sites';
import { Site } from '@/lib/supabase';

interface PageProps {
  params: Promise<{ id: string }>;
}

type NfcNoticeTone = 'success' | 'error' | 'info';

type WebNfcReader = {
  write: (data: string | { records: Array<{ recordType: string; data: string }> }, options?: { overwrite?: boolean }) => Promise<void>;
  makeReadOnly: () => Promise<void>;
};

export default function NfcLockPage({ params }: PageProps) {
  const { id } = use(params);

  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: NfcNoticeTone; text: string } | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isWriteAndLocking, setIsWriteAndLocking] = useState(false);
  // More granular stages for better UX during NFC operations
  const [writeStage, setWriteStage] = useState<'idle' | 'detecting' | 'detected' | 'writing' | 'success' | 'error'>('idle');
  const [lockStage, setLockStage] = useState<'idle' | 'detecting' | 'detected' | 'locking' | 'success' | 'error'>('idle');
  const detectTimeoutRef = useRef<number | null>(null);
  const activeNdefRef = useRef<WebNfcReader | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [confirmPermanentLock, setConfirmPermanentLock] = useState(false);
  const [capabilities, setCapabilities] = useState({
    secureContext: false,
    hasWebNfc: false,
    hasReadOnlySupport: false,
  });

  useEffect(() => {
    if (!id) return;

    const fetchSite = async () => {
      try {
        const siteData = await getSite(id);
        if (!siteData) {
          setError('Website not found.');
          return;
        }
        setSite(siteData);
      } catch (fetchError) {
        console.error('Failed to load site for NFC lock:', fetchError);
        setError('Failed to load website data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ReaderCtor = (window as Window & { NDEFReader?: new () => WebNfcReader }).NDEFReader;
    setCapabilities({
      secureContext: window.isSecureContext,
      hasWebNfc: Boolean(ReaderCtor),
      hasReadOnlySupport: Boolean(ReaderCtor && 'makeReadOnly' in ReaderCtor.prototype),
    });
  }, []);

  const slug = site?.website_name || site?.slug || '';
  const status = (site?.status || 'active').toLowerCase();
  const canWriteNfc = status !== 'archived' && status !== 'expired';
  const browserReady = capabilities.secureContext && capabilities.hasWebNfc;
  const canPermanentlyLock = browserReady && capabilities.hasReadOnlySupport;
  const nfcUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://key-story.vercel.app';
    return slug ? `${origin}/r/${slug}` : '';
  }, [slug]);

  const pushNotice = (tone: NfcNoticeTone, text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice(null), 7000);
  };

  const getReaderCtor = (): (new () => WebNfcReader) | null => {
    if (typeof window === 'undefined' || !window.isSecureContext) {
      pushNotice('error', 'Web NFC requires HTTPS and a secure browser context.');
      return null;
    }

    const ReaderCtor = (window as Window & { NDEFReader?: new () => WebNfcReader }).NDEFReader;
    if (!ReaderCtor) {
      pushNotice('error', 'Web NFC is not available on this device or browser. Use Android Chrome or Samsung Internet.');
      return null;
    }

    return ReaderCtor;
  };

  const getNfcErrorHint = (operation: 'write' | 'lock', value: unknown) => {
    const message = value instanceof Error ? value.message : 'Unknown NFC error';
    const lowered = message.toLowerCase();

    if (lowered.includes('permission')) {
      return `${operation === 'lock' ? 'Lock' : 'Write'} failed because NFC permission was denied.`;
    }
    if (lowered.includes('abort')) {
      return `${operation === 'lock' ? 'Lock' : 'Write'} was canceled before the tag was detected.`;
    }
    if (lowered.includes('not supported') || lowered.includes('unavailable')) {
      return 'This device/browser does not support the required Web NFC feature.';
    }

    return operation === 'lock'
      ? 'Keep the phone still on the tag and try locking again.'
      : 'Keep the phone still on the tag and try writing again.';
  };

  const writeRewritableTag = async () => {
    if (!slug || !canWriteNfc || !nfcUrl) {
      pushNotice('error', 'This site is not available for NFC writing.');
      return;
    }

    const ReaderCtor = getReaderCtor();
    if (!ReaderCtor) return;
    setWriteStage('detecting');
    setIsWriting(true);
    const ndef = new ReaderCtor();
    activeNdefRef.current = ndef;
    let wrote = false;
    try {
      if ('scan' in (ndef as any)) {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
          await (ndef as any).scan({ signal: controller.signal });
        } catch (scanErr: any) {
          // If scan was aborted by user, don't fallback to write
          if (scanErr && (scanErr.name === 'AbortError' || scanErr.message === 'Aborted')) {
            setWriteStage('idle');
            setIsWriting(false);
            activeNdefRef.current = null;
            abortControllerRef.current = null;
            pushNotice('info', 'Write canceled.');
            return;
          }
          // Other scan errors: fallback to direct write
          setWriteStage('writing');
          await ndef.write({ records: [{ recordType: 'url', data: nfcUrl }] });
          setWriteStage('success');
          pushNotice('success', 'NFC tag written successfully. It is still rewritable.');
          return;
        }

        const onReading = async () => {
          if (wrote) return;
          wrote = true;
          if (detectTimeoutRef.current) {
            clearTimeout(detectTimeoutRef.current);
            detectTimeoutRef.current = null;
          }
          try {
            setWriteStage('detected');
            setWriteStage('writing');
            await ndef.write({ records: [{ recordType: 'url', data: nfcUrl }] });
            setWriteStage('success');
            pushNotice('success', 'NFC tag written successfully. It is still rewritable.');
          } catch (err) {
            setWriteStage('error');
            pushNotice('error', getNfcErrorHint('write', err));
          } finally {
            setIsWriting(false);
            activeNdefRef.current = null;
            abortControllerRef.current = null;
            window.setTimeout(() => setWriteStage('idle'), 3000);
          }
        };

        (ndef as any).onreading = onReading;
        (ndef as any).onreadingerror = () => {
          setWriteStage('error');
          setIsWriting(false);
          activeNdefRef.current = null;
          abortControllerRef.current = null;
          pushNotice('error', 'NFC read error — try again.');
        };
        // Cancel if no tag is detected within 20s
        detectTimeoutRef.current = window.setTimeout(() => {
          try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            (ndef as any).onreading = null;
          } catch {}
          setWriteStage('error');
          setIsWriting(false);
          activeNdefRef.current = null;
          abortControllerRef.current = null;
          pushNotice('error', 'Tag detection timed out. Try again.');
        }, 20000);
      } else {
        // Fallback: write() blocks until a tag is present
        setWriteStage('writing');
        await ndef.write({ records: [{ recordType: 'url', data: nfcUrl }] });
        setWriteStage('success');
        pushNotice('success', 'NFC tag written successfully. It is still rewritable.');
      }
    } catch (nfcError) {
      setWriteStage('error');
      pushNotice('error', getNfcErrorHint('write', nfcError));
    } finally {
      setIsWriting(false);
      if (detectTimeoutRef.current) {
        clearTimeout(detectTimeoutRef.current);
        detectTimeoutRef.current = null;
      }
      activeNdefRef.current = null;
      abortControllerRef.current = null;
      // ensure stage resets after a short delay
      window.setTimeout(() => setWriteStage('idle'), 3000);
    }
  };

  const confirmLockAction = (actionLabel: string): boolean => {
    if (typeof window === 'undefined') return false;

    return window.confirm(
      `${actionLabel}\n\nThis will permanently make the physical NFC tag read-only. This cannot be undone.`
    );
  };

  const lockExistingTag = async () => {
    if (!slug || !canWriteNfc) {
      pushNotice('error', 'This site is not available for NFC locking.');
      return;
    }

    if (!confirmPermanentLock) {
      pushNotice('info', 'Confirm the permanent lock checkbox first.');
      return;
    }

    if (!confirmLockAction('Are you sure you want to lock this NFC tag?')) {
      pushNotice('info', 'NFC lock canceled.');
      return;
    }

    const ReaderCtor = getReaderCtor();
    if (!ReaderCtor) return;

    if (!(typeof window !== 'undefined' && 'makeReadOnly' in ReaderCtor.prototype)) {
      pushNotice('error', 'This browser supports Web NFC write, but not permanent tag locking.');
      return;
    }

    setLockStage('detecting');
    setIsLocking(true);
    const ndef = new ReaderCtor();
    activeNdefRef.current = ndef;
    let locked = false;
    try {
      if ('scan' in (ndef as any)) {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
          await (ndef as any).scan({ signal: controller.signal });
        } catch (scanErr: any) {
          if (scanErr && (scanErr.name === 'AbortError' || scanErr.message === 'Aborted')) {
            setLockStage('idle');
            setIsLocking(false);
            activeNdefRef.current = null;
            abortControllerRef.current = null;
            pushNotice('info', 'Lock canceled.');
            return;
          }
          // Fallback to direct makeReadOnly()
          setLockStage('locking');
          await ndef.makeReadOnly();
          setLockStage('success');
          pushNotice('success', 'The NFC tag is now permanently read-only and can no longer be overwritten.');
          return;
        }

        const onReading = async () => {
          if (locked) return;
          locked = true;
          if (detectTimeoutRef.current) {
            clearTimeout(detectTimeoutRef.current);
            detectTimeoutRef.current = null;
          }
          try {
            setLockStage('detected');
            setLockStage('locking');
            await ndef.makeReadOnly();
            setLockStage('success');
            pushNotice('success', 'The NFC tag is now permanently read-only and can no longer be overwritten.');
          } catch (err) {
            setLockStage('error');
            pushNotice('error', getNfcErrorHint('lock', err));
          } finally {
            setIsLocking(false);
            activeNdefRef.current = null;
            abortControllerRef.current = null;
            window.setTimeout(() => setLockStage('idle'), 3000);
          }
        };

        (ndef as any).onreading = onReading;
        (ndef as any).onreadingerror = () => {
          setLockStage('error');
          setIsLocking(false);
          activeNdefRef.current = null;
          abortControllerRef.current = null;
          pushNotice('error', 'NFC read error — try again.');
        };
        detectTimeoutRef.current = window.setTimeout(() => {
          try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            (ndef as any).onreading = null;
          } catch {}
          setLockStage('error');
          setIsLocking(false);
          activeNdefRef.current = null;
          abortControllerRef.current = null;
          pushNotice('error', 'Tag detection timed out. Try again.');
        }, 20000);
      } else {
        setLockStage('locking');
        await ndef.makeReadOnly();
        setLockStage('success');
        pushNotice('success', 'The NFC tag is now permanently read-only and can no longer be overwritten.');
      }
    } catch (nfcError) {
      setLockStage('error');
      pushNotice('error', getNfcErrorHint('lock', nfcError));
    } finally {
      setIsLocking(false);
      if (detectTimeoutRef.current) {
        clearTimeout(detectTimeoutRef.current);
        detectTimeoutRef.current = null;
      }
      activeNdefRef.current = null;
      abortControllerRef.current = null;
      window.setTimeout(() => setLockStage('idle'), 3000);
    }
  };

  const writeAndLockTag = async () => {
    if (!slug || !canWriteNfc || !nfcUrl) {
      pushNotice('error', 'This site is not available for NFC locking.');
      return;
    }

    if (!confirmPermanentLock) {
      pushNotice('info', 'Confirm the permanent lock checkbox first.');
      return;
    }

    if (!confirmLockAction('Are you sure you want to write this URL and permanently lock the NFC tag?')) {
      pushNotice('info', 'Write and lock canceled.');
      return;
    }

    const ReaderCtor = getReaderCtor();
    if (!ReaderCtor) return;

    if (!(typeof window !== 'undefined' && 'makeReadOnly' in ReaderCtor.prototype)) {
      pushNotice('error', 'This browser supports Web NFC write, but not permanent tag locking.');
      return;
    }

    setWriteStage('detecting');
    setLockStage('detecting');
    setIsWriteAndLocking(true);
    const ndef = new ReaderCtor();
    activeNdefRef.current = ndef;
    let done = false;
    try {
      if ('scan' in (ndef as any)) {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
          await (ndef as any).scan({ signal: controller.signal });
        } catch (scanErr: any) {
          if (scanErr && (scanErr.name === 'AbortError' || scanErr.message === 'Aborted')) {
            setWriteStage('idle');
            setLockStage('idle');
            setIsWriteAndLocking(false);
            activeNdefRef.current = null;
            abortControllerRef.current = null;
            pushNotice('info', 'Write & lock canceled.');
            return;
          }
          // Fallback to direct write+lock
          setWriteStage('writing');
          await ndef.write({ records: [{ recordType: 'url', data: nfcUrl }] });
          setWriteStage('success');
          setLockStage('locking');
          await ndef.makeReadOnly();
          setLockStage('success');
          pushNotice('success', 'The NFC tag was written with this site URL and permanently locked.');
          return;
        }

        const onReading = async () => {
          if (done) return;
          done = true;
          if (detectTimeoutRef.current) {
            clearTimeout(detectTimeoutRef.current);
            detectTimeoutRef.current = null;
          }
          try {
            setWriteStage('detected');
            setWriteStage('writing');
            await ndef.write({ records: [{ recordType: 'url', data: nfcUrl }] });
            setWriteStage('success');
            setLockStage('locking');
            await ndef.makeReadOnly();
            setLockStage('success');
            pushNotice('success', 'The NFC tag was written with this site URL and permanently locked.');
          } catch (err) {
            setWriteStage('error');
            setLockStage('error');
            pushNotice('error', getNfcErrorHint('lock', err));
          } finally {
            setIsWriteAndLocking(false);
            activeNdefRef.current = null;
            abortControllerRef.current = null;
            window.setTimeout(() => {
              setWriteStage('idle');
              setLockStage('idle');
            }, 3000);
          }
        };

        (ndef as any).onreading = onReading;
        (ndef as any).onreadingerror = () => {
          setWriteStage('error');
          setLockStage('error');
          setIsWriteAndLocking(false);
          activeNdefRef.current = null;
          abortControllerRef.current = null;
          pushNotice('error', 'NFC read error — try again.');
        };
        detectTimeoutRef.current = window.setTimeout(() => {
          try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            (ndef as any).onreading = null;
          } catch {}
          setWriteStage('error');
          setLockStage('error');
          setIsWriteAndLocking(false);
          activeNdefRef.current = null;
          abortControllerRef.current = null;
          pushNotice('error', 'Tag detection timed out. Try again.');
        }, 20000);
      } else {
        setWriteStage('writing');
        await ndef.write({ records: [{ recordType: 'url', data: nfcUrl }] });
        setWriteStage('success');
        setLockStage('locking');
        await ndef.makeReadOnly();
        setLockStage('success');
        pushNotice('success', 'The NFC tag was written with this site URL and permanently locked.');
      }
    } catch (nfcError) {
      setWriteStage('error');
      setLockStage('error');
      pushNotice('error', getNfcErrorHint('lock', nfcError));
    } finally {
      setIsWriteAndLocking(false);
      if (detectTimeoutRef.current) {
        clearTimeout(detectTimeoutRef.current);
        detectTimeoutRef.current = null;
      }
      activeNdefRef.current = null;
      abortControllerRef.current = null;
      window.setTimeout(() => {
        setWriteStage('idle');
        setLockStage('idle');
      }, 3000);
    }
  };

  const cancelWrite = () => {
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current);
      detectTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (activeNdefRef.current) {
      try {
        (activeNdefRef.current as any).onreading = null;
        (activeNdefRef.current as any).onreadingerror = null;
      } catch {}
      activeNdefRef.current = null;
    }
    setIsWriting(false);
    setWriteStage('idle');
    pushNotice('info', 'Write canceled.');
  };

  const cancelLock = () => {
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current);
      detectTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (activeNdefRef.current) {
      try {
        (activeNdefRef.current as any).onreading = null;
        (activeNdefRef.current as any).onreadingerror = null;
      } catch {}
      activeNdefRef.current = null;
    }
    setIsLocking(false);
    setLockStage('idle');
    pushNotice('info', 'Lock canceled.');
  };

  const cancelWriteAndLock = () => {
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current);
      detectTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (activeNdefRef.current) {
      try {
        (activeNdefRef.current as any).onreading = null;
        (activeNdefRef.current as any).onreadingerror = null;
      } catch {}
      activeNdefRef.current = null;
    }
    setIsWriteAndLocking(false);
    setWriteStage('idle');
    setLockStage('idle');
    pushNotice('info', 'Write & lock canceled.');
  };

  const copyUrl = async () => {
    if (!nfcUrl) return;

    try {
      await navigator.clipboard.writeText(nfcUrl);
      pushNotice('success', 'NFC redirect URL copied to clipboard.');
    } catch {
      pushNotice('error', `Could not copy automatically. URL: ${nfcUrl}`);
    }
  };

  const openRedirectUrl = () => {
    if (!nfcUrl || typeof window === 'undefined') return;
    window.open(nfcUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-rose-600" />
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p className="text-lg font-semibold">Unable to open NFC lock tools</p>
          <p className="mt-2 text-sm">{error || 'Website not found.'}</p>
          <Link href="/admin/websites" className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
            Back to websites
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.08),_transparent_35%),linear-gradient(180deg,_#fff8fb_0%,_#ffffff_45%,_#fff4f6_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-500">NFC Studio</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{site.website_name || site.slug}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Use this screen for all NFC work on this website. You can write a rewritable tag, test the redirect URL, or permanently lock a tag once you are sure it is correct.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/websites/${site.id}/edit`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              Back to edit
            </Link>
            <Link href="/admin/websites" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              All websites
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Website status</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-lg font-semibold capitalize text-slate-900">{status}</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${canWriteNfc ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {canWriteNfc ? 'NFC allowed' : 'NFC blocked'}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Archived or expired websites cannot be written or locked from this screen.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Browser support</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{browserReady ? 'Web NFC ready' : 'Limited support'}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {browserReady
                ? 'This browser can write NFC tags.'
                : 'Use Android Chrome or Samsung Internet over HTTPS for direct NFC writing.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Permanent lock</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{canPermanentlyLock ? 'Supported' : 'Not supported here'}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {canPermanentlyLock
                ? 'This device/browser can attempt a permanent read-only lock.'
                : 'Permanent locking needs browser support for the Web NFC read-only API.'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Tag actions</h2>
                <p className="mt-2 text-base leading-7 text-slate-700">
                  Tap a physical NFC tag with your phone when prompted. Start with a rewritable write, verify it opens the correct page, then lock only when you are fully done.
                </p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${canWriteNfc ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {canWriteNfc ? 'Ready' : `Blocked: ${status}`}
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Redirect URL</p>
                  <p className="mt-1 text-sm text-slate-500">This is what gets written into the NFC tag.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyUrl}
                    className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={openRedirectUrl}
                    className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Open test page
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-800 shadow-sm">
                {nfcUrl}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Website slug</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{slug}</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recommended first step</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">Write rewritable tag and test it once before locking.</p>
                </div>
              </div>
            </div>

            {/* Live operation status for detecting / writing / locking */}
            {(writeStage !== 'idle' || lockStage !== 'idle') && (
              <div role="status" aria-live="polite" className="mt-4 rounded-lg border px-4 py-3 text-sm font-medium bg-white">
                {writeStage !== 'idle' && (
                  <div className={`flex items-start gap-3 ${
                    writeStage === 'error' ? 'text-rose-800' : writeStage === 'success' ? 'text-emerald-800' : 'text-sky-800'
                  }`}>
                    <div className="flex-1">
                      <p className="font-semibold">Write status</p>
                      <p className="mt-1 text-sm flex items-center gap-2">
                        {(writeStage === 'detecting' || writeStage === 'writing') && (
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-b-2 border-sky-400" aria-hidden="true" />
                        )}
                        {writeStage === 'detecting' && 'Detecting NFC tag — hold your phone near the tag.'}
                        {writeStage === 'detected' && 'Tag detected — starting write...'}
                        {writeStage === 'writing' && 'Writing to tag — keep the phone steady.'}
                        {writeStage === 'success' && 'Write successful — tag is rewritable.'}
                        {writeStage === 'error' && 'Write failed — check device permissions or try again.'}
                      </p>
                    </div>
                  </div>
                )}
                {lockStage !== 'idle' && (
                  <div className={`mt-3 flex items-start gap-3 ${
                    lockStage === 'error' ? 'text-rose-800' : lockStage === 'success' ? 'text-emerald-800' : 'text-sky-800'
                  }`}>
                    <div className="flex-1">
                      <p className="font-semibold">Lock status</p>
                      <p className="mt-1 text-sm flex items-center gap-2">
                        {(lockStage === 'detecting' || lockStage === 'locking') && (
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-b-2 border-sky-400" aria-hidden="true" />
                        )}
                        {lockStage === 'detecting' && 'Detecting NFC tag for locking — hold your phone near the tag.'}
                        {lockStage === 'detected' && 'Tag detected — preparing to lock.'}
                        {lockStage === 'locking' && 'Locking tag — do not move the phone.'}
                        {lockStage === 'success' && 'Tag locked successfully — now read-only.'}
                        {lockStage === 'error' && 'Lock failed — try again or check browser support.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-emerald-950">Write only</p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Recommended first</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-emerald-900">
                  Writes the site URL to the tag and keeps it rewritable. Use this when you still want the option to change the tag later.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                  <li>• Safest option for setup and testing</li>
                  <li>• Lets you rewrite the tag later if needed</li>
                </ul>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={writeRewritableTag}
                    disabled={!canWriteNfc || isWriting || isLocking || isWriteAndLocking}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {writeStage === 'detecting' ? 'Detecting NFC tag…' : writeStage === 'writing' ? 'Writing NFC tag…' : writeStage === 'success' ? 'Write successful' : 'Write rewritable tag'}
                    {(writeStage === 'detecting' || writeStage === 'writing') && (
                      <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white/70" aria-hidden="true" />
                    )}
                  </button>
                  {writeStage === 'detecting' && (
                    <button type="button" onClick={cancelWrite} className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-amber-950">Write and lock</p>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Permanent</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-amber-900">
                  Writes the current site URL and immediately makes the tag read-only so it cannot be overwritten again.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  <li>• Best only after you have tested the URL</li>
                  <li>• Neither you nor anyone else can rewrite the tag later</li>
                </ul>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={writeAndLockTag}
                    disabled={!canWriteNfc || !confirmPermanentLock || !canPermanentlyLock || isWriting || isLocking || isWriteAndLocking}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-200 disabled:text-amber-900 disabled:hover:bg-amber-200"
                  >
                    {(writeStage === 'detecting' || lockStage === 'detecting') ? 'Detecting NFC tag…' : (writeStage === 'writing' || lockStage === 'locking') ? 'Working…' : (isWriteAndLocking ? 'Writing and locking…' : 'Write URL and lock forever')}
                    {(writeStage === 'detecting' || lockStage === 'detecting' || writeStage === 'writing' || lockStage === 'locking') && (
                      <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white/70" aria-hidden="true" />
                    )}
                  </button>
                  {(writeStage === 'detecting' || lockStage === 'detecting') && (
                    <button type="button" onClick={cancelWriteAndLock} className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-rose-950">Lock an already-written tag</p>
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">Permanent</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-rose-900">
                Use this only if the tag already points to the correct URL and you want to make it read-only without writing again.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={lockExistingTag}
                  disabled={!canWriteNfc || !confirmPermanentLock || !canPermanentlyLock || isWriting || isLocking || isWriteAndLocking}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lockStage === 'detecting' ? 'Detecting NFC tag…' : lockStage === 'locking' ? 'Locking tag…' : lockStage === 'success' ? 'Locked' : 'Lock existing tag forever'}
                  {(lockStage === 'detecting' || lockStage === 'locking') && (
                    <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white/70" aria-hidden="true" />
                  )}
                </button>
                {lockStage === 'detecting' && (
                  <button type="button" onClick={cancelLock} className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {notice && (
              <div
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                  notice.tone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : notice.tone === 'error'
                      ? 'border-rose-200 bg-rose-50 text-rose-800'
                      : 'border-sky-200 bg-sky-50 text-sky-800'
                }`}
              >
                {notice.text}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-900">Device checklist</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span>Secure HTTPS page</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${capabilities.secureContext ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{capabilities.secureContext ? 'OK' : 'Missing'}</span>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span>Web NFC write support</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${capabilities.hasWebNfc ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{capabilities.hasWebNfc ? 'Supported' : 'Not supported'}</span>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span>Permanent lock support</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${capabilities.hasReadOnlySupport ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{capabilities.hasReadOnlySupport ? 'Supported' : 'Unavailable here'}</span>
                </div>
              </div>
              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={confirmPermanentLock}
                  onChange={(event) => setConfirmPermanentLock(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm font-medium leading-6 text-rose-900">
                  I understand the lock is permanent and this physical tag will never be rewritable again.
                </span>
              </label>
            </section>

            <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-900">Recommended flow</h2>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                <li>1. Write the tag while it is still rewritable.</li>
                <li>2. Use “Open test page” and also tap the physical tag with a second phone.</li>
                <li>3. If the destination is correct, enable the confirmation checkbox.</li>
                <li>4. Use one of the permanent lock actions only when you are fully done.</li>
              </ol>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}