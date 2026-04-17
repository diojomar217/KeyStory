import React from 'react';

type Props = {
  title?: string;
  date?: string;
  parents?: string;
  subtitle?: string;
};

export default function HostHeader({ title, date, parents, subtitle }: Props) {
  const displayTitle = title || (parents ? `${parents}'s Celebration` : 'Event');

  return (
    <div className="bg-gradient-to-br from-rose-50/80 via-pink-50 to-white rounded-2xl p-6 md:p-8 shadow-sm text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl md:text-4xl text-rose-600 leading-tight">{displayTitle}</h1>
        {subtitle && <p className="mt-2 text-sm text-rose-400">{subtitle}</p>}
        {(date || parents) && (
          <div className="mt-3 text-sm text-slate-500">
            {date && <span className="block">{date}</span>}
            {!date && parents && <span>{parents}</span>}
            {date && parents && <span className="block mt-1">Hosted by {parents}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
