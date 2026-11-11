import { getAssetUrl } from '../utils/imageUrl';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from './ramenDataset';

/**
 * 라면 계보 관계의 4대 역사적 범주
 * 1. DIRECT_LINEAGE: 정통 직계 계승 (실제 시리즈·브랜드·제품의 직접적 후속작)
 * 2. FACTION_SPLIT: 계열 분화 (기존 조리법이나 맛의 흐름에서 새로운 계열이 갈라져 나온 관계)
 * 3. MARKET_RIVALRY: 숙명의 시장 경쟁 (동일한 시장 패권을 놓고 정면으로 충돌한 라이벌)
 * 4. PARADIGM_SHIFT: 사조 전환 / 시대적 반란 (시장의 주류 맛이나 소비 형태를 근본적으로 뒤바꾼 사건)
 */
export type HistoricalRelationType =
  | 'DIRECT_LINEAGE'
  | 'FACTION_SPLIT'
  | 'MARKET_RIVALRY'
  | 'PARADIGM_SHIFT';

export interface HistoricalEpoch {
  id: string;
  name: string;
  hanja: string;
  period: string;
  yearStart: number;
  yearEnd: number;
  headline: string;
  narrative: string;
}

export interface HistoricalEventMilestone {
  id: string;
  year: number;
  dateStr?: string;
  epochId: string;
  title: string;
  hanjaTitle?: string;
  summary: string;
  impactFactionId: string;
  keyProducts: string[];
  // 데이터저널리즘 상세 서사 필드 (모달 및 드로어 인터랙션용)
  marketContext: string;              // 당시 라면 시장 상황
  innovationFeatures: string;         // 새롭게 등장한 제품과 특징
  distinctionFromMainstream: string;  // 기존 주류와 무엇이 달랐는지
  marketLegacy: string;               // 이후 시장에 남긴 역사적 영향
  sources: string[];                  // 공신력 있는 사사 및 언론 기록 근거
}

export interface LineageLegendNode {
  id: string;
  name: string;
  brand: string;
  manufacturer: string;
  releaseYear: number;
  epochId: string;
  factionId: string;
  factionName: string;
  hanjaFaction: string;
  packageType: 'BAG' | 'CUP' | 'BOWL';
  imageUrl: string;
  isVintagePhoto: boolean;
  vintageYearNote?: string;
  historicalRole: string; // 계보상의 역사적 역할
  doctrineQuote: string;  // 한 줄 사상/교리
  editorialNote: string;  // 데이터저널리즘 역사 서사
  // 가상 SVG 캔버스 레이아웃 좌표 (1850 x 1080)
  canvasX: number;
  canvasY: number;
}

export interface LineageEdge {
  id: string;
  fromId: string;
  toId: string;
  relationType: HistoricalRelationType;
  label: string;
  year: number;
  narrative: string;
  factionColor: string;
}

export interface FactionChronicle {
  id: string;
  name: string;
  hanja: string;
  themeColor: {
    primary: string;
    bg: string;
    text: string;
    border: string;
  };
  riseDecade: string;
  hegemonyStatus: 'RULING' | 'MAINSTREAM' | 'HISTORIC_ORIGIN' | 'EXPEDITIONARY' | 'COEXISTING';
  summary: string;
  doctrine: string;
  chronicleStory: string[];
  flagshipIds: string[];
}

// ================= 1. 6대 역사적 시대 (Epochs) =================
export const HISTORICAL_EPOCHS: HistoricalEpoch[] = [
  {
    id: 'epoch-1',
    name: '제1기: 건국과 원조의 태동',
    hanja: '원조 개척기',
    period: '1963 ~ 1979',
    yearStart: 1963,
    yearEnd: 1979,
    headline: '10원짜리 구휼 라면에서 한국인의 소고기 장국으로',
    narrative: '1963년 9월 15일 삼양라면이 10원에 첫선을 보이며 한국 라면 역사가 시작되었다. 닭육수 백탕으로 출발했으나 1970년 삼양 쇠고기면과 롯데짜장면이 등장하며 국물과 비국물의 첫 갈래가 열렸다.'
  },
  {
    id: 'epoch-2',
    name: '제2기: 탕과 건의 대분화',
    hanja: '장국·비국물 대폭발',
    period: '1980 ~ 1985',
    yearStart: 1980,
    yearEnd: 1985,
    headline: '너구리·안성탕면·짜파게티·팔도비빔면의 잇따른 출현',
    narrative: '1982년 너구리(해물우동)와 육개장 사발면(용기면), 1983년 안성탕면(된장 장국), 1984년 짜파게티와 팔도비빔면이 쏟아져 나오며 현대 한국 라면의 기본 지형도가 완성되었다.'
  },
  {
    id: 'epoch-3',
    name: '제3기: 얼큰 소고기탕의 천하통일',
    hanja: '신라면 절대집권기',
    period: '1986 ~ 2008',
    yearStart: 1986,
    yearEnd: 2008,
    headline: '신라면의 독점적 1위 집권과 오뚜기 진라면의 영구적 맞수 형성',
    narrative: '1986년 신라면의 등장은 얼큰한 소고기 표고버섯 국물을 대한민국 라면의 절대 표준으로 굳혔다. 1988년 오뚜기 진라면 매운맛이 출현해 40년에 걸친 양강 라이벌전을 형성했다.'
  },
  {
    id: 'epoch-4',
    name: '제4기: 하얀 국물의 난',
    hanja: '백탕 반란기',
    period: '2009 ~ 2011',
    yearStart: 2009,
    yearEnd: 2011,
    headline: '꼬꼬면과 나가사끼짬뽕의 기습, 30년 빨간 국물 독점을 뒤흔들다',
    narrative: '2011년 닭육수와 청양고추로 무장한 꼬꼬면과 나가사끼 짬뽕이 폭발적인 신드롬을 일으켰다. 비록 1년여 만에 가라앉았으나 라면사에 가장 강렬한 지각변동을 기록했다.'
  },
  {
    id: 'epoch-5',
    name: '제5기: 불닭 화마와 프리미엄 대전',
    hanja: '불닭 혁명기',
    period: '2012 ~ 2016',
    yearStart: 2012,
    yearEnd: 2016,
    headline: '불닭볶음면의 K-라면 세계화와 불맛 프리미엄 짬뽕·짜장 대전',
    narrative: '2012년 불닭볶음면의 출현은 비국물 볶음면을 전 세계적 문화 현상으로 끌어올렸다. 2015년 오뚜기 진짬뽕과 진짜장이 일으킨 프리미엄 불맛 대전은 중화풍 라면의 위상을 격상시켰다.'
  },
  {
    id: 'epoch-6',
    name: '제6기: 크림 퓨전과 백가쟁명',
    hanja: '퓨전 르네상스기',
    period: '2017 ~ 2026',
    yearStart: 2017,
    yearEnd: 2026,
    headline: '까르보불닭과 신라면 툼바의 대세화, 비빔면 패권 경쟁',
    narrative: '매운맛에 생크림과 치즈를 결합한 까르보불닭과 신라면 툼바가 모디슈머에서 정식 메이저로 등극했다. 배홍동의 비빔면 도전과 신라면 더 레드의 극한 정통파 강화까지 다원주의 시대가 열렸다.'
  }
];

