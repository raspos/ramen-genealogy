const https = require('https');

https.get('https://raspos.github.io/ramen-genealogy/', res => {
  console.log('GitHub Pages Status:', res.statusCode);
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const jsMatch = html.match(/src="(\/ramen-genealogy\/assets\/[^"]+)"/);
    console.log('Live JS bundle on GitHub Pages:', jsMatch ? jsMatch[1] : null);
  });
}).on('error', e => console.error(e.message));
