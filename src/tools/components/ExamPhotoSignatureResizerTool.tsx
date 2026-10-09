import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Sliders,
  Sparkles
} from 'lucide-react';

interface PortalPreset {
  id: string;
  name: string;
  type: 'photo' | 'signature';
  minKb: number;
  maxKb: number;
  widthPx: number;
  heightPx: number;
  aspectRatioLabel: string;
  instructions: string;
}

const PRESETS: PortalPreset[] = [
  {
    id: 'ssc-photo',
    name: 'SSC Photo (20–50 KB, 3.5×4.5 cm)',
    type: 'photo',
    minKb: 20,
    maxKb: 50,
    widthPx: 350,
    heightPx: 450,
    aspectRatioLabel: '3.5 : 4.5',
    instructions: 'Plain white background, 70-80% face coverage, no caps or goggles.'
  },
  {
    id: 'ssc-sign',
    name: 'SSC Signature (10–20 KB, 4×2 cm)',
    type: 'signature',
    minKb: 10,
    maxKb: 20,
    widthPx: 400,
    heightPx: 200,
    aspectRatioLabel: '4.0 : 2.0',
    instructions: 'Running handwriting on white paper in black or blue ink.'
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Photo (20–300 KB, 350×350+ px)',
    type: 'photo',
    minKb: 20,
    maxKb: 300,
    widthPx: 500,
    heightPx: 500,
    aspectRatioLabel: '1 : 1 Square',
    instructions: 'Square aspect ratio, candidate name and photo date on bottom.'
  },
  {
    id: 'upsc-sign',
    name: 'UPSC Signature (20–300 KB)',
    type: 'signature',
    minKb: 20,
    maxKb: 300,
    widthPx: 500,
    heightPx: 250,
    aspectRatioLabel: '2 : 1 Landscape',
    instructions: 'Clear dark ink signature against clean white background.'
  },
  {
    id: 'rrb-photo',
    name: 'RRB Railway Photo (20–50 KB, 35×45 mm)',
    type: 'photo',
    minKb: 20,
    maxKb: 50,
    widthPx: 350,
    heightPx: 450,
    aspectRatioLabel: '35 : 45 mm',
    instructions: 'Clear light background without dark shades.'
  },
  {
    id: 'banking-photo',
    name: 'IBPS / SBI Photo (20–50 KB, 200×230 px)',
    type: 'photo',
    minKb: 20,
    maxKb: 50,
    widthPx: 200,
    heightPx: 230,
    aspectRatioLabel: '200 : 230 px',
    instructions: 'Standard passport format for bank applications.'
  },
  {
    id: 'banking-sign',
    name: 'IBPS / SBI Signature (10–20 KB, 140×60 px)',
    type: 'signature',
    minKb: 10,
    maxKb: 20,
    widthPx: 280,
    heightPx: 120,
    aspectRatioLabel: '140 : 60 px',
    instructions: 'Capital letter signatures are not accepted.'
  }
];

