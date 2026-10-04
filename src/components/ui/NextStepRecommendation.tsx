import React from 'react';
import { useApp } from '../../context/AppContext';
import { ToolItem } from '../../types';
import { getToolBySlug } from '../../data/tools';
import { IconRenderer } from '../common/IconRenderer';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface NextStepRecommendationProps {
  tool: ToolItem;
}

export const NextStepRecommendation: React.FC<NextStepRecommendationProps> = ({ tool }) => {
  const { navigate, addRecentlyUsed } = useApp();

  // Next steps defined directly or fallback derived from relatedToolSlugs
  const nextSteps =
    tool.nextSteps && tool.nextSteps.length > 0
      ? tool.nextSteps
      : tool.relatedToolSlugs.slice(0, 2).map((slug) => {
          const relTool = getToolBySlug(slug);
          return {
            slug,
            label: relTool?.name || slug,
            reason: `Continue your workflow with ${relTool?.name || slug}`
          };
        });

  if (nextSteps.length === 0) return null;

  const handleGoToNext = (slug: string) => {
    addRecentlyUsed(slug);
    navigate(`/tools/${slug}/`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-8 p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#151519] border border-[#FACC15]/40 animate-in fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#EC4899]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#854D0E] dark:text-[#FACC15]">
          Recommended Next Step
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nextSteps.map((step) => {
          const nextTool = getToolBySlug(step.slug);
          if (!nextTool) return null;

          return (
            <button
              key={step.slug}
              onClick={() => handleGoToNext(step.slug)}
              className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-left transition-all group flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                <IconRenderer name={nextTool.iconName} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors flex items-center gap-1.5">
                  <span>{step.label}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-relaxed">
                  {step.reason}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
