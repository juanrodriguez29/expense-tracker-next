import { useState } from 'react';
import { supabase } from '../lib/supabase'

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

const btnOutline =
  "font-bold text-[13px] rounded-[10px] px-[15px] py-[9px] cursor-pointer inline-flex items-center justify-center gap-[7px] " +
  "text-[#0F172A] bg-white shadow-[inset_0_0_0_1px_#E5E7EB] hover:bg-[#F4F6FA] transition-colors";
const btnGhost =
  "font-bold text-[13px] rounded-[10px] px-[15px] py-[9px] cursor-pointer inline-flex items-center justify-center gap-[7px] " +
  "text-[#475569] bg-transparent hover:bg-[#F4F6FA] hover:text-[#0F172A] transition-colors";


export function SettingsPage({ initial, profile, updateProfile, setActiveSection }) {

  const [formData, setFormData] = useState({
    firstName: profile?.display_name ?? '',
    lastName: profile?.last_name ?? '',
    phoneNumber: profile?.phone_number ?? '',
  })
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setDirty(true);
  }

  const updatePassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!currentPassword) newErrors.currentPassword = 'Please enter your current password';
    if (!newPassword) newErrors.newPassword = "New password can't be empty"
    if (newPassword !== confirmPassword) newErrors.passwordConfirmation = "Passwords don't match";
    console.log(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true)

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword,
      });

      if (verifyError) {
        setErrors({ currentPassword: "Current password is incorrect" })
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        setErrors({ newPassword: updateError.message })
        return;
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({})

    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false)
      setSuccess(true)
    }
  };

  const onCancel = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setErrors({})
  }

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateProfile({
        display_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
      });

      setDirty(false);
      setActiveSection('dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-sans text-[#0F172A] antialiased px-12 py-10 pb-32">

      <div className="max-w-[920px]">

        {/* Profile */}
        <Section first title="Profile" desc="This information appears on your account and reports.">
          <div className="flex items-center gap-[18px] mb-[22px] pb-[22px] border-b border-[#E5E7EB]">
            <div className="w-16 h-16 rounded-[18px] bg-[linear-gradient(135deg,#FCA5A5,#F472B6)] text-white font-extrabold text-2xl flex items-center justify-center shrink-0 tracking-[-0.02em]">{initial}</div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-[#0F172A]">Profile photo</span>
              <span className="text-[11.5px] text-[#94A3B8]">PNG or JPG, up to 2&nbsp;MB</span>
              <div className="flex gap-2 mt-2">
                <button className={btnOutline} /* onClick={onUploadPhoto} */>Upload</button>
                <button className={btnGhost} /* onClick={onRemovePhoto} */>Remove</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="First name"><Input name="firstName" value={formData.firstName} onChange={handleChange} required /></Field>
            <Field label="Last name"><Input name="lastName" value={formData.lastName} onChange={handleChange} required /></Field>
          </div>

          <div className="mt-[18px] flex flex-col gap-[18px]">
            <Field label="Email address" hint="Used for sign-in, receipts and weekly summaries.">
              <Input type="email" value={profile?.email ?? ''} disabled />
            </Field>
            <Field label="Phone" optional>
              <Input name="phoneNumber" type="tel" placeholder="+67 (465) 000-0000" value={formData.phoneNumber} onChange={handleChange} />
            </Field>
          </div>

        </Section>


        {/* Account & security */}
        <Section title="Account & security" desc="Update your password and keep your account protected.">

          <form id="password-form" onSubmit={updatePassword}>

            <Field label="Current password">
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              {errors.currentPassword && (
                <p className="text-xs text-red-500">{errors.currentPassword}</p>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-3.5 mt-[18px]">
              <Field label="New password">
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                {errors.newPassword && (
                  <p className="text-xs text-red-500">{errors.newPassword}</p>
                )}
              </Field>
              <Field label="Confirm new password">
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                {errors.passwordConfirmation && (
                  <p className="text-xs text-red-500">{errors.passwordConfirmation}</p>
                )}
              </Field>
            </div>
            {success && (
              <p className="text-sm text-green-700 py-2 mb-4">
                Password updated!
              </p>
            )}
          </form>
          <div className="grid grid-cols-2 gap-2.5 mt-[25px]">
            <button className={btnOutline} onClick={onCancel}>
              Cancel
            </button>
            <button
              form="password-form"
              className="px-[22px] py-3 rounded-xl border-none cursor-pointer text-sm font-bold text-white
                        bg-[#5B4FE9] hover:bg-[#4A3FD0] transition-colors
                        disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </Section>

        {/* Sticky save bar */}
        <div className="fixed left-[240px] right-0 bottom-0 bg-white/[0.86] backdrop-blur-[10px] border-t border-[#E5E7EB] px-12 py-4 flex items-center justify-between gap-4 z-20">
          <div className="text-[12.5px] text-[#475569] font-medium flex items-center gap-2">
            <span className={`w-[7px] h-[7px] rounded-full ${dirty ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`} />
            {dirty ? 'You have unsaved changes' : 'All changes saved'}
          </div>
          <div className="flex gap-2.5">
            <button
              className={btnOutline}
              /* onClick={onDiscard} */
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="text-white text-sm font-bold rounded-xl px-[22px] py-3 cursor-pointer inline-flex items-center
                       bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]
                       shadow-[0_6px_16px_rgba(91,79,233,0.28)]
                       transition-all duration-100 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(91,79,233,0.36)] active:translate-y-0
                       disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save changes'}

            </button>
          </div>
        </div>


      </div>

    </div>
  );
}