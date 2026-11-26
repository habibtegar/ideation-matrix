import { useState, useMemo } from "react";
import {
  ScatterChart,
  ShoppingBag,
  Store,
  Eye,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

// SVG Chart Geometry Constants (Compact, balanced & symmetrical layout)
const VIEW_BOX_WIDTH = 780;
const VIEW_BOX_HEIGHT = 440;

// Margins: Clean inner frame with comfortable spacing for labels
const PADDING_LEFT = 20;
const PADDING_RIGHT = 20;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 44; // Space for bottom axis (1 Sulit ... Feasibility / Kelayakan → ... 5 Sangat Layak)

const INNER_WIDTH = VIEW_BOX_WIDTH - PADDING_LEFT - PADDING_RIGHT; // 740
const INNER_HEIGHT = VIEW_BOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM; // 380

// Dividing lines: EXACTLY in the center (50% / 50% symmetrical quadrants)
const BOUNDARY_X = PADDING_LEFT + INNER_WIDTH / 2; // 390
const BOUNDARY_Y = PADDING_TOP + INNER_HEIGHT / 2; // 206

/**
 * Coordinate mapping for Feasibility (X) and Impact (Y)
 * Symmetrical 50%/50% split with 3.5 at the center
 * - Sisi Kiri (Kuadran II & IV): Skor Rendah (1 – 3.5)
 * - Sisi Kanan (Kuadran I & III): Skor Tinggi (3.5 – 5)
 * - Sisi Atas (Kuadran I & II): Skor Tinggi (3.5 – 5)
 * - Sisi Bawah (Kuadran III & IV): Skor Rendah (1 – 3.5)
 */
const getX = (feasibility) => {
  const val = Number(feasibility);
  if (val <= 3.5) {
    const minX = PADDING_LEFT + 75;
    const maxX = BOUNDARY_X - 55;
    const clamped = Math.max(1, Math.min(3.5, val));
    return minX + ((clamped - 1) / 2.5) * (maxX - minX);
  } else {
    const minX = BOUNDARY_X + 55;
    const maxX = PADDING_LEFT + INNER_WIDTH - 75;
    const clamped = Math.max(3.5, Math.min(5, val));
    return minX + ((clamped - 3.5) / 1.5) * (maxX - minX);
  }
};

const getY = (impact) => {
  const val = Number(impact);
  if (val >= 3.5) {
    // Sisi Atas: minY berjarak 78px dari PADDING_TOP agar titik tidak mepet dengan pill badge
    const minY = PADDING_TOP + 78;
    const maxY = BOUNDARY_Y - 45;
    const clamped = Math.max(3.5, Math.min(5, val));
    return minY + ((5 - clamped) / 1.5) * (maxY - minY);
  } else {
    // Sisi Bawah: maxY berjarak 65px dari bawah agar titik tidak mepet dengan pill badge bawah
    const minY = BOUNDARY_Y + 45;
    const maxY = PADDING_TOP + INNER_HEIGHT - 65;
    const clamped = Math.max(1, Math.min(3.5, val));
    return minY + ((3.5 - clamped) / 2.5) * (maxY - minY);
  }
};

export default function ScatterPlotChart({ ideas = [], onViewDetail }) {
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [hoveredIdeaId, setHoveredIdeaId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'I' | 'II' | 'III' | 'IV'

  // Filter ideas with valid scores and assign sequence numbers (#1 - #N)
  const plottableIdeas = useMemo(() => {
    return ideas
      .map((idea, index) => ({
        ...idea,
        seqNumber: idea.seqNumber || index + 1,
      }))
      .filter((item) => item.feasibility != null && item.impact != null);
  }, [ideas]);

  // Quadrant counts derived directly from actual ideas
  const quadrantCounts = useMemo(() => {
    return {
      I: ideas.filter((item) => item.quadrant === "I").length,
      II: ideas.filter((item) => item.quadrant === "II").length,
      III: ideas.filter((item) => item.quadrant === "III").length,
      IV: ideas.filter((item) => item.quadrant === "IV").length,
    };
  }, [ideas]);

  // Group ideas by coordinate to spread overlapping dots neatly
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
          // Horizontal spread
          cx = centerX + (index === 0 ? -14 : 14);
          cy = centerY;
        } else if (count === 3) {
          // Neat triangular constellation
          if (index === 0) {
            cx = centerX;
            cy = centerY - 13;
          } else if (index === 1) {
            cx = centerX - 13;
            cy = centerY + 9;
          } else {
            cx = centerX + 13;
            cy = centerY + 9;
          }
        } else if (count === 4) {
          // Diamond spread
          const offsets = [
            { dx: 0, dy: -14 },
            { dx: 14, dy: 0 },
            { dx: 0, dy: 14 },
            { dx: -14, dy: 0 },
          ];
          cx = centerX + offsets[index].dx;
          cy = centerY + offsets[index].dy;
        } else {
          // Radial spread
          const radius = 16;
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

  // Color & Badge configuration matching concept image
  // Kuadran I: Quick Wins (Kanan Atas)
  // Kuadran II: Major Projects (Kiri Atas)
  // Kuadran III: Fill-Ins (Kanan Bawah)
  // Kuadran IV: Tunda / Hindari (Kiri Bawah)
  const quadrantConfig = {
    I: {
      name: "Quick Wins",
      badgeTitle: "Quick Wins",
      fill: "#059669", // emerald-600
      stroke: "#047857",
      ring: "#10b981",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      rectFill: "#edfcf2",
      badgePillFill: "#ecfdf5",
      badgePillStroke: "#a7f3d0",
      badgeTextColor: "#065f46",
      icon: "★",
    },
    II: {
      name: "Major Projects",
      badgeTitle: "Major Projects",
      fill: "#2563eb", // blue-600
      stroke: "#1d4ed8",
      ring: "#3b82f6",
      badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
      rectFill: "#f0f7ff",
      badgePillFill: "#eff6ff",
      badgePillStroke: "#bfdbfe",
      badgeTextColor: "#1e40af",
      icon: "◆",
    },
    III: {
      name: "Fill-Ins",
      badgeTitle: "Fill-Ins",
      fill: "#d97706", // amber-600
      stroke: "#b45309",
      ring: "#f59e0b",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      rectFill: "#fefce8",
      badgePillFill: "#fffbeb",
      badgePillStroke: "#fde68a",
      badgeTextColor: "#92400e",
      icon: "●",
    },
    IV: {
      name: "Tunda / Hindari",
      badgeTitle: "Tunda / Hindari",
      fill: "#e11d48", // rose-600
      stroke: "#be123c",
      ring: "#f43f5e",
      badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
      rectFill: "#fdf2f4",
      badgePillFill: "#fff1f2",
      badgePillStroke: "#fecdd3",
      badgeTextColor: "#9f1239",
      icon: "✕",
    },
    pool: {
      name: "Idea Pool",
      badgeTitle: "Idea Pool",
      fill: "#64748b",
      stroke: "#475569",
      ring: "#94a3b8",
      badgeBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
      rectFill: "#f8fafc",
      badgePillFill: "#f4f4f5",
      badgePillStroke: "#d4d4d8",
      badgeTextColor: "#52525b",
      icon: "●",
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

  const handleFilterClick = (filterKey) => {
    setActiveFilter((prev) => (prev === filterKey ? "all" : filterKey));
  };

  return (
    <section
      aria-label="Grafik Analisis Feasibility vs Impact"
      className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-5 shadow-2xs transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-zinc-200">
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
              Sebaran 4 kuadran fitur produk UMKM: Sumbu X: Feasibility (1 Sulit → 5 Sangat Layak) • Sumbu Y: Impact (1 Rendah → 5 Tinggi).
            </p>
          </div>
        </div>

        {/* Right side: Integrated Filter Buttons & Collapse Toggle */}
        <div className="flex items-center flex-wrap gap-1.5 self-start lg:self-auto shrink-0">
          {/* Button 'Semua' */}
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
              activeFilter === "all"
                ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            Semua ({plottableIdeas.length})
          </button>

          {/* Button '★ Quick Wins' */}
          <button
            type="button"
            onClick={() => handleFilterClick("I")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
              activeFilter === "I"
                ? "bg-emerald-50 text-emerald-800 border-emerald-400 font-bold shadow-2xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
            title="Filter Kuadran I: Quick Wins"
          >
            <span className="text-emerald-600 font-bold">★</span>
            <span>Quick Wins</span>
            <span className="text-[10px] opacity-75 font-mono">({quadrantCounts.I})</span>
          </button>

          {/* Button '◆ Major Projects' */}
          <button
            type="button"
            onClick={() => handleFilterClick("II")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
              activeFilter === "II"
                ? "bg-blue-50 text-blue-800 border-blue-400 font-bold shadow-2xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
            title="Filter Kuadran II: Major Projects"
          >
            <span className="text-blue-600 font-bold">◆</span>
            <span>Major Projects</span>
            <span className="text-[10px] opacity-75 font-mono">({quadrantCounts.II})</span>
          </button>

          {/* Button '● Fill-Ins' */}
          <button
            type="button"
            onClick={() => handleFilterClick("III")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
              activeFilter === "III"
                ? "bg-amber-50 text-amber-800 border-amber-400 font-bold shadow-2xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
            title="Filter Kuadran III: Fill-Ins"
          >
            <span className="text-amber-600 font-bold">●</span>
            <span>Fill-Ins</span>
            <span className="text-[10px] opacity-75 font-mono">({quadrantCounts.III})</span>
          </button>

          {/* Button '✕ Tunda / Hindari' */}
          <button
            type="button"
            onClick={() => handleFilterClick("IV")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
              activeFilter === "IV"
                ? "bg-rose-50 text-rose-800 border-rose-400 font-bold shadow-2xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
            title="Filter Kuadran IV: Tunda / Hindari"
          >
            <span className="text-rose-600 font-bold">✕</span>
            <span>Tunda / Hindari</span>
            <span className="text-[10px] opacity-75 font-mono">({quadrantCounts.IV})</span>
          </button>

          {/* Toggle Collapse/Expand */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors cursor-pointer ml-1"
            title={isCollapsed ? "Buka Tampilan Grafik" : "Sembunyikan Grafik"}
          >
            <span>{isCollapsed ? "Buka" : "Tutup"}</span>
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="pt-3.5 space-y-3.5">
          {/* Scatter Plot Chart Area */}
          <div
            className="relative w-full rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs"
            onClick={() => setSelectedIdeaId(null)}
          >
            {/* SVG Visualizer Container (100% fluid responsive, zero horizontal scrollbar) */}
            <div className="w-full overflow-hidden max-h-[460px]">
              <svg
                viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
                className="w-full h-auto select-none block max-h-[460px]"
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
                      rx="14"
                      ry="14"
                    />
                  </clipPath>

                  {/* Soft Drop shadow for points */}
                  <filter
                    id="point-shadow"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="2.5"
                      floodOpacity="0.22"
                    />
                  </filter>
                </defs>

                {/* 1. Background Warna 4 Kuadran Pastel Lembut & Proporsional */}
                <g clipPath="url(#chart-inner-bounds)">
                  {/* Top-Left: Kuadran II (Major Projects) */}
                  <rect
                    x={PADDING_LEFT}
                    y={PADDING_TOP}
                    width={BOUNDARY_X - PADDING_LEFT}
                    height={BOUNDARY_Y - PADDING_TOP}
                    fill="#f0f7ff"
                  />
                  {/* Top-Right: Kuadran I (Quick Wins) */}
                  <rect
                    x={BOUNDARY_X}
                    y={PADDING_TOP}
                    width={PADDING_LEFT + INNER_WIDTH - BOUNDARY_X}
                    height={BOUNDARY_Y - PADDING_TOP}
                    fill="#edfcf2"
                  />
                  {/* Bottom-Left: Kuadran IV (Tunda / Hindari) */}
                  <rect
                    x={PADDING_LEFT}
                    y={BOUNDARY_Y}
                    width={BOUNDARY_X - PADDING_LEFT}
                    height={PADDING_TOP + INNER_HEIGHT - BOUNDARY_Y}
                    fill="#fdf2f4"
                  />
                  {/* Bottom-Right: Kuadran III (Fill-Ins) */}
                  <rect
                    x={BOUNDARY_X}
                    y={BOUNDARY_Y}
                    width={PADDING_LEFT + INNER_WIDTH - BOUNDARY_X}
                    height={PADDING_TOP + INNER_HEIGHT - BOUNDARY_Y}
                    fill="#fefce8"
                  />

                  {/* Garis Pembatas Kuadran Horizontal & Vertikal Putus-putus Simetris */}
                  {/* Vertical Divider */}
                  <line
                    x1={BOUNDARY_X}
                    y1={PADDING_TOP}
                    x2={BOUNDARY_X}
                    y2={PADDING_TOP + INNER_HEIGHT}
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                  {/* Horizontal Divider */}
                  <line
                    x1={PADDING_LEFT}
                    y1={BOUNDARY_Y}
                    x2={PADDING_LEFT + INNER_WIDTH}
                    y2={BOUNDARY_Y}
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                </g>

                {/* 2. Outer Chart Rounded Frame Border */}
                <rect
                  x={PADDING_LEFT}
                  y={PADDING_TOP}
                  width={INNER_WIDTH}
                  height={INNER_HEIGHT}
                  rx="14"
                  ry="14"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.2"
                />

                {/* ========================================================
                    3. QUADRANT CORNER PILLS (Di 4 Sudut Persis Konsep Gambar)
                    ======================================================== */}

                {/* Top-Left: Kuadran II (Major Projects) */}
                <g
                  transform={`translate(${PADDING_LEFT + 14}, ${PADDING_TOP + 12})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="126"
                    height="26"
                    rx="6"
                    fill="#eff6ff"
                    stroke="#bfdbfe"
                    strokeWidth="1"
                  />
                  {/* Diamond Icon ◆ (Crisp Vector Polygon) */}
                  <polygon points="14,7.5 19,13 14,18.5 9,13" fill="#1d4ed8" />
                  <text
                    x="27"
                    y="17"
                    className="text-[12px] font-bold fill-blue-800 font-sans"
                  >
                    Major Projects
                  </text>
                </g>

                {/* Top-Right: Kuadran I (Quick Wins) */}
                <g
                  transform={`translate(${PADDING_LEFT + INNER_WIDTH - 116}, ${PADDING_TOP + 12})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="112"
                    height="26"
                    rx="6"
                    fill="#ecfdf5"
                    stroke="#a7f3d0"
                    strokeWidth="1"
                  />
                  {/* Star Icon ★ (Symmetrical 5-Point Vector Polygon, centered at x=14, y=13) */}
                  <polygon
                    points="14,6 16.2,10.8 21.5,11.3 17.5,14.8 18.7,19.8 14,17.2 9.3,19.8 10.5,14.8 6.5,11.3 11.8,10.8"
                    fill="#059669"
                  />
                  <text
                    x="27"
                    y="17"
                    className="text-[12px] font-bold fill-emerald-800 font-sans"
                  >
                    Quick Wins
                  </text>
                </g>

                {/* Bottom-Left: Kuadran IV (Tunda / Hindari) */}
                <g
                  transform={`translate(${PADDING_LEFT + 14}, ${PADDING_TOP + INNER_HEIGHT - 38})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="134"
                    height="26"
                    rx="6"
                    fill="#fff1f2"
                    stroke="#fecdd3"
                    strokeWidth="1"
                  />
                  {/* Cross Icon ✕ (Crisp Vector Cross, perfectly centered at x=14, y=13) */}
                  <line
                    x1="10"
                    y1="9"
                    x2="18"
                    y2="17"
                    stroke="#e11d48"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="18"
                    y1="9"
                    x2="10"
                    y2="17"
                    stroke="#e11d48"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <text
                    x="27"
                    y="17"
                    className="text-[12px] font-bold fill-rose-800 font-sans"
                  >
                    Tunda / Hindari
                  </text>
                </g>

                {/* Bottom-Right: Kuadran III (Fill-Ins) */}
                <g
                  transform={`translate(${PADDING_LEFT + INNER_WIDTH - 96}, ${PADDING_TOP + INNER_HEIGHT - 38})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    width="86"
                    height="26"
                    rx="6"
                    fill="#fffbeb"
                    stroke="#fde68a"
                    strokeWidth="1"
                  />
                  {/* Dot Icon ● */}
                  <circle cx="14" cy="13" r="3.5" fill="#d97706" />
                  <text
                    x="25"
                    y="17"
                    className="text-[12px] font-bold fill-amber-800 font-sans"
                  >
                    Fill-Ins
                  </text>
                </g>

                {/* ========================================================
                    4. LABEL SUMBU X (Feasibility / Kelayakan di Bawah Box)
                    ======================================================== */}
                <g className="select-none font-sans">
                  {/* Sisi Kiri: 1 (Sulit) */}
                  <text
                    x={PADDING_LEFT}
                    y={VIEW_BOX_HEIGHT - 14}
                    textAnchor="start"
                    className="text-[12px] font-semibold fill-zinc-700"
                  >
                    1 (Sulit)
                  </text>

                  {/* Tengah: Feasibility / Kelayakan → */}
                  <text
                    x={BOUNDARY_X}
                    y={VIEW_BOX_HEIGHT - 14}
                    textAnchor="middle"
                    className="text-[12px] font-bold fill-zinc-900"
                  >
                    Feasibility / Kelayakan →
                  </text>

                  {/* Sisi Kanan: 5 (Sangat Layak) */}
                  <text
                    x={PADDING_LEFT + INNER_WIDTH}
                    y={VIEW_BOX_HEIGHT - 14}
                    textAnchor="end"
                    className="text-[12px] font-semibold fill-zinc-700"
                  >
                    5 (Sangat Layak)
                  </text>
                </g>

                {/* ========================================================
                    5. DATA POINTS (Numbered circle markers #1 - #N)
                    ======================================================== */}
                {plottedPoints.map(({ idea, cx, cy }) => {
                  const qid = idea.quadrant || "pool";
                  const conf = quadrantConfig[qid] || quadrantConfig.pool;

                  // Quadrant filter matching
                  const isFilteredOut = activeFilter !== "all" && activeFilter !== qid;

                  const isHovered = hoveredIdeaId === idea.id;
                  const isSelected = selectedIdeaId === idea.id;
                  const isActive = isHovered || isSelected;

                  return (
                    <g
                      key={idea.id}
                      className={`cursor-pointer transition-opacity duration-150 ${
                        isFilteredOut ? "opacity-20 pointer-events-none" : "opacity-100"
                      }`}
                      onMouseEnter={() => setHoveredIdeaId(idea.id)}
                      onMouseLeave={() => setHoveredIdeaId(null)}
                      onClick={(e) => handlePointClick(idea.id, e)}
                    >
                      {/* Expanded Invisible Touch Target */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="22"
                        fill="transparent"
                        className="cursor-pointer"
                      />

                      {/* Selected Outer Ring (Persis seperti lingkaran hitam pada titik #3 di gambar) */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="19"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="2.8"
                        />
                      )}

                      {/* Hover subtle pulse ring */}
                      {isHovered && !isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="18"
                          fill={conf.fill}
                          fillOpacity="0.25"
                        />
                      )}

                      {/* Main Circular Dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? "14.5" : "12.5"}
                        fill={conf.fill}
                        stroke="#ffffff"
                        strokeWidth="2.2"
                        filter="url(#point-shadow)"
                        className="transition-all duration-150 ease-out"
                      />

                      {/* Point Identity Number (#1, #2, ..., #10) */}
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`font-sans font-bold fill-white select-none pointer-events-none ${
                          idea.seqNumber >= 10 ? "text-[9.5px]" : "text-[10.5px]"
                        }`}
                      >
                        #{idea.seqNumber}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Tooltip Overlay (Direction-aware floating badge) */}
            {hoveredPoint && !selectedIdeaId && (activeFilter === "all" || activeFilter === hoveredPoint.idea.quadrant) && (
              <div
                className={`absolute z-30 pointer-events-none transform -translate-x-1/2 bg-zinc-900/95 backdrop-blur-xs text-white rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs shadow-xl border border-zinc-700/80 animate-in fade-in zoom-in-95 duration-100 max-w-[220px] sm:max-w-xs ${
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
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-mono mt-1">
                  <span>Target: {hoveredPoint.idea.target}</span>
                  <span>•</span>
                  <span>F:{hoveredPoint.idea.feasibility} I:{hoveredPoint.idea.impact}</span>
                  <span>•</span>
                  <span>Total: {(hoveredPoint.idea.feasibility ?? 0) + (hoveredPoint.idea.impact ?? 0)}</span>
                </div>
                <div className="mt-1 text-[10px] font-semibold text-emerald-400">
                  {QUADRANTS[hoveredPoint.idea.quadrant]?.title || "Idea Pool"}
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

          {/* Panel Detail Titik yang Sedang Diklik atau Diarahkan */}
          {activeIdea && (
            <div
              className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-150 shadow-2xs ${
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
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs font-mono ${
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>
                Tip: Titik koordinat terplot otomatis berdasarkan nilai Feasibility &amp; Impact (1–5). Arahkan kursor atau klik titik untuk melihat detail.
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
