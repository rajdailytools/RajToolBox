/**
 * RajToolBox Text Case & Formatting Engine
 * 100% Client-Side In-Browser Transformation, Cleaning & Statistics
 */

export type CaseMode =
  | 'uppercase'
  | 'lowercase'
  | 'title-case'
  | 'sentence-case'
  | 'capitalize-words'
  | 'capitalize-first'
  | 'alternating-case'
  | 'inverse-case'
  | 'camel-case'
  | 'pascal-case'
  | 'snake-case'
  | 'kebab-case'
  | 'constant-case'
  | 'dot-case'
  | 'path-case'
  | 'space-case';

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  nonEmptyLines: number;
  sentences: number;
  readingTimeMinutes: number;
}

export interface CleanupOptions {
  removeExtraSpaces?: boolean;
  trimAllLines?: boolean;
  removeEmptyLines?: boolean;
  collapseBlankLines?: boolean;
  normalizeLineBreaks?: boolean;
  tabsToSpaces?: boolean;
  normalizeQuotes?: boolean;
  normalizeDashes?: boolean;
  removeInvisibleChars?: boolean;
  removeSpacesBeforePunctuation?: boolean;
}

// Common minor English words that shouldn't be capitalized in Title Case (unless first or last word)
const TITLE_CASE_STOP_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'from',
  'how', 'if', 'in', 'into', 'is', 'it', 'near', 'nor', 'of', 'off',
  'on', 'onto', 'or', 'out', 'over', 'per', 'so', 'than', 'the',
  'to', 'unto', 'up', 'upon', 'v', 'vs', 'via', 'with', 'yet'
]);

/**
 * Intelligent word tokenizer for programming cases (camelCase, snake_case, etc.)
 * Splits on whitespace, underscores, hyphens, dots, slashes, and camelCase transitions.
 */
