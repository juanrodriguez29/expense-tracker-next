import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { Sidebar } from '../components/SideBar';
import { Dashboard } from '../components/Dashboard';
import { Transactions } from '../components/Transactions';
import { Budgets } from '../components/Budgets';
import { SettingsPage } from '../components/SettingsPage';
import { Chat } from '../components/chat';
import { CATEGORIES, CATEGORY_MAP } from '../lib/categories';

const GRAD = 'linear-gradient(135deg,#6E5DEF 0%,#4577ED 55%,#1FAEEC 100%)';

const ChatIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

function TopBar({ name, initial, date, greeting, activeSection }) {
  const titles = {
    dashboard: `${greeting} ${name}`,
    transactions: 'Your transactions',
    budgets: 'Your budgets',
    aiassistant: 'Expense assistant',
    settings: 'Settings'
  }
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <div className="text-xs text-[#475569] font-medium">{date}</div>
        <h1 className="mt-0.5 m-0 text-2xl font-bold tracking-[-0.025em] text-[#0F172A]">
          {titles[activeSection]}
        </h1>
        {activeSection === 'settings' &&
        <div className="text-[13px] text-[#475569] font-medium mt-[3px]">Manage your profile, security and preferences.</div>}
      </div>
      <div className="flex items-center gap-3">
        <div className="px-3.5 py-2 rounded-full bg-white border border-[#E5E7EB] text-xs text-[#475569]">
          This month
        </div>
        <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#FCA5A5,#F472B6)]
                        text-white font-bold text-[13px] flex items-center justify-center">
          {initial}
        </div>
      </div>
    </header>
  );
}

