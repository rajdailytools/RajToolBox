import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Copy, Check, Info, RotateCcw, Award } from 'lucide-react';
import { EXAMS_REGISTRY } from '../../data/exams';

export const AgeLimitCalculatorTool: React.FC = () => {
  const [dob, setDob] = useState<string>('2001-04-12');
  const [refDate, setRefDate] = useState<string>('2026-08-01');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(30);
  const [selectedExamPreset, setSelectedExamPreset] = useState<string>('custom');
  const [copied, setCopied] = useState<boolean>(false);

  const handleExamPresetChange = (examId: string) => {
    setSelectedExamPreset(examId);
    if (examId === 'custom') return;

    const exam = EXAMS_REGISTRY.find((e) => e.id === examId);
    if (exam) {
      setMinAge(exam.minAge);
      setMaxAge(exam.maxAge);
      if (exam.id.includes('rrb')) {
        setRefDate('2026-07-01');
      } else if (exam.id.includes('sbi') || exam.id === 'ssc-gd') {
        setRefDate('2026-01-01');
      } else {
        setRefDate('2026-08-01');
      }
    }
  };

  const calculation = useMemo(() => {
    if (!dob || !refDate) return null;

    const birth = new Date(dob);
    const target = new Date(refDate);

    if (isNaN(birth.getTime()) || target.getTime() < birth.getTime()) {
      return null;
    }

    // Exact years, months, days
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const exactAgeDecimal = years + months / 12 + days / 365.25;

    // Days until next birthday
    const currentYearBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    let nextBday = currentYearBirthday;
    if (target.getTime() > currentYearBirthday.getTime()) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Check against bounds
    const isEligibleUR = exactAgeDecimal >= minAge && exactAgeDecimal <= maxAge;
    const isEligibleOBC = exactAgeDecimal >= minAge && exactAgeDecimal <= maxAge + 3;
    const isEligibleSCST = exactAgeDecimal >= minAge && exactAgeDecimal <= maxAge + 5;
    const isEligiblePwD = exactAgeDecimal >= minAge && exactAgeDecimal <= maxAge + 10;

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      daysToNextBday,
      exactAgeDecimal,
      isEligibleUR,
      isEligibleOBC,
      isEligibleSCST,
      isEligiblePwD,
      birthDayOfWeek: birth.toLocaleDateString('en-US', { weekday: 'long' })
    };
  }, [dob, refDate, minAge, maxAge]);

  const handleCopySummary = () => {
    if (!calculation) return;
    const text = `Age as on ${refDate}: ${calculation.years} Years, ${calculation.months} Months, ${calculation.days} Days (${calculation.totalDays} Total Days). Born on a ${calculation.birthDayOfWeek}. Calculated via RajToolBox.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDob('2001-04-12');
    setRefDate('2026-08-01');
    setMinAge(18);
    setMaxAge(30);
    setSelectedExamPreset('custom');
  };

  return (
    <div className="space-y-8">
      {/* Informational Guidance */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#FACC15]/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#854D0E] dark:text-[#FACC15] shrink-0 mt-0.5" />
        <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <strong className="text-[#18181B] dark:text-[#F4F4F5]">Standard Reference Cut-Offs:</strong> Most Indian recruitment boards calculate age as of August 1 (UPSC / SSC) or July 1 (Railways / RRB) of the recruitment year. Always verify the specific cut-off date mentioned in your examination notification.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h2 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#EC4899]" />
              Date Parameters
            </h2>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Exam Preset Shortcut */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
              Quick Exam Preset
            </label>
            <select
              value={selectedExamPreset}
              onChange={(e) => handleExamPresetChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            >
              <option value="custom">Custom Date & Limits</option>
              <option value="ssc-cgl">SSC CGL (18 to 32 Yrs &middot; Ref: Aug 1)</option>
              <option value="ssc-chsl">SSC CHSL (18 to 27 Yrs &middot; Ref: Aug 1)</option>
              <option value="rrb-ntpc">RRB NTPC (18 to 33 Yrs &middot; Ref: July 1)</option>
              <option value="upsc-cse">UPSC Civil Services (21 to 32 Yrs &middot; Ref: Aug 1)</option>
              <option value="ibps-po">IBPS PO (20 to 30 Yrs &middot; Ref: Aug 1)</option>
              <option value="sbi-po">SBI PO (21 to 30 Yrs &middot; Ref: April 1)</option>
            </select>
          </div>

          {/* Date of Birth Input */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Date of Birth (DOB)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          {/* Reference Date Input */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Cut-off Reference Date (As on Date)
            </label>
            <input
              type="date"
              value={refDate}
              onChange={(e) => setRefDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          {/* Age Bounds */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Minimum Age
              </label>
              <input
                type="number"
                min="10"
                max="60"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Maximum Age (UR)
              </label>
              <input
                type="number"
                min="15"
                max="70"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {calculation ? (
            <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
              {/* Primary Age Display */}
              <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                    Calculated Exact Age on {refDate}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
                    {calculation.years} <span className="text-sm font-semibold text-[#71717A]">Years</span>,{' '}
                    {calculation.months} <span className="text-sm font-semibold text-[#71717A]">Months</span>,{' '}
                    {calculation.days} <span className="text-sm font-semibold text-[#71717A]">Days</span>
                  </div>
                  <span className="text-xs text-[#71717A] mt-1 block">
                    Born on {calculation.birthDayOfWeek} &middot; Next birthday in {calculation.daysToNextBday} days
                  </span>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] shadow-xs transition-all self-start sm:self-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Age'}
                </button>
              </div>

              {/* Units Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#71717A] block">Total Days</span>
                  <div className="text-base font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    {calculation.totalDays.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#71717A] block">Total Weeks</span>
                  <div className="text-base font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    {calculation.totalWeeks.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#71717A] block">Total Months</span>
                  <div className="text-base font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    {calculation.totalMonths.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Category-Wise Relaxation Matrix */}
              <div className="space-y-3 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                  Eligibility Across Categories (Prescribed: {minAge} to {maxAge} Yrs)
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">General / UR / EWS</span>
                      <span className="text-[#71717A] ml-2">(Max: {maxAge} Yrs)</span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        calculation.isEligibleUR
                          ? 'bg-[#F0FDF4] text-[#16A34A]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {calculation.isEligibleUR ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">OBC (Non-Creamy Layer)</span>
                      <span className="text-[#71717A] ml-2">(+3 Yrs &middot; Max: {maxAge + 3} Yrs)</span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        calculation.isEligibleOBC
                          ? 'bg-[#F0FDF4] text-[#16A34A]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {calculation.isEligibleOBC ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">SC / ST Candidates</span>
                      <span className="text-[#71717A] ml-2">(+5 Yrs &middot; Max: {maxAge + 5} Yrs)</span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        calculation.isEligibleSCST
                          ? 'bg-[#F0FDF4] text-[#16A34A]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {calculation.isEligibleSCST ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">PwD Candidates</span>
                      <span className="text-[#71717A] ml-2">(+10 Yrs &middot; Max: {maxAge + 10} Yrs)</span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        calculation.isEligiblePwD
                          ? 'bg-[#F0FDF4] text-[#16A34A]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {calculation.isEligiblePwD ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#71717A] bg-white dark:bg-[#18181B] rounded-3xl border border-[#E4E4E7] dark:border-[#27272A]">
              Please enter a valid Date of Birth and Reference Date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
