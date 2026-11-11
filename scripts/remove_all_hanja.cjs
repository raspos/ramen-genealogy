const fs = require('fs');

// 1. Update src/pages/GenealogyPage.tsx
let gp = fs.readFileSync('src/pages/GenealogyPage.tsx', 'utf8');
gp = gp.replace('붕당정치(朋黨政治) 도식으로 읽는 한국 라면 60년', '정당 계보도처럼 한눈에 보는 한국 라면 60년');
gp = gp.replace('조선시대 붕당의 이념 대립처럼, 국물파와 비국물파로 나뉜 맛과 조리법의 정밀 분류도', '정당 계보처럼 국물파와 비국물파로 나뉜 맛과 조리법의 정밀 계보도');
fs.writeFileSync('src/pages/GenealogyPage.tsx', gp, 'utf8');

// 2. Update src/pages/LabPage.tsx
let lp = fs.readFileSync('src/pages/LabPage.tsx', 'utf8');
lp = lp.replace('혼잡실험실(混雜實驗室)', '라면 조합 연구소');
fs.writeFileSync('src/pages/LabPage.tsx', lp, 'utf8');

// 3. Update src/components/FactionQuizModal.tsx
let fqm = fs.readFileSync('src/components/FactionQuizModal.tsx', 'utf8');
fqm = fqm.replace(/탕파\(湯派\)/g, '국물파');
fqm = fqm.replace(/건파\(乾派\)/g, '비국물파');
fs.writeFileSync('src/components/FactionQuizModal.tsx', fqm, 'utf8');

// 4. Update src/components/FactionDrawer.tsx
let fd = fs.readFileSync('src/components/FactionDrawer.tsx', 'utf8');
fd = fd.replace('천하통일 집권 (天下統一)', '천하통일 집권');
fd = fd.replace('주류 붕당 (主流 朋黨)', '주류 파벌');
fd = fd.replace('역사적 시원 (始原)', '역사적 시작');
fd = fd.replace('반란과 신흥 돌풍 (叛亂·突風)', '반란과 신흥 돌풍');
fd = fd.replace('공존과 롱셀러 (共存)', '장수 공존');
fd = fd.replace('붕당 흥망성쇠 실록 (興亡盛衰 實錄)', '라면 파벌 흥망성쇠 실록');
fs.writeFileSync('src/components/FactionDrawer.tsx', fd, 'utf8');

// 5. Update src/data/factionTaxonomy.ts
let ft = fs.readFileSync('src/data/factionTaxonomy.ts', 'utf8');
const hanjaMap = {
  "'辛牛派'": "'정통 소고기파'",
  "'辛海派'": "'얼큰 해물파'",
  "'辛泡派'": "'김치 찌개파'",
  "'醇牛派'": "'구수한 소고기장국파'",
  "'骨湯派'": "'진한 사골곰탕파'",
  "'魚湯派'": "'맑은 멸치어육파'",
  "'白湯派'": "'하얀국물 반란파'",
  "'濃湯派'": "'진한 미소된장파'",
  "'辛火派'": "'극초매운맛파'",
  "'自然派'": "'채식 비건야채파'",
  "'黑醬派'": "'정통 춘장짜장파'",
  "'冷拌派'": "'새콤달콤 냉비빔파'",
  "'極火派'": "'화끈한 불닭볶음파'",
  "'和洋派'": "'치즈 크림퓨전파'",
  "'始原鷄湯派'": "'원조 닭고기백탕파'"
};
for (const [k, v] of Object.entries(hanjaMap)) {
  ft = ft.replaceAll(k, v);
}
fs.writeFileSync('src/data/factionTaxonomy.ts', ft, 'utf8');

// 6. Update src/data/historicalGenealogyData.ts
let hg = fs.readFileSync('src/data/historicalGenealogyData.ts', 'utf8');
hg = hg.replaceAll("'開拓期'", "'개척기'");
hg = hg.replaceAll("'牛肉湯 執權期'", "'소고기 국물 집권기'");
hg = hg.replaceAll("'海鮮·非湯 分黨期'", "'해물·비국물 분파기'");
hg = hg.replaceAll("'百花齊放 多樣化期'", "'다양화 전성기'");
hg = hg.replaceAll("'白湯 叛亂期'", "'하얀국물 반란기'");
hg = hg.replaceAll("'火魔·融合 現代期'", "'불닭·퓨전 현대기'");

hg = hg.replaceAll("'始原之變'", "'최초 라면 탄생'");
hg = hg.replaceAll("'海鮮獨立'", "'해물라면 독립'");
hg = hg.replaceAll("'非湯分黨'", "'비국물 라면 등장'");
hg = hg.replaceAll("'辛라면 執權'", "'신라면 천하통일'");
hg = hg.replaceAll("'白湯叛亂'", "'하얀국물의 난'");
hg = hg.replaceAll("'火魔降臨'", "'불닭 화마 강림'");
hg = hg.replaceAll("'中華大戰'", "'프리미엄 짬뽕 대전'");

