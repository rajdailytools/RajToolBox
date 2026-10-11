/**
 * RajToolBox JSON Processing Engine
 * High-performance, 100% client-side parser, formatter, validator,
 * semantic diff engine, schema validator, and diagnostic repair assistant.
 */

export interface JsonErrorInfo {
  message: string;
  line: number;
  column: number;
  position: number;
  excerpt: string;
  probableCause?: string;
  suggestion?: string;
}

export interface JsonFixSuggestion {
  fixedJson: string;
  explanation: string;
  changesCount: number;
  errorResolved: boolean;
}

export interface JsonValidationResult {
  isValid: boolean;
  parsed?: any;
  error?: JsonErrorInfo;
  fixSuggestion?: JsonFixSuggestion;
}

export interface JsonByteStats {
  originalBytes: number;
  minifiedBytes: number;
  savedBytes: number;
  percentageSaved: number;
}

export interface JsonDiffItem {
  path: string;
  type: 'added' | 'removed' | 'changed' | 'type_mismatch';
  valA?: any;
  valB?: any;
  description: string;
}

export interface JsonDiffResult {
  identical: boolean;
  summary: {
    added: number;
    removed: number;
    changed: number;
    typeMismatches: number;
    totalDifferences: number;
  };
  differences: JsonDiffItem[];
}

export interface SchemaValidationError {
  path: string;
  keyword: string;
  message: string;
  schemaPath: string;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: SchemaValidationError[];
  evaluatedRulesCount: number;
}

/**
 * Measure exact UTF-8 byte length of a string
 */
export function getUtf8ByteLength(str: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  // Fallback for environments without TextEncoder
  return encodeURI(str).split(/%(?:u[0-9A-F]{4}|[0-9A-F]{2})|(.)/gi).length - 1;
}

/**
 * Format bytes into human-readable string (B, KB, MB)
 */
export function formatByteSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Recursively sort object keys alphabetically while preserving array orders
 */
export function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};
  for (const key of sortedKeys) {
    result[key] = sortObjectKeys(obj[key]);
  }
  return result;
}

/**
 * Format and beautify JSON with custom indentation and optional key sorting
 */
export function formatJsonString(
  raw: string,
  indentation: number | '\t' = 2,
  sortKeys = false
): { formatted: string; parsed: any } {
  if (!raw.trim()) {
    throw new Error('Input is empty. Please paste or upload JSON data to format.');
  }

  const parsed = JSON.parse(raw);
  const dataToFormat = sortKeys ? sortObjectKeys(parsed) : parsed;
  const formatted = JSON.stringify(dataToFormat, null, indentation);
  return { formatted, parsed: dataToFormat };
}

/**
 * Minify JSON into compact single-line string with UTF-8 byte metrics
 */
export function minifyJsonString(raw: string): { minified: string; stats: JsonByteStats } {
  if (!raw.trim()) {
    throw new Error('Input is empty. Please paste or upload JSON data to minify.');
  }

  const parsed = JSON.parse(raw);
  const minified = JSON.stringify(parsed);

  const originalBytes = getUtf8ByteLength(raw);
  const minifiedBytes = getUtf8ByteLength(minified);
  const savedBytes = Math.max(0, originalBytes - minifiedBytes);
  const percentageSaved = originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0;

  return {
    minified,
    stats: {
      originalBytes,
      minifiedBytes,
      savedBytes,
      percentageSaved: Math.round(percentageSaved * 10) / 10
    }
  };
}

/**
 * Parse line, column and position from JSON.parse error message
 */
