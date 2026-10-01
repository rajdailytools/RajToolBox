import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Trash2, Check, ArrowRightLeft, AlignLeft } from 'lucide-react';

// WORD & CHARACTER COUNTER
export const WordCounterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [text, setText] = useState(
    'RajToolBox is a practical online tools platform built to deliver fast, browser-based utilities for everyday digital tasks. All calculations and text processing happen securely on your machine.'
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
  const readingTime = Math.ceil(words / 200);
  const speakingTime = Math.ceil(words / 130);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Words</span>
          <span className="text-xl font-bold text-[#EC4899]">{words}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Characters</span>
          <span className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">{chars}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">No Spaces</span>
          <span className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">{charsNoSpaces}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Sentences</span>
          <span className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">{sentences}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-center">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Paragraphs</span>
          <span className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">{paragraphs}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#FACC15]/40 text-center">
          <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">Read Time</span>
          <span className="text-xl font-bold text-[#854D0E] dark:text-[#FACC15]">~{readingTime}m</span>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Type or paste your text here to analyze statistics..."
          className="w-full p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] text-sm leading-relaxed focus:outline-none focus:border-[#EC4899]"
        />
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#71717A]">
            Speaking time: ~{speakingTime} min (at 130 WPM speech rate)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(text);
                showToast('Copied text to clipboard!', 'success');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold hover:border-[#EC4899]"
            >
              <Copy className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Copy</span>
            </button>
            <button
              onClick={() => setText('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CASE CONVERTER
export const CaseConverterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [text, setText] = useState('powerful online tools. simple to use everyday.');

  const toTitleCase = (str: string) => {
    const minorWords = ['and', 'as', 'but', 'for', 'if', 'nor', 'or', 'so', 'yet', 'a', 'an', 'the', 'at', 'by', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via'];
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !minorWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str.toLowerCase().trim().replace(/[\s\W-]+/g, '_');
  };

  const toKebabCase = (str: string) => {
    return str.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  };

  const applyCase = (type: string) => {
    if (!text) return;
    let converted = text;
    if (type === 'upper') converted = text.toUpperCase();
    if (type === 'lower') converted = text.toLowerCase();
    if (type === 'title') converted = toTitleCase(text);
    if (type === 'sentence') converted = toSentenceCase(text);
    if (type === 'camel') converted = toCamelCase(text);
    if (type === 'snake') converted = toSnakeCase(text);
    if (type === 'kebab') converted = toKebabCase(text);
    setText(converted);
    showToast(`Converted to ${type.toUpperCase()} case!`, 'success');
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] text-sm focus:outline-none focus:border-[#EC4899]"
        placeholder="Type or paste text to convert casing..."
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => applyCase('upper')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => applyCase('lower')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          lowercase
        </button>
        <button
          onClick={() => applyCase('title')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          Title Case
        </button>
        <button
          onClick={() => applyCase('sentence')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          Sentence case
        </button>
        <button
          onClick={() => applyCase('camel')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          camelCase
        </button>
        <button
          onClick={() => applyCase('snake')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          snake_case
        </button>
        <button
          onClick={() => applyCase('kebab')}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20"
        >
          kebab-case
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!', 'success');
          }}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

// TEXT CLEANER & DUPLICATE LINE REMOVER
export const TextCleanerComponent: React.FC = () => {
  const { showToast } = useApp();
  const [text, setText] = useState("apple\nbanana\n  apple   \norange\nbanana\n\ngrape");

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines.map((l) => l.trim()))).filter((l) => l.length > 0);
    setText(unique.join('\n'));
    showToast(`Removed duplicates (${lines.length - unique.length} lines cleaned)`, 'success');
  };

  const removeExtraSpaces = () => {
    const cleaned = text
      .split('\n')
      .map((l) => l.trim().replace(/\s+/g, ' '))
      .filter((l) => l.length > 0)
      .join('\n');
    setText(cleaned);
    showToast('Extra spaces collapsed', 'success');
  };

  const sortLines = (asc = true) => {
    const lines = text.split('\n').filter((l) => l.length > 0);
    lines.sort((a, b) => (asc ? a.localeCompare(b) : b.localeCompare(a)));
    setText(lines.join('\n'));
    showToast(`Sorted lines ${asc ? 'A to Z' : 'Z to A'}`, 'success');
  };

  const reverseLines = () => {
    const lines = text.split('\n').reverse();
    setText(lines.join('\n'));
    showToast('Reversed line order', 'success');
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] text-xs font-mono focus:outline-none focus:border-[#EC4899]"
        placeholder="Paste lines of text or data..."
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={removeDuplicates}
          className="px-3 py-1.5 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] text-xs font-bold hover:bg-[#FBCFE8]"
        >
          Remove Duplicate Lines
        </button>
        <button
          onClick={removeExtraSpaces}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Remove Extra Spaces
        </button>
        <button
          onClick={() => sortLines(true)}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Sort A &rarr; Z
        </button>
        <button
          onClick={() => sortLines(false)}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Sort Z &rarr; A
        </button>
        <button
          onClick={reverseLines}
          className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Reverse Lines
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            showToast('Cleaned text copied!', 'success');
          }}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EC4899] text-white text-xs font-bold"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

// FIND AND REPLACE
export const FindReplaceComponent: React.FC = () => {
  const { showToast } = useApp();
  const [source, setSource] = useState('RajToolBox provides free tools. Every tool is 100% free.');
  const [findStr, setFindStr] = useState('tool');
  const [replaceStr, setReplaceStr] = useState('utility');
  const [matchCase, setMatchCase] = useState(false);
  const [matchWhole, setMatchWhole] = useState(false);

  const doReplace = () => {
    if (!findStr) return;
    try {
      let pattern = findStr;
      if (!pattern.match(/[.*+?^${}()|[\]\\]/g)) {
        if (matchWhole) pattern = `\\b${pattern}\\b`;
      }
      const flags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(pattern, flags);
      const count = (source.match(regex) || []).length;
      const res = source.replace(regex, replaceStr);
      setSource(res);
      showToast(`Replaced ${count} occurrence(s)!`, 'success');
    } catch (e: any) {
      showToast('Search error: ' + e.message, 'error');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={source}
        onChange={(e) => setSource(e.target.value)}
        rows={5}
        className="w-full p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] text-sm focus:outline-none focus:border-[#EC4899]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">Find</label>
          <input
            type="text"
            value={findStr}
            onChange={(e) => setFindStr(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">Replace With</label>
          <input
            type="text"
            value={replaceStr}
            onChange={(e) => setReplaceStr(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={matchCase}
            onChange={(e) => setMatchCase(e.target.checked)}
            className="accent-[#EC4899]"
          />
          <span>Match Case</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={matchWhole}
            onChange={(e) => setMatchWhole(e.target.checked)}
            className="accent-[#EC4899]"
          />
          <span>Whole Word</span>
        </label>
      </div>

      <button
        onClick={doReplace}
        className="py-2.5 px-6 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
      >
        Replace All
      </button>
    </div>
  );
};

// TEXT DIFF CHECKER
export const TextDiffComponent: React.FC = () => {
  const [t1, setT1] = useState("Alpha\nBravo\nCharlie\nDelta");
  const [t2, setT2] = useState("Alpha\nBravo Modified\nCharlie\nEcho");
  const [diffLines, setDiffLines] = useState<{ type: 'same' | 'added' | 'removed'; text: string }[]>([]);

  const compare = () => {
    const l1 = t1.split('\n');
    const l2 = t2.split('\n');
    const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];
    const maxLen = Math.max(l1.length, l2.length);

    for (let i = 0; i < maxLen; i++) {
      const line1 = l1[i];
      const line2 = l2[i];

      if (line1 === line2) {
        result.push({ type: 'same', text: line1 || '' });
      } else {
        if (line1 !== undefined) {
          result.push({ type: 'removed', text: line1 });
        }
        if (line2 !== undefined) {
          result.push({ type: 'added', text: line2 });
        }
      }
    }
    setDiffLines(result);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Original Text</label>
          <textarea
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            rows={5}
            className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Modified Text</label>
          <textarea
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            rows={5}
            className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <button
        onClick={compare}
        className="py-2.5 px-6 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
      >
        Compare Text Side-by-Side
      </button>

      {diffLines.length > 0 && (
        <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] font-mono text-xs space-y-1">
          {diffLines.map((line, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded flex items-center gap-2 ${
                line.type === 'added'
                  ? 'bg-[#DCFCE7] text-[#166534] dark:bg-[#14532D] dark:text-[#BBF7D0]'
                  : line.type === 'removed'
                  ? 'bg-[#FEE2E2] text-[#991B1B] dark:bg-[#7F1D1D] dark:text-[#FECACA]'
                  : 'text-[#71717A]'
              }`}
            >
              <span className="w-4 font-bold">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// SLUG GENERATOR
export const SlugGeneratorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [title, setTitle] = useState('Quantum Mechanics: 10 Essential Principles & Real-World Applications!');
  const [separator, setSeparator] = useState<'-' | '_'>('-');

  const generateSlug = (str: string, sep: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, sep)
      .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '');
  };

  const slug = generateSlug(title, separator);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
          Input Title or Headline
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5]"
        />
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold">
        <span>Separator:</span>
        <button
          onClick={() => setSeparator('-')}
          className={`px-3 py-1 rounded-lg border ${
            separator === '-' ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]' : ''
          }`}
        >
          Hyphen (-)
        </button>
        <button
          onClick={() => setSeparator('_')}
          className={`px-3 py-1 rounded-lg border ${
            separator === '_' ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]' : ''
          }`}
        >
          Underscore (_)
        </button>
      </div>

      <div className="p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex items-center justify-between">
        <span className="font-mono text-xs sm:text-sm font-bold text-[#EC4899] break-all">{slug}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(slug);
            showToast('Slug copied!', 'success');
          }}
          className="ml-3 shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EC4899] text-white text-xs font-bold"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};
