export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId, timestamp, completionType } = req.body;
        
        // Send to N8N
        await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'survey_completed',
                sessionId,
                completionType,
                timestamp
            })
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log completion' });
    }
}
