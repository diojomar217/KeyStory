'use client';

import { useState, FormEvent } from 'react';
import type { GuestMessage, GuestMessageRecord } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import { GridSectionLayout } from '../../page/SectionLayouts';
import ScrollReveal from '../../ui/ScrollReveal';

interface GuestMessagesSectionProps {
  theme: ThemeKey;
  siteType?: 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
  messages?: GuestMessage[]; // fallback/legacy messages
  approvedMessages?: GuestMessageRecord[]; // from DB
  slug?: string;
  variant?: 'default' | 'alt';
}

const maxNameLength = 50;
const maxMessageLength = 500;

export default function GuestMessagesSection({
  theme,
  siteType = 'couple',
  messages,
  approvedMessages,
  slug,
  variant = 'default',
}: GuestMessagesSectionProps) {
  const initialMessages: GuestMessageRecord[] = approvedMessages && approvedMessages.length > 0
    ? approvedMessages
    : (messages || []).map((item) => ({
      id: item.id,
      site_id: '',
      name: item.name,
      message: item.message,
      status: 'approved',
      created_at: item.date || new Date().toISOString(),
    }));

  const [guestMessages, setGuestMessages] = useState<GuestMessageRecord[]>(initialMessages);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const sectionTitle = siteType === 'birthday' ? 'Birthday Wishes' : 'Guest Messages';
  const sectionSubtitle = siteType === 'birthday'
    ? 'Birthday wishes from friends and family'
    : 'Messages from friends and family';
  const sectionIcon = siteType === 'birthday' ? '🥳' : '💬';
  const styles = useTheme(theme);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setFeedback('Name and message are required.');
      setStatus('error');
      return;
    }

    if (trimmedName.length > maxNameLength) {
      setFeedback(`Name cannot exceed ${maxNameLength} characters.`);
      setStatus('error');
      return;
    }

    if (trimmedMessage.length > maxMessageLength) {
      setFeedback(`Message cannot exceed ${maxMessageLength} characters.`);
      setStatus('error');
      return;
    }

    if (!slug) {
      setFeedback('Site slug is required to submit a message.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const response = await fetch('/api/guest-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: trimmedName, message: trimmedMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit message');
      }

      setName('');
      setMessage('');
      setStatus('success');
      setFeedback('Your message was sent and is awaiting approval.');

      // Do not show pending message until approved
      // if you want to show guest messages instantly, append here (optional)

    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedback((err as Error).message || 'Failed to submit your message.');
    }
  };

  return (
    <GridSectionLayout
      id="guest-messages"
      title={sectionTitle}
      subtitle={sectionSubtitle}
      icon={sectionIcon}
      theme={theme}
      variant={variant}
      bgClass={variant === 'alt' ? styles.sectionBgAlt : styles.sectionBg}
      gridCols="grid-cols-1 xl:grid-cols-[1.9fr_1fr]"
      gap="gap-6"
      >
      <div className="space-y-4">
        {guestMessages.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700 p-6">
            <p className="text-slate-600 dark:text-zinc-300">No guest messages yet. Be the first to leave one!</p>
          </div>
        ) : (
          guestMessages.map((msg, index) => (
            <ScrollReveal key={msg.id} animation="fade-up" delay={index * 80}>
              <article className="bg-white dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-zinc-700 flex items-center justify-center text-rose-700 dark:text-rose-300 font-semibold">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-rose-900 dark:text-zinc-100 font-semibold">{msg.name}</p>
                    <p className="text-sm text-rose-500 dark:text-zinc-400">{new Date(msg.created_at).toLocaleDateString()}</p>
                    <p className="mt-2 text-rose-600 dark:text-zinc-300 whitespace-pre-line">{msg.message}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))
        )}
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700 p-6">
        <h3 className="font-semibold text-slate-800 dark:text-zinc-100">Leave a message</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Your note will be reviewed by the site owner before going public.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="guest-name" className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Name</label>
            <input
              id="guest-name"
              type="text"
              maxLength={maxNameLength}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="guest-message" className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Message</label>
            <textarea
              id="guest-message"
              maxLength={maxMessageLength}
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[120px]"
              required
            />
            <div className="text-right text-xs text-slate-500"><span>{message.trim().length}</span> / {maxMessageLength}</div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 px-4 text-sm font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Message'}
          </button>

          {feedback && (
            <p className={`text-sm ${status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{feedback}</p>
          )}
        </form>
      </div>
    </GridSectionLayout>
  );
}

