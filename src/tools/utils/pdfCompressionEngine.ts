import { PDFDocument, PDFName, PDFNumber, PDFRawStream } from 'pdf-lib';
import pako from 'pako';

export type PdfClassification =
  | 'scanned'
  | 'image-heavy'
  | 'text-heavy'
  | 'vector-heavy'
  | 'mixed'
  | 'already-compressed';

export interface PdfAnalysisReport {
  pageCount: number;
  totalSize: number;
  imageCount: number;
  totalImageBytes: number;
  fontCount: number;
  hasMetadataStream: boolean;
  hasDigitalSignature: boolean;
  isEncrypted: boolean;
  classification: PdfClassification;
  estimatedImagePercentage: number;
}

export interface CompressionPassConfig {
  scale: number;
  jpegQuality: number;
  stripMetadata: boolean;
  removeAnnotations: boolean;
}

export interface CompressionResult {
  compressedBlob: Blob;
  compressedSize: number;
  originalSize: number;
  pageCount: number;
  targetReached: boolean | null;
  targetBytes: number;
  analysis: PdfAnalysisReport;
  statusMessage: string;
  passesRun: number;
}

/**
 * Inspects a PDF's internal structure, objects, images, fonts, metadata, and digital signatures.
 */
export async function analyzePdfDocument(buffer: ArrayBuffer): Promise<PdfAnalysisReport> {
  const totalSize = buffer.byteLength;
  let pdfDoc: PDFDocument;

  try {
    pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch (err: any) {
    if (err?.message?.includes('encrypt') || err?.message?.includes('password')) {
      return {
        pageCount: 0,
        totalSize,
        imageCount: 0,
        totalImageBytes: 0,
        fontCount: 0,
        hasMetadataStream: false,
        hasDigitalSignature: false,
        isEncrypted: true,
        classification: 'already-compressed',
        estimatedImagePercentage: 0
      };
    }
    throw err;
  }

  const pageCount = pdfDoc.getPageCount();
  let imageCount = 0;
  let totalImageBytes = 0;
  let fontCount = 0;
  let hasMetadataStream = false;
  let hasDigitalSignature = false;

  // Check catalog for digital signatures and metadata
  const catalog = pdfDoc.catalog;
  if (catalog.has(PDFName.of('Metadata'))) {
    hasMetadataStream = true;
  }
  if (catalog.has(PDFName.of('SigFlags')) || catalog.has(PDFName.of('AcroForm'))) {
    const acroForm = catalog.get(PDFName.of('AcroForm'));
    if (acroForm && typeof (acroForm as any).get === 'function') {
      const sigFlags = (acroForm as any).get(PDFName.of('SigFlags'));
      if (sigFlags) hasDigitalSignature = true;
    }
  }

  // Iterate all indirect objects
  for (const [, obj] of pdfDoc.context.enumerateIndirectObjects()) {
    if (!obj || !(obj as any).dict || typeof (obj as any).dict.get !== 'function') {
      continue;
    }

    const dict = (obj as any).dict;
    const type = dict.get(PDFName.of('Type'))?.toString();
    const subtype = dict.get(PDFName.of('Subtype'))?.toString();

    if (type === '/Sig' || dict.has(PDFName.of('ByteRange'))) {
      hasDigitalSignature = true;
    }

    if (type === '/Font') {
      fontCount++;
    }

    if (subtype === '/Image') {
      imageCount++;
      if (typeof (obj as any).getContents === 'function') {
        try {
          const contents = (obj as any).getContents();
          if (contents && contents.length) {
            totalImageBytes += contents.length;
          }
        } catch {
          // ignore stream read error
        }
      }
    }

    if (type === '/Metadata') {
      hasMetadataStream = true;
    }
  }

  const imageRatio = totalSize > 0 ? totalImageBytes / totalSize : 0;
  const estimatedImagePercentage = Math.min(100, Math.round(imageRatio * 100));

  let classification: PdfClassification = 'mixed';
  if (imageCount >= pageCount && imageRatio >= 0.7) {
    classification = 'scanned';
  } else if (imageRatio >= 0.5) {
    classification = 'image-heavy';
  } else if (imageRatio < 0.15 && fontCount > 0) {
    classification = 'text-heavy';
  } else if (fontCount === 0 && imageCount === 0) {
    classification = 'vector-heavy';
  } else if (imageRatio < 0.25) {
    classification = 'mixed';
  }

  return {
    pageCount,
    totalSize,
    imageCount,
    totalImageBytes,
    fontCount,
    hasMetadataStream,
    hasDigitalSignature,
    isEncrypted: pdfDoc.isEncrypted,
    classification,
    estimatedImagePercentage
  };
}

/**
 * Re-compresses a single image stream from a PDF using browser canvas.
 */
async function recompressImageStream(
  obj: any,
  scale: number,
  jpegQuality: number
): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const dict = obj.dict;
  const filter = dict.get(PDFName.of('Filter'))?.toString();
  const rawBytes: Uint8Array = obj.getContents();
  if (!rawBytes || rawBytes.length < 50) return false;

  const origWidth = Number(dict.get(PDFName.of('Width'))?.toString() || 0);
  const origHeight = Number(dict.get(PDFName.of('Height'))?.toString() || 0);

  // 1. DCTDecode (Standard JPEG)
  if (filter === '/DCTDecode') {
    try {
      const blob = new Blob([rawBytes as unknown as BlobPart], { type: 'image/jpeg' });
      const imgUrl = URL.createObjectURL(blob);

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = imgUrl;
      });
      URL.revokeObjectURL(imgUrl);

      const w = img.naturalWidth || origWidth;
      const h = img.naturalHeight || origHeight;
      if (!w || !h) return false;

      // Calculate target dimensions, preserving aspect ratio and ensuring readability
      let targetW = Math.max(300, Math.round(w * scale));
      let targetH = Math.max(300, Math.round(h * scale));
      if (w < 300) targetW = w;
      if (h < 300) targetH = h;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const compressedBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', jpegQuality);
      });

      if (!compressedBlob) return false;
      const newBytes = new Uint8Array(await compressedBlob.arrayBuffer());

      // Only substitute if it actually reduced the stream size
      if (newBytes.length < rawBytes.length) {
        obj.contents = newBytes;
        dict.set(PDFName.of('Length'), PDFNumber.of(newBytes.length));
        dict.set(PDFName.of('Width'), PDFNumber.of(targetW));
        dict.set(PDFName.of('Height'), PDFNumber.of(targetH));
        dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
        dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
        dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
        dict.delete(PDFName.of('DecodeParms'));
        return true;
      }
    } catch (err) {
      console.warn('DCTDecode recompression skipped:', err);
    }
    return false;
  }

  // 2. FlateDecode (PNG/lossless raster stream)
  if (filter === '/FlateDecode' && origWidth > 10 && origHeight > 10) {
    try {
      const colorSpace = dict.get(PDFName.of('ColorSpace'))?.toString();
      const bits = Number(dict.get(PDFName.of('BitsPerComponent'))?.toString() || 8);

      if (bits === 8) {
        const inflated = pako.inflate(rawBytes);
        let channels = 3; // default RGB
        if (colorSpace === '/DeviceGray') channels = 1;
        else if (colorSpace === '/DeviceCMYK') channels = 4;
        else if (inflated.length === origWidth * origHeight * 4) channels = 4;
        else if (inflated.length === origWidth * origHeight) channels = 1;

        if (inflated.length >= origWidth * origHeight * channels) {
          const canvas = document.createElement('canvas');
          canvas.width = origWidth;
          canvas.height = origHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) return false;

          const imgData = ctx.createImageData(origWidth, origHeight);
          const data = imgData.data;

          for (let i = 0; i < origWidth * origHeight; i++) {
            const outIdx = i * 4;
            if (channels === 3) {
              const inIdx = i * 3;
              data[outIdx] = inflated[inIdx];
              data[outIdx + 1] = inflated[inIdx + 1];
              data[outIdx + 2] = inflated[inIdx + 2];
              data[outIdx + 3] = 255;
            } else if (channels === 1) {
              const gray = inflated[i];
              data[outIdx] = gray;
              data[outIdx + 1] = gray;
              data[outIdx + 2] = gray;
              data[outIdx + 3] = 255;
            } else if (channels === 4) {
              // CMYK approximation to RGB
              const inIdx = i * 4;
              const c = inflated[inIdx] / 255;
              const m = inflated[inIdx + 1] / 255;
              const y = inflated[inIdx + 2] / 255;
              const k = inflated[inIdx + 3] / 255;
              data[outIdx] = Math.round(255 * (1 - c) * (1 - k));
              data[outIdx + 1] = Math.round(255 * (1 - m) * (1 - k));
              data[outIdx + 2] = Math.round(255 * (1 - y) * (1 - k));
              data[outIdx + 3] = 255;
            }
          }

          ctx.putImageData(imgData, 0, 0);

          // If scaling down
          let targetW = Math.max(300, Math.round(origWidth * scale));
          let targetH = Math.max(300, Math.round(origHeight * scale));
          if (origWidth < 300) targetW = origWidth;
          if (origHeight < 300) targetH = origHeight;

          let finalCanvas = canvas;
          if (targetW !== origWidth || targetH !== origHeight) {
            const scaledCanvas = document.createElement('canvas');
            scaledCanvas.width = targetW;
            scaledCanvas.height = targetH;
            const sCtx = scaledCanvas.getContext('2d');
            if (sCtx) {
              sCtx.imageSmoothingEnabled = true;
              sCtx.imageSmoothingQuality = 'high';
              sCtx.drawImage(canvas, 0, 0, targetW, targetH);
              finalCanvas = scaledCanvas;
            }
          }

          const compressedBlob = await new Promise<Blob | null>((resolve) => {
            finalCanvas.toBlob(resolve, 'image/jpeg', jpegQuality);
          });

          if (!compressedBlob) return false;
          const newBytes = new Uint8Array(await compressedBlob.arrayBuffer());

          // Conversion from uncompressed Flate raw pixels to JPEG is typically 80-95% smaller
          if (newBytes.length < rawBytes.length) {
            obj.contents = newBytes;
            dict.set(PDFName.of('Length'), PDFNumber.of(newBytes.length));
            dict.set(PDFName.of('Width'), PDFNumber.of(targetW));
            dict.set(PDFName.of('Height'), PDFNumber.of(targetH));
            dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
            dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
            dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
            dict.delete(PDFName.of('DecodeParms'));
            return true;
          }
        }
      }
    } catch (err) {
      console.warn('FlateDecode recompression skipped:', err);
    }
  }

  return false;
}

