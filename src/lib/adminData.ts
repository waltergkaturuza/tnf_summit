export type RegistrationStatus = "pending" | "confirmed" | "cancelled" | "waitlisted";
export type AttendanceMode = "in-person" | "virtual" | "hybrid";

export type Registration = {
  id: string;
  createdAt: string;
  trackId: string | null;
  status: RegistrationStatus;
  // Personal
  salutation: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  // Professional
  organisation: string;
  department: string;
  jobTitle: string;
  sector: string;
  organisationWebsite: string;
  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  // Attendance
  category: string;
  attendanceMode: AttendanceMode;
  daysAttending: string[];
  // Accommodation
  requiresAccommodation: boolean;
  arrivalDate: string;
  departureDate: string;
  roomType: string;
  airportTransfer: boolean;
  specialNeeds: string;
  // Preferences
  dietaryRequirements: string;
  sessionInterests: string[];
  excursionPreference: string;
  // Innovation
  applyInnovation: boolean;
  startupName: string;
  startupStage: string;
  startupDescription: string;
  // Bilateral
  bilateralMeetings: boolean;
  investmentAreas: string;
  investmentInterests: string[];
  // Media
  isMedia: boolean;
  mediaOrganisation: string;
  mediaType: string;
  // Payment
  paymentMethod: string;
  invoiceRequired: boolean;
  billingOrganisation: string;
  feeAmount: number;
  paymentStatus: "unpaid" | "paid" | "partial";
  // Consents
  privacyConsent: boolean;
  photoConsent: boolean;
  newsletterOptIn: boolean;
  termsAccepted: boolean;
  // Notes
  adminNotes: string;
};

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  enquiryType: string;
  message: string;
  status: "unread" | "read" | "replied";
  adminReply: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
};

export type UpdateType = "news" | "event";

export type Update = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: UpdateType;
  category: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  published: boolean;
  publishedAt: string | null;
  /** Legacy simple event date (YYYY-MM-DD) */
  eventDate: string | null;
  /** Rich event metadata (optional) */
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  eventVenue?: string;
  eventCity?: string;
  eventCountry?: string;
  registrationType?: "none" | "external" | "internal";
  registrationUrl?: string;
  registrationPageSlug?: string;
  displayOrder: number;
};

export type UpdateComment = {
  id: string;
  updateId: string;
  authorName: string | null;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
};

export type UpdateReactionCounts = { likes: number; dislikes: number; userReaction: "like" | "dislike" | null };

export type UpdateAttachmentType = "pdf" | "document" | "link" | "other";
export type UpdateAttachmentCategory = "concept_note" | "schedule" | "brochure" | "agenda" | "other";

export type UpdateAttachment = {
  id: string;
  createdAt: string;
  updateId: string;
  name: string;
  type: UpdateAttachmentType;
  category: UpdateAttachmentCategory;
  storageBucket: string | null;
  storagePath: string | null;
  publicUrl: string;
  showOnEvent: boolean;
  showInResources: boolean;
  displayOrder: number;
};

export type AbstractParticipation = "oral" | "poster" | "panel" | "workshop" | "other";
export type AbstractStatus = "submitted" | "under_review" | "accepted" | "rejected";

export type CoAuthor = { name: string; email?: string; institution?: string };

