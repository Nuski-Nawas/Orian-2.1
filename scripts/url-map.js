/**
 * OrianWave URL Map
 * ================
 * Maps every "digital-marketing-*" page slug to its clean, SEO-friendly URL.
 * Used by:
 *  - Vite dev server (URL masking middleware)
 *  - Post-build script (_redirects + sitemap.xml generation)
 *  - Sitemap generator
 *
 * IMPORTANT: All URLs must be single-level (no sub-paths like /a/b) to prevent
 * relative asset paths (./images/, ./assets/) from breaking when the page is
 * served from a nested path context.
 */

export const URL_MAP = {
  // ── Homepage ────────────────────────────────────────────
  'digital-marketing': '/',

  // ── Core Service Pages ───────────────────────────────────
  'digital-marketing-services': '/services',
  'digital-marketing-service-details': '/service-details',
  'digital-marketing-web-development': '/web-development',
  'digital-marketing-custom-software': '/custom-software',
  'digital-marketing-ai-optimization': '/seo-ai-optimization',
  'digital-marketing-ecommerce-solutions': '/ecommerce-solutions',

  // ── Products / SaaS Platforms ────────────────────────────
  'digital-marketing-products': '/products',
  'digital-marketing-aipos': '/aipos',
  'digital-marketing-saas-ecommerce': '/saas-ecommerce',

  // ── Pricing, Features, Integrations ─────────────────────
  'digital-marketing-pricing': '/pricing',
  'digital-marketing-features': '/features',
  'digital-marketing-integration': '/integrations',
  'digital-marketing-analytics': '/analytics',

  // ── Blog & Content ───────────────────────────────────────
  'digital-marketing-blog': '/blog',
  'digital-marketing-blog-details': '/blog-details',

  // ── Resources ────────────────────────────────────────────
  'digital-marketing-case-study': '/case-studies',
  'digital-marketing-case-study-details': '/case-study-details',
  'digital-marketing-success-stories': '/success-stories',
  'digital-marketing-use-case': '/use-cases',
  'digital-marketing-whitepaper': '/whitepapers',
  'digital-marketing-whitepaper-details': '/whitepaper-details',
  'digital-marketing-documentation': '/documentation',
  'digital-marketing-tutorial': '/tutorials',
  'digital-marketing-glossary': '/glossary',

  // ── Trust & Social Proof ─────────────────────────────────

  'digital-marketing-support': '/support',
  'digital-marketing-faq': '/faq',
  'digital-marketing-security': '/security',

  // ── About / Company ──────────────────────────────────────
  'digital-marketing-about': '/about',
  'digital-marketing-team': '/team',
  'digital-marketing-team-details': '/team-details',
  'digital-marketing-career': '/careers',
  'digital-marketing-career-details': '/career-details',
  'digital-marketing-our-manifesto': '/manifesto',
  'digital-marketing-why-choose-us': '/why-choose-us',
  'digital-marketing-process': '/process',
  'digital-marketing-press': '/press',
  'digital-marketing-changelog': '/changelog',

  // ── Customer Pages ───────────────────────────────────────
  'digital-marketing-customer': '/customers',
  'digital-marketing-customer-details': '/customer-details',

  // ── Contact ──────────────────────────────────────────────
  'digital-marketing-contact': '/contact',

  // ── Sitemap ──────────────────────────────────────────────
  'digital-marketing-sitemap': '/sitemap',

  // ── Legal (flat URLs — no sub-paths) ─────────────────────
  'digital-marketing-privacy-policy': '/privacy-policy',
  'digital-marketing-terms-conditions': '/terms-conditions',
  'digital-marketing-gdpr': '/gdpr',
  'digital-marketing-legal': '/legal',
  'digital-marketing-refund-policy': '/refund-policy',
  'digital-marketing-affiliate-policy': '/affiliate-policy',
  'digital-marketing-partner-policy': '/partner-policy',
};

/**
 * Slugs that should return 404 (login / signup are not public-facing).
 */
export const BLOCKED_SLUGS = new Set(['digital-marketing-login', 'digital-marketing-signup']);

/**
 * Reverse map: clean path → dirty slug
 * Used by dev server to serve the right file for a clean URL request.
 */
export const REVERSE_MAP = Object.fromEntries(
  Object.entries(URL_MAP).map(([slug, clean]) => [clean, slug])
);

/**
 * Returns the clean URL for a given slug (without the .html extension).
 * Falls back to stripping the "digital-marketing-" prefix if not explicitly mapped.
 */
export function toCleanUrl(slug) {
  if (URL_MAP[slug]) return URL_MAP[slug];
  // Fallback: strip "digital-marketing-" prefix and "-srilanka" suffix
  return (
    '/' +
    slug
      .replace(/^digital-marketing-/, '')
      .replace(/-srilanka$/, '')
      .replace(/-sri-lanka$/, '')
  );
}

/**
 * Returns the source HTML filename for a given slug.
 */
export function toFilename(slug) {
  return `${slug}.html`;
}

/**
 * Pages to include in sitemap (excludes auth, legal boilerplate, detail pages).
 */
export const SITEMAP_INCLUDE = new Set([
  'digital-marketing',
  'digital-marketing-services',
  'digital-marketing-web-development',
  'digital-marketing-custom-software',
  'digital-marketing-ai-optimization',
  'digital-marketing-ecommerce-solutions',
  'digital-marketing-products',
  'digital-marketing-aipos',
  'digital-marketing-pricing',
  'digital-marketing-features',
  'digital-marketing-integration',
  'digital-marketing-analytics',
  'digital-marketing-travel',
  'digital-marketing-logistics',
  'digital-marketing-textile',
  'digital-marketing-pharmaceutical',
  'digital-marketing-ecommerce-industry',
  'digital-marketing-blog',
  'digital-marketing-case-study',
  'digital-marketing-success-stories',
  'digital-marketing-use-case',
  'digital-marketing-whitepaper',
  'digital-marketing-documentation',
  'digital-marketing-support',
  'digital-marketing-faq',
  'digital-marketing-about',
  'digital-marketing-team',
  'digital-marketing-career',
  'digital-marketing-our-manifesto',
  'digital-marketing-why-choose-us',
  'digital-marketing-process',
  'digital-marketing-partners',
  'digital-marketing-contact',
  'digital-marketing-press',
  'digital-marketing-glossary',
  'digital-marketing-tutorial',
  'digital-marketing-changelog',
]);

/**
 * Sitemap priority and change frequency per URL pattern.
 */
export function getSitemapMeta(slug) {
  if (slug === 'digital-marketing') return { priority: '1.0', changefreq: 'weekly' };
  if (
    [
      'digital-marketing-services',
      'digital-marketing-contact',
      'digital-marketing-pricing',
    ].includes(slug)
  )
    return { priority: '0.9', changefreq: 'monthly' };
  if (
    slug.startsWith('digital-marketing-web-development') ||
    slug.startsWith('digital-marketing-custom-software') ||
    slug.startsWith('digital-marketing-ai-optimization') ||
    slug.startsWith('digital-marketing-ecommerce')
  )
    return { priority: '0.85', changefreq: 'monthly' };
  // if (
  //   slug.includes('industr') ||
  //   [
  //     'digital-marketing-travel',
  //     'digital-marketing-logistics',
  //     'digital-marketing-textile',
  //     'digital-marketing-pharmaceutical',
  //   ].includes(slug)
  // )
  //   return { priority: '0.8', changefreq: 'monthly' };
  // if (slug === 'digital-marketing-blog') return { priority: '0.75', changefreq: 'weekly' };
  // return { priority: '0.6', changefreq: 'monthly' };
}
