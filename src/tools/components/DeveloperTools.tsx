import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, AlertCircle, CheckCircle2, RefreshCw, Key } from 'lucide-react';

// JSON FORMATTER & VALIDATOR
export const JsonFormatterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [input, setInput] = useState('{"platform":"RajToolBox","toolsCount":40,"author":{"name":"Raj Singh Sengar","qualification":"B.Sc. Physics"},"privacy":"100% Client-Side","active":true}');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const formatJson = (indent = 2) => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indent));
      setErrorMsg(null);
      setIsValid(true);
      showToast('JSON beautified successfully!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsValid(false);
      showToast('Invalid JSON syntax', 'error');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setErrorMsg(null);
      setIsValid(true);
      showToast('JSON minified!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsValid(false);
      showToast('Invalid JSON syntax', 'error');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setErrorMsg(null);
      setIsValid(true);
      showToast('Valid JSON!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] dark:bg-[#14532D] px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Valid JSON
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#DC2626] bg-[#FEE2E2] dark:bg-[#7F1D1D] px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              Syntax Error
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3 py-1.5 rounded-lg bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
          >
            Format (2 Spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
          >
            4 Spaces
          </button>
          <button
            onClick={minifyJson}
            className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
          >
            Minify
          </button>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          try {
            JSON.parse(e.target.value);
            setErrorMsg(null);
            setIsValid(true);
          } catch (err: any) {
            setErrorMsg(err.message);
            setIsValid(false);
          }
        }}
        rows={10}
        className="w-full p-4 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] text-[#18181B] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899]"
      />

      {errorMsg && (
        <div className="p-3 rounded-xl bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 border border-[#F87171] text-[#991B1B] dark:text-[#FCA5A5] text-xs font-mono">
          <strong>Syntax Error:</strong> {errorMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#71717A]">
          Characters: {input.length} | Lines: {input.split('\n').length}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(input);
            showToast('JSON copied to clipboard!', 'success');
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18181B] text-white dark:bg-white dark:text-[#18181B] text-xs font-bold"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy JSON</span>
        </button>
      </div>
    </div>
  );
};

// BASE64 ENCODER & DECODER
export const Base64Component: React.FC = () => {
  const { showToast } = useApp();
  const [input, setInput] = useState('RajToolBox - Powerful Online Tools');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = (text: string, currentMode: 'encode' | 'decode') => {
    try {
      if (currentMode === 'encode') {
        const bytes = new TextEncoder().encode(text);
        const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
        setOutput(btoa(binString));
      } else {
        const binString = atob(text.trim());
        const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    process(input, newMode);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleModeChange('encode')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'encode' ? 'bg-[#EC4899] text-white' : 'border border-[#E4E4E7] dark:border-[#27272A]'
          }`}
        >
          Encode to Base64
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'decode' ? 'bg-[#EC4899] text-white' : 'border border-[#E4E4E7] dark:border-[#27272A]'
          }`}
        >
          Decode from Base64
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">
          {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input String'}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            process(e.target.value, mode);
          }}
          rows={4}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-[#71717A]">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text Result'}
          </label>
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              showToast('Copied result!', 'success');
            }}
            className="text-xs text-[#EC4899] font-bold hover:underline flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>
        <textarea
          readOnly
          value={output || (mode === 'encode' ? btoa(input) : '')}
          rows={4}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215] text-[#EC4899]"
        />
      </div>
    </div>
  );
};

// URL ENCODER & DECODER
export const UrlCodecComponent: React.FC = () => {
  const { showToast } = useApp();
  const [input, setInput] = useState('https://rajtoolbox.com/search?q=online tools & utilities 100%');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input));
      showToast('URL Encoded!', 'success');
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
      showToast('URL Decoded!', 'success');
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Source URL or Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={encode}
          className="px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          Encode URL (Percent-encoding)
        </button>
        <button
          onClick={decode}
          className="px-4 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          Decode URL
        </button>
      </div>

      {output && (
        <div className="p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#71717A]">Result</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                showToast('Result copied!', 'success');
              }}
              className="text-xs font-bold text-[#EC4899] hover:underline"
            >
              Copy
            </button>
          </div>
          <p className="font-mono text-xs break-all text-[#18181B] dark:text-[#F4F4F5]">{output}</p>
        </div>
      )}
    </div>
  );
};

