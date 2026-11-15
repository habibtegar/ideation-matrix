import { useState, useRef, useEffect } from "react";
import {
  GripVertical,
  MoreVertical,
  Edit2,
  Trash2,
  ShoppingBag,
  Store,
  Check,
} from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

export default function IdeaCard({
  idea,
  onEdit,
  onDelete,
  onMoveQuadrant,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isPembeli = idea.target === "Pembeli";

  // Close dropdown menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const quadrantOptions = [
    { id: "I", label: "Kuadran I (Quick Wins)" },
    { id: "II", label: "Kuadran II (Major Projects)" },
    { id: "III", label: "Kuadran III (Time Sinks)" },
    { id: "IV", label: "Kuadran IV (Fill-Ins)" },
    { id: "pool", label: "Idea Pool (Belum Diplot)" },
  ];

  const currentQ = idea.quadrant || "pool";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, idea)}
      onDragEnd={onDragEnd}
      className={`group relative bg-white border rounded-lg p-3 sm:p-3.5 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between min-h-[98px] ${
        isDragging
          ? "opacity-35 border-zinc-400 scale-[0.98] ring-1 ring-zinc-400"
          : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      {/* Top row: Target Badge, Score, and Actions Menu */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
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

        {/* Dropdown Menu Trigger and Drag Handle */}
        <div className="flex items-center gap-0.5 shrink-0 relative" ref={menuRef}>
          {/* Menu Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Menu Opsi Fitur"
            aria-label="Menu Opsi Fitur"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Drag Handle */}
          <div
            className="p-1 text-zinc-300 group-hover:text-zinc-500 cursor-grab active:cursor-grabbing transition-colors"
            title="Tahan dan geser untuk memindahkan kartu"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Minimalist Dropdown Menu */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Edit */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(idea);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 transition-colors text-left cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Edit Ide Fitur</span>
              </button>

              <div className="my-1 border-t border-zinc-100"></div>

              {/* Move Quadrant Sub-options */}
              <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Pindahkan Kuadran
              </div>
              {quadrantOptions.map((opt) => {
                const isCurrent = currentQ === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      setMenuOpen(false);
                      onMoveQuadrant(idea.id, opt.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1 text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-zinc-50 text-zinc-400 font-medium cursor-default"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isCurrent && <Check className="w-3 h-3 text-zinc-500 shrink-0 ml-1" />}
                  </button>
                );
              })}

              <div className="my-1 border-t border-zinc-100"></div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(idea.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Hapus Ide</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle row: Feature Title (font semibold) & Description (text-zinc-500) */}
      <div className="my-auto pr-0.5">
        <h4
          className="text-sm font-semibold text-zinc-900 tracking-tight leading-snug truncate"
          title={idea.title}
        >
          {idea.title}
        </h4>

        {/* Short Description: maximum 1 line with clean spacing */}
        <p
          className="text-xs text-zinc-500 truncate mt-1 leading-normal"
          title={idea.description || ""}
        >
          {idea.description || "Tidak ada deskripsi singkat."}
        </p>
      </div>

      {/* Bottom row: Priority hint & score tag */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 mt-1 border-t border-zinc-100/80">
        <span className="font-mono truncate">
          {QUADRANTS[currentQ]?.name || "Idea Pool"}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono">
          Skor: {(idea.feasibility ?? 0) + (idea.impact ?? 0)}/10
        </span>
      </div>
    </div>
  );
}
