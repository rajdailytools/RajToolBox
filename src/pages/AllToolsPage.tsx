import React, { useState } from 'react';
import { TOOLS_REGISTRY } from '../data/tools';
import { CATEGORIES_LIST } from '../data/categories';
import { ToolCard } from '../components/ui/ToolCard';
import { Search, Filter, Layers, Sparkles } from 'lucide-react';

export const AllToolsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'name' | 'popular'>('popular');

  const filteredTools = TOOLS_REGISTRY.filter((t) => {
    const matchesCategory = selectedCat === 'all' || t.category === selectedCat;
    const q = search.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'popular') {
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-150">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs uppercase tracking-widest font-bold text-[#EC4899] mb-2">
          Full Tool Registry
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
          Explore All Online Tools
        </h1>
        <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">
          Discover {TOOLS_REGISTRY.length} free, high-speed tools across 12 categories.
          All running directly in your browser.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-4 sm:p-6 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools by title, keyword, or function..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs sm:text-sm focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-semibold"
            >
              <option value="popular">Popular First</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
              selectedCat === 'all'
                ? 'bg-[#EC4899] text-white shadow-xs'
                : 'bg-[#F4F4F5] dark:bg-[#202026] text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            All Categories ({TOOLS_REGISTRY.length})
          </button>
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                selectedCat === cat.id
                  ? 'bg-[#EC4899] text-white shadow-xs'
                  : 'bg-[#F4F4F5] dark:bg-[#202026] text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-16 text-center border border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl mt-4">
          <Search className="w-8 h-8 text-[#71717A] mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">No matching tools found</h3>
          <p className="text-xs text-[#71717A] mt-1">Try clearing your search query or choosing another category filter.</p>
        </div>
      )}
    </div>
  );
};
