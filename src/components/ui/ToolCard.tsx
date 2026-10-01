import React from 'react';
import { useApp } from '../../context/AppContext';
import { ToolItem } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { IconRenderer } from '../common/IconRenderer';
import { ArrowRight, Bookmark } from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { navigate, isFavorite, toggleFavorite, addRecentlyUsed } = useApp();
  const cat = CATEGORIES[tool.category];
  const favored = isFavorite(tool.slug);

  const handleOpen = () => {
    addRecentlyUsed(tool.slug);
    navigate(`/tools/${tool.slug}/`);
  };

  return (
    <div
      onClick={handleOpen}
      className="group relative bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-5 hover:border-[#EC4899] dark:hover:border-[#EC4899] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center group-hover:scale-105 transition-transform">
            <IconRenderer name={tool.iconName} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#EC4899]">
              {cat?.shortName || tool.category}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.slug);
              }}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#EC4899] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-colors"
              aria-label={favored ? 'Remove from saved' : 'Save tool'}
            >
              <Bookmark className={`w-4 h-4 ${favored ? 'fill-[#EC4899] text-[#EC4899]' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors mb-1.5">
          {tool.name}
        </h3>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between">
        <span className="text-xs font-semibold text-[#EC4899] flex items-center gap-1 group-hover:gap-1.5 transition-all">
          Open Tool
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold">
          100% Free
        </span>
      </div>
    </div>
  );
};
