'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import WebsiteContentForm from '@/components/order/WebsiteContentForm';
import { getTemplateById } from '@/components/templates/templateData';
import { OccasionType } from '@/lib/types';

const KNOWN_OCCASIONS: OccasionType[] = ['couple', 'wedding', 'birthday', 'proposal', 'anniversary', 'graduation', 'baby_shower', 'debut', 'memorial', 'family', 'friendship', 'travel', 'valentines', 'mothers_day', 'fathers_day'];

const asOccasion = (value: string | null): OccasionType | null => {
  if (!value) return null;
  return KNOWN_OCCASIONS.includes(value as OccasionType) ? (value as OccasionType) : null;
};

export default function CreatePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const selectedOccasion = asOccasion(searchParams.get('occasion'));
  const selectedProductLabel = searchParams.get('product');

  const selectedTemplate = useMemo(() => getTemplateById(templateId), [templateId]);

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-10 text-[#0f172a] md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Step 2 of 2</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Create Your Personalized Website</h1>
            <p className="mt-2 max-w-3xl text-sm text-[#475569]">
              Complete your content details in guided sections. This page is designed for longer inputs so the root page stays premium and focused.
            </p>
          </div>
          <Link
            href="/#build"
            className="inline-flex rounded-full border border-[#0f172a]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a]"
          >
            Back to Homepage
          </Link>
        </div>

        <WebsiteContentForm
          selectedTemplate={selectedTemplate}
          selectedOccasion={selectedOccasion || 'couple'}
          selectedProductLabel={selectedProductLabel || 'QR Code Only / Standard Print'}
        />
      </div>
    </main>
  );
}
