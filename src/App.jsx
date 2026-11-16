import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import StatsSummary from "./components/StatsSummary";
import FilterBar from "./components/FilterBar";
import MatrixView from "./components/MatrixView";
import TableView from "./components/TableView";
import AnalysisSummary from "./components/AnalysisSummary";
import IdeaModal from "./components/IdeaModal";
import IdeaDetailModal from "./components/IdeaDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Toast from "./components/Toast";
import { INITIAL_IDEAS } from "./data/initialIdeas";
import {
  calculateQuadrant,
  getScoresForQuadrant,
  generateUniqueId,
  formatSummaryForClipboard,
  exportIdeasToCsv,
  downloadCsvFile,
  QUADRANTS,
} from "./utils/matrixUtils";

const STORAGE_KEY = "ideation_matrix_umkm_shoes_lkpd_final";

export default function App() {
  // Initialize ideas from localStorage or fallback to the 10 official LKPD ideas
  const [ideas, setIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca localStorage:", e);
    }
    return INITIAL_IDEAS;
  });

  // UI States
  const [targetFilter, setTargetFilter] = useState("Semua"); // Semua, Pembeli, Penjual
  const [activeQuadrantFilter, setActiveQuadrantFilter] = useState(null); // null, I, II, III, IV, pool
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("matrix"); // matrix | table

  // Modals & Drag states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [detailIdea, setDetailIdea] = useState(null);
  const [deletingIdeaId, setDeletingIdeaId] = useState(null);

  const [draggedIdeaId, setDraggedIdeaId] = useState(null);
  const [dragOverQuadrant, setDragOverQuadrant] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Persist to localStorage whenever ideas change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage:", e);
    }
  }, [ideas]);

  // Counts for target filter badges
  const ideasCount = useMemo(() => {
    return {
      all: ideas.length,
      pembeli: ideas.filter((item) => item.target === "Pembeli").length,
      penjual: ideas.filter((item) => item.target === "Penjual").length,
    };
  }, [ideas]);

  // Filtered ideas based on Target, Quadrant click, and Search
  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      // 1. Target Filter
      if (targetFilter !== "Semua" && item.target !== targetFilter) {
        return false;
      }
      // 2. Quadrant Filter from Stats Bar (if active)
      if (activeQuadrantFilter && activeQuadrantFilter !== "all") {
        const q = item.quadrant || "pool";
        if (q !== activeQuadrantFilter) return false;
      }
      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = (item.description || "").toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });
  }, [ideas, targetFilter, activeQuadrantFilter, searchQuery]);

  // Auto-Plot System: Groups ideas automatically based on feasibility & impact scores
  const handleAutoPlot = () => {
    let plottedCount = 0;
    const updated = ideas.map((item) => {
      const newQuadrant = calculateQuadrant(item.feasibility, item.impact);
      if (newQuadrant !== item.quadrant) {
        plottedCount++;
      }
      return {
        ...item,
        quadrant: newQuadrant,
        updatedAt: Date.now(),
      };
    });

    setIdeas(updated);
    showToast(
      `Auto-Plot selesai! ${plottedCount > 0 ? `${plottedCount} ide baru berhasil diplot` : "Seluruh ide telah sesuai dengan skor masing-masing"}.`,
      "success"
    );
  };

  // Copy Results to Clipboard for Google Docs
  const handleCopyResults = async () => {
    try {
      const summaryText = formatSummaryForClipboard(ideas);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = summaryText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      showToast(
        "Rangkuman LKPD berhasil disalin ke clipboard! Format rapi siap dipaste ke Google Docs.",
        "success"
      );
    } catch (e) {
      console.error("Gagal menyalin ke clipboard:", e);
      showToast("Gagal menyalin teks ke clipboard. Silakan coba lagi.", "error");
    }
  };

  // Export ideas to CSV (Excel / Google Sheets)
  const handleExportCsv = () => {
    if (ideas.length === 0) {
      showToast("Belum ada data ide untuk diekspor ke CSV.", "info");
      return;
    }
    const csvContent = exportIdeasToCsv(ideas);
    downloadCsvFile(csvContent, "ideation-matrix-umkm-sepatu-sandal.csv");
    showToast("File CSV berhasil diunduh!", "success");
  };

  // Print or Save as PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Reset to 0 ideas (clear all ideas completely)
  const handleResetData = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mereset dan menghapus seluruh ide? Total ide akan menjadi 0."
      )
    ) {
      setIdeas([]);
      showToast("Seluruh ide telah dihapus. Total ide sekarang 0.", "info");
    }
  };

  // Load/Restore 10 official LKPD ideas with confirmation
  const handleLoadOfficialLkpd = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin memuat 10 data ide resmi LKPD Guru? Seluruh perubahan atau data saat ini akan digantikan dengan dataset resmi LKPD."
      )
    ) {
      setIdeas(INITIAL_IDEAS);
      showToast("10 ide resmi LKPD Guru berhasil dimuat!", "success");
    }
  };

  // Add or Edit Save handler
  const handleSaveIdea = (ideaData) => {
    if (editingIdea) {
      // Update existing
      setIdeas((prev) =>
        prev.map((item) =>
          item.id === editingIdea.id
            ? {
                ...item,
                ...ideaData,
                updatedAt: Date.now(),
              }
            : item
        )
      );
      showToast(`Ide "${ideaData.title}" berhasil diperbarui.`);
    } else {
      // Create new
      const newIdea = {
        id: generateUniqueId(),
        ...ideaData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setIdeas((prev) => [newIdea, ...prev]);
      showToast(`Ide baru "${ideaData.title}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
    setEditingIdea(null);
  };

  // Open modal for editing
  const handleOpenEditModal = (idea) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  // Open modal for full detail viewing
  const handleOpenDetailModal = (idea) => {
    setDetailIdea(idea);
  };

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingIdea(null);
    setIsModalOpen(true);
  };

  // Move quadrant (via quick buttons or drag and drop)
  const handleMoveQuadrant = (ideaId, targetQuadrant) => {
    setIdeas((prev) =>
      prev.map((item) => {
        if (item.id === ideaId) {
          // Adjust scores to match target quadrant so scores and positions stay in sync!
          const { feasibility, impact } = getScoresForQuadrant(
            targetQuadrant,
            item.feasibility,
            item.impact
          );
          return {
            ...item,
            quadrant: targetQuadrant,
            feasibility,
            impact,
            updatedAt: Date.now(),
          };
        }
        return item;
      })
    );

    const quadTitle = QUADRANTS[targetQuadrant]?.name || targetQuadrant;
    showToast(`Ide dipindahkan ke ${quadTitle}.`, "info");
  };

  // Delete idea confirmation
  const handleDeleteClick = (ideaId) => {
    setDeletingIdeaId(ideaId);
  };

  const handleConfirmDelete = () => {
    if (!deletingIdeaId) return;
    const ideaToDelete = ideas.find((item) => item.id === deletingIdeaId);
    setIdeas((prev) => prev.filter((item) => item.id !== deletingIdeaId));
    setDeletingIdeaId(null);
    showToast(
      `Ide "${ideaToDelete?.title || "Fitur"}" berhasil dihapus.`,
      "info"
    );
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, idea) => {
    e.dataTransfer.setData("text/plain", idea.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedIdeaId(idea.id);
  };

  const handleDragEnd = () => {
    setDraggedIdeaId(null);
    setDragOverQuadrant(null);
  };

  const handleDragOver = (e, quadrantId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverQuadrant !== quadrantId) {
      setDragOverQuadrant(quadrantId);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear if leaving the quadrant area
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverQuadrant(null);
  };

  const handleDrop = (e, targetQuadrant) => {
    e.preventDefault();
    const ideaId = e.dataTransfer.getData("text/plain") || draggedIdeaId;
    if (ideaId) {
      handleMoveQuadrant(ideaId, targetQuadrant);
    }
    setDraggedIdeaId(null);
    setDragOverQuadrant(null);
  };

  const ideaBeingDeleted = ideas.find((item) => item.id === deletingIdeaId);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* 1. Header */}
      <Header
        onOpenAddModal={handleOpenAddModal}
        onAutoPlot={handleAutoPlot}
        onCopyResults={handleCopyResults}
        onExportCsv={handleExportCsv}
        onPrintPdf={handlePrintPdf}
        onResetData={handleResetData}
        onLoadLkpdData={handleLoadOfficialLkpd}
        totalIdeas={ideas.length}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Ringkasan Jumlah Seluruh Ide & Kuadran */}
        <section aria-label="Ringkasan Statistik">
          <StatsSummary
            ideas={ideas}
            activeQuadrantFilter={activeQuadrantFilter}
            onSelectQuadrant={setActiveQuadrantFilter}
          />
        </section>

        {/* Filter Target Pengguna & View Switch */}
        <section aria-label="Filter dan Kontrol Tampilan">
          <FilterBar
            targetFilter={targetFilter}
            onTargetFilterChange={setTargetFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            ideasCount={ideasCount}
          />
        </section>

        {/* Active Filters Indicator banner if search or quadrant active */}
        {((activeQuadrantFilter && activeQuadrantFilter !== "all") || searchQuery) && (
          <div className="flex items-center justify-between text-xs bg-zinc-100 border border-zinc-200 px-3.5 py-2 rounded-lg text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-800">Filter Aktif:</span>
              {activeQuadrantFilter && activeQuadrantFilter !== "all" && (
                <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded font-medium text-zinc-800">
                  {QUADRANTS[activeQuadrantFilter]?.name || activeQuadrantFilter}
                </span>
              )}
              {searchQuery && (
                <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded font-medium text-zinc-800">
                  "{searchQuery}"
                </span>
              )}
              <span className="text-zinc-500">
                ({filteredIdeas.length} ide ditemukan)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveQuadrantFilter(null);
                setSearchQuery("");
              }}
              className="font-medium text-zinc-900 underline hover:text-zinc-700 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* 3. Main Views: Matrix View vs Table View (Always displayed directly, even when 0 ideas) */}
        <section aria-label="Area Kerja Ideation Matrix">
          {viewMode === "matrix" ? (
            <MatrixView
              ideas={filteredIdeas}
              onEditIdea={handleOpenEditModal}
              onDeleteIdea={handleDeleteClick}
              onMoveQuadrant={handleMoveQuadrant}
              onViewDetail={handleOpenDetailModal}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              draggedIdeaId={draggedIdeaId}
              dragOverQuadrant={dragOverQuadrant}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onAutoPlot={handleAutoPlot}
            />
          ) : (
            <TableView
              ideas={filteredIdeas}
              onEditIdea={handleOpenEditModal}
              onDeleteIdea={handleDeleteClick}
              onMoveQuadrant={handleMoveQuadrant}
              onViewDetail={handleOpenDetailModal}
            />
          )}
        </section>

        {/* 4. Kesimpulan Analisis Otomatis & Rekomendasi Prioritas (LKPD) */}
        <section aria-label="Kesimpulan Analisis dan Rekomendasi Prioritas LKPD">
          <AnalysisSummary ideas={ideas} />
        </section>

        {/* Print-Only: Rekapitulasi Lengkap Seluruh Ide LKPD untuk Ekspor PDF / Cetak */}
        <div className="hidden print:block pt-6 border-t-2 border-zinc-900 mt-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-300">
            <div>
              <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wide">
                Tabel Rangkuman LKPD - Rekapitulasi 10 Fitur Produk
              </h2>
              <p className="text-xs text-zinc-600">
                E-Commerce Sepatu &amp; Sandal UMKM • Feasibility vs Impact Matrix
              </p>
            </div>
            <div className="text-xs text-zinc-500 font-mono text-right">
              Total: {ideas.length} Ide Fitur
            </div>
          </div>

          <table className="w-full text-left border-collapse text-xs border border-zinc-300">
            <thead>
              <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-800 font-bold">
                <th className="py-2 px-2 text-center w-8 border-r border-zinc-300">No</th>
                <th className="py-2 px-2 border-r border-zinc-300">Nama Ide Fitur</th>
                <th className="py-2 px-2 border-r border-zinc-300">Deskripsi</th>
                <th className="py-2 px-2 text-center border-r border-zinc-300">Target</th>
                <th className="py-2 px-1.5 text-center border-r border-zinc-300">Feas</th>
                <th className="py-2 px-1.5 text-center border-r border-zinc-300">Imp</th>
                <th className="py-2 px-1.5 text-center border-r border-zinc-300">Total</th>
                <th className="py-2 px-2 border-r border-zinc-300">Kuadran</th>
                <th className="py-2 px-2">Prioritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {ideas.map((item, idx) => {
                const qid = item.quadrant || "pool";
                const quad = QUADRANTS[qid] || QUADRANTS.pool;
                const totalScore = (item.feasibility ?? 0) + (item.impact ?? 0);
                return (
                  <tr key={item.id} className="border-b border-zinc-200">
                    <td className="py-1.5 px-2 text-center font-mono border-r border-zinc-300">{idx + 1}</td>
                    <td className="py-1.5 px-2 font-bold text-zinc-900 border-r border-zinc-300">{item.title}</td>
                    <td className="py-1.5 px-2 text-zinc-700 leading-snug border-r border-zinc-300 text-[11px]">{item.description}</td>
                    <td className="py-1.5 px-2 text-center border-r border-zinc-300">{item.target}</td>
                    <td className="py-1.5 px-1.5 text-center font-mono font-bold border-r border-zinc-300">{item.feasibility}</td>
                    <td className="py-1.5 px-1.5 text-center font-mono font-bold border-r border-zinc-300">{item.impact}</td>
                    <td className="py-1.5 px-1.5 text-center font-mono font-bold border-r border-zinc-300">{totalScore}</td>
                    <td className="py-1.5 px-2 font-semibold border-r border-zinc-300">Kuadran {quad.id}</td>
                    <td className="py-1.5 px-2 text-zinc-800 text-[11px]">{quad.priority}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800">Ideation Matrix</span>
            <span>•</span>
            <span>Lembar Kerja Peserta Didik (LKPD) Produk Digital UMKM</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Metode Feasibility vs Impact • E-Commerce Sepatu &amp; Sandal
          </div>
        </div>
      </footer>

      {/* Modal Detail Lengkap Ide */}
      <IdeaDetailModal
        isOpen={!!detailIdea}
        onClose={() => setDetailIdea(null)}
        idea={detailIdea}
        onEdit={(idea) => {
          setDetailIdea(null);
          handleOpenEditModal(idea);
        }}
      />

      {/* Modal Tambah / Edit Ide */}
      <IdeaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIdea(null);
        }}
        onSave={handleSaveIdea}
        editingIdea={editingIdea}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={!!deletingIdeaId}
        onClose={() => setDeletingIdeaId(null)}
        onConfirm={handleConfirmDelete}
        ideaTitle={ideaBeingDeleted?.title || ""}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
