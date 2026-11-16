import {
  Edit2,
  Trash2,
  ShoppingBag,
  Store,
  Eye,
} from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

export default function IdeaCard({
  idea,
  onEdit,
  onDelete,
  onViewDetail,
}) {
  const isPembeli = idea.target === "Pembeli";
  const currentQ = idea.quadrant || "pool";

  return (
    <div
      className="group relative bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg p-3 sm:p-3.5 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between min-h-[108px]"
    >
      {/* Top row: Target Badge, Score Pill, and Action Buttons */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {/* Target Badge */}
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100/90 text-zinc-700 border border-zinc-200/80 shrink-0">
            {isPembeli ? (
              <ShoppingBag className="w-2.5 h-2.5 text-zinc-500" />
            ) : (
              <Store className="w-2.5 h-2.5 text-zinc-500" />
            )}
            <span>{idea.target}</span>
          </span>

          {/* Compact Feasibility & Impact Score Pill */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-zinc-600 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200/80 shrink-0"
            title={`Feasibility: ${idea.feasibility ?? '-'}/5, Impact: ${idea.impact ?? '-'}/5`}
          >
            <span>F:{idea.feasibility ?? "-"}</span>
            <span className="text-zinc-300">•</span>
            <span>I:{idea.impact ?? "-"}</span>
          </span>
        </div>

        {/* Action Controls: Detail, Edit, Hapus (Tanpa Pemindahan Manual) */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Quick View Detail */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetail) onViewDetail(idea);
            }}
            className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Lihat Deskripsi Lengkap"
            aria-label="Lihat Deskripsi Lengkap"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Quick Edit (Ubah Skor & Data) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(idea);
            }}
            className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Edit Ide & Skor"
            aria-label="Edit Ide & Skor"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Quick Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(idea.id);
            }}
            className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Hapus Ide"
            aria-label="Hapus Ide"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle row: Feature Title (font semibold) & Description (clickable for full detail) */}
      <div
        className="my-auto pr-0.5 cursor-pointer group/content"
        onClick={() => onViewDetail && onViewDetail(idea)}
        title="Klik untuk membaca deskripsi lengkap"
      >
        <h4
          className="text-sm font-semibold text-zinc-900 group-hover/content:text-zinc-600 transition-colors tracking-tight leading-snug line-clamp-2 break-words"
        >
          {idea.title}
        </h4>

        {/* Short Description: clean spacing, line-clamp-2 */}
        <p
          className="text-xs text-zinc-500 line-clamp-2 break-words mt-1 leading-relaxed"
        >
          {idea.description || "Tidak ada deskripsi singkat."}
        </p>
      </div>

      {/* Bottom row: Priority hint & score tag */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 mt-2 border-t border-zinc-100/80">
        <span className="font-mono truncate">
          {QUADRANTS[currentQ]?.name || "Idea Pool"}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono shrink-0">
          Skor: {(idea.feasibility ?? 0) + (idea.impact ?? 0)}/10
        </span>
      </div>
    </div>
  );
}
