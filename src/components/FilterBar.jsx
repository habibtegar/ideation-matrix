import { LayoutGrid, Table, Search, UserCheck, ShoppingBag, Store } from "lucide-react";

export default function FilterBar({
  targetFilter,
  onTargetFilterChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchQueryChange,
  ideasCount,
}) {
  const targetFilters = [
    { id: "Semua", label: "Semua", count: ideasCount.all, icon: UserCheck },
    { id: "Pembeli", label: "Pembeli", count: ideasCount.pembeli, icon: ShoppingBag },
    { id: "Penjual", label: "Penjual", count: ideasCount.penjual, icon: Store },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
      {/* Target Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200 self-start sm:self-auto">
        {targetFilters.map((tab) => {
          const Icon = tab.icon;
          const isActive = targetFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTargetFilterChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-zinc-500" />
              <span>{tab.label}</span>
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-zinc-100 text-zinc-800"
                    : "bg-zinc-200/60 text-zinc-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari fitur ide..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-zinc-200 rounded-md placeholder-zinc-400 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
          />
        </div>

        {/* View Switch: Matrix View vs Table View */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-lg border border-zinc-200 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("matrix")}
            title="Matrix View (Diagram Kartesius 4 Kuadran)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "matrix"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Matrix View</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            title="Table View (Rangkuman LKPD Tabel)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Table View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
