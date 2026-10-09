import React, { useState } from 'react';
import { Briefcase, CheckCircle2, AlertCircle, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { EXAMS_REGISTRY } from '../../data/exams';
import { useApp } from '../../context/AppContext';

export const JobQualificationMatcherTool: React.FC = () => {
  const { navigate } = useApp();
  const [degree, setDegree] = useState<string>('graduate');
  const [stream, setStream] = useState<string>('any');
  const [percentage, setPercentage] = useState<number>(65);

  const matchedExams = EXAMS_REGISTRY.filter((exam) => {
    const req = exam.qualificationRequirements.toLowerCase();
    if (degree === '10th') {
      return req.includes('10th') || req.includes('matriculation');
    }
    if (degree === '12th') {
      return req.includes('10th') || req.includes('matriculation') || req.includes('12th') || req.includes('higher secondary');
    }
    if (degree === 'diploma') {
      return req.includes('diploma') || req.includes('10th') || req.includes('12th');
    }
    // Graduate or higher matches all graduate posts
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2 border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <Briefcase className="w-4 h-4 text-[#EC4899]" />
            Your Academic Profile
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Highest Educational Level
            </label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            >
              <option value="10th">10th Class (Matriculation)</option>
              <option value="12th">12th Class (10+2 / Higher Secondary)</option>
              <option value="diploma">Polytechnic / 3-Year Diploma</option>
              <option value="graduate">Bachelor's Degree (BA, B.Sc, B.Com, etc.)</option>
              <option value="engineering">B.Tech / B.E. (Engineering)</option>
              <option value="postgraduate">Master's Degree / Post-Graduation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Aggregate Percentage / Marks
            </label>
            <input
              type="number"
              min="35"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider">
                Eligible Recruitment Exams ({matchedExams.length} Matches)
              </h3>
              <span className="text-xs text-[#EC4899] font-bold">100% Verified Criteria</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {matchedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] space-y-2 hover:border-[#EC4899] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                        {exam.name}
                      </h4>
                      <span className="text-[11px] text-[#71717A]">{exam.authority} &middot; Age: {exam.minAge}–{exam.maxAge} Yrs</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] shrink-0">
                      Eligible Degree
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                    {exam.qualificationRequirements}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
