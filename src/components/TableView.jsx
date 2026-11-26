import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ShoppingBag,
  Store,
  Eye,
} from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

/**
 * TableView Component
 * - Tampilan tabel 100% responsive mengikuti container dengan `table-layout: fixed`.
 * - Seluruh kolom terlihat dalam satu layar desktop tanpa horizontal scrollbar.
 * - Padding cell compact dan ukuran font proporsional.
 * - Kolom nama ide & deskripsi menggunakan text wrapping yang rapi tanpa memperlebar tabel.
 * - Untuk layar tablet dan HP disediakan Responsive Card Layout.
 */
export default function TableView({
  ideas,
  onEditIdea,
  onDeleteIdea,
  onViewDetail,
}) {
  const [sortField, setSortField] = useState("seqNumber");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "title" || field === "target" || field === "seqNumber" ? "asc" : "desc");
    }
  };

  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Custom field sorting
      if (sortField === "seqNumber") {
        valA = a.seqNumber ?? 999;
        valB = b.seqNumber ?? 999;
      } else if (sortField === "totalScore") {
        valA = (a.feasibility ?? 0) + (a.impact ?? 0);
        valB = (b.feasibility ?? 0) + (b.impact ?? 0);
      } else if (sortField === "quadrant") {
        const order = { I: 1, II: 2, III: 3, IV: 4, pool: 5 };
        valA = order[a.quadrant || "pool"] || 99;
        valB = order[b.quadrant || "pool"] || 99;
      }

      // Tie-breaker: preserve natural LKPD sequence number order (#1, #2, #3, ...)
      if (valA === valB) {
        return (a.seqNumber ?? 0) - (b.seqNumber ?? 0);
      }

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  }, [ideas, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-zinc-300 group-hover:text-zinc-500 shrink-0" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-zinc-900 shrink-0" />
    ) : (
      <ArrowDown className="w-3 h-3 text-zinc-900 shrink-0" />
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header Bar Tabel */}
      <div className="p-3.5 sm:p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
            Tabel Rangkuman Analisis LKPD
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
            Daftar lengkap fitur produk dengan penilaian Feasibility, Impact, dan status kuadran.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 self-stretch sm:self-auto flex-wrap">
          {/* Quick Sort Selector untuk Tampilan Tablet & Mobile */}
          <div className="flex items-center gap-1.5 lg:hidden text-xs flex-1 sm:flex-initial">
            <span className="text-zinc-500 font-medium shrink-0">Urut:</span>
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer min-h-[34px] touch-manipulation flex-1 sm:flex-initial"
            >
              <option value="seqNumber">Nomor (1–10)</option>
              <option value="totalScore">Total Skor</option>
              <option value="impact">Impact</option>
              <option value="feasibility">Feasibility</option>
              <option value="title">Nama Ide</option>
              <option value="target">Target Pengguna</option>
              <option value="quadrant">Kuadran</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center touch-manipulation"
              title={
                sortDirection === "asc"
                  ? "Urutan Naik (A-Z / Rendah ke Tinggi)"
                  : "Urutan Turun (Z-A / Tinggi ke Rendah)"
              }
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5 text-zinc-700" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-zinc-700" />
              )}
            </button>
          </div>

          <div className="text-[11px] sm:text-xs font-mono text-zinc-500 bg-white px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-md border border-zinc-200 shrink-0">
            Total: <strong className="text-zinc-900">{sortedIdeas.length}</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. TAMPILAN TABEL DESKTOP (lg:table)
          - table-layout: fixed dengan 100% lebar container
          - Bebas horizontal scrollbar pada layar desktop
          - Pembagian kolom proporsional dan text wrapping aman
          ======================================================== */}
      <div className="hidden lg:block w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse text-xs">
          {/* Definisi Lebar Proporsional Setiap Kolom (Total = 100%) */}
          <colgroup>
            <col className="w-[4%]" />   {/* 1. No */}
            <col className="w-[18%]" />  {/* 2. Nama Ide */}
            <col className="w-[24%]" />  {/* 3. Deskripsi */}
            <col className="w-[9.5%]" /> {/* 4. Target Pengguna */}
            <col className="w-[5.5%]" /> {/* 5. Feasibility */}
            <col className="w-[5.5%]" /> {/* 6. Impact */}
            <col className="w-[5.5%]" /> {/* 7. Total Skor */}
            <col className="w-[12%]" />  {/* 8. Kuadran */}
            <col className="w-[9%]" />   {/* 9. Prioritas */}
            <col className="w-[7%]" />   {/* 10. Aksi */}
          </colgroup>

          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/90 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
              {/* 1. No */}
              <th
                onClick={() => handleSort("seqNumber")}
                className="py-3 px-2 text-center cursor-pointer hover:bg-zinc-100/80 select-none group"
                title="Urutkan berdasarkan Nomor Urut LKPD"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span className="truncate">No.</span>
                  {renderSortIcon("seqNumber")}
                </div>
              </th>

              {/* 2. Nama Ide */}
              <th
                onClick={() => handleSort("title")}
                className="py-3 px-3.5 text-left cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center gap-1">
                  <span className="truncate">Nama Ide</span>
                  {renderSortIcon("title")}
                </div>
              </th>

              {/* 3. Deskripsi */}
              <th className="py-3 px-3.5 text-left">Deskripsi</th>

              {/* 4. Target Pengguna */}
              <th
                onClick={() => handleSort("target")}
                className="py-3 px-2.5 text-center cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="truncate">Target</span>
                  {renderSortIcon("target")}
                </div>
              </th>

              {/* 5. Feasibility */}
              <th
                onClick={() => handleSort("feasibility")}
                className="py-3 px-2 text-center cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span className="truncate">Feas</span>
                  {renderSortIcon("feasibility")}
                </div>
              </th>

              {/* 6. Impact */}
              <th
                onClick={() => handleSort("impact")}
                className="py-3 px-2 text-center cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span className="truncate">Impact</span>
                  {renderSortIcon("impact")}
                </div>
              </th>

              {/* 7. Total Skor */}
              <th
                onClick={() => handleSort("totalScore")}
                className="py-3 px-2 text-center cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span className="truncate">Total</span>
                  {renderSortIcon("totalScore")}
                </div>
              </th>

              {/* 8. Kuadran */}
              <th
                onClick={() => handleSort("quadrant")}
                className="py-3 px-2.5 text-center cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="truncate">Kuadran</span>
                  {renderSortIcon("quadrant")}
                </div>
              </th>

              {/* 9. Prioritas */}
              <th className="py-3 px-2.5 text-center">Prioritas</th>

              {/* 10. Aksi */}
              <th className="py-3 px-2.5 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/80">
            {sortedIdeas.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-zinc-400">
                  Tidak ada ide yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              sortedIdeas.map((idea, index) => {
                const qid = idea.quadrant || "pool";
                const quad = QUADRANTS[qid];
                const isPembeli = idea.target === "Pembeli";
                const totalScore = (idea.feasibility ?? 0) + (idea.impact ?? 0);

                return (
                  <tr
                    key={idea.id}
                    className="hover:bg-zinc-50/80 transition-colors"
                  >
                    {/* 1. No */}
                    <td className="py-3.5 px-2 text-center text-zinc-700 font-mono text-xs font-semibold align-middle">
                      {idea.seqNumber || index + 1}
                    </td>

                    {/* 2. Nama Ide (Text Wrapping, tidak memaksa horizontal scroll) */}
                    <td className="py-3.5 px-3.5 font-semibold text-zinc-900 break-words leading-snug align-middle">
                      {idea.title}
                    </td>

                    {/* 3. Deskripsi (Text Wrapping rapi ke baris berikutnya) */}
                    <td className="py-3.5 px-3.5 text-zinc-600 text-xs leading-relaxed break-words align-middle">
                      {idea.description || "-"}
                    </td>

                    {/* 4. Target Pengguna (Badge ringkas) */}
                    <td className="py-3.5 px-2.5 text-center align-middle">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 shrink-0">
                        {isPembeli ? (
                          <ShoppingBag className="w-3 h-3 text-zinc-500 shrink-0" />
                        ) : (
                          <Store className="w-3 h-3 text-zinc-500 shrink-0" />
                        )}
                        <span>{idea.target}</span>
                      </span>
                    </td>

                    {/* 5. Feasibility */}
                    <td className="py-3.5 px-2 text-center font-mono text-xs font-semibold text-zinc-800 align-middle">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border ${
                          idea.feasibility >= 4
                            ? "bg-zinc-100 text-zinc-900 border-zinc-300 font-bold"
                            : "bg-white text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {idea.feasibility != null ? idea.feasibility : "-"} / 5
                      </span>
                    </td>

                    {/* 6. Impact */}
                    <td className="py-3.5 px-2 text-center font-mono text-xs font-semibold text-zinc-800 align-middle">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border ${
                          idea.impact >= 4
                            ? "bg-zinc-100 text-zinc-900 border-zinc-300 font-bold"
                            : "bg-white text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {idea.impact != null ? idea.impact : "-"} / 5
                      </span>
                    </td>

                    {/* 7. Total Skor */}
                    <td className="py-3.5 px-2 text-center align-middle">
                      <span className="inline-block font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-zinc-900 text-white shadow-2xs">
                        {totalScore}
                      </span>
                    </td>

                    {/* 8. Kuadran */}
                    <td className="py-3.5 px-2.5 text-center align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                          quad.tagColor
                        }`}
                        title={`Kuadran ${quad.id} - ${quad.name}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${quad.dotColor}`}
                        />
                        <span>{quad.id === "pool" ? "Pool" : `Kuadran ${quad.id}`}</span>
                      </span>
                    </td>

                    {/* 9. Prioritas */}
                    <td className="py-3.5 px-2.5 text-center align-middle">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-zinc-800">
                          {quad.priority}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate max-w-full">
                          {quad.name}
                        </span>
                      </div>
                    </td>

                    {/* 10. Aksi (Ikon ringkas berjarak lega & nyaman) */}
                    <td className="py-3.5 px-2.5 text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail && onViewDetail(idea)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditIdea(idea)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
                          title="Edit Fitur"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteIdea(idea.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hapus Fitur"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          2. TAMPILAN RESPONSIVE CARD LAYOUT UNTUK TABLET & HP (lg:hidden)
          - Memastikan informasi mudah dibaca tanpa terjepit di layar kecil
          - Menampilkan seluruh detail, skor, kuadran, dan tombol aksi
          ======================================================== */}
      <div className="lg:hidden p-2.5 sm:p-4 bg-zinc-50/40 space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
        {sortedIdeas.length === 0 ? (
          <div className="py-10 text-center text-zinc-400 col-span-2">
            Tidak ada ide yang cocok dengan filter.
          </div>
        ) : (
          sortedIdeas.map((idea, index) => {
            const qid = idea.quadrant || "pool";
            const quad = QUADRANTS[qid];
            const isPembeli = idea.target === "Pembeli";
            const totalScore = (idea.feasibility ?? 0) + (idea.impact ?? 0);

            return (
              <div
                key={idea.id}
                className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2.5 hover:border-zinc-300 transition-colors"
              >
                {/* Bar Atas: Nomor, Target Pengguna & Tombol Aksi */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idea.seqNumber || index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {isPembeli ? (
                        <ShoppingBag className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <Store className="w-3 h-3 text-zinc-500" />
                      )}
                      <span>{idea.target}</span>
                    </span>
                  </div>

                  {/* Tombol Aksi: Touch Friendly min 32-36px */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewDetail && onViewDetail(idea)}
                      className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-900 active:bg-zinc-200/70 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Lihat Detail Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditIdea(idea)}
                      className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-900 active:bg-zinc-200/70 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Edit Fitur"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteIdea(idea.id)}
                      className="p-1.5 sm:p-2 text-zinc-500 hover:text-rose-600 active:bg-rose-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Hapus Fitur"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nama Ide & Deskripsi */}
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm leading-snug">
                    {idea.title}
                  </h3>
                  {idea.description && (
                    <p className="text-xs text-zinc-600 leading-relaxed mt-1 line-clamp-3">
                      {idea.description}
                    </p>
                  )}
                </div>

                {/* Status Kuadran & Tingkat Prioritas */}
                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-zinc-100 text-xs flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border ${quad.tagColor}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${quad.dotColor}`} />
                    <span>{quad.id === "pool" ? "Idea Pool" : `Kuadran ${quad.id} (${quad.name})`}</span>
                  </span>
                  <span className="text-[11px] font-medium text-zinc-600">
                    Prioritas: <strong className="text-zinc-800">{quad.priority}</strong>
                  </span>
                </div>

                {/* Skor Matrix Box: Feasibility, Impact, Total */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-xs">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-1.5">
                    <span className="text-[9px] text-zinc-400 block uppercase font-medium">Feas</span>
                    <span className="font-semibold text-zinc-800 text-xs sm:text-sm">
                      {idea.feasibility != null ? idea.feasibility : "-"}/5
                    </span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-1.5">
                    <span className="text-[9px] text-zinc-400 block uppercase font-medium">Impact</span>
                    <span className="font-semibold text-zinc-800 text-xs sm:text-sm">
                      {idea.impact != null ? idea.impact : "-"}/5
                    </span>
                  </div>
                  <div className="bg-zinc-900 text-white rounded-lg p-1.5">
                    <span className="text-[9px] text-zinc-400 block uppercase font-medium">Total</span>
                    <span className="font-bold text-white text-xs sm:text-sm">{totalScore}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
