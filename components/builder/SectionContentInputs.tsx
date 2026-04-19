import Cropper from "react-easy-crop";
import TimelineEditor from "@/components/builder/TimelineEditor";
import { getSectionCopy } from "@/lib/section-copy";
import {
  SECTION_COPY_CONFIG,
  type SectionCopyKey,
} from "@/config/sectionCopyConfig";

type SectionContentInputsProps = {
  config: {
    sections?: string[];
    section_content?: Record<string, any>;
    tagline?: string;
    hero?: any;
    timeline_events?: any[];
    occasion?: string;
  };
  onSectionContentChange: (sectionKey: string, content: any) => void;
  validationErrors?: Record<string, string | boolean | undefined>;
  // Hero photo props
  heroPhotoPreview?: string | null;
  crop?: { x: number; y: number };
  zoom?: number;
  setCrop?: (crop: { x: number; y: number }) => void;
  setZoom?: (zoom: number) => void;
  setCroppedAreaPixels?: (area: any) => void;
  handleHeroPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeroPhotoSelect?: (index: number) => void;
  handleRemoveHeroPhoto?: () => void;
  photoPreviews?: string[];
  // Gallery photo props
  handlePhotos?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto?: (index: number) => void;
};
import { SECTION_CONFIG } from "../../config/sectionConfig";

import {
  TextContentInput,
  PlaylistInput,
  QuotesInput,
  FutureDreamsInput,
  VideoMemoriesInput,
  MemoryMapInput,
  EventLocationsInput,
  SurpriseMessageInput,
  LetterToFutureInput,
  GiftSectionInput,
  ReasonsILoveYouInput,
  GuestMessagesInput,
  InvitationInput,
  ScheduleInput,
  DressCodeInput,
  MapInput,
  SafetyProtocolInput,
  ClosingInput,
  RSVPInput,
} from "./ContentInputComponents";

import React, { useState } from "react";