hg = hg.replaceAll("'始原鷄湯派'", "'원조 닭고기 백탕파'");
hg = hg.replaceAll("'辛牛派'", "'정통 얼큰 소고기파'");
hg = hg.replaceAll("'海鮮派'", "'시원한 해물 짬뽕파'");
hg = hg.replaceAll("'骨湯派'", "'진한 사골 곰탕파'");
hg = hg.replaceAll("'白湯叛亂派'", "'하얀국물 반란파'");
hg = hg.replaceAll("'炸醬派'", "'정통 춘장 짜장파'");
hg = hg.replaceAll("'冷排派'", "'새콤달콤 냉비빔파'");
hg = hg.replaceAll("'火魔派'", "'화끈한 불닭 볶음파'");
hg = hg.replaceAll("'極辛派'", "'극초매운맛파'");
hg = hg.replaceAll("'融合派'", "'치즈·크림 퓨전파'");

hg = hg.replaceAll('시원 (始原)', '원조 시작');
hg = hg.replaceAll('소고기 얼큰계 (辛牛派)', '정통 소고기 얼큰파');
hg = hg.replaceAll('해물 시원계 (海鮮派)', '시원한 해물 짬뽕파');
hg = hg.replaceAll('사골·곰탕계 (骨湯派)', '진한 사골 곰탕파');
hg = hg.replaceAll('하얀 국물 반란계 (白湯叛亂派)', '하얀 국물 반란파');
hg = hg.replaceAll('춘장 짜장계 (炸醬派)', '정통 춘장 짜장파');
hg = hg.replaceAll('화마 매운볶음계 (火魔派)', '화끈한 불닭 볶음파');
hg = hg.replaceAll('냉비빔계 (冷排派)', '새콤달콤 냉비빔파');
hg = hg.replaceAll('퓨전계 (融合派)', '치즈·크림 퓨전파');
hg = hg.replaceAll('골목 출신 극강계', '골목 출신 극초매운파');
hg = hg.replaceAll('천하통일 (天下統一)', '천하통일');

fs.writeFileSync('src/data/historicalGenealogyData.ts', hg, 'utf8');

// 7. Update src/components/LineageTree.tsx
let lt = fs.readFileSync('src/components/LineageTree.tsx', 'utf8');
lt = lt.replace('朋黨史 (붕당사)', '라면 파벌 실록');
lt = lt.replace('한국 라면 60년 맛의 파벌·분열·집권 실록 계보도', '한국 라면 60년 맛의 파벌·분열·집권 계보도');
lt = lt.replace('제1기: 건국과 시원 (開拓期)', '제1기: 최초의 탄생 (개척기)');
lt = lt.replace('제2·3기: 장국 혁신과 분파 (分黨期)', '제2·3기: 장국 혁신과 분파기');
lt = lt.replace('제4기: 백화제방 다양화 (百花齊放)', '제4기: 다양화 전성기');
lt = lt.replace('極辛派 · 극초매운 국물계 (5000~9413 SHU 도발)', '극초매운 국물파 (열라면 · 틈새라면 · 마열 · 더레드)');
lt = lt.replace('辛牛派 · 정통 얼큰 소고기계 (대한민국 라면의 절대 집권층)', '정통 얼큰 소고기파 (신라면 · 진라면 매운맛 · 안성탕면 · 육개장)');
lt = lt.replace('始原 · 骨湯 · 白湯 · 원조 백탕 / 진한 사골 / 하얀국물의 난', '원조 백탕 · 진한 사골파 · 하얀국물의 난 (삼양라면 · 사리곰탕 · 꼬꼬면)');
lt = lt.replace('海鮮派 · 해물 시원 · 정통 중화 짬뽕계 (바다의 감칠맛)', '시원한 해물 · 짬뽕파 (너구리 · 오징어짬뽕 · 진짬뽕)');
lt = lt.replace('炸醬 · 火魔 · 融合 · 춘장 짜장 / 불닭 화마 / 크림 퓨전계', '짜장 · 불닭 볶음 · 크림 퓨전파 (짜파게티 · 불닭볶음면 · 신라면 툼바)');
lt = lt.replace('冷排派 · 초고추장 냉비빔계 (사계절 비빔면의 대결)', '새콤달콤 냉비빔면파 (팔도비빔면 vs 배홍동)');

fs.writeFileSync('src/components/LineageTree.tsx', lt, 'utf8');

console.log('All Hanja converted to clean Korean Hangul!');
