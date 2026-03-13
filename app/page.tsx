'use client';

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white overflow-hidden">
      {/* Background Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none z-0">  

        {/* Heart 1 */}
        <div 
          className="absolute top-[10%] left-[10%] w-12 h-12 text-rose-300/20 animate-float-heart delay-0"
          style={{ animationDuration: '25s' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        {/* Heart 2 */}
        <div 
          className="absolute top-[20%] right-[15%] w-10 h-10 text-pink-400/15 animate-float-heart-reverse delay-300"
          style={{ animationDuration: '22s' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5  Asc 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        {/* Heart 3 */}
        <div 
          className="absolute bottom-[25%] left-[12%] w-14 h-14 text-rose-200/10 animate-float-heart-slow delay-600"
          style={{ animationDuration: '28s' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        {/* Heart 4 */}
        <div 
          className="absolute bottom-[20%] right-[10%] w-8 h-8 text-rose-400/25 animate-float-heart delay-150"
          style={{ animationDuration: '20s' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24 lg:px-8">
        {/* Hero Section */}
        <div className="flex max-w-4xl flex-col items-center text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-6 leading-tight">
            Every Love Story Deserves 
            <br />
            <span className="text-6xl md:text-8xl">a Beautiful Home</span> ❤️
          </h1>
          
          <p className="text-xl md:text-2xl text-rose-800/90 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-150">
            Scan a QR code and revisit a couple&apos;s memories, photos, 
            and milestones anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-in-scale delay-300">
            <Link
              href="/love/demo"
              className="group cta-button bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-2xl hover:shadow-rose-500/50 hover:-translate-y-2 transition-all duration-500 hover:from-rose-600 hover:to-pink-700 flex items-center gap-3"
            >
              <span>View Example</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-6xl mt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-rose-900 mb-24 animate-fade-in">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Personal Love Website',
                desc: 'A couple gets their own beautiful, private website filled with memories.',
              },
              {
                number: '02',
                title: 'QR Code Generated',
                desc: 'Unique QR code created that links directly to their love story.',
              },
              {
                number: '03',
                title: 'Print on Keychain',
                desc: 'QR code printed on durable keychain or card they carry everywhere.',
              },
              {
                number: '04',
                title: 'Scan Anytime',
                desc: 'Anyone with the keychain can scan and instantly relive their journey.',
              }
            ].map((step, index) => (
              <div 
                key={step.number}
                className="group bg-white/70 backdrop-blur-sm shadow-2xl hover:shadow-rose-100/50 rounded-3xl p-10 hover:-translate-y-4 transition-all duration-500 border border-rose-50/50 hover:border-rose-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1" />
                </div>
                <h3 className="text-2xl font-bold text-rose-900 mb-4 group-hover:text-rose-700 transition-colors">{step.title}</h3>
                <p className="text-rose-700/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example Preview Section */}
        <div className="w-full max-w-4xl mt-32 mb-24">
          <div className="bg-gradient-to-br from-white/90 to-rose-50/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-100/50 p-12 text-center hover:shadow-rose-200/50 transition-all duration-500 hover:-translate-y-3 animate-fade-in-scale delay-225">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800 bg-clip-text text-transparent mb-6">
              See a Love Story in Action
            </h3>
            <p className="text-xl text-rose-800/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Preview exactly how your couple&apos;s website will look and feel.
            </p>
            <Link
              href="/love/demo"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-rose-500/50 hover:scale-[1.02] transition-all duration-500 hover:from-rose-600 hover:to-pink-700 cta-button"
            >
              <span>View Live Demo</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pb-12 text-center animate-fade-in delay-450">
          <p className="text-2xl text-rose-600/80 font-light">
            Made with <span className="text-3xl animate-pulse">❤️</span> for love stories
          </p>
          <p className="text-rose-500/60 mt-2 text-sm">
            © 2024 Couple QR Websites
          </p>
        </footer>
      </main>

      <style jsx>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.2; }
          25% { transform: translateY(-25px) rotate(5deg) scale(1.1); opacity: 0.3; }
          50% { transform: translateY(-50px) rotate(0deg) scale(1.05); opacity: 0.25; }
          75% { transform: translateY(-25px) rotate(-3deg) scale(1.1); opacity: 0.3; }
        }
        @keyframes float-heart-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.15; }
          25% { transform: translateY(25px) rotate(-5deg) scale(1.1); opacity: 0.25; }
          50% { transform: translateY(50px) rotate(0deg) scale(1.05); opacity: 0.2; }
          75% { transform: translateY(25px) rotate(3deg) scale(1.1); opacity: 0.25; }
        } 
        @keyframes float-heart-slow {
          animation-duration: 30s;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-600 { animation-delay: 600ms; }
        .cta-button {
          position: relative;
          overflow: hidden;
        }
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .cta-button:hover::before {
          left: 100%;
        }
      `}</style>
      </div>
  );
}
