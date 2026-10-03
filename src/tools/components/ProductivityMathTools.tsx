import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Copy, Download, Lock, Unlock, Shuffle, CheckCircle2 } from 'lucide-react';

// CSV <-> JSON CONVERTER
export const CsvJsonComponent: React.FC = () => {
  const { showToast } = useApp();
  const [csvText, setCsvText] = useState('id,name,role\n1,Raj Singh Sengar,Author\n2,Alex Miller,Designer');
  const [jsonText, setJsonText] = useState('');

  const csvToJson = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');
      const headers = lines[0].split(',').map((h) => h.trim());
      const result = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      });
      setJsonText(JSON.stringify(result, null, 2));
      showToast('CSV converted to JSON!', 'success');
    } catch (e: any) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const jsonToCsv = () => {
    try {
      const parsed = JSON.parse(jsonText || '[]');
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON must be an array of objects.');
      }
      const headers = Object.keys(parsed[0]);
      const csvRows = [headers.join(',')];
      parsed.forEach((item) => {
        csvRows.push(headers.map((h) => JSON.stringify(item[h] ?? '')).join(','));
      });
      setCsvText(csvRows.join('\n'));
      showToast('JSON converted to CSV!', 'success');
    } catch (e: any) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">CSV Content</label>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={7}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
        <button
          onClick={csvToJson}
          className="mt-2 w-full py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
        >
          Convert CSV to JSON &rarr;
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">JSON Array</label>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={7}
          className="w-full p-3 font-mono text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
        <button
          onClick={jsonToCsv}
          className="mt-2 w-full py-2 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] text-xs font-bold hover:border-[#EC4899]"
        >
          &larr; Convert JSON to CSV
        </button>
      </div>
    </div>
  );
};

// POMODORO TIMER
export const PomodoroComponent: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchMode = (m: 'focus' | 'short' | 'long') => {
    setMode(m);
    setTimeLeft(durations[m]);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <div className="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-center max-w-md mx-auto">
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => switchMode('focus')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'focus' ? 'bg-[#EC4899] text-white' : 'border border-[#E4E4E7] dark:border-[#27272A]'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('short')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'short' ? 'bg-[#EC4899] text-white' : 'border border-[#E4E4E7] dark:border-[#27272A]'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('long')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'long' ? 'bg-[#EC4899] text-white' : 'border border-[#E4E4E7] dark:border-[#27272A]'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      <div className="text-6xl font-black font-mono text-[#18181B] dark:text-[#F4F4F5] my-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="h-2 w-full bg-[#F4F4F5] dark:bg-[#27272A] rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[#EC4899] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(durations[mode]);
          }}
          className="p-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899]"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4 text-[#71717A]" />
        </button>
      </div>
    </div>
  );
};

