import { TOOLS_REGISTRY } from '../src/data/tools.ts';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getTextCaseConverterStaticHtml(): string {
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 1. BREADCRUMB -->
    <nav class="flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6 flex-wrap" aria-label="Breadcrumb">
      <a href="/" class="hover:text-[#EC4899] font-medium">Home</a>
      <span aria-hidden="true">&rarr;</span>
      <a href="/text-tools/" class="hover:text-[#EC4899] font-medium">Text Tools</a>
      <span aria-hidden="true">&rarr;</span>
      <span class="text-[#18181B] dark:text-[#F4F4F5] font-semibold" aria-current="page">Text Case Converter</span>
    </nav>

    <!-- 2. H1 & INTRO -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
        <a href="/text-tools/" class="font-semibold text-[#EC4899] hover:underline">Text Tools</a>
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
        Text Case Converter
      </h1>

      <p class="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
        Convert text between uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Clean extra spaces, line breaks and messy copied formatting in seconds.
      </p>
    </div>

    <!-- 3. INTERACTIVE TOOL PLACEHOLDER -->
    <div id="interactive-tool-host" class="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-sm p-6 sm:p-8 mb-12 min-h-[300px]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">INPUT TEXT</span>
            <span class="text-xs text-[#71717A]">Type or Paste</span>
          </div>
          <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-mono text-[#71717A] min-h-[160px]">
            Paste or type your text here... Supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and PDF line-break cleanup.
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">CONVERTED TEXT</span>
            <span class="text-xs text-[#16A34A] font-bold">Live Output</span>
          </div>
          <div class="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-mono text-[#71717A] min-h-[160px]">
            Instant converted results appear here with character counts, word statistics, and one-click copy/download.
          </div>
        </div>
      </div>
      <noscript>
        <div class="mt-4 p-4 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs font-medium max-w-md mx-auto text-center">
          JavaScript is disabled in your browser. Enable JavaScript to interact directly with this tool.
        </div>
      </noscript>
    </div>

    <!-- 4. HOW TO USE -->
    <section class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
      <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
        <svg class="w-5 h-5 text-[#EC4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        How to Use the Text Case Converter
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">1</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Paste or Type Text</h3>
          <p>Paste text from your clipboard or type directly into the input area. You can also click "Sample" to explore realistic formatting scenarios.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">2</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Select Case or Cleanup</h3>
          <p>Pick from 16 case conventions (Title Case, Sentence case, camelCase, snake_case, etc.) or click "Clean Copied Text" to fix PDF line wraps.</p>
        </div>

        <div class="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
          <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">3</span>
          <h3 class="font-bold text-[#18181B] dark:text-[#F4F4F5]">Copy or Download</h3>
          <p>Check the live diff and character statistics in the converted panel, then click "Copy Converted Text" or "Download" as a clean text file.</p>
        </div>
      </div>
    </section>

    <!-- 5. CASE CONVENTION REFERENCE TABLE -->
    <section class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
      <h2 class="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
        Supported Text Case Formats &amp; Conventions
      </h2>
      <p class="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
        A complete guide to standard linguistic capitalization rules and programming variable naming conventions:
      </p>

      <div class="overflow-x-auto rounded-2xl border border-[#E4E4E7] dark:border-[#27272A]">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-[#FFFDF7] dark:bg-[#202026] text-[#18181B] dark:text-[#F4F4F5] font-black border-b border-[#E4E4E7] dark:border-[#27272A]">
            <tr>
              <th class="p-3">Format</th>
              <th class="p-3">Example Output</th>
              <th class="p-3">Primary Application</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#D4D4D8]">
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">UPPERCASE</td><td class="p-3 font-mono text-[#EC4899]">HELLO WORLD EXAMPLE</td><td class="p-3">Headlines, acronyms, and strong emphasis</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">lowercase</td><td class="p-3 font-mono text-[#EC4899]">hello world example</td><td class="p-3">Email addresses, search terms, text normalization</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Title Case</td><td class="p-3 font-mono text-[#EC4899]">The Quick Brown Fox Jumps over the Lazy Dog</td><td class="p-3">Book titles, article headlines, blog posts (AP/Chicago style)</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Sentence case</td><td class="p-3 font-mono text-[#EC4899]">Hello world. This is a sentence.</td><td class="p-3">Standard writing, emails, body paragraphs</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">camelCase</td><td class="p-3 font-mono text-[#EC4899]">helloWorldExample</td><td class="p-3">JavaScript, TypeScript, and Java variables</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">PascalCase</td><td class="p-3 font-mono text-[#EC4899]">HelloWorldExample</td><td class="p-3">Classes, components, and types in React &amp; C#</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">snake_case</td><td class="p-3 font-mono text-[#EC4899]">hello_world_example</td><td class="p-3">Python variables, SQL database columns</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">kebab-case</td><td class="p-3 font-mono text-[#EC4899]">hello-world-example</td><td class="p-3">URL slugs, CSS class names, HTML attributes</td></tr>
            <tr><td class="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">CONSTANT_CASE</td><td class="p-3 font-mono text-[#EC4899]">HELLO_WORLD_EXAMPLE</td><td class="p-3">Environment variables, global constants</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 6. AUTHOR & TRUST -->
    <div class="mb-8">
      <div class="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div class="w-14 h-14 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] font-black text-xl flex items-center justify-center shrink-0">
          RS
        </div>
        <div>
          <h3 class="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</h3>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">Creator of RajToolBox &amp; Full-Stack Engineer (B.Sc. Physics)</p>
          <p class="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-2">
            Engineered with 100% client-side privacy. All transformations execute locally in browser memory without sending your sensitive text or documents to external servers.
          </p>
        </div>
      </div>
    </div>
  </div>`;
}