export default function Home() {

  const route = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [messages, setMessages] = useState([{
  role: 'assistant',
  content: 'Hi 👋 I can pull anything from your expenses — spending, income, budgets. What would you like to know?',
}]);

  useEffect(() => {
    const checkUser = async () => {
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
        console.log('fetched expenses:', data)
      } catch (err) {
        console.error('Load error:', err.message);
        setError("Could not connect to server. Is it running?");
      } finally {
        setLoading(false);
        
      }
    };
    loadExpenses();
  }, [user]);

  useEffect(() => {
    if (!user) return
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentToken = session?.access_token

        if (!currentToken) return;

        const response = await fetch('/api/profiles', {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        setProfile(data);
        console.log(data)
      } catch (err) {
        setError("Cloud not connect to server. Is it running?")
      }
    }
    loadProfile()
  }, [user])

  useEffect(() => {
    if (!user) return
    const loadBudgets = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentToken = session?.access_token

        if (!currentToken) return

        const response = await fetch('/api/budgets', {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setBudgets(data);
      } catch (err) {
        setError("Could not connect to server. Is it running?");
      }
    };
    loadBudgets();
  }, [user]);

  const name = profile?.display_name ?? '';
  console.log('name:', name)
  const initial = name[0]?.toUpperCase() ?? 'U';
  const date = new Date().toLocaleDateString('en-Au', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  const currentMonth = new Date().toISOString().slice(0, 7)

  const thisMonthIncome = expenses.filter(exp => 
    exp.date?.slice(0, 7) === currentMonth &&
    exp.type === 'income'
  )
  console.log('currentMonth:', currentMonth)
  console.log('all expenses:', expenses.map(e => ({ date: e.date, type: e.type, amount: e.amount })))
  console.log('monthly incomes:', thisMonthIncome)
  
  const monthlyIncomeAmount =  thisMonthIncome.reduce((acc, exp) => {
    return acc +  Number(exp.amount);
  }, 0)

  console.log('monthly amount:', monthlyIncomeAmount)
  
  const thisMonthExpenses = expenses.filter(exp =>
    exp.date?.slice(0, 7) === currentMonth &&
    exp.type !== 'income'
  )

  const totalsMap = thisMonthExpenses
    .reduce((acc, expense) => {
      if (!acc[expense.category]) acc[expense.category] = 0;
      acc[expense.category] += Math.abs(Number(expense.amount));
      return acc;
    }, {});

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: totalsMap[cat.id] || 0,
  })).filter((cat) => cat.total > 0);

  console.log(categoryTotals)

  const chartData = categoryTotals.map((cat) => ({
    name: cat.label,
    value: cat.total
  }));

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

  }

  const addBudget = async (budget) => {
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch('api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(budget)
    })
    console.log(response.status);
    const data = await response.json()
    setBudgets(prev => [...prev, data])
  }

  const deleteBudget = async (id) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`api/budgets/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  const handleSaveEditBudget = async (updatedBudget) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/budgets/${updatedBudget.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(updatedBudget)
    })
    setBudgets(prev =>
      prev.map(budget => budget.id === updatedBudget.id ? updatedBudget : budget)
    )
  }

 const updateProfile = async (updatedProfile) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch('/api/profiles', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(updatedProfile),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  setProfile((prev) => ({
    ...prev,
    ...updatedProfile,
  }));
};

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

    <div className="grid grid-cols-[240px_1fr] h-screen bg-[#FAFBFD] font-sans text-[#0F172A] antialiased">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection} />

      <div className="flex flex-col min-w-0 h-screen">

        <div className="shrink-0 p-6 px-8">
          <TopBar
            name={name}
            initial={initial}
            date={date}
            greeting={greeting()}
            activeSection={activeSection}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-6 px-8">
          {activeSection === 'dashboard' &&
            <Dashboard
              expenses={expenses}
              thisMonthExpenses={thisMonthExpenses}
              monthlyIncomeAmount={monthlyIncomeAmount}
              categoryTotals={categoryTotals}
              setActiveSection={setActiveSection}
              chartData={chartData}
              user={user}
            />}
          {activeSection === 'transactions' &&
            <Transactions
              expenses={expenses}
              addExpense={addExpense}
              deleteExpense={deleteExpense}
              handleSaveEdit={handleSaveEdit}
              categoryTotals={categoryTotals}
              categoryMap={CATEGORY_MAP} />}
          {activeSection === 'budgets' &&
            <Budgets
              expenses={expenses}
              budgets={budgets}
              categoryTotals={categoryTotals}
              addBudget={addBudget}
              deleteBudget={deleteBudget}
              handleSaveEditBudget={handleSaveEditBudget}
              user={user}
            />}
          {/* {activeSection === 'aiassistant' && <div>AI Assistant content here</div>} */}
          {activeSection === 'settings' && 
            <SettingsPage
              initial={initial}
              profile={profile}
              updateProfile={updateProfile}
              setActiveSection={setActiveSection}
            />
            }

        </main>
      </div>


      <div className={`fixed right-6 z-40 flex flex-col items-end gap-2  ${activeSection === 'settings' ?  'bottom-24' : 'bottom-4'}`}>

        {isOpen && (

          <Chat
            messages={messages}
            setMessages={setMessages}
            open={isOpen}
            onClose={() => setIsOpen(false)}
          />

        )}

        {/* ── FAB ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle assistant"
          className={`rounded-[16px] border-none cursor-pointer text-white relative flex items-center justify-center flex-shrink-0
                     shadow-[0_12px_28px_rgba(74,63,208,0.42),0_2px_6px_rgba(74,63,208,0.30)]
                     hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_18px_38px_rgba(74,63,208,0.5)]
                     active:translate-y-0 active:scale-[0.97]
                     transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'w-[48px] h-[48px]' : 'w-[52px] h-[52px]' }`}
          style={{ background: GRAD }}
        >
          {!isOpen && (
            <span className="absolute -top-[3px] -right-[3px] w-4 h-4 rounded-full bg-[#FF6B6B] border-[2.5px] border-white animate-[slPing_2.4s_ease-out_infinite]" />
          )}
          <ChatIcon className={`w-[20px] h-[20px] absolute transition-all duration-[220ms] ${isOpen ? 'opacity-0 rotate-[30deg] scale-75' : 'opacity-100'}`} />
          <CloseIcon className={`w-[20px] h-[20px] absolute transition-all duration-[220ms] ${isOpen ? 'opacity-100' : 'opacity-0 -rotate-[30deg] scale-75'}`} />
        </button>
      </div>

    </div>
  )
};





















