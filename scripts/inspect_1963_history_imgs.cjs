const https = require('https');
const fs = require('fs');
const path = require('path');

const imgNames = [
  'inception_img01.png',
  'inception_img02.png',
  'inception_img03.png',
  'first_lt_img.png',
  'first_rt_img.png',
  'hs_item01.png',
  'hs_item02.png',
  'hs_item03.png',
  'hs_item04.png',
  'hs_item05.png',
  'hs_item06.png',
  'hs_item07.png'
];

async function checkImg(name) {
  return new Promise((resolve) => {
    const url = `https://www.samyang1963.com/static/img/${name}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let len = 0;
      res.on('data', c => len += c.length);
      res.on('end', () => resolve({ name, status: res.statusCode, size: len, type: res.headers['content-type'] }));
    }).on('error', e => resolve({ name, error: e.message }));
  });
}

async function run() {
  for (const n of imgNames) {
    const r = await checkImg(n);
    console.log(r);
  }
}

run();
