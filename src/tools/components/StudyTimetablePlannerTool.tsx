import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Award,
  Download
} from 'lucide-react';

interface SubjectSlot {
  subject: string;
  hours: number;
  type: 'concept' | 'practice' | 'revision';
}

export const StudyTimetablePlannerTool: React.FC = () => {
  const [examName, setExamName] = useState<string>('SSC CGL 2026');
  const [examDate, setExamDate] = useState<string>('2026-09-15');
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [weakSubject, setWeakSubject] = useState<string>('Quantitative Aptitude');
  const [subjectsText, setSubjectsText] = useState<string>(
    'Quantitative Aptitude, General Intelligence & Reasoning, English Comprehension, General Awareness'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const timetable = useMemo(() => {
    const target = new Date(examDate);
    const now = new Date();
    const daysLeft = Math.max(1, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const weeksLeft = Math.ceil(daysLeft / 7);

    const subjectList = subjectsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Generate daily schedule slots
    const slots: { time: string; title: string; focus: string; tag: string }[] = [];

    // Morning Slot 1: Deep concept work on weak subject
    slots.push({
      time: '06:30 AM – 08:30 AM',
      title: `${weakSubject} (Deep Concept Work)`,
      focus: 'High mental alertness period: Solve challenging problems & fundamentals',
      tag: 'Core Focus'
    });

    // Morning Slot 2: Secondary subject
    const subj2 = subjectList.find((s) => s !== weakSubject) || subjectList[0] || 'General Subject';
    slots.push({
      time: '09:30 AM – 11:30 AM',
      title: `${subj2} (Practice & Exercises)`,
      focus: 'Timed question practice, chapter exercises & short notes',
      tag: 'Practice'
    });

    // Afternoon Slot 3: Moderate revision / General Awareness
    const subj3 = subjectList.find((s) => s !== weakSubject && s !== subj2) || 'General Awareness / Current Affairs';
    slots.push({
      time: '02:00 PM – 03:30 PM',
      title: `${subj3} (Reading & Memory Retention)`,
      focus: 'Current affairs notes, vocabulary lists, formula sheets',
      tag: 'Reading'
    });

    // Evening Slot 4: Mock test / Speed drills
    slots.push({
      time: '05:30 PM – 07:00 PM',
      title: 'Full Sectional Mock / Speed Drills',
      focus: 'Exam-condition timer: accuracy analysis and error bookmarking',
      tag: 'Mock Test'
    });

    // Night Slot 5: Daily review & error notebook
    slots.push({
      time: '08:30 PM – 09:30 PM',
      title: 'Day Review & Mistake Notebook Revision',
      focus: 'Analyze today’s incorrect attempts & write key takeaways',
      tag: 'Revision'
    });

    const totalScheduledHours = 7.5;
    const totalStudyHoursAvailable = daysLeft * dailyHours;

    return {
      daysLeft,
      weeksLeft,
      subjectList,
      slots,
      totalScheduledHours,
      totalStudyHoursAvailable
    };
  }, [examDate, dailyHours, weakSubject, subjectsText]);

  const handleCopySchedule = () => {
    let text = `=== RajToolBox Study Timetable for ${examName} ===\n`;
    text += `Target Exam Date: ${examDate} (${timetable.daysLeft} days / ${timetable.weeksLeft} weeks remaining)\n`;
    text += `Target Daily Study Commitment: ${dailyHours} Hours (Total: ~${timetable.totalStudyHoursAvailable} hrs)\n\n`;
    text += `DAILY SCHEDULE:\n`;
    timetable.slots.forEach((s) => {
      text += `[${s.time}] ${s.title} (${s.tag})\n  &middot; ${s.focus}\n`;
    });
    text += `\nWeekly Rule: Every Sunday reserve 2 hours for full-length previous year paper simulation.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setExamName('SSC CGL 2026');
    setExamDate('2026-09-15');
    setDailyHours(6);
    setWeakSubject('Quantitative Aptitude');
    setSubjectsText('Quantitative Aptitude, General Intelligence & Reasoning, English Comprehension, General Awareness');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] dark:border-[#27272A] pb-3">
            <h3 className="text-sm font-black text-[#18181B] dark:text-[#F4F4F5] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EC4899]" />
              Study Strategy Inputs
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#71717A] hover:text-[#EC4899] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Examination Name
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5 flex items-center justify-between">
              <span>Daily Target Hours</span>
              <span className="text-[#EC4899] font-bold">{dailyHours} Hours/Day</span>
            </label>
            <input
              type="range"
              min="2"
              max="14"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full accent-[#EC4899]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              High Priority / Weak Subject
            </label>
            <input
              type="text"
              value={weakSubject}
              onChange={(e) => setWeakSubject(e.target.value)}
              placeholder="e.g. Mathematics, English, Reasoning"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mb-1.5">
              Syllabus Subjects (Comma-separated)
            </label>
            <textarea
              rows={3}
              value={subjectsText}
              onChange={(e) => setSubjectsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] text-xs font-medium focus:outline-none focus:border-[#EC4899]"
            />
          </div>
        </div>

        {/* Timetable Schedule Output */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#18181B] p-6 rounded-3xl border border-[#E4E4E7] dark:border-[#27272A] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#121215] border border-[#FACC15]/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#854D0E] dark:text-[#FACC15] block">
                  Countdown to {examName}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#18181B] dark:text-[#F4F4F5] mt-0.5">
                  {timetable.daysLeft} <span className="text-sm font-semibold text-[#71717A]">Days</span> &middot;{' '}
                  {timetable.weeksLeft} <span className="text-sm font-semibold text-[#71717A]">Weeks</span>
                </div>
                <span className="text-xs text-[#71717A] mt-1 block">
                  Estimated {timetable.totalStudyHoursAvailable.toLocaleString()} Total Study Hours Available
                </span>
              </div>

              <button
                onClick={handleCopySchedule}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] shadow-xs transition-all self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Routine'}
              </button>
            </div>

            {/* Structured Daily Slots */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                Optimized Daily Revision Cycle
              </h4>

              <div className="space-y-2.5">
                {timetable.slots.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#202026] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                          {s.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCE7F3] dark:bg-[#EC4899]/20 text-[#EC4899]">
                          {s.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                        {s.focus}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] block">
                        {s.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