// STOPWATCH & LAP TIMER
export const StopwatchComponent: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([time, ...laps]);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-center max-w-md mx-auto">
      <div className="text-xs uppercase font-extrabold tracking-widest text-[#71717A] dark:text-[#A1A1AA] mb-2">
        Precision Stopwatch
      </div>

      <div className="text-6xl font-black font-mono tracking-tight text-[#18181B] dark:text-[#F4F4F5] my-6">
        {formatTime(time)}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={handleStartStop}
          className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-colors ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#EC4899] hover:bg-[#DB2777]'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="px-5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Lap
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-xs transition-colors"
          aria-label="Reset stopwatch"
        >
          <RotateCcw className="w-4 h-4 text-[#71717A]" />
        </button>
      </div>

      {laps.length > 0 && (
        <div className="border-t border-[#E4E4E7] dark:border-[#27272A] pt-4 text-left">
          <div className="text-xs font-bold text-[#71717A] mb-2 uppercase tracking-wider">
            Recorded Laps ({laps.length})
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {laps.map((lapTime, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-[#F4F4F5] dark:bg-[#202026] text-xs font-mono"
              >
                <span className="font-semibold text-[#71717A]">Lap {laps.length - idx}</span>
                <span className="font-bold text-[#EC4899]">{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// PASSWORD GENERATOR
export const PasswordGeneratorComponent: React.FC = () => {
  const { showToast } = useApp();
  const [length, setLength] = useState(18);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let chars = '';
    if (incUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (incNumbers) chars += '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      showToast('Select at least one character type!', 'error');
      return;
    }

    const randomVals = new Uint32Array(length);
    window.crypto.getRandomValues(randomVals);
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[randomVals[i] % chars.length];
    }
    setPassword(pwd);
  };

  useEffect(() => {
    generate();
  }, [length, incUpper, incLower, incNumbers, incSymbols]);

  const entropy = Math.round(length * Math.log2((incUpper ? 26 : 0) + (incLower ? 26 : 0) + (incNumbers ? 10 : 0) + (incSymbols ? 28 : 0) || 1));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 flex items-center justify-between">
        <span className="font-mono text-base font-bold text-[#EC4899] break-all">{password}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(password);
            showToast('Password copied!', 'success');
          }}
          className="ml-3 p-2 rounded-xl bg-[#EC4899] text-white hover:bg-[#DB2777] shrink-0"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-[#71717A] mb-1">
          <span>Length: {length} characters</span>
          <span className="text-[#16A34A] font-mono">Entropy: {entropy} bits (Very Strong)</span>
        </div>
        <input
          type="range"
          min="8"
          max="48"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value, 10))}
          className="w-full accent-[#EC4899]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] cursor-pointer">
          <input type="checkbox" checked={incUpper} onChange={(e) => setIncUpper(e.target.checked)} className="accent-[#EC4899]" />
          <span>Uppercase (A-Z)</span>
        </label>
        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] cursor-pointer">
          <input type="checkbox" checked={incLower} onChange={(e) => setIncLower(e.target.checked)} className="accent-[#EC4899]" />
          <span>Lowercase (a-z)</span>
        </label>
        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] cursor-pointer">
          <input type="checkbox" checked={incNumbers} onChange={(e) => setIncNumbers(e.target.checked)} className="accent-[#EC4899]" />
          <span>Numbers (0-9)</span>
        </label>
        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] cursor-pointer">
          <input type="checkbox" checked={incSymbols} onChange={(e) => setIncSymbols(e.target.checked)} className="accent-[#EC4899]" />
          <span>Symbols (!@#$)</span>
        </label>
      </div>

      <button
        onClick={generate}
        className="w-full py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold shadow-xs hover:bg-[#DB2777]"
      >
        Generate New Password
      </button>
    </div>
  );
};

