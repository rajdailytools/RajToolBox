import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { compareJsonSemantic, JsonDiffResult } from '../utils/jsonEngine';

const SAMPLE_A = JSON.stringify(
  {
    apiVersion: 'v1.2',
    service: 'auth-gateway',
    maxRetries: 3,
    debugMode: true,
    timeoutMs: 4000,
    tags: ['auth', 'security', 'oauth'],
    endpoints: {
      login: '/api/v1/auth/login',
      refresh: '/api/v1/auth/refresh'
    }
  },
  null,
  2
);

const SAMPLE_B = JSON.stringify(
  {
    apiVersion: 'v2.0',
    service: 'auth-gateway',
    maxRetries: 5,
    debugMode: false,
    timeoutMs: '5000ms', // type mismatch on purpose
    tags: ['auth', 'security', 'oauth', 'jwt'],
    endpoints: {
      login: '/api/v2/auth/login',
      refresh: '/api/v2/auth/refresh',
      revoke: '/api/v2/auth/revoke' // added key
    }
  },
  null,
  2
);

export const JsonDiffView: React.FC = () => {
  const { showToast } = useApp();
  const [jsonA, setJsonA] = useState<string>(SAMPLE_A);
  const [jsonB, setJsonB] = useState<string>(SAMPLE_B);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Validate and parse both inputs
  const parseResult = useMemo(() => {
    let parsedA: any = null;
    let parsedB: any = null;
    let errorA: string | null = null;
    let errorB: string | null = null;

    try {
      parsedA = JSON.parse(jsonA);
    } catch (err: any) {
      errorA = err.message;
    }

    try {
      parsedB = JSON.parse(jsonB);
    } catch (err: any) {
      errorB = err.message;
    }

    let diffResult: JsonDiffResult | null = null;
    if (parsedA !== null && parsedB !== null) {
      diffResult = compareJsonSemantic(parsedA, parsedB);
    }

    return { parsedA, parsedB, errorA, errorB, diffResult };
  }, [jsonA, jsonB]);

  const loadSampleComparison = () => {
    setJsonA(SAMPLE_A);
    setJsonB(SAMPLE_B);
    showToast('Sample comparison datasets loaded!', 'success');
  };

  const copyDiffReport = () => {
    if (!parseResult.diffResult) return;
    const lines = [
      `RajToolBox Semantic JSON Diff Report`,
      `====================================`,
      `Total Differences: ${parseResult.diffResult.summary.totalDifferences}`,
      `Added Keys/Items: +${parseResult.diffResult.summary.added}`,
      `Removed Keys/Items: -${parseResult.diffResult.summary.removed}`,
      `Modified Values: ~${parseResult.diffResult.summary.changed}`,
      `Type Mismatches: ≠${parseResult.diffResult.summary.typeMismatches}`,
      ``,
      `Detailed Differences:`,
      ...parseResult.diffResult.differences.map(
        (d, idx) => `[${idx + 1}] (${d.type.toUpperCase()}) ${d.path} => ${d.description}`
      )
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedReport(true);
    showToast('Diff report copied to clipboard!', 'success');
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[#EC4899]" />
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Semantic JSON Compare Engine
          </span>
          <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] hidden sm:inline">
            (Analyzes structural objects &amp; arrays rather than plain line text)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleComparison}
            className="px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors"
          >
            Load Sample Diffs
          </button>
          {parseResult.diffResult && (
            <button
              onClick={copyDiffReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181B] text-white dark:bg-white dark:text-[#18181B] text-xs font-bold"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Diff Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Dual Input Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Document A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
              Document A (Base / Original)
            </span>
            {parseResult.errorA ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626]">
                <AlertCircle className="w-3 h-3" /> Syntax Error
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A]">
                <CheckCircle2 className="w-3 h-3" /> Valid JSON
              </span>
            )}
          </div>
          <textarea
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            rows={9}
            placeholder="Paste first JSON document here..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
          />
          {parseResult.errorA && (
            <p className="text-[11px] text-[#DC2626] font-mono">{parseResult.errorA}</p>
          )}
        </div>

        {/* JSON Document B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
              Document B (Modified / New)
            </span>
            {parseResult.errorB ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626]">
                <AlertCircle className="w-3 h-3" /> Syntax Error
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A]">
                <CheckCircle2 className="w-3 h-3" /> Valid JSON
              </span>
            )}
          </div>
          <textarea
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            rows={9}
            placeholder="Paste second JSON document here..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
          />
          {parseResult.errorB && (
            <p className="text-[11px] text-[#DC2626] font-mono">{parseResult.errorB}</p>
          )}
        </div>
      </div>

      {/* Comparison Results Area */}
      {parseResult.diffResult && (
        <div className="space-y-3 pt-2">
          {/* Summary Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {parseResult.diffResult.identical ? (
              <div className="w-full p-3 rounded-xl bg-[#DCFCE7] dark:bg-[#14532D]/30 border border-[#86EFAC] text-[#166534] dark:text-[#86EFAC] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Documents are semantically identical. Zero differences found.</span>
              </div>
            ) : (
              <>
                <span className="px-2.5 py-1 rounded-lg bg-[#E4E4E7] dark:bg-[#27272A] text-xs font-bold text-[#18181B] dark:text-white">
                  Total Differences: {parseResult.diffResult.summary.totalDifferences}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] dark:bg-[#14532D]/40 text-[#166534] dark:text-[#86EFAC] text-xs font-bold inline-flex items-center gap-1">
                  <PlusCircle className="w-3 h-3" /> +{parseResult.diffResult.summary.added} Added
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FEE2E2] dark:bg-[#7F1D1D]/40 text-[#991B1B] dark:text-[#FCA5A5] text-xs font-bold inline-flex items-center gap-1">
                  <MinusCircle className="w-3 h-3" /> -{parseResult.diffResult.summary.removed} Removed
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] dark:bg-[#78350F]/40 text-[#92400E] dark:text-[#FDE68A] text-xs font-bold inline-flex items-center gap-1">
                  ~{parseResult.diffResult.summary.changed} Modified
                </span>
                {parseResult.diffResult.summary.typeMismatches > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#F3E8FF] dark:bg-[#581C87]/40 text-[#6B21A8] dark:text-[#D8B4FE] text-xs font-bold inline-flex items-center gap-1">
                    ≠ {parseResult.diffResult.summary.typeMismatches} Type Mismatch
                  </span>
                )}
              </>
            )}
          </div>

          {/* Detailed Differences List */}
          {!parseResult.diffResult.identical && (
            <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] divide-y divide-[#E4E4E7] dark:divide-[#27272A] max-h-72 overflow-auto">
              {parseResult.diffResult.differences.map((diff, index) => {
                let badgeStyle = 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]';
                let typeLabel = 'MODIFIED';

                if (diff.type === 'added') {
                  badgeStyle = 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]';
                  typeLabel = 'ADDED';
                } else if (diff.type === 'removed') {
                  badgeStyle = 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
                  typeLabel = 'REMOVED';
                } else if (diff.type === 'type_mismatch') {
                  badgeStyle = 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]';
                  typeLabel = 'TYPE MISMATCH';
                }

                return (
                  <div key={index} className="p-3 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeStyle}`}
                        >
                          {typeLabel}
                        </span>
                        <code className="font-mono text-xs font-bold text-[#EC4899]">
                          {diff.path}
                        </code>
                      </div>
                      <p className="text-xs text-[#52525B] dark:text-[#D4D4D8]">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
