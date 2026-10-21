import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Info,
  Scale,
  FileText,
  Briefcase,
  HelpCircle,
  ChevronRight,
  Award
} from 'lucide-react';

export type CandidateCategory =
  | 'ur_general'
  | 'sci_departmental'
  | 'obc_ncl'
  | 'sc'
  | 'st'
  | 'dff'
  | 'esm'
  | 'other_govt_psu';

export interface CategoryOption {
  id: CandidateCategory;
  label: string;
  badge: string;
  maxAgeDisplay: string;
  relaxationText: string;
  citation: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'ur_general',
    label: 'General / Unreserved / EWS',
    badge: 'Standard Limit',
    maxAgeDisplay: '45 Years',
    relaxationText: 'No age relaxation (Standard upper limit: 45 years)',
    citation: 'Advertisement Clause "AGE REQUIREMENT" (Page 1)'
  },
  {
    id: 'sci_departmental',
    label: 'Departmental Candidate (Supreme Court of India Registry)',
    badge: 'No Upper Age Limit',
    maxAgeDisplay: 'No Upper Age Limit',
    relaxationText: 'Complete exemption from upper age limit for SCI Registry staff',
    citation: 'Advertisement Clause "There will be no upper age limit for the Departmental candidates of the Registry of the Supreme Court of India" (Page 2)'
  },
  {
    id: 'obc_ncl',
    label: 'Other Backward Classes (OBC - Non-Creamy Layer)',
    badge: '+3 Years Relaxation',
    maxAgeDisplay: '48 Years',
    relaxationText: '3 years relaxation as per Government of India Rules',
    citation: 'Advertisement Clause Page 2 (as per Government of India’s Rules) & Rule 4A'
  },
  {
    id: 'sc',
    label: 'Scheduled Castes (SC)',
    badge: '+5 Years Relaxation',
    maxAgeDisplay: '50 Years',
    relaxationText: '5 years relaxation as per Government of India Rules',
    citation: 'Advertisement Clause Page 2 (as per Government of India’s Rules) & Rule 4A'
  },
  {
    id: 'st',
    label: 'Scheduled Tribes (ST)',
    badge: '+5 Years Relaxation',
    maxAgeDisplay: '50 Years',
    relaxationText: '5 years relaxation as per Government of India Rules',
    citation: 'Advertisement Clause Page 2 (as per Government of India’s Rules) & Rule 4A'
  },
  {
    id: 'dff',
    label: 'Dependants of Freedom Fighters (DFF)',
    badge: '+5 Years Relaxation',
    maxAgeDisplay: '50 Years',
    relaxationText: 'Relaxation up to maximum 5 years over and above prescribed age limit',
    citation: 'Advertisement Clause "Relaxation upto maximum of five years... admissible to dependants of freedom fighters" (Page 2)'
  },
  {
    id: 'esm',
    label: 'Ex-Servicemen (Military Personnel)',
    badge: 'Service + 3 Yrs (GoI)',
    maxAgeDisplay: '45 Yrs + Service + 3 Yrs',
    relaxationText: 'Deduction of military service from actual age plus 3 years under GoI rules',
    citation: 'Advertisement Clause Page 2 (as per Government of India’s Rules)'
  },
  {
    id: 'other_govt_psu',
    label: 'Other Govt / PSU / Statutory Body / Bank Employee',
    badge: 'No Relaxation Allowed',
    maxAgeDisplay: '45 Years (Same as UR)',
    relaxationText: 'No age relaxation merely for working in other Govt/PSU/Banks',
    citation: 'Advertisement Clause "No relaxation in age will be allowed to the candidates working in other Government Departments/Public Sector Undertakings/Statutory bodies/Nationalized Banks, etc." (Page 2)'
  }
];

