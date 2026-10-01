import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, FileText } from 'lucide-react';
import { POPULAR_TOOLS } from '../data/tools';

// ABOUT PAGE
export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-150">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
          Platform & Creator
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1 tracking-tight">
          About RajToolBox
        </h1>
        <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">
          "Powerful Online Tools. Simple to Use."
        </p>
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
        <p>
          <strong className="text-[#18181B] dark:text-[#F4F4F5]">RajToolBox</strong> is an independent digital tools platform created by <strong className="text-[#18181B] dark:text-[#F4F4F5]">Raj Singh Sengar</strong> to provide practical, accessible, and fast online utilities for everyday digital workflows.
        </p>

        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
          Our Philosophy & Purpose
        </h2>
        <p>
          Everyday users, students, developers, and creators frequently encounter repetitive digital challenges: combining PDF invoices, resizing graphics, formatting JSON responses, converting measurement units, or computing percentages. Many websites surround these tasks with misleading download buttons, invasive trackers, or artificial waiting delays.
        </p>
        <p>
          RajToolBox was founded on the principle that online tools should be <em>fast, honest, and truly functional</em>. If a button says "Download", it downloads the exact processed file immediately. If a calculator is given numbers, it computes the mathematically correct result without obfuscation.
        </p>

        <h2 className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
          Privacy by Architecture
        </h2>
        <p>
          User privacy is a structural design requirement, not an afterthought. Wherever technically feasible, all processing—such as PDF merging, image compression, string manipulation, and cryptographic hashing—takes place completely inside your local web browser. Your confidential files, photos, and passwords never leave your hardware.
        </p>

        {/* Creator Bio */}
        <div className="mt-8 p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#EC4899] text-white flex items-center justify-center font-bold text-lg">
              RS
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
                Raj Singh Sengar
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#EC4899] font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>B.Sc. Physics</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            Raj Singh Sengar is the creator of RajToolBox, a practical online tools platform focused on building simple, useful and accessible digital utilities for everyday users. With a background in physics, Raj brings mathematical rigor, clean logic, and respect for user time to every tool built.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/tools/')}
            className="px-6 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
          >
            Explore the Tools
          </button>
        </div>
      </div>
    </div>
  );
};

