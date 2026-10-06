import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_REGISTRY } from '../src/data/tools.ts';
import { CATEGORIES, CATEGORIES_LIST } from '../src/data/categories.ts';
import { GUIDES_REGISTRY } from '../src/data/guides.ts';
import { getPdfCompressorStaticHtml } from './pdfCompressorStaticContent.ts';
import { getImageCompressorStaticHtml } from './imageCompressorStaticContent.ts';
import { getTextCaseConverterStaticHtml } from './textCaseConverterStaticContent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

// Base URL: Strictly non-www HTTPS
const BASE_URL = 'https://rajtoolbox.com';

export type AssetManifest = {
  scripts: string[];
  styles: string[];
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Extract actual bundles and assets directly from dist/assets/ directory
function getViteAssets(): AssetManifest {
  const assetsDir = path.join(DIST_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`[Assets Error] dist/assets directory not found at ${assetsDir}! Please run vite build first.`);
  }

  const assetFiles = fs.readdirSync(assetsDir);

  // 1. Identify CSS files
  const cssFiles = assetFiles.filter((f) => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    throw new Error('[Assets Error] No CSS files found in dist/assets! Production build cannot be unstyled.');
  }

  // 2. Identify JS files
  const jsFiles = assetFiles.filter((f) => f.endsWith('.js'));
  if (jsFiles.length === 0) {
    throw new Error('[Assets Error] No JS files found in dist/assets! Production build requires React JS bundle.');
  }

  // Prioritize primary entry bundle (starts with index- or is main bundle)
  const entryJs = jsFiles.find((f) => f.startsWith('index-')) || jsFiles[0];
  const chunkJs = jsFiles.filter((f) => f !== entryJs);

  // Generate root-absolute URLs (starting with /assets/)
  const styles = cssFiles.map((file) => `<link rel="stylesheet" crossorigin href="/assets/${file}">`);
  const scripts = [
    `<script type="module" crossorigin src="/assets/${entryJs}"></script>`
  ];
  const preloads = chunkJs.map((file) => `<link rel="modulepreload" crossorigin href="/assets/${file}">`);

  console.log('[Assets Inspection]');
  console.log(`  CSS files detected (${cssFiles.length}):`, cssFiles.map((f) => `/assets/${f}`));
  console.log(`  Primary JS entry detected: /assets/${entryJs}`);
  if (chunkJs.length > 0) {
    console.log(`  Secondary JS chunks (${chunkJs.length}):`, chunkJs.map((f) => `/assets/${f}`));
  }

  return {
    scripts,
    styles: [...styles, ...preloads]
  };
}

// Generate shared header markup
function renderHeader(): string {
  return `
  <header class="sticky top-0 z-40 w-full border-b border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7]/95 dark:bg-[#0F0F12]/95 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="flex items-center justify-between h-16 w-full">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2 group text-left rounded-lg p-0.5" aria-label="RajToolBox Home">
          <svg viewBox="0 0 520 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8 md:h-9 w-auto" style="aspect-ratio: 520 / 100; overflow: visible;" aria-label="RajToolBox" role="img">
            <rect x="6" y="6" width="88" height="88" rx="24" fill="#EC4899" />
            <path d="M38 35 V28 C38 23 42 20 50 20 C58 20 62 23 62 28 V35" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />
            <rect x="18" y="35" width="64" height="12" rx="3.5" fill="#FFFFFF" />
            <path d="M19 49 H81 V69 C81 75 76 79 70 79 H30 C24 79 19 75 19 69 Z" fill="#FFFFFF" />
            <rect x="26" y="42" width="9" height="13" rx="2" fill="#FACC15" />
            <rect x="65" y="42" width="9" height="13" rx="2" fill="#FACC15" />
            <g transform="translate(48, 65) rotate(-38)">
              <rect x="-3" y="-1" width="6" height="17" rx="2.5" fill="#FACC15" />
              <path d="M-7.5 -1 C-8.5 -6 -5 -11 0 -11 C5 -11 8.5 -6 7.5 -1 C6.2 -3.5 3 -4.5 0 -4.5 C-3 -4.5 -6.2 -3.5 -7.5 -1 Z" fill="#FACC15" />
            </g>
            <text x="108" y="67" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="52" letter-spacing="-0.025em">
              <tspan fill="#18181B">Raj</tspan><tspan fill="#EC4899">ToolBox</tspan>
            </text>
          </svg>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          <a href="/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">Home</a>
          <a href="/tools/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">All Tools</a>
          <a href="/pdf-tools/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">PDF Tools</a>
          <a href="/image-tools/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">Image Tools</a>
          <a href="/developer-tools/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">Developer</a>
          <a href="/converters/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">Converters</a>
          <a href="/finance-calculators/" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#18181B] dark:text-[#D4D4D8] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E24]">Calculators</a>
        </nav>

        <!-- Right Quick Actions -->
        <div class="flex items-center gap-2">
          <a href="/tools/" class="px-3.5 py-1.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] transition-all shadow-xs">
            Browse All Tools
          </a>
        </div>
      </div>
    </div>
  </header>
  `;
}

