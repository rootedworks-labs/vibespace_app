const axios = require('axios');
const cheerio = require('cheerio');

// Regex to find the first http/https link in a block of text
const urlRegex = /(https?:\/\/[^\s]+)/;

/**
 * Extracts the first URL from a string.
 * @param {string} text - The text content.
 * @returns {string | null} - The first URL found, or null.
 */
function extractFirstUrl(text) {
  if (!text) return null;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

/**
 * Fetches metadata for a given URL.
 * @param {string} url - The URL to preview.
 * @returns {object | null} - An object with metadata, or null.
 */
async function fetchLinkMetadata(url) {
  if (!url) return null;

  try {
    // Set a user-agent to mimic a browser, as some sites block generic scrapers
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 3000 // 3-second timeout
    });

    const $ = cheerio.load(data);

    // Helper to get meta tag content
    const getMetaTag = (prop) => $(`meta[property="${prop}"]`).attr('content') || $(`meta[name="${prop}"]`).attr('content');

    const preview = {
      url: url,
      title: getMetaTag('og:title') || $('title').text(),
      description: getMetaTag('og:description') || getMetaTag('description'),
      image: getMetaTag('og:image'),
      siteName: getMetaTag('og:site_name')
    };

    // If no title, it's not a valid preview
    if (!preview.title) return null;
    
    return preview;

  } catch (error) {
    console.error(`Failed to fetch link preview for ${url}:`, error.message);
    return null;
  }
}

module.exports = {
  extractFirstUrl,
  fetchLinkMetadata
};