import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { session_id, conversation_data, timestamp } = req.body
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        session_id,
        conversation_data,
        interaction_timestamp: timestamp || new Date().toISOString(),
        tikanga_compliance_check: false
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
