const https = require('https');

https.get('https://www.otokimall.com/front/main', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    // Search for "라면" in body
    const matches = [...body.matchAll(/.{0,50}라면.{0,50}/gi)];
    console.log('Matches containing 라면:', matches.length);
    matches.slice(0, 15).forEach(m => console.log(m[0].replace(/\s+/g, ' ')));

    // Search for category JSON or API
    const scriptMatches = [...body.matchAll(/cate|category/gi)];
    console.log('Occurrences of cate/category:', scriptMatches.length);
    const apiMatches = [...body.matchAll(/['"](\/[^'"]*(?:cate|product|goods|search)[^'"]*)['"]/gi)].map(m => m[1]);
    console.log('API endpoints found:', [...new Set(apiMatches)].slice(0, 20));
  });
});