function extractErrorPosition(
  errMessage: string,
  raw: string
): { line: number; column: number; position: number } {
  let line = 1;
  let column = 1;
  let position = -1;

  // Pattern 1: "... at position 123"
  const posMatch = errMessage.match(/position\s+(\d+)/i);
  if (posMatch) {
    position = parseInt(posMatch[1], 10);
  }

  // Pattern 2: "... at line 4 column 12"
  const lineColMatch = errMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else if (position >= 0) {
    // Derive line and column from position offset
    let curLine = 1;
    let curCol = 1;
    for (let i = 0; i < position && i < raw.length; i++) {
      if (raw[i] === '\n') {
        curLine++;
        curCol = 1;
      } else {
        curCol++;
      }
    }
    line = curLine;
    column = curCol;
  } else {
    // Fallback: try finding first syntax abnormality
    const lines = raw.split('\n');
    line = Math.min(lines.length, 1);
    column = 1;
  }

  return { line, column, position };
}

/**
 * Generate code excerpt showing surrounding lines with red pointer indicator
 */
function generateCodeExcerpt(raw: string, errorLine: number, errorCol: number): string {
  const lines = raw.split('\n');
  const targetLineIdx = Math.max(0, errorLine - 1);
  const startIdx = Math.max(0, targetLineIdx - 2);
  const endIdx = Math.min(lines.length - 1, targetLineIdx + 2);

  const result: string[] = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const lineNum = (i + 1).toString().padStart(4, ' ');
    const isError = i === targetLineIdx;
    const prefix = isError ? '> ' : '  ';
    result.push(`${prefix}${lineNum} | ${lines[i]}`);
    if (isError) {
      const caretIndent = ' '.repeat(6 + Math.max(0, errorCol - 1));
      result.push(`${caretIndent}^--- Error here`);
    }
  }
  return result.join('\n');
}

/**
 * Analyze probable cause and create safe fix suggestion
 */
export function analyzeAndSuggestFix(raw: string): JsonFixSuggestion | undefined {
  if (!raw.trim()) return undefined;

  let candidate = raw;
  let explanation = '';
  let changesCount = 0;

  // 1. Remove JavaScript style comments // and /* */
  const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
  if (commentRegex.test(candidate)) {
    candidate = candidate.replace(commentRegex, (match, prefix) => {
      changesCount++;
      return prefix || '';
    });
    explanation += 'Removed JavaScript comments (comments are not permitted in standard JSON RFC 8259). ';
  }

  // 2. Replace Single Quotes with Double Quotes for string literals / keys
  // Match single-quoted strings: 'key' or 'value'
  const singleQuoteRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  if (singleQuoteRegex.test(candidate)) {
    candidate = candidate.replace(singleQuoteRegex, (_, content) => {
      changesCount++;
      // Escape any unescaped double quotes inside the string
      const sanitized = content.replace(/"/g, '\\"');
      return `"${sanitized}"`;
    });
    explanation += 'Converted single quotes to standard double quotes. ';
  }

  // 3. Fix unquoted keys e.g. { name: "Raj", age: 30 }
  const unquotedKeyRegex = /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$-]*)\s*:/g;
  if (unquotedKeyRegex.test(candidate)) {
    candidate = candidate.replace(unquotedKeyRegex, (_, prefix, key) => {
      changesCount++;
      return `${prefix}"${key}":`;
    });
    explanation += 'Enclosed unquoted object keys in double quotes. ';
  }

  // 4. Remove trailing commas in objects and arrays e.g. [1, 2, 3,] or {"a": 1,}
  const trailingCommaRegex = /,\s*([}\]])/g;
  if (trailingCommaRegex.test(candidate)) {
    candidate = candidate.replace(trailingCommaRegex, (_, bracket) => {
      changesCount++;
      return bracket;
    });
    explanation += 'Removed non-standard trailing commas before closing delimiters. ';
  }

  // 5. Replace non-standard constants NaN / undefined / Infinity with null
  const invalidLiteralsRegex = /:\s*(undefined|NaN|Infinity|-Infinity)\b/g;
  if (invalidLiteralsRegex.test(candidate)) {
    candidate = candidate.replace(invalidLiteralsRegex, ': null');
    changesCount++;
    explanation += 'Replaced non-standard literals (NaN/undefined/Infinity) with JSON-compliant null. ';
  }

  // 6. Check for unclosed braces or brackets
  let openBraces = (candidate.match(/\{/g) || []).length;
  let closeBraces = (candidate.match(/\}/g) || []).length;
  let openBrackets = (candidate.match(/\[/g) || []).length;
  let closeBrackets = (candidate.match(/\]/g) || []).length;

  while (openBrackets > closeBrackets) {
    candidate += ']';
    closeBrackets++;
    changesCount++;
    explanation += 'Appended missing closing bracket "]". ';
  }
  while (openBraces > closeBraces) {
    candidate += '}';
    closeBraces++;
    changesCount++;
    explanation += 'Appended missing closing brace "}". ';
  }

  if (changesCount > 0) {
    // Check if the candidate now parses cleanly
    let errorResolved = false;
    try {
      JSON.parse(candidate);
      errorResolved = true;
    } catch {
      errorResolved = false;
    }

    return {
      fixedJson: candidate,
      explanation: explanation.trim(),
      changesCount,
      errorResolved
    };
  }

  return undefined;
}

