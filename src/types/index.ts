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
  | 'educational-tools'
  | 'color-design'
  | 'security-privacy'
  | 'everyday-utilities'
  | 'finance-calculators'
  | 'exam-eligibility-tools'
  | 'career-job-tools'
  | 'language-writing-tools'
  | 'study-test-prep-tools';

export interface AgeRelaxationRule {
  category: string;
  relaxationYears: number;
  description?: string;
}

export interface ExamMarkingScheme {
  totalQuestions: number;
  totalMarks: number;
  positivePerCorrect: number;
  negativePerIncorrect: number;
  durationMinutes: number;
  sections?: { name: string; questions: number; marks: number }[];
}

export interface ExamMediaRequirements {
  widthMm?: number;
  heightMm?: number;
  minKb: number;
  maxKb: number;
  dimensionText: string;
  instructions: string;
}

export interface ExamItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  region: 'india' | 'international';
  country: 'India' | 'United States' | 'United Kingdom' | 'Canada' | 'Australia' | 'International';
  authority: string;
  authorityCategory:
    | 'ssc'
    | 'railway'
    | 'upsc'
    | 'banking'
    | 'defence'
    | 'teaching'
    | 'engineering'
    | 'medical'
    | 'state-police'
    | 'us-admissions'
    | 'uk-admissions'
    | 'international-english'
    | 'other';
  shortDescription: string;
  officialWebsiteUrl: string;
  officialNotificationUrl?: string;
  officialSyllabusUrl?: string;
  qualificationRequirements: string;
  minAge: number;
  maxAge: number;
  ageReferenceDate: string;
  ageRelaxation: AgeRelaxationRule[];
  attemptsRestrictions?: string;
  markingScheme: ExamMarkingScheme;
  photoRequirements?: ExamMediaRequirements;
  signatureRequirements?: ExamMediaRequirements;
  relatedTools: string[];
  lastVerifiedDate: string;
  dataSource: string;
  notificationYear: string;
  status: 'verified' | 'partially-verified';
}

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

export interface ToolNextStep {
  slug: string;
  label: string;
  reason: string;
}

export interface ToolPreset {
  name: string;
  description: string;
  badge?: string;
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
  aliases?: string[];
  useCases?: string[];
  problemPhrases?: string[];
  intentPhrases?: string[];
  hinglishPhrases?: string[];
  workflowIds?: string[];
  nextSteps?: ToolNextStep[];
  targetSizes?: string[];
  presets?: ToolPreset[];
  limitations?: string[];
  tips?: string[];
  troubleshooting?: { problem: string; solution: string }[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  toolSlug: string;
}

export interface ToolWorkflow {
  id: string;
  title: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  badge: string;
  steps: WorkflowStep[];
}

export interface GuideItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  targetSlug: string;
  readTime: string;
  keywords: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