export function tokenizeWords(input: string): string[] {
  if (!input) return [];

  // Normalize invisible characters and clean up control characters
  const clean = input
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Regex to split on camelCase transitions, e.g. "XMLHttpRequest" -> "XML", "Http", "Request"
  // and handle numbers, underscores, hyphens, spaces, dots, slashes
  const tokens: string[] = [];

  // First split by explicit non-alphanumeric delimiters (excluding internal letters)
  const roughChunks = clean.split(/[\s_\-./\\:,;|+*=<>()[\]{}'"`~^?!]+/);

  for (const chunk of roughChunks) {
    if (!chunk) continue;

    // Detect camelCase or PascalCase inside the chunk: e.g. "camelCaseWord" -> "camel", "Case", "Word"
    // Also "ABCWord" -> "ABC", "Word"
    const subTokens = chunk.match(/([A-Z]+(?=[A-Z][a-z0-9]|$)|[A-Z]?[a-z0-9]+|[A-Z]+)/g);
    if (subTokens) {
      for (const st of subTokens) {
        if (st) tokens.push(st);
      }
    } else {
      tokens.push(chunk);
    }
  }

  return tokens;
}

/**
 * 1. UPPERCASE
 */
export function toUppercase(text: string): string {
  return text.toUpperCase();
}

/**
 * 2. lowercase
 */
export function toLowercase(text: string): string {
  return text.toLowerCase();
}

/**
 * 3. Title Case
 * Capitalizes principal words, keeps minor words lowercase (unless first or last word of title/line).
 * Handles hyphenated words, quotes, and punctuation safely.
 */
export function toTitleCase(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');

  const processedLines = lines.map((line) => {
    if (!line.trim()) return line;

    // Split line into words and whitespace/punctuation delimiters while keeping delimiters
    const tokens = line.split(/(\s+|[-–—/])/);

    // Identify which tokens are actual words
    const wordIndices: number[] = [];
    tokens.forEach((t, idx) => {
      if (/[A-Za-z0-9]/.test(t)) {
        wordIndices.push(idx);
      }
    });

    const firstWordIdx = wordIndices.length > 0 ? wordIndices[0] : -1;
    const lastWordIdx = wordIndices.length > 0 ? wordIndices[wordIndices.length - 1] : -1;

    return tokens
      .map((token, idx) => {
        // If not a word token, return as is
        if (!/[A-Za-z0-9]/.test(token)) {
          return token;
        }

        const lower = token.toLowerCase();

        // Check if token has internal uppercase that might be an acronym/brand (e.g., iPhone, NASA, URL)
        // If whole token is all caps and length <= 4, keep it (e.g. "PDF", "API", "AI", "USA")
        if (/^[A-Z]{2,4}$/.test(token)) {
          return token;
        }

        const isFirst = idx === firstWordIdx;
        const isLast = idx === lastWordIdx;

        // If it's a stop word and not first or last word, keep lowercase
        if (!isFirst && !isLast && TITLE_CASE_STOP_WORDS.has(lower)) {
          return lower;
        }

        // Capitalize the first letter, lowercase the rest (preserving acronyms or punctuation)
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join('');
  });

  return processedLines.join('\n');
}

/**
 * 4. Sentence case
 * Capitalizes the beginning of each sentence (after . ! ? or line breaks).
 * Preserves decimal numbers (e.g. 3.14) and common web protocols/emails.
 */
export function toSentenceCase(text: string): string {
  if (!text) return '';

  // Process line by line to preserve formatting and list structures
  const lines = text.split('\n');

  const processedLines = lines.map((line) => {
    if (!line.trim()) return line;

    // Convert everything to lowercase first, then capitalize sentence starts
    const lower = line.toLowerCase();

    // Regex match start of line, or punctuation followed by spaces
    // We avoid matching numbers after dots (e.g., 3.14)
    return lower.replace(/(^\s*["'(«[]*|[.!?]\s+["'(«[]*)([a-z\u00E0-\u00FF])/g, (match, prefix, char) => {
      return prefix + char.toUpperCase();
    });
  });

  return processedLines.join('\n');
}

/**
 * 5. Capitalize Each Word (Start Case)
 * Capitalizes every single word regardless of grammar rules.
 */
export function toCapitalizeWords(text: string): string {
  if (!text) return '';
  return text.replace(/\b([a-z\u00E0-\u00FF])/g, (match, char) => char.toUpperCase());
}

/**
 * 6. Capitalize First Letter
 * Capitalizes only the very first letter of the whole text.
 */
export function toCapitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.replace(/^(\s*)([a-z\u00E0-\u00FF])/i, (match, prefix, char) => prefix + char.toUpperCase());
}

/**
 * 7. aLtErNaTiNg CaSe (SpongeBob Case)
 * Alternates between lowercase and uppercase letters, skipping spaces.
 */
export function toAlternatingCase(text: string): string {
  if (!text) return '';
  let upper = false;
  return text
    .split('')
    .map((ch) => {
      if (/[A-Za-z\u00E0-\u00FF]/.test(ch)) {
        upper = !upper;
        return upper ? ch.toUpperCase() : ch.toLowerCase();
      }
      return ch;
    })
    .join('');
}

/**
 * 8. iNVERSE cASE (Toggle Case)
 * Inverts the casing of every character.
 */
export function toInverseCase(text: string): string {
  if (!text) return '';
  return text
    .split('')
    .map((ch) => {
      if (ch === ch.toUpperCase()) {
        return ch.toLowerCase();
      } else {
        return ch.toUpperCase();
      }
    })
    .join('');
}

/**
 * 9. camelCase
 * e.g., "hello world example" -> "helloWorldExample"
 * If input has multiple lines, convert line-by-line if desired, or whole text.
 */
export function toCamelCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens
        .map((token, i) => {
          const lower = token.toLowerCase();
          if (i === 0) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    })
    .join('\n');
}

/**
 * 10. PascalCase
 * e.g., "hello world example" -> "HelloWorldExample"
 */
export function toPascalCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens
        .map((token) => {
          const lower = token.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    })
    .join('\n');
}

/**
 * 11. snake_case
 * e.g., "hello world example" -> "hello_world_example"
 */
export function toSnakeCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens.map((t) => t.toLowerCase()).join('_');
    })
    .join('\n');
}

/**
 * 12. kebab-case
 * e.g., "hello world example" -> "hello-world-example"
 */
export function toKebabCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens.map((t) => t.toLowerCase()).join('-');
    })
    .join('\n');
}

/**
 * 13. CONSTANT_CASE
 * e.g., "hello world example" -> "HELLO_WORLD_EXAMPLE"
 */
export function toConstantCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens.map((t) => t.toUpperCase()).join('_');
    })
    .join('\n');
}

/**
 * 14. dot.case
 * e.g., "hello world example" -> "hello.world.example"
 */
export function toDotCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens.map((t) => t.toLowerCase()).join('.');
    })
    .join('\n');
}

/**
 * 15. path/case
 * e.g., "hello world example" -> "hello/world/example"
 */
export function toPathCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens.map((t) => t.toLowerCase()).join('/');
    })
    .join('\n');
}

/**
 * 16. space case
 * e.g., "helloWorldExample" -> "hello world example"
 */
export function toSpaceCase(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const tokens = tokenizeWords(line);
      if (tokens.length === 0) return '';
      return tokens.map((t) => t.toLowerCase()).join(' ');
    })
    .join('\n');
}

/**
 * Master dispatcher for any case mode
 */
