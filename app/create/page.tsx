'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TemplateSelector from '@/components/templates/TemplateSelector';
import ThemeSelector from '@/components/builder/ThemeSelector';
import TimelineInput, { TimelineEventInput } from '@/components/order/TimelineInput';
import { OccasionType } from '@/lib/types';
import { THEME_CONFIG, ThemeKey } from '@/config/themeConfig';
import { OCCASION_REGISTRY } from '@/lib/occasion-registry';
import { getTemplateById, getTemplatesByOccasion } from '@/components/templates/templateData';
import { calculateExpirationDate } from '@/lib/expiration-utils';

const PRODUCT_VARIANTS = [
  {
    id: 'qr_only',
    label: 'QR Code Only',
    basePrice: 199,
    description: 'A beautifully printed QR card that links visitors to your digital love story.',
    features: ['Printed QR card', 'Links to your website', 'PDF proof included', 'Standard production'],
    badge: null,
  },
  {
    id: 'qr_nfc',
    label: 'QR + NFC Combo',
    basePrice: 299,
    description: 'Scan or tap — dual technology for the ultimate modern keepsake.',
    features: ['Printed QR card', 'NFC tag included', 'Tap-to-share ready', 'Priority production'],
    badge: 'Most Popular',
  },
] as const;

const FINISH_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Matte',
    price: 0,
    description: 'Clean matte finish, vivid colors, everyday durability.',
  },
  {
    id: 'premium',
    label: 'Premium Glossy',
    price: 60,
    description: 'UV-coated glossy finish, deeper colors, scratch-resistant.',
  },
] as const;

const STEPS = [
  { id: 1 as const, label: 'Product' },
  { id: 2 as const, label: 'Template + Theme' },
  { id: 3 as const, label: 'Customize' },
  { id: 4 as const, label: 'Review' },
  { id: 5 as const, label: 'Order Details' },
  { id: 6 as const, label: 'Payment' },
];

const CREATE_DRAFT_KEY = 'create-order-draft-v1';
const INTERACTIVE_CARD_CLASS = 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)] active:scale-[0.99]';
const PRIMARY_BUTTON_CLASS = 'rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e293b] hover:shadow-[0_10px_24px_rgba(15,23,42,0.18)] active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[#0f172a] disabled:hover:shadow-none';
const TAGLINE_STARTERS = [
  'Forever starts here',
  'A story worth revisiting',
  'Made with love, shared with heart',
] as const;
const ORDER_JOURNEY = [
  { id: 'details', label: 'Design Review', description: 'We review your story content and finalize the layout.' },
  { id: 'production', label: 'Production', description: 'Your QR or NFC card is prepared and quality-checked.' },
  { id: 'delivery', label: 'Delivery', description: 'Your order is packed and shipped to your address.' },
] as const;

type OrderDetails = {
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: string;
};

type PayMongoMethod = 'gcash' | 'card' | 'grab_pay';

type Personalization = {
  websiteSlug: string;
  websiteTitle: string;
  tagline: string;
  yourName: string;
  partnerName: string;
  specialDate: string;
  welcomeMessage: string;
  mainLetter: string;
  musicLink: string;
  quote: string;
  extraNotes: string;
  galleryFiles: File[];
  timelineEvents: TimelineEventInput[];
};

const EMPTY_EVENT: TimelineEventInput = {
  id: crypto.randomUUID(),
  title: '',
  date: '',
  description: '',
};

const allOccasions = Object.values(OCCASION_REGISTRY).map((meta) => ({
  id: meta.key,
  label: meta.label,
}));

