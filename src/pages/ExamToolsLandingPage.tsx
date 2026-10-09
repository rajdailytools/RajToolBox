import React, { useState } from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ExamFinderSection } from '../components/discovery/ExamFinderSection';
import { ToolCard } from '../components/ui/ToolCard';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { AuthorBox } from '../components/ui/AuthorBox';
import { IconRenderer } from '../components/common/IconRenderer';
import { getToolsByCategory } from '../data/tools';
import { CATEGORIES, CATEGORIES_LIST } from '../data/categories';
import { GUIDES_REGISTRY } from '../data/guides';
import { EXAMS_REGISTRY } from '../data/exams';
import { useApp } from '../context/AppContext';
import {
  Award,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
  Briefcase,
  HelpCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const ExamToolsLandingPage: React.FC = () => {
  const { navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const examCategory = CATEGORIES['exam-eligibility-tools'];
  const allExamTools = getToolsByCategory('exam-eligibility-tools');
  const studyTools = getToolsByCategory('study-test-prep-tools');
  const careerTools = getToolsByCategory('career-job-tools');

  // Filter tools
  const filteredTools = allExamTools.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const POPULAR_EXAM_SHORTCUTS = [
    { name: 'SSC CGL', slug: 'ssc-cgl', authority: 'SSC' },
    { name: 'RRB NTPC', slug: 'rrb-ntpc', authority: 'Railway' },
    { name: 'UPSC CSE', slug: 'upsc-cse', authority: 'UPSC' },
    { name: 'IBPS PO', slug: 'ibps-po', authority: 'Banking' },
    { name: 'CTET', slug: 'ctet', authority: 'CBSE' },
    { name: 'NEET UG', slug: 'neet-ug', authority: 'NTA' },
    { name: 'IELTS', slug: 'ielts', authority: 'British Council / IDP' },
    { name: 'Digital SAT', slug: 'sat', authority: 'College Board' }
  ];

  const examFaqs = [
    {
      question: 'How does the Exam Eligibility Checker determine whether I am eligible?',
      answer:
        'The tool verifies your exact date of birth against the official cut-off date prescribed in the recruitment notification (e.g. August 1 for SSC/UPSC, July 1 for Railways). It incorporates official category age relaxations (OBC +3 yrs, SC/ST +5 yrs, PwD +10 yrs) and checks your educational qualification against verified recruitment rules.'
    },
    {
      question: 'Are image files and signatures resized completely on my device?',
      answer:
        'Yes! RajToolBox processes images 100% locally in your web browser using HTML5 Canvas. Your passport photographs, signatures, and certificates are never uploaded, stored, or sent to external servers.'
    },
    {
      question: 'Is RajToolBox affiliated with any official government recruitment board?',
      answer:
        'No. RajToolBox is an independent educational platform created to provide free, high-speed calculation and document preparation tools for candidates. We reference published official notices and encourage candidates to review official notifications for final statutory eligibility.'
    },
    {
      question: 'Can I calculate negative marking for multiple exams?',
      answer:
        'Yes. The Negative Marking Calculator includes verified pre-calibrated schemes for SSC (+2, -0.50), RRB (+1, -0.33), UPSC (+2, -0.66), Banking (+1, -0.25), JEE (+4, -1), NEET (+4, -1), CTET (No negative marking), and supports custom schemes.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150 space-y-12">
      {/* 1. Breadcrumb */}
      <Breadcrumb
        categorySlug="exam-eligibility-tools"
        categoryName="Exam & Eligibility Tools"
      />

      {/* 2. Category Hero Section */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
                Specialized Ecosystem
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
              Exam &amp; Eligibility Tools
            </h1>
            <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 leading-relaxed">
              Comprehensive suite of eligibility calculators, age limit analyzers, negative marking evaluators, and compliant photo &amp; signature resizers for government, banking, defence, and international examinations.
            </p>
          </div>

          <div className="shrink-0 p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
            <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
              Registered Tools
            </span>
            <div className="text-3xl font-black text-[#EC4899] mt-0.5">
              {allExamTools.length}
            </div>
            <span className="text-[10px] text-[#71717A]">100% Free &amp; Private</span>
          </div>
        </div>

        {/* Popular Exam Shortcuts */}
        <div className="mt-8 pt-6 border-t border-[#F4F4F5] dark:border-[#27272A]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block mb-3">
            Popular Exam Quick Access:
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_EXAM_SHORTCUTS.map((exam) => (
              <button
                key={exam.slug}
                onClick={() => navigate('/tools/exam-eligibility-checker/')}
                className="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] hover:text-[#EC4899] transition-all flex items-center gap-1.5"
              >
                <span>{exam.name}</span>
                <span className="text-[10px] text-[#71717A] font-normal">({exam.authority})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Cascading Exam Finder */}
      <ExamFinderSection />

      {/* 4. Registered Exam & Eligibility Tools Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5]">
              All Exam &amp; Eligibility Utilities ({allExamTools.length})
            </h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              Instant in-browser utilities calibrated for official examination guidelines
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter exam tools..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs focus:outline-none focus:border-[#EC4899]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 5. Related Study & Preparation Tools */}
      {studyTools.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899] block mb-1">
                Ecosystem Companion
              </span>
              <h3 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
                Study &amp; Test Preparation Tools
              </h3>
            </div>
            <button
              onClick={() => navigate('/study-test-prep-tools/')}
              className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
            >
              View Category <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Related Career & Job Tools */}
      {careerTools.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899] block mb-1">
                Career Progression
              </span>
              <h3 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
                Career &amp; Job Tools
              </h3>
            </div>
            <button
              onClick={() => navigate('/career-job-tools/')}
              className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
            >
              View Category <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Frequently Asked Questions */}
      <section className="border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl bg-white dark:bg-[#18181B] p-6 sm:p-10">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899] block mb-1">
            Questions &amp; Clarity
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            Exam Tools Frequently Asked Questions
          </h2>
        </div>
        <FAQAccordion faqs={examFaqs} toolName="Exam & Eligibility Tools" />
      </section>

      {/* 8. Trust & Author Section */}
      <AuthorBox />
    </div>
  );
};
