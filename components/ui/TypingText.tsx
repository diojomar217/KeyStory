'use client';

import { useState, useEffect, useRef } from 'react';

type Props = {
  text: string;
  speed?: number;
  className?: string;
};

export default function TypingText({ text, speed = 50, className = '' }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;

    const typeText = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeText, speed + Math.random() * 20);
      } else {
        setIsComplete(true);
      }
    };

    // Start typing after a short delay
    timeoutRef.current = setTimeout(typeText, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-5 md:h-6 ml-0.5 align-middle animate-pulse bg-current" />
      )}
    </span>
  );
}

