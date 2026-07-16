import { useState } from 'react';
import { CATEGORIES } from '../lib/categories';
import { BudgetCard } from './BudgetCard';
import { SetBudgetDrawer } from './SetBudgetDrawer';



export function Budgets({ expenses, budgets, categoryTotals, addBudget, deleteBudget, handleSaveEditBudget }) {

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  console.log(editingBudget)
  const getLastMonths = (count) => {
    const months = []
    for (let i = 1; i <= count; i++) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      months.push(d.toISOString().slice(0, 7))
    }
    return months;
  }

  const lastThreeMonths = getLastMonths(3)
  const lastThreeMonthsExpenses = expenses.filter(exp => lastThreeMonths.includes(exp.date?.slice(0, 7)))


  const avgMap = lastThreeMonthsExpenses
    .reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, months: new Set() }
      }
      acc[expense.category].total += Math.abs(Number(expense.amount))
      acc[expense.category].months.add(expense.date?.slice(0, 7))
      return acc
    }, {});


  return (
    <>
      <div className="grid grid-cols-3 gap-4 ">
        {CATEGORIES.map(cat => {
          const budget = budgets.find(b => b.category === cat.id)
          const spent = categoryTotals.find(c => c.id === cat.id)?.total ?? 0
          console.log(budget)
          console.log(spent)
          return (
            <BudgetCard
              key={cat.id}
              category={cat}
              budget={budget}
              spent={spent}
              onDelete={() => deleteBudget(budget?.id)}
              onEdit={(budget) => {
                if (budget) {
                  setEditingBudget(budget)
                } else {
                  setEditingBudget({ category: cat.id })
                }
                setDrawerOpen(true)
              }}
            />
          )
        })}
        {drawerOpen &&
          <SetBudgetDrawer
            budget={editingBudget}
            category={CATEGORIES.find(c => c.id === editingBudget?.category)}
            spent={categoryTotals.find(c => c.id === editingBudget?.category)?.total ?? 0}
            avgSpend={avgMap[editingBudget?.category] ?
              Math.round(avgMap[editingBudget.category].total / avgMap[editingBudget.category].months.size)
              : 0
            }
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            addBudget={addBudget}
            handleSaveEditBudget={handleSaveEditBudget}
            onDelete={() => deleteBudget(editingBudget.id)}
          />
        }
      </div>
    </>
  )
}