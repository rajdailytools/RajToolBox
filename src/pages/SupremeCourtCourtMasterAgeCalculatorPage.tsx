import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SupremeCourtCourtMasterAgeCalculatorTool } from '../tools/components/SupremeCourtCourtMasterAgeCalculatorTool';
import { AuthorBox } from '../components/ui/AuthorBox';
import { RelatedTools } from '../components/ui/RelatedTools';
import { RajToolBoxLogo } from '../components/RajToolBoxLogo';
import {
  Scale,
  ShieldCheck,
  Calendar,
  Clock,
  Bookmark,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  ExternalLink,
  Award,
  Layers,
  GraduationCap,
  Keyboard,
  Building,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SupremeCourtCourtMasterAgeCalculatorPageProps {
  tool: ToolItem;
}

export const SupremeCourtCourtMasterAgeCalculatorPage: React.FC<SupremeCourtCourtMasterAgeCalculatorPageProps> = ({
  tool
}) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const category = CATEGORIES[tool.category];
  const favored = isFavorite(tool.slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [toolLinkCopied, setToolLinkCopied] = useState<boolean>(false);

  const canonicalUrl = 'https://rajtoolbox.com/tools/supreme-court-court-master-age-calculator/';
  const shareMessage = `Check your age eligibility for Supreme Court Court Master (Shorthand) recruitment 2026: ${canonicalUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  // Sync document title, meta tags, and structured data for SEO
  useEffect(() => {
    document.title = 'Supreme Court Court Master Age Calculator | RajToolBox';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Calculate your age for Supreme Court Court Master recruitment using your date of birth and the official age cutoff date. Check applicable age limits and relaxation rules.'
      );
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Schema.org Structured Data: WebApplication + FAQPage
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = 'supreme-court-calculator-schema';
    jsonLdScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${canonicalUrl}#software`,
          name: 'Supreme Court Court Master Age Calculator',
          url: canonicalUrl,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          description:
            'Calculate exact age for Supreme Court of India Court Master (Shorthand) recruitment as on 1 October 2026. Checks minimum age 30, maximum age 45, and official category relaxations.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR'
          }
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is the official age cutoff date for Supreme Court Court Master Recruitment 2026?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The official age cutoff date is 1st October, 2026 as per official advertisement No.F.6/11/CM(S)/2026-SC (RC). Candidates must be at least 30 years old and not exceed 45 years as on this date.'
              }
            },
            {
              '@type': 'Question',
              name: 'Do employees of other Government Departments or PSUs get age relaxation?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. The official advertisement explicitly states that no age relaxation will be allowed to candidates working in other Government Departments, Public Sector Undertakings, Statutory bodies, or Nationalized Banks. Standard category limits apply.'
              }
            },
            {
              '@type': 'Question',
              name: 'Is there an upper age limit for Supreme Court of India Departmental candidates?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. The advertisement specifies that there will be no upper age limit for Departmental candidates of the Registry of the Supreme Court of India. However, they must still meet the minimum age requirement of 30 years.'
              }
            }
          ]
        }
      ]
    });

    // Clean up prior instance if exists
    const existingScript = document.getElementById('supreme-court-calculator-schema');
    if (existingScript) {
      existingScript.remove();
    }
    document.head.appendChild(jsonLdScript);

    return () => {
      const s = document.getElementById('supreme-court-calculator-schema');
      if (s) s.remove();
    };
  }, [tool]);

  const handleCopyToolLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setToolLinkCopied(true);
    showToast('Canonical tool link copied to clipboard!', 'success');
    setTimeout(() => setToolLinkCopied(false), 2500);
  };

  const handleShareTool = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Supreme Court Court Master Age Calculator | RajToolBox',
          text: 'Calculate your age for Supreme Court Court Master recruitment using your date of birth and official cutoff date (01-10-2026).',
          url: canonicalUrl
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyToolLink();
    }
  };

  const faqs = [
    {
      q: 'What is the exact age requirement for Court Master (Shorthand) in the Supreme Court?',
      a: 'As on 1st October, 2026, candidates must not be below 30 years of age and the upper age limit is 45 years for General/Unreserved candidates. This means a General category candidate must have been born between 02-10-1981 and 01-10-1996 (both dates inclusive).'
    },
    {
      q: 'Do employees in Central/State Government, PSUs, or Banks receive age relaxation?',
      a: 'No. The official notification explicitly states under Age Requirement: "No relaxation in age will be allowed to the candidates working in other Government Departments/Public Sector Undertakings/Statutory bodies/Nationalized Banks, etc." Even though 5 years of regular service in these bodies is required to satisfy the experience criterion, employment there does not grant age concession.'
    },
    {
      q: 'What age relaxation applies to Supreme Court of India Departmental candidates?',
      a: 'The notification states: "There will be no upper age limit for the Departmental candidates of the Registry of the Supreme Court of India." However, departmental applicants must still have completed the minimum age of 30 years as on 1st October, 2026.'
    },
    {
      q: 'What are the relaxations for SC, ST, and OBC candidates?',
      a: 'As per the advertisement, usual age relaxation is admissible to Scheduled Castes (SC), Scheduled Tribes (ST), Other Backward Classes (Non-Creamy Layer), and Ex-Servicemen as per Government of India Rules. Under standard GoI rules, SC/ST candidates receive 5 years relaxation (up to 50 years) and OBC (Non-Creamy Layer) candidates receive 3 years relaxation (up to 48 years).'
    },
    {
      q: 'What relaxation is given to Dependants of Freedom Fighters (DFF)?',
      a: 'The advertisement explicitly mentions: "Relaxation upto maximum of five years, over and above the prescribed age limit, will be admissible to dependants of freedom fighters." This sets their upper age limit to 50 years.'
    },
    {
      q: 'Is passing the age limit calculation sufficient for recruitment?',
      a: 'No. Age eligibility is only a preliminary qualification. Candidates must also possess a recognized Bachelor\'s degree, 120 w.p.m. English Shorthand speed, 40 w.p.m. computer typing speed, minimum 5 years regular service in the cadre of Private Secretary / Senior PA / PA / Senior Stenographer in Government / PSU / Statutory bodies, and qualify in the Objective Test, Shorthand Test, Typing Test, and Interview.'
    },
    {
      q: 'Which document is accepted as proof of Date of Birth?',
      a: 'Per General Instruction 11 of the notification: Name, Father\'s name, Mother\'s name, and Date of Birth as entered in the High School Certificate/Xth Board Certificate or equivalent certificate issued by the concerned Board/Council will only be accepted.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 w-full">
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        categorySlug={category.slug}
        categoryName={category.name}
        toolName="Supreme Court Court Master Age Calculator"
      />

      {/* 2. H1 & AUTHORITY HEADER */}
      <div className="mb-6 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
          <span className="font-semibold text-[#EC4899] flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            Supreme Court of India
          </span>
          <span aria-hidden="true">&bull;</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
            Notice No.F.6/11/CM(S)/2026-SC (RC)
          </span>
          <span aria-hidden="true">&bull;</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#854D0E] dark:text-[#FACC15]">
            Cutoff: 1 October 2026
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5] break-words">
              Supreme Court Court Master Age Calculator
            </h1>
            <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed break-words">
              Calculate your exact age in years, months, and days for the Supreme Court of India Court Master (Shorthand) direct recruitment. Checks compliance with the official 30–45 age bounds as on 1st October, 2026, including departmental exemptions and official statutory relaxations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="shrink-0 flex items-center gap-2 flex-wrap self-start">
            <button
              onClick={() => toggleFavorite(tool.slug)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                favored
                  ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                  : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A]'
              }`}
              title="Save tool to favorites"
            >
              <Bookmark className={`w-4 h-4 ${favored ? 'fill-[#EC4899]' : ''}`} />
              <span>{favored ? 'Saved' : 'Save Tool'}</span>
            </button>

            <button
              onClick={handleShareTool}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#71717A] hover:text-[#EC4899] transition-all bg-white dark:bg-[#18181B]"
              title="Share this calculator"
            >
              {toolLinkCopied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Share2 className="w-4 h-4" />}
              <span>{toolLinkCopied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CALCULATOR WORKSPACE */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl sm:rounded-3xl shadow-sm p-3.5 sm:p-6 lg:p-8 mb-10 min-w-0 w-full max-w-full">
        <SupremeCourtCourtMasterAgeCalculatorTool />
      </div>

      {/* 4. VISUAL ELIGIBILITY DECISION FLOWCHART */}
      <section className="my-10 min-w-0 w-full space-y-4">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] break-words">
            Court Master (Shorthand) Eligibility Workflow
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Official step-by-step verification pipeline from notification advertisement No.F.6/11/CM(S)/2026-SC (RC).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs min-w-0 w-full">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 px-2 py-0.5 rounded-md">
                  STAGE 1
                </span>
                <Clock className="w-4 h-4 text-[#71717A]" />
              </div>
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white block mb-1">
                Minimum Age Check
              </strong>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Candidate must have completed at least <strong>30 years</strong> as on <strong>1 October 2026</strong> (Born on or before 01-10-1996).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] text-[10px] text-[#16A34A] font-semibold">
              &check; Universal across all categories
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 px-2 py-0.5 rounded-md">
                  STAGE 2
                </span>
                <Scale className="w-4 h-4 text-[#71717A]" />
              </div>
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white block mb-1">
                Category Upper Limit
              </strong>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Max 45 Yrs for General; 48 Yrs for OBC; 50 Yrs for SC/ST/DFF. <strong>No upper ceiling</strong> for SCI Registry departmental staff.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] text-[10px] text-[#DC2626] font-semibold">
              &cross; No relaxation for PSU / other Govt staff
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 px-2 py-0.5 rounded-md">
                  STAGE 3
                </span>
                <Briefcase className="w-4 h-4 text-[#71717A]" />
              </div>
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white block mb-1">
                5 Years Experience
              </strong>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Minimum 5 years regular service as Private Secretary, Senior PA, PA, or Senior Stenographer in Govt / PSU / Statutory body.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] text-[10px] text-[#2563EB] font-semibold">
              &check; NOC required at DV
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 px-2 py-0.5 rounded-md">
                  STAGE 4
                </span>
                <Keyboard className="w-4 h-4 text-[#71717A]" />
              </div>
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white block mb-1">
                Shorthand &amp; Typing
              </strong>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Bachelor's Degree + 120 wpm English Shorthand (max 5% mistakes) + 40 wpm Computer Typing (max 2% mistakes) + Written Test + Interview.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] text-[10px] text-[#D97706] font-semibold">
              &check; Level 11 Gazetted Post
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL CATEGORY AGE LIMIT & RELAXATION TABLE */}
      <section className="my-10 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-4 sm:p-8 shadow-xs min-w-0 w-full">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F4F4F5] break-words">
            Category-wise Age Limits &amp; Relaxation Rules
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Exact age eligibility parameters as stipulated in Supreme Court of India recruitment notice dated October 15, 2026.
          </p>
        </div>

        <div className="overflow-x-auto w-full max-w-full -mx-1 px-1 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white bg-[#FFFDF7] dark:bg-[#141418]">
                <th className="py-2.5 px-3 font-bold">Category / Candidate Status</th>
                <th className="py-2.5 px-3 font-bold text-center">Min Age (01-10-2026)</th>
                <th className="py-2.5 px-3 font-bold text-center">Max Age (01-10-2026)</th>
                <th className="py-2.5 px-3 font-bold">Relaxation Permitted</th>
                <th className="py-2.5 px-3 font-bold">Official Document Rule Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#A1A1AA]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">
                  General / Unreserved / EWS
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#18181B] dark:text-white">45 Years</td>
                <td className="py-2.5 px-3">Nil (Prescribed baseline)</td>
                <td className="py-2.5 px-3 text-[11px]">Clause "AGE REQUIREMENT" (Page 1)</td>
              </tr>
              <tr className="bg-[#F0FDF4]/50 dark:bg-[#14532D]/10">
                <td className="py-2.5 px-3 font-semibold text-[#16A34A] dark:text-[#4ADE80]">
                  Departmental Candidates (SCI Registry)
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#16A34A] dark:text-[#4ADE80]">
                  No Upper Age Limit
                </td>
                <td className="py-2.5 px-3 font-semibold text-[#16A34A] dark:text-[#4ADE80]">
                  Complete Upper Age Exemption
                </td>
                <td className="py-2.5 px-3 text-[11px]">Clause "There will be no upper age limit..." (Page 2)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">
                  Other Backward Classes (OBC - NCL)
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#18181B] dark:text-white">48 Years</td>
                <td className="py-2.5 px-3">+3 Years under GoI rules</td>
                <td className="py-2.5 px-3 text-[11px]">GoI Rules cited in ad &amp; Rule 4A</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">
                  Scheduled Castes (SC) / Scheduled Tribes (ST)
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#18181B] dark:text-white">50 Years</td>
                <td className="py-2.5 px-3">+5 Years under GoI rules</td>
                <td className="py-2.5 px-3 text-[11px]">GoI Rules cited in ad &amp; Rule 4A</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">
                  Dependants of Freedom Fighters (DFF)
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#18181B] dark:text-white">50 Years</td>
                <td className="py-2.5 px-3">Upto maximum 5 years over age limit</td>
                <td className="py-2.5 px-3 text-[11px]">Explicit clause on Page 2</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#18181B] dark:text-white">
                  Ex-Servicemen (ESM)
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono">45 Yrs + Service + 3</td>
                <td className="py-2.5 px-3">Actual age minus military service minus 3 years</td>
                <td className="py-2.5 px-3 text-[11px]">As per GoI Rules cited on Page 2</td>
              </tr>
              <tr className="bg-[#FEF2F2]/50 dark:bg-[#7F1D1D]/10">
                <td className="py-2.5 px-3 font-semibold text-[#DC2626] dark:text-[#F87171]">
                  Candidates in other Govt / PSUs / Banks
                </td>
                <td className="py-2.5 px-3 text-center font-mono">30 Years</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[#DC2626] dark:text-[#F87171]">45 Years</td>
                <td className="py-2.5 px-3 text-[#DC2626] dark:text-[#F87171] font-semibold">
                  Zero relaxation for such employment
                </td>
                <td className="py-2.5 px-3 text-[11px] text-[#DC2626] dark:text-[#F87171]">
                  "No relaxation in age will be allowed to candidates working in other Govt/PSU/Banks" (Page 2)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. COMPLETE SELECTION SCHEME OF EXAMINATION */}
      <section className="my-10 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-4 sm:p-8 shadow-xs min-w-0 w-full space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F4F4F5] break-words">
            Scheme of Examination: Court Master (Shorthand)
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">
            As detailed in the official notification. Candidates qualifying the age criteria must clear all 4 examination components:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs min-w-0">
          {/* Test 1 */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white">
                1. Objective Type Written Test
              </strong>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                100 Marks (1 ½ Hours)
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              100 multiple choice questions: 25 General English, 25 General Knowledge, 25 Judiciary Provisions in Constitution of India, 15 Supreme Court Rules 2013, 10 Computer Knowledge. <strong>No negative marking</strong>. Minimum qualifying marks: 50.
            </p>
          </div>

          {/* Test 2 */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white">
                2. Shorthand (English) Skill Test
              </strong>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                100 Marks (120 w.p.m.)
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Dictation speed: 120 words per minute for 7 minutes. Transcription time: 45 minutes on computer. Max permissible mistakes: 5% of dictated words. Minimum qualifying marks: 50.
            </p>
          </div>

          {/* Test 3 */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white">
                3. Computer Typing Speed Test
              </strong>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                20 Marks (40 w.p.m.)
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Minimum typing speed: 40 words per minute in English language on computer. Duration: 10 minutes. Mistakes permissible: maximum 2% of total words typed. Minimum qualifying marks: 10.
            </p>
          </div>

          {/* Test 4 */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-xs sm:text-sm text-[#18181B] dark:text-white">
                4. Personal Interview
              </strong>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
                30 Marks (Min 15)
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Conducted in Delhi (online or physical mode as notified). Candidates qualifying all 3 previous tests are shortlisted for interview in the ratio of 1:3 against tentative vacancies.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="my-10 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-4 sm:p-8 shadow-xs min-w-0 w-full">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-[#EC4899]" />
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            Frequently Asked Questions (FAQs)
          </h2>
        </div>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6">
          Official answers regarding age calculation, cutoff dates, relaxations, and recruitment conditions.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#18181B] dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#EC4899] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#71717A] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed border-t border-[#E4E4E7]/60 dark:border-[#27272A]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. RELATED TOOLS */}
      <RelatedTools currentTool={tool} />

      {/* 9. AUTHOR BOX */}
      <AuthorBox />

      {/* 10. BRANDED SHARE SECTION (Specifically after author box) */}
      <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-5 sm:p-6 shadow-xs min-w-0 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 p-1.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
              <RajToolBoxLogo variant="icon-only" className="w-8 h-8 rounded-lg" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
                Share Supreme Court Court Master Age Calculator
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                Share this verified recruitment age calculator with aspirants, stenographers, and legal professionals.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0 w-full">
          {/* Share Tool */}
          <button
            type="button"
            onClick={handleShareTool}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] active:scale-[0.99] transition-all cursor-pointer min-w-0"
            aria-label="Share tool"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Share Tool</span>
          </button>

          {/* Copy Canonical Link */}
          <button
            type="button"
            onClick={handleCopyToolLink}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all min-w-0 cursor-pointer ${
              toolLinkCopied
                ? 'border-[#16A34A] bg-[#DCFCE7] dark:bg-[#14532D]/30 text-[#16A34A]'
                : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5]'
            }`}
            aria-label="Copy canonical tool link"
          >
            {toolLinkCopied ? (
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
            ) : (
              <Copy className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">{toolLinkCopied ? 'Link Copied!' : 'Copy Tool Link'}</span>
          </button>

          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#F0FDF4] dark:bg-[#14532D]/20 text-[#15803D] dark:text-[#4ADE80] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D]/30 text-xs font-semibold transition-all min-w-0"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
