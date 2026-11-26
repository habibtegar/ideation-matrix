import { useState } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { calculateQuadrant, QUADRANTS } from "../utils/matrixUtils";

function IdeaModalForm({ onClose, onSave, editingIdea }) {
  const [title, setTitle] = useState(editingIdea?.title || "");
  const [description, setDescription] = useState(editingIdea?.description || "");
  const [target, setTarget] = useState(editingIdea?.target || "Pembeli");
  const [feasibility, setFeasibility] = useState(editingIdea?.feasibility ?? null);
  const [impact, setImpact] = useState(editingIdea?.impact ?? null);
  const [errors, setErrors] = useState({});

  const predictedQuadrant = calculateQuadrant(feasibility, impact);
  const quadInfo = QUADRANTS[predictedQuadrant];

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = "Judul fitur wajib diisi.";
    }
    if (feasibility === null) {
      errs.feasibility = "Pilih skor Feasibility (1 - 5).";
    }
    if (impact === null) {
      errs.impact = "Pilih skor Impact (1 - 5).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      target,
      feasibility,
      impact,
      quadrant: predictedQuadrant,
    });
  };

  const scoreOptions = [1, 2, 3, 4, 5];

  return (
    <div
      className="w-full max-w-lg max-h-[92dvh] flex flex-col bg-white border border-zinc-200 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-200 shrink-0 bg-white">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
            {editingIdea ? "Edit Ide Fitur" : "Tambah Ide Baru"}
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
            Tentukan parameter fitur produk UMKM E-Commerce Sepatu &amp; Sandal.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 active:bg-zinc-100 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer touch-manipulation"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Body Form: Scrollable on mobile/short viewports */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Judul Fitur (Wajib) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="feature-title"
              className="text-xs font-semibold text-zinc-800"
            >
              Judul Fitur <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-zinc-400">Wajib diisi</span>
          </div>
          <input
            id="feature-title"
            type="text"
            placeholder="Contoh: Fitur Rekomendasi Ukuran Sepatu..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 transition-all min-h-[38px] ${
              errors.title
                ? "border-rose-400 focus:ring-rose-400 focus:border-rose-400"
                : "border-zinc-300 focus:ring-zinc-900 focus:border-zinc-900"
            }`}
            autoFocus
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label
            htmlFor="feature-desc"
            className="block text-xs font-semibold text-zinc-800 mb-1.5"
          >
            Deskripsi Singkat
          </label>
          <textarea
            id="feature-desc"
            rows={2}
            placeholder="Jelaskan fungsi fitur dan manfaatnya bagi pembeli atau UMKM sepatu..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-none"
          />
        </div>

        {/* Target Pengguna: Pembeli / Penjual */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
            Target Pengguna <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTarget("Pembeli")}
              className={`py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer touch-manipulation min-h-[40px] flex items-center justify-center text-center ${
                target === "Pembeli"
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs font-semibold"
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100"
              }`}
            >
              Pembeli (Customer)
            </button>
            <button
              type="button"
              onClick={() => setTarget("Penjual")}
              className={`py-2 px-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer touch-manipulation min-h-[40px] flex items-center justify-center text-center ${
                target === "Penjual"
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs font-semibold"
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100"
              }`}
            >
              Penjual (UMKM Seller)
            </button>
          </div>
        </div>

        {/* Feasibility Score: Segmented Buttons 1, 2, 3, 4, 5 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Feasibility Score (Kemudahan / Kelayakan){" "}
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-zinc-500">
              {feasibility !== null ? `Skor: ${feasibility}/5` : "Belum dipilih"}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {scoreOptions.map((num) => {
              const isActive = feasibility === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setFeasibility(num);
                    if (errors.feasibility) {
                      setErrors((prev) => ({ ...prev, feasibility: null }));
                    }
                  }}
                  className={`h-10 sm:h-11 text-xs sm:text-sm font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center touch-manipulation ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 active:bg-zinc-200"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Label panduan Rendah, Sedang, Tinggi */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 mt-1.5 px-0.5 font-medium">
            <span>Rendah (1–2)</span>
            <span>Sedang (3)</span>
            <span>Tinggi (4–5)</span>
          </div>
          {errors.feasibility && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.feasibility}</span>
            </p>
          )}
        </div>

        {/* Impact Score: Segmented Buttons 1, 2, 3, 4, 5 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-800">
              Impact Score (Dampak Bisnis &amp; Nilai Pengguna){" "}
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-zinc-500">
              {impact !== null ? `Skor: ${impact}/5` : "Belum dipilih"}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {scoreOptions.map((num) => {
              const isActive = impact === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setImpact(num);
                    if (errors.impact) {
                      setErrors((prev) => ({ ...prev, impact: null }));
                    }
                  }}
                  className={`h-10 sm:h-11 text-xs sm:text-sm font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center touch-manipulation ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 active:bg-zinc-200"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Label panduan Rendah, Sedang, Tinggi */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 mt-1.5 px-0.5 font-medium">
            <span>Rendah (1–2)</span>
            <span>Sedang (3)</span>
            <span>Tinggi (4–5)</span>
          </div>
          {errors.impact && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.impact}</span>
            </p>
          )}
        </div>

        {/* Real-time Quadrant Preview Pill */}
        <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="text-zinc-600 font-medium">Hasil Plot:</span>
          </div>
          {feasibility !== null && impact !== null ? (
            <div className="flex items-center gap-1.5 font-semibold text-zinc-900 text-[11px] sm:text-xs text-right">
              <span
                className={`w-2 h-2 rounded-full ${quadInfo.dotColor} shrink-0`}
              ></span>
              <span>{quadInfo.title}</span>
            </div>
          ) : (
            <span className="text-zinc-400 italic text-[11px] sm:text-xs text-right">
              Akan masuk ke Idea Pool (Belum Diplot)
            </span>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 active:bg-zinc-100 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer touch-manipulation min-h-[38px]"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 rounded-lg transition-colors shadow-xs cursor-pointer touch-manipulation min-h-[38px]"
          >
            {editingIdea ? "Perbarui Ide" : "Simpan Ide"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function IdeaModal({ isOpen, onClose, onSave, editingIdea, initialData }) {
  if (!isOpen) return null;

  const currentIdea = editingIdea || initialData;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <IdeaModalForm
        key={currentIdea?.id || "new"}
        onClose={onClose}
        onSave={onSave}
        editingIdea={currentIdea}
      />
    </div>
  );
}
