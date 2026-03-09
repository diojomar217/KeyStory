// app/love/[slug]/page.tsx
import { supabase, Order } from '@/lib/supabase';
import RelationshipTimer from '@/components/RelationshipTimer';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import TimelineDisplay from '@/components/TimelineDisplay';

export default async function LovePage({ params }: { params: { slug: string } }) {
  const { slug: website_name } = await params; // using slug param as website_name
  const { data, error } = await supabase.from('orders').select('*').eq('website_name', website_name).maybeSingle();
  if (error) {
    console.error('supabase fetch error', error);
    return <div className="text-center mt-10 text-red-500">An error occurred loading this page.</div>;
  }
  if (!data) {
    return <div className="text-center mt-10 text-red-500">Couple page not found or the slug is invalid.</div>;
  }

  const config = data.config || {};
  // simple theme class mapping
  const themeClasses: Record<string, string> = {
    romantic_classic: 'bg-pink-50 text-pink-700',
    cute_pastel: 'bg-blue-50 text-blue-700',
    minimal_modern: 'bg-white text-gray-900',
    dark_elegant: 'bg-gray-900 text-gray-100',
  };

  const baseClasses = themeClasses[config.theme || 'romantic_classic'] || '';

  return (
    <div className={`${baseClasses} min-h-screen p-4 animate-fade-in`}>      
      <div className="max-w-2xl mx-auto">
        {/* Home section */}
        <h1 className="text-3xl font-bold text-center mb-2">
          {data.customer_name} &amp; {data.partner_name}
        </h1>
        <div className="text-center mb-4">
          <span className="font-medium">Anniversary:</span> {data.anniversary_date}
          <RelationshipTimer anniversary={data.anniversary_date} />
        </div>

        {config.sections?.includes('gallery') && (
          <PhotoGallery photos={data.photos || []} />
        )}

        <div className="my-6 text-center italic text-lg animate-fade-in">
          {data.message}
        </div>

        {config.sections?.includes('timeline') && (
          <div className="my-6">
            <h2 className="text-2xl font-semibold mb-2">Our Timeline</h2>
            <TimelineDisplay events={config.timeline_events || []} />
          </div>
        )}

        {data.song_link && config.sections?.includes('home') && (
          <MusicPlayer songLink={data.song_link} />
        )}
      </div>
    </div>
  );
}
