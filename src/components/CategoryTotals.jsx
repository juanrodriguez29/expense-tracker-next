
export function CategoryTotals({ categoryTotals, colors }) {

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value);

  if (categoryTotals.length === 0) {
    return <p className="text-center text-slate-400 text-sm py-4">No expenses yet</p>;
  }

  return (
    <div className="flex flex-col gap-2 text-xs w-full">
      {categoryTotals.map((category, index) => (
        <div key={category.id} className="flex items-center gap-2 text-[#0F172A]">
          <div className="w-2 h-2 rounded-sm" style={{ background: colors[index % colors.length] }} />
          <span className="flex-1 text-[#475569]">{category.label}</span>
          <span className="font-semibold">{formatCurrency(category.total)}</span>
        </div>
      ))}
    </div>
  );
}
 