'use client';

import { Theme } from '@/lib/types';
import { GridSectionLayout } from '../../page/SectionLayouts';
import ScrollReveal from '../../ui/ScrollReveal';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

interface GuestMessagesSectionProps {
  theme: Theme;
  siteType?: 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
  messages?: GuestMessage[];
  variant?: 'default' | 'alt';
}

// Default messages as fallback
const defaultMessages: GuestMessage[] = [
  { id: '1', name: 'Friend 1', message: 'Wishing you both a lifetime of happiness!', date: '' },
  { id: '2', name: 'Family Member', message: 'So happy to see you both together!', date: '' },
];

export default function GuestMessagesSection({ 
  theme, 
  siteType = 'couple',
  messages,
  variant = 'default'
}: GuestMessagesSectionProps) {
  // Use provided messages or fallback to defaults
  const displayMessages = messages && messages.length > 0 ? messages : defaultMessages;

  const sectionTitle = siteType === 'birthday' ? 'Birthday Wishes' : 'Guest Messages';
  const sectionSubtitle = siteType === 'birthday'
    ? 'Birthday wishes from friends and family'
    : 'Messages from friends and family';
  const sectionIcon = siteType === 'birthday' ? '🥳' : '💬';

  return (
    <GridSectionLayout
      title={sectionTitle}
      subtitle={sectionSubtitle}
      icon={sectionIcon}
      theme={theme}
      variant={variant}
      id="guest-messages"
      gridCols="grid-cols-1 md:grid-cols-2"
      gap="gap-6"
    >
      {displayMessages.map((msg, index) => (
        <ScrollReveal key={msg.id} animation="fade-up" delay={index * 100}>
          <div
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-rose-100 dark:border-zinc-700 p-6 h-full"
          >
            <div className="flex items-start gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-rose-100 dark:bg-zinc-700"
              >
                <span className="font-bold text-rose-700 dark:text-rose-300">{msg.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-rose-900 dark:text-zinc-100">
                    {msg.name}
                  </span>
                  {msg.date && (
                    <span className="text-sm text-rose-500 dark:text-zinc-400">
                      • {msg.date}
                    </span>
                  )}
                </div>
                <p className="text-rose-600 dark:text-zinc-400">{msg.message}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </GridSectionLayout>
  );
}