// RANDOM CHOICE PICKER
export const RandomPickerComponent: React.FC = () => {
  const [options, setOptions] = useState("Pizza\nSushi\nTacos\nBurgers\nSalad");
  const [winner, setWinner] = useState<string | null>(null);

  const pick = () => {
    const list = options.split('\n').map((o) => o.trim()).filter((o) => o.length > 0);
    if (list.length === 0) return;
    const idx = Math.floor(Math.random() * list.length);
    setWinner(list[idx]);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Enter Options (one per line)</label>
        <textarea
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          rows={5}
          className="w-full p-3 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <button
        onClick={pick}
        className="w-full py-3 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
      >
        Pick a Choice Randomly!
      </button>

      {winner && (
        <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border-2 border-[#FACC15] text-center animate-in zoom-in-95">
          <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
            Selected Winner
          </span>
          <div className="text-2xl font-black text-[#EC4899] mt-1">{winner}</div>
        </div>
      )}
    </div>
  );
};

// COLOR PALETTE GENERATOR
export const ColorPaletteComponent: React.FC = () => {
  const { showToast } = useApp();
  const [palette, setPalette] = useState([
    { hex: '#EC4899', locked: false },
    { hex: '#FACC15', locked: false },
    { hex: '#FCE7F3', locked: false },
    { hex: '#18181B', locked: false },
    { hex: '#3B82F6', locked: false }
  ]);

  const generateRandomHex = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
      .toUpperCase()}`;

  const roll = () => {
    setPalette((prev) =>
      prev.map((c) => (c.locked ? c : { ...c, hex: generateRandomHex() }))
    );
  };

  const toggleLock = (idx: number) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, locked: !c.locked } : c))
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {palette.map((item, idx) => (
          <div
            key={idx}
            className="h-32 rounded-2xl p-3 flex flex-col justify-between shadow-xs transition-transform"
            style={{ backgroundColor: item.hex }}
          >
            <div className="flex justify-end">
              <button
                onClick={() => toggleLock(idx)}
                className="p-1.5 rounded-lg bg-black/20 text-white backdrop-blur-xs hover:bg-black/40"
              >
                {item.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.hex);
                showToast(`Copied ${item.hex}!`, 'success');
              }}
              className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 text-white backdrop-blur-xs text-center hover:bg-black/60"
            >
              {item.hex}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={roll}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EC4899] text-white font-bold text-xs shadow-xs hover:bg-[#DB2777]"
        >
          <Shuffle className="w-4 h-4" />
          <span>Generate New Palette</span>
        </button>
      </div>
    </div>
  );
};

// DAYS BETWEEN DATES
export const DaysBetweenDatesComponent: React.FC = () => {
  const [d1, setD1] = useState('2026-01-01');
  const [d2, setD2] = useState('2026-12-31');

  const date1 = new Date(d1);
  const date2 = new Date(d2);

  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);

  // Business days calculation
  let businessDays = 0;
  const cur = new Date(Math.min(date1.getTime(), date2.getTime()));
  const end = new Date(Math.max(date1.getTime(), date2.getTime()));
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) businessDays++;
    cur.setDate(cur.getDate() + 1);
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Start Date</label>
          <input
            type="date"
            value={d1}
            onChange={(e) => setD1(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">End Date</label>
          <input
            type="date"
            value={d2}
            onChange={(e) => setD2(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
        <span className="text-[10px] uppercase font-bold text-[#71717A] block">Total Calendar Days</span>
        <div className="text-4xl font-black text-[#EC4899] my-2">{diffDays} Days</div>
        <div className="flex justify-center gap-6 text-xs text-[#71717A] mt-3">
          <span>~{diffWeeks} Weeks</span>
          <span>{businessDays} Business Days</span>
        </div>
      </div>
    </div>
  );
};

// AGE CALCULATOR
export const AgeCalculatorComponent: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-03-15');

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays };
  };

  const age = calculateAge();

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">Your Date of Birth</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
        <span className="text-[10px] uppercase font-bold text-[#71717A] block">Chronological Age</span>
        <div className="text-2xl font-black text-[#EC4899] my-2">
          {age.years} Years, {age.months} Months, {age.days} Days
        </div>
        <p className="text-xs text-[#71717A]">
          Total days lived so far: <strong className="text-[#18181B] dark:text-[#F4F4F5]">{age.totalDays.toLocaleString()}</strong>
        </p>
      </div>
    </div>
  );
};

// PERCENTAGE CALCULATOR
export const PercentageCalculatorComponent: React.FC = () => {
  const [mode, setMode] = useState<1 | 2 | 3>(3);
  const [x, setX] = useState<number>(500);
  const [y, setY] = useState<number>(600);

  let result = '';
  if (mode === 1) {
    // What is X% of Y?
    result = `${((x / 100) * y).toFixed(2)}`;
  } else if (mode === 2) {
    // X is what % of Y?
    result = `${(((x || 0) / (y || 1)) * 100).toFixed(2)}%`;
  } else {
    // Percentage change from X to Y
    const diff = y - x;
    const pct = ((diff / (x || 1)) * 100).toFixed(2);
    result = `${diff >= 0 ? '+' : ''}${pct}% (${diff >= 0 ? 'Increase' : 'Decrease'})`;
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div className="flex justify-center gap-1.5 p-1 rounded-xl bg-[#F4F4F5] dark:bg-[#202026]">
        <button
          onClick={() => setMode(3)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 3 ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs' : 'text-[#71717A]'
          }`}
        >
          Increase / Decrease
        </button>
        <button
          onClick={() => setMode(1)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 1 ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs' : 'text-[#71717A]'
          }`}
        >
          X% of Y
        </button>
        <button
          onClick={() => setMode(2)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 2 ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs' : 'text-[#71717A]'
          }`}
        >
          X is what % of Y
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">
            {mode === 1 ? 'Percentage (X%)' : mode === 3 ? 'Original Value (A)' : 'Value X'}
          </label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">
            {mode === 1 ? 'Of Value (Y)' : mode === 3 ? 'New Value (B)' : 'Total (Y)'}
          </label>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
        <span className="text-[10px] uppercase font-bold text-[#71717A] block">Calculated Result</span>
        <div className="text-3xl font-black text-[#EC4899] my-2">{result}</div>
      </div>
    </div>
  );
};

// RATIO & PROPORTION CALCULATOR
export const RatioCalculatorComponent: React.FC = () => {
  const [a, setA] = useState<number>(16);
  const [b, setB] = useState<number>(9);
  const [c, setC] = useState<number>(1280);

  // A / B = C / D => D = (B * C) / A
  const d = a !== 0 ? ((b * c) / a).toFixed(2) : 'Undefined';

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="text-center text-xs font-bold text-[#71717A] mb-2">
        Solve Proportion: A : B = C : X
      </div>
      <div className="grid grid-cols-4 gap-2 items-center text-center font-mono">
        <div>
          <label className="block text-[10px] font-bold text-[#71717A] mb-1">A</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value) || 1)}
            className="w-full p-2 text-center text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#71717A] mb-1">B</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value) || 1)}
            className="w-full p-2 text-center text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#71717A] mb-1">C</label>
          <input
            type="number"
            value={c}
            onChange={(e) => setC(parseFloat(e.target.value) || 1)}
            className="w-full p-2 text-center text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div className="p-2 bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 rounded-xl">
          <label className="block text-[10px] font-bold text-[#854D0E] dark:text-[#FACC15] mb-1">X</label>
          <span className="text-sm font-bold text-[#EC4899] block">{d}</span>
        </div>
      </div>
    </div>
  );
};

