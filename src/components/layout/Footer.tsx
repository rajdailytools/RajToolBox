import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_LIST } from '../../data/categories';
import { POPULAR_TOOLS } from '../../data/tools';
import { RajToolBoxLogo } from '../RajToolBoxLogo';
import { Mail, Shield, CheckCircle2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="w-full border-t border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121216] text-[#18181B] dark:text-[#E4E4E7] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center text-left focus:outline-none focus:ring-2 focus:ring-[#EC4899] rounded-lg p-0.5"
              aria-label="RajToolBox Home"
            >
              <RajToolBoxLogo className="h-9 w-auto shrink-0" />
            </button>

            <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-sm leading-relaxed">
              "Powerful Online Tools. Simple to Use."
            </p>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm leading-relaxed">
              Free, fast, and privacy-focused online tools created to simplify everyday digital work.
              All file processing, conversions, and math operations run locally in your browser.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#EC4899]" />
                <a href="mailto:rajtoolbox@gmail.com" className="hover:text-[#EC4899] underline underline-offset-2">
                  rajtoolbox@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FACC15]" />
                <span>Author: Raj Singh Sengar (B.Sc. Physics)</span>
              </div>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#EC4899] mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-[#71717A] dark:text-[#A1A1AA]">
              {CATEGORIES_LIST.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/${cat.slug}/`)}
                    className="hover:text-[#EC4899] transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/tools/')}
                  className="text-[#EC4899] font-medium hover:underline text-left"
                >
                  View All Categories &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Tools Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#EC4899] mb-4">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-sm text-[#71717A] dark:text-[#A1A1AA]">
              {POPULAR_TOOLS.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigate(`/tools/${tool.slug}/`)}
                    className="hover:text-[#EC4899] transition-colors text-left"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#EC4899] mb-4">
              Trust & Legal
            </h3>
            <ul className="space-y-2 text-sm text-[#71717A] dark:text-[#A1A1AA]">
              <li>
                <button onClick={() => navigate('/about/')} className="hover:text-[#EC4899]">
                  About RajToolBox
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact/')} className="hover:text-[#EC4899]">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy/')} className="hover:text-[#EC4899]">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms-and-conditions/')} className="hover:text-[#EC4899]">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer/')} className="hover:text-[#EC4899]">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/copyright/')} className="hover:text-[#EC4899]">
                  Copyright
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/advertising-policy/')} className="hover:text-[#EC4899]">
                  Advertising Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E4E4E7] dark:border-[#27272A] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA] gap-4">
          <p>© {new Date().getFullYear()} RajToolBox. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              Client-Side Browser Processing
            </span>
            <span className="text-[#E4E4E7] dark:text-[#27272A]">|</span>
            <span>Independent Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
