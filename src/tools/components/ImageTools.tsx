import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Download, RefreshCw, Copy, Check, RotateCw, FlipHorizontal, Crop, Pipette } from 'lucide-react';

// IMAGE COMPRESSOR
export const ImageCompressorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      compress(f, quality);
    }
  };

  const compress = (f: File, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
          }
          setIsProcessing(false);
        },
        'image/jpeg',
        q
      );
    };
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) compress(file, newQ);
  };

  const savings = file && compressedSize ? Math.max(0, ((file.size - compressedSize) / file.size) * 100) : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
          <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
            Upload Image to Compress
          </h4>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Supports JPG, PNG, and WebP. Adjust quality slider to balance size and clarity.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
            <span>Select Image File</span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5] truncate max-w-[200px] sm:max-w-none">
              {file.name}
            </span>
            <button
              onClick={() => {
                setFile(null);
                setCompressedBlob(null);
              }}
              className="text-xs text-[#DC2626] hover:underline"
            >
              Choose Another
            </button>
          </div>

          {/* Quality Slider */}
          <div className="bg-[#FFFDF7] dark:bg-[#121215] p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A]">
            <div className="flex items-center justify-between text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
              <span>Compression Quality</span>
              <span className="text-[#EC4899] text-sm">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.05"
              value={quality}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
            <div className="flex justify-between text-[10px] text-[#71717A] mt-1">
              <span>Maximum Compression (Smaller Size)</span>
              <span>High Quality (Larger Size)</span>
            </div>
          </div>

          {/* Stats Comparison */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36]">
              <span className="text-[10px] uppercase font-bold text-[#71717A] block">Original</span>
              <span className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#2E2E36]">
              <span className="text-[10px] uppercase font-bold text-[#EC4899] block">Compressed</span>
              <span className="text-sm font-bold text-[#EC4899]">
                {(compressedSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F0FDF4] dark:bg-[#132B1C] border border-[#BBF7D0] dark:border-[#1F4E2E]">
              <span className="text-[10px] uppercase font-bold text-[#16A34A] block">Saved</span>
              <span className="text-sm font-bold text-[#16A34A]">
                -{savings.toFixed(1)}%
              </span>
            </div>
          </div>

          {compressedBlob && (
            <a
              href={URL.createObjectURL(compressedBlob)}
              download={`compressed_${file.name.replace(/\.[^/.]+$/, '')}.jpg`}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Image</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// IMAGE RESIZER
export const ImageResizerComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [origRatio, setOrigRatio] = useState<number>(1);
  const [lockRatio, setLockRatio] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const img = new Image();
      img.src = URL.createObjectURL(f);
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOrigRatio(img.width / img.height);
        setResizedUrl(null);
      };
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && origRatio) {
      setHeight(Math.round(val / origRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && origRatio) {
      setWidth(Math.round(val * origRatio));
    }
  };

  const processResize = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      setResizedUrl(canvas.toDataURL(file.type || 'image/jpeg'));
      showToast(`Resized to ${width} × ${height} px!`, 'success');
    };
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
          <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
            Upload Image to Resize
          </h4>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Change pixel dimensions or scale by percentage while preserving aspect ratio.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
            <span>Choose Image</span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-xs text-[#DC2626] hover:underline">
              Change Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
                Width (pixels)
              </label>
              <input
                type="number"
                min="10"
                max="8000"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
                Height (pixels)
              </label>
              <input
                type="number"
                min="10"
                max="8000"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="lockRatio"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="accent-[#EC4899] rounded"
            />
            <label htmlFor="lockRatio" className="text-xs font-medium text-[#71717A]">
              Lock Aspect Ratio (proportional scaling)
            </label>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={processResize}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
            >
              Resize Image
            </button>
            {resizedUrl && (
              <a
                href={resizedUrl}
                download={`resized_${width}x${height}_${file.name}`}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// IMAGE FORMAT CONVERTER
export const ImageFormatConverterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setConvertedUrl(null);
    }
  };

  const convertImage = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      setConvertedUrl(canvas.toDataURL(targetFormat, 0.92));
      showToast('Image converted successfully!', 'success');
    };
  };

  const getExtension = () => {
    if (targetFormat === 'image/jpeg') return 'jpg';
    if (targetFormat === 'image/png') return 'png';
    return 'webp';
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
          <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
            Upload Image to Convert Format
          </h4>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4">
            Convert JPG to PNG, PNG to WebP, or WebP to JPG directly in your browser.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
            <span>Select Image File</span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#18181B] dark:text-[#F4F4F5]">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-xs text-[#DC2626] hover:underline">
              Change Image
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
              Select Output Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { label: 'WebP (Modern & Small)', val: 'image/webp' },
                  { label: 'PNG (Lossless Transparency)', val: 'image/png' },
                  { label: 'JPG (Universal Photo)', val: 'image/jpeg' }
                ] as const
              ).map((fmt) => (
                <button
                  key={fmt.val}
                  onClick={() => {
                    setTargetFormat(fmt.val);
                    setConvertedUrl(null);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    targetFormat === fmt.val
                      ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                      : 'border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-[#EC4899]'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={convertImage}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
            >
              Convert Image
            </button>
            {convertedUrl && (
              <a
                href={convertedUrl}
                download={`converted_${file.name.replace(/\.[^/.]+$/, '')}.${getExtension()}`}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
              >
                <Download className="w-4 h-4" />
                <span>Download .{getExtension().toUpperCase()}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// IMAGE CROPPER & FLIPPER
export const ImageCropperComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setProcessedUrl(null);
    }
  };

  const applyTransforms = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const is90or270 = rotation % 180 !== 0;
      canvas.width = is90or270 ? img.height : img.width;
      canvas.height = is90or270 ? img.width : img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      setProcessedUrl(canvas.toDataURL(file.type || 'image/png'));
      showToast('Transformation applied!', 'success');
    };
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
          <Upload className="w-10 h-10 text-[#EC4899] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1">
            Upload Image to Rotate or Flip
          </h4>
          <label className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
            <span>Select Image File</span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setRotation((prev) => (prev + 90) % 360);
                setProcessedUrl(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold hover:border-[#EC4899]"
            >
              <RotateCw className="w-4 h-4 text-[#EC4899]" />
              <span>Rotate 90° (Now: {rotation}°)</span>
            </button>
            <button
              onClick={() => {
                setFlipH((prev) => !prev);
                setProcessedUrl(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold hover:border-[#EC4899]"
            >
              <FlipHorizontal className="w-4 h-4 text-[#EC4899]" />
              <span>Flip Horizontal ({flipH ? 'Active' : 'Off'})</span>
            </button>
            <button
              onClick={() => {
                setFlipV((prev) => !prev);
                setProcessedUrl(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold hover:border-[#EC4899]"
            >
              <span>Flip Vertical ({flipV ? 'Active' : 'Off'})</span>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={applyTransforms}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
            >
              Render Transformation
            </button>
            {processedUrl && (
              <a
                href={processedUrl}
                download={`edited_${file.name}`}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs hover:bg-[#15803D]"
              >
                <Download className="w-4 h-4" />
                <span>Download Result</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// FAVICON GENERATOR
export const FaviconGeneratorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<{ size: number; url: string }[]>([]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const img = new Image();
      img.src = URL.createObjectURL(f);
      img.onload = () => {
        const standardSizes = [16, 32, 48, 180];
        const generated = standardSizes.map((s) => {
          const canvas = document.createElement('canvas');
          canvas.width = s;
          canvas.height = s;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, s, s);
          }
          return { size: s, url: canvas.toDataURL('image/png') };
        });
        setSizes(generated);
        showToast('Generated multi-resolution favicons', 'success');
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-8 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Logo or Square Emblem</span>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>
      </div>

      {sizes.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <h4 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Generated Favicons & Touch Icons
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sizes.map((item) => (
              <div
                key={item.size}
                className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-center flex flex-col items-center justify-between"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#121215] rounded-lg p-1 border border-[#E4E4E7] dark:border-[#2E2E36] mb-2">
                  <img src={item.url} alt={`${item.size}px`} className="max-w-full max-h-full" />
                </div>
                <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-2">
                  {item.size} × {item.size} px
                </span>
                <a
                  href={item.url}
                  download={`favicon-${item.size}x${item.size}.png`}
                  className="w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#EC4899] text-white text-[11px] font-semibold"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// IMAGE COLOR PICKER
export const ImageColorPickerComponent: React.FC = () => {
  const { showToast } = useApp();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedHex, setSelectedHex] = useState<string>('#EC4899');
  const [selectedRgb, setSelectedRgb] = useState<string>('rgb(236, 72, 153)');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0);
      };
    }
  };

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
    const rgbStr = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    setSelectedHex(hex);
    setSelectedRgb(rgbStr);
    showToast(`Picked ${hex}!`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-2xl p-6 text-center bg-[#FFFDF7] dark:bg-[#18181B] hover:border-[#EC4899]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] cursor-pointer">
          <Pipette className="w-4 h-4" />
          <span>Upload Image to Pick Colors</span>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>
      </div>

      {imageUrl && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl border border-black/10 shadow-xs shrink-0"
              style={{ backgroundColor: selectedHex }}
            />
            <div>
              <span className="text-sm font-mono font-bold text-[#18181B] dark:text-[#F4F4F5] block">
                {selectedHex}
              </span>
              <span className="text-xs text-[#71717A] font-mono">{selectedRgb}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedHex);
                showToast(`Copied ${selectedHex}!`, 'success');
              }}
              className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-semibold hover:border-[#EC4899]"
            >
              <Copy className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Copy HEX</span>
            </button>
          </div>

          <div className="border border-[#E4E4E7] dark:border-[#27272A] rounded-xl overflow-hidden cursor-crosshair max-h-96 overflow-y-auto">
            <canvas ref={canvasRef} onClick={pickColor} className="w-full h-auto block" />
          </div>
          <p className="text-[11px] text-[#71717A]">
            Hover and click anywhere on the image preview above to extract the exact pixel color.
          </p>
        </div>
      )}
    </div>
  );
};
