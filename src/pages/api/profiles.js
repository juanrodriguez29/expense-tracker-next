import { createClient } from '@supabase/supabase-js';

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

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { display_name, email, last_name, phone_number } = req.body
    const { data, error } = await supabase
      .from('profiles')
      .insert({ display_name, email, last_name, phone_number, id: user.id })
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).json({ error: 'Method not allowed' })

  if (req.method === 'PUT') {
    const { display_name, email, last_name, phone_number } = req.body
    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name, email, last_name, phone_number })
      .eq('id', user.id)
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }


}