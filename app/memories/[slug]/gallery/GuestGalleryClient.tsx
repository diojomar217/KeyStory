"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Heart,
  ImageIcon,
  RefreshCw,
  Sparkles,
  X,
  User,
  MessageCircle,
} from "lucide-react";

type GuestPhoto = {
  id: string;
  slug: string;
  image_url: string;
  caption?: string | null;
  guest_name?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type Props = {
  slug: string;
  initialPhotos: GuestPhoto[];
};

export default function GuestGalleryClient({ slug, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<GuestPhoto[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<GuestPhoto | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const featuredPhotos = useMemo(() => photos.slice(0, 3), [photos]);
  const galleryPhotos = useMemo(() => photos.slice(3), [photos]);

  async function fetchPhotos() {
    setIsRefreshing(true);

    try {
      const res = await fetch(`/api/guest-photos/gallery?slug=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch photos");

      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Failed to refresh gallery", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const refreshGallery = () => {
      fetchPhotos();
    };

    window.addEventListener("guest-photo-uploaded", refreshGallery);

    return () => {
      window.removeEventListener("guest-photo-uploaded", refreshGallery);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffe4ec,transparent_35%),linear-gradient(135deg,#fff7f9,#ffffff,#fdf2f8)] px-4 py-8 text-slate-900 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/70 px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Guest Memories
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Moments from this{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              special day
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            A live collection of approved photos shared by family and friends.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
              <ImageIcon className="h-4 w-4 text-rose-500" />
              {photos.length} photo{photos.length === 1 ? "" : "s"}
            </div>

            <button
              onClick={fetchPhotos}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="mx-auto mt-14 max-w-xl rounded-[2rem] border border-white/80 bg-white/85 p-10 text-center shadow-xl shadow-rose-100/50 backdrop-blur">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-rose-50 text-rose-500">
              <Camera className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-black text-slate-950">No approved photos yet</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Once the host approves guest uploads, they will appear beautifully here.
            </p>
          </div>
        ) : (
          <>
            {featuredPhotos.length > 0 && (
              <section className="mt-14 grid gap-4 md:grid-cols-3">
                {featuredPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`group relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-rose-100/50 ${
                      index === 0 ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || "Guest photo"}
                      className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                        index === 0 ? "h-[430px]" : "h-[205px]"
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-left text-white">
                      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
                        <Heart className="h-3.5 w-3.5 fill-white" />
                        Featured memory
                      </div>

                      {photo.caption && (
                        <p className="line-clamp-2 text-sm font-semibold leading-5">
                          “{photo.caption}”
                        </p>
                      )}

                      {photo.guest_name && (
                        <p className="mt-1 text-xs text-white/80">— {photo.guest_name}</p>
                      )}
                    </div>
                  </button>
                ))}
              </section>
            )}

            {galleryPhotos.length > 0 && (
              <section className="mt-5 columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4">
                {galleryPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative mb-4 w-full overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || "Guest photo"}
                      className="w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {(photo.caption || photo.guest_name) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-4 text-left text-white opacity-0 transition group-hover:opacity-100">
                        {photo.caption && (
                          <p className="line-clamp-2 text-xs font-semibold">“{photo.caption}”</p>
                        )}
                        {photo.guest_name && (
                          <p className="mt-1 text-[11px] text-white/80">— {photo.guest_name}</p>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </section>
            )}
          </>
        )}
      </section>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-lg transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[92vh] md:grid-cols-[1.4fr_0.6fr]">
              <div className="flex items-center justify-center bg-slate-950">
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.caption || "Guest photo"}
                  className="max-h-[92vh] w-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-between p-6">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                    <Heart className="h-3.5 w-3.5" />
                    Guest Memory
                  </div>

                  {selectedPhoto.caption ? (
                    <div className="mb-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <MessageCircle className="h-4 w-4 text-rose-500" />
                        Caption
                      </div>
                      <p className="text-lg font-semibold leading-7 text-slate-950">
                        “{selectedPhoto.caption}”
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No caption added.</p>
                  )}

                  {selectedPhoto.guest_name && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Shared by
                        </p>
                        <p className="font-bold text-slate-800">{selectedPhoto.guest_name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedPhoto.created_at && (
                  <p className="mt-8 text-xs text-slate-400">
                    Uploaded {new Date(selectedPhoto.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}