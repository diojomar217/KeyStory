'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

interface GuestMessagesSectionProps {
  theme: Theme;
  messages?: GuestMessage[];
}

const defaultMessages: GuestMessage[] = [
  { id: '1', name: 'Friend 1', message: 'Wishing you both a lifetime of happiness!', date: '' },
  { id: '2', name: 'Family Member', message: 'So happy to see you both together!', date: '' },
];

export default function GuestMessagesSection({ theme, messages = defaultMessages }: GuestMessagesSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-8"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          💬 Guest Messages
        </h2>
        
        <p 
          className="text-center mb-8"
          style={{ color: colors.text }}
        >
          Messages from friends and family
        </p>
        
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-6 rounded-2xl"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <span style={{ color: colors.primary }}>{msg.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="font-bold"
                      style={{ 
                        color: colors.primary,
                        fontFamily: typography.headingFont
                      }}
                    >
                      {msg.name}
                    </span>
                    {msg.date && (
                      <span className="text-sm" style={{ color: colors.accent }}>
                        • {msg.date}
                      </span>
                    )}
                  </div>
                  <p style={{ color: colors.text }}>{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

