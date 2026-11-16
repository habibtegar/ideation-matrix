import IdeaCard from "./IdeaCard";
import { QUADRANTS, sortIdeasByScore } from "../utils/matrixUtils";

export default function QuadrantBox({
  quadrantId,
  ideas,
  onEditIdea,
  onDeleteIdea,
  onMoveQuadrant,
  onDragStart,
  onDragEnd,
  draggedIdeaId,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  className = "",
}) {
  const quad = QUADRANTS[quadrantId];
  const sortedIdeas = sortIdeasByScore(ideas);

  // Subtle background styling per quadrant for clean visual hierarchy
  const quadrantBgStyles = {
    I: "bg-emerald-50/20 hover:bg-emerald-50/30",
    II: "bg-blue-50/20 hover:bg-blue-50/30",
    III: "bg-rose-50/20 hover:bg-rose-50/30",
    IV: "bg-amber-50/20 hover:bg-amber-50/30",
  };

  return (
    <div
      onDragOver={(e) => onDragOver(e, quadrantId)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, quadrantId)}
      className={`flex flex-col p-4 sm:p-5 transition-all h-full min-h-0 ${
        isDragOver
          ? "bg-zinc-100/90 ring-2 ring-inset ring-zinc-900/10"
          : `${quadrantBgStyles[quadrantId] || "bg-zinc-50/40"}`
      } ${className}`}
    >
      {/* Compact Quadrant Header */}
      <div className="flex items-center justify-between gap-2.5 pb-2.5 mb-2.5 border-b border-zinc-200/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* Roman Numeral */}
          <span className="flex items-center justify-center w-5 h-5 rounded bg-zinc-900 text-white font-serif font-bold text-[11px] shrink-0 shadow-2xs">
            {quad.id}
          </span>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight uppercase truncate">
                {quad.name}
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                ({quad.rule})
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-tight truncate">
              {quad.description}
            </p>
          </div>
        </div>

        {/* Count Badge */}
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-700 font-semibold shrink-0 shadow-2xs">
          {sortedIdeas.length} {sortedIdeas.length === 1 ? "ide" : "ide"}
        </span>
      </div>

      {/* Card Arrangement: CSS Grid with 2 columns on desktop (gap 10-12px) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {sortedIdeas.length === 0 ? (
          <div className="h-full min-h-[90px] flex flex-col items-center justify-center text-center p-3 sm:p-4 border border-dashed border-zinc-200/90 rounded-lg bg-white/40">
            <p className="text-xs text-zinc-400 font-medium">
              Belum ada kartu di Kuadran {quad.id}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Tarik kartu ke sini atau gunakan Auto-Plot
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
            {sortedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={onEditIdea}
                onDelete={onDeleteIdea}
                onMoveQuadrant={onMoveQuadrant}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggedIdeaId === idea.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtle Bottom Priority Indicator */}
      <div className="mt-2.5 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[10px] text-zinc-500 shrink-0">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${quad.dotColor}`}></span>
          {quad.badge}
        </span>
        <span className="font-mono text-zinc-400">
          Prioritas {quad.priority.split(" ")[0]}
        </span>
      </div>
    </div>
  );
}
