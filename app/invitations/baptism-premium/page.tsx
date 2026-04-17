import React from 'react';
import HeroSection from '@/components/invitation/HeroSection';
import InvitationSection from '@/components/invitation/InvitationSection';
import EventDetailsSection from '@/components/invitation/EventDetailsSection';
import ScheduleSection from '@/components/invitation/ScheduleSection';
import DressCodeSection from '@/components/invitation/DressCodeSection';
import RSVPSection from '@/components/invitation/RSVPSection';
import GallerySection from '@/components/invitation/GallerySection';
import MapSection from '@/components/invitation/MapSection';
import ClosingSection from '@/components/invitation/ClosingSection';
import SectionHeader from '@/components/invitation/SectionHeader';
import baptismExample from '@/lib/invitationData';
import ThemeWrapper from '@/components/builder/ThemeWrapper';

export const metadata = {
  title: `${baptismExample.name} — ${baptismExample.title}`,
  description: baptismExample.subtitle,
};

export default function Page() {
  const data = baptismExample;

  return (
    <ThemeWrapper theme="romantic_classic">
      <main className="min-h-screen bg-[#fffafa] text-[#6a2f39]">
        <HeroSection data={data} />

        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Invitation" subtitle={data.subtitle} />
          <InvitationSection data={data} />

          <SectionHeader title="Event Details" subtitle="Key information at a glance" />
          <EventDetailsSection data={data} />

          <SectionHeader title="Schedule" subtitle="A simple timeline of the day" />
          <ScheduleSection data={data} />

          <SectionHeader title="Dress Code" subtitle="A gentle suggestion" />
          <DressCodeSection data={data} />

          <SectionHeader title="Gallery" subtitle="A few moments" />
          <GallerySection data={data} />

          <SectionHeader title="Location" subtitle="Find the venue" />
          <MapSection data={data} />

          <SectionHeader title="RSVP" subtitle="Let us know if you can join" />
          <RSVPSection data={data} />

          <ClosingSection data={data} />
        </div>
      </main>
    </ThemeWrapper>
  );
}