/**
 * Validate JSON string and provide deep diagnostic information
 */
export function validateJsonString(raw: string): JsonValidationResult {
  if (!raw.trim()) {
    return {
      isValid: false,
      error: {
        message: 'JSON input is empty.',
        line: 1,
        column: 1,
        position: 0,
        excerpt: 'Empty input',
        probableCause: 'No input provided',
        suggestion: 'Paste valid JSON data, load a sample, or upload a .json file.'
      }
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      isValid: true,
      parsed
    };
  } catch (err: any) {
    const message = err.message || 'Invalid JSON syntax';
    const { line, column, position } = extractErrorPosition(message, raw);
    const excerpt = generateCodeExcerpt(raw, line, column);

    // Identify probable cause
    let probableCause = 'Syntax error or unexpected token';
    let suggestion = 'Check for missing quotes, missing commas, or mismatched brackets.';

    const lines = raw.split('\n');
    const errLineText = lines[line - 1] || '';

    if (errLineText.includes("'")) {
      probableCause = 'Single quotes used in JSON strings or keys';
      suggestion = 'JSON strictly requires double quotes (") for all keys and string values.';
    } else if (/,\s*[}\]]/.test(raw)) {
      probableCause = 'Trailing comma before closing bracket or brace';
      suggestion = 'Remove the trailing comma right before "}" or "]".';
    } else if (errLineText.includes('//') || raw.includes('/*')) {
      probableCause = 'Comments present in JSON';
      suggestion = 'Standard JSON (RFC 8259) does not allow comments. Remove all // or /* */ comments.';
    } else if (/undefined|NaN|Infinity/.test(errLineText)) {
      probableCause = 'Non-standard literal (undefined, NaN, or Infinity)';
      suggestion = 'JSON only supports null, true, false, numbers, and strings.';
    } else if (/[a-zA-Z_$][a-zA-Z0-9_$]*\s*:/.test(errLineText) && !/"\s*:/.test(errLineText)) {
      probableCause = 'Unquoted object key';
      suggestion = 'Wrap object property keys in double quotes, e.g. "key": value.';
    }

    const fixSuggestion = analyzeAndSuggestFix(raw);

    return {
      isValid: false,
      error: {
        message,
        line,
        column,
        position,
        excerpt,
        probableCause,
        suggestion
      },
      fixSuggestion
    };
  }
}

/**
 * Escape JSON for embedding in code (Java, C#, Python, SQL)
 */
