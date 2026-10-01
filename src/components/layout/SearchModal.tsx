import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS_REGISTRY } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { ToolItem } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, navigate, addRecentlyUsed } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

  // Filter tools
  const filteredTools: ToolItem[] = query.trim()
    ? TOOLS_REGISTRY.filter((tool) => {
        const q = query.toLowerCase();
        const categoryName = CATEGORIES[tool.category]?.name.toLowerCase() || '';
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          categoryName.includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }).slice(0, 10)
    : TOOLS_REGISTRY.filter((t) => t.popular).slice(0, 6);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelectTool(filteredTools[selectedIndex].slug);
    }
  };

  const handleSelectTool = (slug: string) => {
    addRecentlyUsed(slug);
    setSearchModalOpen(false);
    navigate(`/tools/${slug}/`);
  };

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setSearchModalOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl border border-[#E4E4E7] dark:border-[#27272A] overflow-hidden flex flex-col z-50 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Search tools across RajToolBox"
      >
        {/* Search Input Bar */}
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
            placeholder="Search tools by name, category, or task (e.g. compress, json, unit)..."
            className="w-full bg-transparent text-[#18181B] dark:text-[#F4F4F5] text-base placeholder-[#71717A] dark:placeholder-[#A1A1AA] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#71717A] hover:text-[#18181B] dark:hover:text-white mr-2"
              aria-label="Clear search"
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

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
            <span>{query.trim() ? `Search Results (${filteredTools.length})` : 'Popular Tools'}</span>
            {!query.trim() && (
              <span className="flex items-center gap-1 text-[#EC4899]">
                <Sparkles className="w-3 h-3" />
                Quick suggestions
              </span>
            )}
          </div>

          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const cat = CATEGORIES[tool.category];
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border border-[#EC4899]/30'
                      : 'hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#EC4899] text-white shadow-xs'
                          : 'bg-[#F4F4F5] dark:bg-[#27272A] text-[#EC4899]'
                      }`}
                    >
                      <IconRenderer name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] truncate">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] dark:text-[#FACC15] shrink-0">
                          {cat?.shortName || tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] truncate mt-0.5">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTool(tool.slug);
                      }}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EC4899] text-white shadow-xs hover:bg-[#DB2777]"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <CornerDownLeft className="w-4 h-4 text-[#71717A] hidden sm:block" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Search className="w-10 h-10 text-[#71717A] mx-auto mb-3 opacity-40" />
              <h4 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
                No tools found for "{query}"
              </h4>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-xs mx-auto mt-1">
                Try searching for broader keywords such as PDF, image, text, JSON, or converter.
              </p>
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
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#27272A] rounded border border-[#E4E4E7] dark:border-[#3F3F46]">
                ↵
              </kbd>{' '}
              to open
            </span>
          </div>
          <span>Total Tools: {TOOLS_REGISTRY.length}</span>
        </div>
      </div>
    </div>
  );
};
