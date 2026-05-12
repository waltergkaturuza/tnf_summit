export const summitInfo = {
  name: "Zimbabwe TNF Global Summit",
  subtitle: "on Inclusive Growth, Decent Work, Beneficiation, and Investment Promotion",
  edition: "Inaugural Edition",
  dates: "21–25 September 2026",
  startDate: new Date("2026-09-21T00:00:00"),
  venue: "Elephant Hills Resort",
  location: "Victoria Falls, Zimbabwe",
  organiser: "Tripartite Negotiating Forum (TNF) Secretariat",
  delegates: "1,500–2,000",
  days: 5,
  plenaryDays: 4,
  sessions: "20+",
  hashtag: "#TNFGlobalSummit",
  website: "tnfzim.com/summit2026",
  mainWebsite: "https://tnfzim.com",
  email: "info@tnfzim.com",
  emailAlt: "tnfsecretariat@gmail.com",
  /** Gateway / iVeri technical contact (also set in iVeri Back Office → Application). */
  merchantTechnicalEmail: "waltergkaturuza@gmail.com",
  /** Trading / legal display name for payment profile and partnerships. */
  tradingName: "TNF Zimbabwe",
  /** Merchant locality — must match iVeri Application (City). */
  merchantCity: "HARARE",
  merchantCountry: "Zimbabwe",
  phone: "+263 242 783 030",
  phoneLocal: "0242 783 030",
  /** Registered / trading address (Merchant Address in iVeri). */
  address: "East Wing Block 3 Celestial Park, Borrowdale, Harare, Zimbabwe",
  social: {
    twitter: "https://x.com/TNFZimbabwe",
    facebook: "https://www.facebook.com/profile.php?id=61581995522540",
    linkedin: "https://www.linkedin.com/company/tnfzim",
    youtube: "https://www.youtube.com/@TNFZimbabwe",
  },
  logo: "/tnf-logo.png",
  icon: "/tnf-icon.png",
};

/** Donation “themes” / categories for the short donate form (amount is free-text USD). */
export type DonationCategoryDef = {
  key: string;
  label: string;
  description?: string;
};

export const donationCategories: DonationCategoryDef[] = [
  {
    key: "general",
    label: "General support",
    description: "Unrestricted support for summit delivery and logistics",
  },
  {
    key: "global_themes_fund",
    label: "Global Summit themes fund",
    description: "Support delivery across all Summit themes and sessions",
  },
  {
    key: "media_comms",
    label: "Media & communications",
    description: "Coverage, storytelling, and summit communications",
  },
  {
    key: "csr_partnership",
    label: "Partnership Gift",
    description: "Corporate or institutional contribution without a full sponsorship package",
  },
  {
    key: "other",
    label: "Other",
    description: "Choose this if your preferred donation category is not listed",
  },
];

export function getDonationCategoryLabel(key: string): string {
  return donationCategories.find((c) => c.key === key)?.label ?? key;
}

export const themes = [
  { id: "A", label: "Africa's $3.4 Trillion Investment Frontier", color: "#EF4444", icon: "TrendingUp" },
  { id: "B", label: "AI, Automation & the Jobs of Tomorrow", color: "#3B82F6", icon: "Cpu" },
  { id: "C", label: "Green Growth as a Competitive Advantage", color: "#10B981", icon: "Leaf" },
  { id: "D", label: "Women as Engines of Economic Growth", color: "#EC4899", icon: "Users" },
  { id: "E", label: "Digital Finance & the FinTech Revolution", color: "#F59E0B", icon: "CreditCard" },
  { id: "F", label: "Talent as the New Capital", color: "#8B5CF6", icon: "GraduationCap" },
  { id: "G", label: "Industrialisation & Value Chain Integration", color: "#F97316", icon: "Factory" },
  { id: "H", label: "Social Dialogue as an Investment Signal", color: "#06B6D4", icon: "MessageSquare" },
  { id: "I", label: "Youth Entrepreneurship & Africa's Demographic Dividend", color: "#84CC16", icon: "Rocket" },
  { id: "J", label: "Regional Integration: Making AfCFTA Work", color: "#14B8A6", icon: "Globe" },
  { id: "K", label: "Health, Well-being & Workplace Productivity", color: "#A78BFA", icon: "Heart" },
  { id: "L", label: "Infrastructure as a Development Multiplier", color: "#64748B", icon: "Building" },
  { id: "M", label: "Zimbabwe's Indigenous Business Champions", color: "#C9921A", icon: "Star", isNew: true },
  { id: "N", label: "Frontier Technologies & Cross-Regional Investment", color: "#6366F1", icon: "Zap", isNew: true },
];

export type Session = {
  id: string;
  time: string;
  title: string;
  room: "A" | "B" | "BOTH" | "ALL";
  type: "plenary" | "workshop" | "networking" | "ceremony" | "special" | "concurrent" | "social" | "excursion";
  themes: string[];
  description?: string;
  speakers?: string[];
  isNew?: boolean;
  /** Hide from /program while schedule details are TBC (set false when confirmed). */
  hidden?: boolean;
};

export type DaySchedule = {
  date: string;
  dayLabel: string;
  theme: string;
  sessions: Session[];
};

