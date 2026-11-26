import { X, Edit2, ShoppingBag, Store } from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

export default function IdeaDetailModal({ isOpen, onClose, idea, onEdit }) {
  if (!isOpen || !idea) return null;

  const isPembeli = idea.target === "Pembeli";
  const qid = idea.quadrant || "pool";
  const quad = QUADRANTS[qid] || QUADRANTS.pool;
  const totalScore = (idea.feasibility ?? 0) + (idea.impact ?? 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92dvh] flex flex-col bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-200 bg-zinc-50/50 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Detail Fitur Ide
            </span>
            <span className="text-zinc-300">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
              {isPembeli ? (
                <ShoppingBag className="w-2.5 h-2.5 text-zinc-500" />
              ) : (
                <Store className="w-2.5 h-2.5 text-zinc-500" />
              )}
              <span>Target: {idea.target}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 active:bg-zinc-100 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer touch-manipulation"
            aria-label="Tutup detail"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content: Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight leading-snug">
              {idea.title}
            </h3>
          </div>

          {/* Full Description */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
              Deskripsi Lengkap Fitur:
            </label>
            <div className="p-3 sm:p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {idea.description || "Tidak ada deskripsi rinci untuk ide ini."}
            </div>
          </div>

          {/* Scores Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Feasibility */}
            <div className="p-2.5 sm:p-3 rounded-lg border border-zinc-200 bg-white text-center">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Feasibility
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-zinc-900 mt-0.5 block">
                {idea.feasibility ?? "-"}<span className="text-xs text-zinc-400 font-normal">/5</span>
              </span>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                {idea.feasibility >= 4 ? "Tinggi" : "Rendah"}
              </span>
            </div>

            {/* Impact */}
            <div className="p-2.5 sm:p-3 rounded-lg border border-zinc-200 bg-white text-center">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Impact
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-zinc-900 mt-0.5 block">
                {idea.impact ?? "-"}<span className="text-xs text-zinc-400 font-normal">/5</span>
              </span>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                {idea.impact >= 4 ? "Tinggi" : "Rendah"}
              </span>
            </div>

            {/* Total Skor */}
            <div className="p-2.5 sm:p-3 rounded-lg border border-zinc-900 bg-zinc-900 text-white text-center">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Total Skor
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">
                {totalScore}<span className="text-xs text-zinc-400 font-normal">/10</span>
              </span>
              <span className="text-[10px] text-zinc-300 mt-0.5 block">
                Feas + Imp
              </span>
            </div>
          </div>

          {/* Quadrant & Priority Classification */}
          <div className="p-3 sm:p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/70 space-y-1.5">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`w-2 h-2 rounded-full ${quad.dotColor} shrink-0`}></span>
                <span className="text-xs font-bold text-zinc-900">
                  {quad.id === "pool" ? "Idea Pool" : `Kuadran ${quad.id} – ${quad.name}`}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-zinc-600 bg-white border border-zinc-200 px-2 py-0.5 rounded">
                Prioritas: {quad.priority}
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {quad.recommendation}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-t border-zinc-200 bg-zinc-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 active:bg-zinc-100 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer touch-manipulation min-h-[36px]"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(idea);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 active:bg-zinc-950 transition-colors shadow-xs cursor-pointer touch-manipulation min-h-[36px]"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Ide Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
}
