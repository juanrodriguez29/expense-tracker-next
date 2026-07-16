import { CATEGORIES } from '../lib/categories';

export function FilterBar({ uniqueMonths, selectedMonth, activeCategory, setSelectedMonth, setActiveCategory, search, setSearch, clearFilters }) {

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleString("en-AU", { month: "short", year: "numeric" });
  };

  const isFiltering = selectedMonth || activeCategory || search;

  const selectClass = "flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer";

  return (
    <div className="flex flex-col gap-2 mb-4">

      <div className="grid grid-cols-[1fr_190px_200px] gap-3">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={search}
            type="text"
            placeholder="Search transactions"
            onChange={(e) => { setSearch(e.target.value) }}
            className="w-full h-[46px] pl-[42px] pr-3.5 rounded-xl bg-white border border-[#E5E7EB]
                 text-sm text-[#0F172A] placeholder:text-[#94A3B8]
                 focus:outline-none focus:border-[#5B4FE9] focus:ring-[3px] focus:ring-[#5B4FE9]/12
                 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            aria-label="Filter by month"
            value={selectedMonth || ""}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full h-[46px] pl-3.5 pr-9 rounded-xl bg-white border border-[#E5E7EB]
                 appearance-none cursor-pointer text-sm text-[#0F172A]
                 focus:outline-none focus:border-[#5B4FE9] focus:ring-[3px] focus:ring-[#5B4FE9]/12
                 transition-colors"
          >
            <option value="">All months</option>
            {uniqueMonths.map(month => (
              <option key={month} value={month}>{formatMonth(month)}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-[70%]
                     w-2 h-2 rotate-45 border-r-2 border-b-2 border-[#475569]" />
        </div>
        <div className="relative">
          <select
            aria-label="Filter by category"
            value={activeCategory || ""}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full h-[46px] pl-3.5 pr-9 rounded-xl bg-white border border-[#E5E7EB]
                 appearance-none cursor-pointer text-sm text-[#0F172A]
                 focus:outline-none focus:border-[#5B4FE9] focus:ring-[3px] focus:ring-[#5B4FE9]/12
                 transition-colors"
          >
            <option value="">All categories</option>
            {CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-[70%]
                     w-2 h-2 rotate-45 border-r-2 border-b-2 border-[#475569]" />
        </div>
      </div>

      {
        isFiltering && (
          <button
            onClick={clearFilters}
            aria-label="Clear all filters"
            className="self-end flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Clear filters
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )
      }

    </div >
  );
}