export const program: DaySchedule[] = [
  {
    date: "Monday, 21 September 2026",
    dayLabel: "DAY 1",
    theme: "Inclusive Growth, Smart Investment & Policy Coherence",
    sessions: [
      {
        id: "mon-0a",
        time: "07:00–08:00",
        title: "Delegate Registration, Badge Collection & Exhibition Open",
        room: "BOTH",
        type: "networking",
        themes: [],
        description: "Official registration and badge collection — Main Convention Foyer. Summit App activation, exhibition preview and bilateral pre-bookings.",
      },
      {
        id: "mon-1",
        time: "08:00–08:30",
        title: "Morning Networking Breakfast",
        room: "BOTH",
        type: "networking",
        themes: [],
        description: "Breakfast networking, exhibition tour and bilateral meeting slots. Investment Exhibition Hall opens.",
      },
      {
        id: "mon-2",
        time: "08:30–09:15",
        title: "Opening Keynote — Day 1: Africa's $3.4 Trillion Investment Frontier",
        room: "A",
        type: "plenary",
        themes: ["A"],
        description: "\"Driving Inclusive Economic Growth, Decent Work, Beneficiation, and Investment Promotion in a Changing Global Economy\" — Live launch: TNF Summit Investor Confidence Tracker. Delivered by a globally recognised economist or senior development leader.",
      },
      {
        id: "mon-3",
        time: "09:15–09:45",
        title: "Morning Tea & Networking",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "mon-4",
        time: "09:45–11:30",
        title: "High-Level Ministerial Plenary",
        room: "A",
        type: "plenary",
        themes: ["A", "L"],
        description: "\"Aligning Labour, Investment, Industrial and Social Policies for Inclusive and Sustainable Economic Growth\" — Panel: Ministers of Finance, Labour, Industry and Trade from 6 African nations. AfCFTA, infrastructure investment pipelines and bankable projects.",
      },
      {
        id: "mon-5a",
        time: "11:30–13:00",
        title: "Plenary A — Smart Investment, Sectors and Value Chains",
        room: "A",
        type: "concurrent",
        themes: ["G"],
        description: "Industrialisation & Value Chain Integration — Agriculture, Agro-Processing, Mining, Manufacturing, Trade Facilitation and Regional Value Chains.",
      },
      {
        id: "mon-5b",
        time: "11:30–13:00",
        title: "Plenary B — Governance, Social Dialogue and the Investment Climate",
        room: "B",
        type: "concurrent",
        themes: ["H"],
        description: "Social Dialogue as an Investment Signal — ESG Principles, Policy Certainty, Investment Confidence, Industrial Peace.",
      },
      {
        id: "mon-6",
        time: "13:00–14:15",
        title: "Networking Luncheon for Invited Guests",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "mon-7a",
        time: "14:15–15:30",
        title: "Workshop 1: MSME Access to Finance & Workshop 2: Building Skills and Human Capital",
        room: "A",
        type: "workshop",
        themes: ["F"],
        description: "Workshop 1: Expanding MSME Access to Finance and Markets for Inclusive Growth. Workshop 2: Building Skills and Human Capital Systems for Productivity and Competitiveness [THEME F: Talent as the New Capital].",
      },
      {
        id: "mon-7b",
        time: "14:15–15:30",
        title: "Workshop 3: Inclusive Infrastructure & Workshop 4: Public-Private Partnerships",
        room: "B",
        type: "workshop",
        themes: ["L"],
        description: "Workshop 3: Developing Inclusive Infrastructure to Support Investment, Trade and Employment. Workshop 4: Leveraging Public-Private Partnerships to Finance Inclusive Development Priorities [THEME L].",
      },
      {
        id: "mon-8",
        time: "15:30–16:15",
        title: "Regional Integration Forum — Making AfCFTA Work",
        room: "BOTH",
        type: "plenary",
        themes: ["J"],
        description: "AfCFTA Implementation — Progress, Gaps and Opportunities. Cross-border labour mobility, skills portability and social protection under AfCFTA.",
      },
      {
        id: "mon-9a",
        time: "16:15–17:15",
        title: "★ Zimbabwe's Indigenous Business Champions Panel",
        room: "A",
        type: "special",
        themes: ["M"],
        isNew: true,
        description: "\"Building Wealth from Within: How Zimbabwe's Indigenous Entrepreneurs Are Reshaping the Nation's Economic Landscape\" — High-energy panel with Zimbabwe's most prominent indigenous business leaders. Moderated panel (30 min) + live Q&A (15 min) + networking (15 min).",
      },
      {
        id: "mon-9b",
        time: "16:15–17:15",
        title: "★ Investing in Zimbabwe: Project Pipeline & Deal Facilitation",
        room: "B",
        type: "special",
        themes: ["A", "G"],
        isNew: true,
        description: "ZIDA-hosted investor session presenting bankable priority projects — Renewable energy, sustainable mining, agro-processing, manufacturing, eco-tourism. Letter of Intent signing ceremony. Facilitated by ZIDA Director-General.",
      },
      {
        id: "mon-10",
        time: "17:15–17:45",
        title: "Day 1 Rapporteur Summary",
        room: "A",
        type: "ceremony",
        themes: [],
        description: "Key insights, investment signals and action points from Day 1.",
      },
      {
        id: "mon-11",
        time: "19:00–21:30",
        title: "Welcome Cocktail Reception",
        room: "BOTH",
        type: "social",
        themes: [],
        description: "Elephant Hills Resort — Terrace & Pool Deck. Cocktails, canapés, Zimbabwean cultural performances and announcement of TNF Innovation Challenge finalists. Dress Code: Smart Casual.",
      },
    ],
  },
  {
    date: "Tuesday, 22 September 2026",
    dayLabel: "DAY 2",
    theme: "Digitalisation, Platform Economy & Financial Innovation",
    sessions: [
      {
        id: "tue-1",
        time: "08:00–08:30",
        title: "Morning Networking Breakfast",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "tue-2",
        time: "08:30–09:15",
        title: "High-Level Plenary — Harnessing Digitalisation and Technological Change",
        room: "A",
        type: "plenary",
        themes: ["B", "E"],
        description: "Opening address by global technology thought leader. ILO Africa Future of Work Monitor 2026 Report launch. Panel: Technology companies, TVET policymakers, and workers' representatives.",
      },
      {
        id: "tue-3",
        time: "09:15–09:45",
        title: "FinTech Special Feature — Digital Finance and the FinTech Revolution",
        room: "A",
        type: "special",
        themes: ["E"],
        description: "Address by Governor, Reserve Bank of Zimbabwe. Live FinTech Innovator Pitch — 3-minute rapid investment pitch from a leading African start-up.",
      },
      {
        id: "tue-4",
        time: "09:45–10:15",
        title: "Morning Tea & Networking",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "tue-5a",
        time: "10:15–12:00",
        title: "Plenary A — Platform Economy, Gig Work and Labour Rights",
        room: "A",
        type: "concurrent",
        themes: ["B"],
        description: "AI, Automation & the Jobs of Tomorrow — Regulating the Platform and Gig Economy, Labour Rights in Non-Standard Work, Cross-Border Digital Labour Markets, Balancing Innovation and Regulation.",
      },
      {
        id: "tue-5b",
        time: "10:15–12:00",
        title: "Plenary B — Digital Finance, FinTech and Investment Ecosystems",
        room: "B",
        type: "concurrent",
        themes: ["E"],
        description: "Digital Finance & the FinTech Revolution — Transforming Banking through Digitalisation, Digital Currencies, Investment Opportunities in Digital Finance, Cybersecurity and Regulation.",
      },
      {
        id: "tue-6",
        time: "12:00–13:30",
        title: "Networking Luncheon",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "tue-7a",
        time: "13:30–14:30",
        title: "Workshop 1: Youth & Women in Digital Economy / Workshop 2: Digital Skills & TVET",
        room: "A",
        type: "workshop",
        themes: ["D", "I"],
        description: "Workshop 1: Preparing Youth and Women for Employment in the Digital Economy [THEME D]. Workshop 2: Digital Skills, TVET Systems and Lifelong Learning for Future Jobs [THEME I].",
      },
      {
        id: "tue-7b",
        time: "13:30–14:30",
        title: "Workshop 3: Managing AI & Automation / Workshop 4: Smart Cities",
        room: "B",
        type: "workshop",
        themes: ["B"],
        description: "Workshop 3: Managing AI and Automation for Productivity and Inclusive Growth. Workshop 4: Building Smart Cities and Digital Infrastructure to Attract Investment and Talent.",
      },
      {
        id: "tue-8a",
        time: "14:30–16:00",
        title: "Structured Tripartite Engagement — Managing Digital Transformation",
        room: "A",
        type: "plenary",
        themes: ["H"],
        description: "Social Dialogue as an Investment Signal — Managing Digital Transformation through Structured Social Dialogue. Peer Learning Forum on Governing Technological Change. ESC/TNF Roundtable on Collective Bargaining and New Forms of Work.",
      },
      {
        id: "tue-8b",
        time: "14:30–16:00",
        title: "★ Women in Business, Finance and Investment",
        room: "B",
        type: "special",
        themes: ["D"],
        isNew: true,
        description: "\"Closing the Gap: Gender-Smart Investment and Financing for Women-Led Growth in Africa\" — High-level panel featuring African women investors, DFI leaders, and women-led enterprise CEOs. High-level panel (50 min) + moderated Q&A (40 min).",
      },
      {
        id: "tue-9",
        time: "16:00–17:00",
        title: "TNF Innovation Challenge Pitches — Live Round 1",
        room: "BOTH",
        type: "special",
        themes: ["I"],
        description: "12 African youth finalists pitch digital and green economy solutions to a global investor panel. Live audience voting — Top 5 finalists proceed to Day 3 finals.",
      },
      {
        id: "tue-10a",
        time: "17:00–18:00",
        title: "★ Frontier Technologies & Cross-Regional Investment Opportunities",
        room: "A",
        type: "special",
        themes: ["N"],
        isNew: true,
        description: "\"Seizing the New Frontier\" — International multi-regional panel. Representatives from East Africa, West Africa (ECOWAS), Middle East/Gulf States, Asia-Pacific, Europe, Americas, and Zimbabwe (ZIDA). Format: 3-min opening statements × 7 regions + moderated cross-regional debate (25 min) + Q&A (10 min).",
      },
      {
        id: "tue-10b",
        time: "17:00–18:00",
        title: "★ ESC Network & Peer Learning Exchange",
        room: "B",
        type: "special",
        themes: ["H"],
        isNew: true,
        description: "\"Strengthening the Voice of Economic and Social Councils in Shaping the Digital and Green Economic Transition\" — Closed coordination session for ESC delegates, tripartite institution representatives. Peer exchange on governing technological change, aligning ESC positions ahead of AICESIS and UCESA general assemblies.",
      },
      {
        id: "tue-11",
        time: "18:30–21:00",
        title: "Investor Deal Room & Networking",
        room: "BOTH",
        type: "social",
        themes: ["A"],
        description: "Elephant Hills Conference Centre — Sector Networking Tables. Facilitated by ZIDA. Sector tables: Agri-tech | Clean Energy | Mining | Manufacturing | FinTech | Infrastructure. Dress Code: Smart Casual.",
      },
    ],
  },
  {
    date: "Wednesday, 23 September 2026",
    dayLabel: "DAY 3 — OFFICIAL OPENING",
    theme: "Climate Change, Green Jobs & Sustainable Investment",
    sessions: [
      {
        id: "wed-1",
        time: "08:00–08:30",
        title: "Morning Networking Breakfast",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "wed-2",
        time: "08:30–10:30",
        title: "OFFICIAL OPENING CEREMONY",
        room: "A",
        type: "ceremony",
        themes: [],
        hidden: true, // TBC — show again when line-up is confirmed: set false
        description: "Zimbabwe TNF Global Summit Inaugural Official Opening. Welcome — TNF Executive Director. Remarks from Employers, ZCTU. Addresses from AU Commission Chairperson, ILO Director-General. Keynote Address — H.E. President of the Republic of Zimbabwe. Official Declaration: Launch of the Zimbabwe TNF Global Summit as Africa's Premier Tripartite Convening Platform. Marimba ensemble and traditional Zimbabwean dance.",
      },
      {
        id: "wed-3",
        time: "10:30–11:00",
        title: "Morning Tea Following Opening Ceremony",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "wed-4",
        time: "11:00–11:45",
        title: "Plenary Keynote — Addressing Climate Change through Green Growth",
        room: "A",
        type: "plenary",
        themes: ["C"],
        description: "\"Turning Africa's Climate Crisis into the Continent's Biggest Investment Opportunity.\" Special Address: Global climate finance institutions and the Africa Green Deal. Panel: Ministers of Environment, Energy and Finance.",
      },
      {
        id: "wed-5",
        time: "11:45–12:15",
        title: "Zimbabwe Green Investment Spotlight",
        room: "A",
        type: "special",
        themes: ["C"],
        description: "\"Zimbabwe as a Premier Green and Sustainable Investment Destination.\" Presentation by ZIDA — Priority green project pipeline. Sectors: Renewable energy, sustainable mining, green agriculture, eco-tourism. Live Expressions of Interest from attending investors.",
      },
      {
        id: "wed-6",
        time: "12:15–13:45",
        title: "Networking Luncheon",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "wed-7a",
        time: "13:45–15:30",
        title: "Plenary A — Green Jobs, Just Transition and Climate Resilience",
        room: "A",
        type: "concurrent",
        themes: ["C"],
        description: "Creating Green Jobs, Designing Just Transition Strategies, Supporting Climate-Resilient Livelihoods, Strengthening Occupational Safety and Health in Climate-Affected Work Environments.",
      },
      {
        id: "wed-7b",
        time: "13:45–15:30",
        title: "Plenary B — Climate Finance, ESG and Sustainable Investment",
        room: "B",
        type: "concurrent",
        themes: ["C"],
        description: "Mobilising Climate Finance and Green Bonds, Integrating ESG Principles, Scaling Renewable Energy and Low-Carbon Infrastructure, Promoting Sustainable Trade and Investment in Green Sectors.",
      },
      {
        id: "wed-8a",
        time: "15:30–17:00",
        title: "Workshops 1 & 2: MSMEs, Green Business & Social Protection",
        room: "A",
        type: "workshop",
        themes: ["C", "K"],
        description: "Workshop 1: Supporting MSMEs to Adapt to Climate Change and Transition to Green Business Models. Workshop 2: Strengthening Social Protection Systems to Manage Climate-Related Economic Shocks [THEME K].",
      },
      {
        id: "wed-8b",
        time: "15:30–17:00",
        title: "Workshops 3, 4 & 5: Sustainable Agriculture, Green Trade & Gender Climate Finance",
        room: "B",
        type: "workshop",
        themes: ["C", "D"],
        description: "Workshop 3: Sustainable Agriculture, Water Management and Food Security Investments. Workshop 4: Leveraging Regional Trade and Value Chains for Green Exports. Workshop 5: Gender-Responsive Climate Finance and Green Jobs for Women [THEME D].",
      },
      {
        id: "wed-9",
        time: "17:00–17:30",
        title: "Day 3 Rapporteur Summary",
        room: "A",
        type: "ceremony",
        themes: [],
        description: "Key insights and investment commitments from the Official Opening Day.",
      },
      {
        id: "wed-10",
        time: "19:00–22:00",
        title: "Ministerial Gala Dinner",
        room: "BOTH",
        type: "social",
        themes: [],
        description: "Grand Ballroom, Elephant Hills Resort. Hosted by the Government of Zimbabwe and TNF Secretariat. TNF Innovation Challenge Finals — Top 5 pitches before a live investor jury. Announcement of Investment Commitments and Partnership Pledges. Dress Code: Black Tie / Formal African Attire.",
      },
    ],
  },
  {
    date: "Thursday, 24 September 2026",
    dayLabel: "DAY 4",
    theme: "Youth, Women, Skills & the Future of Work",
    sessions: [
      {
        id: "thu-1",
        time: "08:00–08:30",
        title: "Final Morning Networking Breakfast",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "thu-2",
        time: "08:30–09:30",
        title: "High-Level Plenary — Investing in People",
        room: "A",
        type: "plenary",
        themes: ["D", "F", "I"],
        description: "\"Investing in People: Youth, Women and Skills as the Foundation of Africa's Economic Future.\" Keynote: Africa's demographic growth as its greatest asset. Panel: Ministers of Youth, Education, Skills and Women's Affairs.",
      },
      {
        id: "thu-3",
        time: "09:30–10:00",
        title: "Morning Tea",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "thu-4a",
        time: "10:00–12:00",
        title: "Plenary A — Youth Employment, Skills and Entrepreneurship",
        room: "A",
        type: "concurrent",
        themes: ["I", "F"],
        description: "Reducing Youth NEET Rates, Strengthening School-to-Work Transition, Empowering Youth-Led Enterprises, Digital Entrepreneurship — How African Youth are Building Tech Giants.",
      },
      {
        id: "thu-4b",
        time: "10:00–12:00",
        title: "Plenary B — Women's Economic Empowerment & Workplace Transformation",
        room: "B",
        type: "concurrent",
        themes: ["D", "K"],
        description: "Closing Gender Pay Gaps, Gender-Responsive Investment Policies, Childcare and Flexible Work as Drivers of Women's Labour Force Participation, Ending Gender-Based Workplace Violence.",
      },
      {
        id: "thu-5",
        time: "12:00–13:30",
        title: "Networking Luncheon",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "thu-6a",
        time: "13:30–15:00",
        title: "Workshops 1, 2 & 3: Workplace Wellness, Social Protection & Lifelong Learning",
        room: "A",
        type: "workshop",
        themes: ["K", "B"],
        description: "Workshop 1: Promoting Workplace Wellness and Mental Health [THEME K]. Workshop 2: Designing Comprehensive Social Protection for All Workers. Workshop 3: Lifelong Learning and Reskilling Strategies for the AI-Driven Economy [THEME B].",
      },
      {
        id: "thu-6b",
        time: "13:30–15:00",
        title: "Workshops 4 & 5: Labour Inspection & Youth-Led MSMEs",
        room: "B",
        type: "workshop",
        themes: ["I"],
        description: "Workshop 4: Strengthening Labour Inspection, Occupational Safety and Health in New Work Contexts. Workshop 5: Youth-Led MSMEs — Unlocking Investment, Mentorship and Scale-Up Pathways [THEME I].",
      },
      {
        id: "thu-7",
        time: "15:00–16:30",
        title: "OFFICIAL SUMMIT CLOSING CEREMONY",
        room: "BOTH",
        type: "ceremony",
        themes: [],
        description: "Zimbabwe TNF Global Summit — Official Closing and Adoption of the Victoria Falls Declaration on Inclusive Growth, Decent Work, Beneficiation, and Investment. Remarks from CZI, ZCTU, Minister of Finance, ILO. Announcement: Summit 2027 Edition — Host Country and Theme.",
      },
      {
        id: "thu-8",
        time: "16:30–18:00",
        title: "Closing Exhibition and Networking",
        room: "BOTH",
        type: "networking",
        themes: [],
        description: "Final exhibition walk, networking, bilateral meetings and departure preparations. TNF Secretariat available for 2027 partnership discussions.",
      },
      {
        id: "thu-9",
        time: "19:30–22:00",
        title: "Farewell Cocktail Reception",
        room: "BOTH",
        type: "social",
        themes: [],
        description: "Zambezi Terrace — Elephant Hills Resort. Sundowner cocktails overlooking the Zambezi River. Live marimba and jazz. Dress Code: Smart Casual.",
      },
    ],
  },
  {
    date: "Friday, 25 September 2026",
    dayLabel: "EXCURSIONS DAY",
    theme: "Victoria Falls Experience — Nature, Heritage & Networking",
    sessions: [
      {
        id: "fri-1",
        time: "07:00–08:00",
        title: "Breakfast at the Resort",
        room: "BOTH",
        type: "networking",
        themes: [],
        description: "Full breakfast before excursions depart. Delegates select preferred excursion during registration — places are limited.",
      },
      {
        id: "fri-2a",
        time: "08:00–10:30",
        title: "Excursion A — Victoria Falls Rainforest Walk",
        room: "A",
        type: "excursion",
        themes: [],
        description: "UNESCO World Heritage Site guided heritage walk — all 5 main viewpoints, one of the Seven Natural Wonders of the World. Expert guide commentary. Photography stops at Devil's Cataract, Main Falls and Rainbow Falls. ~2.5 km walk. Closed-toe shoes and light rain jacket recommended.",
      },
      {
        id: "fri-2b",
        time: "08:00–10:30",
        title: "Excursion B — Zambezi River Morning Boat Cruise",
        room: "B",
        type: "excursion",
        themes: [],
        description: "Scenic cruise along the Upper Zambezi River. Wildlife spotting: hippos, crocodiles, elephants, buffalo and 400+ bird species. Light refreshments and beverages on board. Hat and sunscreen recommended.",
      },
      {
        id: "fri-3",
        time: "08:30–13:00",
        title: "Excursion C — Morning Game Drive, Zambezi National Park",
        room: "BOTH",
        type: "excursion",
        themes: [],
        description: "Early morning safari — Big Five. Open 4x4 safari vehicles with professional guides. Breakfast bush stop. Limited to 30 delegates per departure — book early. Neutral-coloured clothing recommended.",
      },
      {
        id: "fri-4",
        time: "13:00–14:30",
        title: "Lunch Back at the Resort",
        room: "BOTH",
        type: "networking",
        themes: [],
      },
      {
        id: "fri-5",
        time: "14:30–16:30",
        title: "Optional Activities (Self-Arranged)",
        room: "BOTH",
        type: "networking",
        themes: [],
        description: "Bungee jump off Victoria Falls Bridge (111 metres) | White-water rafting — Grade 5 rapids | Helicopter 'Flight of Angels' | Sunset cruise on the Zambezi | Shopping and curio market | Spa and wellness treatments.",
      },
      {
        id: "fri-6",
        time: "17:00–18:30",
        title: "Summit Debrief & Thank You Reception",
        room: "BOTH",
        type: "social",
        themes: [],
        description: "Informal final gathering at Elephant Hills Terrace. Distribution of Summit Report (digital), Declaration and official communiqué. Secretariat available for media interviews.",
      },
      {
        id: "fri-7",
        time: "After the Summit",
        title: "Check-out, Airport Transfers & Departure",
        room: "BOTH",
        type: "networking",
        themes: [],
        description: "Hotel check-out, airport shuttles and onward travel as per your booking. The secretariat is available to assist. Thank you for attending the inaugural Zimbabwe TNF Global Summit — safe travels.",
      },
    ],
  },
];