// Generate shared footer markup
function renderFooter(): string {
  return `
  <footer class="w-full border-t border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121216] text-[#18181B] dark:text-[#E4E4E7] mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <!-- Brand Info -->
        <div class="lg:col-span-2 space-y-4">
          <a href="/" class="flex items-center gap-2" aria-label="RajToolBox Home">
            <svg viewBox="0 0 520 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-9 w-auto" style="aspect-ratio: 520 / 100;" aria-label="RajToolBox">
              <rect x="6" y="6" width="88" height="88" rx="24" fill="#EC4899" />
              <path d="M38 35 V28 C38 23 42 20 50 20 C58 20 62 23 62 28 V35" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />
              <rect x="18" y="35" width="64" height="12" rx="3.5" fill="#FFFFFF" />
              <path d="M19 49 H81 V69 C81 75 76 79 70 79 H30 C24 79 19 75 19 69 Z" fill="#FFFFFF" />
              <rect x="26" y="42" width="9" height="13" rx="2" fill="#FACC15" />
              <rect x="65" y="42" width="9" height="13" rx="2" fill="#FACC15" />
              <g transform="translate(48, 65) rotate(-38)">
                <rect x="-3" y="-1" width="6" height="17" rx="2.5" fill="#FACC15" />
                <path d="M-7.5 -1 C-8.5 -6 -5 -11 0 -11 C5 -11 8.5 -6 7.5 -1 C6.2 -3.5 3 -4.5 0 -4.5 C-3 -4.5 -6.2 -3.5 -7.5 -1 Z" fill="#FACC15" />
              </g>
              <text x="108" y="67" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="52" letter-spacing="-0.025em">
                <tspan fill="#18181B">Raj</tspan><tspan fill="#EC4899">ToolBox</tspan>
              </text>
            </svg>
          </a>
          <p class="text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-sm leading-relaxed">
            "Powerful Online Tools. Simple to Use."
          </p>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm leading-relaxed">
            Free, fast, and privacy-focused online tools created to simplify everyday digital work. All file processing, conversions, and math operations run locally in your browser.
          </p>
          <div class="pt-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <span>Contact: </span>
            <a href="mailto:rajtoolboxofficial@gmail.com" class="hover:text-[#EC4899] underline underline-offset-2">
              rajtoolboxofficial@gmail.com
            </a>
          </div>
        </div>

        <!-- Categories Column -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white mb-3">
            Core Categories
          </h4>
          <ul class="space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <li><a href="/pdf-tools/" class="hover:text-[#EC4899] transition-colors">PDF Tools</a></li>
            <li><a href="/image-tools/" class="hover:text-[#EC4899] transition-colors">Image Tools</a></li>
            <li><a href="/text-tools/" class="hover:text-[#EC4899] transition-colors">Text Tools</a></li>
            <li><a href="/developer-tools/" class="hover:text-[#EC4899] transition-colors">Developer Tools</a></li>
            <li><a href="/converters/" class="hover:text-[#EC4899] transition-colors">Converters</a></li>
            <li><a href="/finance-calculators/" class="hover:text-[#EC4899] transition-colors">Finance &amp; Calculators</a></li>
          </ul>
        </div>

        <!-- Popular Tools Column -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white mb-3">
            Popular Utilities
          </h4>
          <ul class="space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <li><a href="/tools/pdf-merger/" class="hover:text-[#EC4899] transition-colors">PDF Merger</a></li>
            <li><a href="/tools/image-compressor/" class="hover:text-[#EC4899] transition-colors">Image Compressor</a></li>
            <li><a href="/tools/image-resizer/" class="hover:text-[#EC4899] transition-colors">Image Resizer</a></li>
            <li><a href="/tools/word-counter/" class="hover:text-[#EC4899] transition-colors">Word Counter</a></li>
            <li><a href="/tools/json-formatter/" class="hover:text-[#EC4899] transition-colors">JSON Formatter</a></li>
            <li><a href="/tools/qr-code-generator/" class="hover:text-[#EC4899] transition-colors">QR Code Generator</a></li>
            <li><a href="/tools/age-calculator/" class="hover:text-[#EC4899] transition-colors">Age Calculator</a></li>
          </ul>
        </div>

        <!-- Platform & Legal -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white mb-3">
            Platform &amp; Legal
          </h4>
          <ul class="space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <li><a href="/about/" class="hover:text-[#EC4899] transition-colors">About RajToolBox</a></li>
            <li><a href="/contact/" class="hover:text-[#EC4899] transition-colors">Contact Us</a></li>
            <li><a href="/guides/" class="hover:text-[#EC4899] transition-colors">Tutorials &amp; Guides</a></li>
            <li><a href="/privacy-policy/" class="hover:text-[#EC4899] transition-colors">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions/" class="hover:text-[#EC4899] transition-colors">Terms of Service</a></li>
            <li><a href="/disclaimer/" class="hover:text-[#EC4899] transition-colors">Disclaimer</a></li>
            <li><a href="/copyright/" class="hover:text-[#EC4899] transition-colors">Copyright</a></li>
            <li><a href="/advertising-policy/" class="hover:text-[#EC4899] transition-colors">Advertising Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-[#E4E4E7] dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA] gap-4">
        <p>&copy; 2026 RajToolBox.com &middot; Created by Raj Singh Sengar (B.Sc. Physics). All rights reserved.</p>
        <p>100% In-Browser Local Processing &middot; No File Uploads &middot; High-Speed Utilities</p>
      </div>
    </div>
  </footer>
  `;
}

