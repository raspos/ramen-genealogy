const https = require('https');

https.get('https://www.samyangfoods.com/kor/brand/list.do?searchCateCd1=45', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const matches = [...b.matchAll(/.{0,100}(?:productList|\.ajax|searchCateCd).{0,100}/gi)];
    matches.forEach(m => console.log(m[0].replace(/\s+/g, ' ')));
  });
});
