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
    featuredTools: ['word-counter', 'case-converter', 'text-cleaner', 'text-diff-checker', 'find-and-replace', 'slug-generator']
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
    name: 'QR & Barcode Tools',
    shortName: 'QR & Barcode',
    description: 'Generate customizable high-resolution QR codes for URLs, WiFi, contact cards, text, and render industrial barcodes ready to download.',
    iconName: 'QrCode',
    featuredTools: ['qr-code-generator', 'wifi-qr-generator', 'vcard-qr-generator', 'barcode-generator', 'barcode-guide']
  },
  'converters': {
    id: 'converters',
    slug: 'converters',
    name: 'Converter Tools',
    shortName: 'Converters',
    description: 'Accurately convert length, weight, temperature, data storage, speed, pressure, energy, angles, number systems, and Roman numerals.',
    iconName: 'ArrowRightLeft',
    featuredTools: ['universal-unit-converter', 'number-system-converter', 'roman-numeral-converter', 'number-to-words']
  },
  'seo-tools': {
    id: 'seo-tools',
    slug: 'seo-tools',
    name: 'SEO & Web Tools',
    shortName: 'SEO',
    description: 'Generate complete Meta tags, OpenGraph previews, Twitter cards, Robots.txt, XML Sitemaps, UTM campaign URLs, and check keyword density.',
    iconName: 'Globe',
    featuredTools: ['meta-tag-generator', 'robots-txt-generator', 'sitemap-generator', 'utm-builder', 'keyword-density-checker', 'http-status-codes']
  },
  'social-media-tools': {
    id: 'social-media-tools',
    slug: 'social-media-tools',
    name: 'Social Media Tools',
    shortName: 'Social',
    description: 'Format captivating Instagram captions, craft YouTube titles and descriptions, organize hashtags, and check platform character limits.',
    iconName: 'Share2',
    featuredTools: ['social-post-formatter', 'youtube-helper', 'hashtag-formatter', 'social-image-dimensions']
  },
  'file-data-tools': {
    id: 'file-data-tools',
    slug: 'file-data-tools',
    name: 'File & Data Tools',
    shortName: 'File & Data',
    description: 'Convert CSV to JSON and JSON to CSV, clean tabulated data, calculate cryptographic file hashes, and convert binary file storage units.',
    iconName: 'FileSpreadsheet',
    featuredTools: ['csv-to-json', 'json-to-csv', 'file-hash-generator', 'file-size-converter', 'duplicate-data-checker']
  },
  'productivity-tools': {
    id: 'productivity-tools',
    slug: 'productivity-tools',
    name: 'Productivity Tools',
    shortName: 'Productivity',
    description: 'Stay on track with a customizable Pomodoro timer, precision stopwatch, secure password generator, random choice picker, and palette maker.',
    iconName: 'CheckSquare',
    featuredTools: ['pomodoro-timer', 'password-generator', 'stopwatch-timer', 'random-decision-picker', 'color-palette-generator']
  },
  'date-time-tools': {
    id: 'date-time-tools',
    slug: 'date-time-tools',
    name: 'Date & Time Utilities',
    shortName: 'Date & Time',
    description: 'Calculate days between dates, working days, add or subtract time intervals, compute exact age in years/months/days, and check leap years.',
    iconName: 'Clock',
    featuredTools: ['days-between-dates', 'age-calculator', 'working-days-calculator', 'add-subtract-days', 'leap-year-checker']
  },
  'educational-tools': {
    id: 'educational-tools',
    slug: 'educational-tools',
    name: 'Educational Utilities',
    shortName: 'Educational',
    description: 'Calculate percentages, solve ratios & proportions, compute arithmetic averages, simplify fractions, find prime factors, and GCD/LCM.',
    iconName: 'GraduationCap',
    featuredTools: ['percentage-calculator', 'ratio-proportion-calculator', 'average-calculator', 'fraction-calculator', 'prime-number-checker', 'gcd-lcm-calculator']
  }
};

export const CATEGORIES_LIST = Object.values(CATEGORIES);
