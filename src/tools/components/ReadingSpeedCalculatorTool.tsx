import React, { useState, useEffect } from 'react';
import { PenTool, Play, Pause, RotateCcw, Clock, Award } from 'lucide-react';

const SAMPLE_TEXT = `Reading comprehension speed is a decisive competitive edge across international language tests such as IELTS, TOEFL, and SAT, as well as domestic civil service examinations. Average adult reading speed ranges between 200 and 250 words per minute for general prose. Competitive aspirants typically strive for 300 to 350 words per minute with 80% factual recall. To improve reading fluency, focus on expanding eye span across word clusters rather than pronouncing each syllable sub-vocally. Regular practice with analytical editorials and timed paragraph summaries naturally conditions both velocity and conceptual synthesis.`;

export const ReadingSpeedCalculatorTool: React.FC = () => {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = seconds / 60;
  const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

  const handleStart = () => {
    setIsRunning(true);
    setSeconds(0);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#EC4899]" />
              Interactive Reading Passage
            </h3>
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#15803D]"
                >
                  <Play className="w-3.5 h-3.5" /> Start Timer
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="px-3.5 py-1.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#DB2777]"
                >
                  <Pause className="w-3.5 h-3.5" /> I Finished Reading
                </button>
              )}
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl text-[#71717A] hover:text-[#EC4899]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-sm leading-relaxed focus:outline-none focus:border-[#EC4899]"
          />
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-5">
            <div className="p-6 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40 text-center">
              <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                Reading Speed (WPM)
              </span>
              <div className="text-4xl font-black text-[#EC4899] mt-1">
                {wpm} <span className="text-sm font-semibold text-[#71717A]">WPM</span>
              </div>
              <span className="text-xs text-[#71717A] mt-1 block">
                {wordCount} Words in {seconds} seconds
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Average Reader</span>
                <span className="font-bold text-[#18181B] dark:text-[#F4F4F5] mt-0.5 block">200–250 WPM</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#202026] border border-[#E4E4E7] dark:border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Exam Aspirant Target</span>
                <span className="font-bold text-[#16A34A] mt-0.5 block">300–350 WPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
