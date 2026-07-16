import  SmartLedgeMark  from "./SmartLedgeMark";

export function Sidebar({ user, activeSection, setActiveSection }) {

  const NAV = [
  {id: 'dashboard', label: 'Dashboard',    icon: '◐',},
  {id: 'transactions', label: 'Transactions', icon: '↕' },
  {id: 'budgets', label: 'Budgets',      icon: '◇' },
  {id: 'settings', label: 'Settings',     icon: '⚙' },
];


  return (
    <aside className="bg-white border-r border-[#E5E7EB] px-4 py-5 flex flex-col gap-1 h-screen sticky top-0">
      {/* Brand lockup */}
      <div className="inline-flex items-center gap-2.5 px-2 pt-2 pb-6">
        <SmartLedgeMark size={32} />
        <span className="font-bold text-[17px] tracking-[-0.025em] text-[#0F172A]">SmartLedge</span>
      </div>

      {/* Nav items */}
      {NAV.map((item) => (
        <a
          key={item.id}
          href="#"
          className={
            "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] no-underline cursor-pointer transition-colors " +
            (item.id === activeSection
              ? "bg-[rgba(91,79,233,0.08)] text-[#5B4FE9] font-semibold"
              : "text-[#475569] font-medium hover:bg-[#F4F6FA]")
          }
          onClick={() => setActiveSection(item.id)}
        >
          <span className="text-base opacity-90 w-[18px] inline-flex justify-center">{item.icon}</span>
          {item.label}
        </a>
      ))}

      {/* Upgrade card */}
      <div className="relative overflow-hidden mt-auto p-3.5 rounded-2xl text-white
                      bg-[linear-gradient(135deg,#6E5DEF_0%,#4577ED_55%,#1FAEEC_100%)]">
        <div className="absolute -top-2.5 -right-2.5 opacity-25 pointer-events-none">
          <SmartLedgeMark size={64} />
        </div>
        <div className="text-[11px] font-semibold opacity-85 tracking-[0.06em] uppercase">Upgrade</div>
        <h3 className="mt-1 mb-1 text-sm font-bold tracking-[-0.01em]">Go Pro</h3>
        <p className="m-0 text-[11px] opacity-85 leading-snug">Unlimited AI insights & exports</p>
      </div>
    </aside>
  );
}