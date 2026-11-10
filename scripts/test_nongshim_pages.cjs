const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/<img[^>]+src="([^"]*(?:pro|info|product)[^"]*)"[^>]*alt="([^"]*)"/gi)];
        const imgList = [...data.matchAll(/(https:\/\/image\.nongshim\.com\/non\/pro\/[^\s"'>]+)/gi)].map(m => m[1]);
        resolve({
          url,
          status: res.statusCode,
          matches: matches.map(m => ({ src: m[1], alt: m[2] })),
          directImgs: [...new Set(imgList)]
        });
      });
    }).on('error', e => resolve({ url, error: e.message }));
  });
}

async function run() {
  const urls = [
    'https://brand.nongshim.com/shinramyun/main/index',
    'https://brand.nongshim.com/shinthered/main/index',
    'https://brand.nongshim.com/shintoomba/main/index',
    'https://brand.nongshim.com/black/main/index',
    'https://brand.nongshim.com/shin-nonfrying/main/index',
    'https://brand.nongshim.com/mupama/main/index',
    'https://brand.nongshim.com/gomtang/main/index',
    'https://brand.nongshim.com/BHDbibim/main/index',
    'https://brand.nongshim.com/noodlefit/main/index',
    'https://brand.nongshim.com/zzawang/main/index',
    'https://brand.nongshim.com/bowlnoodle/main/index',
    'https://brand.nongshim.com/sarimyun/main/index'
  ];

  for (const u of urls) {
    const r = await checkUrl(u);
    console.log(`=== ${u} === (status ${r.status})`);
    console.log('Matches with alt:', r.matches.filter(m => m.alt.length > 0));
    console.log('Direct image.nongshim.com/non/pro/ imgs:', r.directImgs);
  }
}

run();
