'use client';

import { useState, FormEvent } from 'react';
import type { GuestMessage, GuestMessageRecord, OccasionType, SectionAsset } from '@/lib/types';
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
import { getOccasionPublicCopy } from '@/lib/public-site-copy';

interface GuestMessagesSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  messages?: GuestMessage[]; // fallback/legacy messages
  approvedMessages?: GuestMessageRecord[]; // from DB
  slug?: string;
  variant?: 'default' | 'alt';
  assets?: SectionAsset;
}

const maxNameLength = 50;
const maxMessageLength = 500;

function formatMessageDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const dayDiff = Math.floor(diffMs / dayMs);

  if (dayDiff <= 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return `${dayDiff} days ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

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

  const publicCopy = getOccasionPublicCopy(siteType);
  const guestbookCopy = publicCopy.guestbook;
  const sectionTitle = guestbookCopy.title;
  const sectionSubtitle = guestbookCopy.subtitle;
  const sectionIcon = guestbookCopy.icon;
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const messageCount = guestMessages.length;

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
      setFeedback(guestbookCopy.successFeedback);

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
        <div
          className={`${styles.card} ${cardStyle} ${shadowClass} border p-4`}
          style={{
            backgroundColor: `${colors.secondary}22`,
            borderColor: colors.border,
          }}
        >
          <p className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: colors.primary }}>
            Guestbook Highlights
          </p>
          <p className="mt-1 text-sm" style={{ color: colors.text }}>
            {messageCount > 0
              ? `${messageCount} ${messageCount === 1 ? 'message has' : 'messages have'} been approved and shared.`
              : 'No approved messages yet. Be the first to leave a note.'}
          </p>
        </div>

        {guestMessages.length === 0 ? (
          <div
            className={`${styles.card} ${cardStyle} ${shadowClass} border p-6`}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p style={{ color: colors.text }}>{guestbookCopy.emptyState}</p>
          </div>
        ) : (
          guestMessages.map((msg, index) => (
            <ScrollReveal key={msg.id} animation="fade-up" delay={index * 80}>
              <article
                className={`${styles.card} ${cardStyle} ${shadowClass} border p-6 relative overflow-hidden`}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="absolute top-0 left-0 h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                  }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-semibold shadow-md"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.primary,
                    }}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`font-semibold ${headingFontClass}`} style={{ color: colors.text }}>{msg.name}</p>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${colors.secondary}66`,
                          color: colors.primary,
                        }}
                      >
                        {guestbookCopy.badgeLabel}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: colors.text }}>{formatMessageDate(msg.created_at)}</p>
                    <p className="mt-3 whitespace-pre-line leading-relaxed" style={{ color: colors.text }}>
                      <span className="text-lg mr-1" style={{ color: colors.accent }}>&ldquo;</span>
                      {msg.message}
                      <span className="text-lg ml-1" style={{ color: colors.accent }}>&rdquo;</span>
                    </p>
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
          <h3 className={`font-semibold ${headingFontClass}`} style={{ color: colors.text }}>{guestbookCopy.formTitle}</h3>
          <p className="text-sm mb-4" style={{ color: colors.text }}>{guestbookCopy.reviewNotice}</p>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label htmlFor="guest-name" className="block text-sm font-medium" style={{ color: colors.text }}>{guestbookCopy.nameLabel}</label>
              <input
                id="guest-name"
                type="text"
                maxLength={maxNameLength}
                placeholder={guestbookCopy.namePlaceholder}
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
              <div className="mt-1 text-right text-xs" style={{ color: colors.text }}>
                {name.trim().length} / {maxNameLength}
              </div>
            </div>

            <div>
              <label htmlFor="guest-message" className="block text-sm font-medium" style={{ color: colors.text }}>{guestbookCopy.messageLabel}</label>
              <textarea
                id="guest-message"
                maxLength={maxMessageLength}
                placeholder={guestbookCopy.messagePlaceholder}
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
              <div className="mt-2 h-1 w-full rounded-full" style={{ backgroundColor: `${colors.border}80` }}>
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((message.trim().length / maxMessageLength) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                  }}
                />
              </div>
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
              {status === 'loading' ? 'Submitting...' : guestbookCopy.submitLabel}
            </button>

            {feedback && (
              <div
                className="rounded-xl border px-3 py-2 text-sm"
                style={{
                  borderColor: status === 'success' ? `${colors.secondary}99` : `${colors.accent}99`,
                  backgroundColor: status === 'success' ? `${colors.secondary}1f` : `${colors.accent}1a`,
                  color: status === 'success' ? colors.secondary : colors.accent,
                }}
              >
                {feedback}
              </div>
            )}
          </form>
        </div>
      </ScrollReveal>
    </GridSectionLayout>
  );
}

