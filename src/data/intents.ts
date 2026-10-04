export interface ProblemIntent {
  id: string;
  problem: string;
  sublabel: string;
  toolSlug: string;
  categoryName: string;
  iconName: string;
  badge?: string;
  hinglishQuery: string;
}

export const WHAT_DO_YOU_WANT_TO_DO: ProblemIntent[] = [
  {
    id: 'compress-pdf',
    problem: 'Make my PDF smaller for upload',
    sublabel: 'Reduce file size under 1MB or 2MB without quality loss',
    toolSlug: 'pdf-compressor',
    categoryName: 'PDF Tools',
    iconName: 'FileText',
    badge: 'High Demand',
    hinglishQuery: 'pdf chota karna hai'
  },
  {
    id: 'photo-100kb',
    problem: 'Get photo under 100 KB or 50 KB',
    sublabel: 'Best-effort target size compressor for online applications',
    toolSlug: 'image-compressor',
    categoryName: 'Image Tools',
    iconName: 'Image',
    badge: 'Popular',
    hinglishQuery: 'photo 100 kb size kam'
  },
  {
    id: 'resize-signature',
    problem: 'Resize signature or photo dimensions',
    sublabel: 'Set exact width, height, and preserve proportions',
    toolSlug: 'image-resizer',
    categoryName: 'Image Tools',
    iconName: 'Crop',
    badge: 'Fast',
    hinglishQuery: 'signature resize karna hai'
  },
  {
    id: 'merge-pdfs',
    problem: 'Combine multiple PDF files into one',
    sublabel: 'Merge scanned IDs, contracts, or bank statements privately',
    toolSlug: 'pdf-merger',
    categoryName: 'PDF Tools',
    iconName: 'Combine',
    badge: 'Essential',
    hinglishQuery: 'pdf jodna hai ek sath'
  },
  {
    id: 'calculate-emi',
    problem: 'Calculate monthly loan EMI & interest',
    sublabel: 'Check monthly repayment, total interest, and amortization',
    toolSlug: 'loan-emi-calculator',
    categoryName: 'Finance',
    iconName: 'Calculator',
    badge: 'Finance',
    hinglishQuery: 'loan emi nikalna'
  },
  {
    id: 'format-json',
    problem: 'Beautify or validate ugly JSON',
    sublabel: 'Format nested objects, highlight syntax errors, minify',
    toolSlug: 'json-formatter',
    categoryName: 'Developer Tools',
    iconName: 'Code',
    badge: 'Dev Utility',
    hinglishQuery: 'json format karna readable'
  },
  {
    id: 'create-qr',
    problem: 'Generate a QR code for URL or Wi-Fi',
    sublabel: 'Download printable high-resolution vector QR images',
    toolSlug: 'qr-code-generator',
    categoryName: 'QR & Barcode',
    iconName: 'QrCode',
    badge: 'Instant',
    hinglishQuery: 'qr code banana'
  },
  {
    id: 'calculate-percentage',
    problem: 'Calculate percentage increase or discount',
    sublabel: 'Solve what is X% of Y, discounts, or percentage change',
    toolSlug: 'percentage-calculator',
    categoryName: 'Education & Math',
    iconName: 'Percent',
    badge: 'Math',
    hinglishQuery: 'percentage nikalna'
  },
  {
    id: 'strong-password',
    problem: 'Generate an unhackable password',
    sublabel: 'Create high-entropy passwords with custom length & symbols',
    toolSlug: 'password-generator',
    categoryName: 'Security',
    iconName: 'Lock',
    badge: 'Security',
    hinglishQuery: 'strong password banana'
  },
  {
    id: 'calculate-age',
    problem: 'Calculate exact age & lived days',
    sublabel: 'Find exact years, months, days, and total days lived',
    toolSlug: 'age-calculator',
    categoryName: 'Date & Time',
    iconName: 'Clock',
    badge: 'Date',
    hinglishQuery: 'age calculate karna'
  },
  {
    id: 'convert-units',
    problem: 'Convert units (length, weight, temp)',
    sublabel: 'Universal converter between metric, imperial, and SI units',
    toolSlug: 'universal-unit-converter',
    categoryName: 'Converters',
    iconName: 'ArrowRightLeft',
    badge: 'Converter',
    hinglishQuery: 'unit convert karna'
  },
  {
    id: 'word-counter',
    problem: 'Count words, characters, and reading time',
    sublabel: 'Instant live statistics for essays, captions, and articles',
    toolSlug: 'word-counter',
    categoryName: 'Text Tools',
    iconName: 'Type',
    badge: 'Writing',
    hinglishQuery: 'words aur character count karna'
  }
];

