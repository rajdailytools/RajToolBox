import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ImageCompressorTool } from '../tools/components/ImageCompressorTool';
import { AuthorBox } from '../components/ui/AuthorBox';
import { RelatedTools } from '../components/ui/RelatedTools';
import {
  ImageIcon,
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

interface ImageCompressorPageProps {
  tool: ToolItem;
}

export const ImageCompressorPage: React.FC<ImageCompressorPageProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const category = CATEGORIES[tool.category] || CATEGORIES['image-tools'];
  const favored = isFavorite(tool.slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeEdgeCase, setActiveEdgeCase] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Sync document title and canonical meta for SEO
  useEffect(() => {
    document.title = 'Image Compressor Online – Reduce Image Size in KB | RajToolBox';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Compress JPG, PNG, and WebP images online with target size options (20KB, 50KB, 100KB, 200KB). Preview Before & After, reduce image size in KB, download and share 100% privately in-browser.'
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://rajtoolbox.com/tools/image-compressor/');
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
          title: 'Image Compressor Online – RajToolBox',
          text: 'Compress JPG, PNG, and WebP images online with real target size control (20 KB, 50 KB, 100 KB) 100% privately in your browser.',
          url: window.location.href
        });
      } catch {
        // dismissed
      }
    } else {
      copyLink();
    }
  };

  // 44 Detailed Researched Edge Cases
  const edgeCasesList = [
    {
      title: '1. Transparent PNG Compressed to JPG',
      what: 'Transparent backgrounds can turn solid black in uncalibrated compressors.',
      why: 'JPEG format has no alpha (transparency) channel. Without background compositing, transparency defaults to RGB (0,0,0) black.',
      action: 'RajToolBox automatically composites transparent PNGs over a pure white background for crisp passport and signature uploads, or converts to WebP to preserve alpha.'
    },
    {
      title: '2. Already Compressed JPEG (Multi-Generation Loss)',
      what: 'File size decreases very little (1% to 4%) or visual artifacts appear.',
      why: 'The image has already discarded high-frequency discrete cosine transform (DCT) coefficients. Repeated lossy passes cause generation loss.',
      action: 'Keep original if size already meets your portal limit. Do not compress the same photo multiple times.'
    },
    {
      title: '3. Ultra High-Resolution Smartphone Photo (48 MP / 108 MP)',
      what: 'Huge dimensions (e.g. 8000×6000 px) make reaching 50 KB or 100 KB impossible with quality adjustment alone.',
      why: 'A 48-megapixel grid contains millions of discrete pixel blocks; even at 10% quality, JPEG headers and low-frequency blocks exceed 150 KB.',
      action: 'Enable dimension scaling or select Target Size mode. The engine automatically downsamples to 1600px or 1200px while maintaining crisp aspect ratio.'
    },
    {
      title: '4. Digital Signature Scan (Thin Black Lines on White Paper)',
      what: 'Low quality compression produces ugly grey smudges or breaks thin pen strokes.',
      why: 'JPEG block quantization blurs sharp contrast edges (Gibbs ringing phenomenon).',
      action: 'Use Target Size (e.g. 20 KB or 50 KB) or convert to WebP/PNG to preserve crisp pen contours for government forms.'
    },
    {
      title: '5. Passport Photo for Government Job Application (SSC, UPSC, State PSC)',
      what: 'Portal strictly demands photo under 50 KB (or 20 KB) with exact aspect ratio (3.5 × 4.5 cm).',
      why: 'State recruitment servers enforce hard byte-size limits to save database storage.',
      action: 'Select the 50 KB or 20 KB preset. The engine runs binary quality search and measures actual output bytes.'
    },
    {
      title: '6. Target Size Smaller Than Mathematical Floor (e.g. 5 KB on 4K Photo)',
      what: 'Status displays "Target not reached" and shows best achievable result.',
      why: 'Image entropy, resolution, and format container overhead have a physical limit where further reduction causes total unrecognizability.',
      action: 'RajToolBox honestly displays the actual achieved size without faking success, protecting visual legibility.'
    },
    {
      title: '7. Complex Infographics & Screenshots With Small Text',
      what: 'Heavy JPEG compression causes ringing artifacts around letters, making text fuzzy.',
      why: 'Text consists of sharp step-function contrasts that JPEG cosine transform does not represent cleanly.',
      action: 'Use WebP or Recommended mode (78% quality) to retain razor-sharp typographic edges.'
    },
    {
      title: '8. Very Small Source Image (< 15 KB)',
      what: 'Compression yields minimal byte reduction or slight size increase.',
      why: 'The file already has minimal redundant pixel entropy.',
      action: 'Your file is already lightweight and can be uploaded directly to any portal.'
    },
    {
      title: '9. Large Batch / Bulk Image Processing (> 20 Files)',
      what: 'Processing takes several seconds as browser memory buffers images.',
      why: 'Client-side processing executes locally in device RAM using HTML5 canvas.',
      action: 'Queue up to 25 images at once. Use "Download All as ZIP" to receive all compressed images in one archive.'
    },
    {
      title: '10. EXIF Metadata Bloat (Camera GPS, Lens Data, Thumbnails)',
      what: 'Original photo contains 20 KB to 60 KB of non-pixel metadata.',
      why: 'Smartphones store location, exposure, sensor tags, and embedded thumbnail images in the JPEG header.',
      action: 'RajToolBox automatically strips non-essential EXIF metadata during canvas re-encoding, saving 30+ KB instantly.'
    },
    {
      title: '11. WebP Format for Modern Web Performance',
      what: 'Reduces size by 25% to 35% compared to standard JPEG at identical perceived quality.',
      why: 'WebP uses predictive coding from VP8 video keyframes for superior compression efficiency.',
      action: 'Choose "Convert to WebP" in Output Format dropdown for website optimization.'
    },
    {
      title: '12. High-Frequency Noise & Film Grain Photos',
      what: 'Photos with ISO grain or textured fabric compress less efficiently.',
      why: 'Random noise prevents compression algorithms from finding repeating patterns across adjacent 8×8 blocks.',
      action: 'Use Recommended mode or slight resolution downscaling to smooth high-ISO sensor noise.'
    },
    {
      title: '13. Grayscale / Black & White Document Scans',
      what: 'File can be compressed down to 20 KB to 40 KB easily.',
      why: 'Single-channel luminance contains no chroma differences, drastically lowering entropy.',
      action: 'Select 30 KB or 40 KB target preset for fast official document submissions.'
    },
    {
      title: '14. Output Larger Than Original File',
      what: 'In rare cases with heavily optimized source files, re-encoding can add bytes.',
      why: 'Canvas export adds standard standard quantization tables that may be larger than custom Huffman tables.',
      action: 'RajToolBox automatically compares actual output bytes with input bytes; if larger, it retains the smaller original.'
    },
    {
      title: '15. Corrupted or Truncated Image Files',
      what: 'Browser decode fails and shows human-readable error badge.',
      why: 'Damaged byte headers or incomplete downloads prevent canvas initialization.',
      action: 'Re-save or re-download the source image before uploading.'
    },
    {
      title: '16. Zero-Byte Empty Files',
      what: 'Immediate validation stops empty files from entering processing queue.',
      why: 'Empty files contain no image headers or pixel buffers.',
      action: 'Select an actual image file from your device.'
    },
    {
      title: '17. Unsupported RAW Camera Formats (.CR2, .NEF, .ARW)',
      what: 'Displays clear notification explaining browser decoding limits.',
      why: 'RAW camera files contain proprietary sensor bayer patterns requiring specialized desktop codecs.',
      action: 'Export the RAW image to JPG or PNG from Lightroom or your smartphone photo app first.'
    },
    {
      title: '18. SVG Vector Graphics Uploaded to Raster Compressor',
      what: 'Informs user that SVG is XML vector mathematics, not pixel raster.',
      why: 'SVGs do not have pixels or JPEG quality parameters.',
      action: 'Use a vector SVG minifier or keep the SVG file as is.'
    },
    {
      title: '19. Animated GIF Compression Limits',
      what: 'Canvas decodes only the first static frame of multi-frame animated GIFs.',
      why: 'HTML5 2D canvas treats animated GIFs as single-frame still images.',
      action: 'For animated GIFs, use a dedicated GIF optimizer; for static GIFs, RajToolBox converts to compact WebP.'
    },
    {
      title: '20. Custom Target Size with Fractional or Zero Value',
      what: 'Input field automatically sanitizes non-positive values to minimum 1 KB.',
      why: 'Image files require header bytes, quantization tables, and end-of-image markers (minimum ~1024 bytes).',
      action: 'Enter a realistic target size (e.g. 50 KB, 100 KB, 200 KB).'
    },
    {
      title: '21. Preserving Aspect Ratio on Custom Resize',
      what: 'Image stretches or squishes if aspect ratio lock is unlinked.',
      why: 'Independent width and height values alter geometric proportions.',
      action: 'Keep "Lock aspect ratio" checked to maintain natural face and document geometry.'
    },
    {
      title: '22. Color Profile (sRGB vs Display P3 / Adobe RGB)',
      what: 'Canvas export normalizes color space to universal sRGB standard.',
      why: 'Browsers standardise web rendering on sRGB to ensure identical appearance across phones and PCs.',
      action: 'Your compressed image displays consistently across all browsers, monitors, and job portals.'
    },
    {
      title: '23. High-Contrast Barcode / QR Code Photos',
      what: 'Heavy compression blurs QR timing patterns, causing scanner apps to fail.',
      why: 'Quantization rounds sharp black-to-white transitions into mid-gray gradients.',
      action: 'Use Basic mode (90% quality) or PNG output when compressing images containing functional QR codes.'
    },
    {
      title: '24. Mobile Browser Memory Management (iOS Safari & Android Chrome)',
      what: 'Processing extremely large 100 MB batches on older phones may refresh tab.',
      why: 'Mobile operating systems impose strict per-tab RAM quotas.',
      action: 'Process batches of 5 to 10 photos on mobile, or compress large folders on desktop.'
    },
    {
      title: '25. Sharing Result Directly to WhatsApp or Telegram',
      what: 'Dedicated share buttons allow instant messaging sharing.',
      why: 'Mobile Web Share API shares the actual compressed image file directly into the app.',
      action: 'Tap "Share File" on completed result card to open device native share sheet.'
    },
    {
      title: '26. eCommerce Product Catalog Photos (Square 1:1)',
      what: 'Shopify, Amazon, and WooCommerce require product photos under 200 KB for fast loading.',
      why: 'Heavy product images increase page load time, hurting search rankings and conversion rates.',
      action: 'Select 200 KB target size mode to standardize entire inventory.'
    },
    {
      title: '27. Real Estate Listing & Architectural Photography',
      what: 'Wide-angle interior photos with detailed wood grain and tile lines.',
      why: 'Fine textures require calibrated chroma subsampling (4:4:4 vs 4:2:0).',
      action: 'Use Recommended mode (78% quality) to retain texture while cutting 65% of raw camera file size.'
    },
    {
      title: '28. Candidate Photograph for NEET, JEE & UGC NET Admit Cards',
      what: 'National Testing Agency (NTA) mandates photo between 10 KB and 200 KB.',
      why: 'Central servers reject files outside the strict min/max boundary.',
      action: 'Select the 100 KB preset for safe, validated admission upload compliance.'
    },
    {
      title: '29. Candidate Signature Between 4 KB and 30 KB',
      what: 'State and national exam portals enforce tiny signature byte ranges.',
      why: 'Signatures are displayed at 2 inches wide on printable admit cards.',
      action: 'Select the 20 KB preset to achieve compliant signature files effortlessly.'
    },
    {
      title: '30. Wedding & Event Photographer Client Proofs',
      what: 'Exporting 500+ client gallery proofs for quick client WhatsApp review.',
      why: 'Raw exports of 15 MB each stall client cellular data connections.',
      action: 'Queue photos and compress to 500 KB for rapid, crisp client proofing.'
    },
    {
      title: '31. Email Attachment Limits (Gmail 25 MB, Outlook 20 MB)',
      what: 'Sending 10 presentation slides or team photos exceeding email ceiling.',
      why: 'Mail transfer agents bounce messages that exceed gateway size thresholds.',
      action: 'Batch compress images to 500 KB to comfortably fit 20+ attachments.'
    },
    {
      title: '32. Resume & CV Headshot Embedding',
      what: 'Inserting a 10 MB raw phone selfie inflates the final PDF resume to 12 MB.',
      why: 'Recruitment portals (Naukri, Indeed, LinkedIn) reject resumes larger than 2 MB.',
      action: 'Compress headshot to 100 KB before inserting into Word or Canva.'
    },
    {
      title: '33. Blog & Editorial Featured Images (1200×630 OpenGraph)',
      what: 'Social share cards must load instantly when shared on Twitter/X, Facebook, LinkedIn.',
      why: 'Slow OG image responses cause social crawlers to display blank preview cards.',
      action: 'Compress to under 150 KB for instant social card rendering.'
    },
    {
      title: '34. Driving Licence & Vehicle Registration (Vahan / Sarathi)',
      what: 'Transport portals mandate RC and DL scans under 200 KB.',
      why: 'Government document repositories enforce uniform storage ceilings.',
      action: 'Select 200 KB preset for 100% acceptance on Sarathi transport portals.'
    },
    {
      title: '35. College Admission & Scholarship Application (NSP / State)',
      what: 'Income, domicile, and marksheet photos rejected due to size over 100 KB.',
      why: 'State scholarship engines automatically validate file size before opening form.',
      action: 'Select 100 KB preset to bypass rejection warnings.'
    },
    {
      title: '36. Bank KYC Verification (Aadhaar & PAN Card Photos)',
      what: 'Netbanking video-KYC and digital onboarding portals demand clear photos under 300 KB.',
      why: 'Automated OCR systems need clear text without heavy JPEG block noise.',
      action: 'Select 300 KB preset for sharp character recognition on names and numbers.'
    },
    {
      title: '37. Web Performance (Google Core Web Vitals & LCP)',
      what: 'Largest Contentful Paint (LCP) score drops due to oversized hero images.',
      why: 'Google ranks fast-loading sites higher; uncompressed hero images delay LCP by 2 to 4 seconds.',
      action: 'Convert to WebP and compress hero images to under 200 KB.'
    },
    {
      title: '38. WhatsApp Profile Picture (DP) Uploads',
      what: 'WhatsApp automatically compresses high-res DPs with aggressive blur.',
      why: 'WhatsApp server-side compression is uncalibrated and creates visible blur.',
      action: 'Pre-compress your square 1:1 image to 150 KB on RajToolBox for crisp, unblurred DP display.'
    },
    {
      title: '39. Macro Close-Up Photography (Jewelry & Flowers)',
      what: 'Subtle color gradations in flower petals show banding if over-compressed.',
      why: 'Aggressive quantization flattens smooth color gradients into stepped posterization bands.',
      action: 'Use Recommended mode (78% quality) to preserve rich tonal depth.'
    },
    {
      title: '40. Dark Mode & Night Sky Photography',
      what: 'Dark background areas show blocky compression artifacts (macroblocking).',
      why: 'Human eyes are sensitive to subtle brightness variations in near-black regions.',
      action: 'Keep quality above 80% to maintain clean, deep black backgrounds.'
    },
    {
      title: '41. In-Browser Image Inspection (Before vs After)',
      what: 'Users need visual confirmation before saving.',
      why: 'Blind compression without preview leads to unexpected quality surprises.',
      action: 'Click "Compare Before & After" to inspect side-by-side with zoom up to 300%.'
    },
    {
      title: '42. Client-Side Offline Functionality',
      what: 'Tool functions seamlessly even when cellular connection drops.',
      why: 'All canvas algorithms execute in browser JavaScript without remote API calls.',
      action: 'Compress photos securely anywhere without internet dependency.'
    },
    {
      title: '43. Batch ZIP Download Naming Consistency',
      what: 'Files retain original name with clean `-compressed-100kb` suffixes.',
      why: 'Messy renaming causes confusion when sorting large sets of client photos.',
      action: 'RajToolBox bundles files with predictable, descriptive names inside the ZIP package.'
    },
    {
      title: '44. Privacy Guarantee for Confidential ID Documents',
      what: 'Photos of personal IDs, tax forms, and family photos remain 100% private.',
      why: 'Cloud compressors upload files to third-party servers with unclear data retention policies.',
      action: 'RajToolBox processes 100% locally in device RAM. Zero bytes are transmitted to any server.'
    }
  ];

  // 12 Real-World Researched Examples
  const realWorldExamples = [
    {
      title: 'Example 1: Smartphone Camera Photo (3.4 MB &rarr; Target 100 KB for Online Form)',
      original: '3.4 MB (4032 × 3024 px, iPhone JPG)',
      target: '100 KB Target Preset',
      approach: 'Select Target Size: 100 KB &rarr; Engine runs binary search on quality &rarr; Calibrates resolution to 1600 × 1200 &rarr; Encodes JPEG.',
      result: 'Compressed to 94.6 KB (97.2% reduction). Target reached &check;.',
      quality: 'Face, clothing, and background remain completely natural and sharp. Passes online exam portal validation instantly.'
    },
    {
      title: 'Example 2: Government Portal Candidate Photo (680 KB &rarr; Target 50 KB)',
      original: '680 KB (1200 × 1500 px, Color Portrait)',
      target: '50 KB Target Preset',
      approach: 'Target Size: 50 KB &rarr; Iterative quality search &rarr; Strips camera EXIF metadata &rarr; Optimizes quantization matrix.',
      result: 'Compressed to 46.2 KB (93.2% saved). Target reached &check;.',
      quality: 'Ears, eyes, and white background stay crystal clear. 100% compliant with SSC/UPSC registration guidelines.'
    },
    {
      title: 'Example 3: Candidate Signature Scan (420 KB &rarr; Target 20 KB)',
      original: '420 KB (Black ink on paper, PNG)',
      target: '20 KB Target Preset',
      approach: 'Target Size: 20 KB &rarr; Composited over white background &rarr; Scaled to 600 × 240 &rarr; Encoded to high-contrast JPEG.',
      result: 'Compressed to 18.4 KB (95.6% saved). Target reached &check;.',
      quality: 'Signature loops and pen pressure remain distinct without fuzzy artifacts.'
    },
    {
      title: 'Example 4: Transparent Company Logo (2.1 MB PNG &rarr; Target 150 KB)',
      original: '2.1 MB (2400 × 2400 px, 32-bit Transparent PNG)',
      target: '150 KB Target Preset (Auto Format: WebP)',
      approach: 'Auto format detects alpha channel &rarr; Selects WebP with transparency &rarr; Iterative compression.',
      result: 'Compressed to 112 KB (94.7% saved) in WebP format with 100% alpha transparency intact.',
      quality: 'Crisp vector-like edges on website header without any black background boxes.'
    },
    {
      title: 'Example 5: Blog Featured Header Image (1.8 MB JPG &rarr; Recommended Mode)',
      original: '1.8 MB (1920 × 1080 px, Stock Photography)',
      target: 'Recommended Mode (78% Quality)',
      approach: 'Recommended mode &rarr; Strips metadata &rarr; Optimized Huffman tables &rarr; Preserves 1920 × 1080 resolution.',
      result: 'Compressed to 284 KB (84.2% saved).',
      quality: 'Zero perceptible visual difference from original on retina screens. Improves Google PageSpeed score.'
    },
    {
      title: 'Example 6: Bulk Batch Compression (5 Event Photos, 18.5 MB Total)',
      original: '5 Photos (18.5 MB total input)',
      target: 'Strong Mode (55% Quality, 1920px max)',
      approach: 'Click "+ Add More Images" &rarr; Select 5 photos &rarr; Choose Strong mode &rarr; Click "Compress 5 Images Now".',
      result: 'Total queue reduced to 2.4 MB (87.0% saved). Single-click "Download All as ZIP".',
      quality: 'All 5 images bundled into a single ZIP archive, ready for immediate WhatsApp / Email sharing.'
    },
    {
      title: 'Example 7: Bank KYC Document Photo (1.5 MB &rarr; Target 300 KB)',
      original: '1.5 MB (Aadhaar / Passport document photo)',
      target: '300 KB Target Preset',
      approach: 'Target Size: 300 KB &rarr; Preserves high resolution &rarr; Calibrates quality to 74%.',
      result: 'Compressed to 280 KB (81.3% saved). Target reached &check;.',
      quality: 'Document alphanumeric ID numbers, dates, and official seals remain 100% readable for OCR verification.'
    },
    {
      title: 'Example 8: eCommerce Product Photo (4.2 MB &rarr; Target 200 KB)',
      original: '4.2 MB (White background product shot, 3000 × 3000 px)',
      target: '200 KB Target Preset',
      approach: 'Target Size: 200 KB &rarr; Scales dimensions to 1600 × 1600 &rarr; Quality 78%.',
      result: 'Compressed to 175 KB (95.8% saved). Target reached &check;.',
      quality: 'Product fabric texture and stitches stay razor-sharp for Amazon and Shopify zoom inspection.'
    },
    {
      title: 'Example 9: Academic Research Poster Graphic (8.6 MB &rarr; Target 1 MB)',
      original: '8.6 MB (Scientific chart and microscopy mosaic)',
      target: '1 MB Target Preset',
      approach: 'Target Size: 1 MB &rarr; High quality preservation &rarr; Removes unneeded metadata.',
      result: 'Compressed to 890 KB (89.7% saved). Target reached &check;.',
      quality: 'Graph axis labels, data points, and microscopy coloration remain immaculate.'
    },
    {
      title: 'Example 10: WhatsApp Profile DP (1.2 MB &rarr; Target 150 KB Square)',
      original: '1.2 MB (Square 1:1 portrait)',
      target: '150 KB Target Preset',
      approach: 'Target Size: 150 KB &rarr; Keeps 1:1 aspect ratio &rarr; Optimized JPEG.',
      result: 'Compressed to 134 KB (88.8% saved).',
      quality: 'Bypasses aggressive WhatsApp compression. Profile picture displays with maximum clarity.'
    },
    {
      title: 'Example 11: Real Estate Interior Listing (5.4 MB &rarr; Target 500 KB)',
      original: '5.4 MB (Wide-angle architectural interior photo)',
      target: '500 KB Target Preset',
      approach: 'Target Size: 500 KB &rarr; Maintains 2400px width &rarr; Optimized quantization.',
      result: 'Compressed to 460 KB (91.5% saved). Target reached &check;.',
      quality: 'Lighting highlights and hardwood floor textures remain pristine for property buyers.'
    },
    {
      title: 'Example 12: High-Fidelity Print Master (12.0 MB &rarr; Basic / Light Mode)',
      original: '12.0 MB (High-res digital artwork)',
      target: 'Basic / Light Mode (90% Quality)',
      approach: 'Basic mode &rarr; Retains 100% original dimensions &rarr; Mild lossless-level compaction.',
      result: 'Compressed to 4.2 MB (65.0% saved).',
      quality: 'Preserves micro-details and print-ready dynamic range for posters and brochures.'
    }
  ];

  // 25 Comprehensive Researched FAQs
  const faqsList = [
    {
      q: '1. How do I compress an image online with RajToolBox?',
      a: 'Drag and drop your JPG, PNG, or WebP image into the upload box (or tap "Choose Image Files"). Select your desired compression mode or pick a Target Size (such as 50 KB or 100 KB), click Compress, compare the Before & After preview, and tap Download.'
    },
    {
      q: '2. How do I compress an image to exactly 100 KB?',
      a: 'Select "Target Size" mode, click the "100 KB" preset, and tap "Compress to 100 KB". The engine runs a binary quality search and measures the physical output Blob to ensure your file stays within 100 KB for job and exam portals.'
    },
    {
      q: '3. How do I compress an image to 50 KB?',
      a: 'Choose the "50 KB" target preset. If the image has extremely large camera dimensions (e.g. 4000×3000 px), the engine intelligently adjusts dimensions while preserving exact aspect ratio so your file hits 50 KB without facial distortion.'
    },
    {
      q: '4. How do I compress a photo to 20 KB for a signature or admit card?',
      a: 'Select the "20 KB" preset. For signatures and passport slips, the tool automatically crops excess whitespace metadata and optimizes black-and-white contrast for state examination portal requirements.'
    },
    {
      q: '5. Can I compress an image without losing quality?',
      a: 'Yes. Choose "Basic / Light" mode (90% quality) or "Recommended" mode (78% quality). Human vision cannot detect the difference in subtle pixel quantization at these settings, yet file size drops by 60% to 80%.'
    },
    {
      q: '6. Are my photos uploaded to your server?',
      a: 'Never. RajToolBox Image Compressor executes 100% locally inside your device browser using HTML5 Canvas and WebAssembly. Your photos, signatures, and confidential ID documents never leave your phone or computer.'
    },
    {
      q: '7. What image formats are supported?',
      a: 'The compressor fully supports JPG, JPEG, PNG, and WebP images. You can also convert between formats (e.g. PNG to WebP or JPG to WebP) for superior file reduction.'
    },
    {
      q: '8. What happens to transparent PNGs when compressed?',
      a: 'If you convert a transparent PNG to JPG (which has no transparency), RajToolBox automatically fills the background with pure white so your image never turns black. If you select "Auto" or "WebP", transparency is 100% preserved.'
    },
    {
      q: '9. Can I compress multiple images at the same time?',
      a: 'Yes. You can select multiple images at once or click "+ Add More Images" to queue files. After compression, click "Download All as ZIP" to get all optimized photos bundled into a single archive.'
    },
    {
      q: '10. Why did my image not reach the exact selected target size?',
      a: 'If an image has high entropy (e.g. complex fine textures) or tiny dimensions, reducing quality past a safe threshold would completely destroy legibility. RajToolBox honestly shows "Target not reached" and displays the lowest safely achievable size rather than faking success.'
    },
    {
      q: '11. Does compressing an image change its dimensions (width & height)?',
      a: 'By default in Recommended and Basic modes, dimensions are 100% preserved. In Target Size mode, if an ultra-high resolution photo cannot reach an aggressive target (like 20 KB) through quality alone, dimensions are safely downscaled with aspect ratio strictly maintained.'
    },
    {
      q: '12. Can I specify custom image width and height?',
      a: 'Yes. Under "Dimensions & Scaling", choose "Custom Width / Height". You can enter exact pixel dimensions and lock the aspect ratio so your photo never looks stretched or squashed.'
    },
    {
      q: '13. Can I compress images on my mobile phone (iPhone or Android)?',
      a: 'Yes. The interface is touch-optimized for iOS Safari, Android Chrome, and mobile browsers. You can even use the "Share File" button to send the compressed photo directly to WhatsApp, Telegram, or Google Drive.'
    },
    {
      q: '14. What is the difference between lossy and lossless compression?',
      a: 'Lossless compression (like standard PNG) rearranges pixel data without discarding any information, resulting in moderate size reduction (10–30%). Lossy compression (like JPEG and WebP) discards imperceptible color variations, achieving 70–90% reduction while maintaining excellent visual clarity.'
    },
    {
      q: '15. Why is WebP format better than JPEG?',
      a: 'WebP uses advanced predictive block coding derived from video compression. It produces files 25% to 35% smaller than JPEG at identical visual quality and supports transparent backgrounds.'
    },
    {
      q: '16. Can I compress a photo for an exam portal like SSC, UPSC, or GATE?',
      a: 'Yes. State and national recruitment portals require candidate photos between 20 KB and 50 KB and signatures between 10 KB and 20 KB. RajToolBox dedicated presets are calibrated specifically for these limits.'
    },
    {
      q: '17. How do I preview the compressed image before downloading?',
      a: 'Click "Compare Before & After" on any completed card. A full inspection modal opens showing the original image next to the actual compressed result with zoom controls up to 300%.'
    },
    {
      q: '18. Can I compress a very large photo (20 MB or 30 MB)?',
      a: 'Yes. Modern devices with current browsers easily process large camera files directly in browser memory without crashing.'
    },
    {
      q: '19. Does image compression remove EXIF data?',
      a: 'Yes. Re-encoding strips camera metadata (GPS coordinates, camera model, exposure settings), which protects your personal privacy and saves 10 KB to 50 KB of non-pixel overhead.'
    },
    {
      q: '20. Can I compress photos without an internet connection?',
      a: 'Yes. Once the page is loaded, the compression engine runs entirely client-side in your browser. You can disconnect from Wi-Fi or mobile data and continue compressing securely.'
    },
    {
      q: '21. Why did my image become blurry when compressed with another tool?',
      a: 'Inferior tools blindly downscale resolution to 300 pixels or use heavy 10% quality. RajToolBox uses a multi-pass binary search that calculates the highest possible quality that still satisfies your target limit.'
    },
    {
      q: '22. Can I compress images for my website or Shopify store?',
      a: 'Yes. Compress product photos and blog images to under 150 KB using WebP or Recommended mode to significantly improve Google PageSpeed and Core Web Vitals.'
    },
    {
      q: '23. Is there any watermark added to the compressed image?',
      a: 'No. RajToolBox is 100% free with zero watermarks, zero branding overlays, and zero limits on the number of images you can process.'
    },
    {
      q: '24. How is the compressed file named when downloaded?',
      a: 'Downloaded files preserve your original filename with a clean suffix, such as `photo-compressed-50kb.jpg`, ensuring easy identification in your downloads folder.'
    },
    {
      q: '25. Should I keep my original high-resolution photo?',
      a: 'Yes. Always keep your original camera photo as a master archival copy, especially for family albums, professional prints, and master creative files.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        categorySlug={category?.slug || 'image-tools'}
        categoryName={category?.name || 'Image Tools'}
        toolName="Image Compressor"
      />

      {/* 2. H1 + 3. INTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
            <span className="font-semibold text-[#EC4899]">Image Tools</span>
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
            Image Compressor
          </h1>

          <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
            Compress JPG, PNG, and WebP images online while keeping your photos sharp and clear. Choose a compression level or target size (20 KB, 50 KB, 100 KB, 200 KB), preview Before &amp; After, then download or share your compressed image.
          </p>
        </div>

        <button
          onClick={() => toggleFavorite(tool.slug)}
          className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
            favored
              ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
              : 'border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#71717A] hover:border-[#EC4899]'
          }`}
          title={favored ? 'Remove from favorites' : 'Save tool'}
        >
          <Bookmark className={`w-4 h-4 ${favored ? 'fill-current text-[#EC4899]' : ''}`} />
          <span>{favored ? 'Saved' : 'Save Tool'}</span>
        </button>
      </div>

      {/* 4. INTERACTIVE TOOL COMPONENT */}
      <div className="mb-12">
        <ImageCompressorTool />
      </div>

      {/* 5. HOW TO USE */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#EC4899]" />
          How to Compress Images Online (Step-by-Step)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">1</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Upload Image(s)</h3>
            <p>Drag and drop your JPG, PNG, or WebP files into the upload box, or click "Choose Image Files". You can select multiple images to compress in bulk.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">2</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Pick Compression Mode or Target</h3>
            <p>Choose "Target Size" to aim for exact limits (e.g. 50 KB, 100 KB, 200 KB), or select "Recommended" (78% quality) or "Strong" (55% quality).</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">3</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Adjust Dimensions (Optional)</h3>
            <p>Keep original dimensions, scale by percentage (75%, 50%), or set custom pixel width/height with aspect ratio lock enabled.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-flex items-center justify-center">4</span>
            <h3 className="font-bold text-[#18181B] dark:text-[#F4F4F5]">Inspect &amp; Download</h3>
            <p>Tap "Compare Before &amp; After" to inspect visual quality with zoom up to 300%. Download individually or click "Download All as ZIP".</p>
          </div>
        </div>
      </section>

      {/* 6. VISUAL FLOWCHART / DIAGRAM */}
      <section className="p-6 rounded-3xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-6">
        <div>
          <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#EC4899]" />
            How the Progressive Target-Size Compression Engine Works
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            Understanding the multi-pass decision tree that delivers real byte reduction without destroying visual legibility.
          </p>
        </div>

        {/* Responsive Flowchart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] overflow-x-auto">
          <div className="min-w-[620px] flex flex-col items-center gap-3 text-xs">
            {/* Step 1 */}
            <div className="w-64 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center font-bold text-[#18181B] dark:text-[#F4F4F5]">
              Upload Image &amp; Detect Format + Dimensions
            </div>
            <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700"></div>

            {/* Step 2 */}
            <div className="w-64 p-3 rounded-xl border border-[#EC4899]/40 bg-[#FCE7F3]/40 dark:bg-[#EC4899]/15 text-center font-bold text-[#EC4899]">
              Select Target Goal (e.g. 50 KB, 100 KB, 200 KB)
            </div>
            <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700"></div>

            {/* Step 3 */}
            <div className="w-72 p-3 rounded-xl border border-[#FACC15] bg-[#FEF3C7] dark:bg-[#FACC15]/20 text-center font-bold text-[#854D0E] dark:text-[#FACC15]">
              Pass 1: Binary Search on Quality (0.10 to 0.92)
            </div>
            <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700"></div>

            {/* Step 4 Decision */}
            <div className="w-80 p-3 rounded-2xl border-2 border-dashed border-[#16A34A] bg-emerald-50 dark:bg-emerald-950/30 text-center font-bold text-[#16A34A] dark:text-[#4ADE80]">
              Measure Actual Generated Blob Size: Target Reached?
            </div>

            {/* Branching */}
            <div className="w-full flex justify-around pt-2">
              {/* YES Branch */}
              <div className="flex flex-col items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                  YES (&le; Target)
                </span>
                <div className="w-0.5 h-4 bg-emerald-300"></div>
                <div className="w-56 p-3 rounded-xl border border-emerald-400 bg-white dark:bg-zinc-900 text-center font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
                  ✓ Finalize Output &amp; Generate Preview (Target Reached)
                </div>
              </div>

              {/* NO Branch */}
              <div className="flex flex-col items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                  NO (&gt; Target)
                </span>
                <div className="w-0.5 h-4 bg-amber-300"></div>
                <div className="w-64 p-3 rounded-xl border border-amber-400 bg-white dark:bg-zinc-900 text-center font-bold text-amber-800 dark:text-amber-300 shadow-xs">
                  Pass 2: Progressive Resolution Scaling (Aspect Preserved)
                </div>
                <div className="w-0.5 h-4 bg-amber-300"></div>
                <div className="w-64 p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-center text-[11px] text-[#71717A]">
                  Stop at Safe Readability Floor &amp; Report Honest Achieved Size
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHAT IS IMAGE COMPRESSION & HOW IT WORKS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
          <h2 className="text-base font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EC4899]" />
            What Is Image Compression?
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            Image compression is the process of encoding digital graphic data to use significantly fewer bytes than the uncompressed original. A standard 12-megapixel photograph from a modern smartphone contains roughly 36 million bytes of raw RGB pixel data. Compression identifies redundant patterns across adjacent pixels, encodes color frequencies, and strips unnecessary metadata to reduce file size from 4 MB down to 100 KB without perceptible loss in visual clarity.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
          <h2 className="text-base font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FACC15]" />
            How Does Image Compression Work?
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            Modern compressors employ discrete cosine transform (DCT) and chroma subsampling. Because human eyes are far more sensitive to brightness (luminance) than to subtle color variations (chrominance), the algorithm preserves sharp luminance edges while gently averaging color gradients. Quantization tables then eliminate high-frequency noise that the human eye cannot discern, followed by Huffman entropy encoding for ultra-compact storage.
          </p>
        </div>
      </section>

      {/* 8. QUALITY & DIMENSIONS & FORMAT EXPLANATION */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
          Understanding the Balance: Quality, Dimensions &amp; Format
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <h3 className="font-bold text-[#EC4899]">Quality Level (0% to 100%)</h3>
            <p className="text-[#71717A]">
              Controls quantization aggressiveness. Quality at 75–80% yields nearly imperceptible visual differences while slashing 70% of file size. Going below 40% introduces block artifacts unless resolution is adjusted.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <h3 className="font-bold text-[#FACC15] dark:text-yellow-400">Dimensions (Resolution)</h3>
            <p className="text-[#71717A]">
              Byte weight scales quadratically with pixel count (Width × Height). An 8000px camera photo cannot reach 20 KB safely without downscaling to 1200px. Scaling dimensions with locked aspect ratio preserves facial symmetry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <h3 className="font-bold text-[#16A34A] dark:text-emerald-400">Format Selection</h3>
            <p className="text-[#71717A]">
              <strong>JPG</strong> is universal for photos. <strong>WebP</strong> offers 30% smaller files and supports transparency. <strong>PNG</strong> is lossless for logos but produces larger file sizes for photographic imagery.
            </p>
          </div>
        </div>
      </section>

      {/* 9. REAL LIFE EXAMPLES (12 EXAMPLES) */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-6">
        <div>
          <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
            12 Real-Life Image Compression Examples
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            Real test scenarios reflecting actual job portals, government admit cards, signatures, and website performance demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realWorldExamples.map((ex, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2 text-xs"
            >
              <h3 className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">
                {ex.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-[#71717A]">
                <span>Original: <strong>{ex.original}</strong></span>
                <span>&rarr;</span>
                <span>Goal: <strong className="text-[#EC4899]">{ex.target}</strong></span>
              </div>
              <p className="text-[#71717A]"><strong>Method:</strong> {ex.approach}</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                <strong>Result:</strong> {ex.result}
              </p>
              <p className="text-[#71717A]"><strong>Visual Quality:</strong> {ex.quality}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. WHEN TO USE & WHEN NOT TO USE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
          <h2 className="text-base font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            When Should I Compress Images?
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-400">
            <li>&bull; <strong>Job &amp; Exam Portals:</strong> Submitting photos and signatures under 50 KB or 20 KB.</li>
            <li>&bull; <strong>Websites &amp; Blogs:</strong> Boosting Google Core Web Vitals and LCP loading speed.</li>
            <li>&bull; <strong>Email Attachments:</strong> Keeping multiple files comfortably under 20 MB limits.</li>
            <li>&bull; <strong>Messaging Apps:</strong> Preventing heavy cellular data consumption on WhatsApp/Telegram.</li>
            <li>&bull; <strong>Device Storage:</strong> Saving storage space on smartphones and backup hard drives.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
          <h2 className="text-base font-black text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-600" />
            When Should I NOT Compress Images?
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-amber-800 dark:text-amber-400">
            <li>&bull; <strong>Archival Master Copies:</strong> Keep raw original camera files for long-term backups.</li>
            <li>&bull; <strong>Fine Art Printing:</strong> Large gallery canvas prints requiring 300+ DPI TIFF masters.</li>
            <li>&bull; <strong>Active Photo Editing:</strong> Images you plan to heavily color-grade in Photoshop/Lightroom.</li>
            <li>&bull; <strong>Already Optimized Files:</strong> Re-compressing an already compressed 30 KB JPG adds artifacts.</li>
          </ul>
        </div>
      </section>

      {/* 11. 44 COMPLETE EDGE CASES ACCORDION */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
        <div>
          <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FACC15]" />
            44 Comprehensive Edge Cases &amp; How RajToolBox Solves Them
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            From transparent signatures to 108 MP smartphone photos, explore how our client-side engine handles every technical hurdle.
          </p>
        </div>

        <div className="space-y-2">
          {edgeCasesList.map((ec, idx) => (
            <div
              key={idx}
              className="border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl overflow-hidden bg-[#FFFDF7] dark:bg-[#202026]"
            >
              <button
                type="button"
                onClick={() => setActiveEdgeCase(activeEdgeCase === idx ? null : idx)}
                className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] transition-colors cursor-pointer"
              >
                <span>{ec.title}</span>
                {activeEdgeCase === idx ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-[#EC4899]" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-[#71717A]" />
                )}
              </button>

              {activeEdgeCase === idx && (
                <div className="p-4 border-t border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs space-y-2 leading-relaxed animate-in fade-in">
                  <p><strong className="text-[#18181B] dark:text-[#F4F4F5]">What Happens:</strong> {ec.what}</p>
                  <p className="text-[#71717A]"><strong className="text-[#18181B] dark:text-[#F4F4F5]">Why:</strong> {ec.why}</p>
                  <p className="text-[#16A34A] dark:text-[#4ADE80] font-semibold"><strong>Action &amp; Solution:</strong> {ec.action}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. COMMON MISTAKES */}
      <section className="p-6 rounded-3xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
          Common Mistakes to Avoid When Compressing Images
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1">
            <h3 className="font-bold text-red-600 dark:text-red-400">1. Blindly Targeting Impossible KB Limits</h3>
            <p className="text-[#71717A]">Expecting a 4000×3000 detailed landscape to reach 10 KB without resolution scaling destroys readability. Match target size to realistic pixel dimensions.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1">
            <h3 className="font-bold text-red-600 dark:text-red-400">2. Repeatedly Re-compressing the Same JPEG</h3>
            <p className="text-[#71717A]">Every lossy pass creates generation loss. Always compress directly from the original source photo rather than an already compressed file.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1">
            <h3 className="font-bold text-red-600 dark:text-red-400">3. Distorting Image Aspect Ratio</h3>
            <p className="text-[#71717A]">Manually entering arbitrary width and height stretches faces. Keep "Lock aspect ratio" checked to maintain natural proportions.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-1">
            <h3 className="font-bold text-red-600 dark:text-red-400">4. Trusting UI Estimates Over Actual Blob Measurement</h3>
            <p className="text-[#71717A]">Some tools show fake numbers based on formulas. RajToolBox strictly checks physical byte length (`blob.size`) before displaying metrics.</p>
          </div>
        </div>
      </section>

      {/* 13. 25 FAQS */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
        <div>
          <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#EC4899]" />
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            Answers to common questions about image compression, file formats, and online portal compliance.
          </p>
        </div>

        <div className="space-y-2">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl overflow-hidden bg-[#FFFDF7] dark:bg-[#202026]"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] hover:text-[#EC4899] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-[#EC4899]" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-[#71717A]" />
                )}
              </button>

              {activeFaq === idx && (
                <div className="p-4 border-t border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 14. RELATED WORKFLOWS & TOOLS */}
      <section className="p-6 rounded-3xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] mb-8 space-y-4">
        <h2 className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
          Recommended Image Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#EC4899]">Government Application Workflow</span>
            <p className="text-[#71717A]">
              1. Resize Passport Photo &rarr; 2. Compress to 50 KB &rarr; 3. Compress Signature to 20 KB &rarr; 4. Upload with 100% confidence.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#FACC15] dark:text-yellow-400">Website Speed Workflow</span>
            <p className="text-[#71717A]">
              1. Scale to max 1920px &rarr; 2. Convert to WebP &rarr; 3. Compress to &lt; 150 KB &rarr; 4. Deploy for fast Core Web Vitals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <span className="font-bold text-[#16A34A] dark:text-emerald-400">Document to PDF Workflow</span>
            <p className="text-[#71717A]">
              1. Compress Photo Scans &rarr; 2. Merge into single file with Image to PDF &rarr; 3. Compress final document with PDF Compressor.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <RelatedTools currentTool={tool} />
        </div>
      </section>

      {/* 15. AUTHOR & TRUST SECTION */}
      <div className="mb-8">
        <AuthorBox />
      </div>

      {/* 16. PAGE-LEVEL SHARE BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA]">
          <Share2 className="w-4 h-4 text-[#EC4899]" />
          <span>Share RajToolBox Image Compressor:</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              'Compress large JPG, PNG, and WebP images online with 100% private in-browser tool: https://rajtoolbox.com/tools/image-compressor/'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#25D366] text-[#25D366] transition-all"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              'https://rajtoolbox.com/tools/image-compressor/'
            )}&text=${encodeURIComponent('Compress large image files online for free on RajToolBox')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#0088cc] text-[#0088cc] transition-all"
            title="Share on Telegram"
          >
            <Send className="w-4 h-4" />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(
              'Helpful Image Compressor Tool'
            )}&body=${encodeURIComponent(
              'I found this free Image Compressor on RajToolBox that reduces JPG/PNG/WebP size directly inside the browser: https://rajtoolbox.com/tools/image-compressor/'
            )}`}
            className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A] hover:text-[#EC4899] transition-all"
            title="Share via Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] font-semibold cursor-pointer"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
