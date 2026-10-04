import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { Download, Copy, QrCode, Wifi, Globe, Mail, Phone, FileText } from 'lucide-react';

// QR CODE GENERATOR
export const QrCodeComponent: React.FC = () => {
  const { showToast } = useApp();
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'email' | 'phone'>('url');
  const [urlInput, setUrlInput] = useState('https://rajtoolbox.com');
  const [textInput, setTextInput] = useState('Welcome to RajToolBox');
  const [wifiSsid, setWifiSsid] = useState('Home_WiFi');
  const [wifiPassword, setWifiPassword] = useState('mypassword123');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [emailTo, setEmailTo] = useState('rajtoolboxofficial@gmail.com');
  const [emailSubject, setEmailSubject] = useState('Hello RajToolBox');
  const [phoneInput, setPhoneInput] = useState('+1234567890');
  const [darkColor, setDarkColor] = useState('#18181B');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const getPayload = () => {
    switch (qrType) {
      case 'url':
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
      case 'text':
        return textInput;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case 'phone':
        return `tel:${phoneInput}`;
      default:
        return 'https://rajtoolbox.com';
    }
  };

  useEffect(() => {
    const payload = getPayload();
    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, phoneInput, darkColor, lightColor]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Configuration Area */}
      <div className="md:col-span-2 space-y-4">
        {/* Type Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#F4F4F5] dark:bg-[#202026]">
          {[
            { id: 'url', label: 'Website URL', icon: Globe },
            { id: 'text', label: 'Plain Text', icon: FileText },
            { id: 'wifi', label: 'WiFi Network', icon: Wifi },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'phone', label: 'Phone', icon: Phone }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setQrType(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  qrType === tab.id
                    ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Inputs */}
        <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] space-y-3">
          {qrType === 'url' && (
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Target Website URL</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Text Content</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={3}
                className="w-full p-3 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">WiFi SSID (Network Name)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Password</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
                />
              </div>
            </div>
          )}

          {qrType === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Email Address</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
                />
              </div>
            </div>
          )}

          {qrType === 'phone' && (
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
              />
            </div>
          )}
        </div>

        {/* Color customization */}
        <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-[#E4E4E7] dark:border-[#27272A]"
            />
            <span className="text-xs font-semibold text-[#71717A]">Foreground</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-[#E4E4E7] dark:border-[#27272A]"
            />
            <span className="text-xs font-semibold text-[#71717A]">Background</span>
          </div>
        </div>
      </div>

      {/* QR Preview Card */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs text-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#E4E4E7] mb-4 max-w-[240px]">
          {qrDataUrl && <img src={qrDataUrl} alt="QR Code Preview" className="w-full h-auto rounded-lg" />}
        </div>

        <a
          href={qrDataUrl}
          download="rajtoolbox_qrcode.png"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res PNG</span>
        </a>
      </div>
    </div>
  );
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
