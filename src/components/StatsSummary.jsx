import { QUADRANTS } from "../utils/matrixUtils";

export default function StatsSummary({ ideas, activeQuadrantFilter, onSelectQuadrant }) {
  const total = ideas.length;
  const countI = ideas.filter((item) => item.quadrant === "I").length;
  const countII = ideas.filter((item) => item.quadrant === "II").length;
  const countIII = ideas.filter((item) => item.quadrant === "III").length;
  const countIV = ideas.filter((item) => item.quadrant === "IV").length;
  const countPool = ideas.filter((item) => item.quadrant === "pool" || !item.quadrant).length;

  const stats = [
    {
      id: "all",
      label: "Total Ide",
      count: total,
      sub: "Seluruh Fitur",
      dot: "bg-zinc-900",
    },
    {
      id: "I",
      label: "Kuadran I",
      name: "Quick Wins",
      count: countI,
      sub: "F ≥ 4, I ≥ 4",
      dot: QUADRANTS.I.dotColor,
    },
    {
      id: "II",
      label: "Kuadran II",
      name: "Major Projects",
      count: countII,
      sub: "F < 4, I ≥ 4",
      dot: QUADRANTS.II.dotColor,
    },
    {
      id: "III",
      label: "Kuadran III",
      name: "Time Sinks",
      count: countIII,
      sub: "F < 4, I < 4",
      dot: QUADRANTS.III.dotColor,
    },
    {
      id: "IV",
      label: "Kuadran IV",
      name: "Fill-Ins",
      count: countIV,
      sub: "F ≥ 4, I < 4",
      dot: QUADRANTS.IV.dotColor,
    },
    {
      id: "pool",
      label: "Idea Pool",
      name: "Belum Diplot",
      count: countPool,
      sub: "Parkir / Draf",
      dot: QUADRANTS.pool.dotColor,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
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
            className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? "bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900"
                : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-medium text-zinc-500 truncate">
                {stat.label}
              </span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${stat.dot}`}></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                {stat.count}
              </span>
              {stat.name && (
                <span className="text-[11px] font-medium text-zinc-500 truncate">
                  {stat.name}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5 truncate font-mono">
              {stat.sub}
            </p>
          </button>
        );
      })}
    </div>
  );
}