// CONTACT PAGE
export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    // Honest client handling without fake backend success
    setSubmitted(true);
    showToast('Inquiry drafted! Launching email client fallback.', 'info');
    // Open mailto fallback so user message is genuinely delivered
    window.location.href = `mailto:rajtoolbox@gmail.com?subject=${encodeURIComponent(
      subject || 'RajToolBox Feedback'
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-150">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
          Get in Touch
        </span>
        <h1 className="text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
          Contact RajToolBox
        </h1>
        <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
          Have a tool suggestion, feedback, or inquiry? We would love to hear from you.
        </p>
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-xs">
          <Mail className="w-5 h-5 text-[#EC4899] shrink-0" />
          <div>
            <span className="text-[#71717A] block font-medium">Direct Email Contact:</span>
            <a
              href="mailto:rajtoolbox@gmail.com"
              className="font-bold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899]"
            >
              rajtoolbox@gmail.com
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Your Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71717A] mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Tool Suggestion"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71717A] mb-1">Message *</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your note here..."
              className="w-full p-3 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
          >
            Send Message via Mailto
          </button>
        </form>
      </div>
    </div>
  );
};

// LEGAL PAGES: PRIVACY POLICY
export const PrivacyPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
        Privacy Policy
      </h1>
      <p className="text-xs text-[#A1A1AA]">Last updated: September 2026</p>

      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        1. Local Client-Side Processing
      </h2>
      <p>
        RajToolBox operates with a strict privacy architecture. The majority of our utility tools—including PDF merging, PDF splitting, image resizing, image compression, JSON formatting, password generation, and unit conversions—run entirely within your web browser using HTML5, Web Crypto, and Canvas APIs. Your files and private data are not uploaded, stored, or transmitted to any remote servers.
      </p>

      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        2. Local Storage Usage
      </h2>
      <p>
        We use browser localStorage solely to preserve user interface preferences:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Dark mode theme preference</li>
        <li>Saved / favorite tools list</li>
        <li>Recently accessed tool history</li>
      </ul>
      <p>This data stays exclusively on your local device and can be cleared at any time via your browser settings.</p>

      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        3. Contact Information
      </h2>
      <p>
        If you have questions regarding this Privacy Policy, you may contact us directly at <a href="mailto:rajtoolbox@gmail.com" className="text-[#EC4899] underline">rajtoolbox@gmail.com</a>.
      </p>
    </div>
  </div>
);

// TERMS & CONDITIONS
export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
        Terms & Conditions
      </h1>
      <p className="text-xs text-[#A1A1AA]">Last updated: September 2026</p>

      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        1. Acceptance of Terms
      </h2>
      <p>
        By accessing and using RajToolBox (rajtoolbox.com), you acknowledge and agree to these Terms and Conditions. If you do not accept these terms, you should refrain from using the platform.
      </p>

      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        2. Permitted Use
      </h2>
      <p>
        All tools and content on RajToolBox are provided for legitimate personal, educational, and commercial purposes. You agree not to misuse the website, attempt unauthorized automated attacks, or interfere with other users' access.
      </p>

      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        3. Disclaimer of Warranties
      </h2>
      <p>
        All calculations, conversions, and document operations are provided on an "as is" and "as available" basis without warranties of any kind. While every effort is made to maintain complete mathematical and programmatic accuracy, users should independently verify critical calculations.
      </p>
    </div>
  </div>
);

// DISCLAIMER
export const DisclaimerPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
        Disclaimer
      </h1>
      <p>
        The tools, calculators, and informational resources provided on RajToolBox are intended solely for general practical and educational use.
      </p>
      <div className="p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 space-y-2">
        <p className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Important Notice:</p>
        <p>
          Calculations, conversions, and document processing results are produced automatically by client-side software algorithms. They do not constitute formal engineering, financial, legal, or medical advice.
        </p>
        <p>
          Always verify critical calculations independently with professional certified sources before making binding financial, structural, or legal commitments.
        </p>
      </div>
    </div>
  </div>
);

// COPYRIGHT PAGE
export const CopyrightPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
        Copyright Notice
      </h1>
      <p>
        © {new Date().getFullYear()} RajToolBox. All rights reserved.
      </p>
      <p>
        All original software interfaces, curated descriptions, brand designs, tutorials, formulas, and visual guides on RajToolBox are protected by copyright laws.
      </p>
      <p>
        Created by Raj Singh Sengar (B.Sc. Physics). Independent platform. For licensing inquiries, reach out to <a href="mailto:rajtoolbox@gmail.com" className="text-[#EC4899] underline">rajtoolbox@gmail.com</a>.
      </p>
    </div>
  </div>
);

// ADVERTISING POLICY
export const AdvertisingPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
        Advertising Policy
      </h1>
      <p>
        To keep all online tools 100% free and accessible without subscription paywalls, RajToolBox may display third-party advertisements.
      </p>
      <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] pt-2">
        Our Commitment to Clean Experience:
      </h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>No deceptive ads masquerading as tool download buttons or calculation triggers.</li>
        <li>No pop-unders, disruptive interstitials, or forced redirect flows.</li>
        <li>Transparent differentiation between editorial tool functionality and advertising blocks.</li>
      </ul>
    </div>
  </div>
);

// GUIDES PAGE
export const GuidesPage: React.FC = () => {
  const { navigate } = useApp();

  const guides = [
    {
      title: 'How to Merge Multiple PDFs Privately in Your Browser',
      category: 'PDF Tools',
      description: 'Learn how modern browser WebAssembly allows you to combine contracts, statements, and reports without uploading files to third-party servers.',
      targetSlug: 'pdf-merger',
      readTime: '3 min read'
    },
    {
      title: 'Web Image Optimization: Choosing Between JPG, PNG, and WebP',
      category: 'Image Tools',
      description: 'Understand lossless vs lossy compression, transparency support, and reducing webpage payload sizes with client-side image conversion.',
      targetSlug: 'image-format-converter',
      readTime: '4 min read'
    },
    {
      title: 'Developer Security: How to Inspect & Validate JWT Tokens',
      category: 'Developer Tools',
      description: 'Inspect JSON Web Token headers, payloads, expirations, and claim structures safely without pasting secrets across the public web.',
      targetSlug: 'jwt-decoder',
      readTime: '4 min read'
    },
    {
      title: 'Unit Conversion Reference: Length, Weight, Pressure, and Temperature',
      category: 'Converters',
      description: 'A mathematical reference guide to fundamental SI units, metric-to-imperial conversions, and exact multiplier constants.',
      targetSlug: 'universal-unit-converter',
      readTime: '5 min read'
    },
    {
      title: 'Creating Scannable QR Codes for Wi-Fi Networks and Contacts',
      category: 'QR & Barcode',
      description: 'Format standard WPA/WPA2 Wi-Fi authentication strings and vCard structures to generate instant camera-scannable QR codes.',
      targetSlug: 'qr-code-generator',
      readTime: '3 min read'
    },
    {
      title: 'Search Optimization: Meta Tags and OpenGraph Visual Previews',
      category: 'SEO Tools',
      description: 'How to structure HTML title tags, meta descriptions, and Twitter card protocols for search crawler indexing and social sharing.',
      targetSlug: 'meta-tag-generator',
      readTime: '4 min read'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-150">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-widest font-bold text-[#EC4899] mb-2">
          Knowledge Base & Tutorials
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] tracking-tight">
          RajToolBox Tool Guides
        </h1>
        <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">
          Practical walkthroughs, mathematical formulas, and best practices for browser-native digital tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {guides.map((guide, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] shadow-xs hover:border-[#EC4899] dark:hover:border-[#EC4899] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
                <span className="font-semibold text-[#EC4899]">{guide.category}</span>
                <span aria-hidden="true">·</span>
                <span>{guide.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
                {guide.title}
              </h2>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                {guide.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between">
              <button
                onClick={() => navigate(`/tools/${guide.targetSlug}/`)}
                className="text-xs font-semibold text-[#EC4899] hover:underline inline-flex items-center gap-1"
              >
                <span>Open Related Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 404 NOT FOUND PAGE
export const NotFoundPage: React.FC = () => {
  const { navigate, setSearchModalOpen } = useApp();

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-4 font-black text-2xl">
        404
      </div>
      <h1 className="text-3xl font-black text-[#18181B] dark:text-[#F4F4F5]">Tool Not Found</h1>
      <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2 mb-6">
        The tool or page you requested does not exist or has been relocated.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate('/tools/')}
          className="px-5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Browse All Tools
        </button>
        <button
          onClick={() => setSearchModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-[#18181B] text-xs font-bold hover:bg-[#EAB308]"
        >
          Search Tools
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-[#E4E4E7] dark:border-[#27272A] text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-[#71717A] block mb-3">
          Popular Tools You Might Need:
        </span>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_TOOLS.slice(0, 4).map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(`/tools/${tool.slug}/`)}
              className="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] text-left truncate p-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#202026]"
            >
              • {tool.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
