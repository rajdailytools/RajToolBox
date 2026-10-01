import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

// UNIVERSAL UNIT CONVERTER
type UnitCategory = 'length' | 'weight' | 'temperature' | 'data' | 'speed' | 'area';

const UNITS: Record<UnitCategory, { name: string; units: Record<string, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }> }> = {
  length: {
    name: 'Length & Distance',
    units: {
      m: { label: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
      km: { label: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { label: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      mm: { label: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mi: { label: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      ft: { label: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      in: { label: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 }
    }
  },
  weight: {
    name: 'Weight & Mass',
    units: {
      kg: { label: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
      g: { label: 'Grams (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mg: { label: 'Milligrams (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      lb: { label: 'Pounds (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      oz: { label: 'Ounces (oz)', toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
      ton: { label: 'Metric Tons (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 }
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      c: { label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      f: { label: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      k: { label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    }
  },
  data: {
    name: 'Digital Data Storage',
    units: {
      b: { label: 'Bytes (B)', toBase: (v) => v, fromBase: (v) => v },
      kb: { label: 'Kilobytes (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mb: { label: 'Megabytes (MB)', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      gb: { label: 'Gigabytes (GB)', toBase: (v) => v * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024) },
      tb: { label: 'Terabytes (TB)', toBase: (v) => v * Math.pow(1024, 4), fromBase: (v) => v / Math.pow(1024, 4) }
    }
  },
  speed: {
    name: 'Speed & Velocity',
    units: {
      mps: { label: 'Meters / sec (m/s)', toBase: (v) => v, fromBase: (v) => v },
      kmh: { label: 'Kilometers / hour (km/h)', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { label: 'Miles / hour (mph)', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      knot: { label: 'Knots (kt)', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 }
    }
  },
  area: {
    name: 'Area',
    units: {
      sqm: { label: 'Square Meters (m²)', toBase: (v) => v, fromBase: (v) => v },
      sqkm: { label: 'Square Kilometers (km²)', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      sqft: { label: 'Square Feet (ft²)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      acre: { label: 'Acres', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      hectare: { label: 'Hectares (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 }
    }
  }
};

export const UniversalUnitConverterComponent: React.FC = () => {
  const { showToast } = useApp();
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('mi');

  const currentCatUnits = UNITS[category].units;

  // Ensure selected units exist in current category
  const validFrom = currentCatUnits[fromUnit] ? fromUnit : Object.keys(currentCatUnits)[0];
  const validTo = currentCatUnits[toUnit] ? toUnit : Object.keys(currentCatUnits)[1] || Object.keys(currentCatUnits)[0];

  const handleCategorySwitch = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(UNITS[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const calculateResult = () => {
    const fromDef = currentCatUnits[validFrom];
    const toDef = currentCatUnits[validTo];
    if (!fromDef || !toDef) return 0;
    const base = fromDef.toBase(inputValue);
    const result = toDef.fromBase(base);
    return Number(result.toFixed(6));
  };

  const result = calculateResult();

  const swapUnits = () => {
    const temp = validFrom;
    setFromUnit(validTo);
    setToUnit(temp);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(UNITS) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySwitch(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              category === cat
                ? 'bg-[#EC4899] text-white shadow-xs'
                : 'bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-[#EC4899]'
            }`}
          >
            {UNITS[cat].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Input */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A]">
          <label className="block text-xs font-bold text-[#71717A] mb-1">From Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="w-full text-xl font-bold text-[#18181B] dark:text-[#F4F4F5] bg-transparent focus:outline-none mb-3"
          />
          <select
            value={validFrom}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-2 text-xs font-semibold rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#FFFDF7] dark:bg-[#121215]"
          >
            {Object.entries(currentCatUnits).map(([key, def]) => (
              <option key={key} value={key}>
                {def.label}
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-3 rounded-full bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] hover:scale-110 transition-transform shadow-xs"
            aria-label="Swap units"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Output */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#854D0E] dark:text-[#FACC15]">Converted Result</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.toString());
                showToast(`Copied ${result}!`, 'success');
              }}
              className="text-xs text-[#EC4899] font-bold hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <div className="text-2xl font-bold text-[#EC4899] font-mono mb-3 truncate">
            {result}
          </div>
          <select
            value={validTo}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-2 text-xs font-semibold rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          >
            {Object.entries(currentCatUnits).map(([key, def]) => (
              <option key={key} value={key}>
                {def.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// NUMBER SYSTEM CONVERTER
export const NumberSystemComponent: React.FC = () => {
  const { showToast } = useApp();
  const [dec, setDec] = useState('255');

  const val = parseInt(dec, 10);
  const isValid = !isNaN(val);

  const bin = isValid ? (val >>> 0).toString(2) : '0';
  const hex = isValid ? (val >>> 0).toString(16).toUpperCase() : '0';
  const oct = isValid ? (val >>> 0).toString(8) : '0';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">
          Decimal (Base-10) Number
        </label>
        <input
          type="number"
          value={dec}
          onChange={(e) => setDec(e.target.value)}
          className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Binary (Base-2)</span>
          <span className="font-mono text-sm font-bold text-[#EC4899] block mt-1 break-all">{bin}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(bin);
              showToast('Binary copied!', 'success');
            }}
            className="mt-2 text-xs text-[#71717A] hover:text-[#EC4899] font-semibold flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>

        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Hexadecimal (Base-16)</span>
          <span className="font-mono text-sm font-bold text-[#EC4899] block mt-1">{hex}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(hex);
              showToast('Hex copied!', 'success');
            }}
            className="mt-2 text-xs text-[#71717A] hover:text-[#EC4899] font-semibold flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>

        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Octal (Base-8)</span>
          <span className="font-mono text-sm font-bold text-[#EC4899] block mt-1">{oct}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(oct);
              showToast('Octal copied!', 'success');
            }}
            className="mt-2 text-xs text-[#71717A] hover:text-[#EC4899] font-semibold flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>
      </div>
    </div>
  );
};

// ROMAN NUMERAL CONVERTER
export const RomanNumeralComponent: React.FC = () => {
  const { showToast } = useApp();
  const [num, setNum] = useState<number>(2026);

  const toRoman = (n: number) => {
    if (n < 1 || n > 3999) return 'Value must be between 1 and 3999';
    const romanMap: [number, string][] = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I']
    ];
    let result = '';
    for (const [val, char] of romanMap) {
      while (n >= val) {
        result += char;
        n -= val;
      }
    }
    return result;
  };

  const roman = toRoman(num);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">
          Enter Arabic Number (1 – 3,999)
        </label>
        <input
          type="number"
          min="1"
          max="3999"
          value={num}
          onChange={(e) => setNum(parseInt(e.target.value, 10) || 1)}
          className="w-full px-3 py-2 text-base font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Roman Numeral</span>
          <span className="text-2xl font-black font-mono text-[#EC4899]">{roman}</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(roman);
            showToast(`Copied ${roman}!`, 'success');
          }}
          className="px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

// NUMBER TO WORDS CONVERTER
export const NumberToWordsComponent: React.FC = () => {
  const { showToast } = useApp();
  const [num, setNum] = useState('4520');

  const convertToWords = (n: number): string => {
    if (n === 0) return 'Zero';
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const formatHundreds = (numPart: number): string => {
      let str = '';
      if (numPart >= 100) {
        str += a[Math.floor(numPart / 100)] + ' Hundred ';
        numPart %= 100;
      }
      if (numPart >= 20) {
        str += b[Math.floor(numPart / 10)] + ' ';
        numPart %= 10;
      }
      if (numPart > 0) {
        str += a[numPart] + ' ';
      }
      return str.trim();
    };

    let word = '';
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const remainder = n % 1000;

    if (millions) word += formatHundreds(millions) + ' Million ';
    if (thousands) word += formatHundreds(thousands) + ' Thousand ';
    if (remainder) word += formatHundreds(remainder);

    return word.trim();
  };

  const parsed = parseInt(num, 10);
  const words = !isNaN(parsed) ? convertToWords(parsed) : 'Please enter a valid number';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Enter Numeric Value</label>
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="w-full px-3 py-2 text-base font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">English Spelled Out</span>
          <span className="text-base font-bold text-[#EC4899]">{words}</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(words);
            showToast('Words copied!', 'success');
          }}
          className="px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold"
        >
          Copy
        </button>
      </div>
    </div>
  );
};
