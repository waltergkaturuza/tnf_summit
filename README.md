# TNF Global Summit 2026 — Official Website

**Inaugural Edition | 20–26 September 2026 | Elephant Hills Resort, Victoria Falls, Zimbabwe**

Africa's premier tripartite-led global convening platform on **Inclusive Growth, Decent Work & Investment Promotion**.

Organised by the **Tripartite Negotiating Forum (TNF) Secretariat**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The development server runs at `http://localhost:3000`

---

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with Navbar + Footer
    page.tsx            # Home / Landing page
    globals.css         # Global styles, design tokens, utilities
    about/page.tsx      # About the Summit
    program/page.tsx    # Dynamic programme schedule
    registration/page.tsx  # Registration form + fee table
    speakers/page.tsx   # Speakers & panelists
    sponsors/page.tsx   # Sponsors & partnership packages
    gallery/page.tsx    # Media centre & gallery
    contact/page.tsx    # Contact form + FAQs
  components/
    Navbar.tsx          # Responsive navigation
    Footer.tsx          # Site footer with links
    CountdownTimer.tsx  # Live countdown to 20 Sep 2026
  lib/
    data.ts             # All conference data (programme, themes, fees)
    utils.ts            # Utility functions
```

---

## Key Features

- **Live countdown** to Summit opening (20 September 2026)
- **Dynamic programme viewer** with filters by day, session type, room and search
- **14 spotlight themes** with colour-coded visual system
- **3-step registration form** with delegate categories and fee calculation
- **Responsive design** — mobile, tablet, desktop
- **Glass morphism UI** with gold accent design system
- **Framer Motion animations** throughout
- **SEO optimised** with OpenGraph and Twitter cards

---

## Conference Data

All conference data lives in `src/lib/data.ts`:

- `summitInfo` — core summit information
- `themes` — 14 spotlight themes (A–N)
- `program` — full 7-day schedule (7 days × all sessions)
- `registrationFees` — delegate categories and fees
- `sponsors` — sponsor tiers and listings
- `keyFacts` — statistics for the homepage
- `whyAttend` — audience profiles

---

## Design System

| Token | Value |
|-------|-------|
| Primary Navy | `#0A1628` |
| Gold Accent | `#C9921A` |
| Gold Light | `#F5B730` |
| Emerald | `#065F46` |
| Sky Blue | `#0EA5E9` |

CSS classes: `.glass`, `.glass-gold`, `.gradient-text`, `.shimmer`, `.btn-gold`, `.btn-outline-gold`, `.card-hover`

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

---

## Contact

**TNF Secretariat**
- Email: info@tnfzim.com
- Phone: +263 242 783030 / 783090
- Address: East Wing Block 3 Celestial Park, Borrowdale, Harare, Zimbabwe
- Website: www.tnfzim.org/summit2026

**#TNFGlobalSummit**
