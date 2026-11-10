const https = require('https');

const url = 'https://brand.nongshim.com/all_product/index';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('all_product status:', res.statusCode, 'length:', data.length);
    // Find all links to brand or products
    const links = [...data.matchAll(/href="([^"]+)"/gi)].map(m => m[1]);
    const ramenLinks = links.filter(l => l.includes('main/index') || l.includes('product'));
    console.log('Ramen links count:', ramenLinks.length);
    console.log('Sample links:', [...new Set(ramenLinks)].slice(0, 30));

    // Also look for all product images with alt or titles
    const proImgMatches = [...data.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
    console.log('Found product images in all_product:', proImgMatches.length);
    const nonPro = proImgMatches.filter(m => m[1].includes('image.nongshim.com') || m[2].length > 0);
    console.log('Sample nonPro images:', nonPro.slice(0, 20));
  });
});
