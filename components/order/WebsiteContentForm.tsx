'use client';

import { useMemo, useState } from 'react';
import { StarterTemplate } from '@/components/templates/templateData';
import { OccasionType } from '@/lib/types';
import FormStepLayout from './FormStepLayout';
import TimelineInput, { TimelineEventInput } from './TimelineInput';

interface WebsiteContentFormData {
  yourName: string;
  partnerName: string;
  websiteSlug: string;
  websiteTitle: string;
  tagline: string;
  specialDate: string;
  welcomeMessage: string;
  mainLetter: string;
  musicLink: string;
  galleryPhotos: File[];
  timelineEvents: TimelineEventInput[];
  quote: string;
  extraNotes: string;
}

type WebsiteContentFormProps = {
  selectedTemplate: StarterTemplate;
  selectedOccasion: OccasionType;
  selectedProductLabel: string;
};

const EMPTY_EVENT: TimelineEventInput = {
  id: crypto.randomUUID(),
  title: '',
  date: '',
  description: '',
};

const INITIAL_DATA: WebsiteContentFormData = {
  yourName: '',
  partnerName: '',
  websiteSlug: '',
  websiteTitle: '',
  tagline: '',
  specialDate: '',
  welcomeMessage: '',
  mainLetter: '',
  musicLink: '',
  galleryPhotos: [],
  timelineEvents: [EMPTY_EVENT],
  quote: '',
  extraNotes: '',
};

const steps = ['Basics', 'Story Content', 'Media & Timeline', 'Review'];