// Assemble full HTML document
function buildFullHtml({
  title,
  description,
  canonicalUrl,
  keywords,
  jsonLd,
  bodyContent,
  headAssets
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  jsonLd: object[];
  bodyContent: string;
  headAssets: AssetManifest;
}): string {
  const scriptsLd = jsonLd
    .map((obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`)
    .join('\n    ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="Raj Singh Sengar" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- OpenGraph Metadata -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="RajToolBox" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />

    <!-- Structured Data (JSON-LD) -->
    ${scriptsLd}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    ${headAssets.styles.join('\n    ')}
  </head>
  <body class="bg-[#FFFDF7] text-[#18181B] antialiased selection:bg-[#EC4899] selection:text-white min-h-screen">
    <div id="root">
      <div class="flex flex-col min-h-screen bg-[#FFFDF7] dark:bg-[#0F0F12] text-[#18181B] dark:text-[#F4F4F5]">
        ${renderHeader()}
        <main class="flex-1">
          ${bodyContent}
        </main>
        ${renderFooter()}
      </div>
    </div>
    ${headAssets.scripts.join('\n    ')}
  </body>
</html>`;
}

// 0. GENERATE HOMEPAGE (dist/index.html)
function generateHomePage(headAssets: AssetManifest): string {
  const title = 'RajToolBox – Powerful Online Tools. Simple to Use.';
  const description =
    'Free, fast, and secure browser-based tools for everyday work: PDF tools, image editors, text manipulation, developer utilities, unit converters, QR codes, and SEO generators.';
  const canonicalUrl = `${BASE_URL}/`;
  const keywords = 'online tools, pdf merger, image compressor, json formatter, qr code generator, unit converter, word counter, free web utilities';

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'RajToolBox',
      url: canonicalUrl,
      description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      creator: {
        '@type': 'Person',
        name: 'Raj Singh Sengar',
        jobTitle: 'Creator & Full-Stack Developer',
        alumniOf: 'B.Sc. Physics'
      }
    }
  ];

  // Categories Grid
  const categoriesGridHtml = CATEGORIES_LIST.map((cat) => {
    const tools = TOOLS_REGISTRY.filter((t) => t.category === cat.id);
    return `
    <a href="/${cat.slug}/" class="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold uppercase tracking-wider text-[#EC4899]">${escapeHtml(cat.shortName || cat.name)}</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] font-semibold border border-[#E4E4E7] dark:border-[#27272A]">${tools.length} Tools</span>
        </div>
        <h3 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">${escapeHtml(cat.name)}</h3>
        <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1.5 leading-relaxed line-clamp-2">${escapeHtml(cat.description)}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-[#F4F4F5] dark:border-[#202026] flex items-center justify-between text-xs text-[#EC4899] font-bold">
        <span>Explore Category</span>
        <span>&rarr;</span>
      </div>
    </a>`;
  }).join('\n');

  // Popular Tools Grid
  const popularToolsHtml = TOOLS_REGISTRY.filter((t) => t.popular).slice(0, 9).map((tool) => `
    <a href="/tools/${tool.slug}/" class="p-5 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#EC4899]">${escapeHtml(tool.category)}</span>
          <span class="text-[10px] font-semibold text-[#16A34A] dark:text-[#4ADE80]">Free &middot; Client Side</span>
        </div>
        <h4 class="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">${escapeHtml(tool.name)}</h4>
        <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 line-clamp-2">${escapeHtml(tool.shortDescription)}</p>
      </div>
      <div class="mt-3 pt-2.5 border-t border-[#F4F4F5] dark:border-[#202026] text-xs font-bold text-[#EC4899] flex items-center justify-between">
        <span>Open Tool</span>
        <span>&rarr;</span>
      </div>
    </a>
  `).join('\n');

  const bodyContent = `
  <div class="space-y-16 sm:space-y-24 pb-12">
    <!-- HERO SECTION -->
    <section class="relative pt-12 sm:pt-20 pb-16 border-b border-[#E4E4E7] dark:border-[#27272A] bg-gradient-to-b from-[#FFFDF7] to-white dark:from-[#0F0F12] dark:to-[#141418]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xs uppercase tracking-widest font-bold text-[#EC4899] mb-3">
          Client-Side Browser Utilities
        </p>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Powerful Online Tools. <br />
          <span class="text-[#EC4899]">Simple to Use.</span>
        </h1>
        <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] max-w-2xl mx-auto mt-4 leading-relaxed">
          Free, fast, and privacy-focused digital tools created to simplify everyday tasks. All file conversions, formatting, and mathematical calculations run securely inside your browser.
        </p>

        <!-- Search Bar Placeholder -->
        <div class="mt-8 max-w-xl mx-auto">
          <a href="/tools/" class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-sm hover:border-[#EC4899] text-left text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
            <span>Search 50+ tools (e.g., PDF Merger, Image Compressor, Age Calculator)...</span>
            <span class="px-2.5 py-1 rounded-lg bg-[#F4F4F5] dark:bg-[#202026] text-[11px] font-bold text-[#18181B] dark:text-white">Browse</span>
          </a>
        </div>

        <!-- Category Pills -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <a href="/pdf-tools/" class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899]">PDF Tools</a>
          <a href="/image-tools/" class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899]">Image Tools</a>
          <a href="/developer-tools/" class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899]">Developer Tools</a>
          <a href="/converters/" class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899]">Converters</a>
          <a href="/finance-calculators/" class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899]">Finance &amp; Calculators</a>
        </div>
      </div>
    </section>

    <!-- POPULAR TOOLS SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <span class="text-xs uppercase tracking-widest font-bold text-[#EC4899] block mb-1">Most Utilized</span>
          <h2 class="text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">Popular Online Tools</h2>
        </div>
        <a href="/tools/" class="text-xs font-bold text-[#EC4899] hover:underline">View All Tools &rarr;</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${popularToolsHtml}
      </div>
    </section>

    <!-- ALL 16 CATEGORIES SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-xs uppercase tracking-widest font-bold text-[#EC4899] block mb-1">Organized Directory</span>
        <h2 class="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5]">Browse by Category</h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">16 complete categories with at least 2 functional, browser-native tools each.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        ${categoriesGridHtml}
      </div>
    </section>

    <!-- TRUST & PRIVACY PILLARS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-8 sm:p-12 shadow-xs">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs uppercase tracking-widest font-bold text-[#EC4899] block mb-1">Privacy Architecture</span>
          <h2 class="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5]">Why Choose RajToolBox?</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div class="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#141416] border border-[#FACC15]/40">
            <h3 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">100% In-Browser &amp; Private</h3>
            <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">Your files, photos, passwords, and data never leave your computer. Everything processes locally via HTML5, Canvas, and WebAssembly.</p>
          </div>
          <div class="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#141416] border border-[#FACC15]/40">
            <h3 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">Physics &amp; Mathematical Rigor</h3>
            <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">Built by Raj Singh Sengar (B.Sc. Physics). Every calculation, loan formula, and converter constant is verified against exact standard formulas.</p>
          </div>
          <div class="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#141416] border border-[#FACC15]/40">
            <h3 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">Zero Paywalls &amp; Instant</h3>
            <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">No signups, no subscriptions, no fake countdowns, and no deceptive download buttons. Fast results ready in seconds.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CREATOR BOX -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div class="w-16 h-16 rounded-2xl bg-[#EC4899] text-white flex items-center justify-center font-bold text-xl shrink-0">RS</div>
        <div>
          <h3 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</h3>
          <span class="text-xs text-[#EC4899] font-semibold">B.Sc. Physics &middot; Creator of RajToolBox</span>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-2 leading-relaxed">
            "I created RajToolBox to provide honest, fast, and completely free online utilities. When you need to compress an image, merge PDF contracts, format JSON, or compute financial payments, you shouldn't have to upload your private files to unknown servers."
          </p>
        </div>
      </div>
    </section>
  </div>`;

  const html = buildFullHtml({
    title,
    description,
    canonicalUrl,
    keywords,
    jsonLd,
    bodyContent,
    headAssets
  });

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
  return '/';
}

