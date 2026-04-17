import type { OccasionType } from '@/lib/types';

export type ParticipantFieldConfig = {
  id: string;
  role: string;
  label: string;
  placeholder: string;
};

export const OCCASION_PARTICIPANT_FIELDS: Record<OccasionType, ParticipantFieldConfig[]> = {
  couple: [
    { id: 'customer', role: 'primary', label: 'Your Name', placeholder: 'Your name' },
    { id: 'partner', role: 'partner', label: "Partner's Name", placeholder: "Partner's name" },
  ],
  wedding: [
    { id: 'bride', role: 'bride', label: "Bride's Name", placeholder: "Bride's name" },
    { id: 'groom', role: 'groom', label: "Groom's Name", placeholder: "Groom's name" },
  ],
  birthday: [
    { id: 'celebrant', role: 'celebrant', label: 'Celebrant Name', placeholder: 'Celebrant name' },
  ],
  proposal: [
    { id: 'proposer', role: 'proposer', label: 'Your Name', placeholder: 'Your name' },
    { id: 'partner', role: 'partner', label: "Partner's Name", placeholder: "Partner's name" },
  ],
  anniversary: [
    { id: 'partner_1', role: 'primary', label: 'Her Name', placeholder: 'Her name' },
    { id: 'partner_2', role: 'partner', label: 'His Name', placeholder: 'His name' },
  ],
  graduation: [
    { id: 'graduate', role: 'graduate', label: 'Graduate Name', placeholder: 'Graduate name' },
  ],
  baby_shower: [
    { id: 'parent_1', role: 'parent', label: 'Parent Name', placeholder: 'Parent name' },
    { id: 'parent_2', role: 'parent', label: 'Co-parent Name', placeholder: 'Co-parent name' },
  ],
  debut: [
    { id: 'celebrant', role: 'celebrant', label: 'Celebrant Name', placeholder: 'Celebrant name' },
  ],
  memorial: [
    { id: 'remembered', role: 'remembered', label: 'Name to Honor', placeholder: 'Name to honor' },
  ],
  family: [
    { id: 'family', role: 'family', label: 'Family Name', placeholder: 'Family name' },
  ],
  friendship: [
    { id: 'friend_1', role: 'friend', label: 'Friend Name', placeholder: 'Friend name' },
    { id: 'friend_2', role: 'friend', label: 'Best Friend Name', placeholder: 'Best friend name' },
  ],
  travel: [
    { id: 'traveler_1', role: 'traveler', label: 'Traveler Name', placeholder: 'Traveler name' },
    { id: 'traveler_2', role: 'traveler', label: 'Co-traveler Name', placeholder: 'Co-traveler name' },
  ],
  valentines: [
    { id: 'partner_1', role: 'primary', label: 'Her Name', placeholder: 'Her name' },
    { id: 'partner_2', role: 'partner', label: 'His Name', placeholder: 'His name' },
  ],
  mothers_day: [
    { id: 'mother', role: 'honoree', label: "Mother's Name", placeholder: "Mother's name" },
  ],
  fathers_day: [
    { id: 'father', role: 'honoree', label: "Father's Name", placeholder: "Father's name" },
  ],
  baptism: [
    { id: 'child', role: 'celebrant', label: "Child's Name", placeholder: "Child's name" },
    { id: 'parent_1', role: 'parent', label: "Parent's Name", placeholder: "Parent's name" },
    { id: 'parent_2', role: 'parent', label: 'Co-parent Name', placeholder: 'Co-parent name' },
  ],
};

export const OCCASION_DATE_LABELS: Partial<Record<OccasionType, string>> = {
  couple: 'Anniversary Date',
  wedding: 'Wedding Date',
  birthday: 'Birth Date',
  proposal: 'Proposal Date',
  anniversary: 'Anniversary Date',
  graduation: 'Graduation Date',
  baby_shower: 'Due Date',
  debut: 'Debut Date',
  memorial: 'Date of Remembrance',
  family: 'Special Family Date',
  friendship: 'Friendship Date',
  travel: 'Trip Date',
  valentines: "Valentine's Date",
  mothers_day: "Mother's Day Date",
  fathers_day: "Father's Day Date",
  baptism: 'Baptism Date',
};

export function getParticipantFieldsForOccasion(occasion: OccasionType): ParticipantFieldConfig[] {
  return OCCASION_PARTICIPANT_FIELDS[occasion] || OCCASION_PARTICIPANT_FIELDS.couple;
}
