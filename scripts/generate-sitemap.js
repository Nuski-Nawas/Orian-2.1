#!/usr/bin/env node
/**
 * AlgoLabs Sitemap Generator
 * ==========================
 * Generates public/sitemap.xml (for dev) and optionally dist/sitemap.xml (for prod).
 *
 * Usage:
 *   node scripts/generate-sitemap.js                  → writes to public/sitemap.xml
 *   node scripts/generate-sitemap.js --dist           → writes to dist/sitemap.xml
 *   node scripts/generate-sitemap.js --both           → writes to both
 *
 * The base URL is read from the SITE_URL env var, or defaults to https://algolabs.one
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL_MAP, SITEMAP_INCLUDE, getSitemapMeta, toCleanUrl } from './url-map.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = process.env.SITE_URL || 'https://algolabs.one';
const args = process.argv.slice(2);
const writeDist = args.includes('--dist') || args.includes('--both');
const writePub = !args.includes('--dist') || args.includes('--both');

// ── Collect URLs ────────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];

const entries = [];

for (const [slug, cleanPath] of Object.entries(URL_MAP)) {
  if (!SITEMAP_INCLUDE.has(slug)) continue;

  // Verify source HTML exists
  const srcFile = path.join(ROOT, `${slug}.html`);
  if (!fs.existsSync(srcFile)) continue;

  const { priority, changefreq } = getSitemapMeta(slug);
  const loc = BASE_URL + cleanPath;

  entries.push({ loc, priority, changefreq, lastmod: today });
}

// Also scan for any digital-marketing-*.html files not in URL_MAP
const allFiles = fs
  .readdirSync(ROOT)
  .filter((f) => f.startsWith('digital-marketing-') && f.endsWith('.html'));
for (const file of allFiles) {
  const slug = file.replace('.html', '');
  if (URL_MAP[slug]) continue; // already handled
  if (!SITEMAP_INCLUDE.has(slug)) continue;
  const cleanPath = toCleanUrl(slug);
  entries.push({
    loc: BASE_URL + cleanPath,
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: today,
  });
}

// Sort: homepage first, then by priority desc, then alpha
entries.sort((a, b) => {
  if (a.loc === BASE_URL + '/') return -1;
  if (b.loc === BASE_URL + '/') return 1;
  return parseFloat(b.priority) - parseFloat(a.priority) || a.loc.localeCompare(b.loc);
});

// ── Build XML ────────────────────────────────────────────────────────────────
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
  '          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  '',
  ...entries.map(({ loc, priority, changefreq, lastmod }) =>
    [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  ),
  '',
  '</urlset>',
].join('\n');

// ── Write output ─────────────────────────────────────────────────────────────
function writeFile(dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, xml, 'utf8');
  console.log(`✅ Sitemap written → ${path.relative(ROOT, dest)} (${entries.length} URLs)`);
}

if (writePub) writeFile(path.join(ROOT, 'public', 'sitemap.xml'));
if (writeDist) writeFile(path.join(ROOT, 'dist', 'sitemap.xml'));

// ── Print summary ─────────────────────────────────────────────────────────────
console.log(`\n📄 Sitemap summary (${entries.length} URLs · base: ${BASE_URL})`);
console.table(entries.map(({ loc, priority }) => ({ url: loc.replace(BASE_URL, ''), priority })));
