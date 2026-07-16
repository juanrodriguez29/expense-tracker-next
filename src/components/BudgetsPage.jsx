// BudgetsPage.jsx — Tailwind
// SmartLedge — Categories & budgets page: summary strip + grid of CategoryCards.

import { useMemo } from 'react';
import CategoryCard, { money } from './CategoryCard';

// Summary stat card (top strip)
function SummaryCard({ label, value, delta, deltaColor, progress }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-[18px]">
      <div className="text-[11px] font-semibold text-[#475569] tracking-[0.04em] uppercase">{label}</div>
      <div className="text-2xl font-extrabold tracking-[-0.025em] mt-2 tabular-nums text-[#0F172A]">{value}</div>
      {delta && <div className={`text-[11px] font-semibold mt-1 ${deltaColor}`}>{delta}</div>}
      {progress != null && (
        <div className="h-1.5 rounded-full bg-[#F4F6FA] overflow-hidden mt-3">
          <div
            className="h-full rounded-full bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function BudgetsPage({
  categories = [],
  monthLabel = 'June',
  onNewCategory,
  onSelectCategory,
  onEditCategory,
}) {
  const { totalSpent, totalBudget, overCount, spentPct } = useMemo(() => {
    const ts = categories.reduce((s, c) => s + (c.spent || 0), 0);
    const tb = categories.reduce((s, c) => s + (c.budget || 0), 0);
    const oc = categories.filter((c) => c.budget != null && c.spent > c.budget).length;
    return {
      totalSpent: ts,
      totalBudget: tb,
      overCount: oc,
      spentPct: tb ? Math.min(100, Math.round((ts / tb) * 100)) : 0,
    };
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-sans text-[#0F172A] antialiased px-12 py-10">

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[13px] text-[#475569] font-semibold">Tuesday 3 June</div>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] mt-0.5 m-0">Categories &amp; budgets</h1>
        </div>
        <button
          onClick={onNewCategory}
          className="inline-flex items-center gap-2 px-[18px] py-3 rounded-xl border-none cursor-pointer
                     text-white text-sm font-bold
                     bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]
                     shadow-[0_6px_16px_rgba(91,79,233,0.28)]
                     transition-all duration-100 ease-out
                     hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(91,79,233,0.36)] active:translate-y-0"
        >
          <span className="text-[17px] leading-none font-normal">+</span>
          New category
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <SummaryCard
          label={`Spent in ${monthLabel}`}
          value={money(totalSpent)}
          delta={`${spentPct}% of ${money(totalBudget)} budgeted`}
          deltaColor="text-[#5B4FE9]"
          progress={spentPct}
        />
        <SummaryCard
          label="Remaining"
          value={money(totalBudget - totalSpent)}
          delta={`across ${categories.length} categories`}
          deltaColor="text-[#22C55E]"
        />
        <SummaryCard
          label="Over budget"
          value={String(overCount)}
          delta={overCount ? `categor${overCount > 1 ? 'ies' : 'y'} need attention` : 'all on track'}
          deltaColor={overCount ? 'text-[#DC2626]' : 'text-[#94A3B8]'}
        />
      </div>

      {/* Section label */}
      <span className="inline-block text-[11px] font-bold tracking-[0.08em] uppercase text-[#5B4FE9]
                       bg-[#EDEBFD] px-2.5 py-1 rounded-full mb-3.5">
        {monthLabel} budgets
      </span>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            onClick={onSelectCategory}
            onMenu={onEditCategory}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   USAGE

   import BudgetsPage from './BudgetsPage';

   // category shape: { id, label, color, spent, budget (or null), count }
   const categories = [
     { id:'food',          label:'Food',          color:'#22C55E', spent:226,  budget:400,  count:3 },
     { id:'transport',     label:'Transport',     color:'#3B82F6', spent:84,   budget:150,  count:2 },
     { id:'bills',         label:'Bills',         color:'#F59E0B', spent:1000, budget:1000, count:1 },
     { id:'shopping',      label:'Shopping',      color:'#A855F7', spent:312,  budget:300,  count:5 },
     { id:'entertainment', label:'Entertainment', color:'#EC4899', spent:96,   budget:120,  count:2 },
     { id:'health',        label:'Health',        color:'#EF4444', spent:110,  budget:200,  count:1 },
     { id:'savings',       label:'Savings',       color:'#1FAEEC', spent:500,  budget:500,  count:1 },
     { id:'other',         label:'Other',         color:'#94A3B8', spent:37,   budget:null, count:2 },
   ];

   <BudgetsPage
     categories={categories}
     monthLabel="June"
     onNewCategory={() => setDrawerOpen(true)}
     onSelectCategory={(c) => navigate(`/categories/${c.id}`)}
     onEditCategory={(c) => openEdit(c)}
   />

   Merge spend/count into your CATEGORIES list from transactions, e.g.:
     const withSpend = CATEGORIES.map(c => ({
       ...c,
       spent: txByCat[c.id]?.total ?? 0,
       count: txByCat[c.id]?.count ?? 0,
       budget: budgets[c.id] ?? null,
     }));
   ───────────────────────────────────────────────────────── */
