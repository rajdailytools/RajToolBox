import { CategoryInfo, ToolCategory } from '../types';

export const CATEGORIES: Record<ToolCategory, CategoryInfo> = {
  'pdf-tools': {
    id: 'pdf-tools',
    slug: 'pdf-tools',
    name: 'PDF Tools',
    shortName: 'PDF',
    description: 'Merge, split, compress, watermark, rotate, reorder, and convert PDF documents 100% locally in your browser with zero file uploads.',
    iconName: 'FileText',
    featuredTools: ['pdf-merger', 'pdf-compressor', 'pdf-splitter', 'image-to-pdf', 'pdf-watermark', 'pdf-metadata-viewer']
  },
  'image-tools': {
    id: 'image-tools',
    slug: 'image-tools',
    name: 'Image Tools',
    shortName: 'Images',
    description: 'Compress, resize, crop, rotate, flip, convert image formats (JPG, PNG, WebP), pick colors, and generate favicons directly on your device.',
    iconName: 'Image',
    featuredTools: ['image-compressor', 'image-resizer', 'image-format-converter', 'image-cropper', 'favicon-generator', 'image-color-picker']
  },
  'text-tools': {
    id: 'text-tools',
    slug: 'text-tools',
    name: 'Text Tools',
    shortName: 'Text',
    description: 'Analyze word counts, convert cases, clean duplicate lines, find and replace, format slugs, and compare text differences instantly.',
    iconName: 'Type',
    featuredTools: ['text-case-converter', 'word-counter', 'case-converter', 'text-cleaner', 'text-diff-checker', 'find-and-replace', 'slug-generator']
  },
  'developer-tools': {
    id: 'developer-tools',
    slug: 'developer-tools',
    name: 'Developer Tools',
    shortName: 'Dev Tools',
    description: 'Format & validate JSON, encode/decode Base64 and URLs, minify HTML/CSS/JS, generate UUIDs, test regex, and inspect JWT tokens.',
    iconName: 'Code',
    featuredTools: ['json-formatter', 'base64-codec', 'jwt-decoder', 'uuid-generator', 'regex-tester', 'hash-generator', 'unix-timestamp']
  },
  'qr-barcode-tools': {
    id: 'qr-barcode-tools',
    slug: 'qr-barcode-tools',
    name: 'QR & Barcode',
    shortName: 'QR & Barcode',
    description: 'Generate customizable high-resolution QR codes for URLs, WiFi, contact cards, text, and render industrial barcodes ready to download.',
    iconName: 'QrCode',
    featuredTools: ['qr-code-generator', 'barcode-generator', 'wifi-qr-generator']
  },
  'converters': {
    id: 'converters',
    slug: 'converters',
    name: 'Converters',
    shortName: 'Converters',
    description: 'Accurately convert length, weight, temperature, data storage, speed, pressure, energy, angles, number systems, and Roman numerals.',
    iconName: 'ArrowRightLeft',
    featuredTools: ['universal-unit-converter', 'number-system-converter', 'roman-numeral-converter', 'number-to-words']
  },
  'seo-tools': {
    id: 'seo-tools',
    slug: 'seo-tools',
    name: 'SEO & Web Tools',
    shortName: 'SEO & Web',
    description: 'Generate complete Meta tags, OpenGraph previews, Twitter cards, Robots.txt, XML Sitemaps, UTM campaign URLs, and check keyword density.',
    iconName: 'Globe',
    featuredTools: ['meta-tag-generator', 'robots-txt-generator', 'sitemap-generator', 'utm-builder', 'keyword-density-checker']
  },
  'social-media-tools': {
    id: 'social-media-tools',
    slug: 'social-media-tools',
    name: 'Social Media Tools',
    shortName: 'Social Media',
    description: 'Format captivating Instagram captions, craft YouTube titles and descriptions, organize hashtags, and check platform character limits.',
    iconName: 'Share2',
    featuredTools: ['social-post-formatter', 'hashtag-formatter']
  },
  'file-data-tools': {
    id: 'file-data-tools',
    slug: 'file-data-tools',
    name: 'File & Data Tools',
    shortName: 'File & Data',
    description: 'Convert CSV to JSON and JSON to CSV, clean tabulated data, calculate cryptographic file hashes, and convert binary file storage units.',
    iconName: 'FileSpreadsheet',
    featuredTools: ['csv-to-json', 'json-to-csv']
  },
  'productivity-tools': {
    id: 'productivity-tools',
    slug: 'productivity-tools',
    name: 'Productivity Tools',
    shortName: 'Productivity',
    description: 'Stay focused and on track with a customizable Pomodoro timer, precision stopwatch, and daily timebox tools.',
    iconName: 'CheckSquare',
    featuredTools: ['pomodoro-timer', 'stopwatch-timer']
  },
  'date-time-tools': {
    id: 'date-time-tools',
    slug: 'date-time-tools',
    name: 'Date & Time',
    shortName: 'Date & Time',
    description: 'Calculate days between dates, working days, add or subtract time intervals, compute exact age in years/months/days, and check leap years.',
    iconName: 'Clock',
    featuredTools: ['days-between-dates', 'age-calculator']
  },
  'educational-tools': {
    id: 'educational-tools',
    slug: 'educational-tools',
    name: 'Education & Math',
    shortName: 'Education & Math',
    description: 'Calculate percentages, solve ratios & proportions, compute arithmetic averages, simplify fractions, find prime factors, and GCD/LCM.',
    iconName: 'GraduationCap',
    featuredTools: ['percentage-calculator', 'ratio-proportion-calculator', 'average-calculator']
  },
  'color-design': {
    id: 'color-design',
    slug: 'color-design',
    name: 'Color & Design',
    shortName: 'Color & Design',
    description: 'Generate harmonious color palettes, convert between HEX, RGB, HSL, and CMYK formats, check WCAG contrast, and sample colors.',
    iconName: 'Palette',
    featuredTools: ['color-palette-generator', 'color-converter', 'image-color-picker']
  },
  'security-privacy': {
    id: 'security-privacy',
    slug: 'security-privacy',
    name: 'Security & Privacy Utilities',
    shortName: 'Security & Privacy',
    description: 'Generate strong cryptographically secure passwords with entropy calculation and compute cryptographic SHA-256 and MD5 hashes.',
    iconName: 'ShieldCheck',
    featuredTools: ['password-generator', 'hash-generator']
  },
  'everyday-utilities': {
    id: 'everyday-utilities',
    slug: 'everyday-utilities',
    name: 'Everyday Utilities',
    shortName: 'Everyday Utilities',
    description: 'Everyday tools including interactive multi-step digital tally counter and random choice picker for quick, unbiased decisions.',
    iconName: 'Wrench',
    featuredTools: ['random-decision-picker', 'tally-counter']
  },
  'finance-calculators': {
    id: 'finance-calculators',
    slug: 'finance-calculators',
    name: 'Finance & Calculators',
    shortName: 'Finance',
    description: 'Calculate monthly loan EMI repayments with amortization breakdown, and compute bill tips, bill splitting, and sales discounts.',
    iconName: 'Calculator',
    featuredTools: ['loan-emi-calculator', 'tip-discount-calculator']
  },
  'exam-eligibility-tools': {
    id: 'exam-eligibility-tools',
    slug: 'exam-eligibility-tools',
    name: 'Exam & Eligibility Tools',
    shortName: 'Exam & Eligibility',
    description: 'Check exam eligibility, calculate age limits with category relaxations, calculate negative marks, and resize photos & signatures for official forms.',
    iconName: 'Award',
    featuredTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator', 'exam-photo-signature-resizer']
  },
  'career-job-tools': {
    id: 'career-job-tools',
    slug: 'career-job-tools',
    name: 'Career & Job Tools',
    shortName: 'Career & Jobs',
    description: 'Calculate in-hand salaries across pay levels, evaluate job qualifications, match post criteria, and plan career progression transparently.',
    iconName: 'Briefcase',
    featuredTools: ['in-hand-salary-estimator', 'job-qualification-matcher']
  },
  'language-writing-tools': {
    id: 'language-writing-tools',
    slug: 'language-writing-tools',
    name: 'Language & Writing Tools',
    shortName: 'Language & Writing',
    description: 'Calculate IELTS & TOEFL band scores, convert letter casing, count words and characters, and evaluate reading speeds with zero uploads.',
    iconName: 'PenTool',
    featuredTools: ['ielts-band-calculator', 'reading-time-speed-calculator', 'text-case-converter', 'word-counter']
  },
  'study-test-prep-tools': {
    id: 'study-test-prep-tools',
    slug: 'study-test-prep-tools',
    name: 'Study & Test Preparation Tools',
    shortName: 'Study & Test Prep',
    description: 'Plan study timetables, track exam syllabus coverage, analyze solving speed and accuracy curves, and master revision schedules.',
    iconName: 'BookMarked',
    featuredTools: ['study-timetable-planner', 'exam-accuracy-speed-analyzer', 'pomodoro-timer']
  }
};

export const CATEGORIES_LIST = Object.values(CATEGORIES);
