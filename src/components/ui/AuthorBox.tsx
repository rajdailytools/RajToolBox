import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';

export const AuthorBox: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#FACC15] p-0.5 shrink-0 shadow-md">
          <div className="w-full h-full bg-white dark:bg-[#18181B] rounded-[14px] flex items-center justify-center font-black text-xl text-[#EC4899]">
            RS
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            <span className="font-bold uppercase tracking-wider text-[#EC4899]">
              About the Author
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#18181B] dark:text-[#F4F4F5]">
              <GraduationCap className="w-3.5 h-3.5 text-[#EC4899]" />
              B.Sc. Physics
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Creator
            </span>
          </div>

          <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
            <button
              onClick={() => navigate('/about/')}
              className="hover:text-[#EC4899] transition-colors underline decoration-[#EC4899]/40 underline-offset-4"
            >
              Raj Singh Sengar
            </button>
          </h3>

          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1.5 leading-relaxed">
            Raj Singh Sengar is the creator of RajToolBox, a practical online tools platform focused on building simple, useful and accessible digital utilities for everyday users.
          </p>
        </div>

        <button
          onClick={() => navigate('/about/')}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] transition-all"
        >
          <span>Read Full Bio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
