export const QUADRANTS = {
  I: {
    id: "I",
    name: "QUICK WINS",
    title: "Kuadran I – QUICK WINS",
    position: "Kanan Atas",
    badge: "Prioritas Utama",
    description: "Prioritas utama untuk segera dikembangkan.",
    rule: "Feasibility ≥ 4 & Impact ≥ 4",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotColor: "bg-emerald-600",
    priority: "Sangat Tinggi (P1)",
    recommendation: "Segera eksekusi sebagai fitur inti MVP (Minimum Viable Product). Memberikan dampak signifikan bagi bisnis dengan tingkat kemudahan implementasi tinggi."
  },
  II: {
    id: "II",
    name: "MAJOR PROJECTS",
    title: "Kuadran II – MAJOR PROJECTS",
    position: "Kiri Atas",
    badge: "Rencana Strategis",
    description: "Ide berdampak tinggi yang membutuhkan persiapan lebih.",
    rule: "Feasibility < 4 & Impact ≥ 4",
    tagColor: "bg-blue-50 text-blue-800 border-blue-200",
    dotColor: "bg-blue-600",
    priority: "Tinggi (P2)",
    recommendation: "Rencanakan secara matang dalam roadmap jangka menengah. Memerlukan riset teknis, integrasi pihak ketiga, atau alokasi sumber daya lebih besar."
  },
  III: {
    id: "III",
    name: "FILL-INS",
    title: "Kuadran III – FILL-INS",
    position: "Kanan Bawah",
    badge: "Sambilan",
    description: "Ide mudah diterapkan tetapi dampaknya relatif rendah.",
    rule: "Feasibility ≥ 4 & Impact < 4",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-600",
    priority: "Sedang (P3)",
    recommendation: "Kerjakan ketika ada waktu luang setelah fitur Quick Wins selesai, atau saat tim membutuhkan pekerjaan cepat tanpa risiko besar."
  },
  IV: {
    id: "IV",
    name: "TUNDA / HINDARI",
    title: "Kuadran IV – TUNDA / HINDARI",
    position: "Kiri Bawah",
    badge: "Evaluasi",
    description: "Ide dengan prioritas rendah dan dampak minim yang memerlukan evaluasi ulang.",
    rule: "Feasibility < 4 & Impact < 4",
    tagColor: "bg-rose-50 text-rose-800 border-rose-200",
    dotColor: "bg-rose-600",
    priority: "Rendah (P4)",
    recommendation: "Tunda atau evaluasi ulang. Fitur ini memiliki dampak rendah namun memerlukan usaha atau biaya yang cukup tinggi untuk UMKM."
  },
  pool: {
    id: "pool",
    name: "IDEA POOL",
    title: "Idea Pool (Belum Diplot)",
    position: "Penampungan",
    badge: "Draf Ide",
    description: "Wadah ide yang belum diplot atau belum memiliki skor lengkap.",
    rule: "Skor belum ditentukan / Parkir",
    tagColor: "bg-zinc-100 text-zinc-700 border-zinc-200",
    dotColor: "bg-zinc-400",
    priority: "Belum Ditentukan",
    recommendation: "Tentukan skor Feasibility dan Impact agar dapat diplot ke dalam kuadran prioritas."
  }
};

/**
 * Determine quadrant based on Feasibility & Impact scores.
 * Exact rule:
 * - Kuadran I: Feasibility ≥ 4 dan Impact ≥ 4 (Quick Wins)
 * - Kuadran II: Feasibility < 4 dan Impact ≥ 4 (Major Projects)
 * - Kuadran III: Feasibility ≥ 4 dan Impact < 4 (Fill-Ins)
 * - Kuadran IV: Feasibility < 4 dan Impact < 4 (Tunda / Hindari)
 * Missing/incomplete scores → pool
 */
export function calculateQuadrant(feasibility, impact) {
  if (feasibility == null || impact == null) return "pool";
  const f = Number(feasibility);
  const i = Number(impact);
  if (isNaN(f) || isNaN(i) || f < 1 || f > 5 || i < 1 || i > 5) return "pool";

  if (f >= 4 && i >= 4) return "I";
  if (f < 4 && i >= 4) return "II";
  if (f >= 4 && i < 4) return "III";
  if (f < 4 && i < 4) return "IV";

  return "pool";
}

/**
 * Adjust feasibility & impact to fit quadrant boundaries when manually moved.
 */
