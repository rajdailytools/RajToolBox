/**
 * RajToolBox Image Compression Engine
 * 100% Client-Side In-Browser Multi-Pass Progressive & Target-Size Optimization
 */

export type SupportedFormat = 'jpeg' | 'png' | 'webp';
export type OutputFormatChoice = 'original' | 'auto' | 'jpeg' | 'png' | 'webp';
export type CompressionMode = 'target' | 'recommended' | 'strong' | 'basic';

export interface ImageAnalysis {
  name: string;
  originalSize: number;
  width: number;
  height: number;
  mimeType: string;
  detectedFormat: string;
  hasTransparency: boolean;
  aspectRatio: number;
  megapixels: number;
  isUnsupported: boolean;
  unsupportedReason?: string;
}

export interface DimensionConfig {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  scalePercent: number; // 25, 50, 75, 100, custom
  customDimensionsApplied: boolean;
}

export interface ImageCompressionOptions {
  mode: CompressionMode;
  targetBytes: number; // When mode === 'target'
  quality: number; // 0.05 to 0.95
  outputFormat: OutputFormatChoice;
  customWidth?: number;
  customHeight?: number;
  scalePercent?: number;
  maintainAspectRatio?: boolean;
  allowDimensionScaling?: boolean;
  onProgress?: (message: string, percent: number) => void;
}

export interface ImageCompressionResult {
  blob: Blob;
  size: number;
  originalSize: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  format: string;
  mimeType: string;
  targetReached: boolean | null;
  targetBytes: number;
  savedBytes: number;
  savedPercentage: number;
  passesRun: number;
  qualityUsed: number;
  statusMessage: string;
  previewUrl: string;
  dimensionChanged: boolean;
}

/**
 * Validates format and checks if browser can decode it.
 */
export async function analyzeImageFile(file: File): Promise<ImageAnalysis> {
  const mimeType = file.type.toLowerCase();
  const name = file.name;
  const ext = name.split('.').pop()?.toLowerCase() || '';

  // Detect format
  let detectedFormat = 'unknown';
  if (mimeType.includes('jpeg') || ext === 'jpg' || ext === 'jpeg') detectedFormat = 'jpeg';
  else if (mimeType.includes('png') || ext === 'png') detectedFormat = 'png';
  else if (mimeType.includes('webp') || ext === 'webp') detectedFormat = 'webp';
  else if (mimeType.includes('gif') || ext === 'gif') detectedFormat = 'gif';
  else if (mimeType.includes('svg') || ext === 'svg') detectedFormat = 'svg';
  else if (mimeType.includes('avif') || ext === 'avif') detectedFormat = 'avif';
  else if (mimeType.includes('bmp') || ext === 'bmp') detectedFormat = 'bmp';
  else if (mimeType.includes('heic') || ext === 'heic') detectedFormat = 'heic';
  else if (mimeType.includes('heif') || ext === 'heif') detectedFormat = 'heif';
  else if (mimeType.includes('tiff') || ext === 'tif' || ext === 'tiff') detectedFormat = 'tiff';

  // Check unsupported formats
  if (['heic', 'heif', 'tiff', 'raw', 'cr2', 'nef'].includes(detectedFormat)) {
    return {
      name,
      originalSize: file.size,
      width: 0,
      height: 0,
      mimeType,
      detectedFormat,
      hasTransparency: false,
      aspectRatio: 1,
      megapixels: 0,
      isUnsupported: true,
      unsupportedReason: `${detectedFormat.toUpperCase()} files contain proprietary raw camera encoding not natively decodable in web browsers. Please export as JPG or PNG first.`
    };
  }

  if (detectedFormat === 'svg') {
    return {
      name,
      originalSize: file.size,
      width: 0,
      height: 0,
      mimeType,
      detectedFormat,
      hasTransparency: true,
      aspectRatio: 1,
      megapixels: 0,
      isUnsupported: true,
      unsupportedReason: 'SVG is an XML-based vector format. Raster image compression does not apply to vector curves.'
    };
  }

  if (file.size === 0) {
    return {
      name,
      originalSize: 0,
      width: 0,
      height: 0,
      mimeType,
      detectedFormat,
      hasTransparency: false,
      aspectRatio: 1,
      megapixels: 0,
      isUnsupported: true,
      unsupportedReason: 'This file is empty (0 bytes). Please select a valid image file.'
    };
  }

  try {
    const img = await loadImageElement(file);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;

    if (!width || !height) {
      throw new Error('Image decoded with zero dimensions.');
    }

    // Check transparency for PNG / WebP
    let hasTransparency = false;
    if (detectedFormat === 'png' || detectedFormat === 'webp') {
      try {
        hasTransparency = checkImageTransparency(img, Math.min(width, 200), Math.min(height, 200));
      } catch {
        hasTransparency = detectedFormat === 'png';
      }
    }

    const megapixels = parseFloat(((width * height) / 1000000).toFixed(2));
    const aspectRatio = parseFloat((width / height).toFixed(4));

    return {
      name,
      originalSize: file.size,
      width,
      height,
      mimeType: mimeType || `image/${detectedFormat}`,
      detectedFormat: detectedFormat === 'unknown' ? 'jpeg' : detectedFormat,
      hasTransparency,
      aspectRatio,
      megapixels,
      isUnsupported: false
    };
  } catch (err: any) {
    return {
      name,
      originalSize: file.size,
      width: 0,
      height: 0,
      mimeType,
      detectedFormat,
      hasTransparency: false,
      aspectRatio: 1,
      megapixels: 0,
      isUnsupported: true,
      unsupportedReason: err?.message || 'Unable to decode image. File may be corrupted or damaged.'
    };
  }
}

