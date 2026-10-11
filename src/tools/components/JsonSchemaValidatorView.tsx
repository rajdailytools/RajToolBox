import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { validateAgainstJsonSchema, SchemaValidationResult } from '../utils/jsonEngine';
import { JSON_SAMPLES } from '../utils/jsonSamples';

const DEFAULT_SAMPLE = JSON_SAMPLES.find((s) => s.id === 'schema-validation-demo');

export const JsonSchemaValidatorView: React.FC = () => {
  const { showToast } = useApp();
  const [dataInput, setDataInput] = useState<string>(DEFAULT_SAMPLE?.content || '{}');
  const [schemaInput, setSchemaInput] = useState<string>(DEFAULT_SAMPLE?.schema || '{}');

  const validation = useMemo(() => {
    let parsedData: any = null;
    let parsedSchema: any = null;
    let dataError: string | null = null;
    let schemaError: string | null = null;

    try {
      parsedData = JSON.parse(dataInput);
    } catch (err: any) {
      dataError = `Data JSON Syntax Error: ${err.message}`;
    }

    try {
      parsedSchema = JSON.parse(schemaInput);
    } catch (err: any) {
      schemaError = `Schema JSON Syntax Error: ${err.message}`;
    }

    let schemaResult: SchemaValidationResult | null = null;
    if (parsedData !== null && parsedSchema !== null) {
      schemaResult = validateAgainstJsonSchema(parsedData, parsedSchema);
    }

    return { parsedData, parsedSchema, dataError, schemaError, schemaResult };
  }, [dataInput, schemaInput]);

  const loadPreset = (presetType: 'valid' | 'invalid_age' | 'missing_required') => {
    if (!DEFAULT_SAMPLE) return;
    setSchemaInput(DEFAULT_SAMPLE.schema || '{}');

    if (presetType === 'valid') {
      setDataInput(DEFAULT_SAMPLE.content);
      showToast('Loaded valid schema sample!', 'success');
    } else if (presetType === 'invalid_age') {
      const obj = JSON.parse(DEFAULT_SAMPLE.content);
      obj.age = 15; // violates minimum: 18
      obj.email = 'not-an-email'; // violates format: email
      setDataInput(JSON.stringify(obj, null, 2));
      showToast('Loaded sample with age & email constraint violations', 'info');
    } else if (presetType === 'missing_required') {
      const obj = JSON.parse(DEFAULT_SAMPLE.content);
      delete obj.email;
      delete obj.role;
      obj.extraField = 'not allowed'; // violates additionalProperties: false
      setDataInput(JSON.stringify(obj, null, 2));
      showToast('Loaded sample with missing required fields & extra properties', 'info');
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#EC4899]" />
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
            JSON Schema Validator (Draft-07 / Draft-04 / 2020-12)
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">Load Sample:</span>
          <button
            onClick={() => loadPreset('valid')}
            className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors"
          >
            Passing
          </button>
          <button
            onClick={() => loadPreset('invalid_age')}
            className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors"
          >
            Type / Min Fail
          </button>
          <button
            onClick={() => loadPreset('missing_required')}
            className="px-2.5 py-1 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors"
          >
            Missing Required
          </button>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Data Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">JSON Data Payload</span>
            {validation.dataError ? (
              <span className="text-[11px] font-bold text-[#DC2626]">Syntax Error</span>
            ) : (
              <span className="text-[11px] font-bold text-[#16A34A]">Valid JSON</span>
            )}
          </div>
          <textarea
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            rows={10}
            placeholder="Paste JSON data instance..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
          />
          {validation.dataError && (
            <p className="text-[11px] text-[#DC2626] font-mono">{validation.dataError}</p>
          )}
        </div>

        {/* JSON Schema Definition */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">JSON Schema Definition</span>
            {validation.schemaError ? (
              <span className="text-[11px] font-bold text-[#DC2626]">Invalid Schema Syntax</span>
            ) : (
              <span className="text-[11px] font-bold text-[#16A34A]">Valid Schema Syntax</span>
            )}
          </div>
          <textarea
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            rows={10}
            placeholder="Paste JSON Schema definition..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
          />
          {validation.schemaError && (
            <p className="text-[11px] text-[#DC2626] font-mono">{validation.schemaError}</p>
          )}
        </div>
      </div>

      {/* Schema Evaluation Results */}
      {validation.schemaResult && (
        <div className="space-y-3 pt-2">
          {validation.schemaResult.isValid ? (
            <div className="p-4 rounded-xl bg-[#DCFCE7] dark:bg-[#14532D]/30 border border-[#86EFAC] text-[#166534] dark:text-[#86EFAC] text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Schema Validation Passed: Data conforms 100% to the specified JSON Schema rules.</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#16A34A]/20">
                {validation.schemaResult.evaluatedRulesCount} rules checked
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 border border-[#FCA5A5] text-[#991B1B] dark:text-[#FCA5A5] text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                  <span>
                    Validation Failed: Found {validation.schemaResult.errors.length}{' '}
                    {validation.schemaResult.errors.length === 1 ? 'error' : 'errors'}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#DC2626]/20">
                  {validation.schemaResult.evaluatedRulesCount} rules evaluated
                </span>
              </div>

              <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] divide-y divide-[#E4E4E7] dark:divide-[#27272A] overflow-hidden">
                {validation.schemaResult.errors.map((err, i) => (
                  <div key={i} className="p-3 text-xs flex items-start gap-3">
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEE2E2] dark:bg-[#7F1D1D]/50 text-[#991B1B] dark:text-[#FCA5A5] border border-[#FCA5A5]">
                      {err.keyword.toUpperCase()}
                    </span>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#EC4899]">
                          {err.path}
                        </span>
                        <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                          (Rule: {err.schemaPath})
                        </span>
                      </div>
                      <p className="text-xs text-[#52525B] dark:text-[#D4D4D8]">{err.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
