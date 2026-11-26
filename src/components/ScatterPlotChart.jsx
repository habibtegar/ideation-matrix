import { useState, useMemo } from "react";
import {
  ScatterChart,
  ShoppingBag,
  Store,
  Eye,
  EyeOff,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

// SVG Chart Geometry Constants
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 500;

const PADDING_LEFT = 60;
const PADDING_RIGHT = 35;
const PADDING_TOP = 30;
const PADDING_BOTTOM = 45;

const INNER_WIDTH = VIEW_BOX_WIDTH - PADDING_LEFT - PADDING_RIGHT; // 665
const INNER_HEIGHT = VIEW_BOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM; // 425

// Dividing lines: EXACTLY in the horizontal and vertical center (50% / 50%)
// Menghasilkan 4 kotak kuadran yang benar-benar simetris, seimbang, dan proporsional
const BOUNDARY_X = PADDING_LEFT + INNER_WIDTH / 2; // 392.5
const BOUNDARY_Y = PADDING_TOP + INNER_HEIGHT / 2; // 242.5

/**
 * Pemetaan koordinat Feasibility (X) dan Impact (Y)
 * Tanpa angka linear 1-5 yang mendistorsi kotak kuadran.
 * - Kuadran kiri (II & III): Skor Rendah (1–3)
 * - Kuadran kanan (I & IV): Skor Tinggi (4–5)
 * - Kuadran atas (I & II): Skor Tinggi (4–5)
 * - Kuadran bawah (III & IV): Skor Rendah (1–3)
 */
const getX = (feasibility) => {
  const val = Number(feasibility);
  if (val <= 3.5) {
    // Sisi Kiri (Kuadran II & III, F: 1..3.5)
    const minX = PADDING_LEFT + 55;
    const maxX = BOUNDARY_X - 55;
    const clamped = Math.max(1, Math.min(3.5, val));
    return minX + ((clamped - 1) / 2.5) * (maxX - minX);
  } else {
    // Sisi Kanan (Kuadran I & IV, F: 3.5..5)
    const minX = BOUNDARY_X + 65;
    const maxX = PADDING_LEFT + INNER_WIDTH - 65;
    const clamped = Math.max(3.5, Math.min(5, val));
    return minX + ((clamped - 3.5) / 1.5) * (maxX - minX);
  }
};

const getY = (impact) => {
  const val = Number(impact);
  if (val >= 3.5) {
    // Sisi Atas (Kuadran I & II, I: 3.5..5)
    const minY = PADDING_TOP + 80; // area aman di bawah header badge
    const maxY = BOUNDARY_Y - 40; // area aman di atas garis pembatas
    const clamped = Math.max(3.5, Math.min(5, val));
    return minY + ((5 - clamped) / 1.5) * (maxY - minY);
  } else {
    // Sisi Bawah (Kuadran III & IV, I: 1..3.5)
    const minY = BOUNDARY_Y + 40; // area aman di bawah garis pembatas
    const maxY = PADDING_TOP + INNER_HEIGHT - 65; // area aman di atas footer badge
    const clamped = Math.max(1, Math.min(3.5, val));
    return minY + ((3.5 - clamped) / 2.5) * (maxY - minY);
  }
};

/**
 * ScatterPlotChart
 * Visualisasi Scatter Plot Interaktif Feasibility vs Impact
 * - 4 Kotak Kuadran Simetris & Proporsional (50% x 50%)
 * - Angka 1-5 pada sumbu ditiadakan agar proporsi kotak kuadran seimbang dan tidak terdistorsi
 * - Sumbu menampilkan keterangan kategori yang jelas: Rendah (1-3) & Tinggi (4-5)
 * - Nomor identitas pada setiap titik (#1 - #N) sesuai urutan tabel LKPD
 * - Tooltip dinamis saat hover & Popover detail saat titik diklik
 * - Legenda interaktif untuk tampilkan/sembunyikan kuadran
 */
export default function ScatterPlotChart({ ideas = [], onViewDetail }) {
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [hoveredIdeaId, setHoveredIdeaId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Quadrant visibility toggle state (All visible by default)
  const [visibleQuadrants, setVisibleQuadrants] = useState({
    I: true,
    II: true,
    III: true,
    IV: true,
  });

  const isAnyQuadrantHidden = useMemo(() => {
    return Object.values(visibleQuadrants).some((v) => !v);
  }, [visibleQuadrants]);

  const toggleQuadrantVisibility = (quadId) => {
    setVisibleQuadrants((prev) => ({
      ...prev,
      [quadId]: !prev[quadId],
    }));
  };

  const showAllQuadrants = () => {
    setVisibleQuadrants({
      I: true,
      II: true,
      III: true,
      IV: true,
    });
  };

  // Filter ideas with valid scores and assign sequence numbers (#1 - #N) matching Table View
  const plottableIdeas = useMemo(() => {
    return ideas
      .map((idea, index) => ({
        ...idea,
        seqNumber: index + 1,
      }))
      .filter((item) => item.feasibility != null && item.impact != null);
  }, [ideas]);

  // Quadrant stats derived directly from actual ideas
  const quadrantCounts = useMemo(() => {
    return {
      I: ideas.filter((item) => item.quadrant === "I").length,
      II: ideas.filter((item) => item.quadrant === "II").length,
      III: ideas.filter((item) => item.quadrant === "III").length,
      IV: ideas.filter((item) => item.quadrant === "IV").length,
    };
  }, [ideas]);

  // Group ideas by coordinate to spread overlapping dots without modifying real coordinates
  const plottedPoints = useMemo(() => {
    const groups = {};
    plottableIdeas.forEach((idea) => {
      const key = `${idea.feasibility}_${idea.impact}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(idea);
    });

    const result = [];
    Object.entries(groups).forEach(([key, groupItems]) => {
      const [fStr, iStr] = key.split("_");
      const f = parseFloat(fStr);
      const i = parseFloat(iStr);
      const centerX = getX(f);
      const centerY = getY(i);
      const count = groupItems.length;

      groupItems.forEach((idea, index) => {
        let cx;
        let cy;

        if (count === 1) {
          cx = centerX;
          cy = centerY;
        } else if (count === 2) {
          // Spread horizontally
          const dx = index === 0 ? -16 : 16;
          cx = centerX + dx;
          cy = centerY;
        } else if (count === 3) {
          // Triangular spread
          if (index === 0) {
            cx = centerX;
            cy = centerY - 15;
          } else if (index === 1) {
            cx = centerX - 15;
            cy = centerY + 10;
          } else {
            cx = centerX + 15;
            cy = centerY + 10;
          }
        } else if (count === 4) {
          // Diamond spread
          const offsets = [
            { dx: 0, dy: -16 },
            { dx: 16, dy: 0 },
            { dx: 0, dy: 16 },
            { dx: -16, dy: 0 },
          ];
          cx = centerX + offsets[index].dx;
          cy = centerY + offsets[index].dy;
        } else {
          // Radial distribution
          const radius = 18;
          const angle = (2 * Math.PI * index) / count - Math.PI / 2;
          cx = centerX + radius * Math.cos(angle);
          cy = centerY + radius * Math.sin(angle);
        }

        result.push({
          idea,
          cx,
          cy,
          centerX,
          centerY,
          clusterCount: count,
          clusterIndex: index,
        });
      });
    });

    return result;
  }, [plottableIdeas]);

  // Color mapping configuration per quadrant
  const quadrantConfig = {
    I: {
      name: "Quick Wins",
      fill: "#10b981", // emerald-500
      stroke: "#047857", // emerald-700
      ring: "#a7f3d0", // emerald-200
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      rectFill: "#ecfdf5", // emerald-50
      textColor: "fill-emerald-800",
      subTextColor: "fill-emerald-700",
      pillBorder: "#a7f3d0",
      badgeColor: "#059669",
    },
    II: {
      name: "Major Projects",
      fill: "#3b82f6", // blue-500
      stroke: "#1d4ed8", // blue-700
      ring: "#bfdbfe", // blue-200
      badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
      rectFill: "#eff6ff", // blue-50
      textColor: "fill-blue-800",
      subTextColor: "fill-blue-700",
      pillBorder: "#bfdbfe",
      badgeColor: "#2563eb",
    },
    III: {
      name: "Time Sinks",
      fill: "#f43f5e", // rose-500
      stroke: "#be123c", // rose-700
      ring: "#fecdd3", // rose-200
      badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
      rectFill: "#fff1f2", // rose-50
      textColor: "fill-rose-800",
      subTextColor: "fill-rose-700",
      pillBorder: "#fecdd3",
      badgeColor: "#e11d48",
    },
    IV: {
      name: "Fill-Ins",
      fill: "#f59e0b", // amber-500
      stroke: "#b45309", // amber-700
      ring: "#fde68a", // amber-200
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      rectFill: "#fffbeb", // amber-50
      textColor: "fill-amber-800",
      subTextColor: "fill-amber-700",
      pillBorder: "#fde68a",
      badgeColor: "#d97706",
    },
    pool: {
      name: "Idea Pool",
      fill: "#71717a", // zinc-500
      stroke: "#3f3f46", // zinc-700
      ring: "#e4e4e7", // zinc-200
      badgeBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
      rectFill: "#f4f4f5",
      textColor: "fill-zinc-700",
      subTextColor: "fill-zinc-500",
      pillBorder: "#d4d4d8",
      badgeColor: "#52525b",
    },
  };

  // Currently hovered point
  const hoveredPoint = plottedPoints.find((p) => p.idea.id === hoveredIdeaId);
  // Currently selected point (via click)
  const selectedPoint = plottedPoints.find((p) => p.idea.id === selectedIdeaId);

  // Active idea to display in bottom detail panel (selected has priority, then hovered)
  const activeIdea = selectedPoint?.idea || hoveredPoint?.idea;

  // Handle dot click
  const handlePointClick = (ideaId, e) => {
    e.stopPropagation();
    setSelectedIdeaId((prev) => (prev === ideaId ? null : ideaId));
  };

  return (
    <section
      aria-label="Grafik Analisis Feasibility vs Impact"
      className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-5 shadow-2xs transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
            <ScatterChart className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                Grafik Analisis Feasibility vs Impact
              </h2>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                Matriks Prioritas
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sebaran 4 kuadran simetris fitur produk UMKM berdasarkan skor Feasibility (Sumbu X) dan Impact (Sumbu Y).
            </p>
          </div>
        </div>

        {/* Toggle Collapse/Expand */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          title={isCollapsed ? "Buka Tampilan Grafik" : "Sembunyikan Grafik"}
        >
          <span>{isCollapsed ? "Buka Grafik" : "Tutup Grafik"}</span>
          {isCollapsed ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="pt-3.5 space-y-4">
          {/* Interactive Legend Bar (with Toggle Show/Hide for each Quadrant) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <span className="font-semibold text-zinc-700 text-xs mr-1">
                  Filter Legenda Kuadran:
                </span>
                {isAnyQuadrantHidden && (
                  <button
                    type="button"
                    onClick={showAllQuadrants}
                    className="sm:hidden inline-flex items-center gap-1 text-[11px] text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer"
                  >
                    <span>Tampilkan Semua</span>
                  </button>
                )}
              </div>

              {/* 4 Quadrant Filter Buttons in a 2x2 grid on mobile, inline-flex on sm+ */}
              <div className="grid grid-cols-2 sm:inline-flex sm:flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                {/* Kuadran I: Quick Wins */}
                <button
                  type="button"
                  onClick={() => toggleQuadrantVisibility("I")}
                  className={`inline-flex items-center justify-between sm:justify-start gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                    visibleQuadrants.I
                      ? "bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 border-emerald-300 shadow-2xs"
                      : "bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60 hover:opacity-80"
                  }`}
                  title={
                    visibleQuadrants.I
                      ? "Klik untuk sembunyikan titik Kuadran I"
                      : "Klik untuk tampilkan titik Kuadran I"
                  }
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {visibleQuadrants.I ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs shrink-0"></span>
                    ) : (
                      <EyeOff className="w-3 h-3 text-zinc-400 shrink-0" />
                    )}
                    <span className={`truncate ${!visibleQuadrants.I ? "line-through" : "font-semibold"}`}>
                      <span className="sm:hidden">Q.I Quick Wins</span>
                      <span className="hidden sm:inline">Kuadran I: Quick Wins</span>
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full border shrink-0 ${
                      visibleQuadrants.I
                        ? "bg-white text-emerald-800 border-emerald-200"
                        : "bg-zinc-200/60 text-zinc-400 border-zinc-200"
                    }`}
                  >
                    {quadrantCounts.I}
                  </span>
                </button>

                {/* Kuadran II: Major Projects */}
                <button
                  type="button"
                  onClick={() => toggleQuadrantVisibility("II")}
                  className={`inline-flex items-center justify-between sm:justify-start gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                    visibleQuadrants.II
                      ? "bg-blue-50 hover:bg-blue-100/70 text-blue-800 border-blue-300 shadow-2xs"
                      : "bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60 hover:opacity-80"
                  }`}
                  title={
                    visibleQuadrants.II
                      ? "Klik untuk sembunyikan titik Kuadran II"
                      : "Klik untuk tampilkan titik Kuadran II"
                  }
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {visibleQuadrants.II ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-2xs shrink-0"></span>
                    ) : (
                      <EyeOff className="w-3 h-3 text-zinc-400 shrink-0" />
                    )}
                    <span className={`truncate ${!visibleQuadrants.II ? "line-through" : "font-semibold"}`}>
                      <span className="sm:hidden">Q.II Major Projects</span>
                      <span className="hidden sm:inline">Kuadran II: Major Projects</span>
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full border shrink-0 ${
                      visibleQuadrants.II
                        ? "bg-white text-blue-800 border-blue-200"
                        : "bg-zinc-200/60 text-zinc-400 border-zinc-200"
                    }`}
                  >
                    {quadrantCounts.II}
                  </span>
                </button>

                {/* Kuadran III: Time Sinks */}
                <button
                  type="button"
                  onClick={() => toggleQuadrantVisibility("III")}
                  className={`inline-flex items-center justify-between sm:justify-start gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                    visibleQuadrants.III
                      ? "bg-rose-50 hover:bg-rose-100/70 text-rose-800 border-rose-300 shadow-2xs"
                      : "bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60 hover:opacity-80"
                  }`}
                  title={
                    visibleQuadrants.III
                      ? "Klik untuk sembunyikan titik Kuadran III"
                      : "Klik untuk tampilkan titik Kuadran III"
                  }
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {visibleQuadrants.III ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-2xs shrink-0"></span>
                    ) : (
                      <EyeOff className="w-3 h-3 text-zinc-400 shrink-0" />
                    )}
                    <span className={`truncate ${!visibleQuadrants.III ? "line-through" : "font-semibold"}`}>
                      <span className="sm:hidden">Q.III Time Sinks</span>
                      <span className="hidden sm:inline">Kuadran III: Time Sinks</span>
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full border shrink-0 ${
                      visibleQuadrants.III
                        ? "bg-white text-rose-800 border-rose-200"
                        : "bg-zinc-200/60 text-zinc-400 border-zinc-200"
                    }`}
                  >
                    {quadrantCounts.III}
                  </span>
                </button>

                {/* Kuadran IV: Fill-Ins */}
                <button
                  type="button"
                  onClick={() => toggleQuadrantVisibility("IV")}
                  className={`inline-flex items-center justify-between sm:justify-start gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                    visibleQuadrants.IV
                      ? "bg-amber-50 hover:bg-amber-100/70 text-amber-800 border-amber-300 shadow-2xs"
                      : "bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60 hover:opacity-80"
                  }`}
                  title={
                    visibleQuadrants.IV
                      ? "Klik untuk sembunyikan titik Kuadran IV"
                      : "Klik untuk tampilkan titik Kuadran IV"
                  }
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {visibleQuadrants.IV ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs shrink-0"></span>
                    ) : (
                      <EyeOff className="w-3 h-3 text-zinc-400 shrink-0" />
                    )}
                    <span className={`truncate ${!visibleQuadrants.IV ? "line-through" : "font-semibold"}`}>
                      <span className="sm:hidden">Q.IV Fill-Ins</span>
                      <span className="hidden sm:inline">Kuadran IV: Fill-Ins</span>
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full border shrink-0 ${
                      visibleQuadrants.IV
                        ? "bg-white text-amber-800 border-amber-200"
                        : "bg-zinc-200/60 text-zinc-400 border-zinc-200"
                    }`}
                  >
                    {quadrantCounts.IV}
                  </span>
                </button>
              </div>
            </div>

            {/* Restore all quadrants button if any quadrant is hidden (desktop) */}
            {isAnyQuadrantHidden && (
              <button
                type="button"
                onClick={showAllQuadrants}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer shrink-0"
              >
                <span>Tampilkan Semua Kuadran</span>
              </button>
            )}
          </div>

          {/* Scatter Plot Chart Area */}
          <div
            className="relative w-full rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs"
            onClick={() => setSelectedIdeaId(null)}
          >
            {/* SVG Visualizer Container (100% fluid responsive, zero horizontal scrollbar) */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
                className="w-full h-auto select-none block"
                style={{ aspectRatio: `${VIEW_BOX_WIDTH} / ${VIEW_BOX_HEIGHT}` }}
              >
                <defs>
                  {/* Clip path for quadrant background fills */}
                  <clipPath id="chart-inner-bounds">
                    <rect
                      x={PADDING_LEFT}
                      y={PADDING_TOP}
                      width={INNER_WIDTH}
                      height={INNER_HEIGHT}
                      rx="10"
                      ry="10"
                    />
                  </clipPath>

                  {/* Drop shadow for points */}
                  <filter
                    id="point-shadow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="1.5"
                      stdDeviation="2"
                      floodOpacity="0.25"
                    />
                  </filter>

                  {/* Drop shadow for quadrant header badge cards */}
                  <filter
                    id="badge-shadow"
                    x="-10%"
                    y="-10%"
                    width="125%"
                    height="125%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="1"
                      stdDeviation="1.5"
                      floodOpacity="0.08"
                    />
                  </filter>
                </defs>

                {/* 1. Background Warna 4 Kuadran yang Proporsional & Simetris (50% x 50%) */}
                <g clipPath="url(#chart-inner-bounds)">
                  {/* Top-Left: Kuadran II (Major Projects) */}
                  <rect
                    x={PADDING_LEFT}
                    y={PADDING_TOP}
                    width={BOUNDARY_X - PADDING_LEFT}
                    height={BOUNDARY_Y - PADDING_TOP}
                    fill={quadrantConfig.II.rectFill}
                    fillOpacity="0.55"
                  />
                  {/* Top-Right: Kuadran I (Quick Wins) */}
                  <rect
                    x={BOUNDARY_X}
                    y={PADDING_TOP}
                    width={PADDING_LEFT + INNER_WIDTH - BOUNDARY_X}
                    height={BOUNDARY_Y - PADDING_TOP}
                    fill={quadrantConfig.I.rectFill}
                    fillOpacity="0.55"
                  />
                  {/* Bottom-Left: Kuadran III (Time Sinks) */}
                  <rect
                    x={PADDING_LEFT}
                    y={BOUNDARY_Y}
                    width={BOUNDARY_X - PADDING_LEFT}
                    height={PADDING_TOP + INNER_HEIGHT - BOUNDARY_Y}
                    fill={quadrantConfig.III.rectFill}
                    fillOpacity="0.55"
                  />
                  {/* Bottom-Right: Kuadran IV (Fill-Ins) */}
                  <rect
                    x={BOUNDARY_X}
                    y={BOUNDARY_Y}
                    width={PADDING_LEFT + INNER_WIDTH - BOUNDARY_X}
                    height={PADDING_TOP + INNER_HEIGHT - BOUNDARY_Y}
                    fill={quadrantConfig.IV.rectFill}
                    fillOpacity="0.55"
                  />
                </g>

                {/* 2. Outer Chart Boundary Border */}
                <rect
                  x={PADDING_LEFT}
                  y={PADDING_TOP}
                  width={INNER_WIDTH}
                  height={INNER_HEIGHT}
                  rx="10"
                  ry="10"
                  fill="none"
                  stroke="#d4d4d8"
                  strokeWidth="1.5"
                />

                {/* 3. Garis Pembatas Kuadran Horizontal & Vertikal Tepat di Tengah (50% / 50%) */}
                {/* Vertical Divider */}
                <line
                  x1={BOUNDARY_X}
                  y1={PADDING_TOP}
                  x2={BOUNDARY_X}
                  y2={PADDING_TOP + INNER_HEIGHT}
                  stroke="#71717a"
                  strokeWidth="1.8"
                  strokeDasharray="5 4"
                />
                {/* Horizontal Divider */}
                <line
                  x1={PADDING_LEFT}
                  y1={BOUNDARY_Y}
                  x2={PADDING_LEFT + INNER_WIDTH}
                  y2={BOUNDARY_Y}
                  stroke="#71717a"
                  strokeWidth="1.8"
                  strokeDasharray="5 4"
                />

                {/* Central Intersection Crosshair Point */}
                <circle
                  cx={BOUNDARY_X}
                  cy={BOUNDARY_Y}
                  r="5"
                  fill="#ffffff"
                  stroke="#71717a"
                  strokeWidth="1.8"
                />
                <circle cx={BOUNDARY_X} cy={BOUNDARY_Y} r="2" fill="#52525b" />

                {/* ========================================================
                    4. DEDICATED QUADRANT HEADER CARDS
                    Posisi seragam & seimbang di masing-masing kuadran
                    ======================================================== */}

                {/* Top-Right: Kuadran I (Quick Wins) */}
                <g
                  transform={`translate(${BOUNDARY_X + 14}, ${PADDING_TOP + 10})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="200"
                    height="32"
                    rx="6"
                    fill="#ffffff"
                    stroke="#a7f3d0"
                    strokeWidth="1.2"
                    filter="url(#badge-shadow)"
                  />
                  <rect x="4" y="4" width="24" height="24" rx="4" fill="#059669" />
                  <text
                    x="16"
                    y="16"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[12px] font-bold font-serif fill-white"
                  >
                    I
                  </text>
                  <text
                    x="34"
                    y="14"
                    className="text-[11px] font-bold fill-zinc-900 tracking-tight"
                  >
                    KUADRAN I • QUICK WINS
                  </text>
                  <text
                    x="34"
                    y="25"
                    className="text-[9.5px] font-mono fill-emerald-700 font-semibold"
                  >
                    Feasibility ≥ 4 &amp; Impact ≥ 4
                  </text>
                </g>

                {/* Top-Left: Kuadran II (Major Projects) */}
                <g
                  transform={`translate(${PADDING_LEFT + 14}, ${PADDING_TOP + 10})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="200"
                    height="32"
                    rx="6"
                    fill="#ffffff"
                    stroke="#bfdbfe"
                    strokeWidth="1.2"
                    filter="url(#badge-shadow)"
                  />
                  <rect x="4" y="4" width="24" height="24" rx="4" fill="#2563eb" />
                  <text
                    x="16"
                    y="16"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[12px] font-bold font-serif fill-white"
                  >
                    II
                  </text>
                  <text
                    x="34"
                    y="14"
                    className="text-[11px] font-bold fill-zinc-900 tracking-tight"
                  >
                    KUADRAN II • MAJOR PROJECTS
                  </text>
                  <text
                    x="34"
                    y="25"
                    className="text-[9.5px] font-mono fill-blue-700 font-semibold"
                  >
                    Feasibility &lt; 4 &amp; Impact ≥ 4
                  </text>
                </g>

                {/* Bottom-Left: Kuadran III (Time Sinks) */}
                <g
                  transform={`translate(${PADDING_LEFT + 14}, ${
                    PADDING_TOP + INNER_HEIGHT - 42
                  })`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="200"
                    height="32"
                    rx="6"
                    fill="#ffffff"
                    stroke="#fecdd3"
                    strokeWidth="1.2"
                    filter="url(#badge-shadow)"
                  />
                  <rect x="4" y="4" width="24" height="24" rx="4" fill="#e11d48" />
                  <text
                    x="16"
                    y="16"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[12px] font-bold font-serif fill-white"
                  >
                    III
                  </text>
                  <text
                    x="34"
                    y="14"
                    className="text-[11px] font-bold fill-zinc-900 tracking-tight"
                  >
                    KUADRAN III • TIME SINKS
                  </text>
                  <text
                    x="34"
                    y="25"
                    className="text-[9.5px] font-mono fill-rose-700 font-semibold"
                  >
                    Feasibility &lt; 4 &amp; Impact &lt; 4
                  </text>
                </g>

                {/* Bottom-Right: Kuadran IV (Fill-Ins) */}
                <g
                  transform={`translate(${BOUNDARY_X + 14}, ${
                    PADDING_TOP + INNER_HEIGHT - 42
                  })`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="200"
                    height="32"
                    rx="6"
                    fill="#ffffff"
                    stroke="#fde68a"
                    strokeWidth="1.2"
                    filter="url(#badge-shadow)"
                  />
                  <rect x="4" y="4" width="24" height="24" rx="4" fill="#d97706" />
                  <text
                    x="16"
                    y="16"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[12px] font-bold font-serif fill-white"
                  >
                    IV
                  </text>
                  <text
                    x="34"
                    y="14"
                    className="text-[11px] font-bold fill-zinc-900 tracking-tight"
                  >
                    KUADRAN IV • FILL-INS
                  </text>
                  <text
                    x="34"
                    y="25"
                    className="text-[9.5px] font-mono fill-amber-700 font-semibold"
                  >
                    Feasibility ≥ 4 &amp; Impact &lt; 4
                  </text>
                </g>

                {/* ========================================================
                    5. LABEL SUMBU X & SUMBU Y
                    ======================================================== */}

                {/* Judul Sumbu X */}
                <g transform={`translate(${PADDING_LEFT + INNER_WIDTH / 2}, ${VIEW_BOX_HEIGHT - 12})`}>
                  <text
                    textAnchor="middle"
                    className="text-[11px] font-bold font-sans fill-zinc-900 tracking-wider uppercase"
                  >
                    SUMBU X: FEASIBILITY (KEMUDAHAN IMPLEMENTASI) →
                  </text>
                </g>

                {/* Judul Sumbu Y (Rotated on Left) */}
                <g transform={`translate(24, ${PADDING_TOP + INNER_HEIGHT / 2}) rotate(-90)`}>
                  <text
                    textAnchor="middle"
                    className="text-[11px] font-bold font-sans fill-zinc-900 tracking-wider uppercase"
                  >
                    SUMBU Y: IMPACT (DAMPAK BISNIS) →
                  </text>
                </g>

                {/* 6. Anti-Overlap Coordinate Hub & Spoke Lines for clusters with >1 items */}
                {plottedPoints
                  .filter((p) => p.clusterCount > 1 && p.clusterIndex === 0)
                  .map((cluster) => {
                    const hasVisibleItem = plottedPoints.some(
                      (p) =>
                        p.centerX === cluster.centerX &&
                        p.centerY === cluster.centerY &&
                        visibleQuadrants[p.idea.quadrant] !== false
                    );
                    if (!hasVisibleItem) return null;

                    return (
                      <g key={`cluster-${cluster.centerX}-${cluster.centerY}`}>
                        {/* Spoke lines connecting the true coordinate center to each offset point */}
                        {plottedPoints
                          .filter(
                            (p) =>
                              p.centerX === cluster.centerX &&
                              p.centerY === cluster.centerY &&
                              visibleQuadrants[p.idea.quadrant] !== false
                          )
                          .map((p) => (
                            <line
                              key={`spoke-${p.idea.id}`}
                              x1={cluster.centerX}
                              y1={cluster.centerY}
                              x2={p.cx}
                              y2={p.cy}
                              stroke="#cbd5e1"
                              strokeWidth="1.2"
                              strokeDasharray="2 2"
                            />
                          ))}

                        {/* Coordinate Hub Marker */}
                        <circle
                          cx={cluster.centerX}
                          cy={cluster.centerY}
                          r="3"
                          fill="#94a3b8"
                        />
                        <text
                          x={cluster.centerX}
                          y={cluster.centerY - (cluster.clusterCount >= 3 ? 24 : 14)}
                          textAnchor="middle"
                          className="text-[9px] font-mono font-semibold fill-zinc-400 select-none"
                        >
                          ({plottedPoints.find((p) => p.centerX === cluster.centerX)?.idea.feasibility},
                          {plottedPoints.find((p) => p.centerX === cluster.centerX)?.idea.impact})
                        </text>
                      </g>
                    );
                  })}

                {/* 7. Data Points (One numbered dot per idea) */}
                {plottedPoints.map(({ idea, cx, cy }) => {
                  const qid = idea.quadrant || "pool";
                  const conf = quadrantConfig[qid] || quadrantConfig.pool;
                  const isVisible = visibleQuadrants[qid] !== false;

                  if (!isVisible) return null;

                  const isHovered = hoveredIdeaId === idea.id;
                  const isSelected = selectedIdeaId === idea.id;
                  const isActive = isHovered || isSelected;

                  return (
                    <g
                      key={idea.id}
                      className="cursor-pointer transition-transform duration-200 ease-out"
                      onMouseEnter={() => setHoveredIdeaId(idea.id)}
                      onMouseLeave={() => setHoveredIdeaId(null)}
                      onClick={(e) => handlePointClick(idea.id, e)}
                    >
                      {/* Expanded Invisible Touch Target for easy finger tapping on mobile */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="24"
                        fill="transparent"
                        className="cursor-pointer"
                      />

                      {/* Active outer pulse ring */}
                      {isActive && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="20"
                          fill={conf.fill}
                          fillOpacity="0.25"
                          className="animate-pulse"
                        />
                      )}

                      {/* Selected Indicator Ring (Targeting Reticle) */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="16"
                          fill="none"
                          stroke={conf.stroke}
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Main Point Circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? "13.5" : "11"}
                        fill={conf.fill}
                        stroke="#ffffff"
                        strokeWidth={isActive ? "2.5" : "2"}
                        filter="url(#point-shadow)"
                        className="transition-all duration-200 ease-out"
                      />

                      {/* Point Identity Number (#1, #2, ..., #10) */}
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`font-mono font-bold fill-white select-none pointer-events-none ${
                          idea.seqNumber >= 10 ? "text-[10px]" : "text-[11px]"
                        }`}
                      >
                        {idea.seqNumber}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Tooltip Overlay (Direction-aware: flips below point if point is in upper half) */}
            {hoveredPoint && !selectedIdeaId && visibleQuadrants[hoveredPoint.idea.quadrant] !== false && (
              <div
                className={`absolute z-30 pointer-events-none transform -translate-x-1/2 bg-zinc-900 text-white rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs shadow-xl border border-zinc-700/80 animate-in fade-in zoom-in-95 duration-150 max-w-[210px] sm:max-w-xs ${
                  hoveredPoint.cy < VIEW_BOX_HEIGHT / 2
                    ? "translate-y-3 sm:translate-y-4"
                    : "-translate-y-full -mt-3 sm:-mt-3.5"
                }`}
                style={{
                  left: `${(hoveredPoint.cx / VIEW_BOX_WIDTH) * 100}%`,
                  top: `${(hoveredPoint.cy / VIEW_BOX_HEIGHT) * 100}%`,
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                  <span className="bg-white/20 text-white px-1.5 py-0.2 rounded font-mono text-[10px]">
                    #{hoveredPoint.idea.seqNumber}
                  </span>
                  <span className="truncate">{hoveredPoint.idea.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-mono mt-1">
                  <span>Target: {hoveredPoint.idea.target}</span>
                  <span>•</span>
                  <span>
                    F:{hoveredPoint.idea.feasibility} I:{hoveredPoint.idea.impact} (Skor:{" "}
                    {(hoveredPoint.idea.feasibility ?? 0) + (hoveredPoint.idea.impact ?? 0)})
                  </span>
                </div>
                <div className="mt-1 text-[10px] font-semibold text-emerald-400">
                  {QUADRANTS[hoveredPoint.idea.quadrant]?.name || "Idea Pool"}
                </div>
              </div>
            )}

            {/* Empty State Banner if no plottable ideas exist */}
            {plottableIdeas.length === 0 && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="w-8 h-8 text-zinc-400 mb-2" />
                <h3 className="text-sm font-bold text-zinc-800">
                  Belum Ada Data Titik pada Grafik
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Tambahkan ide baru dengan skor Feasibility &amp; Impact (1–5) atau muat dataset LKPD untuk melihat sebaran titik koordinat.
                </p>
              </div>
            )}
          </div>

          {/* Popover / Panel Detail Titik yang Sedang Diklik atau Diarahkan */}
          {activeIdea && (
            <div
              className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-150 shadow-xs ${
                selectedIdeaId
                  ? "bg-zinc-900 text-white border-zinc-800 ring-2 ring-zinc-700"
                  : "bg-zinc-50 border-zinc-200 text-zinc-900"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Title & Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-mono text-xs font-bold shrink-0 ${
                        selectedIdeaId
                          ? "bg-white text-zinc-900"
                          : "bg-zinc-900 text-white"
                      }`}
                    >
                      #{activeIdea.seqNumber}
                    </span>

                    <h4
                      className={`text-sm font-bold tracking-tight ${
                        selectedIdeaId ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {activeIdea.title}
                    </h4>

                    {/* Target Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        selectedIdeaId
                          ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                          : "bg-white text-zinc-700 border-zinc-200"
                      }`}
                    >
                      {activeIdea.target === "Pembeli" ? (
                        <ShoppingBag className="w-3 h-3 text-zinc-400" />
                      ) : (
                        <Store className="w-3 h-3 text-zinc-400" />
                      )}
                      <span>{activeIdea.target}</span>
                    </span>

                    {/* Quadrant Badge */}
                    {activeIdea.quadrant && QUADRANTS[activeIdea.quadrant] && (
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          selectedIdeaId
                            ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                            : quadrantConfig[activeIdea.quadrant]?.badgeBg ||
                              "bg-zinc-100 text-zinc-700 border-zinc-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            QUADRANTS[activeIdea.quadrant]?.dotColor
                          }`}
                        ></span>
                        <span>
                          Kuadran {activeIdea.quadrant} •{" "}
                          {QUADRANTS[activeIdea.quadrant]?.name}
                        </span>
                      </span>
                    )}

                    {selectedIdeaId && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Target className="w-3 h-3" />
                        <span>Titik Terpilih</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      selectedIdeaId ? "text-zinc-300" : "text-zinc-600"
                    }`}
                  >
                    {activeIdea.description || "Tidak ada deskripsi rinci."}
                  </p>
                </div>

                {/* Score Pill & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-start shrink-0 self-start sm:self-auto">
                  {/* Score Pill */}
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs font-mono ${
                      selectedIdeaId
                        ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                        : "bg-white text-zinc-700 border-zinc-200"
                    }`}
                  >
                    <span>
                      Feas: <strong>{activeIdea.feasibility}/5</strong>
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span>
                      Imp: <strong>{activeIdea.impact}/5</strong>
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded ${
                        selectedIdeaId
                          ? "bg-zinc-700 text-white"
                          : "bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      Total: {(activeIdea.feasibility ?? 0) + (activeIdea.impact ?? 0)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Button Detail */}
                    {onViewDetail && (
                      <button
                        type="button"
                        onClick={() => onViewDetail(activeIdea)}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs ${
                          selectedIdeaId
                            ? "bg-white text-zinc-900 hover:bg-zinc-100"
                            : "bg-zinc-900 text-white hover:bg-zinc-800"
                        }`}
                        title="Lihat Detail Lengkap Fitur (Modal)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    )}

                    {/* Close Selection */}
                    {selectedIdeaId && (
                      <button
                        type="button"
                        onClick={() => setSelectedIdeaId(null)}
                        className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Tutup Panel Terpilih"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Helper Hint */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              <span>
                Tip: Setiap titik memiliki nomor ID (#1–#{plottableIdeas.length}) yang sinkron dengan nomor baris pada Tabel LKPD di bawah. Klik titik untuk memilih atau klik legenda untuk menyaring kuadran.
              </span>
            </span>
            <span className="font-mono text-zinc-400 hidden sm:inline">
              Terplot: {plottableIdeas.length} / {ideas.length} Ide
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
