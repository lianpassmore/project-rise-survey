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
    const { sessionId, formData, timestamp, source } = req.body
    
    console.log('Form submission received:', { 
      sessionId, 
      source, 
      timestamp,
      hasFormData: !!formData 
    })

    // Insert form submission data into Supabase
    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        session_id: sessionId,
        form_data: formData,
        submission_source: source,
        submitted_at: timestamp || new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message 
      })
    }

    // Also update the participant_sessions table
    const { error: updateError } = await supabase
      .from('participant_sessions')
      .update({ 
        form_completed: true,
        form_completed_at: timestamp || new Date().toISOString()
      })
      .eq('session_id', sessionId)

    if (updateError) {
      console.log('Warning: Could not update session status:', updateError.message)
    }

    // Optionally send to N8N webhook if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'form_submission',
            sessionId: sessionId,
            formData: formData,
            source: source,
            timestamp: timestamp || new Date().toISOString()
          })
        })
      } catch (webhookError) {
        console.log('N8N webhook failed:', webhookError.message)
        // Continue anyway - don't fail the whole request
      }
    }

    res.status(200).json({ 
      success: true, 
      sessionId: sessionId,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Form submission error:', error)
    res.status(500).json({ 
      error: 'Form submission failed', 
      details: error.message 
    })
  }
}
