import React from 'react';
import { RealLifeExample } from '../../types';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface RealLifeExampleBoxProps {
  example: RealLifeExample;
  toolName: string;
}

export const RealLifeExampleBox: React.FC<RealLifeExampleBoxProps> = ({ example, toolName }) => {
  return (
    <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-[#EC4899]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Real-Life Example: {example.title}
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Practical walkthrough demonstrating how {toolName} processes realistic user input.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Input box */}
        <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block mb-1.5">
            Initial Input Scenario
          </span>
          <p className="text-xs font-mono text-[#18181B] dark:text-[#F4F4F5] bg-white dark:bg-[#121215] p-3 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] leading-relaxed">
            {example.inputDescription}
          </p>
        </div>

        {/* Output box */}
        <div className="p-4 rounded-xl bg-[#F0FDF4] dark:bg-[#132B1C] border border-[#BBF7D0] dark:border-[#1F4E2E]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A] block mb-1.5">
            Processed Result Output
          </span>
          <p className="text-xs font-mono text-[#18181B] dark:text-[#F4F4F5] bg-white dark:bg-[#121215] p-3 rounded-lg border border-[#BBF7D0] dark:border-[#1F4E2E] leading-relaxed">
            {example.outputDescription}
          </p>
        </div>
      </div>

      {example.details && example.details.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#F4F4F5] dark:border-[#27272A] flex flex-wrap gap-4 text-xs">
          {example.details.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="font-semibold text-[#71717A]">{d.label}:</span>
              <span className="font-mono font-bold text-[#18181B] dark:text-[#F4F4F5] bg-[#F4F4F5] dark:bg-[#27272A] px-2 py-0.5 rounded">
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
