import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { TextCaseConverterTool } from '../tools/components/TextCaseConverterTool';
import { AuthorBox } from '../components/ui/AuthorBox';
import { RelatedTools } from '../components/ui/RelatedTools';
import {
  Type,
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  AlignLeft,
  FileText,
  Sliders,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TextCaseConverterPageProps {
  tool: ToolItem;
}

export const TextCaseConverterPage: React.FC<TextCaseConverterPageProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const category = CATEGORIES[tool.category] || CATEGORIES['text-tools'];
  const favored = isFavorite(tool.slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeUseCase, setActiveUseCase] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Sync document title and canonical meta for SEO
  useEffect(() => {
    document.title = 'Text Case Converter – Uppercase, Lowercase, Title Case & More | RajToolBox';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Free online Text Case Converter to change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Clean spaces, line breaks and formatting instantly.'
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://rajtoolbox.com/tools/text-case-converter/');
  }, [tool]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Text Case Converter & Text Formatter – RajToolBox',
          text: 'Convert text between uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and clean messy copied text online.',
          url: window.location.href
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  // FAQ definitions based on user queries from Google / Reddit / Quora
  const faqs = [
    {
      q: 'What is a text case converter?',
      a: 'A text case converter is a specialized utility that transforms the capitalization of text characters according to standard linguistic rules or programming conventions. Instead of manually retyping sentences, you can instantly convert between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.'
    },
    {
      q: 'How does Title Case work in RajToolBox?',
      a: 'Unlike basic converters that blindly capitalize every word, RajToolBox implements standard grammatical title casing (following Chicago and AP style principles). It capitalizes principal nouns, verbs, adjectives, and adverbs while keeping minor stop words (such as a, an, the, and, but, or, for, in, of, on, at, to, with) lowercase, unless they occur as the first or last word of a headline.'
    },
    {
      q: 'How do I convert text to Sentence case?',
      a: 'Select the "Sentence case" button. The engine automatically lowercases unneeded capitals and capitalizes the first letter following each sentence terminator (. ! ? or newline). It also respects decimal numbers like 3.14 without breaking sentences.'
    },
    {
      q: 'How do I clean text copied from a PDF or ChatGPT?',
      a: 'Click "Clean Copied Text" in the Clean & Format section. When you copy text from PDFs or certain document editors, artificial line breaks are frequently inserted at the end of every visual line. Our cleaner joins wrapped lines into smooth, flowing paragraphs while preserving true paragraph breaks (double line breaks).'
    },
    {
      q: 'What is the difference between camelCase, PascalCase, snake_case, and kebab-case?',
      a: 'These are programming naming conventions. camelCase lowercases the first word and capitalizes subsequent words with no spaces (e.g., helloWorld). PascalCase capitalizes every word with no spaces (e.g., HelloWorld). snake_case separates all lowercase words with underscores (e.g., hello_world). kebab-case separates lowercase words with hyphens (e.g., hello-world).'
    },
    {
      q: 'Can I remove extra spaces and blank lines from my text?',
      a: 'Yes! Open the "Custom Cleanup" panel in the Clean & Format section. You can toggle checkboxes to remove consecutive redundant spaces, trim leading/trailing spaces from every line, collapse multiple blank lines into one, or delete blank lines altogether.'
    },
    {
      q: 'Is my text uploaded or stored on any server?',
      a: 'No. 100% of the text transformation and formatting occurs directly inside your web browser using client-side JavaScript. Your confidential documents, code snippets, notes, and emails never leave your device.'
    },
    {
      q: 'Can I convert large documents or code files?',
      a: 'Yes. The engine runs optimized native string algorithms that comfortably process thousands of lines of text in milliseconds without lag or freezing.'
    },
    {
      q: 'Can I download my converted text?',
      a: 'Yes. Click the "Download" button in the Converted Text panel header to instantly save your result as a clean UTF-8 .txt file.'
    },
    {
      q: 'Does this tool work on mobile devices?',
      a: 'Yes. The responsive layout is fully optimized for all mobile screen sizes (from 320px up to 1440px desktop screens) with touch-friendly buttons, responsive textareas, and horizontal-scroll protection.'
    }
  ];

  // Case comparison table data
  const caseComparisonList = [
    {
      name: 'UPPERCASE',
      example: 'HELLO WORLD EXAMPLE',
      useCase: 'Headlines, warnings, acronyms, and emphasis',
      syntax: 'ALL CAPS'
    },
    {
      name: 'lowercase',
      example: 'hello world example',
      useCase: 'Clean text normalization, email addresses, search queries',
      syntax: 'all small'
    },
    {
      name: 'Title Case',
      example: 'The Quick Brown Fox Jumps over the Lazy Dog',
      useCase: 'Articles, books, blog titles, and academic headings',
      syntax: 'Principal Words Caps'
    },
    {
      name: 'Sentence case',
      example: 'Hello world. This is a sentence example.',
      useCase: 'Normal writing, body paragraphs, and professional emails',
      syntax: 'First letter of sentence caps'
    },
    {
      name: 'Capitalize Each Word',
      example: 'Hello World Example',
      useCase: 'Form fields, names, product labels, and start case',
      syntax: 'Every single word caps'
    },
    {
      name: 'Capitalize First',
      example: 'Hello world example',
      useCase: 'Only very first character of the entire text',
      syntax: 'First letter only'
    },
    {
      name: 'camelCase',
      example: 'helloWorldExample',
      useCase: 'JavaScript, TypeScript, Java variables and methods',
      syntax: 'firstWordLowerNextWordsCap'
    },
    {
      name: 'PascalCase',
      example: 'HelloWorldExample',
      useCase: 'Classes, types, components in C#, React, TypeScript',
      syntax: 'AllWordsCapNoSpaces'
    },
    {
      name: 'snake_case',
      example: 'hello_world_example',
      useCase: 'Python variables, SQL database table columns, PHP',
      syntax: 'lowercase_with_underscores'
    },
    {
      name: 'kebab-case',
      example: 'hello-world-example',
      useCase: 'URL slugs, CSS classes, HTML attributes, package names',
      syntax: 'lowercase-with-hyphens'
    },
    {
      name: 'CONSTANT_CASE',
      example: 'HELLO_WORLD_EXAMPLE',
      useCase: 'Environment variables, global constants, Enum keys',
      syntax: 'UPPERCASE_WITH_UNDERSCORES'
    },
    {
      name: 'dot.case',
      example: 'hello.world.example',
      useCase: 'Configuration keys, dot notation properties, i18n keys',
      syntax: 'lowercase.with.dots'
    },
    {
      name: 'path/case',
      example: 'hello/world/example',
      useCase: 'File system paths, routing paths, URL sub-segments',
      syntax: 'lowercase/with/slashes'
    },
    {
      name: 'space case',
      example: 'hello world example',
      useCase: 'Tokenized words separated by standard single spaces',
      syntax: 'words with spaces'
    },
    {
      name: 'aLtErNaTiNg CaSe',
      example: 'hElLo WoRlD eXaMpLe',
      useCase: 'SpongeBob mock meme text, social media parody',
      syntax: 'Alternating characters'
    },
    {
      name: 'iNVERSE cASE',
      example: 'hELLO wORLD (from Hello World)',
      useCase: 'Accidental Caps Lock fixing, character case toggling',
      syntax: 'Toggles each letter'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      {/* 1. TOP BREADCRUMB */}
      <Breadcrumb
        categorySlug={category?.slug || 'text-tools'}
        categoryName={category?.name || 'Text Tools'}
        toolName="Text Case Converter"
      />

      {/* 2. HEADER INFO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
            <span className="font-semibold text-[#EC4899]">{category?.name || 'Text Tools'}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% In-Browser &amp; Private
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#854D0E] dark:text-[#FACC15]">
              <Zap className="w-3.5 h-3.5" />
              Instant Processing
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
            Text Case Converter
          </h1>

          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
            Convert text between uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Clean extra spaces, line breaks and messy copied formatting in seconds.
          </p>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(tool.slug)}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            favored
              ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
              : 'border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#71717A] hover:border-[#EC4899]'
          }`}
          title={favored ? 'Remove from favorites' : 'Save tool'}
        >
          <Bookmark className={`w-4 h-4 ${favored ? 'fill-current text-[#EC4899]' : ''}`} />
          <span>{favored ? 'Saved' : 'Save Tool'}</span>
        </button>
      </div>

      {/* 3. INTERACTIVE CONVERTER TOOL COMPONENT */}
      <div className="mb-12">
        <TextCaseConverterTool />
      </div>

      {/* 4. HOW TO USE (STEP BY STEP) */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#EC4899]" />
          How to Use the Text Case Converter (Step-by-Step)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">1</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Paste or Type Text</h3>
            <p>Paste your raw text into the input panel, click "Paste" to read from your clipboard, or click "Sample" to explore realistic formatting examples.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">2</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Choose Case or Clean</h3>
            <p>Select any of the 16 conversion modes (Title Case, Sentence case, camelCase, snake_case, etc.) or click "Clean Copied Text" to unwrap broken PDF line wraps.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">3</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Copy or Download</h3>
            <p>Review the converted text in the right-hand panel, inspect live character/word statistics, and click "Copy Converted Text" or "Download" as a .txt file.</p>
          </div>
        </div>
      </section>

      {/* 5. WHAT IS THIS TOOL & WHY IT'S DIFFERENT */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-5 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          What Is This Tool &amp; Why It's Built Differently
        </h2>

        <div className="prose prose-sm dark:prose-invert max-w-none text-[#71717A] dark:text-[#A1A1AA] space-y-4 text-xs sm:text-sm leading-relaxed">
          <p>
            Most online case converters are rudimentary tools built years ago: they only toggle between simple uppercase and lowercase, or use naive scripts that capitalize every single word and call it "Title Case."
          </p>
          <p>
            RajToolBox was engineered specifically to solve the broader text formatting frustrations that professionals, students, and software developers face daily:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose pt-2">
            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-[#F4F4F5] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Intelligent Grammar-Aware Title Casing</span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Recognizes minor prepositions and conjunctions (such as <em>in</em>, <em>of</em>, <em>the</em>, <em>and</em>, <em>with</em>) and leaves them lowercase unless they appear at the very start or end of a headline.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-[#F4F4F5] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Specialized PDF &amp; Copied Text Cleaner</span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                PDFs break text into arbitrary visual lines. Our cleaner unwraps broken lines into fluid paragraphs while preserving true double-break section divisions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-[#F4F4F5] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Robust Developer Naming Tokenizer</span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Converts existing camelCase, PascalCase, snake_case, and kebab-case without creating unwanted duplicate underscores or dashes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-[#F4F4F5] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>100% Client-Side Privacy</span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Every character transformation executes locally in your device's memory. No text is ever uploaded to a remote cloud or database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CASE COMPARISON TABLE */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#EC4899]" />
          Comprehensive Case Conversion Reference Table
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
          Compare all 16 supported case formats, their output syntax, and primary professional applications:
        </p>

        <div className="overflow-x-auto rounded-2xl border border-[#E4E4E7] dark:border-[#27272A]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFFDF7] dark:bg-[#202026] text-[#18181B] dark:text-[#F4F4F5] font-black border-b border-[#E4E4E7] dark:border-[#27272A]">
              <tr>
                <th className="p-3">Case Format</th>
                <th className="p-3">Sample Output</th>
                <th className="p-3 hidden sm:table-cell">Syntax Rule</th>
                <th className="p-3">Common Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#D4D4D8]">
              {caseComparisonList.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF5FF]/40 dark:hover:bg-[#202026]/60 transition-colors">
                  <td className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5] whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-[#EC4899] dark:text-[#F472B6]">
                    {item.example}
                  </td>
                  <td className="p-3 hidden sm:table-cell text-[11px]">
                    {item.syntax}
                  </td>
                  <td className="p-3 text-[11px]">
                    {item.useCase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. REAL LIFE EXAMPLES */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-[#854D0E] dark:text-[#FACC15]" />
          Real-World Formatting Problems &amp; Solutions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#EC4899] uppercase tracking-wider block">Example 1: Accidental All-Caps Document</span>
            <div className="p-2 rounded-lg bg-white dark:bg-[#18181B] font-mono text-[11px] text-[#71717A]">
              BEFORE: "PLEASE FIND ATTACHED THE QUARTERLY FINANCIAL REPORT. IT MUST BE SUBMITTED BY FRIDAY."
            </div>
            <div className="p-2 rounded-lg bg-[#DCFCE7] dark:bg-[#16A34A]/20 font-mono text-[11px] text-[#16A34A] dark:text-[#4ADE80]">
              AFTER (Sentence Case): "Please find attached the quarterly financial report. It must be submitted by Friday."
            </div>
            <p className="text-[#71717A]">Saves retyping urgent emails or work communications accidentally drafted with Caps Lock enabled.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#EC4899] uppercase tracking-wider block">Example 2: Broken PDF Line Wrapping</span>
            <div className="p-2 rounded-lg bg-white dark:bg-[#18181B] font-mono text-[11px] text-[#71717A] whitespace-pre-line">
              BEFORE: {"This document outlines the\ncomprehensive strategies required\nfor international market expansion."}
            </div>
            <div className="p-2 rounded-lg bg-[#DCFCE7] dark:bg-[#16A34A]/20 font-mono text-[11px] text-[#16A34A] dark:text-[#4ADE80]">
              AFTER (Clean Copied Text): "This document outlines the comprehensive strategies required for international market expansion."
            </div>
            <p className="text-[#71717A]">Unwraps fragmented lines into clean sentences ready to paste into Microsoft Word or Google Docs.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#EC4899] uppercase tracking-wider block">Example 3: Programming Variable Refactoring</span>
            <div className="p-2 rounded-lg bg-white dark:bg-[#18181B] font-mono text-[11px] text-[#71717A]">
              BEFORE: "user profile verification token"
            </div>
            <div className="p-2 rounded-lg bg-[#DCFCE7] dark:bg-[#16A34A]/20 font-mono text-[11px] text-[#16A34A] dark:text-[#4ADE80]">
              AFTER (camelCase): "userProfileVerificationToken"<br />
              AFTER (snake_case): "user_profile_verification_token"<br />
              AFTER (CONSTANT_CASE): "USER_PROFILE_VERIFICATION_TOKEN"
            </div>
            <p className="text-[#71717A]">Instantly prepares database table column names, API variables, and configuration constants.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#EC4899] uppercase tracking-wider block">Example 4: Blog Post &amp; YouTube Headline</span>
            <div className="p-2 rounded-lg bg-white dark:bg-[#18181B] font-mono text-[11px] text-[#71717A]">
              BEFORE: "the ultimate guide on how to learn web development in 2026"
            </div>
            <div className="p-2 rounded-lg bg-[#DCFCE7] dark:bg-[#16A34A]/20 font-mono text-[11px] text-[#16A34A] dark:text-[#4ADE80]">
              AFTER (Title Case): "The Ultimate Guide on How to Learn Web Development in 2026"
            </div>
            <p className="text-[#71717A]">Enforces professional publishing standards with accurate stop-word capitalization.</p>
          </div>
        </div>
      </section>

      {/* 8. COMMON MISTAKES TO AVOID */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          Common Formatting Mistakes &amp; Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#71717A] dark:text-[#A1A1AA]">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1.5">
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">1. Capitalizing Every Word in Titles</h3>
            <p>
              Capitalizing minor words like "of", "the", and "and" in the middle of a title looks amateurish. Always use true Title Case for articles, books, and essays.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1.5">
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">2. Leaving Hard Breaks From PDFs</h3>
            <p>
              Copying directly from a PDF into Word leaves invisible line breaks that disrupt automatic paragraph wrapping on mobile screens and responsive web pages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1.5">
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">3. Mixing Snake and Camel Case</h3>
            <p>
              Inconsistent naming in software projects creates bugs and hurts code readability. Convert legacy variables cleanly to match your language style guide.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#EC4899]" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden bg-[#FFFDF7] dark:bg-[#202026] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-[#EC4899]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#71717A]" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed border-t border-[#E4E4E7]/60 dark:border-[#27272A]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. RELATED TOOLS */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
          Related Productivity &amp; Text Utilities
        </h2>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
          Explore complementary tools in the RajToolBox suite to format, count, encode, and validate your text:
        </p>
        <div className="pt-2">
          <RelatedTools currentTool={tool} />
        </div>
      </section>

      {/* 11. AUTHOR & TRUST SECTION */}
      <div className="mb-8">
        <AuthorBox />
      </div>

      {/* 12. PAGE-LEVEL SHARE BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA]">
          <Share2 className="w-4 h-4 text-[#EC4899]" />
          <span>Found this tool useful? Share it with your friends or colleagues!</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] font-semibold cursor-pointer transition-all"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{linkCopied ? 'Copied' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={shareNative}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC4899] text-white hover:bg-[#db2777] font-semibold cursor-pointer transition-all shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
