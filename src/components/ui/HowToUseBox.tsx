import React from 'react';
import { HowToStep } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface HowToUseBoxProps {
  toolName: string;
  steps: HowToStep[];
}

export const HowToUseBox: React.FC<HowToUseBoxProps> = ({ toolName, steps }) => {
  return (
    <section className="my-8 rounded-2xl border-2 border-[#FACC15] bg-[#FFFBEB] dark:bg-[#25200F] p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center text-[#18181B] font-black text-sm">
          !
        </div>
        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#FEF08A]">
          How to Use {toolName}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div
            key={s.step}
            className="bg-white dark:bg-[#18181B] border border-[#FACC15]/40 rounded-xl p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#FACC15] text-[#18181B]">
                  Step {s.step}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              </div>
              <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
                {s.title}
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                {s.instruction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
