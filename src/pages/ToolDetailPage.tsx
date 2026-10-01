import React, { useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { HowToUseBox } from '../components/ui/HowToUseBox';
import { RealLifeExampleBox } from '../components/ui/RealLifeExampleBox';
import { AuthorBox } from '../components/ui/AuthorBox';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { RelatedTools } from '../components/ui/RelatedTools';
import { VisualWorkflowDiagram } from '../components/ui/VisualWorkflowDiagram';
import { FormulaBox } from '../components/ui/FormulaBox';
import { VisualGraphBox } from '../components/ui/VisualGraphBox';
import { ToolDispatcher } from '../tools/ToolDispatcher';
import { Bookmark, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ToolDetailPageProps {
  tool: ToolItem;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const category = CATEGORIES[tool.category];
  const favored = isFavorite(tool.slug);

  // Sync document title and canonical meta for SEO
  useEffect(() => {
    document.title = `${tool.name} – Free Online Tool | RajToolBox`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', tool.shortDescription);
    }
  }, [tool]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      {/* 9. TOOL PAGE TOP: Breadcrumb */}
      <Breadcrumb
        categorySlug={category?.slug || tool.category}
        categoryName={category?.name || tool.category}
        toolName={tool.name}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#EC4899]">
              {category?.name || tool.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% In-Browser & Private
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              Client Side
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
            {tool.name}
          </h1>

          <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>

        <button
          onClick={() => toggleFavorite(tool.slug)}
          className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
            favored
              ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
              : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${favored ? 'fill-[#EC4899]' : ''}`} />
          <span>{favored ? 'Saved' : 'Save Tool'}</span>
        </button>
      </div>

      {/* 10. PREMIUM TOOL INTERFACE CARD (Immediately visible) */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-sm p-6 sm:p-8 mb-10">
        <ToolDispatcher tool={tool} />
      </div>

      {/* 11. HOW TO USE BOX (Yellow-accented) */}
      <HowToUseBox toolName={tool.name} steps={tool.howToSteps} />

      {/* 12. LIVE REAL-LIFE EXAMPLE */}
      <RealLifeExampleBox example={tool.realLifeExample} toolName={tool.name} />

      {/* 13. WHAT IS THIS TOOL? */}
      <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
          What is {tool.name}?
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          {tool.fullDescription}
        </p>
      </section>

      {/* 14. HOW DOES IT WORK? */}
      <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
          How Does {tool.name} Work?
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          {tool.howItWorks}
        </p>
      </section>

      {/* 15. FORMULA SECTION (Where mathematically applicable) */}
      {tool.formula && <FormulaBox formula={tool.formula} />}

      {/* 16. DIAGRAM SECTION */}
      <VisualWorkflowDiagram toolName={tool.name} />

      {/* 17. GRAPH / VISUAL EXPLANATION SECTION (Where applicable) */}
      {tool.graphConfig && (
        <VisualGraphBox
          type={tool.graphConfig.type}
          title={tool.graphConfig.title}
          description={tool.graphConfig.description}
          v1={500}
          v2={600}
        />
      )}

      {/* 19. FREQUENTLY ASKED QUESTIONS */}
      <FAQAccordion faqs={tool.faqs} toolName={tool.name} />

      {/* 20. RELATED TOOLS */}
      <RelatedTools currentTool={tool} />

      {/* 21. AUTHOR BOX */}
      <AuthorBox />
    </div>
  );
};
