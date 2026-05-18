
export function FilterBar({ months, categories, selectedMonth, selectedCategory, onChangeMonth, onChangeCategory, onClearFilters }) {

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleString("en-AU", { month: "short", year: "numeric" });
  };

  const isFiltering = selectedMonth || selectedCategory;

  const selectClass = "flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer";

  return (
    <div className="flex flex-col gap-2 mb-4">

      <div className="flex gap-2">
        <select
          aria-label="Filter by month"
          value={selectedMonth || ""}
          onChange={(e) => onChangeMonth(e.target.value)}
          className={selectClass}
        >
          <option value="">All months</option>
          {months.map(month => (
            <option key={month} value={month}>{formatMonth(month)}</option>
          ))}
        </select>

        <select
          aria-label="Filter by category"
          value={selectedCategory || ""}
          onChange={(e) => onChangeCategory(e.target.value)}
          className={selectClass}
        >
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.label}</option>
          ))}
        </select>
      </div>

      {isFiltering && (
        <button
          onClick={onClearFilters}
          aria-label="Clear all filters"
          className="self-end flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Clear filters
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}

    </div>
  );
}
