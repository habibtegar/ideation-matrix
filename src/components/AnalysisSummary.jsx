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
        <p className="text-xs sm:text-sm font-medium text-zinc-700">
          Belum ada data ide untuk dianalisis
        </p>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Tambahkan fitur ide atau muat data default untuk melihat kesimpulan otomatis prioritas pengembangan LKPD.
        </p>
      </div>
    );
  }

  const percentQ1 = total > 0 ? Math.round((q1.length / total) * 100) : 0;

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
            Evaluasi otomatis prioritas fitur produk E-Commerce Sepatu &amp; Sandal UMKM berdasarkan distribusi kuadran.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1 bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200 font-semibold">
            {q1.length} Quick Wins ({percentQ1}%)
          </span>
        </div>
      </div>

      {/* Dynamic Executive Takeaway */}
      <div className="bg-zinc-50 border border-zinc-200/90 rounded-lg p-4 text-xs sm:text-sm leading-relaxed text-zinc-700">
        <strong className="text-zinc-900 font-semibold">Ringkasan Eksekutif: </strong>
        Dari total <strong className="text-zinc-900 font-bold">{total} ide fitur</strong> yang dievaluasi, sistem mengidentifikasi{" "}
        <strong className="text-zinc-900 font-bold">{q1.length} fitur Quick Wins</strong> yang memiliki dampak tinggi dan tingkat kemudahan implementasi optimal bagi UMKM. Sementara itu, terdapat{" "}
        <strong className="text-zinc-900 font-bold">{q2.length} Major Projects</strong>,{" "}
        <strong className="text-zinc-900 font-bold">{q4.length} Fill-Ins</strong>, dan{" "}
        <strong className="text-zinc-900 font-bold">{q3.length} Time Sinks</strong>
        {pool.length > 0 ? `, serta ${pool.length} ide dalam Idea Pool yang perlu penentuan skor lanjutan.` : "."}
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
            <span className="font-semibold text-zinc-800">Daftar Fitur: </span>
            {q1.length > 0 ? (
              <span className="text-zinc-600">
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
            <span className="font-semibold text-zinc-800">Daftar Fitur: </span>
            {q2.length > 0 ? (
              <span className="text-zinc-600">
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
                IV
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Fase 3: Fill-Ins (Pengisi Waktu Luang)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-white border border-amber-200 px-2 py-0.5 rounded-full">
              {q4.length} Ide
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {QUADRANTS.IV.recommendation}
          </p>

          <div className="pt-2 border-t border-amber-100 text-xs">
            <span className="font-semibold text-zinc-800">Daftar Fitur: </span>
            {q4.length > 0 ? (
              <span className="text-zinc-600">
                {q4.map((item) => item.title).join(", ")}.
              </span>
            ) : (
              <span className="text-zinc-400 italic">Belum ada fitur di kuadran ini.</span>
            )}
          </div>
        </div>

        {/* Phase 4: Time Sinks */}
        <div className="border border-rose-200/80 bg-rose-50/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-rose-700 text-white font-serif font-bold text-[10px]">
                III
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Fase 4: Time Sinks (Pertimbangkan / Tunda)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-800 bg-white border border-rose-200 px-2 py-0.5 rounded-full">
              {q3.length} Ide
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {QUADRANTS.III.recommendation}
          </p>

          <div className="pt-2 border-t border-rose-100 text-xs">
            <span className="font-semibold text-zinc-800">Daftar Fitur: </span>
            {q3.length > 0 ? (
              <span className="text-zinc-600">
                {q3.map((item) => item.title).join(", ")}.
              </span>
            ) : (
              <span className="text-zinc-400 italic">Belum ada fitur di kuadran ini.</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Plan Guidance for Student / LKPD */}
      <div className="border border-zinc-200 bg-white rounded-lg p-4">
        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Panduan Pelaksanaan Pengembangan Produk UMKM</span>
        </h4>
        <ul className="text-xs text-zinc-600 space-y-1.5 list-disc list-inside">
          <li>
            <strong>MVP Prioritas (Sprint 1):</strong> Kerjakan terlebih dahulu seluruh fitur pada <strong>Kuadran I (Quick Wins)</strong> untuk memastikan katalog, pencarian, keranjang, dan manajemen stok siap pakai.
          </li>
          <li>
            <strong>Pengembangan Lanjutan (Sprint 2):</strong> Mulai rancang integrasi payment gateway dan kurir dari <strong>Kuadran II (Major Projects)</strong> agar checkout online dapat berjalan otomatis.
          </li>
          <li>
            <strong>Efisiensi Anggaran:</strong> Hindari menghabiskan waktu pada fitur <strong>Kuadran III (Time Sinks)</strong> sebelum toko online membuktikan traksi penjualan nyata.
          </li>
        </ul>
      </div>
    </div>
  );
}
