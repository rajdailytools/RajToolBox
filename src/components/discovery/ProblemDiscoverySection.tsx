import React from 'react';
import { useApp } from '../../context/AppContext';
import { WHAT_DO_YOU_WANT_TO_DO } from '../../data/intents';
import { IconRenderer } from '../common/IconRenderer';
import { ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

export const ProblemDiscoverySection: React.FC = () => {
  const { navigate, addRecentlyUsed, setSearchModalOpen } = useApp();

  const handleSelectProblem = (slug: string) => {
    addRecentlyUsed(slug);
    navigate(`/tools/${slug}/`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EC4899] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Problem-Solving Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
              What do you want to do?
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1 max-w-2xl">
              Don't worry about tool names. Choose the exact task or problem you need to solve right now.
            </p>
          </div>

          <button
            onClick={() => setSearchModalOpen(true)}
            className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Have a specific search?</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 12 Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {WHAT_DO_YOU_WANT_TO_DO.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectProblem(item.toolSlug)}
              className="p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] hover:border-[#EC4899] hover:shadow-xs transition-all text-left flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                <IconRenderer name={item.iconName} className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#3F3F46] text-[#71717A] dark:text-[#A1A1AA]">
                    {item.categoryName}
                  </span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold text-[#EC4899]">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors leading-snug">
                  {item.problem}
                </h3>

                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-1 line-clamp-2 leading-relaxed">
                  {item.sublabel}
                </p>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#EC4899]">
                  <span>Solve this task</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Problem Queries in Hinglish & English */}
        <div className="pt-4 border-t border-[#E4E4E7] dark:border-[#27272A] flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
          <span className="font-bold text-[#71717A] shrink-0 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#FACC15]" />
            Common queries:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'pdf chota karna hai', slug: 'pdf-compressor' },
              { label: 'photo 100 kb size', slug: 'image-compressor' },
              { label: 'signature resize', slug: 'image-resizer' },
              { label: 'loan emi nikalna', slug: 'loan-emi-calculator' },
              { label: 'percentage kaise nikale', slug: 'percentage-calculator' },
              { label: 'qr banana hai', slug: 'qr-code-generator' }
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectProblem(q.slug)}
                className="px-2.5 py-1 rounded-lg bg-[#F4F4F5] dark:bg-[#202026] text-[#71717A] dark:text-[#D4D4D8] hover:text-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20 transition-colors"
              >
                "{q.label}" &rarr;
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
