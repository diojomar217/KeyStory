import { redirect } from 'next/navigation';

interface LegacyKeychainPrintRedirectProps {
  params: Promise<{ id: string }>;
}

export default async function LegacyKeychainPrintRedirect({ params }: LegacyKeychainPrintRedirectProps) {
  const { id } = await params;
  redirect(`/admin/websites/${id}/insert-print`);
}
