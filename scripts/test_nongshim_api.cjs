const https = require('https');

const url = 'https://brand.nongshim.com/commons/outoSearchBrand?brandNm=';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Total brands in JSON:', json.length);
      console.log('Sample items:', json.slice(0, 15));
    } catch (e) {
      console.log('Data (first 500 chars):', data.slice(0, 500));
    }
  });
});
