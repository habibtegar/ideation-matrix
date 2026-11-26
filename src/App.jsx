import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import StatsSummary from "./components/StatsSummary";
import ScatterPlotChart from "./components/ScatterPlotChart";
import FilterBar from "./components/FilterBar";
import TableView from "./components/TableView";
import IdeaModal from "./components/IdeaModal";
import IdeaDetailModal from "./components/IdeaDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import Toast from "./components/Toast";
import { INITIAL_IDEAS } from "./data/initialIdeas";
import {
  calculateQuadrant,
  generateUniqueId,
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
  const [activeQuadrantFilter, setActiveQuadrantFilter] = useState(null); // null, I, II, III, IV
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [detailIdea, setDetailIdea] = useState(null);
  const [deletingIdeaId, setDeletingIdeaId] = useState(null);

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
      // 2. Active Quadrant Filter from Stats Bar (if selected)
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

  // Add or Edit Save handler (Kuadran selalu ditentukan otomatis dari Feasibility & Impact)
  const handleSaveIdea = (ideaData) => {
    const autoQuadrant = calculateQuadrant(ideaData.feasibility, ideaData.impact);

    if (editingIdea) {
      // Update existing
      setIdeas((prev) =>
        prev.map((item) =>
          item.id === editingIdea.id
            ? {
                ...item,
                ...ideaData,
                quadrant: autoQuadrant,
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
        quadrant: autoQuadrant,
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

  const ideaBeingDeleted = ideas.find((item) => item.id === deletingIdeaId);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* 1. Header (Navbar tanpa tombol Salin Teks, CSV, dan PDF) */}
      <Header
        onOpenAddModal={handleOpenAddModal}
        onAutoPlot={handleAutoPlot}
        onResetData={handleResetData}
        onLoadLkpdData={handleLoadOfficialLkpd}
        totalIdeas={ideas.length}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Ringkasan Jumlah Seluruh Ide & Kuadran (5 Kartu, tanpa Idea Pool) */}
        <section aria-label="Ringkasan Statistik">
          <StatsSummary
            ideas={ideas}
            activeQuadrantFilter={activeQuadrantFilter}
            onSelectQuadrant={setActiveQuadrantFilter}
          />
        </section>

        {/* Fitur Grafik Kuadran (Scatter Plot): Analisis Feasibility vs Impact */}
        <ScatterPlotChart
          ideas={ideas}
          onViewDetail={handleOpenDetailModal}
        />

        {/* Filter Target Pengguna & Pencarian */}
        <section aria-label="Filter dan Kontrol Tampilan">
          <FilterBar
            targetFilter={targetFilter}
            onTargetFilterChange={setTargetFilter}
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
                  {QUADRANTS[activeQuadrantFilter]?.name || `Kuadran ${activeQuadrantFilter}`}
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

        {/* 3. Tampilan Utama: Table View (Satu-Satunya Tampilan Daftar Ide) */}
        <section aria-label="Area Kerja Tabel Ide LKPD">
          <TableView
            ideas={filteredIdeas}
            onEditIdea={handleOpenEditModal}
            onDeleteIdea={handleDeleteClick}
            onViewDetail={handleOpenDetailModal}
          />
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
              <tr className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-300">
                <th className="p-2 border-r border-zinc-300 w-12 text-center">No</th>
                <th className="p-2 border-r border-zinc-300">Nama Ide / Fitur</th>
                <th className="p-2 border-r border-zinc-300 w-24">Target</th>
                <th className="p-2 border-r border-zinc-300 w-20 text-center">Feas (1-5)</th>
                <th className="p-2 border-r border-zinc-300 w-20 text-center">Impact (1-5)</th>
                <th className="p-2 border-r border-zinc-300 w-20 text-center">Total (2-10)</th>
                <th className="p-2 w-32">Kuadran</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea, idx) => (
                <tr key={idea.id} className="border-b border-zinc-200">
                  <td className="p-2 border-r border-zinc-200 text-center font-mono font-medium">
                    {idx + 1}
                  </td>
                  <td className="p-2 border-r border-zinc-200 font-medium">
                    {idea.title}
                    {idea.description && (
                      <span className="block text-[10px] text-zinc-500 mt-0.5">
                        {idea.description}
                      </span>
                    )}
                  </td>
                  <td className="p-2 border-r border-zinc-200">{idea.target}</td>
                  <td className="p-2 border-r border-zinc-200 text-center font-mono">
                    {idea.feasibility}
                  </td>
                  <td className="p-2 border-r border-zinc-200 text-center font-mono">
                    {idea.impact}
                  </td>
                  <td className="p-2 border-r border-zinc-200 text-center font-mono font-bold">
                    {(idea.feasibility ?? 0) + (idea.impact ?? 0)}
                  </td>
                  <td className="p-2 font-semibold">
                    {idea.quadrant === "I"
                      ? "I (Quick Wins)"
                      : idea.quadrant === "II"
                      ? "II (Major Projects)"
                      : idea.quadrant === "III"
                      ? "III (Time Sinks)"
                      : idea.quadrant === "IV"
                      ? "IV (Fill-Ins)"
                      : "Idea Pool"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-400 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Ideation Matrix UMKM • E-Commerce Sepatu &amp; Sandal</span>
          <span className="font-mono text-[11px] text-zinc-400">
            10 Ide Fitur Resmi LKPD Guru
          </span>
        </div>
      </footer>

      {/* Add / Edit Idea Modal */}
      {isModalOpen && (
        <IdeaModal
          isOpen={isModalOpen}
          initialData={editingIdea}
          onClose={() => {
            setIsModalOpen(false);
            setEditingIdea(null);
          }}
          onSave={handleSaveIdea}
        />
      )}

      {/* View Detail Modal */}
      {detailIdea && (
        <IdeaDetailModal
          isOpen={!!detailIdea}
          idea={detailIdea}
          onClose={() => setDetailIdea(null)}
          onEdit={(idea) => {
            setDetailIdea(null);
            handleOpenEditModal(idea);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingIdeaId && (
        <DeleteConfirmModal
          isOpen={!!deletingIdeaId}
          ideaTitle={ideaBeingDeleted?.title || "Fitur"}
          onClose={() => setDeletingIdeaId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Toast Floating Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