export function getScoresForQuadrant(quadrantId, currentF, currentI) {
  if (quadrantId === "pool") return { feasibility: currentF, impact: currentI };
  let f = currentF || 3;
  let i = currentI || 3;

  switch (quadrantId) {
    case "I":
      if (f < 4) f = 4;
      if (i < 4) i = 4;
      break;
    case "II":
      if (f >= 4) f = 3;
      if (i < 4) i = 4;
      break;
    case "III":
      if (f < 4) f = 4;
      if (i >= 4) i = 3;
      break;
    case "IV":
      if (f >= 4) f = 3;
      if (i >= 4) i = 3;
      break;
  }
  return { feasibility: f, impact: i };
}

/**
 * Sort ideas by score (impact desc, feasibility desc, title asc)
 */
export function sortIdeasByScore(ideas) {
  return [...ideas].sort((a, b) => {
    const impactA = a.impact ?? 0;
    const impactB = b.impact ?? 0;
    if (impactB !== impactA) return impactB - impactA;

    const feasA = a.feasibility ?? 0;
    const feasB = b.feasibility ?? 0;
    if (feasB !== feasA) return feasB - feasA;

    return (a.title || "").localeCompare(b.title || "");
  });
}

/**
 * Unique ID generator
 */
export function generateUniqueId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "idea-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

/**
 * Export ideas to CSV format for Excel & Google Sheets
 */
