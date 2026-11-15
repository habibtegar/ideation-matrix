import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-zinc-700 shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-lg shadow-lg text-sm text-zinc-900 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
      {icons[toast.type] || icons.info}
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="p-1 text-zinc-400 hover:text-zinc-600 rounded transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
