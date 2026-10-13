import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  FileText,
  Phone,
  MessageSquare,
  Mail,
  Wifi,
  Contact,
  MapPin,
  CreditCard,
  Calendar,
  Download,
  Copy,
  Check,
  Share2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Trash2,
  Sparkles,
  Printer,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Layers,
  Settings2,
  Info,
  Maximize2
} from 'lucide-react';

export type QrType =
  | 'url'
  | 'text'
  | 'phone'
  | 'sms'
  | 'email'
  | 'wifi'
  | 'vcard'
  | 'location'
  | 'upi'
  | 'calendar';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface LogoConfig {
  dataUrl: string | null;
  name: string;
  sizePercent: number; // 15 to 25
  shape: 'square' | 'rounded' | 'circle';
}

// Calculate relative luminance for WCAG contrast
function getLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return 0.5;
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Helper to escape Wi-Fi string special characters as per standard ZXing format
function escapeWifiString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/:/g, '\\:')
    .replace(/"/g, '\\"');
}

export const QrCodeGeneratorWorkspace: React.FC = () => {
  const { showToast } = useApp();

  // QR Type State
  const [qrType, setQrType] = useState<QrType>('url');

  // Input states
  // 1. URL
  const [urlInput, setUrlInput] = useState('https://rajtoolbox.com');

  // 2. Text
  const [textInput, setTextInput] = useState('Welcome to RajToolBox. Free, fast, private online tools.');

  // 3. Phone
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');

  // 4. SMS
  const [smsPhone, setSmsPhone] = useState('+91 98765 43210');
  const [smsMessage, setSmsMessage] = useState('Hello RajToolBox! Please contact me.');

  // 5. Email
  const [emailTo, setEmailTo] = useState('contact@rajtoolbox.com');
  const [emailSubject, setEmailSubject] = useState('Enquiry from Website');
  const [emailBody, setEmailBody] = useState('Hello Team, I would like to get in touch regarding...');

  // 6. Wi-Fi
  const [wifiSsid, setWifiSsid] = useState('Office_Guest_WiFi');
  const [wifiPassword, setWifiPassword] = useState('Welcome2026!');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  // 7. vCard / Contact
  const [vcardFirst, setVcardFirst] = useState('Raj');
  const [vcardLast, setVcardLast] = useState('Sharma');
  const [vcardOrg, setVcardOrg] = useState('RajToolBox Digital');
  const [vcardTitle, setVcardTitle] = useState('Lead Engineer');
  const [vcardPhone, setVcardPhone] = useState('+91 98765 43210');
  const [vcardEmail, setVcardEmail] = useState('raj@rajtoolbox.com');
  const [vcardUrl, setVcardUrl] = useState('https://rajtoolbox.com');
  const [vcardStreet, setVcardStreet] = useState('MG Road, Sector 14');
  const [vcardCity, setVcardCity] = useState('New Delhi');
  const [vcardCountry, setVcardCountry] = useState('India');

  // 8. Location
  const [locLat, setLocLat] = useState('28.6139');
  const [locLng, setLocLng] = useState('77.2090');
  const [locName, setLocName] = useState('New Delhi, India');
  const [locFormat, setLocFormat] = useState<'geo' | 'maps'>('maps');

  // 9. UPI / Payment
  const [upiId, setUpiId] = useState('merchant@okhdfcbank');
  const [upiName, setUpiName] = useState('RajToolBox Store');
  const [upiAmount, setUpiAmount] = useState('250.00');
  const [upiNote, setUpiNote] = useState('Web Services Order');

  // 10. Calendar Event
  const [eventTitle, setEventTitle] = useState('Product Launch Demo');
  const [eventLocation, setEventLocation] = useState('Online Video Conference');
  const [eventStart, setEventStart] = useState('2026-10-20T10:00');
  const [eventEnd, setEventEnd] = useState('2026-10-20T11:00');
  const [eventDesc, setEventDesc] = useState('Live demonstration of RajToolBox tools suite.');

  // Customization State
  const [fgColor, setFgColor] = useState('#18181B');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [isTransparentBg, setIsTransparentBg] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState<number>(2);
  const [exportSize, setExportSize] = useState<number>(800); // 400, 800, 1600, 2400

  // Logo state
  const [logo, setLogo] = useState<LogoConfig>({
    dataUrl: null,
    name: '',
    sizePercent: 20,
    shape: 'rounded'
  });

  // Output & UI status
  const [currentPayload, setCurrentPayload] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute standard payload string
  const generatePayloadString = useCallback((): { payload: string; error: string | null } => {
    switch (qrType) {
      case 'url': {
        const trimmed = urlInput.trim();
        if (!trimmed) {
          return { payload: '', error: 'Please enter a valid website URL.' };
        }
        let normalized = trimmed;
        if (!/^https?:\/\//i.test(normalized)) {
          normalized = `https://${normalized}`;
        }
        try {
          new URL(normalized);
          return { payload: normalized, error: null };
        } catch {
          return { payload: normalized, error: 'The entered URL appears invalid. Please check the domain format.' };
        }
      }

      case 'text': {
        const trimmed = textInput.trim();
        if (!trimmed) {
          return { payload: '', error: 'Please enter text content to encode.' };
        }
        return { payload: textInput, error: null };
      }

      case 'phone': {
        const clean = phoneInput.trim();
        if (!clean) {
          return { payload: '', error: 'Please provide a telephone number.' };
        }
        const numeric = clean.replace(/[^0-9+]/g, '');
        return { payload: `tel:${numeric}`, error: null };
      }

      case 'sms': {
        const phoneClean = smsPhone.trim().replace(/[^0-9+]/g, '');
        if (!phoneClean) {
          return { payload: '', error: 'Please enter a recipient phone number for SMS.' };
        }
        // Standard SMSTO payload format supported by iOS & Android
        const body = smsMessage.trim();
        return { payload: body ? `SMSTO:${phoneClean}:${body}` : `SMSTO:${phoneClean}`, error: null };
      }

      case 'email': {
        const recipient = emailTo.trim();
        if (!recipient) {
          return { payload: '', error: 'Please specify a recipient email address.' };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
          return { payload: '', error: 'Please enter a valid email address (e.g. name@domain.com).' };
        }
        const params: string[] = [];
        if (emailSubject.trim()) params.push(`subject=${encodeURIComponent(emailSubject.trim())}`);
        if (emailBody.trim()) params.push(`body=${encodeURIComponent(emailBody.trim())}`);
        const queryString = params.length > 0 ? `?${params.join('&')}` : '';
        return { payload: `mailto:${recipient}${queryString}`, error: null };
      }

      case 'wifi': {
        const ssid = wifiSsid.trim();
        if (!ssid) {
          return { payload: '', error: 'Please enter a Wi-Fi network SSID.' };
        }
        const enc = wifiEncryption;
        const pass = enc === 'nopass' ? '' : wifiPassword;
        if (enc !== 'nopass' && !pass) {
          return { payload: '', error: 'Please enter the Wi-Fi password for secure network, or select Open (None).' };
        }
        const escapedSsid = escapeWifiString(ssid);
        const escapedPass = escapeWifiString(pass);
        const hiddenPart = wifiHidden ? 'H:true;' : '';
        return {
          payload: `WIFI:T:${enc};S:${escapedSsid};P:${escapedPass};${hiddenPart};`,
          error: null
        };
      }

      case 'vcard': {
        const fn = `${vcardFirst.trim()} ${vcardLast.trim()}`.trim() || 'Contact';
        if (!vcardFirst.trim() && !vcardLast.trim()) {
          return { payload: '', error: 'Please enter at least a first or last name.' };
        }
        const lines: string[] = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${vcardLast.trim()};${vcardFirst.trim()};;;`,
          `FN:${fn}`
        ];
        if (vcardOrg.trim()) lines.push(`ORG:${vcardOrg.trim()}`);
        if (vcardTitle.trim()) lines.push(`TITLE:${vcardTitle.trim()}`);
        if (vcardPhone.trim()) lines.push(`TEL;TYPE=CELL,VOICE:${vcardPhone.trim().replace(/[^0-9+]/g, '')}`);
        if (vcardEmail.trim()) lines.push(`EMAIL;TYPE=INTERNET:${vcardEmail.trim()}`);
        if (vcardUrl.trim()) lines.push(`URL:${vcardUrl.trim()}`);
        if (vcardStreet.trim() || vcardCity.trim() || vcardCountry.trim()) {
          lines.push(`ADR;TYPE=WORK:;;${vcardStreet.trim()};${vcardCity.trim()};;${vcardCountry.trim()}`);
        }
        lines.push('END:VCARD');
        return { payload: lines.join('\n'), error: null };
      }

      case 'location': {
        const lat = parseFloat(locLat.trim());
        const lng = parseFloat(locLng.trim());
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return { payload: '', error: 'Latitude must be between -90 and 90, and Longitude between -180 and 180.' };
        }
        if (locFormat === 'maps') {
          return { payload: `https://maps.google.com/?q=${lat},${lng}`, error: null };
        }
        return { payload: `geo:${lat},${lng}?q=${lat},${lng}`, error: null };
      }

      case 'upi': {
        const vpa = upiId.trim();
        if (!vpa) {
          return { payload: '', error: 'Please enter a Payee UPI ID (e.g. merchant@upi).' };
        }
        if (!vpa.includes('@')) {
          return { payload: '', error: 'UPI ID must contain "@" (e.g. name@bank).' };
        }
        const pn = upiName.trim() || 'Merchant';
        const params: string[] = [`pa=${encodeURIComponent(vpa)}`, `pn=${encodeURIComponent(pn)}`, 'cu=INR'];
        if (upiAmount.trim()) {
          const amt = parseFloat(upiAmount.trim());
          if (!isNaN(amt) && amt > 0) {
            params.push(`am=${amt.toFixed(2)}`);
          }
        }
        if (upiNote.trim()) {
          params.push(`tn=${encodeURIComponent(upiNote.trim())}`);
        }
        return { payload: `upi://pay?${params.join('&')}`, error: null };
      }

      case 'calendar': {
        if (!eventTitle.trim()) {
          return { payload: '', error: 'Please enter an event title.' };
        }
        const formatIcalDate = (dtStr: string): string => {
          if (!dtStr) return '';
          const d = new Date(dtStr);
          if (isNaN(d.getTime())) return '';
          return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        const dtStart = formatIcalDate(eventStart);
        const dtEnd = formatIcalDate(eventEnd);
        const lines: string[] = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//RajToolBox//QR Calendar//EN',
          'BEGIN:VEVENT',
          `SUMMARY:${eventTitle.trim()}`
        ];
        if (dtStart) lines.push(`DTSTART:${dtStart}`);
        if (dtEnd) lines.push(`DTEND:${dtEnd}`);
        if (eventLocation.trim()) lines.push(`LOCATION:${eventLocation.trim()}`);
        if (eventDesc.trim()) lines.push(`DESCRIPTION:${eventDesc.trim()}`);
        lines.push('END:VEVENT', 'END:VCALENDAR');
        return { payload: lines.join('\n'), error: null };
      }

      default:
        return { payload: 'https://rajtoolbox.com', error: null };
    }
  }, [
    qrType,
    urlInput,
    textInput,
    phoneInput,
    smsPhone,
    smsMessage,
    emailTo,
    emailSubject,
    emailBody,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    vcardFirst,
    vcardLast,
    vcardOrg,
    vcardTitle,
    vcardPhone,
    vcardEmail,
    vcardUrl,
    vcardStreet,
    vcardCity,
    vcardCountry,
    locLat,
    locLng,
    locFormat,
    upiId,
    upiName,
    upiAmount,
    upiNote,
    eventTitle,
    eventStart,
    eventEnd,
    eventLocation,
    eventDesc
  ]);

  // When a logo is uploaded, enforce Error Correction High (H) to guarantee scannability
  useEffect(() => {
    if (logo.dataUrl && errorCorrection !== 'H') {
      setErrorCorrection('H');
      showToast('Error Correction elevated to High (30%) to guarantee scan reliability with logo.', 'info');
    }
  }, [logo.dataUrl, errorCorrection, showToast]);

  // Render QR Code onto the Canvas
  const renderQrToCanvas = useCallback(
    async (targetCanvas: HTMLCanvasElement, size: number, payload: string) => {
      if (!payload) return;

      const effectiveErrorCorrection = logo.dataUrl ? 'H' : errorCorrection;
      const effectiveLightColor = isTransparentBg ? '#00000000' : bgColor;

      targetCanvas.width = size;
      targetCanvas.height = size;

      // 1. Render base QR code
      await QRCode.toCanvas(targetCanvas, payload, {
        width: size,
        margin: margin,
        errorCorrectionLevel: effectiveErrorCorrection,
        color: {
          dark: fgColor,
          light: effectiveLightColor
        }
      });

      // 2. If logo is present, draw logo badge in the center
      if (logo.dataUrl) {
        const ctx = targetCanvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load logo image'));
          img.src = logo.dataUrl!;
        });

        // Compute logo dimensions
        const logoDimension = (size * logo.sizePercent) / 100;
        const centerX = size / 2;
        const centerY = size / 2;
        const halfSize = logoDimension / 2;
        const padding = Math.max(4, Math.floor(logoDimension * 0.12));
        const badgeSize = logoDimension + padding * 2;
        const badgeHalf = badgeSize / 2;

        ctx.save();

        // Draw protective badge background
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#E4E4E7';
        ctx.lineWidth = Math.max(1, Math.floor(size * 0.003));

        if (logo.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(centerX, centerY, badgeHalf, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (logo.shape === 'rounded') {
          const cornerRadius = Math.floor(badgeSize * 0.22);
          ctx.beginPath();
          ctx.roundRect(centerX - badgeHalf, centerY - badgeHalf, badgeSize, badgeSize, cornerRadius);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(centerX - badgeHalf, centerY - badgeHalf, badgeSize, badgeSize);
          ctx.strokeRect(centerX - badgeHalf, centerY - badgeHalf, badgeSize, badgeSize);
        }

        // Draw the image inside with aspect ratio preserved
        const aspect = img.width / img.height;
        let drawW = logoDimension;
        let drawH = logoDimension;
        if (aspect > 1) {
          drawH = logoDimension / aspect;
        } else {
          drawW = logoDimension * aspect;
        }

        ctx.drawImage(img, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
        ctx.restore();
      }
    },
    [bgColor, fgColor, isTransparentBg, errorCorrection, margin, logo]
  );

  // Re-render preview canvas whenever inputs, styling, or logo change
  useEffect(() => {
    const { payload, error } = generatePayloadString();
    setCurrentPayload(payload);
    setValidationError(error);

    if (!payload || error) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    renderQrToCanvas(canvas, 480, payload)
      .catch((err) => {
        console.error('QR Render Error:', err);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [generatePayloadString, renderQrToCanvas]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, SVG, WebP).', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo file size is over 2 MB. Please upload a smaller logo icon.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogo({
        dataUrl: result,
        name: file.name,
        sizePercent: 20,
        shape: 'rounded'
      });
      showToast('Custom logo applied! Error correction adjusted to High (30%).', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeLogo = () => {
    setLogo({
      dataUrl: null,
      name: '',
      sizePercent: 20,
      shape: 'rounded'
    });
    showToast('Logo removed.', 'info');
  };

  // Contrast checking & scannability rating
  const contrastRatio = getContrastRatio(fgColor, bgColor);
  const isDarkOnLight = getLuminance(bgColor) > getLuminance(fgColor);
  const contrastWarning =
    contrastRatio < 4.0
      ? 'Low Contrast: Phone cameras may struggle to read this code. Increase contrast between dots and background.'
      : !isDarkOnLight && !isTransparentBg
      ? 'Inverted QR Code: Light dots on a dark background can fail on older phone cameras. Standard dark-on-light is recommended.'
      : null;

  // Download High-Res PNG
  const handleDownloadPng = async () => {
    if (!currentPayload || validationError) {
      showToast('Please fix the input errors before downloading.', 'error');
      return;
    }

    try {
      const offscreen = document.createElement('canvas');
      await renderQrToCanvas(offscreen, exportSize, currentPayload);
      const url = offscreen.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `rajtoolbox_qr_${qrType}_${exportSize}px.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloaded ${exportSize}×${exportSize} px PNG QR code!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate high-res PNG download.', 'error');
    }
  };

  // Download Scalable Vector SVG
  const handleDownloadSvg = async () => {
    if (!currentPayload || validationError) {
      showToast('Please fix the input errors before downloading.', 'error');
      return;
    }

    try {
      const effectiveErrorCorrection = logo.dataUrl ? 'H' : errorCorrection;
      const effectiveLightColor = isTransparentBg ? '#00000000' : bgColor;

      let svgString = await QRCode.toString(currentPayload, {
        type: 'svg',
        margin: margin,
        errorCorrectionLevel: effectiveErrorCorrection,
        color: {
          dark: fgColor,
          light: effectiveLightColor
        }
      });

      // If logo is present, embed as centered image badge in SVG
      if (logo.dataUrl) {
        // Extract viewBox or width
        const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
        let viewBoxSize = 100;
        if (viewBoxMatch) {
          const parts = viewBoxMatch[1].split(' ');
          viewBoxSize = parseFloat(parts[2]) || 100;
        }

        const logoBoxSize = (viewBoxSize * logo.sizePercent) / 100;
        const padding = logoBoxSize * 0.12;
        const badgeSize = logoBoxSize + padding * 2;
        const centerX = viewBoxSize / 2;
        const centerY = viewBoxSize / 2;
        const badgeX = centerX - badgeSize / 2;
        const badgeY = centerY - badgeSize / 2;
        const logoX = centerX - logoBoxSize / 2;
        const logoY = centerY - logoBoxSize / 2;

        let badgeShapeSvg = '';
        if (logo.shape === 'circle') {
          badgeShapeSvg = `<circle cx="${centerX}" cy="${centerY}" r="${badgeSize / 2}" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="0.5" />`;
        } else if (logo.shape === 'rounded') {
          const rx = badgeSize * 0.22;
          badgeShapeSvg = `<rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${rx}" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="0.5" />`;
        } else {
          badgeShapeSvg = `<rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="0.5" />`;
        }

        const logoElement = `${badgeShapeSvg}<image href="${logo.dataUrl}" x="${logoX}" y="${logoY}" width="${logoBoxSize}" height="${logoBoxSize}" preserveAspectRatio="xMidYMid meet" />`;
        svgString = svgString.replace('</svg>', `${logoElement}</svg>`);
      }

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rajtoolbox_qr_${qrType}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded vector SVG QR code!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate SVG QR code.', 'error');
    }
  };

  // Copy Encoded Payload to Clipboard
  const handleCopyPayload = () => {
    if (!currentPayload) return;
    navigator.clipboard.writeText(currentPayload);
    setCopiedPayload(true);
    showToast('Encoded QR text payload copied to clipboard!', 'success');
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            showToast('Unable to export image blob.', 'error');
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            setCopiedImage(true);
            showToast('QR code image copied to clipboard!', 'success');
            setTimeout(() => setCopiedImage(false), 2000);
          } catch (clipErr) {
            console.warn(clipErr);
            showToast('Clipboard image copy not permitted by browser. Use Download PNG instead.', 'info');
          }
        });
      } else {
        showToast('Browser does not support direct image copying. Use Download PNG.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not copy image.', 'error');
    }
  };

  // Native Web Share API
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'qr.png', { type: 'image/png' })] })) {
            const file = new File([blob], 'rajtoolbox_qr.png', { type: 'image/png' });
            await navigator.share({
              title: 'QR Code from RajToolBox',
              text: `Scannable QR Code for ${qrType.toUpperCase()}`,
              files: [file]
            });
            showToast('Shared successfully!', 'success');
          } else {
            await navigator.share({
              title: 'QR Code from RajToolBox',
              text: currentPayload,
              url: window.location.href
            });
            showToast('Shared text link!', 'success');
          }
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyPayload();
        }
      }
    } else {
      handleCopyPayload();
    }
  };

  // Print QR Code
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    try {
      // Use hidden iframe to avoid popup blockers in sandboxed iframe environments
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print QR Code – RajToolBox</title>
              <style>
                @page { size: auto; margin: 15mm; }
                body { font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0; padding: 20px; }
                .card { text-align: center; border: 1px solid #E4E4E7; border-radius: 16px; padding: 24px; max-width: 380px; }
                img { max-width: 260px; width: 100%; height: auto; margin-bottom: 14px; }
                h2 { margin: 0 0 6px 0; font-size: 18px; color: #18181B; }
                p { margin: 0; font-size: 11px; color: #71717A; word-break: break-all; }
                .badge { display: inline-block; padding: 3px 10px; background: #FCE7F3; color: #EC4899; font-weight: bold; font-size: 11px; border-radius: 9999px; margin-bottom: 12px; }
              </style>
            </head>
            <body>
              <div class="card">
                <span class="badge">RajToolBox QR Generator</span>
                <div><img src="${dataUrl}" alt="QR Code" /></div>
                <h2>Scan with Smartphone Camera</h2>
                <p>${currentPayload}</p>
              </div>
            </body>
          </html>
        `);
        doc.close();
        iframe.contentWindow?.focus();
        setTimeout(() => {
          try {
            iframe.contentWindow?.print();
          } catch (e) {
            console.error(e);
          }
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }, 250);
      } else {
        showToast('Printing unavailable in this browser.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not initiate print dialog.', 'error');
    }
  };

  // Reset form
  const handleReset = () => {
    setUrlInput('https://rajtoolbox.com');
    setTextInput('Welcome to RajToolBox. Free, fast, private online tools.');
    setPhoneInput('+91 98765 43210');
    setSmsPhone('+91 98765 43210');
    setSmsMessage('Hello RajToolBox! Please contact me.');
    setEmailTo('contact@rajtoolbox.com');
    setEmailSubject('Enquiry from Website');
    setEmailBody('Hello Team, I would like to get in touch regarding...');
    setWifiSsid('Office_Guest_WiFi');
    setWifiPassword('Welcome2026!');
    setWifiEncryption('WPA');
    setWifiHidden(false);
    setVcardFirst('Raj');
    setVcardLast('Sharma');
    setVcardOrg('RajToolBox Digital');
    setVcardTitle('Lead Engineer');
    setVcardPhone('+91 98765 43210');
    setVcardEmail('raj@rajtoolbox.com');
    setVcardUrl('https://rajtoolbox.com');
    setFgColor('#18181B');
    setBgColor('#FFFFFF');
    setIsTransparentBg(false);
    setErrorCorrection('M');
    setMargin(2);
    setExportSize(800);
    removeLogo();
    showToast('Reset generator to default settings.', 'info');
  };

  const tabs: { id: QrType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'url', label: 'Website URL', icon: Globe },
    { id: 'text', label: 'Plain Text', icon: FileText },
    { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
    { id: 'vcard', label: 'Contact (vCard)', icon: Contact },
    { id: 'upi', label: 'UPI Payment', icon: CreditCard },
    { id: 'email', label: 'Email Draft', icon: Mail },
    { id: 'sms', label: 'SMS Message', icon: MessageSquare },
    { id: 'phone', label: 'Phone Call', icon: Phone },
    { id: 'location', label: 'Map Location', icon: MapPin },
    { id: 'calendar', label: 'Event', icon: Calendar }
  ];

  return (
    <div className="w-full space-y-6 min-w-0">
      {/* 1. QR TYPE TABS */}
      <div className="w-full min-w-0">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mb-2">
          1. Select QR Code Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#F4F4F5] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] w-full min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = qrType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setQrType(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-left min-w-0 w-full ${
                  isActive
                    ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-sm ring-1 ring-[#EC4899]/30'
                    : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#EC4899]' : 'text-[#71717A]'}`} />
                <span className="truncate min-w-0">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: Inputs on Left, Real Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0 w-full">
        {/* Left Column: Input Form + Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-6 min-w-0 w-full">
          {/* Dynamic Content Card */}
          <div className="p-4 sm:p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-4 min-w-0 w-full">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
              <h2 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center text-xs font-black">
                  2
                </span>
                Enter Details for {tabs.find((t) => t.id === qrType)?.label}
              </h2>
              <button
                onClick={handleReset}
                type="button"
                className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#EC4899] font-medium transition-colors"
                title="Reset to default example"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* A. URL */}
            {qrType === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                  Website URL <span className="text-[#EC4899]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/page"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] leading-normal">
                  Example: <code className="text-[#EC4899]">https://rajtoolbox.com/menu</code>. Stores a web link. When scanned, opens directly in the browser. Requires mobile data or Wi-Fi to load.
                </p>
              </div>
            )}

            {/* B. Plain Text */}
            {qrType === 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                    Plain Text Message <span className="text-[#EC4899]">*</span>
                  </label>
                  <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-mono">
                    {textInput.length} chars (~{new TextEncoder().encode(textInput).length} bytes)
                  </span>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  placeholder="Type any message, note, voucher code, or instruction..."
                  className="w-full p-3 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                />
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  The text is directly embedded in the QR matrix. Scanners can read it instantly offline without internet access.
                </p>
              </div>
            )}

            {/* C. Phone */}
            {qrType === 'phone' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                  Telephone Number (with Country Code) <span className="text-[#EC4899]">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+1 555 123 4567 or +91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                />
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  Generates a <code className="text-[#EC4899]">tel:</code> URI. When scanned, prompts the user's phone dialer to call this number with a single tap.
                </p>
              </div>
            )}

            {/* D. SMS */}
            {qrType === 'sms' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Recipient Phone Number <span className="text-[#EC4899]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Pre-filled SMS Message (Optional)
                  </label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    rows={2}
                    placeholder="Hello, I would like information regarding..."
                    className="w-full p-3 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  Scanning opens the phone's native Messages app with the recipient and draft filled. The user must review and tap Send.
                </p>
              </div>
            )}

            {/* E. Email */}
            {qrType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Recipient Email Address <span className="text-[#EC4899]">*</span>
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Subject Line (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="RajToolBox enquiry"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Pre-filled Message Body (Optional)
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={2}
                    placeholder="Hello, I would like more details about..."
                    className="w-full p-3 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  Generates an escaped <code className="text-[#EC4899]">mailto:</code> link. Opens the user's default email app. Scanning does not automatically send the email.
                </p>
              </div>
            )}

            {/* F. Wi-Fi */}
            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Network Name (SSID) <span className="text-[#EC4899]">*</span>
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyHome_5G"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Security Type
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">Open Network (No Password)</option>
                    </select>
                  </div>

                  {wifiEncryption !== 'nopass' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                          Password <span className="text-[#EC4899]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowWifiPassword(!showWifiPassword)}
                          className="text-[11px] text-[#71717A] hover:text-[#EC4899] inline-flex items-center gap-1"
                        >
                          {showWifiPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showWifiPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showWifiPassword ? 'text' : 'password'}
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Network password"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="wifiHiddenCheckbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded text-[#EC4899] focus:ring-[#EC4899]"
                  />
                  <label htmlFor="wifiHiddenCheckbox" className="text-xs text-[#71717A] dark:text-[#A1A1AA] cursor-pointer">
                    Hidden SSID (Network does not broadcast its name)
                  </label>
                </div>

                <div className="p-3 bg-[#FFFDF7] dark:bg-[#141418] rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-[11px] text-[#71717A] dark:text-[#A1A1AA] space-y-1">
                  <p className="font-semibold text-[#18181B] dark:text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    100% Private In-Browser Generation
                  </p>
                  <p>
                    Your Wi-Fi password is encrypted strictly into the visual 2D matrix in your browser memory. It is never logged, sent over any network, or stored anywhere on RajToolBox servers.
                  </p>
                </div>
              </div>
            )}

            {/* G. vCard / Contact */}
            {qrType === 'vcard' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      First Name <span className="text-[#EC4899]">*</span>
                    </label>
                    <input
                      type="text"
                      value={vcardFirst}
                      onChange={(e) => setVcardFirst(e.target.value)}
                      placeholder="Raj"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={vcardLast}
                      onChange={(e) => setVcardLast(e.target.value)}
                      placeholder="Sharma"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      placeholder="RajToolBox Inc."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={vcardTitle}
                      onChange={(e) => setVcardTitle(e.target.value)}
                      placeholder="Product Lead"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      placeholder="raj@example.com"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={vcardUrl}
                      onChange={(e) => setVcardUrl(e.target.value)}
                      placeholder="https://rajtoolbox.com"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">City</label>
                    <input
                      type="text"
                      value={vcardCity}
                      onChange={(e) => setVcardCity(e.target.value)}
                      placeholder="New Delhi"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">Country</label>
                    <input
                      type="text"
                      value={vcardCountry}
                      onChange={(e) => setVcardCountry(e.target.value)}
                      placeholder="India"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  Compliant with RFC 2426 vCard 3.0. When scanned by iPhone or Android, prompts <strong>"Add to Contacts"</strong> with all details pre-populated.
                </p>
              </div>
            )}

            {/* H. Location */}
            {qrType === 'location' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Latitude (-90 to +90) <span className="text-[#EC4899]">*</span>
                    </label>
                    <input
                      type="text"
                      value={locLat}
                      onChange={(e) => setLocLat(e.target.value)}
                      placeholder="28.6139"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Longitude (-180 to +180) <span className="text-[#EC4899]">*</span>
                    </label>
                    <input
                      type="text"
                      value={locLng}
                      onChange={(e) => setLocLng(e.target.value)}
                      placeholder="77.2090"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Format Compatibility
                  </label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="locFormat"
                        checked={locFormat === 'maps'}
                        onChange={() => setLocFormat('maps')}
                        className="text-[#EC4899] focus:ring-[#EC4899]"
                      />
                      <span>Google Maps URL (Universal browser &amp; app support)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="locFormat"
                        checked={locFormat === 'geo'}
                        onChange={() => setLocFormat('geo')}
                        className="text-[#EC4899] focus:ring-[#EC4899]"
                      />
                      <span>Standard Geo URI (RFC 5870)</span>
                    </label>
                  </div>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  Stores a static geographic pin. Scanning opens the location in Google Maps, Apple Maps, or OpenStreetMap.
                </p>
              </div>
            )}

            {/* I. UPI Payment */}
            {qrType === 'upi' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Payee UPI ID (VPA) <span className="text-[#EC4899]">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="merchant@okhdfcbank"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Payee Display Name <span className="text-[#EC4899]">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                      placeholder="RajToolBox Store"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Requested Amount in ₹ (INR, Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-[#71717A]">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(e.target.value)}
                        placeholder="Leave blank for any amount"
                        className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Transaction Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiNote}
                      onChange={(e) => setUpiNote(e.target.value)}
                      placeholder="Bill Payment"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>

                {/* Honest UPI Disclaimer Banner */}
                <div className="p-3.5 rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] dark:bg-[#78350F]/20 text-[#92400E] dark:text-[#FDE68A] text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Important Payment Information &amp; Disclaimer</span>
                  </div>
                  <p className="leading-relaxed">
                    This QR encodes a standard NPCI UPI deep link (<code className="font-mono">upi://pay?...</code>). Scanning opens the payer's installed UPI app (Google Pay, PhonePe, Paytm, BHIM).
                  </p>
                  <p className="leading-relaxed font-semibold">
                    RajToolBox is NOT a payment gateway. No transactions pass through our platform, and generating or scanning a QR code does NOT verify receipt of payment. The payer must independently authorize the transaction using their secure UPI PIN.
                  </p>
                </div>
              </div>
            )}

            {/* J. Calendar Event */}
            {qrType === 'calendar' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                    Event Title <span className="text-[#EC4899]">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Product Launch Webinar"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Start Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventStart}
                      onChange={(e) => setEventStart(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      End Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventEnd}
                      onChange={(e) => setEventEnd(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Location / Platform
                    </label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Convention Hall or Zoom Link"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                      Event Description
                    </label>
                    <input
                      type="text"
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      placeholder="Agenda details..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                  Encodes an RFC 5545 iCalendar VEVENT block. When scanned, prompts the phone to add this event into Apple Calendar, Google Calendar, or Outlook.
                </p>
              </div>
            )}

            {/* Validation Error banner */}
            {validationError && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 border border-[#EF4444]/30 text-[#B91C1C] dark:text-[#FCA5A5] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* 3. CUSTOMIZATION & STYLING CARD */}
          <div className="p-4 sm:p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-xs space-y-5 min-w-0 w-full">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
              <h2 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center text-xs font-black">
                  3
                </span>
                Custom Styling, Logo &amp; Error Correction
              </h2>
              <span className="text-[11px] font-semibold text-[#16A34A] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#14532D]/40 px-2 py-0.5 rounded-full">
                Safe Mode
              </span>
            </div>

            {/* Color controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
              {/* Foreground Color */}
              <div className="space-y-1.5 min-w-0">
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                  Foreground (Dots / Pattern)
                </label>
                <div className="flex items-center flex-wrap gap-2 min-w-0">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#E4E4E7] dark:border-[#27272A] p-0.5 bg-white shrink-0"
                    aria-label="Select QR foreground color"
                  />
                  <input
                    type="text"
                    value={fgColor.toUpperCase()}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-20 sm:w-24 px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] min-w-0"
                  />
                  {/* Swatches */}
                  <div className="flex items-center flex-wrap gap-1">
                    {['#18181B', '#1E3A8A', '#065F46', '#BE185D'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFgColor(c)}
                        className="w-5 h-5 rounded-md border border-[#E4E4E7] dark:border-[#27272A] transition-transform hover:scale-110 shrink-0"
                        style={{ backgroundColor: c }}
                        title={`Set foreground to ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                    Background Color
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-[#71717A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTransparentBg}
                      onChange={(e) => setIsTransparentBg(e.target.checked)}
                      className="rounded text-[#EC4899] focus:ring-[#EC4899]"
                    />
                    <span>Transparent</span>
                  </label>
                </div>
                <div className="flex items-center flex-wrap gap-2 min-w-0">
                  <input
                    type="color"
                    disabled={isTransparentBg}
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className={`w-10 h-10 rounded-xl cursor-pointer border border-[#E4E4E7] dark:border-[#27272A] p-0.5 bg-white shrink-0 ${
                      isTransparentBg ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                    aria-label="Select QR background color"
                  />
                  <input
                    type="text"
                    disabled={isTransparentBg}
                    value={isTransparentBg ? 'Transparent' : bgColor.toUpperCase()}
                    onChange={(e) => setBgColor(e.target.value)}
                    className={`w-20 sm:w-24 px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] min-w-0 ${
                      isTransparentBg ? 'opacity-40' : ''
                    }`}
                  />
                  {/* Swatches */}
                  {!isTransparentBg && (
                    <div className="flex items-center flex-wrap gap-1">
                      {['#FFFFFF', '#FFFDF7', '#F4F4F5', '#FEF3C7'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBgColor(c)}
                          className="w-5 h-5 rounded-md border border-[#E4E4E7] dark:border-[#27272A] transition-transform hover:scale-110 shrink-0"
                          style={{ backgroundColor: c }}
                          title={`Set background to ${c}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contrast check feedback */}
            {contrastWarning && (
              <div className="p-3 rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] dark:bg-[#78350F]/20 text-[#92400E] dark:text-[#FDE68A] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#F59E0B]" />
                <span>{contrastWarning}</span>
              </div>
            )}

            {/* Logo Upload & Positioning */}
            <div className="pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7]">
                    Center Logo / Icon (Optional)
                  </label>
                  <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                    Upload PNG, JPG, or SVG. Local browser FileReader processing.
                  </p>
                </div>
                {logo.dataUrl && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="inline-flex items-center gap-1 text-xs text-[#DC2626] font-semibold hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Logo</span>
                  </button>
                )}
              </div>

              {!logo.dataUrl ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] bg-[#FFFDF7] dark:bg-[#121215] text-xs font-semibold text-[#71717A] hover:text-[#EC4899] cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Click to Upload Custom Logo (Max 2MB)</span>
                  </label>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#141418] space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={logo.dataUrl}
                      alt="Uploaded Logo"
                      className="w-10 h-10 object-contain rounded-lg border border-[#E4E4E7] bg-white p-1"
                    />
                    <div className="text-xs truncate">
                      <p className="font-semibold text-[#18181B] dark:text-white truncate">{logo.name || 'Custom Logo'}</p>
                      <p className="text-[#16A34A] text-[11px] font-medium">Applied to center matrix</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-semibold text-[#71717A]">
                        <span>Logo Size: {logo.sizePercent}%</span>
                        <span className="text-[#16A34A]">Recommended: 18-22%</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="26"
                        value={logo.sizePercent}
                        onChange={(e) => setLogo({ ...logo, sizePercent: parseInt(e.target.value) })}
                        className="w-full accent-[#EC4899]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1 font-semibold text-[#71717A]">
                        Logo Badge Shape
                      </label>
                      <div className="flex gap-2">
                        {(['rounded', 'circle', 'square'] as const).map((sh) => (
                          <button
                            key={sh}
                            type="button"
                            onClick={() => setLogo({ ...logo, shape: sh })}
                            className={`flex-1 py-1 rounded-lg text-xs capitalize font-semibold border ${
                              logo.shape === sh
                                ? 'bg-white dark:bg-[#18181B] border-[#EC4899] text-[#EC4899]'
                                : 'border-[#E4E4E7] dark:border-[#27272A] text-[#71717A]'
                            }`}
                          >
                            {sh}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error correction & Quiet Zone settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                  Error Correction Level
                </label>
                <select
                  value={errorCorrection}
                  disabled={!!logo.dataUrl}
                  onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/30 disabled:opacity-60"
                >
                  <option value="L">Low (L ~7% recovery) – Simplest matrix</option>
                  <option value="M">Medium (M ~15% recovery) – Standard</option>
                  <option value="Q">Quartile (Q ~25% recovery) – High resilience</option>
                  <option value="H">High (H ~30% recovery) – Best for logos/print</option>
                </select>
                {logo.dataUrl && (
                  <span className="text-[10px] text-[#16A34A] block mt-1">
                    Locked to High (H) because a logo is present.
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-[#18181B] dark:text-[#E4E4E7] mb-1">
                  Quiet Zone (Outer White Margin)
                </label>
                <div className="flex gap-1.5 sm:gap-2 min-w-0">
                  {[
                    { val: 0, label: 'None (0)' },
                    { val: 2, label: 'Compact (2)' },
                    { val: 4, label: 'Standard (4)' }
                  ].map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setMargin(m.val)}
                      className={`flex-1 py-1.5 sm:py-2 px-1 text-xs rounded-xl font-bold border transition-all min-w-0 truncate text-center ${
                        margin === m.val
                          ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]'
                          : 'border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-[#EC4899]/50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real Preview + Verification + Download Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 min-w-0 w-full">
          <div className="p-4 sm:p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] shadow-sm flex flex-col items-center text-center space-y-4 min-w-0 w-full">
            <div className="w-full flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-3">
              <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                Live Generated QR
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] dark:text-[#4ADE80]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Scannable
              </span>
            </div>

            {/* QR Canvas Display Container (Requirement 2: Responsive, square preview, perfectly contained) */}
            <div className="w-full flex justify-center items-center py-1 min-w-0">
              <div className="relative p-3 sm:p-4 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs flex items-center justify-center w-full max-w-[240px] sm:max-w-[280px] aspect-square overflow-hidden">
                {/* Actual HTML5 Canvas */}
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-full h-auto aspect-square object-contain rounded-md"
                  style={{
                    imageRendering: 'pixelated',
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    aspectRatio: '1 / 1'
                  }}
                  aria-label="Generated QR Code Preview"
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                    <div className="w-6 h-6 border-2 border-[#EC4899] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Export Resolution Picker */}
            <div className="w-full text-left space-y-1.5 min-w-0">
              <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                Download Resolution
              </label>
              <div className="grid grid-cols-3 gap-1.5 min-w-0 w-full">
                {[
                  { px: 400, label: '400px', sub: 'Screen' },
                  { px: 800, label: '800px', sub: 'HD' },
                  { px: 1600, label: '1600px', sub: 'Print 300DPI' }
                ].map((res) => (
                  <button
                    key={res.px}
                    type="button"
                    onClick={() => setExportSize(res.px)}
                    className={`py-1.5 px-1 sm:px-2 rounded-lg text-center border transition-all min-w-0 ${
                      exportSize === res.px
                        ? 'border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] font-bold'
                        : 'border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] text-xs hover:border-[#EC4899]/50'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight truncate">{res.label}</div>
                    <div className="text-[10px] opacity-75 truncate">{res.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons (Requirement 3: Fits container, responsive layout, min-w-0) */}
            <div className="w-full space-y-2 min-w-0">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!currentPayload || !!validationError}
                className="w-full flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer min-w-0"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span className="truncate">Download PNG ({exportSize}×{exportSize})</span>
              </button>

              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 min-w-0 w-full">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  disabled={!currentPayload || !!validationError}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] text-xs font-semibold shadow-2xs hover:bg-[#FFFDF7] transition-all disabled:opacity-50 min-w-0"
                  title="Download scalable vector SVG for print, banners, or illustrator"
                >
                  <Layers className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
                  <span className="truncate">Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  disabled={!currentPayload || !!validationError}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#EC4899] text-[#18181B] dark:text-[#F4F4F5] text-xs font-semibold shadow-2xs hover:bg-[#FFFDF7] transition-all disabled:opacity-50 min-w-0"
                  title="Copy QR image directly to clipboard"
                >
                  {copiedImage ? <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">{copiedImage ? 'Copied Image!' : 'Copy Image'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 min-w-0 w-full">
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!currentPayload || !!validationError}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#71717A] hover:text-[#18181B] dark:hover:text-white text-xs font-medium transition-colors min-w-0"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Share QR</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={!currentPayload || !!validationError}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#71717A] hover:text-[#18181B] dark:hover:text-white text-xs font-medium transition-colors min-w-0"
                >
                  <Printer className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Print Sheet</span>
                </button>
              </div>
            </div>

            {/* Decoded Payload Inspector */}
            <div className="w-full text-left pt-2 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                  Embedded Payload
                </span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="text-[11px] text-[#EC4899] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4F4F5] dark:bg-[#121215] border border-[#E4E4E7] dark:border-[#27272A] font-mono text-[11px] text-[#18181B] dark:text-[#E4E4E7] break-all max-h-24 overflow-y-auto select-all">
                {currentPayload || 'No payload configured.'}
              </div>
              <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] pt-0.5">
                Verify this exact string before printing. To test, open your smartphone camera or any standard QR scanner app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
