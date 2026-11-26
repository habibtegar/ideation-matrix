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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 lg:gap-3.5">
      {stats.map((stat) => {
        const isSelected =
          stat.id === "all"
            ? !activeQuadrantFilter || activeQuadrantFilter === "all"
            : activeQuadrantFilter === stat.id;
        const isTotalCard = stat.id === "all";

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
            className={`text-left p-2.5 sm:p-3.5 lg:p-4 rounded-xl border transition-all cursor-pointer bg-white shadow-2xs touch-manipulation min-w-0 ${
              isTotalCard ? "col-span-2 md:col-span-1" : "col-span-1"
            } ${
              isSelected
                ? `ring-2 ${stat.activeRing} bg-zinc-50/50 shadow-xs`
                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/40 active:bg-zinc-100"
            }`}
            title={
              stat.id === "all"
                ? "Tampilkan seluruh ide"
                : `Klik untuk menyaring kuadran ${stat.badge}`
            }
          >
            {/* Tampilan Khusus Hero untuk TOTAL IDE pada Mobile */}
            {isTotalCard ? (
              <div className="flex items-center justify-between gap-3 md:block">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 md:mb-2.5 lg:mb-3">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider border ${stat.badgeStyle}`}
                    >
                      {stat.badge}
                    </span>
                    <span className="text-[10px] sm:text-xs text-zinc-500 font-medium truncate">
                      {stat.subtitle}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-zinc-500 block md:hidden">
                    {stat.detail}
                  </span>
                </div>

                <div className="flex items-baseline md:justify-between gap-2">
                  <span className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                    {stat.count}
                  </span>
                  <span className="text-xs text-zinc-500 text-right truncate hidden md:inline">
                    {stat.detail}
                  </span>
                </div>
              </div>
            ) : (
              /* Kartu Kuadran I, II, III, IV */
              <div className="flex flex-col justify-between h-full">
                {/* Baris Atas: Badge Kategori & Subtitle */}
                <div className="flex items-center justify-between gap-1 mb-2 sm:mb-2.5 lg:mb-3 flex-wrap min-w-0">
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] xs:text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider border truncate max-w-full ${stat.badgeStyle}`}
                  >
                    {stat.badge}
                  </span>
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-medium truncate">
                    {stat.subtitle}
                  </span>
                </div>

                {/* Baris Bawah: Angka Jumlah & Keterangan */}
                <div className="flex items-baseline justify-between gap-1.5 mt-auto">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                    {stat.count}
                  </span>
                  <span className="text-[9.5px] xs:text-[10px] sm:text-xs text-zinc-500 text-right truncate min-w-0">
                    {stat.detail}
                  </span>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
