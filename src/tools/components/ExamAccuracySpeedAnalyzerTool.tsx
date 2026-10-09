import React, { useState, useMemo } from 'react';
import { BookMarked, RotateCcw, Clock, Target, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ExamAccuracySpeedAnalyzerTool: React.FC = () => {
  const [totalQuestions, setTotalQuestions] = useState<number>(100);
  const [attempted, setAttempted] = useState<number>(80);
  const [correct, setCorrect] = useState<number>(68);
  const [timeTakenMinutes, setTimeTakenMinutes] = useState<number>(60);

  const stats = useMemo(() => {
    const validAttempted = Math.min(attempted, totalQuestions);
    const validCorrect = Math.min(correct, validAttempted);
    const incorrect = validAttempted - validCorrect;
    const accuracy = validAttempted > 0 ? (validCorrect / validAttempted) * 100 : 0;
    const secPerQuestion = timeTakenMinutes > 0 && validAttempted > 0 ? Math.round((timeTakenMinutes * 60) / validAttempted) : 0;
    const questionsPerHour = timeTakenMinutes > 0 ? Math.round((validAttempted / timeTakenMinutes) * 60) : 0;

    return {
      accuracy: Number(accuracy.toFixed(1)),
      secPerQuestion,
      questionsPerHour,
      incorrect
    };
  }, [totalQuestions, attempted, correct, timeTakenMinutes]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2 border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <BookMarked className="w-4 h-4 text-[#EC4899]" />
            Mock Test Session Stats
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Total Questions
              </label>
              <input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Attempted
              </label>
              <input
                type="number"
                value={attempted}
                onChange={(e) => setAttempted(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Correct Answers
              </label>
              <input
                type="number"
                value={correct}
                onChange={(e) => setCorrect(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Time Taken (Minutes)
              </label>
              <input
                type="number"
                value={timeTakenMinutes}
                onChange={(e) => setTimeTakenMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Accuracy
                </span>
                <div className="text-2xl font-black text-[#16A34A] mt-0.5">{stats.accuracy}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Avg Time / Q
                </span>
                <div className="text-2xl font-black text-[#EC4899] mt-0.5">{stats.secPerQuestion}s</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Pacing
                </span>
                <div className="text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                  {stats.questionsPerHour} Q/hr
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-xs space-y-1">
              <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] block">Pacing Recommendation:</span>
              <p className="text-[#71717A] leading-relaxed">
                For tier-1 competitive examinations (such as SSC CGL or IBPS PO), target under 36 seconds per question in Reasoning & English, and under 54 seconds in Quantitative Aptitude to retain buffer time for review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
