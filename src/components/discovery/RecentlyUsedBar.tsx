import React from 'react';
import { useApp } from '../../context/AppContext';
import { getToolBySlug } from '../../data/tools';
import { IconRenderer } from '../common/IconRenderer';
import { History, X } from 'lucide-react';

export const RecentlyUsedBar: React.FC = () => {
  const { recentlyUsed, clearRecentlyUsed, navigate } = useApp();

  if (recentlyUsed.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 animate-in fade-in">
      <div className="p-3 px-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px] shrink-0">
          <History className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>Recently Used:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {recentlyUsed.slice(0, 6).map((slug) => {
            const tool = getToolBySlug(slug);
            if (!tool) return null;
            return (
              <button
                key={tool.id}
                onClick={() => navigate(`/tools/${tool.slug}/`)}
                className="px-2.5 py-1 rounded-xl bg-[#F4F4F5] dark:bg-[#202026] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20 hover:text-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <IconRenderer name={tool.iconName} className="w-3 h-3 text-[#EC4899]" />
                <span className="truncate max-w-[140px]">{tool.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={clearRecentlyUsed}
          className="text-[10px] text-[#71717A] hover:text-red-500 font-semibold shrink-0"
          title="Clear recent tool history"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
