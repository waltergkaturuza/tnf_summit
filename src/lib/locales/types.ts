export type Language = "en" | "fr" | "pt" | "sn" | "zh" | "ja" | "ru" | "el";

/** Shared translation type for nav, cta, search, misc (used in navbar/search) */
export type CoreTranslations = {
  nav: {
    home: string; about: string; program: string; speakers: string;
    registration: string; sponsors: string; gallery: string; updates: string; contact: string;
    participate: string; submitAbstract: string; volunteer: string; trackStatus: string;
    programmeSchedule: string; sessions: string;
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
  venueIntro: string;
  venueBullets: string[];
  themesIntro: string;
  tripartiteSectionBadge: string;
  organiserBadge: string;
  organiserTitle: string;
  organiserDesc1: string;
  organiserDesc2: string;
  contactSecretariat: string;
  visitTnfWebsite: string;
};

/** Programme page */
export type ProgramTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  heroSubLine2: string;
  filters: string;
  searchPlaceholder: string;
  noSessions: string;
  clearFilters: string;
  sessions: string;
  sessionTypeLegend: string;
  downloadNote: string;
  sessionTypes: { id: string; label: string }[];
  rooms: { id: string; label: string }[];
};

/** Speakers page */
export type SpeakersTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  comingSoonBanner: string;
  registerCta: string;
  profilesBadge: string;
  profilesTitle: string;
  profilesSub: string;
  categoriesTitle: string;
  categoriesSub: string;
  forSpeakersBadge: string;
  forSpeakersTitle: string;
  forSpeakersIntro: string;
  forSpeakersBullets: string[];
  speakerEnquiries: string;
  reachTitle: string;
  reachIntro: string;
  reachStats: { value: string; label: string }[];
  contactProgrammeTeam: string;
  innovationBadge: string;
  innovationTitle: string;
  innovationIntro: string;
  innovationFormatTitle: string;
  innovationFormatItems: { label: string; value: string }[];
  applyInnovation: string;
  expectedProfiles: { role: string; desc: string; day: string }[];
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
  resourcesTitle: string;
  resourcesSub: string;
};

/** Contact page */
export type ContactTranslations = {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  secretariatTitle: string;
  summitDates: string;
  summitDatesVenue: string;
  earlyBirdCloses: string;
  sendMessage: string;
  messageSentTitle: string;
  messageSentSub: string;
  formFullName: string;
  formEmail: string;
  formPhone: string;
  formOrganisation: string;
  formEnquiryType: string;
  formMessage: string;
  placeholders: { name: string; email: string; phone: string; organisation: string; enquiryType: string; message: string };
  submitSending: string;
  submitSend: string;
  submitError: string;
  faqBadge: string;
  faqTitle: string;
  enquiryTypes: string[];
  contactItems: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
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

/** Updates & News page */
export type UpdatesTranslations = {
  heroTitle: string;
  heroSub: string;
  filterAll: string;
  filterNews: string;
  filterEvents: string;
  noUpdates: string;
  noUpdatesHint: string;
  typeNews: string;
  typeEvent: string;
  searchPlaceholder: string;
  commentPlaceholder: string;
  commentNamePlaceholder: string;
  postCommentAnonymous: string;
  postComment: string;
  commentsCount: string;
  abstractLabel: string;
  registrationLabel: string;
  statusLabel: string;
  countdownToEvent: string;
  eventVenue: string;
  registerForEvent: string;
  resourcesTitle: string;
  noResources: string;
};

/** Track Status page */
export type TrackStatusTranslations = {
  heroTitle: string;
  heroSub: string;
  placeholder: string;
  buttonLookup: string;
  buttonChecking: string;
  errorNotFound: string;
  errorGeneric: string;
  abstractLabel: string;
  registrationLabel: string;
  statusLabel: string;
  lostIdContact: string;
  registerLink: string;
  statusLabels: Record<string, string>;
};

/** Volunteer page */
export type VolunteerTranslations = {
  heroTitle: string;
  heroSub: string;
  whyTitle: string;
  whyDesc: string;
  getInTouchTitle: string;
  getInTouchDesc: string;
  emailUs: string;
  registerAsDelegateBefore: string;
  registerAsDelegateLink: string;
  registerAsDelegateAfter: string;
  contactPage: string;
};

/** Abstract submit page */
export type AbstractsTranslations = {
  successTitle: string;
  successThankYou: string;
  yourAbstractId: string;
  useThisIdToTrack: string;
  planningToAttend: string;
  registerToSecure: string;
  registerNow: string;
  trackSubmissionStatus: string;
  badge: string;
  formTitle: string;
  formSub: string;
  themeLabel: string;
  selectTheme: string;
  titleLabel: string;
  titlePlaceholder: string;
  abstractLabel: string;
  abstractPlaceholder: string;
  wordCount: string;
  keywordsLabel: string;
  keywordsPlaceholder: string;
  participationLabel: string;
  participationOptions: { value: string; label: string }[];
  documentLinkLabel: string;
  documentNamePlaceholder: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institution: string;
  country: string;
  countryPlaceholder: string;
  gender: string;
  dateOfBirth: string;
  tShirtSize: string;
  genderPreferNot: string;
  genderFemale: string;
  genderMale: string;
  genderOther: string;
  tShirtSelect: string;
  coAuthorsLabel: string;
  addCoAuthor: string;
  coAuthorName: string;
  coAuthorEmail: string;
  coAuthorInstitution: string;
  submitButton: string;
  alsoRegisterLink: string;
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
  updates: UpdatesTranslations;
  trackStatus: TrackStatusTranslations;
  volunteer: VolunteerTranslations;
  abstracts: AbstractsTranslations;
};

/** For locale override files: every key at every level is optional. */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type LocaleOverride = DeepPartial<FullTranslations>;
