import { useEffect, useState, useCallback } from 'react';

export function useTypewriter(text: string, speed = 100) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    setIsComplete(false);

    const timer = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;

      if (i > text.length) {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
}

