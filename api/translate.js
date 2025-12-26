// Vercel Serverless Function for Google Translate
// Deploy to Vercel and it works automatically!

const translate = require('google-translate-api-x');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, from = 'auto', to = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Limit text length to prevent abuse
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 chars)' });
    }

    const result = await translate(text, {
      from,
      to,
      autoCorrect: true,
      forceBatch: true, // Less likely to be rate limited
    });

    return res.status(200).json({
      success: true,
      translatedText: result.text,
      detectedLanguage: result.from?.language?.iso,
      pronunciation: result.pronunciation || null,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Translation failed',
    });
  }
};
