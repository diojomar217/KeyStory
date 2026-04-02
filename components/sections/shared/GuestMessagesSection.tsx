'use client';

import { useState, FormEvent } from 'react';
import type { GuestMessage, GuestMessageRecord, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import { GridSectionLayout } from '../../page/SectionLayouts';
import ScrollReveal from '../../ui/ScrollReveal';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';

interface GuestMessagesSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
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
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

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
      bgClass={`${spacingClass} ${variant === 'alt' ? styles.sectionBgAlt : styles.sectionBg}`}
      gridCols="grid-cols-1 xl:grid-cols-[1.9fr_1fr]"
      gap="gap-6"
      >
      <div className="space-y-4">
        {guestMessages.length === 0 ? (
          <div
            className={`${styles.card} ${cardStyle} ${shadowClass} border p-6`}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p style={{ color: colors.text }}>No guest messages yet. Be the first to leave one!</p>
          </div>
        ) : (
          guestMessages.map((msg, index) => (
            <ScrollReveal key={msg.id} animation="fade-up" delay={index * 80}>
              <article
                className={`${styles.card} ${cardStyle} ${shadowClass} border p-6`}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.primary,
                    }}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-semibold ${headingFontClass}`} style={{ color: colors.text }}>{msg.name}</p>
                    <p className="text-sm" style={{ color: colors.text }}>{new Date(msg.created_at).toLocaleDateString()}</p>
                    <p className="mt-2 whitespace-pre-line" style={{ color: colors.text }}>{msg.message}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))
        )}
      </div>

      <ScrollReveal animation="fade-up" delay={120}>
        <div
          className={`${styles.card} ${cardStyle} ${shadowClass} border p-6`}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <h3 className={`font-semibold ${headingFontClass}`} style={{ color: colors.text }}>Leave a message</h3>
          <p className="text-sm mb-4" style={{ color: colors.text }}>Your note will be reviewed by the site owner before going public.</p>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label htmlFor="guest-name" className="block text-sm font-medium" style={{ color: colors.text }}>Name</label>
              <input
                id="guest-name"
                type="text"
                maxLength={maxNameLength}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="guest-message" className="block text-sm font-medium" style={{ color: colors.text }}>Message</label>
              <textarea
                id="guest-message"
                maxLength={maxMessageLength}
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none min-h-[120px]"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                }}
                required
              />
              <div className="text-right text-xs" style={{ color: colors.text }}><span>{message.trim().length}</span> / {maxMessageLength}</div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex justify-center items-center rounded-xl py-2 px-4 text-sm font-semibold hover:opacity-95 focus:outline-none disabled:opacity-50"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                color: colors.background,
              }}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Message'}
            </button>

            {feedback && (
              <p className="text-sm" style={{ color: status === 'success' ? colors.secondary : colors.accent }}>{feedback}</p>
            )}
          </form>
        </div>
      </ScrollReveal>
    </GridSectionLayout>
  );
}

