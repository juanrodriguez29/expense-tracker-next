import { IconDisc } from './IconDisc';
import { XIcon } from './XIcon';
import { money } from '../lib/utils';

export function BudgetCard({ category, budget, spent, onSetBudget, onEdit, onDelete }) {

  const pct = budget ? Math.round(spent / budget.amount * 100) : 0;
  const shownPct = Math.min(100, pct);
  const over = budget && spent > budget.amount;
  const near = !over && pct >= 80;
  const barColor = over ? '#EF4444' : near ? '#F59E0B' : category.color;
  const left = budget ? budget.amount - spent : 0;


  let badge = { cls: 'bg-[#DCFCE7] text-[#15803D]', text: 'On track' };
  if (!budget) badge = { cls: 'bg-[#F4F6FA] text-[#94A3B8]', text: 'Set budget' };
  else if (over) badge = { cls: 'bg-[#FEE2E2] text-[#DC2626]', text: 'Over budget' };
  else if (near) badge = { cls: 'bg-[#FEF3C7] text-[#B45309]', text: 'Near limit' };


  return (
    <div
      className="
      bg-white
      border border-[#E5E7EB]
      rounded-[18px]
      px-[22px] py-5
      flex flex-col gap-4
      cursor-pointer
      transition-all duration-150
      hover:-translate-y-0.5
      hover:border-[#DCE0E7]
      hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]
    "
      onClick={(e) => {
        e.stopPropagation()
        onEdit(budget)
      }}
    >
      <div className="flex items-center gap-3.5">
        <IconDisc
          color={category.color}
          glyph={category.glyph}
          size="46"
        />

        <span className="flex-1 text-base font-bold tracking-[-0.01em] text-[#0F172A]">
          {category.label}
        </span>

        {budget && (
          <button
            className="text-[#94A3B8] text-lg leading-none border-none bg-transparent cursor-pointer px-1"
            aria-label="Category options"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(budget?.id)
            }}
          >
            <XIcon />
          </button>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-extrabold tracking-[-0.03em] tabular-nums text-[#0F172A]">
          {money(spent)}
        </span>

        <span className="text-sm font-semibold text-[#94A3B8] tabular-nums">
          {budget ? `of ${money(budget.amount)}` : "spent"}
        </span>
      </div>

      <div className="h-2 rounded-full bg-[#F4F6FA] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${shownPct}%`,
            background: barColor,
            boxShadow: "none",
          }}
        />
      </div>

      {/* Meta row */}
      <div className="flex justify-between items-center text-xs">
        {budget ? (
          <>
            <span
              className="font-bold"
              style={{ color: barColor }}
            >
              {pct}%
            </span>

            <span className="text-[#475569] font-medium">
              {over
                ? `${money(Math.abs(left))} over`
                : `${money(left)} left`}
            </span>
          </>
        ) : (
          <span className="text-[#475569] font-medium">
            Set a budget to track
          </span>
        )}

        <span
          className={`text-[10px] font-bold tracking-[0.04em] uppercase px-2 py-[3px] rounded-full ${badge.cls}`}
        >
          {badge.text}
        </span>
      </div>
    </div>
  )
}