// Rich Hinglish & Natural Language Keyword Dictionary
export interface IntentDictionaryItem {
  patterns: string[];
  toolSlug: string;
  matchedReason: string;
}

export const INTENT_DICTIONARY: IntentDictionaryItem[] = [
  // PDF
  {
    patterns: ['pdf chota', 'pdf chota karna', 'pdf size kam', 'pdf kam size', 'pdf compress', 'compress pdf', 'pdf reduce', 'pdf under 1mb', 'pdf under 2mb', 'pdf halka', 'pdf size ghatana'],
    toolSlug: 'pdf-compressor',
    matchedReason: 'Matched: PDF size reduction'
  },
  {
    patterns: ['pdf jodna', 'pdf milana', 'pdf combine', 'merge pdf', 'multiple pdf', 'join pdf', 'combine pdf', 'pdf merge karna'],
    toolSlug: 'pdf-merger',
    matchedReason: 'Matched: PDF merge & combine'
  },
  {
    patterns: ['pdf alag karna', 'pdf page nikalna', 'split pdf', 'extract pdf', 'separate pdf', 'cut pdf', 'pdf divide'],
    toolSlug: 'pdf-splitter',
    matchedReason: 'Matched: PDF split & page extraction'
  },
  {
    patterns: ['photo to pdf', 'image to pdf', 'jpg to pdf', 'png to pdf', 'photo se pdf banana', 'picture to pdf'],
    toolSlug: 'image-to-pdf',
    matchedReason: 'Matched: Image to PDF conversion'
  },
  {
    patterns: ['pdf watermark', 'watermark lagana', 'pdf stamp', 'confidential stamp', 'protect pdf'],
    toolSlug: 'pdf-watermark',
    matchedReason: 'Matched: PDF watermark & stamp'
  },

  // Image
  {
    patterns: ['photo 100 kb', 'image 100 kb', 'photo 50 kb', 'image 50 kb', 'photo 200 kb', 'image 20 kb', 'photo choti karni', 'photo size kam', 'image kb kam', 'compress photo', 'reduce photo size', 'kb kam karna'],
    toolSlug: 'image-compressor',
    matchedReason: 'Matched: Image target size compression'
  },
  {
    patterns: ['signature resize', 'signature banana', 'signature size', 'photo resize', 'image resize', 'resize photo', 'photo dimensions', 'pixel resize', 'image width height'],
    toolSlug: 'image-resizer',
    matchedReason: 'Matched: Dimension resize & signature sizing'
  },
  {
    patterns: ['image convert', 'jpg to png', 'png to jpg', 'webp convert', 'photo format badalna', 'convert image format'],
    toolSlug: 'image-format-converter',
    matchedReason: 'Matched: Image format conversion'
  },
  {
    patterns: ['crop photo', 'image cut', 'photo katna', 'avatar crop', 'square crop', 'aspect ratio crop'],
    toolSlug: 'image-cropper',
    matchedReason: 'Matched: Image cropping'
  },
  {
    patterns: ['color picker', 'image se color nikalna', 'photo color pick', 'hex from image', 'dropper'],
    toolSlug: 'image-color-picker',
    matchedReason: 'Matched: Color sampling from image'
  },

  // Developer
  {
    patterns: ['json format', 'json readable', 'json sundar', 'beautify json', 'json validate', 'json error check', 'json formatter'],
    toolSlug: 'json-formatter',
    matchedReason: 'Matched: JSON formatting & validation'
  },
  {
    patterns: ['base64 encode', 'base64 decode', 'base64 convert', 'text to base64', 'base64 to text'],
    toolSlug: 'base64-codec',
    matchedReason: 'Matched: Base64 encoding/decoding'
  },
  {
    patterns: ['jwt decode', 'jwt check', 'token decode', 'token expiry', 'bearer token read'],
    toolSlug: 'jwt-decoder',
    matchedReason: 'Matched: JWT token inspection'
  },
  {
    patterns: ['uuid generate', 'guid generate', 'unique id', 'uuid v4', 'random id'],
    toolSlug: 'uuid-generator',
    matchedReason: 'Matched: UUID generation'
  },
  {
    patterns: ['regex test', 'regular expression', 'regex tester', 'pattern match'],
    toolSlug: 'regex-tester',
    matchedReason: 'Matched: Regular expression testing'
  },

  // Finance
  {
    patterns: ['emi calculate', 'loan emi', 'emi nikalna', 'car loan emi', 'home loan emi', 'loan interest', 'monthly installment', 'kist nikalna'],
    toolSlug: 'loan-emi-calculator',
    matchedReason: 'Matched: Loan EMI calculation'
  },
  {
    patterns: ['tip calculate', 'bill split', 'discount nikalna', 'shopping discount', 'sales tax', 'bill batwara'],
    toolSlug: 'tip-discount-calculator',
    matchedReason: 'Matched: Tip & discount computation'
  },

  // Math & Education
  {
    patterns: ['percentage calculate', 'percentage nikalna', 'percent nikalna', 'percent kaise nikale', 'pratishat', 'discount percentage'],
    toolSlug: 'percentage-calculator',
    matchedReason: 'Matched: Percentage calculations'
  },
  {
    patterns: ['ratio proportion', 'ratio nikalna', 'aspect ratio', '16:9 ratio', 'simplify ratio', 'anupat'],
    toolSlug: 'ratio-proportion-calculator',
    matchedReason: 'Matched: Ratio & proportion resolution'
  },
  {
    patterns: ['average nikalna', 'mean median mode', 'average calculate', 'osat nikalna'],
    toolSlug: 'average-calculator',
    matchedReason: 'Matched: Statistical averages'
  },

  // Everyday & Security
  {
    patterns: ['password banana', 'strong password', 'secure password', 'password generator', 'random password'],
    toolSlug: 'password-generator',
    matchedReason: 'Matched: Strong password generation'
  },
  {
    patterns: ['age calculate', 'age nikalna', 'umar kitni hui', 'dob se age', 'exact age', 'date of birth age'],
    toolSlug: 'age-calculator',
    matchedReason: 'Matched: Chronological age calculation'
  },
  {
    patterns: ['days between', 'din kitne bache', 'date diff', 'working days', 'tarikh ke beech din'],
    toolSlug: 'days-between-dates',
    matchedReason: 'Matched: Days between dates calculation'
  },
  {
    patterns: ['qr banana', 'qr code banana', 'wifi qr', 'qr code create', 'link ka qr'],
    toolSlug: 'qr-code-generator',
    matchedReason: 'Matched: QR code creation'
  },
  {
    patterns: ['counter', 'tally counter', 'clicker', 'counting karna', 'ginti karna', 'mala counter'],
    toolSlug: 'tally-counter',
    matchedReason: 'Matched: Digital tally counting'
  },
  {
    patterns: ['random pick', 'choice picker', 'decision maker', 'kismat', 'lottery pick', 'toss coin'],
    toolSlug: 'random-decision-picker',
    matchedReason: 'Matched: Random choice selection'
  },
  {
    patterns: ['word count', 'character count', 'words ginna', 'letter count', 'essay length'],
    toolSlug: 'word-counter',
    matchedReason: 'Matched: Word & character counting'
  },
  {
    patterns: ['unit convert', 'inches to cm', 'kg to lbs', 'meter to feet', 'temperature convert'],
    toolSlug: 'universal-unit-converter',
    matchedReason: 'Matched: Universal unit conversion'
  },
  {
    patterns: ['color palette', 'colors banana', 'rang matching', 'theme colors', 'palette generator'],
    toolSlug: 'color-palette-generator',
    matchedReason: 'Matched: Color palette generation'
  }
];