// AVERAGE (MEAN, MEDIAN, MODE, RANGE) CALCULATOR
export const AverageCalculatorComponent: React.FC = () => {
  const [dataStr, setDataStr] = useState('85, 92, 78, 92, 88, 95');

  const nums = dataStr
    .split(/[,\s]+/)
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v));

  const count = nums.length;
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  const mean = count > 0 ? (sum / count).toFixed(2) : '0';

  const sorted = [...nums].sort((a, b) => a - b);
  const median =
    count === 0
      ? '0'
      : count % 2 === 1
      ? sorted[Math.floor(count / 2)]
      : ((sorted[count / 2 - 1] + sorted[count / 2]) / 2).toFixed(2);

  const min = count > 0 ? sorted[0] : 0;
  const max = count > 0 ? sorted[count - 1] : 0;
  const range = max - min;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block text-xs font-bold text-[#71717A] mb-1">
          Numbers (separated by commas or spaces)
        </label>
        <input
          type="text"
          value={dataStr}
          onChange={(e) => setDataStr(e.target.value)}
          className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Mean (Avg)</span>
          <span className="text-lg font-bold text-[#EC4899]">{mean}</span>
        </div>
        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Median</span>
          <span className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">{median}</span>
        </div>
        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Sum</span>
          <span className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">{sum}</span>
        </div>
        <div className="p-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <span className="text-[10px] uppercase font-bold text-[#71717A] block">Count</span>
          <span className="text-lg font-bold text-[#18181B] dark:text-[#F4F4F5]">{count}</span>
        </div>
      </div>
    </div>
  );
};

// TALLY COUNTER
export const TallyCounterComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [step, setStep] = useState<number>(1);
  const [target, setTarget] = useState<number>(100);

  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => Math.max(0, c - step));
  const reset = () => setCount(0);

  const progress = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      {/* Target Progress */}
      <div className="bg-[#FFFDF7] dark:bg-[#121215] p-3 rounded-2xl border border-[#FACC15]/40 text-xs text-[#71717A] dark:text-[#A1A1AA]">
        <div className="flex justify-between font-bold mb-1">
          <span>Goal Progress</span>
          <span className="text-[#EC4899] font-mono">{progress}% of {target}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#E4E4E7] dark:bg-[#27272A] overflow-hidden">
          <div
            className="h-full bg-[#EC4899] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Big Interactive Counter Card */}
      <button
        onClick={increment}
        type="button"
        className="w-full py-12 px-6 rounded-3xl bg-white dark:bg-[#18181B] border-2 border-[#EC4899] shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer select-none group"
      >
        <div className="text-xs uppercase font-extrabold tracking-widest text-[#71717A] dark:text-[#A1A1AA] mb-2 group-hover:text-[#EC4899] transition-colors">
          Tap anywhere to count (+{step})
        </div>
        <div className="text-7xl font-black font-mono tracking-tight text-[#18181B] dark:text-[#F4F4F5] group-hover:scale-105 transition-transform">
          {count.toLocaleString()}
        </div>
      </button>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={decrement}
          type="button"
          className="py-3 px-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#EC4899] text-sm font-bold bg-white dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] transition-colors"
        >
          -{step}
        </button>
        <button
          onClick={reset}
          type="button"
          className="py-3 px-4 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] hover:border-red-500 hover:text-red-500 text-sm font-bold bg-white dark:bg-[#18181B] text-[#71717A] transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + step * 5)}
          type="button"
          className="py-3 px-4 rounded-xl border border-[#EC4899] bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899] text-sm font-bold hover:bg-[#EC4899] hover:text-white transition-colors"
        >
          +{step * 5}
        </button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-3 text-left">
        <div>
          <label className="block text-[11px] font-bold text-[#71717A] mb-1">Step Size</label>
          <select
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          >
            <option value={1}>1 at a time</option>
            <option value={2}>2 at a time</option>
            <option value={5}>5 at a time</option>
            <option value={10}>10 at a time</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#71717A] mb-1">Target Goal</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>
    </div>
  );
};

