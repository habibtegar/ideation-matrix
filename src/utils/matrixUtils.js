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
    rule: "Feasibility ≤ 3 & Impact ≥ 4",
    tagColor: "bg-blue-50 text-blue-800 border-blue-200",
    dotColor: "bg-blue-600",
    priority: "Tinggi (P2)",
    recommendation: "Rencanakan secara matang dalam roadmap jangka menengah. Memerlukan riset teknis, integrasi pihak ketiga, atau alokasi sumber daya lebih besar."
  },
  III: {
    id: "III",
    name: "TIME SINKS",
    title: "Kuadran III – TIME SINKS",
    position: "Kiri Bawah",
    badge: "Pertimbangkan Kembali",
    description: "Ide dengan prioritas rendah.",
    rule: "Feasibility ≤ 3 & Impact ≤ 3",
    tagColor: "bg-rose-50 text-rose-800 border-rose-200",
    dotColor: "bg-rose-600",
    priority: "Rendah (P4)",
    recommendation: "Tunda atau evaluasi ulang. Fitur ini memiliki dampak rendah namun memerlukan usaha atau biaya yang cukup tinggi untuk UMKM."
  },
  IV: {
    id: "IV",
    name: "FILL-INS",
    title: "Kuadran IV – FILL-INS",
    position: "Kanan Bawah",
    badge: "Pengisi Waktu",
    description: "Ide mudah diterapkan tetapi dampaknya relatif rendah.",
    rule: "Feasibility ≥ 4 & Impact ≤ 3",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-600",
    priority: "Sedang (P3)",
    recommendation: "Kerjakan ketika ada waktu luang setelah fitur Quick Wins selesai, atau saat tim membutuhkan pekerjaan cepat tanpa risiko besar."
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
 * Rule:
 * - Feasibility 4–5 and Impact 4–5 → Kuadran I
 * - Feasibility 1–3 and Impact 4–5 → Kuadran II
 * - Feasibility 1–3 and Impact 1–3 → Kuadran III
 * - Feasibility 4–5 and Impact 1–3 → Kuadran IV
 * Missing/incomplete scores → pool
 */
export function calculateQuadrant(feasibility, impact) {
  if (feasibility == null || impact == null) return "pool";
  const f = Number(feasibility);
  const i = Number(impact);
  if (isNaN(f) || isNaN(i) || f < 1 || f > 5 || i < 1 || i > 5) return "pool";

  if (f >= 4 && i >= 4) return "I";
  if (f <= 3 && i >= 4) return "II";
  if (f <= 3 && i <= 3) return "III";
  if (f >= 4 && i <= 3) return "IV";

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
      if (f > 3) f = 3;
      if (i < 4) i = 4;
      break;
    case "III":
      if (f > 3) f = 3;
      if (i > 3) i = 3;
      break;
    case "IV":
      if (f < 4) f = 4;
      if (i > 3) i = 3;
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

    return a.title.localeCompare(b.title);
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

  let text = `# IDEATION PRIORITY MATRIX: E-COMMERCE SEPATU & SANDAL UMKM\n`;
  text += `Rangkuman Penentuan Prioritas Pengembangan Fitur Produk (Feasibility vs Impact Matrix)\n\n`;

  text += `## RINGKASAN METRIK PROYEK\n`;
  text += `- Total Seluruh Ide: ${total} ide\n`;
  text += `  • Target Pembeli: ${countPembeli} ide\n`;
  text += `  • Target Penjual: ${countPenjual} ide\n`;
  text += `- Kuadran I (Quick Wins): ${countI} ide\n`;
  text += `- Kuadran II (Major Projects): ${countII} ide\n`;
  text += `- Kuadran III (Time Sinks): ${countIII} ide\n`;
  text += `- Kuadran IV (Fill-Ins): ${countIV} ide\n`;
  if (countPool > 0) {
    text += `- Idea Pool (Belum Diplot): ${countPool} ide\n`;
  }
  text += `\n==================================================\n\n`;

  const quadrantOrder = ["I", "II", "IV", "III", "pool"];

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
        text += `${index + 1}. ${item.title}\n`;
        text += `   - Target Pengguna: ${item.target}\n`;
        text += `   - Skor Feasibility: ${item.feasibility != null ? item.feasibility + "/5" : "-"}\n`;
        text += `   - Skor Impact: ${item.impact != null ? item.impact + "/5" : "-"}\n`;
        text += `   - Deskripsi: ${item.description || "-"}\n`;
        text += `   - Prioritas LKPD: ${quad.priority}\n\n`;
      });
    }
    text += `--------------------------------------------------\n\n`;
  });

  text += `## KESIMPULAN & REKOMENDASI PENGEMBANGAN UMKM:\n`;
  text += `1. Fitur pada Kuadran I (Quick Wins) merupakan prioritas mutlak yang harus dikembangkan pada fase pertama (MVP), karena memberikan nilai maksimal bagi operasional toko sepatu/sandal dan kenyamanan pembeli dengan investasi sumber daya yang efisien.\n`;
  text += `2. Fitur pada Kuadran II (Major Projects) harus dijadwalkan secara bertahap pada fase berikutnya setelah alur belanja dasar berjalan stabil.\n`;
  text += `3. Fitur pada Kuadran IV (Fill-Ins) dapat dikerjakan sebagai pengisi waktu luang atau pelengkap antarmuka.\n`;
  text += `4. Fitur pada Kuadran III (Time Sinks) dihindari terlebih dahulu untuk menghemat modal dan waktu kerja UMKM.\n`;

  return text;
}

