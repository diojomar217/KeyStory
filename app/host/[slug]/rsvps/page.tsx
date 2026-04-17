import { Metadata } from 'next';
import { getPublicSiteBySlug } from '@/lib/site-data';
import { getRsvpsBySiteId } from '@/lib/db/rsvps';
import HostHeader from '@/components/host/HostHeader';
import HostDashboardClient from '@/components/host/HostDashboardClient';

export const revalidate = 20;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { title: `RSVPs — ${params.slug}` };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const site = await getPublicSiteBySlug(slug);
  if (!site) return <div className="p-6">Page not found</div>;

  const siteId = site.id as string;
  const rsvps = await getRsvpsBySiteId(siteId);

  const cfg: any = site.config || {};
  const title = cfg.eventTitle || (cfg.childName ? `${cfg.childName}'s Baptism` : site.website_name || slug);
  const dateDisplay = cfg.eventDate ? `${cfg.eventDate}${cfg.eventTime ? ' • ' + cfg.eventTime : ''}` : undefined;
  const parents = cfg.parentsNames || cfg.parents || '';
  const subtitle = cfg.subtitle || cfg.invitationMessage || '';

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <HostHeader title={title} date={dateDisplay} parents={parents} subtitle={subtitle} />

      <div className="mt-6">
        {/* Client dashboard handles filtering, refresh, and list rendering */}
        {/* initialRsvps passed for immediate render, dashboard will re-fetch from /api/rsvp */}
        <HostDashboardClient initialRsvps={rsvps} slug={slug} />
      </div>
    </div>
  );
}
