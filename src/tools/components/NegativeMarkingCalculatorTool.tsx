import React, { useState, useMemo } from 'react';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Copy,
  Check,
  TrendingDown,
  Percent,
  Award
} from 'lucide-react';

interface PresetScheme {
  id: string;
  name: string;
  totalQs: number;
  positiveMarks: number;
  negativePenalty: number;
}

const PRESETS: PresetScheme[] = [
  { id: 'ssc-cgl', name: 'SSC CGL / CHSL (+2.0, -0.50)', totalQs: 100, positiveMarks: 2.0, negativePenalty: 0.5 },
  { id: 'rrb-ntpc', name: 'RRB NTPC / Group D (+1.0, -0.333)', totalQs: 100, positiveMarks: 1.0, negativePenalty: 0.333 },
  { id: 'upsc-cse', name: 'UPSC CSE Prelims GS-1 (+2.0, -0.666)', totalQs: 100, positiveMarks: 2.0, negativePenalty: 0.666 },
  { id: 'banking', name: 'Banking IBPS / SBI (+1.0, -0.25)', totalQs: 100, positiveMarks: 1.0, negativePenalty: 0.25 },
  { id: 'jee-main', name: 'JEE Main (+4.0, -1.0)', totalQs: 75, positiveMarks: 4.0, negativePenalty: 1.0 },
  { id: 'neet-ug', name: 'NEET UG (+4.0, -1.0)', totalQs: 180, positiveMarks: 4.0, negativePenalty: 1.0 },
  { id: 'ctet', name: 'CTET / TET (+1.0, No Negative)', totalQs: 150, positiveMarks: 1.0, negativePenalty: 0.0 }
];