export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'uppercase':
      return toUppercase(text);
    case 'lowercase':
      return toLowercase(text);
    case 'title-case':
      return toTitleCase(text);
    case 'sentence-case':
      return toSentenceCase(text);
    case 'capitalize-words':
      return toCapitalizeWords(text);
    case 'capitalize-first':
      return toCapitalizeFirstLetter(text);
    case 'alternating-case':
      return toAlternatingCase(text);
    case 'inverse-case':
      return toInverseCase(text);
    case 'camel-case':
      return toCamelCase(text);
    case 'pascal-case':
      return toPascalCase(text);
    case 'snake-case':
      return toSnakeCase(text);
    case 'kebab-case':
      return toKebabCase(text);
    case 'constant-case':
      return toConstantCase(text);
    case 'dot-case':
      return toDotCase(text);
    case 'path-case':
      return toPathCase(text);
    case 'space-case':
      return toSpaceCase(text);
    default:
      return text;
  }
}

/**
 * Text & Whitespace Cleanup Actions
 */
export function applyCleanup(text: string, options: CleanupOptions): string {
  if (!text) return '';
  let result = text;

  // 1. Normalize line breaks first to \n
  if (options.normalizeLineBreaks !== false) {
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  // 2. Remove invisible control characters and zero-width spaces
  if (options.removeInvisibleChars) {
    result = result
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ') // Non-breaking space to regular space
      .replace(/[\u2000-\u200A\u202F\u205F]/g, ' '); // En/em/thin spaces to regular space
  }

  // 3. Tabs to spaces
  if (options.tabsToSpaces) {
    result = result.replace(/\t/g, '  ');
  }

  // 4. Normalize quotes (smart/curly to straight)
  if (options.normalizeQuotes) {
    result = result
      .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  }

  // 5. Normalize dashes (em-dash, en-dash to hyphen)
  if (options.normalizeDashes) {
    result = result.replace(/[\u2013\u2014\u2012\u2015]/g, '-');
  }

  // 6. Remove spaces before punctuation (e.g., "hello , world !" -> "hello, world!")
  if (options.removeSpacesBeforePunctuation) {
    result = result.replace(/\s+([,.:;?!])/g, '$1');
  }

  // 7. Trim all lines
  if (options.trimAllLines) {
    result = result
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
  }

  // 8. Remove extra spaces within lines (collapse multiple spaces)
  if (options.removeExtraSpaces) {
    result = result
      .split('\n')
      .map((line) => line.replace(/[ \t]{2,}/g, ' '))
      .join('\n');
  }

  // 9. Remove empty lines entirely
  if (options.removeEmptyLines) {
    result = result
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');
  }

  // 10. Collapse multiple blank lines into a single blank line
  if (options.collapseBlankLines) {
    result = result.replace(/\n{3,}/g, '\n\n');
  }

  return result;
}

/**
 * PDF & Copied Text Specialized Cleaner
 * Solves hard breaks from PDF line wraps, ChatGPT, Notion, Word, etc.
 */
export function cleanCopiedText(
  text: string,
  mode: 'preserve-paragraphs' | 'join-lines' = 'preserve-paragraphs'
): string {
  if (!text) return '';

  // Step 1: Normalize line breaks & strip invisible zero-width chars
  let cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\t/g, ' ');

  // Step 2: Handle hyphenated words at line wrap (e.g. "interna-\ntional" -> "international")
  cleaned = cleaned.replace(/(\b[A-Za-z]+)-\n([a-z]+\b)/g, '$1$2');

  if (mode === 'join-lines') {
    // Join every line into a single continuous stream
    return cleaned
      .replace(/\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // mode === 'preserve-paragraphs':
  // Double newlines (or more) represent distinct paragraphs.
  // Single newlines represent artificial wrap breaks that should be joined into a single space.
  const paragraphs = cleaned.split(/\n{2,}/);

  const mergedParagraphs = paragraphs.map((para) => {
    // Trim lines
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
    // Join lines in paragraph with space, collapsing multi-spaces
    return lines.join(' ').replace(/\s{2,}/g, ' ');
  });

  return mergedParagraphs.filter(Boolean).join('\n\n').trim();
}

/**
 * Compute real-time text statistics
 */
export function computeTextStats(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      nonEmptyLines: 0,
      sentences: 0,
      readingTimeMinutes: 0
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Word count: split by whitespace
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;

  // Lines
  const lineArray = text.split('\n');
  const lines = lineArray.length;
  const nonEmptyLines = lineArray.filter((l) => l.trim().length > 0).length;

  // Sentence count: approximate by sentence endings (. ! ? followed by space or end)
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s+|$)/g);
  const sentences = sentenceMatches ? sentenceMatches.length : (words > 0 ? 1 : 0);

  // Reading time at ~200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    nonEmptyLines,
    sentences,
    readingTimeMinutes
  };
}

/**
 * Sample test text with realistic real-world formatting problems
 */
export const SAMPLE_TEXT = `hello WORLD! this is a DEMO of rajtoolbox text case converter.

it handles messy copied text,   multiple    extra   spaces,
and even programming variable names like:
user_profile_id, apiResponseStatus, and MAX_BUFFER_SIZE.

Here is a website: https://rajtoolbox.com and email: support@rajtoolbox.com!
Also handles: "smart quotes", hyphenated-words, and 3.14 decimal numbers.`;
