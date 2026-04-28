'use client';

import React from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  content?: string;
  guidelines?: string[];
  contactName?: string;
  contactPhone?: string;
  pdfUrl?: string;
  items?: { id?: string; title?: string; description?: string; imageUrl?: string }[];
};

export default function SafetyProtocolSection({
  theme,
  content = '',
  guidelines = [],
  contactName,
  contactPhone,
  pdfUrl,
  items = [],
}: Props) {
  const themeUtils = useThemeUtils(theme);
  const { colors } = themeUtils;

  const normalizedGuidelines = Array.isArray(guidelines)
    ? guidelines.map((g) => g?.trim()).filter(Boolean)
    : [];

  const hasHtmlContent = Boolean(content && content.trim());

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      id="safety-protocol"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="🦺"
            title="Gentle Reminders"
            subtitle="A few gentle reminders to keep everyone safe and comfortable."
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={80}>
          <div className="relative mx-auto mt-10 max-w-5xl">
            <div
              className="relative overflow-hidden rounded-[30px] border shadow-[0_24px_80px_rgba(15,23,42,0.10)] md:rounded-[36px]"
              style={{
                background: `linear-gradient(180deg, ${colors.card}f6, ${colors.card})`,
                borderColor: `${colors.border}b8`,
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at top left, ${colors.secondary}12 0%, transparent 28%),
                    radial-gradient(circle at bottom right, ${colors.secondary}10 0%, transparent 24%)
                  `,
                }}
              />

              <div className="relative grid gap-8 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:px-10 md:py-10 lg:px-12 lg:py-12">
                <div className="flex flex-col justify-center">
                  <div
                    className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      backgroundColor: `${colors.secondary}18`,
                      color: colors.primary,
                    }}
                  >
                    Event Reminder
                  </div>

                  <h3
                    className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl"
                    style={{ color: colors.text }}
                  >
                    Please help us keep the celebration safe and comfortable for everyone
                  </h3>

                  <p
                    className="mt-4 text-sm leading-7 sm:text-base"
                    style={{ color: `${colors.text}cc` }}
                  >
                    We kindly ask all guests to follow the simple reminders.
                    These guidelines help us create a safe, joyful, and worry-free event for
                    the celebrant, family, and guests.
                  </p>

                  {normalizedGuidelines.length > 0 && (
                    <div className="mt-6">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: colors.primary }}
                      >
                        Quick Guidelines
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {normalizedGuidelines.map((g, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border px-4 py-3 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                            style={{
                              background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f0)`,
                              borderColor: `${colors.border}90`,
                              color: `${colors.text}d9`,
                            }}
                          >
                            <span
                              className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: `${colors.secondary}20`,
                                color: colors.primary,
                              }}
                            >
                              {i + 1}
                            </span>
                            {g}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(contactName || contactPhone || pdfUrl) && (
                    <div
                      className="mt-8 rounded-[24px] border px-4 py-4 sm:px-5"
                      style={{
                        background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f2)`,
                        borderColor: `${colors.border}88`,
                      }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p
                            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                            style={{ color: colors.primary }}
                          >
                            Need help?
                          </p>

                          {contactName && (
                            <p
                              className="mt-2 text-sm font-medium"
                              style={{ color: colors.text }}
                            >
                              Contact: {contactName}
                            </p>
                          )}

                          {contactPhone && (
                            <p
                              className="mt-1 text-sm"
                              style={{ color: `${colors.text}cc` }}
                            >
                              📞 {contactPhone}
                            </p>
                          )}
                        </div>

                        {pdfUrl && (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02]"
                            style={{
                              backgroundColor: colors.primary,
                              color: '#ffffff',
                            }}
                          >
                            View Safety Document
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <div
                    className="w-full max-w-[430px] rounded-[30px] border p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-5"
                    style={{
                      background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f3)`,
                      borderColor: `${colors.border}b8`,
                    }}
                  >
                    {items && items.length > 0 ? (
                      <div className="grid gap-4">
                        {items.map((it, idx) => (
                          <div key={it.id || idx} className="flex gap-4 items-start">
                            {it.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={it.imageUrl} alt={it.title || `safety-${idx}`} className="w-24 h-24 object-cover rounded-lg" />
                            ) : (
                              <div className="w-24 h-24 flex items-center justify-center rounded-lg text-2xl" style={{ background: `${colors.secondary}10` }}>{'🦺'}</div>
                            )}

                            <div>
                              <div className="text-sm font-semibold" style={{ color: colors.text }}>{it.title}</div>
                              {it.description && (
                                <div className="mt-1 text-xs" style={{ color: `${colors.text}cc` }}>{it.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : hasHtmlContent ? (
                      <div
                        className="safety-html-block"
                        style={{
                          color: colors.text,
                        }}
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ) : (
                      <div
                        style={{
                          maxWidth: '420px',
                          margin: '0 auto',
                        }}
                      >
                        <div
                          style={{
                            background: '#efe6e1',
                            borderRadius: '28px',
                            padding: '18px',
                          }}
                        >
                          <div
                            style={{
                              background: '#d7c0b5',
                              borderRadius: '28px',
                              padding: '28px 24px',
                              textAlign: 'center',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: 600,
                                color: '#5f3b46',
                                marginBottom: '20px',
                              }}
                            >
                              Safety Protocols
                            </div>

                            <div style={{ marginBottom: '28px' }}>
                              <div style={{ fontSize: '42px', lineHeight: 1 }}>😷</div>
                              <div
                                style={{
                                  marginTop: '10px',
                                  fontSize: '20px',
                                  color: '#5c4340',
                                }}
                              >
                                Wear your mask
                              </div>
                            </div>

                            <div style={{ marginBottom: '28px' }}>
                              <div style={{ fontSize: '42px', lineHeight: 1 }}>🧴</div>
                              <div
                                style={{
                                  marginTop: '10px',
                                  fontSize: '20px',
                                  color: '#5c4340',
                                }}
                              >
                                Sanitize your hands
                              </div>
                            </div>

                            <div style={{ marginBottom: '28px' }}>
                              <div style={{ fontSize: '42px', lineHeight: 1 }}>🚭</div>
                              <div
                                style={{
                                  marginTop: '10px',
                                  fontSize: '20px',
                                  color: '#5c4340',
                                }}
                              >
                                No Smoking / Vaping
                              </div>
                            </div>

                            <div>
                              <div style={{ fontSize: '42px', lineHeight: 1 }}>💋🚫</div>
                              <div
                                style={{
                                  marginTop: '10px',
                                  fontSize: '20px',
                                  color: '#5c4340',
                                }}
                              >
                                No Kissing to Ellie
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}