const https = require('https');

https.get('https://www.otokimall.com/front/product/search_result?keyword=%EC%A7%84%EB%9D%BC%EB%A9%B4', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Body length:', body.length);
    // Find all image URLs
    const imgMatches = [...body.matchAll(/src="([^"]+)"/gi)].map(m => m[1]);
    console.log('All image URLs count:', imgMatches.length);
    console.log('Sample images:', [...new Set(imgMatches)].slice(0, 30));

    // Also look for product names or titles
    const titles = [...body.matchAll(/class="[^"]*(?:title|name|tit)[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('Titles found:', titles.filter(t => t.length > 0).slice(0, 20));
  });
});