export const ExamPhotoSignatureResizerTool: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ssc-photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedSizeKb, setProcessedSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [targetKb, setTargetKb] = useState<number>(40);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  useEffect(() => {
    // Update target KB when preset changes
    const ideal = Math.round((activePreset.minKb + activePreset.maxKb) / 2);
    setTargetKb(ideal);
  }, [selectedPresetId, activePreset]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setSelectedFile(file);
    setOriginalSizeKb(Number((file.size / 1024).toFixed(1)));

    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
  };

  // Process image on Canvas and compress to exact target KB
  useEffect(() => {
    if (!originalImageUrl) return;

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalImageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Target dimension
      const targetW = activePreset.widthPx;
      const targetH = activePreset.heightPx;
      canvas.width = targetW;
      canvas.height = targetH;

      // Draw with white background (essential for transparent PNG signatures)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      // Compute centered cover crop
      const imgAspect = img.width / img.height;
      const targetAspect = targetW / targetH;

      let drawW = targetW;
      let drawH = targetH;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > targetAspect) {
        drawW = targetH * imgAspect;
        offsetX = -(drawW - targetW) / 2;
      } else {
        drawH = targetW / imgAspect;
        offsetY = -(drawH - targetH) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      // Iterative binary search compression to reach desired target KB within portal bounds
      const desiredBytes = Math.min(
        Math.max(activePreset.minKb * 1024, targetKb * 1024),
        activePreset.maxKb * 1024
      );

      let lowQuality = 0.1;
      let highQuality = 0.98;
      let bestBlob: Blob | null = null;
      let bestQuality = 0.85;

      // Quick 4-iteration quality hunt
      const findBestQuality = (iter: number) => {
        if (iter >= 6) {
          if (bestBlob) {
            setProcessedBlob(bestBlob);
            setProcessedSizeKb(Number((bestBlob.size / 1024).toFixed(1)));
            setProcessedImageUrl(URL.createObjectURL(bestBlob));
          }
          setIsProcessing(false);
          return;
        }

        const midQuality = (lowQuality + highQuality) / 2;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              return;
            }

            bestBlob = blob;
            if (blob.size > desiredBytes) {
              highQuality = midQuality;
            } else {
              lowQuality = midQuality;
              bestQuality = midQuality;
            }
            findBestQuality(iter + 1);
          },
          'image/jpeg',
          midQuality
        );
      };

      findBestQuality(0);
    };

    img.onerror = () => {
      setIsProcessing(false);
    };
  }, [originalImageUrl, activePreset, targetKb]);

  const handleDownload = () => {
    if (!processedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(processedBlob);
    const prefix = activePreset.type === 'photo' ? 'exam_photo' : 'exam_signature';
    link.download = `${prefix}_${activePreset.id}_compliant.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
    setProcessedBlob(null);
    setOriginalSizeKb(0);
    setProcessedSizeKb(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isCompliant =
    processedSizeKb >= activePreset.minKb && processedSizeKb <= activePreset.maxKb;

  return (
    <div className="space-y-8">
      {/* Privacy & Engine Assurance */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#FACC15]/50 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <strong className="text-[#18181B] dark:text-[#F4F4F5]">100% Client-Side In-Browser Processing:</strong> Your personal passport photo and signature are cropped, resized, and compressed strictly in your local device memory using HTML5 Canvas. Zero images are ever uploaded to any external server.
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white dark:bg-[#18181B] p-5 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5] block mb-3">
          Select Exam Portal Specification
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPresetId(p.id)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                selectedPresetId === p.id
                  ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                  : 'bg-[#FAFAFA] dark:bg-[#202026] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-[#CBD5E1]'
              }`}
            >
              <div>
                <span className="text-xs font-bold block text-[#18181B] dark:text-[#F4F4F5] truncate">
                  {p.name.split('(')[0]}
                </span>
                <span className="text-[10px] text-[#EC4899] font-bold block mt-0.5">
                  Target: {p.minKb}–{p.maxKb} KB
                </span>
              </div>
              <span className="text-[10px] text-[#71717A] mt-2 block">
                {p.aspectRatioLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Controls */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#EC4899]" />
              Image Source
            </h3>
            {originalImageUrl && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Image
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          {!originalImageUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center cursor-pointer hover:border-[#EC4899] transition-all bg-[#FAFAFA] dark:bg-[#202026] group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                Upload {activePreset.type === 'photo' ? 'Passport Photo' : 'Signature'}
              </h4>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-1">
                Drag and drop or click to browse (JPG, PNG, WebP)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#18181B] dark:text-[#F4F4F5] truncate max-w-[200px]">
                  {selectedFile?.name}
                </span>
                <span className="text-[#71717A]">{originalSizeKb} KB</span>
              </div>

              {/* Slider for Target KB */}
              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5 flex items-center justify-between">
                  <span>Fine-tune Target Size: {targetKb} KB</span>
                  <span className="text-[11px] text-[#71717A]">
                    Limit: {activePreset.minKb}–{activePreset.maxKb} KB
                  </span>
                </label>
                <input
                  type="range"
                  min={activePreset.minKb}
                  max={activePreset.maxKb}
                  value={targetKb}
                  onChange={(e) => setTargetKb(Number(e.target.value))}
                  className="w-full accent-[#EC4899]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-xs space-y-1">
                <div className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  Official Guidelines ({activePreset.name.split('(')[0].trim()})
                </div>
                <div className="text-[#71717A] leading-relaxed">
                  {activePreset.instructions}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview & Download */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center justify-between">
              <span>Compliant Output Preview</span>
              {processedBlob && (
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isCompliant
                      ? 'bg-[#F0FDF4] text-[#16A34A]'
                      : 'bg-[#FEF2F2] text-[#DC2626]'
                  }`}
                >
                  {isCompliant ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Portal Compliant ({processedSizeKb} KB)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" /> Out of bounds ({processedSizeKb} KB)
                    </>
                  )}
                </span>
              )}
            </h3>

            {processedImageUrl ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-2">Original</span>
                    <img
                      src={originalImageUrl!}
                      alt="Original"
                      className="max-h-40 max-w-[160px] object-contain rounded-xl border border-[#E4E4E7] dark:border-[#27272A] shadow-2xs"
                    />
                    <span className="text-[11px] text-[#71717A] mt-1 block">{originalSizeKb} KB</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#EC4899] block mb-2">
                      Processed ({activePreset.widthPx} &times; {activePreset.heightPx} px)
                    </span>
                    <img
                      src={processedImageUrl}
                      alt="Processed Output"
                      className="max-h-40 max-w-[160px] object-contain rounded-xl border-2 border-[#16A34A] shadow-xs bg-white"
                    />
                    <span className="text-[11px] font-bold text-[#16A34A] mt-1 block">
                      {processedSizeKb} KB (Target met)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                  <div className="text-xs text-[#71717A]">
                    Ready to upload on official registration forms.
                  </div>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] shadow-xs transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Compliant File ({processedSizeKb} KB)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#71717A] border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl">
                Upload your image on the left to preview the resized and compressed file.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
