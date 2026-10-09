import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS_REGISTRY, getToolBySlug } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { searchRajToolBox, getAutocompleteSuggestions } from '../../utils/searchEngine';
import { IconRenderer } from '../common/IconRenderer';
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
  Sparkles,
  BookOpen,
  History,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Award
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    navigate,
    addRecentlyUsed,
    recentlyUsed,
    clearRecentlyUsed
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [searchModalOpen]);

  // Execute advanced search
  const searchResult = searchRajToolBox(query);
  const autocompleteSuggestions = getAutocompleteSuggestions(query, 4);

  // Flat list of items for keyboard navigation (tools then guides)
  const navItems = [
    ...searchResult.tools.map((t) => ({ type: 'tool' as const, slug: t.tool.slug, id: t.tool.id })),
    ...searchResult.guides.map((g) => ({ type: 'guide' as const, slug: g.guide.slug, id: g.guide.slug }))
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < navItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, navItems.length - 1)));
    } else if (e.key === 'Enter' && navItems[selectedIndex]) {
      e.preventDefault();
      const item = navItems[selectedIndex];
      if (item.type === 'tool') {
        handleSelectTool(item.slug);
      } else {
        handleSelectGuide();
      }
    }
  };

  const handleSelectTool = (slug: string) => {
    addRecentlyUsed(slug);
    setSearchModalOpen(false);
    navigate(`/tools/${slug}/`);
  };

  const handleSelectGuide = () => {
    setSearchModalOpen(false);
    navigate('/guides/');
  };

  const handleCategoryClick = (categorySlug: string) => {
    setSearchModalOpen(false);
    navigate(`/${categorySlug}/`);
  };

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setSearchModalOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#18181B] rounded-3xl shadow-2xl border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden flex flex-col z-50 animate-in zoom-in-95 duration-150 max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Intelligent search across RajToolBox"
      >
        {/* Search Input Topbar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E4E4E7] dark:border-[#27272A]">
          <Search className="w-5 h-5 text-[#EC4899] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools or describe your problem (e.g. photo 100 kb, pdf size kam, emi)..."
            className="w-full bg-transparent text-[#18181B] dark:text-[#F4F4F5] text-sm sm:text-base placeholder-[#71717A] dark:placeholder-[#A1A1AA] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-[#71717A] hover:text-[#18181B] dark:hover:text-white mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="px-2 py-1 text-xs font-semibold rounded bg-[#F4F4F5] dark:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B]"
          >
            Esc
          </button>
        </div>

        {/* Autocomplete Quick Pills */}
        {autocompleteSuggestions.length > 0 && (
          <div className="px-4 py-2 border-b border-[#F4F4F5] dark:border-[#27272A] bg-[#FFFDF7]/60 dark:bg-[#121215]/60 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC4899] shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Suggestions:
            </span>
            {autocompleteSuggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(suggestion);
                  setSelectedIndex(0);
                }}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] text-xs shrink-0 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 overscroll-contain">
          {/* 1. When query is empty: Recently Used tools */}
          {!query.trim() && recentlyUsed.length > 0 && (
            <div>
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                <span className="flex items-center gap-1.5 text-[#18181B] dark:text-[#F4F4F5]">
                  <History className="w-3.5 h-3.5 text-[#EC4899]" />
                  Recently Used Tools
                </span>
                <button
                  onClick={clearRecentlyUsed}
                  className="text-[10px] text-[#71717A] hover:text-red-500 font-semibold"
                >
                  Clear History
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                {recentlyUsed.slice(0, 4).map((slug) => {
                  const tool = getToolBySlug(slug);
                  if (!tool) return null;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.slug)}
                      className="p-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-left flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center shrink-0">
                        <IconRenderer name={tool.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] truncate group-hover:text-[#EC4899] transition-colors">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-[#71717A] truncate">
                          {tool.shortDescription}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Tools Results */}
          {searchResult.tools.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
                <span>
                  {query.trim()
                    ? `Tools Found (${searchResult.tools.length})`
                    : 'Popular Everyday Tools'}
                </span>
                {query.trim() && (
                  <span className="text-[10px] font-medium text-[#16A34A] dark:text-[#4ADE80] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Relevance Sorted
                  </span>
                )}
              </div>

              <div className="space-y-1.5 mt-1">
                {searchResult.tools.slice(0, 8).map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const cat = CATEGORIES[item.tool.category];
                  return (
                    <div
                      key={item.tool.id}
                      onClick={() => handleSelectTool(item.tool.slug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border border-[#EC4899]/40 shadow-xs'
                          : 'hover:bg-[#F4F4F5] dark:hover:bg-[#202026] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#EC4899] text-white shadow-xs'
                              : 'bg-[#F4F4F5] dark:bg-[#27272A] text-[#EC4899]'
                          }`}
                        >
                          <IconRenderer name={item.tool.iconName} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] truncate">
                              {item.tool.name}
                            </span>
                            {item.isBestMatch && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EC4899] text-white">
                                BEST MATCH
                              </span>
                            )}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] dark:text-[#FACC15] shrink-0">
                              {cat?.shortName || item.tool.category}
                            </span>
                          </div>

                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] truncate mt-0.5">
                            {item.tool.shortDescription}
                          </p>

                          {/* Reason tag explaining match */}
                          {item.matchedReason && query.trim() && (
                            <p className="text-[10px] text-[#EC4899] font-medium mt-0.5 flex items-center gap-1">
                              <span>• {item.matchedReason}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTool(item.tool.slug);
                          }}
                          className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EC4899] text-white shadow-xs hover:bg-[#DB2777]"
                        >
                          <span>Open Tool</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <CornerDownLeft className="w-4 h-4 text-[#71717A] hidden sm:block opacity-50" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Matched Exams */}
          {searchResult.exams && searchResult.exams.length > 0 && query.trim() && (
            <div className="pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Supported Examinations ({searchResult.exams.length})
                </span>
                <span className="text-[10px] text-[#EC4899] font-semibold">
                  Exam Finder Pre-filtered
                </span>
              </div>
              <div className="space-y-1.5 mt-1">
                {searchResult.exams.slice(0, 4).map((exItem) => (
                  <div
                    key={exItem.exam.id}
                    onClick={() => {
                      setSearchModalOpen(false);
                      navigate('/categories/exam-eligibility-tools/');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-[#F4F4F5] dark:hover:bg-[#202026] border border-transparent hover:border-[#EC4899]/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FACC15]/20 text-[#854D0E] dark:text-[#FACC15] flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5] truncate">
                            {exItem.exam.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#27272A] text-[#71717A]">
                            {exItem.exam.country}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] truncate mt-0.5">
                          {exItem.exam.authority} &middot; Age: {exItem.exam.minAge}–{exItem.exam.maxAge} Yrs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#EC4899] shrink-0 ml-2">
                      <span>View Tools</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Guides Results (Requirement 27: search both Tools and Guides) */}
          {searchResult.guides.length > 0 && query.trim() && (
            <div className="pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Related Guides & Tutorials ({searchResult.guides.length})</span>
              </div>
              <div className="space-y-1.5 mt-1">
                {searchResult.guides.map((item, gIdx) => {
                  const globalIdx = searchResult.tools.length + gIdx;
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <div
                      key={item.guide.slug}
                      onClick={handleSelectGuide}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                          : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#3B82F6]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                          {item.guide.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA]">
                          Guide ({item.guide.readTime})
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 line-clamp-1">
                        {item.guide.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Empty State: Requirement 8 (Didn't find what you need? Suggest categories & common tools) */}
          {searchResult.isEmpty && (
            <div className="py-8 px-4 text-center space-y-5 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#FACC15]/40 flex items-center justify-center mx-auto text-[#EC4899]">
                <HelpCircle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  Didn't find what you need for "{query}"?
                </h4>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 max-w-sm mx-auto">
                  Try searching in English or Hinglish (e.g. <span className="text-[#EC4899] font-medium">photo 100 kb</span>, <span className="text-[#EC4899] font-medium">pdf size kam</span>, <span className="text-[#EC4899] font-medium">emi</span>), or browse popular categories below.
                </p>
              </div>

              {/* Category Suggestions */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">
                  Browse Major Categories
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {searchResult.suggestedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors flex items-center gap-1.5"
                    >
                      <IconRenderer name={cat.iconName} className="w-3.5 h-3.5 text-[#EC4899]" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tools Suggestions */}
              <div className="pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">
                  Common Free Tools
                </p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {searchResult.suggestedTools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTool(t.slug)}
                      className="p-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] bg-white dark:bg-[#18181B] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] transition-colors flex items-center gap-2"
                    >
                      <IconRenderer name={t.iconName} className="w-4 h-4 text-[#EC4899] shrink-0" />
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#FAFAFA] dark:bg-[#141418] border-t border-[#E4E4E7] dark:border-[#27272A] text-xs text-[#71717A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#27272A] rounded border border-[#E4E4E7] dark:border-[#3F3F46]">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#27272A] rounded border border-[#E4E4E7] dark:border-[#3F3F46]">
                ↓
              </kbd>{' '}
              navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#27272A] rounded border border-[#E4E4E7] dark:border-[#3F3F46]">
                ↵
              </kbd>{' '}
              select
            </span>
          </div>
          <span className="text-[11px] font-medium">53+ Verified Tools</span>
        </div>
      </div>
    </div>
  );
};
