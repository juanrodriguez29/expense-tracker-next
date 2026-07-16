// SettingsPage.jsx — Tailwind
// SmartLedge — Settings: two-column sections (meta + card) for Profile, Security, Preferences.

import { useState } from 'react';

/* ── small building blocks ─────────────────────────────── */

// Section = meta column (title + helper) on the left, card on the right.
function Section({ title, desc, children, first, card = true }) {
  return (
    <section
      className={`grid grid-cols-[260px_1fr] gap-10 py-[34px] border-t border-[#E5E7EB]
                  ${first ? 'border-t-0 pt-2' : ''}`}
    >
      <div>
        <h2 className="m-0 text-[15px] font-bold tracking-[-0.01em] text-[#0F172A]">{title}</h2>
        <p className="mt-[7px] mb-0 text-[12.5px] leading-[1.55] text-[#475569]">{desc}</p>
      </div>
      {card ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

function Field({ label, hint, optional, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className="text-[13px] font-semibold text-[#0F172A]">
        {label}
        {optional && <span className="text-[#94A3B8] font-medium"> (optional)</span>}
      </label>
      {children}
      {hint && <span className="text-[11px] text-[#94A3B8]">{hint}</span>}
    </div>
  );
}

const inputCls =
  "w-full px-[14px] py-3 rounded-[11px] bg-[#F4F6FA] border border-transparent " +
  "shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] text-[14.5px] text-[#0F172A] " +
  "placeholder:text-[#94A3B8] outline-none transition-[box-shadow,background] duration-100 " +
  "focus:bg-white focus:shadow-[inset_0_0_0_2px_#5B4FE9]";

function Input(props) {
  return <input {...props} className={inputCls} />;
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={
        inputCls +
        " appearance-none cursor-pointer pr-[38px] " +
        "bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222.4%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] " +
        "bg-no-repeat bg-[right_14px_center]"
      }
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="relative w-[42px] h-6 shrink-0 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-[#D7DCE5] transition-colors duration-150 peer-checked:bg-[#5B4FE9]" />
      <span className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] peer-checked:translate-x-[18px]" />
    </label>
  );
}

function ToggleRow({ title, sub, checked, onChange, first }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-[15px] border-t border-[#E5E7EB] ${first ? 'border-t-0 pt-0' : ''}`}>
      <div>
        <div className="text-[13.5px] font-semibold text-[#0F172A]">{title}</div>
        <div className="text-xs text-[#475569] mt-0.5">{sub}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const btnOutline =
  "font-bold text-[13px] rounded-[10px] px-[15px] py-[9px] cursor-pointer inline-flex items-center justify-center gap-[7px] " +
  "text-[#0F172A] bg-white shadow-[inset_0_0_0_1px_#E5E7EB] hover:bg-[#F4F6FA] transition-colors";
const btnGhost =
  "font-bold text-[13px] rounded-[10px] px-[15px] py-[9px] cursor-pointer inline-flex items-center justify-center gap-[7px] " +
  "text-[#475569] bg-transparent hover:bg-[#F4F6FA] hover:text-[#0F172A] transition-colors";

/* ── page ──────────────────────────────────────────────── */

export default function SettingsPage({
  user = { first: 'Alex', last: 'Morgan', email: 'alex.morgan@example.com', phone: '' },
  plan = 'Personal plan',
  onSave,
  onDiscard,
  onUploadPhoto,
  onRemovePhoto,
  onDeleteAccount,
}) {
  const [form, setForm] = useState({
    first: user.first,
    last: user.last,
    email: user.email,
    phone: user.phone || '',
    curpw: '',
    newpw: '',
    confpw: '',
    currency: 'USD — US Dollar ($)',
    dateFormat: 'MM / DD / YYYY',
    appearance: 'Light',
    twoFA: false,
    weekly: true,
    alerts: true,
  });
  const [dirty, setDirty] = useState(false);

  const set = (k) => (e) => {
    const v = e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const initials = ((form.first[0] || '') + (form.last[0] || '')).toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-sans text-[#0F172A] antialiased px-12 py-10 pb-32">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="m-0 text-2xl font-bold tracking-[-0.025em]">Settings</h1>
          <div className="text-[13px] text-[#475569] font-medium mt-[3px]">Manage your profile, security and preferences.</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-[14px] py-2 rounded-full bg-white border border-[#E5E7EB] text-xs text-[#475569]">{plan}</div>
          <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#FCA5A5,#F472B6)] text-white font-bold text-[13px] flex items-center justify-center">{initials}</div>
        </div>
      </div>

      <div className="max-w-[920px] mt-6">

        {/* Profile */}
        <Section first title="Profile" desc="This information appears on your account and reports.">
          <div className="flex items-center gap-[18px] mb-[22px] pb-[22px] border-b border-[#E5E7EB]">
            <div className="w-16 h-16 rounded-[18px] bg-[linear-gradient(135deg,#FCA5A5,#F472B6)] text-white font-extrabold text-2xl flex items-center justify-center shrink-0 tracking-[-0.02em]">{initials}</div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-[#0F172A]">Profile photo</span>
              <span className="text-[11.5px] text-[#94A3B8]">PNG or JPG, up to 2&nbsp;MB</span>
              <div className="flex gap-2 mt-2">
                <button className={btnOutline} onClick={onUploadPhoto}>Upload</button>
                <button className={btnGhost} onClick={onRemovePhoto}>Remove</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="First name"><Input value={form.first} onChange={set('first')} /></Field>
            <Field label="Last name"><Input value={form.last} onChange={set('last')} /></Field>
          </div>

          <div className="mt-[18px] flex flex-col gap-[18px]">
            <Field label="Email address" hint="Used for sign-in, receipts and weekly summaries.">
              <Input type="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Phone" optional>
              <Input type="tel" placeholder="+67 (465) 000-0000" value={form.phone} onChange={set('phone')} />
            </Field>
          </div>
        </Section>

        {/* Account & security */}
        <Section title="Account & security" desc="Update your password and keep your account protected.">
          <Field label="Current password">
            <Input type="password" value={form.curpw} onChange={set('curpw')} placeholder="••••••••" />
          </Field>
          <div className="grid grid-cols-2 gap-3.5 mt-[18px]">
            <Field label="New password">
              <Input type="password" value={form.newpw} onChange={set('newpw')} placeholder="••••••••" />
            </Field>
            <Field label="Confirm new password">
              <Input type="password" value={form.confpw} onChange={set('confpw')} placeholder="••••••••" />
            </Field>
          </div>
          <div className="mt-[22px] pt-[22px] border-t border-[#E5E7EB]">
            <ToggleRow
              first
              title="Two-factor authentication"
              sub="Require a code from your authenticator app at sign-in."
              checked={form.twoFA}
              onChange={set('twoFA')}
            />
          </div>
        </Section>

        {/* Preferences */}
        <Section title="Preferences" desc="Control how amounts, dates and the interface are displayed.">
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Currency">
              <Select value={form.currency} onChange={set('currency')}>
                <option>USD — US Dollar ($)</option>
                <option>EUR — Euro (€)</option>
                <option>GBP — British Pound (£)</option>
                <option>JPY — Japanese Yen (¥)</option>
              </Select>
            </Field>
            <Field label="Date format">
              <Select value={form.dateFormat} onChange={set('dateFormat')}>
                <option>MM / DD / YYYY</option>
                <option>DD / MM / YYYY</option>
                <option>YYYY-MM-DD</option>
              </Select>
            </Field>
          </div>

          <div className="mt-[18px]">
            <Field label="Appearance">
              <div className="flex gap-1.5 bg-[#F4F6FA] p-[5px] rounded-xl">
                {[['Light', '☀'], ['Dark', '☾'], ['System', '◐']].map(([opt, glyph]) => {
                  const on = form.appearance === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => set('appearance')(opt)}
                      className={`flex-1 py-[9px] rounded-lg text-[13px] font-semibold inline-flex items-center justify-center gap-[7px] transition-all duration-100 cursor-pointer
                                  ${on ? 'bg-white text-[#4A3FD0] shadow-[0_1px_3px_rgba(15,23,42,0.08)]' : 'bg-transparent text-[#475569]'}`}
                    >
                      <span>{glyph}</span>{opt}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <div className="mt-[22px] pt-1.5">
            <ToggleRow first title="Weekly summary email" sub="A digest of your spending every Monday morning." checked={form.weekly} onChange={set('weekly')} />
            <ToggleRow title="Budget alerts" sub="Notify me when I reach 80% of any budget." checked={form.alerts} onChange={set('alerts')} />
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone" desc="Permanently remove your account and all associated data." card={false}>
          <div className="bg-white border border-[#F3C9CF] rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-[13.5px] font-bold text-[#0F172A]">Delete account</div>
              <div className="text-xs text-[#475569] mt-0.5">This cannot be undone. All transactions and budgets will be erased.</div>
            </div>
            <button
              onClick={onDeleteAccount}
              className="font-bold text-[13px] rounded-[10px] px-[15px] py-[9px] cursor-pointer text-[#DC2440] bg-white shadow-[inset_0_0_0_1px_#F3C9CF] hover:bg-[#FDF2F3] transition-colors shrink-0"
            >
              Delete account
            </button>
          </div>
        </Section>
      </div>

      {/* Sticky save bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/[0.86] backdrop-blur-[10px] border-t border-[#E5E7EB] px-12 py-4 flex items-center justify-between gap-4 z-20">
        <div className="text-[12.5px] text-[#475569] font-medium flex items-center gap-2">
          <span className={`w-[7px] h-[7px] rounded-full ${dirty ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`} />
          {dirty ? 'You have unsaved changes' : 'All changes saved'}
        </div>
        <div className="flex gap-2.5">
          <button
            className={btnOutline}
            onClick={() => { setDirty(false); onDiscard && onDiscard(); }}
          >
            Discard
          </button>
          <button
            onClick={() => { setDirty(false); onSave && onSave(form); }}
            className="text-white text-sm font-bold rounded-xl px-[22px] py-3 cursor-pointer inline-flex items-center
                       bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]
                       shadow-[0_6px_16px_rgba(91,79,233,0.28)]
                       transition-all duration-100 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(91,79,233,0.36)] active:translate-y-0"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   USAGE

   import SettingsPage from './SettingsPage';

   <SettingsPage
     user={{ first: 'Alex', last: 'Morgan', email: 'alex@acme.com', phone: '' }}
     plan="Personal plan"
     onSave={(form) => api.updateSettings(form)}
     onDiscard={() => refetch()}
     onUploadPhoto={() => fileInput.current.click()}
     onRemovePhoto={() => api.removePhoto()}
     onDeleteAccount={() => openDeleteModal()}
   />

   Notes
   - Fully controlled internally via useState; `onSave` receives the whole form object.
   - `dirty` flips on any edit and drives the sticky save-bar status + dot color.
   - Uses arbitrary Tailwind values (bg-[#…]) so it works with no config, matching
     LoginPage.jsx / BudgetsPage.jsx. Swap to themed tokens (bg-surface, text-ink,
     bg-brand-gradient, shadow-card) if you merged tailwind.config.snippet.js.
   - Requires the Inter <link> in index.html (see README).
   ───────────────────────────────────────────────────────── */
