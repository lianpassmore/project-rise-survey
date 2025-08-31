import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// === Paste your full CommunityFeedbackServer class here ===
// (constructor, properties, setupHandlers, all async methods, and all helper methods)
class CommunityFeedbackServer {
  // ... All code, pasted in full from the .md file, just remove any StdioServerTransport or process/stdin listeners.
}

const communityFeedbackServer = new CommunityFeedbackServer();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const { type, params } = req.body || {};

  try {
    if (type === 'listResources') {
      const resp = await communityFeedbackServer.server.request(ListResourcesRequestSchema, params || {});
      return res.status(200).json(resp);
    }
    if (type === 'readResource') {
      const resp = await communityFeedbackServer.server.request(ReadResourceRequestSchema, params || {});
      return res.status(200).json(resp);
    }
    if (type === 'listTools') {
      const resp = await communityFeedbackServer.server.request(ListToolsRequestSchema, params || {});
      return res.status(200).json(resp);
    }
    if (type === 'callTool') {
      const resp = await communityFeedbackServer.server.request(CallToolRequestSchema, params || {});
      return res.status(200).json(resp);
    }
    return res.status(400).json({ error: 'Unknown API type' });
  } catch (e) {
    return res.status(500).json({
      error: e.message || 'Internal error',
      stack: e.stack || '',
      name: e.name,
    });
  }
}
