import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/app/ServiceWorkerRegister";
import WebVitalsReporter from "@/components/app/WebVitalsReporter";
import { getBusinessContactSettings } from '@/lib/business-contact-settings';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyStory",
  description: "Create a personalized love website with QR code",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const biz = await getBusinessContactSettings();
  const analyticsEnabled = typeof biz?.analyticsEnabled === 'undefined' ? null : !!biz.analyticsEnabled;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        <WebVitalsReporter analyticsEnabled={analyticsEnabled} />
        <main className="min-h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
