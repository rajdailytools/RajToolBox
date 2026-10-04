import { PDFDocument, PDFName, PDFNumber } from 'pdf-lib';
import pako from 'pako';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker URL for browser environments
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '3.11.174'}/build/pdf.worker.min.js`;
  } catch {
    // fallback to main thread if worker script fails
  }
}

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
 * Recompresses an individual embedded Image XObject in pdf-lib.
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

  // 1. DCTDecode (Standard embedded JPEG)
  if (filter === '/DCTDecode' || (!filter && rawBytes[0] === 0xff && rawBytes[1] === 0xd8)) {
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

      let targetW = Math.max(250, Math.round(w * scale));
      let targetH = Math.max(250, Math.round(h * scale));
      if (w < 250) targetW = w;
      if (h < 250) targetH = h;

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
    } catch {
      // ignore and keep original stream
    }
    return false;
  }

  // 2. FlateDecode (Deflated raw raster stream)
  if (filter === '/FlateDecode' && origWidth > 10 && origHeight > 10) {
    try {
      const colorSpace = dict.get(PDFName.of('ColorSpace'))?.toString();
      const bits = Number(dict.get(PDFName.of('BitsPerComponent'))?.toString() || 8);

      if (bits === 8) {
        const inflated = pako.inflate(rawBytes);
        let channels = 3;
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

          let targetW = Math.max(250, Math.round(origWidth * scale));
          let targetH = Math.max(250, Math.round(origHeight * scale));
          if (origWidth < 250) targetW = origWidth;
          if (origHeight < 250) targetH = origHeight;

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
    } catch {
      // ignore and keep original
    }
  }

  return false;
}

/**
 * Executes a structural / image pass via pdf-lib.
 */
async function executePdfLibPass(
  buffer: ArrayBuffer,
  options: {
    stripMetadata: boolean;
    removeAnnotations: boolean;
    scale: number;
    jpegQuality: number;
    optimizeImages: boolean;
  }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  if (options.stripMetadata) {
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

  if (options.removeAnnotations) {
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      if (page.node.has(PDFName.of('Annots'))) {
        page.node.delete(PDFName.of('Annots'));
      }
    }
  }

  if (options.optimizeImages) {
    for (const [, obj] of pdfDoc.context.enumerateIndirectObjects()) {
      if (!obj || !(obj as any).dict || typeof (obj as any).dict.get !== 'function') {
        continue;
      }
      const dict = (obj as any).dict;
      if (dict.get(PDFName.of('Subtype'))?.toString() === '/Image') {
        await recompressImageStream(obj, options.scale, options.jpegQuality);
      }
    }
  }

  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 40
  });
}

/**
 * Deep page-level raster progressive optimization using PDF.js.
 * This handles scanned documents, multi-page PDFs with embedded JBIG2/JPX/complex vectors,
 * and high-resolution camera scans to reach aggressive targets like 40 KB, 100 KB, 200 KB.
 */
async function executePageRasterPass(
  buffer: ArrayBuffer,
  targetBytes: number,
  scale: number,
  quality: number
): Promise<Uint8Array | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      useSystemFonts: true
    });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    if (numPages === 0) return null;

    // Load original with pdf-lib to read exact page dimension points
    const origPdfLibDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise;

      const pageJpgBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
      });

      if (!pageJpgBlob) return null;

      const pageJpgBytes = new Uint8Array(await pageJpgBlob.arrayBuffer());
      const embeddedJpg = await newDoc.embedJpg(pageJpgBytes);

      // Keep original page points
      const origPage = origPdfLibDoc.getPage(pageNum - 1);
      const { width: origW, height: origH } = origPage.getSize();

      const newPage = newDoc.addPage([origW, origH]);
      newPage.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: origW,
        height: origH
      });
    }

    newDoc.setProducer('RajToolBox PDF Compressor');
    newDoc.setCreator('RajToolBox.com');

    return await newDoc.save({ useObjectStreams: true });
  } catch (err) {
    console.warn('Page raster pass skipped or failed:', err);
    return null;
  }
}

/**
 * Main Progressive Target-Size Compression Engine.
 * Runs multi-pass optimization and strictly measures actual output Blobs.
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

  options.onProgress?.('Analyzing document structure & resources...', 10);
  const analysis = await analyzePdfDocument(buffer);

  if (analysis.isEncrypted) {
    throw new Error('This PDF is password-protected. Please remove password protection before compressing.');
  }

  let passesRun = 0;
  let bestBytes: Uint8Array | null = null;
  let bestSize = originalSize;

  // -------------------------------------------------------------
  // PASS 1: Baseline Structural & Metadata Optimization
  // -------------------------------------------------------------
  options.onProgress?.('Pass 1: Cleaning metadata & deflating streams...', 25);
  passesRun++;

  const pass1Bytes = await executePdfLibPass(buffer, {
    stripMetadata: options.stripMetadata,
    removeAnnotations: options.removeAnnotations,
    scale: 1.0,
    jpegQuality: 0.9,
    optimizeImages: false
  });

  if (pass1Bytes.length < bestSize) {
    bestBytes = pass1Bytes;
    bestSize = pass1Bytes.length;
  }

  if (compressionLevel === 'basic') {
    return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Basic lossless optimization complete.');
  }

  if (targetBytes > 0 && bestSize <= targetBytes) {
    return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Target reached on baseline cleanup!');
  }

  // -------------------------------------------------------------
  // PASS 2: Embedded Image Stream Recompression (pdf-lib)
  // -------------------------------------------------------------
  options.onProgress?.('Pass 2: Optimizing embedded image streams...', 45);
  passesRun++;

  let p2Scale = 0.85;
  let p2Quality = 0.72;

  if (compressionLevel === 'strong') {
    p2Scale = 0.7;
    p2Quality = 0.55;
  } else if (compressionLevel === 'target') {
    const ratio = targetBytes / bestSize;
    if (ratio < 0.25) {
      p2Scale = 0.6;
      p2Quality = 0.45;
    } else if (ratio < 0.6) {
      p2Scale = 0.75;
      p2Quality = 0.6;
    }
  }

  const pass2Bytes = await executePdfLibPass(buffer, {
    stripMetadata: options.stripMetadata,
    removeAnnotations: options.removeAnnotations,
    scale: p2Scale,
    jpegQuality: p2Quality,
    optimizeImages: true
  });

  if (pass2Bytes.length < bestSize) {
    bestBytes = pass2Bytes;
    bestSize = pass2Bytes.length;
  }

  if (compressionLevel === 'recommended' || (targetBytes > 0 && bestSize <= targetBytes)) {
    return finalizeResult(bestBytes, buffer, originalSize, targetBytes, analysis, passesRun, 'Optimization complete.');
  }

  // -------------------------------------------------------------
  // PASS 3: Deep Progressive Tuning (Target Mode or Strong Mode)
  // -------------------------------------------------------------
  if (compressionLevel === 'target' || compressionLevel === 'strong') {
    if (targetBytes > 0 && bestSize > targetBytes) {
      options.onProgress?.('Pass 3: Progressive deep compression toward target...', 65);
      passesRun++;

      const ratio = targetBytes / bestSize;
      const p3Scale = ratio < 0.3 ? 0.45 : 0.6;
      const p3Quality = ratio < 0.3 ? 0.35 : 0.48;

      const pass3Bytes = await executePdfLibPass(buffer, {
        stripMetadata: options.stripMetadata,
        removeAnnotations: options.removeAnnotations,
        scale: p3Scale,
        jpegQuality: p3Quality,
        optimizeImages: true
      });

      if (pass3Bytes.length < bestSize) {
        bestBytes = pass3Bytes;
        bestSize = pass3Bytes.length;
      }
    }
  }

  // -------------------------------------------------------------
  // PASS 4: Raster Progressive Engine for Scanned / Stubborn PDFs
  // If target size is still not reached and target is aggressive (e.g. 40KB from 963KB)
  // -------------------------------------------------------------
  if (compressionLevel === 'target' && targetBytes > 0 && bestSize > targetBytes) {
    const ratio = targetBytes / bestSize;
    if (ratio < 0.8 && analysis.pageCount > 0 && analysis.pageCount <= 20) {
      options.onProgress?.('Pass 4: Progressive page rasterization at target resolution...', 85);
      passesRun++;

      // Compute scale and quality based on target budget
      const targetScale = ratio < 0.2 ? 0.75 : 0.95;
      const targetQuality = Math.max(0.25, Math.min(0.65, ratio * 0.9));

      const pass4Bytes = await executePageRasterPass(buffer, targetBytes, targetScale, targetQuality);

      if (pass4Bytes && pass4Bytes.length < bestSize) {
        bestBytes = pass4Bytes;
        bestSize = pass4Bytes.length;
      }
    }
  }

  // -------------------------------------------------------------
  // PASS 5: Readability Floor Guard (Final Safe Attempt)
  // -------------------------------------------------------------
  if (compressionLevel === 'target' && targetBytes > 0 && bestSize > targetBytes) {
    const ratio = targetBytes / bestSize;
    if (ratio < 0.5 && analysis.pageCount > 0 && analysis.pageCount <= 10) {
      options.onProgress?.('Pass 5: Maximum safe compression at readability limit...', 95);
      passesRun++;

      const pass5Bytes = await executePageRasterPass(buffer, targetBytes, 0.6, 0.28);
      if (pass5Bytes && pass5Bytes.length < bestSize) {
        bestBytes = pass5Bytes;
        bestSize = pass5Bytes.length;
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
  let finalBlob: Blob;
  let finalSize: number;

  // Never return an output larger than original
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
      statusMessage = '✓ Target reached: Your compressed PDF meets your requested limit.';
    } else {
      statusMessage = 'Target size could not be reached while maintaining reasonable quality. Try a larger target.';
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