// JWT DECODER
export const JwtDecoderComponent: React.FC = () => {
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJhaiBTaW5naCBTZW5nYXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.4phgXGvQ'
  );
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [isExpired, setIsExpired] = useState<boolean | null>(null);

  const decodeJwt = (jwtStr: string) => {
    const parts = jwtStr.trim().split('.');
    if (parts.length >= 2) {
      try {
        const decodedHeader = JSON.parse(atob(parts[0]));
        const decodedPayload = JSON.parse(atob(parts[1]));
        setHeader(JSON.stringify(decodedHeader, null, 2));
        setPayload(JSON.stringify(decodedPayload, null, 2));

        if (decodedPayload.exp) {
          const expTime = decodedPayload.exp * 1000;
          setIsExpired(Date.now() > expTime);
        } else {
          setIsExpired(null);
        }
      } catch {
        setHeader('Invalid Header JSON');
        setPayload('Invalid Payload JSON');
      }
    }
  };

  React.useEffect(() => {
    decodeJwt(token);
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Paste JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] break-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[#DC2626]/30 bg-[#FEF2F2] dark:bg-[#201012]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626] block mb-2">
            Decoded Header (Algorithm & Token Type)
          </span>
          <pre className="font-mono text-xs text-[#991B1B] dark:text-[#FCA5A5] whitespace-pre-wrap">
            {header}
          </pre>
        </div>

        <div className="p-4 rounded-xl border border-[#9333EA]/30 bg-[#FAF5FF] dark:bg-[#1B1124]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
              Decoded Payload (Claims & Data)
            </span>
            {isExpired !== null && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isExpired ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#DCFCE7] text-[#16A34A]'
                }`}
              >
                {isExpired ? 'Token Expired' : 'Active Token'}
              </span>
            )}
          </div>
          <pre className="font-mono text-xs text-[#7E22CE] dark:text-[#E9D5FF] whitespace-pre-wrap">
            {payload}
          </pre>
        </div>
      </div>
    </div>
  );
};

// UUID GENERATOR
export const UuidGeneratorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        list.push(crypto.randomUUID());
      } else {
        list.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }));
      }
    }
    setUuids(list);
    showToast(`Generated ${count} UUID v4!`, 'success');
  };

  React.useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-[#71717A]">Quantity:</label>
        <select
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10))}
          className="px-3 py-1.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold"
        >
          <option value={1}>1 UUID</option>
          <option value={5}>5 UUIDs</option>
          <option value={10}>10 UUIDs</option>
          <option value={25}>25 UUIDs</option>
        </select>
        <button
          onClick={generate}
          className="px-4 py-1.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          Generate New
        </button>
      </div>

      <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] space-y-2">
        {uuids.map((id, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#202026] font-mono text-xs"
          >
            <span className="text-[#18181B] dark:text-[#F4F4F5] break-all">{id}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(id);
                showToast('Copied UUID!', 'success');
              }}
              className="text-[#EC4899] hover:text-[#DB2777] p-1"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// HASH GENERATOR
export const HashGeneratorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [text, setText] = useState('rajtoolbox2026');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const computeHashes = async (str: string) => {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const results: Record<string, string> = {};

    try {
      const sha256Buf = await crypto.subtle.digest('SHA-256', data);
      results['SHA-256'] = Array.from(new Uint8Array(sha256Buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const sha512Buf = await crypto.subtle.digest('SHA-512', data);
      results['SHA-512'] = Array.from(new Uint8Array(sha512Buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const sha1Buf = await crypto.subtle.digest('SHA-1', data);
      results['SHA-1'] = Array.from(new Uint8Array(sha1Buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      console.error(e);
    }
    setHashes(results);
  };

  React.useEffect(() => {
    computeHashes(text);
  }, [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Input Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="space-y-3">
        {Object.entries(hashes).map(([algo, hashVal]) => (
          <div
            key={algo}
            className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EC4899]">{algo}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(hashVal);
                  showToast(`Copied ${algo} hash!`, 'success');
                }}
                className="text-xs text-[#EC4899] font-bold hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <p className="font-mono text-xs text-[#18181B] dark:text-[#F4F4F5] break-all bg-[#FAFAFA] dark:bg-[#202026] p-2 rounded-lg">
              {hashVal}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// REGEX TESTER
export const RegexTesterComponent: React.FC = () => {
  const [pattern, setPattern] = useState('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact our team at rajtoolbox@gmail.com or support@rajtoolbox.com for help.');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const reg = new RegExp(pattern, flags);
      const res = Array.from(text.matchAll(reg), (m) => m[0]);
      setMatches(res);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-[#71717A] mb-1">Regular Expression Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Flags (e.g. g, i, m)</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Test Text String</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      {error ? (
        <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-mono">
          Regex Error: {error}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-xs font-bold text-[#16A34A] block mb-2">
            Matches Found ({matches.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] dark:bg-[#14532D] text-[#166534] dark:text-[#BBF7D0] font-mono text-xs font-bold"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// COLOR CONVERTER
export const ColorConverterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [hex, setHex] = useState('#EC4899');

  const hexToRgb = (h: string) => {
    const clean = h.replace('#', '');
    if (clean.length !== 6) return { r: 236, g: 72, b: 153 };
    return {
      r: parseInt(clean.substring(0, 2), 16) || 0,
      g: parseInt(clean.substring(2, 4), 16) || 0,
      b: parseInt(clean.substring(4, 6), 16) || 0
    };
  };

  const rgb = hexToRgb(hex);

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="color"
          value={hex.startsWith('#') && hex.length === 7 ? hex : '#EC4899'}
          onChange={(e) => setHex(e.target.value.toUpperCase())}
          className="w-20 h-20 rounded-2xl cursor-pointer border-2 border-[#E4E4E7] dark:border-[#27272A] p-1"
        />
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-[#71717A] mb-1">Enter HEX Code</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 font-mono text-base font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">RGB</span>
          <span className="font-mono text-xs font-bold text-[#EC4899] block mt-1">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
              showToast('RGB copied!', 'success');
            }}
            className="mt-2 text-[11px] text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 font-semibold"
          >
            <Copy className="w-3 h-3" /> Copy CSS
          </button>
        </div>

        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">HSL</span>
          <span className="font-mono text-xs font-bold text-[#EC4899] block mt-1">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
              showToast('HSL copied!', 'success');
            }}
            className="mt-2 text-[11px] text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 font-semibold"
          >
            <Copy className="w-3 h-3" /> Copy CSS
          </button>
        </div>

        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">HEX</span>
          <span className="font-mono text-xs font-bold text-[#EC4899] block mt-1">{hex}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(hex);
              showToast('HEX copied!', 'success');
            }}
            className="mt-2 text-[11px] text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 font-semibold"
          >
            <Copy className="w-3 h-3" /> Copy HEX
          </button>
        </div>
      </div>
    </div>
  );
};
