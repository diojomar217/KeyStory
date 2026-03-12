'use client';

import { Theme } from '@/lib/types';
import Section from '../Section';
import ScrollReveal from '../ScrollReveal';

interface OurStorySectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  story?: string;
  variant?: 'default' | 'alt';
}

export default function OurStorySection({ 
  theme, 
  customerName, 
  partnerName,
  story,
  variant = 'default'
}: OurStorySectionProps) {
  const defaultStory = `This is the story of ${customerName} and ${partnerName}...
  
  Every love story is beautiful, but theirs is their favorite. From the moment they met, something special began. It was like finding the missing piece of a puzzle they didn't know was incomplete.
  
  Through sunny days and rainy afternoons, through laughter and tears, their bond grew stronger with each passing moment. They learned that love isn't about perfection—it's about choosing each other every single day.
  
  This is just the beginning of their forever.`;

  return (
    <Section
      title="Our Story"
      subtitle="The beautiful journey of us"
      icon="📖"
      theme={theme}
      variant={variant}
      id="our-story"
    >
      <ScrollReveal animation="fade-up">
        <div className="prose prose-lg max-w-none">
          {(story || defaultStory).split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}