// 1. GENERATE TOOL PAGES
function generateToolPages(headAssets: AssetManifest): string[] {
  const generatedRoutes: string[] = [];

  for (const tool of TOOLS_REGISTRY) {
    const category = CATEGORIES[tool.category];
    const categoryName = category?.name || tool.category;
    const categorySlug = category?.slug || tool.category;

    let title = `${tool.name} – Free Online Tool | RajToolBox`;
    let description = tool.shortDescription;
    const canonicalUrl = `${BASE_URL}/tools/${tool.slug}/`;
    const keywords = (tool.keywords || []).concat(['online tools', 'free tool', 'rajtoolbox']).join(', ');

    if (tool.slug === 'pdf-compressor') {
      title = 'PDF Compressor Online – Reduce PDF Size | RajToolBox';
      description =
        'Compress PDF files online with adjustable compression and target sizes. Preview the result, reduce PDF size, download and share easily with RajToolBox.';
    } else if (tool.slug === 'image-compressor') {
      title = 'Image Compressor Online – Reduce Image Size in KB | RajToolBox';
      description =
        'Compress JPG, PNG, and WebP images online with target size options (20KB, 50KB, 100KB, 200KB). Preview Before & After, reduce image size in KB, download and share 100% privately in-browser.';
    } else if (tool.slug === 'text-case-converter') {
      title = 'Text Case Converter – Uppercase, Lowercase, Title Case & More | RajToolBox';
      description =
        'Free online Text Case Converter to change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Clean spaces, line breaks and formatting instantly.';
    }

    // Structured data
    const jsonLd: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        url: canonicalUrl,
        description: tool.shortDescription,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        creator: {
          '@type': 'Person',
          name: 'Raj Singh Sengar',
          jobTitle: 'Creator & Full-Stack Developer',
          alumniOf: 'B.Sc. Physics'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryName,
            item: `${BASE_URL}/${categorySlug}/`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: canonicalUrl
          }
        ]
      }
    ];

    if (tool.faqs && tool.faqs.length > 0) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      });
    }

    // Related tools markup
    const relatedToolsHtml = (tool.relatedToolSlugs || [])
      .map((slug) => {
        const rel = TOOLS_REGISTRY.find((t) => t.slug === slug || t.id === slug);
        if (!rel) return '';
        return `
        <a href="/tools/${rel.slug}/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <h4 class="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">${escapeHtml(rel.name)}</h4>
            <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 line-clamp-2">${escapeHtml(rel.shortDescription)}</p>
          </div>
          <span class="text-xs font-semibold text-[#EC4899] mt-3 inline-flex items-center gap-1">Open Tool &rarr;</span>
        </a>`;
      })
      .filter(Boolean)
      .join('\n');

    // How to steps markup
    const howToStepsHtml = (tool.howToSteps || [])
      .map(
        (step) => `
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            ${step.step}
          </span>
          <div>
            <strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">${escapeHtml(step.title)}</strong>
            <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">${escapeHtml(step.instruction)}</p>
          </div>
        </li>`
      )
      .join('\n');

    // FAQs markup
    const faqsHtml = (tool.faqs || [])
      .map(
        (faq) => `
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-white dark:bg-[#18181B]">
          <h3 class="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">${escapeHtml(faq.question)}</h3>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">${escapeHtml(faq.answer)}</p>
        </div>`
      )
      .join('\n');

    // Formula markup (if exists)
    const formulaHtml = tool.formula
      ? `
      <section class="my-8 rounded-2xl border border-[#FACC15]/40 bg-[#FFFDF7] dark:bg-[#141416] p-6">
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">${escapeHtml(tool.formula.title)}</h2>
        <div class="p-3 bg-white dark:bg-[#1C1C22] rounded-xl font-mono text-sm text-[#EC4899] font-bold border border-[#E4E4E7] dark:border-[#27272A] mb-3">
          ${escapeHtml(tool.formula.formula)}
        </div>
        <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed mb-3">${escapeHtml(tool.formula.explanation)}</p>
        <div class="text-xs text-[#71717A] dark:text-[#A1A1AA] bg-white/50 dark:bg-black/20 p-3 rounded-lg">
          <strong>Worked Example: </strong>${escapeHtml(tool.formula.workedExample)}
        </div>
      </section>`
      : '';

    // Real life example markup
    const exampleHtml = tool.realLifeExample
      ? `
      <section class="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">Real-Life Example: ${escapeHtml(tool.realLifeExample.title)}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3">
          <div class="p-3 bg-[#FAFAFA] dark:bg-[#202026] rounded-xl">
            <strong class="text-[#71717A] block mb-1">Input Description:</strong>
            <p class="text-[#18181B] dark:text-[#D4D4D8]">${escapeHtml(tool.realLifeExample.inputDescription)}</p>
          </div>
          <div class="p-3 bg-[#FAFAFA] dark:bg-[#202026] rounded-xl">
            <strong class="text-[#71717A] block mb-1">Expected Output:</strong>
            <p class="text-[#18181B] dark:text-[#D4D4D8]">${escapeHtml(tool.realLifeExample.outputDescription)}</p>
          </div>
        </div>
      </section>`
      : '';

    // Body content
    const bodyContent =
      tool.slug === 'pdf-compressor'
        ? getPdfCompressorStaticHtml()
        : tool.slug === 'image-compressor'
        ? getImageCompressorStaticHtml()
        : tool.slug === 'text-case-converter'
        ? getTextCaseConverterStaticHtml()
        : `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6 flex-wrap" aria-label="Breadcrumb">
        <a href="/" class="hover:text-[#EC4899] font-medium">Home</a>
        <span aria-hidden="true">&rarr;</span>
        <a href="/${categorySlug}/" class="hover:text-[#EC4899] font-medium">${escapeHtml(categoryName)}</a>
        <span aria-hidden="true">&rarr;</span>
        <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">${escapeHtml(tool.name)}</span>
      </nav>

      <!-- Tool Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
          <a href="/${categorySlug}/" class="font-semibold text-[#EC4899] hover:underline">${escapeHtml(categoryName)}</a>
          <span aria-hidden="true">&middot;</span>
          <span class="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            100% In-Browser &amp; Private
          </span>
          <span aria-hidden="true">&middot;</span>
          <span class="inline-flex items-center gap-1 font-medium text-[#854D0E] dark:text-[#FACC15]">
            Client Side Execution
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
          ${escapeHtml(tool.name)}
        </h1>

        <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
          ${escapeHtml(tool.shortDescription)}
        </p>
      </div>

      <!-- Interactive Tool Container (Hydrated by React on client load) -->
      <div id="interactive-tool-host" class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-sm p-6 sm:p-8 mb-10 min-h-[280px] flex flex-col justify-center items-center text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] mb-3">
          <svg class="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">Interactive ${escapeHtml(tool.name)}</h2>
        <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 max-w-md">Initializing high-speed client-side tools engine...</p>
        <noscript>
          <div class="mt-4 p-4 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs font-medium max-w-md">
            JavaScript is disabled in your browser. Enable JavaScript to interact directly with this tool.
          </div>
        </noscript>
      </div>

      <!-- How to Use Section -->
      <section class="my-8 rounded-2xl border border-[#FACC15]/40 bg-[#FFFDF7] dark:bg-[#151519] p-6 shadow-xs">
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-4">
          How to Use ${escapeHtml(tool.name)}
        </h2>
        <ol class="space-y-3">
          ${howToStepsHtml}
        </ol>
      </section>

      <!-- Real Life Example -->
      ${exampleHtml}

      <!-- What is this tool? -->
      <section class="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
          What is ${escapeHtml(tool.name)}?
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          ${escapeHtml(tool.fullDescription)}
        </p>
      </section>

      <!-- How Does It Work? -->
      <section class="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
          How Does ${escapeHtml(tool.name)} Work?
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          ${escapeHtml(tool.howItWorks)}
        </p>
      </section>

      <!-- Formula Section -->
      ${formulaHtml}

      <!-- Frequently Asked Questions -->
      ${
        tool.faqs && tool.faqs.length > 0
          ? `
      <section class="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-4">
          Frequently Asked Questions
        </h2>
        <div class="space-y-3">
          ${faqsHtml}
        </div>
      </section>`
          : ''
      }

      <!-- Related Tools -->
      ${
        relatedToolsHtml
          ? `
      <section class="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] p-6">
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-4">
          Related Tools You Might Need
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${relatedToolsHtml}
        </div>
      </section>`
          : ''
      }

      <!-- Creator Information -->
      <div class="mt-8 p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-[#EC4899] text-white flex items-center justify-center font-bold text-sm">
            RS
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</h3>
            <span class="text-xs text-[#EC4899] font-medium">B.Sc. Physics &middot; Creator of RajToolBox</span>
          </div>
        </div>
        <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Engineered with scientific accuracy and browser-native performance. All processing executes securely inside your local machine without remote server dependencies.
        </p>
      </div>
    </div>
    `;

    const html = buildFullHtml({
      title,
      description,
      canonicalUrl,
      keywords,
      jsonLd,
      bodyContent,
      headAssets
    });

    const toolDir = path.join(DIST_DIR, 'tools', tool.slug);
    ensureDir(toolDir);
    fs.writeFileSync(path.join(toolDir, 'index.html'), html, 'utf8');

    generatedRoutes.push(`/tools/${tool.slug}/`);
  }

  return generatedRoutes;
}

