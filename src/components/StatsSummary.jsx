export default function StatsSummary({ ideas, activeQuadrantFilter, onSelectQuadrant }) {
  const total = ideas.length;
  const countI = ideas.filter((item) => item.quadrant === "I").length;
  const countII = ideas.filter((item) => item.quadrant === "II").length;
  const countIII = ideas.filter((item) => item.quadrant === "III").length;
  const countIV = ideas.filter((item) => item.quadrant === "IV").length;

  const stats = [
    {
      id: "all",
      badge: "TOTAL IDE",
      badgeStyle: "bg-zinc-900 text-white border-zinc-900",
      activeRing: "ring-zinc-900 border-zinc-900",
      subtitle: "Katalog",
      count: total,
      detail: "Seluruh Fitur",
    },
    {
      id: "I",
      badge: "QUICK WINS",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      activeRing: "ring-emerald-600 border-emerald-600",
      subtitle: "Prioritas #1",
      count: countI,
      detail: "Dampak Tinggi • Mudah",
    },
    {
      id: "II",
      badge: "MAJOR PROJECTS",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/80",
      activeRing: "ring-blue-600 border-blue-600",
      subtitle: "Strategis",
      count: countII,
      detail: "Dampak Tinggi • Rumit",
    },
    {
      id: "III",
      badge: "FILL-INS",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80",
      activeRing: "ring-amber-600 border-amber-600",
      subtitle: "Sambilan",
      count: countIII,
      detail: "Dampak Rendah • Mudah",
    },
    {
      id: "IV",
      badge: "TUNDA / HINDARI",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200/80",
      activeRing: "ring-rose-600 border-rose-600",
      subtitle: "Evaluasi",
      count: countIV,
      detail: "Dampak Rendah • Rumit",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
      {stats.map((stat) => {
        const isSelected =
          stat.id === "all"
            ? !activeQuadrantFilter || activeQuadrantFilter === "all"
            : activeQuadrantFilter === stat.id;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => {
              if (stat.id === "all" || stat.id === activeQuadrantFilter) {
                onSelectQuadrant(null);
              } else {
                onSelectQuadrant(stat.id);
              }
            }}
            className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer bg-white shadow-2xs ${
              isSelected
                ? `ring-2 ${stat.activeRing} bg-zinc-50/50 shadow-xs`
                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/40"
            }`}
            title={
              stat.id === "all"
                ? "Tampilkan seluruh ide"
                : `Klik untuk menyaring kuadran ${stat.badge}`
            }
          >
            {/* Baris Atas: Badge Kategori di Kiri & Subtitle di Kanan */}
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <span
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${stat.badgeStyle}`}
              >
                {stat.badge}
              </span>
              <span className="text-xs text-zinc-500 font-medium truncate">
                {stat.subtitle}
              </span>
            </div>

            {/* Baris Bawah: Angka Jumlah di Kiri & Keterangan di Kanan */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                {stat.count}
              </span>
              <span className="text-xs text-zinc-500 text-right truncate">
                {stat.detail}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