export function escapeJsonForCode(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

/**
 * Unescape stringified JSON payload
 */
export function unescapeJsonFromCode(raw: string): string {
  try {
    // If it's a quoted string, parse it once to unescape
    if (raw.startsWith('"') && raw.endsWith('"')) {
      return JSON.parse(raw);
    }
  } catch {
    // Fall back to regex replacement
  }
  return raw
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}

/**
 * Semantic JSON Difference Engine
 * Compares two parsed JSON structures recursively
 */
export function compareJsonSemantic(objA: any, objB: any): JsonDiffResult {
  const differences: JsonDiffItem[] = [];

  function formatVal(v: any): string {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'object') {
      try {
        const s = JSON.stringify(v);
        return s.length > 50 ? `${s.slice(0, 47)}...` : s;
      } catch {
        return '[Object]';
      }
    }
    return String(v);
  }

  function compareRecursive(a: any, b: any, path: string) {
    // Check if both are null or identical primitive
    if (a === b) return;

    // Check type mismatch
    if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || (a === null && b !== null) || (a !== null && b === null)) {
      differences.push({
        path: path || '$',
        type: 'type_mismatch',
        valA: a,
        valB: b,
        description: `Type mismatch: [${Array.isArray(a) ? 'Array' : a === null ? 'null' : typeof a}] vs [${Array.isArray(b) ? 'Array' : b === null ? 'null' : typeof b}]`
      });
      return;
    }

    // Both are primitives or functions
    if (typeof a !== 'object' || a === null) {
      if (a !== b) {
        differences.push({
          path: path || '$',
          type: 'changed',
          valA: a,
          valB: b,
          description: `Value changed from "${formatVal(a)}" to "${formatVal(b)}"`
        });
      }
      return;
    }

    // Both are Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      const maxLen = Math.max(a.length, b.length);
      for (let i = 0; i < maxLen; i++) {
        const curPath = `${path}[${i}]`;
        if (i >= a.length) {
          differences.push({
            path: curPath,
            type: 'added',
            valB: b[i],
            description: `Array element added at index ${i}: ${formatVal(b[i])}`
          });
        } else if (i >= b.length) {
          differences.push({
            path: curPath,
            type: 'removed',
            valA: a[i],
            description: `Array element removed at index ${i}: ${formatVal(a[i])}`
          });
        } else {
          compareRecursive(a[i], b[i], curPath);
        }
      }
      return;
    }

    // Both are Objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    const allKeys = Array.from(new Set([...keysA, ...keysB])).sort();

    for (const key of allKeys) {
      const curPath = path ? `${path}.${key}` : `$.${key}`;
      const hasA = Object.prototype.hasOwnProperty.call(a, key);
      const hasB = Object.prototype.hasOwnProperty.call(b, key);

      if (hasA && !hasB) {
        differences.push({
          path: curPath,
          type: 'removed',
          valA: a[key],
          description: `Key "${key}" was removed (was: ${formatVal(a[key])})`
        });
      } else if (!hasA && hasB) {
        differences.push({
          path: curPath,
          type: 'added',
          valB: b[key],
          description: `Key "${key}" was added (value: ${formatVal(b[key])})`
        });
      } else {
        compareRecursive(a[key], b[key], curPath);
      }
    }
  }

  compareRecursive(objA, objB, '$');

  const added = differences.filter((d) => d.type === 'added').length;
  const removed = differences.filter((d) => d.type === 'removed').length;
  const changed = differences.filter((d) => d.type === 'changed').length;
  const typeMismatches = differences.filter((d) => d.type === 'type_mismatch').length;

  return {
    identical: differences.length === 0,
    summary: {
      added,
      removed,
      changed,
      typeMismatches,
      totalDifferences: differences.length
    },
    differences
  };
}

/**
 * Client-side JSON Schema Draft-07 / Draft-04 / 2020-12 Validator
 * Validates data object against schema specifications
 */
