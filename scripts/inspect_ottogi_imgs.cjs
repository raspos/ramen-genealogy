const https = require('https');

https.get('https://www.otokimall.com/front/product/search_result?keyword=%EC%A7%84%EB%9D%BC%EB%A9%B4', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    // Find all <img tags specifically
    const imgTags = [...body.matchAll(/<img[^>]+>/gi)].map(m => m[0]);
    console.log('Image tags count:', imgTags.length);
    console.log('Sample <img> tags:');
    imgTags.slice(0, 15).forEach(t => console.log(t));

    // Look for data-src or cdn.otokimall.com
    const cdnMatches = [...body.matchAll(/cdn\.otokimall\.com[^\s"'>]+/gi)].map(m => m[0]);
    console.log('cdn.otokimall.com occurrences:', cdnMatches.length);
    console.log('Unique cdn items:', [...new Set(cdnMatches)].slice(0, 10));

    // Look for handlebars templates or json data in the script!
    const templateMatches = [...body.matchAll(/<script[^>]*type="text\/x-handlebars-template"[^>]*>([\s\S]*?)<\/script>/gi)];
    console.log('Handlebars templates count:', templateMatches.length);
    templateMatches.forEach(t => console.log('Template:', t[1].slice(0, 200)));
  });
});
