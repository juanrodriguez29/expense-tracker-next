// CategoryCard.jsx — Tailwind
// SmartLedge — a single category budget card with squared icon disc.
//
// Pass a category object with spend/budget. The card derives its state
// (on-track / near / over / no-budget) and colors the bar + badge.

// Default line-icon glyphs keyed by category id. Swap freely or pass
// your own via the category.icon prop (an SVG path string).
const CATEGORY_GLYPHS = {
  food:          '<path d="M5 3v7M8 3v7M6.5 10v9M16 3c-1.5 1-2 3-2 6s.5 4 2 5v5"/>',
  transport:     '<rect x="4" y="7" width="16" height="9" rx="2"/><path d="M7 16v2M17 16v2M4 11h16"/>',
  bills:         '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  shopping:      '<path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0"/>',
  entertainment: '<circle cx="12" cy="12" r="8"/><path d="M10 9l5 3-5 3V9z"/>',
  health:        '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/>',
  savings:       '<path d="M4 9a8 5 0 0 1 16 0v4a8 5 0 0 1-16 0V9zM16 11h.01"/>',
  other:         '<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
};

const money = (n) => '$' + Number(n).toLocaleString('en-US');

// Small rounded-square icon disc — glyph in category color on a ~12% tint.
function IconDisc({ color, glyph }) {
  return (
    <div
      className="w-[46px] h-[46px] rounded-[11px] flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}1F` }}
    >
      <svg
        width="23" height="23" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
    </div>
  );
}

export default function CategoryCard({ category, onClick, onMenu }) {
  const { id, label, color, spent = 0, budget = null, count = 0 } = category;
  const glyph = category.glyph || CATEGORY_GLYPHS[id] || CATEGORY_GLYPHS.other;

  const hasBudget = budget != null;
  const pct      = hasBudget ? Math.round((spent / budget) * 100) : 0;
  const shownPct = Math.min(100, pct);
  const over     = hasBudget && spent > budget;
  const near     = hasBudget && !over && pct >= 80;
  const barColor = over ? '#EF4444' : near ? '#F59E0B' : color;
  const left     = hasBudget ? budget - spent : 0;

  // Badge
  let badge = { cls: 'bg-[#DCFCE7] text-[#15803D]', text: 'On track' };
  if (!hasBudget)   badge = { cls: 'bg-[#F4F6FA] text-[#94A3B8]', text: 'Set budget' };
  else if (over)    badge = { cls: 'bg-[#FEE2E2] text-[#DC2626]', text: 'Over budget' };
  else if (near)    badge = { cls: 'bg-[#FEF3C7] text-[#B45309]', text: 'Near limit' };

  return (
    <div
      onClick={() => onClick?.(category)}
      className="bg-white border border-[#E5E7EB] rounded-[18px] px-[22px] py-5 flex flex-col gap-4
                 cursor-pointer transition-all duration-150
                 hover:-translate-y-0.5 hover:border-[#DCE0E7]
                 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
    >
      {/* Head */}
      <div className="flex items-center gap-3.5">
        <IconDisc color={color} glyph={glyph} />
        <span className="flex-1 text-base font-bold tracking-[-0.01em] text-[#0F172A]">{label}</span>
        <span className="text-xs font-medium text-[#94A3B8]">{count} tx</span>
        <button
          onClick={(e) => { e.stopPropagation(); onMenu?.(category); }}
          className="text-[#94A3B8] text-lg leading-none border-none bg-transparent cursor-pointer px-1"
          aria-label="Category options"
        >⋯</button>
      </div>

      {/* Figures */}
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-extrabold tracking-[-0.03em] tabular-nums text-[#0F172A]">
          {money(spent)}
        </span>
        <span className="text-sm font-semibold text-[#94A3B8] tabular-nums">
          {hasBudget ? `of ${money(budget)}` : 'spent'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[#F4F6FA] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${hasBudget ? shownPct : 100}%`,
            background: hasBudget ? barColor : '#F4F6FA',
            boxShadow: hasBudget ? 'none' : 'inset 0 0 0 1px #E5E7EB',
          }}
        />
      </div>

      {/* Meta row */}
      <div className="flex justify-between items-center text-xs">
        {hasBudget ? (
          <span className="flex gap-2">
            <span className="font-bold" style={{ color: barColor }}>{pct}%</span>
            <span className="text-[#475569] font-medium">
              {over ? `${money(Math.abs(left))} over` : `${money(left)} left`}
            </span>
          </span>
        ) : (
          <span className="text-[#475569] font-medium">Set a budget to track</span>
        )}
        <span className={`text-[10px] font-bold tracking-[0.04em] uppercase px-2 py-[3px] rounded-full ${badge.cls}`}>
          {badge.text}
        </span>
      </div>
    </div>
  );
}

export { CATEGORY_GLYPHS, money };