// ================= 2. 역사적 분기점 (Milestones) 9대 사건 =================
export const HISTORICAL_MILESTONES: HistoricalEventMilestone[] = [
  {
    id: 'ms-1963',
    year: 1963,
    epochId: 'epoch-1',
    title: '1963년: 라면 왕국의 탄생',
    hanjaTitle: '원조 라면 탄생',
    summary: '전중윤 삼양식품 창업주가 남대문시장 꿀꿀이죽을 보고 충격을 받아 일본 묘조식품 기술을 도입, 10원짜리 삼양라면 출시.',
    impactFactionId: 'root-chicken',
    keyProducts: ['samyang-chicken-1963'],
    marketContext: '한국전쟁 전후 극심한 식량난으로 미군 부대 잔반을 끓인 꿀꿀이죽(5원)이 서민의 주식이었으며 정부는 혼분식 장려 운동을 전개하던 시기.',
    innovationFeatures: '기름에 튀긴 건조 면발에 치킨 육수 분말스프를 별첨해 끓는 물에 3분이면 한 끼 식사가 완성되는 획기적인 즉석 가공식품.',
    distinctionFromMainstream: '기존의 전분 국수나 밀가루 수제비와 달리 장기 보관이 가능하고 열량이 높아 영양 보급원 역할을 수행함.',
    marketLegacy: '대한민국 인스턴트 라면의 뿌리가 되었으며 이후 60년간 세계 1위 1인당 라면 소비국으로 도약하는 역사적 초석 마련.',
    sources: ['삼양식품 60년사(2021)', '경향신문 1963년 9월 15일자 신제품 광고']
  },
  {
    id: 'ms-1970-beef',
    year: 1970,
    epochId: 'epoch-1',
    title: '1970년: 소고기 국물의 부상',
    hanjaTitle: '소고기 장국 개척',
    summary: '닭육수 위주의 담백한 백탕에서 벗어나 한국인 전통의 진한 쇠고기 양지 육수와 고춧가루를 접목한 ‘삼양 쇠고기면’ 출시.',
    impactFactionId: 'spicy-beef',
    keyProducts: ['samyang-beef-1970'],
    marketContext: '일본식 치킨 라면의 맛에 서서히 싫증을 느낀 한국 소비자들이 된장국과 소고기 장국처럼 묵직하고 얼큰한 국물을 요구하기 시작함.',
    innovationFeatures: '소고기 추출물과 간장·마늘 베이스의 분말스프를 채택해 탕국에 익숙한 토종 입맛에 맞춤형으로 개발.',
    distinctionFromMainstream: '기존의 맑은 닭육수 백탕 일변도를 깨뜨리고 소고기 육수 중심의 붉은 국물 시대를 연 최초의 분기점.',
    marketLegacy: '이후 1980년대 안성탕면(장국)과 신라면(얼큰소고기탕)으로 이어지는 한국 라면 주류 계보의 실질적인 모태가 됨.',
    sources: ['삼양식품 사사', '한국식품사학회지 라면 변천사 연구']
  },
  {
    id: 'ms-1970-jjajang',
    year: 1970,
    epochId: 'epoch-1',
    title: '1970년: 비국물 라면의 태동',
    hanjaTitle: '인스턴트 짜장 효시',
    summary: '롯데공업(현 농심)이 물을 버리고 춘장 소스에 비벼 먹는 대한민국 최초의 비국물 라면 ‘롯데짜장면’ 출시.',
    impactFactionId: 'jjajang-chunjang',
    keyProducts: ['lotte-jjajang-1970'],
    marketContext: '중국집에서 졸업식이나 특별한 날에만 먹을 수 있었던 고급 외식 메뉴인 짜장면을 가정에서 간편하게 즐기려는 대중적 열망.',
    innovationFeatures: '면을 끓인 후 국물을 따라내고 농축 춘장 분말과 유성스프를 비벼내는 새로운 조리법을 최초로 도입.',
    distinctionFromMainstream: '“라면은 국물 요리”라는 7년간의 고정관념을 깨고 비국물(건면) 조리 방식을 인스턴트 라면 시장에 최초로 개척.',
    marketLegacy: '이 기술적 노하우와 소비자 경험은 1984년 과립스프 혁신을 이룬 ‘짜파게티’로 직계 계승되어 국민 브랜드 탄생의 모태가 됨.',
    sources: ['농심 50년사 (신춘호 회장 회고록)', '1970년 동아일보 롯데짜장면 출시 보도']
  },
  {
    id: 'ms-1980s',
    year: 1983,
    epochId: 'epoch-2',
    title: '1980년대: 얼큰 국물의 집권',
    hanjaTitle: '소고기 얼큰탕 천하통일',
    summary: '안성스프공장 준공 후 안성탕면(1983)과 신라면(1986)이 연이어 터지며 한국인의 표준 입맛이 매운 소고기탕으로 천하통일됨.',
    impactFactionId: 'spicy-beef',
    keyProducts: ['anseongtangmyeon', 'shin-ramyun'],
    marketContext: '1986 서울아시안게임과 1988 서울올림픽을 앞두고 한국을 대표할 강렬한 토종 매운맛 브랜드 개발 경쟁이 치열했음.',
    innovationFeatures: '안성탕면의 구수한 시골 장국 맛과 신라면의 스위스 진공동결건조 공법 표고버섯·얼큰 소고기 육수 조합.',
    distinctionFromMainstream: '기존의 밋밋한 쇠고기 국물을 넘어 땀방울이 맺히는 칼칼함과 감칠맛의 황금비를 완성함.',
    marketLegacy: '신라면은 1991년 이후 30년 넘게 시장 점유율 1위를 수성하며 K-푸드의 대표 간판으로 군림.',
    sources: ['농심 홍보실 역사자료', '한국갤럽 한국인이 가장 좋아하는 라면 조사']
  },
  {
    id: 'ms-1984',
    year: 1984,
    epochId: 'epoch-2',
    title: '1984년: 비국물 세력의 성장',
    hanjaTitle: '비국물 양대산맥 성립',
    summary: '짜장라면의 제왕 ‘짜파게티’와 찬물에 헹궈 비비는 ‘팔도비빔면’이 같은 해 출시되며 비국물 시장이 독립 세력으로 안착.',
    impactFactionId: 'jjajang-chunjang',
    keyProducts: ['chapagetti', 'paldo-bibim'],
    marketContext: '경제 성장에 따른 식문화 다양화로 간식이나 별식으로 즐기는 새로운 스타일의 면 요리에 대한 수요 급증.',
    innovationFeatures: '짜파게티는 뭉침 없는 스프 과립 공법을 적용했고, 팔도비빔면은 사과 과즙을 함유한 매콤달콤 액상스프와 냉수 헹굼 조리법 확립.',
    distinctionFromMainstream: '뜨거운 국물 대신 비벼 먹는 독자적 식감을 제공하며 계절과 조리법에 따른 차별화 성공.',
    marketLegacy: '짜장라면과 비빔면이라는 독자적인 2대 비국물 장르를 영구적으로 구축함.',
    sources: ['농심·팔도 공식 브랜드 연혁', '식품유통연감 1985년판']
  },
  {
    id: 'ms-2011',
    year: 2011,
    epochId: 'epoch-4',
    title: '2011년: 하얀 국물의 난',
    hanjaTitle: '하얀국물 반란기',
    summary: '개그맨 이경규의 방송 레시피로 탄생한 ‘꼬꼬면’과 삼양 ‘나가사끼 짬뽕’이 폭발적 돌풍을 일으키며 빨간 국물 독점에 반란을 일으킴.',
    impactFactionId: 'white-broth-rebel',
    keyProducts: ['kkokko-myeon', 'nagasaki-jjamppong'],
    marketContext: '25년간 이어진 붉은 소고기 국물 일색의 시장에 소비자들이 권태를 느끼던 시기, 예능 프로그램 ‘남자의 자격’ 라면 요리대회가 기폭제 역할.',
    innovationFeatures: '맑은 닭육수와 돈골 백탕에 칼칼한 청양고추를 넣어 "색은 하얗지만 맛은 알싸하게 매운" 충격적 반전 매력.',
    distinctionFromMainstream: '고춧가루 붉은색이 없어도 충분히 칼칼할 수 있음을 증명하며 출시 5개월 만에 1억 개 판매 돌파.',
    marketLegacy: '소비재 역사상 가장 짧고 굵었던 신드롬. 비록 1년여 만에 붉은 국물의 반격으로 진압되었으나 시장의 고정관념을 완전히 파괴함.',
    sources: ['KBS 남자의 자격(2011)', 'AC닐슨 2011~2012 라면 시장 점유율 리포트']
  },
  {
    id: 'ms-2012',
    year: 2012,
    epochId: 'epoch-5',
    title: '2012년: 불닭의 등장과 K-라면 세계화',
    hanjaTitle: '불닭 화마 강림',
    summary: '삼양식품 김정수 부회장이 명동 매운 찜닭 골목에서 착안해 스코빌 4,404SHU의 극강 매운 볶음면 ‘불닭볶음면’ 출시.',
    impactFactionId: 'fire-bokkeum',
    keyProducts: ['buldak', 'carbo-buldak'],
    marketContext: '하얀 국물 열풍이 꺼진 후 삼양식품의 위기 극복을 위한 비장의 무기로, 국물 라면의 틀을 벗어난 매운맛 챌린지 타깃.',
    innovationFeatures: '하바네로 고추와 닭고기 풍미를 응축한 액상 볶음 소스로 입안이 얼얼한 중독적 매운맛 구현.',
    distinctionFromMainstream: '한국인조차 쉽게 다 먹기 힘든 극한의 매운맛을 정면 돌파해 유튜브 ‘Fire Noodle Challenge’ 바이럴의 주역이 됨.',
    marketLegacy: '국내용 라면을 넘어 전 세계 100여 개국에서 조 단위 매출을 올리는 글로벌 메가 IP로 성장, K-라면 수출 신기록을 견인함.',
    sources: ['삼양식품 공시자료', '월스트리트저널(WSJ) 불닭볶음면 글로벌 신드롬 보도']
  },
  {
    id: 'ms-2015',
    year: 2015,
    epochId: 'epoch-5',
    title: '2015년: 프리미엄 짬뽕 대전',
    hanjaTitle: '프리미엄 짬뽕 대전',
    summary: '오뚜기 진짬뽕이 3mm 극후면과 불맛 유성스프로 돌풍을 일으키며 1,500원대 프리미엄 짬뽕 라면 전쟁을 촉발.',
    impactFactionId: 'seafood-ocean',
    keyProducts: ['jin-jjamppong', 'jin-jjajang'],
    marketContext: '1,000원 미만 가성비 중심이던 라면 시장에 고급 외식 중화요리의 풍미를 그대로 재현하려는 프리미엄화 경쟁 대두.',
    innovationFeatures: '기존 분말스프 대신 액상 짬뽕 농축액과 유화공법의 조미유를 적용해 중화 팬의 웍(Wok) 불맛을 완벽하게 재현.',
    distinctionFromMainstream: '일반 둥근 면이 아닌 태면(굵은 칼국수형 면발)을 채택해 쫄깃한 식감과 국물 흡착력을 획기적으로 향상시킴.',
    marketLegacy: '출시 50여 일 만에 1,000만 봉지를 돌파하며 라면 가격 저항선을 무너뜨리고 짬뽕 라면을 메이저 카테고리로 승격시킴.',
    sources: ['오뚜기 50년사', '조선일보 2015년 라면업계 짬뽕 대전 분석 기사']
  },
  {
    id: 'ms-2020s',
    year: 2020,
    epochId: 'epoch-6',
    title: '2020년대: 퓨전 라면의 백가쟁명',
    hanjaTitle: '퓨전 백가쟁명기',
    summary: '까르보불닭의 전 세계적 흥행에 이어 모디슈머 레시피를 정식 출시한 ‘신라면 툼바’까지, 크림·로제 퓨전이 시장의 중심으로 등극.',
    impactFactionId: 'cream-fusion',
    keyProducts: ['carbo-buldak', 'shin-toomba', 'baehongdong', 'shin-the-red'],
    marketContext: 'SNS와 틱톡 중심의 꿀조합(모디슈머) 레시피 확산과 Z세대의 맵단·크림 선호 현상이 결합된 식문화 트렌드.',
    innovationFeatures: '전통적인 칼칼한 고춧가루 국물에 부드러운 우유·생크림·파마산 치즈 분말을 결합해 자극적인 맛을 부드럽게 감싸안음.',
    distinctionFromMainstream: '전통 탕류 라면의 보수성을 벗어나 파스타와 라면의 경계를 허무는 퓨전 장르의 공식 브랜드화.',
    marketLegacy: '라면이 서민의 구휼 국물 요리에서 전 세계 젊은 층이 즐기는 트렌디한 글로벌 미식 플랫폼으로 진화했음을 상징.',
    sources: ['농심 신라면 툼바 보도자료(2024)', '삼양식품 해외 수출 실적 보고서']
  }
];

