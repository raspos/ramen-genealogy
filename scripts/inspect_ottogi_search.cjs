const https = require('https');

https.get('https://www.otokimall.com/front/main', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    // Find search form or input
    const searchForm = [...body.matchAll(/<form[^>]*action="([^"]*search[^"]*)"[^>]*>/gi)];
    console.log('Search forms:', searchForm.map(m => m[0]));
    
    const searchInputs = [...body.matchAll(/<input[^>]*name="([^"]*search[^"]*)"[^>]*>/gi)];
    console.log('Search inputs:', searchInputs.map(m => m[0]));

    const searchAction = [...body.matchAll(/function[^\{]*search[^\(]*\([^\)]*\)\s*\{[\s\S]{0,300}\}/gi)];
    console.log('Search functions:', searchAction.map(m => m[0]));
  });
});
