import React from 'react';
import { ArrowRight, CheckCircle2, Cpu, Download, FileUp, Sparkles } from 'lucide-react';

interface VisualWorkflowDiagramProps {
  toolName: string;
}

export const VisualWorkflowDiagram: React.FC<VisualWorkflowDiagramProps> = ({ toolName }) => {
  const steps = [
    { title: 'User Input', desc: 'File or text provided locally', icon: FileUp },
    { title: 'Client Processing', desc: 'Evaluated in browser memory', icon: Cpu },
    { title: 'Validation', desc: 'Real-time syntax & error checks', icon: CheckCircle2 },
    { title: 'Instant Output', desc: 'Computed result preview', icon: Sparkles },
    { title: 'Copy / Download', desc: 'Zero cloud upload storage', icon: Download }
  ];

  return (
    <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
          How It Works — Visual Guide
        </h2>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
          End-to-end client-side workflow for {toolName}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36] relative"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mb-2">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#18181B] dark:text-[#F4F4F5]">
                {s.title}
              </span>
              <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                {s.desc}
              </span>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#EC4899]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
