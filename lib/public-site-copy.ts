import type { OccasionType } from './occasion-registry';

const SINGLE_PERSON_OCCASIONS = new Set<OccasionType>([
  'birthday',
  'graduation',
  'debut',
  'memorial',
  'mothers_day',
  'fathers_day',
]);

export function formatOccasionDisplayName(
  siteType: OccasionType,
  primaryName: string,
  secondaryName = '',
): string {
  const primary = primaryName.trim();
  const secondary = secondaryName.trim();

  if (!primary && !secondary) {
    return 'Your Story';
  }

  if (!secondary || SINGLE_PERSON_OCCASIONS.has(siteType)) {
    return primary || secondary;
  }

  if (!primary) {
    return secondary;
  }

  return `${primary} & ${secondary}`;
}

type ShareCopy = {
  icon: string;
  title: string;
  subtitle: string;
  hint: string;
  buildShareText: (displayName: string, url: string) => string;
};

type GuestbookCopy = {
  title: string;
  subtitle: string;
  icon: string;
  emptyState: string;
  badgeLabel: string;
  formTitle: string;
  reviewNotice: string;
  nameLabel: string;
  namePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  successFeedback: string;
};

type QrCopy = {
  icon: string;
  title: string;
  subtitle: string;
  downloadLabel: string;
  footerLabel: string;
  scanLabel: string;
  altText: string;
};

type KeepsakeCopy = {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel: string;
};

export type OccasionPublicCopy = {
  share: ShareCopy;
  guestbook: GuestbookCopy;
  qr: QrCopy;
  keepsake: KeepsakeCopy;
};