export default function WebsiteContentForm({ selectedTemplate, selectedOccasion, selectedProductLabel }: WebsiteContentFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<WebsiteContentFormData>(INITIAL_DATA);

  const completionScore = useMemo(() => {
    const requiredChecks = [
      formData.yourName.trim(),
      formData.partnerName.trim(),
      formData.websiteSlug.trim(),
      formData.websiteTitle.trim(),
      formData.tagline.trim(),
      formData.specialDate.trim(),
      formData.welcomeMessage.trim(),
      formData.mainLetter.trim(),
      formData.musicLink.trim(),
      formData.quote.trim(),
      formData.galleryPhotos.length > 0,
      formData.timelineEvents.some(
        (event) => event.title.trim() && event.date.trim() && event.description.trim()
      ),
    ];

    const completed = requiredChecks.filter(Boolean).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [formData]);

  const setField = <K extends keyof WebsiteContentFormData>(field: K, value: WebsiteContentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const stepIsValid = () => {
    if (step === 0) {
      return (
        !!formData.yourName.trim() &&
        !!formData.partnerName.trim() &&
        !!formData.websiteSlug.trim() &&
        !!formData.websiteTitle.trim() &&
        !!formData.tagline.trim()
      );
    }

    if (step === 1) {
      return (
        !!formData.specialDate.trim() &&
        !!formData.welcomeMessage.trim() &&
        !!formData.mainLetter.trim() &&
        !!formData.musicLink.trim() &&
        !!formData.quote.trim()
      );
    }

    if (step === 2) {
      const hasValidTimeline = formData.timelineEvents.some(
        (event) => event.title.trim() && event.date.trim() && event.description.trim()
      );
      return formData.galleryPhotos.length > 0 && hasValidTimeline;
    }

    return true;
  };

  const nextStep = () => {
    if (!stepIsValid()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const submitMock = async () => {
    if (submitting) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    console.log('Mock website content payload', {
      ...formData,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      occasion: selectedOccasion,
      selectedProductLabel,
      galleryPhotos: formData.galleryPhotos.map((photo) => photo.name),
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#0f172a]/10 bg-white px-4 py-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
            <span>Progress</span>
            <span>{completionScore}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-[#e2e8f0]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#0284c7]" style={{ width: `${completionScore}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] font-semibold text-[#64748b]">
            {steps.map((stepLabel, index) => (
              <div
                key={stepLabel}
                className={`rounded-lg px-2 py-1 text-center ${index === step ? 'bg-[#0f172a] text-white' : 'bg-[#f1f5f9]'}`}
              >
                {stepLabel}
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <FormStepLayout
            title="Basic Website Setup"
            description="Start with your names and the core details that will be shown first on the website."
            step={1}
            totalSteps={steps.length}
            onNext={nextStep}
            isNextDisabled={!stepIsValid()}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={formData.yourName}
                onChange={(e) => setField('yourName', e.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
              />
              <input
                value={formData.partnerName}
                onChange={(e) => setField('partnerName', e.target.value)}
                placeholder="Partner name"
                className="rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
              />
              <input
                value={formData.websiteSlug}
                onChange={(e) => setField('websiteSlug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="Website slug (e.g. mia-and-ryan)"
                className="rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
              />
              <input
                value={formData.websiteTitle}
                onChange={(e) => setField('websiteTitle', e.target.value)}
                placeholder="Website title"
                className="rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
              />
            </div>

            <input
              value={formData.tagline}
              onChange={(e) => setField('tagline', e.target.value)}
              placeholder="Tagline"
              className="w-full rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
            />
          </FormStepLayout>
        )}

        {step === 1 && (
          <FormStepLayout
            title="Story and Message"
            description="Add the meaningful parts of your website in a guided way."
            step={2}
            totalSteps={steps.length}
            onBack={prevStep}
            onNext={nextStep}
            isNextDisabled={!stepIsValid()}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="date"
                value={formData.specialDate}
                onChange={(e) => setField('specialDate', e.target.value)}
                className="rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
              />
              <input
                value={formData.musicLink}
                onChange={(e) => setField('musicLink', e.target.value)}
                placeholder="Music link (Spotify/YouTube)"
                className="rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
              />
            </div>

            <textarea
              value={formData.welcomeMessage}
              onChange={(e) => setField('welcomeMessage', e.target.value)}
              placeholder="Welcome message"
              className="min-h-[100px] w-full rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
            />
            <textarea
              value={formData.mainLetter}
              onChange={(e) => setField('mainLetter', e.target.value)}
              placeholder="Main letter / story"
              className="min-h-[150px] w-full rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
            />
            <textarea
              value={formData.quote}
              onChange={(e) => setField('quote', e.target.value)}
              placeholder="Favorite quote"
              className="min-h-[90px] w-full rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
            />
            <textarea
              value={formData.extraNotes}
              onChange={(e) => setField('extraNotes', e.target.value)}
              placeholder="Optional extra notes"
              className="min-h-[90px] w-full rounded-xl border border-[#0f172a]/15 px-3 py-2.5 text-sm"
            />
          </FormStepLayout>
        )}

        {step === 2 && (
          <FormStepLayout
            title="Gallery and Timeline"
            description="Upload photos and add timeline milestones for a richer story page."
            step={3}
            totalSteps={steps.length}
            onBack={prevStep}
            onNext={nextStep}
            isNextDisabled={!stepIsValid()}
          >
            <div className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4">
              <p className="text-sm font-semibold text-[#0f172a]">Gallery photo uploads</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setField('galleryPhotos', Array.from(e.target.files || []))}
                className="mt-3 block w-full text-sm"
              />
              {formData.galleryPhotos.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-[#475569]">
                  {formData.galleryPhotos.map((photo) => (
                    <li key={`${photo.name}-${photo.lastModified}`}>• {photo.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#0f172a]">Timeline events</p>
              <TimelineInput
                value={formData.timelineEvents}
                onChange={(events) => setField('timelineEvents', events)}
              />
            </div>
          </FormStepLayout>
        )}

        {step === 3 && (
          <FormStepLayout
            title="Review and Submit"
            description="Quickly review your details before sending your request."
            step={4}
            totalSteps={steps.length}
            onBack={prevStep}
            onNext={submitMock}
            nextLabel="Submit Request"
            isSubmitting={submitting}
          >
            <div className="grid gap-3 text-sm text-[#334155] md:grid-cols-2">
              <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">Template</p>
                <p className="mt-1 font-semibold text-[#0f172a]">{selectedTemplate.name}</p>
              </div>
              <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">Occasion</p>
                <p className="mt-1 font-semibold text-[#0f172a]">{selectedOccasion.replace(/_/g, ' ')}</p>
              </div>
              <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">Product</p>
                <p className="mt-1 font-semibold text-[#0f172a]">{selectedProductLabel}</p>
              </div>
              <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">Website Slug</p>
                <p className="mt-1 font-semibold text-[#0f172a]">{formData.websiteSlug || '-'}</p>
              </div>
              <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">Names</p>
                <p className="mt-1 font-semibold text-[#0f172a]">
                  {formData.yourName || '-'} &amp; {formData.partnerName || '-'}
                </p>
              </div>
              <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">Special Date</p>
                <p className="mt-1 font-semibold text-[#0f172a]">{formData.specialDate || '-'}</p>
              </div>
            </div>

            {submitted && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                Mock submit successful. Data is currently logged in the browser console and is ready to connect to Supabase later.
              </p>
            )}
          </FormStepLayout>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-[#0f172a]/10 bg-gradient-to-br from-white to-[#eef2ff] p-5 shadow-[0_20px_60px_-40px_rgba(2,6,23,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">Selected Template</p>
          <h3 className="mt-2 text-xl font-black text-[#0f172a]">{selectedTemplate.name}</h3>
          <p className="mt-2 text-sm text-[#475569]">{selectedTemplate.description}</p>
          <div className={`mt-4 h-32 rounded-2xl border border-white/70 bg-gradient-to-br ${selectedTemplate.accentClass}`} />

          <div className="mt-5 space-y-2 rounded-2xl border border-[#0f172a]/10 bg-white/80 p-4 text-sm">
            <p className="font-semibold text-[#0f172a]">Live Summary</p>
            <p className="text-[#475569]">Title: <span className="font-medium text-[#0f172a]">{formData.websiteTitle || '-'}</span></p>
            <p className="text-[#475569]">Tagline: <span className="font-medium text-[#0f172a]">{formData.tagline || '-'}</span></p>
            <p className="text-[#475569]">Photos: <span className="font-medium text-[#0f172a]">{formData.galleryPhotos.length}</span></p>
            <p className="text-[#475569]">Timeline: <span className="font-medium text-[#0f172a]">{formData.timelineEvents.length}</span></p>
          </div>
        </div>
      </aside>
    </div>
  );
}
