import React from 'react';
import { BarChart3 } from 'lucide-react';

interface VisualGraphBoxProps {
  type: string;
  title: string;
  description: string;
  v1?: number;
  v2?: number;
}

export const VisualGraphBox: React.FC<VisualGraphBoxProps> = ({
  title,
  description,
  v1 = 500,
  v2 = 600
}) => {
  const maxVal = Math.max(v1, v2, 1);
  const p1 = Math.round((v1 / maxVal) * 100);
  const p2 = Math.round((v2 / maxVal) * 100);

  return (
    <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-[#EC4899]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Visual Explanation: {title}
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36]">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Baseline Value: {v1}</span>
              <span className="text-[#71717A]">{p1}%</span>
            </div>
            <div className="h-4 w-full bg-[#E4E4E7] dark:bg-[#27272A] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#71717A] rounded-full transition-all duration-500"
                style={{ width: `${p1}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#EC4899]">Final Value: {v2}</span>
              <span className="text-[#EC4899] font-bold">{p2}%</span>
            </div>
            <div className="h-4 w-full bg-[#E4E4E7] dark:bg-[#27272A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#EC4899] to-[#FACC15] rounded-full transition-all duration-500"
                style={{ width: `${p2}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E4E4E7] dark:border-[#2E2E36] text-[11px] text-[#71717A] dark:text-[#A1A1AA] flex items-center justify-between">
          <span>Relative Ratio: {(v2 / (v1 || 1)).toFixed(2)}x</span>
          <span className="font-bold text-[#16A34A]">
            {v2 >= v1 ? `+${(((v2 - v1) / (v1 || 1)) * 100).toFixed(1)}% Gain` : `${(((v2 - v1) / (v1 || 1)) * 100).toFixed(1)}% Reduction`}
          </span>
        </div>
      </div>
    </section>
  );
};
