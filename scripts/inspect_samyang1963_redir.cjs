const https = require('https');

https.get('https://www.samyang1963.com/', {
  rejectUnauthorized: false
}, (res) => {
  console.log('Location:', res.headers.location);
});
