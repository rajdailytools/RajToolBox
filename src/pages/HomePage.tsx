import React from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS_REGISTRY, POPULAR_TOOLS, FEATURED_TOOLS, getToolsByCategory } from '../data/tools';
import { CATEGORIES_LIST } from '../data/categories';
import { ToolCard } from '../components/ui/ToolCard';
import { IconRenderer } from '../components/common/IconRenderer';
import { AuthorBox } from '../components/ui/AuthorBox';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  FileCheck,
  Smartphone,
  Flame
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, setSearchModalOpen } = useApp();

  const platformFaqs = [
    {
      question: 'Is RajToolBox completely free to use?',
      answer: 'Yes! Every calculator, file processor, converter, and generator on RajToolBox is 100% free with unlimited usage and zero subscription paywalls.'
    },
    {
      question: 'Are my uploaded files or text sent to a remote server?',
      answer: 'No. Tools on RajToolBox utilize modern WebAssembly, Canvas API, and HTML5 client-side engines to process files right on your computer or phone. Your data never leaves your device.'
    },
    {
      question: 'Who created RajToolBox?',
      answer: 'RajToolBox was designed and built by Raj Singh Sengar (B.Sc. Physics) with the mission of delivering reliable, bloat-free online utilities for everyday tasks.'
    },
    {
      question: 'Do the tools work on mobile smartphones?',
      answer: 'Yes, all interfaces and calculators are designed mobile-first and tested thoroughly on modern iOS and Android browsers.'
    },
    {
      question: 'Do I need to create an account or sign in?',
      answer: 'No registration or login is required. You can start using any tool immediately.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12 animate-in fade-in duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 border-b border-[#E4E4E7] dark:border-[#27272A] bg-gradient-to-b from-[#FFFDF7] to-white dark:from-[#0F0F12] dark:to-[#141418]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-[#EC4899] mb-3">
            Client-Side Browser Utilities
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Powerful Online Tools. <br />
            <span className="bg-gradient-to-r from-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent">
              Simple to Use.
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Free, fast and practical tools for everyday work, files, text, images, developers, SEO, conversions, and math. All running privately in your browser.
          </p>

          {/* Hero Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div
              onClick={() => setSearchModalOpen(true)}
              className="group flex items-center justify-between p-2 pl-4 rounded-2xl bg-white dark:bg-[#18181B] border-2 border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] dark:hover:border-[#EC4899] shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#71717A]">
                <Search className="w-5 h-5 text-[#EC4899]" />
                <span>Search {TOOLS_REGISTRY.length}+ free tools...</span>
              </div>
              <span className="px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs group-hover:bg-[#DB2777] transition-colors">
                Search
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <button
              onClick={() => navigate('/tools/')}
              className="px-6 py-3 rounded-xl bg-[#EC4899] text-white shadow-md hover:bg-[#DB2777] transition-all flex items-center gap-2"
            >
              <span>Explore All Tools ({TOOLS_REGISTRY.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('popular-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] transition-all"
            >
              Popular Tools
            </button>
          </div>

          {/* Visual tool highlights / trust badges */}
          <div className="mt-12 pt-8 border-t border-[#F4F4F5] dark:border-[#27272A] max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA]">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>100% In-Browser</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FACC15]" />
              <span>Zero Waiting Time</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#EC4899]" />
              <span>Mobile Optimized</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Layers className="w-4 h-4 text-[#3B82F6]" />
              <span>16 Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR TOOLS */}
      <section id="popular-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-[#EC4899]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
                Popular Tools Today
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
              Essential utilities most frequently chosen for everyday work.
            </p>
          </div>

          <button
            onClick={() => navigate('/tools/')}
            className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_TOOLS.slice(0, 8).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
            Organized Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
            Browse by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
            Targeted utility collections built for creators, coders, students, and professionals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES_LIST.map((cat) => {
            const toolCount = getToolsByCategory(cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/${cat.slug}/`)}
                className="p-5 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-left hover:border-[#EC4899] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconRenderer name={cat.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A] dark:text-[#A1A1AA] border border-[#E4E4E7] dark:border-[#27272A] group-hover:border-[#EC4899]/40 group-hover:text-[#EC4899] transition-colors">
                      {toolCount} {toolCount === 1 ? 'Tool' : 'Tools'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] group-hover:text-[#EC4899] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between text-[11px] font-semibold text-[#EC4899]">
                  <span>Browse {toolCount} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. TOOL DISCOVERY / QUICK USE SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF7] dark:bg-[#18181B] border border-[#FACC15]/40 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#854D0E] dark:text-[#FACC15]">
                Curated Workflows
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                Tool Discovery by Role
              </h2>
            </div>
            <button
              onClick={() => navigate('/tools/')}
              className="text-xs font-bold text-[#EC4899] hover:underline"
            >
              Explore Entire Catalog &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A]">
              <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                For Developers & Engineers
              </h3>
              <ul className="space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
                <li>
                  <button onClick={() => navigate('/tools/json-formatter/')} className="hover:text-[#EC4899]">
                    • JSON Formatter & Validator
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/base64-codec/')} className="hover:text-[#EC4899]">
                    • Base64 Encoder / Decoder
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/jwt-decoder/')} className="hover:text-[#EC4899]">
                    • JWT Token Inspector
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/uuid-generator/')} className="hover:text-[#EC4899]">
                    • Cryptographic UUID Generator
                  </button>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A]">
              <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                For Documents & Images
              </h3>
              <ul className="space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
                <li>
                  <button onClick={() => navigate('/tools/pdf-merger/')} className="hover:text-[#EC4899]">
                    • PDF Merger (Client-side)
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/image-compressor/')} className="hover:text-[#EC4899]">
                    • High-Speed Image Compressor
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/image-format-converter/')} className="hover:text-[#EC4899]">
                    • Image Format Converter (WebP)
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/qr-code-generator/')} className="hover:text-[#EC4899]">
                    • Customizable QR Code Generator
                  </button>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A]">
              <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                For Writers, SEO & Math
              </h3>
              <ul className="space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
                <li>
                  <button onClick={() => navigate('/tools/word-counter/')} className="hover:text-[#EC4899]">
                    • Live Word & Character Counter
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/percentage-calculator/')} className="hover:text-[#EC4899]">
                    • Percentage Increase/Decrease
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/universal-unit-converter/')} className="hover:text-[#EC4899]">
                    • Universal Metric & Imperial Converter
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/tools/meta-tag-generator/')} className="hover:text-[#EC4899]">
                    • SEO Meta & OpenGraph Generator
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY RAJTOOLBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
            The RajToolBox Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
            Why Choose RajToolBox?
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
            Clean engineering focused on user privacy, calculation correctness, and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] dark:bg-[#14532D] text-[#16A34A] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
              Privacy First: Client-Side Processing
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Your files, images, passwords, and sensitive documents never touch an external server. Everything processes locally inside your browser memory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
              Zero Delays & Instant Results
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              No fake progress bars or artificial waiting countdowns. Calculations and image resizing complete with immediate native speed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
              100% Free Forever
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              No mandatory subscriptions, no hidden feature lockouts, and no account requirements. Just dependable tools when you need them.
            </p>
          </div>
        </div>
      </section>

      {/* 6. AUTHOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthorBox />
      </section>

      {/* 7. PLATFORM FAQS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQAccordion faqs={platformFaqs} toolName="RajToolBox" />
      </section>
    </div>
  );
};
