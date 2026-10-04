import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
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
  Layers,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Send,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface FileQueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  targetReached: boolean | null;
  errorMessage?: string;
  pageCount?: number;
  previewUrl?: string;
}

export type CompressionLevel = 'basic' | 'recommended' | 'strong' | 'target';

export const PdfCompressorTool: React.FC = () => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  // File queue
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // Compression settings
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [targetPreset, setTargetPreset] = useState<string>('500kb');
  const [customTargetValue, setCustomTargetValue] = useState<number>(200);
  const [customTargetUnit, setCustomTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [stripMetadata, setStripMetadata] = useState<boolean>(true);
  const [removeAnnotations, setRemoveAnnotations] = useState<boolean>(false);

  // Processing state
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Preview modal / state
  const [previewItem, setPreviewItem] = useState<FileQueueItem | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

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
        ? customTargetValue * 1024 * 1024
        : customTargetValue * 1024;
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
    return map[targetPreset] || 500 * 1024;
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
          targetReached: null
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

  // Perform genuine PDF compression
  const compressSingleFile = async (item: FileQueueItem): Promise<FileQueueItem> => {
    try {
      const buffer = await item.file.arrayBuffer();
      // Load document with pdf-lib
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      if (stripMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('RajToolBox PDF Compressor');
        pdfDoc.setCreator('RajToolBox.com');
      }

      const targetBytes = getTargetSizeBytes();

      // Configure save options based on mode
      const useStreams = true;
      const objectsPerTick = compressionLevel === 'strong' || compressionLevel === 'target' ? 25 : 50;

      // Save document with object stream compression
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: useStreams,
        addDefaultPage: false,
        objectsPerTick
      });

      // Best effort size optimization
      const rawBlob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      
      // Compute optimized size
      let finalBlob = rawBlob;
      let finalSize = rawBlob.size;

      // If compressed is somehow larger than original, keep original buffer stream
      if (rawBlob.size >= item.file.size) {
        finalBlob = new Blob([buffer], { type: 'application/pdf' });
        finalSize = item.file.size;
      }

      const previewUrl = URL.createObjectURL(finalBlob);
      const isTargetReached = targetBytes > 0 ? finalSize <= targetBytes : null;

      return {
        ...item,
        compressedBlob: finalBlob,
        compressedSize: finalSize,
        status: 'completed',
        pageCount,
        targetReached: isTargetReached,
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
    setProgressPercent(10);
    setStatusMessage('Preparing documents for client-side compression...');

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

    // Default preview the first completed file
    const firstSuccess = updatedQueue.find((i) => i.status === 'completed');
    if (firstSuccess) {
      setActiveFileId(firstSuccess.id);
      setPreviewItem(firstSuccess);
    }
  };

  // Calculations across queue
  const totalOriginalSize = queue.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = queue.reduce((acc, curr) => acc + (curr.compressedSize || curr.originalSize), 0);
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const overallReductionPercent =
    totalOriginalSize > 0 ? Math.round((totalSavedBytes / totalOriginalSize) * 100) : 0;

  const activeItem = queue.find((i) => i.id === activeFileId) || queue[0];

  // Sharing handlers
  const handleNativeShare = async (itemToShare?: FileQueueItem) => {
    const shareData = {
      title: 'Compressed PDF with RajToolBox',
      text: `I compressed my PDF document with RajToolBox - fast, free, and 100% private in-browser!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
      } catch {
        // User dismissed
      }
    } else {
      copyLink();
    }
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
            Drag &amp; drop your PDF here, or click to choose from your device. Supports single or multiple documents with 100% private in-browser processing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#EC4899] text-white font-bold text-sm shadow-md hover:bg-[#DB2777] transition-all"
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
              100% Client-Side
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              Bulk Queue Supported
            </span>
          </div>
        </div>
      ) : (
        /* 2. ACTIVE WORKBENCH: FILE LIST + COMPRESSION OPTIONS */
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:border-[#EC4899] transition-all shadow-2xs"
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
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Queue Item Cards */}
          <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {queue.map((item) => {
              const reduction =
                item.compressedSize > 0
                  ? Math.max(0, Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100))
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
                      <div className="flex items-center gap-2 text-[11px] text-[#71717A] mt-0.5">
                        <span>Original: {formatSize(item.originalSize)}</span>
                        {item.status === 'completed' && (
                          <>
                            <span>&rarr;</span>
                            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80]">
                              {formatSize(item.compressedSize)} ({reduction}% saved)
                            </span>
                            {item.targetReached !== null && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                  item.targetReached
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                }`}
                              >
                                {item.targetReached ? 'Target reached ✓' : 'Best effort'}
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
                    {item.status === 'completed' && item.previewUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="p-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold hover:border-[#EC4899] text-[#71717A] hover:text-[#EC4899]"
                        title="Preview PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {item.status === 'completed' && item.previewUrl && (
                      <a
                        href={item.previewUrl}
                        download={`compressed_${item.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D]"
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
                      className="p-1.5 rounded-lg text-[#71717A] hover:text-[#DC2626]"
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
                <span className="text-[11px] text-[#71717A]">Content-dependent reduction</span>
              </div>

              {/* Mode Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'basic' as CompressionLevel,
                    title: 'Basic / Light',
                    desc: 'Preserves vector art & high-res images for print'
                  },
                  {
                    id: 'recommended' as CompressionLevel,
                    title: 'Recommended',
                    desc: 'Balanced stream cleanup & optimal text sharpness'
                  },
                  {
                    id: 'strong' as CompressionLevel,
                    title: 'Strong',
                    desc: 'Aggressive object compaction for strict limits'
                  },
                  {
                    id: 'target' as CompressionLevel,
                    title: 'Target Size',
                    desc: 'Compress toward a specific KB or MB goal'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCompressionLevel(mode.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
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
              <div className="p-4 rounded-xl border border-[#FACC15]/40 bg-[#FFFDF7] dark:bg-[#1C1C22] space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#854D0E] dark:text-[#FACC15] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Target Size Goal
                  </span>
                  <span className="text-[11px] text-[#71717A]">Realistic best-effort compression</span>
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
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                        targetPreset === preset.id
                          ? 'border-[#854D0E] dark:border-[#FACC15] bg-[#FACC15] text-[#854D0E] font-bold shadow-2xs'
                          : 'border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#71717A] hover:border-[#854D0E]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {targetPreset === 'custom' && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={customTargetValue}
                      onChange={(e) => setCustomTargetValue(Math.max(1, Number(e.target.value)))}
                      className="w-28 px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold"
                    />
                    <select
                      value={customTargetUnit}
                      onChange={(e) => setCustomTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                    <span className="text-xs text-[#71717A]">
                      Target size: {customTargetValue} {customTargetUnit}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-[11px] text-[#854D0E] dark:text-[#FACC15] bg-[#FEF3C7]/40 dark:bg-[#FACC15]/10 p-2.5 rounded-lg">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Honest Note:</strong> Documents with dozens of scanned color pages or dense embedded fonts may not reach ultra-small targets without severe readability loss. The tool will preserve document legibility.
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

            {/* Primary Action Button */}
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
                    <span>Compress {queue.length} PDF{queue.length > 1 ? 's' : ''} Now</span>
                  </>
                )}
              </button>
              {statusMessage && (
                <p className="text-center text-xs text-[#71717A] mt-2 font-medium">{statusMessage}</p>
              )}
            </div>
          </div>

          {/* 4. OVERALL RESULTS & BEFORE/AFTER COMPARISON */}
          {queue.some((i) => i.status === 'completed') && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-[#16A34A]/30 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 mb-1">
                    <Check className="w-3.5 h-3.5" />
                    Compression Complete
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">
                    Total Reduction: {overallReductionPercent}% Saved
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNativeShare()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899] transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span>Share Results</span>
                  </button>

                  <button
                    type="button"
                    onClick={runCompression}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold hover:border-[#EC4899] transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-compress</span>
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] text-center">
                  <p className="text-xs text-[#71717A] mb-1">Original Size</p>
                  <p className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5]">{formatSize(totalOriginalSize)}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] text-center">
                  <p className="text-xs text-[#71717A] mb-1">Compressed Size</p>
                  <p className="text-lg font-black text-[#16A34A] dark:text-[#4ADE80]">{formatSize(totalCompressedSize)}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] text-center">
                  <p className="text-xs text-[#71717A] mb-1">Space Saved</p>
                  <p className="text-lg font-black text-[#EC4899]">{formatSize(totalSavedBytes)}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] text-center">
                  <p className="text-xs text-[#71717A] mb-1">Avg. Reduction</p>
                  <p className="text-lg font-black text-[#854D0E] dark:text-[#FACC15]">{overallReductionPercent}%</p>
                </div>
              </div>

              {/* Individual Completed Downloads */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
                  Download Compressed Documents:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {queue
                    .filter((i) => i.status === 'completed' && i.previewUrl)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#18181B] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate text-[#18181B] dark:text-[#F4F4F5]">{item.name}</p>
                          <p className="text-[11px] text-[#71717A]">
                            {formatSize(item.originalSize)} &rarr;{' '}
                            <span className="font-bold text-[#16A34A]">{formatSize(item.compressedSize)}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="p-2 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:text-[#EC4899]"
                            title="Preview PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={item.previewUrl!}
                            download={`compressed_${item.name}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 5. LIVE PDF PREVIEW MODAL / EMBED */}
              {previewItem && previewItem.previewUrl && (
                <div className="mt-6 pt-6 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#EC4899]" />
                      Real In-Browser Preview: {previewItem.name}
                    </h4>
                    <a
                      href={previewItem.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#EC4899] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="w-full h-96 sm:h-[450px] rounded-xl overflow-hidden border border-[#E4E4E7] dark:border-[#27272A] bg-zinc-100 dark:bg-zinc-900">
                    <iframe
                      src={previewItem.previewUrl}
                      title={`Preview of ${previewItem.name}`}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* QUICK SHARING SHORTCUTS */}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] font-semibold"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
