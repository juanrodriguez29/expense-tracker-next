import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Stable ID used to link the dialog's aria-labelledby to its heading
const HEADING_ID = "edit-expense-heading";

export function EditExpenseModal({ expense, onSave, onCancel, categories }) {

  // ─── State ────────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);  // guards SSR portal rendering
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const dialogRef = useRef(null);

  // ─── Effects ──────────────────────────────────────────────────────────────

  // Mark as mounted so the portal can safely target document.body
  useEffect(() => { setMounted(true); }, []);

  // Populate fields whenever the expense prop changes (e.g. opening a different item)
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(String(expense.amount));
      setDate(expense.date);
      setCategory(expense.category);
    }
  }, [expense]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // Focus trap: keeps keyboard focus inside the dialog while it's open,
  // and moves focus to the first input on open.
  useEffect(() => {
    if (!mounted) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const trapTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    dialog.addEventListener("keydown", trapTab);
    return () => dialog.removeEventListener("keydown", trapTab);
  }, [mounted]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  // Only allows positive numbers with up to 2 decimal places
  const validateAmount = (e) => {
    const value = e.target.value;
    const regex = /^\d*(\.\d{0,2})?$/;
    if (value === "" || value.startsWith("-") || !regex.test(value)) return;
    setAmount(value);
    if (value) setErrors(prev => ({ ...prev, amount: undefined }));
  };

  // Validates required fields before passing the updated expense to the parent
  const handleSave = async () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Expense name is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    await onSave({ ...expense, title, amount: Number(amount), date, category });
    setSaving(false);
  };

  // ─── Guard ────────────────────────────────────────────────────────────────

  // Prevent rendering the portal before the component is mounted on the client
  if (!mounted) return null;

  // ─── Styles ───────────────────────────────────────────────────────────────

  const inputClass = "w-full px-3 py-2 text-base rounded-lg border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";
  const fieldClass = (hasError) => `${inputClass} ${hasError ? "border-red-300" : "border-slate-200"}`;

  // ─── Render ───────────────────────────────────────────────────────────────

  return createPortal(
    // Backdrop — clicking outside dismisses the modal
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={HEADING_ID}
        className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={HEADING_ID} className="text-lg font-bold text-slate-800 text-center">Edit Expense</h2>

        {/* Title field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-title" className="text-sm font-medium text-slate-700">Expense name</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setErrors(prev => ({ ...prev, title: undefined }));
            }}
            className={fieldClass(errors.title)}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Amount field — text input with decimal keyboard on mobile */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-amount" className="text-sm font-medium text-slate-700">Amount</label>
          <input
            id="edit-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={validateAmount}
            className={fieldClass(errors.amount)}
          />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
        </div>

        {/* Date field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-date" className="text-sm font-medium text-slate-700">Date</label>
          <input
            id="edit-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass(false)}
          />
        </div>

        {/* Category field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-category" className="text-sm font-medium text-slate-700">Category</label>
          <select
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${fieldClass(false)} cursor-pointer`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
