// app/love/[slug]/page.tsx
import { supabase, Order } from '@/lib/supabase';
import RelationshipTimer from '@/components/RelationshipTimer';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';

export default async function LovePage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase.from('orders').select('*').eq('slug', params.slug).single();
  if (error) {
    console.error(error);
    return <div className="text-center mt-10 text-red-500">An error occurred loading this page.</div>;
  }
  if (!data) {
    return <div className="text-center mt-10 text-red-500">Couple page not found or the slug is invalid.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-2">{data.customer_name} &amp; {data.partner_name}</h1>
      <div className="text-center mb-4">
        <span className="font-medium">Anniversary:</span> {data.anniversary_date}
        <RelationshipTimer anniversary={data.anniversary_date} />
      </div>
      <PhotoGallery photos={data.photos || []} />
      <div className="my-6 text-center italic text-lg text-pink-700 animate-fade-in">
        {data.message}
      </div>
      <MusicPlayer songLink={data.song_link} />
    </div>
  );
}
