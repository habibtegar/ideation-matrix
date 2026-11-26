import { Sparkles, CheckCircle2, Info } from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

export default function AnalysisSummary({ ideas }) {
  const total = ideas.length;
  const q1 = ideas.filter((item) => item.quadrant === "I");
  const q2 = ideas.filter((item) => item.quadrant === "II");
  const q3 = ideas.filter((item) => item.quadrant === "III");
  const q4 = ideas.filter((item) => item.quadrant === "IV");
  const pool = ideas.filter((item) => item.quadrant === "pool" || !item.quadrant);

  if (total === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 text-center text-zinc-500 shadow-xs">
        <Info className="w-5 h-5 mx-auto text-zinc-400 mb-2" />
        <p className="text-xs sm:text-sm font-semibold text-zinc-800">
          Belum ada data ide untuk dianalisis
        </p>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Silakan tambahkan ide fitur baru untuk melihat kesimpulan otomatis dan rekomendasi prioritas pengembangan LKPD.
        </p>
      </div>
    );
  }

  const percentQ1 = total > 0 ? Math.round((q1.length / total) * 100) : 0;
  const percentQ2 = total > 0 ? Math.round((q2.length / total) * 100) : 0;
  const percentQ3 = total > 0 ? Math.round((q3.length / total) * 100) : 0;
  const percentQ4 = total > 0 ? Math.round((q4.length / total) * 100) : 0;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-zinc-900 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
              Kesimpulan Analisis &amp; Rekomendasi Prioritas (LKPD)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Evaluasi otomatis prioritas fitur produk E-Commerce Sepatu &amp; Sandal UMKM berdasarkan distribusi aktual pada matriks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1 bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200 font-semibold">
            {q1.length} Quick Wins ({percentQ1}%)
          </span>
        </div>
      </div>

      {/* Ringkasan Distribusi Jumlah Ide pada Setiap Kuadran */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-950">Kuadran I</span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
            {q1.length} ide ({percentQ1}%)
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-semibold text-blue-950">Kuadran II</span>
          </div>
          <span className="font-mono text-xs font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
            {q2.length} ide ({percentQ2}%)
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-xs font-semibold text-rose-950">Kuadran III</span>
          </div>
          <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200">
            {q3.length} ide ({percentQ3}%)
          </span>
        </div>

        <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-xs font-semibold text-amber-950">Kuadran IV</span>
          </div>
          <span className="font-mono text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
            {q4.length} ide ({percentQ4}%)
          </span>
        </div>
      </div>

      {/* Dynamic Executive Takeaway */}
      <div className="bg-zinc-50 border border-zinc-200/90 rounded-lg p-4 text-xs sm:text-sm leading-relaxed text-zinc-700">
        <strong className="text-zinc-900 font-semibold">Ringkasan Eksekutif: </strong>
        Berdasarkan <strong className="text-zinc-900 font-bold">{total} ide fitur aktual</strong> yang terdaftar, terdapat{" "}
        <strong className="text-zinc-900 font-bold">{q1.length} fitur Quick Wins (Kuadran I)</strong>
        {q1.length > 0 && ` (${q1.map((i) => i.title).join(", ")})`} yang siap memberikan nilai optimal bagi pembeli/penjual dengan biaya dan usaha implementasi yang terjangkau.
        {q2.length > 0 && (
          <span>
            {" "}Sementara <strong className="text-zinc-900 font-bold">{q2.length} fitur Major Projects</strong> ({q2.map((i) => i.title).join(", ")}) disiapkan untuk roadmap jangka menengah.
          </span>
        )}
        {q3.length > 0 && (
          <span>
            {" "}Sebanyak <strong className="text-zinc-900 font-bold">{q3.length} fitur Fill-Ins</strong> ({q3.map((i) => i.title).join(", ")}) dapat dikerjakan saat ada waktu luang.
          </span>
        )}
        {q4.length > 0 && (
          <span>
            {" "}Dan <strong className="text-zinc-900 font-bold">{q4.length} fitur Tunda / Hindari</strong> ({q4.map((i) => i.title).join(", ")}) disarankan untuk ditunda.
          </span>
        )}
        {pool.length > 0 && (
          <span>
            {" "}Terdapat <strong className="text-zinc-900 font-bold">{pool.length} ide dalam Idea Pool</strong> yang belum memiliki skor lengkap.
          </span>
        )}
      </div>

      {/* 4 Quadrants Detailed Priority Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phase 1: Quick Wins */}
        <div className="border border-emerald-200/80 bg-emerald-50/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-700 text-white font-serif font-bold text-[10px]">
                I
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Fase 1: Quick Wins (Prioritas Utama)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
              {q1.length} Ide
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {QUADRANTS.I.recommendation}
          </p>

          <div className="pt-2 border-t border-emerald-100 text-xs">
            <span className="font-semibold text-zinc-800">Daftar Fitur Aktual: </span>
            {q1.length > 0 ? (
              <span className="text-zinc-700 font-medium">
                {q1.map((item) => item.title).join(", ")}.
              </span>
            ) : (
              <span className="text-zinc-400 italic">Belum ada fitur di kuadran ini.</span>
            )}
          </div>
        </div>

        {/* Phase 2: Major Projects */}
        <div className="border border-blue-200/80 bg-blue-50/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-700 text-white font-serif font-bold text-[10px]">
                II
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Fase 2: Major Projects (Rencana Strategis)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-blue-800 bg-white border border-blue-200 px-2 py-0.5 rounded-full">
              {q2.length} Ide
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {QUADRANTS.II.recommendation}
          </p>

          <div className="pt-2 border-t border-blue-100 text-xs">
            <span className="font-semibold text-zinc-800">Daftar Fitur Aktual: </span>
            {q2.length > 0 ? (
              <span className="text-zinc-700 font-medium">
                {q2.map((item) => item.title).join(", ")}.
              </span>
            ) : (
              <span className="text-zinc-400 italic">Belum ada fitur di kuadran ini.</span>
            )}
          </div>
        </div>

        {/* Phase 3: Fill-Ins */}
        <div className="border border-amber-200/80 bg-amber-50/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-700 text-white font-serif font-bold text-[10px]">
                III
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Kuadran III: Fill-Ins (Pengisi Waktu Luang)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-white border border-amber-200 px-2 py-0.5 rounded-full">
              {q3.length} Ide
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {QUADRANTS.III.recommendation}
          </p>

          <div className="pt-2 border-t border-amber-100 text-xs">
            <span className="font-semibold text-zinc-800">Daftar Fitur Aktual: </span>
            {q3.length > 0 ? (
              <span className="text-zinc-700 font-medium">
                {q3.map((item) => item.title).join(", ")}.
              </span>
            ) : (
              <span className="text-zinc-400 italic">Belum ada fitur di kuadran ini.</span>
            )}
          </div>
        </div>

        {/* Phase 4: Tunda / Hindari */}
        <div className="border border-rose-200/80 bg-rose-50/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-rose-700 text-white font-serif font-bold text-[10px]">
                IV
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Kuadran IV: Tunda / Hindari (Evaluasi)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-800 bg-white border border-rose-200 px-2 py-0.5 rounded-full">
              {q4.length} Ide
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {QUADRANTS.IV.recommendation}
          </p>

          <div className="pt-2 border-t border-rose-100 text-xs">
            <span className="font-semibold text-zinc-800">Daftar Fitur Aktual: </span>
            {q4.length > 0 ? (
              <span className="text-zinc-700 font-medium">
                {q4.map((item) => item.title).join(", ")}.
              </span>
            ) : (
              <span className="text-zinc-400 italic">Belum ada fitur di kuadran ini.</span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Action Plan Guidance based on Available Data */}
      <div className="border border-zinc-200 bg-white rounded-lg p-4">
        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Panduan Pelaksanaan Pengembangan Produk UMKM</span>
        </h4>
        <ul className="text-xs text-zinc-600 space-y-1.5 list-disc list-inside">
          <li>
            <strong>MVP Prioritas (Sprint 1):</strong>{" "}
            {q1.length > 0 ? (
              <span>
                Fokuskan seluruh sumber daya awal untuk merilis fitur Quick Wins (<strong>{q1.map((i) => i.title).join(", ")}</strong>).
              </span>
            ) : (
              <span>
                Belum ada fitur Quick Wins. Evaluasi kembali fitur pada Kuadran II untuk melihat apakah ada bagian yang bisa disederhanakan.
              </span>
            )}
          </li>
          <li>
            <strong>Rencana Lanjutan (Sprint 2):</strong>{" "}
            {q2.length > 0 ? (
              <span>
                Siapkan arsitektur dan integrasi untuk fitur Major Projects (<strong>{q2.map((i) => i.title).join(", ")}</strong>) setelah alur dasar berjalan lancar.
              </span>
            ) : (
              <span>Tidak ada fitur Major Projects yang perlu dipersiapkan saat ini.</span>
            )}
          </li>
          <li>
            <strong>Efisiensi Biaya &amp; Waktu:</strong>{" "}
            {q3.length > 0 ? (
              <span>
                Hindari memprioritaskan fitur Tunda / Hindari (<strong>{q4.map((i) => i.title).join(", ")}</strong>) guna menjaga efisiensi anggaran UMKM.
              </span>
            ) : (
              <span>Seluruh ide yang dievaluasi memiliki dampak atau kelayakan yang dapat dipertanggungjawabkan.</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
