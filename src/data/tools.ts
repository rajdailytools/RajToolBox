import { ToolItem } from '../types';

export const TOOLS_REGISTRY: ToolItem[] = [
  // PDF TOOLS
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf-tools',
    shortDescription: 'Combine multiple PDF files into one clean document directly in your browser without uploading to any server.',
    fullDescription: 'PDF Merger allows you to combine two or more PDF files into a single continuous document. All file processing happens completely client-side in your web browser using WebAssembly and canvas technologies, ensuring 100% data privacy.',
    iconName: 'Combine',
    keywords: ['merge pdf', 'combine pdf', 'join pdf documents', 'pdf binder'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Upload PDFs', instruction: 'Select or drag & drop two or more PDF files into the upload area.' },
      { step: 2, title: 'Arrange Order', instruction: 'Review the list of files and verify their sequence.' },
      { step: 3, title: 'Merge', instruction: 'Click the "Merge PDFs" button to initiate browser-side compilation.' },
      { step: 4, title: 'Download', instruction: 'Click "Download Merged PDF" to save the consolidated file immediately.' }
    ],
    realLifeExample: {
      title: 'Merging Quarterly Financial Statements',
      inputDescription: 'Report_Part1.pdf (4 pages) + Appendix.pdf (2 pages)',
      outputDescription: 'Consolidated_Report.pdf (6 pages total, ordered correctly)',
      details: [
        { label: 'Input 1', value: 'Quarterly_Summary.pdf' },
        { label: 'Input 2', value: 'Balance_Sheet.pdf' },
        { label: 'Result', value: 'Complete_Quarterly_Filing.pdf' }
      ]
    },
    howItWorks: 'The tool uses the browser-native FileReader API and client-side PDF binary parsing to read each page stream and copy them sequentially into a new PDF document structure.',
    faqs: [
      { question: 'Is it safe to merge confidential documents here?', answer: 'Yes. Files never leave your device. The entire merge process takes place in your browser memory.' },
      { question: 'Is there a limit on how many files I can merge?', answer: 'You can merge as many files as your device memory comfortably allows, typically dozens of files.' },
      { question: 'Does merging compress or reduce document quality?', answer: 'No, vector text, high-resolution images, and embedded fonts are retained with original fidelity.' }
    ],
    relatedToolSlugs: ['pdf-splitter', 'image-to-pdf', 'pdf-watermark', 'pdf-metadata-viewer']
  },
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf-tools',
    shortDescription: 'Reduce PDF file size locally in your browser to fit job portals, email attachments, and online submission forms.',
    fullDescription: 'Compress large PDF documents, scanned bills, portfolios, and reports without server uploads. Uses client-side stream optimization to reconstruct object tables and strip redundant metadata while keeping text crisp.',
    iconName: 'FileText',
    keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor', 'pdf under 1mb', 'pdf under 500kb', 'pdf under 200kb', 'pdf under 100kb', 'shrink pdf', 'downsize pdf', 'pdf compressor 11zon', 'compress pdf online free'],
    popular: true,
    featured: true,
    aliases: ['pdf size reducer', 'pdf downscaler', 'pdf shrinker', 'pdf optimizer', 'online pdf compressor'],
    useCases: ['government exam application uploads', 'job portal document upload', 'scholarship portal documents', 'email attachment size reduction', 'mobile cellular sharing'],
    problemPhrases: ['pdf is too large', 'file exceeds 2mb limit', 'cannot upload pdf to portal', 'make pdf smaller', 'pdf file size exceeds 200kb'],
    intentPhrases: ['pdf under 100kb', 'pdf under 200kb', 'pdf under 300kb', 'pdf under 500kb', 'pdf under 1mb', 'pdf under 2mb', 'compress my pdf'],
    hinglishPhrases: ['pdf chota karna hai', 'pdf size kam karna', 'pdf file choti karni', 'pdf mb kam kaise kare', 'pdf compress kaise kare'],
    targetSizes: ['20 KB', '30 KB', '40 KB', '50 KB', '100 KB', '200 KB', '300 KB', '500 KB', '1 MB', '2 MB', '5 MB'],
    presets: [
      { name: 'UPSC / SSC Govt Portal (~200 KB)', description: 'Optimized for online civil service, recruitment, and admission portals' },
      { name: 'Standard Email (~1 MB)', description: 'Ideal for Gmail, Outlook, and corporate email attachments' },
      { name: 'Job Portals (~500 KB)', description: 'Recommended for LinkedIn, Naukri, and ATS resume uploads' },
      { name: 'Light Clean', description: 'Removes redundant metadata while preserving 100% vector fidelity' }
    ],
    nextSteps: [
      { slug: 'pdf-merger', label: 'Merge with Other PDFs', reason: 'Need to combine this compressed document with other files?' },
      { slug: 'pdf-watermark', label: 'Add Watermark', reason: 'Stamp confidential or verified mark before sending?' }
    ],
    howToSteps: [
      { step: 1, title: 'Upload PDF Documents', instruction: 'Select or drag & drop single or multiple PDF files into the upload box.' },
      { step: 2, title: 'Choose Compression Mode', instruction: 'Select Basic, Recommended, Strong, or Target Size (e.g. 100KB, 200KB, 500KB).' },
      { step: 3, title: 'Compress', instruction: 'Click "Compress PDF Now" to execute 100% private in-browser optimization.' },
      { step: 4, title: 'Preview & Download', instruction: 'Inspect the document in the live preview and download your reduced PDF.' }
    ],
    realLifeExample: {
      title: 'Compressing a 4.2 MB Scanned Contract for Email',
      inputDescription: 'Annual_Contract_Scanned.pdf (4.2 MB, 600 DPI scan)',
      outputDescription: 'Annual_Contract_Scanned_compressed.pdf (820 KB, 80.5% space saved)',
      details: [
        { label: 'Original Size', value: '4.2 MB' },
        { label: 'Compressed Output', value: '820 KB' },
        { label: 'Storage Saved', value: '80.5%' }
      ]
    },
    howItWorks: 'Rebuilds PDF indirect object streams, strips orphaned cross-reference tables, and re-encodes embedded image streams using WebAssembly stream decoders.',
    faqs: [
      { question: 'What is a PDF compressor?', answer: 'A PDF compressor is a specialized utility that analyzes the internal structure of a PDF document—including cross-reference tables, indirect object streams, font subsets, and image dictionaries—and restructures them to occupy significantly fewer bytes while preserving document readability.' },
      { question: 'How can I reduce PDF size?', answer: 'Upload your document to RajToolBox PDF Compressor, select your desired compression level (Recommended, Strong, or Target Size), click Compress, preview the result, and download your optimized document.' },
      { question: 'Can I compress PDF online for free?', answer: 'Yes. RajToolBox PDF Compressor is 100% free with no subscriptions, watermarks, page limits, or file caps. You can compress as many documents as needed.' },
      { question: 'Can I compress PDF to 100KB?', answer: 'Yes. Select "Target Size" mode and choose the "100 KB" preset. For 1-to-3 page documents, the compressor effectively compacts stream dictionaries to reach 100 KB for scholarship and exam portals.' },
      { question: 'Can I compress PDF to 200KB?', answer: 'Yes. 200 KB is the standard requirement for UPSC, SSC, and state PSC job application portals. Select the "200 KB" preset for fast, reliable compression.' },
      { question: 'Can I compress PDF to 300KB?', answer: 'Yes. Choose the "300 KB" preset, commonly required by banking KYC portals and insurance claim submission websites.' },
      { question: 'Can I compress PDF to 1MB?', answer: 'Yes. The 1 MB preset is ideal for college admissions, academic project submissions, and professional email attachments.' },
      { question: 'Can I compress PDF to 2MB?', answer: 'Yes. 2 MB is the standard upload ceiling for LinkedIn, Indeed, Naukri, and corporate HR portal resume submissions.' },
      { question: 'Can I compress PDF to 5MB?', answer: 'Yes. Select the 5 MB preset for large documents, reports, and portfolios to ensure they stay well under corporate email server limits.' },
      { question: 'How do I compress PDF without losing quality?', answer: 'Choose "Basic / Light" or "Recommended" mode. These modes compact structural PDF tables and strip redundant XML metadata while retaining 100% vector font sharpness and high image fidelity.' },
      { question: 'Why does my PDF remain large after compression?', answer: 'If a PDF consists of dozens of 600-DPI full-color scanned pages or was already pre-compressed by high-end scanner software, further reduction without downsampling images is mathematically constrained.' },
      { question: 'Can I compress a scanned PDF?', answer: 'Yes. Scanned PDFs typically show the largest byte reduction because uncompressed scanner bitmaps can be compacted significantly.' },
      { question: 'Can I compress multiple PDFs at once?', answer: 'Yes. RajToolBox fully supports bulk compression. Click "+ Add More Files" to queue multiple PDFs, compress all simultaneously, and download each result.' },
      { question: 'Can I compress a large PDF (50 MB or 100 MB)?', answer: 'Yes. Modern devices with current versions of Chrome, Safari, or Edge handle large documents directly in browser memory without issue.' },
      { question: 'Can I preview the compressed PDF before downloading?', answer: 'Yes. A full in-browser PDF preview is generated immediately after compression so you can inspect text readability and page layouts before saving.' },
      { question: 'Is PDF compression safe on RajToolBox?', answer: 'Completely safe. Unlike cloud-based converters that upload your confidential documents to external servers, RajToolBox processes everything locally inside your device browser.' },
      { question: 'Are my PDF files uploaded to a server?', answer: 'Never. All PDF reading, stream optimization, and compression algorithms execute client-side via JavaScript and WebAssembly in your browser memory.' },
      { question: 'Can I compress a password-protected PDF?', answer: 'Encrypted PDFs must be unlocked before compression because security wrappers lock indirect object syntax.' },
      { question: 'Can I compress a digitally signed PDF?', answer: 'You should avoid compressing digitally signed PDFs. Modifying document byte streams invalidates cryptographic digital signature checksums.' },
      { question: 'Why did my PDF quality become blurry with another tool?', answer: 'Aggressive tools downsample images to 72 DPI or heavy JPEG compression. RajToolBox Recommended mode preserves vector fonts and balances visual clarity.' },
      { question: 'Can I compress PDF on mobile?', answer: 'Yes. The interface is optimized for iPhone, iPad, and Android mobile browsers with touch-friendly controls and responsive file handling.' },
      { question: 'Can I share the compressed PDF directly?', answer: 'Yes. Use the built-in Native Share button on mobile, or share directly via WhatsApp, Telegram, and Email shortcuts.' },
      { question: 'Can I use WhatsApp to share the compressed PDF?', answer: 'Yes. Click the WhatsApp share icon to share the tool or link directly with colleagues or clients.' },
      { question: 'What happens if the target size cannot be reached?', answer: 'RajToolBox provides an honest status: it compacts the file to the lowest technically possible size without destroying legibility and displays "Best effort reached".' },
      { question: 'Should I keep the original PDF?', answer: 'Always retain your original document as a master archival copy, especially for legal contracts, certificates, and archival records.' }
    ],
    relatedToolSlugs: ['pdf-merger', 'pdf-splitter', 'image-to-pdf', 'pdf-watermark']
  },
  {
    id: 'pdf-splitter',
    slug: 'pdf-splitter',
    name: 'PDF Splitter & Page Extractor',
    category: 'pdf-tools',
    shortDescription: 'Split a PDF into individual pages or extract specific page ranges securely in your browser.',
    fullDescription: 'PDF Splitter lets you extract specific pages, page ranges (e.g. 1-3, 5), or divide a multipage PDF into distinct documents with zero cloud exposure.',
    iconName: 'Split',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Upload PDF', instruction: 'Choose the PDF you wish to split or extract pages from.' },
      { step: 2, title: 'Specify Pages', instruction: 'Enter the page numbers or ranges you wish to extract (e.g., 1-2, 4).' },
      { step: 3, title: 'Process', instruction: 'Click "Extract Pages" to generate your targeted document.' },
      { step: 4, title: 'Download', instruction: 'Download your newly extracted PDF.' }
    ],
    realLifeExample: {
      title: 'Extracting Invoice from 20-Page Contract',
      inputDescription: 'Contract_2026.pdf (Pages 1–20), user requests page 18 only.',
      outputDescription: 'Contract_Invoice_p18.pdf (1 page)',
      details: [
        { label: 'Source Document', value: 'Annual_Contract.pdf (20 pages)' },
        { label: 'Extracted Page', value: 'Page 18' },
        { label: 'Result', value: 'Invoice_Only.pdf (1 page)' }
      ]
    },
    howItWorks: 'The tool parses the PDF catalog, traverses the page tree to the selected indices, and isolates the content streams into a fresh PDF file.',
    faqs: [
      { question: 'Can I extract non-consecutive pages?', answer: 'Yes, you can enter comma-separated numbers like 1, 3, 5-7 to extract specific selections.' },
      { question: 'Does extracting pages delete them from my original file?', answer: 'No, your original file on your computer remains completely untouched.' }
    ],
    relatedToolSlugs: ['pdf-merger', 'pdf-watermark', 'image-to-pdf']
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter',
    category: 'pdf-tools',
    shortDescription: 'Convert PNG, JPG, JPEG, and WebP images into a clean, printable PDF document instantly.',
    fullDescription: 'Convert any photo, scanned document, receipt, or screenshot into a high-quality PDF. Fits images seamlessly onto standard pages or maintains their native aspect ratios.',
    iconName: 'FileImage',
    keywords: ['jpg to pdf', 'png to pdf', 'images to pdf', 'convert photo to pdf'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Select Images', instruction: 'Upload one or multiple images (JPG, PNG, WebP).' },
      { step: 2, title: 'Configure Layout', instruction: 'Choose page orientation (portrait or auto-fit).' },
      { step: 3, title: 'Generate PDF', instruction: 'Click "Convert to PDF" to compile the images into a document.' },
      { step: 4, title: 'Download', instruction: 'Download your ready-to-print PDF file.' }
    ],
    realLifeExample: {
      title: 'Creating a PDF from Scanned Receipt Photos',
      inputDescription: 'receipt1.jpg and receipt2.jpg captured on smartphone.',
      outputDescription: 'Receipts_Compiled.pdf with 2 pages formatted for printing.',
      details: [
        { label: 'Input Images', value: '2 JPEG files' },
        { label: 'Output File', value: 'Expense_Receipts.pdf' }
      ]
    },
    howItWorks: 'Image binary data is embedded as JPEG/PNG raster XObjects in an isolated PDF page canvas with calculated bounding box metrics.',
    faqs: [
      { question: 'Can I combine multiple photos into one PDF?', answer: 'Yes, you can upload multiple images and they will each become a page in the output PDF.' },
      { question: 'Is my photo resolution reduced?', answer: 'No, native pixel density is maintained so printed text remains sharp.' }
    ],
    relatedToolSlugs: ['pdf-merger', 'image-compressor', 'image-format-converter']
  },
  {
    id: 'pdf-watermark',
    slug: 'pdf-watermark',
    name: 'PDF Watermark Tool',
    category: 'pdf-tools',
    shortDescription: 'Add custom text watermarks, confidential stamps, or copyright notices across your PDF pages.',
    fullDescription: 'Apply clear, customizable text stamps such as "CONFIDENTIAL", "DRAFT", or your company name across every page of your PDF with custom opacity and font sizes.',
    iconName: 'Stamp',
    keywords: ['pdf watermark', 'stamp pdf', 'confidential watermark', 'add text to pdf'],
    howToSteps: [
      { step: 1, title: 'Upload PDF', instruction: 'Select the PDF file you wish to protect with a watermark.' },
      { step: 2, title: 'Enter Text', instruction: 'Type your custom watermark text (e.g., CONFIDENTIAL, DRAFT).' },
      { step: 3, title: 'Adjust Styling', instruction: 'Set the font size, opacity, and rotation angle.' },
      { step: 4, title: 'Apply & Download', instruction: 'Apply the watermark and download your stamped PDF.' }
    ],
    realLifeExample: {
      title: 'Marking a Draft Proposal',
      inputDescription: 'Client_Proposal_v1.pdf without markings.',
      outputDescription: 'Client_Proposal_v1_stamped.pdf with diagonal "DRAFT - DO NOT SHARE" text on each page.',
      details: [
        { label: 'Watermark Text', value: 'CONFIDENTIAL' },
        { label: 'Angle', value: '45 degrees' },
        { label: 'Opacity', value: '30%' }
      ]
    },
    howItWorks: 'Draws a semi-transparent text stream directly over each page viewport coordinates before serializing the PDF buffer.',
    faqs: [
      { question: 'Will the watermark obstruct readable text?', answer: 'You can adjust opacity so underlying document text remains legible while clearly displaying the stamp.' }
    ],
    relatedToolSlugs: ['pdf-merger', 'pdf-splitter', 'pdf-metadata-viewer']
  },
  {
    id: 'pdf-metadata-viewer',
    slug: 'pdf-metadata-viewer',
    name: 'PDF Metadata Viewer',
    category: 'pdf-tools',
    shortDescription: 'Inspect document properties, title, author, creation date, and total page count inside any PDF.',
    fullDescription: 'Inspect underlying metadata tags stored in PDF files including Creator, Producer, Creation Date, Modification Date, and Page Count.',
    iconName: 'Info',
    keywords: ['pdf metadata', 'pdf info', 'inspect pdf', 'view pdf properties'],
    howToSteps: [
      { step: 1, title: 'Choose PDF', instruction: 'Select a PDF file to analyze.' },
      { step: 2, title: 'Inspect Metadata', instruction: 'Instantly view document properties, dimensions, page count, and title tags.' }
    ],
    realLifeExample: {
      title: 'Verifying PDF Creator & Timestamps',
      inputDescription: 'Document.pdf generated by office software.',
      outputDescription: 'Title: Product Manual, Author: Raj Sengar, Pages: 12, Producer: PDF-Lib.',
      details: [
        { label: 'Title', value: 'Project Whitepaper' },
        { label: 'Page Count', value: '14' }
      ]
    },
    howItWorks: 'Extracts the Info dictionary and catalog trailer from the PDF header to read core metadata entries without uploading.',
    faqs: [
      { question: 'Can I copy the inspected metadata?', answer: 'Yes, a one-click copy button lets you copy all metadata as structured text.' }
    ],
    relatedToolSlugs: ['pdf-merger', 'pdf-splitter']
  },

  // IMAGE TOOLS
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image-tools',
    shortDescription: 'Reduce image file size with adjustable quality slider while preserving crisp visual clarity.',
    fullDescription: 'Compress JPEG, PNG, and WebP images directly on your machine. Fine-tune the compression quality percentage to dramatically shrink file sizes for web, email, or upload forms.',
    iconName: 'Minimize2',
    keywords: ['image compressor', 'compress jpg', 'reduce photo size', 'shrink png', 'optimize image'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Upload Image', instruction: 'Select or drag & drop any JPG, PNG, or WebP photo.' },
      { step: 2, title: 'Adjust Quality', instruction: 'Use the interactive quality slider (e.g. 70% - 90%).' },
      { step: 3, title: 'Compare Size', instruction: 'Check the real-time calculated savings and compressed file size.' },
      { step: 4, title: 'Download', instruction: 'Download your compressed image with one click.' }
    ],
    realLifeExample: {
      title: 'Compressing a 4MB Camera Photo for Email',
      inputDescription: 'Landscape_DSC0192.jpg (3,850 KB, 100% quality)',
      outputDescription: 'Landscape_compressed.jpg (640 KB, 80% quality, 83% size reduction)',
      details: [
        { label: 'Original Size', value: '3.85 MB' },
        { label: 'Compressed Size', value: '640 KB' },
        { label: 'Savings', value: '83.4%' }
      ]
    },
    howItWorks: 'Uses HTML5 Canvas API and browser-accelerated 2D rendering to re-quantize pixel arrays at specified lossy compression quality ratios.',
    formula: {
      title: 'Compression Savings Formula',
      formula: 'Savings (\\%) = \\frac{\\text{Original Size} - \\text{Compressed Size}}{\\text{Original Size}} \\times 100',
      variables: [
        { symbol: 'Original Size', meaning: 'Initial file size in bytes' },
        { symbol: 'Compressed Size', meaning: 'Resulting file size in bytes' }
      ],
      explanation: 'Determines the exact percentage of storage space saved through lossy quantization.',
      workedExample: 'Original: 2,000 KB, Compressed: 500 KB => (2000 - 500) / 2000 * 100 = 75% savings.'
    },
    faqs: [
      { question: 'Will compression make my image blurry?', answer: 'At 75-85% quality, the visual difference is virtually imperceptible to the human eye while saving 60-80% file size.' },
      { question: 'Are files sent to any server?', answer: 'Never. The compression algorithm executes locally on your device hardware.' }
    ],
    relatedToolSlugs: ['image-resizer', 'image-format-converter', 'image-cropper', 'favicon-generator']
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image-tools',
    shortDescription: 'Resize photos to exact width and height pixels or percentages with aspect ratio lock.',
    fullDescription: 'Fast, accurate image resizing tool with aspect ratio preservation, custom dimensions, preset social media resolutions, and high quality bilinear interpolation.',
    iconName: 'Maximize2',
    keywords: ['resize image', 'photo resizer', 'change image dimensions', 'scale photo'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Upload Image', instruction: 'Choose the picture you need to resize.' },
      { step: 2, title: 'Set Dimensions', instruction: 'Enter target width and height in pixels or select a preset.' },
      { step: 3, title: 'Keep Aspect Ratio', instruction: 'Toggle the aspect ratio lock so proportions stay natural.' },
      { step: 4, title: 'Resize & Download', instruction: 'Click "Resize Image" and download the resized file.' }
    ],
    realLifeExample: {
      title: 'Resizing High-Res Banner for Website Hero',
      inputDescription: 'Original dimensions: 4000 × 2250 px',
      outputDescription: 'Resized dimensions: 1200 × 675 px (aspect ratio 16:9 maintained)',
      details: [
        { label: 'Original', value: '4000 × 2250 px' },
        { label: 'Target', value: '1200 × 675 px' },
        { label: 'Scale Factor', value: '0.30x' }
      ]
    },
    howItWorks: 'Draws the input raster bitmap onto an off-screen HTML5 canvas element configured to the target dimensions using bicubic smoothing.',
    faqs: [
      { question: 'Does resizing distort my image?', answer: 'Not if you keep the "Lock Aspect Ratio" box checked; width and height scale proportionally.' }
    ],
    relatedToolSlugs: ['image-compressor', 'image-cropper', 'image-format-converter', 'passport-photo-resizer']
  },
  {
    id: 'image-format-converter',
    slug: 'image-format-converter',
    name: 'Image Format Converter (JPG / PNG / WebP)',
    category: 'image-tools',
    shortDescription: 'Convert between PNG, JPG, and modern WebP formats in seconds with transparency support.',
    fullDescription: 'Convert images to JPG for smaller file sizes, PNG for transparent backgrounds, or WebP for next-generation web performance with one click.',
    iconName: 'RefreshCw',
    keywords: ['jpg to png', 'png to jpg', 'webp to png', 'png to webp', 'image converter'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Upload Image', instruction: 'Select an image file in any common format.' },
      { step: 2, title: 'Choose Target Format', instruction: 'Select JPG, PNG, or WebP.' },
      { step: 3, title: 'Convert', instruction: 'Click Convert to re-encode the image.' },
      { step: 4, title: 'Download', instruction: 'Download your converted image in the new format.' }
    ],
    realLifeExample: {
      title: 'Converting a Heavy PNG Logo to WebP for Fast Web Loading',
      inputDescription: 'logo.png (1.2 MB transparent graphic)',
      outputDescription: 'logo.webp (180 KB modern format, 85% bandwidth reduction)',
      details: [
        { label: 'Input Format', value: 'PNG' },
        { label: 'Output Format', value: 'WebP' },
        { label: 'File Size', value: '1.2 MB → 180 KB' }
      ]
    },
    howItWorks: 'Uses the browser image decoder to build a pixel buffer and serializes it using canvas.toDataURL() with the target MIME type.',
    faqs: [
      { question: 'Will JPG support transparent backgrounds?', answer: 'No, JPG does not support transparency. Transparent areas will become white in JPG. Use PNG or WebP for transparency.' }
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'favicon-generator']
  },
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper & Flipper',
    category: 'image-tools',
    shortDescription: 'Crop, rotate 90°, flip horizontally or vertically, and adjust photos precisely.',
    fullDescription: 'Rotate photos 90° clockwise or counter-clockwise, mirror flip horizontally/vertically, and crop to square, 4:3, or 16:9 dimensions right in your browser.',
    iconName: 'Crop',
    keywords: ['crop image', 'rotate photo', 'flip image', 'photo editor'],
    howToSteps: [
      { step: 1, title: 'Load Image', instruction: 'Select your photo.' },
      { step: 2, title: 'Rotate or Flip', instruction: 'Use the quick rotate (90°) or flip buttons.' },
      { step: 3, title: 'Crop', instruction: 'Select your crop aspect ratio or drag crop bounds.' },
      { step: 4, title: 'Download', instruction: 'Save your adjusted image.' }
    ],
    realLifeExample: {
      title: 'Fixing Sideways Mobile Photo',
      inputDescription: 'Sideways photo taken at 90° orientation.',
      outputDescription: 'Properly oriented upright photo cropped to 1:1 square for profile avatar.',
      details: [
        { label: 'Rotation', value: '+90° Clockwise' },
        { label: 'Crop Ratio', value: '1:1 Square' }
      ]
    },
    howItWorks: 'Applies 2D affine matrix transformation on canvas context before rendering the bitmap.',
    faqs: [
      { question: 'Does flipping degrade quality?', answer: 'No, rotating by 90° intervals or flipping applies pure coordinate inversions without degrading pixel quality.' }
    ],
    relatedToolSlugs: ['image-resizer', 'image-compressor', 'passport-photo-resizer']
  },
  {
    id: 'favicon-generator',
    slug: 'favicon-generator',
    name: 'Favicon & App Icon Generator',
    category: 'image-tools',
    shortDescription: 'Generate standard 16x16, 32x32, 48x48, and 180x180 Apple Touch icons from any logo or image.',
    fullDescription: 'Create square icons for website browser tabs, bookmarks, and mobile home screen shortcuts. Generates crisp, square favicons at multiple resolutions ready for production.',
    iconName: 'Sparkles',
    keywords: ['favicon generator', 'make favicon', 'apple touch icon', 'website icon creator'],
    howToSteps: [
      { step: 1, title: 'Upload Logo', instruction: 'Select your square or rectangular logo image.' },
      { step: 2, title: 'Select Sizes', instruction: 'Choose standard favicon sizes: 16×16, 32×32, 48×48, 180×180.' },
      { step: 3, title: 'Generate & Download', instruction: 'Download individual icon files or copy HTML link tags.' }
    ],
    realLifeExample: {
      title: 'Generating Production Favicon for rajtoolbox.com',
      inputDescription: '512×512 PNG brand emblem.',
      outputDescription: '16×16 px and 32×32 px sharp favicons plus HTML head snippet.',
      details: [
        { label: 'Standard Favicon', value: '32×32 px' },
        { label: 'Apple Touch Icon', value: '180×180 px' }
      ]
    },
    howItWorks: 'Renders the source asset scaled down onto miniature square canvases with anti-aliasing.',
    faqs: [
      { question: 'What is the standard favicon size?', answer: '32×32 pixels is standard for modern desktop displays, with 16×16 used for classic tabs.' }
    ],
    relatedToolSlugs: ['image-resizer', 'image-format-converter']
  },
  {
    id: 'image-color-picker',
    slug: 'image-color-picker',
    name: 'Image Color Picker & Palette Extractor',
    category: 'image-tools',
    shortDescription: 'Click anywhere on an uploaded image to extract exact HEX, RGB, and HSL color values.',
    fullDescription: 'Extract color codes from any graphic, screenshot, or photo. Click or hover on any pixel to retrieve its HEX code, RGB breakdown, HSL values, and dominant color palette.',
    iconName: 'Pipette',
    keywords: ['image color picker', 'extract colors from photo', 'hex from image', 'palette extractor'],
    howToSteps: [
      { step: 1, title: 'Upload Image', instruction: 'Select an image or graphic.' },
      { step: 2, title: 'Inspect Pixels', instruction: 'Hover and click anywhere on the image preview.' },
      { step: 3, title: 'Copy Color Code', instruction: 'Copy the HEX, RGB, or HSL code with one click.' }
    ],
    realLifeExample: {
      title: 'Extracting Exact Brand Accent from Screenshot',
      inputDescription: 'Uploaded screenshot of a design.',
      outputDescription: 'Selected pixel returns HEX #EC4899 | RGB(236, 72, 153).',
      details: [
        { label: 'HEX', value: '#EC4899' },
        { label: 'RGB', value: 'rgb(236, 72, 153)' }
      ]
    },
    howItWorks: 'Retrieves pixel RGBA values using canvas context.getImageData(x, y, 1, 1).',
    faqs: [
      { question: 'Can I copy the hex code immediately?', answer: 'Yes, clicking the pixel copies the HEX code straight to your clipboard.' }
    ],
    relatedToolSlugs: ['color-converter', 'color-palette-generator']
  },

  // TEXT TOOLS
  {
    id: 'text-case-converter',
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    category: 'text-tools',
    shortDescription: 'Convert text between uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more, with advanced text cleanup.',
    fullDescription: 'Comprehensive Text Case Converter and text formatting engine. Instantly convert text between UPPERCASE, lowercase, Title Case, Sentence case, Capitalize Each Word, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and path/case. Clean extra spaces, remove unwanted line breaks from copied PDFs, normalize whitespace, and inspect live character, word, and reading-time statistics 100% privately in your browser.',
    iconName: 'Type',
    keywords: [
      'text case converter',
      'text formatting tool',
      'uppercase converter',
      'lowercase converter',
      'title case converter',
      'sentence case converter',
      'camel case converter',
      'snake case converter',
      'kebab case converter',
      'text cleaner',
      'pascal case converter',
      'constant case converter',
      'convert text online',
      'clean pdf copied text'
    ],
    popular: true,
    featured: true,
    aliases: ['case converter', 'text case changer', 'capitalization tool', 'text formatter', 'pdf text cleaner'],
    useCases: [
      'Article and blog headline formatting',
      'Programming variable name conversion (camelCase, snake_case)',
      'Fixing accidental all-caps or Caps Lock text',
      'Cleaning fragmented lines from copied PDF documents',
      'Formatting social media captions and essays'
    ],
    howToSteps: [
      { step: 1, title: 'Enter Text', instruction: 'Paste or type your text into the left input panel, or click "Sample" to load test text.' },
      { step: 2, title: 'Select Case or Cleanup', instruction: 'Choose from 16 case formats (Title Case, Sentence case, camelCase, etc.) or click "Clean Copied Text".' },
      { step: 3, title: 'Copy or Download', instruction: 'Review the live converted text, inspect character counts, and click "Copy Converted Text" or "Download".' }
    ],
    realLifeExample: {
      title: 'Formatting Blog Headlines & Cleaning Copied Lines',
      inputDescription: '"the ultimate guide on how to learn web development in 2026"',
      outputDescription: '"The Ultimate Guide on How to Learn Web Development in 2026"',
      details: [
        { label: 'Raw Input', value: 'all-lowercase sentence' },
        { label: 'Title Case Output', value: 'Standard AP/Chicago Title Case' },
        { label: 'camelCase Output', value: 'theUltimateGuideOnHowToLearnWebDevelopmentIn2026' }
      ]
    },
    howItWorks: 'Uses client-side regex parsing, linguistic stop-word dictionaries, and intelligent word tokenizers to convert capitalization conventions and normalize whitespace entirely within your browser memory.',
    faqs: [
      { question: 'What is a text case converter?', answer: 'A text case converter transforms the capitalization of text characters according to standard linguistic rules or programming conventions without needing to retype words.' },
      { question: 'How does Title Case work in RajToolBox?', answer: 'RajToolBox applies standard Chicago and AP grammatical title casing, capitalizing principal words while keeping minor stop words (such as a, an, the, and, in, of, with) lowercase.' },
      { question: 'Can I clean text copied from PDFs and ChatGPT?', answer: 'Yes! The Clean Copied Text action unwraps artificial hard line breaks from PDFs while preserving true paragraph breaks.' },
      { question: 'Is my text uploaded to any server?', answer: 'No. 100% of processing occurs in your browser memory, ensuring complete privacy.' }
    ],
    relatedToolSlugs: ['word-counter', 'case-converter', 'text-cleaner', 'find-and-replace', 'slug-generator', 'text-diff-checker']
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    category: 'text-tools',
    shortDescription: 'Count words, characters, sentences, paragraphs, reading time, and speaking time in real time.',
    fullDescription: 'Comprehensive text analysis tool providing instant statistics: total word count, character count (with and without spaces), sentence count, paragraph count, estimated reading time, and speaking duration.',
    iconName: 'FileText',
    keywords: ['word counter', 'character count', 'reading time calculator', 'text stats'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Type or Paste', instruction: 'Enter or paste your text into the text editor.' },
      { step: 2, title: 'View Real-time Stats', instruction: 'Instant word, character, and sentence counts update as you type.' },
      { step: 3, title: 'Check Reading Time', instruction: 'Review reading and speaking durations based on average speech rates.' }
    ],
    realLifeExample: {
      title: 'Validating Blog Article Length for Publishing',
      inputDescription: 'Draft article pasted into the editor.',
      outputDescription: '1,450 words, 9,200 characters, 62 sentences, ~6 min reading time.',
      details: [
        { label: 'Words', value: '1,450' },
        { label: 'Characters', value: '9,200' },
        { label: 'Estimated Read Time', value: '6 minutes' }
      ]
    },
    howItWorks: 'Evaluates the text stream with regex tokenization for whitespace boundaries and punctuation markers to tally structural linguistic units.',
    formula: {
      title: 'Reading Time Calculation',
      formula: '\\text{Reading Time (minutes)} = \\frac{\\text{Total Words}}{200}',
      variables: [
        { symbol: 'Total Words', meaning: 'The total number of whitespace-delimited words' },
        { symbol: '200', meaning: 'Standard average adult reading speed in words per minute (WPM)' }
      ],
      explanation: 'Estimates how long an average person takes to read the text silently.',
      workedExample: '600 words / 200 WPM = 3.0 minutes estimated reading time.'
    },
    faqs: [
      { question: 'Are spaces included in the character count?', answer: 'Both metrics are displayed: characters with spaces and characters excluding whitespace.' },
      { question: 'Is my text sent to any server?', answer: 'No. All counting occurs live in your browser window.' }
    ],
    relatedToolSlugs: ['case-converter', 'text-cleaner', 'reading-time-calculator', 'slug-generator']
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Case Converter (Upper, Lower, Title, Slug)',
    category: 'text-tools',
    shortDescription: 'Convert text instantly to UPPERCASE, lowercase, Title Case, Sentence case, CamelCase, and kebab-case.',
    fullDescription: 'Switch between multiple letter case conventions effortlessly. Supports UPPERCASE, lowercase, Title Case (capitalizing significant words), Sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
    iconName: 'Type',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase converter'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Enter Text', instruction: 'Type or paste the text you need to format.' },
      { step: 2, title: 'Select Case', instruction: 'Click your target case button (e.g., Title Case, UPPERCASE).' },
      { step: 3, title: 'Copy Result', instruction: 'Click "Copy Result" to place the converted text on your clipboard.' }
    ],
    realLifeExample: {
      title: 'Standardizing Blog Headlines',
      inputDescription: '"powerful online tools. simple to use for daily tasks."',
      outputDescription: '"Powerful Online Tools. Simple to Use for Daily Tasks."',
      details: [
        { label: 'Input', value: 'raw lowercase headline' },
        { label: 'Output', value: 'Proper Title Case' }
      ]
    },
    howItWorks: 'Applies linguistic normalization rules and word boundary capitalization while respecting standard lowercase grammatical particles in title casing.',
    faqs: [
      { question: 'Does Title Case lowercase minor words like "and", "the", "in"?', answer: 'Yes, our Title Case algorithm properly keeps standard articles and prepositions in lowercase unless they start the sentence.' }
    ],
    relatedToolSlugs: ['word-counter', 'text-cleaner', 'slug-generator']
  },
  {
    id: 'text-cleaner',
    slug: 'text-cleaner',
    name: 'Text Cleaner & Duplicate Line Remover',
    category: 'text-tools',
    shortDescription: 'Remove extra spaces, delete duplicate lines, sort alphabetically, reverse, and strip empty breaks.',
    fullDescription: 'Clean messy text and raw data lists. Strip consecutive redundant spaces, remove duplicate lines, sort lines alphabetically (A-Z or Z-A), remove blank lines, or reverse line order.',
    iconName: 'Sparkles',
    keywords: ['remove duplicate lines', 'clean text', 'remove extra spaces', 'sort text lines'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Paste Text', instruction: 'Paste your unformatted lines or list of data.' },
      { step: 2, title: 'Choose Filters', instruction: 'Select operations: Remove Duplicates, Trim Whitespace, Sort Lines.' },
      { step: 3, title: 'Copy Cleaned Text', instruction: 'Instantly copy your sanitized output.' }
    ],
    realLifeExample: {
      title: 'Deduplicating Email Subscriber List',
      inputDescription: 'List of 500 email lines containing duplicate submissions and extra spaces.',
      outputDescription: 'Sorted list of 412 unique, trimmed email addresses.',
      details: [
        { label: 'Original Lines', value: '500' },
        { label: 'Duplicates Removed', value: '88' },
        { label: 'Final Unique Lines', value: '412' }
      ]
    },
    howItWorks: 'Splits string by newline characters, applies Set data structures for O(N) deduplication, and filters empty strings.',
    faqs: [
      { question: 'Is deduplication case-sensitive?', answer: 'You can toggle whether "Apple" and "apple" are treated as duplicates.' }
    ],
    relatedToolSlugs: ['word-counter', 'find-and-replace', 'text-diff-checker']
  },
  {
    id: 'find-and-replace',
    slug: 'find-and-replace',
    name: 'Find and Replace Tool',
    category: 'text-tools',
    shortDescription: 'Search for words, phrases, or regex patterns and replace them across your text instantly.',
    fullDescription: 'Batch replace words, characters, or complex regular expressions across documents. Supports case sensitivity toggle, whole word matching, and live replacement count display.',
    iconName: 'Search',
    keywords: ['find and replace', 'replace text', 'batch replace', 'regex replace'],
    howToSteps: [
      { step: 1, title: 'Input Text', instruction: 'Paste the source text.' },
      { step: 2, title: 'Specify Terms', instruction: 'Enter the "Find" term and the "Replace With" string.' },
      { step: 3, title: 'Configure Match', instruction: 'Toggle Case Sensitive, Match Whole Word, or Regex mode.' },
      { step: 4, title: 'Replace', instruction: 'Click Replace All and copy the updated text.' }
    ],
    realLifeExample: {
      title: 'Updating Year Across 50 Paragraphs',
      inputDescription: 'Documentation referring to "2025".',
      outputDescription: 'All 34 occurrences of "2025" cleanly updated to "2026".',
      details: [
        { label: 'Search Query', value: '2025' },
        { label: 'Replacement', value: '2026' },
        { label: 'Occurrences Replaced', value: '34' }
      ]
    },
    howItWorks: 'Uses JavaScript regular expression engine with global flags and dynamic string substitution.',
    faqs: [
      { question: 'Can I use Regular Expressions?', answer: 'Yes, enable the "Regex" toggle to search using valid regex patterns like \\d+ or \\b[A-Z]{3}\\b.' }
    ],
    relatedToolSlugs: ['text-cleaner', 'regex-tester', 'word-counter']
  },
  {
    id: 'text-diff-checker',
    slug: 'text-diff-checker',
    name: 'Text Difference (Diff) Checker',
    category: 'text-tools',
    shortDescription: 'Compare two text blocks side by side and highlight additions, deletions, and modifications.',
    fullDescription: 'Compare two pieces of code, contracts, or draft essays side-by-side. Highlights modified lines and character differences in red (deleted) and green (added).',
    iconName: 'FileDiff',
    keywords: ['text diff', 'compare text', 'text difference checker', 'diff tool'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Original Text', instruction: 'Paste original content in the left box.' },
      { step: 2, title: 'Modified Text', instruction: 'Paste revised content in the right box.' },
      { step: 3, title: 'Compare', instruction: 'Click "Compare Text" to see highlighted line-by-line differences.' }
    ],
    realLifeExample: {
      title: 'Comparing Revised Contract Clauses',
      inputDescription: 'Version 1 vs Version 2 of Terms of Service.',
      outputDescription: 'Shows 3 deleted sentences highlighted in red and 2 new sentences highlighted in green.',
      details: [
        { label: 'Original', value: 'Clause 4 (v1)' },
        { label: 'Modified', value: 'Clause 4 (v2)' },
        { label: 'Differences', value: '3 modifications detected' }
      ]
    },
    howItWorks: 'Computes the Longest Common Subsequence (LCS) across lines to generate the minimal edit distance diff.',
    faqs: [
      { question: 'Can I compare programming code?', answer: 'Yes, it works smoothly with JavaScript, Python, HTML, CSS, JSON, or plain prose.' }
    ],
    relatedToolSlugs: ['text-cleaner', 'word-counter']
  },
  {
    id: 'slug-generator',
    slug: 'slug-generator',
    name: 'URL Slug Generator',
    category: 'text-tools',
    shortDescription: 'Convert any title, sentence, or phrase into a clean, SEO-friendly URL slug.',
    fullDescription: 'Generate URL-safe slugs for blog posts, product pages, and website routes. Strips accents, removes punctuation and illegal characters, and replaces spaces with hyphens.',
    iconName: 'Link',
    keywords: ['slug generator', 'url slug', 'seo friendly url', 'title to slug'],
    howToSteps: [
      { step: 1, title: 'Enter Title', instruction: 'Type any article title or product name.' },
      { step: 2, title: 'Configure Separator', instruction: 'Choose hyphen (-) or underscore (_).' },
      { step: 3, title: 'Copy Slug', instruction: 'Instantly copy the generated slug.' }
    ],
    realLifeExample: {
      title: 'Creating URL Slug for a Physics Article',
      inputDescription: '"Quantum Mechanics: 10 Essential Principles & Real-World Applications!"',
      outputDescription: '"quantum-mechanics-10-essential-principles-real-world-applications"',
      details: [
        { label: 'Input Title', value: 'Article Title with special chars' },
        { label: 'Clean Slug', value: 'lowercase hyphenated URL path' }
      ]
    },
    howItWorks: 'Normalizes Unicode characters with NFD decomposition, strips non-ASCII marks, removes non-alphanumeric chars, and collapses hyphens.',
    faqs: [
      { question: 'Does it remove question marks, ampersands, and exclamation marks?', answer: 'Yes, all URL-unsafe characters are cleanly removed.' }
    ],
    relatedToolSlugs: ['case-converter', 'meta-tag-generator', 'url-codec']
  },

  // DEVELOPER TOOLS
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer-tools',
    shortDescription: 'Beautify, validate, format, and minify JSON data with clear syntax error detection.',
    fullDescription: 'Inspect and format messy JSON strings into clean, readable structures with 2-space or 4-space indentation. Validates JSON compliance and points directly to the line and character where syntax errors occur.',
    iconName: 'FileCode',
    keywords: ['json formatter', 'json validator', 'beautify json', 'json prettifier', 'minify json'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Paste JSON', instruction: 'Paste your raw or compressed JSON data.' },
      { step: 2, title: 'Choose Action', instruction: 'Click "Format (Beautify)" or "Minify".' },
      { step: 3, title: 'Validate Syntax', instruction: 'Review the instant status indicator (Valid JSON or error line message).' },
      { step: 4, title: 'Copy or Download', instruction: 'Copy formatted JSON or download as a .json file.' }
    ],
    realLifeExample: {
      title: 'Formatting Compressed API Response',
      inputDescription: '{"user":{"id":101,"name":"Raj","role":"admin"},"active":true}',
      outputDescription: 'Clean 2-space indented readable tree structure.',
      details: [
        { label: 'Original', value: 'Single unreadable line of 65 characters' },
        { label: 'Formatted', value: 'Multi-line indented structure with syntax clarity' }
      ]
    },
    howItWorks: 'Leverages JSON.parse() with try-catch diagnostic parsing and JSON.stringify(data, null, indent) formatting.',
    faqs: [
      { question: 'Can it detect missing commas or trailing commas?', answer: 'Yes, if invalid JSON is provided, the exact syntax error reason is highlighted with line numbers.' },
      { question: 'Is my data secure?', answer: 'Completely. Processing is 100% browser-based; no payload is ever transmitted.' }
    ],
    relatedToolSlugs: ['base64-codec', 'jwt-decoder', 'csv-to-json', 'html-css-minifier']
  },
  {
    id: 'base64-codec',
    slug: 'base64-codec',
    name: 'Base64 Encoder & Decoder',
    category: 'developer-tools',
    shortDescription: 'Encode text or UTF-8 strings to Base64 format or decode Base64 back into plain text.',
    fullDescription: 'Encode plain text or UTF-8 strings into Base64 format, or decode existing Base64 strings back to human-readable text. Features full support for UTF-8 multi-byte characters and live output copying.',
    iconName: 'Binary',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 convert', 'encode to base64'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Input Text', instruction: 'Type or paste the text or Base64 string.' },
      { step: 2, title: 'Select Mode', instruction: 'Choose "Encode to Base64" or "Decode from Base64".' },
      { step: 3, title: 'Copy Result', instruction: 'Copy the resulting string with one click.' }
    ],
    realLifeExample: {
      title: 'Encoding Basic Auth Credentials',
      inputDescription: 'Username and password string: "rajtoolbox:secret2026"',
      outputDescription: 'Base64 string: "cmFqdG9vbGJveDpzZWNyZXQyMDI2"',
      details: [
        { label: 'Plain Text', value: 'rajtoolbox:secret2026' },
        { label: 'Encoded Base64', value: 'cmFqdG9vbGJveDpzZWNyZXQyMDI2' }
      ]
    },
    howItWorks: 'Uses btoa() and atob() wrapped with TextEncoder and TextDecoder to handle UTF-8 characters properly.',
    faqs: [
      { question: 'Does it support Unicode and emojis?', answer: 'Yes, full UTF-8 byte encoding prevents the typical Latin-1 encoding errors when handling emojis and non-English characters.' }
    ],
    relatedToolSlugs: ['url-codec', 'json-formatter', 'hash-generator']
  },
  {
    id: 'url-codec',
    slug: 'url-codec',
    name: 'URL Encoder & Decoder',
    category: 'developer-tools',
    shortDescription: 'Encode special characters into percent-encoded URL safe format or decode URLs back to readable text.',
    fullDescription: 'Convert spaces, ampersands, slashes, and query symbols into percent-encoded values for valid HTTP request queries, or decode percent-encoded URLs back into readable text.',
    iconName: 'Link2',
    keywords: ['url encoder', 'url decoder', 'percent encode', 'encodeURI', 'url query encoder'],
    howToSteps: [
      { step: 1, title: 'Enter URL or Text', instruction: 'Paste your URL, query string, or plain text.' },
      { step: 2, title: 'Choose Operation', instruction: 'Click "Encode URL" or "Decode URL".' },
      { step: 3, title: 'Copy Output', instruction: 'Copy the transformed URL string.' }
    ],
    realLifeExample: {
      title: 'Encoding Query Parameter with Spaces and Ampersands',
      inputDescription: 'Search string: "tools & utilities 100%"',
      outputDescription: 'Percent-encoded: "tools%20%26%20utilities%20100%25"',
      details: [
        { label: 'Decoded', value: 'tools & utilities 100%' },
        { label: 'Encoded', value: 'tools%20%26%20utilities%20100%25' }
      ]
    },
    howItWorks: 'Uses JavaScript encodeURIComponent() and decodeURIComponent() functions.',
    faqs: [
      { question: 'What characters get encoded?', answer: 'Reserved URI characters such as spaces (%20), ampersands (%26), percent signs (%25), and slashes (%2F).' }
    ],
    relatedToolSlugs: ['base64-codec', 'utm-builder', 'slug-generator']
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Token Decoder & Inspector',
    category: 'developer-tools',
    shortDescription: 'Decode JSON Web Tokens (JWT) to inspect Header, Payload, and Expiration timestamps.',
    fullDescription: 'Paste any JSON Web Token (JWT) to inspect its decoded Header and Payload claims (such as sub, iss, exp, iat). Displays expiration status and human-readable dates with zero server transmission.',
    iconName: 'ShieldCheck',
    keywords: ['jwt decoder', 'decode jwt', 'jwt inspector', 'json web token viewer'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Paste Token', instruction: 'Paste your Bearer token or raw JWT.' },
      { step: 2, title: 'Inspect Claims', instruction: 'View the color-coded Header and Payload JSON structures.' },
      { step: 3, title: 'Verify Expiry', instruction: 'Check whether the token is currently active or expired.' }
    ],
    realLifeExample: {
      title: 'Verifying User Claims in an Auth Token',
      inputDescription: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      outputDescription: 'Header: {"alg":"HS256"}, Payload: {"sub":"123","name":"Raj","exp":1767180000}',
      details: [
        { label: 'Algorithm', value: 'HS256' },
        { label: 'Token Status', value: 'Decoded successfully' }
      ]
    },
    howItWorks: 'Splits the token by periods (.) and decodes the Base64URL-encoded segments for the Header and Payload.',
    faqs: [
      { question: 'Is my secret key required to inspect a JWT?', answer: 'No, inspecting the payload does not require the secret key. JWT payloads are Base64URL encoded, not encrypted.' },
      { question: 'Does this tool store my tokens?', answer: 'No, token inspection is 100% ephemeral and local in your browser memory.' }
    ],
    relatedToolSlugs: ['json-formatter', 'base64-codec', 'hash-generator']
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator (v4)',
    category: 'developer-tools',
    shortDescription: 'Generate cryptographically secure random UUID v4 strings individually or in batches.',
    fullDescription: 'Generate unique RFC4122 Version 4 UUIDs using the browser\'s crypto.randomUUID() engine. Generate single IDs or batch lists with uppercase/lowercase and hyphen options.',
    iconName: 'Key',
    keywords: ['uuid generator', 'guid generator', 'random uuid', 'uuid v4'],
    howToSteps: [
      { step: 1, title: 'Select Quantity', instruction: 'Choose how many UUIDs to generate (1 to 50).' },
      { step: 2, title: 'Choose Formatting', instruction: 'Select uppercase or lowercase, with or without hyphens.' },
      { step: 3, title: 'Generate & Copy', instruction: 'Click "Generate UUIDs" and copy the list to clipboard.' }
    ],
    realLifeExample: {
      title: 'Creating Unique Database Primary Keys',
      inputDescription: 'Generate 3 UUID v4 identifiers.',
      outputDescription: 'f47ac10b-58cc-4372-a567-0e02b2c3d479, 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d, etc.',
      details: [
        { label: 'Standard', value: 'RFC 4122 Version 4' },
        { label: 'Entropy', value: '122 bits of randomness' }
      ]
    },
    howItWorks: 'Utilizes window.crypto.randomUUID() or crypto.getRandomValues() to supply high-entropy cryptographically secure random bytes.',
    faqs: [
      { question: 'Can two generated UUID v4 keys collide?', answer: 'The probability of a collision is astronomically low (~1 in 2^122), making them globally unique in practice.' }
    ],
    relatedToolSlugs: ['password-generator', 'hash-generator', 'random-number-generator']
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator (SHA-256, SHA-1, SHA-512)',
    category: 'security-privacy',
    shortDescription: 'Generate cryptographic SHA-256, SHA-512, and SHA-1 hashes from any input string.',
    fullDescription: 'Calculate standard cryptographic message digests using the browser Web Crypto API (SubtleCrypto). Computes SHA-256, SHA-512, and SHA-1 hashes instantaneously as you type.',
    iconName: 'Hash',
    keywords: ['hash generator', 'sha256 generator', 'sha512', 'sha1 hash', 'checksum generator'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Enter Text', instruction: 'Type or paste the string to hash.' },
      { step: 2, title: 'View Hashes', instruction: 'Review the live SHA-256, SHA-512, and SHA-1 digests.' },
      { step: 3, title: 'Copy Hash', instruction: 'Click the copy icon next to your desired hash algorithm.' }
    ],
    realLifeExample: {
      title: 'Verifying Integrity of a Password or File String',
      inputDescription: '"rajtoolbox2026"',
      outputDescription: 'SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      details: [
        { label: 'Input Text', value: 'rajtoolbox2026' },
        { label: 'Algorithm', value: 'SHA-256 (64 hex characters)' }
      ]
    },
    howItWorks: 'Calls window.crypto.subtle.digest() on a UTF-8 ArrayBuffer and converts the resulting buffer into a lowercase hexadecimal string.',
    faqs: [
      { question: 'Can a hash be reversed back into the original text?', answer: 'Cryptographic hashes are one-way functions; they cannot be mathematically reversed to recover the original plaintext.' }
    ],
    relatedToolSlugs: ['file-hash-generator', 'uuid-generator', 'base64-codec']
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester & Matcher',
    category: 'developer-tools',
    shortDescription: 'Test regular expressions against sample text with live match highlighting and capture groups.',
    fullDescription: 'Build and debug regular expressions in real-time. Test patterns with flags (g, i, m), highlight matching spans, inspect capture groups, and catch syntax errors immediately.',
    iconName: 'Terminal',
    keywords: ['regex tester', 'regular expression tester', 'regex match', 'test regex online'],
    howToSteps: [
      { step: 1, title: 'Enter Pattern', instruction: 'Type your regular expression (e.g. \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b).' },
      { step: 2, title: 'Toggle Flags', instruction: 'Select flags: Global (g), Case-Insensitive (i), Multiline (m).' },
      { step: 3, title: 'Provide Test String', instruction: 'Paste the text you want to evaluate.' },
      { step: 4, title: 'Review Matches', instruction: 'Inspect matched strings and capture groups.' }
    ],
    realLifeExample: {
      title: 'Extracting Email Addresses from Raw Text',
      inputDescription: 'Pattern: [\\w.-]+@[\\w.-]+\\.\\w+ tested against contact paragraph.',
      outputDescription: 'Detects 3 matches: "rajtoolboxofficial@gmail.com", "info@rajtoolbox.com", etc.',
      details: [
        { label: 'Pattern', value: '[\\w.-]+@[\\w.-]+\\.\\w+' },
        { label: 'Matches Found', value: '3 matches' }
      ]
    },
    howItWorks: 'Instantiates a RegExp instance and executes matchAll() across the input string, calculating match indices and substring boundaries.',
    faqs: [
      { question: 'Does it support lookahead and lookbehind?', answer: 'Yes, modern browser JavaScript regex engines support positive and negative lookaheads and lookbehinds.' }
    ],
    relatedToolSlugs: ['find-and-replace', 'json-formatter']
  },
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Color Converter (HEX / RGB / HSL)',
    category: 'color-design',
    shortDescription: 'Convert color codes between HEX, RGB, HSL, and CSS rgba with live color swatch preview.',
    fullDescription: 'Convert colors across HEX, RGB, and HSL color models. Features a live visual color picker, instant mathematical conversion, CSS snippet generator, and light/dark contrast indicator.',
    iconName: 'Palette',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'color picker'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Pick or Enter Color', instruction: 'Type a HEX code (#EC4899), RGB value, or select using the color picker.' },
      { step: 2, title: 'View Converted Values', instruction: 'Live HEX, RGB, and HSL values update instantly.' },
      { step: 3, title: 'Copy Code', instruction: 'Copy the code format you need for your CSS or graphics software.' }
    ],
    realLifeExample: {
      title: 'Converting Brand Pink to RGB for CSS Stylesheet',
      inputDescription: 'HEX: #EC4899',
      outputDescription: 'RGB: rgb(236, 72, 153) | HSL: hsl(330, 81%, 60%)',
      details: [
        { label: 'HEX', value: '#EC4899' },
        { label: 'RGB', value: 'rgb(236, 72, 153)' },
        { label: 'HSL', value: 'hsl(330°, 81%, 60%)' }
      ]
    },
    howItWorks: 'Normalizes hex channels (00-FF) to decimal (0-255) and computes hue angles based on chroma and max-min RGB intervals.',
    formula: {
      title: 'HEX to RGB Channel Conversion',
      formula: 'R = \\text{hexToDec}(H_{1,2}), \\quad G = \\text{hexToDec}(H_{3,4}), \\quad B = \\text{hexToDec}(H_{5,6})',
      variables: [
        { symbol: 'H', meaning: '6-digit hexadecimal color string' },
        { symbol: 'hexToDec', meaning: 'Base-16 to Base-10 integer conversion' }
      ],
      explanation: 'Each pair of hex characters corresponds directly to one 8-bit color channel from 0 to 255.',
      workedExample: '#EC4899 -> EC=236, 48=72, 99=153 -> rgb(236, 72, 153)'
    },
    faqs: [
      { question: 'Can I copy with CSS formatting?', answer: 'Yes, both raw numbers and complete CSS declarations like rgb(...) and hsl(...) are available to copy.' }
    ],
    relatedToolSlugs: ['image-color-picker', 'color-palette-generator']
  },

  // QR & BARCODE TOOLS
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'qr-barcode-tools',
    shortDescription: 'Generate customized high-resolution QR codes for websites, plain text, WiFi, email, and phone numbers.',
    fullDescription: 'Create professional, scannable QR codes instantly. Customize foreground and background colors, adjust error correction levels, and download crystal-clear PNG images ready for print or web.',
    iconName: 'QrCode',
    keywords: ['qr code generator', 'make qr code', 'free qr creator', 'url qr code', 'wifi qr'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Choose QR Type', instruction: 'Select URL, Plain Text, WiFi Network, Email, or Phone Number.' },
      { step: 2, title: 'Enter Details', instruction: 'Fill in your target link, text, or credentials.' },
      { step: 3, title: 'Customize Colors', instruction: 'Choose custom foreground and background colors.' },
      { step: 4, title: 'Download PNG', instruction: 'Click "Download QR Code" to save the high-res image.' }
    ],
    realLifeExample: {
      title: 'Generating a Scannable Menu Link for a Restaurant',
      inputDescription: 'URL: https://rajtoolbox.com/menu',
      outputDescription: 'Sharp 400×400 px PNG QR code that instantly opens the menu on any smartphone camera.',
      details: [
        { label: 'Target URL', value: 'https://rajtoolbox.com/' },
        { label: 'Error Correction', value: 'High (H)' },
        { label: 'Download Format', value: 'PNG (400×400)' }
      ]
    },
    howItWorks: 'Encodes characters into a 2D matrix using Reed-Solomon error correction codewords, rendered onto a high-density canvas.',
    faqs: [
      { question: 'Do these QR codes ever expire?', answer: 'No! These are static QR codes encoding your exact data directly. They will work indefinitely.' },
      { question: 'Are there any scan limits or fees?', answer: 'None. You can generate unlimited QR codes for personal or commercial use completely free.' }
    ],
    relatedToolSlugs: ['barcode-generator', 'url-codec', 'utm-builder']
  },
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    name: 'Barcode Generator & Guide',
    category: 'qr-barcode-tools',
    shortDescription: 'Generate standard Code 128, EAN-13, and UPC-A industrial barcodes with SVG/PNG download.',
    fullDescription: 'Generate standard 1D linear barcodes (Code 128, EAN, UPC numeric format) suitable for inventory labeling, retail packaging, and logistics with instant preview and download.',
    iconName: 'Barcode',
    keywords: ['barcode generator', 'code 128 generator', 'create barcode', 'upc barcode', 'ean barcode'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Enter Data', instruction: 'Type your alphanumeric product code or inventory ID.' },
      { step: 2, title: 'Select Format', instruction: 'Choose Code 128, EAN-13, or numeric UPC.' },
      { step: 3, title: 'Generate & Save', instruction: 'Download your barcode image or copy the SVG.' }
    ],
    realLifeExample: {
      title: 'Labeling Warehouse Inventory Items',
      inputDescription: 'Product SKU: "RAJ-BOX-2026"',
      outputDescription: 'Standard Code 128 linear barcode readable by any commercial handheld laser scanner.',
      details: [
        { label: 'Format', value: 'Code 128' },
        { label: 'Payload', value: 'RAJ-BOX-2026' }
      ]
    },
    howItWorks: 'Maps character codes to modular bar-and-space binary widths defined in standard ISO/IEC 15417 linear symbology.',
    faqs: [
      { question: 'Can retail laser scanners read Code 128?', answer: 'Yes, Code 128 is a universal industrial standard supported by virtually all modern optical scanners.' }
    ],
    relatedToolSlugs: ['qr-code-generator', 'uuid-generator']
  },

  // CONVERTERS
  {
    id: 'universal-unit-converter',
    slug: 'universal-unit-converter',
    name: 'Universal Unit Converter',
    category: 'converters',
    shortDescription: 'Convert length, weight, temperature, area, volume, speed, pressure, energy, and digital storage.',
    fullDescription: 'Comprehensive, high-precision engineering and everyday unit converter. Seamlessly convert between metric and imperial systems across length (meters, feet, inches, miles), mass (kg, lbs, oz), temperature (°C, °F, K), digital data (MB, GB, TB), speed, area, volume, pressure, and energy.',
    iconName: 'ArrowRightLeft',
    keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'metric to imperial'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Select Measurement', instruction: 'Choose Length, Weight, Temperature, Area, Speed, Volume, or Data.' },
      { step: 2, title: 'Enter Value', instruction: 'Type the numeric value you want to convert.' },
      { step: 3, title: 'Choose Units', instruction: 'Select the "From" unit and "To" unit.' },
      { step: 4, title: 'Read Result', instruction: 'View the instant converted value with full precision.' }
    ],
    realLifeExample: {
      title: 'Converting Kilometers to Miles for Travel Planning',
      inputDescription: 'Distance: 100 kilometers',
      outputDescription: '62.1371 miles (1 km = ~0.621371 miles)',
      details: [
        { label: 'From', value: '100 Kilometers (km)' },
        { label: 'To', value: '62.1371 Miles (mi)' },
        { label: 'Ratio', value: '1 mi = 1.60934 km' }
      ]
    },
    howItWorks: 'Converts input units into standard SI base units (meters, grams, Kelvin, bytes) and projects them into the destination unit scale.',
    formula: {
      title: 'Celsius to Fahrenheit Formula',
      formula: '^{\\circ}\\text{F} = \\left( ^{\\circ}\\text{C} \\times \\frac{9}{5} \\right) + 32',
      variables: [
        { symbol: '°C', meaning: 'Temperature in degrees Celsius' },
        { symbol: '°F', meaning: 'Temperature in degrees Fahrenheit' }
      ],
      explanation: 'Relates metric freezing and boiling points (0°C, 100°C) to Fahrenheit scale (32°F, 212°F).',
      workedExample: '25°C -> (25 * 9/5) + 32 = 45 + 32 = 77°F.'
    },
    faqs: [
      { question: 'How many decimal places does it calculate?', answer: 'Up to 6 significant decimal places are computed to maintain scientific and engineering precision.' },
      { question: 'Does it support digital storage like MB to GB?', answer: 'Yes, both decimal (1000) and binary (1024) storage factors are supported.' }
    ],
    relatedToolSlugs: ['number-system-converter', 'percentage-calculator', 'roman-numeral-converter']
  },
  {
    id: 'number-system-converter',
    slug: 'number-system-converter',
    name: 'Number System Converter (Bin / Dec / Hex / Oct)',
    category: 'converters',
    shortDescription: 'Convert numbers across Decimal, Binary, Hexadecimal, and Octal formats with bit breakdown.',
    fullDescription: 'Essential tool for computer science and electronics. Convert numeric values simultaneously across Base-10 (Decimal), Base-2 (Binary), Base-16 (Hexadecimal), and Base-8 (Octal) with bit length visualization.',
    iconName: 'Cpu',
    keywords: ['decimal to binary', 'binary to decimal', 'hex to decimal', 'binary converter', 'hex converter'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Choose Base', instruction: 'Select your input system (Decimal, Binary, Hexadecimal, or Octal).' },
      { step: 2, title: 'Enter Number', instruction: 'Type your number (valid characters highlight in real time).' },
      { step: 3, title: 'Read All Bases', instruction: 'All other three number systems update simultaneously.' }
    ],
    realLifeExample: {
      title: 'Converting Memory Address or ASCII Byte',
      inputDescription: 'Decimal: 255',
      outputDescription: 'Binary: 11111111 | Hex: FF | Octal: 377',
      details: [
        { label: 'Decimal (Base 10)', value: '255' },
        { label: 'Binary (Base 2)', value: '11111111' },
        { label: 'Hex (Base 16)', value: 'FF' }
      ]
    },
    howItWorks: 'Parses string to BigInt with radix r, and invokes .toString(targetRadix) with zero sign-extension error.',
    faqs: [
      { question: 'Does it handle large numbers?', answer: 'Yes, utilizing JavaScript BigInt allows accurate conversion of large integers beyond standard 32-bit limits.' }
    ],
    relatedToolSlugs: ['universal-unit-converter', 'color-converter', 'base64-codec']
  },
  {
    id: 'roman-numeral-converter',
    slug: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    category: 'converters',
    shortDescription: 'Convert standard numbers into Roman numerals and decode Roman numerals back into numbers.',
    fullDescription: 'Convert numbers between Arabic numerals (1, 2026) and classical Roman numerals (I, MMXXVI). Explains additive and subtractive Roman notation with full validation.',
    iconName: 'BookOpen',
    keywords: ['roman numeral converter', 'arabic to roman', 'number to roman', 'roman to number'],
    howToSteps: [
      { step: 1, title: 'Select Direction', instruction: 'Choose "Number to Roman" or "Roman to Number".' },
      { step: 2, title: 'Enter Value', instruction: 'Type a number (e.g. 2026) or Roman string (e.g. MMXXVI).' },
      { step: 3, title: 'View Result', instruction: 'Read the converted numeral and breakdown.' }
    ],
    realLifeExample: {
      title: 'Writing the Current Year in Roman Numerals',
      inputDescription: 'Number: 2026',
      outputDescription: 'Roman Numeral: MMXXVI (M=1000, M=1000, XX=20, VI=6)',
      details: [
        { label: 'Input', value: '2026' },
        { label: 'Roman Output', value: 'MMXXVI' }
      ]
    },
    howItWorks: 'Uses greedy subtraction mapping across symbols: M(1000), CM(900), D(500), CD(400), C(100), XC(90), L(50), XL(40), X(10), IX(9), V(5), IV(4), I(1).',
    faqs: [
      { question: 'What is the maximum supported Roman numeral?', answer: 'Standard classical Roman numerals support integers from 1 up to 3,999 (MMMCMXCIX).' }
    ],
    relatedToolSlugs: ['number-system-converter', 'number-to-words']
  },
  {
    id: 'number-to-words',
    slug: 'number-to-words',
    name: 'Number to Words Converter',
    category: 'converters',
    shortDescription: 'Convert digits into spelled-out English words for checks, contracts, invoices, and legal documents.',
    fullDescription: 'Convert numerical currency and digits into formal English words. Ideal for writing bank checks, formal contracts, and invoices with currency denomination formatting.',
    iconName: 'FileCheck',
    keywords: ['number to words', 'spell out numbers', 'check amount writer', 'digits to words'],
    howToSteps: [
      { step: 1, title: 'Enter Number', instruction: 'Type any numeric amount (e.g. 15420.50).' },
      { step: 2, title: 'Select Style', instruction: 'Choose Standard English or Currency (Dollars / Rupees).' },
      { step: 3, title: 'Copy Words', instruction: 'Copy the spelled-out wording with one click.' }
    ],
    realLifeExample: {
      title: 'Writing an Official Check Amount',
      inputDescription: 'Amount: $4,520.75',
      outputDescription: '"Four Thousand Five Hundred Twenty Dollars and Seventy-Five Cents"',
      details: [
        { label: 'Numeric Value', value: '4520.75' },
        { label: 'Spelled Out', value: 'Four Thousand Five Hundred Twenty and 75/100' }
      ]
    },
    howItWorks: 'Deconstructs numeric values into triplet clusters (billions, millions, thousands, units) and translates them into phonetic English terms.',
    faqs: [
      { question: 'Can it spell decimals and cents?', answer: 'Yes, fractional portions are converted into cents or fractions for bank-check standards.' }
    ],
    relatedToolSlugs: ['roman-numeral-converter', 'universal-unit-converter']
  },

  // SEO & WEB TOOLS
  {
    id: 'meta-tag-generator',
    slug: 'meta-tag-generator',
    name: 'Meta Tag & OpenGraph Generator',
    category: 'seo-tools',
    shortDescription: 'Generate complete HTML Meta tags, OpenGraph social cards, and Twitter/X metadata ready to copy.',
    fullDescription: 'Craft optimized HTML meta tags for your website. Generates title, meta description with character count guidelines, OpenGraph tags for Facebook & LinkedIn, and Twitter Card tags with instant live preview.',
    iconName: 'Globe',
    keywords: ['meta tag generator', 'opengraph generator', 'seo tags creator', 'twitter card generator'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Enter Website Info', instruction: 'Type your Page Title, Description, and Canonical URL.' },
      { step: 2, title: 'Set Social Image', instruction: 'Provide your OpenGraph banner image URL.' },
      { step: 3, title: 'Check Character Limits', instruction: 'Watch title (under 60 chars) and description (under 160 chars) counters.' },
      { step: 4, title: 'Copy HTML Snippet', instruction: 'Copy the ready-to-paste <head> markup.' }
    ],
    realLifeExample: {
      title: 'Creating SEO Meta Tags for a Landing Page',
      inputDescription: 'Title: "RajToolBox - Powerful Online Tools", Description: "Free online utilities..."',
      outputDescription: 'Clean HTML tags block ready to paste directly into index.html <head>.',
      details: [
        { label: 'Title Length', value: '45 / 60 chars (Optimal)' },
        { label: 'Description Length', value: '142 / 160 chars (Optimal)' }
      ]
    },
    howItWorks: 'Validates lengths against Google SERP snippet constraints and compiles standard HTML5 and OpenGraph protocol meta elements.',
    faqs: [
      { question: 'Why is meta description length important?', answer: 'Google typically truncates descriptions longer than ~155-160 characters in mobile and desktop search results.' }
    ],
    relatedToolSlugs: ['robots-txt-generator', 'sitemap-generator', 'utm-builder', 'slug-generator']
  },
  {
    id: 'robots-txt-generator',
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    category: 'seo-tools',
    shortDescription: 'Generate a clean, standardized robots.txt file to guide search engine crawlers accurately.',
    fullDescription: 'Create a compliant robots.txt file for your website. Specify allow/disallow directives for Googlebot, Bingbot, and AI crawlers, and link your XML sitemap URL.',
    iconName: 'Bot',
    keywords: ['robots.txt generator', 'robots txt creator', 'crawler directives', 'search engine robots'],
    howToSteps: [
      { step: 1, title: 'Choose Crawl Rules', instruction: 'Select whether to allow all crawlers or customize directories.' },
      { step: 2, title: 'Specify Disallowed Paths', instruction: 'Add paths you wish to exclude (e.g. /admin/, /private/).' },
      { step: 3, title: 'Add Sitemap URL', instruction: 'Enter the full link to your sitemap.xml.' },
      { step: 4, title: 'Download robots.txt', instruction: 'Download the file and place it in your website root.' }
    ],
    realLifeExample: {
      title: 'Robots.txt Configuration for RajToolBox',
      inputDescription: 'Allow all public pages, exclude /admin/, declare sitemap.',
      outputDescription: 'User-agent: *\\nAllow: /\\nDisallow: /admin/\\nSitemap: https://rajtoolbox.com/sitemap.xml',
      details: [
        { label: 'User-agent', value: '*' },
        { label: 'Sitemap Declared', value: 'https://rajtoolbox.com/sitemap.xml' }
      ]
    },
    howItWorks: 'Assembles standard RFC 9309 Robots Exclusion Protocol directives into a plain text file format.',
    faqs: [
      { question: 'Where must robots.txt be located?', answer: 'It must always be placed at the absolute root of your domain: yourdomain.com/robots.txt.' }
    ],
    relatedToolSlugs: ['sitemap-generator', 'meta-tag-generator']
  },
  {
    id: 'utm-builder',
    slug: 'utm-builder',
    name: 'Campaign UTM Builder',
    category: 'seo-tools',
    shortDescription: 'Build tracked campaign marketing URLs with utm_source, utm_medium, and utm_campaign parameters.',
    fullDescription: 'Add Google Analytics UTM tracking parameters to any URL. Accurately set Campaign Source, Campaign Medium, Campaign Name, Term, and Content with instant link validation and one-click copy.',
    iconName: 'Share2',
    keywords: ['utm builder', 'campaign url builder', 'google analytics utm', 'track links'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Enter Base URL', instruction: 'Paste your target landing page (e.g., https://rajtoolbox.com).' },
      { step: 2, title: 'Define Source & Medium', instruction: 'Specify source (newsletter, twitter) and medium (cpc, email).' },
      { step: 3, title: 'Add Campaign Name', instruction: 'Enter campaign identifier (e.g. spring_launch).' },
      { step: 4, title: 'Copy Tracked URL', instruction: 'Copy the ready-to-share tracked URL.' }
    ],
    realLifeExample: {
      title: 'Tracking a Twitter Launch Campaign',
      inputDescription: 'URL: https://rajtoolbox.com, Source: twitter, Medium: social, Campaign: launch2026',
      outputDescription: 'https://rajtoolbox.com/?utm_source=twitter&utm_medium=social&utm_campaign=launch2026',
      details: [
        { label: 'Campaign Source', value: 'twitter' },
        { label: 'Campaign Medium', value: 'social' }
      ]
    },
    howItWorks: 'Parses the target URL using the URL API and appends encoded search parameters without disrupting existing hashes or parameters.',
    faqs: [
      { question: 'Do UTM parameters affect SEO rankings?', answer: 'No, search engines ignore UTM parameters when canonical tags are properly declared.' }
    ],
    relatedToolSlugs: ['url-codec', 'meta-tag-generator', 'qr-code-generator']
  },
  {
    id: 'keyword-density-checker',
    slug: 'keyword-density-checker',
    name: 'Keyword Density & Frequency Checker',
    category: 'seo-tools',
    shortDescription: 'Analyze single-word and two-word keyword frequency percentages to optimize SEO content.',
    fullDescription: 'Evaluate search engine optimization on any article or landing page. Calculates total word count, identifies most frequent 1-word and 2-word keyword phrases, and flags excessive keyword density.',
    iconName: 'BarChart2',
    keywords: ['keyword density', 'keyword frequency', 'seo content optimizer', 'word frequency'],
    howToSteps: [
      { step: 1, title: 'Paste Content', instruction: 'Paste your article text or blog post.' },
      { step: 2, title: 'Analyze', instruction: 'View the table of top keywords and their density percentages.' },
      { step: 3, title: 'Optimize', instruction: 'Ensure primary keywords remain within a healthy 1% - 3% density range.' }
    ],
    realLifeExample: {
      title: 'Checking Keyword Saturation in a Blog Post',
      inputDescription: '800-word article about physics utilities.',
      outputDescription: 'Displays "tools" (2.4%), "online" (1.8%), "converter" (1.5%) with zero keyword stuffing warnings.',
      details: [
        { label: 'Total Words', value: '800' },
        { label: 'Top Keyword', value: '"tools" (19 occurrences, 2.38%)' }
      ]
    },
    howItWorks: 'Filters out common grammatical stop-words (the, and, in, of) and calculates occurrence percentage relative to total word volume.',
    faqs: [
      { question: 'What is an optimal keyword density?', answer: 'Most SEO specialists recommend keeping primary search keywords between 1% and 2.5% to avoid over-optimization penalties.' }
    ],
    relatedToolSlugs: ['word-counter', 'meta-tag-generator']
  },

  // SOCIAL MEDIA TOOLS
  {
    id: 'social-post-formatter',
    slug: 'social-post-formatter',
    name: 'Social Media Post & Caption Formatter',
    category: 'social-media-tools',
    shortDescription: 'Format Instagram captions, clean line breaks, add aesthetic bullet points, and check limits.',
    fullDescription: 'Format clean Instagram and LinkedIn posts that retain clean line breaks without awkward collapsing. Add custom spacing, bullet lists, emojis, and check platform character limits.',
    iconName: 'Instagram',
    keywords: ['instagram caption formatter', 'social post formatter', 'line break instagram', 'linkedin post formatter'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Write Caption', instruction: 'Type your social media caption or post draft.' },
      { step: 2, title: 'Format Spacing', instruction: 'Insert invisible spacing or bullet points.' },
      { step: 3, title: 'Check Limits', instruction: 'Verify character counters for Instagram (2,200), X/Twitter (280), or LinkedIn (3,000).' },
      { step: 4, title: 'Copy Formatted Post', instruction: 'Copy directly into your social media app.' }
    ],
    realLifeExample: {
      title: 'Formatting an Instagram Carousel Description',
      inputDescription: 'Draft post with paragraphs that normally collapse on mobile.',
      outputDescription: 'Padded with zero-width whitespace to guarantee paragraph line breaks stay separated on mobile.',
      details: [
        { label: 'Character Count', value: '450 / 2,200' },
        { label: 'Clean Breaks', value: 'Preserved' }
      ]
    },
    howItWorks: 'Inserts non-breaking Unicode space characters onto blank lines so social media mobile apps do not strip whitespace.',
    faqs: [
      { question: 'Will my line breaks stay intact on Instagram?', answer: 'Yes, our zero-width line separators ensure Instagram preserves your exact line layout.' }
    ],
    relatedToolSlugs: ['hashtag-formatter', 'word-counter']
  },
  {
    id: 'hashtag-formatter',
    slug: 'hashtag-formatter',
    name: 'Hashtag Generator & Formatter',
    category: 'social-media-tools',
    shortDescription: 'Clean, prefix, and organize hashtags into clean comma-separated or space-separated blocks.',
    fullDescription: 'Organize raw keywords into polished hashtag blocks ready for Instagram, TikTok, LinkedIn, and YouTube. Automatically prepends #, strips punctuation, and limits batches to safe platform counts.',
    iconName: 'Hash',
    keywords: ['hashtag formatter', 'hashtag generator', 'instagram hashtags', 'hashtag clean'],
    howToSteps: [
      { step: 1, title: 'Paste Keywords', instruction: 'Type keywords separated by spaces, commas, or new lines.' },
      { step: 2, title: 'Choose Output Style', instruction: 'Select space-separated or dot-separated.' },
      { step: 3, title: 'Copy Hashtags', instruction: 'Copy your formatted hashtag collection.' }
    ],
    realLifeExample: {
      title: 'Organizing Tags for a Creative Design Post',
      inputDescription: '"web design, developer tools, css, responsive UI"',
      outputDescription: '#webdesign #developertools #css #responsiveui (4 hashtags)',
      details: [
        { label: 'Count', value: '4 hashtags' },
        { label: 'Cleaned', value: 'Special characters and spaces merged' }
      ]
    },
    howItWorks: 'Strips non-alphanumeric punctuation and formats valid hashtag tokens.',
    faqs: [
      { question: 'How many hashtags should I use on Instagram?', answer: 'Instagram allows up to 30 hashtags, with 3 to 10 relevant hashtags often delivering the best engagement.' }
    ],
    relatedToolSlugs: ['social-post-formatter', 'slug-generator']
  },

  // FILE & DATA TOOLS
  {
    id: 'csv-to-json',
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    category: 'file-data-tools',
    shortDescription: 'Convert CSV spreadsheet data into structured JSON objects or arrays with automatic type detection.',
    fullDescription: 'Convert CSV (Comma-Separated Values) spreadsheets into clean JSON arrays or nested objects. Features automatic number and boolean parsing, custom delimiter selection (comma, semicolon, tab), and instant JSON download.',
    iconName: 'FileSpreadsheet',
    keywords: ['csv to json', 'convert csv to json', 'excel to json', 'spreadsheet to json'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Paste CSV or Upload', instruction: 'Paste CSV text or upload a .csv file.' },
      { step: 2, title: 'Configure Options', instruction: 'Select delimiter and toggle whether the first row contains headers.' },
      { step: 3, title: 'Convert', instruction: 'Click "Convert to JSON".' },
      { step: 4, title: 'Copy or Download', instruction: 'Copy the JSON output or download as a .json file.' }
    ],
    realLifeExample: {
      title: 'Importing Customer List into Web Application',
      inputDescription: 'id,name,city\\n1,Raj,Jaipur\\n2,Alex,London',
      outputDescription: '[{"id": 1, "name": "Raj", "city": "Jaipur"}, {"id": 2, "name": "Alex", "city": "London"}]',
      details: [
        { label: 'Input Rows', value: '2 data rows + 1 header' },
        { label: 'Output Structure', value: 'Array of 2 JSON objects' }
      ]
    },
    howItWorks: 'Parses rows, strips quotes, splits delimiters, and maps column keys to row cells into typed JavaScript objects.',
    faqs: [
      { question: 'Does it support semicolon separated CSVs?', answer: 'Yes, you can choose Comma (,), Semicolon (;), or Tab (\\t) delimiters.' }
    ],
    relatedToolSlugs: ['json-to-csv', 'json-formatter']
  },
  {
    id: 'json-to-csv',
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    category: 'file-data-tools',
    shortDescription: 'Convert JSON arrays into tabular CSV format for Excel, Google Sheets, or database imports.',
    fullDescription: 'Transform JSON datasets into standard CSV tables. Automatically extracts unique keys for column headers, properly escapes commas and double-quotes, and supports downloading as a .csv file.',
    iconName: 'FileText',
    keywords: ['json to csv', 'convert json to csv', 'json to excel', 'export csv from json'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Paste JSON Array', instruction: 'Paste an array of JSON objects.' },
      { step: 2, title: 'Convert', instruction: 'Click "Convert to CSV".' },
      { step: 3, title: 'Download CSV', instruction: 'Download your .csv file ready for Excel or Sheets.' }
    ],
    realLifeExample: {
      title: 'Exporting User Data to Excel Spreadsheet',
      inputDescription: '[{"id": 101, "product": "Widget A", "price": 19.99}]',
      outputDescription: 'id,product,price\\n101,Widget A,19.99',
      details: [
        { label: 'Input Records', value: '1 JSON object' },
        { label: 'Output CSV', value: 'Standard RFC 4180 CSV' }
      ]
    },
    howItWorks: 'Traverses object properties to build an exhaustive header set and maps each item with CSV quote-escaping rules.',
    faqs: [
      { question: 'Can I open the resulting CSV in Microsoft Excel?', answer: 'Yes, the output conforms strictly to standard CSV RFC 4180 and opens directly in Excel, Apple Numbers, and Google Sheets.' }
    ],
    relatedToolSlugs: ['csv-to-json', 'json-formatter']
  },

  // PRODUCTIVITY TOOLS
  {
    id: 'pomodoro-timer',
    slug: 'pomodoro-timer',
    name: 'Pomodoro Focus Timer',
    category: 'productivity-tools',
    shortDescription: 'Boost focus and productivity with customizable 25-minute work intervals and 5-minute breaks.',
    fullDescription: 'Classic Pomodoro technique timer with 25-minute focus periods, 5-minute short breaks, 15-minute long breaks, sound alerts, round counters, and interactive progress ring.',
    iconName: 'Clock',
    keywords: ['pomodoro timer', 'focus timer', 'productivity timer', 'study timer'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Select Mode', instruction: 'Choose "Focus (25m)", "Short Break (5m)", or "Long Break (15m)".' },
      { step: 2, title: 'Start Timer', instruction: 'Click Start and focus on a single task until the bell rings.' },
      { step: 3, title: 'Take Break', instruction: 'When the timer finishes, take your scheduled break.' }
    ],
    realLifeExample: {
      title: 'Structuring a 2-Hour Deep Study Session',
      inputDescription: '4 cycles of 25m focus + 5m short break.',
      outputDescription: '100 minutes of productive study completed with sustained cognitive freshness.',
      details: [
        { label: 'Work Session', value: '25 minutes' },
        { label: 'Short Break', value: '5 minutes' }
      ]
    },
    howItWorks: 'Uses high-precision requestAnimationFrame and interval tracking with audio synthesis beeps when time reaches zero.',
    faqs: [
      { question: 'Can I customize the timer intervals?', answer: 'Yes, you can toggle between Focus, Short Break, and Long Break presets anytime.' }
    ],
    relatedToolSlugs: ['stopwatch-timer', 'password-generator']
  },
  {
    id: 'stopwatch-timer',
    slug: 'stopwatch-timer',
    name: 'Online Stopwatch & Lap Timer',
    category: 'productivity-tools',
    shortDescription: 'Millisecond-precision online stopwatch with split-lap time recording, pause, and reset features.',
    fullDescription: 'Accurately measure elapsed time down to the hundredth of a second. Features instant start, pause, resume, and split-lap recording to log multiple split times for workouts, cooking, productivity sprints, and study intervals.',
    iconName: 'Clock',
    keywords: ['stopwatch', 'online stopwatch', 'lap timer', 'precision timer', 'split timer'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Start Timer', instruction: 'Click "Start" to begin counting milliseconds immediately.' },
      { step: 2, title: 'Record Laps', instruction: 'Click "Lap" while running to log interim split intervals.' },
      { step: 3, title: 'Pause or Reset', instruction: 'Click "Pause" to stop or "Reset" to return the stopwatch to 00:00.00.' }
    ],
    realLifeExample: {
      title: 'Timing Sprint Intervals or Speed Drills',
      inputDescription: 'Track 3 consecutive laps around a 400m track.',
      outputDescription: 'Logs: Lap 1: 01:14.20, Lap 2: 01:12.85, Lap 3: 01:15.10. Total: 03:42.15.',
      details: [
        { label: 'Lap 1 Split', value: '01:14.20' },
        { label: 'Lap 2 Split', value: '01:12.85' },
        { label: 'Lap 3 Split', value: '01:15.10' }
      ]
    },
    howItWorks: 'Uses Date.now() timestamp differential tracking to prevent JavaScript thread throttling or drift.',
    faqs: [
      { question: 'Does the timer lose accuracy if I switch browser tabs?', answer: 'No, the stopwatch relies on absolute timestamp delta comparison (Date.now()), guaranteeing zero drift across tab switches.' },
      { question: 'How many laps can I record?', answer: 'You can record an unlimited number of laps with scrollable lap history.' }
    ],
    relatedToolSlugs: ['pomodoro-timer', 'days-between-dates', 'tally-counter']
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Strong Password Generator',
    category: 'security-privacy',
    shortDescription: 'Generate secure, uncrackable random passwords with custom length, symbols, and entropy score.',
    fullDescription: 'Create cryptographically secure passwords using the Web Crypto API. Customize length (8 to 64 chars), uppercase, lowercase, numbers, and special symbols with instant password strength & entropy scoring.',
    iconName: 'Lock',
    keywords: ['password generator', 'strong password', 'secure password generator', 'random password creator'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Choose Length', instruction: 'Adjust the slider to your desired character length (e.g., 16-24 chars).' },
      { step: 2, title: 'Select Characters', instruction: 'Toggle Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), and Symbols (!@#$).' },
      { step: 3, title: 'Generate & Copy', instruction: 'Click "Generate New Password" and copy to clipboard.' }
    ],
    realLifeExample: {
      title: 'Creating a Bulletproof Master Password for Email',
      inputDescription: 'Length: 20 characters, all character sets enabled.',
      outputDescription: 'Generated: "mK9#xP2$vL8!zR5@tQ1*" (130 bits of entropy - Very Strong)',
      details: [
        { label: 'Length', value: '20 characters' },
        { label: 'Strength', value: 'Very Strong (Entropy > 120 bits)' }
      ]
    },
    howItWorks: 'Draws random indices from uniform character pools using window.crypto.getRandomValues() to prevent pseudo-random predictability.',
    formula: {
      title: 'Password Entropy Formula',
      formula: 'E = L \\times \\log_2(N)',
      variables: [
        { symbol: 'E', meaning: 'Password entropy in bits' },
        { symbol: 'L', meaning: 'Password length in characters' },
        { symbol: 'N', meaning: 'Size of character pool (e.g. 94 for all ASCII printable symbols)' }
      ],
      explanation: 'Measures how many binary guesses an attacker must attempt to brute-force the password.',
      workedExample: 'Length 16 with 94 chars pool: 16 * log2(94) = 16 * 6.55 = 104.8 bits entropy.'
    },
    faqs: [
      { question: 'Is it safe to generate passwords online here?', answer: 'Yes! The password is generated entirely on your device using Web Crypto. It is never logged or transmitted over any network.' }
    ],
    relatedToolSlugs: ['uuid-generator', 'hash-generator']
  },
  {
    id: 'random-decision-picker',
    slug: 'random-decision-picker',
    name: 'Random Choice Picker & Decision Maker',
    category: 'everyday-utilities',
    shortDescription: 'Can\'t make up your mind? Enter your options and let the random selector pick fairly for you.',
    fullDescription: 'Enter any list of choices, lunch options, contest entries, or alternatives, and let the fair random picker select a winner with fun animated celebration.',
    iconName: 'HelpCircle',
    keywords: ['random picker', 'decision maker', 'random choice', 'pick for me', 'name picker'],
    howToSteps: [
      { step: 1, title: 'Enter Choices', instruction: 'Type your options, one per line or separated by commas.' },
      { step: 2, title: 'Spin / Pick', instruction: 'Click the "Pick a Choice!" button.' },
      { step: 3, title: 'See Winner', instruction: 'Celebrate the randomly selected outcome!' }
    ],
    realLifeExample: {
      title: 'Deciding Team Lunch Spot',
      inputDescription: 'Options: Pizza, Tacos, Sushi, Salad, Burgers.',
      outputDescription: 'The picker randomly selected: "Tacos".',
      details: [
        { label: 'Total Choices', value: '5 options' },
        { label: 'Selected Outcome', value: 'Tacos' }
      ]
    },
    howItWorks: 'Generates unbiased integer modulo over the length of the choices list using crypto-secure randomness.',
    faqs: [
      { question: 'Is the selection truly fair?', answer: 'Yes, each entered item has an exactly equal mathematical probability of selection.' }
    ],
    relatedToolSlugs: ['color-palette-generator', 'password-generator']
  },
  {
    id: 'color-palette-generator',
    slug: 'color-palette-generator',
    name: 'Color Palette Generator',
    category: 'color-design',
    shortDescription: 'Generate aesthetic, harmonic 5-color palettes with HEX codes for designers and developers.',
    fullDescription: 'Generate harmonious color palettes based on color theory (monochromatic, analogous, complementary, triad, or random). Lock colors you love and re-roll the rest, then copy HEX or CSS arrays.',
    iconName: 'Palette',
    keywords: ['color palette generator', 'palette maker', 'designer colors', 'hex palette'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Generate Palette', instruction: 'Click "Generate Palette" or press Spacebar.' },
      { step: 2, title: 'Lock Favorites', instruction: 'Click the lock icon on colors you want to keep.' },
      { step: 3, title: 'Copy HEX', instruction: 'Click any color swatch to copy its HEX value instantly.' }
    ],
    realLifeExample: {
      title: 'Creating Website Theme Colors',
      inputDescription: 'Generate palette matching RajToolBox pink accent.',
      outputDescription: '#EC4899, #FACC15, #FCE7F3, #18181B, #3B82F6',
      details: [
        { label: 'Primary', value: '#EC4899' },
        { label: 'Secondary', value: '#FACC15' }
      ]
    },
    howItWorks: 'Computes harmonic relationships on the 360° HSL color wheel with controlled saturation and lightness.',
    faqs: [
      { question: 'Can I export the entire palette as CSS variables?', answer: 'Yes, click "Export CSS" to copy ready-to-use :root CSS variables.' }
    ],
    relatedToolSlugs: ['color-converter', 'image-color-picker']
  },

  // DATE & TIME UTILITIES
  {
    id: 'days-between-dates',
    slug: 'days-between-dates',
    name: 'Days Between Dates & Date Difference',
    category: 'date-time-tools',
    shortDescription: 'Calculate exact days, weeks, months, and years between any two dates with working day options.',
    fullDescription: 'Calculate the precise duration between two dates. Displays total days, elapsed weeks, calendar months, remaining days, and total business working days (excluding weekends).',
    iconName: 'Calendar',
    keywords: ['days between dates', 'date difference', 'how many days until', 'date duration calculator'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Select Start Date', instruction: 'Pick the beginning date from the calendar.' },
      { step: 2, title: 'Select End Date', instruction: 'Pick the concluding date.' },
      { step: 3, title: 'View Duration', instruction: 'Read total calendar days, elapsed weeks, and working days.' }
    ],
    realLifeExample: {
      title: 'Calculating Remaining Days until Project Launch',
      inputDescription: 'Start: Today, End: December 31, 2026',
      outputDescription: 'Calculates exact days remaining, total weekends, and effective business days.',
      details: [
        { label: 'Total Calendar Days', value: 'Exact day difference' },
        { label: 'Business Days', value: 'Days excluding Saturday and Sunday' }
      ]
    },
    howItWorks: 'Converts date boundaries to UTC millisecond timestamps, computing delta = (t2 - t1) / 86,400,000 to eliminate DST discrepancies.',
    formula: {
      title: 'Date Difference Formula',
      formula: 'D = \\frac{\\text{Timestamp}_2 - \\text{Timestamp}_1}{86{,}400{,}000 \\text{ ms/day}}',
      variables: [
        { symbol: 'D', meaning: 'Number of calendar days' },
        { symbol: '86,400,000', meaning: 'Milliseconds in 24 hours (1000 * 60 * 60 * 24)' }
      ],
      explanation: 'Computes whole elapsed 24-hour cycles between UTC epoch representations.',
      workedExample: 'Start: June 1, End: June 11 -> 10 days difference.'
    },
    faqs: [
      { question: 'Does it take leap years into account?', answer: 'Yes, full Gregorian calendar leap year math is applied accurately.' }
    ],
    relatedToolSlugs: ['age-calculator', 'add-subtract-days']
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'date-time-tools',
    shortDescription: 'Calculate your exact age in years, months, days, hours, and minutes with next birthday countdown.',
    fullDescription: 'Find your precise chronological age today. Computes complete years, months, and days lived, total days passed since birth, day of the week you were born on, and days remaining until your next birthday.',
    iconName: 'UserCheck',
    keywords: ['age calculator', 'calculate my age', 'how old am i', 'exact age in days'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Enter Date of Birth', instruction: 'Select your birth date from the date picker.' },
      { step: 2, title: 'View Age Breakdown', instruction: 'Instantly view your age in years, months, and days.' },
      { step: 3, title: 'Check Next Birthday', instruction: 'See how many days until your next birthday!' }
    ],
    realLifeExample: {
      title: 'Determining Official Age for Application Form',
      inputDescription: 'Birth Date: March 15, 2000; As of today.',
      outputDescription: '26 Years, 6 Months, 15 Days (Total ~9,695 days lived, Born on Wednesday).',
      details: [
        { label: 'Exact Age', value: 'Years, Months, Days' },
        { label: 'Day of Week', value: 'Born on Wednesday' }
      ]
    },
    howItWorks: 'Evaluates year, month, and day increments adjusting for variable month lengths (28, 29, 30, 31 days).',
    faqs: [
      { question: 'Does it count leap years in total days?', answer: 'Yes, all leap year February 29ths are accounted for in total day counts.' }
    ],
    relatedToolSlugs: ['days-between-dates', 'add-subtract-days']
  },

  // EDUCATIONAL / GENERAL UTILITIES
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'educational-tools',
    shortDescription: 'Calculate percentage increase/decrease, what is X% of Y, and percentage of a whole value.',
    fullDescription: 'Solve any percentage problem effortlessly. Features three intuitive calculation modes: 1) What is X% of Y? 2) X is what percentage of Y? 3) Percentage increase or decrease from Value A to Value B with interactive visual comparison.',
    iconName: 'Percent',
    keywords: ['percentage calculator', 'calculate percentage', 'percent increase', 'percent decrease', 'percentage formula'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Choose Mode', instruction: 'Select "X% of Y", "X is what % of Y", or "Percentage Increase/Decrease".' },
      { step: 2, title: 'Enter Numbers', instruction: 'Fill in your values.' },
      { step: 3, title: 'View Result & Formula', instruction: 'Read the calculated answer, step-by-step math explanation, and visual bar.' }
    ],
    realLifeExample: {
      title: 'Calculating a Discount or Price Increase',
      inputDescription: 'Original price = 500, New price = 600',
      outputDescription: 'Percentage increase = +20% (600 - 500 = 100 increase; 100 / 500 = 0.20 = 20%)',
      details: [
        { label: 'Original Value (V1)', value: '500' },
        { label: 'New Value (V2)', value: '600' },
        { label: 'Change', value: '+20% Increase' }
      ]
    },
    howItWorks: 'Applies fundamental ratio arithmetic: Increase = ((V2 - V1) / V1) * 100.',
    formula: {
      title: 'Percentage Change Formula',
      formula: '\\text{Percentage Change (\\%)} = \\left( \\frac{V_2 - V_1}{V_1} \\right) \\times 100',
      variables: [
        { symbol: 'V_1', meaning: 'Initial or original value' },
        { symbol: 'V_2', meaning: 'New or final value' }
      ],
      explanation: 'Calculates relative fractional shift scaled per 100 units.',
      workedExample: 'Original = 500, New = 600 -> ((600 - 500) / 500) * 100 = (100 / 500) * 100 = 20%.'
    },
    graphConfig: {
      type: 'bar',
      title: 'Visual Value Comparison',
      description: 'Side-by-side comparison of original baseline vs new value.'
    },
    faqs: [
      { question: 'What does a negative percentage change mean?', answer: 'A negative result signifies a percentage decrease or discount (e.g. -15% off).' },
      { question: 'How do I calculate what percentage 45 is of 180?', answer: 'Select Mode 2: (45 / 180) * 100 = 25%.' }
    ],
    relatedToolSlugs: ['ratio-proportion-calculator', 'average-calculator', 'universal-unit-converter']
  },
  {
    id: 'ratio-proportion-calculator',
    slug: 'ratio-proportion-calculator',
    name: 'Ratio & Proportion Calculator',
    category: 'educational-tools',
    shortDescription: 'Solve ratio problems A:B = C:D, simplify ratios, and divide a total amount by ratio.',
    fullDescription: 'Solve for unknown variable X in proportions (A / B = C / X), simplify complex ratios to lowest terms (e.g. 1920:1080 -> 16:9), and scale aspect ratios for design and video projects.',
    iconName: 'Divide',
    keywords: ['ratio calculator', 'proportion calculator', 'solve ratio', 'simplify ratio', 'aspect ratio calculator'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Choose Mode', instruction: 'Select "Solve A:B = C:D" or "Simplify Ratio".' },
      { step: 2, title: 'Enter Numbers', instruction: 'Enter the three known values to find X, or enter A and B to simplify.' },
      { step: 3, title: 'Calculate', instruction: 'Instantly view the solved value and greatest common divisor breakdown.' }
    ],
    realLifeExample: {
      title: 'Scaling 16:9 Video Aspect Ratio to 720p Height',
      inputDescription: 'Ratio 16:9, target height D = 720. Solve for width C.',
      outputDescription: '16 / 9 = C / 720 -> C = (16 * 720) / 9 = 1,280. Result: 1280 × 720 px.',
      details: [
        { label: 'Aspect Ratio', value: '16 : 9' },
        { label: 'Known Height', value: '720 px' },
        { label: 'Calculated Width', value: '1,280 px' }
      ]
    },
    howItWorks: 'Uses cross-multiplication: A * D = B * C, thus unknown X = (B * C) / A, and Euclid\'s GCD algorithm for ratio simplification.',
    formula: {
      title: 'Proportion Cross-Multiplication Formula',
      formula: '\\frac{A}{B} = \\frac{C}{D} \\implies D = \\frac{B \\times C}{A}',
      variables: [
        { symbol: 'A, B', meaning: 'Antecedent and consequent of first ratio' },
        { symbol: 'C, D', meaning: 'Antecedent and consequent of second ratio' }
      ],
      explanation: 'In any true proportion, the product of the extremes equals the product of the means.',
      workedExample: 'A=16, B=9, C=1280 -> D = (9 * 1280) / 16 = 720.'
    },
    faqs: [
      { question: 'Can it simplify screen aspect ratios like 1920:1080?', answer: 'Yes! Enter 1920 and 1080 in the simplify mode, and it will divide by GCD (120) to output 16:9.' }
    ],
    relatedToolSlugs: ['percentage-calculator', 'average-calculator', 'image-resizer']
  },
  {
    id: 'average-calculator',
    slug: 'average-calculator',
    name: 'Average (Mean, Median, Mode) Calculator',
    category: 'educational-tools',
    shortDescription: 'Calculate arithmetic Mean, Median, Mode, Range, and Sum from any list of numbers.',
    fullDescription: 'Calculate fundamental statistical metrics from any dataset. Enter numbers separated by commas, spaces, or lines to find the Mean (average), Median (middle value), Mode (most frequent), Range, Minimum, Maximum, and Total Sum.',
    iconName: 'Calculator',
    keywords: ['average calculator', 'mean median mode', 'statistical average', 'calculate mean'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Enter Numbers', instruction: 'Paste or type numbers separated by commas or spaces.' },
      { step: 2, title: 'View Statistics', instruction: 'Read the Mean, Median, Mode, Range, and Sum.' },
      { step: 3, title: 'Review Steps', instruction: 'Inspect the formula and sorted order of the dataset.' }
    ],
    realLifeExample: {
      title: 'Calculating Average Exam Score for a Class',
      inputDescription: 'Scores: 85, 92, 78, 92, 88, 95',
      outputDescription: 'Mean: 88.33, Median: 90, Mode: 92, Range: 17 (78 to 95), Count: 6',
      details: [
        { label: 'Arithmetic Mean', value: '88.33' },
        { label: 'Median', value: '90' },
        { label: 'Mode', value: '92' }
      ]
    },
    howItWorks: 'Computes sum(X) / N for mean, sorts array for median index selection, and builds frequency map for mode detection.',
    formula: {
      title: 'Arithmetic Mean Formula',
      formula: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\dots + x_n}{n}',
      variables: [
        { symbol: 'x̄', meaning: 'Arithmetic mean (average)' },
        { symbol: 'n', meaning: 'Total number of values in dataset' },
        { symbol: 'x_i', meaning: 'Each individual numeric data point' }
      ],
      explanation: 'The sum of all numbers divided by the count of numbers.',
      workedExample: '(85 + 92 + 78 + 92 + 88 + 95) / 6 = 530 / 6 = 88.33.'
    },
    faqs: [
      { question: 'What is the difference between Mean and Median?', answer: 'Mean is the mathematical average (sum divided by count). Median is the middle number when values are sorted from lowest to highest, which is resilient against extreme outliers.' }
    ],
    relatedToolSlugs: ['percentage-calculator', 'ratio-proportion-calculator']
  },
  // EVERYDAY UTILITIES
  {
    id: 'tally-counter',
    slug: 'tally-counter',
    name: 'Digital Tally Counter & Goal Tracker',
    category: 'everyday-utilities',
    shortDescription: 'Free online digital clicker tally counter with custom step increments, goal progress, and instant reset.',
    fullDescription: 'Keep accurate count of event attendees, prayer mantras, inventory, habits, fitness reps, or lab experiments. Features a huge tap area, customizable step intervals (+1, +5, +10), goal progress bar, and instant subtraction.',
    iconName: 'Wrench',
    keywords: ['tally counter', 'clicker counter', 'digital clicker', 'count tracker', 'inventory counter'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Set Goal & Step', instruction: 'Optionally set your target goal count and step increment.' },
      { step: 2, title: 'Tap to Count', instruction: 'Click or tap anywhere on the large counter card to increment.' },
      { step: 3, title: 'Adjust or Reset', instruction: 'Use the minus button to decrement or the reset button to start fresh.' }
    ],
    realLifeExample: {
      title: 'Counting Attendees at Community Conference Door',
      inputDescription: 'Door volunteer clicks the counter card for every attendee entering.',
      outputDescription: 'Counter displays: 247 attendees (82% of 300 maximum room capacity).',
      details: [
        { label: 'Current Count', value: '247 attendees' },
        { label: 'Room Capacity Goal', value: '300 max' },
        { label: 'Remaining Seats', value: '53 seats' }
      ]
    },
    howItWorks: 'Maintains state in fast local browser memory with reactive re-rendering and high contrast numbers.',
    faqs: [
      { question: 'Can I decrease the count if I click by mistake?', answer: 'Yes, click the minus button to decrement by your selected step size.' },
      { question: 'Is there a limit on how high I can count?', answer: 'No, the counter comfortably supports numbers up to millions without lag.' }
    ],
    relatedToolSlugs: ['random-decision-picker', 'stopwatch-timer']
  },
  // FINANCE & CALCULATORS
  {
    id: 'loan-emi-calculator',
    slug: 'loan-emi-calculator',
    name: 'Loan EMI & Repayment Calculator',
    category: 'finance-calculators',
    shortDescription: 'Calculate monthly loan EMI, total interest payable, and overall loan repayment with visual breakdown.',
    fullDescription: 'Calculate exact Equated Monthly Installments (EMI) for home loans, auto loans, personal loans, or student loans. Features live interest-to-principal ratio calculation and clear repayment projections.',
    iconName: 'Calculator',
    keywords: ['loan emi calculator', 'emi calculator', 'mortgage payment calculator', 'loan repayment', 'interest calculator'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Enter Loan Amount', instruction: 'Type your total principal borrowing amount (e.g. $25,000).' },
      { step: 2, title: 'Set Annual Rate', instruction: 'Enter the annual percentage interest rate (e.g. 8.5%).' },
      { step: 3, title: 'Choose Tenure', instruction: 'Select loan duration in years (e.g. 5 years).' },
      { step: 4, title: 'Review Results', instruction: 'Examine monthly installment, total interest, and total payable amount.' }
    ],
    realLifeExample: {
      title: 'Financing an Auto Loan of $25,000 over 5 Years',
      inputDescription: 'Principal: $25,000, Interest: 8.5% annual, Tenure: 5 years (60 months).',
      outputDescription: 'Monthly EMI: $512.91, Total Interest: $5,774.87, Total Repayment: $30,774.87.',
      details: [
        { label: 'Principal Borrowed', value: '$25,000.00' },
        { label: 'Monthly Payment', value: '$512.91 / month' },
        { label: 'Total Interest', value: '$5,774.87' }
      ]
    },
    howItWorks: 'Applies standard banking amortization annuity formula EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where R is monthly rate and N is total months.',
    formula: {
      title: 'Standard Annuity EMI Formula',
      formula: 'EMI = \\frac{P \\times R \\times (1 + R)^N}{(1 + R)^N - 1}',
      variables: [
        { symbol: 'P', meaning: 'Principal loan amount' },
        { symbol: 'R', meaning: 'Monthly interest rate (Annual rate / 12 / 100)' },
        { symbol: 'N', meaning: 'Total number of monthly installments (Years × 12)' }
      ],
      explanation: 'Determines the fixed monthly sum required to fully amortize both principal and compound interest over the tenure.',
      workedExample: 'P=$10,000, R=0.00833 (10%/yr), N=12 -> EMI = $879.16/mo.'
    },
    faqs: [
      { question: 'What does EMI stand for?', answer: 'EMI stands for Equated Monthly Installment—a fixed payment amount made by a borrower to a lender at a specified date each calendar month.' },
      { question: 'Does paying off the loan earlier reduce total interest?', answer: 'Yes, prepayment directly reduces the outstanding principal balance upon which future interest is compounded.' }
    ],
    relatedToolSlugs: ['tip-discount-calculator', 'percentage-calculator']
  },
  {
    id: 'tip-discount-calculator',
    slug: 'tip-discount-calculator',
    name: 'Tip & Shopping Discount Calculator',
    category: 'finance-calculators',
    shortDescription: 'Split restaurant bills with custom tip percentages, and calculate retail sale discounts and sales taxes.',
    fullDescription: 'Two essential finance tools in one: effortlessly split restaurant bills with custom gratuity percentages among any number of diners, or compute retail markdowns, clearance sale discounts, and sales tax.',
    iconName: 'Calculator',
    keywords: ['tip calculator', 'bill splitter', 'discount calculator', 'sales tax calculator', 'clearance price'],
    popular: true,
    howToSteps: [
      { step: 1, title: 'Select Tool Mode', instruction: 'Choose between "Tip & Bill Splitter" or "Shopping Discount & Tax".' },
      { step: 2, title: 'Enter Numbers', instruction: 'Input bill or original price, percentage rate, and number of people.' },
      { step: 3, title: 'View Summary', instruction: 'Check total per person, tip amount, discount savings, or final checkout price.' }
    ],
    realLifeExample: {
      title: 'Splitting Dinner for 4 with 18% Tip',
      inputDescription: 'Bill: $120.00, Tip: 18%, Split between 4 diners.',
      outputDescription: 'Tip: $21.60, Total: $141.60. Each person pays exactly $35.40.',
      details: [
        { label: 'Food Subtotal', value: '$120.00' },
        { label: '18% Gratuity', value: '$21.60' },
        { label: 'Per Diner Share', value: '$35.40' }
      ]
    },
    howItWorks: 'Multiplies input price by percentage basis points to calculate deductions or gratuities with 2-decimal currency precision.',
    faqs: [
      { question: 'What is a standard restaurant tip percentage?', answer: 'In the US and Canada, standard restaurant tipping is typically 15% to 20% for good table service.' },
      { question: 'Does this calculate tax on discounted price?', answer: 'Yes! In discount mode, sales tax is calculated on the discounted price rather than the original MSRP.' }
    ],
    relatedToolSlugs: ['loan-emi-calculator', 'percentage-calculator']
  },

  // ==========================================
  // EXAM & ELIGIBILITY TOOLS
  // ==========================================
  {
    id: 'exam-eligibility-checker',
    slug: 'exam-eligibility-checker',
    name: 'Exam Eligibility Checker',
    category: 'exam-eligibility-tools',
    shortDescription: 'Check age limits, category relaxations (OBC, SC, ST, PwD), and educational criteria for SSC, Railway, UPSC, Banking & Defence recruitments.',
    fullDescription: 'Comprehensive examination eligibility evaluator for major Indian recruitments including SSC CGL, RRB NTPC, UPSC Civil Services, IBPS, SBI, and defence entries. Accurately determines whether your date of birth falls within official cut-off bands, calculates reservation age relaxations, and checks qualification status.',
    iconName: 'Award',
    keywords: ['exam eligibility checker', 'ssc cgl eligibility', 'upsc age limit checker', 'rrb ntpc eligibility', 'govt exam age calculator', 'obc age relaxation calculator', 'ssc chsl eligibility', 'bank exam eligibility'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Select Examination', instruction: 'Choose your target exam from SSC, Railway, UPSC, Banking, Defence, or Teaching.' },
      { step: 2, title: 'Enter Date of Birth & Category', instruction: 'Select your date of birth and social reservation category (General, EWS, OBC, SC/ST, PwD, ESM).' },
      { step: 3, title: 'Check Instant Status', instruction: 'View exact eligibility status, relaxed age limits, and official reference date breakdown.' }
    ],
    realLifeExample: {
      title: 'Evaluating SSC CGL Candidate Born 15-Jan-1996 in OBC Category',
      inputDescription: 'DOB: 15-01-1996, Category: OBC, Degree: Bachelor of Commerce (Graduate), Ref Date: 01-08-2026.',
      outputDescription: 'Age on Ref Date: 30 Years 6 Months. Unreserved max age is 32 years, OBC relaxation extends upper limit to 35 years. Status: ELIGIBLE.',
      details: [
        { label: 'Exact Age', value: '30y 6m 17d' },
        { label: 'UR Limit', value: '32 Years' },
        { label: 'OBC Limit', value: '35 Years' },
        { label: 'Overall Status', value: 'Eligible' }
      ]
    },
    howItWorks: 'Evaluates candidate birth date against official notification reference dates, adds statutory reservation increments, and verifies educational requirements.',
    faqs: [
      { question: 'What is the standard reference date for age calculation?', answer: 'Most central recruitment commissions (like SSC and UPSC) set August 1 of the exam year as the reference date, while Railways typically uses July 1.' },
      { question: 'Are final year graduate students eligible to apply?', answer: 'For exams like UPSC CSE and SBI PO, final year appearing students can apply provisionally, provided they produce degree proof before mains/interviews.' }
    ],
    relatedToolSlugs: ['age-limit-calculator', 'negative-marking-calculator', 'exam-photo-signature-resizer', 'in-hand-salary-estimator']
  },
  {
    id: 'age-limit-calculator',
    slug: 'age-limit-calculator',
    name: 'Age Limit Calculator for Exams',
    category: 'exam-eligibility-tools',
    shortDescription: 'Calculate your exact age on official recruitment cut-off dates (Years, Months, Days) with category-wise reservation tables.',
    fullDescription: 'Precision age calculator calibrated for government and competitive job notifications. Calculates your exact age in years, months, and days as of any specific reference date (such as August 1 or July 1), and displays category-wise maximum age limits for General, OBC, SC/ST, and PwD applicants.',
    iconName: 'Calendar',
    keywords: ['age limit calculator', 'ssc age calculator', 'exam age calculator', 'upsc age calculator as on august 1', 'railway age calculator as on july 1', 'age calculator for govt jobs', 'calculate age on cutoff date'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Enter Date of Birth', instruction: 'Select your birth date on the interactive calendar picker.' },
      { step: 2, title: 'Set Cut-Off Date', instruction: 'Choose a quick exam preset (SSC Aug 1, RRB July 1, etc.) or specify a custom reference date.' },
      { step: 3, title: 'View Age Decomposition', instruction: 'Get exact age in years, months, days, total elapsed days, and category eligibility.' }
    ],
    realLifeExample: {
      title: 'Age Calculation as of August 1, 2026',
      inputDescription: 'DOB: 12-04-2001, Reference Date: 01-08-2026.',
      outputDescription: 'Age: 25 Years, 3 Months, 20 Days (9,242 total days). Eligible for all 18-27, 18-30, and 21-32 age bands.',
      details: [
        { label: 'Calculated Age', value: '25y 3m 20d' },
        { label: 'Total Days', value: '9,242' },
        { label: 'Born On', value: 'Thursday' }
      ]
    },
    howItWorks: 'Calculates the calendar difference between date of birth and cut-off date with month-length normalization and leap-year accounting.',
    faqs: [
      { question: 'Why does my age differ from simple year subtraction?', answer: 'Recruitment boards calculate age down to the exact day. Simple subtraction ignores birth months and days, leading to false ineligibility assumptions.' }
    ],
    relatedToolSlugs: ['exam-eligibility-checker', 'negative-marking-calculator', 'days-between-dates']
  },
  {
    id: 'negative-marking-calculator',
    slug: 'negative-marking-calculator',
    name: 'Negative Marking & Score Calculator',
    category: 'exam-eligibility-tools',
    shortDescription: 'Calculate gross score, negative penalty, net marks, and accuracy percentage for SSC, RRB, UPSC, Banking, JEE & NEET exams.',
    fullDescription: 'Comprehensive marks and negative penalty calculator for competitive tests. Features instant presets for SSC CGL (+2, -0.50), RRB NTPC (+1, -0.33), UPSC Prelims (+2, -0.66), Banking (+1, -0.25), JEE Main (+4, -1), NEET UG (+4, -1), and custom test series with detailed accuracy analytics.',
    iconName: 'Calculator',
    keywords: ['negative marking calculator', 'ssc cgl marks calculator', 'neet marks calculator', 'jee negative marking', 'rrb ntpc marks calculator', 'upsc prelims marks calculator', 'exam score calculator', 'negative marks formula'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Choose Exam Scheme', instruction: 'Select your exam preset or configure custom question count, positive marks, and penalty.' },
      { step: 2, title: 'Enter Attempts & Correct', instruction: 'Enter total attempted questions and correct answers. Incorrect answers calculate automatically.' },
      { step: 3, title: 'Inspect Net Marks', instruction: 'Review gross positive marks, negative deduction, net score, and accuracy percentage.' }
    ],
    realLifeExample: {
      title: 'SSC CGL Tier-1 Marks Evaluation',
      inputDescription: 'Total: 100 Qs, Attempted: 85, Correct: 72 (+2 each), Wrong: 13 (-0.5 each).',
      outputDescription: 'Gross Marks: 144.0. Negative Penalty: -6.50. Net Final Score: 137.50 / 200 (68.75%). Accuracy: 84.7%.',
      details: [
        { label: 'Gross Marks', value: '+144.0' },
        { label: 'Negative Penalty', value: '-6.50' },
        { label: 'Net Score', value: '137.50 / 200' },
        { label: 'Accuracy', value: '84.7%' }
      ]
    },
    howItWorks: 'Computes Net Score = (Correct * PositiveMark) - (Incorrect * NegativePenalty) with accuracy rate and percentile metrics.',
    faqs: [
      { question: 'What is the 1/3rd negative marking in Railway and UPSC exams?', answer: 'In 1/3rd negative marking, 0.33 marks (or 1/3 of the positive mark) are deducted for every incorrect attempt, meaning 3 wrong answers cancel 1 correct answer.' }
    ],
    relatedToolSlugs: ['exam-eligibility-checker', 'age-limit-calculator', 'percentage-calculator']
  },
  {
    id: 'exam-photo-signature-resizer',
    slug: 'exam-photo-signature-resizer',
    name: 'Exam Photo & Signature Resizer',
    category: 'exam-eligibility-tools',
    shortDescription: 'Resize photos and signatures to exact portal specifications (20–50 KB, 10–20 KB, 3.5×4.5 cm) 100% locally in your browser.',
    fullDescription: 'Client-side photo and signature formatter tailored for government recruitment portals (SSC, UPSC OTR, RRB Railway, IBPS, SBI, CTET, NTA). Crops to official aspect ratios and compresses file sizes into compliant KB windows with zero file uploads.',
    iconName: 'Image',
    keywords: ['exam photo resizer', 'ssc photo resizer 20 to 50 kb', 'ssc signature resizer 10 to 20 kb', 'upsc photo resizer 350x350', 'online photo resizer for govt exam', 'rrb photo compressor', 'passport photo 3.5x4.5 cm online'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Pick Portal Preset', instruction: 'Select SSC, UPSC, RRB, Banking, or NTA portal format for photo or signature.' },
      { step: 2, title: 'Select Local Image', instruction: 'Upload your photo or signature file from your phone or computer.' },
      { step: 3, title: 'Download Compliant File', instruction: 'Fine-tune target KB with the slider and download the portal-ready JPG file.' }
    ],
    realLifeExample: {
      title: 'Compressing a 2.4 MB Smartphone Photo for SSC Portal',
      inputDescription: 'Source Photo: 2.4 MB (3024x4032 px), Target: SSC Photo (20–50 KB, 3.5x4.5 cm).',
      outputDescription: 'Processed file: 350x450 px at exactly 38.4 KB on pure white background. Meets 100% of SSC upload requirements.',
      details: [
        { label: 'Original Size', value: '2.4 MB' },
        { label: 'Final Size', value: '38.4 KB' },
        { label: 'Dimensions', value: '350 x 450 px' },
        { label: 'Compliance', value: '100% Portal Valid' }
      ]
    },
    howItWorks: 'Uses HTML5 Canvas to crop to exact dimensions and runs binary search quality optimization to land within official KB constraints.',
    faqs: [
      { question: 'Is my photo uploaded to your server?', answer: 'No! Processing occurs 100% within your local web browser sandbox. No photo or signature is ever uploaded to any server.' },
      { question: 'Why do exam portals reject signatures?', answer: 'Signatures are rejected if they exceed file size limits, have dark grey backgrounds, or are signed in capital letters.' }
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'exam-eligibility-checker']
  },

  // ==========================================
  // CAREER & JOB TOOLS
  // ==========================================
  {
    id: 'in-hand-salary-estimator',
    slug: 'in-hand-salary-estimator',
    name: 'In-Hand Salary Estimator (7th CPC)',
    category: 'career-job-tools',
    shortDescription: 'Calculate monthly in-hand take-home salary across 7th Central Pay Commission Levels 1 to 14 with DA, HRA, TA & NPS deductions.',
    fullDescription: 'Comprehensive central government and PSU in-hand salary estimator based on 7th Central Pay Commission rules. Calculates Basic Pay, 50% Dearness Allowance (DA), City-tier House Rent Allowance (X: 30%, Y: 20%, Z: 10%), Transport Allowance (TA), and NPS deductions to compute take-home pay.',
    iconName: 'Briefcase',
    keywords: ['in hand salary estimator', '7th cpc salary calculator', 'ssc cgl in hand salary', 'aso css salary', 'ias in hand salary level 10', 'govt employee salary slip calculator', '7th pay commission monthly salary'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Select Pay Level', instruction: 'Choose your Pay Matrix Level from Level 1 (MTS) up to Level 10 (UPSC IAS/IPS).' },
      { step: 2, title: 'Select City Tier', instruction: 'Pick posting city category: X (Metros 30% HRA), Y (Tier-2 20%), or Z (10%).' },
      { step: 3, title: 'Review Take-Home Slip', instruction: 'Inspect gross salary, NPS contribution, medical deductions, and net monthly take-home pay.' }
    ],
    realLifeExample: {
      title: 'Level 7 Officer (ASO / Inspector) in Delhi (X City)',
      inputDescription: 'Level 7 (GP 4600), Basic: ₹44,900, DA: 50%, HRA: 30% (X City), TA: ₹3,600 + DA.',
      outputDescription: 'Gross Salary: ₹86,220. Deductions (NPS ₹6,735 + CGHS ₹650 + CGEGIS ₹60 + Prof Tax ₹200) = ₹7,645. Net In-Hand: ₹78,575 / month.',
      details: [
        { label: 'Basic Pay', value: '₹44,900' },
        { label: 'Gross Salary', value: '₹86,220' },
        { label: 'Deductions', value: '₹7,645' },
        { label: 'Net Take-Home', value: '₹78,575 / mo' }
      ]
    },
    howItWorks: 'Applies standard central government pay formulas: Gross = Basic + DA + HRA + TA, Net = Gross - (10% NPS + CGHS + Taxes).',
    faqs: [
      { question: 'What are X, Y, and Z cities in central government postings?', answer: 'X cities are major metropolitan hubs (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, Ahmedabad) receiving 30% HRA. Y cities are other state capitals receiving 20%, and Z cities receive 10%.' }
    ],
    relatedToolSlugs: ['loan-emi-calculator', 'exam-eligibility-checker', 'job-qualification-matcher']
  },
  {
    id: 'job-qualification-matcher',
    slug: 'job-qualification-matcher',
    name: 'Job Qualification Matcher',
    category: 'career-job-tools',
    shortDescription: 'Match your degree, percentage, and stream against government and private recruitment eligibility criteria.',
    fullDescription: 'Interactive educational qualification analyzer that matches your degree (10th, 12th, Diploma, Bachelor, Engineering, Master) against verified recruitment eligibility criteria across major Indian exam authorities.',
    iconName: 'CheckCircle2',
    keywords: ['job qualification matcher', 'eligibility for govt jobs after graduation', 'jobs after 12th', 'ssc eligibility by qualification', 'rrb jobs for diploma holders', 'degree qualification checker'],
    popular: false,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Select Education Level', instruction: 'Choose your highest completed educational milestone.' },
      { step: 2, title: 'Enter Marks / Stream', instruction: 'Specify your academic aggregate percentage.' },
      { step: 3, title: 'Explore Matched Roles', instruction: 'Review list of eligible national recruitment examinations.' }
    ],
    realLifeExample: {
      title: 'Matching 3-Year Diploma Holder in Mechanical Engineering',
      inputDescription: 'Education: 3-Year Diploma, Aggregate: 70%.',
      outputDescription: 'Matched Exams: RRB Junior Engineer (JE), RRB Assistant Loco Pilot (ALP), SSC JE Mechanical, State Electricity Boards.',
      details: [
        { label: 'Education', value: 'Diploma' },
        { label: 'Matched Opportunities', value: 'RRB JE, SSC JE, ALP' }
      ]
    },
    howItWorks: 'Cross-references academic streams against educational standards defined in official recruitment rules.',
    faqs: [
      { question: 'Can distance education degrees apply for central exams?', answer: 'Yes, degrees from UGC/DEB recognized universities are valid for all central recruitment exams.' }
    ],
    relatedToolSlugs: ['exam-eligibility-checker', 'in-hand-salary-estimator']
  },

  // ==========================================
  // LANGUAGE & WRITING TOOLS
  // ==========================================
  {
    id: 'ielts-band-calculator',
    slug: 'ielts-band-calculator',
    name: 'IELTS Band Score Calculator',
    category: 'language-writing-tools',
    shortDescription: 'Calculate overall IELTS band score from Listening, Reading, Writing & Speaking with official rounding rules and raw score conversion.',
    fullDescription: 'Official IELTS band score calculator with accurate half-band rounding algorithm (0.25 rounds up to 0.5, 0.75 rounds up to next whole band). Features practice test raw score conversion (out of 40) for Academic and General Training Reading and Listening, and maps to CEFR and TOEFL equivalents.',
    iconName: 'Award',
    keywords: ['ielts band calculator', 'ielts score calculator', 'ielts reading raw score to band', 'ielts listening band calculator', 'ielts overall band score calculation', 'cefr to ielts conversion', 'toefl to ielts score equivalent'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Set Skill Scores', instruction: 'Adjust sliders for Listening, Reading, Writing, and Speaking from 0 to 9.' },
      { step: 2, title: 'View Overall Band', instruction: 'Inspect the calculated overall band score with official rounding logic.' },
      { step: 3, title: 'Check CEFR & TOEFL', instruction: 'View mapped CEFR proficiency level (B2, C1, C2) and TOEFL iBT equivalents.' }
    ],
    realLifeExample: {
      title: 'Calculating Overall Band for L: 7.5, R: 7.0, W: 6.5, S: 7.0',
      inputDescription: 'Listening: 7.5, Reading: 7.0, Writing: 6.5, Speaking: 7.0. Average: 7.0.',
      outputDescription: 'Overall Band Score: 7.0 (C1 Advanced). Matches university admission requirements worldwide.',
      details: [
        { label: 'Exact Average', value: '7.000' },
        { label: 'Overall Band', value: '7.0' },
        { label: 'CEFR Level', value: 'C1' },
        { label: 'TOEFL Equiv', value: '94 – 114' }
      ]
    },
    howItWorks: 'Applies official British Council / IDP rounding rule: averages ending in .25 round up to .5; averages ending in .75 round up to the next full band.',
    faqs: [
      { question: 'What is the official IELTS rounding rule for .25 and .75?', answer: 'If the average of the 4 sections ends in .25, it rounds up to the next half band (.5). If it ends in .75, it rounds up to the next whole band.' }
    ],
    relatedToolSlugs: ['reading-time-speed-calculator', 'word-counter', 'text-case-converter']
  },
  {
    id: 'reading-time-speed-calculator',
    slug: 'reading-time-speed-calculator',
    name: 'Reading Speed & WPM Calculator',
    category: 'language-writing-tools',
    shortDescription: 'Measure your words-per-minute (WPM) reading speed and estimate reading times for exam comprehension passages.',
    fullDescription: 'Interactive speed-reading timer and analyzer for competitive exams and language tests (IELTS, TOEFL, SAT, UPSC). Accurately calculates Words Per Minute (WPM), compares against benchmarks, and assists in pacing long editorial passages.',
    iconName: 'PenTool',
    keywords: ['reading speed calculator', 'wpm calculator', 'words per minute reading test', 'ielts reading speed', 'speed reading test online', 'estimate reading time'],
    popular: false,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Paste or Use Text', instruction: 'Read the sample editorial passage or paste your own study text.' },
      { step: 2, title: 'Start & Stop Timer', instruction: 'Click "Start Timer", read at normal comprehension pace, and click "I Finished".' },
      { step: 3, title: 'Review Speed Metrics', instruction: 'Check your WPM rating against exam aspirant target benchmarks.' }
    ],
    realLifeExample: {
      title: 'Measuring Reading Speed for a 350-Word Editorial',
      inputDescription: 'Passage: 350 words, Reading Duration: 70 seconds.',
      outputDescription: 'Reading Speed: 300 WPM. Reaches the target speed required for competitive reading comprehension.',
      details: [
        { label: 'Words Read', value: '350' },
        { label: 'Duration', value: '70s' },
        { label: 'Speed', value: '300 WPM' }
      ]
    },
    howItWorks: 'Computes WPM = (WordCount / ElapsedSeconds) * 60 with standard comprehension benchmarks.',
    faqs: [
      { question: 'What is a good reading speed for competitive exams?', answer: 'Most exam toppers read between 280 and 350 words per minute to complete comprehension sections comfortably within time limits.' }
    ],
    relatedToolSlugs: ['word-counter', 'ielts-band-calculator', 'text-cleaner']
  },

  // ==========================================
  // STUDY & TEST PREPARATION TOOLS
  // ==========================================
  {
    id: 'study-timetable-planner',
    slug: 'study-timetable-planner',
    name: 'Study Timetable & Revision Planner',
    category: 'study-test-prep-tools',
    shortDescription: 'Generate personalized daily study timetables with countdown trackers, revision cycles, and weak subject focus slots.',
    fullDescription: 'Structured daily study routine generator for competitive exam aspirants. Calculates days and weeks remaining until your target exam, distributes study hours across core subjects, prioritizes weak areas in peak-focus morning slots, and formats exportable revision routines.',
    iconName: 'BookMarked',
    keywords: ['study timetable planner', 'exam study planner', 'revision schedule generator', 'daily study routine for ssc cgl', 'upsc study timetable generator', 'exam preparation planner'],
    popular: true,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Enter Exam Details', instruction: 'Input your target exam name and examination date.' },
      { step: 2, title: 'Set Hours & Weak Areas', instruction: 'Choose daily study commitment and specify your primary weak subject.' },
      { step: 3, title: 'Generate Routine', instruction: 'Get structured hourly slots covering deep focus, practice, reading, and mock review.' }
    ],
    realLifeExample: {
      title: 'Study Routine for SSC CGL with 150 Days Remaining',
      inputDescription: 'Exam: SSC CGL 2026, Daily Target: 6 Hours, Weak Area: Quantitative Aptitude.',
      outputDescription: 'Generated daily routine allocating morning focus to Math concepts, afternoon to GK/English, evening to timed mock drills.',
      details: [
        { label: 'Days Remaining', value: '150 Days' },
        { label: 'Total Study Hours', value: '900 Hours' },
        { label: 'Peak Slot', value: 'Math Deep Work' }
      ]
    },
    howItWorks: 'Structures daily timeboxing aligned with cognitive alertness cycles, interleaving practice and recall.',
    faqs: [
      { question: 'How many hours should I study daily for competitive exams?', answer: 'Quality and consistency matter more than sheer hours. 6 to 8 hours of focused, distraction-free study is optimal for most candidates.' }
    ],
    relatedToolSlugs: ['exam-accuracy-speed-analyzer', 'pomodoro-timer', 'stopwatch-timer']
  },
  {
    id: 'exam-accuracy-speed-analyzer',
    slug: 'exam-accuracy-speed-analyzer',
    name: 'Exam Accuracy & Speed Analyzer',
    category: 'study-test-prep-tools',
    shortDescription: 'Analyze question-solving pacing, seconds per question, and accuracy curves to improve mock test scores.',
    fullDescription: 'Mock test performance and pacing analyzer. Evaluates your solving speed in seconds per question, questions per hour pacing, and accuracy percentages to help competitive aspirants eliminate rushing errors and optimize time management.',
    iconName: 'Target',
    keywords: ['exam accuracy calculator', 'mock test speed analyzer', 'seconds per question calculator', 'test solving speed', 'exam time management tool', 'mock test accuracy percentage'],
    popular: false,
    featured: true,
    howToSteps: [
      { step: 1, title: 'Enter Test Data', instruction: 'Input total questions, attempted questions, and correct answers from your mock test.' },
      { step: 2, title: 'Set Time Taken', instruction: 'Enter the session duration in minutes.' },
      { step: 3, title: 'Analyze Metrics', instruction: 'Review accuracy percentage, average seconds per question, and pacing recommendations.' }
    ],
    realLifeExample: {
      title: 'Mock Test Speed & Accuracy Review',
      inputDescription: 'Total: 100 Qs, Attempted: 80, Correct: 68, Time: 60 Minutes.',
      outputDescription: 'Accuracy: 85.0%, Average Time per Question: 45 seconds (80 Qs/hr). Recommended: Reduce calculation time on math to reach 90+ attempts.',
      details: [
        { label: 'Accuracy', value: '85.0%' },
        { label: 'Speed', value: '45s / question' },
        { label: 'Hourly Pacing', value: '80 Q/hr' }
      ]
    },
    howItWorks: 'Calculates accuracy rates and pacing ratios to identify whether score bottlenecks stem from conceptual gaps or time allocation.',
    faqs: [
      { question: 'What is an ideal accuracy rate in competitive exams?', answer: 'Aim for 85% to 90% accuracy. Rushing to achieve more attempts with accuracy dropping below 75% usually lowers net scores due to negative marking.' }
    ],
    relatedToolSlugs: ['study-timetable-planner', 'negative-marking-calculator', 'pomodoro-timer']
  }
];

export const POPULAR_TOOLS = TOOLS_REGISTRY.filter((t) => t.popular);
export const FEATURED_TOOLS = TOOLS_REGISTRY.filter((t) => t.featured);

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(categoryId: string): ToolItem[] {
  return TOOLS_REGISTRY.filter((t) => t.category === categoryId);
}