// 2. GENERATE CATEGORY PAGES
function generateCategoryPages(headAssets: AssetManifest): string[] {
  const generatedRoutes: string[] = [];

  for (const cat of CATEGORIES_LIST) {
    const categoryTools = TOOLS_REGISTRY.filter((t) => t.category === cat.id);
    const title = `${cat.name} – Free Online Utilities & Tools | RajToolBox`;
    const description = cat.description;
    const canonicalUrl = `${BASE_URL}/${cat.slug}/`;
    const keywords = `${cat.name}, online tools, free web utilities, rajtoolbox`;

    const jsonLd: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: cat.name,
        url: canonicalUrl,
        description: cat.description,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${BASE_URL}/`
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: cat.name,
              item: canonicalUrl
            }
          ]
        }
      }
    ];

    const toolsGridHtml = categoryTools
      .map(
        (tool) => `
      <a href="/tools/${tool.slug}/" class="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] dark:hover:border-[#EC4899] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] uppercase font-bold text-[#EC4899] tracking-wider">${escapeHtml(cat.shortName || cat.name)}</span>
            <span class="text-[10px] font-medium text-[#16A34A] dark:text-[#4ADE80]">Free &middot; Client Side</span>
          </div>
          <h3 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">${escapeHtml(tool.name)}</h3>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1.5 leading-relaxed line-clamp-3">${escapeHtml(tool.shortDescription)}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-[#F4F4F5] dark:border-[#202026] flex items-center justify-between text-xs text-[#EC4899] font-bold">
          <span>Open Tool</span>
          <span>&rarr;</span>
        </div>
      </a>`
      )
      .join('\n');

    const bodyContent = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6" aria-label="Breadcrumb">
        <a href="/" class="hover:text-[#EC4899]">Home</a>
        <span aria-hidden="true">&rarr;</span>
        <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">${escapeHtml(cat.name)}</span>
      </nav>

      <!-- Category Hero -->
      <div class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 mb-10 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="max-w-2xl">
            <span class="text-xs font-bold uppercase tracking-wider text-[#EC4899] block mb-2">Category Collection</span>
            <h1 class="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
              ${escapeHtml(cat.name)}
            </h1>
            <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 leading-relaxed">
              ${escapeHtml(cat.description)}
            </p>
          </div>
          <div class="shrink-0 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
            <span class="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">Available Tools</span>
            <div class="text-3xl font-black text-[#EC4899] mt-0.5">${categoryTools.length}</div>
            <span class="text-[10px] text-[#71717A]">Ready to use</span>
          </div>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="mb-14">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
            ${escapeHtml(cat.name)} Utilities (${categoryTools.length})
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${toolsGridHtml}
        </div>
      </div>

      <!-- Category FAQ -->
      <section class="border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl bg-white dark:bg-[#18181B] p-6 sm:p-8">
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-4">
          About ${escapeHtml(cat.name)} on RajToolBox
        </h2>
        <div class="space-y-4 text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <p>
            All utilities in the <strong>${escapeHtml(cat.name)}</strong> category are engineered to execute directly inside your browser. No file data, sensitive text, or configuration settings are ever transmitted or stored on an external server.
          </p>
          <p>
            Whether you are working from a phone, tablet, laptop, or desktop workstation, RajToolBox tools provide maximum responsiveness, zero ads blocking your actions, and 100% free accessibility.
          </p>
        </div>
      </section>
    </div>
    `;

    const html = buildFullHtml({
      title,
      description,
      canonicalUrl,
      keywords,
      jsonLd,
      bodyContent,
      headAssets
    });

    const catDir = path.join(DIST_DIR, cat.slug);
    ensureDir(catDir);
    fs.writeFileSync(path.join(catDir, 'index.html'), html, 'utf8');

    generatedRoutes.push(`/${cat.slug}/`);
  }

  return generatedRoutes;
}

// 3. GENERATE ALL TOOLS PAGE
function generateAllToolsPage(headAssets: AssetManifest): string {
  const title = `All Online Tools – Free Browser Utilities | RajToolBox`;
  const description = `Explore all ${TOOLS_REGISTRY.length} free, fast, and secure online tools across ${CATEGORIES_LIST.length} categories on RajToolBox. High-speed local browser processing.`;
  const canonicalUrl = `${BASE_URL}/tools/`;
  const keywords = `all online tools, free tools directory, rajtoolbox utilities, pdf image developer converter tools`;

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'All Online Tools',
      url: canonicalUrl,
      description
    }
  ];

  const toolsByCategoryHtml = CATEGORIES_LIST.map((cat) => {
    const tools = TOOLS_REGISTRY.filter((t) => t.category === cat.id);
    const toolLinks = tools
      .map(
        (t) => `
      <a href="/tools/${t.slug}/" class="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
        <h4 class="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors truncate">${escapeHtml(t.name)}</h4>
        <p class="text-[11px] text-[#71717A] dark:text-[#A1A1AA] line-clamp-2 mt-1">${escapeHtml(t.shortDescription)}</p>
      </a>`
      )
      .join('\n');

    return `
    <div class="mb-10">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div class="flex items-center gap-2">
          <a href="/${cat.slug}/" class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] transition-colors">${escapeHtml(cat.name)}</a>
          <span class="text-xs px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold">${tools.length}</span>
        </div>
        <a href="/${cat.slug}/" class="text-xs font-semibold text-[#EC4899] hover:underline">View Category &rarr;</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${toolLinks}
      </div>
    </div>`;
  }).join('\n');

  const bodyContent = `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <span class="text-xs uppercase tracking-widest font-bold text-[#EC4899] mb-2 block">Full Tool Registry</span>
      <h1 class="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
        Explore All Online Tools
      </h1>
      <p class="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">
        Discover ${TOOLS_REGISTRY.length} free, high-speed tools across ${CATEGORIES_LIST.length} categories. All running directly in your browser.
      </p>
    </div>

    <div class="mt-8">
      ${toolsByCategoryHtml}
    </div>
  </div>`;

  const html = buildFullHtml({
    title,
    description,
    canonicalUrl,
    keywords,
    jsonLd,
    bodyContent,
    headAssets
  });

  const toolsDir = path.join(DIST_DIR, 'tools');
  ensureDir(toolsDir);
  fs.writeFileSync(path.join(toolsDir, 'index.html'), html, 'utf8');

  return '/tools/';
}

