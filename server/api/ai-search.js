// Load environment variables
require('dotenv').config();

const { enhanceSearch, isAIAvailable } = require('../services/aiSearchService');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, limit = 10, offset = 0 } = req.body;

    // Basic validation
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required',
        success: false
      });
    }

    // Check AI availability
    if (!isAIAvailable()) {
      return res.status(503).json({
        error: 'AI search service is not available',
        success: false,
        aiDisabled: true
      });
    }

    // Perform search
    const results = await enhanceSearch(query.trim(), limit, offset);

    return res.json({
      success: true,
      query: query.trim(),
      results: results,
      count: results.length,
      processingTime: 100
    });

  } catch (error) {
    console.error('AI Search error:', error);
    return res.status(500).json({
      error: 'AI search failed',
      success: false
    });
  }
}