/**
 * Runs a single compression pass on a fresh PDF buffer.
 */
async function executePass(
  buffer: ArrayBuffer,
  config: CompressionPassConfig,
  enableImageCompression: boolean
): Promise<{ bytes: Uint8Array; imagesModified: number }> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  // 1. Metadata cleanup
  if (config.stripMetadata) {
    if (pdfDoc.catalog.has(PDFName.of('Metadata'))) {
      pdfDoc.catalog.delete(PDFName.of('Metadata'));
    }
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('RajToolBox PDF Compressor');
    pdfDoc.setCreator('RajToolBox.com');
  }

  // 2. Annotation cleanup if requested
  if (config.removeAnnotations) {
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      if (page.node.has(PDFName.of('Annots'))) {
        page.node.delete(PDFName.of('Annots'));
      }
    }
  }

  let imagesModified = 0;

  // 3. Image optimization pass
  if (enableImageCompression) {
    for (const [, obj] of pdfDoc.context.enumerateIndirectObjects()) {
      if (!obj || !(obj as any).dict || typeof (obj as any).dict.get !== 'function') {
        continue;
      }
      const dict = (obj as any).dict;
      if (dict.get(PDFName.of('Subtype'))?.toString() === '/Image') {
        const modified = await recompressImageStream(obj, config.scale, config.jpegQuality);
        if (modified) imagesModified++;
      }
    }
  }

  // 4. Save with high-density object stream compression
  const bytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 30
  });

  return { bytes, imagesModified };
}

