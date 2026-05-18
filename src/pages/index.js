import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { Balance } from '../components/Balance';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { EditExpenseModal } from '../components/EditExpenseModal';
import { CategoryTotals } from '../components/CategoryTotals';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { FilterBar } from '../components/FilterBar';
import { Chat } from '../components/Chat';


const CATEGORIES = [
  { id: "food", label: "Food" },
  { id: "transport", label: "Transport" },
  { id: "bills", label: "Bills" },
  { id: "shopping", label: "Shopping" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health", label: "Health" },
  { id: "savings", label: "Savings" },
  { id: "other", label: "Other" },
];


const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map(cat => [cat.id, cat.label])
);

export default function Home() {

  const route = useRouter();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const checkUser = async () => {
      console.log('checkUser running')
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('session:', session)
        console.log('session error:', error)
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
        } else {
          route.push('/login');
        }
        setToken(session?.access_token);
      } catch (err) {
        console.log('checkUser error:', err.message)
        setLoading(false);
      }
    }
    checkUser();
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut();
    route.push('/login');
  };

  useEffect(() => {
    if (!user) return
    const loadExpenses = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentToken = session?.access_token

        if (!currentToken) return // no token, don't fetch

        const response = await fetch('/api/expenses', {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });

        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        setError("Could not connect to server. Is it running?");
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, [user]);

  const totalsMap = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) acc[expense.category] = 0;
    acc[expense.category] += Number(expense.amount);
    return acc;
  }, {});

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: totalsMap[cat.id] || 0,
  })).filter((cat) => cat.total > 0);

  const chartData = categoryTotals.map((cat) => ({
    name: cat.label,
    value: cat.total
  }));

  const sortedExpenses = expenses.toSorted((a, b) => new Date(b.date) - new Date(a.date));
  const uniqueMonths = [...new Set(sortedExpenses.map(exp => exp.date?.slice(0, 7)))];

  const monthFilteredExpenses = selectedMonth
    ? sortedExpenses.filter(exp => exp.date.slice(0, 7) === selectedMonth)
    : sortedExpenses;

  const expensesToShow = activeCategory
    ? monthFilteredExpenses.filter(exp => exp.category === activeCategory)
    : monthFilteredExpenses;

  const addExpense = async (expense) => {
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(expense)
    })
    const data = await response.json()
    setExpenses(prev => [...prev, data])
  }

  const deleteExpense = async (id) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    setExpenses(prev => prev.filter(exp => exp.id !== id))
  }

  const handleSaveEdit = async (updatedExpense) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/expenses/${updatedExpense.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(updatedExpense)
    })
    setExpenses(prev =>
      prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
    )
    setEditingExpense(null)
  }

  const clearFilters = () => { setActiveCategory(null); setSelectedMonth(null); };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center border-b-2 border-indigo-500 pb-3 mb-6">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse" />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[42px] bg-slate-100 rounded-lg animate-pulse" />
                ))}
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="h-[320px] bg-slate-100 rounded-xl animate-pulse" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 h-9 bg-slate-100 rounded-lg animate-pulse" />
              <div className="flex-1 h-9 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative flex items-center justify-center border-b-2 border-indigo-500 pb-3 mb-6">
          <h1 className="text-3xl font-semibold text-slate-800">
            Expense Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="absolute right-0 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
            Log out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:items-start">
          <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <Balance expenses={expenses} />
            <ExpenseForm
              onAddExpense={addExpense}
              categories={CATEGORIES}
              onClearFilter={() => setActiveCategory(null)}
            />
          </div>

          <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <CategoryPieChart data={chartData} />
            <CategoryTotals categoryTotals={categoryTotals} />
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <FilterBar
            months={uniqueMonths}
            categories={categoryTotals}
            selectedMonth={selectedMonth}
            selectedCategory={activeCategory}
            onChangeMonth={setSelectedMonth}
            onChangeCategory={setActiveCategory}
            onClearFilters={clearFilters}
          />
          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
            onEdit={setEditingExpense}
            categoryMap={CATEGORY_MAP}
            expensesToShow={expensesToShow}
            onCategoryClick={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>
      </div>
      <div className="fixed bottom-4 right-6 md:right-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close expense assistant" : "Open expense assistant"}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="animate-chat-in fixed inset-0 md:inset-auto md:bottom-20 md:right-4 bg-white md:rounded-2xl shadow-lg border border-slate-100 p-6 md:w-80 md:h-96">
          <Chat
            messages={messages}
            setMessages={setMessages}
            setIsOpen={setIsOpen}
          />
        </div>
      )}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleSaveEdit}
          onCancel={() => setEditingExpense(null)}
          categories={CATEGORIES}
        />
      )}
    </div>
  )
};