import { Plus, Sparkles, Copy, RotateCcw } from "lucide-react";

export default function Header({
  onOpenAddModal,
  onAutoPlot,
  onCopyResults,
  onResetData,
  onLoadSampleIdeas,
  totalIdeas,
}) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-semibold text-lg shrink-0">
              IM
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  Ideation Matrix
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Idea Planning
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                E-Commerce Sepatu &amp; Sandal UMKM • Feasibility vs Impact Matrix
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Reset / Load Samples */}
            {totalIdeas === 0 ? (
              <button
                type="button"
                onClick={onLoadSampleIdeas}
                title="Muat kembali 10 ide contoh LKPD"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                <span>Muat Contoh</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onResetData}
                title="Hapus semua ide (Reset ke 0)"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Reset (0)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onCopyResults}
              title="Salin Rangkuman Ide ke Clipboard (Google Docs format)"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Salin Hasil</span>
            </button>

            <button
              type="button"
              onClick={onAutoPlot}
              title="Kelompokkan seluruh ide secara otomatis berdasarkan skor Feasibility dan Impact"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>Auto-Plot</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
