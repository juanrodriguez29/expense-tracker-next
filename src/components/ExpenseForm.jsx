import { useState } from "react";

export function ExpenseForm({ onAddExpense, categories, onClearFilter }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const validateAmount = (e) => {
    const value = e.target.value;
    const regex = /^\d*(\.\d{0,2})?$/;
    if (value === "" || value.startsWith("-") || !regex.test(value)) return;
    setAmount(value);
    if (value) setErrors(prev => ({ ...prev, amount: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Expense name is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onAddExpense({ id: crypto.randomUUID(), title, amount, date, category });
    setTitle("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    setErrors({});
    onClearFilter();
  };

  const inputClass = "w-full h-[42px] px-3 py-2 text-base appearance-none rounded-lg border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";

  const fieldClass = (hasError) =>
    `${inputClass} ${hasError ? "border-red-300" : "border-slate-200"}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="expense-title" className="text-sm font-medium text-slate-700">
          Expense name
        </label>
        <input
          id="expense-title"
          placeholder="e.g. Grocery run"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({ ...prev, title: undefined }));
          }}
          className={fieldClass(errors.title)}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="expense-amount" className="text-sm font-medium text-slate-700">
          Amount
        </label>
        <input
          id="expense-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={validateAmount}
          className={fieldClass(errors.amount)}
        />
        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="expense-date" className="text-sm font-medium text-slate-700">
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          value={date}
          max={today}
          onChange={e => setDate(e.target.value)}
          className={fieldClass(false)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="expense-category" className="text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="expense-category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={fieldClass(false)}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-lg transition-all duration-150 cursor-pointer mt-1"
      >
        Add Expense
      </button>
    </form>
  );
}
