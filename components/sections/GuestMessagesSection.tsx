'use client';

import { Theme } from '@/lib/types';
import Section from '../Section';
import ScrollReveal from '../ScrollReveal';
import { useTheme } from '../ThemeWrapper';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

interface GuestMessagesSectionProps {
  theme: Theme;
  messages?: GuestMessage[];
  variant?: 'default' | 'alt';
}

const defaultMessages: GuestMessage[] = [
  { id: '1', name: 'Friend 1', message: 'Wishing you both a lifetime of happiness!', date: '' },
  { id: '2', name: 'Family Member', message: 'So happy to see you both together!', date: '' },
];

export default function GuestMessagesSection({ 
  theme, 
  messages = defaultMessages,
  variant = 'default'
}: GuestMessagesSectionProps) {
  const styles = useTheme(theme);

  return (
    <Section
      title="Guest Messages"
      subtitle="Messages from friends and family"
      icon="💬"
      theme={theme}
      variant={variant}
      id="guest-messages"
    >
      <div className="grid gap-6">
        {messages.map((msg, index) => (
          <ScrollReveal key={msg.id} animation="fade-up" delay={index * 100}>
            <div
              className={`${styles.card} rounded-2xl ${styles.cardBorder} border p-6`}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: styles.accentLight.split(' ')[0].replace('bg-', '') ? styles.accentLight : '#fce7f3' }}
                >
                  <span style={{ color: styles.text.split(' ')[0] || '#be185d' }} className="font-bold">{msg.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-bold ${styles.text}`}>
                      {msg.name}
                    </span>
                    {msg.date && (
                      <span className={`text-sm ${styles.textMuted}`}>
                        • {msg.date}
                      </span>
                    )}
                  </div>
                  <p className={styles.textMuted}>{msg.message}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

