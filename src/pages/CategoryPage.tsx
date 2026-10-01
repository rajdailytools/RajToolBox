import React, { useState } from 'react';
import { CategoryInfo, ToolItem } from '../types';
import { CATEGORIES_LIST } from '../data/categories';
import { getToolsByCategory } from '../data/tools';
import { ToolCard } from '../components/ui/ToolCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { IconRenderer } from '../components/common/IconRenderer';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { Search, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CategoryPageProps {
  category: CategoryInfo;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { navigate } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const allTools = getToolsByCategory(category.id);

  const filteredTools = allTools.filter((t) => {
    const q = filterQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const otherCategories = CATEGORIES_LIST.filter((c) => c.id !== category.id).slice(0, 4);

  const categoryFaqs = [
    {
      question: `Are all ${category.name} free to use?`,
      answer: `Yes, all tools within ${category.name} on RajToolBox are 100% free with no account or subscription required.`
    },
    {
      question: `Does ${category.name} process my files securely?`,
      answer: `Yes, processing takes place entirely within your local browser sandbox. No user files are uploaded to any external server.`
    },
    {
      question: `Can I access ${category.name} on mobile phones and tablets?`,
      answer: `All utilities on RajToolBox are built mobile-first and perform seamlessly across iOS, Android, macOS, and Windows.`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      <Breadcrumb categorySlug={category.slug} categoryName={category.name} />

      {/* Category Hero */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
                <IconRenderer name={category.iconName} className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
                Category Collection
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
            <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
              Available Tools
            </span>
            <div className="text-3xl font-black text-[#EC4899] mt-0.5">
              {allTools.length}
            </div>
            <span className="text-[10px] text-[#71717A]">Ready to use</span>
          </div>
        </div>

        {/* Filter Input */}
        <div className="mt-8 pt-6 border-t border-[#F4F4F5] dark:border-[#27272A] max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={`Filter ${category.name}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs focus:outline-none focus:border-[#EC4899]"
            />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
            All {category.name} ({filteredTools.length})
          </h2>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl">
            <p className="text-sm font-semibold text-[#71717A]">
              No tools matching "{filterQuery}" in this category.
            </p>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="my-12">
        <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-4">
          Related Tool Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/${c.slug}/`)}
              className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-left hover:border-[#EC4899] transition-all group"
            >
              <IconRenderer name={c.iconName} className="w-5 h-5 text-[#EC4899] mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                {c.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category FAQ */}
      <FAQAccordion faqs={categoryFaqs} toolName={category.name} />
    </div>
  );
};
