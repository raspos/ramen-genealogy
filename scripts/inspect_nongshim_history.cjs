const https = require('https');

function checkNongshimHistory() {
  const url = 'https://www.nongshim.com/promotion/event/view?event_idx=417';
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('Status:', res.statusCode, 'Length:', b.length);
      const imgs = [...b.matchAll(/src="([^"]*(?:pro|eve|upload|history|img)[^"]*)"/gi)].map(m => m[1]);
      console.log('Images:', [...new Set(imgs)]);
    });
  }).on('error', e => console.error(e.message));
}

checkNongshimHistory();
