const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const querystring = require('querystring');

const outDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;
    const req = client.get(url, {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, url).href;
        downloadImage(nextUrl, destPath).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        resolve({ success: false, status: res.statusCode });
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stat = fs.statSync(destPath);
        if (stat.size < 1000) {
          fs.unlinkSync(destPath);
          resolve({ success: false, reason: 'File too small: ' + stat.size });
        } else {
          resolve({ success: true, size: stat.size });
        }
      });
    });
    req.on('error', e => resolve({ success: false, error: e.message }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ success: false, reason: 'Timeout' });
    });
  });
}

// 1. Fetch Ottogi Mall products
async function crawlOttogi() {
  console.log('Crawling Ottogi Mall products...');
  const results = [];

  for (const scate of [16, 17]) {
    const postData = querystring.stringify({
      type: 'search',
      scate: String(scate),
      sbrand: '0',
      depthCheck: '2',
      ptype: '0',
      psort: 'pop',
      listBtn: '0',
      pageSize: '100',
      page: '1'
    });

    const body = await new Promise((resolve) => {
      const req = https.request('https://www.otokimall.com/front/product/product_list.ajax', {
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Referer': `https://www.otokimall.com/front/product/category/${scate}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let b = '';
        res.on('data', c => b += c);
        res.on('end', () => resolve(b));
      });
      req.on('error', () => resolve(''));
      req.write(postData);
      req.end();
    });

    const regex = /<div class="prd-item\s*">[\s\S]*?<img src="([^"]*cdn\.otokimall\.com\/data\/product\/list\/[^"]*)" alt="([^"]*)"[\s\S]*?<p class="name">([^<]+)<\/p>/gi;
    let m;
    while ((m = regex.exec(body)) !== null) {
      const imgUrl = m[1].replace('/list/', '/detail/'); // high-res detail image
      const name = m[3].trim();
      results.push({ name, imgUrl, source: '오뚜기공식몰', package: scate === 16 ? 'BAG' : 'CUP' });
    }
  }

  console.log(`Ottogi Mall extracted ${results.length} official items.`);
  return results;
}

// 2. Fetch Nongshim Brand Site products
async function crawlNongshim() {
  console.log('Crawling Nongshim brand site...');
  const brandsJson = await new Promise((resolve) => {
    https.get('https://brand.nongshim.com/commons/outoSearchBrand?brandNm=', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); } catch (e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });

  const noodleBrands = brandsJson.filter(b => b.catCd === 'A00' && b.useYn === 'Y');
  console.log(`Found ${noodleBrands.length} Nongshim noodle brands.`);

  const results = [];

  for (const b of noodleBrands) {
    const brandId = b.brandId;
    // Check both main and product pages
    for (const page of ['main', 'product']) {
      const url = `https://brand.nongshim.com/${brandId}/${page}/index`;
      const html = await new Promise((resolve) => {
        https.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (res) => {
          let str = '';
          res.on('data', c => str += c);
          res.on('end', () => resolve(str));
        }).on('error', () => resolve(''));
      });

      // Match products: <img src="...image.nongshim.com/non/pro/..." alt="..."
      const imgRegex = /<img[^>]+src="(https:\/\/image\.nongshim\.com\/non\/pro\/[^"]+)"[^>]*alt="([^"]*)"/gi;
      let im;
      while ((im = imgRegex.exec(html)) !== null) {
        const imgUrl = im[1];
        const name = im[2].trim();
        if (name && !name.toLowerCase().includes('icon') && !name.toLowerCase().includes('new')) {
          results.push({ name, imgUrl, brandId, source: '농심공식브랜드관' });
        }
      }
    }
  }

  // Deduplicate by name & imgUrl
  const unique = [];
  const seen = new Set();
  for (const item of results) {
    const key = `${item.name}|${item.imgUrl}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  console.log(`Nongshim extracted ${unique.length} official product images.`);
  return unique;
}

async function main() {
  const ottogi = await crawlOttogi();
  const nongshim = await crawlNongshim();

  fs.writeFileSync(path.join(__dirname, 'crawled_ottogi.json'), JSON.stringify(ottogi, null, 2));
  fs.writeFileSync(path.join(__dirname, 'crawled_nongshim.json'), JSON.stringify(nongshim, null, 2));
  console.log('Saved crawled data.');
}

main().catch(console.error);
