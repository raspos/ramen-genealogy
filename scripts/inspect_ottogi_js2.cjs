const https = require('https');

https.get('https://www.otokimall.com/static/jscript/front/ui.cw.product.js?v=2026', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    // Search for ajax or post
    const matches = [...body.matchAll(/(?:\$\.ajax|\$\.post|\$\.get|fetch)\s*\(([\s\S]{1,200})\)/gi)];
    console.log('Matches:', matches.length);
    matches.forEach(m => console.log('AJAX call:', m[1].slice(0, 100)));

    // Search for any paths starting with /
    const paths = [...body.matchAll(/["'](\/[a-zA-Z0-9_\-\/]+(?:\.ajax|\.do|\.json)?)["']/g)].map(m => m[1]);
    console.log('Paths:', [...new Set(paths)]);
  });
});