/** Flat delegate registration fee (USD) — all categories. Kept in sync with `registrationFee.ts`. */
const DELEGATE_FEE_USD = 1500;

export const registrationFees = [
  {
    category: "Government / Public Sector",
    earlyBird: DELEGATE_FEE_USD,
    standard: DELEGATE_FEE_USD,
    icon: "Building",
    color: "#3B82F6",
  },
  {
    category: "Private Sector / Corporates",
    earlyBird: DELEGATE_FEE_USD,
    standard: DELEGATE_FEE_USD,
    icon: "Briefcase",
    color: "#C9921A",
    popular: true,
  },
  {
    category: "International Organisations / DFIs",
    earlyBird: DELEGATE_FEE_USD,
    standard: DELEGATE_FEE_USD,
    icon: "Globe",
    color: "#10B981",
  },
  {
    category: "Youth Delegates (Under 35)",
    earlyBird: DELEGATE_FEE_USD,
    standard: DELEGATE_FEE_USD,
    icon: "Users",
    color: "#8B5CF6",
  },
  {
    category: "African Civil Society / MSMEs",
    earlyBird: DELEGATE_FEE_USD,
    standard: DELEGATE_FEE_USD,
    icon: "Heart",
    color: "#EC4899",
  },
  {
    category: "Virtual / Hybrid Attendance",
    earlyBird: DELEGATE_FEE_USD,
    standard: DELEGATE_FEE_USD,
    icon: "Monitor",
    color: "#14B8A6",
  },
];

