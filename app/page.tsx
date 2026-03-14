'use client';

import { useState } from "react";
import Link from "next/link";
import BuilderForm from "@/components/builder/BuilderForm";
import KeychainInsertPreview from "@/components/product/KeychainInsertPreview";
import { OccasionType, Participant } from "@/lib/types";

interface FormPreviewState {
  website_name: string;
  coupleNames: string;
  coverPhotoPreviewUrl?: string;
  occasion: OccasionType;
  participants: Participant[];
  photosPreview: string[];
}

interface OrderResult {
  slug: string;
  url: string;
  qrCodeUrl: string;
}

export default function Home() {
  const [previewState, setPreviewState] = useState<FormPreviewState>({
    website_name: '',
    coupleNames: '',
    occasion: 'couple' as OccasionType,
    participants: [],
    photosPreview: [],
  });
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormChange = (state: FormPreviewState) => {
    setPreviewState(state);
  };

  const handleOrderCreated = (result: OrderResult) => {
    setOrderResult(result);
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setOrderResult(null);
  };

  const mockQrUrl = previewState.website_name 
    ? `/api/qr?data=${encodeURIComponent(`https://keystory.app/site/${previewState.website_name}`)}`
    : undefined;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white overflow-hidden">
      {/* Background Floating Hearts - KEEP */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-12 h-12 text-rose-300/20 animate-bounce" style={{ animationDuration: '25s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5  Asc 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        {/* Simplified hearts for brevity */}
      </div>

      <main className="relative z-10">
        {/* HERO SECTION - KEEP */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-24 lg:px-8 text-center">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-6 leading-tight">
              Every Love Story Deserves 
              <br />
              <span className="text-6xl md:text-8xl block">a Beautiful Home</span> ❤️
            </h1>
            <p className="text-xl md:text-2xl text-rose-800/90 max-w-2xl mx-auto mb-12 leading-relaxed">
              Create your custom love website and get a QR keychain. 
              Scan anytime to relive memories, photos, and milestones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/site/demo" className="group bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-2xl hover:shadow-rose-500/50 hover:-translate-y-2 transition-all duration-500 hover:from-rose-600 hover:to-pink-700 flex items-center gap-3">
                <span>View Demo</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - KEEP */}
        <section className="w-full max-w-6xl mx-auto px-4 mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-rose-900 mb-24">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Personal Website', desc: 'Beautiful private website with your memories' },
              { number: '02', title: 'QR Code Generated', desc: 'Unique QR linking to your love story' },
              { number: '03', title: 'Print Keychain', desc: 'QR printed on durable keychain' },
              { number: '04', title: 'Scan Forever', desc: 'Relive journey anytime, anywhere' }
            ].map((step, index) => (
              <div key={step.number} className="group bg-white/70 backdrop-blur-sm shadow-2xl hover:shadow-rose-100/50 rounded-3xl p-10 hover:-translate-y-4 transition-all duration-500 border border-rose-50/50 hover:border-rose-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-rose-900 mb-4 group-hover:text-rose-700">{step.title}</h3>
                <p className="text-rose-700/80">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BUILDER SECTION - NEW RESPONSIVE 2-COL */}
        <section className="w-full max-w-7xl mx-auto px-4 pb-32">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-6">
              Create Yours Now
            </h2>
            <p className="text-xl text-rose-800/90 max-w-2xl mx-auto">
              Fill the form on the left to see your keychain update live on the right.
              Ready? Create and get your QR instantly.
            </p>
          </div>

          {/* 2-COL LAYOUT: Form | Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* LEFT: BUILDER FORM */}
            <div className="lg:pr-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-100/50 p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-rose-900 mb-8 text-center">
                  Build Your Keychain
                </h3>
                <BuilderForm 
                  onFormChange={handleFormChange}
                  onCreated={handleOrderCreated}
                />
              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="lg:pl-8">
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-white/90 to-rose-50/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-100/50 p-8 text-center hover:shadow-rose-200/50 transition-all duration-500">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 bg-clip-text text-transparent mb-8 flex items-center justify-center gap-2 mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Live Keychain Preview
                  </h3>
                  
                  <KeychainInsertPreview
                    widthMm={50}
                    heightMm={30}
                    qrCodeUrl={mockQrUrl}
                    coverPhotoUrl={previewState.coverPhotoPreviewUrl}
                    coupleNames={previewState.coupleNames || 'Your Names'}
                    caption={`Scan ${previewState.website_name || 'your'} love story`}
                  />
                  
                  <p className="text-slate-500 text-sm mt-6">
                    {previewState.coupleNames ? (
                      `For: ${previewState.coupleNames}`
                    ) : (
                      'Add names and photos to see preview'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUCCESS MODAL */}
        {showSuccess && orderResult && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8 text-center border-b border-rose-100">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-emerald-900 mb-2">
                  Success!
                </h2>
                <p className="text-lg text-emerald-800">
                  Your website is live!
                </p>
              </div>

              <div className="p-8">
                {/* FINAL PREVIEW */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                    Your Keychain is Ready
                  </h3>
                  <KeychainInsertPreview
                    widthMm={50}
                    heightMm={30}
                    qrCodeUrl={orderResult.qrCodeUrl}
                    coverPhotoUrl={previewState.coverPhotoPreviewUrl}
                    coupleNames={previewState.coupleNames}
                    caption="Scan our love story"
                  />
                </div>

                {/* ACTIONS */}
                <div className="space-y-4">
                  <Link
                    href={orderResult.url}
                    target="_blank"
                    className="w-full block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    View Website
                  </Link>
                  
                  {orderResult.qrCodeUrl && (
                    <a
                      href={orderResult.qrCodeUrl}
                      download="keystory-qr.png"
                      className="w-full block bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-6 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-rose-500/50 hover:-translate-y-1 transition-all duration-300 text-center"
                    >
                      Download QR Code
                    </a>
                  )}
                  
                  <button
                    onClick={closeSuccess}
                    className="w-full btn btn-ghost btn-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER - KEEP */}
        <footer className="border-t border-rose-100 bg-white/50 backdrop-blur-sm py-12 text-center">
          <p className="text-2xl text-rose-600/80 font-light mb-4">
            Made with <span className="text-3xl animate-pulse">❤️</span> for love stories
          </p>
          <p className="text-rose-500/60 text-sm">
            © 2024 Keystory
          </p>
        </footer>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.8s ease-out; }
      `}</style>
    </div>
  );
}
