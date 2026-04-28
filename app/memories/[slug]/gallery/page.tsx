import { supabase } from "@/lib/supabase";
import GuestGalleryClient from "./GuestGalleryClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const { data: photos, error } = await supabase
    .from("guest_photos")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery photos", error);

    return (
      <main className="min-h-screen bg-rose-50 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">Gallery unavailable</h1>
          <p className="mt-2 text-slate-500">Failed to load gallery photos.</p>
        </div>
      </main>
    );
  }

  return <GuestGalleryClient slug={slug} initialPhotos={photos || []} />;
}