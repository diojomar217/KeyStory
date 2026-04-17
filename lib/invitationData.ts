export type ScheduleItem = {
  time: string;
  title: string;
  description?: string;
};

export type DressCode = {
  label: string;
  colors: string[];
};

export type InvitationData = {
  slug?: string;
  name: string;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  venue?: string;
  reception?: string;
  address?: string;
  schedule?: ScheduleItem[];
  dressCode?: DressCode[];
  gallery?: string[];
  mapUrl?: string;
  parents?: string;
  message?: string;
  godparentMessage?: string;
};

export const baptismExample: InvitationData = {
  slug: 'isabella-baptism',
  name: 'Isabella Grace',
  title: 'Baptism & Birthday',
  subtitle: 'A celebration of love and blessing',
  date: 'Sunday, June 14, 2026',
  time: '2:00 PM',
  venue: "St. Mary’s Church",
  reception: 'The Garden Hall',
  address: '123 Church St, Your City',
  schedule: [
    { time: '2:00 PM', title: 'Ceremony', description: 'Baptism at St. Mary’s Church' },
    { time: '3:00 PM', title: 'Photo Session', description: 'Garden photos and family portraits' },
    { time: '4:00 PM', title: 'Reception', description: 'Light refreshments at The Garden Hall' },
  ],
  dressCode: [
    { label: 'Pastel Elegance', colors: ['#f8d7da', '#e5989b', '#fff5f5'] },
    { label: 'Soft Neutrals', colors: ['#f7efe9', '#efe6e2', '#fdf6f5'] },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop',
  ],
  mapUrl: 'https://maps.google.com/?q=123+Church+St',
  parents: 'Anna & Michael Rosario',
  message:
    'You are warmly invited to the baptism and birthday celebration of our daughter, Isabella Grace. Join us for a day of prayer, family, and love.',
  godparentMessage: 'Godparents are kindly asked to arrive 15 minutes early for a short blessing.',
};

export default baptismExample;
