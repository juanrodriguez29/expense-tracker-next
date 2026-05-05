import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {

  const token = req.headers.authorization?.split(' ')[1]
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ authError: 'Unauthorized' })

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { title, amount, date, category } = req.body
    const { data, error } = await supabase
      .from('expenses')
      .insert({ title, amount, date, category, user_id: user.id })
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).json({ error: 'Method not allowed' })
}