/** 25% off list sponsorship investment (e.g. 100,000 → 75,000 USD). */
export const SPONSORSHIP_DISCOUNT_RATE = 0.25;

export type ThemeSponsorshipPackageTier = "platinum" | "gold" | "silver" | "official_partner";

export type ThemeSponsorshipOffer = {
  /** Unique row id for UI (e.g. `A`, `B-platinum`, `B-gold`) */
  offerKey: string;
  themeId: string;
  themeLabel: string;
  packageTier: ThemeSponsorshipPackageTier;
  packageLabel: string;
  /** List price before 25% reduction */
  listPriceUsd: number;
  /** Investment after 25% reduction */
  priceUsd: number;
  /** One-line package benefits (from official theme deck) */
  benefitsLine?: string;
  /** Full bullet list for sponsors page (optional; e.g. Theme A deck) */
  benefitsBullets?: string[];
  /** Optional line above bullets (e.g. “Includes all Gold … plus”) */
  benefitsIntro?: string;
};

/** Theme A — Africa's $3.4 Trillion Investment Frontier: three tiers (published USD), per official theme deck. */
const THEME_A_TIER_DEFS: Omit<ThemeSponsorshipOffer, "themeId" | "themeLabel" | "offerKey">[] = [
  {
    packageTier: "platinum",
    packageLabel: "Platinum",
    listPriceUsd: 30_000,
    priceUsd: 30_000,
    benefitsLine: "All Gold benefits plus: prime branding, 5-minute slot, 2 delegates, 2 VIP openings, banners",
    benefitsIntro: "Includes all Gold Sponsorship benefits plus:",
    benefitsBullets: [
      "Prime branding of the event and acknowledgement during the event",
      "5-minute in-person marketing/speaking slot",
      "Access to participants list",
      "Complimentary registration of 2 delegates",
      "2 VIP invitations to the Official Opening",
      "Hyperlinked banner on the Global Summit website",
      "In-and-out conference venue advertising with 2 pull-up banners",
      "Outside wall banner",
    ],
  },
  {
    packageTier: "gold",
    packageLabel: "Gold",
    listPriceUsd: 25_000,
    priceUsd: 25_000,
    benefitsLine: "All Silver benefits plus: 2 delegates, 2-minute slot, 2 venue banners, site banner, logo & verbal recognition",
    benefitsIntro: "Includes all Silver Sponsorship benefits plus:",
    benefitsBullets: [
      "Complimentary entry for 2 delegates",
      "2-minute marketing slot during the conference",
      "Venue advertising with 2 banners",
      "Hyperlinked banner on the website",
      "Logo on the projection screen, conference program and verbal recognition (at intervals) throughout the conference",
    ],
  },
  {
    packageTier: "silver",
    packageLabel: "Silver",
    listPriceUsd: 20_000,
    priceUsd: 20_000,
    benefitsLine: "Logo & verbal recognition, venue banners, program & electronic banner, 1 delegate, collateral distribution",
    benefitsBullets: [
      "Logo on the projection screen, conference program and verbal recognition (at intervals) throughout the sessions",
      "In-and-out conference venue advertising with banners",
      "Logo inclusion on the program and revolving electronic banner",
      "Complimentary registration of 1 delegate",
      "Distribution of promotional material to delegates",
    ],
  },
];

