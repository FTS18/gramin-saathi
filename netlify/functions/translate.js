// Netlify Serverless Function for Google Translate
// Place in netlify/functions/ folder

const translate = require('google-translate-api-x');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text, from = 'auto', to = 'en' } = JSON.parse(event.body || '{}');

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' })
      };
    }

    // Limit text length to prevent abuse
    if (text.length > 5000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text too long (max 5000 chars)' })
      };
    }

    const result = await translate(text, {
      from,
      to,
      autoCorrect: true,
      forceBatch: true,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        translatedText: result.text,
        detectedLanguage: result.from?.language?.iso,
        pronunciation: result.pronunciation || null,
      })
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Translation failed',
      })
    };
  }
};
