import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { URL_MAP, REVERSE_MAP, BLOCKED_SLUGS, toCleanUrl } from './scripts/url-map.js';

const getHtmlEntries = () => {
  const pagesDir = path.resolve(__dirname, '');
  const entries = {};
  const files = fs.readdirSync(pagesDir);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  htmlFiles.forEach((file) => {
    const name = path.basename(file, '.html');
    entries[name] = path.resolve(pagesDir, file);
  });

  return entries;
};

const jsToBottomNoModule = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html) {
      html = html.replace(`type="module" crossorigin`, '');
      let scriptTag = html.match(/<script[^>]*>(.*?)<\/script[^>]*>/)[0];
      html = html.replace(scriptTag, '');
      html = html.replace('<!-- SCRIPT -->', scriptTag);
      return html;
    },
  };
};

const cssCrossOriginRemove = () => {
  return {
    name: 'css-cross-origin-remove',
    transformIndexHtml(html) {
      return html.replace(
        /(<link[^>]*rel=["']stylesheet["'][^>]*?)\s+crossorigin(?:=["'][^"']*["'])?/g,
        '$1'
      );
    },
  };
};

/**
 * URL Masker plugin
 * ─────────────────
 * Dev server behaviour:
 *  1. /*.html requests  → 301 redirect to the clean URL
 *  2. /digital-marketing-* requests → 301 redirect to the clean URL
 *  3. Clean URL requests (e.g. /web-development) → internally served from the right .html file
 */
const urlMasker = () => {
  return {
    name: 'url-masker',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [urlPath, query] = req.url.split('?');
        const qs = query ? '?' + query : '';

        // ── 0. Block login / signup — serve 404 page ─────────────────────
        const rawSlugCheck = urlPath
          .replace(/^\//, '')
          .replace(/\.html$/, '')
          .replace(/\/$/, '');
        if (BLOCKED_SLUGS.has(rawSlugCheck)) {
          req.url = '/404.html' + qs;
          return next();
        }

        // ── 1. Redirect explicit .html requests → clean URL ──────────────
        if (urlPath.endsWith('.html')) {
          const slug = urlPath.replace(/^\//, '').replace(/\.html$/, '');
          // Block login/signup .html requests too
          if (BLOCKED_SLUGS.has(slug)) {
            req.url = '/404.html' + qs;
            return next();
          }
          const cleanPath = URL_MAP[slug] || '/' + toCleanUrl(slug).replace(/^\//, '');
          res.writeHead(301, { Location: cleanPath + qs });
          res.end();
          return;
        }

        // ── 2. Redirect dirty /digital-marketing-* URLs → clean URL ──────
        const rawSlug = urlPath.replace(/^\//, '').replace(/\/$/, '');
        if (rawSlug.startsWith('digital-marketing') && URL_MAP[rawSlug]) {
          res.writeHead(301, { Location: URL_MAP[rawSlug] + qs });
          res.end();
          return;
        }

        // ── 3. Serve clean URL by rewriting to the right .html file ──────
        // Skip paths that already have a file extension (assets, images, etc.)
        if (path.extname(urlPath) !== '') return next();

        const normalised = urlPath.replace(/\/$/, '') || '/';

        // Homepage special case
        if (normalised === '/') {
          req.url = '/digital-marketing.html' + qs;
          return next();
        }

        // Direct reverse-map lookup  (e.g. /web-development → digital-marketing-web-development)
        if (REVERSE_MAP[normalised]) {
          req.url = `/${REVERSE_MAP[normalised]}.html${qs}`;
          return next();
        }

        // Fallback: check if the file exists as-is (non-digital-marketing pages)
        const candidate = normalised;
        const htmlPath = path.resolve(__dirname, `.${candidate}.html`);
        if (fs.existsSync(htmlPath)) {
          req.url = candidate + '.html' + qs;
        }

        next();
      });
    },
  };
};

const vendorMinifier = () => {
  return {
    name: 'vendor-minifier',
    async generateBundle(options, bundle) {
      const vendorDir = path.resolve(__dirname, 'dist/vendor');

      if (fs.existsSync(vendorDir)) {
        const vendorFiles = fs.readdirSync(vendorDir);

        for (const file of vendorFiles) {
          if (file.endsWith('.js')) {
            const filePath = path.join(vendorDir, file);
            const content = fs.readFileSync(filePath, 'utf8');

            try {
              const minified = await minify(content, {
                compress: {
                  drop_console: false,
                  drop_debugger: true,
                  pure_funcs: ['console.log'],
                  passes: 2,
                },
                mangle: {
                  toplevel: false,
                },
                format: {
                  comments: /@license|@preserve|@format|@version/i,
                },
                sourceMap: false,
              });

              fs.writeFileSync(filePath, minified.code);

              const originalSize = content.length;
              const minifiedSize = minified.code.length;
              const reduction = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);

              console.log(`✅ Minified vendor script: ${file} (${reduction}% smaller)`);
            } catch (error) {
              console.warn(`⚠️ Failed to minify ${file}:`, error.message);
              const basicMinified = content
                .replace(/\/\/(?!.*@license|.*@preserve|.*@format|.*@version).*$/gm, '')
                .replace(/\/\*[\s\S]*?\*\/(?!.*@license|.*@preserve|.*@format|.*@version)/g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
                .replace(/\s+$/gm, '')
                .replace(/^\s*[\r\n]/gm, '')
                .trim();

              fs.writeFileSync(filePath, basicMinified);
              console.log(`✅ Basic minified vendor script: ${file}`);
            }
          }
        }
      }
    },
  };
};

export default defineConfig({
  plugins: [
    urlMasker(),
    tailwindcss(),
    injectHTML({
      tagName: 'Component',
    }),
    jsToBottomNoModule(),
    cssCrossOriginRemove(),
    vendorMinifier(),
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        entryFileNames: 'assets/main.js',
        assetFileNames: (assetInfo) => {
          return `assets/${assetInfo.name || '[name].[ext]'}`;
        },
      },
    },
    minify: false,
    modulePreload: false,
    cssMinify: false,
    assetsDir: 'assets',
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  base: '/',
});
