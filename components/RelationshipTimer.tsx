// components/RelationshipTimer.tsx
'use client';
import { useEffect, useState } from 'react';

type Props = {
  anniversary: string;
};

export default function RelationshipTimer({ anniversary }: Props) {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(anniversary);
      const now = new Date();
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      setDuration(`${years} years, ${months} months, ${days} days together`);
    }, 1000);
    return () => clearInterval(interval);
  }, [anniversary]);

  return <div className="text-pink-600 font-semibold animate-fade-in">{duration}</div>;
}
