import React from 'react';
import { ToolFormula } from '../../types';
import { Calculator } from 'lucide-react';

interface FormulaBoxProps {
  formula: ToolFormula;
}

export const FormulaBox: React.FC<FormulaBoxProps> = ({ formula }) => {
  return (
    <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
          <Calculator className="w-4 h-4 text-[#EC4899]" />
        </div>
        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
          Mathematical Formula: {formula.title}
        </h2>
      </div>

      {/* Formula presentation */}
      <div className="my-3 p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/50 text-center">
        <div className="text-base sm:text-lg font-mono font-bold text-[#EC4899] tracking-wide">
          {formula.formula}
        </div>
      </div>

      <div className="space-y-3 text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>{formula.explanation}</p>

        {formula.variables.length > 0 && (
          <div>
            <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] block mb-1.5 uppercase text-[10px] tracking-wider">
              Variables & Definitions
            </span>
            <ul className="space-y-1">
              {formula.variables.map((v, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 px-2 py-0.5 rounded">
                    {v.symbol}
                  </span>
                  <span>= {v.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36]">
          <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] text-[11px] block mb-1">
            Worked Example
          </span>
          <p className="font-mono text-[11px] text-[#16A34A] dark:text-[#4ADE80]">
            {formula.workedExample}
          </p>
        </div>
      </div>
    </section>
  );
};
