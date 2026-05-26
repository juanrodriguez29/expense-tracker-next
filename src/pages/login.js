import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from 'next/router';
import Link from 'next/link';
import SmartLedgeMark from "../components/SmartLedgeMark";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Login failed. Please check your credentials and try again.');
    } else {
      router.push('/');
    }
  };

  /*const inputClass = "w-full px-3 py-2 text-base rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";*/
  const inputClass =
    "px-3.5 py-3 rounded-[10px] bg-surface-2 border-none text-sm text-ink " +
    "placeholder:text-ink-softer " +
    "shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] " +
    "focus:outline-none focus:shadow-[inset_0_0_0_2px_theme(colors.indigo.DEFAULT)] " +
    "transition-shadow";

  return (
    /*<section className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-8">
      <h2 className="text-3xl font-semibold text-slate-800 mb-6 border-b-2 border-indigo-500 pb-2">
        Expense Tracker
      </h2>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <h3 className="text-2xl font-semibold text-slate-800 mb-2">Login</h3>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link className="text-indigo-600 hover:text-indigo-700" href="/signup">Sign up</Link>
        </p>
      </form>
    </section>*/
    <main className="relative min-h-screen grid place-items-center overflow-hidden p-6 bg-bg font-sans text-ink antialiased">

      {/* Decorative gradient blobs */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[540px] h-[540px] rounded-full blur-2xl z-0"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(91,79,233,0.32), rgba(31,174,236,0.15) 40%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-20 w-[360px] h-[360px] rounded-full blur-2xl z-0"
        style={{ background: 'radial-gradient(circle, rgba(31,174,236,0.22), transparent 70%)' }}
      />

      <section className="relative z-10 w-full max-w-[440px] bg-surface rounded-3xl px-10 py-11 flex flex-col gap-6 shadow-card">

        <div className="flex flex-col items-center gap-4 -mb-1">
          <SmartLedgeMark size={72} />
          <div className="font-bold text-[22px] tracking-[-0.025em] text-ink">SmartLedge</div>
        </div>

        <header className="text-center">
          <h1 className="m-0 text-[22px] font-bold tracking-[-0.025em] text-ink">Welcome back</h1>
          <p className="mt-1 mb-0 text-[13px] text-ink-soft">Sign in to track your spending</p>
        
        </header>

        <form onSubmit={handleLogin} noValidate className="flex flex-col">

            {error && (
          <p className="text-sm text-red-600 py-2 mb-4">
            {error}
          </p>
        )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sl-email" className="text-xs font-semibold text-ink">Email</label>
            <input
              id="sl-email" type="email" autoComplete="email"
              placeholder="you@smartledge.app"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputClass}
            />
          </div>
          {/*<div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>*/}


          <div className="flex flex-col gap-1.5 mt-4">
            <div className="flex items-baseline justify-between">
              <label htmlFor="sl-password" className="text-xs font-semibold text-ink">Password</label>
              <a
                onClick={(e) => { e.preventDefault(); onForgot?.(); }}
                className="text-xs font-semibold text-indigo cursor-pointer hover:underline"
              >Forgot?</a>
            </div>
            <div className="relative">
            <input
              id="sl-password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              className={`${inputClass} pr-10 w-full`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="mt-6 w-full px-4 py-3.5 rounded-xl border-none cursor-pointer
                           text-white text-sm font-bold tracking-[-0.005em]
                           bg-brand-gradient shadow-btn
                           transition-all duration-100 ease-out
                           hover:-translate-y-px hover:shadow-btn-hover
                           active:translate-y-0
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="text-center text-xs text-ink-soft">
          New here?{' '}
          <Link className="text-indigo font-semibold cursor-pointer hover:underline" href="/signup">Create an account</Link>
        </div>
      </section>
    </main>
  );

}