// 4. GENERATE STATIC PAGES (About, Contact, Guides, Privacy, Terms, Disclaimer, Copyright, Ads)
function generateStaticPages(headAssets: AssetManifest): string[] {
  const staticPages = [
    {
      slug: 'about',
      title: 'About RajToolBox – Platform & Creator',
      description: 'Learn about RajToolBox and its creator Raj Singh Sengar (B.Sc. Physics). Dedicated to high-speed, private, browser-based online tools.',
      h1: 'About RajToolBox',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>
          <strong class="text-[#18181B] dark:text-[#F4F4F5]">RajToolBox</strong> is an independent digital tools platform created by <strong class="text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</strong> to provide practical, accessible, and fast online utilities for everyday digital workflows.
        </p>
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">Our Philosophy & Purpose</h2>
        <p>
          Everyday users, students, developers, and creators frequently encounter repetitive digital challenges: combining PDF invoices, resizing graphics, formatting JSON responses, converting measurement units, or computing percentages. Many websites surround these tasks with misleading download buttons, invasive trackers, or artificial waiting delays.
        </p>
        <p>
          RajToolBox was founded on the principle that online tools should be <em>fast, honest, and truly functional</em>. If a button says "Download", it downloads the exact processed file immediately. If a calculator is given numbers, it computes the mathematically correct result without obfuscation.
        </p>
        <h2 class="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">Privacy by Architecture</h2>
        <p>
          User privacy is a structural design requirement, not an afterthought. Wherever technically feasible, all processing—such as PDF merging, image compression, string manipulation, and cryptographic hashing—takes place completely inside your local web browser. Your confidential files, photos, and passwords never leave your hardware.
        </p>
        <div class="mt-8 p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/50">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-[#EC4899] text-white flex items-center justify-center font-bold text-lg">RS</div>
            <div>
              <h3 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</h3>
              <span class="text-xs text-[#EC4899] font-semibold">B.Sc. Physics &middot; Founder & Creator</span>
            </div>
          </div>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            Raj Singh Sengar is the creator of RajToolBox, a practical online tools platform focused on building simple, useful and accessible digital utilities for everyday users. With a background in physics, Raj brings mathematical rigor, clean logic, and respect for user time to every tool built.
          </p>
        </div>
      </div>`
    },
    {
      slug: 'contact',
      title: 'Contact RajToolBox – Feedback & Inquiries',
      description: 'Contact RajToolBox and creator Raj Singh Sengar. Send tool requests, bug reports, and partnership inquiries to rajtoolboxofficial@gmail.com.',
      h1: 'Contact RajToolBox',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>We welcome your questions, tool suggestions, bug reports, and feedback. Feel free to contact us directly:</p>
        <div class="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">Direct Official Email</h2>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">For all inquiries, tool suggestions, bug reports, and business communications:</p>
          <a href="mailto:rajtoolboxofficial@gmail.com" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777]">
            rajtoolboxofficial@gmail.com
          </a>
        </div>
        <p class="text-xs text-[#71717A]">Average response time is within 24 to 48 hours on business days.</p>
      </div>`
    },
    {
      slug: 'guides',
      title: 'Tutorials & Guides – RajToolBox Knowledge Base',
      description: 'Practical walkthroughs, mathematical formulas, and best practices for browser-native digital tools, PDF merging, image compression, and calculations.',
      h1: 'RajToolBox Guides & Tutorials',
      content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${GUIDES_REGISTRY.map(
          (g) => `
        <div class="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2 text-xs text-[#EC4899] font-bold">
              <span>${escapeHtml(g.category)}</span>
              <span>&middot;</span>
              <span class="text-[#71717A] font-normal">${escapeHtml(g.readTime)}</span>
            </div>
            <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">${escapeHtml(g.title)}</h2>
            <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">${escapeHtml(g.description)}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A]">
            <a href="/tools/${g.targetSlug}/" class="text-xs font-semibold text-[#EC4899] hover:underline inline-flex items-center gap-1">
              Open Related Tool &rarr;
            </a>
          </div>
        </div>`
        ).join('\n')}
      </div>`
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy – RajToolBox',
      description: 'Privacy Policy for RajToolBox. Learn how our client-side architecture guarantees your files and data never leave your browser.',
      h1: 'Privacy Policy',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p class="text-xs text-[#71717A]">Effective Date: October 2026 &middot; RajToolBox.com</p>
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">1. Core Privacy Architecture: In-Browser Execution</h2>
        <p>
          At RajToolBox, user privacy is our core engineering priority. Unlike traditional online converters and PDF services that require you to upload confidential files to third-party cloud servers, our utilities run <strong>locally inside your web browser</strong> using modern WebAssembly, Canvas, and Web Cryptography APIs.
        </p>
        <p>
          Your PDF documents, images, text snippets, and passwords are processed entirely in your device's memory and are never uploaded, stored, or viewed by RajToolBox.
        </p>
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">2. Local Storage</h2>
        <p>
          RajToolBox utilizes browser <code>localStorage</code> strictly for convenience features such as saving your favorite tools, theme preference (light/dark mode), and recent tool history. This data never leaves your computer and can be cleared at any time via your browser settings.
        </p>
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">3. Contact & Inquiries</h2>
        <p>
          If you have questions regarding this Privacy Policy, you may contact us directly at <a href="mailto:rajtoolboxofficial@gmail.com" class="text-[#EC4899] underline">rajtoolboxofficial@gmail.com</a>.
        </p>
      </div>`
    },
    {
      slug: 'terms-and-conditions',
      title: 'Terms of Service – RajToolBox',
      description: 'Terms of service and usage conditions for RajToolBox free online utilities and tools.',
      h1: 'Terms and Conditions',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p class="text-xs text-[#71717A]">Effective Date: October 2026 &middot; RajToolBox.com</p>
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">1. Acceptance of Terms</h2>
        <p>
          By accessing and utilizing RajToolBox (rajtoolbox.com), you acknowledge and agree to comply with these Terms and Conditions.
        </p>
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">2. Permitted Use</h2>
        <p>
          All utilities, tools, and calculators on RajToolBox are provided free of charge for personal, educational, and commercial workflows. You agree not to attempt to disrupt or impair the service or execute automated scraping attacks.
        </p>
        <h2 class="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">3. Contact</h2>
        <p>
          For questions regarding these Terms, contact us at <a href="mailto:rajtoolboxofficial@gmail.com" class="text-[#EC4899] underline">rajtoolboxofficial@gmail.com</a>.
        </p>
      </div>`
    },
    {
      slug: 'disclaimer',
      title: 'Disclaimer – RajToolBox',
      description: 'Mathematical, operational, and calculation disclaimer for RajToolBox utilities.',
      h1: 'Operational & Calculation Disclaimer',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>
          RajToolBox provides mathematical calculators, converters, and digital utilities for informational and productivity purposes. While algorithms are rigorously designed with physics and mathematical principles, results are provided without warranty.
        </p>
        <p>
          Always verify critical calculations independently with professional certified sources before making binding financial, structural, or legal commitments. For questions or corrections, contact <a href="mailto:rajtoolboxofficial@gmail.com" class="text-[#EC4899] underline">rajtoolboxofficial@gmail.com</a>.
        </p>
      </div>`
    },
    {
      slug: 'copyright',
      title: 'Copyright Notice – RajToolBox',
      description: 'Intellectual property and copyright notices for RajToolBox platform and brand.',
      h1: 'Copyright & Intellectual Property',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>
          &copy; 2026 RajToolBox.com. All rights reserved. The RajToolBox brand, design, custom SVG logos, and curated tool documentation are the intellectual property of Raj Singh Sengar.
        </p>
        <p>
          For licensing inquiries, reach out to <a href="mailto:rajtoolboxofficial@gmail.com" class="text-[#EC4899] underline">rajtoolboxofficial@gmail.com</a>.
        </p>
      </div>`
    },
    {
      slug: 'advertising-policy',
      title: 'Advertising Policy – RajToolBox',
      description: 'Transparent advertising standards and deceptive-practice prevention policy of RajToolBox.',
      h1: 'Advertising & Standards Policy',
      content: `
      <div class="space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>
          RajToolBox adheres to strict advertising integrity:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-xs">
          <li>No fake download buttons or deceptive banner graphics designed to mislead users.</li>
          <li>No pop-ups, pop-unders, or intrusive audio units that interrupt tool functionality.</li>
          <li>No sponsored malware or unverified software distribution.</li>
        </ul>
        <p class="pt-2">
          For advertising partnerships or reporting problematic ad units, email <a href="mailto:rajtoolboxofficial@gmail.com" class="text-[#EC4899] underline">rajtoolboxofficial@gmail.com</a>.
        </p>
      </div>`
    }
  ];

  const generatedRoutes: string[] = [];

  for (const page of staticPages) {
    const canonicalUrl = `${BASE_URL}/${page.slug}/`;
    const jsonLd: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.h1,
        url: canonicalUrl,
        description: page.description
      }
    ];

    const bodyContent = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6" aria-label="Breadcrumb">
        <a href="/" class="hover:text-[#EC4899]">Home</a>
        <span aria-hidden="true">&rarr;</span>
        <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">${escapeHtml(page.h1)}</span>
      </nav>

      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-xs font-bold uppercase tracking-wider text-[#EC4899] block mb-1">RajToolBox Official</span>
        <h1 class="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
          ${escapeHtml(page.h1)}
        </h1>
        <p class="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">
          "Powerful Online Tools. Simple to Use."
        </p>
      </div>

      <div class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs">
        ${page.content}
      </div>
    </div>`;

    const html = buildFullHtml({
      title: page.title,
      description: page.description,
      canonicalUrl,
      keywords: 'rajtoolbox, online tools, free web tools',
      jsonLd,
      bodyContent,
      headAssets
    });

    const pageDir = path.join(DIST_DIR, page.slug);
    ensureDir(pageDir);
    fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');

    generatedRoutes.push(`/${page.slug}/`);
  }

  return generatedRoutes;
}

// 5. GENERATE 404 PAGE (dist/404.html)
function generate404Page(headAssets: AssetManifest) {
  const title = `404 – Page Not Found | RajToolBox`;
  const description = `The tool or page you requested could not be found on RajToolBox. Explore 50+ free online tools for PDF, images, text, and calculations.`;
  const canonicalUrl = `${BASE_URL}/404.html`;

  const bodyContent = `
  <div class="max-w-xl mx-auto px-4 py-20 text-center">
    <div class="w-16 h-16 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-4 font-black text-2xl">
      404
    </div>
    <h1 class="text-3xl font-black text-[#18181B] dark:text-[#F4F4F5]">Tool Not Found</h1>
    <p class="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2 mb-6">
      The tool or page you requested does not exist or has been relocated.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <a href="/" class="px-5 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]">
        Go Home
      </a>
      <a href="/tools/" class="px-5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]">
        Browse All Tools
      </a>
    </div>

    <div class="mt-12 pt-8 border-t border-[#E4E4E7] dark:border-[#27272A] text-left">
      <span class="text-xs font-bold uppercase tracking-wider text-[#71717A] block mb-3">
        Popular Tools You Might Need:
      </span>
      <div class="grid grid-cols-2 gap-2">
        <a href="/tools/pdf-merger/" class="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] p-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#202026]">&bull; PDF Merger</a>
        <a href="/tools/image-compressor/" class="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] p-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#202026]">&bull; Image Compressor</a>
        <a href="/tools/word-counter/" class="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] p-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#202026]">&bull; Word Counter</a>
        <a href="/tools/age-calculator/" class="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] p-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#202026]">&bull; Age Calculator</a>
      </div>
    </div>
  </div>`;

  const html = buildFullHtml({
    title,
    description,
    canonicalUrl,
    keywords: '404 not found, rajtoolbox',
    jsonLd: [],
    bodyContent,
    headAssets
  });

  fs.writeFileSync(path.join(DIST_DIR, '404.html'), html, 'utf8');
}

// 6. GENERATE SITEMAP.XML
function generateSitemap(allRoutes: string[]) {
  const uniqueRoutes = Array.from(new Set(allRoutes));

  const urlsXml = uniqueRoutes
    .map((route) => {
      let priority = '0.8';
      let changefreq = 'weekly';

      if (route === '/') {
        priority = '1.0';
        changefreq = 'daily';
      } else if (route === '/tools/') {
        priority = '0.9';
        changefreq = 'daily';
      } else if (route.startsWith('/tools/')) {
        priority = '0.8';
        changefreq = 'weekly';
      } else if (CATEGORIES_LIST.some((c) => `/${c.slug}/` === route)) {
        priority = '0.8';
        changefreq = 'weekly';
      } else {
        priority = '0.6';
        changefreq = 'monthly';
      }

      return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(`[Sitemap] Generated with ${uniqueRoutes.length} validated URLs.`);
}

// MAIN BUILD EXECUTION
function main() {
  console.log('=== RajToolBox Static Page & SEO Generator ===');

  const headAssets = getViteAssets();
  console.log('[Assets] Found Vite bundled scripts and styles.');

  // Collect all generated routes
  const allRoutes: string[] = [];

  // 0. Homepage (dist/index.html)
  const homeRoute = generateHomePage(headAssets);
  allRoutes.push(homeRoute);
  console.log(`[Homepage] Pre-rendered SEO content into dist/index.html`);

  // 1. Tool Pages
  const toolRoutes = generateToolPages(headAssets);
  allRoutes.push(...toolRoutes);
  console.log(`[Tool Pages] Generated ${toolRoutes.length} tool pages inside dist/tools/<slug>/index.html`);

  // 2. Category Pages
  const categoryRoutes = generateCategoryPages(headAssets);
  allRoutes.push(...categoryRoutes);
  console.log(`[Category Pages] Generated ${categoryRoutes.length} category pages inside dist/<slug>/index.html`);

  // 3. All Tools Page
  const allToolsRoute = generateAllToolsPage(headAssets);
  allRoutes.push(allToolsRoute);
  console.log(`[All Tools] Generated dist/tools/index.html`);

  // 4. Static Pages
  const staticRoutes = generateStaticPages(headAssets);
  allRoutes.push(...staticRoutes);
  console.log(`[Static Pages] Generated ${staticRoutes.length} static pages.`);

  // 5. 404 Page
  generate404Page(headAssets);
  console.log(`[404 Page] Generated dist/404.html`);

  // 6. Sitemap
  generateSitemap(allRoutes);

  // 7. Validation: Verify physical existence of multiple examples in dist/
  console.log('\n--- Physical Verification of Output Files ---');
  const sampleSlugs = [
    'pdf-merger',
    'image-compressor',
    'image-resizer',
    'word-counter',
    'json-formatter',
    'qr-code-generator',
    'universal-unit-converter',
    'age-calculator',
    'percentage-calculator',
    'loan-emi-calculator'
  ];

  for (const slug of sampleSlugs) {
    const filePath = path.join(DIST_DIR, 'tools', slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      throw new Error(`CRITICAL ERROR: Generated file missing at ${filePath}`);
    }
    const stat = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const hasCanonical = content.includes(`https://rajtoolbox.com/tools/${slug}/`);
    const hasH1 = content.includes('<h1');
    const hasAssets = content.includes('/assets/index-');
    console.log(`  &check; dist/tools/${slug}/index.html (${stat.size} bytes) - Canonical: ${hasCanonical}, H1: ${hasH1}, Assets: ${hasAssets}`);
  }

  // Verify categories
  const sampleCats = ['pdf-tools', 'image-tools', 'developer-tools', 'converters', 'finance-calculators'];
  for (const cat of sampleCats) {
    const filePath = path.join(DIST_DIR, cat, 'index.html');
    if (!fs.existsSync(filePath)) {
      throw new Error(`CRITICAL ERROR: Generated category file missing at ${filePath}`);
    }
    console.log(`  &check; dist/${cat}/index.html exists.`);
  }

  // Verify sitemap and robots
  if (!fs.existsSync(path.join(DIST_DIR, 'sitemap.xml'))) {
    throw new Error('CRITICAL ERROR: dist/sitemap.xml is missing!');
  }
  if (!fs.existsSync(path.join(DIST_DIR, 'robots.txt'))) {
    // Copy public/robots.txt if not in dist
    fs.copyFileSync(path.join(PUBLIC_DIR, 'robots.txt'), path.join(DIST_DIR, 'robots.txt'));
  }
  console.log('  &check; dist/sitemap.xml and dist/robots.txt verified.');

  console.log('\n=== All Static Pages Successfully Built & Verified! ===');
}

main();
