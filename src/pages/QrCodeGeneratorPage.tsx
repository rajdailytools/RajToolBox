import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { QrCodeGeneratorWorkspace } from '../tools/components/QrCodeGeneratorWorkspace';
import { AuthorBox } from '../components/ui/AuthorBox';
import { RelatedTools } from '../components/ui/RelatedTools';
import { RajToolBoxLogo } from '../components/RajToolBoxLogo';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  FileCheck2,
  Info,
  ExternalLink,
  Smartphone,
  Wifi,
  Mail,
  Phone,
  Contact,
  CreditCard,
  MapPin,
  Calendar,
  Download,
  Printer
} from 'lucide-react';

interface QrCodeGeneratorPageProps {
  tool: ToolItem;
}

export const QrCodeGeneratorPage: React.FC<QrCodeGeneratorPageProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const category = CATEGORIES[tool.category] || CATEGORIES['qr-barcode-tools'];
  const favored = isFavorite(tool.slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeProblem, setActiveProblem] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Sync document title, meta description, and canonical link
  useEffect(() => {
    document.title = 'QR Code Generator – Free Online QR Maker | RajToolBox';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Create QR codes for links, text, contact details and supported formats with RajToolBox. Customize, preview, download and scan-test your QR code.'
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://rajtoolbox.com/tools/qr-code-generator/');
  }, [tool]);

  const canonicalUrl = 'https://rajtoolbox.com/tools/qr-code-generator/';
  const shareMessage = `Try the RajToolBox QR Code Generator to create and customize QR codes: ${canonicalUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  const [toolLinkCopied, setToolLinkCopied] = useState<boolean>(false);

  const copyPageLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setLinkCopied(true);
    showToast('Tool link copied to clipboard!', 'success');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code Generator – RajToolBox',
          text: 'Try the RajToolBox QR Code Generator to create and customize QR codes:',
          url: canonicalUrl
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyPageLink();
        }
      }
    } else {
      copyPageLink();
    }
  };

  const handleCopyToolLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setToolLinkCopied(true);
    showToast('Tool link copied to clipboard!', 'success');
    setTimeout(() => setToolLinkCopied(false), 2500);
  };

  const handleShareTool = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code Generator – RajToolBox',
          text: 'Try the RajToolBox QR Code Generator to create and customize QR codes:',
          url: canonicalUrl
        });
        showToast('Tool link shared successfully!', 'success');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyToolLink();
        }
      }
    } else {
      handleCopyToolLink();
    }
  };

  const faqs = [
    {
      q: 'What is a QR code?',
      a: 'A Quick Response (QR) code is a two-dimensional barcode consisting of black and white square modules arranged in a square grid on a contrasting background. Invented in 1994 by Denso Wave, it encodes numeric, alphanumeric, byte, or kanji data that can be quickly scanned and read optically by smartphone cameras and digital barcode readers.'
    },
    {
      q: 'How do I create a QR code online with RajToolBox?',
      a: 'Select your desired QR type (Website URL, Plain Text, Wi-Fi, Contact vCard, UPI Payment, Email, or SMS), enter your information into the guided input fields, customize the colors or upload an optional center logo, inspect the live generated preview, and click "Download High-Res PNG" or "Download SVG".'
    },
    {
      q: 'Can I make a QR code for free on RajToolBox?',
      a: 'Yes, 100% free. RajToolBox does not require sign-up, email registration, subscriptions, or credit card details. There are no scan caps, no hidden fees, and no watermarks placed on your generated QR codes.'
    },
    {
      q: 'Does a static QR code expire?',
      a: 'No. Static QR codes encode your exact payload directly into the visual dot pattern. Because there is no intermediary server or subscription redirect involved, a static QR code never expires and will remain readable forever as long as the printed medium remains physically intact.'
    },
    {
      q: 'Can I edit a QR code after printing it?',
      a: 'No, you cannot edit the destination or content of an already printed static QR code. The information is permanently stamped into the physical arrangement of dots. If your website URL or phone number changes, you must generate and print a new QR code. (Services that claim editable printed QR codes use "dynamic" redirects hosted on their own servers).'
    },
    {
      q: 'What is the difference between static and dynamic QR codes?',
      a: 'A static QR code stores the raw data directly (e.g., your actual URL, Wi-Fi password, or vCard details) and works independently without any third party. A dynamic QR code stores a short link that redirects to a remote server; if that server goes down, cancels your subscription, or changes ownership, the dynamic QR stops working.'
    },
    {
      q: 'Can I add my own logo to the QR code?',
      a: 'Yes. You can upload any image (PNG, JPG, SVG, WebP) up to 2 MB. RajToolBox automatically elevates the Reed-Solomon Error Correction Level to High (H, ~30% recovery capacity) so that the scanner reconstructs the covered data behind the logo seamlessly.'
    },
    {
      q: 'Why is my customized QR code not scanning?',
      a: 'Common reasons include: low contrast between dots and background (e.g., light gray on white), an inverted color scheme (white dots on dark background, which older phone cameras struggle to detect), an oversized logo obscuring more than 25% of the code, or a missing quiet zone (outer white margin).'
    },
    {
      q: 'Should I download PNG or SVG format?',
      a: 'Download PNG (400px or 800px) for digital displays, websites, social media, email newsletters, and desktop viewing. Download SVG (vector) or High-Res PNG (1600px/2400px) for physical printing, business cards, restaurant table tents, merchandise, signs, and large billboard banners because SVG scales infinitely without pixelation.'
    },
    {
      q: 'Can I generate a QR code for my Wi-Fi network?',
      a: 'Yes. Select the "Wi-Fi Network" tab, enter your SSID (network name) and password, and pick your encryption type (WPA/WPA2/WPA3 or Open). When guests scan the printed code with their iPhone or Android camera, their phone displays an instant "Join Network" prompt without manual typing.'
    },
    {
      q: 'Can a QR code contain contact details (vCard)?',
      a: 'Yes. Select the "Contact (vCard)" tab to create an RFC 2426 vCard 3.0 code containing your name, phone, email, organization, title, website, and address. When scanned, modern smartphones offer a one-tap "Add to Contacts" action.'
    },
    {
      q: 'Can I share a QR code through WhatsApp?',
      a: 'Yes. You can download the PNG image and share it directly in any WhatsApp chat or group. On mobile devices that support the Web Share API, clicking "Share" opens your native sharing sheet directly, allowing you to forward the QR image to WhatsApp.'
    },
    {
      q: 'Does scanning a QR code require internet access?',
      a: 'It depends on the content: plain text, vCard contacts, telephone numbers, SMS drafts, and Wi-Fi credentials do not require internet access to read and execute on the device. However, opening a website URL, loading an online map location, or completing a UPI payment will require active cellular data or Wi-Fi.'
    },
    {
      q: 'Can a QR code store an entire PDF or image file?',
      a: 'No. Standard QR codes have a maximum binary capacity of approximately 2,953 bytes (under 3 KB). A PDF or image file is typically tens or hundreds of kilobytes, which cannot physically fit into a normal QR code. To share a PDF, upload it to cloud storage (Google Drive, Dropbox, your website) and generate a URL QR code pointing to that document.'
    },
    {
      q: 'How do I test whether my QR code works reliably?',
      a: 'Always test-scan your downloaded or printed code using at least two different smartphones (ideally one iOS device and one Android device) under standard indoor lighting and from a natural viewing distance before mass printing.'
    },
    {
      q: 'Is my information uploaded to a server?',
      a: 'No. RajToolBox runs 100% client-side in your web browser. All payload generation, canvas drawing, logo embedding, and file exports execute locally in your computer or mobile memory. Your Wi-Fi passwords, contact details, and images are never uploaded to any remote server.'
    },
    {
      q: 'Can a QR code contain UPI payment information?',
      a: 'Yes. RajToolBox supports the standard NPCI UPI deep-link format (`upi://pay?pa=...`). Scanning it on an Indian smartphone opens installed UPI apps (GPay, PhonePe, Paytm, BHIM) with payee details prefilled. Note that RajToolBox is not a payment gateway and never confirms or routes money.'
    },
    {
      q: 'What is the minimum recommended print size for a QR code?',
      a: 'As a reliable rule of thumb, use the 10:1 scanning ratio: Print Width = Scanning Distance / 10. For a business card scanned from 20 cm away, the QR code should be at least 2 cm × 2 cm (0.8 inches). For a poster scanned from 2 meters away, it should be at least 20 cm × 20 cm.'
    }
  ];

  const scanningProblems = [
    {
      problem: 'Camera cannot focus or detect the code',
      cause: 'Missing quiet zone (margin around the code) or printed too small for the reading distance.',
      solution: 'Ensure at least a 4-module white quiet zone around the matrix and increase the print size to at least 2 cm × 2 cm.'
    },
    {
      problem: 'Scanner beeps or fails to decode after adding a logo',
      cause: 'Logo is too large (covering >25% of code) or error correction is set to Low (L).',
      solution: 'Switch Error Correction to High (H) and reduce the logo size slider to 18%-22% of total width with a clear badge boundary.'
    },
    {
      problem: 'Inverted color scheme fails on older phones',
      cause: 'White dots on dark background violate original optical reflectance standards.',
      solution: 'Invert colors back to traditional dark dots (black, dark navy) on a pure white or light background.'
    },
    {
      problem: 'Low color contrast between pattern and paper',
      cause: 'Light gray, pastel yellow, or subtle gradients reduce contrast below the 4:1 camera threshold.',
      solution: 'Use high-contrast color combinations (dark foreground on crisp light background).'
    },
    {
      problem: 'Code appears pixelated or fuzzy on print',
      cause: 'Low-resolution 72 DPI image was enlarged for print.',
      solution: 'Download vector SVG or High-Res PNG (1600px/2400px at 300 DPI) for flawless physical print output.'
    },
    {
      problem: 'Web link opens a 404 Not Found error page',
      cause: 'The target website URL was typed with a typo or the target webpage was moved.',
      solution: 'Verify the destination link in your browser before printing. Check the Embedded Payload box to confirm spelling.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 w-full animate-in fade-in duration-150">
      {/* 1. TOP BREADCRUMB */}
      <Breadcrumb
        categorySlug={category?.slug || tool.category}
        categoryName={category?.name || 'QR & Barcode Tools'}
        toolName="QR Code Generator"
      />

      {/* 2. PAGE HEADER & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 min-w-0 w-full">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 text-xs text-[#71717A] dark:text-[#A1A1AA] flex-wrap">
            <span className="font-semibold text-[#EC4899]">
              {category?.name || 'QR & Barcode Tools'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#16A34A] dark:text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% In-Browser &amp; Private
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#854D0E] dark:text-[#FACC15]">
              <Zap className="w-3.5 h-3.5" />
              Zero Server Uploads
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#2563EB]">
              ISO/IEC 18004 Standard
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#18181B] dark:text-[#F4F4F5] break-words">
            QR Code Generator – Free Online QR Code Maker
          </h1>

          <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed break-words">
            Create custom high-resolution QR codes for websites, plain text, Wi-Fi networks, vCard contacts, UPI payments, emails, and phone calls. Customize colors, embed your logo with High Error Correction, and download crisp PNG or scalable vector SVG for print and digital use.
          </p>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="shrink-0 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => toggleFavorite(tool.slug)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              favored
                ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#71717A]'
            }`}
            title="Save tool to favorites"
          >
            <Bookmark className={`w-4 h-4 ${favored ? 'fill-[#EC4899]' : ''}`} />
            <span>{favored ? 'Saved' : 'Save Tool'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-semibold text-[#71717A] hover:text-[#EC4899] transition-all bg-white dark:bg-[#18181B]"
            title="Share this QR generator"
          >
            {linkCopied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Share2 className="w-4 h-4" />}
            <span>{linkCopied ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE TOOL WORKSPACE (Immediately visible and accessible) */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl sm:rounded-3xl shadow-sm p-3.5 sm:p-6 lg:p-8 mb-10 sm:mb-12 min-w-0 w-full max-w-full">
        <QrCodeGeneratorWorkspace />
      </div>

      {/* 4. FLOWCHARTS SECTION */}
      <section className="my-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
            Visual QR Workflows &amp; Decision Guides
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Step-by-step visual decision paths for generation, troubleshooting, and payload selection.
          </p>
        </div>

        {/* Flowchart A: Creating a Scannable QR Code */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-4 min-w-0 w-full">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3 flex-wrap gap-2">
            <h3 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center text-xs font-bold shrink-0">
                A
              </span>
              <span>Flowchart: Creating a Verified, Scannable QR Code</span>
            </h3>
            <span className="text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] dark:bg-[#14532D]/40 px-2.5 py-0.5 rounded-full shrink-0">
              Standard Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs min-w-0 w-full">
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col justify-center items-center min-w-0 break-words">
              <span className="text-[10px] font-mono text-[#EC4899] font-bold mb-1">STEP 1</span>
              <strong className="text-[#18181B] dark:text-white text-xs">Pick QR Type</strong>
              <span className="text-[10px] text-[#71717A] mt-0.5">URL, Wi-Fi, vCard, etc.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col justify-center items-center min-w-0 break-words">
              <span className="text-[10px] font-mono text-[#EC4899] font-bold mb-1">STEP 2</span>
              <strong className="text-[#18181B] dark:text-white text-xs">Input &amp; Validate</strong>
              <span className="text-[10px] text-[#71717A] mt-0.5">Syntax &amp; escape checks</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col justify-center items-center min-w-0 break-words">
              <span className="text-[10px] font-mono text-[#EC4899] font-bold mb-1">STEP 3</span>
              <strong className="text-[#18181B] dark:text-white text-xs">Design &amp; Logo</strong>
              <span className="text-[10px] text-[#71717A] mt-0.5">High contrast &amp; Level H</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col justify-center items-center min-w-0 break-words">
              <span className="text-[10px] font-mono text-[#EC4899] font-bold mb-1">STEP 4</span>
              <strong className="text-[#18181B] dark:text-white text-xs">Verify Payload</strong>
              <span className="text-[10px] text-[#71717A] mt-0.5">Inspect decoded text</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex flex-col justify-center items-center min-w-0 break-words">
              <span className="text-[10px] font-mono text-[#EC4899] font-bold mb-1">STEP 5</span>
              <strong className="text-[#18181B] dark:text-white text-xs">Download File</strong>
              <span className="text-[10px] text-[#71717A] mt-0.5">PNG (web) or SVG (print)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F0FDF4] dark:bg-[#14532D]/20 border border-[#86EFAC] dark:border-[#14532D] flex flex-col justify-center items-center min-w-0 break-words">
              <span className="text-[10px] font-mono text-[#16A34A] font-bold mb-1">STEP 6</span>
              <strong className="text-[#16A34A] dark:text-[#4ADE80] text-xs">Phone Camera Test</strong>
              <span className="text-[10px] text-[#16A34A] dark:text-[#4ADE80] mt-0.5">Test before mass printing</span>
            </div>
          </div>
        </div>

        {/* Flowchart B & C Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full">
          {/* Flowchart B: Troubleshooting a QR That Will Not Scan */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-3 min-w-0 w-full">
            <h3 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center text-xs font-bold shrink-0">
                B
              </span>
              <span>Troubleshooting a QR Code That Fails to Scan</span>
            </h3>
            <div className="space-y-2 text-xs min-w-0">
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-start gap-2 min-w-0">
                <span className="font-bold text-[#EC4899] shrink-0">1. Contrast:</span>
                <span className="text-[#71717A] dark:text-[#A1A1AA] break-words">
                  Are dots dark and background light? Avoid white-on-black or pale pastels.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-start gap-2 min-w-0">
                <span className="font-bold text-[#EC4899] shrink-0">2. Quiet Zone:</span>
                <span className="text-[#71717A] dark:text-[#A1A1AA] break-words">
                  Maintain at least 4 modules of uninterrupted white space around outer edges.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-start gap-2 min-w-0">
                <span className="font-bold text-[#EC4899] shrink-0">3. Center Logo:</span>
                <span className="text-[#71717A] dark:text-[#A1A1AA] break-words">
                  Does logo cover more than 25%? Keep logo size under 22% with Error Correction H.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-start gap-2 min-w-0">
                <span className="font-bold text-[#EC4899] shrink-0">4. Print Size:</span>
                <span className="text-[#71717A] dark:text-[#A1A1AA] break-words">
                  Print width must equal at least 1/10th of expected reading distance.
                </span>
              </div>
            </div>
          </div>

          {/* Flowchart C: Choosing the Right QR Type */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-3 min-w-0 w-full">
            <h3 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center text-xs font-bold shrink-0">
                C
              </span>
              <span>Choosing the Optimal QR Code Type</span>
            </h3>
            <div className="space-y-2 text-xs min-w-0">
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <strong className="text-[#18181B] dark:text-white block truncate">Goal: Open a webpage or app</strong>
                  <span className="text-[#71717A] dark:text-[#A1A1AA] text-[11px] block truncate">Requires active device internet</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#FCE7F3] text-[#EC4899] font-bold text-[11px] shrink-0">URL QR</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <strong className="text-[#18181B] dark:text-white block truncate">Goal: Share guest Wi-Fi</strong>
                  <span className="text-[#71717A] dark:text-[#A1A1AA] text-[11px] block truncate">One-tap network connection</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A] font-bold text-[11px] shrink-0">Wi-Fi QR</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <strong className="text-[#18181B] dark:text-white block truncate">Goal: Digital business card</strong>
                  <span className="text-[#71717A] dark:text-[#A1A1AA] text-[11px] block truncate">Saves directly into contacts</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-bold text-[11px] shrink-0">vCard QR</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <strong className="text-[#18181B] dark:text-white block truncate">Goal: Collect payment (India)</strong>
                  <span className="text-[#71717A] dark:text-[#A1A1AA] text-[11px] block truncate">Opens GPay, PhonePe, Paytm</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] font-bold text-[11px] shrink-0">UPI QR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDUCATIONAL CONTENT SECTIONS */}
      <div className="space-y-10 my-12">
        {/* H2: What Is a QR Code? */}
        <section className="p-6 sm:p-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4">
            What Is a QR Code?
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            <p>
              A <strong>QR Code (Quick Response Code)</strong> is a two-dimensional matrix barcode invented in 1994 by Masahiro Hara at the Japanese company Denso Wave. Originally engineered to track automotive parts across high-speed manufacturing conveyor belts, the QR code has evolved into the universal bridge connecting physical print to the digital world.
            </p>
            <p>
              Unlike traditional one-dimensional barcodes (such as UPC or Code 128) that store information along a single horizontal linear axis, a QR code encodes data in two dimensions—both horizontally and vertically. This spatial architecture allows it to hold hundreds of times more information in a fraction of the physical area, accommodating up to 7,089 numeric characters or 4,296 alphanumeric characters.
            </p>
          </div>
        </section>

        {/* H2: How Does a QR Code Work? */}
        <section className="p-6 sm:p-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4">
            How Does a QR Code Work?
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
            <p>
              When a smartphone camera or optical sensor scans a QR code, specialized computer vision algorithms break down the visual pattern into standardized anatomical components:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
                <strong className="text-[#18181B] dark:text-white block mb-1">Position Markers (Eyes)</strong>
                <p>The three prominent nested squares in the top-left, top-right, and bottom-left corners define orientation, rotation, and tilt angle in 3D space.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
                <strong className="text-[#18181B] dark:text-white block mb-1">Alignment Patterns</strong>
                <p>Smaller interior concentric squares that compensate for physical surface curvature (such as on drink cans, bags, or curved bottles).</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
                <strong className="text-[#18181B] dark:text-white block mb-1">Timing Patterns</strong>
                <p>Alternating black and white tracks running between the finder markers that establish the grid coordinate system and version density.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
                <strong className="text-[#18181B] dark:text-white block mb-1">Reed-Solomon Correction</strong>
                <p>Mathematical parity blocks that reconstruct damaged, stained, or logo-covered data modules without losing the original payload.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
                <strong className="text-[#18181B] dark:text-white block mb-1">Quiet Zone Margin</strong>
                <p>The mandatory clear margin surrounding the outer perimeter (minimum 4 module units) allowing the camera sensor to isolate the code from background noise.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
                <strong className="text-[#18181B] dark:text-white block mb-1">Data &amp; Error Codewords</strong>
                <p>Binary bits representing characters encoded into 8-bit bytes, masked with mathematical patterns to prevent repetitive optical interference.</p>
              </div>
            </div>
          </div>
        </section>

        {/* H2: How to Use the QR Code Generator */}
        <section className="p-6 sm:p-8 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4">
            How to Use the QR Code Generator (Step-by-Step)
          </h2>
          <ol className="space-y-3 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <div><strong className="text-[#18181B] dark:text-white">Select the required QR type:</strong> Choose between Website URL, Plain Text, Wi-Fi Network, Contact vCard, UPI Payment, Email, SMS, Phone Call, Location, or Calendar Event.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <div><strong className="text-[#18181B] dark:text-white">Enter the relevant details:</strong> Fill in the target link, credentials, or message. RajToolBox performs real-time syntax checking and escaping automatically.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <div><strong className="text-[#18181B] dark:text-white">Check the live preview:</strong> The right-hand preview canvas regenerates instantly. Verify the Decoded Payload box to ensure every character is exact.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <div><strong className="text-[#18181B] dark:text-white">Customize styling &amp; logo:</strong> Pick foreground and background colors (monitoring the contrast score) and upload an optional brand logo badge.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">5</span>
              <div><strong className="text-[#18181B] dark:text-white">Download the required format:</strong> Select PNG (400px–1600px) for general use or SVG for infinite-resolution vector print.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">6</span>
              <div><strong className="text-[#18181B] dark:text-white">Scan-test the output:</strong> Scan the downloaded or printed graphic with your smartphone camera before deploying or mass printing.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold flex items-center justify-center shrink-0 text-xs">7</span>
              <div><strong className="text-[#18181B] dark:text-white">Share or print:</strong> Use the built-in Native Share sheet or Print Sheet button to distribute your code immediately.</div>
            </li>
          </ol>
        </section>

        {/* H2: Real QR Code Examples Table */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2 break-words">
            Real QR Code Examples &amp; Standard Payload Specifications
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Demonstrating standard payloads, encoded formats, smartphone device actions, and real-world limitations. All examples use fictional test data.
          </p>

          <div className="overflow-x-auto w-full max-w-full -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">
                  <th className="py-2.5 px-3 font-bold">QR Type</th>
                  <th className="py-2.5 px-3 font-bold">Sample Payload Syntax</th>
                  <th className="py-2.5 px-3 font-bold">Expected Device Behavior</th>
                  <th className="py-2.5 px-3 font-bold">Primary Use Case</th>
                  <th className="py-2.5 px-3 font-bold">Important Limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#A1A1AA]">
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Website URL</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">https://example.com/menu</td>
                  <td className="py-3 px-3">Opens web browser to the URL</td>
                  <td className="py-3 px-3">Restaurant menus, product packaging</td>
                  <td className="py-3 px-3">Requires active internet connection</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Wi-Fi Network</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">WIFI:T:WPA;S:Guest;P:Secret123;;</td>
                  <td className="py-3 px-3">Prompts "Join Wi-Fi Network"</td>
                  <td className="py-3 px-3">Cafes, hotels, home guest rooms</td>
                  <td className="py-3 px-3">Device must support Wi-Fi hardware</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Contact (vCard)</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">BEGIN:VCARD\nFN:Raj Sharma...</td>
                  <td className="py-3 px-3">Prompts "Add to Contacts"</td>
                  <td className="py-3 px-3">Business cards, conference badges</td>
                  <td className="py-3 px-3">Dense matrix requires high print quality</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">UPI Payment</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">upi://pay?pa=shop@upi&amp;pn=Shop</td>
                  <td className="py-3 px-3">Opens GPay, PhonePe, Paytm</td>
                  <td className="py-3 px-3">Indian retail checkouts, billing</td>
                  <td className="py-3 px-3">Requires installed Indian UPI app</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Phone Call</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">tel:+919876543210</td>
                  <td className="py-3 px-3">Opens phone dialer with number</td>
                  <td className="py-3 px-3">Customer support posters, taxis</td>
                  <td className="py-3 px-3">Does not dial automatically without user tap</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Email Draft</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">mailto:help@example.com?sub=Hi</td>
                  <td className="py-3 px-3">Opens mail client draft window</td>
                  <td className="py-3 px-3">Feedback forms, enquiry flyers</td>
                  <td className="py-3 px-3">Does not send message without user review</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">SMS Message</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">SMSTO:+15551234:Opt-in</td>
                  <td className="py-3 px-3">Opens SMS app with drafted text</td>
                  <td className="py-3 px-3">SMS marketing opt-in, verification</td>
                  <td className="py-3 px-3">Carrier SMS charges may apply</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#18181B] dark:text-white">Calendar Event</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#EC4899] break-all">BEGIN:VEVENT\nSUMMARY:Launch...</td>
                  <td className="py-3 px-3">Prompts "Add to Calendar"</td>
                  <td className="py-3 px-3">Conferences, weddings, webinars</td>
                  <td className="py-3 px-3">Timezone offsets must be formatted UTC</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* H2: Static vs Dynamic QR Codes (Honest Comparison Table) */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2 break-words">
            Static vs Dynamic QR Codes: An Honest Technical Comparison
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Understanding how QR data is stored, why static codes never expire, and the service dependencies of dynamic redirects.
          </p>

          <div className="overflow-x-auto w-full max-w-full -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">
                  <th className="py-2.5 px-3 font-bold">Feature / Property</th>
                  <th className="py-2.5 px-3 font-bold text-[#16A34A]">Static QR Code (RajToolBox)</th>
                  <th className="py-2.5 px-3 font-bold text-[#DC2626]">Dynamic QR Code (Third-Party Services)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#A1A1AA]">
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Data Storage</td>
                  <td className="py-3 px-3">Encoded directly inside the graphic dots</td>
                  <td className="py-3 px-3">Encodes a redirect short-link hosted on a remote server</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Expiration &amp; Longevity</td>
                  <td className="py-3 px-3 font-bold text-[#16A34A]">Never expires. Works indefinitely.</td>
                  <td className="py-3 px-3">Expires if subscription lapses or provider shuts down</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Post-Print Editing</td>
                  <td className="py-3 px-3">Cannot change target after printing</td>
                  <td className="py-3 px-3">Target URL can be changed in service dashboard</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Scan Caps &amp; Fees</td>
                  <td className="py-3 px-3 font-bold text-[#16A34A]">Unlimited free scans forever</td>
                  <td className="py-3 px-3">Often capped at 50–100 scans on "free" tiers</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Privacy &amp; Security</td>
                  <td className="py-3 px-3">No middleman tracking or analytics logging</td>
                  <td className="py-3 px-3">User IP, device, and location logged by redirect host</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Offline Functionality</td>
                  <td className="py-3 px-3">Text, Wi-Fi, and contacts work 100% offline</td>
                  <td className="py-3 px-3">Requires online network to reach redirect server</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* H2: PNG vs SVG QR Codes */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2 break-words">
            PNG vs SVG: Choosing the Right Export Format
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Matching raster images and vector graphics to your exact print or digital application.
          </p>

          <div className="overflow-x-auto w-full max-w-full -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b border-[#E4E4E7] dark:border-[#27272A] text-[#18181B] dark:text-white">
                  <th className="py-2.5 px-3 font-bold">Attribute</th>
                  <th className="py-2.5 px-3 font-bold">PNG (Portable Network Graphics)</th>
                  <th className="py-2.5 px-3 font-bold">SVG (Scalable Vector Graphics)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#27272A] text-[#71717A] dark:text-[#A1A1AA]">
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Graphic Nature</td>
                  <td className="py-3 px-3">Raster bitmap (fixed grid of pixels)</td>
                  <td className="py-3 px-3">Mathematical vector paths (infinite resolution)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Scaling Behavior</td>
                  <td className="py-3 px-3">Becomes blurry or jagged if enlarged beyond resolution</td>
                  <td className="py-3 px-3 font-bold text-[#16A34A]">Scales from 1 cm to 10 meters with zero quality loss</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">Best Applications</td>
                  <td className="py-3 px-3">Websites, social media, email newsletters, presentations</td>
                  <td className="py-3 px-3">Adobe Illustrator, CorelDraw, signage, billboards, merchandise</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#18181B] dark:text-white">File Size</td>
                  <td className="py-3 px-3">Small (typically 5 KB to 30 KB)</td>
                  <td className="py-3 px-3">Extremely compact text XML (~2 KB to 8 KB)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* H2: QR Code Design and Scanning Tips */}
        {/* H2: QR Code Design and Scanning Tips */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4 break-words">
            Professional QR Code Design &amp; Scanning Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] min-w-0">
            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] space-y-1.5 min-w-0">
              <strong className="text-[#18181B] dark:text-white block font-bold text-sm">
                The 10:1 Sizing Formula
              </strong>
              <p className="break-words">
                Minimum print size should follow the 10:1 distance ratio: <code className="text-[#EC4899] font-bold">Size = Distance / 10</code>. If customers scan from 30 cm away (restaurant table tent), print at least 3 cm × 3 cm. For a billboard scanned from 10 meters, print at least 1 meter wide.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] space-y-1.5 min-w-0">
              <strong className="text-[#18181B] dark:text-white block font-bold text-sm">
                Preserve High Contrast
              </strong>
              <p className="break-words">
                Optical sensors rely on luminance differentials. Always pair dark pattern dots (black, dark navy, deep charcoal) with a crisp light background (white, cream). Never use inverted white-on-dark codes for mass print materials.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] space-y-1.5 min-w-0">
              <strong className="text-[#18181B] dark:text-white block font-bold text-sm">
                Respect the Quiet Zone
              </strong>
              <p className="break-words">
                The outer white border is called the Quiet Zone. It must be at least 4 module widths of uninterrupted blank space. Cropping the image right at the edge of the pattern finder squares will cause camera auto-detection to fail.
              </p>
            </div>
          </div>
        </section>

        {/* H2: Common QR Code Problems and Solutions (Diagnostic Table) */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2 break-words">
            Common QR Code Scanning Problems &amp; Solutions
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Diagnostic checklist for fixing scannability errors before printing.
          </p>

          <div className="space-y-3 min-w-0">
            {scanningProblems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] min-w-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span className="break-words">{item.problem}</span>
                  </strong>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs min-w-0">
                  <div className="min-w-0">
                    <span className="font-semibold text-[#71717A] block">Root Cause:</span>
                    <p className="text-[#18181B] dark:text-[#D4D4D8] break-words">{item.cause}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#16A34A] block">Recommended Fix:</span>
                    <p className="text-[#18181B] dark:text-[#D4D4D8] break-words">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* H2: Privacy and Safety */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-4 flex items-center gap-2 break-words">
            <ShieldCheck className="w-6 h-6 text-[#16A34A] shrink-0" />
            <span>Privacy, Security &amp; Safety Practices</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed break-words">
            <p>
              <strong>100% In-Browser Cryptographic Generation:</strong> Unlike many commercial QR websites that secretly route your target URLs through dynamic redirects to monetize scan analytics or inject advertisements later, RajToolBox operates entirely in your local web browser. Your Wi-Fi network credentials, personal contact phone numbers, and company logos never leave your computer or smartphone.
            </p>
            <p>
              <strong>Beware of QR Phishing ("Quishing"):</strong> Anyone can print a QR code that encodes a malicious website URL designed to imitate a banking portal or login screen. When scanning physical codes in public places (such as parking meters or transit stations), always inspect the preview URL displayed on your phone's camera banner before tapping to open it.
            </p>
          </div>
        </section>

        {/* H2: Frequently Asked Questions */}
        <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs min-w-0 w-full">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-[#EC4899]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5]">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-6">
            Everything you need to know about QR generation, expiration, formatting, and scanning reliability.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#18181B] dark:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#EC4899] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#71717A] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed border-t border-[#E4E4E7]/60 dark:border-[#27272A]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 6. RELATED TOOLS (Genuinely connected in-app utilities) */}
      <RelatedTools currentTool={tool} />

      {/* 7. AUTHOR BOX */}
      <AuthorBox />

      {/* 8. SHARE TOOL SECTION (Branded tool-sharing specifically after author section) */}
      <section className="my-8 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-5 sm:p-6 shadow-xs min-w-0 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 p-1.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A]">
              <RajToolBoxLogo variant="icon-only" className="w-8 h-8 rounded-lg" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
                Share RajToolBox QR Code Generator
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                Share this free QR Code Generator with friends, students, creators, and businesses.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0 w-full">
          {/* A. Share Tool (Prefers Web Share API, falls back gracefully) */}
          <button
            type="button"
            onClick={handleShareTool}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] active:scale-[0.99] transition-all cursor-pointer min-w-0"
            aria-label="Share QR Code Generator"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Share Tool</span>
          </button>

          {/* B. Copy Tool Link */}
          <button
            type="button"
            onClick={handleCopyToolLink}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all min-w-0 cursor-pointer ${
              toolLinkCopied
                ? 'border-[#16A34A] bg-[#DCFCE7] dark:bg-[#14532D]/30 text-[#16A34A]'
                : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5]'
            }`}
            aria-label="Copy QR Code Generator canonical tool link"
          >
            {toolLinkCopied ? (
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
            ) : (
              <Copy className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">{toolLinkCopied ? 'Link Copied!' : 'Copy Tool Link'}</span>
          </button>

          {/* C. WhatsApp Share (Native URI with URL-encoded suggested message) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#F0FDF4] dark:bg-[#14532D]/20 text-[#15803D] dark:text-[#4ADE80] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D]/30 text-xs font-semibold transition-all min-w-0"
            aria-label="Share QR Code Generator on WhatsApp"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
