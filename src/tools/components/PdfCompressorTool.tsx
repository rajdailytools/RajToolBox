import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Download,
  Share2,
  Copy,
  Check,
  Eye,
  RefreshCw,
  Sliders,
  AlertTriangle,
  FileText,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  X,
  Info,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useApp } from '../../context/AppContext';
import {
  compressPdfWithEngine,
  PdfAnalysisReport
} from '../utils/pdfCompressionEngine';

export interface FileQueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  targetReached: boolean | null;
  targetBytes: number;
  errorMessage?: string;
  pageCount?: number;
  previewUrl?: string;
  hasDigitalSignature?: boolean;
  classification?: string;
  statusExplanation?: string;
  passesRun?: number;
}

export type CompressionLevel = 'basic' | 'recommended' | 'strong' | 'target';

// Interactive canvas-based PDF previewer for guaranteed rendering across iOS, Android, and Desktop
interface PdfCanvasPreviewProps {
  blob: Blob;
  name: string;
  fallbackUrl?: string;
}

const PdfCanvasPreview: React.FC<PdfCanvasPreviewProps> = ({ blob, name, fallbackUrl }) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [canvasFailed, setCanvasFailed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setCanvasFailed(false);
        const arrayBuffer = await blob.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
          useSystemFonts: true
        });
        const doc = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.warn('Canvas PDF load failed, falling back to object viewer:', err);
        setCanvasFailed(true);
        setLoading(false);
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [blob]);

  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || loading || canvasFailed) return;

    let cancelled = false;

    async function renderPage() {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const page = await pdfDocRef.current.getPage(currentPage);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const containerWidth = canvas.parentElement?.clientWidth || 600;
        const baseViewport = page.getViewport({ scale: 1.0 });
        let fitScale = scale;
        if (baseViewport.width * scale > containerWidth - 32) {
          fitScale = Math.max(0.45, (containerWidth - 32) / baseViewport.width);
        }

        const viewport = page.getViewport({ scale: fitScale });
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const task = page.render({
          canvasContext: ctx,
          viewport
        });
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name === 'RenderingCancelledException') return;
        console.warn('Page render error:', err);
      }
    }

    renderPage();

    return () => {
      cancelled = true;
    };
  }, [currentPage, scale, loading, canvasFailed]);

  if (canvasFailed && fallbackUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <object data={fallbackUrl} type="application/pdf" className="w-full h-full">
          <iframe src={fallbackUrl} title={name} className="w-full h-full border-0">
            <div className="p-8 text-center max-w-md mx-auto space-y-4">
              <FileText className="w-12 h-12 text-[#71717A] mx-auto" />
              <p className="text-sm font-semibold text-[#18181B] dark:text-[#F4F4F5]">
                Direct in-browser PDF preview is unavailable on this device. You can download the compressed PDF directly below.
              </p>
              <a
                href={fallbackUrl}
                download={`compressed_${name}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </a>
            </div>
          </iframe>
        </object>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between overflow-hidden">
      {/* Navigation / Zoom Bar */}
      <div className="w-full py-2.5 px-4 bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-xs border-b border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] disabled:opacity-40 font-bold hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] px-2">
            Page {currentPage} of {numPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] disabled:opacity-40 font-bold hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.6, parseFloat((s - 0.2).toFixed(1))))}
            className="p-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] font-bold text-xs hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#71717A] min-w-[45px] text-center font-mono font-semibold">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.5, parseFloat((s + 0.2).toFixed(1))))}
            className="p-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] font-bold text-xs hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rendered Canvas Container */}
      <div className="flex-1 w-full overflow-auto p-4 sm:p-6 flex items-center justify-center bg-zinc-200/80 dark:bg-zinc-950/80">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-xs text-[#71717A]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#EC4899]" />
            <span>Rendering actual compressed PDF document...</span>
          </div>
        ) : (
          <div className="max-w-full shadow-2xl rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-800 bg-white">
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export const PdfCompressorTool: React.FC = () => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  // File queue
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // Compression settings
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('target');
  const [targetPreset, setTargetPreset] = useState<string>('40kb');
  const [customTargetValue, setCustomTargetValue] = useState<number>(200);
  const [customTargetUnit, setCustomTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [stripMetadata, setStripMetadata] = useState<boolean>(true);
  const [removeAnnotations, setRemoveAnnotations] = useState<boolean>(false);

  // Processing state
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Preview modal state
  const [previewItem, setPreviewItem] = useState<FileQueueItem | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      queue.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTargetSizeBytes = (): number => {
    if (compressionLevel !== 'target') return 0;
    if (targetPreset === 'custom') {
      return customTargetUnit === 'MB'
        ? Math.round(customTargetValue * 1024 * 1024)
        : Math.round(customTargetValue * 1024);
    }
    const map: Record<string, number> = {
      '20kb': 20 * 1024,
      '30kb': 30 * 1024,
      '40kb': 40 * 1024,
      '50kb': 50 * 1024,
      '100kb': 100 * 1024,
      '200kb': 200 * 1024,
      '300kb': 300 * 1024,
      '500kb': 500 * 1024,
      '1mb': 1024 * 1024,
      '2mb': 2 * 1024 * 1024,
      '5mb': 5 * 1024 * 1024,
    };
    return map[targetPreset] || 40 * 1024;
  };

  const getTargetPresetLabel = (): string => {
    if (targetPreset === 'custom') {
      return `${customTargetValue} ${customTargetUnit}`;
    }
    const map: Record<string, string> = {
      '20kb': '20 KB',
      '30kb': '30 KB',
      '40kb': '40 KB',
      '50kb': '50 KB',
      '100kb': '100 KB',
      '200kb': '200 KB',
      '300kb': '300 KB',
      '500kb': '500 KB',
      '1mb': '1 MB',
      '2mb': '2 MB',
      '5mb': '5 MB',
    };
    return map[targetPreset] || 'Target Size';
  };

  const getCompressButtonLabel = (): string => {
    const count = queue.length;
    if (compressionLevel === 'target') {
      const targetLabel = getTargetPresetLabel();
      if (count <= 1) {
        return `Compress to ${targetLabel}`;
      }
      return `Compress ${count} PDFs to ${targetLabel}`;
    }
    if (count <= 1) {
      return 'Compress PDF Now';
    }
    return `Compress ${count} PDFs Now`;
  };

  const addFilesToQueue = (files: FileList | File[]) => {
    const validPdfs: FileQueueItem[] = [];
    Array.from(files).forEach((f) => {
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        validPdfs.push({
          id: Math.random().toString(36).substring(2, 9) + Date.now(),
          file: f,
          name: f.name,
          originalSize: f.size,
          compressedBlob: null,
          compressedSize: 0,
          status: 'pending',
          targetReached: null,
          targetBytes: getTargetSizeBytes()
        });
      }
    });

    if (validPdfs.length === 0) {
      showToast('Please select valid PDF documents.', 'error');
      return;
    }

    setQueue((prev) => {
      const next = [...prev, ...validPdfs];
      if (!activeFileId && next.length > 0) {
        setActiveFileId(next[0].id);
      }
      return next;
    });

    showToast(`Added ${validPdfs.length} PDF file${validPdfs.length > 1 ? 's' : ''}`, 'success');
  };

  const handleInitialDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setQueue((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove?.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      const next = prev.filter((item) => item.id !== id);
      if (activeFileId === id) {
        setActiveFileId(next.length > 0 ? next[0].id : null);
      }
      if (previewItem?.id === id) {
        setPreviewItem(null);
      }
      return next;
    });
  };

  const clearQueue = () => {
    queue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setQueue([]);
    setActiveFileId(null);
    setPreviewItem(null);
  };

  // Perform genuine PDF compression via the progressive target-size engine
  const compressSingleFile = async (item: FileQueueItem): Promise<FileQueueItem> => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }

    const currentTargetBytes = getTargetSizeBytes();

    try {
      const result = await compressPdfWithEngine(
        item.file,
        currentTargetBytes,
        compressionLevel,
        {
          stripMetadata,
          removeAnnotations,
          onProgress: (msg, percent) => {
            setStatusMessage(`${item.name}: ${msg}`);
            setProgressPercent(percent);
          }
        }
      );

      // Verify and generate preview URL strictly for the compressed Blob
      const previewUrl = URL.createObjectURL(result.compressedBlob);

      return {
        ...item,
        compressedBlob: result.compressedBlob,
        compressedSize: result.compressedSize,
        status: 'completed',
        pageCount: result.pageCount,
        targetReached: result.targetReached,
        targetBytes: currentTargetBytes,
        hasDigitalSignature: result.analysis.hasDigitalSignature,
        classification: result.analysis.classification,
        statusExplanation: result.statusMessage,
        passesRun: result.passesRun,
        previewUrl
      };
    } catch (err: any) {
      console.error('Compression error for', item.name, err);
      return {
        ...item,
        status: 'error',
        errorMessage: err.message || 'File processing failed'
      };
    }
  };

  const runCompression = async () => {
    if (queue.length === 0) return;
    setIsProcessingAll(true);
    setProgressPercent(5);
    setStatusMessage('Analyzing documents and preparing client-side engine...');

    const updatedQueue: FileQueueItem[] = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      setStatusMessage(`Compressing ${item.name} (${i + 1} of ${queue.length})...`);
      const processed = await compressSingleFile(item);
      updatedQueue.push(processed);
      setProgressPercent(Math.round(((i + 1) / queue.length) * 100));
    }

    setQueue(updatedQueue);
    setIsProcessingAll(false);
    setStatusMessage('Compression complete!');
    showToast(`Successfully processed ${queue.length} document${queue.length > 1 ? 's' : ''}!`, 'success');

    const firstSuccess = updatedQueue.find((i) => i.status === 'completed');
    if (firstSuccess) {
      setActiveFileId(firstSuccess.id);
    }
  };

  // Calculations across entire queue from actual files
  const totalOriginalSize = queue.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = queue.reduce((acc, curr) => acc + (curr.compressedSize || curr.originalSize), 0);
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const overallReductionPercent =
    totalOriginalSize > 0
      ? parseFloat((((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(2))
      : 0;

  // Selected item in workbench
  const activeItem = queue.find((i) => i.id === activeFileId) || queue[0];

  // Sharing actual compressed file where supported
  const handleShareCompressedFile = async (item: FileQueueItem) => {
    if (!item.compressedBlob) {
      showToast('Document is not yet compressed.', 'info');
      return;
    }

    const compressedFileName = `compressed_${item.name}`;
    const file = new File([item.compressedBlob], compressedFileName, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Compressed ${item.name}`,
          text: `Compressed to ${formatSize(item.compressedSize)} with RajToolBox (100% private in-browser).`
        });
        showToast('Document shared successfully!', 'success');
        return;
      } catch {
        return;
      }
    }

    copyLink();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    showToast('Page link copied to clipboard!', 'success');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* 1. UPLOAD & DRAG/DROP AREA */}
      {queue.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleInitialDrop}
          className="border-2 border-dashed border-[#EC4899]/30 hover:border-[#EC4899] dark:border-[#EC4899]/40 rounded-3xl p-8 sm:p-12 text-center bg-[#FFFDF7] dark:bg-[#18181B] transition-all cursor-pointer shadow-xs hover:shadow-md group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && addFilesToQueue(e.target.files)}
            accept="application/pdf"
            multiple
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
            Compress PDF Online
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed">
            Drag &amp; drop your PDF here, or click to choose from your device. Specify a target size (40 KB, 100 KB, 200 KB, 1 MB or custom) with 100% private in-browser processing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#EC4899] text-white font-bold text-sm shadow-md hover:bg-[#DB2777] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Choose PDF Documents</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              No File Uploads
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              100% Client-Side Engine
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              Real Target Size Control
            </span>
          </div>
        </div>
      ) : (
        /* 2. ACTIVE WORKBENCH: FILE LIST + COMPRESSION CONTROLS */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EC4899] text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">
                  {queue.length} PDF Document{queue.length > 1 ? 's' : ''} in Queue
                </h3>
                <p className="text-xs text-[#71717A]">
                  Total input: <span className="font-semibold text-[#18181B] dark:text-[#D4D4D8]">{formatSize(totalOriginalSize)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => additionalFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>+ Add More Files</span>
              </button>
              <input
                type="file"
                ref={additionalFileInputRef}
                onChange={(e) => e.target.files && addFilesToQueue(e.target.files)}
                accept="application/pdf"
                multiple
                className="hidden"
              />

              <button
                type="button"
                onClick={clearQueue}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Queue Item Cards */}
          <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {queue.map((item) => {
              const reduction =
                item.compressedSize > 0
                  ? parseFloat((((item.originalSize - item.compressedSize) / item.originalSize) * 100).toFixed(1))
                  : 0;

              const isSelected = activeFileId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveFileId(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-[#EC4899] bg-[#FCE7F3]/30 dark:bg-[#EC4899]/10'
                      : 'border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-[#EC4899] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F5] truncate">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#71717A] mt-0.5">
                        <span>Original: {formatSize(item.originalSize)}</span>
                        {item.status === 'completed' && (
                          <>
                            <span>&rarr;</span>
                            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80]">
                              {formatSize(item.compressedSize)} ({reduction}% saved)
                            </span>
                            {item.targetBytes > 0 && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.targetReached
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}
                              >
                                {item.targetReached ? '✓ Target reached' : '⚠ Target not reached'}
                              </span>
                            )}
                          </>
                        )}
                        {item.status === 'error' && (
                          <span className="text-red-500 font-semibold">{item.errorMessage || 'Failed'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* 👁️ WORKING VIEW / PREVIEW BUTTON: Opens the actual compressed PDF */}
                    {item.status === 'completed' && item.compressedBlob && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] bg-[#FFFDF7] dark:bg-[#202026] text-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20 transition-all cursor-pointer"
                        title="View compressed PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Download Button: Uses exact same compressedBlob */}
                    {item.status === 'completed' && item.previewUrl && (
                      <a
                        href={item.previewUrl}
                        download={`compressed_${item.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] transition-all cursor-pointer"
                        title="Download compressed PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(item.id);
                      }}
                      className="p-2 rounded-xl text-[#71717A] hover:text-[#DC2626] transition-all cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. COMPRESSION CONTROLS & TARGET SIZE */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#EC4899]" />
                  Select Compression Mode
                </label>
                <span className="text-[11px] text-[#71717A]">Multi-pass progressive engine</span>
              </div>

              {/* Mode Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'target' as CompressionLevel,
                    title: 'Target Size',
                    desc: 'Actively compress toward a specific KB or MB goal'
                  },
                  {
                    id: 'recommended' as CompressionLevel,
                    title: 'Recommended',
                    desc: 'Balanced stream cleanup & optimal text sharpness'
                  },
                  {
                    id: 'strong' as CompressionLevel,
                    title: 'Strong',
                    desc: 'Aggressive object & image compaction'
                  },
                  {
                    id: 'basic' as CompressionLevel,
                    title: 'Basic / Light',
                    desc: 'Preserves vector art & high-res images for print'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCompressionLevel(mode.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      compressionLevel === mode.id
                        ? 'border-[#EC4899] bg-[#FCE7F3]/40 dark:bg-[#EC4899]/15 shadow-2xs'
                        : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899]/40 bg-[#FAFAFA] dark:bg-[#202026]'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5]">{mode.title}</p>
                      <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-1 leading-snug">{mode.desc}</p>
                    </div>
                    {compressionLevel === mode.id && (
                      <span className="text-[10px] font-bold text-[#EC4899] mt-2 flex items-center gap-1">
                        Active Mode &check;
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Size Presets (When Target Mode Active) */}
            {compressionLevel === 'target' && (
              <div className="p-5 rounded-2xl border border-[#FACC15]/50 bg-[#FFFDF7] dark:bg-[#1C1C22] space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#854D0E] dark:text-[#FACC15] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FACC15]" />
                    Target Size Goal
                  </span>
                  <span className="text-[11px] text-[#71717A]">Genuine multi-pass progressive engine</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: '20kb', label: '20 KB' },
                    { id: '30kb', label: '30 KB' },
                    { id: '40kb', label: '40 KB' },
                    { id: '50kb', label: '50 KB' },
                    { id: '100kb', label: '100 KB' },
                    { id: '200kb', label: '200 KB' },
                    { id: '300kb', label: '300 KB' },
                    { id: '500kb', label: '500 KB' },
                    { id: '1mb', label: '1 MB' },
                    { id: '2mb', label: '2 MB' },
                    { id: '5mb', label: '5 MB' },
                    { id: 'custom', label: 'Custom' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setTargetPreset(preset.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        targetPreset === preset.id
                          ? 'border-[#854D0E] dark:border-[#FACC15] bg-[#FACC15] text-[#854D0E] shadow-2xs scale-[1.02]'
                          : 'border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#71717A] hover:border-[#854D0E]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {targetPreset === 'custom' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={customTargetValue}
                      onChange={(e) => setCustomTargetValue(Math.max(0.1, parseFloat(e.target.value) || 1))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]"
                      placeholder="e.g. 750"
                    />
                    <select
                      value={customTargetUnit}
                      onChange={(e) => setCustomTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                    <span className="text-xs font-semibold text-[#854D0E] dark:text-[#FACC15]">
                      Active Goal: {customTargetValue} {customTargetUnit} ({formatSize(getTargetSizeBytes())})
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-[11px] text-[#854D0E] dark:text-[#FACC15] bg-[#FEF3C7]/60 dark:bg-[#FACC15]/10 p-3 rounded-xl">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Honest Quality Guard:</strong> The target size is an active optimization goal. The engine runs progressive passes to shrink the file toward your target. If a document reaches its safe readability limit without reaching an ultra-small target, it honestly shows the best achievable size without destroying legibility.
                  </p>
                </div>
              </div>
            )}

            {/* Quality & Metadata Toggles */}
            <div className="pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#71717A] dark:text-[#A1A1AA]">
                <input
                  type="checkbox"
                  checked={stripMetadata}
                  onChange={(e) => setStripMetadata(e.target.checked)}
                  className="rounded text-[#EC4899] focus:ring-[#EC4899]"
                />
                <span>Remove redundant author, title &amp; XML metadata</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#71717A] dark:text-[#A1A1AA]">
                <input
                  type="checkbox"
                  checked={removeAnnotations}
                  onChange={(e) => setRemoveAnnotations(e.target.checked)}
                  className="rounded text-[#EC4899] focus:ring-[#EC4899]"
                />
                <span>Flatten non-essential PDF annotations</span>
              </label>
            </div>

            {/* DYNAMIC COMPRESSION ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={runCompression}
                disabled={isProcessingAll || queue.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#EC4899] text-white font-bold text-sm shadow-md hover:bg-[#DB2777] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isProcessingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compressing {queue.length} PDF{queue.length > 1 ? 's' : ''}... ({progressPercent}%)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{getCompressButtonLabel()}</span>
                  </>
                )}
              </button>
              {statusMessage && (
                <p className="text-center text-xs text-[#71717A] mt-2 font-medium">{statusMessage}</p>
              )}
            </div>
          </div>

          {/* 4. RESULT CARD (MEASURED FROM ACTUAL OUTPUT BLOB) */}
          {activeItem && activeItem.status === 'completed' && activeItem.compressedBlob && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#18181B] border border-[#16A34A]/40 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                      Compression Complete
                    </span>

                    {activeItem.targetBytes > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          activeItem.targetReached
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {activeItem.targetReached ? '✓ Target reached' : '⚠ Target not reached'}
                      </span>
                    )}

                    {activeItem.hasDigitalSignature && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Signature Warning
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#18181B] dark:text-[#F4F4F5] truncate max-w-md">
                    {activeItem.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShareCompressedFile(activeItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899] transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span>Share File</span>
                  </button>

                  <button
                    type="button"
                    onClick={runCompression}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899] transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Compress Again</span>
                  </button>
                </div>
              </div>

              {/* Exact Physical File Size Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] text-center border border-[#E4E4E7]/60 dark:border-[#27272A]">
                  <p className="text-[11px] text-[#71717A] mb-1 font-semibold uppercase tracking-wider">Original Size</p>
                  <p className="text-base font-black text-[#18181B] dark:text-[#F4F4F5]">{formatSize(activeItem.originalSize)}</p>
                </div>

                {activeItem.targetBytes > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] text-center border border-[#FACC15]/40">
                    <p className="text-[11px] text-[#854D0E] dark:text-[#FACC15] mb-1 font-semibold uppercase tracking-wider">Target Goal</p>
                    <p className="text-base font-black text-[#854D0E] dark:text-[#FACC15]">{formatSize(activeItem.targetBytes)}</p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] text-center border border-[#16A34A]/40">
                  <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] mb-1 font-semibold uppercase tracking-wider">Compressed Size</p>
                  <p className="text-base font-black text-[#16A34A] dark:text-[#4ADE80]">{formatSize(activeItem.compressedSize)}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] text-center border border-[#E4E4E7]/60 dark:border-[#27272A]">
                  <p className="text-[11px] text-[#EC4899] mb-1 font-semibold uppercase tracking-wider">Bytes Saved</p>
                  <p className="text-base font-black text-[#EC4899]">
                    {formatSize(Math.max(0, activeItem.originalSize - activeItem.compressedSize))}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] text-center border border-[#E4E4E7]/60 dark:border-[#27272A] col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-[#71717A] mb-1 font-semibold uppercase tracking-wider">Reduction</p>
                  <p className="text-base font-black text-[#854D0E] dark:text-[#FACC15]">
                    {activeItem.originalSize > 0
                      ? (((activeItem.originalSize - activeItem.compressedSize) / activeItem.originalSize) * 100).toFixed(2)
                      : 0}
                    %
                  </p>
                </div>
              </div>

              {/* Status Explanation / Quality Feedback */}
              {activeItem.statusExplanation && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                    activeItem.targetReached
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                      : activeItem.targetBytes > 0
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{activeItem.statusExplanation}</p>
                    {activeItem.hasDigitalSignature && (
                      <p className="mt-1 text-rose-700 dark:text-rose-400 font-semibold">
                        Notice: This document contains a digital signature. Recompressing streams invalidates cryptographic signature hashes.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons: 👁️ Preview + ⬇ Download + Share */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewItem(activeItem)}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-[#EC4899] text-[#EC4899] hover:bg-[#FCE7F3]/40 dark:hover:bg-[#EC4899]/15 font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Compressed PDF</span>
                </button>

                <a
                  href={activeItem.previewUrl}
                  download={`compressed_${activeItem.name}`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#16A34A] text-white hover:bg-[#15803D] font-bold text-sm transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF ({formatSize(activeItem.compressedSize)})</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleShareCompressedFile(activeItem)}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] font-semibold text-sm transition-all cursor-pointer"
                  title="Share compressed file"
                >
                  <Share2 className="w-4 h-4 text-[#EC4899]" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          )}

          {/* Overall Bulk Summary (if multiple files completed) */}
          {queue.length > 1 && queue.some((i) => i.status === 'completed') && (
            <div className="p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Queue Total</p>
                <p className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5]">
                  {formatSize(totalOriginalSize)} &rarr; {formatSize(totalCompressedSize)} ({overallReductionPercent}% saved across all files)
                </p>
              </div>
              <button
                type="button"
                onClick={runCompression}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-compress All</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. DEDICATED WORKING PDF PREVIEW MODAL */}
      {previewItem && previewItem.compressedBlob && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="w-full max-w-5xl h-[92vh] bg-white dark:bg-[#18181B] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E4E4E7] dark:border-[#27272A]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between gap-3 bg-[#FFFDF7] dark:bg-[#202026]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-[#18181B] dark:text-[#F4F4F5] truncate">
                    Preview: {previewItem.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A] mt-0.5">
                    <span>Compressed: <strong className="text-[#16A34A]">{formatSize(previewItem.compressedSize)}</strong></span>
                    {previewItem.targetBytes > 0 && (
                      <span>· Goal: <strong>{formatSize(previewItem.targetBytes)}</strong></span>
                    )}
                    <span>· Saved: <strong className="text-[#EC4899]">
                      {previewItem.originalSize > 0
                        ? (((previewItem.originalSize - previewItem.compressedSize) / previewItem.originalSize) * 100).toFixed(1)
                        : 0}%
                    </strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewItem.previewUrl && (
                  <a
                    href={previewItem.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] transition-all"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>New Window</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: High-fidelity Canvas PDF Viewer rendering actual compressed Blob */}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden flex flex-col">
              <PdfCanvasPreview
                blob={previewItem.compressedBlob}
                name={previewItem.name}
                fallbackUrl={previewItem.previewUrl}
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 sm:p-4 border-t border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#71717A]">
                Showing actual generated compressed document ({formatSize(previewItem.compressedSize)})
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareCompressedFile(previewItem)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Share</span>
                </button>

                {previewItem.previewUrl && (
                  <a
                    href={previewItem.previewUrl}
                    download={`compressed_${previewItem.name}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#71717A] hover:text-[#18181B] dark:hover:text-white cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK SHARING & BOOKMARK BAR */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#71717A] dark:text-[#A1A1AA]">
          <Share2 className="w-4 h-4 text-[#EC4899]" />
          <span>Share RajToolBox PDF Compressor:</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              'Compress large PDF files online with 100% private in-browser tool: https://rajtoolbox.com/tools/pdf-compressor/'
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
              'https://rajtoolbox.com/tools/pdf-compressor/'
            )}&text=${encodeURIComponent('Compress large PDF files online for free on RajToolBox')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#0088cc] text-[#0088cc] transition-all"
            title="Share on Telegram"
          >
            <Send className="w-4 h-4" />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(
              'Helpful PDF Compressor Tool'
            )}&body=${encodeURIComponent(
              'I found this free PDF compressor on RajToolBox that reduces PDF size directly inside the browser: https://rajtoolbox.com/tools/pdf-compressor/'
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
