import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] shadow-xl border border-white/10 dark:border-black/10 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#DC2626]" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#3B82F6]" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
