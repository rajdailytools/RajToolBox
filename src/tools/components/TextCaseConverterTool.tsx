import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Type,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Trash2,
  RotateCcw,
  RotateCw,
  ArrowLeftRight,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ShieldCheck,
  CornerDownLeft,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Code2,
  FileCode,
  Zap,
  AlignLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CaseMode,
  CleanupOptions,
  TextStats,
  convertCase,
  applyCleanup,
  cleanCopiedText,
  computeTextStats,
  SAMPLE_TEXT
} from '../utils/textCaseEngine';

export const TextCaseConverterTool: React.FC = () => {
  const { showToast } = useApp();

  // Core Editor States
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXT);
  const [activeCaseMode, setActiveCaseMode] = useState<CaseMode | null>('title-case');

  // History stack for Undo/Redo
  const [history, setHistory] = useState<string[]>([SAMPLE_TEXT]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Cleanup Options state
  const [showCleanupPanel, setShowCleanupPanel] = useState<boolean>(false);
  const [cleanupOptions, setCleanupOptions] = useState<CleanupOptions>({
    removeExtraSpaces: true,
    trimAllLines: true,
    removeEmptyLines: false,
    collapseBlankLines: true,
    normalizeLineBreaks: true,
    tabsToSpaces: true,
    normalizeQuotes: false,
    normalizeDashes: false,
    removeInvisibleChars: true,
    removeSpacesBeforePunctuation: true
  });

  // Copied Text / PDF options
  const [pdfCleanMode, setPdfCleanMode] = useState<'preserve-paragraphs' | 'join-lines'>('preserve-paragraphs');

  // Active Preset state
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // UI helpers
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Compute converted output dynamically
  const outputText = useMemo(() => {
    if (!inputText) return '';
    let res = inputText;
    if (activeCaseMode) {
      res = convertCase(res, activeCaseMode);
    }
    return res;
  }, [inputText, activeCaseMode]);

  // Compute live stats for both input and output
  const inputStats = useMemo<TextStats>(() => computeTextStats(inputText), [inputText]);
  const outputStats = useMemo<TextStats>(() => computeTextStats(outputText), [outputText]);

  // Push new state to history (debounced/controlled)
  const pushHistory = useCallback(
    (newText: string) => {
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        next.push(newText);
        // keep up to 30 steps
        return next.slice(-30);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 29));
    },
    [historyIndex]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setInputText(history[targetIndex]);
      showToast('Undo applied', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setInputText(history[targetIndex]);
      showToast('Redo applied', 'info');
    }
  };

  // Case conversions
  const handleCaseSelect = (mode: CaseMode) => {
    setActiveCaseMode(mode);
    setActivePreset(null);
    showToast(`Converted to ${mode.replace('-', ' ')}`, 'success');
  };

  // Run cleanup action directly on input text
  const handleRunCleanup = () => {
    if (!inputText) {
      showToast('Please enter text to clean', 'info');
      return;
    }
    const cleaned = applyCleanup(inputText, cleanupOptions);
    setInputText(cleaned);
    pushHistory(cleaned);
    showToast('Text cleaned & normalized', 'success');
  };

  // Run PDF / Copied Text specialized cleanup
  const handleRunPdfCleanup = (mode: 'preserve-paragraphs' | 'join-lines') => {
    if (!inputText) {
      showToast('Please enter text to clean', 'info');
      return;
    }
    const cleaned = cleanCopiedText(inputText, mode);
    setInputText(cleaned);
    pushHistory(cleaned);
    showToast(
      mode === 'preserve-paragraphs'
        ? 'Copied text cleaned (paragraphs preserved)'
        : 'Copied lines merged into continuous text',
      'success'
    );
  };

  // Presets
  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    switch (presetName) {
      case 'writing':
        setActiveCaseMode('title-case');
        setCleanupOptions((prev) => ({
          ...prev,
          removeExtraSpaces: true,
          trimAllLines: true,
          collapseBlankLines: true,
          normalizeQuotes: true
        }));
        showToast('Applied General Writing Preset (Title Case + Whitespace Clean)', 'info');
        break;
      case 'social':
        setActiveCaseMode('sentence-case');
        setCleanupOptions((prev) => ({
          ...prev,
          removeExtraSpaces: true,
          trimAllLines: true,
          normalizeDashes: true
        }));
        showToast('Applied Social Media Preset (Sentence Case + Clean Spaces)', 'info');
        break;
      case 'programming':
        setActiveCaseMode('camel-case');
        setCleanupOptions((prev) => ({
          ...prev,
          removeExtraSpaces: true,
          trimAllLines: true,
          tabsToSpaces: true
        }));
        showToast('Applied Programming Preset (camelCase + Tab Conversion)', 'info');
        break;
      case 'pdf':
        handleRunPdfCleanup('preserve-paragraphs');
        showToast('Applied Clean PDF Preset (Unwrapped hard line breaks)', 'info');
        break;
      case 'email':
        setActiveCaseMode('sentence-case');
        setCleanupOptions((prev) => ({
          ...prev,
          normalizeLineBreaks: true,
          trimAllLines: true,
          removeSpacesBeforePunctuation: true
        }));
        showToast('Applied Email & Docs Preset (Normalized breaks & punctuation)', 'info');
        break;
      case 'slug':
        setActiveCaseMode('kebab-case');
        showToast('Applied URL Slug / Kebab Case Preset', 'info');
        break;
    }
  };

  // Swap Input and Output
  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    pushHistory(outputText);
    showToast('Swapped Converted Text back into Input', 'info');
  };

  // Clear
  const handleClear = () => {
    if (!inputText) return;
    setInputText('');
    pushHistory('');
    showToast('Input cleared', 'info');
    inputRef.current?.focus();
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText(text);
          pushHistory(text);
          showToast('Text pasted from clipboard!', 'success');
          return;
        }
      }
      showToast('Clipboard access was blocked. Use Ctrl+V or Cmd+V to paste.', 'info');
    } catch {
      showToast('Clipboard access denied. Please paste manually with Ctrl+V / Cmd+V.', 'info');
    }
  };

  // Sample text
  const handleLoadSample = () => {
    setInputText(SAMPLE_TEXT);
    setActiveCaseMode('title-case');
    pushHistory(SAMPLE_TEXT);
    showToast('Sample text loaded', 'info');
  };

  // Copy converted text
  const handleCopy = async () => {
    if (!outputText) {
      showToast('Nothing to copy. Enter text first.', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(outputText);
      setCopiedSuccess(true);
      showToast('Converted text copied to clipboard!', 'success');
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // Fallback
      if (outputRef.current) {
        outputRef.current.select();
        document.execCommand('copy');
        setCopiedSuccess(true);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopiedSuccess(false), 2500);
      }
    }
  };

  // Download .txt file
  const handleDownload = () => {
    if (!outputText) {
      showToast('Nothing to download. Enter text first.', 'info');
      return;
    }
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-${activeCaseMode || 'text'}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Text file downloaded successfully!', 'success');
  };

  // Share text
  const handleShare = async () => {
    if (!outputText) {
      showToast('Nothing to share. Enter text first.', 'info');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Converted Text - RajToolBox',
          text: outputText
        });
        showToast('Shared successfully!', 'success');
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K -> Clear
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleClear();
      }
      // Ctrl/Cmd + Shift + C -> Copy Output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [outputText, inputText]);

  // Standard case categories
  const standardCases: { id: CaseMode; label: string; desc: string }[] = [
    { id: 'uppercase', label: 'UPPERCASE', desc: 'ALL CAPITAL LETTERS' },
    { id: 'lowercase', label: 'lowercase', desc: 'all small letters' },
    { id: 'title-case', label: 'Title Case', desc: 'Smart Capitalized Words (Excludes Minor Stop Words)' },
    { id: 'sentence-case', label: 'Sentence case', desc: 'First letter capitalized after each sentence period' },
    { id: 'capitalize-words', label: 'Capitalize Each Word', desc: 'Capitalizes Every Word (Start Case)' },
    { id: 'capitalize-first', label: 'Capitalize First Letter', desc: 'Only very first character of the text' },
    { id: 'alternating-case', label: 'aLtErNaTiNg CaSe', desc: 'SpongeBob mock meme case' },
    { id: 'inverse-case', label: 'iNVERSE cASE', desc: 'Inverts uppercase to lowercase and vice versa' }
  ];

  const programmingCases: { id: CaseMode; label: string; desc: string; sample: string }[] = [
    { id: 'camel-case', label: 'camelCase', desc: 'JavaScript / Java variables', sample: 'helloWorldExample' },
    { id: 'pascal-case', label: 'PascalCase', desc: 'Classes & Types in C# / TS', sample: 'HelloWorldExample' },
    { id: 'snake-case', label: 'snake_case', desc: 'Python & SQL columns', sample: 'hello_world_example' },
    { id: 'kebab-case', label: 'kebab-case', desc: 'CSS classes & URL slugs', sample: 'hello-world-example' },
    { id: 'constant-case', label: 'CONSTANT_CASE', desc: 'Constants & Env vars', sample: 'HELLO_WORLD_EXAMPLE' },
    { id: 'dot-case', label: 'dot.case', desc: 'Object properties & config keys', sample: 'hello.world.example' },
    { id: 'path-case', label: 'path/case', desc: 'File paths & routes', sample: 'hello/world/example' },
    { id: 'space-case', label: 'space case', desc: 'Separated plain words', sample: 'hello world example' }
  ];

  return (
    <div
      id="text-case-converter-tool-area"
      className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#FFFDF7] dark:bg-[#121215] p-4 sm:p-8 overflow-y-auto' : ''}`}
    >
      {/* 1. TOP PRESET WORKFLOW BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            Quick Presets:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'writing', label: 'General Writing' },
            { id: 'social', label: 'Social Media' },
            { id: 'programming', label: 'Programming' },
            { id: 'pdf', label: 'Clean PDF Text' },
            { id: 'email', label: 'Email & Docs' },
            { id: 'slug', label: 'SEO Slug' }
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                activePreset === preset.id
                  ? 'bg-[#FACC15] text-[#854D0E] border-[#854D0E] dark:border-[#FACC15] shadow-2xs'
                  : 'bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] dark:text-[#D4D4D8] border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] hover:text-[#EC4899]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CASE CONVERTER SELECTION CONTROLS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs space-y-4">
        {/* Standard Cases Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#EC4899]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5]">
              Standard Case Modes
            </h3>
          </div>
          <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            Click to apply transformation instantly
          </span>
        </div>

        {/* Standard Case Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {standardCases.map((c) => {
            const isSelected = activeCaseMode === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCaseSelect(c.id)}
                className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[56px] ${
                  isSelected
                    ? 'border-[#854D0E] dark:border-[#FACC15] bg-[#FACC15] text-[#854D0E] shadow-2xs scale-[1.02] ring-2 ring-[#FACC15]/40 font-black'
                    : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] hover:text-[#EC4899] font-bold'
                }`}
                title={c.desc}
              >
                <span className="text-xs">{c.label}</span>
                {isSelected && <span className="text-[10px] mt-0.5">✓ Active</span>}
              </button>
            );
          })}
        </div>

        {/* Developer / Programming Cases */}
        <div className="pt-3 border-t border-[#E4E4E7] dark:border-[#27272A]">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#854D0E] dark:text-[#FACC15]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5]">
                Developer &amp; Code Naming Conventions
              </h4>
            </div>
            <span className="text-[11px] text-[#71717A]">
              Intelligent tokenization across camelCase, snake_case &amp; dashes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {programmingCases.map((p) => {
              const isSelected = activeCaseMode === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleCaseSelect(p.id)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[56px] ${
                    isSelected
                      ? 'border-[#854D0E] dark:border-[#FACC15] bg-[#FACC15] text-[#854D0E] shadow-2xs scale-[1.02] ring-2 ring-[#FACC15]/40 font-mono font-bold'
                      : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#854D0E] hover:text-[#854D0E] dark:hover:text-[#FACC15] font-mono text-xs'
                  }`}
                  title={`${p.desc} (${p.sample})`}
                >
                  <span className="text-[11px] tracking-tight truncate w-full">{p.label}</span>
                  {isSelected && <span className="text-[10px] font-sans font-black mt-0.5">✓ Active</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. CLEAN & FORMAT CONTROLS PANEL */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EC4899]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5]">
              Clean &amp; Format Tools
            </h3>
            <span className="text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] dark:bg-[#16A34A]/20 px-2 py-0.5 rounded-full">
              Whitespace &amp; PDF Normalizer
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Clean Copied Text Button */}
            <button
              type="button"
              onClick={() => handleRunPdfCleanup(pdfCleanMode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-2xs hover:bg-[#db2777] transition-all cursor-pointer"
              title="Cleans hard line wraps from PDFs and copied text"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Clean Copied Text</span>
            </button>

            {/* Toggle Advanced Cleanup */}
            <button
              type="button"
              onClick={() => setShowCleanupPanel(!showCleanupPanel)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-xs font-bold text-[#71717A] dark:text-[#D4D4D8] hover:border-[#EC4899] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showCleanupPanel ? 'Hide Options' : 'Custom Cleanup'}</span>
              {showCleanupPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Explanatory note */}
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
          Useful for fixing messy text copied from PDFs, Word, ChatGPT, Slack, or web pages. Removes artificial line breaks, strips phantom spaces, and normalizes formatting.
        </p>

        {/* Collapsible Advanced Cleanup Controls */}
        {showCleanupPanel && (
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-4 animate-in fade-in">
            {/* PDF Cleanup Mode Selector */}
            <div className="flex items-center gap-3 flex-wrap text-xs pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Copied Text Wrap Mode:</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="pdfCleanMode"
                  checked={pdfCleanMode === 'preserve-paragraphs'}
                  onChange={() => setPdfCleanMode('preserve-paragraphs')}
                  className="text-[#EC4899] focus:ring-[#EC4899]"
                />
                <span>Preserve Paragraphs (Join single lines)</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="pdfCleanMode"
                  checked={pdfCleanMode === 'join-lines'}
                  onChange={() => setPdfCleanMode('join-lines')}
                  className="text-[#EC4899] focus:ring-[#EC4899]"
                />
                <span>Join Wrapped Lines (Single paragraph)</span>
              </label>
            </div>

            {/* Checkbox Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
              {[
                { key: 'removeExtraSpaces', label: 'Remove extra spaces within lines' },
                { key: 'trimAllLines', label: 'Trim leading & trailing spaces on all lines' },
                { key: 'removeEmptyLines', label: 'Delete empty blank lines' },
                { key: 'collapseBlankLines', label: 'Collapse multiple blank lines into one' },
                { key: 'normalizeLineBreaks', label: 'Normalize line breaks (CRLF to LF)' },
                { key: 'tabsToSpaces', label: 'Convert tabs to 2 spaces' },
                { key: 'normalizeQuotes', label: 'Normalize curly quotes (“ ” to " ")' },
                { key: 'normalizeDashes', label: 'Normalize em/en dashes (— to -)' },
                { key: 'removeInvisibleChars', label: 'Remove zero-width/invisible characters' },
                { key: 'removeSpacesBeforePunctuation', label: 'Remove accidental spaces before punctuation' }
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] cursor-pointer hover:border-[#EC4899] transition-all"
                >
                  <input
                    type="checkbox"
                    checked={!!cleanupOptions[opt.key as keyof CleanupOptions]}
                    onChange={(e) =>
                      setCleanupOptions((prev) => ({
                        ...prev,
                        [opt.key]: e.target.checked
                      }))
                    }
                    className="rounded-sm text-[#EC4899] focus:ring-[#EC4899] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[#18181B] dark:text-[#D4D4D8] leading-tight">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#71717A]">
                Applies directly to your input text while preserving your undo history.
              </span>
              <button
                type="button"
                onClick={handleRunCleanup}
                className="px-4 py-2 rounded-xl bg-[#FACC15] text-[#854D0E] font-bold text-xs hover:bg-[#eab308] transition-all cursor-pointer shadow-2xs"
              >
                Apply Selected Cleanup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN TWO-PANEL EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: INPUT TEXT */}
        <div className="flex flex-col p-5 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs space-y-3">
          {/* Panel Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
              <label htmlFor="case-converter-input" className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5]">
                Input Text
              </label>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={handlePaste}
                className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] hover:border-[#EC4899] hover:text-[#EC4899] transition-all cursor-pointer font-semibold"
                title="Paste text from clipboard"
              >
                Paste
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] hover:border-[#EC4899] hover:text-[#EC4899] transition-all cursor-pointer font-semibold"
                title="Load sample text"
              >
                Sample
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#EF4444]/20 transition-all cursor-pointer font-semibold"
                title="Clear input (Ctrl+K)"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              id="case-converter-input"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Paste or type your text here... Convert case, clean formatting and prepare text for writing, documents or code."
              rows={14}
              className="w-full h-full min-h-[280px] p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-sm text-[#18181B] dark:text-[#F4F4F5] font-sans leading-relaxed resize-y focus:outline-hidden focus:border-[#EC4899] focus:ring-1 focus:ring-[#EC4899]"
            />
          </div>

          {/* Left Panel Footer Stats & History */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <div className="flex items-center gap-3 flex-wrap">
              <span><strong>{inputStats.characters.toLocaleString()}</strong> chars</span>
              <span><strong>{inputStats.words.toLocaleString()}</strong> words</span>
              <span><strong>{inputStats.lines.toLocaleString()}</strong> lines</span>
              <span><strong>{inputStats.sentences.toLocaleString()}</strong> sentences</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1 rounded-md hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] disabled:opacity-30 cursor-pointer transition-all"
                title="Undo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1 rounded-md hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] disabled:opacity-30 cursor-pointer transition-all"
                title="Redo"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CONVERTED TEXT */}
        <div className="flex flex-col p-5 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs space-y-3">
          {/* Panel Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              <label htmlFor="case-converter-output" className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5]">
                Converted Text
              </label>
              {activeCaseMode && (
                <span className="text-[10px] font-bold text-[#854D0E] dark:text-[#FACC15] bg-[#FEF3C7] dark:bg-[#FACC15]/20 px-2 py-0.5 rounded-full">
                  {activeCaseMode}
                </span>
              )}
            </div>

            {/* Quick Output Actions */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={handleSwap}
                className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] hover:border-[#EC4899] hover:text-[#EC4899] transition-all cursor-pointer font-semibold inline-flex items-center gap-1"
                title="Swap converted text back into input"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Swap</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] hover:border-[#EC4899] hover:text-[#EC4899] transition-all cursor-pointer font-semibold inline-flex items-center gap-1"
                title="Download as .txt file"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] text-[#71717A] hover:border-[#EC4899] hover:text-[#EC4899] transition-all cursor-pointer font-semibold inline-flex items-center gap-1"
                title="Share converted text"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Textarea Output */}
          <div className="relative flex-1">
            <textarea
              ref={outputRef}
              id="case-converter-output"
              readOnly
              value={outputText}
              placeholder="Your converted text will appear here immediately..."
              rows={14}
              className="w-full h-full min-h-[280px] p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAF5FF]/30 dark:bg-[#202026] text-sm text-[#18181B] dark:text-[#F4F4F5] font-sans leading-relaxed resize-y focus:outline-hidden"
            />
          </div>

          {/* Right Panel Footer: Changes Diff & Big Copy Button */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] text-xs">
            {/* Diff Summary */}
            <div className="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA]">
              <span>
                Chars: <strong>{outputStats.characters.toLocaleString()}</strong>
                {outputStats.characters !== inputStats.characters && (
                  <span className={`ml-1 text-[11px] font-bold ${outputStats.characters < inputStats.characters ? 'text-[#16A34A]' : 'text-[#EC4899]'}`}>
                    ({outputStats.characters - inputStats.characters > 0 ? '+' : ''}
                    {outputStats.characters - inputStats.characters})
                  </span>
                )}
              </span>
              <span>·</span>
              <span>
                Words: <strong>{outputStats.words.toLocaleString()}</strong>
              </span>
              <span>·</span>
              <span>
                Lines: <strong>{outputStats.lines.toLocaleString()}</strong>
              </span>
            </div>

            {/* Primary Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                copiedSuccess
                  ? 'bg-[#16A34A] text-white scale-[1.02]'
                  : 'bg-[#EC4899] hover:bg-[#db2777] text-white'
              }`}
            >
              {copiedSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSuccess ? 'Copied to Clipboard!' : 'Copy Converted Text'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. LIVE STATS BAR & KEYBOARD SHORTCUTS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap text-[#71717A] dark:text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Reading Time: <strong>~{outputStats.readingTimeMinutes} min</strong></span>
          </span>
          <span>·</span>
          <span>Non-empty lines: <strong>{outputStats.nonEmptyLines}</strong></span>
          <span>·</span>
          <span>Characters (no spaces): <strong>{outputStats.charactersNoSpaces.toLocaleString()}</strong></span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#71717A]">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-sm bg-[#F4F4F5] dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#3F3F46] font-mono text-[10px]">
              Ctrl+K
            </kbd>{' '}
            Clear
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-sm bg-[#F4F4F5] dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#3F3F46] font-mono text-[10px]">
              Ctrl+Shift+C
            </kbd>{' '}
            Copy
          </span>
          <span className="inline-flex items-center gap-1 text-[#16A34A] dark:text-[#4ADE80] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% In-Browser &amp; Private
          </span>
        </div>
      </div>
    </div>
  );
};
