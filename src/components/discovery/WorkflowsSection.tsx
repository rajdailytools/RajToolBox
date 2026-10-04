import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOL_WORKFLOWS, ToolWorkflow } from '../../data/workflows';
import { IconRenderer } from '../common/IconRenderer';
import { ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export const WorkflowsSection: React.FC = () => {
  const { navigate, addRecentlyUsed } = useApp();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(TOOL_WORKFLOWS[0].id);

  const activeWorkflow = TOOL_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || TOOL_WORKFLOWS[0];

  const handleLaunchStep = (toolSlug: string) => {
    addRecentlyUsed(toolSlug);
    navigate(`/tools/${toolSlug}/`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="bg-[#FFFDF7] dark:bg-[#151519] border border-[#FACC15]/40 rounded-3xl p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#854D0E] dark:text-[#FACC15] mb-1">
              <Layers className="w-4 h-4" />
              <span>Multi-Step Productivity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
              Curated Tool Chains & Workflows
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1 max-w-2xl">
              Solve complex multi-step digital tasks with structured tool pipelines that chain seamlessly together.
            </p>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {TOOL_WORKFLOWS.map((wf) => (
            <button
              key={wf.id}
              onClick={() => setSelectedWorkflowId(wf.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                selectedWorkflowId === wf.id
                  ? 'bg-[#EC4899] text-white shadow-xs'
                  : 'bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899]'
              }`}
            >
              <IconRenderer name={wf.iconName} className="w-4 h-4" />
              <span>{wf.title}</span>
            </button>
          ))}
        </div>

        {/* Active Workflow Card & Pipeline Steps */}
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F4F5] dark:border-[#27272A]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  {activeWorkflow.title}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EC4899]/15 text-[#EC4899]">
                  {activeWorkflow.badge}
                </span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">
                {activeWorkflow.description}
              </p>
            </div>
            <button
              onClick={() => handleLaunchStep(activeWorkflow.steps[0].toolSlug)}
              className="px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Start Workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeWorkflow.steps.map((st, i) => (
              <div
                key={st.step}
                className="relative p-5 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] flex flex-col justify-between hover:border-[#EC4899] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white text-[11px] font-mono font-bold flex items-center justify-center">
                      {st.step}
                    </span>
                    <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider">
                      Step {st.step} of {activeWorkflow.steps.length}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">
                    {st.title}
                  </h4>
                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
                  <button
                    onClick={() => handleLaunchStep(st.toolSlug)}
                    className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
                  >
                    <span>Launch Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