/**
 * Loads an HTMLImageElement safely from File or Blob.
 */
export function loadImageElement(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window environment required'));
      return;
    }

    const img = new Image();
    let objectUrl = '';

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Image failed to decode. Check if the file is intact.'));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    }
  });
}

/**
 * Samples a downscaled canvas to detect whether any pixels have alpha < 250.
 */
function checkImageTransparency(img: HTMLImageElement, sampleW: number, sampleH: number): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  ctx.drawImage(img, 0, 0, sampleW, sampleH);
  const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) {
      return true;
    }
  }
  return false;
}

/**
 * Draws image onto a clean canvas with optional background filling.
 */
function drawToCanvas(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  mimeType: string,
  fillBackground = '#FFFFFF'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // Fill solid background for JPEG (which does not support alpha) to prevent black boxes
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = fillBackground;
    ctx.fillRect(0, 0, targetW, targetH);
  } else {
    ctx.clearRect(0, 0, targetW, targetH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvas;
}

/**
 * Converts canvas to Blob via promise with fallback.
 */
function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

/**
 * Resolves destination mime-type based on user choice and input characteristics.
 */
function resolveDestinationMimeType(
  outputChoice: OutputFormatChoice,
  analysis: ImageAnalysis,
  mode: CompressionMode
): { mimeType: string; format: string } {
  if (outputChoice === 'jpeg') return { mimeType: 'image/jpeg', format: 'jpg' };
  if (outputChoice === 'png') return { mimeType: 'image/png', format: 'png' };
  if (outputChoice === 'webp') return { mimeType: 'image/webp', format: 'webp' };

  if (outputChoice === 'auto') {
    // If transparent, WebP preserves transparency with superior compression
    if (analysis.hasTransparency) {
      return { mimeType: 'image/webp', format: 'webp' };
    }
    // Otherwise JPEG is universally compatible and compresses photos best
    return { mimeType: 'image/jpeg', format: 'jpg' };
  }

  // Original choice:
  if (analysis.detectedFormat === 'png') {
    // If target size or strong mode is requested, PNG lossless deflate cannot reach tiny KB targets (e.g. 50 KB)
    // In that case, we prefer WebP if transparent, or JPEG if opaque, to actually achieve compression
    if (mode === 'target' || mode === 'strong') {
      if (analysis.hasTransparency) {
        return { mimeType: 'image/webp', format: 'webp' };
      }
      return { mimeType: 'image/jpeg', format: 'jpg' };
    }
    return { mimeType: 'image/png', format: 'png' };
  }

  if (analysis.detectedFormat === 'webp') {
    return { mimeType: 'image/webp', format: 'webp' };
  }

  return { mimeType: 'image/jpeg', format: 'jpg' };
}

/**
 * Main Image Compression Engine with genuine binary-search target-size optimization.
 */
export async function compressImageWithEngine(
  file: File,
  options: ImageCompressionOptions
): Promise<ImageCompressionResult> {
  const originalSize = file.size;

  options.onProgress?.('Analyzing image metadata & dimensions...', 10);
  const analysis = await analyzeImageFile(file);

  if (analysis.isUnsupported) {
    throw new Error(analysis.unsupportedReason || 'Unsupported image file.');
  }

  const img = await loadImageElement(file);
  const origW = analysis.width;
  const origH = analysis.height;

  // Determine initial dimensions
  let targetW = origW;
  let targetH = origH;

  if (options.scalePercent && options.scalePercent < 100 && options.scalePercent > 0) {
    const factor = options.scalePercent / 100;
    targetW = Math.max(10, Math.round(origW * factor));
    targetH = Math.max(10, Math.round(origH * factor));
  } else if (options.customWidth && options.customWidth > 0) {
    targetW = Math.round(options.customWidth);
    if (options.maintainAspectRatio !== false) {
      targetH = Math.max(10, Math.round((targetW / origW) * origH));
    } else if (options.customHeight && options.customHeight > 0) {
      targetH = Math.round(options.customHeight);
    }
  } else if (options.customHeight && options.customHeight > 0) {
    targetH = Math.round(options.customHeight);
    if (options.maintainAspectRatio !== false) {
      targetW = Math.max(10, Math.round((targetH / origH) * origW));
    }
  }

  const { mimeType: destMime, format: destFormat } = resolveDestinationMimeType(
    options.outputFormat,
    analysis,
    options.mode
  );

  let passesRun = 0;
  let bestBlob: Blob | null = null;
  let bestQualityUsed = 0.8;
  let bestW = targetW;
  let bestH = targetH;

  // -------------------------------------------------------------------------
  // NON-TARGET MODES: Single or Dual Pass (Basic, Recommended, Strong)
  // -------------------------------------------------------------------------
  if (options.mode !== 'target') {
    let q = options.quality;
    if (options.mode === 'basic') {
      q = 0.90;
    } else if (options.mode === 'recommended') {
      q = 0.78;
      // Smart clamp for excessively large photos (> 3840px 4K)
      if (targetW > 3840 || targetH > 3840) {
        const factor = 3840 / Math.max(targetW, targetH);
        targetW = Math.round(targetW * factor);
        targetH = Math.round(targetH * factor);
      }
    } else if (options.mode === 'strong') {
      q = 0.55;
      // Clamp to 1920px max dimension
      if (targetW > 1920 || targetH > 1920) {
        const factor = 1920 / Math.max(targetW, targetH);
        targetW = Math.round(targetW * factor);
        targetH = Math.round(targetH * factor);
      }
    }

    options.onProgress?.(`Encoding image as ${destFormat.toUpperCase()} at quality ${Math.round(q * 100)}%...`, 50);
    passesRun++;

    const canvas = drawToCanvas(img, targetW, targetH, destMime);
    const candidateBlob = await canvasToBlob(canvas, destMime, q);

    if (!candidateBlob) {
      throw new Error('Canvas image encoding failed.');
    }

    bestBlob = candidateBlob;
    bestQualityUsed = q;
    bestW = targetW;
    bestH = targetH;

    return finalizeImageResult(
      bestBlob,
      file,
      analysis,
      bestW,
      bestH,
      destFormat,
      destMime,
      null,
      0,
      passesRun,
      bestQualityUsed,
      'Image compressed successfully.'
    );
  }

  // -------------------------------------------------------------------------
  // TARGET SIZE MODE: Iterative Binary Search with Progressive Dimension Guard
  // -------------------------------------------------------------------------
  const targetBytes = Math.max(1024, options.targetBytes);
  options.onProgress?.(`Optimizing image toward ${formatByteSize(targetBytes)}...`, 20);

  // If original file is already smaller than target, run light optimization
  if (originalSize <= targetBytes && origW === targetW && origH === targetH) {
    passesRun++;
    const canvas = drawToCanvas(img, targetW, targetH, destMime);
    const candidateBlob = await canvasToBlob(canvas, destMime, 0.88);
    if (candidateBlob && candidateBlob.size <= originalSize) {
      bestBlob = candidateBlob;
      bestQualityUsed = 0.88;
    } else {
      bestBlob = file;
      bestQualityUsed = 1.0;
    }
    return finalizeImageResult(
      bestBlob,
      file,
      analysis,
      origW,
      origH,
      destFormat,
      destMime,
      true,
      targetBytes,
      passesRun,
      bestQualityUsed,
      '✓ Image is already under target limit.'
    );
  }

  // PASS 1: Quality Binary Search on Current Dimensions
  let lowQ = 0.08;
  let highQ = 0.94;
  let currentW = targetW;
  let currentH = targetH;
  let canvas = drawToCanvas(img, currentW, currentH, destMime);

  let bestFitBlob: Blob | null = null;
  let bestFitQuality = 0.5;

  // Run up to 6 binary search steps on quality
  for (let step = 0; step < 6; step++) {
    passesRun++;
    const midQ = parseFloat(((lowQ + highQ) / 2).toFixed(2));
    options.onProgress?.(`Pass ${passesRun}: Evaluating quality ${Math.round(midQ * 100)}%...`, 25 + step * 8);

    const testBlob = await canvasToBlob(canvas, destMime, midQ);
    if (!testBlob) continue;

    if (testBlob.size <= targetBytes) {
      // Met the target! Save as best fit and see if we can get even higher quality
      bestFitBlob = testBlob;
      bestFitQuality = midQ;
      lowQ = midQ + 0.04;
    } else {
      // Exceeds target: reduce quality
      highQ = midQ - 0.04;
      // Keep smallest encountered as fallback
      if (!bestBlob || testBlob.size < bestBlob.size) {
        bestBlob = testBlob;
        bestQualityUsed = midQ;
      }
    }

    if (highQ < lowQ) break;
  }

  // If binary search found a valid candidate under target
  if (bestFitBlob && bestFitBlob.size <= targetBytes) {
    bestBlob = bestFitBlob;
    bestQualityUsed = bestFitQuality;
    return finalizeImageResult(
      bestBlob,
      file,
      analysis,
      currentW,
      currentH,
      destFormat,
      destMime,
      true,
      targetBytes,
      passesRun,
      bestQualityUsed,
      `✓ Target reached: ${formatByteSize(bestBlob.size)} is within ${formatByteSize(targetBytes)}.`
    );
  }

  // PASS 2: Progressive Dimension Scaling (If quality alone cannot reach target)
  // For example: 4000x3000 photo targeting 50 KB or 20 KB
  const allowScaling = options.allowDimensionScaling !== false;

  if (allowScaling && (!bestBlob || bestBlob.size > targetBytes)) {
    const currentMinSize = bestBlob ? bestBlob.size : originalSize;
    // Estimate required scale factor based on area (bytes proportional to width*height)
    const ratio = targetBytes / currentMinSize;
    let scaleFactor = Math.min(0.85, Math.max(0.25, Math.sqrt(ratio) * 0.95));

    for (let dimStep = 1; dimStep <= 3; dimStep++) {
      passesRun++;
      const scaledW = Math.max(120, Math.round(currentW * scaleFactor));
      const scaledH = Math.max(120, Math.round(currentH * scaleFactor));

      options.onProgress?.(
        `Pass ${passesRun}: Downscaling to ${scaledW}×${scaledH} to reach target...`,
        70 + dimStep * 8
      );

      const scaledCanvas = drawToCanvas(img, scaledW, scaledH, destMime);

      // Test calibrated qualities: balanced then aggressive
      for (const testQ of [0.72, 0.48, 0.28]) {
        const scaledBlob = await canvasToBlob(scaledCanvas, destMime, testQ);
        if (!scaledBlob) continue;

        if (scaledBlob.size <= targetBytes) {
          bestBlob = scaledBlob;
          bestQualityUsed = testQ;
          bestW = scaledW;
          bestH = scaledH;
          return finalizeImageResult(
            bestBlob,
            file,
            analysis,
            bestW,
            bestH,
            destFormat,
            destMime,
            true,
            targetBytes,
            passesRun,
            bestQualityUsed,
            `✓ Target reached: Scaled to ${bestW}×${bestH} to meet ${formatByteSize(targetBytes)}.`
          );
        }

        if (!bestBlob || scaledBlob.size < bestBlob.size) {
          bestBlob = scaledBlob;
          bestQualityUsed = testQ;
          bestW = scaledW;
          bestH = scaledH;
        }
      }

      // Next scale iteration if still over
      scaleFactor = Math.max(0.20, scaleFactor * 0.75);
    }
  }

  // If target could not be reached, use smallest achievable candidate
  if (!bestBlob) {
    const fallbackCanvas = drawToCanvas(img, targetW, targetH, destMime);
    bestBlob = (await canvasToBlob(fallbackCanvas, destMime, 0.25)) || file;
    bestQualityUsed = 0.25;
  }

  const reached = bestBlob.size <= targetBytes;
  const statusMsg = reached
    ? `✓ Target reached: ${formatByteSize(bestBlob.size)}`
    : `Target size of ${formatByteSize(targetBytes)} could not be reached while maintaining acceptable quality. Achieved ${formatByteSize(bestBlob.size)}.`;

  return finalizeImageResult(
    bestBlob,
    file,
    analysis,
    bestW,
    bestH,
    destFormat,
    destMime,
    reached,
    targetBytes,
    passesRun,
    bestQualityUsed,
    statusMsg
  );
}

/**
 * Packages final result metrics measured strictly from actual generated Blob.
 */
function finalizeImageResult(
  blob: Blob,
  originalFile: File,
  analysis: ImageAnalysis,
  finalW: number,
  finalH: number,
  format: string,
  mimeType: string,
  targetReached: boolean | null,
  targetBytes: number,
  passesRun: number,
  qualityUsed: number,
  statusMessage: string
): ImageCompressionResult {
  const originalSize = originalFile.size;
  const finalSize = blob.size;

  const savedBytes = Math.max(0, originalSize - finalSize);
  const savedPercentage =
    originalSize > 0 ? parseFloat((((originalSize - finalSize) / originalSize) * 100).toFixed(2)) : 0;

  const previewUrl = URL.createObjectURL(blob);
  const dimensionChanged = finalW !== analysis.width || finalH !== analysis.height;

  return {
    blob,
    size: finalSize,
    originalSize,
    width: finalW,
    height: finalH,
    originalWidth: analysis.width,
    originalHeight: analysis.height,
    format,
    mimeType,
    targetReached,
    targetBytes,
    savedBytes,
    savedPercentage,
    passesRun,
    qualityUsed,
    statusMessage,
    previewUrl,
    dimensionChanged
  };
}

/**
 * Format bytes to human readable string (B, KB, MB).
 */
export function formatByteSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
