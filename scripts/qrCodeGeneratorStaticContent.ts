export function getQrCodeGeneratorStaticHtml(): string {
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 1. BREADCRUMB -->
    <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6 flex-wrap" aria-label="Breadcrumb">
      <a href="/" class="hover:text-[#EC4899] font-medium">Home</a>
      <span aria-hidden="true">&rarr;</span>
      <a href="/qr-barcode-tools/" class="hover:text-[#EC4899] font-medium">QR &amp; Barcode Tools</a>
      <span aria-hidden="true">&rarr;</span>
      <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">QR Code Generator</span>
    </nav>

    <!-- 2. H1 & INTRO -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
        <a href="/qr-barcode-tools/" class="font-semibold text-[#EC4899] hover:underline">QR &amp; Barcode Tools</a>
        <span aria-hidden="true">&bull;</span>
        <span class="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
          100% In-Browser &amp; Private
        </span>
        <span aria-hidden="true">&bull;</span>
        <span class="inline-flex items-center gap-1 font-medium text-[#854D0E] dark:text-[#FACC15]">
          ISO/IEC 18004 Standard
        </span>
        <span aria-hidden="true">&bull;</span>
        <span class="inline-flex items-center gap-1 font-medium text-[#2563EB]">
          Zero Server Uploads
        </span>
      </div>

      <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
        QR Code Generator – Free Online QR Code Maker
      </h1>

      <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
        Create custom high-resolution QR codes for websites, plain text, Wi-Fi networks, vCard contacts, UPI payments, email, and phone calls. Customize colors, embed your logo with High Error Correction, and download crisp PNG or scalable vector SVG for print and digital use.
      </p>
    </div>

    <!-- 3. INTERACTIVE TOOL HOST -->
    <div id="interactive-tool-host" class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl shadow-sm p-6 sm:p-8 mb-12 min-h-[350px]">
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold">Website URL</span>
            <span class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#71717A]">Wi-Fi Network</span>
            <span class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#71717A]">vCard Contact</span>
            <span class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#71717A]">UPI Payment</span>
            <span class="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#71717A]">Custom Logo</span>
          </div>
          <span class="text-xs text-[#16A34A] font-semibold bg-[#DCFCE7] dark:bg-[#14532D]/40 px-2.5 py-1 rounded-full">
            100% Client-Side Engine
          </span>
        </div>
        <div class="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] text-center space-y-2">
          <div class="text-xs font-bold text-[#18181B] dark:text-white">Loading interactive QR Code Generator...</div>
          <p class="text-xs text-[#71717A]">Supports URL, Wi-Fi, vCard 3.0, UPI payment links, SVG vector export, and custom logo embedding.</p>
        </div>
      </div>
    </div>

    <!-- 4. VISUAL PIPELINE FLOWCHART -->
    <section class="my-12">
      <div class="text-center max-w-2xl mx-auto mb-6">
        <h2 class="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
          How to Create a Scannable QR Code
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1">
          Follow these 6 steps to guarantee rapid smartphone camera scanning and print fidelity.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
        <div class="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <span class="text-[10px] font-mono text-[#EC4899] font-bold block mb-1">STEP 1</span>
          <strong class="text-[#18181B] dark:text-white block text-xs">Pick QR Type</strong>
          <span class="text-[10px] text-[#71717A]">URL, Wi-Fi, vCard</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <span class="text-[10px] font-mono text-[#EC4899] font-bold block mb-1">STEP 2</span>
          <strong class="text-[#18181B] dark:text-white block text-xs">Input &amp; Validate</strong>
          <span class="text-[10px] text-[#71717A]">Escape syntax check</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <span class="text-[10px] font-mono text-[#EC4899] font-bold block mb-1">STEP 3</span>
          <strong class="text-[#18181B] dark:text-white block text-xs">Design &amp; Logo</strong>
          <span class="text-[10px] text-[#71717A]">High contrast &amp; Level H</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <span class="text-[10px] font-mono text-[#EC4899] font-bold block mb-1">STEP 4</span>
          <strong class="text-[#18181B] dark:text-white block text-xs">Verify Payload</strong>
          <span class="text-[10px] text-[#71717A]">Inspect raw string</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <span class="text-[10px] font-mono text-[#EC4899] font-bold block mb-1">STEP 5</span>
          <strong class="text-[#18181B] dark:text-white block text-xs">Download File</strong>
          <span class="text-[10px] text-[#71717A]">PNG or SVG vector</span>
        </div>
        <div class="p-3 rounded-xl bg-[#F0FDF4] dark:bg-[#14532D]/20 border border-[#86EFAC] dark:border-[#14532D]">
          <span class="text-[10px] font-mono text-[#16A34A] font-bold block mb-1">STEP 6</span>
          <strong class="text-[#16A34A] dark:text-[#4ADE80] block text-xs">Phone Test</strong>
          <span class="text-[10px] text-[#16A34A]">Scan test before print</span>
        </div>
      </div>
    </section>

    <!-- 5. WHAT IS A QR CODE -->
    <section class="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F4F4F5] mb-3">
        What Is a QR Code?
      </h2>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed mb-3">
        A Quick Response (QR) code is a two-dimensional matrix barcode invented in 1994 by Denso Wave. Unlike standard linear barcodes that store characters along a single horizontal axis, a QR code stores data both horizontally and vertically. This allows it to hold thousands of alphanumeric characters in a compact, highly redundant grid.
      </p>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        QR codes are widely used for restaurant menus, Wi-Fi password sharing, digital business cards, product tracking, and mobile payment links across iOS and Android smartphones.
      </p>
    </section>

    <!-- 6. STATIC VS DYNAMIC COMPARISON TABLE -->
    <section class="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
        Static vs Dynamic QR Codes: An Honest Technical Comparison
      </h2>
      <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
        RajToolBox generates pure static QR codes. Here is how they compare against commercial dynamic QR services.
      </p>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">
              <th class="py-2 px-3 font-bold">Feature</th>
              <th class="py-2 px-3 font-bold text-[#16A34A]">Static QR Code (RajToolBox)</th>
              <th class="py-2 px-3 font-bold text-[#DC2626]">Dynamic QR Code (Third-Party Providers)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#A1A1AA]">
            <tr>
              <td class="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">Payload Storage</td>
              <td class="py-2.5 px-3">Directly embedded in optical modules</td>
              <td class="py-2.5 px-3">Redirect URL hosted on remote server</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">Expiration</td>
              <td class="py-2.5 px-3 font-bold text-[#16A34A]">Never expires. Works forever.</td>
              <td class="py-2.5 px-3">Expires if subscription or provider shuts down</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">Cost &amp; Scan Caps</td>
              <td class="py-2.5 px-3 font-bold text-[#16A34A]">100% Free with unlimited scans</td>
              <td class="py-2.5 px-3">Often capped at 50–100 scans on trial plans</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">Privacy</td>
              <td class="py-2.5 px-3 font-bold text-[#16A34A]">Zero middleman logging or tracking</td>
              <td class="py-2.5 px-3">User IP and location tracked by provider</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 7. FREQUENTLY ASKED QUESTIONS -->
    <section class="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F4F4F5] mb-4">
        Frequently Asked Questions
      </h2>
      <div class="space-y-3 text-xs">
        <div class="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
          <strong class="text-[#18181B] dark:text-white block mb-1">Do these QR codes ever expire?</strong>
          <p class="text-[#71717A] dark:text-[#A1A1AA]">No. These are 100% static QR codes that encode your exact information directly into the visual matrix. They never expire and have no scan limits.</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
          <strong class="text-[#18181B] dark:text-white block mb-1">Can I add my company logo?</strong>
          <p class="text-[#71717A] dark:text-[#A1A1AA]">Yes. Upload PNG, JPG, or SVG logos. RajToolBox automatically uses High (H, ~30%) error correction to guarantee scan reliability.</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
          <strong class="text-[#18181B] dark:text-white block mb-1">Should I download PNG or SVG?</strong>
          <p class="text-[#71717A] dark:text-[#A1A1AA]">PNG is ideal for digital screens, websites, and social media. SVG is scalable vector format, essential for large banners, business cards, and professional print shop printing.</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
          <strong class="text-[#18181B] dark:text-white block mb-1">Is my information private?</strong>
          <p class="text-[#71717A] dark:text-[#A1A1AA]">Yes. All generation happens locally in your browser memory. Your Wi-Fi passwords, contact details, and images are never uploaded to any remote server.</p>
        </div>
      </div>
    </section>
  </div>
  `;
}
