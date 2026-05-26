// LoginPage.jsx — Tailwind, themed version
// Same component but uses the named colors from tailwind.config.snippet.js
// instead of arbitrary hex values. Cleaner once you've merged the config.

import { useState } from 'react';
import SmartLedgeMark from './SmartLedgeMark';

export default function LoginPage({ onSubmit, onForgot, onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!onSubmit) return;
    try {
      setLoading(true);
      await onSubmit({ email, password });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "px-3.5 py-3 rounded-[10px] bg-surface-2 border-none text-sm text-ink " +
    "placeholder:text-ink-softer " +
    "shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] " +
    "focus:outline-none focus:shadow-[inset_0_0_0_2px_theme(colors.indigo.DEFAULT)] " +
    "transition-shadow";

  return (
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

        <form onSubmit={handleSubmit} noValidate className="flex flex-col">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sl-email" className="text-xs font-semibold text-ink">Email</label>
            <input
              id="sl-email" type="email" autoComplete="email"
              placeholder="you@smartledge.app"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-4">
            <div className="flex items-baseline justify-between">
              <label htmlFor="sl-password" className="text-xs font-semibold text-ink">Password</label>
              <a
                onClick={(e) => { e.preventDefault(); onForgot?.(); }}
                className="text-xs font-semibold text-indigo cursor-pointer hover:underline"
              >Forgot?</a>
            </div>
            <input
              id="sl-password" type="password" autoComplete="current-password"
              placeholder="••••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              className={inputClass}
            />
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
          <a
            onClick={(e) => { e.preventDefault(); onSignUp?.(); }}
            className="text-indigo font-semibold cursor-pointer hover:underline"
          >Create an account</a>
        </div>
      </section>
    </main>
  );
}
