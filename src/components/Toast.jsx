import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, message, type = "success", onClose }) {
  const currentMessage = toast?.message || message;
  const currentType = toast?.type || type;

  useEffect(() => {
    if (!currentMessage) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [currentMessage, onClose]);

  if (!currentMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-zinc-700 shrink-0" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white/95 backdrop-blur-xs border border-zinc-200 rounded-xl shadow-xl text-xs sm:text-sm text-zinc-900 animate-in fade-in slide-in-from-bottom-2 duration-200 sm:max-w-md"
    >
      {icons[currentType] || icons.info}
      <span className="flex-1 font-medium leading-snug">{currentMessage}</span>
      <button
        onClick={onClose}
        className="p-1 text-zinc-400 hover:text-zinc-600 active:bg-zinc-100 rounded transition-colors touch-manipulation cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
