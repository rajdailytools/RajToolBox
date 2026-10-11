import React, { useState, useMemo, useRef } from 'react';
import {
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  FileCode,
  SlidersHorizontal,
  FolderTree,
  GitCompare,
  FileCheck2,
  Wand2,
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatJsonString,
  minifyJsonString,
  validateJsonString,
  escapeJsonForCode,
  unescapeJsonFromCode,
  formatByteSize,
  getUtf8ByteLength,
  JsonByteStats,
  JsonValidationResult
} from '../utils/jsonEngine';
import { JSON_SAMPLES, JsonSampleItem } from '../utils/jsonSamples';
import { JsonTreeView } from './JsonTreeView';
import { JsonDiffView } from './JsonDiffView';
import { JsonSchemaValidatorView } from './JsonSchemaValidatorView';

export const JsonFormatterWorkspace: React.FC = () => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active workspace mode: 'editor' | 'tree' | 'diff' | 'schema'
  const [activeTab, setActiveTab] = useState<'editor' | 'tree' | 'diff' | 'schema'>('editor');

  // Editor states
  const [input, setInput] = useState<string>(() => JSON_SAMPLES[0].content);
  const [previousInput, setPreviousInput] = useState<string | null>(null);
  const [indentation, setIndentation] = useState<number | '\t'>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Minification stats
  const [minifyStats, setMinifyStats] = useState<JsonByteStats | null>(null);

  // Real-time validation computation
  const validationResult: JsonValidationResult = useMemo(() => {
    return validateJsonString(input);
  }, [input]);

  // Byte size & line counts
  const byteStats = useMemo(() => {
    const rawBytes = getUtf8ByteLength(input);
    const lineCount = input ? input.split('\n').length : 0;
    const charCount = input.length;
    return { rawBytes, lineCount, charCount };
  }, [input]);

  // Format Action
  const handleFormat = (indentVal: number | '\t' = indentation) => {
    try {
      const { formatted } = formatJsonString(input, indentVal, sortKeys);
      setInput(formatted);
      setMinifyStats(null);
      showToast('JSON formatted successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Cannot format invalid JSON', 'error');
    }
  };

  // Minify Action
  const handleMinify = () => {
    try {
      const { minified, stats } = minifyJsonString(input);
      setInput(minified);
      setMinifyStats(stats);
      showToast(`JSON minified! Saved ${formatByteSize(stats.savedBytes)} (${stats.percentageSaved}%)`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Cannot minify invalid JSON', 'error');
    }
  };

  // Validate Action
  const handleValidateExplicit = () => {
    if (validationResult.isValid) {
      showToast('JSON syntax is 100% valid (RFC 8259 compliant)!', 'success');
    } else {
      showToast(validationResult.error?.message || 'JSON has syntax errors', 'error');
    }
  };

  // Safe Fix Assistant: Review and apply fix
  const handleApplyFix = () => {
    if (validationResult.fixSuggestion && validationResult.fixSuggestion.fixedJson) {
      setPreviousInput(input);
      setInput(validationResult.fixSuggestion.fixedJson);
      showToast(
        `Applied fix: ${validationResult.fixSuggestion.explanation}`,
        'success'
      );
    }
  };

  // Restore undo
  const handleUndo = () => {
    if (previousInput !== null) {
      setInput(previousInput);
      setPreviousInput(null);
      showToast('Restored previous JSON content', 'info');
    }
  };

  // Clear workspace
  const handleClear = () => {
    if (!input) return;
    setPreviousInput(input);
    setInput('');
    setMinifyStats(null);
    setUploadedFileName(null);
    showToast('Workspace cleared (Undo available)', 'info');
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!input) {
      showToast('Workspace is empty', 'error');
      return;
    }
    navigator.clipboard.writeText(input);
    showToast('JSON copied to clipboard!', 'success');
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPreviousInput(input);
        setInput(text);
        showToast('Pasted JSON from clipboard!', 'success');
      } else {
        showToast('Clipboard is empty', 'info');
      }
    } catch {
      showToast('Please press Ctrl+V or Cmd+V to paste into the editor', 'info');
    }
  };

  // Download .json file
  const handleDownload = () => {
    if (!input) {
      showToast('Nothing to download', 'error');
      return;
    }
    const blob = new Blob([input], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = uploadedFileName
      ? uploadedFileName.replace(/\.json$/i, '') + '-formatted.json'
      : 'rajtoolbox-formatted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON file!', 'success');
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPreviousInput(input);
      setInput(content);
      setUploadedFileName(file.name);
      showToast(`Loaded ${file.name} (${formatByteSize(file.size)})`, 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load sample dataset
  const handleLoadSample = (sample: JsonSampleItem) => {
    setPreviousInput(input);
    setInput(sample.content);
    setUploadedFileName(null);
    setMinifyStats(null);
    showToast(`Loaded sample: "${sample.name}"`, 'success');
  };

  // Escape string for code
  const handleEscapeCode = () => {
    try {
      const escaped = escapeJsonForCode(input);
      setPreviousInput(input);
      setInput(escaped);
      showToast('Escaped JSON for string literals (Java/C#/Python)', 'info');
    } catch {
      showToast('Could not escape string', 'error');
    }
  };

  // Unescape string from code
  const handleUnescapeCode = () => {
    try {
      const unescaped = unescapeJsonFromCode(input);
      setPreviousInput(input);
      setInput(unescaped);
      showToast('Unescaped JSON string', 'info');
    } catch {
      showToast('Could not unescape string', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('editor')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-[#EC4899] text-white shadow-xs'
                : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202026]'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Editor &amp; Formatter</span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            disabled={!validationResult.isValid}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tree'
                ? 'bg-[#EC4899] text-white shadow-xs'
                : validationResult.isValid
                ? 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202026]'
                : 'text-[#A1A1AA] dark:text-[#52525B] cursor-not-allowed opacity-60'
            }`}
            title={!validationResult.isValid ? 'Fix syntax errors to view Tree' : 'Interactive JSON Tree'}
          >
            <FolderTree className="w-4 h-4" />
            <span>Interactive Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'diff'
                ? 'bg-[#EC4899] text-white shadow-xs'
                : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202026]'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare / Diff</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schema'
                ? 'bg-[#EC4899] text-white shadow-xs'
                : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202026]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Schema Validator</span>
          </button>
        </div>

        {/* Client-Side Privacy Badge */}
        <div className="flex items-center gap-1.5 text-xs text-[#16A34A] dark:text-[#4ADE80] font-semibold bg-[#DCFCE7]/60 dark:bg-[#14532D]/40 px-3 py-1 rounded-full border border-[#86EFAC]/50">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Client-Side &bull; No Server Uploads</span>
        </div>
      </div>

      {/* 2. TAB: TREE VIEW */}
      {activeTab === 'tree' && validationResult.parsed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
              Visual Node Hierarchy &amp; Path Inspector
            </span>
            <button
              onClick={() => setActiveTab('editor')}
              className="text-xs font-semibold text-[#EC4899] hover:underline"
            >
              &larr; Back to Editor
            </button>
          </div>
          <JsonTreeView data={validationResult.parsed} />
        </div>
      )}

      {/* 3. TAB: DIFF VIEW */}
      {activeTab === 'diff' && <JsonDiffView />}

      {/* 4. TAB: SCHEMA VALIDATOR */}
      {activeTab === 'schema' && <JsonSchemaValidatorView />}

      {/* 5. TAB: PRIMARY EDITOR & FORMATTER */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#FFFDF7] dark:bg-[#141417] border border-[#E4E4E7] dark:border-[#27272A]">
            {/* Format actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleFormat(indentation)}
                className="px-3.5 py-1.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format (Beautify)</span>
              </button>

              <button
                onClick={handleMinify}
                className="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] transition-all"
              >
                Minify
              </button>

              <button
                onClick={handleValidateExplicit}
                className="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] transition-all"
              >
                Validate
              </button>

              {/* Indentation Selector */}
              <div className="flex items-center border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden bg-white dark:bg-[#18181B]">
                <button
                  onClick={() => {
                    setIndentation(2);
                    handleFormat(2);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold ${
                    indentation === 2
                      ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                  title="2 Spaces"
                >
                  2 Sp
                </button>
                <button
                  onClick={() => {
                    setIndentation(4);
                    handleFormat(4);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold border-l border-[#E4E4E7] dark:border-[#27272A] ${
                    indentation === 4
                      ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                  title="4 Spaces"
                >
                  4 Sp
                </button>
                <button
                  onClick={() => {
                    setIndentation('\t');
                    handleFormat('\t');
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold border-l border-[#E4E4E7] dark:border-[#27272A] ${
                    indentation === '\t'
                      ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                  title="Tab character"
                >
                  Tabs
                </button>
              </div>

              {/* Sort Keys Toggle */}
              <label className="flex items-center gap-1.5 text-xs text-[#71717A] dark:text-[#A1A1AA] cursor-pointer ml-1">
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => {
                    setSortKeys(e.target.checked);
                    if (validationResult.isValid) {
                      try {
                        const { formatted } = formatJsonString(input, indentation, e.target.checked);
                        setInput(formatted);
                      } catch {
                        // ignore
                      }
                    }
                  }}
                  className="rounded text-[#EC4899] focus:ring-[#EC4899] w-3.5 h-3.5 accent-[#EC4899]"
                />
                <span className="font-semibold text-[11px]">Sort Keys (A-Z)</span>
              </label>
            </div>

            {/* File actions & Samples */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sample loader */}
              <select
                onChange={(e) => {
                  const s = JSON_SAMPLES.find((item) => item.id === e.target.value);
                  if (s) handleLoadSample(s);
                  e.target.value = '';
                }}
                defaultValue=""
                className="px-2.5 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
              >
                <option value="" disabled>
                  Load Sample Dataset...
                </option>
                {JSON_SAMPLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5]"
                title="Upload .json file"
              >
                <Upload className="w-3.5 h-3.5 text-[#EC4899]" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              {/* Paste */}
              <button
                onClick={handlePaste}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5]"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">Paste</span>
              </button>

              {/* Clear */}
              <button
                onClick={handleClear}
                className="p-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#DC2626] text-[#71717A] hover:text-[#DC2626]"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Undo */}
              {previousInput !== null && (
                <button
                  onClick={handleUndo}
                  className="p-1.5 rounded-xl border border-[#EC4899] text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20"
                  title="Undo last change"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Validation Status Indicator Bar */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] dark:bg-[#14532D]/50 px-2.5 py-1 rounded-full border border-[#86EFAC]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  RFC 8259 Valid JSON
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] bg-[#FEE2E2] dark:bg-[#7F1D1D]/50 px-2.5 py-1 rounded-full border border-[#FCA5A5]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Syntax Error Detected
                </span>
              )}

              {uploadedFileName && (
                <span className="text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA]">
                  File: {uploadedFileName}
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-3 text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-mono">
              <span>Lines: {byteStats.lineCount}</span>
              <span>Chars: {byteStats.charCount}</span>
              <span>Size: {formatByteSize(byteStats.rawBytes)}</span>
            </div>
          </div>

          {/* Code Textarea Editor Area */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setMinifyStats(null);
              }}
              rows={15}
              placeholder="Paste raw, messy or minified JSON here..."
              spellCheck={false}
              className="w-full p-4 font-mono text-xs rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899] focus:ring-1 focus:ring-[#EC4899] leading-relaxed transition-all shadow-inner"
            />
          </div>

          {/* Minification Savings Card (Shown when minified) */}
          {minifyStats && (
            <div className="p-4 rounded-2xl bg-[#DCFCE7]/70 dark:bg-[#14532D]/30 border border-[#86EFAC] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <div>
                  <span className="font-bold text-[#166534] dark:text-[#86EFAC]">
                    Minification Successful!
                  </span>
                  <p className="text-[11px] text-[#15803D] dark:text-[#86EFAC]/90 mt-0.5">
                    Original size: {formatByteSize(minifyStats.originalBytes)} &rarr; Minified size:{' '}
                    {formatByteSize(minifyStats.minifiedBytes)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono font-bold text-xs">
                <span className="px-2 py-1 rounded-lg bg-white dark:bg-[#121215] border border-[#86EFAC] text-[#166534] dark:text-[#86EFAC]">
                  Saved {formatByteSize(minifyStats.savedBytes)} ({minifyStats.percentageSaved}%)
                </span>
              </div>
            </div>
          )}

          {/* Diagnostics & Safe Fix Assistant (When Syntax Error exists) */}
          {!validationResult.isValid && validationResult.error && (
            <div className="p-5 rounded-2xl bg-[#FEE2E2]/60 dark:bg-[#7F1D1D]/30 border border-[#F87171] space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-[#991B1B] dark:text-[#FCA5A5]">
                      Syntax Error: {validationResult.error.message}
                    </h3>
                    <p className="text-[11px] text-[#B91C1C] dark:text-[#F87171] mt-0.5">
                      Location: Line {validationResult.error.line}, Column{' '}
                      {validationResult.error.column} (Character index{' '}
                      {validationResult.error.position >= 0 ? validationResult.error.position : 'N/A'})
                    </p>
                  </div>
                </div>

                {validationResult.fixSuggestion && (
                  <button
                    onClick={handleApplyFix}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold shadow-xs hover:bg-[#B91C1C] transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Safe Suggested Fix</span>
                  </button>
                )}
              </div>

              {/* Code Excerpt with Caret */}
              <div className="bg-[#18181B] text-[#F4F4F5] p-3.5 rounded-xl font-mono text-xs overflow-x-auto shadow-inner leading-normal">
                <pre className="whitespace-pre">{validationResult.error.excerpt}</pre>
              </div>

              {/* Cause and suggestion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-white/70 dark:bg-[#121215]/80 border border-[#FCA5A5]/60">
                  <span className="font-bold text-[#991B1B] dark:text-[#FCA5A5] block mb-1">
                    Probable Cause:
                  </span>
                  <p className="text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
                    {validationResult.error.probableCause}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/70 dark:bg-[#121215]/80 border border-[#FCA5A5]/60">
                  <span className="font-bold text-[#991B1B] dark:text-[#FCA5A5] block mb-1">
                    Suggested Resolution:
                  </span>
                  <p className="text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
                    {validationResult.error.suggestion}
                  </p>
                </div>
              </div>

              {/* Safe Fix Explanation Banner */}
              {validationResult.fixSuggestion && (
                <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-[#86EFAC] text-xs flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <div>
                      <span className="font-bold text-[#166534] dark:text-[#86EFAC]">
                        Safe Diagnostic Fix Available:
                      </span>
                      <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                        {validationResult.fixSuggestion.explanation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleApplyFix}
                    className="px-3 py-1 rounded-lg bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D]"
                  >
                    Apply Fix ({validationResult.fixSuggestion.changesCount}{' '}
                    {validationResult.fixSuggestion.changesCount === 1 ? 'correction' : 'corrections'})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Auxiliary actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleEscapeCode}
                className="px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
                title="Escape for Java, Python, C# string literal"
              >
                Escape for Code
              </button>
              <button
                onClick={handleUnescapeCode}
                className="px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
                title="Unescape stringified JSON"
              >
                Unescape String
              </button>
              {validationResult.isValid && (
                <button
                  onClick={() => setActiveTab('tree')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] text-xs font-bold hover:bg-[#FBCFE8]"
                >
                  Explore in Tree View &rarr;
                </button>
              )}
            </div>

            {/* Primary Export Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]"
              >
                <Download className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Download .json</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] text-white dark:bg-white dark:text-[#18181B] text-xs font-bold shadow-xs hover:opacity-90"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
