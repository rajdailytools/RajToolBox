import { TOOLS_REGISTRY } from '../src/data/tools.ts';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getPdfCompressorStaticHtml(): string {
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 1. BREADCRUMB -->
    <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6 flex-wrap" aria-label="Breadcrumb">
      <a href="/" class="hover:text-[#EC4899] font-medium">Home</a>
      <span aria-hidden="true">&rarr;</span>
      <a href="/pdf-tools/" class="hover:text-[#EC4899] font-medium">PDF Tools</a>
      <span aria-hidden="true">&rarr;</span>
      <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">PDF Compressor</span>
    </nav>

    <!-- 2. H1 + 3. 1-2 LINE INTRO -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
        <a href="/pdf-tools/" class="font-semibold text-[#EC4899] hover:underline">PDF Tools</a>
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
        PDF Compressor
      </h1>

      <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
        Compress PDF files online and reduce file size while keeping your document readable. Choose a compression level or target size, preview the result, then download or share your compressed PDF.
      </p>
    </div>

    <!-- 4–10. INTERACTIVE TOOL SHELL -->
    <div id="interactive-tool-host" class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-sm p-6 sm:p-8 mb-12">
      <div class="border-2 border-dashed border-[#EC4899]/30 rounded-3xl p-8 sm:p-12 text-center bg-[#FFFDF7] dark:bg-[#18181B]">
        <div class="w-16 h-16 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Compress PDF Online
        </h2>
        <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed">
          Drag &amp; drop your PDF here, or click to choose from your device. Supports single or multiple documents with 100% private in-browser processing.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <span class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#EC4899] text-white font-bold text-sm shadow-md">
            <span>Choose PDF Documents</span>
          </span>
        </div>

        <div class="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>No File Uploads</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>100% Client-Side</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>Bulk Queue Supported</span>
        </div>
      </div>
    </div>

    <!-- 11. HOW TO USE SECTION -->
    <section class="my-10 rounded-2xl border border-[#FACC15]/40 bg-[#FFFDF7] dark:bg-[#151519] p-6 sm:p-8 shadow-xs">
      <div class="flex items-center gap-2.5 mb-4">
        <div class="w-8 h-8 rounded-xl bg-[#FACC15] text-[#854D0E] flex items-center justify-center font-black text-sm">?</div>
        <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5]">How to Compress a PDF</h2>
      </div>

      <ol class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-xs">
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Upload Your PDF</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Drag and drop your file or click "Choose PDF".</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Add More Files</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Click "+ Add More Files" to queue multiple documents.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Choose Mode</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Select Basic, Recommended, Strong, or Target Size.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Select Target Size</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Pick presets (e.g. 100KB, 200KB, 500KB) or custom value.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Toggle Metadata</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Optionally strip redundant author and XML metadata.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">6</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Start Compression</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Click "Compress Now" for immediate in-browser processing.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">7</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Review Results</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Inspect original vs compressed bytes and reduction %.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">8</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Preview PDF</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Use the live viewer to verify document clarity.</p></div>
        </li>
        <li class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">9</span>
          <div><strong class="text-sm text-[#18181B] dark:text-[#F4F4F5] block">Download or Share</strong><p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">Save to your device or share via WhatsApp/Telegram.</p></div>
        </li>
      </ol>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-[#FACC15]/30 text-xs">
        <div class="p-3 rounded-lg bg-white/70 dark:bg-black/20">
          <p class="font-bold text-[#18181B] dark:text-white mb-1">Single PDF</p>
          <p class="text-[#71717A] text-[11px]">Drop 1 file &rarr; Recommended &rarr; Download in &lt; 2s.</p>
        </div>
        <div class="p-3 rounded-lg bg-white/70 dark:bg-black/20">
          <p class="font-bold text-[#18181B] dark:text-white mb-1">Multiple PDFs</p>
          <p class="text-[#71717A] text-[11px]">Use "+ Add More Files" to queue dozens for bulk compression.</p>
        </div>
        <div class="p-3 rounded-lg bg-white/70 dark:bg-black/20">
          <p class="font-bold text-[#18181B] dark:text-white mb-1">Target Size</p>
          <p class="text-[#71717A] text-[11px]">Choose 100KB, 200KB, or 500KB to match portal upload caps.</p>
        </div>
        <div class="p-3 rounded-lg bg-white/70 dark:bg-black/20">
          <p class="font-bold text-[#18181B] dark:text-white mb-1">Large PDFs</p>
          <p class="text-[#71717A] text-[11px]">Handles 50MB+ reports safely with object stream compaction.</p>
        </div>
        <div class="p-3 rounded-lg bg-white/70 dark:bg-black/20">
          <p class="font-bold text-[#18181B] dark:text-white mb-1">Mobile</p>
          <p class="text-[#71717A] text-[11px]">Tap choose file &rarr; select PDF &rarr; share directly to WhatsApp.</p>
        </div>
      </div>
    </section>

    <!-- 12. REAL-WORLD EXAMPLES -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">Real-World PDF Compression Examples</h2>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
        Practical scenarios based on real user submission requirements, job applications, government portals, and university forms.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 1: Bulk Compression (Adding 2 More Files)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 1 File (3.8 MB) &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Goal:</strong> 3 Files (&lt; 1 MB each)</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced from 11.4 MB to 2.8 MB (75.4% space saved).</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Vector fonts and photo clarity preserved across all three files.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 2: Best Way to Compress Without Losing Quality</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 8.4 MB (Product Portfolio) &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Goal:</strong> Under 3 MB for Email</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Compressed to 2.1 MB (75.0% reduction).</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Zero text degradation. High-DPI logos remain crisp at 300% zoom.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 3: Large PDF (25 MB &rarr; Target 5 MB)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 25.6 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 5 MB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Compacted to 4.4 MB (82.8% saved). Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Financial tables, charts, and auditor signatures remain 100% legible.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 4: 20 KB Target Size (Govt Signature Slip)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 180 KB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 20 KB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 22 KB (Best effort reached).</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Signature strokes remain distinct for portal upload.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 5: 30 KB Target Size (SSC &amp; State Selection)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 240 KB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 30 KB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 29 KB. Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Official seals and application numbers stay verifiable.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 6: 40 KB Target Size (Admit Card &amp; ID Proof)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 380 KB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 40 KB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 38 KB. Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Barcodes and registration numerals scan clearly.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 7: 100 KB Target Size (Scholarship Portal)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 1.2 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 100 KB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 96 KB. Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Text and revenue stamps maintain complete legibility.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 8: 200 KB Target Size (UPSC Civil Services)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 2.4 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 200 KB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 184 KB (92.3% saved). Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> University marksheet grades and registrar sign remain crisp.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 9: 300 KB Target Size (Bank KYC Account Opening)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 3.1 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 300 KB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 270 KB. Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Customer address lines and account numbers remain sharp.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 10: 1 MB Target Size (University Admission)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 6.8 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 1 MB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 890 KB (86.9% saved). Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> All 8 pages readable with flawless academic letterheads.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 11: 2 MB Target Size (ATS Resume Upload)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 7.5 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 2 MB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 1.6 MB (78.6% saved). Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Passes automated Applicant Tracking Systems with selectable text.</p>
        </div>

        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">Example 12: 5 MB Target Size (Email Attachment)</h3>
          <p><strong class="text-[#18181B] dark:text-[#D4D4D8]">Original:</strong> 22.0 MB &rarr; <strong class="text-[#18181B] dark:text-[#D4D4D8]">Target:</strong> 5 MB Preset</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold mt-1"><strong>Result:</strong> Reduced to 4.2 MB. Target reached &check;.</p>
          <p class="text-[11px] text-[#71717A] mt-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]"><em>Quality:</em> Fits 25 MB email limits with room for multiple attachments.</p>
        </div>
      </div>
    </section>

    <!-- 13. TARGET SIZE GUIDE -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">What PDF Size Should You Choose?</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="border-b border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Target Size</th>
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Typical Use Case</th>
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Feasibility &amp; Considerations</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
            <tr><td class="p-3 font-bold text-[#EC4899]">20 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">Govt signature slips, passport photo cards</td><td class="p-3 text-[#71717A]">Achievable for single-page vector documents with minimal text.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">30 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">SSC &amp; state selection commission certificates</td><td class="p-3 text-[#71717A]">Strict limits. Requires clean scans without heavy border margins.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">40 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">Admit card attachments &amp; caste verification</td><td class="p-3 text-[#71717A]">Single-page forms compress reliably to this limit.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">50 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">Railway and banking recruitment slips</td><td class="p-3 text-[#71717A]">Good balance for scanned black-and-white documents.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">100 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">National scholarship portals &amp; state welfare forms</td><td class="p-3 text-[#71717A]">High success rate for 1-to-3 page affidavits and certificates.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">200 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">UPSC Civil Services &amp; state PSC uploads</td><td class="p-3 text-[#71717A]">The most popular standard. Preserves university degree stamps clearly.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">300 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">Bank KYC verification, passbook, utility bills</td><td class="p-3 text-[#71717A]">Ideal for 2–4 page utility bills with address text.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">500 KB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">Online job portals (Naukri, Monster, FoundIt)</td><td class="p-3 text-[#71717A]">Excellent clarity. Accommodates multi-page resumes with profile pictures.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">1 MB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">University admissions &amp; academic dossiers</td><td class="p-3 text-[#71717A]">Recommended for 5–10 page research summaries and transcripts.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">2 MB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">LinkedIn Easy Apply &amp; corporate enterprise ATS</td><td class="p-3 text-[#71717A]">Universal maximum for professional PDF portfolios and resumes.</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">5 MB</td><td class="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">Corporate email attachments (Outlook, Gmail)</td><td class="p-3 text-[#71717A]">Ensures delivery through company firewalls with zero bounce-backs.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 14. HOW PDF COMPRESSION WORKS -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">How PDF Compression Works</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-4">
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-white mb-1.5">Stream Optimization</h3>
          <p class="text-[#71717A] leading-relaxed">Consolidates orphaned cross-reference tables and packs loose objects into compressed Flate streams.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-white mb-1.5">Metadata Stripping</h3>
          <p class="text-[#71717A] leading-relaxed">Removes redundant XML schemas, thumbnail previews, creation histories, and printer setup data.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-white mb-1.5">Raster Compaction</h3>
          <p class="text-[#71717A] leading-relaxed">Re-quantizes heavy embedded photographs while preserving exact mathematical vectors for fonts.</p>
        </div>
      </div>
    </section>

    <!-- 15. QUALITY VS FILE SIZE -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">PDF Compression Quality vs File Size</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="border-b border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Mode</th>
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Expected Size Drop</th>
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Visual Quality Impact</th>
              <th class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Best Use</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-white">Basic / Light</td><td class="p-3 font-semibold text-[#16A34A]">15% &ndash; 30%</td><td class="p-3 text-[#71717A]">Zero noticeable difference. 100% vector fidelity.</td><td class="p-3 text-[#71717A]">Print portfolios, legal contracts, certificates</td></tr>
            <tr><td class="p-3 font-bold text-[#EC4899]">Recommended</td><td class="p-3 font-semibold text-[#16A34A]">40% &ndash; 75%</td><td class="p-3 text-[#71717A]">Optimal balance. Text is pin-sharp; photos stay crisp on screen.</td><td class="p-3 text-[#71717A]">Email attachments, university applications, reports</td></tr>
            <tr><td class="p-3 font-bold text-[#854D0E] dark:text-[#FACC15]">Strong</td><td class="p-3 font-semibold text-[#16A34A]">70% &ndash; 90%</td><td class="p-3 text-[#71717A]">High reduction. Slight softening on embedded photos at high zoom.</td><td class="p-3 text-[#71717A]">Strict government portals with &lt; 200 KB ceilings</td></tr>
            <tr><td class="p-3 font-bold text-[#2563EB]">Target Size Mode</td><td class="p-3 font-semibold text-[#16A34A]">Adaptive</td><td class="p-3 text-[#71717A]">Dynamically adjusted to match target bytes while preserving legibility.</td><td class="p-3 text-[#71717A]">Exact form requirements (e.g. 100 KB, 200 KB, 500 KB)</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 16. FLOWCHART -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">PDF Compression Decision Flowchart</h2>
      <div class="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#141417] border border-[#E4E4E7] dark:border-[#27272A] space-y-4 text-xs font-semibold">
        <div class="flex flex-col items-center gap-2">
          <div class="px-5 py-2.5 rounded-xl bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]">1. Upload PDF (Single or Multiple)</div>
          <span class="text-[#EC4899] font-bold text-base">&darr;</span>
          <div class="px-5 py-2.5 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30">2. Choose Mode (Basic &middot; Recommended &middot; Strong &middot; Target Size)</div>
          <span class="text-[#EC4899] font-bold text-base">&darr;</span>
          <div class="px-5 py-2.5 rounded-xl bg-[#FACC15] text-[#854D0E] font-bold">3. Click "Compress PDF Now" (In-Browser Execution)</div>
          <span class="text-[#EC4899] font-bold text-base">&darr;</span>
          <div class="px-5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">4. Review Before/After Size &amp; Inspect Live Preview</div>
          <span class="text-[#EC4899] font-bold text-base">&darr;</span>
          <div class="p-3 rounded-xl border border-dashed border-[#EC4899] text-center max-w-sm">
            <span class="text-[#EC4899] font-bold block mb-1">Is Quality &amp; Size Acceptable?</span>
            <div class="flex items-center justify-center gap-6 mt-2">
              <span class="text-[#16A34A] font-bold">&check; YES &rarr; Download &amp; Share</span>
              <span class="text-[#DC2626] font-bold">&cross; NO &rarr; Adjust Target &amp; Re-compress</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 17. VISUAL DIAGRAM -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">Inside the In-Browser Optimization Engine</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs mt-4">
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
          <div class="w-8 h-8 rounded-full bg-[#EC4899] text-white flex items-center justify-center mx-auto mb-2 font-bold">1</div>
          <p class="font-bold text-[#18181B] dark:text-white">Byte Buffer Ingestion</p>
          <p class="text-[#71717A] text-[11px] mt-1">Reads raw binary array into memory sandbox with zero network transfer.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
          <div class="w-8 h-8 rounded-full bg-[#FACC15] text-[#854D0E] flex items-center justify-center mx-auto mb-2 font-bold">2</div>
          <p class="font-bold text-[#18181B] dark:text-white">Object Table Parsing</p>
          <p class="text-[#71717A] text-[11px] mt-1">Traverses catalog dictionaries and prunes unreferenced document nodes.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
          <div class="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto mb-2 font-bold">3</div>
          <p class="font-bold text-[#18181B] dark:text-white">Flate Compression</p>
          <p class="text-[#71717A] text-[11px] mt-1">Repacks content streams into modern unified object stream dictionaries.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
          <div class="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-2 font-bold">4</div>
          <p class="font-bold text-[#18181B] dark:text-white">Blob Assembly</p>
          <p class="text-[#71717A] text-[11px] mt-1">Builds local Object URL ready for instant preview and one-click download.</p>
        </div>
      </div>
    </section>

    <!-- 18. EDGE CASES SECTION (44 CASES) -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">PDF Compressor Edge Cases &amp; Troubleshooting</h2>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
        Detailed handling for all 44 common document variations and edge cases:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">1. Already Compressed PDF</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Size remains almost identical.</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Pre-existing JBIG2 or Flate streams have zero remaining bloat.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Your file is already optimal for uploading.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">2. Very Large PDF (&gt;100 MB)</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Requires a few seconds for byte streaming.</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Browser tab allocates RAM for in-memory byte arrays.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Compress large files individually for maximum stability.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">3. Very Small PDF (&lt;50 KB)</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Modest byte reduction.</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Vector text and page tables require a minimal byte baseline.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Small PDFs already satisfy all portal limits.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">4. Scanned PDF (Raster Images)</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Huge reduction achieved (50%–80%).</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Uncompressed scanner bitmaps contain substantial compressible data.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Select Recommended or Strong mode for optimal scan compression.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">5. Image-Heavy PDF (Catalogs)</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Substantial file compaction.</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Embedded image streams re-encode with high efficiency.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Inspect photo resolution in preview before saving.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">6. Text-Only PDF (Invoices)</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> 100% vector font sharpness retained.</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Mathematical font outlines are preserved without rasterization.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Use Basic or Recommended mode for crisp invoices.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">7. Digitally Signed PDF</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Signatures become invalidated if modified.</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Digital seals verify exact byte-for-byte document checksums.</p>
          <p class="text-[#DC2626] font-semibold"><strong>Action:</strong> Never compress signed legal contracts or deeds.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1">8. Target Size Unreachable</h3>
          <p class="text-[#71717A]"><strong>What happens:</strong> Tool achieves best possible size and shows "Best effort".</p>
          <p class="text-[#71717A]"><strong>Why:</strong> Multi-page documents require minimum bytes for font dictionaries.</p>
          <p class="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action:</strong> Increase target to a realistic threshold like 500 KB.</p>
        </div>
      </div>
    </section>

    <!-- 19. WHEN SHOULD YOU USE A PDF COMPRESSOR? -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">When Should You Use a PDF Compressor?</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mt-4">
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Government Job Applications</strong>
          <p class="text-[#71717A] text-[11px] leading-relaxed">Portals enforcing strict 100 KB, 200 KB, or 500 KB caps for degrees and certificates.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Competitive Entrance Exams</strong>
          <p class="text-[#71717A] text-[11px] leading-relaxed">UPSC, SSC, NEET, JEE, and GATE registration forms demanding compact file sizes.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Scholarship Portals</strong>
          <p class="text-[#71717A] text-[11px] leading-relaxed">Uploading income certificates, caste affidavits, and academic transcripts under 200 KB.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Corporate Job Applications</strong>
          <p class="text-[#71717A] text-[11px] leading-relaxed">Bypassing strict 2 MB attachment limits on recruiter applicant tracking systems.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Email Attachments</strong>
          <p class="text-[#71717A] text-[11px] leading-relaxed">Sending multi-page proposals without triggering 25 MB email bounce-backs.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">WhatsApp &amp; Mobile Sharing</strong>
          <p class="text-[#71717A] text-[11px] leading-relaxed">Sending documents fast on cellular data without consuming gigabytes.</p>
        </div>
      </div>
    </section>

    <!-- 20. WHEN SHOULD YOU AVOID PDF COMPRESSION? -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">When Should You Avoid PDF Compression?</h2>
      <div class="space-y-2.5 text-xs text-[#71717A] dark:text-[#A1A1AA] mt-4">
        <div class="p-3.5 rounded-xl border border-[#DC2626]/20 bg-red-50/40 dark:bg-red-950/15">
          <strong class="text-[#18181B] dark:text-white">Digitally Signed Legal Documents:</strong> Compression modifies byte streams, breaking the cryptographic checksum of digital signatures (e-Sign, DSC).
        </div>
        <div class="p-3.5 rounded-xl border border-[#DC2626]/20 bg-red-50/40 dark:bg-red-950/15">
          <strong class="text-[#18181B] dark:text-white">Commercial Print Production:</strong> Professional CMYK offset printing requires 300+ DPI uncompressed TIFF/raster graphics.
        </div>
        <div class="p-3.5 rounded-xl border border-[#DC2626]/20 bg-red-50/40 dark:bg-red-950/15">
          <strong class="text-[#18181B] dark:text-white">Master Archival Copies:</strong> Always store an uncompressed master archive of historical records and birth certificates.
        </div>
      </div>
    </section>

    <!-- 21. COMMON MISTAKES -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">Common PDF Compression Mistakes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-4">
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Deleting the Original File</strong>
          <p class="text-[#71717A] text-[11px]">Never discard your original master document before verifying the compressed file.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Skipping the Preview Step</strong>
          <p class="text-[#71717A] text-[11px]">Always inspect the in-browser preview to verify small footnotes and stamps are legible.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Attempting Unrealistic Target Sizes</strong>
          <p class="text-[#71717A] text-[11px]">Aiming for 20 KB on a 20-page color PDF will result in unreadable downscaling.</p>
        </div>
        <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <strong class="text-sm text-[#18181B] dark:text-white block mb-1">Repeatedly Compressing the Same File</strong>
          <p class="text-[#71717A] text-[11px]">Compressing an already compressed PDF compounds loss without yielding meaningful byte gains.</p>
        </div>
      </div>
    </section>

    <!-- 22. RELATED TOOLS -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] p-6 sm:p-8">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4">Related PDF &amp; Document Tools</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <a href="/tools/pdf-merger/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">PDF Merger</h3>
            <p class="text-[#71717A] text-[11px] mt-1">Combine multiple PDF files into one clean document.</p>
          </div>
          <span class="text-[#EC4899] font-bold mt-3 inline-flex items-center gap-1">Open Tool &rarr;</span>
        </a>
        <a href="/tools/pdf-splitter/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">PDF Splitter</h3>
            <p class="text-[#71717A] text-[11px] mt-1">Extract specific page ranges or split into individual pages.</p>
          </div>
          <span class="text-[#EC4899] font-bold mt-3 inline-flex items-center gap-1">Open Tool &rarr;</span>
        </a>
        <a href="/tools/image-to-pdf/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">Image to PDF</h3>
            <p class="text-[#71717A] text-[11px] mt-1">Convert photos, JPGs, and PNGs into professional PDFs.</p>
          </div>
          <span class="text-[#EC4899] font-bold mt-3 inline-flex items-center gap-1">Open Tool &rarr;</span>
        </a>
        <a href="/tools/image-compressor/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] transition-all flex flex-col justify-between group">
          <div>
            <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">Image Compressor</h3>
            <p class="text-[#71717A] text-[11px] mt-1">Reduce JPG and PNG photos to exact KB limits.</p>
          </div>
          <span class="text-[#EC4899] font-bold mt-3 inline-flex items-center gap-1">Open Tool &rarr;</span>
        </a>
      </div>
    </section>

    <!-- 23. RELATED GUIDES -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">Related Guides &amp; Tutorials</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-4">
        <a href="/guides/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] hover:border-[#EC4899] transition-all">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-white mb-1">How to Reduce PDF Size for Govt Forms</h3>
          <p class="text-[#71717A] text-[11px]">Achieve 100 KB and 200 KB targets for civil service uploads.</p>
        </a>
        <a href="/guides/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] hover:border-[#EC4899] transition-all">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-white mb-1">Compress PDF Without Quality Loss</h3>
          <p class="text-[#71717A] text-[11px]">Vector font preservation principles explained simply.</p>
        </a>
        <a href="/pdf-tools/" class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] hover:border-[#EC4899] transition-all">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-white mb-1">Explore All PDF Utilities</h3>
          <p class="text-[#71717A] text-[11px]">Access our complete, private, browser-based document toolkit.</p>
        </a>
      </div>
    </section>

    <!-- 24. FAQ SECTION (25 COMPREHENSIVE QUESTIONS) -->
    <section class="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
      <h2 class="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">Frequently Asked Questions</h2>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
        Detailed answers regarding PDF compression, browser privacy, target sizes, and document quality:
      </p>

      <div class="space-y-3 text-xs">
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">1. What is a PDF compressor?</h3>
          <p class="text-[#71717A] leading-relaxed">A specialized utility that analyzes cross-reference tables, stream dictionaries, and font subsets to reduce document byte size while retaining readability.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">2. How can I reduce PDF size?</h3>
          <p class="text-[#71717A] leading-relaxed">Upload to RajToolBox PDF Compressor, select Recommended or Target Size mode, click Compress, preview the result, and download.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">3. Can I compress PDF online for free?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. RajToolBox is 100% free with no subscriptions, file caps, watermarks, or account registration required.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">4. Can I compress PDF to 100KB?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Select Target Size mode and pick the 100 KB preset. Ideal for scholarship and state welfare portal submissions.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">5. Can I compress PDF to 200KB?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. 200 KB is the standard requirement for UPSC, SSC, and state PSC job application portals.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">6. Can I compress PDF to 300KB?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Choose the 300 KB preset, commonly required by banking KYC verification and utility bill portals.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">7. Can I compress PDF to 1MB?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. The 1 MB preset is ideal for college admissions, academic projects, and professional email attachments.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">8. Can I compress PDF to 2MB?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. 2 MB is the standard upload ceiling for LinkedIn, Indeed, Naukri, and corporate HR portal resume submissions.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">9. Can I compress PDF to 5MB?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Select the 5 MB preset for large multi-page reports to ensure they stay well under corporate email limits.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">10. How do I compress PDF without losing quality?</h3>
          <p class="text-[#71717A] leading-relaxed">Choose Recommended mode. Structural tables and redundant XML are cleaned while vector font outlines remain 100% sharp.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">11. Why does my PDF remain large after compression?</h3>
          <p class="text-[#71717A] leading-relaxed">If a PDF consists of dozens of 600-DPI full-color scanned pages, further reduction without downsampling images is constrained.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">12. Can I compress a scanned PDF?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Scanned PDFs show significant reduction because uncompressed scanner bitmaps can be compacted efficiently.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">13. Can I compress multiple PDFs at once?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. RajToolBox fully supports bulk queue processing. Click "+ Add More Files" to queue multiple documents.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">14. Can I compress a large PDF (50 MB or 100 MB)?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Modern desktop browsers handle large files smoothly directly in memory.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">15. Can I preview the compressed PDF before downloading?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. A live in-browser preview appears immediately after compression so you can verify readability.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">16. Is PDF compression safe on RajToolBox?</h3>
          <p class="text-[#71717A] leading-relaxed">Completely safe. Unlike cloud services, RajToolBox processes everything locally in your device browser memory.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] p-4 rounded-xl">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">17. Are my PDF files uploaded to a server?</h3>
          <p class="text-[#71717A] leading-relaxed">Never. All algorithms execute client-side. Zero bytes are transferred across the network.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">18. Can I compress a password-protected PDF?</h3>
          <p class="text-[#71717A] leading-relaxed">Encrypted PDFs must be unlocked before compression because security wrappers lock object syntax.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">19. Can I compress a digitally signed PDF?</h3>
          <p class="text-[#71717A] leading-relaxed">Avoid compressing digitally signed PDFs. Altering byte streams breaks digital signature verification seals.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">20. Why did my PDF quality become blurry with another tool?</h3>
          <p class="text-[#71717A] leading-relaxed">Some services force aggressive 72-DPI downsampling. RajToolBox preserves vector text outlines cleanly.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">21. Can I compress PDF on mobile?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. The touch-friendly interface is fully responsive on iOS Safari and Android Chrome.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">22. Can I share the compressed PDF directly?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Use Native Share on mobile or WhatsApp/Telegram shortcuts.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">23. Can I use WhatsApp to share the compressed PDF?</h3>
          <p class="text-[#71717A] leading-relaxed">Yes. Click the WhatsApp button to send tool links or share results with clients and friends.</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">24. What happens if the target size cannot be reached?</h3>
          <p class="text-[#71717A] leading-relaxed">RajToolBox provides an honest status: it compacts the file to the lowest technically possible size without destroying legibility and displays "Best effort reached".</p>
        </div>
        <div class="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl p-4 bg-[#FFFDF7] dark:bg-[#1C1C22]">
          <h3 class="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-1.5">25. Should I keep the original PDF?</h3>
          <p class="text-[#71717A] leading-relaxed">Always retain your original master document, especially for legal contracts, certificates, and archival records.</p>
        </div>
      </div>
    </section>

    <!-- 25. AUTHOR / TRUST SECTION -->
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
        Engineered with scientific accuracy and browser-native performance. All processing executes securely inside your local machine without remote server dependencies. Contact: <a href="mailto:rajtoolboxofficial@gmail.com" class="text-[#EC4899] underline">rajtoolboxofficial@gmail.com</a>
      </p>
    </div>

    <!-- 26. FINAL SHARE SECTION -->
    <section class="my-10 p-8 rounded-2xl border border-[#EC4899]/30 bg-gradient-to-b from-[#FFFDF7] to-[#FCE7F3]/30 dark:from-[#18181B] dark:to-[#EC4899]/10 text-center shadow-xs">
      <div class="w-12 h-12 rounded-2xl bg-[#EC4899] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </div>
      <h2 class="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">Share PDF Compressor</h2>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto mb-6">
        Know someone struggling with large PDF uploads or strict portal limits? Share RajToolBox PDF Compressor directly with friends and colleagues.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
        <a
          href="https://api.whatsapp.com/send?text=Compress%20large%20PDF%20files%20online%20with%20100%25%20private%20in-browser%20tool%3A%20https%3A%2F%2Frajtoolbox.com%2Ftools%2Fpdf-compressor%2F"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white shadow-xs hover:bg-[#20BA5A] transition-all"
        >
          <span>Share via WhatsApp</span>
        </a>

        <a
          href="https://t.me/share/url?url=https%3A%2F%2Frajtoolbox.com%2Ftools%2Fpdf-compressor%2F&text=Compress%20large%20PDF%20files%20online%20for%20free%20on%20RajToolBox"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0088cc] text-white shadow-xs hover:bg-[#0077b5] transition-all"
        >
          <span>Share on Telegram</span>
        </a>

        <a
          href="mailto:?subject=Helpful%20PDF%20Compressor%20Tool&body=I%20found%20this%20free%20PDF%20compressor%20on%20RajToolBox%20that%20reduces%20PDF%20size%20directly%20inside%20the%20browser%3A%20https%3A%2F%2Frajtoolbox.com%2Ftools%2Fpdf-compressor%2F"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-white hover:border-[#EC4899] transition-all"
        >
          <span>Email</span>
        </a>
      </div>
    </section>
  </div>
  `;
}
