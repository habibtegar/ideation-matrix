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
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3.5 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 active:bg-zinc-100 rounded-lg transition-colors touch-manipulation cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-zinc-900">Hapus Ide Fitur?</h3>
        <p className="text-xs text-zinc-500 mt-1 sm:mt-1.5 leading-relaxed">
          Apakah Anda yakin ingin menghapus ide{" "}
          <strong className="text-zinc-800 font-semibold">"{ideaTitle}"</strong>?
          Tindakan ini akan menghapus ide dari matriks dan tabel LKPD.
        </p>

        <div className="flex items-center justify-end gap-2 mt-5 sm:mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer touch-manipulation min-h-[38px] flex items-center justify-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition-colors shadow-2xs cursor-pointer touch-manipulation min-h-[38px] flex items-center justify-center"
          >
            Hapus Ide
          </button>
        </div>
      </div>
    </div>
  );
}
