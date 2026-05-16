import { useState } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

export function Chat({ setIsOpen, messages, setMessages }) {
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage])
    setInput('');
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        message: input,
        messages: [...messages, newMessage]
      })
    })
    const data = await response.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    setLoading(false);

  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span>💬</span>
          <h2 className="font-semibold text-slate-800 text-sm">Expense Assistant</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors text-lg">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-slate-400 text-sm text-center mt-4">Ask me anything about your expenses!</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`text-sm px-3 py-2 rounded-xl max-w-[85%] overflow-x-auto ${msg.role === 'user'
              ? 'bg-indigo-600 text-white self-end'
              : 'bg-slate-100 text-slate-800 self-start'
            }`}>
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
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your expenses..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
          Send
        </button>
      </div>

    </div>
  )
}
