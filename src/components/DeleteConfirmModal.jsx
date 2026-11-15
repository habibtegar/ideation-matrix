import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  ideaTitle,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-bold text-zinc-900">Hapus Ide Fitur?</h3>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
          Apakah Anda yakin ingin menghapus ide{" "}
          <strong className="text-zinc-800 font-semibold">"{ideaTitle}"</strong>?
          Tindakan ini akan menghapus ide dari matriks dan tabel LKPD.
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs"
          >
            Hapus Ide
          </button>
        </div>
      </div>
    </div>
  );
}
