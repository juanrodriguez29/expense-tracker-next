import { CategoryPieChart } from './CategoryPieChart'
import { CATEGORIES } from '../lib/categories'
import { IconDisc } from './icondisc';



const STATS = [
  { label: 'Spent this month', value: '$1,842.30', delta: '+12% vs April', deltaColor: 'text-[#5B4FE9]' },
  { label: 'Remaining budget', value: '$2,157.70', delta: '54% left', deltaColor: 'text-[#1FAEEC]' },
  { label: 'Savings rate', value: '23%', delta: '+4 pts', deltaColor: 'text-[#10B981]' },
];


function StatCard({ label, value, delta, deltaColor }) {

  return (
    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
      <div className="text-[11px] font-semibold text-[#475569] tracking-[0.04em] uppercase">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-[#0F172A]">{value}</div>
      <div className={`mt-1 text-[11px] font-semibold ${deltaColor}`}>{delta}</div>
    </div>
  );
}

function TransactionsCard({ expenses, setActiveSection }) {

  const recentExpenses = expenses.slice(0, 5)

  return (
  <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB]">
    <div className="flex justify-between items-baseline">
      <h2 className="m-0 text-[13px] font-bold text-[#0F172A]">
        Recent activity
      </h2>

      <a
        onClick={() => setActiveSection("transactions")}
        className="text-xs text-[#5B4FE9] no-underline hover:underline cursor-pointer"
      >
        See all →
      </a>
    </div>

    <div className="mt-3 flex flex-col gap-1">
      {recentExpenses.map((expense) => {
        const color =
          CATEGORIES.find((cat) => cat.id === expense.category)?.color ??
          "#10B981"

        const glyph =
          CATEGORIES.find((cat) => cat.id === expense.category)?.glyph ??
          "↑"

        const initial =
          expense.type === "income"
            ? "↑"
            : expense.category?.[0]?.toUpperCase() ?? "?"

        return (
          <div
            key={expense.id}
            className="flex items-center gap-3 py-2"
          >
            <div>
              {expense.type === "income" ? (
                <div
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{
                    background: `${color}22`,
                    color,
                  }}
                >
                  {initial}
                </div>
              ) : (
                <IconDisc
                  color={color}
                  glyph={glyph}
                  size={32}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#0F172A]">
                {expense.title}
              </div>

              <div className="text-[11px] text-[#475569]">
                {expense.type === "income"
                  ? "Income"
                  : expense.category}
              </div>
            </div>

            <div
              className={`text-[13px] font-bold ${
                expense.amount > 0
                  ? "text-[#10B981]"
                  : "text-[#0F172A]"
              }`}
            >
              {expense.amount > 0 ? "+" : "−"}$
              {Math.abs(expense.amount).toFixed(2)}
            </div>
          </div>
        )
      })}
    </div>
  </div>
)}


export function Dashboard({ expenses, chartData, categoryTotals, setActiveSection, monthlyIncomeAmount }) {

  const totalSpent = `$${expenses
    .filter(exp => exp.type !== 'income')
    .reduce((acc, exp) => acc + Math.abs(Number(exp.amount)), 0)
    .toFixed(2)}`

  return (
    <div>
      <section className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label="SPENT THIS MONTH" value={totalSpent} delta={STATS[0].delta} deltaColor={STATS[0].deltaColor} />
        <StatCard label="INCOME THIS MONTH" value={monthlyIncomeAmount} delta={STATS[1].delta} deltaColor={STATS[1].deltaColor} />
        <StatCard label="SAVINGS RATE" value={STATS[2].value} delta={STATS[2].delta} deltaColor={STATS[2].deltaColor} />
      </section>

      <section className="grid grid-cols-[1fr_1.1fr] gap-4">
        <CategoryPieChart data={chartData} categoryTotals={categoryTotals} />
        <TransactionsCard expenses={expenses} setActiveSection={setActiveSection} />
      </section>
    </div>
  )
}