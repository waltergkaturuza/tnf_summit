export type Language = "en" | "fr" | "pt" | "sn" | "zh" | "ja" | "ru" | "el";

/** Shared translation type for nav, cta, search, misc (used in navbar/search) */
export type CoreTranslations = {
  nav: {
    home: string; about: string; program: string; speakers: string;
    registration: string; sponsors: string; gallery: string; contact: string;
  };
  cta: { register: string; learnMore: string; viewProgram: string };
  search: { placeholder: string; noResults: string; searchLabel: string };
  misc: { earlyBird: string; visitSite: string };
};

/** Home page */
export type HomeTranslations = {
  edition: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
  date: string;
  venue: string;
  delegates: string;
  registerNow: string;
  viewProgramme: string;
  organisedBy: string;
  explore: string;
  keyFactLabels: string[];
  aboutHeading: string;
  aboutTitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
  aboutTags: string[];
  aboutCard1Title: string;
  aboutCard1Sub: string;
  aboutCard2Title: string;
  aboutCard2Sub: string;
  aboutCard3Title: string;
  aboutCard3Sub: string;
  aboutCard4Title: string;
  aboutCard4Sub: string;
  whyAttendHeading: string;
  whoShouldAttend: string;
  whyAttendIntro: string;
  whyAttendItems: { audience: string; description: string }[];
  programmeHeading: string;
  themesHeading: string;
  programmeIntro: string;
  viewFullProgramme: string;
  scheduleHeading: string;
  summitWeek: string;
  scheduleDate: string;
  weekDays: { date: string; label: string; desc: string }[];
  registerCtaBadge: string;
  registerCtaHeading: string;
  registerCtaSub: string;
  viewAllFees: string;
  partnersHeading: string;
  partnersSub: string;
  viewAllSponsors: string;
  innovationHeading: string;
  innovationTitle: string;
  innovationDesc: string;
  innovationBullets: string[];
  applyInnovation: string;
  innovationTimelineTitle: string;
  innovationSteps: { step: string; date: string }[];
  venueHeading: string;
  venueTitle: string;
  venueIntro: string;
  venueCards: { title: string; desc: string }[];
  finalCtaTitle: string;
  finalCtaSub: string;
  registerForSummit: string;
  contactUs: string;
  finalHashtag: string;
};

/** Footer */
export type FooterTranslations = {
  stayUpdated: string;
  subscribeDesc: string;
  thankYou: string;
  enterEmail: string;
  summitCol: string;
  programmeCol: string;
  participateCol: string;
  mediaCol: string;
  summitLinks: { label: string; href: string }[];
  programmeLinks: { label: string; href: string }[];
  participateLinks: { label: string; href: string }[];
  mediaLinks: { label: string; href: string }[];
  contactBlurb: string;
  visitSecretariat: string;
  copyright: string;
  privacy: string;
  terms: string;
  hashtag: string;
  developedBy: string;
};

/** About page */
export type AboutTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  whatIsBadge: string;
  whatIsTitle: string;
  whatIsDesc1: string;
  whatIsDesc2: string;
  whatIsDesc3: string;
  whatIsTags: string[];
  whatIsCards: { title: string; desc: string }[];
  whyAttendBadge: string;
  whyAttendTitle: string;
  whoShouldAttend: string;
  themesBadge: string;
  themesTitle: string;
  tripartiteBadge: string;
  tripartiteTitle: string;
  tripartiteIntro: string;
  tripartiteItems: { title: string; desc: string }[];
  venueBadge: string;
  venueTitle: string;
  venueAddress: string;
  venueBullets: string[];
};

/** Programme page */
export type ProgramTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  filters: string;
  noSessions: string;
  sessions: string;
};

/** Speakers page */
export type SpeakersTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  categoriesTitle: string;
  categoriesSub: string;
  reachTitle: string;
  reachIntro: string;
  innovationTitle: string;
  innovationIntro: string;
};

/** Sponsors page */
export type SponsorsTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  partnersTitle: string;
  packagesTitle: string;
  becomePartnerTitle: string;
};

/** Gallery page */
export type GalleryTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  venueTitle: string;
  venueSub: string;
  availableTitle: string;
  liveCoverageTitle: string;
  followTitle: string;
};

/** Contact page */
export type ContactTranslations = {
  heroTitle: string;
  heroSub: string;
  secretariatTitle: string;
  summitDates: string;
  sendMessage: string;
  messageSentTitle: string;
  messageSentSub: string;
  faqTitle: string;
};

/** Registration page (labels and options) */
export type RegistrationTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  steps: { label: string }[];
  selectCountry: string;
  submittedTitle: string;
  submittedWelcome: string;
  submittedConfirmation: string;
  nextSteps: string;
  backToHome: string;
  viewProgramme: string;
  questionsContact: string;
  needHelp: string;
  groupReg: string;
};

export type FullTranslations = CoreTranslations & {
  home: HomeTranslations;
  about: AboutTranslations;
  footer: FooterTranslations;
  program: ProgramTranslations;
  speakers: SpeakersTranslations;
  sponsors: SponsorsTranslations;
  gallery: GalleryTranslations;
  contact: ContactTranslations;
  registration: RegistrationTranslations;
};
