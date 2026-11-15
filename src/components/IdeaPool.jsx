import IdeaCard from "./IdeaCard";
import { Inbox, Sparkles } from "lucide-react";
import { sortIdeasByScore } from "../utils/matrixUtils";

export default function IdeaPool({
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
  onAutoPlot,
}) {
  const sortedIdeas = sortIdeasByScore(ideas);

  return (
    <div
      onDragOver={(e) => onDragOver(e, "pool")}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, "pool")}
      className={`rounded-xl border p-5 sm:p-6 transition-all ${
        isDragOver
          ? "border-zinc-900 bg-zinc-100/90 ring-2 ring-zinc-900/10"
          : "border-zinc-200 bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-zinc-100 text-zinc-700">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                Idea Pool (Belum Diplot)
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
                {sortedIdeas.length}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Wadah draf fitur atau ide yang menunggu penentuan skor dan plot matriks.
            </p>
          </div>
        </div>

        {sortedIdeas.length > 0 && (
          <button
            type="button"
            onClick={onAutoPlot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            <span>Plot Semua Otomatis</span>
          </button>
        )}
      </div>

      {/* Cards Area */}
      {sortedIdeas.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <Inbox className="w-6 h-6 text-zinc-300 mb-2 stroke-1" />
          <p className="text-xs font-medium text-zinc-500">
            Idea Pool saat ini kosong
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Semua ide telah berhasil terplot ke dalam 4 kuadran prioritas.
          </p>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
  );
}
