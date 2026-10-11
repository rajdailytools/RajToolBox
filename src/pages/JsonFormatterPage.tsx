import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { JsonFormatterWorkspace } from '../tools/components/JsonFormatterWorkspace';
import { AuthorBox } from '../components/ui/AuthorBox';
import { RelatedTools } from '../components/ui/RelatedTools';
import {
  FileCode,
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
  FolderTree,
  GitCompare,
  FileCheck2,
  Code2,
  Info,
  CheckSquare,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface JsonFormatterPageProps {
  tool: ToolItem;
}

export const JsonFormatterPage: React.FC<JsonFormatterPageProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const category = CATEGORIES[tool.category] || CATEGORIES['developer-tools'];
  const favored = isFavorite(tool.slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeEdgeCase, setActiveEdgeCase] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Sync document title and canonical meta for SEO
  useEffect(() => {
    document.title = 'JSON Formatter & Validator – Beautify, Minify and Check JSON | RajToolBox';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Format, beautify, validate, minify and compare JSON online. Find syntax errors, explore nested JSON in tree view and download readable results with RajToolBox.'
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://rajtoolbox.com/tools/json-formatter/');
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
          title: 'JSON Formatter & Validator – RajToolBox',
          text: 'Format, beautify, validate, minify, explore tree view and compare JSON data 100% locally in your browser.',
          url: window.location.href
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  // Comprehensive FAQ list based on user research (Google autocomplete, People Also Ask, Reddit, Quora)
  const faqs = [
    {
      q: 'What is a JSON formatter and what does it do?',
      a: 'A JSON formatter (also known as a JSON beautifier or prettifier) is a developer utility that parses compact, minified, or disorganized JSON data and formats it into clean, indented, human-readable text. It aligns nested keys, indents arrays and child objects using 2 spaces, 4 spaces, or tabs, making large payloads easy to inspect and debug.'
    },
    {
      q: 'What is a JSON validator and how does it verify syntax?',
      a: 'A JSON validator checks raw text strictly against the RFC 8259 JSON data interchange specification. It parses the document token by token, verifying that keys are enclosed in double quotes, delimiters (brackets and braces) are matched, commas separate elements without trailing duplicates, and data types (strings, numbers, booleans, null, arrays, objects) conform to the grammar.'
    },
    {
      q: 'What is the difference between JSON formatting, validation, and minification?',
      a: 'Formatting adds indentation whitespace and line breaks to make JSON human-readable. Validation verifies whether the string follows valid JSON syntax rules without modifying its contents. Minification removes all unnecessary whitespace, newlines, and tabs outside of string literals, shrinking byte size for fast network transmission and API payload delivery.'
    },
    {
      q: 'How does RajToolBox locate and highlight syntax errors?',
      a: 'When invalid JSON is supplied, our diagnostic engine captures the exact syntax error, calculates the precise line number and column position, and displays a contextual code excerpt with an arrow caret pointing directly to the offending character. It also diagnoses the probable cause (such as a trailing comma, single quotes, or an unquoted key) and provides a safe fix suggestion.'
    },
    {
      q: 'Is it safe to paste confidential API responses, customer records, or JWT payloads here?',
      a: 'Yes, 100% safe. RajToolBox performs all parsing, validation, formatting, minification, tree rendering, and diffing locally inside your browser using client-side JavaScript. Your confidential records, production tokens, credentials, and API responses never travel across the internet and are never logged, tracked, or saved to any remote server.'
    },
    {
      q: 'Can standard JSON contain JavaScript comments (// or /* */)?',
      a: 'No. The official JSON specification (RFC 8259) strictly prohibits comments. Douglas Crockford explicitly omitted comments from JSON to prevent people from using comments to hold parsing directives. If you paste JSON containing comments, our validator flags them and our Safe Fix Assistant offers to strip them cleanly.'
    },
    {
      q: 'Can JSON contain single-quoted strings or single-quoted keys?',
      a: 'No. In JSON, all string literals and object property keys must be surrounded by standard ASCII double quotes ("). Single quotes (\'), backticks (`), and unquoted keys (like {name: "Raj"}) are valid in JavaScript object literals, but are illegal in standard JSON.'
    },
    {
      q: 'Why does my JSON fail validation due to a trailing comma?',
      a: 'Standard JSON does not permit trailing commas after the final element in an array [1, 2,] or the final key-value pair in an object {"a": 1,}. A trailing comma violates RFC 8259 grammar and triggers an "Unexpected token" syntax error in strict parsers.'
    },
    {
      q: 'Can JSON contain undefined, NaN, or Infinity?',
      a: 'No. Standard JSON only supports strings, numbers (finite decimals and integers), booleans (true, false), null, arrays, and objects. In JavaScript, JSON.stringify() converts NaN and Infinity into null, and strips undefined properties altogether.'
    },
    {
      q: 'How does the Interactive Tree View work?',
      a: 'The Tree View parses the JSON into an interactive visual hierarchy. You can expand and collapse individual objects or arrays, use "Expand All" or "Collapse All", inspect data types via color badges, see child counts at a glance (e.g. "[12 items]"), search nodes, and copy any individual value or exact JSON Path (e.g. $.user.profile.roles[0]) with one click.'
    },
    {
      q: 'How does Semantic JSON Comparison (Diff) differ from a regular line text diff?',
      a: 'A standard text diff simply compares strings line-by-line, which causes false differences if keys are formatted with different indentation or in a different order. RajToolBox semantic diff parses both structures into object models and compares them mathematically, identifying genuinely added keys, removed keys, changed values, and type mutations regardless of formatting whitespace.'
    },
    {
      q: 'What is JSON Schema validation and which drafts are supported?',
      a: 'JSON Schema is a vocabulary for annotating and validating the structure, constraints, and data types of a JSON document. Our built-in schema validator evaluates Draft-07, Draft-04, and Draft 2020-12 rules, verifying property types, required fields, numeric bounds (minimum, maximum), string patterns (regex, email), enums, and allowed additional properties.'
    },
    {
      q: 'How can I format large JSON files without freezing my browser tab?',
      a: 'For files up to several megabytes, RajToolBox processes data smoothly using native JSON.parse and JSON.stringify. For very large payloads (50MB+), client-side memory limits may apply. We recommend closing unneeded browser tabs and formatting in 2-space mode, which generates the lowest string allocation overhead.'
    },
    {
      q: 'How do I format an API response copied from Chrome DevTools or Postman?',
      a: 'Simply paste the raw response payload into the editor and click "Format (Beautify)". If the response was returned as an escaped string (e.g. "{\\"status\\":\\"ok\\"}"), click the "Unescape String" utility button at the bottom of the editor to restore the clean object structure.'
    },
    {
      q: 'Can I format JSON directly in VS Code?',
      a: 'Yes. In Visual Studio Code, you can open any document, set its language mode to JSON, and press Shift + Alt + F (Windows/Linux) or Shift + Option + F (macOS) to format. However, if your JSON has syntax errors, VS Code will refuse to format until errors are resolved; RajToolBox helps you pinpoint and fix those errors first.'
    },
    {
      q: 'How do I format JSON using Python in the command line?',
      a: 'In Python, you can format JSON from the command line using: python -m json.tool input.json output.json. In Python code, use import json; print(json.dumps(data, indent=2, sort_keys=True)).'
    },
    {
      q: 'What does "Unexpected token in JSON at position X" mean?',
      a: 'This standard V8 JavaScript engine error means the parser encountered a character that violates grammar at character offset X. Common culprits include a missing colon between key and value, a missing comma between list items, an unclosed quote, or an unescaped control character like a raw newline inside a string.'
    },
    {
      q: 'Does sorting object keys change the meaning of a JSON document?',
      a: 'Semantically, JSON objects are defined as unordered collections of name-value pairs, so sorting keys alphabetically does not change document meaning in standard APIs. However, some specific downstream systems rely on key order. For this reason, the "Sort Keys" toggle in RajToolBox is OFF by default and purely optional.'
    },
    {
      q: 'Can duplicate keys exist in a JSON object?',
      a: 'According to RFC 8259, names within an object SHOULD be unique. While the specification does not strictly forbid duplicates at the syntax level, ECMAScript JSON.parse() automatically overwrites previous keys with the last key encountered, which can silently discard data. RajToolBox warns users about syntax and structure to prevent accidental data loss.'
    },
    {
      q: 'Can I download the formatted JSON or copy it with a single click?',
      a: 'Yes. Click "Copy JSON" to copy the formatted text directly to your clipboard, or click "Download .json" to export the formatted document as a ready-to-use file with an appropriate timestamped filename.'
    }
  ];

  // Technical edge cases
  const edgeCases = [
    {
      title: '1. BigInt and Large 64-Bit Integers',
      what: 'Numbers larger than 2^53 - 1 (e.g. 9007199254740993 or 64-bit database IDs like Twitter snowflake IDs) lose precision.',
      why: 'Standard IEEE 754 double-precision floating-point numbers in JavaScript and JSON can only safely represent integers up to Number.MAX_SAFE_INTEGER (9,007,199,254,740,991).',
      action: 'Always transmit 64-bit integer IDs as strings in REST APIs (e.g., {"id": "9007199254740993"}) to prevent silent truncation.'
    },
    {
      title: '2. Escaped Characters Inside Strings',
      what: 'String values containing escaped double quotes (\\"), backslashes (\\\\), or newlines (\\n).',
      why: 'When JSON is serialized, the backslash is an escape character. Removing slashes blindly corrupts string literals.',
      action: 'Our engine preserves all standard JSON escape sequences (\\", \\\\, \\/, \\b, \\f, \\n, \\r, \\t, \\uXXXX) without mangling text content.'
    },
    {
      title: '3. UTF-8 Characters and Emojis',
      what: 'International Unicode text (Hindi, Chinese, Cyrillic, Arabic) and multi-byte emojis (🚀, ✨, 🇮🇳).',
      why: 'Improper character encoding can turn multi-byte UTF-8 bytes into broken question mark symbols (mojibake).',
      action: 'RajToolBox uses native UTF-8 TextEncoder and Blob handlers to guarantee 100% faithful representation of all Unicode characters.'
    },
    {
      title: '4. Non-Object Root Values',
      what: 'A JSON document consisting of a single string "hello", number 42, boolean true, or null.',
      why: 'Early JSON RFCs required the root to be an object or array, but RFC 8259 explicitly allows any JSON value as the root.',
      action: 'Our parser fully supports primitive root values as compliant JSON documents.'
    },
    {
      title: '5. Circular References in JavaScript Objects',
      what: 'Attempting to format objects where a property points back to a parent object.',
      why: 'JSON data format is strictly acyclic; it cannot represent circular graphs or memory pointers.',
      action: 'Ensure input represents pure hierarchical data without circular parent references.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      {/* 1. BREADCRUMBS */}
      <Breadcrumb
        categorySlug={category?.slug || 'developer-tools'}
        categoryName={category?.name || 'Developer Tools'}
        toolName="JSON Formatter & Validator"
      />

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
            <span className="font-semibold text-[#EC4899]">Developer Tools</span>
            <span aria-hidden="true">&bull;</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% In-Browser &amp; Private
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              RFC 8259 Compliant
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="inline-flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-[#2563EB]" />
              Zero Server Uploads
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
            JSON Formatter &amp; Validator
          </h1>

          <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
            Format, beautify, validate, minify, and compare JSON data with real-time syntax error detection. Explore complex nested data in our interactive Tree View and test against JSON Schema with zero server latency.
          </p>
        </div>

        <button
          onClick={() => toggleFavorite(tool.slug)}
          className={`shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            favored
              ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
              : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${favored ? 'fill-[#EC4899]' : ''}`} />
          <span>{favored ? 'Saved' : 'Save Tool'}</span>
        </button>
      </div>

      {/* 3. CORE WORKSPACE CARD */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl shadow-sm p-6 sm:p-8 mb-10">
        <JsonFormatterWorkspace />
      </div>

      {/* 4. VISUAL PIPELINE FLOWCHART */}
      <section className="my-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-[#EC4899] block mb-1">
            Execution Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            How JSON Processing Works Locally
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
            A secure, zero-latency pipeline executed strictly within your web browser&apos;s JavaScript V8/SpiderMonkey engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] relative">
            <div className="w-7 h-7 rounded-lg bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs mb-3">
              1
            </div>
            <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-1">
              Input Ingestion
            </h3>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Paste raw JSON, load a sample dataset, or upload a .json file. No data ever leaves your device.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] relative">
            <div className="w-7 h-7 rounded-lg bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs mb-3">
              2
            </div>
            <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-1">
              Syntax Parsing
            </h3>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Token stream is checked against RFC 8259. Errors pinpoint exact line, column, and character offset.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] relative">
            <div className="w-7 h-7 rounded-lg bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs mb-3">
              3
            </div>
            <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-1">
              Transformation &amp; Diff
            </h3>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Apply 2/4-space beautification, minify to save network bandwidth, inspect Tree View, or run semantic diff.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] relative">
            <div className="w-7 h-7 rounded-lg bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs mb-3">
              4
            </div>
            <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-1">
              Verified Export
            </h3>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              One-click copy to clipboard, code string escaping, or instant download of formatted .json files.
            </p>
          </div>
        </div>
      </section>

      {/* 5. STEP-BY-STEP HOW TO USE */}
      <section className="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#EC4899]" />
          How to Use the JSON Formatter &amp; Validator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
            <div className="w-6 h-6 rounded-full bg-[#FACC15] text-[#18181B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-0.5">
                Paste or Upload Your JSON
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Paste raw API output, configuration code, or upload a .json file directly from your computer using the Upload button.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
            <div className="w-6 h-6 rounded-full bg-[#FACC15] text-[#18181B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-0.5">
                Inspect Real-Time Validation
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                The status pill instantly indicates whether your JSON is RFC 8259 valid. If an error is detected, review the line, column, and code caret.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
            <div className="w-6 h-6 rounded-full bg-[#FACC15] text-[#18181B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-0.5">
                Format, Minify or Switch to Tree View
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Choose between 2 Spaces, 4 Spaces, or Tabs. Switch tabs to explore hierarchical nodes in Tree View, compare versions, or validate schemas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
            <div className="w-6 h-6 rounded-full bg-[#FACC15] text-[#18181B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] mb-0.5">
                Copy or Download Output
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Click &quot;Copy JSON&quot; for instant clipboard access or &quot;Download .json&quot; to save the formatted result directly to your disk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHAT IS JSON FORMATTING & VALIDATION */}
      <section className="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
            What is JSON Formatting?
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            JSON (JavaScript Object Notation) is the ubiquitous lightweight data-interchange format of modern web APIs, microservices, mobile apps, and distributed databases. When transmitted over HTTP, JSON payloads are typically minified into a single continuous stream of characters without spaces or newlines to minimize bandwidth consumption.
          </p>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed mt-2">
            <strong>JSON formatting</strong> (also referred to as beautifying or pretty-printing) reconstructs this dense character stream into a structured, readable hierarchy. By placing each key-value pair on a dedicated line and indenting nested levels consistently, developers can quickly inspect nested arrays, check schema properties, and spot syntax abnormalities at a glance.
          </p>
        </div>

        <div className="border-t border-[#E4E4E7] dark:border-[#27272A] pt-6">
          <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
            What is JSON Validation?
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            While JSON originated from JavaScript object literal syntax, it is a strict subset with uncompromising grammar rules codified in <strong>IETF RFC 8259</strong> and <strong>ECMA-404</strong>. JavaScript engines frequently tolerate unquoted keys, single quotes, trailing commas, and inline comments in object declarations. Standard JSON, however, strictly prohibits all four.
          </p>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed mt-2">
            A <strong>JSON validator</strong> evaluates the string against these strict grammatical constraints. When any character violates the grammar—such as a missing closing bracket, single quotation marks, or an unquoted identifier—the parser halts immediately and returns an error indicating why and where the document broke.
          </p>
        </div>
      </section>

      {/* 7. COMPARISON TABLE: FORMATTING VS VALIDATION VS MINIFICATION */}
      <section className="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4">
          Formatting vs. Validation vs. Minification
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">
                <th className="py-3 px-3 font-bold">Feature / Aspect</th>
                <th className="py-3 px-3 font-bold text-[#EC4899]">JSON Formatter</th>
                <th className="py-3 px-3 font-bold text-[#2563EB]">JSON Validator</th>
                <th className="py-3 px-3 font-bold text-[#16A34A]">JSON Minifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#52525B] dark:text-[#D4D4D8]">
              <tr>
                <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Primary Purpose</td>
                <td className="py-3 px-3">Enhances visual human readability</td>
                <td className="py-3 px-3">Verifies RFC 8259 syntax compliance</td>
                <td className="py-3 px-3">Minimizes file size &amp; bandwidth</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Whitespace &amp; Indents</td>
                <td className="py-3 px-3">Adds 2-space, 4-space, or tab indentation</td>
                <td className="py-3 px-3">Ignores formatting whitespace</td>
                <td className="py-3 px-3">Strips all formatting whitespace completely</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Error Diagnosis</td>
                <td className="py-3 px-3">Fails gracefully if invalid</td>
                <td className="py-3 px-3">Pinpoints line, column, caret excerpt</td>
                <td className="py-3 px-3">Fails if invalid syntax is present</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Data Semantics</td>
                <td className="py-3 px-3">Preserves 100% of data values &amp; types</td>
                <td className="py-3 px-3">Preserves original without altering</td>
                <td className="py-3 px-3">Preserves 100% of data values &amp; types</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Best Used For</td>
                <td className="py-3 px-3">Debugging APIs, code review, documentation</td>
                <td className="py-3 px-3">CI/CD pipelines, API testing, ingest checks</td>
                <td className="py-3 px-3">Production HTTP responses, caching</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. COMMON JSON ERRORS & HOW TO FIX THEM */}
      <section className="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#EC4899] block mb-1">
            Troubleshooting Guide
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            How to Fix the 6 Most Common JSON Syntax Errors
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Understanding why strict parsers reject common patterns copied from JavaScript or Python.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Error 1 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>1. Trailing Commas in Objects or Arrays</span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              <strong>The Problem:</strong> A comma left after the last element (e.g. <code>[1, 2, 3,]</code> or <code>&#123;&quot;id&quot;: 1,&#125;</code>).
            </p>
            <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] leading-relaxed">
              <strong>The Fix:</strong> Remove the final comma immediately before the closing <code>&#125;</code> or <code>]</code>.
            </p>
          </div>

          {/* Error 2 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>2. Single Quotes Instead of Double Quotes</span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              <strong>The Problem:</strong> Wrapping keys or string literals in single quotes (e.g. <code>&#123;&apos;status&apos;: &apos;active&apos;&#125;</code>).
            </p>
            <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] leading-relaxed">
              <strong>The Fix:</strong> Convert all single quotes to standard ASCII double quotes (<code>&quot;</code>).
            </p>
          </div>

          {/* Error 3 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>3. Unquoted Object Keys</span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              <strong>The Problem:</strong> Declaring object properties like JavaScript identifiers (e.g. <code>&#123;name: &quot;Raj&quot;&#125;</code>).
            </p>
            <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] leading-relaxed">
              <strong>The Fix:</strong> Enclose all key names in double quotes: <code>&#123;&quot;name&quot;: &quot;Raj&quot;&#125;</code>.
            </p>
          </div>

          {/* Error 4 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>4. Comments in Standard JSON</span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              <strong>The Problem:</strong> Adding inline <code>// comment</code> or multi-line <code>/* comment */</code> blocks.
            </p>
            <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] leading-relaxed">
              <strong>The Fix:</strong> Remove all comments. Standard JSON RFC 8259 forbids comments completely.
            </p>
          </div>

          {/* Error 5 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>5. Missing Commas Between Elements</span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              <strong>The Problem:</strong> Forgetting a comma between consecutive object keys or array items.
            </p>
            <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] leading-relaxed">
              <strong>The Fix:</strong> Insert a comma between each pair of values or object properties.
            </p>
          </div>

          {/* Error 6 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>6. Using NaN, undefined or Infinity</span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              <strong>The Problem:</strong> Non-standard numerical constants like <code>&#123;&quot;val&quot;: NaN&#125;</code> or <code>undefined</code>.
            </p>
            <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] leading-relaxed">
              <strong>The Fix:</strong> Substitute with <code>null</code> or a string equivalent representation.
            </p>
          </div>
        </div>
      </section>

      {/* 9. TECHNICAL EDGE CASES ACCORDION */}
      <section className="my-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#EC4899] block mb-1">
            Edge Cases &amp; Limitations
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            Engineering Deep Dive: Edge Cases &amp; Specifications
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Real-world nuances encountered when dealing with 64-bit integers, Unicode escapes, and cyclic graphs.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {edgeCases.map((ec, idx) => {
            const isOpen = activeEdgeCase === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden bg-[#FFFDF7] dark:bg-[#121215]"
              >
                <button
                  onClick={() => setActiveEdgeCase(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899]"
                >
                  <span>{ec.title}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-[#EC4899]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#71717A]" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-[#71717A] dark:text-[#A1A1AA] space-y-2 border-t border-[#E4E4E7]/60 dark:border-[#27272A]/60">
                    <p>
                      <strong>Symptom:</strong> {ec.what}
                    </p>
                    <p>
                      <strong>Underlying Technical Reason:</strong> {ec.why}
                    </p>
                    <p className="text-[#16A34A] dark:text-[#4ADE80]">
                      <strong>Best Practice:</strong> {ec.action}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#EC4899]" />
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
          Clear, practical answers addressing common formatting, schema validation, and debugging questions.
        </p>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden bg-[#FFFDF7] dark:bg-[#121215] transition-all"
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

      {/* 11. RELATED TOOLS */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-black text-[#18181B] dark:text-[#F4F4F5]">
          Related Developer &amp; Converter Utilities
        </h2>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
          Explore complementary tools in the RajToolBox suite to convert, encode, decode, and transform datasets:
        </p>
        <div className="pt-2">
          <RelatedTools currentTool={tool} />
        </div>
      </section>

      {/* 12. AUTHOR BOX */}
      <div className="mb-8">
        <AuthorBox />
      </div>

      {/* 13. SHARE & COPY LINK */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA]">
          <Share2 className="w-4 h-4 text-[#EC4899]" />
          <span>Found this JSON tool helpful? Share it with fellow developers and engineers!</span>
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
