import React, { useState } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { Upload, Download, FileText, Trash2, CheckCircle2, AlertCircle, Plus, Eye } from 'lucide-react';

// PDF MERGER
export const PdfMergerComponent: React.FC = () => {
  const { showToast } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.type === 'application/pdf');
      if (selected.length === 0) {
        showToast('Please select valid PDF files.', 'error');
        return;
      }
      setFiles((prev) => [...prev, ...selected]);
      setDownloadUrl(null);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setDownloadUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      showToast('Please select at least 2 PDF files to merge.', 'error');
      return;
    }
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      showToast('PDFs merged successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Error merging PDFs: ' + (err.message || 'Corrupted file'), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-6 sm:p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899] transition-colors">
        <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
        <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
          Upload PDF Files to Merge
        </h4>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
          Select two or more PDF files from your device. Processing is 100% private in browser.
        </p>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add PDF Files</span>
          <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#71717A]">
            <span>Selected Files ({files.length})</span>
            <button onClick={() => setFiles([])} className="text-[#DC2626] hover:underline">
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-5 h-5 rounded-full bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <FileText className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span className="font-semibold text-[#18181B] dark:text-[#F4F4F5] truncate">
                    {file.name}
                  </span>
                  <span className="text-[#71717A] text-[10px]">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded text-[#71717A] hover:text-[#DC2626]"
                  aria-label="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={mergePdfs}
              disabled={isProcessing || files.length < 2}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#EC4899] text-white font-bold text-sm shadow-sm hover:bg-[#DB2777] disabled:opacity-50 transition-all"
            >
              {isProcessing ? 'Merging in browser...' : `Merge ${files.length} PDFs`}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="merged_rajtoolbox.pdf"
                className="flex items-center gap-2 py-3 px-6 rounded-xl bg-[#16A34A] text-white font-bold text-sm shadow-sm hover:bg-[#15803D] animate-in fade-in"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PDF SPLITTER & PAGE EXTRACTOR
export const PdfSplitterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        showToast('Please select a valid PDF file.', 'error');
        return;
      }
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        setFile(selected);
        setTotalPages(pdf.getPageCount());
        setPageRange(`1-${Math.min(2, pdf.getPageCount())}`);
        setDownloadUrl(null);
        showToast(`Loaded PDF with ${pdf.getPageCount()} pages`, 'info');
      } catch (err: any) {
        showToast('Failed to read PDF: ' + err.message, 'error');
      }
    }
  };

  const extractPages = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      // Parse range e.g. "1-3, 5"
      const pagesToExtract: number[] = [];
      const parts = pageRange.split(',');
      for (const part of parts) {
        const clean = part.trim();
        if (clean.includes('-')) {
          const [startStr, endStr] = clean.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
              pagesToExtract.push(i - 1);
            }
          }
        } else {
          const p = parseInt(clean, 10);
          if (!isNaN(p) && p >= 1 && p <= totalPages) {
            pagesToExtract.push(p - 1);
          }
        }
      }

      const uniquePages = Array.from(new Set(pagesToExtract)).sort((a, b) => a - b);
      if (uniquePages.length === 0) {
        showToast('Please enter a valid page number or range.', 'error');
        setIsProcessing(false);
        return;
      }

      const copiedPages = await newPdf.copyPages(srcPdf, uniquePages);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      showToast(`Extracted ${uniquePages.length} pages successfully!`, 'success');
    } catch (err: any) {
      showToast('Error extracting pages: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
          <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
            Upload PDF to Extract Pages
          </h4>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Upload a multipage document to split or extract specific pages.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
            <span>Choose PDF File</span>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#EC4899]" />
              <div>
                <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] block">
                  {file.name}
                </span>
                <span className="text-xs text-[#71717A]">
                  Total Pages: <strong className="text-[#EC4899]">{totalPages}</strong>
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setDownloadUrl(null);
              }}
              className="text-xs text-[#DC2626] hover:underline"
            >
              Change File
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
              Pages to Extract (e.g. 1-2, 4, 6)
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
              placeholder="e.g. 1, 3, 5-7"
            />
            <p className="text-[11px] text-[#71717A] mt-1">
              Enter individual pages separated by commas, or page ranges with a hyphen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={extractPages}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
            >
              {isProcessing ? 'Processing in browser...' : 'Extract Selected Pages'}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="extracted_pages.pdf"
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
              >
                <Download className="w-4 h-4" />
                <span>Download Extracted PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// IMAGE TO PDF CONVERTER
