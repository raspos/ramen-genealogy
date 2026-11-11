import type { RamenProduct } from '../../types/ramen';

export const HISTORICAL_PRODUCTS: RamenProduct[] = [
  {
    id: 'samyang-chicken-1963',
    name: '삼양라면 (1963년 초판)',
    manufacturer: '삼양식품',
    brand: '삼양라면',
    releaseYear: 1963,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'CHICKEN',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e58e26', text: '#ffffff', border: '#b71540' },
    imageUrl: '/images/products/samyang-chicken-1963.png',
    imageSource: '제조사 공식몰',
    imageStatus: 'VERIFIED_PHOTO',nutrition: { weightG: 100, caloriesKcal: 440, sodiumMg: 1650, carbsG: 68, proteinG: 9, fatG: 14, sodiumSeparated: false, soupSodiumRatioEstimated: 0.55 },
    spiciness: { scovilleShu: 0, scovilleProvenance: 'VERIFIED', capsaicinSoupMgPerKg: 0, capsaicinPreparedMgPerL: 0, capsaicinProvenance: 'VERIFIED', spicinessGrade: 0 },
    cooking: {
      waterMl: 550, cookTimeSec: 180, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml를 끓입니다.', '면과 닭육수 분말스프를 넣고 3분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['담백하고 구수한 닭육수', '초창기 일본 묘조식품 기술제휴 치킨 풍미', '은은한 후추'], savoryScore: 5, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'samyang-ramen', relation: 'ORIGIN', description: '대한민국 최초의 라면(10원). 우지 파동 이전 치킨 국물 기반 원조', year: 1963 }
    ],
    priceKrw: 10, officialDataSource: '삼양식품 역사관 및 1963년 신문광고 기록', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'lotte-ramen-1965',
    name: '롯데라면 (1965년)',
    manufacturer: '농심', // 롯데공업 시절
    brand: '롯데라면',
    releaseYear: 1965,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#c0392b', text: '#ffffff', border: '#962d22' },
    imageUrl: '/images/products/lotte-ramen-1965.svg',
    imageSource: '농심 역사관(구 롯데공업주식회사)',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 100, caloriesKcal: 450, sodiumMg: 1700, carbsG: 67, proteinG: 9, fatG: 15, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 500, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 210, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 면과 소고기스프를 넣고 3분 30초간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['소고기 육수 바탕', '형님 먼저 아우 먼저 마케팅의 모태', '구수한 간장 풍미'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'shin-ramyun', relation: 'ANCESTOR', description: '신춘호 회장이 롯데공업 설립 후 내놓은 첫 독자 라면', year: 1965 }
    ],
    priceKrw: 15, officialDataSource: '농심 사사 50년사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'binggrae-maeunkong',
    name: '매운콩라면 (빙그레)',
    manufacturer: '기타국내제조사', // 빙그레
    brand: '매운콩',
    releaseYear: 1998,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'VEGETABLE',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e67e22', text: '#ffffff', border: '#d35400' },
    imageUrl: '/images/products/binggrae-maeunkong.svg',
    imageSource: '빙그레 역사 아카이브 및 1998년 패키지',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 510, sodiumMg: 1780, carbsG: 77, proteinG: 11, fatG: 17, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 2800, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 콩기름 튀김면과 매운맛 스프를 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['100% 콩기름 유탕면의 독보적 고소함', '칼칼하고 깔끔한 뒷맛', '콩단백의 감칠맛'], savoryScore: 5, oilinessScore: 4, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'shin-ramyun', relation: 'DISCONTINUED', description: '소비자들의 재출시 청원이 가장 많은 빙그레 라면사업부의 명작', year: 1998 }
    ],
    priceKrw: 600, officialDataSource: '식품유통연감 및 빙그레 아카이브', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'nongshim-kkamanso',
    name: '까만소 (농심)',
    manufacturer: '농심',
    brand: '까만소',
    releaseYear: 1987,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#2c3e50', text: '#ffffff', border: '#1a252f' },
    imageUrl: '/images/products/nongshim-kkamanso.svg',
    imageSource: '농심 과거 출시 라면 데이터베이스',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 495, sodiumMg: 1820, carbsG: 78, proteinG: 10, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.6 },
    spiciness: { scovilleShu: 2100, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 진한 쇠고기 스프와 면을 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['검은 가마솥 쇠고기 진국', '구수한 된장과 소고기 조화', '묵직한 바디감'], savoryScore: 5, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'anseongtangmyeon', relation: 'CROSSOVER', description: '안성탕면과 함께 1980년대 탕류 라면 전성기를 이끈 소고기 진국 라면', year: 1987 }
    ],
    priceKrw: 200, officialDataSource: '농심 40년사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'nongshim-newmyeon',
    name: '뉴면 (농심)',
    manufacturer: '농심',
    brand: '뉴면',
    releaseYear: 1990,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'VEGETABLE',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#27ae60', text: '#ffffff', border: '#1e8449' },
    imageUrl: '/images/products/nongshim-newmyeon.svg',
    imageSource: '농심 역사 아카이브',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 480, sodiumMg: 1680, carbsG: 79, proteinG: 9, fatG: 14, sodiumSeparated: false, soupSodiumRatioEstimated: 0.55 },
    spiciness: { scovilleShu: 1500, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 표고버섯과 야채스프, 면을 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['국내 최초 MSG 무첨가 선언 라면', '표고버섯과 다시마 천연 감칠맛', '깔끔한 뒷맛'], savoryScore: 4, oilinessScore: 2, saltinessScore: 3, sweetnessScore: 1 },
    lineage: [
      { targetId: 'shin-non-frying', relation: 'ANCESTOR', description: '건강 지향형 라면의 효시. 천연 조미료 마케팅의 시작점', year: 1990 }
    ],
    priceKrw: 300, officialDataSource: '농심 홍보실 보도자료 1990', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'samyang-200-nyang',
    name: '삼양 200냥',
    manufacturer: '삼양식품',
    brand: '삼양라면',
    releaseYear: 1988,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e74c3c', text: '#ffffff', border: '#c0392b' },
    imageUrl: '/images/products/samyang-200-nyang.svg',
    imageSource: '삼양식품 60주년 기념관',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 110, caloriesKcal: 470, sodiumMg: 1750, carbsG: 72, proteinG: 9, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 1800, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 210, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 면과 쇠고기스프를 넣고 3분 30초간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['가성비 대명사 200원 라면', '진한 쇠고기 국물', '칼칼한 고춧가루'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'samyang-ramen', relation: 'SPINOFF', description: '서민 물가 안정을 위해 출시된 1980년대 후반의 국민 가성비 라면', year: 1988 }
    ],
    priceKrw: 200, officialDataSource: '삼양식품 아카이브', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'samyang-300-nyang',
    name: '삼양 300냥',
    manufacturer: '삼양식품',
    brand: '삼양라면',
    releaseYear: 1991,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'PORK',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#8e44ad', text: '#ffffff', border: '#71368a' },
    imageUrl: '/images/products/samyang-300-nyang.svg',
    imageSource: '삼양식품 아카이브',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 490, sodiumMg: 1780, carbsG: 76, proteinG: 10, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 2200, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 분말스프와 면을 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['푸짐한 건더기 스프', '얼큰한 돼지 등뼈 및 쇠고기 복합 육수'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'samyang-200-nyang', relation: 'SUCCESSOR', description: '200냥의 후속작으로 더 푸짐한 스프와 면발을 내세운 제품', year: 1991 }
    ],
    priceKrw: 300, officialDataSource: '삼양식품 공시자료', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'cheongbo-gobandong',
    name: '청보 곱배기라면 (1985년)',
    manufacturer: '기타국내제조사', // 청보식품
    brand: '곱배기라면',
    releaseYear: 1985,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#16a085', text: '#ffffff', border: '#117864' },
    imageUrl: '/images/products/cheongbo-gobandong.svg',
    imageSource: '청보식품(오뚜기 피인수) 사사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 150, caloriesKcal: 620, sodiumMg: 2100, carbsG: 95, proteinG: 13, fatG: 21, sodiumSeparated: false, soupSodiumRatioEstimated: 0.6 },
    spiciness: { scovilleShu: 1600, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 650, cookTimeSec: 270, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 650ml에 대용량 면과 스프를 넣고 4분 30초간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['150g 초대용량 면발', '구수한 소고기 국물'], savoryScore: 4, oilinessScore: 4, saltinessScore: 5, sweetnessScore: 1 },
    lineage: [
      { targetId: 'jin-ramen-spicy', relation: 'PREDECESSOR', description: '청보식품의 공격적 마케팅 대표작. 1987년 오뚜기가 청보식품을 인수하며 라면사업 진출', year: 1985 }
    ],
    priceKrw: 150, officialDataSource: '1985년 일간지 광고 및 오뚜기 50년사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'cheongbo-yeol-ramyun',
    name: '청보 열라면 (1985년)',
    manufacturer: '기타국내제조사',
    brand: '열라면',
    releaseYear: 1985,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#d35400', text: '#ffffff', border: '#a04000' },
    imageUrl: '/images/products/cheongbo-yeol-ramyun.svg',
    imageSource: '청보식품 역사 자료 및 오뚜기 아카이브',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 500, sodiumMg: 1850, carbsG: 78, proteinG: 10, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.6 },
    spiciness: { scovilleShu: 3000, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 면과 청보 열스프를 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['오뚜기 열라면의 원조', '강렬한 청양초 고춧가루 매운맛'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'yeol-ramyun', relation: 'ORIGIN', description: '1985년 청보식품이 출시한 매운라면의 원조. 오뚜기가 인수 후 1996년 오뚜기 열라면으로 재출시', year: 1985 }
    ],
    priceKrw: 120, officialDataSource: '오뚜기 사사 및 상표등록 기록', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'ottogi-ramencham',
    name: '라면참 (오뚜기)',
    manufacturer: '오뚜기',
    brand: '라면참',
    releaseYear: 1993,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'PORK',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#f39c12', text: '#2c3e50', border: '#d68910' },
    imageUrl: '/images/products/ottogi-ramencham.svg',
    imageSource: '오뚜기 제품 역사관',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 495, sodiumMg: 1750, carbsG: 77, proteinG: 10, fatG: 15, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 1400, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 분말스프와 면을 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['참깨와 돈골 육수의 진한 고소함', '순하고 편안한 국물 맛'], savoryScore: 4, oilinessScore: 3, saltinessScore: 3, sweetnessScore: 1 },
    lineage: [
      { targetId: 'chamkkae', relation: 'ANCESTOR', description: '참깨라면의 계보로 이어지는 오뚜기의 고소한 국물라면 초기작', year: 1993 }
    ],
    priceKrw: 350, officialDataSource: '오뚜기 30년사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'binggrae-chosun-ramen',
    name: '조선라면 (빙그레)',
    manufacturer: '기타국내제조사',
    brand: '조선라면',
    releaseYear: 1993,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#8b4513', text: '#ffffff', border: '#5c2c16' },
    imageUrl: '/images/products/binggrae-chosun-ramen.svg',
    imageSource: '빙그레 역사 아카이브',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 505, sodiumMg: 1800, carbsG: 78, proteinG: 10, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 1900, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 면과 스프를 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['전통 조선 장국 풍미', '구수한 소고기 국물과 마늘 풍미'], savoryScore: 5, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'shin-ramyun', relation: 'RIVAL', description: '조선의 얼큰한 장국 맛을 표방해 신라면과 경쟁했던 빙그레 주력 라면', year: 1993 }
    ],
    priceKrw: 400, officialDataSource: '1993년 일간스포츠 라면시장 기사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'samyang-gold',
    name: '삼양라면 골드',
    manufacturer: '삼양식품',
    brand: '삼양라면',
    releaseYear: 1982,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'SEAFOOD',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#f1c40f', text: '#2c3e50', border: '#d4ac0d' },
    imageUrl: '/images/products/samyang-gold.png',
    imageSource: '제조사 공식몰',
    imageStatus: 'VERIFIED_PHOTO',nutrition: { weightG: 120, caloriesKcal: 490, sodiumMg: 1760, carbsG: 76, proteinG: 9, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 1500, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 210, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 해물 스프와 면을 넣고 3분 30초간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['원조 햄 풍미에 오징어 감칠맛을 더한 골드 레시피', '진하고 구수한 뒷맛'], savoryScore: 5, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'samyang-ramen', relation: 'SPINOFF', description: '1980년대 선풍적 인기를 끌며 골드 열풍을 일으켰던 삼양의 프리미엄 라인', year: 1982 }
    ],
    priceKrw: 150, officialDataSource: '삼양식품 역사관', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'nongshim-v2',
    name: 'V2 라면 (농심)',
    manufacturer: '농심',
    brand: 'V2',
    releaseYear: 1989,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e74c3c', text: '#ffffff', border: '#922b21' },
    imageUrl: '/images/products/nongshim-v2.svg',
    imageSource: '농심 사사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 115, caloriesKcal: 485, sodiumMg: 1770, carbsG: 75, proteinG: 9, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 2400, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 분말스프와 면을 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['승리를 상징하는 V2 네이밍', '매콤한 소고기 국물과 쫄깃한 면'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'shin-ramyun', relation: 'SPINOFF', description: '신라면 출시 후 다양한 매운맛 세그먼트를 실험하던 농심의 과도기 명작', year: 1989 }
    ],
    priceKrw: 250, officialDataSource: '농심 40년사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'samyang-chocheop-1960s',
    name: '삼양 초첩면 (1960년대)',
    manufacturer: '삼양식품',
    brand: '삼양라면',
    releaseYear: 1968,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#34495e', text: '#ffffff', border: '#1c2833' },
    imageUrl: '/images/products/samyang-chocheop-1960s.svg',
    imageSource: '삼양식품 60년사 사사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 100, caloriesKcal: 440, sodiumMg: 1600, carbsG: 68, proteinG: 8, fatG: 14, sodiumSeparated: false, soupSodiumRatioEstimated: 0.55 },
    spiciness: { scovilleShu: 200, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 0 },
    cooking: {
      waterMl: 550, cookTimeSec: 180, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 면과 스프를 넣고 3분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['쇠고기 장국 베이스', '한국인 입맛에 맞춘 최초의 육류 국물 배합'], savoryScore: 4, oilinessScore: 3, saltinessScore: 3, sweetnessScore: 1 },
    lineage: [
      { targetId: 'samyang-chicken-1963', relation: 'SUCCESSOR', description: '닭고기 육수에서 한국형 쇠고기 육수로 전환하는 계기가 된 역사적 제품', year: 1968 }
    ],
    priceKrw: 15, officialDataSource: '삼양식품 역사관', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'ottogi-wangramen',
    name: '오뚜기 왕라면 (1990년대)',
    manufacturer: '오뚜기',
    brand: '왕라면',
    releaseYear: 1994,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e74c3c', text: '#ffffff', border: '#b03a2e' },
    imageUrl: '/images/products/ottogi-wangramen.svg',
    imageSource: '오뚜기 사사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 135, caloriesKcal: 560, sodiumMg: 1880, carbsG: 86, proteinG: 11, fatG: 18, sodiumSeparated: false, soupSodiumRatioEstimated: 0.6 },
    spiciness: { scovilleShu: 2200, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 600, cookTimeSec: 270, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 600ml에 대용량 면과 스프를 넣고 4분 30초간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['135g 대용량 면발', '얼큰한 소고기 장국 육수'], savoryScore: 4, oilinessScore: 4, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'jin-ramen-spicy', relation: 'SPINOFF', description: '진라면의 인기를 바탕으로 양을 늘려 출시한 1990년대 대용량 기획 제품', year: 1994 }
    ],
    priceKrw: 450, officialDataSource: '오뚜기 제품 기록', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'samyang-samgukji',
    name: '삼국지 라면 (삼양)',
    manufacturer: '삼양식품',
    brand: '삼국지',
    releaseYear: 1992,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#d35400', text: '#ffffff', border: '#ba4a00' },
    imageUrl: '/images/products/samyang-samgukji.svg',
    imageSource: '삼양식품 60년사 사사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 490, sodiumMg: 1790, carbsG: 77, proteinG: 9, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 2300, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 면과 스프를 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['삼국지 영웅 캐릭터 마케팅', '칼칼하고 얼큰한 사골 소고기 육수'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'samyang-ramen', relation: 'SPINOFF', description: '우지 파동 극복기 대중의 관심을 끌기 위해 캐릭터 마케팅을 펼친 제품', year: 1992 }
    ],
    priceKrw: 300, officialDataSource: '삼양식품 아카이브', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'nongshim-matirang',
    name: '맛이랑 (농심)',
    manufacturer: '농심',
    brand: '맛이랑',
    releaseYear: 1984,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e67e22', text: '#ffffff', border: '#b9770e' },
    imageUrl: '/images/products/nongshim-matirang.svg',
    imageSource: '농심 40년사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 110, caloriesKcal: 460, sodiumMg: 1720, carbsG: 73, proteinG: 9, fatG: 15, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 1400, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 550, cookTimeSec: 210, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 분말스프와 면을 넣고 3분 30초간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['100원의 행복', '구수하고 달큰한 소고기 국물'], savoryScore: 4, oilinessScore: 3, saltinessScore: 3, sweetnessScore: 1 },
    lineage: [
      { targetId: 'anseongtangmyeon', relation: 'PREDECESSOR', description: '안성탕면 직전 출시되어 대중적 탕국물 라면의 기틀을 마련한 제품', year: 1984 }
    ],
    priceKrw: 100, officialDataSource: '농심 40년사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'paldo-yukgaejang-1980s',
    name: '팔도 육개장 (1980년대)',
    manufacturer: '팔도',
    brand: '팔도육개장',
    releaseYear: 1986,
    productType: 'SOUP',
    packageType: 'BOWL',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'THIN',
    isActive: false,
    packagingThemeColor: { bg: '#c0392b', text: '#ffffff', border: '#922b21' },
    imageUrl: '/images/products/paldo-yukgaejang-1980s.svg',
    imageSource: '한국야쿠르트(팔도) 유통사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 86, caloriesKcal: 380, sodiumMg: 1590, carbsG: 54, proteinG: 7, fatG: 14, sodiumSeparated: false, soupSodiumRatioEstimated: 0.6 },
    spiciness: { scovilleShu: 1500, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 1 },
    cooking: {
      waterMl: 370, cookTimeSec: 180, isDrainWater: false, soupAdditionTiming: 'BEFORE_BOIL',
      steps: ['뚜껑을 반쯤 열고 분말스프를 넣은 뒤 끓는 물(370ml)을 표시선까지 붓고 3분간 기다립니다.']
    },
    flavorProfile: { primaryFlavors: ['얇은 면발', '칼칼하고 친숙한 사발 육개장 국물'], savoryScore: 4, oilinessScore: 3, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'paldo-doshirak', relation: 'CROSSOVER', description: '도시락과 함께 팔도의 사발/용기면 시장 개척을 이끈 제품', year: 1986 }
    ],
    priceKrw: 200, officialDataSource: '팔도 사사', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'samyang-kimchi-1980s',
    name: '삼양 김치라면 (1980년대)',
    manufacturer: '삼양식품',
    brand: '김치라면',
    releaseYear: 1986,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'KIMCHI',
    noodleType: 'STANDARD',
    isActive: false,
    packagingThemeColor: { bg: '#e74c3c', text: '#ffffff', border: '#b03a2e' },
    imageUrl: '/images/products/samyang-kimchi-1980s.svg',
    imageSource: '삼양식품 60년사 사사',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 120, caloriesKcal: 490, sodiumMg: 1820, carbsG: 77, proteinG: 9, fatG: 16, sodiumSeparated: false, soupSodiumRatioEstimated: 0.6 },
    spiciness: { scovilleShu: 2100, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 240, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 건조 김치 블록과 분말스프, 면을 넣고 4분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['국내 최초의 본격 김치라면', '시원하고 개운한 김치 찌개 국물'], savoryScore: 4, oilinessScore: 2, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'kimchi-sabal', relation: 'ORIGIN', description: '1986 아시안게임과 1988 서울올림픽을 앞두고 한국 전통 김치를 라면에 접목한 효시', year: 1986 }
    ],
    priceKrw: 200, officialDataSource: '삼양식품 아카이브', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  },
  {
    id: 'binggrae-yeolguksu',
    name: '열국수 (빙그레)',
    manufacturer: '기타국내제조사',
    brand: '열국수',
    releaseYear: 1990,
    productType: 'SOUP',
    packageType: 'BAG',
    salesChannel: 'DISCONTINUED',
    isPB: false,
    brothType: 'BEEF',
    noodleType: 'THIN',
    isActive: false,
    packagingThemeColor: { bg: '#c0392b', text: '#ffffff', border: '#78281f' },
    imageUrl: '/images/products/binggrae-yeolguksu.svg',
    imageSource: '빙그레 역사 아카이브',
    imageStatus: 'VERIFIED_PHOTO',
    nutrition: { weightG: 110, caloriesKcal: 450, sodiumMg: 1750, carbsG: 73, proteinG: 9, fatG: 14, sodiumSeparated: false, soupSodiumRatioEstimated: 0.58 },
    spiciness: { scovilleShu: 3100, scovilleProvenance: 'ESTIMATED', capsaicinSoupMgPerKg: null, capsaicinPreparedMgPerL: null, capsaicinProvenance: 'MISSING', spicinessGrade: 2 },
    cooking: {
      waterMl: 550, cookTimeSec: 180, isDrainWater: false, soupAdditionTiming: 'WITH_NOODLE',
      steps: ['물 550ml에 얇은 면과 매운 고춧가루 스프를 넣고 3분간 끓입니다.']
    },
    flavorProfile: { primaryFlavors: ['소면처럼 가는 국수형 면발', '목을 찌르는 칼칼하고 화끈한 매운맛'], savoryScore: 4, oilinessScore: 2, saltinessScore: 4, sweetnessScore: 1 },
    lineage: [
      { targetId: 'yeol-ramyun', relation: 'RIVAL', description: '소면 형태의 얇은 면발에 극한의 매운맛을 결합했던 1990년대 초 이색 매운면', year: 1990 }
    ],
    priceKrw: 300, officialDataSource: '1990년 광고 아카이브', verifiedDate: '2026-11-10', dataPipelineStatus: 'PUBLISHED'
  }
];