export default function CreatePage() {
  const searchParams = useSearchParams();
  const templateFromQuery = searchParams.get('template');
  const occasionFromQuery = searchParams.get('occasion') as OccasionType | null;
  const paymentStatus = searchParams.get('payment');
  const orderIdFromQuery = searchParams.get('orderId');

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const finalizeHandledRef = useRef(false);
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});
  const [step5Errors, setStep5Errors] = useState<Record<string, string>>({});
  const [slugCheckState, setSlugCheckState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [slugCheckMessage, setSlugCheckMessage] = useState<string>('');
  const [showOptionalSections, setShowOptionalSections] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const draftRef = useRef<any>(null);

  const [selectedVariant, setSelectedVariant] = useState<(typeof PRODUCT_VARIANTS)[number]['id']>('qr_only');
  const [selectedFinish, setSelectedFinish] = useState<(typeof FINISH_OPTIONS)[number]['id']>('standard');
  const [quantity, setQuantity] = useState(1);

  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>(
    occasionFromQuery && allOccasions.some((item) => item.id === occasionFromQuery) ? occasionFromQuery : 'couple'
  );
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('romantic_classic');

  const occasionTemplates = useMemo(() => getTemplatesByOccasion(selectedOccasion), [selectedOccasion]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    if (templateFromQuery) return templateFromQuery;
    return getTemplatesByOccasion('couple')[0]?.id || getTemplateById(null).id;
  });

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PayMongoMethod>('gcash');

  const [personalization, setPersonalization] = useState<Personalization>({
    websiteSlug: '',
    websiteTitle: '',
    tagline: '',
    yourName: '',
    partnerName: '',
    specialDate: '',
    welcomeMessage: '',
    mainLetter: '',
    musicLink: '',
    quote: '',
    extraNotes: '',
    galleryFiles: [],
    timelineEvents: [EMPTY_EVENT],
  });

  const selectedVariantConfig = PRODUCT_VARIANTS.find((option) => option.id === selectedVariant) || PRODUCT_VARIANTS[0];
  const selectedFinishConfig = FINISH_OPTIONS.find((option) => option.id === selectedFinish) || FINISH_OPTIONS[0];
  const estimatedTotal = (selectedVariantConfig.basePrice + selectedFinishConfig.price) * quantity;
  const selectedTemplate = getTemplateById(selectedTemplateId);
  const selectedThemeConfig = THEME_CONFIG[selectedTheme];

  const previewPhotoUrls = useMemo(
    () => personalization.galleryFiles.slice(0, 3).map((file) => URL.createObjectURL(file)),
    [personalization.galleryFiles]
  );
  const namePair = [personalization.yourName.trim(), personalization.partnerName.trim()].filter(Boolean).join(' & ');
  const taglineSuggestions = useMemo(() => {
    if (!namePair) return TAGLINE_STARTERS;
    return [
      `${namePair} forever starts here`,
      `A love story by ${namePair}`,
      `Every memory, every moment, ${namePair}`,
    ];
  }, [namePair]);
  const estimatedDeliveryLabel = useMemo(() => {
    const leadDays = selectedVariant === 'qr_nfc' ? 7 : 5;
    const finishDays = selectedFinish === 'premium' ? 2 : 0;
    const eta = new Date();
    eta.setDate(eta.getDate() + leadDays + finishDays);
    return eta.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [selectedFinish, selectedVariant]);

  const canProceedStep1 = quantity > 0;
  const canProceedStep2 = !!selectedOccasion && !!selectedTemplateId && !!selectedTheme;
  const canProceedStep3 =
    !!personalization.websiteTitle.trim() &&
    !!personalization.yourName.trim() &&
    !!personalization.specialDate;
  const canProceedStep5 =
    !!orderDetails.fullName.trim() &&
    !!orderDetails.email.trim() &&
    !!orderDetails.phone.trim() &&
    !!orderDetails.shippingAddress.trim();
  const canProceedStep6 = !!paymentMethod;
  const showMobileStickyAction = step < 6 || (step === 6 && !submittedId);
  const mobilePrimaryLabel =
    step === 1 ? 'Continue to Template' :
    step === 2 ? 'Continue to Customize' :
    step === 3 ? 'Continue to Review' :
    step === 4 ? 'Continue to Order Details' :
    step === 5 ? 'Continue to Payment' :
    `Pay P${estimatedTotal}`;
  const mobilePrimaryDisabled =
    submitting ||
    (step === 1 && !canProceedStep1) ||
    (step === 2 && !canProceedStep2) ||
    (step === 3 && !canProceedStep3) ||
    (step === 5 && !canProceedStep5) ||
    (step === 6 && !canProceedStep6);

  const buildAutoSlug = () => {
    const source = [personalization.yourName, personalization.partnerName, personalization.websiteTitle]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return source || 'order';
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!personalization.websiteTitle.trim()) errors.websiteTitle = 'Website title is required.';
    if (!personalization.yourName.trim()) errors.yourName = 'Your name is required.';
    if (!personalization.specialDate) errors.specialDate = 'Special date is required.';
    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep5 = () => {
    const errors: Record<string, string> = {};
    if (!orderDetails.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!orderDetails.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderDetails.email.trim())) {
      errors.email = 'Please enter a valid email.';
    }
    if (!orderDetails.phone.trim()) errors.phone = 'Phone number is required.';
    if (!orderDetails.shippingAddress.trim()) errors.shippingAddress = 'Shipping address is required.';
    setStep5Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNextStep = () => {
    if (step === 1 && canProceedStep1) return setStep(2);
    if (step === 2 && canProceedStep2) return setStep(3);
    if (step === 3) {
      if (!validateStep3()) return;
      return setStep(4);
    }
    if (step === 4) return setStep(5);
    if (step === 5) {
      if (!validateStep5()) return;
      return setStep(6);
    }
    if (step === 6 && canProceedStep6) {
      void startPayMongoCheckout();
    }
  };

  const generateSlug = () => {
    const base = buildAutoSlug();
    setPersonalization((prev) => ({ ...prev, websiteSlug: base }));
  };

  useEffect(() => {
    const autoSlug = buildAutoSlug();
    setPersonalization((prev) => (prev.websiteSlug === autoSlug ? prev : { ...prev, websiteSlug: autoSlug }));
  }, [personalization.yourName, personalization.partnerName, personalization.websiteTitle]);

  const resumeDraft = () => {
    const draft = draftRef.current;
    if (!draft) return;

    if (draft.step >= 1 && draft.step <= 6) setStep(draft.step);
    if (draft.selectedVariant) setSelectedVariant(draft.selectedVariant);
    if (draft.selectedFinish) setSelectedFinish(draft.selectedFinish);
    if (typeof draft.quantity === 'number') setQuantity(Math.max(1, Math.min(20, draft.quantity)));
    if (draft.selectedOccasion) setSelectedOccasion(draft.selectedOccasion);
    if (draft.selectedTheme) setSelectedTheme(draft.selectedTheme);
    if (draft.selectedTemplateId) setSelectedTemplateId(draft.selectedTemplateId);
    if (draft.orderDetails) setOrderDetails((prev) => ({ ...prev, ...draft.orderDetails }));
    if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
    if (draft.personalization) {
      setPersonalization((prev) => ({
        ...prev,
        ...draft.personalization,
        galleryFiles: [],
      }));
    }

    setShowResumePrompt(false);
    setDraftSaved(true);
  };

  const discardDraft = () => {
    window.localStorage.removeItem(CREATE_DRAFT_KEY);
    draftRef.current = null;
    setShowResumePrompt(false);
    setDraftSaved(false);
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CREATE_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        draftRef.current = parsed;
        setShowResumePrompt(true);
      }
    } catch {
      window.localStorage.removeItem(CREATE_DRAFT_KEY);
    } finally {
      setDraftHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!draftHydrated || submittedId) return;

    const timer = window.setTimeout(() => {
      const draft = {
        step,
        selectedVariant,
        selectedFinish,
        quantity,
        selectedOccasion,
        selectedTheme,
        selectedTemplateId,
        orderDetails,
        paymentMethod,
        personalization: {
          ...personalization,
          galleryFiles: [],
        },
      };

      window.localStorage.setItem(CREATE_DRAFT_KEY, JSON.stringify(draft));
      setDraftSaved(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    draftHydrated,
    submittedId,
    step,
    selectedVariant,
    selectedFinish,
    quantity,
    selectedOccasion,
    selectedTheme,
    selectedTemplateId,
    orderDetails,
    paymentMethod,
    personalization,
  ]);

  useEffect(() => {
    const slug = personalization.websiteSlug.trim();

    if (!slug) {
      setSlugCheckState('idle');
      setSlugCheckMessage('');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugCheckState('taken');
      setSlugCheckMessage('Use lowercase letters, numbers, and hyphen only.');
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setSlugCheckState('checking');
        setSlugCheckMessage('Checking availability...');
        const response = await fetch(`/api/qrcode/verify?slug=${encodeURIComponent(slug)}`);
        const result = await response.json();
        if (!response.ok || !result?.success) throw new Error('Unable to validate slug');

        if (result.exists) {
          setSlugCheckState('taken');
          setSlugCheckMessage('This slug is already in use. We can still auto-append a unique suffix.');
        } else {
          setSlugCheckState('available');
          setSlugCheckMessage('Slug is available.');
        }
      } catch {
        setSlugCheckState('idle');
        setSlugCheckMessage('Could not validate slug right now.');
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [personalization.websiteSlug]);

  const buildOrderPayload = () => {
    const slugBase = (personalization.websiteSlug.trim() || buildAutoSlug()).toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'order';
    const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-6)}`;

    return {
      slug: uniqueSlug,
      website_name: personalization.websiteTitle,
      site_type: selectedOccasion,
      status: 'pending',
      expires_at: calculateExpirationDate('6_months'),
      config: {
        occasion: selectedOccasion,
        theme: selectedTheme,
        templates: {
          home: selectedTemplate.id,
        },
        fulfillment: {
          status: 'pending_payment',
        },
        specialDate: personalization.specialDate,
        tagline: personalization.tagline,
        message: personalization.welcomeMessage,
        orderDetails,
        product: {
          variant: selectedVariantConfig.label,
          finish: selectedFinishConfig.label,
          quantity,
          estimatedTotal,
        },
        payment: {
          provider: 'paymongo',
          method: paymentMethod,
          status: 'pending',
        },
        personalization: {
          ...personalization,
          galleryFileNames: personalization.galleryFiles.map((file) => file.name),
          galleryFiles: undefined,
        },
      },
    };
  };

  const completeOrderAfterPayment = async () => {
    if (finalizeHandledRef.current) return;
    finalizeHandledRef.current = true;

    let pendingOrderId = window.localStorage.getItem('pendingOrderId') || orderIdFromQuery || '';
    let checkoutSessionId = window.localStorage.getItem('pendingCheckoutSessionId') || '';

    if (pendingOrderId && !checkoutSessionId) {
      try {
        const orderResponse = await fetch(`/api/orders?id=${encodeURIComponent(pendingOrderId)}`);
        const orderResult = await orderResponse.json();
        const existingOrder = orderResult?.order;
        checkoutSessionId = String(existingOrder?.config?.payment?.checkoutSessionId || existingOrder?.config?.payment?.transactionId || '').trim();

        if (existingOrder?.config?.payment?.status === 'paid') {
          setSubmittedId(String(existingOrder?.id || pendingOrderId));
          setOrderId(String(existingOrder?.id || pendingOrderId));
          setTransactionId(String(existingOrder?.config?.payment?.transactionId || checkoutSessionId || ''));
          setPaymentMessage('Payment successful. Your order is now marked as ship.');
          window.localStorage.removeItem('pendingOrderId');
          window.localStorage.removeItem('pendingCheckoutSessionId');
          window.localStorage.removeItem(CREATE_DRAFT_KEY);
          return;
        }
      } catch {
        // Continue to normal verification flow below.
      }
    }

    if (!pendingOrderId || !checkoutSessionId) {
      setPaymentMessage('Payment succeeded, but order verification data is missing. Please contact support.');
      return;
    }

    try {
      const response = await fetch('/api/paymongo/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: pendingOrderId, checkoutSessionId }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to verify payment');
      }

      setSubmittedId(result.orderId || pendingOrderId || 'submitted');
      setOrderId(result.orderId || pendingOrderId || null);
      setTransactionId(result.transactionId || checkoutSessionId || null);
      setPaymentMessage('Payment successful. Your order is now marked as ship.');
      window.localStorage.removeItem('pendingOrderId');
      window.localStorage.removeItem('pendingCheckoutSessionId');
      window.localStorage.removeItem(CREATE_DRAFT_KEY);
    } catch (error) {
      setPaymentMessage((error as Error).message || 'Failed to verify payment');
    }
  };

  useEffect(() => {
    if (paymentStatus === 'success') {
      setStep(6);
      completeOrderAfterPayment();
      return;
    }

    if (paymentStatus === 'cancelled') {
      setStep(6);
      setPaymentMessage('Payment was cancelled. You can try again anytime.');
    }
  }, [paymentStatus]);

  const startPayMongoCheckout = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = buildOrderPayload();
      const createOrderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const createOrderResult = await createOrderResponse.json();
      if (!createOrderResponse.ok || !createOrderResult?.success || !createOrderResult?.site?.id) {
        throw new Error(createOrderResult?.message || 'Failed to create pending order');
      }

      const createdOrderId = String(createOrderResult.site.id);
      setOrderId(createdOrderId);

      const response = await fetch('/api/paymongo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: estimatedTotal,
          websiteName: personalization.websiteTitle || 'KeyStory Website Order',
          customerName: orderDetails.fullName,
          customerEmail: orderDetails.email,
          customerPhone: orderDetails.phone,
          preferredMethod: paymentMethod,
          orderId: createdOrderId,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to start PayMongo checkout');
      }

      if (!result.checkoutUrl) {
        throw new Error('PayMongo checkout URL was not returned');
      }

      if (result.sessionId) {
        await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: createdOrderId,
            config: {
              ...(createOrderResult.site?.config || payload.config || {}),
              fulfillment: {
                ...((createOrderResult.site?.config || payload.config || {})?.fulfillment || {}),
                status: 'pending_payment',
              },
              payment: {
                ...(createOrderResult.site?.config?.payment || payload.config?.payment || {}),
                checkoutSessionId: result.sessionId,
                transactionId: result.sessionId,
                status: 'pending',
              },
            },
            status: 'pending',
          }),
        });

        window.localStorage.setItem('pendingOrderId', createdOrderId);
        window.localStorage.setItem('pendingCheckoutSessionId', result.sessionId);
      }

      window.location.href = result.checkoutUrl;
      return;

    } catch (error) {
      alert((error as Error).message || 'Failed to continue to PayMongo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-10 pb-24 text-[#0f172a] md:px-6 md:pb-10">
      <div className="mx-auto w-full max-w-6xl">

        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">KeyStory</p>
            <h1 className="mt-1.5 text-3xl font-black md:text-4xl">Create Your Story</h1>
            <p className="mt-1.5 max-w-xl text-sm text-[#475569]">
              Personalize your digital love story — choose a product, design your website, and have it delivered.
            </p>
            {draftSaved && !showResumePrompt && (
              <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Draft auto-saved
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/track-order" className="inline-flex rounded-full border border-[#0f172a]/20 bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]">
              Track Order
            </Link>
            <Link href="/" className="inline-flex rounded-full border border-[#0f172a]/20 bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]">
              Home
            </Link>
          </div>
        </div>

        {showResumePrompt && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="font-semibold text-amber-900">Found an unfinished order draft.</p>
            <p className="mt-1 text-amber-800">Resume where you left off or start fresh.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={resumeDraft} className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white">Resume Draft</button>
              <button type="button" onClick={discardDraft} className="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-900">Start Fresh</button>
            </div>
          </div>
        )}

        {/* ── Step Progress ── */}
        <div className="mb-6 rounded-2xl border border-[#0f172a]/10 bg-white px-4 py-4 sm:px-6">
          {/* Mobile: compact */}
          <div className="flex items-center justify-between sm:hidden">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-bold text-white">{step} / 6</span>
              <span className="text-sm font-semibold">{STEPS.find((s) => s.id === step)?.label}</span>
            </div>
            <div className="flex gap-0.5">
              {STEPS.map((s) => (
                <div key={s.id} className={`h-1.5 w-5 rounded-full transition-colors ${step >= s.id ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]'}`} />
              ))}
            </div>
          </div>
          {/* Desktop: full stepper */}
          <div className="hidden sm:flex items-start">
            {STEPS.map((item, idx) => {
              const isCompleted = step > item.id;
              const isCurrent = step === item.id;
              const isLast = idx === STEPS.length - 1;
              return (
                <div key={item.id} className="flex flex-1 items-start">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      disabled={!isCompleted}
                      onClick={() => isCompleted && setStep(item.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                        isCompleted
                          ? 'cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600'
                          : isCurrent
                          ? 'cursor-default bg-[#0f172a] text-white ring-4 ring-[#0f172a]/10'
                          : 'cursor-not-allowed bg-[#e2e8f0] text-[#94a3b8]'
                      }`}
                    >
                      {isCompleted ? (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 6.5L5 9.5L11 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        item.id
                      )}
                    </button>
                    <span className={`mt-1.5 max-w-[72px] text-center text-[11px] font-semibold leading-tight ${isCurrent ? 'text-[#0f172a]' : isCompleted ? 'text-emerald-600' : 'text-[#94a3b8]'}`}>
                      {item.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`mt-4 mx-1 h-0.5 flex-1 rounded-full transition-colors ${step > item.id ? 'bg-emerald-400' : 'bg-[#e2e8f0]'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STEP 1: PRODUCT ── */}
        {step === 1 && (
          <section className="animate-createSection rounded-3xl border border-[#0f172a]/10 bg-white p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-black">Choose Your Product</h2>
            <p className="mb-6 text-sm text-[#475569]">Select the product type and print finish that suits your story.</p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-6 md:col-span-2">
                {/* Variants */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">Product Variant</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PRODUCT_VARIANTS.map((option) => {
                      const isSelected = selectedVariant === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedVariant(option.id)}
                          className={`relative rounded-2xl border p-4 text-left ${INTERACTIVE_CARD_CLASS} ${isSelected ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#0f172a]/15 bg-white text-[#0f172a] hover:border-[#0f172a]/30'}`}
                        >
                          {option.badge && (
                            <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#0f172a] text-white'}`}>
                              {option.badge}
                            </span>
                          )}
                          <p className="text-base font-black">{option.label}</p>
                          <p className={`mt-0.5 text-2xl font-black ${isSelected ? '' : 'text-[#0f172a]'}`}>₱{option.basePrice}</p>
                          <p className={`mt-2 text-xs leading-relaxed ${isSelected ? 'text-white/75' : 'text-[#64748b]'}`}>{option.description}</p>
                          <ul className="mt-3 space-y-1">
                            {option.features.map((f) => (
                              <li key={f} className={`flex items-center gap-1.5 text-xs ${isSelected ? 'text-white/90' : 'text-[#475569]'}`}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                  <path d="M1.5 5.5L4 8L9.5 2" stroke={isSelected ? 'white' : '#22c55e'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Finish */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">Print Finish</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {FINISH_OPTIONS.map((option) => {
                      const isSelected = selectedFinish === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedFinish(option.id)}
                          className={`rounded-2xl border p-4 text-left ${INTERACTIVE_CARD_CLASS} ${isSelected ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#0f172a]/15 bg-white text-[#0f172a] hover:border-[#0f172a]/30'}`}
                        >
                          <p className="font-bold">{option.label}</p>
                          <p className={`mt-0.5 text-lg font-black`}>{option.price === 0 ? 'Included' : `+₱${option.price}`}</p>
                          <p className={`mt-1.5 text-xs ${isSelected ? 'text-white/75' : 'text-[#64748b]'}`}>{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Quantity */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0f172a]/20 text-lg font-bold hover:bg-[#f8fafc]">−</button>
                    <span className="w-10 text-center text-xl font-black">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((q) => Math.min(20, q + 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0f172a]/20 text-lg font-bold hover:bg-[#f8fafc]">+</button>
                    <span className="text-xs text-[#94a3b8]">max 20 per order</span>
                  </div>
                </div>
                <button type="button" disabled={!canProceedStep1} onClick={() => setStep(2)} className={`${PRIMARY_BUTTON_CLASS} px-8 py-3 text-base`}>
                  Next: Template + Theme →
                </button>
              </div>
              {/* Order Summary Sidebar */}
              <div className="rounded-2xl border border-[#0f172a]/10 bg-[#0f172a] p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Order Summary</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-300">Variant</span><span className="font-semibold text-right">{selectedVariantConfig.label}</span></div>
                  <div className="flex justify-between"><span className="text-slate-300">Base price</span><span className="font-semibold">₱{selectedVariantConfig.basePrice}</span></div>
                  <div className="flex justify-between"><span className="text-slate-300">Finish</span><span className="font-semibold">{selectedFinishConfig.label}</span></div>
                  {selectedFinishConfig.price > 0 && (
                    <div className="flex justify-between"><span className="text-slate-300">Finish add-on</span><span className="font-semibold">+₱{selectedFinishConfig.price}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-slate-300">Quantity</span><span className="font-semibold">×{quantity}</span></div>
                </div>
                <div className="my-3 h-px bg-white/10" />
                <div className="flex items-end justify-between">
                  <p className="text-sm text-slate-300">Estimated Total</p>
                  <p className="text-3xl font-black">₱{estimatedTotal}</p>
                </div>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Estimated Delivery</p>
                  <p className="mt-1 text-sm font-semibold text-white">{estimatedDeliveryLabel}</p>
                </div>
                <p className="mt-3 text-xs text-slate-500">Shipping included. Final amount confirmed at checkout.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 2: TEMPLATE + THEME ── */}
        {step === 2 && (
          <section className="animate-createSection space-y-6 rounded-3xl border border-[#0f172a]/10 bg-white p-6 md:p-8">
            <div>
              <h2 className="text-2xl font-black">Template + Theme</h2>
              <p className="mt-1 text-sm text-[#475569]">Choose the style and look of your digital story website.</p>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">Occasion</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {allOccasions.map((occasion) => (
                  <button
                    key={occasion.id}
                    type="button"
                    onClick={() => setSelectedOccasion(occasion.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${selectedOccasion === occasion.id ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#0f172a]/15 bg-white text-[#0f172a] hover:border-[#0f172a]/30'}`}
                  >
                    {occasion.label}
                  </button>
                ))}
              </div>
            </div>
            <TemplateSelector
              templates={occasionTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
              onContinue={() => {}}
              stepLabel="Template"
              title="Choose Template"
              description="Select your preferred template style."
              continueLabel="Template Selected"
            />
            <ThemeSelector value={selectedTheme} onChange={(theme) => setSelectedTheme(theme)} occasion={selectedOccasion} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold hover:bg-[#f8fafc]">← Back</button>
              <button type="button" disabled={!canProceedStep2} onClick={() => setStep(3)} className="rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">Next: Customize →</button>
            </div>
          </section>
        )}

        {/* ── STEP 3: CUSTOMIZE ── */}
        {step === 3 && (
          <section className="animate-createSection space-y-8 rounded-3xl border border-[#0f172a]/10 bg-white p-6 md:p-8">
            <div>
              <h2 className="text-2xl font-black">Customize Your Story</h2>
              <p className="mt-1 text-sm text-[#475569]">Fill in the details that will appear on your website. Fields marked * are required.</p>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Website Identity</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Website Title *</label>
                  <input
                    value={personalization.websiteTitle}
                    onChange={(e) => {
                      setPersonalization((prev) => ({ ...prev, websiteTitle: e.target.value }));
                      setStep3Errors((prev) => ({ ...prev, websiteTitle: '' }));
                    }}
                    placeholder="e.g. Juan & Maria's Love Story"
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step3Errors.websiteTitle ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`}
                  />
                  {step3Errors.websiteTitle && <p className="text-xs font-semibold text-red-600">{step3Errors.websiteTitle}</p>}
                  <p className="text-[11px] text-[#64748b]">Your website link will be generated automatically for you.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Tagline</label>
                  <input
                    value={personalization.tagline}
                    onChange={(e) => setPersonalization((prev) => ({ ...prev, tagline: e.target.value }))}
                    placeholder="e.g. Forever starts today"
                    className="w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {taglineSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setPersonalization((prev) => ({ ...prev, tagline: suggestion }))}
                        className="rounded-full border border-[#0f172a]/15 bg-[#f8fafc] px-3 py-1 text-[11px] font-semibold text-[#334155] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0f172a]/30 hover:bg-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Special Date *</label>
                  <input
                    type="date"
                    value={personalization.specialDate}
                    onChange={(e) => {
                      setPersonalization((prev) => ({ ...prev, specialDate: e.target.value }));
                      setStep3Errors((prev) => ({ ...prev, specialDate: '' }));
                    }}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step3Errors.specialDate ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`}
                  />
                  {step3Errors.specialDate && <p className="text-xs font-semibold text-red-600">{step3Errors.specialDate}</p>}
                </div>

                <div className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 md:col-span-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Generated Website Link</p>
                      <p className="mt-1 text-sm font-semibold text-[#0f172a]">keystory.ph/{personalization.websiteSlug || 'your-story-link'}</p>
                      <p className="mt-1 text-[11px] text-[#64748b]">Created automatically from your names and title.</p>
                    </div>
                    <button type="button" onClick={generateSlug} className="rounded-full border border-[#0f172a]/15 bg-white px-3 py-1 text-[11px] font-semibold text-[#0f172a] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0f172a]/30">
                      Refresh Link
                    </button>
                  </div>
                  {slugCheckMessage && (
                    <p className={`mt-3 text-xs font-semibold ${slugCheckState === 'available' ? 'text-emerald-600' : slugCheckState === 'taken' ? 'text-amber-700' : 'text-[#64748b]'}`}>
                      {slugCheckMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">People</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Your Name *</label>
                  <input
                    value={personalization.yourName}
                    onChange={(e) => {
                      setPersonalization((prev) => ({ ...prev, yourName: e.target.value }));
                      setStep3Errors((prev) => ({ ...prev, yourName: '' }));
                    }}
                    placeholder="e.g. Juan"
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step3Errors.yourName ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`}
                  />
                  {step3Errors.yourName && <p className="text-xs font-semibold text-red-600">{step3Errors.yourName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Partner / Recipient Name</label>
                  <input
                    value={personalization.partnerName}
                    onChange={(e) => setPersonalization((prev) => ({ ...prev, partnerName: e.target.value }))}
                    placeholder="e.g. Maria"
                    className="w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] px-4 py-3">
              <button
                type="button"
                onClick={() => setShowOptionalSections((prev) => !prev)}
                className="flex w-full items-center justify-between text-left"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-widest text-[#64748b]">Optional Fields</span>
                  <span className="text-sm font-semibold text-[#334155]">Media, timeline, quote, and extra notes</span>
                </span>
                <span className="text-sm font-bold text-[#0f172a]">{showOptionalSections ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Your Story</p>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Welcome Message</label>
                  <textarea
                    value={personalization.welcomeMessage}
                    onChange={(e) => setPersonalization((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                    placeholder="A short message visitors see first."
                    className="min-h-[80px] w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  />
                  <p className="text-right text-[11px] text-[#94a3b8]">{personalization.welcomeMessage.length} chars</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#475569]">Main Letter / Story</label>
                  <textarea
                    value={personalization.mainLetter}
                    onChange={(e) => setPersonalization((prev) => ({ ...prev, mainLetter: e.target.value }))}
                    placeholder="Your full love letter or story - the heart of the site."
                    className="min-h-[140px] w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  />
                  <p className="text-right text-[11px] text-[#94a3b8]">{personalization.mainLetter.length} chars</p>
                </div>
                {showOptionalSections && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#475569]">Favorite Quote</label>
                    <textarea
                      value={personalization.quote}
                      onChange={(e) => setPersonalization((prev) => ({ ...prev, quote: e.target.value }))}
                      placeholder="A meaningful quote to display on the site."
                      className="min-h-[70px] w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Photos</p>
              <label className="block cursor-pointer rounded-[1.75rem] border-2 border-dashed border-[#0f172a]/20 bg-gradient-to-br from-white to-[#f8fafc] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0f172a]/35 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setPersonalization((prev) => ({ ...prev, galleryFiles: Array.from(e.target.files || []) }))}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f172a] text-white shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V8M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M5 19H19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </div>
                  <p className="mt-4 text-lg font-black text-[#0f172a]">Select your photos</p>
                  <p className="mt-1 max-w-md text-sm text-[#64748b]">Upload 3 to 10 favorite photos so the website feels complete and personal.</p>
                  <div className="mt-4 rounded-full bg-[#0f172a] px-4 py-2 text-sm font-bold text-white">Choose Photos</div>
                  {personalization.galleryFiles.length > 0 ? (
                    <div className="mt-4 w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-left">
                      <p className="text-sm font-semibold text-emerald-700">{personalization.galleryFiles.length} photo{personalization.galleryFiles.length !== 1 ? 's' : ''} selected</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {previewPhotoUrls.map((url) => (
                          <img key={url} src={url} alt="Selected preview" className="h-20 w-full rounded-xl object-cover" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs font-semibold text-amber-700">No photos selected yet.</p>
                  )}
                </div>
              </label>
            </div>

            {showOptionalSections && (
              <>
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Media</p>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#475569]">Background Music Link</label>
                      <input
                        value={personalization.musicLink}
                        onChange={(e) => setPersonalization((prev) => ({ ...prev, musicLink: e.target.value }))}
                        placeholder="Spotify, YouTube, or SoundCloud link"
                        className="w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Timeline Events</p>
                  <TimelineInput value={personalization.timelineEvents} onChange={(events) => setPersonalization((prev) => ({ ...prev, timelineEvents: events }))} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#64748b]">Extra Notes</p>
                  <textarea
                    value={personalization.extraNotes}
                    onChange={(e) => setPersonalization((prev) => ({ ...prev, extraNotes: e.target.value }))}
                    placeholder="Anything else you'd like us to know about your order."
                    className="min-h-[80px] w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold hover:bg-[#f8fafc]">Back</button>
              <button type="button" disabled={!canProceedStep3} onClick={goNextStep} className="rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">Next: Review</button>
            </div>
          </section>
        )}

        {/* ── STEP 4: REVIEW + PREVIEW ── */}
        {step === 4 && (
          <section className="animate-createSection grid gap-6 rounded-3xl border border-[#0f172a]/10 bg-white p-6 md:grid-cols-2 md:p-8">
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black">Review Your Order</h2>
                <p className="mt-1 text-sm text-[#475569]">Everything looks good? You can click any completed step above to go back and edit.</p>
              </div>
              {/* Product */}
              <div className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 text-sm space-y-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Product</p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-[#0f172a] underline underline-offset-2">Edit</button>
                </div>
                <div className="flex justify-between"><span className="text-[#64748b]">Variant</span><span className="font-semibold">{selectedVariantConfig.label}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Finish</span><span className="font-semibold">{selectedFinishConfig.label}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Quantity</span><span className="font-semibold">×{quantity}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Estimated delivery</span><span className="font-semibold">{estimatedDeliveryLabel}</span></div>
                <div className="flex justify-between border-t border-[#0f172a]/10 pt-2"><span className="font-semibold">Estimated Total</span><span className="text-base font-black">₱{estimatedTotal}</span></div>
              </div>
              {/* Design */}
              <div className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 text-sm space-y-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Design</p>
                  <button type="button" onClick={() => setStep(2)} className="text-xs font-semibold text-[#0f172a] underline underline-offset-2">Edit</button>
                </div>
                <div className="flex justify-between"><span className="text-[#64748b]">Occasion</span><span className="font-semibold capitalize">{selectedOccasion}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Template</span><span className="font-semibold">{selectedTemplate.name}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Theme</span><span className="font-semibold">{selectedThemeConfig.label}</span></div>
              </div>
              {/* Personalization */}
              <div className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 text-sm space-y-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Personalization</p>
                  <button type="button" onClick={() => setStep(3)} className="text-xs font-semibold text-[#0f172a] underline underline-offset-2">Edit</button>
                </div>
                <div className="flex justify-between"><span className="text-[#64748b]">Title</span><span className="font-semibold text-right">{personalization.websiteTitle || '—'}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Slug</span><span className="font-mono text-xs">{personalization.websiteSlug || '—'}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Names</span><span className="font-semibold text-right">{[personalization.yourName, personalization.partnerName].filter(Boolean).join(' & ') || '—'}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Date</span><span className="font-semibold">{personalization.specialDate || '—'}</span></div>
                {personalization.musicLink && <div className="flex justify-between"><span className="text-[#64748b]">Music</span><span className="max-w-[55%] truncate text-right text-xs font-semibold">{personalization.musicLink}</span></div>}
                {personalization.galleryFiles.length > 0 && <div className="flex justify-between"><span className="text-[#64748b]">Photos</span><span className="font-semibold">{personalization.galleryFiles.length} selected</span></div>}
                {personalization.timelineEvents.filter((e) => e.title).length > 0 && <div className="flex justify-between"><span className="text-[#64748b]">Timeline</span><span className="font-semibold">{personalization.timelineEvents.filter((e) => e.title).length} events</span></div>}
              </div>
              <div className="rounded-2xl border border-[#0f172a]/10 bg-white p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">What Happens Next</p>
                <div className="space-y-3">
                  {ORDER_JOURNEY.map((item, index) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        {index < ORDER_JOURNEY.length - 1 && <div className="mt-1 h-8 w-px bg-[#cbd5e1]" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-[#0f172a]">{item.label}</p>
                        <p className="text-xs leading-relaxed text-[#64748b]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(3)} className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-[#f8fafc] hover:-translate-y-0.5">← Back</button>
                <button type="button" onClick={() => setStep(5)} className={PRIMARY_BUTTON_CLASS}>Next: Order Details →</button>
              </div>
            </div>
            {/* Live Preview */}
            <div className="relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_22px_60px_rgba(15,23,42,0.14)]" style={{ borderColor: selectedThemeConfig.colors.border, background: selectedThemeConfig.colors.background, color: selectedThemeConfig.colors.text }}>
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background: `radial-gradient(circle at top left, ${selectedThemeConfig.colors.primary}22, transparent 36%), radial-gradient(circle at bottom right, ${selectedThemeConfig.colors.accent}22, transparent 28%)`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Live Preview</p>
                    <h3 className="mt-3 text-3xl font-black leading-tight" style={{ color: selectedThemeConfig.colors.primary }}>
                      {personalization.websiteTitle || 'Website Title'}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: selectedThemeConfig.colors.accent }}>
                      {personalization.tagline || 'Tagline appears here'}
                    </p>
                  </div>
                  <div className="rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm" style={{ borderColor: selectedThemeConfig.colors.border, background: `${selectedThemeConfig.colors.card}cc` }}>
                    {selectedThemeConfig.label}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {namePair && (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${selectedThemeConfig.colors.card}dd`, color: selectedThemeConfig.colors.primary }}>
                      {namePair}
                    </span>
                  )}
                  {personalization.specialDate && (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${selectedThemeConfig.colors.card}dd`, color: selectedThemeConfig.colors.text }}>
                      {new Date(personalization.specialDate + 'T00:00:00').toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${selectedThemeConfig.colors.card}dd`, color: selectedThemeConfig.colors.text }}>
                    {selectedTemplate.name}
                  </span>
                </div>

                <div className="mt-6 rounded-[1.5rem] border p-4" style={{ borderColor: selectedThemeConfig.colors.border, background: `${selectedThemeConfig.colors.card}d9` }}>
                  <div className="grid gap-4 md:grid-cols-[1.25fr_0.95fr]">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Hero Section</p>
                      <div className="mt-3 rounded-[1.25rem] border p-5" style={{ borderColor: selectedThemeConfig.colors.border, background: `${selectedThemeConfig.colors.background}cc` }}>
                        {namePair && (
                          <p className="text-xl font-black" style={{ color: selectedThemeConfig.colors.primary }}>
                            {namePair}
                          </p>
                        )}
                        <p className="mt-2 text-sm leading-relaxed opacity-80">
                          {personalization.welcomeMessage || 'A heartfelt welcome message appears here to set the tone of the story.'}
                        </p>
                        {personalization.quote && (
                          <div className="mt-4 rounded-2xl px-4 py-3 text-sm italic" style={{ background: `${selectedThemeConfig.colors.primary}10`, color: selectedThemeConfig.colors.accent }}>
                            "{personalization.quote}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Gallery Moodboard</p>
                      {previewPhotoUrls.length > 0 ? (
                        <div className="mt-3 grid h-full min-h-[220px] grid-cols-2 gap-2">
                          <img key={previewPhotoUrls[0]} src={previewPhotoUrls[0]} alt="Preview" className="col-span-2 h-32 w-full rounded-[1.1rem] object-cover shadow-sm" />
                          {previewPhotoUrls.slice(1, 3).map((url) => (
                            <img key={url} src={url} alt="Preview" className="h-24 w-full rounded-[1rem] object-cover shadow-sm" />
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed text-center text-sm opacity-60" style={{ borderColor: selectedThemeConfig.colors.border }}>
                          Add photos to preview the gallery layout
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(personalization.mainLetter || personalization.timelineEvents.some((event) => event.title)) && (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.25rem] border p-4" style={{ borderColor: selectedThemeConfig.colors.border, background: `${selectedThemeConfig.colors.card}c7` }}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Story Card</p>
                      <p className="mt-3 text-sm leading-relaxed opacity-80">
                        {personalization.mainLetter
                          ? `${personalization.mainLetter.slice(0, 190)}${personalization.mainLetter.length > 190 ? '…' : ''}`
                          : 'Your story preview appears here.'}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border p-4" style={{ borderColor: selectedThemeConfig.colors.border, background: `${selectedThemeConfig.colors.card}c7` }}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Timeline Snapshot</p>
                      <div className="mt-3 space-y-3">
                        {personalization.timelineEvents.filter((event) => event.title).slice(0, 2).map((event) => (
                          <div key={event.id} className="flex gap-3">
                            <div className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: selectedThemeConfig.colors.primary }} />
                            <div>
                              <p className="text-sm font-semibold">{event.title}</p>
                              {event.date && <p className="text-xs opacity-60">{event.date}</p>}
                            </div>
                          </div>
                        ))}
                        {personalization.timelineEvents.filter((event) => event.title).length === 0 && (
                          <p className="text-sm opacity-60">Add timeline events to preview your story journey.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 5: ORDER DETAILS ── */}
        {step === 5 && (
          <section className="animate-createSection rounded-3xl border border-[#0f172a]/10 bg-white p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-black">Order Details</h2>
            <p className="mb-6 text-sm text-[#475569]">Where should we ship your KeyStory? Your information stays private.</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#475569]">Full Name *</label>
                <input value={orderDetails.fullName} onChange={(e) => { setOrderDetails((prev) => ({ ...prev, fullName: e.target.value })); setStep5Errors((prev) => ({ ...prev, fullName: '' })); }} placeholder="Juan Dela Cruz" className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step5Errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`} />
                {step5Errors.fullName && <p className="text-xs font-semibold text-red-600">{step5Errors.fullName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#475569]">Email Address *</label>
                <input type="email" value={orderDetails.email} onChange={(e) => { setOrderDetails((prev) => ({ ...prev, email: e.target.value })); setStep5Errors((prev) => ({ ...prev, email: '' })); }} placeholder="juan@email.com" className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step5Errors.email ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`} />
                {step5Errors.email && <p className="text-xs font-semibold text-red-600">{step5Errors.email}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#475569]">Phone Number *</label>
                <input value={orderDetails.phone} onChange={(e) => { setOrderDetails((prev) => ({ ...prev, phone: e.target.value })); setStep5Errors((prev) => ({ ...prev, phone: '' })); }} placeholder="09XX XXX XXXX" className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step5Errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`} />
                {step5Errors.phone && <p className="text-xs font-semibold text-red-600">{step5Errors.phone}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-[#475569]">Shipping Address *</label>
                <textarea value={orderDetails.shippingAddress} onChange={(e) => { setOrderDetails((prev) => ({ ...prev, shippingAddress: e.target.value })); setStep5Errors((prev) => ({ ...prev, shippingAddress: '' })); }} placeholder="House No., Street, Barangay, City, Province, ZIP Code" className={`min-h-[95px] w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${step5Errors.shippingAddress ? 'border-red-300 focus:ring-red-200' : 'border-[#0f172a]/20 focus:ring-[#0f172a]/20'}`} />
                {step5Errors.shippingAddress && <p className="text-xs font-semibold text-red-600">{step5Errors.shippingAddress}</p>}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setStep(4)} className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-[#f8fafc] hover:-translate-y-0.5">← Back</button>
                <button type="button" disabled={!canProceedStep5} onClick={goNextStep} className={PRIMARY_BUTTON_CLASS}>Next: Payment →</button>
            </div>
          </section>
        )}

        {/* ── STEP 6: PAYMENT ── */}
        {step === 6 && (
          <section className="animate-createSection rounded-3xl border border-[#0f172a]/10 bg-white p-6 md:p-8">
            {submittedId ? (
              /* Success State */
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M6 16L12 22L26 8" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-black text-[#0f172a]">Payment Confirmed!</h2>
                <p className="mt-2 max-w-sm text-sm text-[#475569]">Your KeyStory order is confirmed and heading into production. We'll keep you posted!</p>
                <div className="mt-6 w-full max-w-md rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-5 text-left text-sm space-y-2">
                  {submittedId && <div className="flex justify-between"><span className="text-[#64748b]">Order ID</span><span className="font-mono font-semibold">{submittedId}</span></div>}
                  {orderId && orderId !== submittedId && <div className="flex justify-between"><span className="text-[#64748b]">Reference</span><span className="font-mono text-xs font-semibold">{orderId}</span></div>}
                  {transactionId && <div className="flex justify-between"><span className="text-[#64748b]">Transaction ID</span><span className="font-mono text-xs font-semibold break-all">{transactionId}</span></div>}
                  <div className="flex justify-between border-t border-[#0f172a]/10 pt-2">
                    <span className="text-[#64748b]">Status</span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">In Production</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {transactionId && (
                    <Link href={`/track-order?transactionId=${encodeURIComponent(transactionId)}`} className="rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-bold text-white">
                      Track Your Order
                    </Link>
                  )}
                  <Link href="/" className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]">Back to Home</Link>
                </div>
                <div className="mt-6 w-full max-w-md rounded-2xl border border-[#0f172a]/10 bg-white p-4 text-left">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">What happens next?</p>
                  <div className="space-y-2 text-sm text-[#475569]">
                    <p>📦 <strong>Production</strong> — We'll design and print your KeyStory.</p>
                    <p>🚀 <strong>Shipping</strong> — Your order ships to your provided address.</p>
                    <p>💌 <strong>Website</strong> — Your digital story site goes live once confirmed.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Payment Form */
              <>
                <h2 className="mb-1 text-2xl font-black">Complete Payment</h2>
                <p className="mb-6 text-sm text-[#475569]">Choose your payment method and complete checkout securely via PayMongo.</p>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-5 md:col-span-2">
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#64748b]">Payment Method</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {([
                          { id: 'gcash', label: 'GCash', description: 'Pay via GCash e-wallet', icon: '💚' },
                          { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, JCB', icon: '💳' },
                          { id: 'grab_pay', label: 'GrabPay', description: 'Pay via GrabPay wallet', icon: '🟢' },
                        ] as const).map((method) => {
                          const isSelected = paymentMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`rounded-2xl border p-4 text-left ${INTERACTIVE_CARD_CLASS} ${isSelected ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#0f172a]/15 bg-white text-[#0f172a] hover:border-[#0f172a]/30'}`}
                            >
                              <span className="text-2xl">{method.icon}</span>
                              <p className="mt-2 text-sm font-bold">{method.label}</p>
                              <p className={`mt-0.5 text-xs ${isSelected ? 'text-white/70' : 'text-[#64748b]'}`}>{method.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 text-xs text-[#64748b]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                        <path d="M8 2C4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 5v4m0-6v.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>Payments are processed securely by PayMongo. KeyStory never stores your card details.</span>
                    </div>
                    <div className="rounded-2xl border border-[#0f172a]/10 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Secure Checkout</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">GCash</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">Card</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">GrabPay</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {ORDER_JOURNEY.map((item, index) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${index === 0 ? 'bg-[#0f172a] text-white' : 'bg-[#e2e8f0] text-[#475569]'}`}>
                                {index + 1}
                              </div>
                              {index < ORDER_JOURNEY.length - 1 && <div className="mt-1 h-7 w-px bg-[#cbd5e1]" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#0f172a]">{item.label}</p>
                              <p className="text-xs text-[#64748b]">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 text-sm">
                      <p className="font-semibold text-[#0f172a]">Need help before paying?</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                        If you need changes to the design, shipping details, or want help choosing a product, you can go back and edit your order before checkout.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(5)} className="rounded-full border border-[#0f172a]/20 px-5 py-2.5 text-sm font-semibold hover:bg-[#f8fafc]">← Back</button>
                      <button
                        type="button"
                        disabled={!canProceedStep6 || submitting}
                        onClick={startPayMongoCheckout}
                        className={`${PRIMARY_BUTTON_CLASS} flex items-center gap-2 px-7 py-3 text-base`}
                      >
                        {submitting ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Redirecting to PayMongo…
                          </>
                        ) : (
                          <>Pay ₱{estimatedTotal} Securely</>
                        )}
                      </button>
                    </div>
                    {paymentMessage && (
                      <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${paymentStatus === 'cancelled' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {paymentMessage}
                      </div>
                    )}
                  </div>
                  {/* Order Summary Sidebar */}
                  <div className="rounded-2xl border border-[#0f172a]/10 bg-[#0f172a] p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Order Summary</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-300">Product</span><span className="text-right font-semibold">{selectedVariantConfig.label}</span></div>
                      <div className="flex justify-between"><span className="text-slate-300">Finish</span><span className="font-semibold">{selectedFinishConfig.label}</span></div>
                      <div className="flex justify-between"><span className="text-slate-300">Qty</span><span className="font-semibold">×{quantity}</span></div>
                    </div>
                    <div className="my-3 h-px bg-white/10" />
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-slate-300">Total</span>
                      <span className="text-2xl font-black">₱{estimatedTotal}</span>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400">Estimated Delivery</p>
                      <p className="mt-1 text-sm font-semibold text-white">{estimatedDeliveryLabel}</p>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                      Your design review starts right after payment confirmation.
                    </div>
                    <div className="mt-4 space-y-1 text-xs text-slate-400">
                      <p>🧾 {personalization.websiteTitle || '—'}</p>
                      <p>👤 {orderDetails.fullName || '—'}</p>
                      <p>📧 {orderDetails.email || '—'}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {showMobileStickyAction && (
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#0f172a]/10 bg-white/95 p-3 backdrop-blur md:hidden">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Estimated Total</p>
                <p className="truncate text-lg font-black text-[#0f172a]">P{estimatedTotal}</p>
              </div>
              <button
                type="button"
                onClick={goNextStep}
                disabled={mobilePrimaryDisabled}
                className="rounded-full bg-[#0f172a] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {submitting ? 'Please wait...' : mobilePrimaryLabel}
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .animate-createSection {
            animation: createSectionEnter 0.34s ease-out;
          }

          @keyframes createSectionEnter {
            from {
              opacity: 0;
              transform: translateY(14px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </main>
  );
}
