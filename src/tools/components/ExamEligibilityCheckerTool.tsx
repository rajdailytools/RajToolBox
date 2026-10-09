import React, { useState, useMemo } from 'react';
import { EXAMS_REGISTRY, ExamItem } from '../../data/exams';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Award,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExamEligibilityCheckerTool: React.FC = () => {
  const { navigate } = useApp();

  const [selectedExamId, setSelectedExamId] = useState<string>('ssc-cgl');
  const [dob, setDob] = useState<string>('2000-01-15');
  const [category, setCategory] = useState<string>('OBC');
  const [qualification, setQualification] = useState<string>('graduate');
  const [qualStatus, setQualStatus] = useState<'passed' | 'final-year'>('passed');
  const [nationality, setNationality] = useState<string>('indian');

  const selectedExam = useMemo(() => {
    return EXAMS_REGISTRY.find((e) => e.id === selectedExamId) || EXAMS_REGISTRY[0];
  }, [selectedExamId]);

  // Compute Age on Exam Reference Date
  const eligibilityResult = useMemo(() => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;

    // Use exam reference date assumption: August 1, 2026 for 2026 cycles or current year
    const refYear = 2026;
    let refMonth = 7; // August (0-indexed)
    let refDay = 1;

    if (selectedExam.id.includes('rrb') || selectedExam.id === 'rbi-grade-b') {
      refMonth = 6; // July 1
      refDay = 1;
    } else if (selectedExam.id.includes('sbi') || selectedExam.id === 'ssc-gd') {
      refMonth = 0; // January 1
      refDay = 1;
    }

    const refDate = new Date(refYear, refMonth, refDay);

    // Calculate exact age in years, months, days
    let years = refDate.getFullYear() - birthDate.getFullYear();
    let months = refDate.getMonth() - birthDate.getMonth();
    let days = refDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const exactAgeDecimal = years + months / 12 + days / 365.25;

    // Calculate Category Relaxation
    let relaxationYears = 0;
    const rule = selectedExam.ageRelaxation.find(
      (r) => r.category.toLowerCase().includes(category.toLowerCase())
    );
    if (rule) {
      relaxationYears = rule.relaxationYears;
    }

    const minAge = selectedExam.minAge;
    const effectiveMaxAge = selectedExam.maxAge + relaxationYears;

    const isAgeEligible = exactAgeDecimal >= minAge && exactAgeDecimal <= effectiveMaxAge;
    const isUnderAge = exactAgeDecimal < minAge;
    const isOverAge = exactAgeDecimal > effectiveMaxAge;

    // Qualification check
    const requiresGraduate = selectedExam.qualificationRequirements.toLowerCase().includes('bachelor') ||
                             selectedExam.qualificationRequirements.toLowerCase().includes('graduate') ||
                             selectedExam.qualificationRequirements.toLowerCase().includes('degree');
    
    let isQualEligible = true;
    let qualReason = 'Qualification meets minimum criteria';

    if (requiresGraduate && (qualification === '10th' || qualification === '12th')) {
      isQualEligible = false;
      qualReason = `Requires Bachelor's Degree. Current selection: ${qualification.toUpperCase()}`;
    }

    const isFullyEligible = isAgeEligible && isQualEligible && nationality === 'indian';

    return {
      years,
      months,
      days,
      exactAgeDecimal,
      minAge,
      baseMaxAge: selectedExam.maxAge,
      relaxationYears,
      effectiveMaxAge,
      isAgeEligible,
      isUnderAge,
      isOverAge,
      isQualEligible,
      qualReason,
      isFullyEligible,
      refDateString: refDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  }, [dob, selectedExam, category, qualification, qualStatus, nationality]);

  const handleReset = () => {
    setSelectedExamId('ssc-cgl');
    setDob('2000-01-15');
    setCategory('OBC');
    setQualification('graduate');
    setQualStatus('passed');
    setNationality('indian');
  };

  return (
    <div className="space-y-8">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#FACC15]/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#854D0E] dark:text-[#FACC15] shrink-0 mt-0.5" />
        <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <strong className="text-[#18181B] dark:text-[#F4F4F5]">Independent Guidance Tool:</strong> RajToolBox is an independent educational platform and is not affiliated with any government recruitment board or testing agency. Eligibility is evaluated using official notification rules ({selectedExam.notificationYear}). Always verify specific post criteria in the official notification.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h2 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#EC4899]" />
              Candidate Profile
            </h2>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Select Target Exam */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Target Examination
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            >
              {EXAMS_REGISTRY.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} ({exam.authority})
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              Date of Birth (DOB)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          {/* Social Category */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Social Category (Reservation & Age Relaxation)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['General', 'EWS', 'OBC', 'SC/ST', 'PwD', 'Ex-Servicemen'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    category === cat
                      ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                      : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A] hover:border-[#CBD5E1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Highest Qualification */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Highest Educational Qualification
            </label>
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            >
              <option value="10th">10th Standard / Matriculation</option>
              <option value="12th">12th Standard / Higher Secondary (10+2)</option>
              <option value="diploma">Diploma in Engineering</option>
              <option value="graduate">Bachelor's Degree (Any Discipline)</option>
              <option value="btech">B.Tech / B.E. (Engineering)</option>
              <option value="postgraduate">Master's Degree / Post-Graduation</option>
            </select>
          </div>

          {/* Degree Status */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Qualification Completion Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQualStatus('passed')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  qualStatus === 'passed'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A]'
                }`}
              >
                Degree Completed / Passed
              </button>
              <button
                type="button"
                onClick={() => setQualStatus('final-year')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  qualStatus === 'final-year'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A]'
                }`}
              >
                Final Year / Appearing
              </button>
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Nationality / Citizenship
            </label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            >
              <option value="indian">Citizen of India</option>
              <option value="nepal_bhutan">Subject of Nepal / Bhutan</option>
              <option value="other">Other International Citizenship</option>
            </select>
          </div>
        </div>

        {/* Right Column: Instant Eligibility Analysis */}
        <div className="lg:col-span-6 space-y-5">
          {eligibilityResult ? (
            <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
              {/* Overall Decision Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                  eligibilityResult.isFullyEligible
                    ? 'bg-[#F0FDF4] dark:bg-[#16A34A]/10 border-[#16A34A]/30 text-[#16A34A]'
                    : 'bg-[#FEF2F2] dark:bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {eligibilityResult.isFullyEligible ? (
                    <CheckCircle2 className="w-8 h-8 shrink-0 text-[#16A34A]" />
                  ) : (
                    <XCircle className="w-8 h-8 shrink-0 text-[#DC2626]" />
                  )}
                  <div>
                    <h3 className="text-base font-black tracking-tight">
                      {eligibilityResult.isFullyEligible
                        ? 'Eligible for ' + selectedExam.shortName
                        : 'Currently Ineligible for ' + selectedExam.shortName}
                    </h3>
                    <p className="text-xs opacity-90 mt-0.5">
                      {eligibilityResult.isFullyEligible
                        ? 'Your age, category relaxation, and qualifications satisfy the official criteria.'
                        : 'Review the breakdown below for specific conditions.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Age Evaluation Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] flex items-center justify-between">
                  <span>Age Criteria Breakdown</span>
                  <span className="text-[11px] font-normal lowercase text-[#EC4899]">
                    ref: {eligibilityResult.refDateString}
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                    <span className="text-[10px] uppercase font-bold text-[#71717A] block">Candidate Age</span>
                    <div className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                      {eligibilityResult.years}y {eligibilityResult.months}m {eligibilityResult.days}d
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                    <span className="text-[10px] uppercase font-bold text-[#71717A] block">Prescribed Range</span>
                    <div className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                      {eligibilityResult.minAge} to {eligibilityResult.baseMaxAge} Yrs
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                    <span className="text-[10px] uppercase font-bold text-[#71717A] block">Relaxed Upper Limit</span>
                    <div className="text-sm font-bold text-[#EC4899] mt-0.5">
                      {eligibilityResult.effectiveMaxAge} Yrs (+{eligibilityResult.relaxationYears}y {category})
                    </div>
                  </div>
                </div>

                <div className="text-xs flex items-center gap-2 mt-2">
                  {eligibilityResult.isAgeEligible ? (
                    <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Age is within official limits.
                    </span>
                  ) : eligibilityResult.isUnderAge ? (
                    <span className="text-[#DC2626] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Under-age: Minimum age requirement is {eligibilityResult.minAge} years.
                    </span>
                  ) : (
                    <span className="text-[#DC2626] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Over-age: Exceeds the upper limit of {eligibilityResult.effectiveMaxAge} years.
                    </span>
                  )}
                </div>
              </div>

              {/* Education Criteria */}
              <div className="space-y-2 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                  Educational Criteria
                </h4>
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-xs space-y-1">
                  <div className="font-semibold text-[#18181B] dark:text-[#F4F4F5]">
                    Required: {selectedExam.qualificationRequirements}
                  </div>
                  <div className={eligibilityResult.isQualEligible ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                    {eligibilityResult.qualReason}
                  </div>
                </div>
              </div>

              {/* Official Source Link */}
              <div className="pt-2 border-t border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between text-xs">
                <span className="text-[#71717A]">Authority: {selectedExam.authority}</span>
                <a
                  href={selectedExam.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#EC4899] hover:underline inline-flex items-center gap-1"
                >
                  Official Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : null}

          {/* Related Actions */}
          <div className="p-5 rounded-3xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#EC4899] block">
              Next Recommended Actions for {selectedExam.shortName}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('/tools/negative-marking-calculator/')}
                className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#202026] text-left hover:border-[#EC4899] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Marks Calculator</div>
                  <div className="text-[11px] text-[#71717A]">Calculate negative marking</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#EC4899] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/tools/exam-photo-signature-resizer/')}
                className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#202026] text-left hover:border-[#EC4899] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Photo & Sign Resizer</div>
                  <div className="text-[11px] text-[#71717A]">Resize to {selectedExam.photoRequirements?.minKb || 20}-{selectedExam.photoRequirements?.maxKb || 50} KB</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#EC4899] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
