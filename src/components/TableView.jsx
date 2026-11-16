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

export default function TableView({
  ideas,
  onEditIdea,
  onDeleteIdea,
  onMoveQuadrant,
  onViewDetail,
}) {
  const [sortField, setSortField] = useState("impact");
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "title" || field === "target" ? "asc" : "desc");
    }
  };

  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Custom field sorting
      if (sortField === "totalScore") {
        valA = (a.feasibility ?? 0) + (a.impact ?? 0);
        valB = (b.feasibility ?? 0) + (b.impact ?? 0);
      } else if (sortField === "quadrant") {
        const order = { I: 1, II: 2, IV: 3, III: 4, pool: 5 };
        valA = order[a.quadrant || "pool"] || 99;
        valB = order[b.quadrant || "pool"] || 99;
      }

      if (valA === valB) {
        return a.title.localeCompare(b.title);
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
      return <ArrowUpDown className="w-3 h-3 text-zinc-300 group-hover:text-zinc-500" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-zinc-900" />
    ) : (
      <ArrowDown className="w-3 h-3 text-zinc-900" />
    );
  };

  const quadrantOptions = [
    { id: "I", label: "I" },
    { id: "II", label: "II" },
    { id: "IV", label: "IV" },
    { id: "III", label: "III" },
    { id: "pool", label: "Pool" },
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
            Tabel Rangkuman Analisis LKPD
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Daftar lengkap fitur produk dengan penilaian Feasibility, Impact, dan status kuadran.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-500 bg-white px-3 py-1 rounded-md border border-zinc-200 self-start sm:self-auto">
          Total Baris: <strong className="text-zinc-900">{sortedIdeas.length}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5 w-12 text-center">No.</th>
              <th
                onClick={() => handleSort("title")}
                className="py-3 px-3.5 cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Nama Ide</span>
                  {renderSortIcon("title")}
                </div>
              </th>
              <th className="py-3 px-3.5 min-w-[200px]">Deskripsi</th>
              <th
                onClick={() => handleSort("target")}
                className="py-3 px-3.5 cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Target Pengguna</span>
                  {renderSortIcon("target")}
                </div>
              </th>
              <th
                onClick={() => handleSort("feasibility")}
                className="py-3 px-3.5 cursor-pointer hover:bg-zinc-100/80 select-none group text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Feasibility</span>
                  {renderSortIcon("feasibility")}
                </div>
              </th>
              <th
                onClick={() => handleSort("impact")}
                className="py-3 px-3.5 cursor-pointer hover:bg-zinc-100/80 select-none group text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Impact</span>
                  {renderSortIcon("impact")}
                </div>
              </th>
              <th
                onClick={() => handleSort("totalScore")}
                className="py-3 px-3.5 cursor-pointer hover:bg-zinc-100/80 select-none group text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Total Skor</span>
                  {renderSortIcon("totalScore")}
                </div>
              </th>
              <th
                onClick={() => handleSort("quadrant")}
                className="py-3 px-3.5 cursor-pointer hover:bg-zinc-100/80 select-none group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Kuadran</span>
                  {renderSortIcon("quadrant")}
                </div>
              </th>
              <th className="py-3 px-3.5">Prioritas</th>
              <th className="py-3 px-3.5 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70">
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
                    className="hover:bg-zinc-50/70 transition-colors"
                  >
                    {/* No. */}
                    <td className="py-3 px-3.5 text-center text-zinc-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    {/* Nama Ide */}
                    <td className="py-3 px-3.5 font-semibold text-zinc-900 whitespace-nowrap">
                      {idea.title}
                    </td>

                    {/* Deskripsi */}
                    <td className="py-3 px-3.5 text-zinc-600 text-xs leading-relaxed max-w-xs">
                      {idea.description || "-"}
                    </td>

                    {/* Target Pengguna */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {isPembeli ? (
                          <ShoppingBag className="w-3 h-3 text-zinc-500" />
                        ) : (
                          <Store className="w-3 h-3 text-zinc-500" />
                        )}
                        <span>{idea.target}</span>
                      </span>
                    </td>

                    {/* Feasibility */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
                          idea.feasibility >= 4
                            ? "bg-zinc-100 text-zinc-900 border-zinc-300"
                            : "bg-white text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {idea.feasibility != null ? idea.feasibility : "-"} / 5
                      </span>
                    </td>

                    {/* Impact */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
                          idea.impact >= 4
                            ? "bg-zinc-100 text-zinc-900 border-zinc-300"
                            : "bg-white text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {idea.impact != null ? idea.impact : "-"} / 5
                      </span>
                    </td>

                    {/* Total Skor */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span className="inline-block font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-zinc-900 text-white shadow-2xs">
                        {totalScore}
                      </span>
                    </td>

                    {/* Kuadran */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${
                            quad.tagColor
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${quad.dotColor}`}
                          ></span>
                          <span>{quad.id === "pool" ? "Pool" : `Kuadran ${quad.id}`}</span>
                        </span>

                        {/* Quick switch quadrant mini selector */}
                        <div className="inline-flex items-center gap-0.5 border border-zinc-200 rounded p-0.5 bg-white">
                          {quadrantOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onMoveQuadrant(idea.id, opt.id)}
                              title={`Pindah ke ${opt.label}`}
                              className={`text-[9px] font-mono px-1 py-0.2 rounded transition-colors cursor-pointer ${
                                (idea.quadrant || "pool") === opt.id
                                  ? "bg-zinc-900 text-white font-bold"
                                  : "text-zinc-500 hover:bg-zinc-100"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Prioritas */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-800">
                          {quad.priority}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {quad.name}
                        </span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewDetail && onViewDetail(idea)}
                          className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditIdea(idea)}
                          className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                          title="Edit Fitur"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteIdea(idea.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
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
    </div>
  );
}
