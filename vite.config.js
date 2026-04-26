import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import {
  URL_MAP,
  REVERSE_MAP,
  BLOCKED_SLUGS,
  toCleanUrl
} from './scripts/url-map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─────────────────────────────
   FIXED HTML ENTRY SCANNER
───────────────────────────── */
const getHtmlEntries = () => {
  const entries = {};

  const rootDir = process.cwd(); // ✅ FIX (important)

  if (!fs.existsSync(rootDir)) return entries;

  const files = fs.readdirSync(rootDir);

  files
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const name = path.basename(file, '.html');
      entries[name] = path.resolve(rootDir, file);
    });

  return entries;
};

/* ───────────────────────────── */
const jsToBottomNoModule = () => ({
  name: 'no-attribute',
  transformIndexHtml(html) {
    html = html.replace(`type="module" crossorigin`, '');

    const match = html.match(/<script[^>]*>[\s\S]*?<\/script>/);
    if (!match) return html;

    const scriptTag = match[0];
    html = html.replace(scriptTag, '');
    html = html.replace('<!-- SCRIPT -->', scriptTag);

    return html;
  },
});

/* ───────────────────────────── */
const cssCrossOriginRemove = () => ({
  name: 'css-cross-origin-remove',
  transformIndexHtml(html) {
    return html.replace(
      /(<link[^>]*rel=["']stylesheet["'][^>]*?)\s+crossorigin(?:=["'][^"']*["'])?/g,
      '$1'
    );
  },
});

/* ───────────────────────────── */
const urlMasker = () => ({
  name: 'url-masker',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const [urlPath, query] = (req.url || '').split('?');
      const qs = query ? '?' + query : '';

      const rawSlug = urlPath
        .replace(/^\//, '')
        .replace(/\.html$/, '')
        .replace(/\/$/, '');

      if (BLOCKED_SLUGS.has(rawSlug)) {
        req.url = '/404.html' + qs;
        return next();
      }

      if (urlPath.endsWith('.html')) {
        const cleanPath =
          URL_MAP[rawSlug] || '/' + toCleanUrl(rawSlug).replace(/^\//, '');

        res.writeHead(301, { Location: cleanPath + qs });
        res.end();
        return;
      }

      const normalised =
        (urlPath.split('?')[0] || '/').replace(/\/$/, '') || '/';

      if (normalised === '/') {
        req.url = '/digital-marketing.html' + qs;
        return next();
      }

      if (REVERSE_MAP[normalised]) {
        req.url = `/${REVERSE_MAP[normalised]}.html${qs}`;
        return next();
      }

      const candidate = normalised.replace(/^\//, '');
      const htmlPath = path.resolve(process.cwd(), `${candidate}.html`);

      if (fs.existsSync(htmlPath)) {
        req.url = `/${candidate}.html${qs}`;
      }

      next();
    });
  },
});

/* ───────────────────────────── */
const vendorMinifier = () => ({
  name: 'vendor-minifier',
  async generateBundle() {
    const vendorDir = path.resolve(process.cwd(), 'dist/vendor');

    if (!fs.existsSync(vendorDir)) return;

    const files = fs.readdirSync(vendorDir);

    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      const filePath = path.join(vendorDir, file);
      const code = fs.readFileSync(filePath, 'utf8');

      try {
        const result = await minify(code, {
          compress: { passes: 2 },
          mangle: true,
        });

        fs.writeFileSync(filePath, result.code);
      } catch {
        console.warn(`⚠️ Skip: ${file}`);
      }
    }
  },
});

/* ───────────────────────────── */
export default defineConfig({
  plugins: [
    urlMasker(),
    tailwindcss(),
    injectHTML({ tagName: 'Component' }),
    jsToBottomNoModule(),
    cssCrossOriginRemove(),
    vendorMinifier(),
  ],

  build: {
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        entryFileNames: 'assets/main.js',
        assetFileNames: 'assets/[name]-[hash][extname]', // ✅ FIXED
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    modulePreload: false,
    assetsDir: 'assets',
  },

  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },

  base: '/',
});