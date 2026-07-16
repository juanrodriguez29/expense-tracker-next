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
  if (!user) return res.status(401).json({ authError: 'Unauthorized' })

  const { id } = req.query


  if (req.method === 'PUT') {
    const { category, amount } = req.body
    const { data, error } = await supabase
      .from('budgets')
      .update({ category, amount })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).json({ error: 'Method not allowed' })

}

