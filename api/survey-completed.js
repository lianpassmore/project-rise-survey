export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId, timestamp, completionType } = req.body;
        
        console.log('Survey completed:', { sessionId, completionType, timestamp });

        // Send to N8N webhook if available
        if (process.env.N8N_WEBHOOK_URL) {
            try {
                await fetch(process.env.N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'survey_completed',
                        sessionId: sessionId,
                        completionType: completionType,
                        timestamp: timestamp || new Date().toISOString()
                    })
                });
            } catch (webhookError) {
                console.log('N8N webhook failed:', webhookError.message);
            }
        }

        res.status(200).json({ 
            success: true,
            sessionId: sessionId,
            completionType: completionType
        });

    } catch (error) {
        console.error('Survey completion logging error:', error);
        res.status(500).json({ 
            error: 'Failed to log completion', 
            details: error.message 
        });
    }
}
