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
} from "lucide-react";
import { QUADRANTS } from "../utils/matrixUtils";

// SVG Chart Geometry Constants
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 480;

const PADDING_LEFT = 70;
const PADDING_RIGHT = 40;
const PADDING_TOP = 40;
const PADDING_BOTTOM = 65;

const INNER_WIDTH = VIEW_BOX_WIDTH - PADDING_LEFT - PADDING_RIGHT; // 650
const INNER_HEIGHT = VIEW_BOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM; // 375

// Inner margin so coordinate 1 and 5 don't collide with borders
const MARGIN_X = 36;
const MARGIN_Y = 32;

const PLOT_WIDTH = INNER_WIDTH - MARGIN_X * 2; // 578
const PLOT_HEIGHT = INNER_HEIGHT - MARGIN_Y * 2; // 311

// Coordinate scales: Feasibility (1 - 5) on X, Impact (1 - 5) on Y
const getX = (feasibility) => {
  const val = Number(feasibility);
  return PADDING_LEFT + MARGIN_X + ((val - 1) / 4) * PLOT_WIDTH;
};

const getY = (impact) => {
  const val = Number(impact);
  // Y-axis inverted in SVG: Impact 5 at top, Impact 1 at bottom
  return PADDING_TOP + MARGIN_Y + ((5 - val) / 4) * PLOT_HEIGHT;
};

// Quadrant dividing threshold lines (Feasibility = 3.5, Impact = 3.5)
const BOUNDARY_X = getX(3.5);
const BOUNDARY_Y = getY(3.5);

/**
 * ScatterPlotChart
 * Visualisasi Scatter Plot Feasibility (Sumbu X) vs Impact (Sumbu Y)
 * Memetakan setiap ide sebagai titik koordinat warna kuadran.
 */
