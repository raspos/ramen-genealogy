const https = require('https');

const url = 'https://brand.nongshim.com/Rabbokguri/main/index';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Look for brand list / product links
    const brandMatches = [...data.matchAll(/href="([^"]*brand\.nongshim\.com[^"]*)"/gi)];
    console.log('Brand links:', brandMatches.slice(0, 20).map(m => m[1]));

    const allLinks = [...data.matchAll(/href="([^"]*(?:product|brand|main|item)[^"]*)"/gi)];
    console.log('Other interesting links:', allLinks.slice(0, 25).map(m => m[1]));

    // Search for product images and titles
    const proImgMatches = [...data.matchAll(/<img[^>]+src="(https:\/\/image\.nongshim\.com\/non\/pro\/[^"]+)"[^>]*alt="([^"]*)"/gi)];
    console.log('Product images with alt:', proImgMatches.map(m => ({ src: m[1], alt: m[2] })));
    
    // Also check any image.nongshim.com links with context
    const allImgMatches = [...data.matchAll(/(https:\/\/image\.nongshim\.com\/[^"'\s]+)/gi)];
    console.log('All image.nongshim.com URLs count:', allImgMatches.length);
    console.log('Unique image.nongshim.com URLs:', [...new Set(allImgMatches.map(m => m[1]))]);
  });
});
