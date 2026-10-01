import React from 'react';
import { TOOLS_REGISTRY, getToolBySlug } from '../../data/tools';
import { ToolCard } from './ToolCard';
import { ToolItem } from '../../types';
import { Sparkles } from 'lucide-react';

interface RelatedToolsProps {
  currentTool: ToolItem;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentTool }) => {
  // Find tools from currentTool.relatedToolSlugs or fallback to same category
  const relatedTools: ToolItem[] = currentTool.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolItem => Boolean(t && t.id !== currentTool.id));

  // If fewer than 4, fill with other tools from the same category or popular
  if (relatedTools.length < 4) {
    const sameCat = TOOLS_REGISTRY.filter(
      (t) => t.category === currentTool.category && t.id !== currentTool.id && !relatedTools.some((r) => r.id === t.id)
    );
    relatedTools.push(...sameCat);
  }

  const displayedTools = relatedTools.slice(0, 4);

  if (displayedTools.length === 0) return null;

  return (
    <section className="my-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#EC4899]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Related Tools You May Need
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Explore complementary utilities in {currentTool.category.replace('-', ' ')}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};
