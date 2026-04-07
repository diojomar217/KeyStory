import ArchivedStateView from './ArchivedStateView';
import { getBusinessContactSettings } from '@/lib/business-contact-settings';

type Props = {
  websiteName?: string;
  status: 'expired' | 'archived';
  expiresAt?: string;
  siteSlug: string;
  siteType?: string;
};

export default async function ExpiredSitePage({
  websiteName,
  status,
  expiresAt,
  siteSlug,
  siteType,
}: Props) {
  const settings = await getBusinessContactSettings();

  return (
    <ArchivedStateView
      slug={siteSlug}
      siteName={websiteName}
      expiresAt={expiresAt}
      siteType={siteType}
      status={status}
      settings={settings}
    />
  );
}