/** Short copy from the official Theme A sponsorship deck (matches programme slide). */
export const themeASponsorshipDeck = {
  tagline:
    "Unlocking Africa's largest investment opportunity through policy coherence, AfCFTA and bankable project pipelines.",
  keySessions:
    "High-Level Ministerial Plenary | ZIDA Investment Showcase | Smart Investment & Value Chains | MSME Access to Finance",
} as const;

/** Theme B — AI, Automation & the Jobs of Tomorrow: three tiers (list USD → 25% off), per official slide. */
const THEME_B_TIER_DEFS: Omit<ThemeSponsorshipOffer, "themeId" | "themeLabel" | "offerKey">[] = [
  {
    packageTier: "platinum",
    packageLabel: "Platinum",
    listPriceUsd: 75_000,
    priceUsd: 56_250,
    benefitsLine:
      "Session naming + ILO Monitor co-branding + AI showcase stage + 8 passes",
  },
  {
    packageTier: "gold",
    packageLabel: "Gold",
    listPriceUsd: 40_000,
    priceUsd: 30_000,
    benefitsLine: "Tech demo zone + speaking slot + 5 passes + digital branding package",
  },
  {
    packageTier: "silver",
    packageLabel: "Silver",
    listPriceUsd: 20_000,
    priceUsd: 15_000,
    benefitsLine: "Workshop branding + 3 passes + logo on all digital assets & app",
  },
];