// LOAN EMI CALCULATOR
export const LoanEmiCalculatorComponent: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    monthlyRate > 0 && totalMonths > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / (totalMonths || 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;
  const interestPercentage = Math.round((totalInterest / (totalPayment || 1)) * 100);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Loan Amount ($)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Interest Rate (%/yr)</label>
          <input
            type="number"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#71717A] mb-1">Tenure (Years)</label>
          <input
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
          />
        </div>
      </div>

      {/* Main Result Card */}
      <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
        <span className="text-[11px] uppercase font-bold text-[#71717A] tracking-wider block">
          Monthly EMI
        </span>
        <div className="text-4xl font-black text-[#EC4899] my-2 font-mono">
          ${Math.round(emi).toLocaleString()}{' '}
          <span className="text-xs font-normal text-[#71717A]">
            ({emi.toFixed(2)}/mo)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A] text-left">
          <div>
            <span className="text-[11px] font-bold text-[#71717A] block">Total Interest</span>
            <span className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
              ${Math.round(totalInterest).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#71717A] block">Total Payable</span>
            <span className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
              ${Math.round(totalPayment).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Proportion Bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-[#71717A] mb-1.5">
          <span>Principal: {100 - interestPercentage}%</span>
          <span>Interest: {interestPercentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#3B82F6] overflow-hidden flex">
          <div
            className="h-full bg-[#EC4899]"
            style={{ width: `${interestPercentage}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#71717A] mt-2 justify-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Principal Amount
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Total Interest
          </span>
        </div>
      </div>
    </div>
  );
};

// TIP & DISCOUNT CALCULATOR
export const TipDiscountCalculatorComponent: React.FC = () => {
  const [tab, setTab] = useState<'tip' | 'discount'>('tip');

  // Tip State
  const [bill, setBill] = useState<number>(75);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [people, setPeople] = useState<number>(2);

  // Discount State
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(8.5);

  // Tip Calculations
  const tipAmount = (bill * tipPercent) / 100;
  const billTotal = bill + tipAmount;
  const perPersonTotal = billTotal / (people || 1);
  const perPersonTip = tipAmount / (people || 1);

  // Discount Calculations
  const discountAmount = (originalPrice * discountPercent) / 100;
  const discountedPrice = originalPrice - discountAmount;
  const taxAmount = (discountedPrice * salesTaxPercent) / 100;
  const finalPrice = discountedPrice + taxAmount;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Tabs */}
      <div className="flex rounded-xl bg-[#F4F4F5] dark:bg-[#202026] p-1">
        <button
          onClick={() => setTab('tip')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            tab === 'tip'
              ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs'
              : 'text-[#71717A]'
          }`}
        >
          Tip & Bill Splitter
        </button>
        <button
          onClick={() => setTab('discount')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            tab === 'discount'
              ? 'bg-white dark:bg-[#18181B] text-[#EC4899] shadow-xs'
              : 'text-[#71717A]'
          }`}
        >
          Shopping Discount & Tax
        </button>
      </div>

      {tab === 'tip' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Bill Total ($)</label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Tip (%)</label>
              <input
                type="number"
                value={tipPercent}
                onChange={(e) => setTipPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Split (# People)</label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
            <span className="text-[11px] uppercase font-bold text-[#71717A] tracking-wider block">
              Total Per Person
            </span>
            <div className="text-4xl font-black text-[#EC4899] my-2 font-mono">
              ${perPersonTotal.toFixed(2)}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] text-xs text-[#71717A]">
              <div>Tip per Person: <strong className="text-[#18181B] dark:text-[#F4F4F5]">${perPersonTip.toFixed(2)}</strong></div>
              <div>Overall Total: <strong className="text-[#18181B] dark:text-[#F4F4F5]">${billTotal.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#71717A] mb-1">Tax (%)</label>
              <input
                type="number"
                value={salesTaxPercent}
                onChange={(e) => setSalesTaxPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B]"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
            <span className="text-[11px] uppercase font-bold text-[#71717A] tracking-wider block">
              Final Checkout Price
            </span>
            <div className="text-4xl font-black text-[#EC4899] my-2 font-mono">
              ${finalPrice.toFixed(2)}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A] text-xs text-[#71717A]">
              <div>You Save: <strong className="text-[#16A34A] dark:text-[#4ADE80]">${discountAmount.toFixed(2)}</strong></div>
              <div>Sales Tax: <strong className="text-[#18181B] dark:text-[#F4F4F5]">${taxAmount.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