export function getOccasionPublicCopy(siteType: OccasionType): OccasionPublicCopy {
  switch (siteType) {
    case 'birthday':
      return {
        share: {
          icon: '🎉',
          title: 'Share the Celebration',
          subtitle: 'Send this birthday page to friends and family joining the celebration.',
          hint: 'Share the celebration',
          buildShareText: (displayName, url) => `🎉 Celebrate ${displayName} with this birthday page!\n\n${url}`,
        },
        guestbook: {
          title: 'Birthday Wishes',
          subtitle: 'Birthday wishes from friends and family.',
          icon: '🥳',
          emptyState: 'No birthday wishes yet. Be the first to leave one!',
          badgeLabel: 'Birthday Note',
          formTitle: 'Leave a birthday wish',
          reviewNotice: 'Your birthday wish will be reviewed before it goes public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Wish',
          messagePlaceholder: 'Write your birthday wish here...',
          submitLabel: 'Submit Wish',
          successFeedback: 'Your birthday wish was sent and is awaiting approval.',
        },
        qr: {
          icon: '🎂',
          title: 'Save the Birthday Story',
          subtitle: 'Scan the QR code below to revisit the celebration anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Birthday story access',
          scanLabel: 'Scan the birthday surprise',
          altText: 'QR code to revisit the birthday story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the birthday story.',
          actionLabel: 'Open Celebration',
        },
      };
    case 'wedding':
      return {
        share: {
          icon: '💒',
          title: 'Share the Wedding Story',
          subtitle: 'Send this wedding page to guests, friends, and family.',
          hint: 'Share this wedding page',
          buildShareText: (displayName, url) => `💒 Celebrate ${displayName} with this wedding story.\n\n${url}`,
        },
        guestbook: {
          title: 'Guest Messages',
          subtitle: 'Messages, blessings, and well wishes from loved ones.',
          icon: '💌',
          emptyState: 'No guest messages yet. Be the first to leave one!',
          badgeLabel: 'Wedding Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '💍',
          title: 'Save the Wedding Story',
          subtitle: 'Scan the QR code below to revisit the wedding memories anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Wedding story access',
          scanLabel: 'Scan the wedding story',
          altText: 'QR code to revisit the wedding story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the wedding story.',
          actionLabel: 'Open Wedding Page',
        },
      };
    case 'proposal':
      return {
        share: {
          icon: '💍',
          title: 'Share the Proposal Story',
          subtitle: 'Send this unforgettable proposal moment to the people who matter.',
          hint: 'Share this proposal story',
          buildShareText: (displayName, url) => `💍 See the proposal story of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages for the Couple',
          subtitle: 'Congratulatory notes and heartfelt wishes from loved ones.',
          icon: '💬',
          emptyState: 'No messages yet. Be the first to leave one!',
          badgeLabel: 'Proposal Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '💎',
          title: 'Save the Proposal Story',
          subtitle: 'Scan the QR code below to revisit this unforgettable yes.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Proposal story access',
          scanLabel: 'Scan the proposal story',
          altText: 'QR code to revisit the proposal story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the proposal story.',
          actionLabel: 'Open Proposal Story',
        },
      };
    case 'anniversary':
      return {
        share: {
          icon: '🥂',
          title: 'Share the Anniversary Story',
          subtitle: 'Celebrate this chapter by sharing the page with family and friends.',
          hint: 'Share this anniversary page',
          buildShareText: (displayName, url) => `🥂 Celebrate the anniversary story of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Anniversary Messages',
          subtitle: 'Notes, memories, and well wishes from loved ones.',
          icon: '💬',
          emptyState: 'No anniversary messages yet. Be the first to leave one!',
          badgeLabel: 'Anniversary Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '✨',
          title: 'Save the Anniversary Story',
          subtitle: 'Scan the QR code below to revisit the memories anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Anniversary story access',
          scanLabel: 'Scan the anniversary story',
          altText: 'QR code to revisit the anniversary story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the anniversary story.',
          actionLabel: 'Open Anniversary Page',
        },
      };
    case 'graduation':
      return {
        share: {
          icon: '🎓',
          title: 'Share the Graduation Tribute',
          subtitle: 'Send this milestone page to the people celebrating the achievement.',
          hint: 'Share this graduation page',
          buildShareText: (displayName, url) => `🎓 Celebrate the graduation of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages of Congratulations',
          subtitle: 'Supportive notes and proud messages from loved ones.',
          icon: '🎓',
          emptyState: 'No congratulatory messages yet. Be the first to leave one!',
          badgeLabel: 'Congrats Note',
          formTitle: 'Leave a congratulatory message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your congratulatory message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your congratulatory message was sent and is awaiting approval.',
        },
        qr: {
          icon: '🎓',
          title: 'Save the Graduation Story',
          subtitle: 'Scan the QR code below to revisit this milestone anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Graduation story access',
          scanLabel: 'Scan the graduation story',
          altText: 'QR code to revisit the graduation story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the graduation tribute.',
          actionLabel: 'Open Tribute',
        },
      };
    case 'baby_shower':
      return {
        share: {
          icon: '🍼',
          title: 'Share the Baby Shower Page',
          subtitle: 'Invite loved ones into the celebration and the story ahead.',
          hint: 'Share this baby shower page',
          buildShareText: (displayName, url) => `🍼 Celebrate ${displayName} with this baby shower page.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages for the Family',
          subtitle: 'Warm wishes and loving notes for the family and little one.',
          icon: '💬',
          emptyState: 'No messages yet. Be the first to leave one!',
          badgeLabel: 'Baby Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '🧸',
          title: 'Save the Baby Shower Story',
          subtitle: 'Scan the QR code below to revisit this sweet celebration anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Baby shower story access',
          scanLabel: 'Scan the baby shower story',
          altText: 'QR code to revisit the baby shower story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the baby shower story.',
          actionLabel: 'Open Celebration',
        },
      };
    case 'debut':
      return {
        share: {
          icon: '👑',
          title: 'Share the Debut Celebration',
          subtitle: 'Send this debut page to friends and family joining the celebration.',
          hint: 'Share this debut page',
          buildShareText: (displayName, url) => `👑 Celebrate the debut of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Celebration Messages',
          subtitle: 'Notes, wishes, and messages for this special chapter.',
          icon: '💬',
          emptyState: 'No celebration messages yet. Be the first to leave one!',
          badgeLabel: 'Debut Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '✨',
          title: 'Save the Debut Story',
          subtitle: 'Scan the QR code below to revisit the debut celebration anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Debut story access',
          scanLabel: 'Scan the debut story',
          altText: 'QR code to revisit the debut story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the debut celebration.',
          actionLabel: 'Open Celebration',
        },
      };
    case 'memorial':
      return {
        share: {
          icon: '🕊️',
          title: 'Share the Memorial Tribute',
          subtitle: 'Share this remembrance page with family and loved ones.',
          hint: 'Share this memorial page',
          buildShareText: (displayName, url) => `🕊️ In loving memory of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Tributes and Messages',
          subtitle: 'Messages of remembrance, love, and reflection.',
          icon: '🕊️',
          emptyState: 'No tributes yet. Be the first to leave one!',
          badgeLabel: 'Tribute',
          formTitle: 'Leave a tribute',
          reviewNotice: 'Your tribute will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Tribute',
          messagePlaceholder: 'Write your tribute here...',
          submitLabel: 'Submit Tribute',
          successFeedback: 'Your tribute was sent and is awaiting approval.',
        },
        qr: {
          icon: '🕯️',
          title: 'Save the Memorial Tribute',
          subtitle: 'Scan the QR code below to revisit this remembrance anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Memorial tribute access',
          scanLabel: 'Scan the memorial tribute',
          altText: 'QR code to revisit the memorial tribute',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the memorial tribute.',
          actionLabel: 'Open Tribute',
        },
      };
    case 'family':
      return {
        share: {
          icon: '🏡',
          title: 'Share the Family Story',
          subtitle: 'Share these family memories with the people who belong in them.',
          hint: 'Share this family story',
          buildShareText: (displayName, url) => `🏡 Explore the family story of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Family Messages',
          subtitle: 'Messages, memories, and notes from family and friends.',
          icon: '💬',
          emptyState: 'No family messages yet. Be the first to leave one!',
          badgeLabel: 'Family Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '📷',
          title: 'Save the Family Story',
          subtitle: 'Scan the QR code below to revisit these family memories anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Family story access',
          scanLabel: 'Scan the family story',
          altText: 'QR code to revisit the family story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the family story.',
          actionLabel: 'Open Family Story',
        },
      };
    case 'friendship':
      return {
        share: {
          icon: '🤝',
          title: 'Share the Friendship Story',
          subtitle: 'Pass along the memories, milestones, and moments that built the bond.',
          hint: 'Share this friendship story',
          buildShareText: (displayName, url) => `🤝 Explore the friendship story of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages from Friends',
          subtitle: 'Shared memories, notes, and messages from the circle around you.',
          icon: '💬',
          emptyState: 'No friendship messages yet. Be the first to leave one!',
          badgeLabel: 'Friend Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '🌈',
          title: 'Save the Friendship Story',
          subtitle: 'Scan the QR code below to revisit these shared memories anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Friendship story access',
          scanLabel: 'Scan the friendship story',
          altText: 'QR code to revisit the friendship story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the friendship story.',
          actionLabel: 'Open Friendship Story',
        },
      };
    case 'travel':
      return {
        share: {
          icon: '✈️',
          title: 'Share the Travel Journal',
          subtitle: 'Send this journey to the people who love seeing where the story went.',
          hint: 'Share this travel journal',
          buildShareText: (displayName, url) => `✈️ Explore the travel journal of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages from Along the Way',
          subtitle: 'Notes, memories, and messages from the people connected to the journey.',
          icon: '💬',
          emptyState: 'No travel messages yet. Be the first to leave one!',
          badgeLabel: 'Travel Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '🗺️',
          title: 'Save the Travel Journal',
          subtitle: 'Scan the QR code below to revisit the journey anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Travel journal access',
          scanLabel: 'Scan the travel journal',
          altText: 'QR code to revisit the travel journal',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the travel journal.',
          actionLabel: 'Open Travel Journal',
        },
      };
    case 'valentines':
      return {
        share: {
          icon: '💌',
          title: 'Share the Valentine Story',
          subtitle: 'Send this page to celebrate love in a way that feels personal and lasting.',
          hint: 'Share this Valentine page',
          buildShareText: (displayName, url) => `💌 Celebrate the Valentine story of ${displayName}.\n\n${url}`,
        },
        guestbook: {
          title: 'Love Notes',
          subtitle: 'Messages, wishes, and sweet notes from loved ones.',
          icon: '💌',
          emptyState: 'No love notes yet. Be the first to leave one!',
          badgeLabel: 'Love Note',
          formTitle: 'Leave a note',
          reviewNotice: 'Your note will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Note',
          messagePlaceholder: 'Write your note here...',
          submitLabel: 'Submit Note',
          successFeedback: 'Your note was sent and is awaiting approval.',
        },
        qr: {
          icon: '💕',
          title: 'Save the Valentine Story',
          subtitle: 'Scan the QR code below to revisit the story anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Valentine story access',
          scanLabel: 'Scan the Valentine story',
          altText: 'QR code to revisit the Valentine story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the Valentine story.',
          actionLabel: 'Open Valentine Story',
        },
      };
    case 'mothers_day':
      return {
        share: {
          icon: '🌸',
          title: 'Share the Mother\'s Day Tribute',
          subtitle: 'Send this tribute to the family and loved ones who want to celebrate her.',
          hint: 'Share this tribute',
          buildShareText: (displayName, url) => `🌸 Celebrate ${displayName} with this Mother\'s Day tribute.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages for Mom',
          subtitle: 'Notes of gratitude, love, and appreciation.',
          icon: '💬',
          emptyState: 'No messages for Mom yet. Be the first to leave one!',
          badgeLabel: 'Appreciation Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '🌷',
          title: 'Save the Mother\'s Day Tribute',
          subtitle: 'Scan the QR code below to revisit this tribute anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Mother\'s Day tribute access',
          scanLabel: 'Scan the Mother\'s Day tribute',
          altText: 'QR code to revisit the Mother\'s Day tribute',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the Mother\'s Day tribute.',
          actionLabel: 'Open Tribute',
        },
      };
    case 'fathers_day':
      return {
        share: {
          icon: '🧡',
          title: 'Share the Father\'s Day Tribute',
          subtitle: 'Send this tribute to the family and loved ones celebrating him.',
          hint: 'Share this tribute',
          buildShareText: (displayName, url) => `🧡 Celebrate ${displayName} with this Father\'s Day tribute.\n\n${url}`,
        },
        guestbook: {
          title: 'Messages for Dad',
          subtitle: 'Notes of gratitude, love, and appreciation.',
          icon: '💬',
          emptyState: 'No messages for Dad yet. Be the first to leave one!',
          badgeLabel: 'Appreciation Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your message will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '⭐',
          title: 'Save the Father\'s Day Tribute',
          subtitle: 'Scan the QR code below to revisit this tribute anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Father\'s Day tribute access',
          scanLabel: 'Scan the Father\'s Day tribute',
          altText: 'QR code to revisit the Father\'s Day tribute',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit the Father\'s Day tribute.',
          actionLabel: 'Open Tribute',
        },
      };
    case 'couple':
    default:
      return {
        share: {
          icon: '💝',
          title: 'Share Our Love Story',
          subtitle: 'Share these moments with the friends and family who matter most.',
          hint: 'Share this love story',
          buildShareText: (displayName, url) => `Check out the love story of ${displayName}. 💕\n\n${url}`,
        },
        guestbook: {
          title: 'Guest Messages',
          subtitle: 'Messages from friends and family.',
          icon: '💬',
          emptyState: 'No guest messages yet. Be the first to leave one!',
          badgeLabel: 'Guest Note',
          formTitle: 'Leave a message',
          reviewNotice: 'Your note will be reviewed by the site owner before going public.',
          nameLabel: 'Name',
          namePlaceholder: 'Your name',
          messageLabel: 'Message',
          messagePlaceholder: 'Write your message here...',
          submitLabel: 'Submit Message',
          successFeedback: 'Your message was sent and is awaiting approval.',
        },
        qr: {
          icon: '💕',
          title: 'Save Our Love Story',
          subtitle: 'Scan the QR code below to revisit the story anytime.',
          downloadLabel: 'Download QR Code',
          footerLabel: 'Love story access',
          scanLabel: 'Scan our love story',
          altText: 'QR code to revisit our love story',
        },
        keepsake: {
          icon: '🎴',
          title: 'A Keepsake You Can Carry',
          subtitle: 'Scan this QR code anytime to revisit this story.',
          actionLabel: 'Open Link',
        },
      };
  }
}