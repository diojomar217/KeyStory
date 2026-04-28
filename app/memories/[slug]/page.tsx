import GuestUploader from '@/components/guest/GuestUploader';

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  const { slug } = params;
  return <GuestUploader slug={slug} />;
}