export default function ScatterPlotChart({ ideas = [], onViewDetail }) {
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [hoveredIdeaId, setHoveredIdeaId] = useState(null);
  const [highlightQuadrant, setHighlightQuadrant] = useState("all"); // 'all' | 'I' | 'II' | 'III' | 'IV'
  const [isCollapsed, setIsCollapsed] = useState(false);

  const viewBoxWidth = VIEW_BOX_WIDTH;
  const viewBoxHeight = VIEW_BOX_HEIGHT;
  const paddingLeft = PADDING_LEFT;
  const paddingTop = PADDING_TOP;
  const innerWidth = INNER_WIDTH;
  const innerHeight = INNER_HEIGHT;
  const boundaryX = BOUNDARY_X;
  const boundaryY = BOUNDARY_Y;

  // Filter ideas with valid feasibility and impact scores
  const plottableIdeas = useMemo(() => {
    return ideas.filter(
      (item) => item.feasibility != null && item.impact != null
    );
  }, [ideas]);

  // Quadrant stats derived directly from ideas
  const quadrantCounts = useMemo(() => {
    return {
      I: ideas.filter((item) => item.quadrant === "I").length,
      II: ideas.filter((item) => item.quadrant === "II").length,
      III: ideas.filter((item) => item.quadrant === "III").length,
      IV: ideas.filter((item) => item.quadrant === "IV").length,
    };
  }, [ideas]);

  // Group ideas by coordinate to spread overlapping dots
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
        let cx = centerX;
        let cy = centerY;

        // Distribute points radially if multiple ideas share the same coordinates
        if (count > 1) {
          const radius = count === 2 ? 14 : count === 3 ? 16 : 19;
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
      colorName: "Hijau",
      fill: "#10b981", // emerald-500
      stroke: "#059669", // emerald-600
      ring: "#a7f3d0", // emerald-200
      bg: "bg-emerald-500",
      text: "text-emerald-700",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      rectFill: "#ecfdf5", // emerald-50
    },
    II: {
      name: "Major Projects",
      colorName: "Biru",
      fill: "#3b82f6", // blue-500
      stroke: "#2563eb", // blue-600
      ring: "#bfdbfe", // blue-200
      bg: "bg-blue-500",
      text: "text-blue-700",
      badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
      rectFill: "#eff6ff", // blue-50
    },
    III: {
      name: "Time Sinks",
      colorName: "Merah",
      fill: "#f43f5e", // rose-500
      stroke: "#e11d48", // rose-600
      ring: "#fecdd3", // rose-200
      bg: "bg-rose-500",
      text: "text-rose-700",
      badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
      rectFill: "#fff1f2", // rose-50
    },
    IV: {
      name: "Fill-Ins",
      colorName: "Oranye",
      fill: "#f59e0b", // amber-500
      stroke: "#d97706", // amber-600
      ring: "#fde68a", // amber-200
      bg: "bg-amber-500",
      text: "text-amber-700",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      rectFill: "#fffbeb", // amber-50
    },
    pool: {
      name: "Idea Pool",
      colorName: "Abu-abu",
      fill: "#71717a", // zinc-500
      stroke: "#52525b", // zinc-600
      ring: "#e4e4e7", // zinc-200
      bg: "bg-zinc-500",
      text: "text-zinc-700",
      badgeBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
      rectFill: "#f4f4f5",
    },
  };

  // Active idea for tooltip (either hovered or locked by click)
  const activeIdeaId = hoveredIdeaId || selectedIdeaId;
  const activePoint = plottedPoints.find((p) => p.idea.id === activeIdeaId);
  const activeIdea = activePoint?.idea;

  // Handle dot click
  const handlePointClick = (ideaId, e) => {
    e.stopPropagation();
    setSelectedIdeaId((prev) => (prev === ideaId ? null : ideaId));
  };

  return (
    <section
      aria-label="Grafik Analisis Feasibility vs Impact"
      className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 shadow-2xs transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ScatterChart className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                Grafik Analisis Feasibility vs Impact
              </h2>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                Scatter Plot View
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sebaran titik posisi ide produk berdasarkan skor Feasibility (Sumbu X) dan Impact (Sumbu Y).
            </p>
          </div>
        </div>

        {/* Toggle Collapse/Expand */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          title={isCollapsed ? "Tampilkan Grafik" : "Sembunyikan Grafik"}
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
          {/* Interactive Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-zinc-700 text-xs mr-1">
                Legenda Kuadran:
              </span>

              {/* Kuadran I: Quick Wins */}
              <button
                type="button"
                onClick={() =>
                  setHighlightQuadrant((prev) => (prev === "I" ? "all" : "I"))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                  highlightQuadrant === "I"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200"
                    : "bg-emerald-50/80 hover:bg-emerald-100/60 text-emerald-800 border-emerald-200"
                }`}
                title="Klik untuk sorot Kuadran I"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs"></span>
                <span>Kuadran I: Quick Wins</span>
                <span className="font-mono font-bold text-[11px] bg-white px-1.5 py-0.2 rounded-full border border-emerald-200">
                  {quadrantCounts.I}
                </span>
              </button>

              {/* Kuadran II: Major Projects */}
              <button
                type="button"
                onClick={() =>
                  setHighlightQuadrant((prev) => (prev === "II" ? "all" : "II"))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                  highlightQuadrant === "II"
                    ? "bg-blue-100 text-blue-900 border-blue-400 ring-2 ring-blue-200"
                    : "bg-blue-50/80 hover:bg-blue-100/60 text-blue-800 border-blue-200"
                }`}
                title="Klik untuk sorot Kuadran II"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-2xs"></span>
                <span>Kuadran II: Major Projects</span>
                <span className="font-mono font-bold text-[11px] bg-white px-1.5 py-0.2 rounded-full border border-blue-200">
                  {quadrantCounts.II}
                </span>
              </button>

              {/* Kuadran III: Time Sinks */}
              <button
                type="button"
                onClick={() =>
                  setHighlightQuadrant((prev) => (prev === "III" ? "all" : "III"))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                  highlightQuadrant === "III"
                    ? "bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-200"
                    : "bg-rose-50/80 hover:bg-rose-100/60 text-rose-800 border-rose-200"
                }`}
                title="Klik untuk sorot Kuadran III"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-2xs"></span>
                <span>Kuadran III: Time Sinks</span>
                <span className="font-mono font-bold text-[11px] bg-white px-1.5 py-0.2 rounded-full border border-rose-200">
                  {quadrantCounts.III}
                </span>
              </button>

              {/* Kuadran IV: Fill-Ins */}
              <button
                type="button"
                onClick={() =>
                  setHighlightQuadrant((prev) => (prev === "IV" ? "all" : "IV"))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                  highlightQuadrant === "IV"
                    ? "bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-200"
                    : "bg-amber-50/80 hover:bg-amber-100/60 text-amber-800 border-amber-200"
                }`}
                title="Klik untuk sorot Kuadran IV"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-2xs"></span>
                <span>Kuadran IV: Fill-Ins</span>
                <span className="font-mono font-bold text-[11px] bg-white px-1.5 py-0.2 rounded-full border border-amber-200">
                  {quadrantCounts.IV}
                </span>
              </button>
            </div>

            {/* Reset highlight button */}
            {highlightQuadrant !== "all" && (
              <button
                type="button"
                onClick={() => setHighlightQuadrant("all")}
                className="text-xs text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
              >
                Tampilkan Semua Titik
              </button>
            )}
          </div>

          {/* Scatter Plot Chart Area */}
          <div
            className="relative w-full rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs"
            onClick={() => setSelectedIdeaId(null)}
          >
            {/* SVG Visualizer */}
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="w-full min-w-[560px] sm:min-w-[620px] h-auto select-none overflow-visible block"
              >
                <defs>
                  {/* Clip path for quadrant background rectangles */}
                  <clipPath id="chart-inner-bounds">
                    <rect
                      x={paddingLeft}
                      y={paddingTop}
                      width={innerWidth}
                      height={innerHeight}
                      rx="10"
                      ry="10"
                    />
                  </clipPath>

                  {/* Drop shadow for points */}
                  <filter
                    id="point-shadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="1"
                      stdDeviation="1.5"
                      floodOpacity="0.2"
                    />
                  </filter>
                </defs>

                {/* 1. Quadrant Background Tints (Clipped inside inner bounds) */}
                <g clipPath="url(#chart-inner-bounds)">
                  {/* Top-Left: Kuadran II (Major Projects) */}
                  <rect
                    x={paddingLeft}
                    y={paddingTop}
                    width={boundaryX - paddingLeft}
                    height={boundaryY - paddingTop}
                    fill={quadrantConfig.II.rectFill}
                    fillOpacity="0.55"
                  />
                  {/* Top-Right: Kuadran I (Quick Wins) */}
                  <rect
                    x={boundaryX}
                    y={paddingTop}
                    width={paddingLeft + innerWidth - boundaryX}
                    height={boundaryY - paddingTop}
                    fill={quadrantConfig.I.rectFill}
                    fillOpacity="0.55"
                  />
                  {/* Bottom-Left: Kuadran III (Time Sinks) */}
                  <rect
                    x={paddingLeft}
                    y={boundaryY}
                    width={boundaryX - paddingLeft}
                    height={paddingTop + innerHeight - boundaryY}
                    fill={quadrantConfig.III.rectFill}
                    fillOpacity="0.55"
                  />
                  {/* Bottom-Right: Kuadran IV (Fill-Ins) */}
                  <rect
                    x={boundaryX}
                    y={boundaryY}
                    width={paddingLeft + innerWidth - boundaryX}
                    height={paddingTop + innerHeight - boundaryY}
                    fill={quadrantConfig.IV.rectFill}
                    fillOpacity="0.55"
                  />
                </g>

                {/* 2. Outer Chart Boundary Border */}
                <rect
                  x={paddingLeft}
                  y={paddingTop}
                  width={innerWidth}
                  height={innerHeight}
                  rx="10"
                  ry="10"
                  fill="none"
                  stroke="#e4e4e7"
                  strokeWidth="1.5"
                />

                {/* 3. Subtle Grid Lines for 1..5 scores */}
                {[1, 2, 3, 4, 5].map((score) => {
                  const gx = getX(score);
                  const gy = getY(score);
                  return (
                    <g key={`grid-${score}`}>
                      {/* Vertical Grid Line */}
                      <line
                        x1={gx}
                        y1={paddingTop}
                        x2={gx}
                        y2={paddingTop + innerHeight}
                        stroke="#e4e4e7"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        strokeOpacity="0.8"
                      />
                      {/* Horizontal Grid Line */}
                      <line
                        x1={paddingLeft}
                        y1={gy}
                        x2={paddingLeft + innerWidth}
                        y2={gy}
                        stroke="#e4e4e7"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        strokeOpacity="0.8"
                      />
                    </g>
                  );
                })}

                {/* 4. Quadrant Dividing Lines (at Feasibility = 3.5 and Impact = 3.5) */}
                {/* Vertical Divider */}
                <line
                  x1={boundaryX}
                  y1={paddingTop}
                  x2={boundaryX}
                  y2={paddingTop + innerHeight}
                  stroke="#71717a"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
                {/* Horizontal Divider */}
                <line
                  x1={paddingLeft}
                  y1={boundaryY}
                  x2={paddingLeft + innerWidth}
                  y2={boundaryY}
                  stroke="#71717a"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />

                {/* Central Intersection Point */}
                <circle
                  cx={boundaryX}
                  cy={boundaryY}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#71717a"
                  strokeWidth="1.5"
                />
                <circle cx={boundaryX} cy={boundaryY} r="1.5" fill="#52525b" />

                {/* 5. Watermark Quadrant Titles inside Each Corner */}
                {/* Top-Right: Kuadran I */}
                <g transform={`translate(${paddingLeft + innerWidth - 14}, ${paddingTop + 18})`}>
                  <text
                    textAnchor="end"
                    className="text-[11px] font-bold font-sans fill-emerald-800/80 tracking-wider uppercase"
                  >
                    KUADRAN I • QUICK WINS
                  </text>
                  <text
                    y="13"
                    textAnchor="end"
                    className="text-[9px] font-mono fill-emerald-700/60"
                  >
                    (Feasibility ≥ 4 &amp; Impact ≥ 4)
                  </text>
                </g>

                {/* Top-Left: Kuadran II */}
                <g transform={`translate(${paddingLeft + 14}, ${paddingTop + 18})`}>
                  <text
                    textAnchor="start"
                    className="text-[11px] font-bold font-sans fill-blue-800/80 tracking-wider uppercase"
                  >
                    KUADRAN II • MAJOR PROJECTS
                  </text>
                  <text
                    y="13"
                    textAnchor="start"
                    className="text-[9px] font-mono fill-blue-700/60"
                  >
                    (Feasibility &lt; 4 &amp; Impact ≥ 4)
                  </text>
                </g>

                {/* Bottom-Left: Kuadran III */}
                <g
                  transform={`translate(${paddingLeft + 14}, ${
                    paddingTop + innerHeight - 22
                  })`}
                >
                  <text
                    textAnchor="start"
                    className="text-[11px] font-bold font-sans fill-rose-800/80 tracking-wider uppercase"
                  >
                    KUADRAN III • TIME SINKS
                  </text>
                  <text
                    y="13"
                    textAnchor="start"
                    className="text-[9px] font-mono fill-rose-700/60"
                  >
                    (Feasibility &lt; 4 &amp; Impact &lt; 4)
                  </text>
                </g>

                {/* Bottom-Right: Kuadran IV */}
                <g
                  transform={`translate(${paddingLeft + innerWidth - 14}, ${
                    paddingTop + innerHeight - 22
                  })`}
                >
                  <text
                    textAnchor="end"
                    className="text-[11px] font-bold font-sans fill-amber-800/80 tracking-wider uppercase"
                  >
                    KUADRAN IV • FILL-INS
                  </text>
                  <text
                    y="13"
                    textAnchor="end"
                    className="text-[9px] font-mono fill-amber-700/60"
                  >
                    (Feasibility ≥ 4 &amp; Impact &lt; 4)
                  </text>
                </g>

                {/* 6. Axis Tick Labels & Marks */}
                {/* Sumbu X Ticks (Feasibility: 1, 2, 3, 4, 5) */}
                {[1, 2, 3, 4, 5].map((val) => {
                  const x = getX(val);
                  return (
                    <g key={`x-tick-${val}`}>
                      <line
                        x1={x}
                        y1={paddingTop + innerHeight}
                        x2={x}
                        y2={paddingTop + innerHeight + 6}
                        stroke="#71717a"
                        strokeWidth="1.2"
                      />
                      <text
                        x={x}
                        y={paddingTop + innerHeight + 19}
                        textAnchor="middle"
                        className="text-[11px] font-mono font-bold fill-zinc-700"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Sumbu Y Ticks (Impact: 1, 2, 3, 4, 5) */}
                {[1, 2, 3, 4, 5].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={`y-tick-${val}`}>
                      <line
                        x1={paddingLeft - 6}
                        y1={y}
                        x2={paddingLeft}
                        y2={y}
                        stroke="#71717a"
                        strokeWidth="1.2"
                      />
                      <text
                        x={paddingLeft - 12}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[11px] font-mono font-bold fill-zinc-700"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Sumbu X Axis Title with Directional Arrows */}
                <g transform={`translate(${paddingLeft + innerWidth / 2}, ${viewBoxHeight - 14})`}>
                  <text
                    textAnchor="middle"
                    className="text-[11px] font-bold font-sans fill-zinc-800 tracking-wider uppercase"
                  >
                    SUMBU X: FEASIBILITY (KEMUDAHAN IMPLEMENTASI) →
                  </text>
                  <text
                    y="-14"
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-zinc-400"
                  >
                    1–3: Rendah • 4–5: Tinggi
                  </text>
                </g>

                {/* Sumbu Y Axis Title (Rotated on the Left) */}
                <g
                  transform={`translate(18, ${paddingTop + innerHeight / 2}) rotate(-90)`}
                >
                  <text
                    textAnchor="middle"
                    className="text-[11px] font-bold font-sans fill-zinc-800 tracking-wider uppercase"
                  >
                    SUMBU Y: IMPACT (DAMPAK BISNIS) →
                  </text>
                  <text
                    y="13"
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-zinc-400"
                  >
                    1–3: Rendah • 4–5: Tinggi
                  </text>
                </g>

                {/* 7. Cluster Indicator Rings for coordinates with >1 items */}
                {plottedPoints
                  .filter((p) => p.clusterCount > 1 && p.clusterIndex === 0)
                  .map((cluster) => (
                    <g key={`cluster-${cluster.centerX}-${cluster.centerY}`}>
                      <circle
                        cx={cluster.centerX}
                        cy={cluster.centerY}
                        r={cluster.clusterCount === 2 ? 14 : cluster.clusterCount === 3 ? 16 : 19}
                        fill="none"
                        stroke="#a1a1aa"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        strokeOpacity="0.6"
                      />
                      <circle
                        cx={cluster.centerX}
                        cy={cluster.centerY}
                        r="2.5"
                        fill="#a1a1aa"
                      />
                    </g>
                  ))}

                {/* 8. Data Points (One dot per idea) */}
                {plottedPoints.map(({ idea, cx, cy }) => {
                  const qid = idea.quadrant || "pool";
                  const conf = quadrantConfig[qid] || quadrantConfig.pool;
                  const isHovered = hoveredIdeaId === idea.id;
                  const isSelected = selectedIdeaId === idea.id;
                  const isActive = isHovered || isSelected;

                  // Opacity adjustment when quadrant filter is clicked
                  const isDimmed =
                    highlightQuadrant !== "all" && idea.quadrant !== highlightQuadrant;

                  return (
                    <g
                      key={idea.id}
                      className="cursor-pointer transition-transform duration-150"
                      onMouseEnter={() => setHoveredIdeaId(idea.id)}
                      onMouseLeave={() => setHoveredIdeaId(null)}
                      onClick={(e) => handlePointClick(idea.id, e)}
                    >
                      {/* Active outer glowing halo */}
                      {isActive && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="16"
                          fill={conf.fill}
                          fillOpacity="0.25"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Point Circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? "10.5" : "7.5"}
                        fill={conf.fill}
                        stroke="#ffffff"
                        strokeWidth={isActive ? "2.5" : "1.8"}
                        filter="url(#point-shadow)"
                        opacity={isDimmed ? 0.25 : 1}
                        className="transition-all duration-200"
                      />

                      {/* Inner Dot for active item */}
                      {isActive && (
                        <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

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

          {/* Interactive Floating Tooltip / Details Panel */}
          {activeIdea && (
            <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 bg-zinc-50/90 shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Title & Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-zinc-900 tracking-tight">
                      {activeIdea.title}
                    </h4>

                    {/* Target Badge */}
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white text-zinc-700 border border-zinc-200 shadow-2xs">
                      {activeIdea.target === "Pembeli" ? (
                        <ShoppingBag className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <Store className="w-3 h-3 text-zinc-500" />
                      )}
                      <span>{activeIdea.target}</span>
                    </span>

                    {/* Quadrant Badge */}
                    {activeIdea.quadrant && QUADRANTS[activeIdea.quadrant] && (
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          quadrantConfig[activeIdea.quadrant]?.badgeBg ||
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
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {activeIdea.description || "Tidak ada deskripsi rinci."}
                  </p>
                </div>

                {/* Score Pill & Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  {/* Score Pill */}
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 text-xs font-mono">
                    <span className="text-zinc-600">
                      Feas: <strong>{activeIdea.feasibility}/5</strong>
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-zinc-600">
                      Imp: <strong>{activeIdea.impact}/5</strong>
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span className="font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.2 rounded">
                      Total: {(activeIdea.feasibility ?? 0) + (activeIdea.impact ?? 0)}
                    </span>
                  </div>

                  {/* Button Detail */}
                  {onViewDetail && (
                    <button
                      type="button"
                      onClick={() => onViewDetail(activeIdea)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                      title="Lihat Detail Lengkap Fitur"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  )}

                  {/* Close Selection */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIdeaId(null);
                      setHoveredIdeaId(null);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer"
                    title="Tutup Info"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Helper Hint */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              <span>
                Tip: Arahkan kursor atau klik titik pada grafik untuk melihat ringkasan fitur produk.
              </span>
            </span>
            <span className="font-mono text-zinc-400 hidden sm:inline">
              Total Terplot: {plottableIdeas.length} / {ideas.length} Ide
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