export type Abstract = {
  id: string;
  createdAt: string;
  updatedAt: string;
  trackId: string;
  themeId: string;
  title: string;
  abstractText: string;
  keywords: string[];
  wordCount: number;
  participation: AbstractParticipation;
  documentUrl: string;
  fileName: string;
  gender: string;
  dateOfBirth: string | null;
  country: string;
  institution: string;
  tShirtSize: string;
  coAuthors: CoAuthor[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: AbstractStatus;
  adminNotes: string;
};

export type Speaker = {
  id: string;
  name: string;
  title: string;
  organisation: string;
  country: string;
  bio: string;
  sessionTitle: string;
  sessionDate: string;
  sessionType: string;
  status: "confirmed" | "tentative" | "declined";
  photoUrl: string;
  email: string;
  addedAt: string;
};

// Seed mock registrations
const sectors = ["Government", "Private Sector", "International Organisation", "Civil Society", "Academic", "Media"];
const categories = [
  "Government / Public Sector",
  "Private Sector / Corporates",
  "International Organisations / DFIs",
  "Youth Delegates (Under 35)",
  "African Civil Society / MSMEs",
  "Virtual / Hybrid Attendance",
];
const fees: Record<string, number> = {
  "Government / Public Sector": 400,
  "Private Sector / Corporates": 700,
  "International Organisations / DFIs": 400,
  "Youth Delegates (Under 35)": 150,
  "African Civil Society / MSMEs": 200,
  "Virtual / Hybrid Attendance": 100,
};
const statuses: RegistrationStatus[] = ["pending", "confirmed", "confirmed", "confirmed", "cancelled", "waitlisted"];
const countries = ["Zimbabwe", "South Africa", "Kenya", "Nigeria", "Rwanda", "Ethiopia", "Ghana", "Egypt", "UK", "USA", "UAE"];

const names = [
  ["Dr", "Tendai", "Moyo"], ["Prof", "Aisha", "Okonkwo"], ["H.E.", "Emmanuel", "Ndikumana"],
  ["Mr", "James", "Mutasa"], ["Ms", "Grace", "Chikwanda"], ["Hon", "Patrick", "Mwangi"],
  ["Dr", "Fatima", "Al-Rashid"], ["Mr", "David", "Mensah"], ["Ms", "Nomvula", "Dlamini"],
  ["Prof", "Chen", "Wei"], ["Ambassador", "Carlos", "Santos"], ["Ms", "Priya", "Sharma"],
  ["Mr", "Kofi", "Asante"], ["Dr", "Lydia", "Kamau"], ["Mr", "Ahmed", "Khalil"],
  ["Ms", "Zanele", "Nkosi"], ["Dr", "Robert", "Osei"], ["Ms", "Amina", "Hassan"],
  ["Mr", "Victor", "Chikwenhere"], ["Prof", "Isabella", "Ferreira"],
];

export function generateMockRegistrations(): Registration[] {
  return names.map(([salutation, firstName, lastName], i) => {
    const category = categories[i % categories.length];
    const date = new Date(2026, 0, 10 + i * 3);
    return {
      id: `REG-${String(1001 + i).padStart(4, "0")}`,
      createdAt: date.toISOString(),
      trackId: null,
      status: statuses[i % statuses.length],
      salutation,
      firstName,
      lastName,
      gender: i % 3 === 0 ? "Female" : i % 3 === 1 ? "Male" : "Male",
      dateOfBirth: `${1960 + (i * 3 % 30)}-0${(i % 9) + 1}-15`,
      nationality: countries[i % countries.length],
      passportNumber: "",
      organisation: ["Ministry of Finance", "World Bank", "African Development Bank", "Microsoft Africa", "ZCTU", "AU Commission", "ECOWAS", "ILO", "SADC", "IMF", "UNDP"][i % 11],
      department: ["Policy", "Investment", "Research", "Operations", "Legal"][i % 5],
      jobTitle: ["Minister", "Director General", "Senior Economist", "Regional Director", "Secretary General", "CEO", "Head of Programme", "Ambassador", "Commissioner", "Deputy Director"][i % 10],
      sector: sectors[i % sectors.length],
      organisationWebsite: `https://example-org-${i}.org`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.org`,
      phone: `+2637${String(7000000 + i * 12345).slice(0, 7)}`,
      whatsapp: `+2637${String(7000000 + i * 12345).slice(0, 7)}`,
      country: countries[i % countries.length],
      city: ["Harare", "Johannesburg", "Nairobi", "Abuja", "Kigali", "Addis Ababa", "Accra", "Cairo", "London", "Dubai"][i % 10],
      category,
      attendanceMode: i % 5 === 0 ? "virtual" : "in-person",
      daysAttending: ["Day 1", "Day 2", "Day 3"].slice(0, (i % 3) + 1),
      requiresAccommodation: i % 3 !== 0,
      arrivalDate: "2026-09-20",
      departureDate: "2026-09-26",
      roomType: ["Single", "Double"][i % 2],
      airportTransfer: i % 4 !== 0,
      specialNeeds: "",
      dietaryRequirements: ["None", "Vegetarian", "Halal", "None", "None"][i % 5],
      sessionInterests: ["Day 1 — Inclusive Growth", "Day 2 — Digitalisation"].slice(0, (i % 2) + 1),
      excursionPreference: ["Victoria Falls Walk", "Zambezi Cruise", "Game Drive"][i % 3],
      applyInnovation: i % 7 === 0,
      startupName: i % 7 === 0 ? `TechVenture ${i}` : "",
      startupStage: i % 7 === 0 ? "MVP" : "",
      startupDescription: "",
      bilateralMeetings: i % 2 === 0,
      investmentAreas: i % 2 === 0 ? "Renewable Energy, Agriculture" : "",
      investmentInterests: i % 2 === 0 ? ["Renewable Energy / Clean Tech", "Agriculture / Agro-processing"] : [],
      isMedia: i % 10 === 0,
      mediaOrganisation: i % 10 === 0 ? "Africa Business News" : "",
      mediaType: i % 10 === 0 ? "Online" : "",
      paymentMethod: ["Bank Transfer", "Card", "Mobile Money"][i % 3],
      invoiceRequired: true,
      billingOrganisation: ["Ministry of Finance", "World Bank", "ADB"][i % 3],
      feeAmount: fees[category],
      paymentStatus: statuses[i % statuses.length] === "confirmed" ? "paid" : "unpaid",
      privacyConsent: true,
      photoConsent: i % 4 !== 0,
      newsletterOptIn: i % 3 !== 0,
      termsAccepted: true,
      adminNotes: i % 5 === 0 ? "VIP delegate — priority seating required." : "",
    };
  });
}

export function generateMockMessages(): ContactMessage[] {
  return [
    {
      id: "MSG-001", createdAt: "2026-03-01T10:23:00Z", name: "Sarah Johnson",
      email: "sarah@investcorp.com", phone: "+1 202 555 0198",
      organisation: "InvestCorp USA", enquiryType: "Sponsorship / Partnership",
      message: "We are interested in a Gold sponsorship package. Could you please send us the full sponsorship prospectus and pricing details?",
      status: "unread", adminReply: "",
    },
    {
      id: "MSG-002", createdAt: "2026-03-03T14:15:00Z", name: "Dr Jean-Pierre Mbeki",
      email: "jp.mbeki@africaunion.org", phone: "+251 11 551 7700",
      organisation: "African Union Commission", enquiryType: "Speaker / Panelist",
      message: "The AU Commission would like to participate as a speaker at the Opening Ceremony. Please advise on the process.",
      status: "read", adminReply: "",
    },
    {
      id: "MSG-003", createdAt: "2026-03-05T09:00:00Z", name: "Emma Williams",
      email: "emma@bbc.co.uk", phone: "+44 20 7580 4468",
      organisation: "BBC Africa", enquiryType: "Media Accreditation",
      message: "BBC Africa would like to request media accreditation for the summit. We plan to send a team of 3 journalists and a camera crew.",
      status: "replied", adminReply: "Thank you Emma. Media accreditation has been approved. Please expect an email with your press badges within 48 hours.",
    },
    {
      id: "MSG-004", createdAt: "2026-03-07T16:30:00Z", name: "Mr Tendai Chikwanda",
      email: "t.chikwanda@mof.gov.zw", phone: "+263 242 794 571",
      organisation: "Ministry of Finance, Zimbabwe", enquiryType: "Group Registration",
      message: "The Ministry of Finance wishes to register a delegation of 8 officials. Kindly advise on group rates and the process.",
      status: "unread", adminReply: "",
    },
    {
      id: "MSG-005", createdAt: "2026-03-10T11:45:00Z", name: "Priya Nair",
      email: "p.nair@adb.org", phone: "+63 2 8632 4444",
      organisation: "Asian Development Bank", enquiryType: "Bilateral Meeting Request",
      message: "ADB would like to schedule bilateral meetings with ZIDA and the Ministry of Finance during the Summit. How do we register on the bilateral platform?",
      status: "unread", adminReply: "",
    },
  ];
}

export function generateMockSubscribers(): NewsletterSubscriber[] {
  return [
    { id: "SUB-001", email: "john@example.org", subscribedAt: "2026-01-15T08:30:00Z", status: "active" },
    { id: "SUB-002", email: "aisha@adb.org", subscribedAt: "2026-01-18T10:00:00Z", status: "active" },
    { id: "SUB-003", email: "carlos@ilo.org", subscribedAt: "2026-02-02T14:20:00Z", status: "active" },
    { id: "SUB-004", email: "grace@sadc.int", subscribedAt: "2026-02-10T09:15:00Z", status: "unsubscribed" },
    { id: "SUB-005", email: "david@afcfta.au.int", subscribedAt: "2026-02-14T11:30:00Z", status: "active" },
    { id: "SUB-006", email: "nomvula@czi.co.zw", subscribedAt: "2026-02-20T16:00:00Z", status: "active" },
    { id: "SUB-007", email: "kofi@zctu.org.zw", subscribedAt: "2026-02-25T08:45:00Z", status: "active" },
    { id: "SUB-008", email: "fatima@imf.org", subscribedAt: "2026-03-01T12:00:00Z", status: "active" },
    { id: "SUB-009", email: "victor@zida.gov.zw", subscribedAt: "2026-03-05T09:30:00Z", status: "active" },
    { id: "SUB-010", email: "lydia@undp.org", subscribedAt: "2026-03-08T14:00:00Z", status: "active" },
  ];
}

export function generateMockSpeakers(): Speaker[] {
  return [
    {
      id: "SPK-001", name: "H.E. President Emmerson Mnangagwa", title: "President of the Republic of Zimbabwe",
      organisation: "Government of Zimbabwe", country: "Zimbabwe",
      bio: "His Excellency President Mnangagwa will deliver the Keynote Address at the Official Opening Ceremony on Day 3.",
      sessionTitle: "Official Opening Keynote", sessionDate: "Wednesday, 23 September 2026",
      sessionType: "Opening Ceremony", status: "confirmed",
      photoUrl: "", email: "protocol@zimgov.zw", addedAt: "2026-02-01T00:00:00Z",
    },
    {
      id: "SPK-002", name: "Gilbert F. Houngbo", title: "Director-General",
      organisation: "International Labour Organization (ILO)", country: "Switzerland",
      bio: "Mr Houngbo will deliver an address at the Official Opening Ceremony and will present at the Day 2 plenary on digitalisation.",
      sessionTitle: "ILO Address — Future of Work", sessionDate: "Wednesday, 23 September 2026",
      sessionType: "Plenary", status: "confirmed",
      photoUrl: "", email: "dg@ilo.org", addedAt: "2026-02-05T00:00:00Z",
    },
    {
      id: "SPK-003", name: "Dr Akinwumi Adesina", title: "President",
      organisation: "African Development Bank Group", country: "Côte d'Ivoire",
      bio: "Dr Adesina is expected to address the High-Level Ministerial Plenary on Africa's $3.4 Trillion Investment Frontier.",
      sessionTitle: "Africa's Investment Frontier — Keynote", sessionDate: "Monday, 21 September 2026",
      sessionType: "Keynote", status: "tentative",
      photoUrl: "", email: "office.president@afdb.org", addedAt: "2026-02-10T00:00:00Z",
    },
    {
      id: "SPK-004", name: "Dr John Mangudya", title: "Governor",
      organisation: "Reserve Bank of Zimbabwe", country: "Zimbabwe",
      bio: "Governor Mangudya will deliver the FinTech Special Feature Address on Digital Finance and the FinTech Revolution.",
      sessionTitle: "Digital Finance & FinTech Revolution", sessionDate: "Tuesday, 22 September 2026",
      sessionType: "Special Feature", status: "confirmed",
      photoUrl: "", email: "governor@rbz.co.zw", addedAt: "2026-02-12T00:00:00Z",
    },
    {
      id: "SPK-005", name: "Dr Yvonne Mkwanazi-Twala", title: "Director-General",
      organisation: "ZIDA — Zimbabwe Investment and Development Agency", country: "Zimbabwe",
      bio: "The ZIDA DG will facilitate the Investment Pipeline & Deal Facilitation Session and the Zimbabwe Green Investment Spotlight.",
      sessionTitle: "Investing in Zimbabwe: Project Pipeline", sessionDate: "Monday, 21 September 2026",
      sessionType: "Special Session", status: "confirmed",
      photoUrl: "", email: "dg@zida.gov.zw", addedAt: "2026-02-15T00:00:00Z",
    },
  ];
}
