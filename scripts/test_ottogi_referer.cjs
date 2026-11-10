const https = require('https');
const fs = require('fs');

const url = 'https://cdn.otokimall.com/data/product/detail/20221125/1775615260107nHmAc.qdss635zk3mq.jpg';

https.get(url, {
  rejectUnauthorized: false,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.otokimall.com/'
  }
}, (res) => {
  console.log('Status code with Referer:', res.statusCode);
  console.log('Content-Length:', res.headers['content-length']);
  console.log('Content-Type:', res.headers['content-type']);
});
