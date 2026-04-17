import { Metadata } from 'next';
import { getSiteById } from '@/lib/supabase';
import { getRsvpsBySiteId } from '@/lib/db/rsvps';
import RsvpAdminClient from '@/components/admin/RsvpAdminClient';

export const revalidate = 10;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const site = await getSiteById(params.id);
  return { title: `RSVPs — ${site?.website_name || params.id}` };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const site = await getSiteById(id);
  if (!site) {
    return <div className="p-8">Site not found</div>;
  }

  const rsvps = await getRsvpsBySiteId(id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">RSVPs — {site.website_name || id}</h1>
      <div className="mb-6">
        <RsvpAdminClient siteId={id} initialRsvps={rsvps} />
      </div>
    </div>
  );
}
