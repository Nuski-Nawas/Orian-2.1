import fs from "fs";
import path from "path";

const rootDir = process.cwd();

const excludeFiles = new Set([
  "index.html",
  "404.html",
]);

const pageSuffixes = [
  "about",
  "affiliate",
  "affiliate-policy",
  "affiliates",
  "analytics",
  "blog",
  "blog-details",
  "brandkit",
  "career",
  "career-details",
  "case-study",
  "case-study-details",
  "case-studies-details",
  "changelog",
  "contact",
  "contact-us",
  "customer",
  "customer-details",
  "customers",
  "customers-details",
  "documentation",
  "download",
  "faq",
  "features",
  "gdpr",
  "glossary",
  "glossary-details",
  "integration",
  "learn",
  "legal",
  "legal-notice",
  "login",
  "our-manifesto",
  "manifesto",
  "menifesto",
  "partner-policy",
  "partners",
  "press",
  "pricing",
  "privacy",
  "privacy-policy",
  "process",
  "products",
  "refaral-program",
  "referral-program",
  "refund",
  "refund-policy",
  "security",
  "service-details",
  "services",
  "sign-up",
  "signup",
  "success-stories",
  "support",
  "team",
  "team-details",
  "terms",
  "terms-and-condition",
  "terms-conditions",
  "tutorial",
  "use-case",
  "use-cases",
  "whitepaper",
  "whitepaper-details",
  "why",
  "why-choose-us",
];

function isMainThemePage(filename) {
  if (!filename.endsWith(".html")) return false;
  if (excludeFiles.has(filename)) return false;

  const base = filename.replace(/\.html$/, "");

  for (const suffix of pageSuffixes) {
    if (base.endsWith(`-${suffix}`)) {
      return false;
    }
  }

  return true;
}

function formatThemeName(slug) {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const files = fs.readdirSync(rootDir);

const themes = files
  .filter(isMainThemePage)
  .map(file => {
    const slug = file.replace(/\.html$/, "");
    return {
      file,
      slug,
      name: formatThemeName(slug),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Theme Index</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #111827;
      --card-hover: #1f2937;
      --text: #f8fafc;
      --muted: #94a3b8;
      --border: rgba(255,255,255,0.08);
      --accent: #38bdf8;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      background:
        radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 30%),
        var(--bg);
      color: var(--text);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 20px 64px;
    }

    h1 {
      margin: 0 0 12px;
      font-size: 40px;
      line-height: 1.1;
    }

    p {
      margin: 0;
      color: var(--muted);
      font-size: 16px;
    }

    .topbar {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: space-between;
      align-items: center;
      margin: 32px 0 28px;
    }

    .search {
      width: 100%;
      max-width: 360px;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.04);
      color: var(--text);
      outline: none;
      font-size: 15px;
    }

    .meta {
      color: var(--muted);
      font-size: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .card {
      display: block;
      text-decoration: none;
      color: inherit;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px;
      transition: 0.2s ease;
    }

    .card:hover {
      transform: translateY(-3px);
      background: var(--card-hover);
      border-color: rgba(56,189,248,0.35);
    }

    .card h3 {
      margin: 0 0 10px;
      font-size: 18px;
      line-height: 1.35;
    }

    .file {
      color: var(--accent);
      font-size: 14px;
      word-break: break-word;
    }

    .empty {
      display: none;
      margin-top: 24px;
      color: var(--muted);
      font-size: 15px;
    }

    footer {
      margin-top: 40px;
      color: var(--muted);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>All Theme Main Pages</h1>
    <p>Browse the main landing page for every theme in this project.</p>

    <div class="topbar">
      <input id="searchInput" class="search" type="text" placeholder="Search themes..." />
      <div class="meta"><span id="themeCount">${themes.length}</span> themes found</div>
    </div>

    <div id="themeGrid" class="grid">
      ${themes.map(theme => `
        <a class="card" href="./${theme.file}">
          <h3>${theme.name}</h3>
          <div class="file">${theme.file}</div>
        </a>
      `).join("")}
    </div>

    <div id="emptyState" class="empty">No themes match your search.</div>

    <footer>
      Generated automatically from HTML files in the project root.
    </footer>
  </div>

  <script>
    const input = document.getElementById("searchInput");
    const cards = Array.from(document.querySelectorAll(".card"));
    const count = document.getElementById("themeCount");
    const emptyState = document.getElementById("emptyState");

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = text.includes(query);
        card.style.display = match ? "block" : "none";
        if (match) visible++;
      });

      count.textContent = visible;
      emptyState.style.display = visible === 0 ? "block" : "none";
    });
  </script>
</body>
</html>`;

const outputFile = path.join(rootDir, "themes-index.html");
fs.writeFileSync(outputFile, html, "utf8");

console.log(`✅ Generated: ${outputFile}`);
console.log(`📄 Total themes: ${themes.length}`);