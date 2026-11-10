const https = require('https');

https.get('https://www.samyang1963.com/main.do', {
  headers: { 'User-Agent': 'Mozilla/5.0' },
  rejectUnauthorized: false
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const targets = ['inception_img', 'first_lt_img', 'first_rt_img', 'hs_item01', 'hs_item02', 'hs_item03'];
    targets.forEach(t => {
      const match = b.match(new RegExp(`.{0,150}${t}.{0,150}`, 's'));
      if (match) {
        console.log(`\n=== CONTEXT FOR ${t} ===`);
        console.log(match[0].replace(/\s+/g, ' '));
      }
    });
  });
});
