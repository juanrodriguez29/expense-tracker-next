

/* ── a single message row ──
   message: { role:'user'|'assistant', text?:string, node?:ReactNode, time?:string } */
function MessageRow({ message }) {
  const me = message.role === 'user';
  return (
    <div className={`flex gap-2.5 items-end max-w-full motion-safe:animate-[slRise_320ms_cubic-bezier(0.22,1,0.36,1)] ${me ? 'flex-row-reverse' : ''}`}>
      {!me && <BotAvatar />}
      <div className={me ? 'flex flex-col items-end' : 'min-w-0'}>
        {message.node ? (
          message.node
        ) : (
          <div
            className={
              me
                ? 'max-w-full px-3.5 py-[11px] text-[13.5px] leading-[1.5] rounded-2xl rounded-br-[6px] text-white [overflow-wrap:anywhere] shadow-[0_4px_12px_rgba(74,63,208,0.28)]'
                : 'max-w-full px-3.5 py-[11px] text-[13.5px] leading-[1.5] rounded-2xl rounded-bl-[6px] text-[#0F172A] bg-white border border-[#E8EBF1] shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
            }
            style={me ? { background: GRAD } : undefined}
          >
            {message.text}
          </div>
        )}
        {message.time && (
          <div className={`text-[10px] text-[#94A3B8] mt-[3px] mx-0.5 font-medium ${me ? 'text-right' : ''}`}>{message.time}</div>
        )}
      </div>
    </div>
  );
}

/* ── typing dots ── */
const TypingRow = () => (
  <div className="flex gap-2.5 items-end">
    <BotAvatar />
    <div className="flex gap-1 px-[15px] py-[13px] bg-white border border-[#E8EBF1] rounded-2xl rounded-bl-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-[7px] h-[7px] rounded-full bg-[#94A3B8] animate-[slBlink_1.3s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  </div>
);

const DEFAULT_GREETING = {
  role: 'assistant',
  text: 'Hi 👋 I can pull anything from your expenses — spending, income, budgets. What would you like to know?',
};
const DEFAULT_SUGGESTIONS = [
  { label: 'Food this month', q: 'How much did I spend on Food this month?' },
  { label: 'Over budget?', q: 'Am I over any budgets?' },
  { label: 'Income last week', q: 'Show my income last week' },
];

