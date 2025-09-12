import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sessionId, conversationId, timestamp } = req.body
    
    console.log('Linking conversation:', { sessionId, conversationId })

    // Insert conversation link into Supabase
    const { data, error } = await supabase
      .from('conversation_links')
      .insert({
        session_id: sessionId,
        conversation_id: conversationId,
        linked_at: timestamp || new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message 
      })
    }

    // Update the participant_sessions table
    const { error: updateError } = await supabase
      .from('participant_sessions')
      .update({ 
        conversation_started: true,
        conversation_id: conversationId,
        conversation_started_at: timestamp || new Date().toISOString()
      })
      .eq('session_id', sessionId)

    if (updateError) {
      console.log('Warning: Could not update session with conversation:', updateError.message)
    }

    // Optionally send to N8N webhook if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'conversation_link',
            sessionId: sessionId,
            conversationId: conversationId,
            timestamp: timestamp || new Date().toISOString()
          })
        })
      } catch (webhookError) {
        console.log('N8N webhook failed:', webhookError.message)
      }
    }

    res.status(200).json({ 
      success: true, 
      linked: true,
      sessionId: sessionId,
      conversationId: conversationId,
      data: data[0]
    })

  } catch (error) {
    console.error('Conversation linking error:', error)
    res.status(500).json({ 
      error: 'Linking failed', 
      details: error.message 
    })
  }
}