export const SupremeCourtCourtMasterAgeCalculatorTool: React.FC = () => {
  // 1. Date of Birth (default realistic example)
  const [dob, setDob] = useState<string>('1994-06-15');

  // 2. Official Cutoff Date (Strictly fixed by recruitment notification: 1st October 2026)
  const cutoffDate = '2026-10-01';

  // 3. Category & Employment status
  const [category, setCategory] = useState<CandidateCategory>('ur_general');

  // 4. Ex-Servicemen military service inputs (if applicable)
  const [militaryYears, setMilitaryYears] = useState<number>(5);
  const [militaryMonths, setMilitaryMonths] = useState<number>(0);

  // 5. UI Copied state
  const [copied, setCopied] = useState<boolean>(false);

  // Deterministic age calculation
  const result = useMemo(() => {
    if (!dob) {
      return { isValid: false, error: 'Please enter or select your Date of Birth.' };
    }

    const birthDate = new Date(`${dob}T00:00:00`);
    const targetDate = new Date(`${cutoffDate}T00:00:00`);

    if (isNaN(birthDate.getTime())) {
      return { isValid: false, error: 'The entered Date of Birth is invalid. Please use a valid calendar date.' };
    }

    // Boundary check: DOB cannot be after cutoff date
    if (birthDate.getTime() > targetDate.getTime()) {
      return {
        isValid: false,
        error: 'Date of Birth cannot be after the official cutoff date (1 October 2026).'
      };
    }

    // Exact years, months, and days on 1st October 2026
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      // Days in month preceding target month (September has 30 days)
      const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = targetDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Minimum age rule: 30 years
    const minAge = 30;

    // Maximum age rules based on ad
    let maxAge: number | 'unlimited' = 45;
    let relaxationYears = 0;
    let isManualVerificationRequired = false;
    let verificationReason = '';

    if (category === 'sci_departmental') {
      maxAge = 'unlimited';
      relaxationYears = 999;
    } else if (category === 'obc_ncl') {
      maxAge = 48;
      relaxationYears = 3;
    } else if (category === 'sc' || category === 'st') {
      maxAge = 50;
      relaxationYears = 5;
    } else if (category === 'dff') {
      maxAge = 50;
      relaxationYears = 5;
    } else if (category === 'esm') {
      // Under GoI rules: actual age minus military service minus 3 years <= 45
      const totalServiceYears = militaryYears + militaryMonths / 12;
      const netEffectiveAge = years + months / 12 + days / 365.25 - totalServiceYears - 3;
      isManualVerificationRequired = true;
      verificationReason =
        'Subject to verification of Military Discharge Book / PPO and GoI Ex-Servicemen reservation guidelines.';
      if (netEffectiveAge <= 45) {
        maxAge = 45 + totalServiceYears + 3;
      } else {
        maxAge = 45;
      }
    } else if (category === 'other_govt_psu') {
      maxAge = 45;
      relaxationYears = 0;
    } else {
      // General / UR / EWS
      maxAge = 45;
      relaxationYears = 0;
    }

    // Determine status
    // 1. Check under-age (less than 30 years on 01-10-2026)
    const isUnderage = years < 30;

    // 2. Check over-age
    let isOverage = false;
    let effectiveOverage = false;

    if (maxAge !== 'unlimited') {
      if (category === 'esm') {
        const totalServiceMonths = militaryYears * 12 + militaryMonths;
        const candidateAgeMonths = years * 12 + months;
        const adjustedMonths = candidateAgeMonths - totalServiceMonths - 36;
        effectiveOverage = adjustedMonths > 45 * 12;
        isOverage = effectiveOverage;
      } else {
        if (years > maxAge || (years === maxAge && (months > 0 || days > 0))) {
          isOverage = true;
        }
      }
    }

    let status: 'eligible' | 'underage' | 'overage' | 'conditional_esm';
    if (isUnderage) {
      status = 'underage';
    } else if (isOverage) {
      status = 'overage';
    } else if (category === 'esm') {
      status = 'conditional_esm';
    } else {
      status = 'eligible';
    }

    // Permissible DOB range string
    const latestDobStr = '01-10-1996'; // Minimum 30 years completed
    let earliestDobStr = '02-10-1981'; // 45 years maximum

    if (category === 'sci_departmental') {
      earliestDobStr = 'Any date on or before 01-10-1996 (No upper age ceiling)';
    } else if (category === 'obc_ncl') {
      earliestDobStr = '02-10-1978 (48 years maximum)';
    } else if (category === 'sc' || category === 'st' || category === 'dff') {
      earliestDobStr = '02-10-1976 (50 years maximum)';
    } else if (category === 'esm') {
      earliestDobStr = 'Dependent on military service duration (GoI formula)';
    }

    return {
      isValid: true,
      years,
      months,
      days,
      totalDays,
      birthDateStr: birthDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      cutoffDateStr: targetDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      minAge,
      maxAge,
      relaxationYears,
      status,
      isUnderage,
      isOverage,
      isManualVerificationRequired,
      verificationReason,
      earliestDobStr,
      latestDobStr
    };
  }, [dob, cutoffDate, category, militaryYears, militaryMonths]);

  const handleReset = () => {
    setDob('1994-06-15');
    setCategory('ur_general');
    setMilitaryYears(5);
    setMilitaryMonths(0);
    setCopied(false);
  };

  const handleCopySummary = () => {
    if (!result.isValid || !result.years) return;
    const catLabel = CATEGORY_OPTIONS.find((c) => c.id === category)?.label || category;
    const summary = `Supreme Court Court Master (Shorthand) 2026 Age Eligibility
Candidate Category: ${catLabel}
Date of Birth: ${result.birthDateStr}
Cutoff Date: 1st October 2026
Exact Age: ${result.years} Years, ${result.months} Months, ${result.days} Days (${result.totalDays} Total Days)
Age Status: ${
      result.status === 'eligible'
        ? 'ELIGIBLE (Within 30–' + result.maxAge + ' Years)'
        : result.status === 'underage'
        ? 'UNDERAGE (Below 30 Years)'
        : result.status === 'conditional_esm'
        ? 'WITHIN RELAXED ESM LIMIT (Verification Required)'
        : 'OVERAGE (Exceeds ' + result.maxAge + ' Years)'
    }
Recruitment Notice: No.F.6/11/CM(S)/2026-SC (RC)
Verified via RajToolBox.com`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full space-y-6 min-w-0">
      {/* 1. OFFICIAL ADVERTISEMENT NOTIFICATION BADGE */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#FDE68A] dark:border-[#78350F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[#18181B] dark:text-[#F4F4F5] truncate">
              Supreme Court of India • Court Master (Shorthand) Recruitment 2026
            </div>
            <div className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] flex items-center gap-1.5 flex-wrap">
              <span>Notice: No.F.6/11/CM(S)/2026-SC (RC)</span>
              <span>•</span>
              <span className="text-[#EC4899] font-semibold">Dated: 15 October 2026</span>
              <span>•</span>
              <span className="font-semibold text-[#18181B] dark:text-white">Level 11 (Rs. 67,700–2,08,700)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] dark:bg-[#14532D]/30 text-[#15803D] dark:text-[#4ADE80] font-bold text-[11px] border border-[#86EFAC] dark:border-[#14532D]">
            Official Cutoff: 01 Oct 2026
          </span>
        </div>
      </div>

      {/* 2. INTERACTIVE INPUT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0 w-full">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5 min-w-0 w-full">
          <div className="p-4 sm:p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-4 min-w-0 w-full">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3 flex-wrap gap-2">
              <h2 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center text-xs font-black shrink-0">
                  1
                </span>
                <span className="truncate">Enter Candidate Details</span>
              </h2>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#EC4899] font-medium transition-colors cursor-pointer shrink-0"
                title="Reset to default values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* A. Date of Birth Picker */}
            <div className="space-y-1.5 min-w-0">
              <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                Date of Birth (As entered in Class X / Matriculation Certificate) <span className="text-[#EC4899]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  max="2026-10-01"
                  min="1950-01-01"
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  aria-label="Candidate Date of Birth"
                />
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Per Advertisement General Instruction 11: Date of Birth as recorded in High School/Xth Board Certificate will only be accepted.
              </p>
            </div>

            {/* B. Official Cutoff Date (Strictly fixed by Notification) */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                  Official Age Cutoff Date
                </label>
                <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] dark:bg-[#14532D]/40 px-2 py-0.5 rounded-md">
                  Mandatory Cutoff
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value="01 October 2026 (01-10-2026)"
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5] dark:bg-[#202026] text-[#18181B] dark:text-[#E4E4E7] cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Prescribed in Clause "AGE REQUIREMENT" of Supreme Court Advertisement: Candidate must not be below 30 years and not above 45 years as on 1st October, 2026.
              </p>
            </div>

            {/* C. Candidate Category Selector */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                  Candidate Category &amp; Employment Status <span className="text-[#EC4899]">*</span>
                </label>
                <span className="text-[11px] text-[#EC4899] font-bold">
                  {CATEGORY_OPTIONS.find((c) => c.id === category)?.badge}
                </span>
              </div>

              <div className="space-y-2">
                {CATEGORY_OPTIONS.map((opt) => {
                  const isSelected = category === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left min-w-0 ${
                        isSelected
                          ? 'border-[#EC4899] bg-[#FDF2F8] dark:bg-[#EC4899]/10 shadow-xs'
                          : 'border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="candidate_category"
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => setCategory(opt.id)}
                        className="mt-0.5 text-[#EC4899] focus:ring-[#EC4899]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5]">
                            {opt.label}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-[#EC4899] text-white'
                                : 'bg-[#F4F4F5] dark:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA]'
                            }`}
                          >
                            {opt.maxAgeDisplay}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-normal">
                          {opt.relaxationText}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* D. Additional input for Ex-Servicemen */}
            {category === 'esm' && (
              <div className="p-3.5 rounded-xl bg-[#F0FDF4] dark:bg-[#14532D]/20 border border-[#86EFAC] dark:border-[#14532D] space-y-3 text-xs min-w-0">
                <div className="font-bold text-[#15803D] dark:text-[#4ADE80] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Ex-Servicemen Military Service Deduction</span>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  Per GoI rules referenced in the advertisement: candidate actual age minus length of military service minus 3 years must not exceed the prescribed limit (45 years).
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Years of Military Service
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={35}
                      value={militaryYears}
                      onChange={(e) => setMilitaryYears(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Months of Service
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={militaryMonths}
                      onChange={(e) => setMilitaryMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E. Warning for Other Govt / PSU / Statutory Body candidates */}
            {category === 'other_govt_psu' && (
              <div className="p-3.5 rounded-xl bg-[#FEF3C7] dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#78350F] text-[#92400E] dark:text-[#FDE68A] text-xs space-y-1.5 min-w-0">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                  <span>Crucial Official Advertisement Clause:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  <em>"No relaxation in age will be allowed to the candidates working in other Government Departments/Public Sector Undertakings/Statutory bodies/Nationalized Banks, etc."</em>
                </p>
                <p className="text-[11px] text-[#78350F] dark:text-[#FEF3C7] leading-relaxed">
                  Although 5 years of service in these organizations is required for the experience criterion, employment there does not give age relaxation. Standard 30–45 age limits apply unless you qualify under SC, ST, OBC, or DFF.
                </p>
              </div>
            )}

            {/* Error banner if invalid date */}
            {!result.isValid && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#EF4444]/30 text-[#B91C1C] dark:text-[#FCA5A5] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Instant Calculation & Transparency Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-5 min-w-0 w-full">
          {result.isValid && result.years !== undefined ? (
            <div className="p-5 sm:p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-5 min-w-0 w-full">
              {/* Status Header Badge */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 min-w-0 ${
                  result.status === 'eligible'
                    ? 'border-[#86EFAC] bg-[#F0FDF4] dark:bg-[#14532D]/20 text-[#15803D] dark:text-[#4ADE80]'
                    : result.status === 'conditional_esm'
                    ? 'border-[#93C5FD] bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 text-[#1D4ED8] dark:text-[#60A5FA]'
                    : result.status === 'underage'
                    ? 'border-[#FCD34D] bg-[#FFFBEB] dark:bg-[#78350F]/20 text-[#B45309] dark:text-[#FBBF24]'
                    : 'border-[#FCA5A5] bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#B91C1C] dark:text-[#F87171]'
                }`}
              >
                {result.status === 'eligible' ? (
                  <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-[#16A34A]" />
                ) : result.status === 'conditional_esm' ? (
                  <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-[#2563EB]" />
                ) : result.status === 'underage' ? (
                  <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-[#D97706]" />
                ) : (
                  <XCircle className="w-6 h-6 shrink-0 mt-0.5 text-[#DC2626]" />
                )}

                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base leading-tight">
                    {result.status === 'eligible' && 'ELIGIBLE UNDER AGE CRITERIA'}
                    {result.status === 'conditional_esm' && 'WITHIN AGE LIMIT (VERIFICATION NEEDED)'}
                    {result.status === 'underage' && 'UNDERAGE (BELOW MINIMUM 30 YEARS)'}
                    {result.status === 'overage' && 'EXCEEDS MAXIMUM AGE LIMIT'}
                  </div>
                  <div className="text-xs mt-1 leading-normal opacity-90">
                    {result.status === 'eligible' &&
                      `Your age is between 30 and ${result.maxAge} years on 1 October 2026.`}
                    {result.status === 'conditional_esm' &&
                      `Net effective age after military service deduction falls within 45 years.`}
                    {result.status === 'underage' &&
                      `You have completed ${result.years} years. You need at least 30 full years as on 1 October 2026.`}
                    {result.status === 'overage' &&
                      `Your age (${result.years}y ${result.months}m) exceeds the upper limit (${result.maxAge} years) for this category.`}
                  </div>
                </div>
              </div>

              {/* Exact Age Counter */}
              <div className="p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] text-center space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                  Exact Age on 1st October, 2026
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-white tracking-tight">
                  <span className="text-[#EC4899]">{result.years}</span>
                  <span className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] mx-1">Years</span>
                  <span className="text-[#EC4899]">{result.months}</span>
                  <span className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] mx-1">Months</span>
                  <span className="text-[#EC4899]">{result.days}</span>
                  <span className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] ml-1">Days</span>
                </div>
                <div className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-mono">
                  Total {result.totalDays.toLocaleString()} days completed since birth
                </div>
              </div>

              {/* Rules & Range Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-b border-[#E4E4E7] dark:border-[#27272A] py-3.5">
                <div className="flex items-center justify-between text-[#71717A] dark:text-[#A1A1AA]">
                  <span>Minimum Age Required:</span>
                  <strong className="text-[#18181B] dark:text-white">30 Years (As on 01-10-2026)</strong>
                </div>

                <div className="flex items-center justify-between text-[#71717A] dark:text-[#A1A1AA]">
                  <span>Upper Age Limit for Category:</span>
                  <strong className="text-[#18181B] dark:text-white">
                    {result.maxAge === 'unlimited' ? 'No Upper Age Limit' : `${result.maxAge} Years`}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[#71717A] dark:text-[#A1A1AA]">
                  <span>Permissible Date of Birth Window:</span>
                  <strong className="text-[#18181B] dark:text-white text-right">
                    {result.earliestDobStr} to {result.latestDobStr}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[#71717A] dark:text-[#A1A1AA]">
                  <span>Relaxation Applied:</span>
                  <strong className="text-[#16A34A] dark:text-[#4ADE80]">
                    {result.maxAge === 'unlimited'
                      ? 'Full Upper Exemption (SCI Registry)'
                      : result.relaxationYears > 0
                      ? `+${result.relaxationYears} Years over baseline`
                      : 'None (Standard 45 Yrs)'}
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-0 ${
                    copied
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-[#EC4899] text-white hover:bg-[#DB2777] shadow-xs active:scale-[0.99]'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{copied ? 'Summary Copied!' : 'Copy Calculation'}</span>
                </button>
              </div>

              {/* Crucial Eligibility Condition Notice (Requirement 8) */}
              <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] text-[11px] text-[#71717A] dark:text-[#A1A1AA] space-y-1 leading-relaxed">
                <div className="font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
                  <span>Important: Age Eligibility is NOT Final Selection</span>
                </div>
                <p>
                  Meeting the age criteria satisfies only one part of the official Supreme Court notification. Candidates must also possess a recognized Bachelor's Degree, 120 w.p.m. English Shorthand, 40 w.p.m. typing speed, and <strong>minimum 5 years regular service</strong> in Government/PSU/Statutory bodies.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-center text-xs text-[#71717A] space-y-2">
              <Calendar className="w-8 h-8 text-[#EC4899] mx-auto opacity-80" />
              <div className="font-bold text-[#18181B] dark:text-white">Awaiting Valid Input</div>
              <p>Enter your Date of Birth on the left to calculate your age as on 1st October, 2026.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
