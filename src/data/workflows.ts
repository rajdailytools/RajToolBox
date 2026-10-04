import { ToolWorkflow } from '../types';
export type { ToolWorkflow };

export const TOOL_WORKFLOWS: ToolWorkflow[] = [
  {
    id: 'image-preparation',
    title: 'Complete Image Preparation Chain',
    category: 'image-tools',
    description: 'Prepare photos, avatars, and documents for web, forms, or job portals in four seamless browser-native steps.',
    iconName: 'Image',
    badge: 'Popular Workflow',
    steps: [
      {
        step: 1,
        title: 'Crop & Framing',
        description: 'Trim unwanted borders and lock standard 1:1, 4:3, or 16:9 aspect ratios.',
        toolSlug: 'image-cropper'
      },
      {
        step: 2,
        title: 'Dimensions Resize',
        description: 'Scale pixel width and height to required dimensions (e.g. 800px or 1080px).',
        toolSlug: 'image-resizer'
      },
      {
        step: 3,
        title: 'Target Size Compression',
        description: 'Compress file size under 100 KB, 50 KB, or 200 KB while preserving sharpness.',
        toolSlug: 'image-compressor'
      },
      {
        step: 4,
        title: 'Format Conversion',
        description: 'Convert output to WebP for fast websites, or JPG for portal forms.',
        toolSlug: 'image-format-converter'
      }
    ]
  },
  {
    id: 'pdf-document-mastery',
    title: 'PDF Document Compilation & Prep',
    category: 'pdf-tools',
    description: 'Consolidate multiple scanned pages, remove blank pages, and compress down for email attachment limits.',
    iconName: 'FileText',
    badge: 'Essential Chain',
    steps: [
      {
        step: 1,
        title: 'Merge Files',
        description: 'Combine multiple individual PDF reports, balance sheets, or IDs into one file.',
        toolSlug: 'pdf-merger'
      },
      {
        step: 2,
        title: 'Split & Extract Pages',
        description: 'Extract only the necessary invoice pages or remove irrelevant appendices.',
        toolSlug: 'pdf-splitter'
      },
      {
        step: 3,
        title: 'Compress PDF',
        description: 'Reduce PDF memory footprint to fit under standard 2MB or 5MB email gateways.',
        toolSlug: 'pdf-compressor'
      },
      {
        step: 4,
        title: 'Watermark Security',
        description: 'Stamp "CONFIDENTIAL" or "COPY FOR VERIFICATION" across pages for fraud prevention.',
        toolSlug: 'pdf-watermark'
      }
    ]
  },
  {
    id: 'developer-data-pipeline',
    title: 'Developer JSON & API Data Pipeline',
    category: 'developer-tools',
    description: 'Inspect, validate, clean, and export structured payloads between systems with zero external API calls.',
    iconName: 'Code',
    badge: 'Dev Pipeline',
    steps: [
      {
        step: 1,
        title: 'Format & Validate JSON',
        description: 'Beautify raw API responses, fix quotation anomalies, and inspect schema tree.',
        toolSlug: 'json-formatter'
      },
      {
        step: 2,
        title: 'Convert to CSV',
        description: 'Transform nested object arrays into downloadable spreadsheet tabular data.',
        toolSlug: 'json-to-csv'
      },
      {
        step: 3,
        title: 'Encode / Decode Base64',
        description: 'Encode binary tokens, inline images, or authorization credentials safely.',
        toolSlug: 'base64-codec'
      }
    ]
  },
  {
    id: 'seo-launch-stack',
    title: 'SEO & Web Launch Stack',
    category: 'seo-tools',
    description: 'Generate high-ranking meta tags, protocol files, and trackable campaign links for new page releases.',
    iconName: 'Globe',
    badge: 'Webmaster Stack',
    steps: [
      {
        step: 1,
        title: 'Meta & OpenGraph Tags',
        description: 'Generate standard HTML SEO tags, social share titles, and image previews.',
        toolSlug: 'meta-tag-generator'
      },
      {
        step: 2,
        title: 'Robots.txt Directives',
        description: 'Define search engine crawling permissions and specify XML sitemap location.',
        toolSlug: 'robots-txt-generator'
      },
      {
        step: 3,
        title: 'XML Sitemap',
        description: 'Generate search-engine-ready XML index of all public URLs.',
        toolSlug: 'sitemap-generator'
      },
      {
        step: 4,
        title: 'UTM Campaign Tracking',
        description: 'Tag newsletter and social URLs with source, medium, and campaign parameters.',
        toolSlug: 'utm-builder'
      }
    ]
  },
  {
    id: 'financial-planning',
    title: 'Loan Financing & Expense Planning',
    category: 'finance-calculators',
    description: 'Calculate monthly repayment obligations, evaluate interest costs, and budget shopping discounts.',
    iconName: 'Calculator',
    badge: 'Finance Stack',
    steps: [
      {
        step: 1,
        title: 'Loan EMI & Repayment',
        description: 'Calculate monthly installment, total interest, and principal amortization.',
        toolSlug: 'loan-emi-calculator'
      },
      {
        step: 2,
        title: 'Percentage Analysis',
        description: 'Determine interest-to-principal proportions and down payment percentages.',
        toolSlug: 'percentage-calculator'
      },
      {
        step: 3,
        title: 'Discount & Split Budget',
        description: 'Compute retail sale discounts, tax markups, and group split amounts.',
        toolSlug: 'tip-discount-calculator'
      }
    ]
  }
];

export function getWorkflowById(id: string): ToolWorkflow | undefined {
  return TOOL_WORKFLOWS.find((w) => w.id === id);
}

export function getWorkflowsByToolSlug(slug: string): ToolWorkflow[] {
  return TOOL_WORKFLOWS.filter((w) => w.steps.some((s) => s.toolSlug === slug));
}
