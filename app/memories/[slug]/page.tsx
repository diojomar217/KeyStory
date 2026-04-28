import GuestUploader from '@/components/guest/GuestUploader';

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <GuestUploader slug={slug} />;
}
