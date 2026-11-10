const https = require('https');
const http = require('http');

function checkPaldo() {
  const req = http.get('http://www.paldofood.co.kr/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, (res) => {
    console.log('Paldo status:', res.statusCode, res.headers.location);
    if (res.headers.location) {
      console.log('Paldo redirect to:', res.headers.location);
    }
  });
  req.on('error', e => console.error('Paldo error:', e.message));
}

checkPaldo();
