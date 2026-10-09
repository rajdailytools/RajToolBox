import { ExamItem } from '../types';

export type { ExamItem };

export const EXAMS_REGISTRY: ExamItem[] = [
  // ==========================================
  // INDIA — STAFF SELECTION COMMISSION (SSC)
  // ==========================================
  {
    id: 'ssc-cgl',
    slug: 'ssc-cgl',
    name: 'SSC CGL (Combined Graduate Level)',
    shortName: 'SSC CGL',
    region: 'india',
    country: 'India',
    authority: 'Staff Selection Commission (SSC)',
    authorityCategory: 'ssc',
    shortDescription: 'National level graduate recruitment for Group B & C gazetted and non-gazetted posts across central ministries and departments.',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    qualificationRequirements: "Bachelor's Degree in any discipline from a recognized university. Specific posts (e.g. Statistical Officer) require statistics or mathematics background.",
    minAge: 18,
    maxAge: 32,
    ageReferenceDate: 'August 1 of notification year (per official SSC notice)',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3, description: '3 years relaxation for Other Backward Classes (Non-Creamy Layer)' },
      { category: 'SC/ST', relaxationYears: 5, description: '5 years relaxation for Scheduled Castes & Scheduled Tribes' },
      { category: 'PwD (Unreserved)', relaxationYears: 10, description: '10 years relaxation for Persons with Benchmark Disabilities' },
      { category: 'PwD (OBC)', relaxationYears: 13, description: '13 years relaxation for PwD OBC candidates' },
      { category: 'PwD (SC/ST)', relaxationYears: 15, description: '15 years relaxation for PwD SC/ST candidates' },
      { category: 'Ex-Servicemen (ESM)', relaxationYears: 3, description: '3 years after deduction of military service from actual age' }
    ],
    attemptsRestrictions: 'No restriction on number of attempts provided the candidate meets the age criteria.',
    markingScheme: {
      totalQuestions: 100,
      totalMarks: 200,
      positivePerCorrect: 2.0,
      negativePerIncorrect: 0.5,
      durationMinutes: 60,
      sections: [
        { name: 'General Intelligence and Reasoning', questions: 25, marks: 50 },
        { name: 'General Awareness', questions: 25, marks: 50 },
        { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
        { name: 'English Comprehension', questions: 25, marks: 50 }
      ]
    },
    photoRequirements: {
      widthMm: 35,
      heightMm: 45,
      minKb: 20,
      maxKb: 50,
      dimensionText: '3.5 cm x 4.5 cm (JPEG/JPG)',
      instructions: 'Recent passport photo on light/plain white background. Face must cover 70-80% of photo. Spectacles and caps not allowed.'
    },
    signatureRequirements: {
      minKb: 10,
      maxKb: 20,
      dimensionText: '4.0 cm x 2.0 cm (JPEG/JPG)',
      instructions: 'Running handwriting signature in black/blue ink on white paper.'
    },
    relatedTools: [
      'exam-eligibility-checker',
      'age-limit-calculator',
      'negative-marking-calculator',
      'exam-photo-signature-resizer',
      'in-hand-salary-estimator'
    ],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official SSC Examination Calendar & Notice (ssc.gov.in)',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'ssc-chsl',
    slug: 'ssc-chsl',
    name: 'SSC CHSL (Combined Higher Secondary Level 10+2)',
    shortName: 'SSC CHSL',
    region: 'india',
    country: 'India',
    authority: 'Staff Selection Commission (SSC)',
    authorityCategory: 'ssc',
    shortDescription: 'Recruitment for Lower Divisional Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO).',
    officialWebsiteUrl: 'https://ssc.gov.in',
    qualificationRequirements: '12th Standard (Higher Secondary) pass from a recognized board. For DEO Grade A, 12th pass in Science stream with Mathematics is required.',
    minAge: 18,
    maxAge: 27,
    ageReferenceDate: 'August 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD', relaxationYears: 10 },
      { category: 'Ex-Servicemen', relaxationYears: 3 }
    ],
    attemptsRestrictions: 'No attempt limit within eligible age band.',
    markingScheme: {
      totalQuestions: 100,
      totalMarks: 200,
      positivePerCorrect: 2.0,
      negativePerIncorrect: 0.5,
      durationMinutes: 60,
      sections: [
        { name: 'English Language', questions: 25, marks: 50 },
        { name: 'General Intelligence', questions: 25, marks: 50 },
        { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
        { name: 'General Awareness', questions: 25, marks: 50 }
      ]
    },
    photoRequirements: {
      minKb: 20,
      maxKb: 50,
      dimensionText: '3.5 cm x 4.5 cm (JPEG)',
      instructions: 'Recent color photograph taken without spectacles or headgear.'
    },
    signatureRequirements: {
      minKb: 10,
      maxKb: 20,
      dimensionText: '4.0 cm x 2.0 cm (JPEG)',
      instructions: 'Clear legible signature in running hand.'
    },
    relatedTools: [
      'exam-eligibility-checker',
      'age-limit-calculator',
      'negative-marking-calculator',
      'exam-photo-signature-resizer'
    ],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official SSC CHSL Notice',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'ssc-mts',
    slug: 'ssc-mts',
    name: 'SSC MTS & Havaldar',
    shortName: 'SSC MTS',
    region: 'india',
    country: 'India',
    authority: 'Staff Selection Commission (SSC)',
    authorityCategory: 'ssc',
    shortDescription: 'Multi-Tasking (Non-Technical) Staff and Havaldar in CBIC and CBN ministries.',
    officialWebsiteUrl: 'https://ssc.gov.in',
    qualificationRequirements: 'Matriculation (10th Class) pass from a recognized board or university.',
    minAge: 18,
    maxAge: 25, // Some posts 27
    ageReferenceDate: 'August 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD', relaxationYears: 10 }
    ],
    markingScheme: {
      totalQuestions: 90,
      totalMarks: 270,
      positivePerCorrect: 3.0,
      negativePerIncorrect: 1.0,
      durationMinutes: 90,
      sections: [
        { name: 'Session 1: Numerical & Math + Reasoning (No Negative)', questions: 40, marks: 120 },
        { name: 'Session 2: General Awareness & English (1 mark negative)', questions: 50, marks: 150 }
      ]
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official SSC MTS Notice',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'ssc-cpo',
    slug: 'ssc-cpo',
    name: 'SSC CPO (Sub-Inspector in Delhi Police & CAPFs)',
    shortName: 'SSC CPO',
    region: 'india',
    country: 'India',
    authority: 'Staff Selection Commission (SSC)',
    authorityCategory: 'ssc',
    shortDescription: 'Recruitment of Sub-Inspectors in Delhi Police, BSF, CISF, CRPF, ITBP, and SSB.',
    officialWebsiteUrl: 'https://ssc.gov.in',
    qualificationRequirements: "Bachelor's degree from a recognized university. Valid driving license for LMV for SI in Delhi Police.",
    minAge: 20,
    maxAge: 25,
    ageReferenceDate: 'August 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'Ex-Servicemen', relaxationYears: 3 }
    ],
    markingScheme: {
      totalQuestions: 200,
      totalMarks: 200,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.25,
      durationMinutes: 120
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator', 'in-hand-salary-estimator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official SSC CPO Notice',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'ssc-gd',
    slug: 'ssc-gd',
    name: 'SSC GD Constable (CAPFs, SSF, Assam Rifles)',
    shortName: 'SSC GD',
    region: 'india',
    country: 'India',
    authority: 'Staff Selection Commission (SSC)',
    authorityCategory: 'ssc',
    shortDescription: 'General Duty Constable recruitment in BSF, CISF, CRPF, ITBP, SSB, SSF, and Rifleman in Assam Rifles.',
    officialWebsiteUrl: 'https://ssc.gov.in',
    qualificationRequirements: '10th Class pass from a recognized board.',
    minAge: 18,
    maxAge: 23,
    ageReferenceDate: 'January 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 }
    ],
    markingScheme: {
      totalQuestions: 80,
      totalMarks: 160,
      positivePerCorrect: 2.0,
      negativePerIncorrect: 0.25,
      durationMinutes: 60
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official SSC GD Notice',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'ssc-je',
    slug: 'ssc-je',
    name: 'SSC JE (Junior Engineer Civil / Mech / Elect)',
    shortName: 'SSC JE',
    region: 'india',
    country: 'India',
    authority: 'Staff Selection Commission (SSC)',
    authorityCategory: 'ssc',
    shortDescription: 'Junior Engineer recruitment across CPWD, MES, CWC, and Border Roads Organisation.',
    officialWebsiteUrl: 'https://ssc.gov.in',
    qualificationRequirements: 'Degree or 3-year Diploma in Civil, Mechanical, or Electrical Engineering from a recognized institution.',
    minAge: 18,
    maxAge: 30, // CPWD up to 32
    ageReferenceDate: 'August 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD', relaxationYears: 10 }
    ],
    markingScheme: {
      totalQuestions: 200,
      totalMarks: 200,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.25,
      durationMinutes: 120
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator', 'in-hand-salary-estimator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official SSC JE Notice',
    notificationYear: '2025-2026',
    status: 'verified'
  },

  // ==========================================
  // INDIA — RAILWAY RECRUITMENT BOARDS (RRB)
  // ==========================================
  {
    id: 'rrb-ntpc',
    slug: 'rrb-ntpc',
    name: 'RRB NTPC (Non-Technical Popular Categories)',
    shortName: 'RRB NTPC',
    region: 'india',
    country: 'India',
    authority: 'Railway Recruitment Boards (RRB)',
    authorityCategory: 'railway',
    shortDescription: 'Recruitment for Station Master, Goods Train Manager, Senior Clerk, Junior Clerk, and Commercial Apprentice across Indian Railways.',
    officialWebsiteUrl: 'https://indianrailways.gov.in',
    qualificationRequirements: "Graduate Level posts require Bachelor's Degree. Undergraduate posts require 12th (+2 Stage) pass from a recognized board.",
    minAge: 18,
    maxAge: 33, // Graduate 18-33 (with temporary Covid relaxations up to 36)
    ageReferenceDate: 'July 1 of notification year',
    ageRelaxation: [
      { category: 'OBC (Non-Creamy Layer)', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD (UR)', relaxationYears: 10 },
      { category: 'Ex-Servicemen', relaxationYears: 3 }
    ],
    attemptsRestrictions: 'No restrictions on attempts.',
    markingScheme: {
      totalQuestions: 100,
      totalMarks: 100,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.333,
      durationMinutes: 90,
      sections: [
        { name: 'General Awareness', questions: 40, marks: 40 },
        { name: 'Mathematics', questions: 30, marks: 30 },
        { name: 'General Intelligence and Reasoning', questions: 30, marks: 30 }
      ]
    },
    photoRequirements: {
      minKb: 20,
      maxKb: 50,
      dimensionText: '35 mm x 45 mm',
      instructions: 'Color photograph with clear background, face without sunglasses or dark lenses.'
    },
    signatureRequirements: {
      minKb: 10,
      maxKb: 40,
      dimensionText: '50 mm x 20 mm',
      instructions: 'Signature on white paper in blue/black ink.'
    },
    relatedTools: [
      'exam-eligibility-checker',
      'age-limit-calculator',
      'negative-marking-calculator',
      'exam-photo-signature-resizer',
      'in-hand-salary-estimator'
    ],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Railway Recruitment Control Board Centralised Employment Notice (CEN)',
    notificationYear: '2024-2026',
    status: 'verified'
  },
  {
    id: 'rrb-group-d',
    slug: 'rrb-group-d',
    name: 'RRB Group D (RRC Level 1 Track Maintainer & Helper)',
    shortName: 'RRB Group D',
    region: 'india',
    country: 'India',
    authority: 'Railway Recruitment Boards (RRB)',
    authorityCategory: 'railway',
    shortDescription: 'Level 1 technical and engineering support posts across Indian Railways tracks, sheds, and workshops.',
    officialWebsiteUrl: 'https://indianrailways.gov.in',
    qualificationRequirements: '10th pass from recognized board plus National Apprenticeship Certificate (NAC) or ITI in technical trades.',
    minAge: 18,
    maxAge: 33,
    ageReferenceDate: 'July 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD', relaxationYears: 10 }
    ],
    markingScheme: {
      totalQuestions: 100,
      totalMarks: 100,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.333,
      durationMinutes: 90
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'RRC CEN Official Notification',
    notificationYear: '2024-2026',
    status: 'verified'
  },
  {
    id: 'rrb-alp',
    slug: 'rrb-alp',
    name: 'RRB ALP (Assistant Loco Pilot)',
    shortName: 'RRB ALP',
    region: 'india',
    country: 'India',
    authority: 'Railway Recruitment Boards (RRB)',
    authorityCategory: 'railway',
    shortDescription: 'Loco pilot operations recruitment for Indian Railways train engines.',
    officialWebsiteUrl: 'https://indianrailways.gov.in',
    qualificationRequirements: 'Matriculation / 10th plus ITI in specified trades or 3-year Diploma/Degree in Mechanical, Electrical, Electronics or Automobile Engineering.',
    minAge: 18,
    maxAge: 30, // 3-year age relaxation granted in recent cycles
    ageReferenceDate: 'July 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 }
    ],
    markingScheme: {
      totalQuestions: 75,
      totalMarks: 75,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.333,
      durationMinutes: 60
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator', 'in-hand-salary-estimator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'RRB CEN 01/2024 Official Notice',
    notificationYear: '2024-2026',
    status: 'verified'
  },

  // ==========================================
  // INDIA — UNION PUBLIC SERVICE COMMISSION (UPSC)
  // ==========================================
  {
    id: 'upsc-cse',
    slug: 'upsc-cse',
    name: 'UPSC Civil Services Examination (CSE / IAS / IPS)',
    shortName: 'UPSC CSE',
    region: 'india',
    country: 'India',
    authority: 'Union Public Service Commission (UPSC)',
    authorityCategory: 'upsc',
    shortDescription: "India's premier administrative examination for Indian Administrative Service (IAS), IPS, IFS, and central Group A services.",
    officialWebsiteUrl: 'https://upsc.gov.in',
    qualificationRequirements: "Degree of a recognized University or equivalent. Final-year students are eligible to apply for Preliminary examination.",
    minAge: 21,
    maxAge: 32,
    ageReferenceDate: 'August 1 of examination year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwBD', relaxationYears: 10 },
      { category: 'Defence Service Personnel disabled in operations', relaxationYears: 3 }
    ],
    attemptsRestrictions: 'General/EWS: 6 attempts. OBC: 9 attempts. SC/ST: Unlimited within age limit. PwBD: 9 attempts for Gen/EWS/OBC.',
    markingScheme: {
      totalQuestions: 100, // GS Paper 1
      totalMarks: 200,
      positivePerCorrect: 2.0,
      negativePerIncorrect: 0.666, // 1/3rd penalty
      durationMinutes: 120,
      sections: [
        { name: 'General Studies Paper I', questions: 100, marks: 200 },
        { name: 'CSAT Paper II (Qualifying 33%)', questions: 80, marks: 200 }
      ]
    },
    photoRequirements: {
      minKb: 20,
      maxKb: 300,
      dimensionText: '350 x 350 to 1000 x 1000 px',
      instructions: "Candidate's name and date of photo taken must be clearly printed at the bottom of the photo per UPSC OTR guidelines."
    },
    signatureRequirements: {
      minKb: 20,
      maxKb: 300,
      dimensionText: '350 x 350 to 1000 x 1000 px',
      instructions: 'Clear scanned signature in black ink.'
    },
    relatedTools: [
      'exam-eligibility-checker',
      'age-limit-calculator',
      'negative-marking-calculator',
      'study-timetable-planner',
      'exam-photo-signature-resizer'
    ],
    lastVerifiedDate: 'October 2026',
    dataSource: 'UPSC CSE Official Notification & Rules of Examination',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'upsc-nda',
    slug: 'upsc-nda',
    name: 'UPSC NDA & NA (National Defence Academy)',
    shortName: 'UPSC NDA',
    region: 'india',
    country: 'India',
    authority: 'Union Public Service Commission (UPSC)',
    authorityCategory: 'defence',
    shortDescription: 'Officer cadet entry for Army, Navy, and Air Force wings of the National Defence Academy.',
    officialWebsiteUrl: 'https://upsc.gov.in',
    qualificationRequirements: 'Army Wing: 12th Class pass. Air Force and Navy Wings: 12th Class pass with Physics, Chemistry, and Mathematics.',
    minAge: 16.5,
    maxAge: 19.5,
    ageReferenceDate: 'Candidates must be unmarried and born within specified notification date window (exact 16.5 to 19.5 years)',
    ageRelaxation: [
      { category: 'All Categories', relaxationYears: 0, description: 'No category age relaxation applies for NDA entry.' }
    ],
    markingScheme: {
      totalQuestions: 270,
      totalMarks: 900,
      positivePerCorrect: 2.5, // Mathematics (+2.5, -0.83), GAT (+4, -1.33)
      negativePerIncorrect: 0.833,
      durationMinutes: 300,
      sections: [
        { name: 'Mathematics', questions: 120, marks: 300 },
        { name: 'General Ability Test (GAT)', questions: 150, marks: 600 }
      ]
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'UPSC NDA Official Notification',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'upsc-cds',
    slug: 'upsc-cds',
    name: 'UPSC CDS (Combined Defence Services)',
    shortName: 'UPSC CDS',
    region: 'india',
    country: 'India',
    authority: 'Union Public Service Commission (UPSC)',
    authorityCategory: 'defence',
    shortDescription: 'Commissioned Officer recruitment for IMA, INA, Air Force Academy, and OTA.',
    officialWebsiteUrl: 'https://upsc.gov.in',
    qualificationRequirements: 'IMA/OTA: Degree. INA: Engineering Degree. AFA: Degree with Physics & Math at 10+2 or Bachelor of Engineering.',
    minAge: 19,
    maxAge: 24, // OTA up to 25
    ageReferenceDate: 'Per notification course commencement date',
    ageRelaxation: [{ category: 'General', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 300,
      totalMarks: 300,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.333,
      durationMinutes: 360
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'UPSC CDS Notification',
    notificationYear: '2025-2026',
    status: 'verified'
  },

  // ==========================================
  // INDIA — BANKING (IBPS, SBI, RBI)
  // ==========================================
  {
    id: 'ibps-po',
    slug: 'ibps-po',
    name: 'IBPS PO (Probationary Officer / Management Trainee)',
    shortName: 'IBPS PO',
    region: 'india',
    country: 'India',
    authority: 'Institute of Banking Personnel Selection (IBPS)',
    authorityCategory: 'banking',
    shortDescription: 'Probationary Officer recruitment across participating public sector commercial banks in India.',
    officialWebsiteUrl: 'https://ibps.in',
    qualificationRequirements: 'Graduation in any discipline from a recognized University.',
    minAge: 20,
    maxAge: 30,
    ageReferenceDate: 'August 1 of notification year',
    ageRelaxation: [
      { category: 'OBC (Non-Creamy Layer)', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD', relaxationYears: 10 },
      { category: 'Ex-Servicemen', relaxationYears: 5 }
    ],
    attemptsRestrictions: 'No restriction on number of attempts for Prelims.',
    markingScheme: {
      totalQuestions: 100,
      totalMarks: 100,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.25,
      durationMinutes: 60,
      sections: [
        { name: 'English Language', questions: 30, marks: 30 },
        { name: 'Quantitative Aptitude', questions: 35, marks: 35 },
        { name: 'Reasoning Ability', questions: 35, marks: 35 }
      ]
    },
    photoRequirements: {
      minKb: 20,
      maxKb: 50,
      dimensionText: '200 x 230 pixels',
      instructions: 'Passport size photograph against light background.'
    },
    signatureRequirements: {
      minKb: 10,
      maxKb: 20,
      dimensionText: '140 x 60 pixels',
      instructions: 'Sign on white paper with black ink.'
    },
    relatedTools: [
      'exam-eligibility-checker',
      'age-limit-calculator',
      'negative-marking-calculator',
      'exam-photo-signature-resizer',
      'in-hand-salary-estimator'
    ],
    lastVerifiedDate: 'October 2026',
    dataSource: 'IBPS CRP PO/MT Official Advertisement',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'sbi-po',
    slug: 'sbi-po',
    name: 'SBI PO (State Bank of India Probationary Officer)',
    shortName: 'SBI PO',
    region: 'india',
    country: 'India',
    authority: 'State Bank of India (SBI)',
    authorityCategory: 'banking',
    shortDescription: 'Premium banking officer recruitment for State Bank of India branches across the country and abroad.',
    officialWebsiteUrl: 'https://sbi.co.in/careers',
    qualificationRequirements: 'Graduation in any discipline. Final year/semester students can apply provisionally.',
    minAge: 21,
    maxAge: 30,
    ageReferenceDate: 'April 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwD (Gen/EWS)', relaxationYears: 10 }
    ],
    attemptsRestrictions: 'General/EWS: 4 attempts. General (PwD) / OBC: 7 attempts. SC/ST: No restriction.',
    markingScheme: {
      totalQuestions: 100,
      totalMarks: 100,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.25,
      durationMinutes: 60
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator', 'in-hand-salary-estimator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'SBI Official Recruitment Notice',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'rbi-grade-b',
    slug: 'rbi-grade-b',
    name: 'RBI Grade B Officer (General / DEPR / DSIM)',
    shortName: 'RBI Grade B',
    region: 'india',
    country: 'India',
    authority: 'Reserve Bank of India (RBI)',
    authorityCategory: 'banking',
    shortDescription: "India's central bank managerial entry into economic policy, monetary supervision, and banking operations.",
    officialWebsiteUrl: 'https://rbi.org.in',
    qualificationRequirements: 'Graduation in any discipline with minimum 60% marks (50% for SC/ST/PwBD) or Post-Graduation with 55%.',
    minAge: 21,
    maxAge: 30, // M.Phil/Ph.D candidates up to 32/34
    ageReferenceDate: 'July 1 of notification year',
    ageRelaxation: [
      { category: 'OBC', relaxationYears: 3 },
      { category: 'SC/ST', relaxationYears: 5 },
      { category: 'PwBD', relaxationYears: 10 }
    ],
    attemptsRestrictions: 'General Category candidates who have appeared in Phase-I exam 6 times are not eligible.',
    markingScheme: {
      totalQuestions: 200,
      totalMarks: 200,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.25,
      durationMinutes: 120
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'negative-marking-calculator', 'in-hand-salary-estimator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'RBI Services Board Official Notification',
    notificationYear: '2025-2026',
    status: 'verified'
  },

  // ==========================================
  // INDIA — TEACHING & ENTRANCE EXAMINATIONS
  // ==========================================
  {
    id: 'ctet',
    slug: 'ctet',
    name: 'CTET (Central Teacher Eligibility Test)',
    shortName: 'CTET',
    region: 'india',
    country: 'India',
    authority: 'Central Board of Secondary Education (CBSE)',
    authorityCategory: 'teaching',
    shortDescription: 'National benchmark eligibility test for teachers in Kendriya Vidyalayas, Navodaya, and central schools.',
    officialWebsiteUrl: 'https://ctet.nic.in',
    qualificationRequirements: 'Paper 1 (Class I-V): Senior Secondary with 50% marks + 2-year D.El.Ed / 4-year B.El.Ed. Paper 2 (Class VI-VIII): Graduation + 2-year D.El.Ed or B.Ed.',
    minAge: 18,
    maxAge: 99, // No upper age limit
    ageReferenceDate: 'No upper age limit prescribed by CBSE',
    ageRelaxation: [{ category: 'All', relaxationYears: 0, description: 'No upper age restriction.' }],
    markingScheme: {
      totalQuestions: 150,
      totalMarks: 150,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0, // No negative marking
      durationMinutes: 150
    },
    photoRequirements: {
      minKb: 10,
      maxKb: 100,
      dimensionText: '3.5 x 4.5 cm',
      instructions: 'Recent color photo on white background.'
    },
    relatedTools: ['exam-eligibility-checker', 'negative-marking-calculator', 'exam-photo-signature-resizer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'CBSE CTET Information Bulletin',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'jee-main',
    slug: 'jee-main',
    name: 'JEE Main (Joint Entrance Examination)',
    shortName: 'JEE Main',
    region: 'india',
    country: 'India',
    authority: 'National Testing Agency (NTA)',
    authorityCategory: 'engineering',
    shortDescription: 'All-India engineering entrance test for admissions to NITs, IIITs, CFTIs, and qualifying test for JEE Advanced.',
    officialWebsiteUrl: 'https://jeemain.nta.nic.in',
    qualificationRequirements: 'Candidates should have passed 12th/equivalent examination with Physics, Mathematics, and one of Chemistry/Biology/Technical Vocational subjects.',
    minAge: 16,
    maxAge: 99, // No age limit, but limited to 3 consecutive years from 12th pass
    ageReferenceDate: 'No age limit per NTA rules',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 75,
      totalMarks: 300,
      positivePerCorrect: 4.0,
      negativePerIncorrect: 1.0,
      durationMinutes: 180,
      sections: [
        { name: 'Physics (20 MCQs + 5 NVQs)', questions: 25, marks: 100 },
        { name: 'Chemistry (20 MCQs + 5 NVQs)', questions: 25, marks: 100 },
        { name: 'Mathematics (20 MCQs + 5 NVQs)', questions: 25, marks: 100 }
      ]
    },
    photoRequirements: {
      minKb: 10,
      maxKb: 200,
      dimensionText: '3.5 x 4.5 cm',
      instructions: 'White background, 80% face coverage showing ears without mask.'
    },
    signatureRequirements: {
      minKb: 4,
      maxKb: 30,
      dimensionText: '3.5 x 1.5 cm',
      instructions: 'Running handwriting on white paper.'
    },
    relatedTools: ['negative-marking-calculator', 'exam-photo-signature-resizer', 'study-timetable-planner'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'NTA JEE Main Information Bulletin',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'neet-ug',
    slug: 'neet-ug',
    name: 'NEET UG (National Eligibility cum Entrance Test)',
    shortName: 'NEET UG',
    region: 'india',
    country: 'India',
    authority: 'National Testing Agency (NTA)',
    authorityCategory: 'medical',
    shortDescription: 'National single medical undergraduate entrance examination for MBBS, BDS, BAMS, BHMS, and nursing admissions.',
    officialWebsiteUrl: 'https://neet.nta.nic.in',
    qualificationRequirements: '10+2 or equivalent with Physics, Chemistry, Biology/Biotechnology, and English as core subjects.',
    minAge: 17,
    maxAge: 99, // Upper age limit removed by NMC
    ageReferenceDate: 'December 31 of admission year (minimum 17 years completed)',
    ageRelaxation: [{ category: 'All', relaxationYears: 0, description: 'No upper age limit for NEET UG.' }],
    markingScheme: {
      totalQuestions: 180,
      totalMarks: 720,
      positivePerCorrect: 4.0,
      negativePerIncorrect: 1.0,
      durationMinutes: 200,
      sections: [
        { name: 'Physics', questions: 45, marks: 180 },
        { name: 'Chemistry', questions: 45, marks: 180 },
        { name: 'Biology (Botany & Zoology)', questions: 90, marks: 360 }
      ]
    },
    photoRequirements: {
      minKb: 10,
      maxKb: 200,
      dimensionText: 'Passport & Postcard (4x6 inch) formats',
      instructions: 'White background with name and date of photo taken clearly visible.'
    },
    relatedTools: ['negative-marking-calculator', 'exam-photo-signature-resizer', 'study-timetable-planner'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'National Medical Commission & NTA NEET Information Bulletin',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'gate',
    slug: 'gate',
    name: 'GATE (Graduate Aptitude Test in Engineering)',
    shortName: 'GATE',
    region: 'india',
    country: 'India',
    authority: 'Indian Institute of Science & IITs',
    authorityCategory: 'engineering',
    shortDescription: 'National postgraduate entrance and PSU engineering officer recruitment test.',
    officialWebsiteUrl: 'https://gate.iisc.ac.in',
    qualificationRequirements: "Bachelor's degree in Engineering/Technology or Master's degree in any relevant science subject. Final year students eligible.",
    minAge: 20,
    maxAge: 99,
    ageReferenceDate: 'No age limit for GATE',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 65,
      totalMarks: 100,
      positivePerCorrect: 1.0, // 1-mark & 2-mark questions
      negativePerIncorrect: 0.333, // 1/3rd for 1-mark, 2/3rd for 2-mark (MCQs only)
      durationMinutes: 180
    },
    relatedTools: ['negative-marking-calculator', 'exam-photo-signature-resizer', 'in-hand-salary-estimator'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'GATE Organizing Institute Information Brochure',
    notificationYear: '2025-2026',
    status: 'verified'
  },

  // ==========================================
  // FOREIGN / INTERNATIONAL EXAMINATIONS
  // ==========================================
  {
    id: 'ielts',
    slug: 'ielts',
    name: 'IELTS (International English Language Testing System)',
    shortName: 'IELTS',
    region: 'international',
    country: 'International',
    authority: 'British Council, IDP: IELTS Australia, Cambridge English',
    authorityCategory: 'international-english',
    shortDescription: 'Global standard English language proficiency examination for international education, immigration, and professional accreditation.',
    officialWebsiteUrl: 'https://www.ielts.org',
    qualificationRequirements: 'Open to all candidates; recommended minimum age is 16 years. Valid passport required for test booking.',
    minAge: 16,
    maxAge: 99,
    ageReferenceDate: 'Recommended age 16+ years',
    ageRelaxation: [{ category: 'General', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 40, // per Listening and Reading section
      totalMarks: 9, // Band 1 to 9
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 165,
      sections: [
        { name: 'Listening (40 questions)', questions: 40, marks: 9 },
        { name: 'Reading (40 questions)', questions: 40, marks: 9 },
        { name: 'Writing (2 tasks)', questions: 2, marks: 9 },
        { name: 'Speaking (3 parts interview)', questions: 3, marks: 9 }
      ]
    },
    relatedTools: ['ielts-band-calculator', 'study-timetable-planner', 'exam-accuracy-speed-analyzer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Official IELTS Guide & Scoring Scales (ielts.org)',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'toefl-ibt',
    slug: 'toefl-ibt',
    name: 'TOEFL iBT (Test of English as a Foreign Language)',
    shortName: 'TOEFL',
    region: 'international',
    country: 'International',
    authority: 'Educational Testing Service (ETS)',
    authorityCategory: 'international-english',
    shortDescription: 'University-level English language assessment accepted by over 12,000 institutions across 160+ countries worldwide.',
    officialWebsiteUrl: 'https://www.ets.org/toefl',
    qualificationRequirements: 'Open to all students and professionals. Valid international passport required.',
    minAge: 15,
    maxAge: 99,
    ageReferenceDate: 'Open eligibility',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 60,
      totalMarks: 120, // 0-30 per section
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 116,
      sections: [
        { name: 'Reading', questions: 20, marks: 30 },
        { name: 'Listening', questions: 28, marks: 30 },
        { name: 'Speaking', questions: 4, marks: 30 },
        { name: 'Writing', questions: 2, marks: 30 }
      ]
    },
    relatedTools: ['ielts-band-calculator', 'study-timetable-planner'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'ETS TOEFL iBT Official Bulletin',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'sat',
    slug: 'sat',
    name: 'Digital SAT (Scholastic Assessment Test)',
    shortName: 'SAT',
    region: 'international',
    country: 'United States',
    authority: 'College Board',
    authorityCategory: 'us-admissions',
    shortDescription: 'Standardized college admissions test widely used in the United States and globally for undergraduate entry.',
    officialWebsiteUrl: 'https://satsuite.collegeboard.org',
    qualificationRequirements: 'High school students planning for undergraduate college study.',
    minAge: 13,
    maxAge: 99,
    ageReferenceDate: 'Open eligibility',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 98,
      totalMarks: 1600,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0, // No penalty for wrong answers on Digital SAT
      durationMinutes: 134,
      sections: [
        { name: 'Reading and Writing (2 modules)', questions: 54, marks: 800 },
        { name: 'Math (2 modules)', questions: 44, marks: 800 }
      ]
    },
    relatedTools: ['study-timetable-planner', 'exam-accuracy-speed-analyzer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'College Board Digital SAT Suite Specifications',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'gre',
    slug: 'gre',
    name: 'GRE General Test',
    shortName: 'GRE',
    region: 'international',
    country: 'United States',
    authority: 'Educational Testing Service (ETS)',
    authorityCategory: 'us-admissions',
    shortDescription: 'Standardized assessment for admission to master’s, specialized master’s in business, MBA, and doctoral programs.',
    officialWebsiteUrl: 'https://www.ets.org/gre',
    qualificationRequirements: "Prospective graduate or business school applicants with bachelor's degree.",
    minAge: 18,
    maxAge: 99,
    ageReferenceDate: 'Open eligibility',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 54,
      totalMarks: 340, // 130-170 Verbal, 130-170 Quant + 0-6 Analytical Writing
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 118,
      sections: [
        { name: 'Verbal Reasoning (2 sections)', questions: 27, marks: 170 },
        { name: 'Quantitative Reasoning (2 sections)', questions: 27, marks: 170 },
        { name: 'Analytical Writing (1 essay)', questions: 1, marks: 6 }
      ]
    },
    relatedTools: ['study-timetable-planner', 'exam-accuracy-speed-analyzer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'ETS GRE Shorter General Test Bulletin',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'gmat-focus',
    slug: 'gmat-focus',
    name: 'GMAT Focus Edition',
    shortName: 'GMAT',
    region: 'international',
    country: 'United States',
    authority: 'Graduate Management Admission Council (GMAC)',
    authorityCategory: 'us-admissions',
    shortDescription: 'Standardized exam designed specifically for graduate business and management programs globally.',
    officialWebsiteUrl: 'https://www.mba.com/exams/gmat-focus-edition',
    qualificationRequirements: "Candidates must be at least 18 years of age (13-17 with parental consent) with bachelor's qualification.",
    minAge: 18,
    maxAge: 99,
    ageReferenceDate: 'Open eligibility',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 64,
      totalMarks: 805, // 205-805 scale
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 135,
      sections: [
        { name: 'Quantitative Reasoning', questions: 21, marks: 90 },
        { name: 'Verbal Reasoning', questions: 23, marks: 90 },
        { name: 'Data Insights', questions: 20, marks: 90 }
      ]
    },
    relatedTools: ['study-timetable-planner', 'exam-accuracy-speed-analyzer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'GMAC Official GMAT Focus Specifications',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'uk-university-admissions',
    slug: 'uk-university-admissions',
    name: 'UK University Admissions Tests (UCAT / LNAT)',
    shortName: 'UK Admissions',
    region: 'international',
    country: 'United Kingdom',
    authority: 'University Consortiums / Pearson VUE',
    authorityCategory: 'uk-admissions',
    shortDescription: 'Clinical Aptitude (UCAT) and National Law Admissions Tests (LNAT) for entry into UK universities.',
    officialWebsiteUrl: 'https://www.ucat.ac.uk',
    qualificationRequirements: 'High school or university graduates applying for medical, dental, or law programs in the UK.',
    minAge: 16,
    maxAge: 99,
    ageReferenceDate: 'Open eligibility',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 228,
      totalMarks: 3600,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 120
    },
    relatedTools: ['study-timetable-planner', 'exam-accuracy-speed-analyzer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'UCAT Official Consortium Guide',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'canada-public-service',
    slug: 'canada-public-service',
    name: 'Public Service Commission of Canada Tests (PCO / PSC)',
    shortName: 'Canada PSC',
    region: 'international',
    country: 'Canada',
    authority: 'Public Service Commission of Canada',
    authorityCategory: 'other',
    shortDescription: 'General Competency and Written Communication assessments for federal public service appointments in Canada.',
    officialWebsiteUrl: 'https://www.canada.ca/en/public-service-commission.html',
    qualificationRequirements: 'Canadian citizens or permanent residents with secondary school diploma or degree based on post requirements.',
    minAge: 18,
    maxAge: 65,
    ageReferenceDate: 'Per government recruitment policy',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 50,
      totalMarks: 50,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 90
    },
    relatedTools: ['exam-eligibility-checker', 'age-limit-calculator', 'job-qualification-matcher'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'Public Service Commission of Canada Portal',
    notificationYear: '2025-2026',
    status: 'verified'
  },
  {
    id: 'australia-admissions',
    slug: 'australia-admissions',
    name: 'Australia University Admissions (STAT & GAMSAT)',
    shortName: 'Australia STAT',
    region: 'international',
    country: 'Australia',
    authority: 'Australian Council for Educational Research (ACER)',
    authorityCategory: 'other',
    shortDescription: 'Special Tertiary Admissions Test (STAT) assessing verbal and quantitative reasoning for Australian universities.',
    officialWebsiteUrl: 'https://stat.acer.org',
    qualificationRequirements: 'Mature age students or applicants lacking standard Australian Year 12 ATAR score.',
    minAge: 17,
    maxAge: 99,
    ageReferenceDate: 'Open eligibility',
    ageRelaxation: [{ category: 'All', relaxationYears: 0 }],
    markingScheme: {
      totalQuestions: 70,
      totalMarks: 200,
      positivePerCorrect: 1.0,
      negativePerIncorrect: 0.0,
      durationMinutes: 120
    },
    relatedTools: ['study-timetable-planner', 'exam-accuracy-speed-analyzer'],
    lastVerifiedDate: 'October 2026',
    dataSource: 'ACER Official Candidate Guide',
    notificationYear: '2025-2026',
    status: 'verified'
  }
];

export function getExamById(id: string): ExamItem | undefined {
  return EXAMS_REGISTRY.find((e) => e.id === id || e.slug === id);
}

export function getExamsByRegion(region: 'india' | 'international'): ExamItem[] {
  return EXAMS_REGISTRY.filter((e) => e.region === region);
}

export function getExamsByCountry(country: string): ExamItem[] {
  return EXAMS_REGISTRY.filter((e) => e.country.toLowerCase() === country.toLowerCase());
}

export function getExamsByAuthorityCategory(category: string): ExamItem[] {
  return EXAMS_REGISTRY.filter((e) => e.authorityCategory === category);
}
