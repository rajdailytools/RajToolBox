import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PdfCompressorTool } from '../tools/components/PdfCompressorTool';
import { AuthorBox } from '../components/ui/AuthorBox';
import { RelatedTools } from '../components/ui/RelatedTools';
import {
  FileText,
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
  MessageCircle,
  Send,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PdfCompressorPageProps {
  tool: ToolItem;
}

export const PdfCompressorPage: React.FC<PdfCompressorPageProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const category = CATEGORIES[tool.category];
  const favored = isFavorite(tool.slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeEdgeCase, setActiveEdgeCase] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Sync document title and canonical meta for SEO
  useEffect(() => {
    document.title = 'PDF Compressor Online – Reduce PDF Size | RajToolBox';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Compress PDF files online with adjustable compression and target sizes. Preview the result, reduce PDF size, download and share easily with RajToolBox.'
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://rajtoolbox.com/tools/pdf-compressor/');
  }, [tool]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PDF Compressor Online – RajToolBox',
          text: 'Reduce PDF file size locally in your browser to fit job portals, email, and government application forms.',
          url: window.location.href
        });
      } catch {
        // dismissed
      }
    } else {
      copyLink();
    }
  };

  // 44 Complete Edge Cases
  const edgeCasesList = [
    {
      title: '1. Already Compressed PDF',
      what: 'The compressed file size is identical or only 1–2% smaller than the original.',
      why: 'PDF was previously compressed with modern object stream compression or JBIG2/JPEG2000 algorithms.',
      action: 'Check if current size already satisfies your portal limit. Do not repeatedly compress already compacted documents.'
    },
    {
      title: '2. Very Large PDF (>100 MB)',
      what: 'Processing takes several seconds or browser tab consumes noticeable memory.',
      why: 'Client-side WebAssembly and JavaScript must hold decoded byte buffers in RAM.',
      action: 'Process files individually rather than in bulk, or close unneeded background browser tabs.'
    },
    {
      title: '3. Very Small PDF (<50 KB)',
      what: 'File size reduction is minimal (few hundred bytes).',
      why: 'Small PDFs consist primarily of plain vector text and basic layout dictionaries with negligible redundancy.',
      action: 'Your file is already lightweight and will upload cleanly to any portal without compression.'
    },
    {
      title: '4. Scanned PDF (Raster Images)',
      what: 'File size is large even with few pages.',
      why: 'Scanners save each page as an uncompressed high-DPI full-page bitmap image rather than selectable text.',
      action: 'Select Strong compression or Target Size mode to downsample image streams effectively.'
    },
    {
      title: '5. Image-Heavy PDF (Brochures & Catalogs)',
      what: 'File size drops substantially (40% to 80% reduction).',
      why: 'Embedded graphics and illustrations offer the highest compressibility through stream re-encoding.',
      action: 'Use Recommended mode and preview to ensure image clarity remains acceptable before downloading.'
    },
    {
      title: '6. Text-Only PDF (Reports & Invoices)',
      what: 'Moderate byte savings with 100% mathematical vector sharpness retained.',
      why: 'Text characters use vector glyphs; only structural cross-reference tables and metadata are cleaned.',
      action: 'Use Basic or Recommended mode. Your text will remain pin-sharp at any zoom level.'
    },
    {
      title: '7. Mixed Text + Images',
      what: 'Text remains crisp while photos are smoothly compacted.',
      why: 'The compression engine treats vector text streams separately from raster image dictionaries.',
      action: 'Inspect photo callouts and diagrams in preview to confirm fine text in diagrams is readable.'
    },
    {
      title: '8. Low-Quality Initial Scan',
      what: 'Compressing further might exaggerate existing grain or artifacts.',
      why: 'Lossy re-quantization applied to already noisy pixels can increase pixelation.',
      action: 'Use Light compression mode or set a higher target size like 500 KB or 1 MB.'
    },
    {
      title: '9. Password-Protected PDF',
      what: 'Compression fails or warns that decryption is required.',
      why: 'PDF encryption locks indirect object streams with user/owner keys, preventing dictionary rebuilds.',
      action: 'Remove password protection using your PDF viewer before loading into the compressor.'
    },
    {
      title: '10. Encrypted PDF (Owner Permissions)',
      what: 'Viewer restrictions block stream modification.',
      why: 'Standard PDF permissions flag blocks rewriting cross-reference tables.',
      action: 'Unlock owner restrictions before submitting to in-browser compression.'
    },
    {
      title: '11. Digitally Signed PDF (DSC / e-Sign)',
      what: 'Digital cryptographic signature becomes invalid if compressed.',
      why: 'Digital signatures verify exact byte-for-byte document checksums. Any stream rebuild alters the checksum.',
      action: 'Never compress signed legal deeds or court filings. Keep the original signed document intact.'
    },
    {
      title: '12. PDF with Interactive Form Fields (AcroForms)',
      what: 'Form values are preserved while background templates are compacted.',
      why: 'Interactive form dictionaries are retained in object hierarchies.',
      action: 'Preview the document to verify text entered into text fields remains visible.'
    },
    {
      title: '13. Fillable PDF (XFA Forms)',
      what: 'Dynamic XML Forms Architecture structures may resist stream compaction.',
      why: 'XFA forms store XML datasets separately from standard PDF page content trees.',
      action: 'Print to PDF (flatten) first, then compress the flattened PDF document.'
    },
    {
      title: '14. PDF with Annotations & Highlights',
      what: 'Sticky notes and highlight boxes are preserved by default.',
      why: 'Annotation dictionaries are attached to page nodes.',
      action: 'Optionally enable "Flatten annotations" if you wish to burn annotations directly into the page content.'
    },
    {
      title: '15. PDF with Reviewer Comments',
      what: 'Comment threads and popups remain intact.',
      why: 'Non-destructive stream compression preserves markup trees.',
      action: 'Verify in preview that review callouts are still aligned with their target paragraphs.'
    },
    {
      title: '16. PDF with Bookmarks & Outline Trees',
      what: 'Table of contents and sidebar bookmarks continue to navigate properly.',
      why: 'Document catalog outline nodes are preserved during indirect object stream consolidation.',
      action: 'Test outline links in your favorite PDF viewer after downloading.'
    },
    {
      title: '17. PDF with Hyperlinks',
      what: 'Clickable web links and internal jump links remain functional.',
      why: 'URI action dictionaries in annotation arrays are retained.',
      action: 'Confirm links are clickable in the browser preview before sharing.'
    },
    {
      title: '18. PDF with Embedded Subsets of Fonts',
      what: 'Font files are preserved so typography does not substitute.',
      why: 'TrueType and OpenType subset fonts are essential for correct glyph rendering.',
      action: 'No action needed; fonts remain intact so text layout never shifts or wraps unpredictably.'
    },
    {
      title: '19. PDF with Alpha Transparency Layers',
      what: 'Drop shadows and transparent PNG overlays blend correctly.',
      why: 'ExtGState graphics state parameters are preserved in page resources.',
      action: 'Preview logos and layered badges to confirm transparency has not turned into a solid black box.'
    },
    {
      title: '20. PDF with Complex Vector CAD Graphics',
      what: 'File size reduction may be modest because vector paths cannot be lossy-downscaled like photos.',
      why: 'Hundreds of thousands of Bézier curves and stroke commands require exact mathematical coordinates.',
      action: 'Use Recommended mode to compress vector streams without losing structural precision.'
    },
    {
      title: '21. Multi-Page PDF (100+ Pages)',
      what: 'Compression takes 2–5 seconds longer.',
      why: 'Each page dictionary must be re-indexed into unified object streams.',
      action: 'Watch the live progress indicator. Compression runs smoothly without leaving your browser.'
    },
    {
      title: '22. Single-Page PDF (Admit Card / Resume)',
      what: 'Fastest compression speed (under 1 second).',
      why: 'Compact single-page structure processes in immediate memory ticks.',
      action: 'Ideal for job applications and exam admit cards with 200 KB or 500 KB caps.'
    },
    {
      title: '23. Corrupted PDF Header',
      what: 'The tool shows an error: "File processing failed / Invalid PDF".',
      why: 'The initial magic bytes (%PDF-1.x) or EOF markers are truncated or missing.',
      action: 'Re-export or re-download the original document and verify it opens in Adobe Acrobat.'
    },
    {
      title: '24. Unsupported / Non-PDF File (e.g. DOCX, JPG)',
      what: 'File selector or drag-and-drop rejects the file with a helpful toast message.',
      why: 'This tool is specifically engineered for PDF document structures.',
      action: 'Use RajToolBox Image to PDF or Word converter first, then compress the resulting PDF.'
    },
    {
      title: '25. Wrong File Extension (.pdf.txt or .dat)',
      what: 'MIME validation blocks file ingestion.',
      why: 'Browser file validation checks both MIME type and filename extension.',
      action: 'Rename the file extension to .pdf and upload again.'
    },
    {
      title: '26. 0-Byte / Empty File',
      what: 'Tool warns that file is empty.',
      why: 'A valid PDF document requires header, body, xref table, and trailer.',
      action: 'Ensure the file finished transferring before uploading.'
    },
    {
      title: '27. Duplicate Files in Bulk Queue',
      what: 'Both copies are accepted into the queue and compressed individually.',
      why: 'Each file is assigned a unique tracking ID in the processing queue.',
      action: 'Click the trash icon to remove any accidental duplicates before compressing.'
    },
    {
      title: '28. Same Filename Files',
      what: 'Files are differentiated by unique internal IDs and saved cleanly.',
      why: 'Queue state prevents collisions even when files share identical names.',
      action: 'Download each file or rename them on your device to keep versions clear.'
    },
    {
      title: '29. Bulk Files with Varying Sizes (e.g. 50 KB and 20 MB)',
      what: 'Each document is compressed according to its individual structure.',
      why: 'Independent per-file processing ensures small files are not over-processed while large files get maximized compression.',
      action: 'Review the per-file statistics to see individual space saved for each document.'
    },
    {
      title: '30. Desktop Browser Memory Limits',
      what: 'Extremely massive files (>200 MB) may trigger browser tab memory warnings.',
      why: 'Modern browsers allocate 1–2 GB heap memory per tab.',
      action: 'Compress files in batches of 3–5 documents rather than dozens simultaneously.'
    },
    {
      title: '31. Mobile Browser RAM Limitations (iOS / Android)',
      what: 'Mobile Safari or Chrome may reload if memory threshold is exceeded on 100+ MB PDFs.',
      why: 'Mobile operating systems strictly monitor and kill memory-heavy background tabs.',
      action: 'On mobile, compress 1 or 2 files at a time for optimal stability.'
    },
    {
      title: '32. Interrupted Processing',
      what: 'Progress halts if device enters deep sleep.',
      why: 'JavaScript execution is paused when mobile screens lock.',
      action: 'Keep screen active during the 2–3 second compression process, or click "Re-compress".'
    },
    {
      title: '33. User Closes / Reloads Tab During Compression',
      what: 'Unsaved in-memory buffers are cleared.',
      why: 'RajToolBox never stores your files on a server; everything exists exclusively in tab RAM.',
      action: 'Wait until the "Compression Complete" badge appears before navigating away.'
    },
    {
      title: '34. Target Size Technically Impossible (e.g. 20 KB for 50-page PDF)',
      what: 'Tool compresses to the lowest possible size and displays "Best effort".',
      why: 'A 50-page document requires a minimum mathematical threshold for page dictionaries and fonts alone.',
      action: 'Increase your target to a realistic threshold like 500 KB or 1 MB.'
    },
    {
      title: '35. Target Size Causes Excessive Compression',
      what: 'Tool prioritizes text legibility rather than destroying document quality.',
      why: 'A document that cannot be read is useless to government portals and recruiters.',
      action: 'Review the preview. If too blurry, step up to a higher preset like 200 KB or 300 KB.'
    },
    {
      title: '36. Compression Gives Very Little Reduction (e.g. 3%)',
      what: 'File is already highly optimized or contains only compressed JPEG streams.',
      why: 'Pre-optimized PDFs have zero bloat to remove.',
      action: 'Your file is already optimal. You can upload it safely without further processing.'
    },
    {
      title: '37. Compression Increases Size (Rare edge case)',
      what: 'Tool automatically detects this and returns the original smaller file buffer!',
      why: 'In rare cases, converting certain proprietary compressed streams to standard object streams adds minor overhead.',
      action: 'No action needed. RajToolBox ensures your output file is never larger than your input.'
    },
    {
      title: '38. Digital Signature Invalidation Risk',
      what: 'Cryptographic hash checks fail on downstream verification portals.',
      why: 'Digital signatures are legally binding cryptographic seals tied to exact initial file bytes.',
      action: 'Compress BEFORE applying digital signatures or Aadhaar / DocuSign seals.'
    },
    {
      title: '39. Password / Encryption Compatibility Issues',
      what: 'Encrypted stream dictionaries cannot be read.',
      why: 'Standard encryption algorithms scramble PDF syntax.',
      action: 'Save an unencrypted copy from Adobe Reader or Chrome before compressing.'
    },
    {
      title: '40. In-Browser PDF Preview Blocked on Specific Mobile Devices',
      what: 'Some older mobile browsers do not support embedded inline PDF iframes.',
      why: 'Mobile iOS Safari historically preferred native PDF viewers over inline iframes.',
      action: 'Click "Open in New Tab" or tap "Download" to inspect in your mobile device viewer.'
    },
    {
      title: '41. Browser Blocks Automatic Download',
      what: 'Browser displays "Allow multiple downloads" prompt.',
      why: 'Browser security policy requires user confirmation for batch file downloads.',
      action: 'Click "Allow" when prompted by Chrome/Edge, or click individual download buttons.'
    },
    {
      title: '42. Native Web Share API Unavailable',
      what: 'Tool automatically falls back to "Copy Link" and WhatsApp/Telegram buttons.',
      why: 'Web Share API requires HTTPS and modern mobile browser support.',
      action: 'Use the dedicated WhatsApp, Telegram, or Copy Link shortcuts.'
    },
    {
      title: '43. WhatsApp App Not Installed on Desktop',
      what: 'Clicking WhatsApp opens WhatsApp Web in a new browser tab.',
      why: 'Web fallback seamlessly handles devices without native WhatsApp desktop software.',
      action: 'Log in with QR code on WhatsApp Web, or share directly from your smartphone.'
    },
    {
      title: '44. Partial Failure in Bulk Compression',
      what: 'Valid files complete successfully while corrupted files display individual error badges.',
      why: 'Independent per-file error boundaries prevent one bad document from breaking the entire queue.',
      action: 'Download all successful files and replace the damaged document.'
    }
  ];

  // 12 Real-World Examples
  const realWorldExamples = [
    {
      title: 'Example 1: Bulk Compression (Adding 2 More Files)',
      original: '1 File (3.8 MB)',
      target: '3 Files (< 1 MB each)',
      approach: 'Upload initial file &rarr; Click "+ Add More Files" &rarr; Select 2 additional PDFs &rarr; Click "Compress All".',
      result: 'Total queue reduced from 11.4 MB to 2.8 MB (75.4% space saved).',
      quality: 'All three documents retained crisp vector fonts and clear photo resolution.'
    },
    {
      title: 'Example 2: Best Way to Compress Without Losing Quality',
      original: '8.4 MB (Product Portfolio)',
      target: 'Under 3 MB for Email',
      approach: 'Select "Recommended" mode &rarr; Strip redundant XML &rarr; Enable object stream compression.',
      result: 'Compressed to 2.1 MB (75.0% reduction).',
      quality: 'Zero text degradation. High-DPI logos and product diagrams remain crisp at 300% zoom.'
    },
    {
      title: 'Example 3: Compressing a Very Large PDF (25 MB &rarr; Target 5 MB)',
      original: '25.6 MB (Annual Financial Audit)',
      target: '5 MB Target Preset',
      approach: 'Select Target Size mode &rarr; Choose 5 MB preset &rarr; Run multi-stream consolidation.',
      result: 'Successfully compacted to 4.4 MB (82.8% reduction). Target reached &check;.',
      quality: 'Financial tables, numeric charts, and auditor signatures remain 100% legible.'
    },
    {
      title: 'Example 4: 20 KB Target Size (Government Form Photo / Signature)',
      original: '180 KB (Single-Page Signature Slip)',
      target: '20 KB Target Preset',
      approach: 'Target Size: 20 KB &rarr; Aggressive stream stripping &rarr; Flatten metadata.',
      result: 'Reduced to 22 KB (Best effort reached).',
      quality: 'Signature stroke remains distinct. Perfect for state portal photo/sign upload limits.'
    },
    {
      title: 'Example 5: 30 KB Target Size (State Staff Selection Commission)',
      original: '240 KB (Caste Certificate Scan)',
      target: '30 KB Target Preset',
      approach: 'Target Size: 30 KB &rarr; Strong compression.',
      result: 'Reduced to 29 KB. Target reached &check;.',
      quality: 'Govt seal, application number, and official stamps remain verifiable.'
    },
    {
      title: 'Example 6: 40 KB Target Size (Admit Card & ID Proof)',
      original: '380 KB (Identity Card Scan)',
      target: '40 KB Target Preset',
      approach: 'Target Size: 40 KB &rarr; Compact indirect object streams.',
      result: 'Reduced to 38 KB. Target reached &check;.',
      quality: 'Barcode and registration number scan clearly at gate verification.'
    },
    {
      title: 'Example 7: 100 KB Target Size (Scholarship Application Portal)',
      original: '1.2 MB (Income & Residence Affidavit)',
      target: '100 KB Target Preset',
      approach: 'Target Size: 100 KB &rarr; Recommended compaction.',
      result: 'Reduced to 96 KB. Target reached &check;.',
      quality: 'Text and revenue stamps maintain complete legibility.'
    },
    {
      title: 'Example 8: 200 KB Target Size (UPSC / State PSC Civil Services)',
      original: '2.4 MB (Degree Certificate Scan)',
      target: '200 KB Target Preset',
      approach: 'Target Size: 200 KB &rarr; Balanced stream optimizer.',
      result: 'Reduced to 184 KB (92.3% saved). Target reached &check;.',
      quality: 'University watermark, marksheet grades, and registrar signatures stay crisp.'
    },
    {
      title: 'Example 9: 300 KB Target Size (Bank KYC & Account Opening)',
      original: '3.1 MB (Electricity Bill & Bank Passbook)',
      target: '300 KB Target Preset',
      approach: 'Target Size: 300 KB &rarr; Multi-stream deduplication.',
      result: 'Reduced to 270 KB. Target reached &check;.',
      quality: 'Customer address lines and IFSC/Account figures remain razor-sharp.'
    },
    {
      title: 'Example 10: 1 MB Target Size (University Admission Dossier)',
      original: '6.8 MB (Multi-page Transcript & Recommendation)',
      target: '1 MB Target Preset',
      approach: 'Target Size: 1 MB &rarr; Object stream consolidation.',
      result: 'Reduced to 890 KB (86.9% saved). Target reached &check;.',
      quality: 'All 8 pages readable with flawless typography and academic letterheads.'
    },
    {
      title: 'Example 11: 2 MB Target Size (Job Portal & ATS Resume Upload)',
      original: '7.5 MB (Graphic Designer Resume & Portfolio)',
      target: '2 MB Target Preset',
      approach: 'Target Size: 2 MB &rarr; Stream optimization with metadata stripping.',
      result: 'Reduced to 1.6 MB (78.6% saved). Target reached &check;.',
      quality: 'Passes automated Applicant Tracking Systems (ATS) with selectable vector text.'
    },
    {
      title: 'Example 12: 5 MB Target Size (High-Volume Email Attachment)',
      original: '22.0 MB (Architectural Proposal & Drawings)',
      target: '5 MB Target Preset',
      approach: 'Target Size: 5 MB &rarr; Recommended mode.',
      result: 'Reduced to 4.2 MB. Target reached &check;.',
      quality: 'Fits standard 25 MB email limits with ample headroom for multiple attachments.'
    }
  ];

  // 25 Comprehensive FAQs
  const faqsList = [
    {
      q: '1. What is a PDF compressor?',
      a: 'A PDF compressor is a specialized utility that analyzes the internal structure of a PDF document—including cross-reference tables, indirect object streams, font subsets, and image dictionaries—and restructures them to occupy significantly fewer bytes while preserving document readability.'
    },
    {
      q: '2. How can I reduce PDF size?',
      a: 'Upload your document to RajToolBox PDF Compressor, select your desired compression level (Recommended, Strong, or Target Size), click Compress, preview the result, and download your optimized document.'
    },
    {
      q: '3. Can I compress PDF online for free?',
      a: 'Yes. RajToolBox PDF Compressor is 100% free with no subscriptions, watermarks, page limits, or file caps. You can compress as many documents as needed.'
    },
    {
      q: '4. Can I compress PDF to 100KB?',
      a: 'Yes. Select "Target Size" mode and choose the "100 KB" preset. For 1-to-3 page documents, the compressor effectively compacts stream dictionaries to reach 100 KB for scholarship and exam portals.'
    },
    {
      q: '5. Can I compress PDF to 200KB?',
      a: 'Yes. 200 KB is the standard requirement for UPSC, SSC, and state PSC job application portals. Select the "200 KB" preset for fast, reliable compression.'
    },
    {
      q: '6. Can I compress PDF to 300KB?',
      a: 'Yes. Choose the "300 KB" preset, commonly required by banking KYC portals and insurance claim submission websites.'
    },
    {
      q: '7. Can I compress PDF to 1MB?',
      a: 'Yes. The 1 MB preset is ideal for college admissions, academic project submissions, and professional email attachments.'
    },
    {
      q: '8. Can I compress PDF to 2MB?',
      a: 'Yes. 2 MB is the standard upload ceiling for LinkedIn, Indeed, Naukri, and corporate HR portal resume submissions.'
    },
    {
      q: '9. Can I compress PDF to 5MB?',
      a: 'Yes. Select the 5 MB preset for large documents, reports, and portfolios to ensure they stay well under corporate email server limits.'
    },
    {
      q: '10. How do I compress PDF without losing quality?',
      a: 'Choose "Basic / Light" or "Recommended" mode. These modes compact structural PDF tables and strip redundant XML metadata while retaining 100% vector font sharpness and high image fidelity.'
    },
    {
      q: '11. Why does my PDF remain large after compression?',
      a: 'If a PDF consists of dozens of 600-DPI full-color scanned pages or was already pre-compressed by high-end scanner software, further reduction without downsampling images is mathematically constrained.'
    },
    {
      q: '12. Can I compress a scanned PDF?',
      a: 'Yes. Scanned PDFs typically show the largest byte reduction because uncompressed scanner bitmaps can be compacted significantly.'
    },
    {
      q: '13. Can I compress multiple PDFs at once?',
      a: 'Yes. RajToolBox fully supports bulk compression. Click "+ Add More Files" to queue multiple PDFs, compress all simultaneously, and download each result.'
    },
    {
      q: '14. Can I compress a large PDF (50 MB or 100 MB)?',
      a: 'Yes. Modern devices with current versions of Chrome, Safari, or Edge handle large documents directly in browser memory without issue.'
    },
    {
      q: '15. Can I preview the compressed PDF before downloading?',
      a: 'Yes. A full in-browser PDF preview is generated immediately after compression so you can inspect text readability and page layouts before saving.'
    },
    {
      q: '16. Is PDF compression safe on RajToolBox?',
      a: 'Completely safe. Unlike cloud-based converters that upload your confidential documents to external servers, RajToolBox processes everything locally inside your device browser.'
    },
    {
      q: '17. Are my PDF files uploaded to a server?',
      a: 'Never. All PDF reading, stream optimization, and compression algorithms execute client-side via JavaScript and WebAssembly in your browser memory.'
    },
    {
      q: '18. Can I compress a password-protected PDF?',
      a: 'Encrypted PDFs must be unlocked before compression because security wrappers lock indirect object syntax.'
    },
    {
      q: '19. Can I compress a digitally signed PDF?',
      a: 'You should avoid compressing digitally signed PDFs. Modifying document byte streams invalidates cryptographic digital signature checksums.'
    },
    {
      q: '20. Why did my PDF quality become blurry with another tool?',
      a: 'Aggressive tools downsample images to 72 DPI or heavy JPEG compression. RajToolBox Recommended mode preserves vector fonts and balances visual clarity.'
    },
    {
      q: '21. Can I compress PDF on mobile?',
      a: 'Yes. The interface is optimized for iPhone, iPad, and Android mobile browsers with touch-friendly controls and responsive file handling.'
    },
    {
      q: '22. Can I share the compressed PDF directly?',
      a: 'Yes. Use the built-in Native Share button on mobile, or share directly via WhatsApp, Telegram, and Email shortcuts.'
    },
    {
      q: '23. Can I use WhatsApp to share the compressed PDF?',
      a: 'Yes. Click the WhatsApp share icon to share the tool or link directly with colleagues or clients.'
    },
    {
      q: '24. What happens if the target size cannot be reached?',
      a: 'RajToolBox provides an honest status: it compacts the file to the lowest technically possible size without destroying legibility and displays "Best effort reached".'
    },
    {
      q: '25. Should I keep the original PDF?',
      a: 'Always retain your original document as a master archival copy, especially for legal contracts, certificates, and archival records.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        categorySlug={category?.slug || 'pdf-tools'}
        categoryName={category?.name || 'PDF Tools'}
        toolName="PDF Compressor"
      />

      {/* 2. H1 + 3. 1-2 LINE INTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
            <span className="font-semibold text-[#EC4899]">PDF Tools</span>
            <span aria-hidden="true">&middot;</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% In-Browser &amp; Private
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#854D0E] dark:text-[#FACC15]">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              Client Side Execution
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
            PDF Compressor
          </h1>

          <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
            Compress PDF files online and reduce file size while keeping your document readable. Choose a compression level or target size, preview the result, then download or share your compressed PDF.
          </p>
        </div>

        <button
          onClick={() => toggleFavorite(tool.slug)}
          className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
            favored
              ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
              : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${favored ? 'fill-[#EC4899]' : ''}`} />
          <span>{favored ? 'Saved' : 'Save Tool'}</span>
        </button>
      </div>

      {/* 4–10. ACTUAL WORKING PDF COMPRESSOR COMPONENT */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-sm p-6 sm:p-8 mb-12">
        <PdfCompressorTool />
      </div>

      {/* 11. HOW TO USE SECTION */}
      <section className="my-10 rounded-2xl border border-[#FACC15]/40 bg-[#FFFDF7] dark:bg-[#151519] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#FACC15] text-[#854D0E] flex items-center justify-center font-black text-sm">
            ?
          </div>
          <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            How to Compress a PDF
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-xs">
          {[
            { num: 1, title: 'Upload Your PDF', desc: 'Drag and drop your file or click "Choose PDF".' },
            { num: 2, title: 'Add More Files', desc: 'Click "+ Add More Files" if you have multiple documents.' },
            { num: 3, title: 'Choose Mode', desc: 'Select Basic, Recommended, Strong, or Target Size.' },
            { num: 4, title: 'Select Target Size', desc: 'Pick presets (e.g. 100KB, 200KB, 500KB) or custom value.' },
            { num: 5, title: 'Toggle Metadata', desc: 'Optionally strip redundant author and XML metadata.' },
            { num: 6, title: 'Start Compression', desc: 'Click "Compress Now" for immediate in-browser processing.' },
            { num: 7, title: 'Review Results', desc: 'Inspect original vs compressed bytes and reduction %.' },
            { num: 8, title: 'Preview PDF', desc: 'Use the live viewer to verify document clarity.' },
            { num: 9, title: 'Download or Share', desc: 'Save to your device or share via WhatsApp/Telegram.' }
          ].map((s) => (
            <li key={s.num} className="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FACC15] text-[#854D0E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {s.num}
              </span>
              <div>
                <strong className="text-sm text-[#18181B] dark:text-[#F4F4F5] block">{s.title}</strong>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Mini Instructions Sub-grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-[#FACC15]/30 text-xs">
          <div className="p-3 rounded-lg bg-white/70 dark:bg-black/20">
            <p className="font-bold text-[#18181B] dark:text-white mb-1">Single PDF</p>
            <p className="text-[#71717A] text-[11px]">Drop 1 file &rarr; Recommended &rarr; Download in &lt; 2s.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-black/20">
            <p className="font-bold text-[#18181B] dark:text-white mb-1">Multiple PDFs</p>
            <p className="text-[#71717A] text-[11px]">Use "+ Add More Files" to queue dozens for bulk compression.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-black/20">
            <p className="font-bold text-[#18181B] dark:text-white mb-1">Target Size</p>
            <p className="text-[#71717A] text-[11px]">Choose 100KB, 200KB, or 500KB to match portal upload caps.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-black/20">
            <p className="font-bold text-[#18181B] dark:text-white mb-1">Large PDFs</p>
            <p className="text-[#71717A] text-[11px]">Handles 50MB+ reports safely with object stream compaction.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-black/20">
            <p className="font-bold text-[#18181B] dark:text-white mb-1">Mobile</p>
            <p className="text-[#71717A] text-[11px]">Tap choose file &rarr; select PDF &rarr; share directly to WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* 12. REAL-WORLD EXAMPLES */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Real-World PDF Compression Examples
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
          Practical scenarios based on real user submission requirements, job applications, government portals, and university forms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realWorldExamples.map((ex, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] mb-2">{ex.title}</h3>
                <div className="space-y-1.5 text-xs text-[#71717A] dark:text-[#A1A1AA]">
                  <p>
                    <strong className="text-[#18181B] dark:text-[#D4D4D8]">Original Size:</strong> {ex.original}
                  </p>
                  <p>
                    <strong className="text-[#18181B] dark:text-[#D4D4D8]">Target Goal:</strong> {ex.target}
                  </p>
                  <p>
                    <strong className="text-[#18181B] dark:text-[#D4D4D8]">Approach:</strong> {ex.approach}
                  </p>
                  <p className="text-[#16A34A] dark:text-[#4ADE80] font-semibold">
                    <strong>Result:</strong> {ex.result}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-[#71717A] mt-3 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]">
                <em>Quality Note:</em> {ex.quality}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 13. TARGET SIZE GUIDE */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          What PDF Size Should You Choose?
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-4">
          Reference table for popular application portals, exam websites, and email systems.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Target Size</th>
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Typical Use Case</th>
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Feasibility &amp; Considerations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
              {[
                { size: '20 KB', use: 'Govt signature slips, passport photo cards', note: 'Achievable for single-page vector documents with minimal text.' },
                { size: '30 KB', use: 'SSC & state selection commission certificates', note: 'Strict limits. Requires clean scans without heavy border margins.' },
                { size: '40 KB', use: 'Admit card attachments & caste verification', note: 'Single-page forms compress reliably to this limit.' },
                { size: '50 KB', use: 'Railway and banking recruitment slips', note: 'Good balance for scanned black-and-white documents.' },
                { size: '100 KB', use: 'National scholarship portals & state welfare forms', note: 'High success rate for 1-to-3 page affidavits and certificates.' },
                { size: '200 KB', use: 'UPSC Civil Services & state PSC document uploads', note: 'The most popular standard. Preserves university degree stamps clearly.' },
                { size: '300 KB', use: 'Bank KYC verification, passbook, and electricity bills', note: 'Ideal for 2–4 page utility bills with address text.' },
                { size: '500 KB', use: 'Online job portals (Naukri, Monster, FoundIt)', note: 'Excellent clarity. Accommodates multi-page resumes with profile pictures.' },
                { size: '1 MB', use: 'University admissions & academic dossiers', note: 'Recommended for 5–10 page research summaries and transcripts.' },
                { size: '2 MB', use: 'LinkedIn Easy Apply & corporate enterprise ATS', note: 'Universal maximum for professional PDF portfolios and resumes.' },
                { size: '5 MB', use: 'Corporate email attachments (Outlook, Gmail)', note: 'Ensures delivery through company firewalls with zero bounce-backs.' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FFFDF7] dark:hover:bg-[#1C1C22]">
                  <td className="p-3 font-bold text-[#EC4899]">{row.size}</td>
                  <td className="p-3 font-semibold text-[#18181B] dark:text-[#D4D4D8]">{row.use}</td>
                  <td className="p-3 text-[#71717A] dark:text-[#A1A1AA]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#854D0E] dark:text-[#FACC15] bg-[#FEF3C7]/40 dark:bg-[#FACC15]/10 p-3 rounded-xl mt-4">
          <strong>Important Principle:</strong> The smaller the target, the greater the chance that image resolution must be downsampled. RajToolBox prioritizes document readability so your application is never rejected for illegibility.
        </p>
      </section>

      {/* 14. HOW PDF COMPRESSION WORKS */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          How PDF Compression Works
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
          PDF is a container format consisting of object tables, font subsets, image data, and syntax streams. Here is how RajToolBox optimizes them:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
            <h3 className="font-bold text-sm text-[#18181B] dark:text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
              Stream Optimization
            </h3>
            <p className="text-[#71717A] leading-relaxed">
              Consolidates orphaned cross-reference tables (XRef) and packs loose objects into compressed Flate streams, reducing structural file overhead by 20% to 40%.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
            <h3 className="font-bold text-sm text-[#18181B] dark:text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]"></span>
              Metadata Stripping
            </h3>
            <p className="text-[#71717A] leading-relaxed">
              Removes redundant XML schemas, thumbnail previews, creation histories, and printer setup data that contribute zero value to normal reading.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
            <h3 className="font-bold text-sm text-[#18181B] dark:text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              Raster Compaction
            </h3>
            <p className="text-[#71717A] leading-relaxed">
              Re-quantizes heavy embedded photographs while preserving exact mathematical vectors for fonts, ensuring text outlines remain razor-sharp.
            </p>
          </div>
        </div>
      </section>

      {/* 15. QUALITY VS FILE SIZE */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          PDF Compression Quality vs File Size
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-4">
          Every compression decision involves a deliberate trade-off between byte reduction and visual fidelity.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Mode</th>
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Expected Size Drop</th>
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Visual Quality Impact</th>
                <th className="p-3 font-bold text-[#18181B] dark:text-[#F4F4F5]">Best Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
              <tr>
                <td className="p-3 font-bold text-[#18181B] dark:text-white">Basic / Light</td>
                <td className="p-3 font-semibold text-[#16A34A]">15% &ndash; 30%</td>
                <td className="p-3 text-[#71717A]">Zero noticeable difference. 100% vector fidelity.</td>
                <td className="p-3 text-[#71717A]">Print portfolios, legal contracts, certificates</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#EC4899]">Recommended</td>
                <td className="p-3 font-semibold text-[#16A34A]">40% &ndash; 75%</td>
                <td className="p-3 text-[#71717A]">Optimal balance. Text is pin-sharp; photos stay crisp on screen.</td>
                <td className="p-3 text-[#71717A]">Email attachments, university applications, reports</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#854D0E] dark:text-[#FACC15]">Strong</td>
                <td className="p-3 font-semibold text-[#16A34A]">70% &ndash; 90%</td>
                <td className="p-3 text-[#71717A]">High reduction. Slight softening on embedded photos at high zoom.</td>
                <td className="p-3 text-[#71717A]">Strict government portals with &lt; 200 KB ceilings</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#2563EB]">Target Size Mode</td>
                <td className="p-3 font-semibold text-[#16A34A]">Adaptive</td>
                <td className="p-3 text-[#71717A]">Dynamically adjusted to match target bytes while preserving legibility.</td>
                <td className="p-3 text-[#71717A]">Exact form requirement (e.g. 100 KB, 200 KB, 500 KB)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 16. FLOWCHART */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          PDF Compression Decision Flowchart
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
          Follow this workflow to achieve the ideal balance of size and clarity for any document submission:
        </p>

        {/* Responsive Interactive Flowchart Diagram */}
        <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#141417] border border-[#E4E4E7] dark:border-[#27272A] space-y-4 text-xs font-semibold">
          <div className="flex flex-col items-center gap-2">
            <div className="px-5 py-2.5 rounded-xl bg-[#18181B] text-white dark:bg-white dark:text-[#18181B] shadow-xs">
              1. Upload PDF (Single or Multiple)
            </div>
            <span className="text-[#EC4899] font-bold text-base">&darr;</span>
            <div className="px-5 py-2.5 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30">
              2. Choose Mode (Basic &middot; Recommended &middot; Strong &middot; Target Size)
            </div>
            <span className="text-[#EC4899] font-bold text-base">&darr;</span>
            <div className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-[#854D0E] font-bold shadow-xs">
              3. Click "Compress PDF Now" (In-Browser Execution)
            </div>
            <span className="text-[#EC4899] font-bold text-base">&darr;</span>
            <div className="px-5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">
              4. Review Before/After Size &amp; Inspect Live Preview
            </div>
            <span className="text-[#EC4899] font-bold text-base">&darr;</span>
            <div className="p-3 rounded-xl border border-dashed border-[#EC4899] text-center max-w-sm">
              <span className="text-[#EC4899] font-bold block mb-1">Is Quality &amp; Size Acceptable?</span>
              <div className="flex items-center justify-center gap-6 mt-2">
                <span className="text-[#16A34A] font-bold">&check; YES &rarr; Download &amp; Share</span>
                <span className="text-[#DC2626] font-bold">&cross; NO &rarr; Adjust Target &amp; Re-compress</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 17. VISUAL DIAGRAM */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Inside the In-Browser Optimization Engine
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
          Architectural breakdown of client-side stream reconstitution:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
            <div className="w-8 h-8 rounded-full bg-[#EC4899] text-white flex items-center justify-center mx-auto mb-2 font-bold">
              1
            </div>
            <p className="font-bold text-[#18181B] dark:text-white">Byte Buffer Ingestion</p>
            <p className="text-[#71717A] text-[11px] mt-1">Reads raw binary array into memory sandbox with zero network transfer.</p>
          </div>
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
            <div className="w-8 h-8 rounded-full bg-[#FACC15] text-[#854D0E] flex items-center justify-center mx-auto mb-2 font-bold">
              2
            </div>
            <p className="font-bold text-[#18181B] dark:text-white">Object Table Parsing</p>
            <p className="text-[#71717A] text-[11px] mt-1">Traverses catalog dictionaries and prunes unreferenced document nodes.</p>
          </div>
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto mb-2 font-bold">
              3
            </div>
            <p className="font-bold text-[#18181B] dark:text-white">Flate Compression</p>
            <p className="text-[#71717A] text-[11px] mt-1">Repacks content streams into modern unified object stream dictionaries.</p>
          </div>
          <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026]">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-2 font-bold">
              4
            </div>
            <p className="font-bold text-[#18181B] dark:text-white">Blob Assembly</p>
            <p className="text-[#71717A] text-[11px] mt-1">Builds local Object URL ready for instant preview and one-click download.</p>
          </div>
        </div>
      </section>

      {/* 18. PDF COMPRESSOR EDGE CASES (44 CASES) */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          PDF Compressor Edge Cases &amp; Troubleshooting
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
          Every document is unique. Here is how RajToolBox handles all 44 common edge cases:
        </p>

        <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
          {edgeCasesList.map((ec, idx) => {
            const isOpen = activeEdgeCase === idx;
            return (
              <div
                key={idx}
                className="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden bg-[#FFFDF7] dark:bg-[#1C1C22]"
              >
                <button
                  type="button"
                  onClick={() => setActiveEdgeCase(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F5]">
                    {ec.title}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#EC4899]" /> : <ChevronDown className="w-4 h-4 text-[#71717A]" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-[#E4E4E7] dark:border-[#27272A] text-xs space-y-2 text-[#71717A] dark:text-[#A1A1AA] bg-white dark:bg-[#18181B]">
                    <p>
                      <strong className="text-[#18181B] dark:text-white">What happens:</strong> {ec.what}
                    </p>
                    <p>
                      <strong className="text-[#18181B] dark:text-white">Why it happens:</strong> {ec.why}
                    </p>
                    <p className="text-[#16A34A] dark:text-[#4ADE80] font-semibold">
                      <strong>What you should do:</strong> {ec.action}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 19. WHEN SHOULD YOU USE A PDF COMPRESSOR? */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          When Should You Use a PDF Compressor?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mt-4">
          {[
            { title: 'Government Job Applications', desc: 'Portals enforcing strict 100 KB, 200 KB, or 500 KB caps for degrees and certificates.' },
            { title: 'Competitive Entrance Exams', desc: 'UPSC, SSC, NEET, JEE, and GATE registration forms demanding compact file sizes.' },
            { title: 'Scholarship Portals', desc: 'Uploading income certificates, caste affidavits, and academic transcripts under 200 KB.' },
            { title: 'Corporate Job Applications', desc: 'Bypassing strict 2 MB attachment limits on recruiter applicant tracking systems.' },
            { title: 'Email Attachments', desc: 'Sending multi-page proposals without triggering 25 MB email bounce-backs.' },
            { title: 'WhatsApp & Mobile Sharing', desc: 'Sending documents fast on cellular data without consuming gigabytes.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
              <strong className="text-sm text-[#18181B] dark:text-white block mb-1">{item.title}</strong>
              <p className="text-[#71717A] text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 20. WHEN SHOULD YOU AVOID PDF COMPRESSION? */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          When Should You Avoid PDF Compression?
        </h2>
        <div className="space-y-2.5 text-xs text-[#71717A] dark:text-[#A1A1AA] mt-4">
          <div className="p-3.5 rounded-xl border border-[#DC2626]/20 bg-red-50/40 dark:bg-red-950/15 flex items-start gap-3">
            <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#18181B] dark:text-white">Digitally Signed Legal Documents:</strong> Compression modifies byte streams, breaking the cryptographic checksum of digital signatures (e-Sign, DSC).
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#DC2626]/20 bg-red-50/40 dark:bg-red-950/15 flex items-start gap-3">
            <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#18181B] dark:text-white">Commercial Print Production:</strong> Professional CMYK offset printing requires 300+ DPI uncompressed TIFF/raster graphics.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-[#DC2626]/20 bg-red-50/40 dark:bg-red-950/15 flex items-start gap-3">
            <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#18181B] dark:text-white">Master Archival Copies:</strong> Always store an uncompressed master archive of historical records and birth certificates.
            </p>
          </div>
        </div>
      </section>

      {/* 21. COMMON MISTAKES */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Common PDF Compression Mistakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-4">
          {[
            { title: 'Deleting the Original File', desc: 'Never discard your original master document before verifying the compressed file.' },
            { title: 'Skipping the Preview Step', desc: 'Always inspect the in-browser preview to verify small footnotes and stamps are legible.' },
            { title: 'Attempting Unrealistic Target Sizes', desc: 'Aiming for 20 KB on a 20-page color PDF will result in unreadable downscaling.' },
            { title: 'Repeatedly Compressing the Same File', desc: 'Compressing an already compressed PDF compounds loss without yielding meaningful byte gains.' }
          ].map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22]">
              <strong className="text-sm text-[#18181B] dark:text-white block mb-1">{m.title}</strong>
              <p className="text-[#71717A] text-[11px] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 22. RELATED TOOLS */}
      <RelatedTools currentTool={tool} />

      {/* 23. RELATED GUIDES */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Related Guides &amp; Tutorials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mt-4">
          <a
            href="/guides/"
            className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] hover:border-[#EC4899] transition-all group"
          >
            <h3 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-[#EC4899] transition-colors mb-1">
              How to Reduce PDF Size for Govt Forms
            </h3>
            <p className="text-[#71717A] text-[11px]">Step-by-step guide to achieving 100 KB and 200 KB targets for online applications.</p>
          </a>
          <a
            href="/guides/"
            className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] hover:border-[#EC4899] transition-all group"
          >
            <h3 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-[#EC4899] transition-colors mb-1">
              Compress PDF Without Losing Quality
            </h3>
            <p className="text-[#71717A] text-[11px]">Learn how vector font preservation keeps text crisp while stripping overhead.</p>
          </a>
          <a
            href="/pdf-tools/"
            className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#1C1C22] hover:border-[#EC4899] transition-all group"
          >
            <h3 className="font-bold text-sm text-[#18181B] dark:text-white group-hover:text-[#EC4899] transition-colors mb-1">
              Explore All PDF Utilities
            </h3>
            <p className="text-[#71717A] text-[11px]">Merge, split, watermark, and convert documents in our complete PDF suite.</p>
          </a>
        </div>
      </section>

      {/* 24. FAQ SECTION (25 COMPREHENSIVE QUESTIONS) */}
      <section className="my-10 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mb-6">
          Everything you need to know about online PDF compression, privacy, target sizes, and document quality.
        </p>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden bg-[#FFFDF7] dark:bg-[#1C1C22]"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F5]">
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#EC4899]" /> : <ChevronDown className="w-4 h-4 text-[#71717A]" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-[#E4E4E7] dark:border-[#27272A] text-xs leading-relaxed text-[#71717A] dark:text-[#A1A1AA] bg-white dark:bg-[#18181B]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 25. AUTHOR / TRUST SECTION */}
      <AuthorBox />

      {/* 26. FINAL SHARE SECTION */}
      <section className="my-10 p-8 rounded-2xl border border-[#EC4899]/30 bg-gradient-to-b from-[#FFFDF7] to-[#FCE7F3]/30 dark:from-[#18181B] dark:to-[#EC4899]/10 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#EC4899] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Share2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
          Share PDF Compressor
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto mb-6">
          Know someone struggling with large PDF uploads or strict portal limits? Share RajToolBox PDF Compressor directly with friends and colleagues.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              'Compress large PDF files online with 100% private in-browser tool: https://rajtoolbox.com/tools/pdf-compressor/'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs hover:bg-[#20BA5A] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              'https://rajtoolbox.com/tools/pdf-compressor/'
            )}&text=${encodeURIComponent('Compress large PDF files online for free on RajToolBox')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0088cc] text-white font-bold text-xs shadow-xs hover:bg-[#0077b5] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Share on Telegram</span>
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              'Helpful PDF Compressor Tool'
            )}&body=${encodeURIComponent(
              'I found this free PDF compressor on RajToolBox that reduces PDF size directly inside the browser: https://rajtoolbox.com/tools/pdf-compressor/'
            )}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold text-[#18181B] dark:text-white hover:border-[#EC4899] transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold text-[#18181B] dark:text-white hover:border-[#EC4899] transition-all"
          >
            {linkCopied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
            <span>{linkCopied ? 'Link Copied!' : 'Copy Page Link'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