export const NegativeMarkingCalculatorTool: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('ssc-cgl');
  const [totalQuestions, setTotalQuestions] = useState<number>(100);
  const [attempted, setAttempted] = useState<number>(85);
  const [correct, setCorrect] = useState<number>(72);
  const [positiveMarks, setPositiveMarks] = useState<number>(2.0);
  const [negativePenalty, setNegativePenalty] = useState<number>(0.5);
  const [copied, setCopied] = useState<boolean>(false);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = PRESETS.find((x) => x.id === presetId);
    if (p) {
      setTotalQuestions(p.totalQs);
      setPositiveMarks(p.positiveMarks);
      setNegativePenalty(p.negativePenalty);
      // Sensible defaults relative to total
      const att = Math.round(p.totalQs * 0.85);
      setAttempted(att);
      setCorrect(Math.round(att * 0.85));
    }
  };

  const results = useMemo(() => {
    const validAttempted = Math.min(Math.max(0, attempted), totalQuestions);
    const validCorrect = Math.min(Math.max(0, correct), validAttempted);
    const incorrect = validAttempted - validCorrect;
    const unattempted = Math.max(0, totalQuestions - validAttempted);

    const grossPositive = validCorrect * positiveMarks;
    const negativeDeduction = incorrect * negativePenalty;
    const netScore = grossPositive - negativeDeduction;
    const maxPossible = totalQuestions * positiveMarks;

    const accuracyRate = validAttempted > 0 ? (validCorrect / validAttempted) * 100 : 0;
    const percentageScore = maxPossible > 0 ? (netScore / maxPossible) * 100 : 0;
    const penaltyImpactPercent = grossPositive > 0 ? (negativeDeduction / grossPositive) * 100 : 0;

    return {
      validAttempted,
      validCorrect,
      incorrect,
      unattempted,
      grossPositive: Number(grossPositive.toFixed(2)),
      negativeDeduction: Number(negativeDeduction.toFixed(2)),
      netScore: Number(netScore.toFixed(2)),
      maxPossible: Number(maxPossible.toFixed(2)),
      accuracyRate: Number(accuracyRate.toFixed(1)),
      percentageScore: Number(percentageScore.toFixed(2)),
      penaltyImpactPercent: Number(penaltyImpactPercent.toFixed(1))
    };
  }, [totalQuestions, attempted, correct, positiveMarks, negativePenalty]);

  const handleCopyReport = () => {
    const text = `Exam Score Report:
- Total Questions: ${totalQuestions}
- Attempted: ${results.validAttempted} (${results.validCorrect} Correct, ${results.incorrect} Incorrect, ${results.unattempted} Left)
- Gross Marks: +${results.grossPositive}
- Negative Penalty: -${results.negativeDeduction}
- Net Final Score: ${results.netScore} / ${results.maxPossible} (${results.percentageScore}%)
- Accuracy Rate: ${results.accuracyRate}%
Calculated on RajToolBox.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    handlePresetSelect('ssc-cgl');
  };

  return (
    <div className="space-y-8">
      {/* Preset Selector Bar */}
      <div className="bg-white dark:bg-[#18181B] p-5 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F59E0B]" />
            Official Examination Presets
          </span>
          <span className="text-[11px] text-[#71717A]">One-click marking scheme selection</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedPreset === p.id
                  ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                  : 'bg-[#FAFAFA] dark:bg-[#202026] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:border-[#CBD5E1]'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedPreset('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedPreset === 'custom'
                ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                : 'bg-[#FAFAFA] dark:bg-[#202026] border-[#E4E4E7] dark:border-[#27272A] text-[#71717A]'
            }`}
          >
            Custom Scheme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#EC4899]" />
              Attempts & Marking
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Total Questions
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Attempted
              </label>
              <input
                type="number"
                min="0"
                max={totalQuestions}
                value={attempted}
                onChange={(e) => setAttempted(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5 flex items-center justify-between">
              <span>Correct Answers</span>
              <span className="text-[11px] text-[#16A34A] font-semibold">
                +{positiveMarks} mark/correct
              </span>
            </label>
            <input
              type="number"
              min="0"
              max={attempted}
              value={correct}
              onChange={(e) => setCorrect(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          {/* Marking Rules */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A]">
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Marks for Correct (+)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.1"
                value={positiveMarks}
                onChange={(e) => setPositiveMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
                Penalty for Wrong (-)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={negativePenalty}
                onChange={(e) => setNegativePenalty(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
            {/* Primary Net Score Display */}
            <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Net Calculated Score
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
                  <span className="text-[#EC4899]">{results.netScore}</span>{' '}
                  <span className="text-sm font-semibold text-[#71717A]">
                    / {results.maxPossible} Marks
                  </span>
                </div>
                <span className="text-xs text-[#71717A] mt-1 block">
                  Overall Score: {results.percentageScore}% &middot; Accuracy: {results.accuracyRate}%
                </span>
              </div>

              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] shadow-xs transition-all self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Report'}
              </button>
            </div>

            {/* Score Decomposition */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] dark:bg-[#16A34A]/10 border border-[#16A34A]/20">
                <span className="text-[10px] uppercase font-bold text-[#16A34A] block">Correct (+{positiveMarks})</span>
                <div className="text-lg font-black text-[#16A34A] mt-0.5">
                  +{results.grossPositive}
                </div>
                <span className="text-[10px] text-[#71717A]">{results.validCorrect} Questions</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FEF2F2] dark:bg-[#DC2626]/10 border border-[#DC2626]/20">
                <span className="text-[10px] uppercase font-bold text-[#DC2626] block">Penalty (-{negativePenalty})</span>
                <div className="text-lg font-black text-[#DC2626] mt-0.5">
                  -{results.negativeDeduction}
                </div>
                <span className="text-[10px] text-[#71717A]">{results.incorrect} Incorrect</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Accuracy</span>
                <div className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                  {results.accuracyRate}%
                </div>
                <span className="text-[10px] text-[#71717A]">of attempts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Unattempted</span>
                <div className="text-lg font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                  {results.unattempted}
                </div>
                <span className="text-[10px] text-[#71717A]">0 penalty</span>
              </div>
            </div>

            {/* Negative Marking Impact Insight */}
            <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#DC2626]" />
                <span className="font-semibold text-[#18181B] dark:text-[#F4F4F5]">
                  Negative Marking Impact:
                </span>
                <span className="text-[#71717A]">
                  Lost {results.penaltyImpactPercent}% of your positive score to wrong answers.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