/**
 * Progressive Target-Size Compression Engine.
 * Attempts multiple passes to hit the target size safely without destroying readability.
 */
export async function compressPdfWithEngine(
  file: File,
  targetBytes: number,
  compressionLevel: 'basic' | 'recommended' | 'strong' | 'target',
  options: {
    stripMetadata: boolean;
    removeAnnotations: boolean;
    onProgress?: (message: string, percent: number) => void;
  }
): Promise<CompressionResult> {
  const buffer = await file.arrayBuffer();
  const originalSize = file.size;

  options.onProgress?.('Analyzing document structure & resources...', 15);
  const analysis = await analyzePdfDocument(buffer);

  if (analysis.isEncrypted) {
    throw new Error('This PDF is password-protected. Please remove the password protection before compressing.');
  }

  let passesRun = 0;
  let bestBytes: Uint8Array | null = null;
  let bestSize = originalSize;

  // -------------------------------------------------------------
  // PASS 1: Baseline Structural & Metadata Optimization
  // -------------------------------------------------------------
  options.onProgress?.('Pass 1: Cleaning metadata & deflating streams...', 30);
  passesRun++;

  const pass1 = await executePass(
    buffer,
    {
      scale: 1.0,
      jpegQuality: 0.9,
      stripMetadata: options.stripMetadata,
      removeAnnotations: options.removeAnnotations
    },
    false // no lossy image compression in baseline pass
  );

  if (pass1.bytes.length < bestSize) {
    bestBytes = pass1.bytes;
    bestSize = pass1.bytes.length;
  }

  // Check if non-target modes or already reached
  if (compressionLevel === 'basic') {
    // Basic mode finishes here (lossless / light)
    return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Basic optimization complete.');
  }

  if (targetBytes > 0 && bestSize <= targetBytes) {
    return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Target reached on baseline cleanup!');
  }

  // If there are no images in the PDF (e.g. pure text or vector), further image passes won't help
  if (analysis.imageCount === 0) {
    return finalizeResult(
      bestBytes,
      buffer,
      originalSize,
      targetBytes,
      analysis,
      passesRun,
      'Text/vector document optimized. No embedded raster images detected.'
    );
  }

  // -------------------------------------------------------------
  // PASS 2: Moderate Image Optimization
  // -------------------------------------------------------------
  options.onProgress?.('Pass 2: Optimizing embedded images & resolution...', 50);
  passesRun++;

  let p2Scale = 0.85;
  let p2Quality = 0.72;

  if (compressionLevel === 'strong') {
    p2Scale = 0.7;
    p2Quality = 0.55;
  } else if (compressionLevel === 'target') {
    const ratio = targetBytes / bestSize;
    if (ratio < 0.25) {
      // Aggressive target (e.g. 40KB from 963KB)
      p2Scale = 0.6;
      p2Quality = 0.45;
    } else if (ratio < 0.6) {
      p2Scale = 0.75;
      p2Quality = 0.6;
    }
  }

  const pass2 = await executePass(
    buffer,
    {
      scale: p2Scale,
      jpegQuality: p2Quality,
      stripMetadata: options.stripMetadata,
      removeAnnotations: options.removeAnnotations
    },
    true
  );

  if (pass2.bytes.length < bestSize) {
    bestBytes = pass2.bytes;
    bestSize = pass2.bytes.length;
  }

  if (compressionLevel === 'recommended' || (targetBytes > 0 && bestSize <= targetBytes)) {
    return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Optimization complete.');
  }

  // -------------------------------------------------------------
  // PASS 3: Deep Target Optimization (if target not reached)
  // -------------------------------------------------------------
  if (compressionLevel === 'target' || compressionLevel === 'strong') {
    if (targetBytes > 0 && bestSize > targetBytes) {
      options.onProgress?.('Pass 3: Progressive downsampling toward target...', 75);
      passesRun++;

      const ratio = targetBytes / bestSize;
      const p3Scale = ratio < 0.3 ? 0.45 : 0.6;
      const p3Quality = ratio < 0.3 ? 0.35 : 0.48;

      const pass3 = await executePass(
        buffer,
        {
          scale: p3Scale,
          jpegQuality: p3Quality,
          stripMetadata: options.stripMetadata,
          removeAnnotations: options.removeAnnotations
        },
        true
      );

      if (pass3.bytes.length < bestSize) {
        bestBytes = pass3.bytes;
        bestSize = pass3.bytes.length;
      }
    }
  }

  // -------------------------------------------------------------
  // PASS 4: Maximum Safe Quality Floor (if aggressive target still pending)
  // -------------------------------------------------------------
  if (compressionLevel === 'target' && targetBytes > 0 && bestSize > targetBytes) {
    const ratio = targetBytes / bestSize;
    if (ratio < 0.5) {
      options.onProgress?.('Pass 4: Final safe pass at readability threshold...', 90);
      passesRun++;

      const pass4 = await executePass(
        buffer,
        {
          scale: 0.38,
          jpegQuality: 0.28,
          stripMetadata: options.stripMetadata,
          removeAnnotations: options.removeAnnotations
        },
        true
      );

      if (pass4.bytes.length < bestSize) {
        bestBytes = pass4.bytes;
        bestSize = pass4.bytes.length;
      }
    }
  }

  return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Multi-pass compression completed.');
}

