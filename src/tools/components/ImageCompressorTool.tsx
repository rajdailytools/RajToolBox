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
  ImageIcon,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  X,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Archive
} from 'lucide-react';
import JSZip from 'jszip';
import { useApp } from '../../context/AppContext';
import {
  analyzeImageFile,
  compressImageWithEngine,
  formatByteSize,
  CompressionMode,
  OutputFormatChoice,
  ImageCompressionResult
} from '../utils/imageCompressionEngine';

export interface ImageQueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: string;
  thumbnailUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  targetReached: boolean | null;
  targetBytes: number;
  errorMessage?: string;
  previewUrl?: string;
  statusExplanation?: string;
  passesRun?: number;
  outputFormat?: string;
  qualityUsed?: number;
  dimensionChanged?: boolean;
}

export interface ImageCompressorToolProps {
  controlledTargetPreset?: string;
  onTargetPresetChange?: (preset: string) => void;
  controlledCompressionMode?: CompressionMode;
  onCompressionModeChange?: (mode: CompressionMode) => void;
}

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({
  controlledTargetPreset,
  onTargetPresetChange,
  controlledCompressionMode,
  onCompressionModeChange,
}) => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // File queue
  const [queue, setQueue] = useState<ImageQueueItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // Compression settings (Internal with fallback to controlled)
  const [internalCompressionMode, setInternalCompressionMode] = useState<CompressionMode>('target');
  const [internalTargetPreset, setInternalTargetPreset] = useState<string>('50kb');
  const [customTargetValue, setCustomTargetValue] = useState<number>(100);
  const [customTargetUnit, setCustomTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [qualitySlider, setQualitySlider] = useState<number>(0.8);
  const [outputFormat, setOutputFormat] = useState<OutputFormatChoice>('auto');

  const compressionMode = controlledCompressionMode !== undefined ? controlledCompressionMode : internalCompressionMode;
  const targetPreset = controlledTargetPreset !== undefined ? controlledTargetPreset : internalTargetPreset;

  const setCompressionMode = (mode: CompressionMode) => {
    setInternalCompressionMode(mode);
    onCompressionModeChange?.(mode);
  };

  const setTargetPreset = (preset: string) => {
    setInternalTargetPreset(preset);
    onTargetPresetChange?.(preset);
  };

  // If custom target is activated, focus input
  useEffect(() => {
    if (targetPreset === 'custom') {
      setTimeout(() => {
        customInputRef.current?.focus();
      }, 100);
    }
  }, [targetPreset]);

  // Dimension scaling settings
  const [dimensionMode, setDimensionMode] = useState<'original' | 'percent' | 'custom'>('original');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [allowTargetDimensionScaling, setAllowTargetDimensionScaling] = useState<boolean>(true);

  // Processing state
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Preview modal state (Before / After inspection)
  const [previewItem, setPreviewItem] = useState<ImageQueueItem | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1.0);
  const [previewViewMode, setPreviewViewMode] = useState<'side-by-side' | 'after-only' | 'before-only'>('side-by-side');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      queue.forEach((item) => {
        if (item.thumbnailUrl) URL.revokeObjectURL(item.thumbnailUrl);
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const getTargetSizeBytes = (): number => {
    if (compressionMode !== 'target') return 0;
    if (targetPreset === 'custom') {
      return customTargetUnit === 'MB'
        ? Math.round(customTargetValue * 1024 * 1024)
        : Math.round(customTargetValue * 1024);
    }
    const map: Record<string, number> = {
      '10kb': 10 * 1024,
      '20kb': 20 * 1024,
      '30kb': 30 * 1024,
      '40kb': 40 * 1024,
      '50kb': 50 * 1024,
      '100kb': 100 * 1024,
      '150kb': 150 * 1024,
      '200kb': 200 * 1024,
      '300kb': 300 * 1024,
      '500kb': 500 * 1024,
      '1mb': 1024 * 1024,
      '2mb': 2 * 1024 * 1024,
      '5mb': 5 * 1024 * 1024,
      '10mb': 10 * 1024 * 1024,
    };
    return map[targetPreset] || 50 * 1024;
  };

  const getTargetPresetLabel = (): string => {
    if (targetPreset === 'custom') {
      return `${customTargetValue} ${customTargetUnit}`;
    }
    const map: Record<string, string> = {
      '10kb': '10 KB',
      '20kb': '20 KB',
      '30kb': '30 KB',
      '40kb': '40 KB',
      '50kb': '50 KB',
      '100kb': '100 KB',
      '150kb': '150 KB',
      '200kb': '200 KB',
      '300kb': '300 KB',
      '500kb': '500 KB',
      '1mb': '1 MB',
      '2mb': '2 MB',
      '5mb': '5 MB',
      '10mb': '10 MB',
    };
    return map[targetPreset] || 'Target Size';
  };

  const getCompressButtonLabel = (): string => {
    const count = queue.length;
    if (compressionMode === 'target') {
      const targetLabel = getTargetPresetLabel();
      if (count <= 1) return `Compress to ${targetLabel}`;
      return `Compress ${count} Images to ${targetLabel}`;
    }
    if (count <= 1) return 'Compress Image Now';
    return `Compress ${count} Images Now`;
  };

  const addFilesToQueue = async (files: FileList | File[]) => {
    const newItems: ImageQueueItem[] = [];

    for (const f of Array.from(files)) {
      try {
        const analysis = await analyzeImageFile(f);
        if (analysis.isUnsupported) {
          showToast(`${f.name}: ${analysis.unsupportedReason}`, 'error');
          continue;
        }

        const thumbUrl = URL.createObjectURL(f);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9) + Date.now(),
          file: f,
          name: f.name,
          originalSize: f.size,
          originalWidth: analysis.width,
          originalHeight: analysis.height,
          originalFormat: analysis.detectedFormat.toUpperCase(),
          thumbnailUrl: thumbUrl,
          compressedBlob: null,
          compressedSize: 0,
          compressedWidth: analysis.width,
          compressedHeight: analysis.height,
          status: 'pending',
          targetReached: null,
          targetBytes: getTargetSizeBytes()
        });
      } catch (err: any) {
        showToast(`Failed to load ${f.name}: ${err.message}`, 'error');
      }
    }

    if (newItems.length === 0) {
      return;
    }

    setQueue((prev) => {
      const next = [...prev, ...newItems];
      if (!activeFileId && next.length > 0) {
        setActiveFileId(next[0].id);
      }
      return next;
    });

    showToast(`Added ${newItems.length} image${newItems.length > 1 ? 's' : ''}`, 'success');
  };

  const handleInitialDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        if (item.thumbnailUrl) URL.revokeObjectURL(item.thumbnailUrl);
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      }
      const next = prev.filter((i) => i.id !== id);
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
      if (item.thumbnailUrl) URL.revokeObjectURL(item.thumbnailUrl);
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setQueue([]);
    setActiveFileId(null);
    setPreviewItem(null);
  };

  const compressSingleItem = async (item: ImageQueueItem): Promise<ImageQueueItem> => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }

    const currentTargetBytes = getTargetSizeBytes();

    try {
      const result: ImageCompressionResult = await compressImageWithEngine(item.file, {
        mode: compressionMode,
        targetBytes: currentTargetBytes,
        quality: qualitySlider,
        outputFormat,
        scalePercent: dimensionMode === 'percent' ? scalePercent : undefined,
        customWidth: dimensionMode === 'custom' && customWidth > 0 ? customWidth : undefined,
        customHeight: dimensionMode === 'custom' && customHeight > 0 ? customHeight : undefined,
        maintainAspectRatio,
        allowDimensionScaling: allowTargetDimensionScaling,
        onProgress: (msg, percent) => {
          setStatusMessage(`${item.name}: ${msg}`);
          setProgressPercent(percent);
        }
      });

      return {
        ...item,
        compressedBlob: result.blob,
        compressedSize: result.size,
        compressedWidth: result.width,
        compressedHeight: result.height,
        status: 'completed',
        targetReached: result.targetReached,
        targetBytes: currentTargetBytes,
        statusExplanation: result.statusMessage,
        passesRun: result.passesRun,
        outputFormat: result.format.toUpperCase(),
        qualityUsed: result.qualityUsed,
        dimensionChanged: result.dimensionChanged,
        previewUrl: result.previewUrl
      };
    } catch (err: any) {
      console.error('Image compression error for', item.name, err);
      return {
        ...item,
        status: 'error',
        errorMessage: err.message || 'Compression failed'
      };
    }
  };

  const runCompression = async () => {
    if (queue.length === 0) return;
    setIsProcessingAll(true);
    setProgressPercent(5);
    setStatusMessage('Analyzing images and calibrating compression...');

    const updatedQueue: ImageQueueItem[] = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      setStatusMessage(`Compressing ${item.name} (${i + 1} of ${queue.length})...`);
      const processed = await compressSingleItem(item);
      updatedQueue.push(processed);
      setProgressPercent(Math.round(((i + 1) / queue.length) * 100));
    }

    setQueue(updatedQueue);
    setIsProcessingAll(false);
    setStatusMessage('Compression complete!');
    showToast(`Successfully compressed ${queue.length} image${queue.length > 1 ? 's' : ''}!`, 'success');

    const firstSuccess = updatedQueue.find((i) => i.status === 'completed');
    if (firstSuccess) {
      setActiveFileId(firstSuccess.id);
    }
  };

  // Physical calculations across queue
  const totalOriginalSize = queue.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = queue.reduce((acc, curr) => acc + (curr.compressedSize || curr.originalSize), 0);
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const overallReductionPercent =
    totalOriginalSize > 0
      ? parseFloat((((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(2))
      : 0;

  const activeItem = queue.find((i) => i.id === activeFileId) || queue[0];

  // Sharing actual compressed file via Web Share API
  const handleShareCompressedFile = async (item: ImageQueueItem) => {
    if (!item.compressedBlob) {
      showToast('Image is not yet compressed.', 'info');
      return;
    }

    const ext = item.outputFormat?.toLowerCase() || 'jpg';
    const cleanBase = item.name.replace(/\.[^/.]+$/, '');
    const targetSuffix = compressionMode === 'target' ? `-${getTargetPresetLabel().replace(/\s+/g, '').toLowerCase()}` : '';
    const outName = `${cleanBase}-compressed${targetSuffix}.${ext === 'jpeg' ? 'jpg' : ext}`;

    const mime = item.compressedBlob.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const file = new File([item.compressedBlob], outName, { type: mime });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Compressed ${item.name}`,
          text: `Compressed to ${formatByteSize(item.compressedSize)} with RajToolBox (100% private in-browser).`
        });
        showToast('Image shared successfully!', 'success');
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

  // Download All as ZIP
  const handleDownloadAllZip = async () => {
    const completedItems = queue.filter((i) => i.status === 'completed' && i.compressedBlob);
    if (completedItems.length === 0) {
      showToast('No completed images to download.', 'info');
      return;
    }

    setIsZipping(true);
    showToast('Bundling images into ZIP package...', 'info');

    try {
      const zip = new JSZip();
      completedItems.forEach((item, idx) => {
        const ext = item.outputFormat?.toLowerCase() || 'jpg';
        const cleanBase = item.name.replace(/\.[^/.]+$/, '');
        const targetSuffix = compressionMode === 'target' ? `-${getTargetPresetLabel().replace(/\s+/g, '').toLowerCase()}` : '';
        const outName = `${cleanBase}-compressed${targetSuffix}-${idx + 1}.${ext === 'jpeg' ? 'jpg' : ext}`;
        zip.file(outName, item.compressedBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `rajtoolbox-compressed-images-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);

      showToast('ZIP archive downloaded successfully!', 'success');
    } catch (err: any) {
      console.error('ZIP generation error:', err);
      showToast('ZIP creation failed. Downloading individual images...', 'error');
      // Fallback to individual downloads
      completedItems.forEach((item) => {
        if (item.previewUrl) {
          const a = document.createElement('a');
          a.href = item.previewUrl;
          a.download = `compressed_${item.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
    } finally {
      setIsZipping(false);
    }
  };

  const getDownloadFilename = (item: ImageQueueItem): string => {
    const ext = item.outputFormat?.toLowerCase() || 'jpg';
    const cleanBase = item.name.replace(/\.[^/.]+$/, '');
    const targetSuffix = compressionMode === 'target' ? `-${getTargetPresetLabel().replace(/\s+/g, '').toLowerCase()}` : '';
    return `${cleanBase}-compressed${targetSuffix}.${ext === 'jpeg' ? 'jpg' : ext}`;
  };

  return (
    <div id="image-compressor-tool-area" className="space-y-8 scroll-mt-24">
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
            accept="image/jpeg,image/png,image/webp,image/bmp"
            multiple
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-[#F4F4F5] mb-2">
            Compress Images Online
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed">
            Drag &amp; drop images here, or click to choose from your device. Specify a target size (20 KB, 50 KB, 100 KB, 200 KB, 500 KB or custom) with 100% private in-browser compression.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#EC4899] text-white font-bold text-sm shadow-md hover:bg-[#DB2777] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Choose Image Files</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              JPG, PNG, WebP Supported
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              100% In-Browser &amp; Private
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              Real Target Size Engine
            </span>
          </div>
        </div>
      ) : (
        /* 2. ACTIVE WORKBENCH: FILE LIST + CONTROLS */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EC4899] text-white flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">
                  {queue.length} Image{queue.length > 1 ? 's' : ''} in Queue
                </h3>
                <p className="text-xs text-[#71717A]">
                  Total input: <span className="font-semibold text-[#18181B] dark:text-[#D4D4D8]">{formatByteSize(totalOriginalSize)}</span>
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
                <span>+ Add More Images</span>
              </button>
              <input
                type="file"
                ref={additionalFileInputRef}
                onChange={(e) => e.target.files && addFilesToQueue(e.target.files)}
                accept="image/jpeg,image/png,image/webp,image/bmp"
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
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                      <img
                        src={item.previewUrl || item.thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F5] truncate">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#71717A] mt-0.5">
                        <span className="font-mono">{item.originalWidth}×{item.originalHeight}</span>
                        <span>·</span>
                        <span>Original: {formatByteSize(item.originalSize)}</span>
                        {item.status === 'completed' && (
                          <>
                            <span>&rarr;</span>
                            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80]">
                              {formatByteSize(item.compressedSize)} ({reduction}% saved)
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
                    {/* 👁️ PREVIEW BUTTON */}
                    {item.status === 'completed' && item.compressedBlob && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] bg-[#FFFDF7] dark:bg-[#202026] text-[#EC4899] hover:bg-[#FCE7F3] dark:hover:bg-[#EC4899]/20 transition-all cursor-pointer"
                        title="Compare Before & After"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Download Button */}
                    {item.status === 'completed' && item.previewUrl && (
                      <a
                        href={item.previewUrl}
                        download={getDownloadFilename(item)}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] transition-all cursor-pointer"
                        title="Download compressed image"
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
                      title="Remove image"
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
                    id: 'target' as CompressionMode,
                    title: 'Target Size',
                    desc: 'Actively compress toward a specific KB or MB goal'
                  },
                  {
                    id: 'recommended' as CompressionMode,
                    title: 'Recommended',
                    desc: 'Optimal 78% balance for web, social & forms'
                  },
                  {
                    id: 'strong' as CompressionMode,
                    title: 'Strong',
                    desc: 'Aggressive 55% compaction for max storage save'
                  },
                  {
                    id: 'basic' as CompressionMode,
                    title: 'Basic / Light',
                    desc: 'High fidelity 90% preservation for print & graphics'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCompressionMode(mode.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      compressionMode === mode.id
                        ? 'border-[#EC4899] bg-[#FCE7F3]/40 dark:bg-[#EC4899]/15 shadow-2xs'
                        : 'border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899]/40 bg-[#FAFAFA] dark:bg-[#202026]'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-[#18181B] dark:text-[#F4F4F5]">{mode.title}</p>
                      <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-1 leading-snug">{mode.desc}</p>
                    </div>
                    {compressionMode === mode.id && (
                      <span className="text-[10px] font-bold text-[#EC4899] mt-2 flex items-center gap-1">
                        Active Mode &check;
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Size Presets (When Target Mode Active) */}
            {compressionMode === 'target' && (
              <div className="p-5 rounded-2xl border border-[#FACC15]/50 bg-[#FFFDF7] dark:bg-[#1C1C22] space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#854D0E] dark:text-[#FACC15] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FACC15]" />
                    Target Size Goal
                  </span>
                  <span className="text-[11px] text-[#71717A]">Binary quality search + safe dimension scaling</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
                  {[
                    { id: '10kb', label: '10 KB' },
                    { id: '20kb', label: '20 KB' },
                    { id: '30kb', label: '30 KB' },
                    { id: '40kb', label: '40 KB' },
                    { id: '50kb', label: '50 KB' },
                    { id: '100kb', label: '100 KB' },
                    { id: '150kb', label: '150 KB' },
                    { id: '200kb', label: '200 KB' },
                    { id: '300kb', label: '300 KB' },
                    { id: '500kb', label: '500 KB' },
                    { id: '1mb', label: '1 MB' },
                    { id: '2mb', label: '2 MB' },
                    { id: '5mb', label: '5 MB' },
                    { id: '10mb', label: '10 MB' },
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
                      ref={customInputRef}
                      id="custom-target-input"
                      type="number"
                      min="1"
                      step="any"
                      value={customTargetValue}
                      onChange={(e) => setCustomTargetValue(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] focus:outline-hidden focus:border-[#EC4899]"
                      placeholder="e.g. 75"
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
                      Active Goal: {customTargetValue} {customTargetUnit} ({formatByteSize(getTargetSizeBytes())})
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-[11px] text-[#854D0E] dark:text-[#FACC15] bg-[#FEF3C7]/60 dark:bg-[#FACC15]/10 p-3 rounded-xl">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Honest Quality Guard:</strong> The target size is an active optimization goal. The engine runs iterative passes to shrink the file toward your target. If a high-resolution image requires resolution scaling to reach aggressive targets like 20 KB or 50 KB, it scales dimensions while preserving aspect ratio and reporting actual metrics.
                  </p>
                </div>
              </div>
            )}

            {/* Quality Slider (For Non-Target Modes) */}
            {compressionMode !== 'target' && (
              <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  <span>Compression Quality Level</span>
                  <span className="text-[#EC4899] font-mono text-sm">{Math.round(qualitySlider * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={qualitySlider}
                  onChange={(e) => setQualitySlider(parseFloat(e.target.value))}
                  className="w-full accent-[#EC4899] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#71717A]">
                  <span>Smaller File (Lower Quality)</span>
                  <span>Balanced</span>
                  <span>Maximum Quality (Larger File)</span>
                </div>
              </div>
            )}

            {/* Dimension & Format Controls Accordion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]">
              {/* Output Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormatChoice)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
                >
                  <option value="auto">Auto (Best Compression: WebP for alpha, JPG for photo)</option>
                  <option value="original">Keep Original Format</option>
                  <option value="jpeg">Convert to JPG / JPEG</option>
                  <option value="webp">Convert to WebP (Modern high-efficiency)</option>
                  <option value="png">Keep / Convert to PNG (Lossless)</option>
                </select>
                <p className="text-[11px] text-[#71717A]">
                  Auto intelligently picks WebP or JPG for best compressibility.
                </p>
              </div>

              {/* Dimensions Control */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  Dimensions &amp; Scaling
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={dimensionMode}
                    onChange={(e) => setDimensionMode(e.target.value as any)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
                  >
                    <option value="original">Keep Original Dimensions</option>
                    <option value="percent">Scale by Percentage</option>
                    <option value="custom">Custom Width / Height</option>
                  </select>

                  {dimensionMode === 'percent' && (
                    <select
                      value={scalePercent}
                      onChange={(e) => setScalePercent(parseInt(e.target.value))}
                      className="w-24 px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] cursor-pointer"
                    >
                      <option value="75">75%</option>
                      <option value="50">50%</option>
                      <option value="25">25%</option>
                    </select>
                  )}
                </div>

                {dimensionMode === 'custom' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Width (px)"
                      value={customWidth || ''}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                      className="w-28 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold"
                    />
                    <span className="text-xs text-[#71717A]">×</span>
                    <input
                      type="number"
                      placeholder="Height (px)"
                      value={customHeight || ''}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                      className="w-28 px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-bold"
                    />
                    <label className="flex items-center gap-1.5 text-[11px] text-[#71717A] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="rounded text-[#EC4899] focus:ring-[#EC4899]"
                      />
                      <span>Lock aspect ratio</span>
                    </label>
                  </div>
                )}

                {compressionMode === 'target' && (
                  <label className="flex items-center gap-2 text-[11px] text-[#71717A] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={allowTargetDimensionScaling}
                      onChange={(e) => setAllowTargetDimensionScaling(e.target.checked)}
                      className="rounded text-[#EC4899] focus:ring-[#EC4899]"
                    />
                    <span>Allow dimension scaling if quality reduction alone cannot reach target</span>
                  </label>
                )}
              </div>
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
                    <span>Compressing {queue.length} Image{queue.length > 1 ? 's' : ''}... ({progressPercent}%)</span>
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

          {/* 4. RESULT CARD (MEASURED STRICTLY FROM ACTUAL OUTPUT BLOB) */}
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

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                      {activeItem.outputFormat}
                    </span>
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
                  <p className="text-base font-black text-[#18181B] dark:text-[#F4F4F5]">{formatByteSize(activeItem.originalSize)}</p>
                </div>

                {activeItem.targetBytes > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#202026] text-center border border-[#FACC15]/40">
                    <p className="text-[11px] text-[#854D0E] dark:text-[#FACC15] mb-1 font-semibold uppercase tracking-wider">Target Goal</p>
                    <p className="text-base font-black text-[#854D0E] dark:text-[#FACC15]">{formatByteSize(activeItem.targetBytes)}</p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] text-center border border-[#16A34A]/40">
                  <p className="text-[11px] text-[#16A34A] dark:text-[#4ADE80] mb-1 font-semibold uppercase tracking-wider">Compressed Size</p>
                  <p className="text-base font-black text-[#16A34A] dark:text-[#4ADE80]">{formatByteSize(activeItem.compressedSize)}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] text-center border border-[#E4E4E7]/60 dark:border-[#27272A]">
                  <p className="text-[11px] text-[#EC4899] mb-1 font-semibold uppercase tracking-wider">Bytes Saved</p>
                  <p className="text-base font-black text-[#EC4899]">
                    {formatByteSize(Math.max(0, activeItem.originalSize - activeItem.compressedSize))}
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

              {/* Dimensions Information */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#71717A]">Dimensions:</span>
                  <span className="font-mono font-bold text-[#18181B] dark:text-[#F4F4F5]">
                    {activeItem.originalWidth} × {activeItem.originalHeight}
                  </span>
                  <span>&rarr;</span>
                  <span className="font-mono font-bold text-[#16A34A] dark:text-[#4ADE80]">
                    {activeItem.compressedWidth} × {activeItem.compressedHeight}
                  </span>
                  {activeItem.dimensionChanged && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded">
                      Scaled for target
                    </span>
                  )}
                </div>

                {activeItem.qualityUsed && (
                  <div className="text-[11px] text-[#71717A]">
                    Calibrated Quality: <strong className="text-[#18181B] dark:text-[#D4D4D8]">{Math.round(activeItem.qualityUsed * 100)}%</strong>
                  </div>
                )}
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
                  </div>
                </div>
              )}

              {/* Action Buttons: 👁 Preview + ⬇ Download + Share */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewItem(activeItem)}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-[#EC4899] text-[#EC4899] hover:bg-[#FCE7F3]/40 dark:hover:bg-[#EC4899]/15 font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Compare Before &amp; After</span>
                </button>

                <a
                  href={activeItem.previewUrl}
                  download={getDownloadFilename(activeItem)}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#16A34A] text-white hover:bg-[#15803D] font-bold text-sm transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image ({formatByteSize(activeItem.compressedSize)})</span>
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
                  {formatByteSize(totalOriginalSize)} &rarr; {formatByteSize(totalCompressedSize)} ({overallReductionPercent}% saved across all images)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-md hover:bg-[#15803D] cursor-pointer"
                >
                  <Archive className="w-4 h-4" />
                  <span>{isZipping ? 'Bundling ZIP...' : 'Download All as ZIP'}</span>
                </button>

                <button
                  type="button"
                  onClick={runCompression}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-compress All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DEDICATED WORKING BEFORE / AFTER PREVIEW MODAL */}
      {previewItem && previewItem.compressedBlob && previewItem.previewUrl && (
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
                    Inspection: {previewItem.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A] mt-0.5">
                    <span>Compressed: <strong className="text-[#16A34A]">{formatByteSize(previewItem.compressedSize)}</strong></span>
                    {previewItem.targetBytes > 0 && (
                      <span>· Goal: <strong>{formatByteSize(previewItem.targetBytes)}</strong></span>
                    )}
                    <span>· Saved: <strong className="text-[#EC4899]">
                      {previewItem.originalSize > 0
                        ? (((previewItem.originalSize - previewItem.compressedSize) / previewItem.originalSize) * 100).toFixed(1)
                        : 0}%
                    </strong></span>
                  </div>
                </div>
              </div>

              {/* View Mode Switcher + Close */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewViewMode('side-by-side')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      previewViewMode === 'side-by-side'
                        ? 'bg-white dark:bg-zinc-700 text-[#EC4899] shadow-2xs'
                        : 'text-[#71717A]'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewMode('after-only')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      previewViewMode === 'after-only'
                        ? 'bg-white dark:bg-zinc-700 text-[#EC4899] shadow-2xs'
                        : 'text-[#71717A]'
                    }`}
                  >
                    Compressed Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewMode('before-only')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      previewViewMode === 'before-only'
                        ? 'bg-white dark:bg-zinc-700 text-[#EC4899] shadow-2xs'
                        : 'text-[#71717A]'
                    }`}
                  >
                    Original Only
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(0.5, parseFloat((z - 0.2).toFixed(1))))}
                  className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-semibold text-[#71717A] min-w-[36px] text-center">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(3.0, parseFloat((z + 0.2).toFixed(1))))}
                  className="p-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  title="Close inspection"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Comparison Canvas */}
            <div className="flex-1 bg-zinc-200/80 dark:bg-zinc-950/80 p-4 sm:p-6 overflow-auto">
              {previewViewMode === 'side-by-side' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[400px]">
                  {/* Before */}
                  <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">BEFORE (Original)</span>
                      <span className="font-mono text-[#71717A]">
                        {formatByteSize(previewItem.originalSize)} · {previewItem.originalWidth}×{previewItem.originalHeight}
                      </span>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-center overflow-auto min-h-[250px]">
                      <img
                        src={previewItem.thumbnailUrl}
                        alt="Original"
                        style={{ transform: `scale(${previewZoom})`, transformOrigin: 'center' }}
                        className="max-w-full max-h-[50vh] object-contain transition-transform duration-100"
                      />
                    </div>
                  </div>

                  {/* After */}
                  <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-900/60 overflow-hidden shadow-sm">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">AFTER (Compressed Result)</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                        {formatByteSize(previewItem.compressedSize)} · {previewItem.compressedWidth}×{previewItem.compressedHeight}
                      </span>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-center overflow-auto min-h-[250px]">
                      <img
                        src={previewItem.previewUrl}
                        alt="Compressed Output"
                        style={{ transform: `scale(${previewZoom})`, transformOrigin: 'center' }}
                        className="max-w-full max-h-[50vh] object-contain transition-transform duration-100"
                      />
                    </div>
                  </div>
                </div>
              ) : previewViewMode === 'after-only' ? (
                <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-900/60 p-6 overflow-auto">
                  <div className="text-xs text-[#71717A] mb-3">
                    Actual Compressed Result: <strong className="text-[#16A34A]">{formatByteSize(previewItem.compressedSize)}</strong> ({previewItem.compressedWidth}×{previewItem.compressedHeight})
                  </div>
                  <img
                    src={previewItem.previewUrl}
                    alt="Compressed Output"
                    style={{ transform: `scale(${previewZoom})`, transformOrigin: 'center' }}
                    className="max-w-full max-h-[60vh] object-contain transition-transform duration-100 shadow-lg rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-6 overflow-auto">
                  <div className="text-xs text-[#71717A] mb-3">
                    Original Source Image: <strong className="text-zinc-700 dark:text-zinc-300">{formatByteSize(previewItem.originalSize)}</strong> ({previewItem.originalWidth}×{previewItem.originalHeight})
                  </div>
                  <img
                    src={previewItem.thumbnailUrl}
                    alt="Original Source"
                    style={{ transform: `scale(${previewZoom})`, transformOrigin: 'center' }}
                    className="max-w-full max-h-[60vh] object-contain transition-transform duration-100 shadow-lg rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 sm:p-4 border-t border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#202026] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#71717A]">
                Showing actual generated compressed image blob ({formatByteSize(previewItem.compressedSize)})
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

                <a
                  href={previewItem.previewUrl}
                  download={getDownloadFilename(previewItem)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold text-[#71717A] hover:text-[#18181B] dark:hover:text-white cursor-pointer"
                >
                  Close Inspection
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
