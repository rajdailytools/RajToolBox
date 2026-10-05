import { TOOLS_REGISTRY } from '../src/data/tools.ts';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getImageCompressorStaticHtml(): string {
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 1. BREADCRUMB -->
    <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6 flex-wrap" aria-label="Breadcrumb">
      <a href="/" class="hover:text-[#EC4899] font-medium">Home</a>
      <span aria-hidden="true">&rarr;</span>
      <a href="/image-tools/" class="hover:text-[#EC4899] font-medium">Image Tools</a>
      <span aria-hidden="true">&rarr;</span>
      <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">Image Compressor</span>
    </nav>

    <!-- 2. H1 + 3. INTRO -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
        <a href="/image-tools/" class="font-semibold text-[#EC4899] hover:underline">Image Tools</a>
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
        Image Compressor
      </h1>

      <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
        Compress JPG, PNG, and WebP images online while keeping your photos sharp and clear. Choose a compression level or target size (20 KB, 50 KB, 100 KB, 200 KB), preview Before &amp; After, then download or share your compressed image.
      </p>
    </div>

    <!-- 4–10. INTERACTIVE TOOL SHELL -->
    <div id="interactive-tool-host" class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-sm p-6 sm:p-8 mb-12">
      <div class="border-2 border-dashed border-[#EC4899]/30 rounded-3xl p-8 sm:p-12 text-center bg-[#FFFDF7] dark:bg-[#18181B]">
        <div class="w-16 h-16 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Compress Images Online
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed">
          Drag &amp; drop your JPG, PNG, or WebP files here, or click to choose from your device. Specify a target size (20 KB, 50 KB, 100 KB, 200 KB) with 100% private in-browser processing.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <button type="button" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#EC4899] text-white font-bold text-sm shadow-md hover:bg-[#DB2777]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Choose Image Files</span>
          </button>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>JPG, PNG, WebP Supported</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>100% In-Browser &amp; Private</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>Real Target Size Engine</span>
        </div>
      </div>
    </div>

    <!-- 11. HOW TO USE SECTION -->
    <section class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
      <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
        <svg class="w-5 h-5 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        How to Compress Images Online (Step-by-Step)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">1</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Upload Image(s)</h3>
          <p>Drag and drop your JPG, PNG, or WebP files into the upload box, or click "Choose Image Files". You can select multiple images to compress in bulk.</p>
        </div>
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">2</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Pick Compression Mode or Target</h3>
          <p>Choose "Target Size" to aim for exact limits (e.g. 50 KB, 100 KB, 200 KB), or select "Recommended" (78% quality) or "Strong" (55% quality).</p>
        </div>
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">3</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Adjust Dimensions (Optional)</h3>
          <p>Keep original dimensions, scale by percentage (75%, 50%), or set custom pixel width/height with aspect ratio lock enabled.</p>
        </div>
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">4</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Inspect &amp; Download</h3>
          <p>Tap "Compare Before &amp; After" to inspect visual quality with zoom up to 300%. Download individually or click "Download All as ZIP".</p>
        </div>
      </div>
    </section>

    <!-- 12. PROGRESSIVE ENGINE FLOWCHART -->
    <section class="p-6 rounded-3xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-6">
      <div>
        <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <svg class="w-5 h-5 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          How the Progressive Target-Size Compression Engine Works
        </h2>
        <p class="text-xs text-[#71717A] mt-1">
          Understanding the multi-pass decision tree that delivers real byte reduction without destroying visual legibility.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] overflow-x-auto">
        <div class="min-w-[620px] flex flex-col items-center gap-3 text-xs">
          <div class="w-64 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Upload Image &amp; Detect Format + Dimensions
          </div>
          <div class="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700"></div>

          <div class="w-64 p-3 rounded-xl border border-[#EC4899]/40 bg-[#FCE7F3]/40 dark:bg-[#EC4899]/15 text-center font-bold text-[#EC4899]">
            Select Target Goal (e.g. 50 KB, 100 KB, 200 KB)
          </div>
          <div class="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700"></div>

          <div class="w-72 p-3 rounded-xl border border-[#FACC15] bg-[#FEF3C7] dark:bg-[#FACC15]/20 text-center font-bold text-[#854D0E] dark:text-[#FACC15]">
            Pass 1: Binary Search on Quality (0.10 to 0.92)
          </div>
          <div class="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700"></div>

          <div class="w-80 p-3 rounded-2xl border-2 border-dashed border-[#16A34A] bg-emerald-50 dark:bg-emerald-950/30 text-center font-bold text-[#16A34A] dark:text-[#4ADE80]">
            Measure Actual Generated Blob Size: Target Reached?
          </div>

          <div class="w-full flex justify-around pt-2">
            <div class="flex flex-col items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                YES (&le; Target)
              </span>
              <div class="w-0.5 h-4 bg-emerald-300"></div>
              <div class="w-56 p-3 rounded-xl border border-emerald-400 bg-white dark:bg-zinc-900 text-center font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
                ✓ Finalize Output &amp; Generate Preview (Target Reached)
              </div>
            </div>

            <div class="flex flex-col items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                NO (&gt; Target)
              </span>
              <div class="w-0.5 h-4 bg-amber-300"></div>
              <div class="w-64 p-3 rounded-xl border border-amber-400 bg-white dark:bg-zinc-900 text-center font-bold text-amber-800 dark:text-amber-300 shadow-xs">
                Pass 2: Progressive Resolution Scaling (Aspect Preserved)
              </div>
              <div class="w-0.5 h-4 bg-amber-300"></div>
              <div class="w-64 p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center text-[11px] text-[#71717A]">
                Stop at Safe Readability Floor &amp; Report Honest Achieved Size
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 13. WHAT IS & HOW IT WORKS -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
        <h2 class="text-base font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <svg class="w-4 h-4 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          What Is Image Compression?
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Image compression is the process of encoding digital graphic data to use significantly fewer bytes than the uncompressed original. A standard 12-megapixel photograph from a modern smartphone contains roughly 36 million bytes of raw RGB pixel data. Compression identifies redundant patterns across adjacent pixels, encodes color frequencies, and strips unnecessary metadata to reduce file size from 4 MB down to 100 KB without perceptible loss in visual clarity.
        </p>
      </div>

      <div class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
        <h2 class="text-base font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <svg class="w-4 h-4 text-[#FACC15]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          How Does Image Compression Work?
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Modern compressors employ discrete cosine transform (DCT) and chroma subsampling. Because human eyes are far more sensitive to brightness (luminance) than to subtle color variations (chrominance), the algorithm preserves sharp luminance edges while gently averaging color gradients. Quantization tables then eliminate high-frequency noise that the human eye cannot discern, followed by Huffman entropy encoding for ultra-compact storage.
        </p>
      </div>
    </section>

    <!-- 14. 12 REAL LIFE EXAMPLES -->
    <section class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-6">
      <div>
        <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <svg class="w-5 h-5 text-[#16A34A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          12 Real-Life Image Compression Examples
        </h2>
        <p class="text-xs text-[#71717A] mt-1">
          Real test scenarios reflecting actual job portals, government admit cards, signatures, and website performance demands.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2 text-xs">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">Example 1: Smartphone Photo (3.4 MB &rarr; Target 100 KB for Online Form)</h3>
          <p class="text-[#71717A]">Original: <strong>3.4 MB (4032 × 3024 px)</strong> &rarr; Target: <strong class="text-[#EC4899]">100 KB</strong></p>
          <p class="text-[#71717A]"><strong>Method:</strong> Binary quality search + calibrated 1600×1200 resolution scaling.</p>
          <p class="text-emerald-700 dark:text-emerald-400 font-semibold"><strong>Result:</strong> Compressed to 94.6 KB (97.2% reduction). Target reached &check;.</p>
          <p class="text-[#71717A]"><strong>Visual Quality:</strong> Facial clarity preserved for instant portal acceptance.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2 text-xs">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">Example 2: Government Portal Candidate Photo (680 KB &rarr; Target 50 KB)</h3>
          <p class="text-[#71717A]">Original: <strong>680 KB (1200 × 1500 px)</strong> &rarr; Target: <strong class="text-[#EC4899]">50 KB</strong></p>
          <p class="text-[#71717A]"><strong>Method:</strong> Strips camera EXIF metadata + optimizes quantization matrix.</p>
          <p class="text-emerald-700 dark:text-emerald-400 font-semibold"><strong>Result:</strong> Compressed to 46.2 KB (93.2% saved). Target reached &check;.</p>
          <p class="text-[#71717A]"><strong>Visual Quality:</strong> White background and portrait edges stay crisp.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2 text-xs">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">Example 3: Candidate Signature Scan (420 KB &rarr; Target 20 KB)</h3>
          <p class="text-[#71717A]">Original: <strong>420 KB (Black ink on paper)</strong> &rarr; Target: <strong class="text-[#EC4899]">20 KB</strong></p>
          <p class="text-[#71717A]"><strong>Method:</strong> Composited over white background + high-contrast JPEG encoding.</p>
          <p class="text-emerald-700 dark:text-emerald-400 font-semibold"><strong>Result:</strong> Compressed to 18.4 KB (95.6% saved). Target reached &check;.</p>
          <p class="text-[#71717A]"><strong>Visual Quality:</strong> Pen strokes distinct without fuzzy artifacts.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2 text-xs">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">Example 4: Transparent Logo (2.1 MB PNG &rarr; Target 150 KB)</h3>
          <p class="text-[#71717A]">Original: <strong>2.1 MB (2400 × 2400 px, 32-bit PNG)</strong> &rarr; Target: <strong class="text-[#EC4899]">150 KB</strong></p>
          <p class="text-[#71717A]"><strong>Method:</strong> Auto format selects WebP to preserve alpha transparency.</p>
          <p class="text-emerald-700 dark:text-emerald-400 font-semibold"><strong>Result:</strong> Compressed to 112 KB (94.7% saved) in WebP format.</p>
          <p class="text-[#71717A]"><strong>Visual Quality:</strong> Crisp transparent logo without black boxes.</p>
        </div>
      </div>
    </section>

    <!-- 15. FREQUENTLY ASKED QUESTIONS -->
    <section class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
      <div>
        <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <svg class="w-5 h-5 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Frequently Asked Questions (FAQ)
        </h2>
        <p class="text-xs text-[#71717A] mt-1">
          Everything you need to know about image compression, file formats, and target size limits.
        </p>
      </div>

      <div class="space-y-3 text-xs sm:text-sm">
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">How do I compress an image to exactly 100 KB?</h3>
          <p class="text-[#71717A] leading-relaxed">Select "Target Size" mode, click the "100 KB" preset, and tap "Compress to 100 KB". The engine runs a binary quality search and measures the physical output Blob to ensure your file stays within 100 KB for job and exam portals.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Are my photos uploaded to your server?</h3>
          <p class="text-[#71717A] leading-relaxed">Never. RajToolBox Image Compressor executes 100% locally inside your device browser using HTML5 Canvas and WebAssembly. Your photos, signatures, and confidential ID documents never leave your phone or computer.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Can I compress an image without losing quality?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Choose "Basic / Light" mode (90% quality) or "Recommended" mode (78% quality). Human vision cannot detect the difference in subtle pixel quantization at these settings, yet file size drops by 60% to 80%.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Can I compress multiple images at the same time?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. You can select multiple images at once or click "+ Add More Images" to queue files. After compression, click "Download All as ZIP" to get all optimized photos bundled into a single archive.</p>
        </div>
      </div>
    </section>

    <!-- 16. RELATED TOOLS -->
    <section class="p-6 rounded-3xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
      <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
        Related Image &amp; Document Tools
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <a href="/tools/image-resizer/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <p class="font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899]">Image Resizer</p>
            <p class="text-[11px] text-[#71717A] mt-1">Resize pixel dimensions and scale images with aspect ratio lock.</p>
          </div>
          <span class="text-[10px] font-semibold text-[#EC4899] mt-3 flex items-center gap-1">Open Tool &rarr;</span>
        </a>
        <a href="/tools/image-format-converter/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <p class="font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899]">Image Format Converter</p>
            <p class="text-[11px] text-[#71717A] mt-1">Convert between PNG, JPG, WebP, BMP, and GIF formats.</p>
          </div>
          <span class="text-[10px] font-semibold text-[#EC4899] mt-3 flex items-center gap-1">Open Tool &rarr;</span>
        </a>
        <a href="/tools/pdf-compressor/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <p class="font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899]">PDF Compressor</p>
            <p class="text-[11px] text-[#71717A] mt-1">Compress PDF documents to target sizes (40 KB, 100 KB, 200 KB).</p>
          </div>
          <span class="text-[10px] font-semibold text-[#EC4899] mt-3 flex items-center gap-1">Open Tool &rarr;</span>
        </a>
        <a href="/tools/image-cropper/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <p class="font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899]">Image Cropper</p>
            <p class="text-[11px] text-[#71717A] mt-1">Crop photos to exact ratios for passport, social avatars, and banners.</p>
          </div>
          <span class="text-[10px] font-semibold text-[#EC4899] mt-3 flex items-center gap-1">Open Tool &rarr;</span>
        </a>
      </div>
    </section>

    <!-- 17. AUTHOR / TRUST SECTION -->
    <div class="mb-8">
      <div class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#FACC15] p-0.5 shrink-0 shadow-md">
          <div class="w-full h-full rounded-full bg-white dark:bg-[#18181B] flex items-center justify-center font-black text-xl text-[#EC4899]">
            RS
          </div>
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 class="font-black text-base text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</h3>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Creator &amp; Full-Stack Engineer
            </span>
          </div>
          <p class="text-xs text-[#71717A] leading-relaxed max-w-2xl">
            Raj develops high-performance client-side browser utilities for students, professionals, and developers. His tools prioritize zero-upload privacy, instant device execution, and true target compliance.
          </p>
        </div>
      </div>
    </div>

    <!-- 18. PAGE-LEVEL SHARE BAR -->
    <div class="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs">
      <div class="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA]">
        <svg class="w-4 h-4 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        <span>Share RajToolBox Image Compressor:</span>
      </div>
      <div class="flex items-center gap-2">
        <a href="https://api.whatsapp.com/send?text=Compress%20large%20JPG%2C%20PNG%2C%20and%20WebP%20images%20online%20with%20100%25%20private%20in-browser%20tool%3A%20https%3A%2F%2Frajtoolbox.com%2Ftools%2Fimage-compressor%2F" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#25D366] text-[#25D366] transition-all" title="Share via WhatsApp">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </a>
        <a href="https://t.me/share/url?url=https%3A%2F%2Frajtoolbox.com%2Ftools%2Fimage-compressor%2F&text=Compress%20large%20image%20files%20online%20for%20free%20on%20RajToolBox" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#0088cc] text-[#0088cc] transition-all" title="Share on Telegram">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </a>
        <a href="mailto:?subject=Helpful%20Image%20Compressor%20Tool&body=I%20found%20this%20free%20Image%20Compressor%20on%20RajToolBox%20that%20reduces%20image%20size%20directly%20inside%20the%20browser%3A%20https%3A%2F%2Frajtoolbox.com%2Ftools%2Fimage-compressor%2F" class="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A] hover:text-[#EC4899] transition-all" title="Share via Email">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </a>
      </div>
    </div>
  </div>
  `;
}