function finalizeResult(
  bestBytes: Uint8Array | null,
  originalBuffer: ArrayBuffer,
  originalSize: number,
  targetBytes: number,
  analysis: PdfAnalysisReport,
  passesRun: number,
  defaultMsg: string
): CompressionResult {
  // Safe guard: Never output a file larger than original
  let finalBlob: Blob;
  let finalSize: number;

  if (!bestBytes || bestBytes.length >= originalSize) {
    finalBlob = new Blob([originalBuffer], { type: 'application/pdf' });
    finalSize = originalSize;
  } else {
    finalBlob = new Blob([bestBytes as unknown as BlobPart], { type: 'application/pdf' });
    finalSize = bestBytes.length;
  }

  const targetReached = targetBytes > 0 ? finalSize <= targetBytes : null;

  let statusMessage = defaultMsg;
  if (targetBytes > 0) {
    if (targetReached) {
      statusMessage = 'Target reached! Your compressed PDF meets your requested limit.';
    } else {
      statusMessage = 'Maximum safe compression reached while preserving document legibility.';
    }
  }

  return {
    compressedBlob: finalBlob,
    compressedSize: finalSize,
    originalSize,
    pageCount: analysis.pageCount,
    targetReached,
    targetBytes,
    analysis,
    statusMessage,
    passesRun
  };
}
