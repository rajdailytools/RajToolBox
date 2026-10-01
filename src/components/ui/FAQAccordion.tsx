import React, { useState } from 'react';
import { ToolFAQ } from '../../types';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQAccordionProps {
  faqs: ToolFAQ[];
  toolName: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs, toolName }) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="my-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-[#EC4899]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Frequently Asked Questions about {toolName}
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Direct answers to common questions regarding functionality, accuracy, and browser security.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl bg-white dark:bg-[#18181B] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#71717A] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-[#EC4899]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed border-t border-[#F4F4F5] dark:border-[#27272A] pt-3 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
