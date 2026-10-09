import React, { useState, useMemo } from 'react';
import { Briefcase, Copy, Check, RotateCcw, Info, TrendingUp, ShieldCheck } from 'lucide-react';

interface PayLevelConfig {
  level: number;
  gradePay: string;
  defaultBasic: number;
  postExamples: string;
}

const PAY_LEVELS: PayLevelConfig[] = [
  { level: 1, gradePay: 'GP 1800', defaultBasic: 18000, postExamples: 'RRB Group D, SSC MTS, Office Attendant' },
  { level: 2, gradePay: 'GP 1900', defaultBasic: 19900, postExamples: 'SSC CHSL LDC, Junior Clerk, Accounts Clerk' },
  { level: 4, gradePay: 'GP 2400', defaultBasic: 25500, postExamples: 'Tax Assistant, Postal Assistant, Senior Clerk' },
  { level: 5, gradePay: 'GP 2800', defaultBasic: 29200, postExamples: 'Auditor, Accountant, Junior Translation Officer' },
  { level: 6, gradePay: 'GP 4200', defaultBasic: 35400, postExamples: 'Sub-Inspector (Delhi Police / CAPF), Junior Engineer' },
  { level: 7, gradePay: 'GP 4600', defaultBasic: 44900, postExamples: 'ASO in CSS/MEA, GST Inspector, Income Tax Inspector' },
  { level: 8, gradePay: 'GP 4800', defaultBasic: 47600, postExamples: 'Assistant Audit Officer (AAO), Assistant Accounts Officer' },
  { level: 10, gradePay: 'GP 5400', defaultBasic: 56100, postExamples: 'UPSC Civil Services (IAS / IPS / IFS), Assistant Commissioner' }
];

