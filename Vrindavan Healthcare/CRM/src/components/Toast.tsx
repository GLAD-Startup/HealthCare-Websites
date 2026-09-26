import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 shadow-lg animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#ECFDF3] text-[#067647] border-[#A6F4C5]'
              : toast.type === 'error'
              ? 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]'
              : 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#B42318] shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#175CD3] shrink-0" />}
            <span className="leading-5 truncate">{toast.text}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-black/10 hover:bg-black/15 transition-colors underline"
              >
                {toast.action.label}
              </button>
            )}

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-black/5 rounded-md transition-colors text-inherit opacity-70 hover:opacity-100"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
