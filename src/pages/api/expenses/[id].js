import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {

  const token = req.headers.authorization?.split(' ')[1]
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ authError: 'Unauthorized' })

  const { id } = req.query


  if (req.method === 'PUT') {
    const { title, amount, date, category } = req.body
    const { data, error } = await supabase
      .from('expenses')
      .update({ title, amount, date, category })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) return res.status(500).json({ error: error.message })
    
      
  }

  res.status(405).json({ error: 'Method not allowed' })

}

