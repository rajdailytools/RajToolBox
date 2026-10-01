export type ToolCategory =
  | 'pdf-tools'
  | 'image-tools'
  | 'text-tools'
  | 'developer-tools'
  | 'qr-barcode-tools'
  | 'converters'
  | 'seo-tools'
  | 'social-media-tools'
  | 'file-data-tools'
  | 'productivity-tools'
  | 'date-time-tools'
  | 'educational-tools';

export interface CategoryInfo {
  id: ToolCategory;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  count?: number;
  featuredTools: string[];
}

export interface HowToStep {
  step: number;
  title: string;
  instruction: string;
}

export interface RealLifeExample {
  title: string;
  inputDescription: string;
  outputDescription: string;
  details?: { label: string; value: string }[];
}

export interface ToolFormula {
  title: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  explanation: string;
  workedExample: string;
}

export interface ToolDiagramStep {
  label: string;
  detail: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  howToSteps: HowToStep[];
  realLifeExample: RealLifeExample;
  howItWorks: string;
  formula?: ToolFormula;
  diagramSteps?: ToolDiagramStep[];
  graphConfig?: {
    type: 'bar' | 'line' | 'ratio' | 'distribution';
    title: string;
    description: string;
  };
  faqs: ToolFAQ[];
  relatedToolSlugs: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