// ================= 3. 23대 기수 대표 라면 (Nodes) =================
// 캔버스 좌표 (Canvas 1850 x 1080): 수학적 충돌 검증 완료 (겹침 0건)
// X축: 시간의 흐름 (1963 -> 2024), Y축: 맛의 파벌 레인 (얼큰탕 상단, 해물/백탕 중단, 비국물/퓨전 하단)
const RAW_LINEAGE_LEGEND_NODES: LineageLegendNode[] = [
  // --- 1963 단일 뿌리 (X: 70) ---
  {
    id: 'samyang-chicken-1963',
    name: '삼양라면 (1963)',
    brand: '삼양라면',
    manufacturer: '삼양식품',
    releaseYear: 1963,
    epochId: 'epoch-1',
    factionId: 'root-chicken',
    factionName: '원조 닭고기 백탕계',
    hanjaFaction: '원조 백탕파',
    packageType: 'BAG',
    imageUrl: '/images/products/samyang-1963-original-10won.png',
    isVintagePhoto: true,
    vintageYearNote: '1963년 10원 출시 당시 실물 봉지',
    historicalRole: '원조 시작',
    doctrineQuote: '“배고픈 국민의 식생활을 해결하는 10원의 즉석 영양식”',
    editorialNote: '한국 최초의 라면. 일본 명성식품에서 전수받은 닭고기 육수 베이스로 출발해 우지(소기름) 튀김면으로 서민의 굶주림을 달랜 대한민국 라면의 단일 뿌리다.',
    canvasX: 70,
    canvasY: 340
  },

  // --- 1970 대분기: 소고기 국물 & 최초의 짜장 (X: 270) ---
  {
    id: 'samyang-beef-1970',
    name: '삼양 쇠고기면',
    brand: '삼양라면',
    manufacturer: '삼양식품',
    releaseYear: 1970,
    epochId: 'epoch-1',
    factionId: 'spicy-beef',
    factionName: '소고기 장국 개척계',
    hanjaFaction: '소고기 장국파',
    packageType: 'BAG',
    imageUrl: '/images/products/samyang-beef-1970.svg',
    isVintagePhoto: true,
    vintageYearNote: '1970년 소고기 국물 라면의 시초',
    historicalRole: '소고기탕 개척',
    doctrineQuote: '“닭육수에서 토종 쇠고기 장국으로, 한국인 맞춤형 진국의 시작”',
    editorialNote: '1970년 출시. 맑고 담백하던 치킨 육수에서 탈피해 한국인이 가장 선호하는 쇠고기 육개장·장국 맛을 최초로 라면에 구현하여 훗날 탕류 라면의 기틀을 닦았다.',
    canvasX: 270,
    canvasY: 170
  },
  {
    id: 'lotte-jjajang-1970',
    name: '롯데짜장면',
    brand: '롯데짜장면',
    manufacturer: '농심', // 롯데공업
    releaseYear: 1970,
    epochId: 'epoch-1',
    factionId: 'jjajang-chunjang',
    factionName: '인스턴트 짜장 시초계',
    hanjaFaction: '정통 춘장 짜장파',
    packageType: 'BAG',
    imageUrl: '/images/products/lotte-jjajang-1970.svg',
    isVintagePhoto: true,
    vintageYearNote: '1970년 한국 최초 인스턴트 짜장면',
    historicalRole: '비국물 시초',
    doctrineQuote: '“국물을 따라내고 비벼먹는 대한민국 최초의 인스턴트 짜장면”',
    editorialNote: '1970년 롯데공업(현 농심)이 내놓은 국내 최초의 비국물 라면. 고급 외식이던 짜장면을 대중화했으며 1984년 짜파게티로 직계 계승되는 역사적 첫걸음이다.',
    canvasX: 270,
    canvasY: 720
  },

  // --- 1982 ~ 1984 폭발기 (X: 500 ~ 690) ---
  {
    id: 'yukgaejang-sabal',
    name: '육개장 사발면',
    brand: '육개장',
    manufacturer: '농심',
    releaseYear: 1982,
    epochId: 'epoch-2',
    factionId: 'spicy-beef',
    factionName: '사발 용기면 얼큰계',
    hanjaFaction: '정통 얼큰 소고기파',
    packageType: 'BOWL',
    imageUrl: '/images/products/yukgaejang-sabal.jpg',
    isVintagePhoto: false,
    historicalRole: '용기면 평정',
    doctrineQuote: '“한국인의 입맛에 가장 친숙한 가볍고 칼칼한 육개장 한 그릇”',
    editorialNote: '1982년 11월 출시. 얇고 꼬들꼬들한 면발과 얼큰한 소고기 육개장 국물로 40년 넘게 컵라면 시장 점유율 1위를 굳건히 지키고 있는 국민 사발면.',
    canvasX: 500,
    canvasY: 70
  },
  {
    id: 'anseongtangmyeon',
    name: '안성탕면',
    brand: '안성탕면',
    manufacturer: '농심',
    releaseYear: 1983,
    epochId: 'epoch-2',
    factionId: 'spicy-beef',
    factionName: '정통 소고기 장국계',
    hanjaFaction: '토종 소고기 장국파',
    packageType: 'BAG',
    imageUrl: '/images/products/anseongtangmyeon.jpg',
    isVintagePhoto: false,
    historicalRole: '장국 평정',
    doctrineQuote: '“내 입에 안성맞춤, 구수한 우거지 장국과 소고기 육수의 만남”',
    editorialNote: '1983년 출시. 된장과 소고기 우거지장국을 현대적 분말스프로 구현해 1980년대 초중반 시장을 평정하며 신라면 등장 전까지 최고 인기를 누렸다.',
    canvasX: 500,
    canvasY: 250
  },
  {
    id: 'neoguri',
    name: '너구리 (얼큰한맛)',
    brand: '너구리',
    manufacturer: '농심',
    releaseYear: 1982,
    epochId: 'epoch-2',
    factionId: 'seafood-ocean',
    factionName: '해물 우동 시원계',
    hanjaFaction: '얼큰 해물 우동파',
    packageType: 'BAG',
    imageUrl: '/images/products/neoguri.jpg',
    isVintagePhoto: false,
    historicalRole: '해물 우동 독립',
    doctrineQuote: '“오동통통 굵은 면발에 완도산 통다시마, 해물 국물의 독자적 길”',
    editorialNote: '1982년 출시. 소고기 일변도이던 라면 시장에 두툼한 우동 면발과 완도산 청정 다시마를 통째로 넣어 시원한 해물 라면이라는 새로운 장르를 개척했다.',
    canvasX: 500,
    canvasY: 450
  },
  {
    id: 'chapagetti',
    name: '짜파게티',
    brand: '짜파게티',
    manufacturer: '농심',
    releaseYear: 1984,
    epochId: 'epoch-2',
    factionId: 'jjajang-chunjang',
    factionName: '정통 춘장 짜장계',
    hanjaFaction: '정통 춘장 짜장파',
    packageType: 'BAG',
    imageUrl: '/images/products/chapagetti.jpg',
    isVintagePhoto: false,
    historicalRole: '춘장 천하통일',
    doctrineQuote: '“일요일은 내가 짜파게티 요리사, 과립 춘장스프와 올리브유의 혁신”',
    editorialNote: '1984년 3월 출시. 기존 액상 짜장면의 뭉침 현상을 그래뉼(과립) 공법으로 해결하고 올리브유 조미유를 더해 40년간 짜장라면 시장의 90%를 지배했다.',
    canvasX: 690,
    canvasY: 700
  },
  {
    id: 'paldo-bibim',
    name: '팔도비빔면',
    brand: '팔도비빔면',
    manufacturer: '팔도',
    releaseYear: 1984,
    epochId: 'epoch-2',
    factionId: 'bibim-cold',
    factionName: '초고추장 냉비빔계',
    hanjaFaction: '원조 냉비빔파',
    packageType: 'BAG',
    imageUrl: '/images/products/paldo-bibim.png',
    isVintagePhoto: false,
    historicalRole: '냉비빔 개척',
    doctrineQuote: '“오른손으로 비비고 왼손으로 비비고, 찬물에 헹궈먹는 사계절 별미”',
    editorialNote: '1984년 6월 출시. 뜨거운 국물 라면의 상식을 깨고 찬물에 헹궈 매콤달콤한 사과 과즙 초고추장에 비벼 먹는 여름 계절면 시장의 절대강자로 군림했다.',
    canvasX: 690,
    canvasY: 890
  },

  // --- 1986 ~ 1994 주류 집권과 라이벌전 (X: 890 ~ 1080) ---
  {
    id: 'shin-ramyun',
    name: '신라면',
    brand: '신라면',
    manufacturer: '농심',
    releaseYear: 1986,
    epochId: 'epoch-3',
    factionId: 'spicy-beef',
    factionName: '정통 소고기 얼큰계',
    hanjaFaction: '정통 얼큰 소고기파',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-ramyun.jpg',
    isVintagePhoto: false,
    historicalRole: '절대 집권',
    doctrineQuote: '“사나이 울리는 매운맛, 얼큰한 소고기 국물이야말로 라면의 으뜸”',
    editorialNote: '1986년 10월 출시. 강렬한 붉은 바탕에 매울 신(辛)을 내걸고 한국인이 가장 사랑하는 얼큰하고 시원한 소고기 표고버섯 국물로 40년 독점적 1위 정권을 수립했다.',
    canvasX: 890,
    canvasY: 250
  },
  {
    id: 'sari-gomtang',
    name: '사리곰탕면',
    brand: '사리곰탕',
    manufacturer: '농심',
    releaseYear: 1988,
    epochId: 'epoch-3',
    factionId: 'bone-broth',
    factionName: '사골·우골 구수계',
    hanjaFaction: '진한 사골 곰탕파',
    packageType: 'BAG',
    imageUrl: '/images/products/sari-gomtang.jpg',
    isVintagePhoto: false,
    historicalRole: '백탕 보신',
    doctrineQuote: '“고춧가루 한 점 없이 깊고 진하게 우려낸 소뼈 곰탕”',
    editorialNote: '1988년 서울올림픽 즈음 출시. 자극적인 매운맛에 반대하여 전통 한식 곰탕을 즉석면화, 밥 말아먹는 백탕 라면의 대표 주자로 자리매김했다.',
    canvasX: 890,
    canvasY: 70
  },
  {
    id: 'jin-ramen-spicy',
    name: '진라면 매운맛',
    brand: '진라면',
    manufacturer: '오뚜기',
    releaseYear: 1988,
    epochId: 'epoch-3',
    factionId: 'spicy-beef',
    factionName: '대중 소고기 얼큰계',
    hanjaFaction: '정통 얼큰 소고기파',
    packageType: 'BAG',
    imageUrl: '/images/products/jin-ramen-spicy.jpg',
    isVintagePhoto: false,
    historicalRole: '숙명의 라이벌',
    doctrineQuote: '“진하고 부드러운 소고기 국물과 쫄깃한 면발의 착한 승부”',
    editorialNote: '1988년 출시. 청보식품을 인수한 오뚜기가 신라면에 맞서 선보인 간판 제품으로, 수십 년간 팽팽한 양강 구도를 형성하며 신라면 정권의 유일한 대항마로 군림했다.',
    canvasX: 890,
    canvasY: 430
  },
  {
    id: 'ojingeo-jjamppong',
    name: '오징어짬뽕',
    brand: '오징어짬뽕',
    manufacturer: '농심',
    releaseYear: 1992,
    epochId: 'epoch-3',
    factionId: 'seafood-ocean',
    factionName: '얼큰 해물 짬뽕계',
    hanjaFaction: '얼큰 해물 짬뽕파',
    packageType: 'BAG',
    imageUrl: '/images/products/ojingeo-jjamppong.jpg',
    isVintagePhoto: false,
    historicalRole: '짬뽕 대중화',
    doctrineQuote: '“구운 오징어의 진한 풍미와 시원 칼칼한 해물 짬뽕 국물”',
    editorialNote: '1992년 출시. 동해산 오징어와 양배추, 버섯 등 푸짐한 건더기와 시원하고 얼큰한 짬뽕 국물로 해물 라면의 짬뽕화를 이끌었다.',
    canvasX: 1080,
    canvasY: 450
  },
  {
    id: 'chamkkae',
    name: '참깨라면',
    brand: '참깨라면',
    manufacturer: '오뚜기',
    releaseYear: 1994,
    epochId: 'epoch-3',
    factionId: 'spicy-beef',
    factionName: '고소 얼큰 계란계',
    hanjaFaction: '고소 얼큰 퓨전파',
    packageType: 'BAG',
    imageUrl: '/images/products/chamkkae.jpg',
    isVintagePhoto: false,
    historicalRole: '고소 퓨전',
    doctrineQuote: '“계란 블록과 고소한 참기름 유성스프가 빚어낸 얼큰한 조화”',
    editorialNote: '1994년 컵라면으로 첫선을 보인 후 봉지면으로 확장. 고춧가루 얼큰탕에 동결건조 계란블록과 고소한 참기름을 더해 젊은 층의 열렬한 지지를 받았다.',
    canvasX: 1080,
    canvasY: 250
  },

  // --- 2009 ~ 2015 극매운맛 분화와 하얀국물, 짬뽕 대전 (X: 1270 ~ 1450) ---
  {
    id: 'teumsae-bbalggyettok',
    name: '틈새라면 빨계떡',
    brand: '틈새라면',
    manufacturer: '팔도',
    releaseYear: 2009,
    epochId: 'epoch-4',
    factionId: 'extreme-spicy',
    factionName: '극초매운 국물계',
    hanjaFaction: '극초매운 국물파',
    packageType: 'BAG',
    imageUrl: '/images/products/teumsae-bbalggyettok.png',
    isVintagePhoto: false,
    historicalRole: '극한 스코빌',
    doctrineQuote: '“명동 뒷골목의 전설, 9413 SHU 극강의 매운맛으로 입안을 강타하다”',
    editorialNote: '명동의 소문난 분식점 레시피를 팔도가 2009년 상용화. 스코빌 지수 9,413SHU라는 당시 시판 라면 최고 수치로 매운맛 마니아들의 성지가 되었다.',
    canvasX: 1270,
    canvasY: 90
  },
  {
    id: 'kkokko-myeon',
    name: '꼬꼬면',
    brand: '꼬꼬면',
    manufacturer: '팔도',
    releaseYear: 2011,
    epochId: 'epoch-4',
    factionId: 'white-broth-rebel',
    factionName: '칼칼 닭육수 백탕계',
    hanjaFaction: '하얀국물 반란파',
    packageType: 'BAG',
    imageUrl: '/images/products/kkokko-myeon.png',
    isVintagePhoto: false,
    historicalRole: '하얀국물 영수',
    doctrineQuote: '“하얀 국물에 청양고추의 알싸한 반전, 30년 빨간 국물의 벽을 깨다”',
    editorialNote: '2011년 방송 요리대회에서 이경규의 레시피를 상용화. 출시 5개월 만에 1억 개를 판매하며 대한민국 라면 시장을 일시적으로 백탕 천하로 만든 혁명적 사건.',
    canvasX: 1270,
    canvasY: 270
  },
  {
    id: 'nagasaki-jjamppong',
    name: '나가사끼 짬뽕',
    brand: '나가사끼',
    manufacturer: '삼양식품',
    releaseYear: 2011,
    epochId: 'epoch-4',
    factionId: 'white-broth-rebel',
    factionName: '해물 백짬뽕계',
    hanjaFaction: '하얀국물 반란파',
    packageType: 'BAG',
    imageUrl: '/images/products/nagasaki-jjamppong.jpg',
    isVintagePhoto: false,
    historicalRole: '백탕 연합군',
    doctrineQuote: '“돼지뼈와 해물의 진한 백탕에 청양고추 칼칼함의 배합”',
    editorialNote: '꼬꼬면과 함께 2011년 백탕 신드롬의 양대 축. 삼양식품의 부활을 알렸으며 진한 해물돈골 육수와 칼칼한 뒷맛으로 겨울철 백탕 열풍을 이끌었다.',
    canvasX: 1270,
    canvasY: 450
  },
  {
    id: 'buldak',
    name: '불닭볶음면',
    brand: '불닭볶음면',
    manufacturer: '삼양식품',
    releaseYear: 2012,
    epochId: 'epoch-5',
    factionId: 'fire-bokkeum',
    factionName: '화마 매운볶음계',
    hanjaFaction: '화끈한 불닭 볶음파',
    packageType: 'BAG',
    imageUrl: '/images/products/buldak.png',
    isVintagePhoto: false,
    historicalRole: 'K-불닭 혁명',
    doctrineQuote: '“국물 없이 졸여내는 4404 SHU의 불지옥, K-라면 세계 정복의 기수”',
    editorialNote: '2012년 4월 출시. 초기엔 너무 매워 호불호가 갈렸으나 유튜브 ‘Fire Noodle Challenge’를 통해 전 세계적 문화 현상으로 폭발, 삼양식품을 글로벌 식품기업으로 도약시켰다.',
    canvasX: 1270,
    canvasY: 720
  },
  {
    id: 'jin-jjamppong',
    name: '진짬뽕',
    brand: '진짬뽕',
    manufacturer: '오뚜기',
    releaseYear: 2015,
    epochId: 'epoch-5',
    factionId: 'seafood-ocean',
    factionName: '불맛 프리미엄 짬뽕계',
    hanjaFaction: '프리미엄 불맛 짬뽕파',
    packageType: 'BAG',
    imageUrl: '/images/products/jin-jjamppong.jpg',
    isVintagePhoto: false,
    historicalRole: '짬뽕 대전 승자',
    doctrineQuote: '“3mm 극후면과 불맛 유성스프가 빚어낸 프리미엄 중화 짬뽕의 정점”',
    editorialNote: '2015년 말 출시 50여 일 만에 1000만 개 돌파. 은은한 불맛 액상소스와 두툼한 칼국수형 면발로 중화요리 짬뽕을 인스턴트 라면의 주류로 격상시켰다.',
    canvasX: 1450,
    canvasY: 450
  },
  {
    id: 'jin-jjajang',
    name: '진짜장',
    brand: '진짜장',
    manufacturer: '오뚜기',
    releaseYear: 2015,
    epochId: 'epoch-5',
    factionId: 'jjajang-chunjang',
    factionName: '프리미엄 불맛 짜장계',
    hanjaFaction: '정통 춘장 짜장파',
    packageType: 'BAG',
    imageUrl: '/images/products/jin-jjajang.jpg',
    isVintagePhoto: false,
    historicalRole: '프리미엄 짜장 맞수',
    doctrineQuote: '“진한 볶음 춘장 액상소스와 쫄깃한 면발로 짜파게티 아성에 도전”',
    editorialNote: '2015년 출시. 분말스프가 아닌 직화 솥에서 볶아낸 진한 춘장 액상스프를 채택해 짜장라면의 고급화 경쟁을 촉발했다.',
    canvasX: 1450,
    canvasY: 700
  },

  // --- 2017 ~ 2024 현대 퓨전과 백가쟁명 (X: 1630) ---
  {
    id: 'carbo-buldak',
    name: '까르보불닭볶음면',
    brand: '불닭볶음면',
    manufacturer: '삼양식품',
    releaseYear: 2017,
    epochId: 'epoch-6',
    factionId: 'cream-fusion',
    factionName: '크림·치즈 퓨전계',
    hanjaFaction: '치즈·크림 퓨전파',
    packageType: 'BAG',
    imageUrl: '/images/products/carbo-buldak.png',
    isVintagePhoto: false,
    historicalRole: '크림 퓨전 혁명',
    doctrineQuote: '“매운 불닭에 부드러운 크림과 모짜렐라 치즈의 황금 배합”',
    editorialNote: '2017년 12월 출시 후 역대급 대히트를 기록하며 정식 출시. 매운맛에 약한 서양인과 Z세대를 사로잡으며 전 세계적 K-크림 퓨전 열풍을 일으켰다.',
    canvasX: 1630,
    canvasY: 720
  },
  {
    id: 'baehongdong',
    name: '배홍동 비빔면',
    brand: '배홍동',
    manufacturer: '농심',
    releaseYear: 2021,
    epochId: 'epoch-6',
    factionId: 'bibim-cold',
    factionName: '동치미 과즙 비빔계',
    hanjaFaction: '원조 냉비빔파',
    packageType: 'BAG',
    imageUrl: '/images/products/baehongdong.jpg',
    isVintagePhoto: false,
    historicalRole: '비빔면 신흥 라이벌',
    doctrineQuote: '“배, 홍고추, 동치미를 갈아 넣어 시원하고 깔끔한 매콤새콤의 반격”',
    editorialNote: '2021년 출시. 37년간 굳건했던 팔도비빔면의 독점 체제에 정면 도전해 단숨에 시장 2위로 올라선 비빔면 카테고리의 강력한 맞수.',
    canvasX: 1630,
    canvasY: 890
  },
  {
    id: 'shin-the-red',
    name: '신라면 더 레드',
    brand: '신라면',
    manufacturer: '농심',
    releaseYear: 2023,
    epochId: 'epoch-6',
    factionId: 'extreme-spicy',
    factionName: '극초매운 국물계',
    hanjaFaction: '정통 얼큰 소고기파',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-the-red.jpg',
    isVintagePhoto: false,
    historicalRole: '정통 극한 강화',
    doctrineQuote: '“스코빌 7500 SHU, 신라면 고유의 정통 얼큰 소고기 국물의 극한 진화”',
    editorialNote: '기존 신라면의 2배가 넘는 7,500SHU와 큼직한 소고기·표고버섯 고명을 더해 한정판 완판 후 정식 출시된 정통 얼큰탕의 최신 진화형.',
    canvasX: 1630,
    canvasY: 90
  },
  {
    id: 'shin-toomba',
    name: '신라면 툼바',
    brand: '신라면',
    manufacturer: '농심',
    releaseYear: 2024,
    epochId: 'epoch-6',
    factionId: 'cream-fusion',
    factionName: '매콤 크림 퓨전계',
    hanjaFaction: '치즈·크림 퓨전파',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-toomba.jpg',
    isVintagePhoto: false,
    historicalRole: '투움바 집대성',
    doctrineQuote: '“신라면의 매운맛에 생크림, 치즈를 더한 모디슈머 투움바의 정식 제품화”',
    editorialNote: '인터넷 모디슈머 인기 레시피인 ‘신라면 투움바’를 농심이 공식 제품화. 2024년 가을 출시 후 2개월 만에 1,100만 개를 판매하며 비국물 퓨전계의 주류성을 입증했다.',
    canvasX: 1630,
    canvasY: 360
  }
];

