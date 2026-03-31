# AlgoLabs - Digital Agency Website ( )

## Overview
A high-performance static site built with Vite + Tailwind CSS v4, positioned as the official website for **AlgoLabs** —  's AI-powered digital agency. The active site section uses the `digital-marketing-*` page prefix. All other page prefixes (ai-chatbot, ai-gadgets, etc.) are inactive template variants.

**Positioning:** "End-to-End Digital Growth Ecosystem" — SaaS + Custom Software + Marketing + Branding for SMEs and enterprises in  , UAE, Australia and USA.

## Tech Stack
- **Build Tool:** Vite 6
- **CSS Framework:** Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **JavaScript:** Vanilla JS with ES modules
- **HTML Templating:** vite-plugin-html-inject (component-based `<Component src="..." />` injection)
- **Package Manager:** npm

## Project Structure
- `/` — All HTML pages (root level). Active pages use `digital-marketing-*.html` prefix.
- `/src/` — Source JS and CSS
  - `main.js` — Entry point that imports all JS modules
  - `/js/animation/` — Animation modules (accordion, sliders, tabs, etc.)
  - `/js/common/` — Common UI modules (navigation, menu, pricing, etc.)
  - `/js/utils/` — Utilities (cookie, counter, theme switcher, etc.)
  - `/src/styles/` — CSS files (Tailwind + custom styles)
- `/src/components/` — Reusable HTML components injected per page
- `/public/` — Static assets

## Active Pages (digital-marketing-* prefix)
| Page | Purpose | SEO Target |
|------|---------|-----------|
| `digital-marketing.html` | Homepage | "digital agency  " |
| `digital-marketing-services.html` | Services overview | "digital marketing agency  " |
| `digital-marketing-web-development.html` | Web dev service | "web development company  " |
| `digital-marketing-custom-software.html` | Custom software | "custom software development  " |
| `digital-marketing-ai-optimization.html` | SEO + AEO | "SEO agency  ", "AEO" |
| `digital-marketing-ecommerce.html` | E-commerce | "e-commerce development  " |
| `digital-marketing-products.html` | SaaS products | "SaaS  ", "AiPOS" |
| `digital-marketing-logistics.html` | Logistics/courier | "courier management system  " |
| `digital-marketing-travel.html` | Travel industry | "travel website development  " |
| `digital-marketing-blog.html` | Blog | "digital marketing blog  " |
| `digital-marketing-case-study.html` | Case studies | "digital agency results  " |
| `digital-marketing-about.html` | About | "digital agency about  " |
| `digital-marketing-contact.html` | Contact | "contact digital agency  " |

## Custom Content Components (SEO-rich, no Lorem Ipsum)
All created in `src/components/pages/`:
- `web-development-srilanka/content.htm` — Web development page hero, sidebar, services grid, tech stack, process, client stories
- `custom-software-srilanka/content.htm` — Custom software page with industries, process, tech stack
- `seo-ai-optimization/content.htm` — SEO + AEO page, what is AEO, results delivered
- `ecommerce-solutions-srilanka/content.htm` — E-commerce page with PayHere integration, platform options
- `saas-platforms/content.htm` — SaaS products page: AiPOS, AlgoShop, AlgoTrack, AlgoCRM, AlgoTravel Suite, AlgoReach
- `logistics-solutions/content.htm` — Courier/logistics management system page
- `travel-solutions/content.htm` — Travel industry booking/management solutions
- `digital-marketing/dm-services-intro.htm` — Full digital marketing services overview: stats bar, 6-service grid, "Why AlgoLabs" section

## Key Brand Facts (for consistent content)
- **Projects delivered:** 200+
- **Industries served:** 15+
- **Engagement rate lift:** 67% average
- **Global markets:**   · UAE · Australia · USA
- **SaaS products:** AiPOS (from $2.99/mo), AlgoShop, AlgoTrack (Q3 2026), AlgoCRM, AlgoTravel Suite, AlgoReach
- **Tech:** React, Next.js, Laravel, Flutter, Node.js, Python, PostgreSQL, AWS, Firebase

## Development
- **Dev server:** `npm run dev` — starts Vite on port 5000, host 0.0.0.0
- **Build:** `npm run build` — builds to `/dist/` with post-build processing
- **Workflow:** "Start application" runs `npm run dev`

## Deployment
- Type: Static site
- Build command: `npm run build`
- Public directory: `dist`
