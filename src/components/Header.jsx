import { Plus, Sparkles, Copy, RotateCcw, Download, Printer, BookOpen } from "lucide-react";

export default function Header({
  onOpenAddModal,
  onAutoPlot,
  onCopyResults,
  onExportCsv,
  onPrintPdf,
  onResetData,
  onLoadLkpdData,
  totalIdeas,
}) {
  return (
    <header className="border-b border-zinc-200 bg-white no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-semibold text-sm shrink-0 shadow-2xs">
              IM
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
                  Ideation Matrix
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Idea Planning
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                E-Commerce Sepatu &amp; Sandal UMKM • Feasibility vs Impact Matrix
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Muat 10 Ide LKPD Guru Button */}
            <button
              type="button"
              onClick={onLoadLkpdData}
              title="Terapkan 10 data ide resmi LKPD Guru (dengan konfirmasi)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-600" />
              <span className="hidden sm:inline">10 Ide LKPD</span>
              <span className="sm:hidden">LKPD</span>
            </button>

            {/* Reset Button with confirmation */}
            {totalIdeas > 0 && (
              <button
                type="button"
                onClick={onResetData}
                title="Hapus seluruh ide (Reset ke 0) dengan konfirmasi"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset ({totalIdeas})</span>
              </button>
            )}

            {/* Export Actions Group */}
            <div className="inline-flex items-center rounded-md border border-zinc-200 bg-white p-0.5">
              <button
                type="button"
                onClick={onCopyResults}
                title="Salin Rangkuman Ide ke Clipboard (Format Google Docs)"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Salin Teks</span>
              </button>
              <span className="h-3.5 w-[1px] bg-zinc-200"></span>
              <button
                type="button"
                onClick={onExportCsv}
                title="Unduh Data dalam format CSV (Excel / Sheets)"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <span className="h-3.5 w-[1px] bg-zinc-200"></span>
              <button
                type="button"
                onClick={onPrintPdf}
                title="Cetak / Simpan sebagai PDF"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>

            {/* Auto-Plot Button */}
            <button
              type="button"
              onClick={onAutoPlot}
              title="Kelompokkan seluruh ide secara otomatis berdasarkan skor Feasibility dan Impact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>Auto-Plot</span>
            </button>

            {/* Tambah Ide Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Ide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
