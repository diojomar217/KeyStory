import { supabase } from '@/lib/supabase';
import PhotoAdminList from '@/components/admin/PhotoAdminList';

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const { id } = params;
  const { data: photos, error } = await supabase
    .from('guest_photos')
    .select('*')
    .eq('site_id', id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending guest photos', error);
    return <div className="p-4">Failed to load pending photos.</div>;
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold">Pending Guest Photos</h1>
      <PhotoAdminList initial={(photos || []) as any} />
    </main>
  );
}
