import React, { useState } from 'react';
import {
  FileText,
  Upload,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Link2,
  HardDrive,
  FileCheck,
  BookOpen,
  Utensils,
  ShoppingBag,
  FileSpreadsheet
} from 'lucide-react';

interface PdfQrSectionProps {
  pdfUrl: string;
  setPdfUrl: (url: string) => void;
  onSelectLocalPdfSuccess?: (fileName: string) => void;
}

export const PdfQrSection: React.FC<PdfQrSectionProps> = ({
  pdfUrl,
  setPdfUrl
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'guide' | 'local'>('url');

  // Local PDF analysis state
  const [localFile, setLocalFile] = useState<{
    name: string;
    sizeBytes: number;
    sizeFormatted: string;
    type: string;
    lastModified: string;
  } | null>(null);
  const [localFileError, setLocalFileError] = useState<string | null>(null);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setLocalFileError('Selected file is not a PDF document (.pdf). Please select a valid PDF file.');
      setLocalFile(null);
      return;
    }

    setLocalFileError(null);
    const sizeKB = (file.size / 1024).toFixed(1);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeFormatted = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

    setLocalFile({
      name: file.name,
      sizeBytes: file.size,
      sizeFormatted,
      type: file.type || 'application/pdf',
      lastModified: new Date(file.lastModified).toLocaleDateString()
    });
  };

  const isDriveOrCloudUrl =
    /drive\.google\.com|dropbox\.com|onedrive\.live\.com|1drv\.ms|sharepoint\.com|box\.com|icloud\.com/i.test(
      pdfUrl
    );
  const hasPdfExtension = /\.pdf($|\?)/i.test(pdfUrl);

  return (
    <div className="space-y-4 min-w-0 w-full">
      {/* Sub-navigation tabs for PDF */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F4F4F5] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] w-full min-w-0 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-w-0 cursor-pointer ${
            activeTab === 'url'
              ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs'
              : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">A. PDF URL to QR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-w-0 cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs'
              : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">B. PDF Hosting Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-w-0 cursor-pointer ${
            activeTab === 'local'
              ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs'
              : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">C. Local PDF Inspector</span>
        </button>
      </div>

      {/* OPTION A: PDF URL to QR Code */}
      {activeTab === 'url' && (
        <div className="space-y-3 min-w-0">
          <div>
            <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
              Public or Cloud Shareable PDF URL <span className="text-[#EC4899]">*</span>
            </label>
            <input
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://example.com/menu.pdf or https://drive.google.com/file/d/.../view"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
            />
          </div>

          {/* Contextual Status / Validation */}
          {pdfUrl.trim() && (
            <div className="p-3 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#18181B] dark:text-[#F4F4F5]">
                {hasPdfExtension || isDriveOrCloudUrl ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                )}
                <span>
                  {hasPdfExtension
                    ? 'Direct PDF file URL detected (.pdf)'
                    : isDriveOrCloudUrl
                    ? 'Cloud storage document link detected'
                    : 'Standard web link entered'}
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                <strong>Hosting Requirement:</strong> The QR code stores this web address. The actual PDF file must remain accessible at this URL on your cloud storage or server. If the file is deleted or renamed, phones scanning this code will receive an error page.
              </p>
            </div>
          )}

          {/* Quick Example Presets */}
          <div className="pt-1">
            <span className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1.5">
              Try realistic PDF examples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPdfUrl('https://rajtoolbox.com/docs/restaurant-menu.pdf')}
                className="px-2.5 py-1 text-xs rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-[#18181B] dark:text-white transition-all cursor-pointer"
              >
                Restaurant Menu PDF
              </button>
              <button
                type="button"
                onClick={() => setPdfUrl('https://rajtoolbox.com/docs/product-catalogue-2026.pdf')}
                className="px-2.5 py-1 text-xs rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-[#18181B] dark:text-white transition-all cursor-pointer"
              >
                Product Catalogue PDF
              </button>
              <button
                type="button"
                onClick={() => setPdfUrl('https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9/view?usp=sharing')}
                className="px-2.5 py-1 text-xs rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-[#18181B] dark:text-white transition-all cursor-pointer"
              >
                Google Drive Share Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPTION B: PDF Document QR Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-4 text-xs min-w-0">
          <div className="p-3.5 rounded-xl bg-[#FFFDF7] dark:bg-[#141418] border border-[#E4E4E7] dark:border-[#27272A] space-y-2">
            <h4 className="font-bold text-[#18181B] dark:text-white flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-[#EC4899]" />
              How to Host a PDF &amp; Get a Shareable Link
            </h4>
            <p className="text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              To allow smartphones to open your document upon scanning, follow these 3 steps using free cloud storage you control:
            </p>

            <ol className="list-decimal pl-4 space-y-1.5 text-[#18181B] dark:text-[#E4E4E7] leading-relaxed">
              <li>
                <strong>Upload your PDF:</strong> Go to Google Drive, Microsoft OneDrive, Dropbox, or your website hosting server.
              </li>
              <li>
                <strong>Set Public Permissions:</strong> In Google Drive, click <em>Share</em> &rarr; change General Access to <em>"Anyone with the link can view"</em>.
              </li>
              <li>
                <strong>Copy &amp; Paste Link:</strong> Click <em>"Copy Link"</em>, switch to the <em>PDF URL to QR</em> tab above, and paste your URL.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
            <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-white mb-1">
                <Utensils className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Restaurant Dine-in Menus</span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Upload your seasonal menu PDF. Customers scan on their phone table stand and read without installing any app.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-white mb-1">
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Study Notes &amp; Syllabus</span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Teachers and students can share textbook chapters, assignment rubrics, and exam formula sheets on classroom bulletin boards.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-white mb-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Product Catalogues &amp; Brochures</span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Print QR on business cards or trade show banners linking to your full 20-page wholesale product brochure.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
              <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-white mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>User Manuals &amp; Public Forms</span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Attach a waterproof QR sticker on appliances or packaging pointing directly to the safety manual PDF.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* OPTION C: Local PDF Selection & Truthful Diagnostics */}
      {activeTab === 'local' && (
        <div className="space-y-4 text-xs min-w-0">
          <div className="p-4 rounded-xl border border-dashed border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-center space-y-2">
            <Upload className="w-6 h-6 text-[#EC4899] mx-auto" />
            <h4 className="font-bold text-[#18181B] dark:text-white">
              Inspect Local PDF File &amp; Capacity
            </h4>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto">
              Select any PDF file from your device to validate its size and learn how QR storage limitations apply.
            </p>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] cursor-pointer shadow-xs transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Local PDF File</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleLocalFileChange}
                className="hidden"
              />
            </label>
          </div>

          {localFileError && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#FCA5A5] text-[#DC2626] text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{localFileError}</span>
            </div>
          )}

          {localFile && (
            <div className="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2 font-bold text-[#18181B] dark:text-white min-w-0">
                  <FileCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span className="truncate">{localFile.name}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#F4F4F5] dark:bg-[#202026] text-[#18181B] dark:text-white">
                  {localFile.sizeFormatted}
                </span>
              </div>

              {/* Technical Truth & Explanation */}
              <div className="p-3 rounded-xl bg-[#FEF3C7] dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#78350F] text-[#92400E] dark:text-[#FDE68A] space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Why this local PDF cannot be opened by other phones without hosting:</span>
                </div>
                <div className="space-y-1.5 text-[11px] leading-relaxed">
                  <p>
                    <strong>1. Physical Barcode Optical Limit:</strong> The ISO/IEC 18004 QR specification has a theoretical binary ceiling of ~2.95 Kilobytes (2,953 bytes). Your selected file is <strong>{localFile.sizeFormatted}</strong> ({localFile.sizeBytes.toLocaleString()} bytes), which is {Math.round(localFile.sizeBytes / 2953)}x larger than what an optical barcode matrix can physically store.
                  </p>
                  <p>
                    <strong>2. Zero Server Upload Guarantee:</strong> RajToolBox operates 100% locally in your browser. We never silently upload your confidential PDF files to random temporary servers.
                  </p>
                  <p>
                    <strong>3. Recommended Solution:</strong> Upload this file (<em>{localFile.name}</em>) to your own Google Drive, OneDrive, or web server, get its public shareable link, and switch to <strong>PDF URL mode</strong> below!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('url');
                  if (!pdfUrl) {
                    setPdfUrl('https://example.com/' + encodeURIComponent(localFile.name));
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                <span>Switch to PDF URL Mode &amp; Generate QR</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