export const LINEAGE_LEGEND_NODES: LineageLegendNode[] = RAW_LINEAGE_LEGEND_NODES.map((n) => ({
  ...n,
  imageUrl: getAssetUrl(n.imageUrl),
}));

// ================= 4. 계보도 연결선 (Edges & Historical Branches) =================
// 23개 역사적 연결선: 역사적 선후관계 완전 검증 (모든 fromYear <= toYear 보장)
// 4대 관계 유형: DIRECT_LINEAGE(직접 계승), FACTION_SPLIT(계열 분화), MARKET_RIVALRY(시장 경쟁), PARADIGM_SHIFT(사조 전환)
export const LINEAGE_EDGES: LineageEdge[] = [
  // 1. 삼양라면(1963) -> 삼양 쇠고기면(1970) [계열 분화: 닭육수 백탕 -> 소고기 장국]
  {
    id: 'edge-samyang-beef',
    fromId: 'samyang-chicken-1963',
    toId: 'samyang-beef-1970',
    relationType: 'FACTION_SPLIT',
    label: '1970 쇠고기 국물 첫 분기',
    year: 1970,
    narrative: '일본식 닭고기 백탕에서 탈피해 한국인 토종 입맛에 맞춘 쇠고기 장국 라면으로 최초 분화',
    factionColor: '#d97706'
  },
  // 2. 삼양라면(1963) -> 롯데짜장면(1970) [사조 전환: 국물 -> 비국물 혁신]
  {
    id: 'edge-samyang-lottejjajang',
    fromId: 'samyang-chicken-1963',
    toId: 'lotte-jjajang-1970',
    relationType: 'PARADIGM_SHIFT',
    label: '1970 최초 비국물 짜장 탄생',
    year: 1970,
    narrative: '국물 일변도이던 라면 시장에 물을 버리고 비벼먹는 인스턴트 짜장면의 역사적 최초 출현',
    factionColor: '#78350f'
  },
  // 3. 삼양 쇠고기면(1970) -> 육개장 사발면(1982) [계열 분화: 소고기 국물의 사발 용기면화]
  {
    id: 'edge-beef-yukgaejang',
    fromId: 'samyang-beef-1970',
    toId: 'yukgaejang-sabal',
    relationType: 'FACTION_SPLIT',
    label: '1982 사발면 시대 개막',
    year: 1982,
    narrative: '얼큰한 소고기 육개장 풍미를 얇은 꼬들면과 원형 용기에 담아 40년 컵라면 1위 제국 건립',
    factionColor: '#e11d48'
  },
  // 4. 삼양 쇠고기면(1970) -> 너구리(1982) [계열 분화: 소고기 -> 해물 우동]
  {
    id: 'edge-beef-neoguri',
    fromId: 'samyang-beef-1970',
    toId: 'neoguri',
    relationType: 'FACTION_SPLIT',
    label: '1982 해물우동계 분기',
    year: 1982,
    narrative: '소고기 일변도를 깨뜨리고 완도산 다시마와 오동통 굵은 면발로 얼큰 해물 우동 장르 창시',
    factionColor: '#0284c7'
  },
  // 5. 삼양 쇠고기면(1970) -> 안성탕면(1983) [직접 계승: 토종 된장 소고기 장국 대중화]
  {
    id: 'edge-beef-anseong',
    fromId: 'samyang-beef-1970',
    toId: 'anseongtangmyeon',
    relationType: 'DIRECT_LINEAGE',
    label: '1983 장국 라면 대중화',
    year: 1983,
    narrative: '구수한 토종 된장과 쇠고기 우거지장국을 현대적 분말스프로 승화시켜 1980년대 초반 시장 평정',
    factionColor: '#dc2626'
  },
  // 6. 롯데짜장면(1970) -> 짜파게티(1984) [직접 계승: 과립스프 기술 혁신]
  {
    id: 'edge-lottejjajang-chapagetti',
    fromId: 'lotte-jjajang-1970',
    toId: 'chapagetti',
    relationType: 'DIRECT_LINEAGE',
    label: '1984 짜장라면 천하통일',
    year: 1984,
    narrative: '롯데공업의 짜장 노하우를 과립스프와 올리브유로 혁신하여 40년간 짜장라면 시장의 90% 지배',
    factionColor: '#78350f'
  },
  // 7. 롯데짜장면(1970) -> 팔도비빔면(1984) [계열 분화: 비국물에서 냉비빔면 창조]
  {
    id: 'edge-lottejjajang-paldobibim',
    fromId: 'lotte-jjajang-1970',
    toId: 'paldo-bibim',
    relationType: 'FACTION_SPLIT',
    label: '1984 차가운 냉비빔면 창시',
    year: 1984,
    narrative: '비국물 조리법을 발전시켜 찬물에 헹궈 매콤달콤한 사과과즙 초고추장에 비비는 냉비빔면 확립',
    factionColor: '#2563eb'
  },
  // 8. 안성탕면(1983) -> 신라면(1986) [직접 계승: 장국에서 얼큰 소고기탕 천하통일]
  {
    id: 'edge-anseong-shin',
    fromId: 'anseongtangmyeon',
    toId: 'shin-ramyun',
    relationType: 'DIRECT_LINEAGE',
    label: '1986 신라면 집권',
    year: 1986,
    narrative: '된장 장국의 감칠맛에 고춧가루와 표고버섯의 매운맛을 폭발시켜 대한민국 라면의 40년 절대 권력 수립',
    factionColor: '#dc2626'
  },
  // 9. 신라면(1986) <-> 진라면 매운맛(1988) [시장 경쟁: 영구적 양강 라이벌]
  {
    id: 'edge-shin-jin',
    fromId: 'shin-ramyun',
    toId: 'jin-ramen-spicy',
    relationType: 'MARKET_RIVALRY',
    label: '1988 영구적 양강 라이벌전',
    year: 1988,
    narrative: '신라면의 독주에 맞서 오뚜기 진라면이 부드럽고 진한 소고기 육수로 맞서며 형성된 라면사의 영구적 대결',
    factionColor: '#2563eb'
  },
  // 10. 삼양라면(1963) -> 사리곰탕면(1988) [계열 분화: 맑은 백탕의 우사골 곰탕화]
  {
    id: 'edge-samyang-sarigomtang',
    fromId: 'samyang-chicken-1963',
    toId: 'sari-gomtang',
    relationType: 'FACTION_SPLIT',
    label: '1988 사골 백탕 보신계',
    year: 1988,
    narrative: '초기 백탕의 담백함을 전통 한식 소뼈 곰탕으로 계승하여 밥 말아먹는 사골 백탕계 정립',
    factionColor: '#d97706'
  },
  // 11. 너구리(1982) -> 오징어짬뽕(1992) [계열 분화: 해물우동에서 중화 짬뽕으로]
  {
    id: 'edge-neoguri-ojjam',
    fromId: 'neoguri',
    toId: 'ojingeo-jjamppong',
    relationType: 'FACTION_SPLIT',
    label: '1992 얼큰 짬뽕 분화',
    year: 1992,
    narrative: '순한 해물 우동 육수에서 구운 오징어 풍미의 칼칼한 중화풍 해물 짬뽕으로 계열 분화',
    factionColor: '#0284c7'
  },
  // 12. 신라면(1986) -> 참깨라면(1994) [계열 분화: 얼큰탕에 계란·참기름 퓨전]
  {
    id: 'edge-shin-chamkkae',
    fromId: 'shin-ramyun',
    toId: 'chamkkae',
    relationType: 'FACTION_SPLIT',
    label: '1994 고소얼큰 계란 퓨전',
    year: 1994,
    narrative: '얼큰한 소고기 국물에 동결건조 계란블록과 고소한 참기름을 더해 부드러운 매운맛으로 분화',
    factionColor: '#f59e0b'
  },
  // 13. 신라면(1986) -> 틈새라면(2009) [직접 계승: 명동 매운맛 소고기탕 극한 강화]
  {
    id: 'edge-shin-teumsae',
    fromId: 'shin-ramyun',
    toId: 'teumsae-bbalggyettok',
    relationType: 'DIRECT_LINEAGE',
    label: '2009 극한 스코빌 9413',
    year: 2009,
    narrative: '신라면의 얼큰한 소고기탕을 마니아층을 위해 스코빌 9,413SHU의 극한 매운맛으로 극대화',
    factionColor: '#991b1b'
  },
  // 14. 삼양라면(1963) -> 꼬꼬면(2011) [사조 전환: 48년 만의 닭육수 역습]
  {
    id: 'edge-samyang-kkokko',
    fromId: 'samyang-chicken-1963',
    toId: 'kkokko-myeon',
    relationType: 'PARADIGM_SHIFT',
    label: '2011 닭육수의 역습',
    year: 2011,
    narrative: '48년 전 삼양라면의 닭육수 원형이 청양고추와 결합해 30년 빨간 국물 독점을 뒤흔든 백탕 혁명',
    factionColor: '#eab308'
  },
  // 15. 꼬꼬면(2011) <-> 나가사끼 짬뽕(2011) [시장 경쟁: 2011 하얀국물 백탕 대전]
  {
    id: 'edge-kkokko-nagasaki',
    fromId: 'kkokko-myeon',
    toId: 'nagasaki-jjamppong',
    relationType: 'MARKET_RIVALRY',
    label: '2011 하얀국물 백탕 대전',
    year: 2011,
    narrative: '닭육수(꼬꼬면)와 돈골해물(나가사끼)이 격돌하며 라면 시장 점유율 15%를 단숨에 장악한 세기의 격돌',
    factionColor: '#f59e0b'
  },
  // 16. 틈새라면(2009) -> 불닭볶음면(2012) [사조 전환: 국물 매운맛에서 볶음면 혁명]
  {
    id: 'edge-teumsae-buldak',
    fromId: 'teumsae-bbalggyettok',
    toId: 'buldak',
    relationType: 'PARADIGM_SHIFT',
    label: '2012 화마 볶음면 혁명',
    year: 2012,
    narrative: '국물 라면의 스코빌 경쟁을 졸여먹는 비국물 볶음면으로 전환하여 전 세계를 뒤흔든 불닭 신드롬 창출',
    factionColor: '#b91c1c'
  },
  // 17. 오징어짬뽕(1992) -> 진짬뽕(2015) [직접 계승: 분말에서 불맛 프리미엄 액상 진화]
  {
    id: 'edge-ojjam-jinjjam',
    fromId: 'ojingeo-jjamppong',
    toId: 'jin-jjamppong',
    relationType: 'DIRECT_LINEAGE',
    label: '2015 프리미엄 불맛 짬뽕',
    year: 2015,
    narrative: '분말스프 짬뽕에서 3mm 극후면과 불맛 유성스프로 진화하며 중화 짬뽕을 주류 카테고리로 승격',
    factionColor: '#0284c7'
  },
  // 18. 짜파게티(1984) <-> 진짜장(2015) [시장 경쟁: 프리미엄 짜장 대전]
  {
    id: 'edge-chapagetti-jinjja',
    fromId: 'chapagetti',
    toId: 'jin-jjajang',
    relationType: 'MARKET_RIVALRY',
    label: '2015 프리미엄 짜장 대전',
    year: 2015,
    narrative: '30년 짜파게티 과립스프 아성에 오뚜기가 직화 볶음 춘장 액상소스로 도전한 프리미엄 짜장 경쟁',
    factionColor: '#78350f'
  },
  // 19. 불닭볶음면(2012) -> 까르보불닭볶음면(2017) [직접 계승: 매운맛과 크림의 황금결합]
  {
    id: 'edge-buldak-carbo',
    fromId: 'buldak',
    toId: 'carbo-buldak',
    relationType: 'DIRECT_LINEAGE',
    label: '2017 K-크림 퓨전 혁명',
    year: 2017,
    narrative: '극강의 불닭 소스에 부드러운 모짜렐라 치즈와 크림을 더해 전 세계 여성과 Z세대를 매료시킨 글로벌 히트작',
    factionColor: '#9333ea'
  },
  // 20. 팔도비빔면(1984) <-> 배홍동 비빔면(2021) [시장 경쟁: 비빔면 37년 독점에 도전]
  {
    id: 'edge-bibim-baehongdong',
    fromId: 'paldo-bibim',
    toId: 'baehongdong',
    relationType: 'MARKET_RIVALRY',
    label: '2021 비빔면 왕좌 쟁탈전',
    year: 2021,
    narrative: '37년간 굳건했던 팔도비빔면의 독점 체제에 농심이 배·홍고추·동치미 비빔장으로 승부수를 던진 대결',
    factionColor: '#2563eb'
  },
  // 21. 신라면(1986) -> 신라면 더 레드(2023) [직접 계승: 신라면 40년 정통의 극한 강화]
  {
    id: 'edge-shin-thered',
    fromId: 'shin-ramyun',
    toId: 'shin-the-red',
    relationType: 'DIRECT_LINEAGE',
    label: '2023 7500 SHU 정통 극한',
    year: 2023,
    narrative: '신라면 고유의 얼큰한 소고기 국물과 표고버섯 고명을 7,500SHU로 2배 이상 강화한 정통파의 극한 완성',
    factionColor: '#991b1b'
  },
  // 22. 신라면(1986) -> 신라면 툼바(2024) [직접 계승: 신라면의 크림 퓨전 공식화]
  {
    id: 'edge-shin-toomba',
    fromId: 'shin-ramyun',
    toId: 'shin-toomba',
    relationType: 'DIRECT_LINEAGE',
    label: '2024 신라면 투움바 공식화',
    year: 2024,
    narrative: '신라면 고유의 칼칼한 매운맛에 생크림과 치즈를 더해 모디슈머 인기 레시피를 정규 메이저로 승격',
    factionColor: '#9333ea'
  },
  // 23. 까르보불닭(2017) -> 신라면 툼바(2024) [사조 전환: K-크림 퓨전의 시장 표준화]
  {
    id: 'edge-carbo-toomba',
    fromId: 'carbo-buldak',
    toId: 'shin-toomba',
    relationType: 'PARADIGM_SHIFT',
    label: '2024 K-크림 퓨전 대세화',
    year: 2024,
    narrative: '까르보불닭이 연 크림 퓨전 사조가 신라면 브랜드까지 흡수하며 한국 라면의 백가쟁명 시대를 완성',
    factionColor: '#9333ea'
  }
];