/** Theme C — Green Growth as a Competitive Advantage (Opening Day premium), per official slide. */
const THEME_C_TIER_DEFS: Omit<ThemeSponsorshipOffer, "themeId" | "themeLabel" | "offerKey">[] = [
  {
    packageTier: "platinum",
    packageLabel: "Platinum",
    listPriceUsd: 85_000,
    priceUsd: 63_750,
    benefitsLine:
      "Opening Day co-branding + keynote stage + green zone exhibition + ESG co-report + 8 passes",
  },
  {
    packageTier: "gold",
    packageLabel: "Gold",
    listPriceUsd: 45_000,
    priceUsd: 33_750,
    benefitsLine:
      "Climate Finance session branding + speaking slot + green bonds workshop + 5 passes",
  },
  {
    packageTier: "silver",
    packageLabel: "Silver",
    listPriceUsd: 22_000,
    priceUsd: 16_500,
    benefitsLine: "Carbon market workshop sponsor + logo on green investment brief + 3 passes",
  },
];

/** Theme G — Industrialisation & Value Chain Integration (core beneficiation / beneficiation priority tier), per official slide. */
const THEME_G_TIER_DEFS: Omit<ThemeSponsorshipOffer, "themeId" | "themeLabel" | "offerKey">[] = [
  {
    packageTier: "platinum",
    packageLabel: "Platinum",
    listPriceUsd: 90_000,
    priceUsd: 67_500,
    benefitsLine:
      "Beneficiation summit naming + ministerial panel seat + investment brief + 10 passes",
  },
  {
    packageTier: "gold",
    packageLabel: "Gold",
    listPriceUsd: 50_000,
    priceUsd: 37_500,
    benefitsLine: "SEZ/manufacturing session sponsor + deal facilitation access + 6 passes",
  },
  {
    packageTier: "silver",
    packageLabel: "Silver",
    listPriceUsd: 25_000,
    priceUsd: 18_750,
    benefitsLine: "Workshop sponsor + value chain exhibition stand + 4 passes + report feature",
  },
];

/** Theme E — Digital Finance & the FinTech Revolution, per official slide. */
const THEME_E_TIER_DEFS: Omit<ThemeSponsorshipOffer, "themeId" | "themeLabel" | "offerKey">[] = [
  {
    packageTier: "platinum",
    packageLabel: "Platinum",
    listPriceUsd: 75_000,
    priceUsd: 56_250,
    benefitsLine:
      "FinTech stage naming + live pitch branding + RBZ session co-brand + 8 passes",
  },
  {
    packageTier: "gold",
    packageLabel: "Gold",
    listPriceUsd: 40_000,
    priceUsd: 30_000,
    benefitsLine: "Digital finance session + FinTech showcase stand + summit app feature + 5 passes",
  },
  {
    packageTier: "silver",
    packageLabel: "Silver",
    listPriceUsd: 20_000,
    priceUsd: 15_000,
    benefitsLine: "Blockchain workshop sponsor + logo on digital assets + 3 passes",
  },
];