export default function SectionContentInputs({
  config,
  onSectionContentChange,
  validationErrors = {},
  heroPhotoPreview,
  crop,
  zoom,
  setCrop,
  setZoom,
  setCroppedAreaPixels,
  handleHeroPhotoUpload,
  handleHeroPhotoSelect,
  handleRemoveHeroPhoto,
  photoPreviews,
  handlePhotos,
  onRemovePhoto,
}: SectionContentInputsProps) {
  const { sections = [], section_content = {} } = config || {};
  const siteType = config?.occasion || "couple";

  const isSectionCopyKey = (key: string): key is SectionCopyKey =>
    key in SECTION_COPY_CONFIG;

  const resolveSectionCopy = (key: string) => {
    if (!isSectionCopyKey(key)) return null;
    return getSectionCopy(key, siteType as any);
  };

  // Accordion state: openSectionKey is the key of the currently open section
  const [openSectionKey, setOpenSectionKey] = useState<string | null>(
    sections?.[0] || null,
  );
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingBackgroundImage, setUploadingBackgroundImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const enabledSections = Array.isArray(sections)
    ? sections
        .map((key) => SECTION_CONFIG.find((s) => s.key === key))
        .filter((s): s is (typeof SECTION_CONFIG)[number] => Boolean(s))
    : [];

  // Helper: compute section status
  // Enhanced: compute section status and label
  function getSectionStatusAndLabel(section: (typeof SECTION_CONFIG)[number]): {
    status: "error" | "complete" | "default";
    label: string;
  } {
    const key = section.key;
    const isRequired = !!section.required;
    const hasError = validationErrors && validationErrors[key];
    let isComplete = false;
    let label = "";
    // Section-specific logic for label
    if (key === "home") {
      isComplete =
        Boolean(config.tagline && config.tagline.trim()) ||
        (config.hero && typeof config.hero.coverPhotoIndex === "number");
      label = isComplete ? "Filled" : isRequired ? "Missing" : "Empty";
    } else if (key === "gallery") {
      // Build gallery array for editor UI by combining saved remote URLs
      // (from section_content or config.media) with local previews. Do NOT
      // persist blob/object URLs back into config here — previews are transient.
      let galleryArr: string[] = [];
      if (Array.isArray(section_content?.gallery?.photos)) {
        galleryArr = section_content.gallery.photos.slice();
      } else if (Array.isArray((config as any)?.media?.photos)) {
        galleryArr = (config as any).media.photos.slice();
      } else {
        galleryArr = [];
      }
      if (Array.isArray(photoPreviews) && photoPreviews.length > 0) {
        galleryArr = [...galleryArr, ...photoPreviews];
      }
      const count = Array.isArray(galleryArr) ? galleryArr.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} photo${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "timeline") {
      const count = Array.isArray(config.section_content?.timeline)
        ? config.section_content.timeline.length
        : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} event${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "playlist") {
      const val = section_content[key];
      const hasUrl =
        val &&
        typeof val.playlistUrl === "string" &&
        val.playlistUrl.trim().length > 0;
      isComplete = hasUrl;
      label = hasUrl ? "Filled" : isRequired ? "Missing" : "Empty";
    } else if (key === "quotes") {
      const val = section_content[key];
      const count = val && Array.isArray(val.quotes) ? val.quotes.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} quote${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "reasons_love_you") {
      const val = section_content[key];
      const count = val && Array.isArray(val.reasons) ? val.reasons.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} reason${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "guest_messages") {
      const val = section_content[key];
      const count =
        val && Array.isArray(val.messages) ? val.messages.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} message${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "video_memories") {
      const val = section_content[key];
      const count = val && Array.isArray(val.videos) ? val.videos.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} video${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "future_dreams") {
      const val = section_content[key];
      const count = val && Array.isArray(val.dreams) ? val.dreams.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} dream${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "memory_map") {
      const val = section_content[key];
      const count =
        val && Array.isArray(val.locations) ? val.locations.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} location${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (key === "love_letter") {
      const val = section_content[key];
      isComplete =
        val && typeof val.content === "string" ? !!val.content.trim() : false;
      label = isComplete ? "Filled" : isRequired ? "Missing" : "Empty";
    } else if (key === "surprise_message") {
      const val = section_content[key];
      isComplete =
        val && typeof val.message === "string" ? !!val.message.trim() : false;
      label = isComplete ? "Filled" : isRequired ? "Missing" : "Empty";
    } else if (key === "letter_future") {
      const val = section_content[key];
      isComplete =
        val && typeof val.letter === "string" ? !!val.letter.trim() : false;
      label = isComplete ? "Filled" : isRequired ? "Missing" : "Empty";
    } else if (key === "gift_section") {
      const val = section_content[key];
      const count = val && Array.isArray(val.gifts) ? val.gifts.length : 0;
      isComplete = count > 0;
      label =
        count > 0
          ? `${count} gift${count > 1 ? "s" : ""}`
          : isRequired
            ? "Missing"
            : "Empty";
    } else if (
      key === "relationship_stats" ||
      key === "anniversary_countdown" ||
      key === "wedding_countdown" ||
      key === "countdown" ||
      key === "qr_keepsake"
    ) {
      // Auto-generated
      isComplete = true;
      label = "Auto-generated";
    } else {
      const val = section_content[key];
      if (val && typeof val === "object") {
        isComplete =
          typeof val.content === "string"
            ? !!val.content.trim()
            : Object.keys(val).length > 0;
      } else if (typeof val === "string") {
        isComplete = !!val.trim();
      }
      label = isComplete ? "Filled" : isRequired ? "Missing" : "Empty";
    }
    if (isRequired && hasError) return { status: "error", label: "Missing" };
    if (isRequired && isComplete)
      return { status: "complete", label: "Complete" };
    if (!isRequired && isComplete) return { status: "complete", label };
    if (!isRequired && !isComplete) return { status: "default", label };
    return { status: "default", label };
  }

  // Status color mapping
  const statusColors = {
    error: {
      border: "border-rose-300",
      icon: "text-rose-400",
    },
    complete: {
      border: "border-emerald-300",
      icon: "text-emerald-400",
    },
    default: {
      border: "border-slate-200",
      icon: "text-slate-400",
    },
  };

  return (
    <div>
      {enabledSections.map((section) => {
        const { status, label: statusLabel } =
          getSectionStatusAndLabel(section);
        const copy = resolveSectionCopy(section.key);
        const sectionTitle = copy?.title || section.label;
        const sectionFormTitle = copy?.formTitle || sectionTitle;
        const sectionSubtitle = copy?.subtitle || "";
        const sectionIcon = copy?.icon || section.icon;
        let content = null;
        switch (section.key) {
          case "home":
            // If the occasion is baptism, show dedicated baptism home inputs
            const homeContent = section_content?.home || {};
            if (siteType === "baptism") {
              const homeContent = section_content?.home || {};

              const updateHome = (patch: Record<string, any>) =>
                onSectionContentChange("home", { ...homeContent, ...patch });

              content = (
                <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5 space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {sectionFormTitle} — Baptism Hero
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Customize the main hero section for the baptism website.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Label
                    </label>
                    <input
                      placeholder="e.g., You’re Invited"
                      value={homeContent.label ?? ""}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      onChange={(e) => updateHome({ label: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Small text shown above the hero title.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Event Title
                    </label>
                    <input
                      placeholder="e.g., Baptism Celebration"
                      value={homeContent.eventTitle ?? ""}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      onChange={(e) =>
                        updateHome({ eventTitle: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Subtitle
                    </label>
                    <input
                      placeholder="e.g., A day filled with love, blessings, and joy"
                      value={homeContent.subtitle ?? ""}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      onChange={(e) => updateHome({ subtitle: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Short Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g., Join us as we celebrate a meaningful milestone in this little one’s life."
                      value={homeContent.shortMessage ?? ""}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      onChange={(e) =>
                        updateHome({ shortMessage: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Event date/time moved to the parent Content step (Step 5).
                        Keep the home content focused on hero copy and images. */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Hero Image
                      </label>
                      {homeContent.heroImage ? (
                        <div className="space-y-2">
                          <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeContent.heroImage} alt="Hero" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex gap-2">
                            <label className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploadError(null);
                                  setUploadingHeroImage(true);
                                  try {
                                    const fd = new FormData();
                                    fd.append('file', file);
                                    const res = await fetch('/api/uploads/cloudinary', { method: 'POST', body: fd });
                                    const json = await res.json();
                                    if (!res.ok || !json?.success) throw new Error(json?.message || 'Upload failed');
                                    updateHome({ ...homeContent, heroImage: json.url });
                                  } catch (err: any) {
                                    setUploadError(err?.message || 'Upload failed');
                                  } finally {
                                    setUploadingHeroImage(false);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => updateHome({ ...homeContent, heroImage: undefined })}
                              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
                            >
                              Remove
                            </button>
                            {uploadingHeroImage && <div className="text-sm text-slate-500">Uploading…</div>}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadError(null);
                              setUploadingHeroImage(true);
                              try {
                                const fd = new FormData();
                                fd.append('file', file);
                                const res = await fetch('/api/uploads/cloudinary', { method: 'POST', body: fd });
                                const json = await res.json();
                                if (!res.ok || !json?.success) throw new Error(json?.message || 'Upload failed');
                                updateHome({ ...homeContent, heroImage: json.url });
                              } catch (err: any) {
                                setUploadError(err?.message || 'Upload failed');
                              } finally {
                                setUploadingHeroImage(false);
                              }
                            }}
                            className="w-full"
                          />
                          <p className="mt-1 text-xs text-slate-400">Main photo shown in the hero card.</p>
                          <p className="mt-2 text-xs text-slate-400">Upload an image to Cloudinary; the stored link will be used.</p>
                          {uploadError && <div className="text-xs text-rose-600 mt-1">{uploadError}</div>}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Background Image
                      </label>
                      {homeContent.backgroundImage ? (
                        <div className="space-y-2">
                          <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeContent.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex gap-2">
                            <label className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploadError(null);
                                  setUploadingBackgroundImage(true);
                                  try {
                                    const fd = new FormData();
                                    fd.append('file', file);
                                    const res = await fetch('/api/uploads/cloudinary', { method: 'POST', body: fd });
                                    const json = await res.json();
                                    if (!res.ok || !json?.success) throw new Error(json?.message || 'Upload failed');
                                    updateHome({ ...homeContent, backgroundImage: json.url });
                                  } catch (err: any) {
                                    setUploadError(err?.message || 'Upload failed');
                                  } finally {
                                    setUploadingBackgroundImage(false);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => updateHome({ ...homeContent, backgroundImage: undefined })}
                              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
                            >
                              Remove
                            </button>
                            {uploadingBackgroundImage && <div className="text-sm text-slate-500">Uploading…</div>}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadError(null);
                              setUploadingBackgroundImage(true);
                              try {
                                const fd = new FormData();
                                fd.append('file', file);
                                const res = await fetch('/api/uploads/cloudinary', { method: 'POST', body: fd });
                                const json = await res.json();
                                if (!res.ok || !json?.success) throw new Error(json?.message || 'Upload failed');
                                updateHome({ ...homeContent, backgroundImage: json.url });
                              } catch (err: any) {
                                setUploadError(err?.message || 'Upload failed');
                              } finally {
                                setUploadingBackgroundImage(false);
                              }
                            }}
                            className="w-full"
                          />
                          <p className="mt-1 text-xs text-slate-400">Optional full background image behind the hero.</p>
                          <p className="mt-2 text-xs text-slate-400">Upload an image to Cloudinary; the stored link will be used.</p>
                          {uploadError && <div className="text-xs text-rose-600 mt-1">{uploadError}</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={
                        typeof homeContent.overlayOpacity === "number"
                          ? homeContent.overlayOpacity
                          : 90
                      }
                      className="w-full"
                      onChange={(e) =>
                        updateHome({ overlayOpacity: Number(e.target.value) })
                      }
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Controls how strong the soft overlay appears on the hero
                      background.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        Primary Button
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Main action button, usually RSVP.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Primary CTA Label
                        </label>
                        <input
                          placeholder="e.g., RSVP Now"
                          value={homeContent.ctaPrimaryLabel ?? ""}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          onChange={(e) =>
                            updateHome({ ctaPrimaryLabel: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Primary CTA Link
                        </label>
                        <input
                          placeholder="#rsvp or https://..."
                          value={homeContent.ctaPrimaryLink ?? ""}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          onChange={(e) =>
                            updateHome({ ctaPrimaryLink: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        Secondary Button
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Optional second button, usually View Details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Secondary CTA Label
                        </label>
                        <input
                          placeholder="e.g., View Details"
                          value={homeContent.ctaSecondaryLabel ?? ""}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          onChange={(e) =>
                            updateHome({ ctaSecondaryLabel: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Secondary CTA Link
                        </label>
                        <input
                          placeholder="#details or https://..."
                          value={homeContent.ctaSecondaryLink ?? ""}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          onChange={(e) =>
                            updateHome({ ctaSecondaryLink: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              // default home editor (no occasion-specific fields)
              content = (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                  <span className="font-semibold text-lg">
                    {sectionFormTitle}
                  </span>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Hero Tagline
                  </label>
                  <input
                    name="tagline"
                    maxLength={120}
                    placeholder="Write a short opening line for your page"
                    value={
                      section_content.home?.tagline ?? config.tagline ?? ""
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                    onChange={(e) => {
                      // Update both config.tagline and section_content.home.tagline
                      onSectionContentChange("home", {
                        ...section_content.home,
                        tagline: e.target.value,
                      });
                      if (typeof config === "object") {
                        config.tagline = e.target.value;
                      }
                    }}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    A short opening line shown in the hero section. (Max 120
                    characters)
                  </p>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5 mt-4">
                    Dedicated Hero Cover Photo
                  </label>
                  <input
                    name="hero_photo"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition-all cursor-pointer"
                    onChange={handleHeroPhotoUpload}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Hero images are auto-optimized (1920px max, auto
                    format/quality). High quality is kept for visuals.
                  </p>
                  {heroPhotoPreview && (
                    <div
                      className="mt-3 relative border border-slate-200 rounded-lg overflow-hidden"
                      style={{ height: 240 }}
                    >
                      <Cropper
                        image={heroPhotoPreview}
                        crop={crop ?? { x: 0, y: 0 }}
                        zoom={zoom ?? 1}
                        aspect={16 / 9}
                        onCropChange={setCrop ?? (() => {})}
                        onZoomChange={setZoom ?? (() => {})}
                        onCropComplete={(_, croppedAreaPixels) =>
                          setCroppedAreaPixels &&
                          setCroppedAreaPixels(croppedAreaPixels)
                        }
                        cropShape="rect"
                        showGrid={true}
                        style={{
                          containerStyle: { width: "100%", height: 240 },
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleRemoveHeroPhoto}
                          className="bg-black/40 text-white text-xs px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                        <label className="text-xs text-white bg-black/40 px-2 py-1 rounded">
                          Zoom
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={3}
                          step={0.01}
                          value={zoom}
                          onChange={(e) =>
                            setZoom && setZoom(Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  {photoPreviews && photoPreviews.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-600 mb-2">
                        Or select from uploaded photos
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {photoPreviews.map((preview, index) => (
                          <button
                            type="button"
                            key={index}
                            onClick={() =>
                              handleHeroPhotoSelect &&
                              handleHeroPhotoSelect(index)
                            }
                            className={`border rounded-lg overflow-hidden ${config.hero?.coverPhotoIndex === index ? "border-rose-500 ring-2 ring-rose-200" : "border-slate-200"}`}
                          >
                            <img
                              src={preview}
                              alt={`Hero option ${index + 1}`}
                              className="w-full h-16 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {config.hero?.coverPhotoIndex !== undefined &&
                    !heroPhotoPreview && (
                      <p className="text-xs text-emerald-600 mt-2">
                        Hero cover currently set to photo{" "}
                        {config.hero.coverPhotoIndex + 1}
                      </p>
                    )}
                </div>
              );
            }
            break;
          case "invitation":
            content = (
              <InvitationInput
                value={section_content?.invitation}
                onChange={(val) => onSectionContentChange("invitation", val)}
              />
            );
            break;
          case "schedule":
            content = (
              <ScheduleInput
                value={section_content?.schedule}
                onChange={(val) => onSectionContentChange("schedule", val)}
              />
            );
            break;
          case "dress_code":
            content = (
              <DressCodeInput
                value={section_content?.dress_code}
                onChange={(val) => onSectionContentChange("dress_code", val)}
              />
            );
            break;
          case "map_section":
            content = (
              <MapInput
                value={section_content?.map_section}
                onChange={(val) => onSectionContentChange("map_section", val)}
              />
            );
            break;
          case "safety_protocol":
            content = (
              <SafetyProtocolInput
                value={section_content?.safety_protocol}
                onChange={(val) => onSectionContentChange("safety_protocol", val)}
              />
            );
            break;
          case "closing":
            content = (
              <ClosingInput
                value={section_content?.closing}
                onChange={(val) => onSectionContentChange("closing", val)}
              />
            );
            break;
          case "gallery":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="font-semibold text-lg">Upload Photos</span>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Gallery Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    onChange={handlePhotos}
                  />
                  <div className="text-xs text-slate-500 mt-2">
                    Gallery images are auto-optimized (1600px max, auto
                    format/quality) for fast site loading.
                  </div>

                  {(() => {
                    const galleryArr = Array.isArray(
                      section_content?.gallery?.photos,
                    )
                      ? section_content.gallery.photos
                      : Array.isArray((config as any)?.media?.photos)
                        ? (config as any).media.photos
                        : Array.isArray(photoPreviews)
                          ? photoPreviews
                          : [];
                    if (galleryArr.length > 0) {
                      return (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                          {galleryArr.map((preview: string, index: number) => (
                            <div
                              key={index}
                              className="relative rounded overflow-hidden"
                            >
                              <img
                                src={preview}
                                alt={`Gallery preview ${index + 1}`}
                                className="w-full h-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  onRemovePhoto && onRemovePhoto(index)
                                }
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-[10px]"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (validationErrors && validationErrors["gallery"]) {
                      return (
                        <div className="text-xs text-rose-500 mt-2 font-medium">
                          Gallery section requires at least one photo
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            );
            break;
          case "timeline":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-[70vh] overflow-y-auto">
                <span className="font-semibold text-lg">
                  {sectionFormTitle}
                </span>
                <TimelineEditor
                  events={config.section_content?.timeline || []}
                  onChange={(timeline) =>
                    onSectionContentChange("timeline", timeline)
                  }
                />
                {(!config.section_content?.timeline ||
                  config.section_content.timeline.length === 0) && (
                  <p className="text-xs text-amber-600 mt-2">
                    {sectionTitle} section requires at least one event
                  </p>
                )}
              </div>
            );
            break;
          case "love_letter":
          case "our_story":
          case "birthday_message":
          case "couple_message":
          case "graduation_message":
          case "parents_message":
          case "celebrant_message":
          case "family_message":
          case "message_letter":
          case "life_story":
          case "travel_notes":
          case "first_date":
          case "special_moments":
          case "milestones":
            content = (
              <TextContentInput
                label={sectionTitle}
                value={
                  section_content?.[section.key]?.content ||
                  section_content?.[section.key]?.text ||
                  ""
                }
                onChange={(content: string) =>
                  onSectionContentChange(section.key, { content })
                }
                placeholder={`Write content for ${sectionTitle.toLowerCase()}...`}
                rows={6}
              />
            );
            break;
          case "song":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-700">Song</span>
                  <span className="ml-2 text-xs font-medium bg-sky-100 text-sky-600 rounded-full px-2 py-0.5">
                    Configured in Playlist
                  </span>
                </div>
                <div className="text-slate-600 text-sm mb-1">
                  Song link and autoplay are configured in the Playlist section
                  (Step 5).
                </div>
              </div>
            );
            break;
          case "birthday_wishes":
            content = (
              <QuotesInput
                value={section_content?.birthday_wishes}
                onChange={(content: any) =>
                  onSectionContentChange("birthday_wishes", content)
                }
              />
            );
            break;
          case "birthday_timeline":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-[70vh] overflow-y-auto">
                <span className="font-semibold text-lg">
                  {sectionFormTitle}
                </span>
                <TimelineEditor
                  events={
                    section_content?.birthday_timeline ||
                    config.section_content?.timeline ||
                    []
                  }
                  onChange={(timeline) =>
                    onSectionContentChange("birthday_timeline", timeline)
                  }
                />
              </div>
            );
            break;
          case "party_details": {
            const details = section_content?.[section.key] || {};
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <span className="font-semibold text-lg">{sectionTitle}</span>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  placeholder="Location"
                  value={details.location || ""}
                  onChange={(e) =>
                    onSectionContentChange(section.key, {
                      ...details,
                      location: e.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    value={details.date || ""}
                    onChange={(e) =>
                      onSectionContentChange(section.key, {
                        ...details,
                        date: e.target.value,
                      })
                    }
                  />
                  <input
                    type="time"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    value={details.time || ""}
                    onChange={(e) =>
                      onSectionContentChange(section.key, {
                        ...details,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  placeholder="Dress code (optional)"
                  value={details.dressCode || ""}
                  onChange={(e) =>
                    onSectionContentChange(section.key, {
                      ...details,
                      dressCode: e.target.value,
                    })
                  }
                />
              </div>
            );
            break;
          }

          case "event_details": {
            content = (
              <EventLocationsInput
                value={section_content?.event_details}
                onChange={(val) => onSectionContentChange("event_details", val)}
              />
            );
            break;
          }
          case "gift_wishlist":
          case "gift_registry": {
            const wishlist = section_content?.[section.key] || {};
            const itemsText = Array.isArray(wishlist.items)
              ? wishlist.items.join("\n")
              : "";
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <span className="font-semibold text-lg">{sectionTitle}</span>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 min-h-[120px]"
                  placeholder="One gift item per line"
                  value={itemsText}
                  onChange={(e) => {
                    const items = e.target.value
                      .split("\n")
                      .map((v) => v.trim());
                    onSectionContentChange(section.key, { ...wishlist, items });
                  }}
                />
                <p className="text-xs text-slate-500">
                  Each line becomes one wishlist/registry item.
                </p>
              </div>
            );
            break;
          }
          case "gift_ideas": {
            const ideas = section_content?.gift_ideas || {};
            const itemsText = Array.isArray(ideas.items) ? ideas.items.join("\n") : "";
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <span className="font-semibold text-lg">{sectionTitle}</span>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  placeholder="Section title (optional)"
                  value={ideas.title || ''}
                  onChange={(e) => onSectionContentChange('gift_ideas', { ...ideas, title: e.target.value })}
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  placeholder="Section subtitle (optional)"
                  value={ideas.subtitle || ''}
                  onChange={(e) => onSectionContentChange('gift_ideas', { ...ideas, subtitle: e.target.value })}
                />
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 min-h-[120px]"
                  placeholder="One gift idea per line"
                  value={itemsText}
                  onChange={(e) => {
                    const items = e.target.value
                      .split("\n")
                      .map((v) => v.trim());
                    onSectionContentChange('gift_ideas', { ...ideas, items });
                  }}
                />
                <p className="text-xs text-slate-500">Each line becomes one gift idea.</p>
              </div>
            );
            break;
          }
          case "rsvp": {
            const rsvp = section_content?.rsvp || {};
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <span className="font-semibold text-lg">RSVP</span>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  placeholder="RSVP deadline (optional)"
                  value={rsvp.deadline || ""}
                  onChange={(e) =>
                    onSectionContentChange("rsvp", {
                      ...rsvp,
                      deadline: e.target.value,
                    })
                  }
                />
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 min-h-[100px]"
                  placeholder="Optional RSVP note or instructions"
                  value={rsvp.note || ""}
                  onChange={(e) =>
                    onSectionContentChange("rsvp", {
                      ...rsvp,
                      note: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-slate-500">
                  Guest message submissions still work via the live site guest
                  form.
                </p>
              </div>
            );
            break;
          }
          case "wedding_timeline":
          case "travel_timeline":
          case "school_memories":
          case "achievements":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-h-[70vh] overflow-y-auto">
                <span className="font-semibold text-lg">{sectionTitle}</span>
                <TimelineEditor
                  events={
                    section_content?.[section.key] ||
                    config.section_content?.timeline ||
                    []
                  }
                  onChange={(timeline) =>
                    onSectionContentChange(section.key, timeline)
                  }
                />
              </div>
            );
            break;
          case "photo_highlights":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="font-semibold text-lg">
                  Upload Highlight Photos
                </span>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Highlight Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    onChange={handlePhotos}
                  />
                </div>
              </div>
            );
            break;
          case "playlist":
            content = (
              <PlaylistInput
                value={section_content?.playlist}
                onChange={(content: any) =>
                  onSectionContentChange("playlist", content)
                }
              />
            );
            break;
          case "quotes":
          case "baby_predictions":
          case "tributes":
            content = (
              <QuotesInput
                value={section_content?.[section.key]}
                onChange={(content: any) =>
                  onSectionContentChange(section.key, content)
                }
              />
            );
            break;
          case "future_dreams":
          case "future_plans":
            content = (
              <FutureDreamsInput
                value={section_content?.[section.key]}
                onChange={(content: any) =>
                  onSectionContentChange(section.key, content)
                }
              />
            );
            break;
          case "video_memories":
            content = (
              <VideoMemoriesInput
                value={section_content?.video_memories}
                onChange={(content: any) =>
                  onSectionContentChange("video_memories", content)
                }
              />
            );
            break;
          case "memory_map":
            content = (
              <MemoryMapInput
                value={section_content?.memory_map}
                onChange={(content: any) =>
                  onSectionContentChange("memory_map", content)
                }
              />
            );
            break;
          case "surprise_message":
            content = (
              <SurpriseMessageInput
                value={section_content?.surprise_message}
                onChange={(content: any) =>
                  onSectionContentChange("surprise_message", content)
                }
              />
            );
            break;
          case "letter_future":
            content = (
              <LetterToFutureInput
                value={section_content?.letter_future}
                onChange={(content: any) =>
                  onSectionContentChange("letter_future", content)
                }
              />
            );
            break;
          case "gift_section":
            content = (
              <GiftSectionInput
                value={section_content?.gift_section}
                onChange={(content: any) =>
                  onSectionContentChange("gift_section", content)
                }
              />
            );
            break;
          case "reasons_love_you":
            content = (
              <ReasonsILoveYouInput
                value={section_content?.reasons_love_you}
                onChange={(content: any) =>
                  onSectionContentChange("reasons_love_you", content)
                }
              />
            );
            break;
          case "guest_messages": {
            const val = section_content?.guest_messages;
            const count =
              val && Array.isArray(val.messages) ? val.messages.length : 0;
            if (!count) {
              content = (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-700">
                      {sectionTitle}
                    </span>
                  </div>
                  <div className="text-slate-600 text-sm mb-1">
                    {sectionSubtitle ||
                      "This section allows visitors to leave messages that appear on your website."}
                  </div>
                </div>
              );
            } else {
              content = <GuestMessagesInput value={val} />;
            }
            break;
          }
          case "relationship_stats":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-700">
                    {sectionTitle}
                  </span>
                  <span className="ml-2 text-xs font-medium bg-sky-100 text-sky-600 rounded-full px-2 py-0.5">
                    Auto-generated
                  </span>
                </div>
                <div className="text-slate-600 text-sm mb-1">
                  {copy?.emptyState ||
                    "This section is generated automatically from your date and timeline data."}
                </div>
                <ul className="text-xs text-slate-400 list-disc pl-5">
                  <li>Depends on: anniversary/start date</li>
                  <li>Depends on: timeline events</li>
                </ul>
              </div>
            );
            break;
          case "anniversary_countdown":
          case "wedding_countdown":
          case "countdown":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-700">
                    {sectionTitle}
                  </span>
                  <span className="ml-2 text-xs font-medium bg-sky-100 text-sky-600 rounded-full px-2 py-0.5">
                    Auto-generated
                  </span>
                </div>
                <div className="text-slate-600 text-sm mb-1">
                  {copy?.emptyState ||
                    "This section automatically counts down to your selected special date."}
                </div>
                <ul className="text-xs text-slate-400 list-disc pl-5">
                  <li>Depends on: special date</li>
                </ul>
              </div>
            );
            break;
          case "qr_keepsake":
            content = (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-700">
                    {sectionTitle}
                  </span>
                  <span className="ml-2 text-xs font-medium bg-sky-100 text-sky-600 rounded-full px-2 py-0.5">
                    Auto-generated
                  </span>
                </div>
                <div className="text-slate-600 text-sm mb-1">
                  {copy?.emptyState ||
                    "This section automatically generates a QR code for your website keepsake."}
                </div>
                <ul className="text-xs text-slate-400 list-disc pl-5">
                  <li>Depends on: website URL</li>
                </ul>
              </div>
            );
            break;
          default:
            content = (
              <TextContentInput
                label={sectionTitle}
                value={section_content?.[section.key]?.content || ""}
                onChange={(content: string) =>
                  onSectionContentChange(section.key, { content })
                }
                placeholder={`Write content for ${sectionTitle.toLowerCase()}...`}
                rows={5}
              />
            );
        }
        // Determine if this is an auto-generated section
        const isAutoGenerated =
          section.key === "relationship_stats" ||
          section.key === "anniversary_countdown" ||
          section.key === "wedding_countdown" ||
          section.key === "countdown" ||
          section.key === "qr_keepsake";
        return (
          <div
            key={section.key}
            className={`mb-4 border rounded-xl overflow-hidden bg-white ${statusColors[status].border}`}
            style={{ borderLeftWidth: 6 }}
          >
            {/* Accordion Header */}
            <button
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all ${openSectionKey === section.key ? "bg-rose-50" : "bg-slate-50 hover:bg-slate-100"}`}
              aria-expanded={openSectionKey === section.key}
              aria-controls={`section-panel-${section.key}`}
              onClick={() =>
                setOpenSectionKey(
                  openSectionKey === section.key ? null : section.key,
                )
              }
            >
              <div className="flex items-center gap-2">
                <span className={`text-xl ${statusColors[status].icon}`}>
                  {sectionIcon}
                </span>
                <span className="font-semibold text-slate-700">
                  {sectionTitle}
                </span>
                {/* Status badge */}
                <span
                  className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${isAutoGenerated ? "bg-sky-100 text-sky-600" : status === "error" ? "bg-rose-100 text-rose-600" : status === "complete" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                >
                  {statusLabel}
                </span>
              </div>
              <span
                className={`ml-2 transition-transform duration-200 ${openSectionKey === section.key ? "rotate-90 text-rose-500" : "rotate-0 text-slate-400"}`}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M7 7l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            {/* Accordion Panel */}
            <div
              id={`section-panel-${section.key}`}
              className={`transition-all duration-300 ${openSectionKey === section.key ? "max-h-[2000px] opacity-100 py-4 px-4" : "max-h-0 opacity-0 py-0 px-4 pointer-events-none"}`}
              aria-hidden={openSectionKey !== section.key}
              style={{ overflow: "hidden" }}
            >
              {openSectionKey === section.key && <div>{content}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
