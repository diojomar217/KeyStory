import { Metadata } from 'next';
import { getPublicSiteBySlugNoCache } from '@/lib/site-data';
import { getBusinessContactSettings } from '@/lib/business-contact-settings';
import { getRsvpsBySiteId } from '@/lib/db/rsvps';
import HostHeader from '@/components/host/HostHeader';
import HostDashboardClient from '@/components/host/HostDashboardClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `RSVPs — ${slug}` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getPublicSiteBySlugNoCache(slug);

  if (!site) {
    return <div className="p-6">Page not found</div>;
  }

  const siteId = site.id as string;
  const rsvps = await getRsvpsBySiteId(siteId);

  const cfg: any = site.config || {};
  const title = cfg.eventTitle || (cfg.childName ? `${cfg.childName}'s Baptism` : site.website_name || slug);
  const dateDisplay = cfg.eventDate ? `${cfg.eventDate}${cfg.eventTime ? ' • ' + cfg.eventTime : ''}` : undefined;
  const parents = cfg.parentsNames || cfg.parents || '';
  const subtitle = cfg.subtitle || cfg.invitationMessage || '';

  // Server-side debug: log rsvps count for this host page render
  try {
    // eslint-disable-next-line no-console
    console.log('server: host page rsvps', { siteId, count: (rsvps || []).length });
  } catch (e) {}

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mt-6">
          <HostDashboardClient initialRsvps={rsvps} slug={slug} siteId={siteId} analyticsEnabled={(await getBusinessContactSettings())?.analyticsEnabled ?? null} />
        </div>
      </div>
    </div>
  );
}
