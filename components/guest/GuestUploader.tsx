"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Loader2,
  ImagePlus,
  RefreshCw,
  Trash2,
  Sparkles,
  Eye,
} from "lucide-react";

import { resizeAndCompress } from "@/lib/imageProcessing";
import {
  saveOfflinePhoto,
  getOfflinePhotos,
  removeOfflinePhoto,
  uploadPendingPhotos,
} from "@/lib/offlineGuestPhotoQueue";

type Props = {
  slug: string;
};

type OfflineQueueItem = {
  id?: number;
  blob: Blob;
  slug: string;
  guestName?: string | null;
  caption?: string | null;
  createdAt: number;
  previewUrl?: string;
};

type UploadedPreview = {
  imageUrl?: string | null;
  localPreviewUrl?: string | null;
  guestName?: string | null;
  caption?: string | null;
};

const MAX_FILE_SIZE_MB = 10;

export default function GuestUploader({ slug }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");

  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | "info" | null>(null);

  const [pendingCount, setPendingCount] = useState(0);
  const [pendingItems, setPendingItems] = useState<OfflineQueueItem[]>([]);

  const [isOnline, setIsOnline] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<"camera" | "upload" | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const [uploadedPreview, setUploadedPreview] = useState<UploadedPreview | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const usePresign =
    typeof process !== "undefined" &&
    ((process.env as any).NEXT_PUBLIC_USE_PRESIGNED_UPLOAD === "true" ||
      (process.env as any).NEXT_PUBLIC_USE_PRESIGNED_UPLOAD === "1");

  useEffect(() => {
    const onOnline = async () => {
      setIsOnline(true);
      setStatusMessage("Back online. Retrying saved photos...", "info");
      await handleRetryPending(true);
    };

    const onOffline = () => {
      setIsOnline(false);
      setStatusMessage(
        "You are offline. You can still take photos. They will upload automatically later.",
        "info"
      );
    };

    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    refreshQueue();

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);

      pendingItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function setStatusMessage(message: string, type: "success" | "error" | "info") {
    setStatus(message);
    setStatusType(type);
  }

  function validateFile(selectedFile: File) {
    if (!selectedFile.type.startsWith("image/")) {
      return "Please select a valid image file.";
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Photo is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }

    return null;
  }

  function resetForm() {
    setFile(null);
    setPreview(null);
    setGuestName("");
    setCaption("");
    setShowUploadModal(false);
    setUploadMode(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  function notifyGalleryRefresh(payload?: any) {
    window.dispatchEvent(
      new CustomEvent("guest-photo-uploaded", {
        detail: {
          slug,
          ...payload,
        },
      })
    );
  }

  async function refreshQueue() {
    const items = await getOfflinePhotos();

    setPendingItems((oldItems) => {
      oldItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });

      return items.map((item) => ({
        ...item,
        previewUrl: URL.createObjectURL(item.blob),
      }));
    });

    setPendingCount(items.length);
  }

  function handleOptionSelect(mode: "camera" | "upload") {
    setUploadMode(mode);
    setStatus(null);
    setStatusType(null);

    setTimeout(() => {
      if (mode === "camera") {
        cameraInputRef.current?.click();
      } else {
        fileInputRef.current?.click();
      }
    }, 80);
  }

  function handleFileSelect(selectedFile: File) {
    const error = validateFile(selectedFile);

    if (error) {
      setStatusMessage(error, "error");
      return;
    }

    setFile(selectedFile);
    setShowUploadModal(true);
    setStatus(null);
    setStatusType(null);
  }

  async function handleUpload() {
    if (!file) {
      setStatusMessage("Please choose a photo first.", "error");
      return;
    }

    if (isUploading) return;

    setIsUploading(true);
    setStatusMessage("Preparing your photo...", "info");

    const currentLocalPreview = preview;
    const currentGuestName = guestName.trim() || null;
    const currentCaption = caption.trim() || null;

    try {
      const processed = await resizeAndCompress(file, 1080, 0.72);

      if (!navigator.onLine) {
        await saveOfflinePhoto({
          blob: processed,
          slug,
          guestName: currentGuestName,
          caption: currentCaption,
        });

        setStatusMessage("Saved offline. It will upload when internet is back.", "success");

        setUploadedPreview({
          imageUrl: null,
          localPreviewUrl: currentLocalPreview,
          guestName: currentGuestName,
          caption: currentCaption,
        });

        resetForm();
        await refreshQueue();
        return;
      }

      setStatusMessage("Uploading your memory...", "info");

      if (usePresign) {
        try {
          const presignRes = await fetch("/api/guest-photos/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              filename: file.name || "photo.jpg",
              contentType: processed.type || "image/jpeg",
            }),
          });

          if (!presignRes.ok) throw new Error("Presign failed");

          const presignData = await presignRes.json();

          const putRes = await fetch(presignData.url, {
            method: "PUT",
            body: processed,
            headers: {
              "content-type": processed.type || "image/jpeg",
            },
          });

          if (!putRes.ok) throw new Error("Upload to R2 failed");

          const commitRes = await fetch("/api/guest-photos/commit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              key: presignData.key,
              guestName: currentGuestName,
              caption: currentCaption,
            }),
          });

          if (!commitRes.ok) throw new Error("Commit failed");

          const commitData = await commitRes.json().catch(() => null);

          setStatusMessage("Uploaded! Thank you for sharing this memory.", "success");

          setUploadedPreview({
            imageUrl: commitData?.imageUrl || commitData?.url || null,
            localPreviewUrl: currentLocalPreview,
            guestName: currentGuestName,
            caption: currentCaption,
          });

          notifyGalleryRefresh({
            key: presignData.key,
            imageUrl: commitData?.imageUrl || commitData?.url || null,
          });

          resetForm();
        } catch (error) {
          console.error(error);

          await saveOfflinePhoto({
            blob: processed,
            slug,
            guestName: currentGuestName,
            caption: currentCaption,
          });

          setStatusMessage("Upload failed. Saved offline and will retry later.", "success");

          setUploadedPreview({
            imageUrl: null,
            localPreviewUrl: currentLocalPreview,
            guestName: currentGuestName,
            caption: currentCaption,
          });

          resetForm();
          await refreshQueue();
        }
      } else {
        const form = new FormData();
        form.append("file", processed, file.name || "photo.jpg");
        form.append("slug", slug);

        if (currentGuestName) form.append("guestName", currentGuestName);
        if (currentCaption) form.append("caption", currentCaption);

        const res = await fetch("/api/guest-photos/upload", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          await saveOfflinePhoto({
            blob: processed,
            slug,
            guestName: currentGuestName,
            caption: currentCaption,
          });

          setStatusMessage("Upload failed. Saved offline and will retry later.", "success");

          setUploadedPreview({
            imageUrl: null,
            localPreviewUrl: currentLocalPreview,
            guestName: currentGuestName,
            caption: currentCaption,
          });

          resetForm();
          await refreshQueue();
          return;
        }

        const uploadData = await res.json().catch(() => null);

        setStatusMessage("Uploaded! Thank you for sharing this memory.", "success");

        setUploadedPreview({
          imageUrl: uploadData?.imageUrl || uploadData?.url || null,
          localPreviewUrl: currentLocalPreview,
          guestName: currentGuestName,
          caption: currentCaption,
        });

        notifyGalleryRefresh({
          imageUrl: uploadData?.imageUrl || uploadData?.url || null,
        });

        resetForm();
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Something went wrong while processing the photo.", "error");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRetryPending(silent = false) {
    if (isRetrying) return;

    setIsRetrying(true);

    if (!silent) {
      setStatusMessage("Retrying saved photos...", "info");
    }

    try {
      const result = await uploadPendingPhotos();
      await refreshQueue();

      if (result.uploaded > 0) {
        notifyGalleryRefresh({
          source: "offline-queue",
        });
      }

      if (result.failed > 0) {
        setStatusMessage(`Retry completed. ${result.uploaded} uploaded, ${result.failed} failed.`, "error");
      } else if (result.uploaded > 0) {
        setStatusMessage("Retry complete. Uploaded photos will appear in the gallery.", "success");
      } else {
        setStatusMessage("No pending photos were uploaded. They will retry automatically when you have a connection.", "info");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Some photos could not be uploaded yet.", "error");
    } finally {
      setIsRetrying(false);
    }
  }

  async function handleDeletePending(id?: number) {
    if (!id) return;

    await removeOfflinePhoto(id);
    await refreshQueue();
    setStatusMessage("Removed photo from offline queue.", "success");
  }

  const uploadedImageToShow = uploadedPreview?.imageUrl || uploadedPreview?.localPreviewUrl || null;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffe4ec,transparent_35%),linear-gradient(135deg,#fff7f9,#ffffff,#fdf2f8)] text-slate-900">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) handleFileSelect(selected);
        }}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) handleFileSelect(selected);
        }}
        className="hidden"
      />

      <div className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isOnline ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}
            >
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isOnline ? "Online" : "Offline mode"}
              </p>
              <p className="text-xs text-slate-500">{pendingCount} saved photo(s)</p>
            </div>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={() => handleRetryPending(false)}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700 disabled:opacity-60"
            >
              {isRetrying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Retry
            </button>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/70 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Live guest photo sharing
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Share your beautiful{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              memories
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Take a photo or upload from your gallery. Even if the internet is weak,
            your photo can be saved first and uploaded automatically later.
          </p>
        </section>

        {status && (
          <div
            className={`mx-auto mt-8 max-w-2xl rounded-2xl border p-4 shadow-sm ${
              statusType === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : statusType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {statusType === "error" ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : statusType === "success" ? (
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
              )}
              <p className="text-sm font-semibold">{status}</p>
            </div>
          </div>
        )}

        {uploadedImageToShow && (
          <section className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-emerald-100 bg-white/85 p-4 shadow-xl shadow-emerald-100/50 backdrop-blur md:p-5">
            <div className="flex gap-4">
              <img
                src={uploadedImageToShow}
                alt={uploadedPreview?.caption || "Uploaded photo"}
                className="h-24 w-24 rounded-2xl object-cover shadow-md md:h-28 md:w-28"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {uploadedPreview?.imageUrl ? "Uploaded" : "Saved"}
                </div>

                <h3 className="text-base font-black text-slate-950">
                  {uploadedPreview?.imageUrl
                    ? "Your photo was shared!"
                    : "Photo saved for upload"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {uploadedPreview?.imageUrl
                    ? "It can now appear in the guest photo gallery."
                    : "It will upload automatically when internet is back."}
                </p>

                {uploadedPreview?.caption && (
                  <p className="mt-2 truncate text-sm italic text-slate-600">
                    “{uploadedPreview.caption}”
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleOptionSelect("camera")}
            className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 text-left shadow-xl shadow-rose-100/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-rose-200/40 blur-2xl transition group-hover:scale-125" />

            <div className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25">
                <Camera className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-950">Take a Picture</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Best for guests at the event. Open the camera and capture the moment instantly.
              </p>

              <div className="mt-6 inline-flex rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
                Open Camera
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleOptionSelect("upload")}
            className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 text-left shadow-xl shadow-blue-100/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl transition group-hover:scale-125" />

            <div className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                <Upload className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-950">Upload Photos</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose an existing photo from your gallery and share it with the host.
              </p>

              <div className="mt-6 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                Choose Photo
              </div>
            </div>
          </button>
        </section>

        {pendingItems.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950">Saved Offline</h3>
                <p className="text-sm text-slate-500">
                  These photos will upload when internet connection is available.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {pendingItems.length} photo(s)
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
                >
                  <img
                    src={item.previewUrl}
                    alt={item.caption || "Queued photo"}
                    className="h-14 w-14 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {item.guestName || "Guest photo"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePending(item.id)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove offline photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 backdrop-blur-sm md:items-center">
          <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 p-5 backdrop-blur">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {uploadMode === "camera" ? "Preview Photo" : "Upload Photo"}
                </h2>
                <p className="text-xs text-slate-500">Review before sharing.</p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={isUploading}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {preview ? (
                <div className="space-y-5">
                  <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <img src={preview} alt="Preview" className="h-80 w-full object-cover" />
                  </div>

                  <div className="rounded-2xl bg-rose-50 p-3 text-center text-xs font-medium text-rose-700">
                    This is the image that will be uploaded.
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Your Name <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Ninang Jane"
                        maxLength={60}
                        disabled={isUploading}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Caption <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a short message..."
                        rows={3}
                        maxLength={180}
                        disabled={isUploading}
                        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100 disabled:bg-slate-50"
                      />
                      <p className="mt-1 text-right text-xs text-slate-400">{caption.length}/180</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isUploading}
                      className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:from-rose-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploading ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading
                        </span>
                      ) : (
                        "Upload Photo"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                    <ImagePlus className="h-8 w-8" />
                  </div>

                  <h3 className="text-lg font-black text-slate-900">No photo selected</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Please allow camera/gallery access, then select a photo to continue.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      if (uploadMode === "camera") {
                        cameraInputRef.current?.click();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
                  >
                    Select Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}