export default function ExpenseAssistantWidget({
  greeting = DEFAULT_GREETING,
  suggestions = DEFAULT_SUGGESTIONS,
  defaultOpen = false,
  showUnread = true,
  onSend,                     // async (text) => message | { text } | { node }  — appended as assistant reply
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState([greeting]);
  const [showSuggest, setShowSuggest] = useState(true);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');

  const msgsRef = useRef(null);
  const inputRef = useRef(null);
  const taRef = useRef(null);

  // keep scrolled to newest
  useEffect(() => {
    const el = msgsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  // focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 260);
  }, [open]);

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 96) + 'px';
  }

  async function send(text) {
    const t = (text ?? draft).trim();
    if (!t || typing) return;
    setShowSuggest(false);
    setMessages((m) => [...m, { role: 'user', text: t }]);
    setDraft('');
    if (taRef.current) taRef.current.style.height = 'auto';

    setTyping(true);
    try {
      const reply = await onSend?.(t);
      const msg = reply
        ? { role: 'assistant', time: 'Just now', ...reply }
        : { role: 'assistant', time: 'Just now', text: "Here's what I found in your data." };
      setMessages((m) => [...m, msg]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {/* scoped keyframes */}
      <style>{`
        @keyframes slRise  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slBlink { 0%,60%,100% { opacity:.3; transform:translateY(0) } 30% { opacity:1; transform:translateY(-3px) } }
        @keyframes slPing  { 0%{box-shadow:0 0 0 0 rgba(255,107,107,.5)} 70%{box-shadow:0 0 0 9px rgba(255,107,107,0)} 100%{box-shadow:0 0 0 0 rgba(255,107,107,0)} }
      `}</style>

      <div className="fixed right-7 bottom-7 z-40 flex flex-col items-end gap-4">

        {/* ── PANEL ── */}
        <section
          role="dialog"
          aria-label="Expense Assistant"
          className={
            'w-[388px] h-[min(600px,calc(100vh-132px))] bg-white rounded-[24px] overflow-hidden flex flex-col origin-bottom-right ' +
            'shadow-[0_32px_70px_-12px_rgba(15,23,42,0.30),0_12px_28px_-12px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.04)] ' +
            'transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] ' +
            (open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-[0.94] pointer-events-none')
          }
        >
          {/* header */}
          <header className="flex items-center gap-3 px-[18px] py-4 text-white relative" style={{ background: GRAD }}>
            <span className="absolute left-0 right-0 bottom-0 h-px bg-white/[0.16]" />
            <div className="w-10 h-10 rounded-[13px] bg-white/[0.18] backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]">
              <SparkleIcon className="w-[22px] h-[22px] text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="m-0 text-[15.5px] font-bold tracking-[-0.01em]">Expense Assistant</h3>
              <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-white/80 mt-0.5">
                <span className="w-[7px] h-[7px] rounded-full bg-[#5BE9A6] shadow-[0_0_0_3px_rgba(91,233,166,0.3)]" />
                Online · synced to your data
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close"
              className="w-[34px] h-[34px] rounded-[11px] border-none cursor-pointer bg-white/[0.14] text-white flex items-center justify-center hover:bg-white/[0.26] transition-colors flex-shrink-0">
              <CloseIcon className="w-[17px] h-[17px]" />
            </button>
          </header>

          {/* messages */}
          <div ref={msgsRef} className="flex-1 overflow-y-auto px-[18px] pt-5 pb-2 flex flex-col gap-3.5 bg-gradient-to-b from-[#FCFCFE] to-[#F7F8FB]">
            {messages.map((m, i) => <MessageRow key={i} message={m} />)}

            {showSuggest && suggestions?.length > 0 && (
              <div className="flex flex-wrap gap-[7px] pl-[37px] pt-0.5 pb-1.5">
                {suggestions.map((s) => (
                  <button key={s.q} onClick={() => send(s.q)}
                    className="px-[13px] py-2 rounded-[13px] text-[12.5px] font-semibold leading-none cursor-pointer bg-white border border-[#E8EBF1] text-[#4A3FD0] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-[#EEF0FE] hover:border-[#C9CCF7] hover:-translate-y-px transition-all">
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {typing && <TypingRow />}
          </div>

          {/* composer */}
          <div className="px-4 pt-[13px] pb-4 bg-white border-t border-[#E8EBF1]">
            <div className="flex items-end gap-2.5 bg-[#F4F6FA] rounded-2xl pl-4 pr-1.5 py-1.5 transition-all focus-within:bg-white focus-within:shadow-[inset_0_0_0_1.5px_#5B4FE9]">
              <textarea
                ref={(el) => { taRef.current = el; inputRef.current = el; }}
                rows={1}
                value={draft}
                onChange={(e) => { setDraft(e.target.value); autosize(); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask about your expenses…"
                className="flex-1 border-none outline-none resize-none bg-transparent text-[13.5px] leading-[1.45] text-[#0F172A] py-2 max-h-24 placeholder:text-[#94A3B8]"
              />
              <button onClick={() => send()} aria-label="Send"
                className="w-10 h-10 rounded-[13px] border-none cursor-pointer text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(74,63,208,0.32)] hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(74,63,208,0.42)] transition-all"
                style={{ background: GRAD }}>
                <SendIcon className="w-[18px] h-[18px]" />
              </button>
            </div>
            <div className="text-center text-[10.5px] text-[#94A3B8] mt-[9px] font-medium">
              <b className="text-[#475569] font-semibold">SmartLedge AI</b> · answers from your live data
            </div>
          </div>
        </section>

        {/* ── FAB ── */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle assistant"
          className="w-[60px] h-[60px] rounded-[20px] border-none cursor-pointer text-white relative flex items-center justify-center flex-shrink-0
                     shadow-[0_12px_28px_rgba(74,63,208,0.42),0_2px_6px_rgba(74,63,208,0.30)]
                     hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_18px_38px_rgba(74,63,208,0.5)]
                     active:translate-y-0 active:scale-[0.97]
                     transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ background: GRAD }}
        >
          {showUnread && !open && (
            <span className="absolute -top-[3px] -right-[3px] w-4 h-4 rounded-full bg-[#FF6B6B] border-[2.5px] border-white animate-[slPing_2.4s_ease-out_infinite]" />
          )}
          <ChatIcon className={`w-[26px] h-[26px] absolute transition-all duration-[220ms] ${open ? 'opacity-0 rotate-[30deg] scale-75' : 'opacity-100'}`} />
          <CloseIcon className={`w-[26px] h-[26px] absolute transition-all duration-[220ms] ${open ? 'opacity-100' : 'opacity-0 -rotate-[30deg] scale-75'}`} />
        </button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   USAGE

   <ExpenseAssistantWidget
     onSend={async (text) => {
       const res = await api.askAssistant(text);   // your backend / LLM call
       // return plain text…
       return { text: res.answer };
       // …or rich JSX (e.g. the income table):
       // return { node: <IncomeCard rows={res.rows} total={res.total} /> };
     }}
   />

   • Mount once at the app root so it floats over every page.
   • `onSend` may return { text } OR { node: <ReactNode/> } for rich replies
     (insight cards, tables). A typing indicator shows while it's pending.
   • Controlled open state: lift `open`/`setOpen` out if you want to trigger it
     from elsewhere (e.g. the sidebar "AI Assistant" item).

   Rich-reply card recipe (matches the mockup's income table) — drop in your file:

   function IncomeCard({ rows, total }) {
     return (
       <div className="max-w-[86%] rounded-2xl rounded-bl-[6px] overflow-hidden bg-white border border-[#E8EBF1] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
         <div className="px-3.5 pt-3 pb-2.5">
           <div className="text-[10.5px] font-bold tracking-[0.05em] uppercase text-[#94A3B8]">Income · last week</div>
           <div className="text-[13.5px] leading-snug mt-1.5">You had <b>{rows.length} incoming transactions</b>:</div>
         </div>
         <table className="w-full border-collapse text-xs">
           <thead><tr>
             {['Date','Description','Amount'].map((h,i) => (
               <th key={h} className={"text-[9.5px] font-bold tracking-wide uppercase text-[#94A3B8] py-2 px-3.5 bg-[#F4F6FA] border-y border-[#E8EBF1] " + (i===2?'text-right':'text-left')}>{h}</th>
             ))}
           </tr></thead>
           <tbody>
             {rows.map((r) => (
               <tr key={r.id}>
                 <td className="py-2.5 px-3.5 border-b border-[#E8EBF1] font-medium text-[#475569]">{r.date}</td>
                 <td className="py-2.5 px-3.5 border-b border-[#E8EBF1] font-medium text-[#475569]">{r.desc}</td>
                 <td className="py-2.5 px-3.5 border-b border-[#E8EBF1] text-right font-bold tabular-nums text-[#16A34A]">+{r.amount}</td>
               </tr>
             ))}
           </tbody>
         </table>
         <div className="flex items-center justify-between px-3.5 py-[11px] bg-[#F4F6FA] border-t border-[#E8EBF1]">
           <span className="text-[11.5px] font-semibold text-[#475569]">Total income</span>
           <span className="text-[15px] font-extrabold tracking-[-0.02em] tabular-nums text-[#16A34A]">+{total}</span>
         </div>
       </div>
     );
   }
   ───────────────────────────────────────────────────────── */