export const ImageToPdfComponent: React.FC = () => {
  const { showToast } = useApp();
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
      if (selected.length === 0) {
        showToast('Please select valid image files (JPG, PNG, WebP).', 'error');
        return;
      }
      setImages((prev) => [...prev, ...selected]);
      setDownloadUrl(null);
    }
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const imgFile of images) {
        const imgBuffer = await imgFile.arrayBuffer();
        let pdfImage;
        if (imgFile.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imgBuffer);
        } else {
          // jpg, jpeg, or convert via canvas
          pdfImage = await pdfDoc.embedJpg(imgBuffer);
        }
        const { width, height } = pdfImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width,
          height
        });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      showToast('Images converted to PDF successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Conversion error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
        <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
        <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
          Select Photos to Convert into PDF
        </h4>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
          Supports JPG, PNG, and WebP images. Each image will become a clean PDF page.
        </p>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Select Images</span>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#71717A]">
            <span>Selected Images ({images.length})</span>
            <button onClick={() => setImages([])} className="text-[#DC2626] hover:underline">
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-[#E4E4E7] dark:border-[#27272A] p-2 bg-white dark:bg-[#18181B] text-center"
              >
                <span className="text-[10px] font-bold text-[#71717A] block truncate mb-1">
                  Page {idx + 1}: {img.name}
                </span>
                <button
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-[10px] text-[#DC2626] hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={convertToPdf}
              disabled={isProcessing}
              className="flex-1 py-3 px-6 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
            >
              {isProcessing ? 'Generating PDF...' : `Convert ${images.length} Image(s) to PDF`}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="images_document.pdf"
                className="flex items-center gap-1.5 py-3 px-6 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
              >
                <Download className="w-4 h-4" />
                <span>Download Generated PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PDF WATERMARK COMPONENT
export const PdfWatermarkComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const applyWatermark = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: Math.min(width, height) / 10,
          color: rgb(0.9, 0.2, 0.4),
          opacity: opacity,
          rotate: degrees(45)
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      showToast('Watermark stamped onto all pages!', 'success');
    } catch (err: any) {
      showToast('Failed to apply watermark: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
          <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
            Upload PDF to Add Watermark
          </h4>
          <label className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
            <span>Select PDF File</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setDownloadUrl(null);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">
              Document: {file.name}
            </span>
            <button onClick={() => setFile(null)} className="text-xs text-[#DC2626] hover:underline">
              Change
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
                Watermark Stamp Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
                Opacity ({Math.round(opacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#EC4899] mt-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={applyWatermark}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
            >
              {isProcessing ? 'Stamping...' : 'Apply Watermark Stamp'}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="watermarked_doc.pdf"
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PDF METADATA VIEWER
export const PdfMetadataViewerComponent: React.FC = () => {
  const { showToast } = useApp();
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        setMetadata({
          'File Name': file.name,
          'File Size': `${(file.size / 1024).toFixed(1)} KB`,
          'Total Pages': pdf.getPageCount(),
          'Title': pdf.getTitle() || 'Not specified',
          'Author': pdf.getAuthor() || 'Not specified',
          'Subject': pdf.getSubject() || 'Not specified',
          'Keywords': pdf.getKeywords() || 'None',
          'Producer': pdf.getProducer() || 'Not specified',
          'Creator': pdf.getCreator() || 'Not specified',
          'Creation Date': pdf.getCreationDate() ? pdf.getCreationDate()?.toLocaleString() : 'Unknown'
        });
        showToast('Extracted PDF metadata properties', 'success');
      } catch (err: any) {
        showToast('Error reading metadata: ' + err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-6 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload PDF to Inspect Properties</span>
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {metadata && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-3">
            Document Properties & Metadata
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(metadata).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36]">
                <span className="text-[#71717A] block font-semibold text-[11px]">{key}</span>
                <span className="font-mono text-[#18181B] dark:text-[#F4F4F5] font-bold">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
