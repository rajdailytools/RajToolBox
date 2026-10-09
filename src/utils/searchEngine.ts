import { ToolItem, GuideItem, CategoryInfo, ExamItem } from '../types';
import { TOOLS_REGISTRY } from '../data/tools';
import { CATEGORIES, CATEGORIES_LIST } from '../data/categories';
import { GUIDES_REGISTRY } from '../data/guides';
import { EXAMS_REGISTRY } from '../data/exams';
import { INTENT_DICTIONARY } from '../data/intents';

export interface ToolSearchResult {
  tool: ToolItem;
  score: number;
  matchedReason?: string;
  isBestMatch?: boolean;
}

export interface GuideSearchResult {
  guide: GuideItem;
  score: number;
}

export interface ExamSearchResult {
  exam: ExamItem;
  score: number;
  matchedReason?: string;
}

export interface SearchResponse {
  query: string;
  tools: ToolSearchResult[];
  exams: ExamSearchResult[];
  guides: GuideSearchResult[];
  totalResults: number;
  isEmpty: boolean;
  suggestedCategories: CategoryInfo[];
  suggestedTools: ToolItem[];
}

// Normalize text for fuzzy matching: lowercase, strip punctuation, clean spaces
export function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesWordBoundary(text: string, phrase: string): boolean {
  if (text === phrase) return true;
  const words = text.split(/\s+/).filter(Boolean);
  const phraseWords = phrase.split(/\s+/).filter(Boolean);
  if (words.length === 0 || phraseWords.length === 0) return false;

  if (phraseWords.length === 1) {
    return words.includes(phraseWords[0]);
  }

  for (let i = 0; i <= words.length - phraseWords.length; i++) {
    let match = true;
    for (let j = 0; j < phraseWords.length; j++) {
      if (words[i + j] !== phraseWords[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

/**
 * Advanced deterministic search engine for RajToolBox
 * Evaluates intent, Hinglish, aliases, keywords, names, and guides without external API calls
 */
export function searchRajToolBox(rawQuery: string): SearchResponse {
  const query = normalizeQuery(rawQuery);

  if (!query) {
    return {
      query: '',
      tools: TOOLS_REGISTRY.filter((t) => t.popular).slice(0, 8).map((tool) => ({
        tool,
        score: 100,
        matchedReason: 'Popular Tool'
      })),
      exams: EXAMS_REGISTRY.slice(0, 4).map((exam) => ({ exam, score: 100, matchedReason: 'Popular Exam' })),
      guides: GUIDES_REGISTRY.slice(0, 3).map((guide) => ({ guide, score: 100 })),
      totalResults: 0,
      isEmpty: false,
      suggestedCategories: CATEGORIES_LIST.slice(0, 4),
      suggestedTools: TOOLS_REGISTRY.filter((t) => t.featured).slice(0, 4)
    };
  }

  const toolScores = new Map<string, { tool: ToolItem; score: number; matchedReason?: string }>();
  const queryTokens = query.split(' ').filter(Boolean);

  // 1. Check Intent & Hinglish Dictionary first (High relevance)
  INTENT_DICTIONARY.forEach((intent) => {
    let matched = false;
    let matchType = '';
    let bonusScore = 0;

    for (const pattern of intent.patterns) {
      const normPattern = normalizeQuery(pattern);
      if (query === normPattern) {
        matched = true;
        matchType = intent.matchedReason;
        bonusScore = 1200;
        break;
      }
      if (matchesWordBoundary(query, normPattern) || matchesWordBoundary(normPattern, query)) {
        matched = true;
        matchType = intent.matchedReason;
        bonusScore = 1000;
        break;
      }
      // Check multi-token overlap
      const pTokens = normPattern.split(' ').filter(Boolean);
      const matchCount = pTokens.filter((pt) => queryTokens.includes(pt)).length;
      if (matchCount >= 2 && matchCount === pTokens.length) {
        matched = true;
        matchType = intent.matchedReason;
        bonusScore = 800;
        break;
      }
    }

    if (matched) {
      const tool = TOOLS_REGISTRY.find((t) => t.slug === intent.toolSlug || t.id === intent.toolSlug);
      if (tool) {
        const existing = toolScores.get(tool.slug);
        const newScore = (existing?.score || 0) + bonusScore;
        toolScores.set(tool.slug, {
          tool,
          score: newScore,
          matchedReason: matchType
        });
      }
    }
  });

  // 2. Score tools across properties
  TOOLS_REGISTRY.forEach((tool) => {
    const normName = normalizeQuery(tool.name);
    const normSlug = normalizeQuery(tool.slug.replace(/-/g, ' '));
    const normDesc = normalizeQuery(tool.shortDescription + ' ' + tool.fullDescription);
    const cat = CATEGORIES[tool.category];
    const normCat = cat ? normalizeQuery(cat.name + ' ' + cat.shortName) : '';

    let score = 0;
    let reason = '';

    // Exact name match
    if (query === normName || query === normSlug) {
      score += 1000;
      reason = 'Exact title match';
    } else if (normName.startsWith(query)) {
      score += 650;
      reason = 'Title starts with query';
    } else if (normName.includes(query)) {
      score += 500;
      reason = 'Found in title';
    }

    // Token matches in name
    let nameTokenHits = 0;
    queryTokens.forEach((token) => {
      if (normName.includes(token)) nameTokenHits++;
    });
    if (nameTokenHits > 0) {
      score += nameTokenHits * 150;
      if (!reason) reason = 'Title keyword match';
    }

    // Keywords match
    tool.keywords.forEach((k) => {
      const normK = normalizeQuery(k);
      if (query === normK) {
        score += 550;
        if (!reason) reason = `Keyword match: "${k}"`;
      } else if (normK.includes(query) || query.includes(normK)) {
        score += 350;
        if (!reason) reason = `Keyword match: "${k}"`;
      }
    });

    // Aliases & intent phrases if present
    tool.aliases?.forEach((alias) => {
      const normA = normalizeQuery(alias);
      if (query === normA || query.includes(normA) || normA.includes(query)) {
        score += 600;
        if (!reason) reason = `Alias match: "${alias}"`;
      }
    });

    tool.useCases?.forEach((uc) => {
      const normU = normalizeQuery(uc);
      if (query === normU || query.includes(normU) || normU.includes(query)) {
        score += 450;
        if (!reason) reason = `Use-case: "${uc}"`;
      }
    });

    tool.problemPhrases?.forEach((pp) => {
      const normP = normalizeQuery(pp);
      if (query === normP || query.includes(normP) || normP.includes(query)) {
        score += 480;
        if (!reason) reason = `Problem match: "${pp}"`;
      }
    });

    // Category match
    if (normCat.includes(query)) {
      score += 220;
      if (!reason) reason = `Category: ${cat?.name}`;
    }

    // Description match
    if (normDesc.includes(query)) {
      score += 120;
      if (!reason) reason = 'Found in tool description';
    }

    if (score > 0) {
      const existing = toolScores.get(tool.slug);
      if (existing) {
        toolScores.set(tool.slug, {
          tool,
          score: existing.score + score,
          matchedReason: existing.matchedReason || reason
        });
      } else {
        toolScores.set(tool.slug, { tool, score, matchedReason: reason });
      }
    }
  });

  // Sort tools descending by relevance score
  const sortedTools: ToolSearchResult[] = Array.from(toolScores.values())
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({
      ...item,
      isBestMatch: idx === 0 && item.score >= 500
    }));

  // 3. Search Exams
  const examResults: ExamSearchResult[] = [];
  EXAMS_REGISTRY.forEach((exam) => {
    const normName = normalizeQuery(exam.name);
    const normShortName = normalizeQuery(exam.shortName);
    const normAuth = normalizeQuery(exam.authority);
    const normCountry = normalizeQuery(exam.country);
    const normDesc = normalizeQuery(exam.shortDescription);

    let score = 0;
    let reason = '';

    if (query === normShortName || query === normName) {
      score += 1200;
      reason = 'Exact exam match';
    } else if (normShortName.startsWith(query) || normName.startsWith(query)) {
      score += 700;
      reason = 'Exam name starts with query';
    } else if (normName.includes(query) || normShortName.includes(query)) {
      score += 550;
      reason = 'Found in exam title';
    }

    if (normAuth.includes(query)) {
      score += 400;
      if (!reason) reason = `Authority: ${exam.authority}`;
    }

    if (normCountry.includes(query)) {
      score += 250;
      if (!reason) reason = `Country: ${exam.country}`;
    }

    if (normDesc.includes(query)) {
      score += 150;
      if (!reason) reason = 'Found in exam overview';
    }

    // Token matching
    queryTokens.forEach((token) => {
      if (normShortName.includes(token)) score += 180;
      if (normAuth.includes(token)) score += 120;
    });

    if (score > 0) {
      examResults.push({ exam, score, matchedReason: reason });
    }
  });

  examResults.sort((a, b) => b.score - a.score);

  // 4. Search Guides
  const guideResults: GuideSearchResult[] = [];
  GUIDES_REGISTRY.forEach((guide) => {
    const normTitle = normalizeQuery(guide.title);
    const normDesc = normalizeQuery(guide.description);
    const normCat = normalizeQuery(guide.category);

    let score = 0;
    if (normTitle.includes(query)) score += 500;
    if (normCat.includes(query)) score += 200;
    if (normDesc.includes(query)) score += 150;

    guide.keywords.forEach((k) => {
      if (normalizeQuery(k).includes(query)) score += 250;
    });

    if (score > 0) {
      guideResults.push({ guide, score });
    }
  });

  guideResults.sort((a, b) => b.score - a.score);

  const totalResults = sortedTools.length + examResults.length + guideResults.length;
  const isEmpty = totalResults === 0;

  // Fallback suggestions for empty state
  const suggestedCategories = isEmpty ? CATEGORIES_LIST.slice(0, 4) : [];
  const suggestedTools = isEmpty ? TOOLS_REGISTRY.filter((t) => t.popular).slice(0, 4) : [];

  return {
    query: rawQuery,
    tools: sortedTools,
    exams: examResults,
    guides: guideResults,
    totalResults,
    isEmpty,
    suggestedCategories,
    suggestedTools
  };
}

/**
 * Autocomplete suggestions generator as user types
 */
export function getAutocompleteSuggestions(query: string, limit = 5): string[] {
  const norm = normalizeQuery(query);
  if (!norm || norm.length < 2) return [];

  const suggestions = new Set<string>();

  // 1. Tool names starting with query
  TOOLS_REGISTRY.forEach((t) => {
    if (normalizeQuery(t.name).startsWith(norm)) {
      suggestions.add(t.name);
    }
  });

  // 2. Exam names starting with query
  EXAMS_REGISTRY.forEach((e) => {
    if (normalizeQuery(e.shortName).startsWith(norm) || normalizeQuery(e.name).startsWith(norm)) {
      suggestions.add(e.name);
    }
  });

  // 3. Intent patterns
  INTENT_DICTIONARY.forEach((item) => {
    item.patterns.forEach((p) => {
      if (p.startsWith(norm)) {
        suggestions.add(p);
      }
    });
  });

  // 4. Tool names containing query
  if (suggestions.size < limit) {
    TOOLS_REGISTRY.forEach((t) => {
      if (normalizeQuery(t.name).includes(norm)) {
        suggestions.add(t.name);
      }
    });
  }

  // 5. Exam names containing query
  if (suggestions.size < limit) {
    EXAMS_REGISTRY.forEach((e) => {
      if (normalizeQuery(e.name).includes(norm)) {
        suggestions.add(e.name);
      }
    });
  }

  // 6. Guide titles containing query
  if (suggestions.size < limit) {
    GUIDES_REGISTRY.forEach((g) => {
      if (normalizeQuery(g.title).includes(norm)) {
        suggestions.add(g.title);
      }
    });
  }

  return Array.from(suggestions).slice(0, limit);
}
