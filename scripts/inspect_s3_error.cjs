const https = require('https');

const url = 'https://cdn.otokimall.com/data/product/detail/20221125/1775615260107nHmAc.qdss635zk3mq.jpg';

https.get(url, {
  rejectUnauthorized: false,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => console.log('XML body:', b));
});
