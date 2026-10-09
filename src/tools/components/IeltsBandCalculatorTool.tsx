import React, { useState, useMemo } from 'react';
import { Award, BookOpen, Copy, Check, RotateCcw, Info } from 'lucide-react';

export const IeltsBandCalculatorTool: React.FC = () => {
  const [listening, setListening] = useState<number>(7.5);
  const [reading, setReading] = useState<number>(7.0);
  const [writing, setWriting] = useState<number>(6.5);
  const [speaking, setSpeaking] = useState<number>(7.0);
  const [copied, setCopied] = useState<boolean>(false);

  // Raw score test converter state
  const [rawListening, setRawListening] = useState<number>(32);
  const [rawReading, setRawReading] = useState<number>(30);
  const [readingType, setReadingType] = useState<'academic' | 'general'>('academic');

  // Official IELTS Rounding Algorithm
  const overallBand = useMemo(() => {
    const avg = (listening + reading + writing + speaking) / 4;
    const decimal = avg - Math.floor(avg);

    let rounded = Math.floor(avg);
    if (decimal < 0.25) {
      rounded = Math.floor(avg);
    } else if (decimal < 0.75) {
      rounded = Math.floor(avg) + 0.5;
    } else {
      rounded = Math.ceil(avg);
    }

    // CEFR mapping
    let cefr = 'B1 (Intermediate)';
    let toeflEquiv = '42 – 71';
    if (rounded >= 8.5) {
      cefr = 'C2 (Proficient)';
      toeflEquiv = '115 – 120';
    } else if (rounded >= 7.0) {
      cefr = 'C1 (Advanced)';
      toeflEquiv = '94 – 114';
    } else if (rounded >= 5.5) {
      cefr = 'B2 (Vantage)';
      toeflEquiv = '72 – 93';
    }

    return {
      averageExact: Number(avg.toFixed(3)),
      roundedBand: rounded,
      cefr,
      toeflEquiv
    };
  }, [listening, reading, writing, speaking]);

  // Convert raw 40 marks to Band
  const rawListeningBand = useMemo(() => {
    if (rawListening >= 39) return 9.0;
    if (rawListening >= 37) return 8.5;
    if (rawListening >= 35) return 8.0;
    if (rawListening >= 32) return 7.5;
    if (rawListening >= 30) return 7.0;
    if (rawListening >= 26) return 6.5;
    if (rawListening >= 23) return 6.0;
    if (rawListening >= 18) return 5.5;
    if (rawListening >= 16) return 5.0;
    return 4.5;
  }, [rawListening]);

  const rawReadingBand = useMemo(() => {
    if (readingType === 'academic') {
      if (rawReading >= 39) return 9.0;
      if (rawReading >= 37) return 8.5;
      if (rawReading >= 35) return 8.0;
      if (rawReading >= 33) return 7.5;
      if (rawReading >= 30) return 7.0;
      if (rawReading >= 27) return 6.5;
      if (rawReading >= 23) return 6.0;
      if (rawReading >= 19) return 5.5;
      if (rawReading >= 15) return 5.0;
      return 4.5;
    } else {
      // General Training Reading
      if (rawReading >= 40) return 9.0;
      if (rawReading >= 39) return 8.5;
      if (rawReading >= 37) return 8.0;
      if (rawReading >= 36) return 7.5;
      if (rawReading >= 34) return 7.0;
      if (rawReading >= 32) return 6.5;
      if (rawReading >= 30) return 6.0;
      if (rawReading >= 27) return 5.5;
      if (rawReading >= 23) return 5.0;
      return 4.5;
    }
  }, [rawReading, readingType]);

  const handleCopy = () => {
    const text = `IELTS Band Score Breakdown:
- Listening: ${listening}
- Reading: ${reading}
- Writing: ${writing}
- Speaking: ${speaking}
OVERALL BAND SCORE: ${overallBand.roundedBand} (Exact avg: ${overallBand.averageExact})
CEFR Level: ${overallBand.cefr} &middot; TOEFL Equivalent: ~${overallBand.toeflEquiv}
Calculated via RajToolBox.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setListening(7.5);
    setReading(7.0);
    setWriting(6.5);
    setSpeaking(7.0);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module Sliders */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#EC4899]" />
              Four Skills Band (0 to 9)
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Listening */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#18181B] dark:text-[#F4F4F5]">Listening Band</span>
              <span className="text-[#EC4899] text-sm">{listening.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={listening}
              onChange={(e) => setListening(Number(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
          </div>

          {/* Reading */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#18181B] dark:text-[#F4F4F5]">Reading Band</span>
              <span className="text-[#EC4899] text-sm">{reading.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={reading}
              onChange={(e) => setReading(Number(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
          </div>

          {/* Writing */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#18181B] dark:text-[#F4F4F5]">Writing Band</span>
              <span className="text-[#EC4899] text-sm">{writing.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={writing}
              onChange={(e) => setWriting(Number(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
          </div>

          {/* Speaking */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#18181B] dark:text-[#F4F4F5]">Speaking Band</span>
              <span className="text-[#EC4899] text-sm">{speaking.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={speaking}
              onChange={(e) => setSpeaking(Number(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
          </div>
        </div>

        {/* Overall Results & CEFR */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Official Overall Band Score
                </span>
                <div className="text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
                  <span className="text-[#EC4899]">{overallBand.roundedBand.toFixed(1)}</span>
                  <span className="text-sm font-semibold text-[#71717A] ml-2">
                    (Raw Avg: {overallBand.averageExact})
                  </span>
                </div>
                <span className="text-xs text-[#71717A] mt-1 block">
                  Official Rule: 0.25 &rarr; 0.5 &middot; 0.75 &rarr; Next Whole Band
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] shadow-xs transition-all self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Scores'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">CEFR Level</span>
                <div className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                  {overallBand.cefr}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">TOEFL iBT Equivalent</span>
                <div className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                  ~{overallBand.toeflEquiv} Marks
                </div>
              </div>
            </div>

            {/* Quick Raw Score Converter for Practice */}
            <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5] block">
                Practice Test Raw Score Converter (out of 40)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">
                    Raw Listening Correct: <strong>{rawListening}/40</strong> &rarr; Band {rawListeningBand}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={rawListening}
                    onChange={(e) => setRawListening(Number(e.target.value))}
                    className="w-full accent-[#EC4899]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-[#71717A]">
                      Raw Reading Correct: <strong>{rawReading}/40</strong> &rarr; Band {rawReadingBand}
                    </label>
                    <button
                      onClick={() => setReadingType((t) => (t === 'academic' ? 'general' : 'academic'))}
                      className="text-[10px] font-bold text-[#EC4899] underline"
                    >
                      {readingType === 'academic' ? 'Academic' : 'General'}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={rawReading}
                    onChange={(e) => setRawReading(Number(e.target.value))}
                    className="w-full accent-[#EC4899]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