export const InHandSalaryEstimatorTool: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(7);
  const [cityTier, setCityTier] = useState<'X' | 'Y' | 'Z'>('X');
  const [daPercent, setDaPercent] = useState<number>(50);
  const [copied, setCopied] = useState<boolean>(false);

  const levelConfig = PAY_LEVELS.find((p) => p.level === selectedLevel) || PAY_LEVELS[5];
  const [basicPay, setBasicPay] = useState<number>(levelConfig.defaultBasic);

  const handleLevelChange = (lvl: number) => {
    setSelectedLevel(lvl);
    const cfg = PAY_LEVELS.find((p) => p.level === lvl);
    if (cfg) setBasicPay(cfg.defaultBasic);
  };

  const salaryBreakdown = useMemo(() => {
    const da = Math.round((basicPay * daPercent) / 100);

    // HRA Rates: X City = 30%, Y City = 20%, Z City = 10% (revised post 50% DA)
    const hraRate = cityTier === 'X' ? 0.3 : cityTier === 'Y' ? 0.2 : 0.1;
    const hra = Math.round(basicPay * hraRate);

    // Transport Allowance
    const baseTa = cityTier === 'X' ? (selectedLevel >= 9 ? 7200 : selectedLevel >= 3 ? 3600 : 1350) : (selectedLevel >= 9 ? 3600 : selectedLevel >= 3 ? 1800 : 900);
    const daOnTa = Math.round((baseTa * daPercent) / 100);
    const totalTa = baseTa + daOnTa;

    const grossSalary = basicPay + da + hra + totalTa;

    // Standard Deductions
    const nps = Math.round((basicPay + da) * 0.1); // 10% Employee contribution
    const cghs = selectedLevel >= 7 ? 650 : selectedLevel >= 4 ? 450 : 250;
    const cgegis = selectedLevel >= 10 ? 120 : selectedLevel >= 6 ? 60 : 30;
    const professionalTax = 200;

    const totalDeductions = nps + cghs + cgegis + professionalTax;
    const netInHand = Math.max(0, grossSalary - totalDeductions);

    return {
      basicPay,
      da,
      hra,
      totalTa,
      grossSalary,
      nps,
      cghs,
      cgegis,
      professionalTax,
      totalDeductions,
      netInHand,
      annualGross: grossSalary * 12,
      annualNet: netInHand * 12
    };
  }, [basicPay, daPercent, cityTier, selectedLevel]);

  const handleCopy = () => {
    const text = `Central Govt 7th CPC Salary Estimate (Level ${selectedLevel} - ${cityTier} Class City):
- Basic Pay: ₹${salaryBreakdown.basicPay.toLocaleString('en-IN')}
- DA (${daPercent}%): ₹${salaryBreakdown.da.toLocaleString('en-IN')}
- HRA: ₹${salaryBreakdown.hra.toLocaleString('en-IN')}
- TA: ₹${salaryBreakdown.totalTa.toLocaleString('en-IN')}
GROSS MONTHLY SALARY: ₹${salaryBreakdown.grossSalary.toLocaleString('en-IN')}
DEDUCTIONS (NPS + CGHS + CGEGIS): -₹${salaryBreakdown.totalDeductions.toLocaleString('en-IN')}
ESTIMATED NET IN-HAND SALARY: ₹${salaryBreakdown.netInHand.toLocaleString('en-IN')} / month
Estimated Annual Take-Home: ~₹${salaryBreakdown.annualNet.toLocaleString('en-IN')}
Calculated via RajToolBox.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    handleLevelChange(7);
    setCityTier('X');
    setDaPercent(50);
  };

  return (
    <div className="space-y-8">
      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#18181B] border border-[#FACC15]/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#854D0E] dark:text-[#FACC15] shrink-0 mt-0.5" />
        <div className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          <strong className="text-[#18181B] dark:text-[#F4F4F5]">Educational Salary Model:</strong> Calculations are based on standard 7th Central Pay Commission rules (Basic Pay + 50% DA + City-tier HRA + TA minus 10% NPS deduction). Actual salary slips vary by department, specific city post, income tax slabs, and allowances.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#EC4899]" />
              Pay Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Pay Level Selection */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              7th CPC Pay Matrix Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            >
              {PAY_LEVELS.map((p) => (
                <option key={p.level} value={p.level}>
                  Level {p.level} ({p.gradePay}) &middot; ₹{p.defaultBasic.toLocaleString('en-IN')} Basic
                </option>
              ))}
            </select>
            <span className="text-[11px] text-[#71717A] mt-1 block">
              Typical posts: {levelConfig.postExamples}
            </span>
          </div>

          {/* City Tier Selection */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Posting City Classification (HRA)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCityTier('X')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  cityTier === 'X'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A]'
                }`}
              >
                X Class (30%)
                <span className="text-[10px] block opacity-75">Delhi, Mumbai, etc.</span>
              </button>
              <button
                type="button"
                onClick={() => setCityTier('Y')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  cityTier === 'Y'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A]'
                }`}
              >
                Y Class (20%)
                <span className="text-[10px] block opacity-75">Tier-2 State Capitals</span>
              </button>
              <button
                type="button"
                onClick={() => setCityTier('Z')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  cityTier === 'Z'
                    ? 'bg-[#FCE7F3] dark:bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                    : 'border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-[#71717A]'
                }`}
              >
                Z Class (10%)
                <span className="text-[10px] block opacity-75">Rural & Small Towns</span>
              </button>
            </div>
          </div>

          {/* Dearness Allowance % */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#18181B] dark:text-[#F4F4F5]">Dearness Allowance (DA)</span>
              <span className="text-[#EC4899]">{daPercent}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="65"
              value={daPercent}
              onChange={(e) => setDaPercent(Number(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Estimated Monthly In-Hand Salary
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-1">
                  <span className="text-[#16A34A]">₹{salaryBreakdown.netInHand.toLocaleString('en-IN')}</span>{' '}
                  <span className="text-sm font-semibold text-[#71717A]">/ month</span>
                </div>
                <span className="text-xs text-[#71717A] mt-1 block">
                  Gross Pay: ₹{salaryBreakdown.grossSalary.toLocaleString('en-IN')} &middot; Deductions: ₹{salaryBreakdown.totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] shadow-xs transition-all self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Slip'}
              </button>
            </div>

            {/* Allowance Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                Monthly Earnings Breakdown
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">Basic Pay</span>
                  <div className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    ₹{salaryBreakdown.basicPay.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">DA ({daPercent}%)</span>
                  <div className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    ₹{salaryBreakdown.da.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">HRA ({cityTier} City)</span>
                  <div className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    ₹{salaryBreakdown.hra.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">TA + DA</span>
                  <div className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                    ₹{salaryBreakdown.totalTa.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div className="space-y-3 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                Monthly Deductions
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">NPS (10%)</span>
                  <div className="font-bold text-[#DC2626] mt-0.5">
                    -₹{salaryBreakdown.nps.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">CGHS Medical</span>
                  <div className="font-bold text-[#DC2626] mt-0.5">
                    -₹{salaryBreakdown.cghs.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">Insurance (CGEGIS)</span>
                  <div className="font-bold text-[#DC2626] mt-0.5">
                    -₹{salaryBreakdown.cgegis.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                  <span className="text-[10px] text-[#71717A] block">Prof. Tax</span>
                  <div className="font-bold text-[#DC2626] mt-0.5">
                    -₹{salaryBreakdown.professionalTax.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
