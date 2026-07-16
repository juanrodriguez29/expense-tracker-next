import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {

  const token = req.headers.authorization?.split(' ')[1]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    console.log(req.body);
    const { category, amount } = req.body
    console.log("user.id", user.id);
    const { data, error } = await supabase
      .from('budgets')
      .insert({ category, amount, user_id: user.id })
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0]) 
   }

  res.status(405).json({ error: 'Method not allowed' })
}