/** Theme I — Youth Entrepreneurship & Africa's Demographic Dividend (TNF Innovation Challenge), per official slide. */
const THEME_I_TIER_DEFS: Omit<ThemeSponsorshipOffer, "themeId" | "themeLabel" | "offerKey">[] = [
  {
    packageTier: "platinum",
    packageLabel: "Platinum",
    listPriceUsd: 60_000,
    priceUsd: 45_000,
    benefitsLine:
      "Innovation Challenge title sponsor + prize fund branding + Gala Dinner recognition + 8 passes",
  },
  {
    packageTier: "gold",
    packageLabel: "Gold",
    listPriceUsd: 32_000,
    priceUsd: 24_000,
    benefitsLine:
      "Innovation stage sponsor + pitch showcase branding + investor panel seat + 5 passes",
  },
  {
    packageTier: "silver",
    packageLabel: "Silver",
    listPriceUsd: 16_000,
    priceUsd: 12_000,
    benefitsLine: "Youth forum co-sponsor + mentorship programme branding + 3 passes",
  },
];

const THEME_LIST_USD: Record<string, { tier: ThemeSponsorshipPackageTier; listUsd: number }> = {
  D: { tier: "gold", listUsd: 85_000 },
  F: { tier: "gold", listUsd: 80_000 },
  H: { tier: "silver", listUsd: 60_000 },
  J: { tier: "silver", listUsd: 55_000 },
  K: { tier: "silver", listUsd: 55_000 },
  L: { tier: "official_partner", listUsd: 40_000 },
  M: { tier: "gold", listUsd: 90_000 },
  N: { tier: "gold", listUsd: 90_000 },
};

const tierLabels: Record<ThemeSponsorshipPackageTier, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  official_partner: "Official Partner",
};

function themeOfferFromId(theme: (typeof themes)[0]): ThemeSponsorshipOffer {
  const row = THEME_LIST_USD[theme.id] ?? { tier: "official_partner" as const, listUsd: 30_000 };
  const priceUsd = Math.round(row.listUsd * (1 - SPONSORSHIP_DISCOUNT_RATE));
  return {
    offerKey: `${theme.id}-${row.tier}`,
    themeId: theme.id,
    themeLabel: theme.label,
    packageTier: row.tier,
    packageLabel: tierLabels[row.tier],
    listPriceUsd: row.listUsd,
    priceUsd,
  };
}

/** All package rows for a theme (Themes A–C, E, G & I have Platinum, Gold, Silver; others have one row). */
export function getThemeSponsorshipTiers(themeId: string): ThemeSponsorshipOffer[] {
  if (themeId === "A") {
    const themeA = themes.find((th) => th.id === "A");
    const label = themeA?.label ?? "Africa's $3.4 Trillion Investment Frontier";
    return THEME_A_TIER_DEFS.map((t) => ({
      offerKey: `A-${t.packageTier}`,
      themeId: "A",
      themeLabel: label,
      ...t,
    }));
  }
  if (themeId === "B") {
    const themeB = themes.find((th) => th.id === "B");
    const label = themeB?.label ?? "AI, Automation & the Jobs of Tomorrow";
    return THEME_B_TIER_DEFS.map((t) => ({
      offerKey: `B-${t.packageTier}`,
      themeId: "B",
      themeLabel: label,
      ...t,
    }));
  }
  if (themeId === "C") {
    const themeC = themes.find((th) => th.id === "C");
    const label = themeC?.label ?? "Green Growth as a Competitive Advantage";
    return THEME_C_TIER_DEFS.map((t) => ({
      offerKey: `C-${t.packageTier}`,
      themeId: "C",
      themeLabel: label,
      ...t,
    }));
  }
  if (themeId === "E") {
    const themeE = themes.find((th) => th.id === "E");
    const label = themeE?.label ?? "Digital Finance & the FinTech Revolution";
    return THEME_E_TIER_DEFS.map((t) => ({
      offerKey: `E-${t.packageTier}`,
      themeId: "E",
      themeLabel: label,
      ...t,
    }));
  }
  if (themeId === "G") {
    const themeG = themes.find((th) => th.id === "G");
    const label = themeG?.label ?? "Industrialisation & Value Chain Integration";
    return THEME_G_TIER_DEFS.map((t) => ({
      offerKey: `G-${t.packageTier}`,
      themeId: "G",
      themeLabel: label,
      ...t,
    }));
  }
  if (themeId === "I") {
    const themeI = themes.find((th) => th.id === "I");
    const label = themeI?.label ?? "Youth Entrepreneurship & Africa's Demographic Dividend";
    return THEME_I_TIER_DEFS.map((t) => ({
      offerKey: `I-${t.packageTier}`,
      themeId: "I",
      themeLabel: label,
      ...t,
    }));
  }
  const theme = themes.find((th) => th.id === themeId);
  if (!theme) return [];
  return [themeOfferFromId(theme)];
}

/** One “primary” row per theme (for the theme dropdown) — first tier. */
export const themeSponsorshipOffers: ThemeSponsorshipOffer[] = themes.map((th) => getThemeSponsorshipTiers(th.id)[0]);

/** Full table: every theme–tier line (Themes A–C, E, G & I = 3 rows each). */
export const themeSponsorshipTiersFlat: ThemeSponsorshipOffer[] = themes.flatMap((th) => getThemeSponsorshipTiers(th.id));

export function getThemeSponsorshipOffer(themeId: string): ThemeSponsorshipOffer | undefined {
  return getThemeSponsorshipTiers(themeId)[0];
}

/** Specific tier (e.g. for contact ?theme=B&tier=gold). */
export function getThemeSponsorshipOfferTier(
  themeId: string,
  tier: ThemeSponsorshipPackageTier
): ThemeSponsorshipOffer | undefined {
  return getThemeSponsorshipTiers(themeId).find((o) => o.packageTier === tier);
}

/** Summit-wide partnership: exhibition + visibility for the full duration of the summit (separate from theme packages). */
export type SummitWidePartnershipTierId = "platinum" | "gold" | "silver" | "bronze";

export type SummitWidePartnershipTier = {
  id: SummitWidePartnershipTierId;
  shortLabel: string;
  title: string;
  priceBand: string;
  passesAndAccess: string;
  benefits: string[];
  headerColor: string;
  panelBg: string;
};

