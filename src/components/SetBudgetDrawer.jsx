import { useEffect, useMemo, useState } from 'react';
import { XIcon } from './xicon';
import { BudgetCard } from './BudgetCard'
import { money } from '../lib/utils';

function roundUp50(n) {
  return Math.max(50, Math.ceil(n / 50) * 50);
}

export function SetBudgetDrawer({ open, onClose, budget, category, spent, avgSpend, addBudget, onDelete, handleSaveEditBudget }) {

  const suggested = roundUp50(Math.max(avgSpend, spent));
  const [amount, setAmount] = useState('');
  const [alertOn, setAlertOn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount(String(budget?.amount ?? suggested));
      setAlertOn(true);
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, budget]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);


  const budgetNum = parseFloat(amount || '0') || 0;
  const valid = budgetNum > 0;
  const editing = budget?.id != null

  const presets = useMemo(() => ([
    { v: spent, label: 'Match spend', tag: null },
    { v: avgSpend, label: money(avgSpend), tag: 'avg' },
    { v: suggested, label: money(suggested), tag: 'suggested' },
    { v: roundUp50(suggested + 50), label: money(roundUp50(suggested + 50)), tag: null },
  ]).filter((p, i, arr) => p.v > 0 && arr.findIndex((q) => q.v === p.v) === i),
    [spent, avgSpend, suggested]);

  const previewBudget = { ...budget, amount: budgetNum > 0 ? budgetNum : null };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (editing) {
      handleSaveEditBudget({
        ...budget, amount: budgetNum
      })
    } else {
      addBudget({
        category: category.id,
        amount: budgetNum,
      });
    }
    setSubmitting(false);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Set budget for ${category.label}`}
        className="absolute top-0 right-0 h-full w-full max-w-[460px] bg-white flex flex-col
                   shadow-[-24px_0_60px_rgba(15,23,42,0.18)]
                   animate-[slideIn_360ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-[22px] border-b border-[#E5E7EB]">
          <div>
            <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#5B4FE9] mb-1">
              {editing ? 'Edit monthly budget' : 'Set monthly budget'}
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="w-[13px] h-[13px] rounded-full"
                style={{ background: category.color, boxShadow: `0 0 0 4px ${category.color}2E` }}
              />
              <h2 className="m-0 text-[19px] font-extrabold tracking-[-0.02] text-[#0F172A]">
                {category.label}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label='Close'
            className=" w-9 h-9 rounded-[10px] border-none cursor-pointer bg-[#F4F6FA] text-[#475569]
                       text-lg flex items-center justify-center hover:bg-[#E9EDF3] hover:text-[#0F172A]
                       transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <form id="set-budget-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-[22px]" >

          {/* Spend context */}
          <div className="flex gap-2.5">
            <div className="flex-1 bg-[#F4F6FA] rounded-xl px-3.5 py-3">
              <div className="text-[10.5px] font-bold tracking-[0.05em] uppercase text-[#94A3B8]">Spend this month</div>
              <div className="text-lg font-extrabold tracking-[-0.02em] mt-1 tabular-nums">{money(spent)}</div>
            </div>
            <div className="flex-1 bg-[#F4F6FA] rounded-xl px-3.5 py-3">
              <div className="text-[10.5px] font-bold tracking-[0.05em] uppercase text-[#94A3B8]">Avg last 3 mo </div>
              <div className="text-lg font-extrabold tracking-[-0.02em] mt-1 tabular-nums">
                {money(avgSpend)}<span className="text-[11px] font-semibold text-[#94A3B8]">/mo</span>
              </div>
            </div>
          </div>

          {/* Amount — the hero */}
          <div className="flex flex-col gap-2.5">
            <label htmlFor="budget-amount" className="text-[13px] font-semibold text-[#0F172A]">Monthly budget</label>
            <div className="relative">
              <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-2xl font-extrabold text-[#94A3B8] pointer-events-none">$</span>
              <input
                id="budget-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full pl-10 pr-16 py-4 rounded-[13px] bg-[#F4F6FA] border border-transparent
                           text-[28px] font-extrabold tracking-[-0.02em] tabular-nums text-[#0F172A]
                           placeholder:text-[#94A3B8] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]
                           focus:outline-none focus:bg-white focus:shadow-[inset_0_0_0_2px_#5B4FE9] transition-all"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#94A3B8] pointer-events-none">
                month
              </span>
            </div>
          </div>

          {/* Quick-set presets */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-semibold text-[#0F172A]">Quick set</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const active = budgetNum === p.v;
                return (
                  <button
                    type="button"
                    key={p.v + (p.tag || '')}
                    onClick={() => setAmount(String(p.v))}
                    className={
                      "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold cursor-pointer border transition-all tabular-nums " +
                      (active
                        ? "bg-[#EDEBFD] border-[#5B4FE9] text-[#4A3FD0]"
                        : "bg-white border-[#E5E7EB] text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F4F6FA]")
                    }
                  >
                    {p.label}
                    {p.tag && (
                      <span className={"text-[9.5px] font-bold tracking-[0.04em] uppercase " + (active ? "text-[#4A3FD0]" : "text-[#5B4FE9]")}>
                        {p.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert toggle */}
          <div className="flex items-center justify-between bg-[#F4F6FA] rounded-xl px-4 py-3.5">
            <div>
              <div className="text-[13px] font-semibold text-[#0F172A]">Alert me at 80%</div>
              <div className="text-[11px] text-[#94A3B8] mt-0.5">Get a nudge before you go over</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={alertOn}
              onClick={() => setAlertOn((v) => !v)}
              className={
                "relative w-11 h-[26px] rounded-full cursor-pointer border-none transition-colors duration-150 flex-shrink-0 " +
                (alertOn ? "bg-[#5B4FE9]" : "bg-[#CBD5E1]")
              }
            >
              <span
                className={
                  "absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.25)] transition-transform duration-150 " +
                  (alertOn ? "translate-x-[18px]" : "translate-x-0")
                }
              />
            </button>
          </div>

          {/* Live preview — the real CategoryCard with the prospective budget */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.06em] uppercase text-[#94A3B8]">
              Live preview <span className="flex-1 h-px bg-[#E5E7EB]" />
            </div>
            <div className="pointer-events-none">
              <BudgetCard
                budget={previewBudget}
                category={category}
                spent={spent}
                onEdit={() => { }}
                onDelete={() => { }} />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-7 py-[18px] border-t border-[#E5E7EB] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-3 rounded-xl border-none cursor-pointer text-sm font-bold text-[#0F172A]
                         bg-white shadow-[inset_0_0_0_1px_#E5E7EB] hover:bg-[#F4F6FA] transition-colors"
          >
            Cancel
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => { onDelete(budget.id); onClose?.(); }}
              className="px-[18px] py-3 rounded-xl border-none cursor-pointer text-sm font-bold text-[#DC2626]
               bg-white shadow-[inset_0_0_0_1px_#FCA5A5] hover:bg-[#FEF2F2] transition-colors"
            >
              Delete
            </button>
          )}


          <button
            type="submit"
            form="set-budget-form"
            disabled={!valid || submitting}
            className="flex-1 px-[18px] py-3 rounded-xl border-none cursor-pointer text-sm font-bold text-white
                       bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]
                       shadow-[0_6px_16px_rgba(91,79,233,0.28)]
                       transition-all duration-100 ease-out
                       hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(91,79,233,0.36)]
                       active:translate-y-0
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
          >
            {submitting ? 'Saving…' : valid ? `Set budget · ${money(budgetNum)}` : 'Set budget'}
          </button>
        </div>

      </aside>
    </div>
  )
}