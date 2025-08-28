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
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 10)
    const sessionId = `RISE_${timestamp}_${randomId}`
    
    const { data, error } = await supabase
      .from('participant_sessions')
      .insert({
        session_id: sessionId,
        consent_status: 'pending'
      })
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ 
      sessionId,
      success: true
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
