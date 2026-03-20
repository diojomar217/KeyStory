import ArchivedStateView from './ArchivedStateView';
import { getBusinessContactSettings } from '@/lib/business-contact-settings';

type Props = {
  websiteName?: string;
  status: 'expired' | 'archived';
  expiresAt?: string;
  slug: string;
  siteType?: string;
};

export default async function ExpiredSitePage({ websiteName, status, expiresAt, slug, siteType }: Props) {
  const settings = await getBusinessContactSettings();

  if (status === 'archived') {
    return <ArchivedStateView slug={slug} siteName={websiteName} expiresAt={expiresAt} siteType={siteType} status="archived" settings={settings} />;
  }

  const expiresFormatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <ArchivedStateView
      slug={slug}
      siteName={websiteName}
      expiresAt={expiresAt}
      siteType={siteType}
      status="expired"
      settings={settings}
    />
  );
}
