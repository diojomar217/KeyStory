// Builder steps for the multi-step website wizard
export const WIZARD_STEPS = [
  { id: 1, title: 'Your Details', subtitle: "Let's start", section: 'your_details', isRequired: true },
  { id: 2, title: 'Hero & Message', subtitle: 'Your love story', section: 'hero_message', isRequired: true },
  { id: 3, title: 'Choose Style', subtitle: 'Pick the mood', section: 'choose_style', isRequired: true },
  { id: 4, title: 'Page Layout', subtitle: 'Select sections', section: 'page_layout', isRequired: true },
  { id: 5, title: 'Templates', subtitle: 'Design picks', section: 'templates', isRequired: true },
  { id: 6, title: 'Content', subtitle: 'Fill in your sections', section: 'content', isRequired: false },
  { id: 7, title: 'Review', subtitle: 'Almost done!', section: 'review', isRequired: true },
];
