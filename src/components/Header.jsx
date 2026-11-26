import { Plus, Sparkles, RotateCcw, BookOpen } from "lucide-react";

export default function Header({
  onOpenAddModal,
  onAutoPlot,
  onResetData,
  onLoadLkpdData,
  totalIdeas,
}) {
  return (
    <header className="border-b border-zinc-200 bg-white no-print sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-2xs">
              IM
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-zinc-900 truncate">
                  Ideation Matriks
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Idea Planning
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 truncate">
                E-Commerce Sepatu &amp; Sandal UMKM • Feasibility vs Impact Matriks
              </p>
            </div>
          </div>

          {/* Action Buttons: Responsive 2-col Grid on Mobile, Flex Row on Tablet & Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full md:w-auto">
            {/* Muat 10 Ide LKPD Guru Button */}
            <button
              type="button"
              onClick={onLoadLkpdData}
              title="Terapkan 10 data ide resmi LKPD Guru (dengan konfirmasi)"
              className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg sm:rounded-md hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100 transition-colors cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span className="hidden sm:inline">10 Ide LKPD</span>
              <span className="sm:hidden">10 Ide LKPD</span>
            </button>

            {/* Reset Button with confirmation */}
            <button
              type="button"
              onClick={onResetData}
              disabled={totalIdeas === 0}
              title={totalIdeas > 0 ? "Hapus seluruh ide (Reset ke 0)" : "Tidak ada ide untuk direset"}
              className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-medium border rounded-lg sm:rounded-md transition-colors cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0 ${
                totalIdeas > 0
                  ? "text-zinc-600 bg-white border-zinc-200 hover:bg-zinc-50 hover:text-rose-600 active:bg-zinc-100"
                  : "text-zinc-300 bg-zinc-50 border-zinc-200 cursor-not-allowed"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Reset ({totalIdeas})</span>
            </button>

            {/* Auto-Plot Button */}
            <button
              type="button"
              onClick={onAutoPlot}
              title="Kelompokkan seluruh ide secara otomatis berdasarkan skor Feasibility dan Impact"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-medium text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-lg sm:rounded-md hover:bg-zinc-200 active:bg-zinc-300 transition-colors cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
              <span>Auto-Plot</span>
            </button>

            {/* Tambah Ide Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-white bg-zinc-900 rounded-lg sm:rounded-md hover:bg-zinc-800 active:bg-zinc-950 transition-colors shadow-xs cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Tambah Ide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
