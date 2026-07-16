import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const GRAD = 'linear-gradient(135deg,#6E5DEF 0%,#4577ED 55%,#1FAEEC 100%)';

/* ==========================================================================
   SVG Icons
   Lightweight custom icons used throughout the chat widget.
========================================================================== */
const SparkleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3l1.6 4.5L18 9l-4.4 1.5L12 15l-1.6-4.5L6 9l4.4-1.5z" fill="currentColor" />
  </svg>
);

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
const SendIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

/* ==========================================================================
   Assistant Avatar
   Displayed beside assistant responses and typing indicators.
========================================================================== */
const BotAvatar = () => (
  <div className="w-7 h-7 rounded-[9px] flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(74,63,208,0.3)]" style={{ background: GRAD }}>
    <SparkleIcon className="w-[15px] h-[15px] text-white" />
  </div>
);

/* ==========================================================================
   Typing Indicator
   Animated dots shown while waiting for AI response.
========================================================================== */
const TypingRow = () => (
  <div className="flex gap-2.5 items-end">
    <BotAvatar />
    <div className="flex gap-1 px-[15px] py-[13px] bg-white border border-[#E8EBF1] rounded-2xl rounded-bl-[6px]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#94A3B8] animate-bounce [animation-delay:0ms]" />
      <span className="w-[7px] h-[7px] rounded-full bg-[#94A3B8] animate-bounce [animation-delay:150ms]" />
      <span className="w-[7px] h-[7px] rounded-full bg-[#94A3B8] animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
)

const DEFAULT_SUGGESTIONS = [
  { label: 'Food this month', q: 'How much did I spend on Food this month?' },
  { label: 'Over budget?', q: 'Am I over any budgets?' },
  { label: 'Income last week', q: 'Show my income last week' },
];


export function Chat({ open, onClose, messages, setMessages }) {

  const [input, setInput] = useState();
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const taRef = useRef(null);
  const inputRef = useRef(null);


  /* ==========================================================================
     Effects
  ========================================================================== */

  // Automatically scroll to the latest message whenever
  // a new message arrives or loading state changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  // Focus textarea shortly after opening the chat.
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 260);
    }
  }, [open]);

  // Allow users to close the chat with the Escape key.
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);


  /**
   * Dynamically resize textarea height
   * while keeping a maximum height.
   */
  function autosize() {
    const textarea = taRef.current;

    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height =
      Math.min(textarea.scrollHeight, 96) + 'px';
  }


  /**
 * Sends a user message to the chat API
 * and appends the assistant response
 * to the conversation history.
 */
  const handleSend = async (text) => {
    const message = text || input;

    if (!message.trim() || loading) return;

    const newMessage = {
      role: 'user',
      content: message,
      time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit'})
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          message,
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit'})
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (

      <section
        role="dialog"
        aria-label="Expense Assistant"
        className={
          'animate-chat-in w-[388px] h-[min(520-px,calc(100vh-140px))] bg-white rounded-[24px] overflow-hidden flex flex-col origin-bottom-right ' +
          'shadow-[0_32px_70px_-12px_rgba(15,23,42,0.30),0_12px_28px_-12px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.04)] ' +
          'transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] '
        }
      >

         {/* Header */}
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
          <button onClick={onClose} aria-label="Close"
            className="w-[34px] h-[34px] rounded-[11px] border-none cursor-pointer bg-white/[0.14] text-white flex items-center justify-center hover:bg-white/[0.26] transition-colors flex-shrink-0">
            <CloseIcon className="w-[17px] h-[17px]" />
          </button>
        </header>

       {/* messages */}
        <div className="flex-1 overflow-y-auto px-[18px] pt-5 pb-2 flex flex-col gap-3.5 bg-gradient-to-b from-[#FCFCFE] to-[#F7F8FB]">
          {messages.length === 1 && (
            <>
              <p className="text-slate-400 text-sm text-center mt-4">Ask me anything about your expenses!</p>
              <div className="flex flex-wrap gap-[7px] pl-[37px] pt-0.5 pb-1.5">
                {DEFAULT_SUGGESTIONS.map((s) => (
                  <button key={s.q} onClick={() => handleSend(s.q)}
                    className="px-[13px] py-2 rounded-[13px] text-[12.5px] font-semibold leading-none cursor-pointer bg-white border border-[#E8EBF1] text-[#4A3FD0] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-[#EEF0FE] hover:border-[#C9CCF7] hover:-translate-y-px transition-all">
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}


          {messages.map((msg, index) => {
            const me = msg.role === 'user'
            return (
              <div
                key={index}
                className={`flex gap-2.5 items-end max-w-full motion-safe:animate-[slRise_320ms_cubic-bezier(0.22,1,0.36,1)] ${me ? 'flex-row-reverse' : ''}`}
              >
                {!me && <BotAvatar />}
                <div className={
                  me
                    ? 'max-w-full px-3.5 py-[11px] text-[13.5px] leading-[1.5] rounded-2xl rounded-br-[6px] text-white [overflow-wrap:anywhere] shadow-[0_4px_12px_rgba(74,63,208,0.28)]'
                    : 'max-w-full px-3.5 py-[11px] text-[13.5px] leading-[1.5] rounded-2xl rounded-bl-[6px] text-[#0F172A] bg-white border border-[#E8EBF1] shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                }
                  style={me ? { background: GRAD } : undefined}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ node, ...props }) => (
                        <table className="text-xs border-collapse w-full" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-slate-300 px-2 py-1 bg-slate-200" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-slate-300 px-2 py-1" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                 {msg.time && (
          <div className={`text-[10px] text-[#94A3B8] mt-[3px] mx-0.5 font-medium ${me ? 'text-right' : ''}`}>{messages.time}</div>
        )}
              </div>
            )
          })}

          {loading && <TypingRow />}
          <div ref={messagesEndRef} />
        </div>

       {/* composer */}
        <div className="px-4 pt-[13px] pb-4 bg-white border-t border-[#E8EBF1]">
          <div className="flex items-end gap-2.5 bg-[#F4F6FA] rounded-2xl pl-4 pr-1.5 py-1.5 transition-all focus-within:bg-white focus-within:shadow-[inset_0_0_0_1.5px_#5B4FE9]">
            <textarea
              ref={(el) => { taRef.current = el; inputRef.current = el; }}
              rows={1}
              value={input}
              onChange={(e) => { setInput(e.target.value); autosize(); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask about your expenses…"
              className="flex-1 border-none outline-none resize-none bg-transparent text-[13.5px] leading-[1.45] text-[#0F172A] py-2 max-h-24 placeholder:text-[#94A3B8]"
            />
            <button onClick={() => handleSend()}
              aria-label="Send"
              className="w-10 h-10 rounded-[13px] border-none cursor-pointer text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(74,63,208,0.32)] hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(74,63,208,0.42)] transition-all"
              style={{ background: GRAD }}>
              <SendIcon className="w-[18px] h-[18px]" />
            </button>
          </div>
          <div className="text-center text-[10.5px] text-[#94A3B8] mt-[9px] font-medium">
            <b className="text-[#475569] font-semibold">SmartLedge AI</b> · answers from your live data
          </div>
        </div>
      </section >
     
  );
}