const SUMMIT_WIDE_TIERS: SummitWidePartnershipTier[] = [
  {
    id: "platinum",
    shortLabel: "Platinum",
    title: "Platinum Title Partner",
    priceBand: "USD 75,000",
    passesAndAccess:
      "All Gold Sponsorship Plus · 7 VIP passes + 2 Ministerial Gala seats + dedicated VIP lounge access",
    benefits: [
      "Exclusive naming rights to 1 full plenary session and co-branding on the Official Opening Ceremony stage",
      "Premium logo placement on main stage backdrop, all printed materials, and website homepage",
      "Full-page inside-front-cover advertisement in Summit Program",
      "10-minute keynote address during Opening Ceremony + seat on hosted ministerial bilateral meeting + business roundtable",
      "Featured as Platinum Partner in Summit Magazine",
      "Appearance on all branded summit materials",
      "First right of refusal for Summit 2027 — founding sponsor legacy recognition",
    ],
    headerColor: "#152D4B",
    panelBg: "rgba(21, 45, 75, 0.14)",
  },
  {
    id: "gold",
    shortLabel: "Gold",
    title: "Gold Partner",
    priceBand: "USD 50,000",
    passesAndAccess: "All Silver Sponsorship Plus · 3 VIP passes + 2 access passes + 1 Ministerial Gala seat",
    benefits: [
      "Logo on stage backdrop and printed materials",
      "Half-page ad in Summit Program",
      "5-minute welcome address at 1 themed session",
      "Investor deal-room access and bilateral matchmaking",
      "Featured as Gold Partner in Summit Recognition at Welcome Cocktail and Gala Dinner",
    ],
    headerColor: "#C9921A",
    panelBg: "rgba(201, 146, 26, 0.1)",
  },
  {
    id: "silver",
    shortLabel: "Silver",
    title: "Silver Partner",
    priceBand: "USD 30,000",
    passesAndAccess: "All Bronze sponsorship Plus · 3 access passes + 1 Gala seat",
    benefits: [
      "Logo on website and Summit Program",
      "Quarter-page ad in Summit Program",
      "5-minute speaking slot in a relevant workshop",
      "Access to selected networking events",
      "Listed as Silver Partner in Summit Magazine",
    ],
    headerColor: "#2563EB",
    panelBg: "rgba(37, 99, 235, 0.1)",
  },
  {
    id: "bronze",
    shortLabel: "Bronze",
    title: "Bronze Partner",
    priceBand: "USD 15,000",
    passesAndAccess: "2 full-access passes",
    benefits: [
      "Logo on website and Summit Program",
      "Branded social media mentions",
      "Access at selected networking events",
      "Listed in Summit Magazine",
      "Certificate of sponsorship partnership",
    ],
    headerColor: "#92400E",
    panelBg: "rgba(146, 64, 14, 0.12)",
  },
];

export const summitWidePartnershipIntro =
  "For organisations that want exhibition space and brand visibility for the full duration of the summit — in addition to theme-specific and event packages — we offer four summit-wide partnership tiers.";

export const summitWidePartnershipTiers: SummitWidePartnershipTier[] = SUMMIT_WIDE_TIERS;

export function getSummitWidePartnershipTier(
  id: string
): SummitWidePartnershipTier | undefined {
  return SUMMIT_WIDE_TIERS.find((t) => t.id === id);
}

export const sponsors = {
  platinum: [
    { name: "ZIDA", fullName: "Zimbabwe Investment and Development Agency", description: "Host Nation Investment Partner", website: "https://zida.gov.zw" },
    { name: "ILO", fullName: "International Labour Organization", description: "International Partner", website: "https://ilo.org" },
  ],
  gold: [
    { name: "AU Commission", fullName: "African Union Commission", description: "Continental Partner", website: "https://au.int" },
    { name: "AfCFTA", fullName: "African Continental Free Trade Area Secretariat", description: "Trade Partner", website: "https://afcfta.au.int" },
  ],
  silver: [
    { name: "ZCTU", fullName: "Zimbabwe Congress of Trade Unions", description: "Workers' Partner", website: "#" },
    { name: "CZI", fullName: "Confederation of Zimbabwe Industries", description: "Employers' Partner", website: "#" },
    { name: "AICESIS", fullName: "International Association of Economic and Social Councils", description: "ESC Network Partner", website: "#" },
  ],
  partners: [
    { name: "SADC", fullName: "Southern African Development Community", description: "Regional Partner", website: "https://sadc.int" },
    { name: "Elephant Hills", fullName: "Elephant Hills Resort", description: "Official Venue Partner", website: "#" },
  ],
};

export const keyFacts = [
  { value: "1,500+", label: "Expected Delegates", icon: "Users" },
  { value: "5", label: "Days", icon: "Calendar" },
  { value: "4", label: "Plenary Days", icon: "Mic" },
  { value: "20+", label: "Sessions", icon: "Layout" },
  { value: "14", label: "Spotlight Themes", icon: "Tag" },
  { value: "2", label: "Concurrent Rooms", icon: "DoorOpen" },
  { value: "6+", label: "African Nations Represented", icon: "Globe" },
  { value: "Sept 2026", label: "Victoria Falls, Zimbabwe", icon: "MapPin" },
];

export const whyAttend = [
  {
    audience: "Governments & Policymakers",
    description: "Shape inclusive growth policies, forge bilateral investment partnerships, and influence continental and global agendas — all from one platform.",
    icon: "Landmark",
    color: "#3B82F6",
  },
  {
    audience: "Investors & Business Leaders",
    description: "Access bankable project pipelines, ESG frameworks, emerging market intelligence, and direct matchmaking with African policymakers and DFIs.",
    icon: "TrendingUp",
    color: "#C9921A",
  },
  {
    audience: "Social Partners — Workers & Employers",
    description: "Advance workers' and employers' interests in shaping the future of work, investment governance, and social protection — tripartism in action.",
    icon: "Handshake",
    color: "#10B981",
  },
  {
    audience: "Youth Innovators & Entrepreneurs",
    description: "Pitch solutions at the TNF Innovation Challenge, connect with investors and mentors, and gain visibility on Africa's leading tripartite platform.",
    icon: "Rocket",
    color: "#8B5CF6",
  },
];
