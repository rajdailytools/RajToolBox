import React, { useState, useMemo } from 'react';
import { EXAMS_REGISTRY, ExamItem } from '../../data/exams';
import {
  Compass,
  Search,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ExamFinderProps {
  onExamSelected?: (exam: ExamItem) => void;
  className?: string;
}

export const ExamFinderSection: React.FC<ExamFinderProps> = ({ onExamSelected, className = '' }) => {
  const { navigate } = useApp();

  // Cascading Selection State
  const [region, setRegion] = useState<'india' | 'international'>('india');
  const [country, setCountry] = useState<string>('India');
  const [authorityCategory, setAuthorityCategory] = useState<string>('ssc');
  const [selectedExamId, setSelectedExamId] = useState<string>('ssc-cgl');

  // Filter available countries based on region
  const availableCountries = useMemo(() => {
    if (region === 'india') return ['India'];
    return ['United States', 'United Kingdom', 'Canada', 'Australia', 'International'];
  }, [region]);

  // Handle region change (cascades down)
  const handleRegionChange = (newRegion: 'india' | 'international') => {
    setRegion(newRegion);
    if (newRegion === 'india') {
      setCountry('India');
      setAuthorityCategory('ssc');
      setSelectedExamId('ssc-cgl');
    } else {
      setCountry('International');
      setAuthorityCategory('international-english');
      setSelectedExamId('ielts');
    }
  };

  // Handle country change (cascades down)
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    if (newCountry === 'India') {
      setAuthorityCategory('ssc');
      setSelectedExamId('ssc-cgl');
    } else if (newCountry === 'United States') {
      setAuthorityCategory('us-admissions');
      setSelectedExamId('sat');
    } else if (newCountry === 'United Kingdom') {
      setAuthorityCategory('uk-admissions');
      setSelectedExamId('uk-university-admissions');
    } else if (newCountry === 'International') {
      setAuthorityCategory('international-english');
      setSelectedExamId('ielts');
    } else if (newCountry === 'Canada') {
      setAuthorityCategory('other');
      setSelectedExamId('canada-public-service');
    } else if (newCountry === 'Australia') {
      setAuthorityCategory('other');
      setSelectedExamId('australia-admissions');
    }
  };

  // Filter available authorities based on current country and region
  const availableAuthorities = useMemo(() => {
    const examsInCountry = EXAMS_REGISTRY.filter(
      (e) => e.region === region && (e.country.toLowerCase() === country.toLowerCase())
    );

    const cats = Array.from(new Set(examsInCountry.map((e) => e.authorityCategory)));

    const authorityLabels: Record<string, string> = {
      ssc: 'Staff Selection Commission (SSC)',
      railway: 'Railway Recruitment Boards (RRB)',
      upsc: 'UPSC Civil Services & Defence',
      banking: 'Banking (IBPS, SBI, RBI)',
      defence: 'Defence Entries (NDA, CDS, AFCAT)',
      teaching: 'Teaching Eligibility (CTET, TET)',
      engineering: 'Engineering (JEE, GATE)',
      medical: 'Medical Entrance (NEET UG)',
      'us-admissions': 'US Standardized Tests (SAT, GRE, GMAT)',
      'uk-admissions': 'UK University Admissions (UCAT)',
      'international-english': 'English Language Tests (IELTS, TOEFL)',
      other: 'Public Service & Tertiary Tests'
    };

    return cats.map((catKey) => ({
      id: catKey,
      label: authorityLabels[catKey] || catKey.toUpperCase()
    }));
  }, [region, country]);

  // Handle authority category change (cascades down to specific exams)
  const handleAuthorityChange = (newAuth: string) => {
    setAuthorityCategory(newAuth);
    const matchingExams = EXAMS_REGISTRY.filter(
      (e) =>
        e.region === region &&
        e.country.toLowerCase() === country.toLowerCase() &&
        e.authorityCategory === newAuth
    );
    if (matchingExams.length > 0) {
      setSelectedExamId(matchingExams[0].id);
    }
  };

  // Filter specific exams based on authority & country
  const availableExams = useMemo(() => {
    return EXAMS_REGISTRY.filter(
      (e) =>
        e.region === region &&
        e.country.toLowerCase() === country.toLowerCase() &&
        e.authorityCategory === authorityCategory
    );
  }, [region, country, authorityCategory]);

  // The active selected exam
  const currentExam = useMemo(() => {
    return (
      EXAMS_REGISTRY.find((e) => e.id === selectedExamId) ||
      availableExams[0] ||
      EXAMS_REGISTRY[0]
    );
  }, [selectedExamId, availableExams]);

  // Reset to default
  const handleReset = () => {
    setRegion('india');
    setCountry('India');
    setAuthorityCategory('ssc');
    setSelectedExamId('ssc-cgl');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Finder Container Card */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F4F4F5] dark:border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899] flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Cascading Exam Finder
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
              Find Your Examination &amp; Dedicated Tools
            </h2>
          </div>

          <button
            onClick={handleReset}
            className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Finder
          </button>
        </div>

        {/* 4-Step Cascading Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* STEP 1: Region */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Step 1: Region
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleRegionChange('india')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  region === 'india'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'bg-[#FAFAFA] dark:bg-[#202026] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A]'
                }`}
              >
                India
              </button>
              <button
                type="button"
                onClick={() => handleRegionChange('international')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  region === 'international'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'bg-[#FAFAFA] dark:bg-[#202026] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A]'
                }`}
              >
                International
              </button>
            </div>
          </div>

          {/* STEP 2: Country */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Step 2: Country
            </label>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-semibold focus:outline-none focus:border-[#EC4899]"
            >
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 3: Authority / Category */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Step 3: Exam Authority
            </label>
            <select
              value={authorityCategory}
              onChange={(e) => handleAuthorityChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-semibold focus:outline-none focus:border-[#EC4899]"
            >
              {availableAuthorities.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.label}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 4: Specific Exam */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Step 4: Select Exam
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-semibold focus:outline-none focus:border-[#EC4899]"
            >
              {availableExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 5: Selected Exam Overview & Direct Tool Actions */}
        {currentExam && (
          <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 px-2.5 py-0.5 rounded-full">
                    {currentExam.country} &middot; {currentExam.authority}
                  </span>
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] dark:bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                    Verified Criteria ({currentExam.notificationYear})
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
                  {currentExam.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1 max-w-2xl leading-relaxed">
                  {currentExam.shortDescription}
                </p>
              </div>

              <a
                href={currentExam.officialWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] transition-colors shrink-0 shadow-2xs"
              >
                Official Website
                <ExternalLink className="w-3.5 h-3.5 text-[#EC4899]" />
              </a>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Prescribed Age</span>
                <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5 block">
                  {currentExam.minAge} to {currentExam.maxAge} Yrs
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Marking Scheme</span>
                <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5 block">
                  +{currentExam.markingScheme.positivePerCorrect} / -{currentExam.markingScheme.negativePerIncorrect}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Photo Limit</span>
                <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5 block">
                  {currentExam.photoRequirements?.minKb || 20}–{currentExam.photoRequirements?.maxKb || 50} KB
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Exam Duration</span>
                <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5 block">
                  {currentExam.markingScheme.durationMinutes} Minutes
                </span>
              </div>
            </div>

            {/* Relevant Working Tools for this Exam */}
            <div className="pt-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5] block mb-2.5">
                Recommended Online Tools for {currentExam.shortName}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => navigate('/tools/exam-eligibility-checker/')}
                  className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-left hover:border-[#EC4899] transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">
                      Eligibility Checker
                    </div>
                    <div className="text-[11px] text-[#71717A]">Check age &amp; qualification</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/tools/negative-marking-calculator/')}
                  className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-left hover:border-[#EC4899] transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">
                      Negative Marks Calculator
                    </div>
                    <div className="text-[11px] text-[#71717A]">+{currentExam.markingScheme.positivePerCorrect} / -{currentExam.markingScheme.negativePerIncorrect} penalty</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/tools/exam-photo-signature-resizer/')}
                  className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-left hover:border-[#EC4899] transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">
                      Photo &amp; Sign Resizer
                    </div>
                    <div className="text-[11px] text-[#71717A]">Pre-calibrated format</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
