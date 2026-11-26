import { Search, UserCheck, ShoppingBag, Store } from "lucide-react";

export default function FilterBar({
  targetFilter,
  onTargetFilterChange,
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-0.5 pb-0.5">
      {/* Target Filter Tabs: Grid 3 Kolom di Mobile, Flex di Desktop */}
      <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 p-1 bg-zinc-100 rounded-xl sm:rounded-lg border border-zinc-200 w-full sm:w-auto">
        {targetFilters.map((tab) => {
          const Icon = tab.icon;
          const isActive = targetFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTargetFilterChange(tab.id)}
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg sm:rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer touch-manipulation min-h-[38px] sm:min-h-0 ${
                isActive
                  ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 active:bg-zinc-200/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{tab.label}</span>
              <span
                className={`ml-0.5 text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ${
                  isActive
                    ? "bg-zinc-100 text-zinc-800 font-bold"
                    : "bg-zinc-200/70 text-zinc-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64 lg:w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari ide fitur..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl sm:rounded-md placeholder-zinc-400 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all min-h-[38px] sm:min-h-0"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
            title="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