// ================= 5. 계파별 연대기 (Faction Chronicles) =================
export const FACTION_CHRONICLES: FactionChronicle[] = [
  {
    id: 'root-chicken',
    name: '원조 닭고기 백탕계',
    hanja: '원조 백탕파',
    themeColor: {
      primary: '#eab308',
      bg: '#fefce8',
      text: '#854d0e',
      border: '#facc15'
    },
    riseDecade: '1960년대',
    hegemonyStatus: 'HISTORIC_ORIGIN',
    summary: '1963년 대한민국 라면의 시작. 닭육수와 우지 튀김면으로 서민의 허기를 달랜 역사의 단일 뿌리',
    doctrine: '“배고픈 국민의 주린 배를 채우는 10원의 영양 식량”',
    chronicleStory: [
      '1963년: 전중윤 창업주가 일본 묘조식품 기술을 전수받아 치킨 라면 10원 출시',
      '1965년: 정부의 혼분식 장려 정책과 맞물려 서민 대표 주식으로 자리매김',
      '1970년대: 한국인 입맛에 맞춘 쇠고기 육개장 장국으로 맛의 주도권을 넘김'
    ],
    flagshipIds: ['samyang-chicken-1963']
  },
  {
    id: 'spicy-beef',
    name: '정통 소고기 국물파',
    hanja: '정통 소고기파',
    themeColor: {
      primary: '#dc2626',
      bg: '#fef2f2',
      text: '#991b1b',
      border: '#f87171'
    },
    riseDecade: '1970년대 ~ 현재',
    hegemonyStatus: 'RULING',
    summary: '소고기 양지 육수에 고춧가루와 표고버섯의 얼큰함을 결합한 대한민국 라면의 40년 절대 주류',
    doctrine: '“얼큰하고 칼칼한 소고기 장국이야말로 대한민국 라면의 근본이자 으뜸”',
    chronicleStory: [
      '1970년: 삼양 쇠고기면 출시로 토종 쇠고기 장국 시대 개막',
      '1983년: 안성탕면이 된장과 소고기 우거지장국으로 시장 평정',
      '1986년: 신라면의 집권으로 얼큰 소고기탕 천하통일',
      '1988년: 오뚜기 진라면 매운맛이 등장하여 40년 영구적 라이벌전 형성',
      '2023년: 신라면 더 레드로 7,500SHU 극한 정통파 강화'
    ],
    flagshipIds: ['samyang-beef-1970', 'yukgaejang-sabal', 'anseongtangmyeon', 'shin-ramyun', 'jin-ramen-spicy', 'chamkkae', 'shin-the-red']
  },
  {
    id: 'seafood-ocean',
    name: '해물·짬뽕파',
    hanja: '얼큰 해물파',
    themeColor: {
      primary: '#0284c7',
      bg: '#f0f9ff',
      text: '#075985',
      border: '#38bdf8'
    },
    riseDecade: '1980년대 ~ 현재',
    hegemonyStatus: 'MAINSTREAM',
    summary: '다시마와 오징어, 홍합 등 바다의 시원함과 굵은 면발로 소고기 독점에 맞선 대표 대안 세력',
    doctrine: '“육고기의 기름짐을 넘어 동해의 시원함과 얼큰한 불맛을 취한다”',
    chronicleStory: [
      '1982년: 너구리가 굵은 면발과 통다시마로 해물 우동계 창시',
      '1992년: 오징어짬뽕이 칼칼한 해물 짬뽕의 대중화 견인',
      '2015년: 오뚜기 진짬뽕이 3mm 극후면과 불맛 유성스프로 프리미엄 짬뽕 대전 승리'
    ],
    flagshipIds: ['neoguri', 'ojingeo-jjamppong', 'jin-jjamppong']
  },
  {
    id: 'jjajang-chunjang',
    name: '정통 춘장 짜장파',
    hanja: '정통 짜장파',
    themeColor: {
      primary: '#78350f',
      bg: '#fef3c7',
      text: '#451a03',
      border: '#b45309'
    },
    riseDecade: '1970년대 ~ 현재',
    hegemonyStatus: 'MAINSTREAM',
    summary: '국물을 버리고 비벼 먹는 비국물 라면의 시초이자 주류. 과립 춘장스프와 올리브유의 절대 강자',
    doctrine: '“일요일은 내가 요리사, 국물 없이 비벼내는 진한 춘장의 풍미”',
    chronicleStory: [
      '1970년: 국내 최초 비국물 라면인 롯데짜장면 출시',
      '1984년: 그래뉼 과립공법의 혁신을 이룬 짜파게티 탄생',
      '2015년: 진짜장의 직화 액상스프 도전으로 프리미엄화 가속'
    ],
    flagshipIds: ['lotte-jjajang-1970', 'chapagetti', 'jin-jjajang']
  },
  {
    id: 'bibim-cold',
    name: '초고추장 냉비빔파',
    hanja: '원조 냉비빔파',
    themeColor: {
      primary: '#2563eb',
      bg: '#eff6ff',
      text: '#1e40af',
      border: '#60a5fa'
    },
    riseDecade: '1984년 ~ 현재',
    hegemonyStatus: 'COEXISTING',
    summary: '찬물에 헹군 쫄깃한 면에 매콤달콤한 사과 과즙 초고추장을 비벼 먹는 여름 별미의 최강자',
    doctrine: '“오른손으로 비비고 왼손으로 비비고, 여름철 입맛을 돋우는 시원한 매콤달콤”',
    chronicleStory: [
      '1984년: 차가운 면의 시대를 연 팔도비빔면 출시',
      '2021년: 농심 배홍동 비빔면이 배·동치미 소스로 37년 독점에 도전'
    ],
    flagshipIds: ['paldo-bibim', 'baehongdong']
  },
  {
    id: 'white-broth-rebel',
    name: '하얀국물 반란파',
    hanja: '하얀국물 반란파',
    themeColor: {
      primary: '#f59e0b',
      bg: '#fffbeb',
      text: '#b45309',
      border: '#fcd34d'
    },
    riseDecade: '2011 ~ 2012',
    hegemonyStatus: 'EXPEDITIONARY',
    summary: '닭육수와 돈골에 청양고추의 알싸한 반전을 더해 25년 빨간 국물 독점을 강타했던 백탕 신드롬',
    doctrine: '“국물은 하얗지만 맛은 칼칼하다, 붉은색 고정관념의 파괴”',
    chronicleStory: [
      '2011년 8월: 예능 레시피로 개발된 꼬꼬면이 출시 5개월 만에 1억 개 판매',
      '2011년 겨울: 삼양 나가사끼 짬뽕과 연합해 라면 시장 15% 점유',
      '2012년: 기존 붉은 국물 제조사들의 반격과 계절적 요인으로 신드롬 수렴'
    ],
    flagshipIds: ['kkokko-myeon', 'nagasaki-jjamppong']
  },
  {
    id: 'fire-bokkeum',
    name: '불닭·매운 볶음파',
    hanja: '불닭 볶음파',
    themeColor: {
      primary: '#b91c1c',
      bg: '#fef2f2',
      text: '#7f1d1d',
      border: '#ef4444'
    },
    riseDecade: '2012 ~ 현재',
    hegemonyStatus: 'MAINSTREAM',
    summary: '국물 없이 바짝 졸여내는 극한의 화마 매운맛. 유튜브 바이럴을 통해 K-라면의 세계화를 이끈 주역',
    doctrine: '“국물 없이 졸여내는 4404 SHU의 불지옥, K-푸드 신드롬의 첨병”',
    chronicleStory: [
      '2012년: 삼양식품 불닭볶음면 출시',
      '2014년~: 해외 유튜버들의 Fire Noodle Challenge 바이럴 폭발',
      '현재: 전 세계 100여 개국 수출 및 글로벌 메가 IP로 안착'
    ],
    flagshipIds: ['buldak']
  },
  {
    id: 'cream-fusion',
    name: '크림·치즈 퓨전파',
    hanja: '크림 퓨전파',
    themeColor: {
      primary: '#9333ea',
      bg: '#faf5ff',
      text: '#6b21a8',
      border: '#c084fc'
    },
    riseDecade: '2017 ~ 현재',
    hegemonyStatus: 'COEXISTING',
    summary: '매운맛에 생크림과 치즈를 결합한 모디슈머 레시피의 공식 제품화. 글로벌 Z세대의 최애 장르',
    doctrine: '“화끈한 매운맛과 부드러운 유제품의 황금비, 라면과 파스타의 경계 해체”',
    chronicleStory: [
      '2017년: 까르보불닭볶음면 한정판 출시 후 정식 라인업 등극',
      '2024년: 농심 신라면 툼바 공식 출시로 K-크림 퓨전의 시장 표준화 완성'
    ],
    flagshipIds: ['carbo-buldak', 'shin-toomba']
  }
];

// Helper Lookups
export function getLegendNodeById(id: string): LineageLegendNode | undefined {
  return LINEAGE_LEGEND_NODES.find((n) => n.id === id);
}

export function getFullRamenProduct(id: string): RamenProduct | undefined {
  return RAMEN_DATASET.find((p) => p.id === id);
}

export function getEdgesForNode(nodeId: string): LineageEdge[] {
  return LINEAGE_EDGES.filter((e) => e.fromId === nodeId || e.toId === nodeId);
}

export function getMilestoneById(id: string): HistoricalEventMilestone | undefined {
  return HISTORICAL_MILESTONES.find((m) => m.id === id);
}
