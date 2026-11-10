const https = require('https');

https.get(`https://www.otokimall.com/front/product/category/16`, {
  rejectUnauthorized: false,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode, 'Body length:', body.length);
    // Find all script tags or ajax calls
    const ajaxCalls = [...body.matchAll(/\.ajax\(\{[\s\S]*?url\s*:\s*['"]([^'"]+)['"]/gi)].map(m => m[1]);
    console.log('AJAX calls:', ajaxCalls);

    const apis = [...body.matchAll(/['"](\/[^'"]*(?:list|product|category|goods)[^'"]*)['"]/gi)].map(m => m[1]);
    console.log('Endpoints:', [...new Set(apis)].slice(0, 20));

    // Also print some html snippet
    console.log('HTML snippet around goods:');
    const goodsSnippets = [...body.matchAll(/<div[^>]*class="[^"]*(?:goods|item|product|list)[^"]*"[^>]*>[\s\S]{0,300}/gi)].map(m => m[0]);
    console.log('Goods snippets count:', goodsSnippets.length);
    if (goodsSnippets.length > 0) {
      console.log(goodsSnippets[0]);
    }
  });
});
