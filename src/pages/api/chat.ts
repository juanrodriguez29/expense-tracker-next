import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ authError: 'Unauthorized' })

  const { message, messages } = req.body
  const anthropicKey = process.env.ANTHROPIC_API_KEY  

  const { data: expenses, error: expenseError } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)

  if (expenseError) return res.status(500).json({ error: 'Failed to fetch expenses' })
   
   const { data: budgets, error: budgetError } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)

  if (budgetError) return res.status(500).json({ error: 'Failed to fetch budgets' })

  const expenseList = expenses.map(e => `${e.date} | ${e.title} | ${e.amount} | ${e.category} | ${e.type}` ).join(`\n`)
  const budgetList = budgets.map(b => `${b.created_at} | ${b.category} | ${b.amount}`).join(`\n`)

  const prompt = `You are a personal finance assistant. 
You have access to the user's expense data and budget data.
Answer questions about their spending clearly and concisely.
When relevant, mention totals, categories and date ranges.

Here is the user's expense data:
${expenseList}

Here is the user's monthly budget data:
${budgetList}

Conversation history:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

User question:
${message}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,          
      'anthropic-version': '2023-06-01'   
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',  
      max_tokens: 1024,             
      messages: [
        { role: 'user', content: prompt }  // the conversation
      ]
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Anthropic API error:', errorData)
    return res.status(500).json({ error: 'Failed to get response from AI' })
  }

  const rawData = await response.text()
  const data= JSON.parse(rawData)

  const generateText = data.content[0].text

 return res.status(200).json({ reply: generateText })

}