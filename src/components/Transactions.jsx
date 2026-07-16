import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import { ExpenseList } from './ExpenseList'
import { ExpenseForm } from './ExpenseForm'
import { EditExpenseModal } from './EditExpenseModal'
import { FilterBar } from './FilterBar'

export function Transactions({ expenses, addExpense, deleteExpense, handleSaveEdit, categoryTotals }) {

  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [search, setSearch] = useState('');

  const sortedExpenses = expenses.toSorted((a, b) => new Date(b.date) - new Date(a.date));
  const uniqueMonths = [...new Set(sortedExpenses.map(exp => exp.date?.slice(0, 7)))];

  const monthFilteredExpenses = selectedMonth
    ? sortedExpenses.filter(exp => exp.date.slice(0, 7) === selectedMonth)
    : sortedExpenses;

  const expensesToShow = monthFilteredExpenses
    .filter(exp => activeCategory ? exp.category === activeCategory : true)
    .filter(exp => search ? exp.title.toLowerCase().includes(search.toLowerCase()) : true)

  const handleEdit = async (updatedExpense) => {
    await handleSaveEdit(updatedExpense)  // calls index.tsx function
    setEditingExpense(null)               // closes drawer locally
  }

  const clearFilters = () => { setActiveCategory(null); setSelectedMonth(null); setSearch(''); };

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="shrink-0">
        <div className="flex justify-end mb-4">
          <button className="inline-flex items-center gap-2 px-[18px] py-3 rounded-xl border-none cursor-pointer
                   text-white text-sm font-bold tracking-[-0.005em]
                   bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]
                   shadow-[0_6px_16px_rgba(91,79,233,0.28)]
                   transition-all duration-100 ease-out
                   hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(91,79,233,0.36)]
                   active:translate-y-0"
            onClick={() => setAddExpenseOpen(true)}>
            <span className="text-[17px] leading-none font-normal">+</span>
            Add transaction
          </button>
        </div>
        <FilterBar
          uniqueMonths={uniqueMonths}
          categoryTotals={categoryTotals}
          selectedMonth={selectedMonth}
          activeCategory={activeCategory}
          setSelectedMonth={setSelectedMonth}
          setActiveCategory={setActiveCategory}
          clearFilters={clearFilters}
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <ExpenseList
          deleteExpense={deleteExpense}
          setEditingExpense={setEditingExpense}
          expensesToShow={expensesToShow}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
        />
      </div>
      {addExpenseOpen && (
        <>
          <ExpenseForm
            addExpense={addExpense}
            clearFilters={clearFilters}
            isOpen={addExpenseOpen}
            onClose={() => setAddExpenseOpen(false)}
          />
        </>
      )}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleEdit}
          onCancel={() => setEditingExpense(false)}
        />
      )}
    </div>
  );
}