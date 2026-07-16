import { ExpenseItem } from "./ExpenseItem";


export function ExpenseList({ expenses, deleteExpense, setEditingExpense, setActiveCategory, expensesToShow, activeCategory }) {
  return (
    <ul className="expense-list">
      
      {expensesToShow.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          deleteExpense={deleteExpense}
          setEditingExpense={setEditingExpense}
          setActiveCategory={setActiveCategory}
        />))}
    </ul>
  );
}
