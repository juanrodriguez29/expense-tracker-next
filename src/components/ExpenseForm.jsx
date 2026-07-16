import { useState, useEffect } from "react";
import { CATEGORIES } from '../lib/categories';

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}


export function ExpenseForm({ addExpense, clearFilters, isOpen, onClose }) {
  const [type, setType] = useState('Expense');
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Reset when reopened
  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setTitle(''); 
      setAmount('');
      setDate(todayISO());
      setCategory('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const newErrors = {};
    const value = parseFloat(amount || '0');
    const signed = type === 'expense' ? -Math.abs(value) : Math.abs(value);
    if (!title.trim()) newErrors.title = "Expense name is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }
    addExpense({ 
      id: crypto.randomUUID(), 
      type, 
      title, 
      amount: signed, 
      date, 
      category });
    setTitle("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    setErrors({});
    setSubmitting(false);
    clearFilters?.();
    onClose?.();
  };
 

  const inputBase =
    "w-full px-3.5 py-3 rounded-[11px] bg-[#F4F6FA] border border-transparent text-[15px] text-[#0F172A] " +
    "placeholder:text-[#94A3B8] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] " +
    "focus:outline-none focus:bg-white focus:shadow-[inset_0_0_0_2px_#5B4FE9] transition-all";


   const fieldClass = (hasError) =>
    `${inputBase} ${hasError ? "border-red-300" : "border-slate-200"}`;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]
                   animate-[fadeIn_200ms_ease-out]"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Add transaction"
        className="absolute top-0 right-0 h-full w-full max-w-[460px] bg-white flex flex-col
                   shadow-[-24px_0_60px_rgba(15,23,42,0.18)]
                   animate-[slideIn_360ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-[22px] border-b border-[#E5E7EB]">
          <div>
            <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#5B4FE9] mb-0.5">
              New entry
            </div>
            <h2 className="m-0 text-[19px] font-extrabold tracking-[-0.02em] text-[#0F172A]">
              Add transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-[10px] border-none cursor-pointer bg-[#F4F6FA] text-[#475569]
                       text-lg flex items-center justify-center hover:bg-[#E9EDF3] hover:text-[#0F172A]
                       transition-colors"
          >
          <XIcon />
          </button>
        </div>

        {/* Body */}
        <form id="add-tx-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">

          {/* Type toggle */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-semibold text-[#0F172A]">Type</label>
            <div className="flex gap-1.5 bg-[#F4F6FA] p-[5px] rounded-xl">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={
                  "flex-1 py-2.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all " +
                  (type === 'expense'
                    ? "bg-white text-[#DC2440] shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                    : "bg-transparent text-[#475569]")
                }
              >
                ↓ Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={
                  "flex-1 py-2.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all " +
                  (type === 'income'
                    ? "bg-white text-[#10B981] shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                    : "bg-transparent text-[#475569]")
                }
              >
                ↑ Income
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="tx-name" className="text-[13px] font-semibold text-[#0F172A]">
              {type === 'expense' ? 'Expense name' : 'Income name'}
            </label>
            <input
              id="tx-name"
              className={fieldClass(!!errors.title)}
              placeholder="e.g. Grocery run"
              value={title}
              onChange={(e) => {setTitle(e.target.value);
                if (e.target.value.trim()) setErrors(prev => ({ ...prev, title: undefined }));
              }}
              
            />
             {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="tx-amount" className="text-[13px] font-semibold text-[#0F172A]">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#94A3B8] pointer-events-none">$</span>
              <input
                id="tx-amount"
                inputMode="decimal"
                className={fieldClass(!!errors.amount) + " pl-[30px] font-bold tabular-nums"}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                
              />
               {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount}</p>
        )}
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="tx-date" className="text-[13px] font-semibold text-[#0F172A]">Date</label>
            <input
              id="tx-date"
              type="date"
              className={inputBase + " appearance-none"}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Category chips */}

          {type === 'expense' &&  
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-semibold text-[#0F172A]">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = category === c.label;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={
                      "inline-flex items-center gap-[7px] px-3.5 py-2 rounded-full text-[13px] font-semibold cursor-pointer border transition-all " +
                      (active
                        ? "bg-[#EDEBFD] border-[#5B4FE9] text-[#4A3FD0]"
                        : "bg-white border-[#E5E7EB] text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F4F6FA]")
                    }
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          }
        </form>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-[#E5E7EB] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-3 rounded-xl border-none cursor-pointer text-sm font-bold text-[#0F172A]
                       bg-white shadow-[inset_0_0_0_1px_#E5E7EB] hover:bg-[#F4F6FA] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-tx-form"
            disabled={submitting}
            className="flex-1 px-[18px] py-3 rounded-xl border-none cursor-pointer text-sm font-bold text-white
                       bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]
                       shadow-[0_6px_16px_rgba(91,79,233,0.28)]
                       transition-all duration-100 ease-out
                       hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(91,79,233,0.36)]
                       active:translate-y-0
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {submitting ? 'Adding…' : `Add ${type === 'expense' ? 'expense' : 'income'}`}
          </button>
        </div>
      </aside>
    </div>
  );
}