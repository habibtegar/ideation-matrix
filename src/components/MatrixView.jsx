import QuadrantBox from "./QuadrantBox";
import IdeaPool from "./IdeaPool";
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";

export default function MatrixView({
  ideas,
  onEditIdea,
  onDeleteIdea,
  onMoveQuadrant,
  onDragStart,
  onDragEnd,
  draggedIdeaId,
  dragOverQuadrant,
  onDragOver,
  onDragLeave,
  onDrop,
  onAutoPlot,
}) {
  const ideasQ1 = ideas.filter((item) => item.quadrant === "I");
  const ideasQ2 = ideas.filter((item) => item.quadrant === "II");
  const ideasQ3 = ideas.filter((item) => item.quadrant === "III");
  const ideasQ4 = ideas.filter((item) => item.quadrant === "IV");
  const ideasPool = ideas.filter((item) => item.quadrant === "pool" || !item.quadrant);

  return (
    <div className="space-y-6">
      {/* ========================================================
          DESKTOP & TABLET VIEW: 2x2 CARTESIAN GRID (md:block)
          ======================================================== */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-6 shadow-xs">
          {/* Top Axis Label: Impact Tinggi */}
          <div className="flex items-center justify-center gap-2 pb-3 text-xs font-semibold text-zinc-600 tracking-wider uppercase">
            <ArrowUp className="w-3.5 h-3.5 text-zinc-800" />
            <span>Impact: Tinggi (4–5)</span>
          </div>

          <div className="flex items-stretch">
            {/* Left Axis Label: Impact (Sumbu Y) */}
            <div className="w-9 shrink-0 flex flex-col items-center justify-between py-12 pr-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 select-none">
              <span className="flex items-center gap-1.5 text-zinc-700">
                <ArrowUp className="w-3 h-3 -rotate-90 text-zinc-800" />
                Impact Tinggi
              </span>
              <span className="text-zinc-400 font-bold">SUMBU Y (IMPACT)</span>
              <span className="flex items-center gap-1.5 text-zinc-500">
                Impact Rendah
                <ArrowDown className="w-3 h-3 -rotate-90 text-zinc-600" />
              </span>
            </div>

            {/* Matrix 2x2 Unified Cartesian Frame */}
            <div className="flex-1 relative rounded-xl border border-[#d4d4d8] overflow-hidden bg-white shadow-2xs">
              <div className="grid grid-cols-2 auto-rows-fr relative">
                {/* TOP-LEFT: Kuadran II (Major Projects) - Impact High, Feasibility Low */}
                <QuadrantBox
                  quadrantId="II"
                  ideas={ideasQ2}
                  onEditIdea={onEditIdea}
                  onDeleteIdea={onDeleteIdea}
                  onMoveQuadrant={onMoveQuadrant}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  draggedIdeaId={draggedIdeaId}
                  isDragOver={dragOverQuadrant === "II"}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className="border-r border-b border-[#d4d4d8]"
                />

                {/* TOP-RIGHT: Kuadran I (Quick Wins) - Impact High, Feasibility High */}
                <QuadrantBox
                  quadrantId="I"
                  ideas={ideasQ1}
                  onEditIdea={onEditIdea}
                  onDeleteIdea={onDeleteIdea}
                  onMoveQuadrant={onMoveQuadrant}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  draggedIdeaId={draggedIdeaId}
                  isDragOver={dragOverQuadrant === "I"}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className="border-b border-[#d4d4d8]"
                />

                {/* BOTTOM-LEFT: Kuadran III (Time Sinks) - Impact Low, Feasibility Low */}
                <QuadrantBox
                  quadrantId="III"
                  ideas={ideasQ3}
                  onEditIdea={onEditIdea}
                  onDeleteIdea={onDeleteIdea}
                  onMoveQuadrant={onMoveQuadrant}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  draggedIdeaId={draggedIdeaId}
                  isDragOver={dragOverQuadrant === "III"}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className="border-r border-[#d4d4d8]"
                />

                {/* BOTTOM-RIGHT: Kuadran IV (Fill-Ins) - Impact Low, Feasibility High */}
                <QuadrantBox
                  quadrantId="IV"
                  ideas={ideasQ4}
                  onEditIdea={onEditIdea}
                  onDeleteIdea={onDeleteIdea}
                  onMoveQuadrant={onMoveQuadrant}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  draggedIdeaId={draggedIdeaId}
                  isDragOver={dragOverQuadrant === "IV"}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className=""
                />

                {/* Center Origin Dot - sitting precisely at the crossroads of Sumbu X and Sumbu Y */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-[#d4d4d8] flex items-center justify-center pointer-events-none z-20 shadow-2xs"
                  title="Titik Pusat Matrix (Feasibility: 3.5, Impact: 3.5)"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Axis Label: Feasibility (Sumbu X) */}
          <div className="pt-4 mt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-600 pl-12 pr-4 select-none">
            <div className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-800" />
              <span>Feasibility: Rendah (1–3)</span>
            </div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              SUMBU X (FEASIBILITY)
            </div>
            <div className="flex items-center gap-1.5">
              <span>Feasibility: Tinggi (4–5)</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-800" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW: VERTICAL STACKED QUADRANTS (block md:hidden)
          Clean 1-column layout without cramping or collision
          ======================================================== */}
      <div className="block md:hidden space-y-4">
        {/* Kuadran I: Quick Wins */}
        <QuadrantBox
          quadrantId="I"
          ideas={ideasQ1}
          onEditIdea={onEditIdea}
          onDeleteIdea={onDeleteIdea}
          onMoveQuadrant={onMoveQuadrant}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggedIdeaId={draggedIdeaId}
          isDragOver={dragOverQuadrant === "I"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className="rounded-xl border border-zinc-200"
        />

        {/* Kuadran II: Major Projects */}
        <QuadrantBox
          quadrantId="II"
          ideas={ideasQ2}
          onEditIdea={onEditIdea}
          onDeleteIdea={onDeleteIdea}
          onMoveQuadrant={onMoveQuadrant}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggedIdeaId={draggedIdeaId}
          isDragOver={dragOverQuadrant === "II"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className="rounded-xl border border-zinc-200"
        />

        {/* Kuadran IV: Fill-Ins */}
        <QuadrantBox
          quadrantId="IV"
          ideas={ideasQ4}
          onEditIdea={onEditIdea}
          onDeleteIdea={onDeleteIdea}
          onMoveQuadrant={onMoveQuadrant}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggedIdeaId={draggedIdeaId}
          isDragOver={dragOverQuadrant === "IV"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className="rounded-xl border border-zinc-200"
        />

        {/* Kuadran III: Time Sinks */}
        <QuadrantBox
          quadrantId="III"
          ideas={ideasQ3}
          onEditIdea={onEditIdea}
          onDeleteIdea={onDeleteIdea}
          onMoveQuadrant={onMoveQuadrant}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggedIdeaId={draggedIdeaId}
          isDragOver={dragOverQuadrant === "III"}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className="rounded-xl border border-zinc-200"
        />
      </div>

      {/* ========================================================
          IDEA POOL SECTION
          ======================================================== */}
      <IdeaPool
        ideas={ideasPool}
        onEditIdea={onEditIdea}
        onDeleteIdea={onDeleteIdea}
        onMoveQuadrant={onMoveQuadrant}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggedIdeaId={draggedIdeaId}
        isDragOver={dragOverQuadrant === "pool"}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onAutoPlot={onAutoPlot}
      />
    </div>
  );
}