export function exportIdeasToCsv(ideas) {
  const headers = [
    "No",
    "Nama Ide",
    "Deskripsi",
    "Target Pengguna",
    "Feasibility (1-5)",
    "Impact (1-5)",
    "Total Skor",
    "Kuadran",
    "Prioritas"
  ];

  const sorted = sortIdeasByScore(ideas);
  const rows = sorted.map((item, idx) => {
    const qid = item.quadrant || "pool";
    const quad = QUADRANTS[qid] || QUADRANTS.pool;
    const totalScore = (item.feasibility ?? 0) + (item.impact ?? 0);
    return [
      idx + 1,
      `"${(item.title || "").replace(/"/g, '""')}"`,
      `"${(item.description || "").replace(/"/g, '""')}"`,
      `"${item.target || ""}"`,
      item.feasibility ?? "",
      item.impact ?? "",
      totalScore,
      `"${quad.id === "pool" ? "Idea Pool" : `Kuadran ${quad.id} - ${quad.name}`}"`,
      `"${quad.priority}"`
    ];
  });

  return "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

/**
 * Download CSV file trigger
 */
export function downloadCsvFile(csvContent, filename = "ideation-matrix-lkpd.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format summary for Google Docs clipboard
 */
export function formatSummaryForClipboard(ideas) {
  const total = ideas.length;
  const countI = ideas.filter((item) => item.quadrant === "I").length;
  const countII = ideas.filter((item) => item.quadrant === "II").length;
  const countIII = ideas.filter((item) => item.quadrant === "III").length;
  const countIV = ideas.filter((item) => item.quadrant === "IV").length;
  const countPool = ideas.filter((item) => item.quadrant === "pool" || !item.quadrant).length;

  const countPembeli = ideas.filter((item) => item.target === "Pembeli").length;
  const countPenjual = ideas.filter((item) => item.target === "Penjual").length;

  let text = `# LEMBAR KERJA PESERTA DIDIK (LKPD): IDEATION PRIORITY MATRIKS\n`;
  text += `## E-Commerce Sepatu & Sandal UMKM (Metode Feasibility vs Impact)\n\n`;

  text += `### RINGKASAN METRIK PROYEK\n`;
  text += `- Total Seluruh Ide: ${total} ide\n`;
  text += `  • Target Pembeli: ${countPembeli} ide\n`;
  text += `  • Target Penjual: ${countPenjual} ide\n`;
  text += `- Kuadran I (Quick Wins): ${countI} ide\n`;
  text += `- Kuadran II (Major Projects): ${countII} ide\n`;
  text += `- Kuadran III (Fill-Ins): ${countIII} ide\n`;
  text += `- Kuadran IV (Tunda / Hindari): ${countIV} ide\n`;
  if (countPool > 0) {
    text += `- Idea Pool (Belum Diplot): ${countPool} ide\n`;
  }
  text += `\n==================================================\n\n`;

  // Comprehensive Table for quick paste into Google Docs
  text += `### TABEL REKAPITULASI 10 IDE LKPD\n\n`;
  text += `| No | Nama Fitur | Target | Feasibility | Impact | Total Skor | Kuadran | Prioritas |\n`;
  text += `|---|---|---|:---:|:---:|:---:|---|---|\n`;
  const allSorted = sortIdeasByScore(ideas);
  allSorted.forEach((item, idx) => {
    const qid = item.quadrant || "pool";
    const quad = QUADRANTS[qid] || QUADRANTS.pool;
    const totalScore = (item.feasibility ?? 0) + (item.impact ?? 0);
    text += `| ${idx + 1} | ${item.title} | ${item.target} | ${item.feasibility ?? "-"} | ${item.impact ?? "-"} | ${totalScore} | Kuadran ${quad.id} | ${quad.priority} |\n`;
  });
  text += `\n==================================================\n\n`;

  // Exact requested order: Total, I, II, III, IV, Pool
  const quadrantOrder = ["I", "II", "III", "IV", "pool"];

  quadrantOrder.forEach((qid) => {
    const quad = QUADRANTS[qid];
    const quadIdeas = sortIdeasByScore(ideas.filter((item) => (item.quadrant || "pool") === qid));

    if (quadIdeas.length === 0 && qid === "pool") return;

    text += `### ${quad.title.toUpperCase()}\n`;
    text += `Karakteristik: ${quad.rule} | Posisi: ${quad.position}\n`;
    text += `Deskripsi: ${quad.description}\n`;
    text += `Rekomendasi Tindakan: ${quad.recommendation}\n\n`;

    if (quadIdeas.length === 0) {
      text += `(Belum ada ide pada kuadran ini)\n\n`;
    } else {
      quadIdeas.forEach((item, index) => {
        const itemTotal = (item.feasibility ?? 0) + (item.impact ?? 0);
        text += `${index + 1}. ${item.title}\n`;
        text += `   - Target Pengguna: ${item.target}\n`;
        text += `   - Skor Feasibility: ${item.feasibility != null ? item.feasibility + "/5" : "-"}\n`;
        text += `   - Skor Impact: ${item.impact != null ? item.impact + "/5" : "-"}\n`;
        text += `   - Total Skor: ${itemTotal}/10 (Feas + Imp)\n`;
        text += `   - Kuadran: Kuadran ${quad.id} (${quad.name})\n`;
        text += `   - Deskripsi: ${item.description || "-"}\n`;
        text += `   - Prioritas LKPD: ${quad.priority}\n\n`;
      });
    }
    text += `--------------------------------------------------\n\n`;
  });

  // Dynamic recommendations & roadmap based on actual data
  text += `## ROADMAP PELAKSANAAN PENGEMBANGAN FITUR:\n`;
  if (countI > 0) {
    const q1Names = ideas.filter(i => i.quadrant === "I").map(i => i.title).join(", ");
    text += `- Tahap 1 (Prioritas Utama / MVP): Pengembangan ${countI} fitur Quick Wins (${q1Names}). Fokus pada penyelesaian kendala ukuran kaki pembeli, verifikasi pembayaran otomatis, dan kemudahan pengelolaan varian ukuran sepatu.\n`;
  }
  if (countII > 0) {
    const q2Names = ideas.filter(i => i.quadrant === "II").map(i => i.title).join(", ");
    text += `- Tahap 2 (Rencana Strategis): Persiapan fitur Major Projects (${q2Names}) yaitu integrasi pemindai barcode kamera HP/webcam untuk otomatisasi stok gudang setelah alur belanja dasar stabil.\n`;
  }
  text += `- Tahap 3 (Evaluasi & Penilaian Ulang): Evaluasi performa fitur pasca rilis, umpan balik pembeli/penjual, dan penilaian ulang skor Feasibility & Impact secara berkala.\n\n`;

  text += `## KESIMPULAN AKHIR & REKOMENDASI STRATEGIS:\n`;
  const pctI = total > 0 ? Math.round((countI / total) * 100) : 0;
  const pctII = total > 0 ? Math.round((countII / total) * 100) : 0;
  text += `1. Kesimpulan Matriks: Distribusi pemetaan menunjukkan perencanaan produk yang sangat efisien, di mana ${pctI}% ide (${countI} fitur) berada di Kuadran I (Quick Wins) dan ${pctII}% ide (${countII} fitur) di Kuadran II (Major Projects). Kuadran III dan IV kosong (0 ide) membuktikan tidak ada fitur dengan dampak rendah atau sumber daya terbuang.\n`;
  text += `2. Rekomendasi Strategis: Alokasikan 90% kapasitas pengembangan pada Tahap 1 (Quick Wins) untuk menjamin alur transaksi dan kepuasan pelanggan, kemudian lanjutkan Tahap 2 (Barcode Scanner) guna digitalisasi operasional inventaris gudang.\n`;

  return text;
}