export function validateAgainstJsonSchema(data: any, schema: any): SchemaValidationResult {
  const errors: SchemaValidationError[] = [];
  let evaluatedRulesCount = 0;

  function validateNode(nodeData: any, nodeSchema: any, instancePath: string, schemaPath: string) {
    if (!nodeSchema || typeof nodeSchema !== 'object') return;

    // 1. Type validation
    if (nodeSchema.type) {
      evaluatedRulesCount++;
      const expectedTypes = Array.isArray(nodeSchema.type) ? nodeSchema.type : [nodeSchema.type];
      let matchesType = false;

      for (const t of expectedTypes) {
        if (t === 'null' && nodeData === null) matchesType = true;
        else if (t === 'array' && Array.isArray(nodeData)) matchesType = true;
        else if (t === 'integer' && typeof nodeData === 'number' && Number.isInteger(nodeData)) matchesType = true;
        else if (t === 'number' && typeof nodeData === 'number') matchesType = true;
        else if (t === 'boolean' && typeof nodeData === 'boolean') matchesType = true;
        else if (t === 'string' && typeof nodeData === 'string') matchesType = true;
        else if (t === 'object' && typeof nodeData === 'object' && nodeData !== null && !Array.isArray(nodeData)) matchesType = true;
      }

      if (!matchesType && nodeData !== undefined) {
        errors.push({
          path: instancePath || '$',
          keyword: 'type',
          message: `Expected type [${expectedTypes.join(' | ')}], but found "${Array.isArray(nodeData) ? 'array' : nodeData === null ? 'null' : typeof nodeData}"`,
          schemaPath: `${schemaPath}/type`
        });
        return; // Don't test other rules if type is wrong
      }
    }

    if (nodeData === undefined) return;

    // 2. Enum & Const
    if (nodeSchema.const !== undefined) {
      evaluatedRulesCount++;
      if (nodeData !== nodeSchema.const) {
        errors.push({
          path: instancePath || '$',
          keyword: 'const',
          message: `Must equal constant value "${String(nodeSchema.const)}"`,
          schemaPath: `${schemaPath}/const`
        });
      }
    }

    if (Array.isArray(nodeSchema.enum)) {
      evaluatedRulesCount++;
      const inEnum = nodeSchema.enum.some((val: any) => JSON.stringify(val) === JSON.stringify(nodeData));
      if (!inEnum) {
        errors.push({
          path: instancePath || '$',
          keyword: 'enum',
          message: `Value must be one of: [${nodeSchema.enum.map((v: any) => JSON.stringify(v)).join(', ')}]`,
          schemaPath: `${schemaPath}/enum`
        });
      }
    }

    // 3. String constraints
    if (typeof nodeData === 'string') {
      if (typeof nodeSchema.minLength === 'number') {
        evaluatedRulesCount++;
        if (nodeData.length < nodeSchema.minLength) {
          errors.push({
            path: instancePath || '$',
            keyword: 'minLength',
            message: `String length must be >= ${nodeSchema.minLength} (currently ${nodeData.length})`,
            schemaPath: `${schemaPath}/minLength`
          });
        }
      }

      if (typeof nodeSchema.maxLength === 'number') {
        evaluatedRulesCount++;
        if (nodeData.length > nodeSchema.maxLength) {
          errors.push({
            path: instancePath || '$',
            keyword: 'maxLength',
            message: `String length must be <= ${nodeSchema.maxLength} (currently ${nodeData.length})`,
            schemaPath: `${schemaPath}/maxLength`
          });
        }
      }

      if (nodeSchema.pattern) {
        evaluatedRulesCount++;
        try {
          const regex = new RegExp(nodeSchema.pattern);
          if (!regex.test(nodeData)) {
            errors.push({
              path: instancePath || '$',
              keyword: 'pattern',
              message: `String does not match required pattern "${nodeSchema.pattern}"`,
              schemaPath: `${schemaPath}/pattern`
            });
          }
        } catch {
          // ignore invalid regex in user schema
        }
      }

      if (nodeSchema.format === 'email') {
        evaluatedRulesCount++;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(nodeData)) {
          errors.push({
            path: instancePath || '$',
            keyword: 'format',
            message: `Must be a valid email address`,
            schemaPath: `${schemaPath}/format`
          });
        }
      }
    }

    // 4. Number constraints
    if (typeof nodeData === 'number') {
      if (typeof nodeSchema.minimum === 'number') {
        evaluatedRulesCount++;
        if (nodeData < nodeSchema.minimum) {
          errors.push({
            path: instancePath || '$',
            keyword: 'minimum',
            message: `Number must be >= ${nodeSchema.minimum} (received ${nodeData})`,
            schemaPath: `${schemaPath}/minimum`
          });
        }
      }

      if (typeof nodeSchema.maximum === 'number') {
        evaluatedRulesCount++;
        if (nodeData > nodeSchema.maximum) {
          errors.push({
            path: instancePath || '$',
            keyword: 'maximum',
            message: `Number must be <= ${nodeSchema.maximum} (received ${nodeData})`,
            schemaPath: `${schemaPath}/maximum`
          });
        }
      }
    }

    // 5. Object constraints
    if (typeof nodeData === 'object' && nodeData !== null && !Array.isArray(nodeData)) {
      // Required properties
      if (Array.isArray(nodeSchema.required)) {
        evaluatedRulesCount++;
        for (const reqKey of nodeSchema.required) {
          if (!Object.prototype.hasOwnProperty.call(nodeData, reqKey)) {
            errors.push({
              path: instancePath || '$',
              keyword: 'required',
              message: `Missing required property: "${reqKey}"`,
              schemaPath: `${schemaPath}/required`
            });
          }
        }
      }

      // Properties validation
      if (nodeSchema.properties && typeof nodeSchema.properties === 'object') {
        for (const propKey of Object.keys(nodeSchema.properties)) {
          if (Object.prototype.hasOwnProperty.call(nodeData, propKey)) {
            const childPath = instancePath ? `${instancePath}.${propKey}` : `$.${propKey}`;
            validateNode(nodeData[propKey], nodeSchema.properties[propKey], childPath, `${schemaPath}/properties/${propKey}`);
          }
        }
      }

      // Additional properties constraint
      if (nodeSchema.additionalProperties === false) {
        evaluatedRulesCount++;
        const definedKeys = nodeSchema.properties ? Object.keys(nodeSchema.properties) : [];
        for (const actualKey of Object.keys(nodeData)) {
          if (!definedKeys.includes(actualKey)) {
            errors.push({
              path: instancePath ? `${instancePath}.${actualKey}` : `$.${actualKey}`,
              keyword: 'additionalProperties',
              message: `Additional property "${actualKey}" is not permitted by schema`,
              schemaPath: `${schemaPath}/additionalProperties`
            });
          }
        }
      }
    }

    // 6. Array constraints
    if (Array.isArray(nodeData)) {
      if (typeof nodeSchema.minItems === 'number') {
        evaluatedRulesCount++;
        if (nodeData.length < nodeSchema.minItems) {
          errors.push({
            path: instancePath || '$',
            keyword: 'minItems',
            message: `Array must contain at least ${nodeSchema.minItems} items (found ${nodeData.length})`,
            schemaPath: `${schemaPath}/minItems`
          });
        }
      }

      if (typeof nodeSchema.maxItems === 'number') {
        evaluatedRulesCount++;
        if (nodeData.length > nodeSchema.maxItems) {
          errors.push({
            path: instancePath || '$',
            keyword: 'maxItems',
            message: `Array must contain at most ${nodeSchema.maxItems} items (found ${nodeData.length})`,
            schemaPath: `${schemaPath}/maxItems`
          });
        }
      }

      if (nodeSchema.items && typeof nodeSchema.items === 'object') {
        for (let i = 0; i < nodeData.length; i++) {
          validateNode(nodeData[i], nodeSchema.items, `${instancePath}[${i}]`, `${schemaPath}/items`);
        }
      }
    }
  }

  try {
    validateNode(data, schema, '$', '#');
  } catch (err: any) {
    errors.push({
      path: '$',
      keyword: 'schema_execution',
      message: `Error executing schema validation: ${err.message}`,
      schemaPath: '#'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    evaluatedRulesCount
  };
}
