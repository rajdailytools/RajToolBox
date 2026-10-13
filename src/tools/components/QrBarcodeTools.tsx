import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QrCodeGeneratorWorkspace } from './QrCodeGeneratorWorkspace';

// QR CODE GENERATOR (Modular Workspace)
export const QrCodeComponent: React.FC = () => {
  return <QrCodeGeneratorWorkspace />;
};


// BARCODE GENERATOR
export const BarcodeComponent: React.FC = () => {
  const { showToast } = useApp();
  const [code, setCode] = useState('RAJ-TOOLBOX-2026');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple Code 128 / Linear Barcode renderer to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 160;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#18181B';
    const text = code.trim().toUpperCase() || 'SAMPLE';
    const barWidth = Math.max(2, Math.floor(340 / (text.length * 11)));
    let startX = 30;

    // Pseudo-code 128 bar pattern generator from character ASCII
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      for (let bit = 0; bit < 7; bit++) {
        const isBar = ((charCode >> bit) & 1) === 1;
        if (isBar) {
          ctx.fillRect(startX, 20, barWidth, 100);
        }
        startX += barWidth + 1;
      }
      startX += barWidth;
    }

    // Text caption below
    ctx.font = '14px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, 145);
  }, [code]);

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `barcode_${code}.png`;
    a.click();
    showToast('Downloaded Barcode PNG!', 'success');
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">
          Barcode Payload (SKU, Serial, or ID)
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-center flex flex-col items-center">
        <canvas ref={canvasRef} className="max-w-full h-auto border border-[#E4E4E7] rounded-xl mb-4 bg-white" />

        <button
          onClick={downloadBarcode}
          className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          <Download className="w-4 h-4" />
          <span>Download Barcode PNG</span>
        </button>
      </div>
    </div>
  );
};
