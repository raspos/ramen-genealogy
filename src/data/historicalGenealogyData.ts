import { getAssetUrl } from '../utils/imageUrl';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from './ramenDataset';

export type HistoricalRelationType =
  | 'DIRECT_LINEAGE'        // 정통 계승 (혈통적/직접적 후속작)
  | 'FACTION_SPLIT'         // 계열 분화 (맛과 조리방식의 새로운 분파 설립)
  | 'REVOLUTIONARY_SCHISM'  // 사조 혁명/반란 (기존 패러다임 전복 및 유행 창출)
  | 'HISTORICAL_RIVALRY';   // 숙명의 라이벌 (동시대 패권 쟁탈)

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
  historicalRole: string; // 계보상의 역사적 역할 (예: '시원(始原)', '천하통일', '분당(分黨)', '반란(叛亂)')
  doctrineQuote: string;  // 한 줄 사상/교리
  editorialNote: string;  // 데이터저널리즘 역사 서사
  // Layout coordinates in virtual SVG canvas (1200 x 860)
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
  chronicleStory: string[]; // 시대별 흥망성쇠 기록
  flagshipIds: string[];
}

// ================= 1. 6대 역사적 시대 (Epochs) =================
export const HISTORICAL_EPOCHS: HistoricalEpoch[] = [
  {
    id: 'epoch-1',
    name: '제1기: 건국과 시원 (始原)',
    hanja: '開拓期',
    period: '1963 ~ 1970년대',
    yearStart: 1963,
    yearEnd: 1979,
    headline: '꿀꿀이죽을 밀어낸 10원의 구휼 라면, 닭고기 백탕 시대',
    narrative: '1963년 9월 15일 삼양라면이 10원에 첫선을 보이며 한국 라면 역사가 시작되었다. 일제 명성식품 기술을 전수받은 초기 라면은 닭육수 베이스의 백탕이었으며, 서민의 굶주림을 해결하는 국가적 구휼 식량으로 자리 잡았다.'
  },
  {
    id: 'epoch-2',
    name: '제2기: 소고기 얼큰탕의 천하통일 (天下統一)',
    hanja: '辛湯執權期',
    period: '1980 ~ 1988',
    yearStart: 1980,
    yearEnd: 1988,
    headline: '안성탕면의 평정, 그리고 1986년 신라면의 절대 집권',
    narrative: '한국인의 입맛이 닭육수에서 된장·소고기 장국으로 급격히 이동했다. 1983년 안성탕면이 시골 장국맛으로 평정하고, 1986년 고춧가루와 표고버섯을 듬뿍 넣은 辛라면이 등장하며 빨간 매운 국물은 대한민국 라면의 불변의 주류로 등극했다.'
  },
  {
    id: 'epoch-3',
    name: '제3기: 비탕파(非湯派)의 분당과 바다의 독립',
    hanja: '分黨創設期',
    period: '1982 ~ 1984',
    yearStart: 1982,
    yearEnd: 1985,
    headline: '국물 없는 라면의 개척: 춘장, 냉비빔, 그리고 완도 다시마',
    narrative: '국물 라면의 획일성에 반기를 들고 1982년 너구리가 두툼한 면발과 해물 육수로 해물파를 창설했다. 1984년에는 올리브유와 과립스프의 짜파게티, 메밀가루와 초고추장의 팔도비빔면이 연달아 분당하며 국물 없는 비탕파의 거대한 양대 산맥을 완성했다.'
  },
  {
    id: 'epoch-4',
    name: '제4기: 사골 구수파와 극매운맛의 분화',
    hanja: '多極分化期',
    period: '1988 ~ 2000년대',
    yearStart: 1988,
    yearEnd: 2009,
    headline: '우골·사골 백탕의 계승과 신라면을 넘어선 극강 매운맛의 반역',
    narrative: '1988년 서울올림픽을 기점으로 사리곰탕면이 우사골의 맑은 구수함으로 보신 라면을 개척했고, 1996년 열라면과 2009년 명동 골목에서 태어난 틈새라면 빨계떡이 스코빌 지수를 무기로 신라면의 아성에 도전장을 던졌다.'
  },
  {
    id: 'epoch-5',
    name: '제5기: 백탕의 난 / 하얀 국물 혁명',
    hanja: '白湯叛亂期',
    period: '2011 ~ 2012',
    yearStart: 2011,
    yearEnd: 2012,
    headline: '꼬꼬면과 나가사끼짬뽕의 기습, 30년 빨간 국물 독재를 뒤흔들다',
    narrative: '2011년 청양고추와 닭육수로 무장한 꼬꼬면과 삼양 나가사끼짬뽕이 폭발적인 신드롬을 일으키며 라면 시장 점유율 15%를 단숨에 장악했다. 비록 1년여 만에 기존 빨간 국물의 반격으로 진압되었으나, 한국 라면사에 가장 강렬한 지각변동을 남겼다.'
  },
  {
    id: 'epoch-6',
    name: '제6기: 비국물 화마의 난과 퓨전 르네상스',
    hanja: '現代復興期',
    period: '2012 ~ 2026',
    yearStart: 2012,
    yearEnd: 2026,
    headline: '불닭의 세계 정복, 프리미엄 짬뽕 대전, 그리고 크림·로제 공존',
    narrative: '2012년 불닭볶음면의 출현은 비국물 볶음면을 세계적인 문화 현상으로 끌어올렸다. 2015년 오뚜기 진짬뽕이 일으킨 불맛 짬뽕 대전, 까르보불닭과 신라면 툼바로 이어지는 크림·로제 퓨전, 신라면 건면의 웰빙화까지 현대 라면은 백가쟁명의 다원주의 시대로 접어들었다.'
  }
];

// ================= 2. 시대적 변곡점 사건 (Milestones) =================
export const HISTORICAL_MILESTONES: HistoricalEventMilestone[] = [
  {
    id: 'ms-1963',
    year: 1963,
    epochId: 'epoch-1',
    title: '대한민국 최초의 라면 탄생',
    hanjaTitle: '始原之變',
    summary: '전중윤 회장이 식량난 타개를 위해 10원짜리 삼양라면 출시. 닭육수 백탕의 시대 개막.',
    impactFactionId: 'root-chicken',
    keyProducts: ['samyang-chicken-1963']
  },
  {
    id: 'ms-1982',
    year: 1982,
    epochId: 'epoch-3',
    title: '해물계의 독립 선언',
    hanjaTitle: '海鮮獨立',
    summary: '굵은 면발과 완도산 다시마를 통째로 넣은 너구리 출시. 소고기 육수 독점 탈피.',
    impactFactionId: 'seafood-ocean',
    keyProducts: ['neoguri']
  },
  {
    id: 'ms-1984',
    year: 1984,
    epochId: 'epoch-3',
    title: '비탕파(非湯派) 양대 세력의 정립',
    hanjaTitle: '非湯分黨',
    summary: '짜파게티(춘장 과립)와 팔도비빔면(차갑게 비비는 사계절면)이 국물 없는 라면의 새 장을 열다.',
    impactFactionId: 'jjajang-chunjang',
    keyProducts: ['chapagetti', 'paldo-bibim']
  },
  {
    id: 'ms-1986',
    year: 1986,
    epochId: 'epoch-2',
    title: '신라면의 집권과 얼큰 소고기 천하통일',
    hanjaTitle: '辛라면 執權',
    summary: '‘사나이 울리는 매운맛’ 표방. 얼큰 소고기 표고버섯 국물이 국민 표준 맛으로 등극.',
    impactFactionId: 'spicy-beef',
    keyProducts: ['shin-ramyun', 'jin-ramen-spicy']
  },
  {
    id: 'ms-2011',
    year: 2011,
    epochId: 'epoch-5',
    title: '하얀 국물의 난 (白湯의 亂)',
    hanjaTitle: '白湯叛亂',
    summary: '꼬꼬면·나가사끼짬뽕의 기습. 빨간 국물이 절대적이던 시장을 단숨에 흔든 백탕 혁명.',
    impactFactionId: 'white-broth-rebel',
    keyProducts: ['kkokko-myeon', 'nagasaki-jjamppong']
  },
  {
    id: 'ms-2012',
    year: 2012,
    epochId: 'epoch-6',
    title: '불닭 화마(火魔)의 강림과 비국물 대세화',
    hanjaTitle: '火魔降臨',
    summary: '국물 없는 매운 볶음면이 K-푸드 신드롬을 견인하며 비국물 라면의 글로벌 위상 확립.',
    impactFactionId: 'fire-bokkeum',
    keyProducts: ['buldak-original', 'carbo-buldak']
  },
  {
    id: 'ms-2015',
    year: 2015,
    epochId: 'epoch-6',
    title: '프리미엄 짬뽕 대전',
    hanjaTitle: '中華大戰',
    summary: '진짬뽕의 불맛 유성스프와 극후면이 대흥행하며 중화 짬뽕이 독립 주류 세력으로 승격.',
    impactFactionId: 'seafood-ocean',
    keyProducts: ['jin-jjamppong']
  }
];

// ================= 3. 25대 기수 대표 라면 (Nodes) =================
// 캔버스 좌표 (Canvas 1200 x 920): 시간(X: 1963~2026), 계파 성격(Y: 국물얼큰 상단 ~ 해물/사골 중단 ~ 비국물 하단)
const RAW_LINEAGE_LEGEND_NODES: LineageLegendNode[] = [
  // --- ROOT ---
  {
    id: 'samyang-chicken-1963',
    name: '삼양라면 (1963)',
    brand: '삼양라면',
    manufacturer: '삼양식품',
    releaseYear: 1963,
    epochId: 'epoch-1',
    factionId: 'root-chicken',
    factionName: '원조 닭고기 백탕계',
    hanjaFaction: '始原鷄湯派',
    packageType: 'BAG',
    imageUrl: '/images/products/samyang-1963-original-10won.png',
    isVintagePhoto: true,
    vintageYearNote: '1963년 10원 출시 당시 실물 봉지',
    historicalRole: '시원 (始原)',
    doctrineQuote: '“배고픈 국민의 식생활을 해결하는 10원의 즉석 영양식”',
    editorialNote: '한국 최초의 라면. 일본 명성식품에서 전수받은 닭고기 육수 베이스로 출발해 우지(소기름) 튀김면으로 서민의 굶주림을 달랜 대한민국 라면의 단일 뿌리다.',
    canvasX: 100,
    canvasY: 460
  },

  // --- 소고기 얼큰계 (辛牛派) TRUNK ---
  {
    id: 'anseongtangmyeon',
    name: '안성탕면',
    brand: '안성탕면',
    manufacturer: '농심',
    releaseYear: 1983,
    epochId: 'epoch-2',
    factionId: 'spicy-beef',
    factionName: '정통 소고기 장국계',
    hanjaFaction: '辛牛派',
    packageType: 'BAG',
    imageUrl: '/images/products/anseongtangmyeon.jpg',
    isVintagePhoto: false,
    historicalRole: '장국 평정',
    doctrineQuote: '“내 입에 안성맞춤, 구수한 우거지 장국과 소고기 육수의 만남”',
    editorialNote: '1982년 안성스프공장 준공 후 1983년 출시. 된장과 소고기 우거지장국을 현대적 분말스프로 구현해 1980년대 초반 시장을 완전히 평정했다.',
    canvasX: 330,
    canvasY: 310
  },
  {
    id: 'shin-ramyun',
    name: '신라면',
    brand: '신라면',
    manufacturer: '농심',
    releaseYear: 1986,
    epochId: 'epoch-2',
    factionId: 'spicy-beef',
    factionName: '정통 소고기 얼큰계',
    hanjaFaction: '辛牛派',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-ramyun.jpg',
    isVintagePhoto: false,
    historicalRole: '절대 집권',
    doctrineQuote: '“사나이 울리는 매운맛, 얼큰한 소고기 국물이야말로 라면의 으뜸”',
    editorialNote: '1986년 10월 출시. 강렬한 붉은 바탕에 한자 ‘辛’을 내걸고 한국인이 가장 사랑하는 얼큰하고 시원한 소고기 표고버섯 국물로 40년 독점적 1위 정권을 수립했다.',
    canvasX: 570,
    canvasY: 290
  },
  {
    id: 'jin-ramen-spicy',
    name: '진라면 매운맛',
    brand: '진라면',
    manufacturer: '오뚜기',
    releaseYear: 1988,
    epochId: 'epoch-2',
    factionId: 'spicy-beef',
    factionName: '대중 소고기 얼큰계',
    hanjaFaction: '辛牛派',
    packageType: 'BAG',
    imageUrl: '/images/products/jin-ramen-spicy.jpg',
    isVintagePhoto: false,
    historicalRole: '호적수 ( 라이벌 )',
    doctrineQuote: '“진하고 부드러운 소고기 국물과 쫄깃한 면발의 착한 승부”',
    editorialNote: '1988년 출시. 청보식품을 인수한 오뚜기가 신라면에 맞서 선보인 간판 제품으로, 수십 년간 팽팽한 양강 구도를 형성하며 신라면 정권의 유일한 대항마로 군림했다.',
    canvasX: 570,
    canvasY: 400
  },
  {
    id: 'yukgaejang-sabal',
    name: '육개장 사발면',
    brand: '육개장',
    manufacturer: '농심',
    releaseYear: 1982,
    epochId: 'epoch-2',
    factionId: 'spicy-beef',
    factionName: '사발 용기 얼큰계',
    hanjaFaction: '辛牛派',
    packageType: 'BOWL',
    imageUrl: '/images/products/yukgaejang-sabal.jpg',
    isVintagePhoto: false,
    historicalRole: '용기면 평정',
    doctrineQuote: '“한국인의 입맛에 가장 친숙한 가볍고 칼칼한 육개장 한 그릇”',
    editorialNote: '1982년 출시. 얇고 꼬들꼬들한 면발과 소고기 육개장 풍미로 컵라면 시장 점유율 1위를 수십 년간 수성한 국민 사발면의 절대강자.',
    canvasX: 330,
    canvasY: 220
  },
  {
    id: 'shin-non-frying',
    name: '신라면 건면',
    brand: '신라면',
    manufacturer: '농심',
    releaseYear: 2019,
    epochId: 'epoch-6',
    factionId: 'spicy-beef',
    factionName: '건면 웰빙계',
    hanjaFaction: '辛牛派',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-non-frying.jpg',
    isVintagePhoto: false,
    historicalRole: '웰빙 진화',
    doctrineQuote: '“기름에 튀기지 않은 면으로 칼로리는 낮추고 본연의 칼칼함은 극대화”',
    editorialNote: '신라면의 얼큰한 육수를 유지하면서 350kcal로 칼로리를 30% 낮춘 3세대 신라면. 건면(Non-fried) 시장을 주류 반열에 올린 분파.',
    canvasX: 1050,
    canvasY: 290
  },
  {
    id: 'shin-the-red',
    name: '신라면 더 레드',
    brand: '신라면',
    manufacturer: '농심',
    releaseYear: 2023,
    epochId: 'epoch-6',
    factionId: 'extreme-spicy',
    factionName: '극초매운 소고기계',
    hanjaFaction: '極辛派',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-the-red.jpg',
    isVintagePhoto: false,
    historicalRole: '스코빌 반격',
    doctrineQuote: '“더 맵고 더 깊다, 7500 SHU로 재정립한 매운맛의 황제”',
    editorialNote: '신라면 37주년 한정판으로 출시되었다가 열풍 속에 정식 출시. 기존 신라면(3400 SHU)의 두 배가 넘는 매운맛과 소고기 표고 후첨으로 극초매운계 시장을 평정했다.',
    canvasX: 1280,
    canvasY: 260
  },

  // --- 극초매운계 (極辛派) ---
  {
    id: 'yeol-ramyun',
    name: '열라면',
    brand: '열라면',
    manufacturer: '오뚜기',
    releaseYear: 1996,
    epochId: 'epoch-4',
    factionId: 'extreme-spicy',
    factionName: '정통 극초매운계',
    hanjaFaction: '極辛派',
    packageType: 'BAG',
    imageUrl: '/images/products/yeol-ramyun.jpg',
    isVintagePhoto: false,
    historicalRole: '매운맛 반역',
    doctrineQuote: '“열나게 화끈한 매운맛, 청양고추의 얼얼한 카타르시스”',
    editorialNote: '1996년 출시. 5000 SHU급 매운맛으로 마니아층을 형성했으며, 2020년대 ‘순두부 열라면’ 모디슈머 레시피로 역주행 흥행을 달성한 극초매운계의 거두.',
    canvasX: 810,
    canvasY: 170
  },
  {
    id: 'teumsae-bbalggyettok',
    name: '틈새라면 빨계떡',
    brand: '틈새라면',
    manufacturer: '팔도',
    releaseYear: 2009,
    epochId: 'epoch-4',
    factionId: 'extreme-spicy',
    factionName: '골목 출신 극강계',
    hanjaFaction: '極辛派',
    packageType: 'BAG',
    imageUrl: '/images/products/teumsae-bbalggyettok.jpg',
    isVintagePhoto: false,
    historicalRole: '스코빌 도발',
    doctrineQuote: '“명동 골목의 전설, 9413 SHU 극강의 캡사이신 지옥”',
    editorialNote: '명동 분식집 ‘틈새라면’의 전설적인 빨계떡을 팔도가 인스턴트화. 시판 국물 라면 중 최고 스코빌을 기록하며 한국 라면의 매운맛 상한선을 파괴했다.',
    canvasX: 1050,
    canvasY: 170
  },
  {
    id: 'ma-yeol',
    name: '마열라면',
    brand: '열라면',
    manufacturer: '오뚜기',
    releaseYear: 2023,
    epochId: 'epoch-6',
    factionId: 'extreme-spicy',
    factionName: '마늘·후추 융합계',
    hanjaFaction: '極辛派',
    packageType: 'BAG',
    imageUrl: '/images/products/ma-yeol.jpg',
    isVintagePhoto: false,
    historicalRole: '알싸 융합',
    doctrineQuote: '“마늘과 후추의 알싸한 풍미가 결합된 신세대 매운맛”',
    editorialNote: '열라면의 매운 베이스에 제주 대정 마늘과 굵은 흑후추를 후첨 블렌딩하여 알싸한 감칠맛으로 진화한 극초매운계의 최신예 기수.',
    canvasX: 1280,
    canvasY: 170
  },

  // --- 해물 시원계 (海鮮派) ---
  {
    id: 'neoguri',
    name: '너구리 (얼큰한맛)',
    brand: '너구리',
    manufacturer: '농심',
    releaseYear: 1982,
    epochId: 'epoch-3',
    factionId: 'seafood-ocean',
    factionName: '해물 시원계',
    hanjaFaction: '海鮮派',
    packageType: 'BAG',
    imageUrl: '/images/products/neoguri.jpg',
    isVintagePhoto: false,
    historicalRole: '해물 독립',
    doctrineQuote: '“굵은 면발에 통다시마, 바다의 깊고 시원한 얼큰함”',
    editorialNote: '1982년 출시. 소고기 국물 일색이던 시장에 최초로 우동 굵기의 통통한 면발과 완도산 다시마, 미역을 도입하여 해물 라면 계파를 단독 창설했다.',
    canvasX: 330,
    canvasY: 620
  },
  {
    id: 'ojingeo-jjamppong',
    name: '오징어짬뽕',
    brand: '오징어짬뽕',
    manufacturer: '농심',
    releaseYear: 1992,
    epochId: 'epoch-4',
    factionId: 'seafood-ocean',
    factionName: '해물 중화계',
    hanjaFaction: '海鮮派',
    packageType: 'BAG',
    imageUrl: '/images/products/ojingeo-jjamppong.jpg',
    isVintagePhoto: false,
    historicalRole: '짬뽕 태동',
    doctrineQuote: '“오징어와 양배추, 불맛 머금은 정통 중화 짬뽕의 서민화”',
    editorialNote: '1992년 출시. 오징어 건더기와 칼칼한 짬뽕 국물을 대중화하여 2015년 프리미엄 짬뽕 대전이 발발하기 전까지 20여 년간 해물 짬뽕계의 영수로 군림했다.',
    canvasX: 810,
    canvasY: 620
  },
  {
    id: 'myeolchi-kalguksu',
    name: '멸치칼국수',
    brand: '멸치칼국수',
    manufacturer: '농심',
    releaseYear: 1997,
    epochId: 'epoch-4',
    factionId: 'seafood-ocean',
    factionName: '멸치 어육 맑은계',
    hanjaFaction: '海鮮派',
    packageType: 'BAG',
    imageUrl: '/images/products/myeolchi-kalguksu.jpg',
    isVintagePhoto: false,
    historicalRole: '어육 맑은탕',
    doctrineQuote: '“남해 멸치로 맑게 우려낸 비유탕 칼국수의 담백함”',
    editorialNote: '1997년 출시. 기름에 튀기지 않은 건면과 멸치, 무, 미나리의 시원한 장국으로 고춧가루 없는 해물 국물의 절제미를 확립했다.',
    canvasX: 810,
    canvasY: 710
  },
  {
    id: 'jin-jjamppong',
    name: '진짬뽕',
    brand: '진짬뽕',
    manufacturer: '오뚜기',
    releaseYear: 2015,
    epochId: 'epoch-6',
    factionId: 'seafood-ocean',
    factionName: '프리미엄 불맛 짬뽕계',
    hanjaFaction: '海鮮派',
    packageType: 'BAG',
    imageUrl: '/images/products/jin-jjamppong.jpg',
    isVintagePhoto: false,
    historicalRole: '중화대전 승자',
    doctrineQuote: '“불맛 유성스프와 3mm 태면으로 완성한 프리미엄 짬뽕의 정점”',
    editorialNote: '2015년 겨울 출시 50일 만에 1000만 개 돌파. 농심 맛짬뽕, 삼양 갓짬뽕을 물리치고 1500원대 프리미엄 라면 시장을 개척한 짬뽕 대전의 최종 승자.',
    canvasX: 1280,
    canvasY: 620
  },

  // --- 사골·우골 구수계 (牛骨派) ---
  {
    id: 'sari-gomtang',
    name: '사리곰탕면',
    brand: '사리곰탕',
    manufacturer: '농심',
    releaseYear: 1988,
    epochId: 'epoch-4',
    factionId: 'bone-broth',
    factionName: '사골·우골 구수계',
    hanjaFaction: '牛骨派',
    packageType: 'BAG',
    imageUrl: '/images/products/sari-gomtang.jpg',
    isVintagePhoto: false,
    historicalRole: '백탕 보신',
    doctrineQuote: '“고춧가루 한 점 없이 깊고 진하게 우려낸 소뼈 곰탕”',
    editorialNote: '1988년 서울올림픽 즈음 출시. 자극적인 매운맛에 반대하여 전통 한식 곰탕을 즉석면화, 밥 말아먹는 백탕 라면의 대표 주자로 자리매김했다.',
    canvasX: 570,
    canvasY: 510
  },
  {
    id: 'snack-myeon',
    name: '스낵면',
    brand: '스낵면',
    manufacturer: '오뚜기',
    releaseYear: 1992,
    epochId: 'epoch-4',
    factionId: 'bone-broth',
    factionName: '담백 밥말이계',
    hanjaFaction: '牛骨派',
    packageType: 'BAG',
    imageUrl: '/images/products/snack-myeon.jpg',
    isVintagePhoto: false,
    historicalRole: '2분 조리',
    doctrineQuote: '“밥 말아먹을 때 가장 맛있는 2분 완성 얇은 면”',
    editorialNote: '1992년 출시. 얇은 면발과 자극적이지 않고 슴슴한 쇠고기 사골 국물로 밥을 말았을 때 최고의 궁합을 자랑하는 가성비 스테디셀러.',
    canvasX: 810,
    canvasY: 510
  },

  // --- 백탕 혁명계 (白湯派) ---
  {
    id: 'kkokko-myeon',
    name: '꼬꼬면',
    brand: '꼬꼬면',
    manufacturer: '팔도',
    releaseYear: 2011,
    epochId: 'epoch-5',
    factionId: 'white-broth-rebel',
    factionName: '칼칼 닭육수 백탕계',
    hanjaFaction: '白湯派',
    packageType: 'BAG',
    imageUrl: '/images/products/kkokko-myeon.jpg',
    isVintagePhoto: false,
    historicalRole: '백탕의 난 영수',
    doctrineQuote: '“하얀 국물에 청양고추의 알싸한 반전, 30년 빨간 국물의 벽을 깨다”',
    editorialNote: '2011년 방송 요리대회에서 이경규의 레시피를 상용화. 출시 5개월 만에 1억 개를 판매하며 대한민국 라면 시장을 일시적으로 백탕 천하로 만든 혁명적 사건.',
    canvasX: 1050,
    canvasY: 400
  },
  {
    id: 'nagasaki-jjamppong',
    name: '나가사끼 짬뽕',
    brand: '나가사끼',
    manufacturer: '삼양식품',
    releaseYear: 2011,
    epochId: 'epoch-5',
    factionId: 'white-broth-rebel',
    factionName: '해물 백짬뽕계',
    hanjaFaction: '白湯派',
    packageType: 'BAG',
    imageUrl: '/images/products/nagasaki-jjamppong.jpg',
    isVintagePhoto: false,
    historicalRole: '백탕 연합군',
    doctrineQuote: '“돼지뼈와 해물의 진한 백탕에 청양고추 칼칼함의 배합”',
    editorialNote: '꼬꼬면과 함께 2011년 백탕 신드롬의 양대 축. 삼양식품의 부활을 알렸으며 진한 육수와 칼칼한 해물맛으로 겨울철 백탕 열풍을 이끌었다.',
    canvasX: 1050,
    canvasY: 490
  },

  // --- 비탕파: 춘장 짜장계 (炸醬派) ---
  {
    id: 'chapagetti',
    name: '짜파게티',
    brand: '짜파게티',
    manufacturer: '농심',
    releaseYear: 1984,
    epochId: 'epoch-3',
    factionId: 'jjajang-chunjang',
    factionName: '정통 춘장 짜장계',
    hanjaFaction: '炸醬派',
    packageType: 'BAG',
    imageUrl: '/images/products/chapagetti.jpg',
    isVintagePhoto: false,
    historicalRole: '춘장 천하통일',
    doctrineQuote: '“일요일은 내가 짜파게티 요리사, 과립 춘장스프와 올리브유의 혁신”',
    editorialNote: '1984년 3월 출시. 기존 액상 짜장면의 뭉침 현상을 그래뉼(과립) 공법으로 해결하고 올리브유 조미유를 더해 40년간 짜장라면 시장의 90%를 지배했다.',
    canvasX: 330,
    canvasY: 800
  },
  {
    id: 'spicy-chapagetti',
    name: '사천 짜파게티',
    brand: '짜파게티',
    manufacturer: '농심',
    releaseYear: 2000,
    epochId: 'epoch-4',
    factionId: 'jjajang-chunjang',
    factionName: '매운 사천 춘장계',
    hanjaFaction: '炸醬派',
    packageType: 'BAG',
    imageUrl: '/images/products/spicy-chapagetti.jpg',
    isVintagePhoto: false,
    historicalRole: '매콤 사천 분파',
    doctrineQuote: '“고추기름과 해물 풍미를 더해 느끼함을 잡은 사천식 짜장”',
    editorialNote: '2000년 출시. 오리지널 짜파게티에 매콤한 고추기름과 해물 풍미를 결합하여 느끼한 뒷맛을 쇄신, 성인층의 입맛을 사로잡은 장수 분파.',
    canvasX: 810,
    canvasY: 800
  },

  // --- 비탕파: 냉비빔계 (冷排派) ---
  {
    id: 'paldo-bibim',
    name: '팔도비빔면',
    brand: '팔도비빔면',
    manufacturer: '팔도',
    releaseYear: 1984,
    epochId: 'epoch-3',
    factionId: 'bibim-cold',
    factionName: '초고추장 냉비빔계',
    hanjaFaction: '冷排派',
    packageType: 'BAG',
    imageUrl: '/images/products/paldo-bibim.jpg',
    isVintagePhoto: false,
    historicalRole: '냉비빔 창설',
    doctrineQuote: '“오른손으로 비비고 왼손으로 비비고, 찬물에 헹궈 먹는 여름의 전설”',
    editorialNote: '1984년 6월 출시. 뜨거운 국물 일색이던 라면 시장에 ‘찬물에 헹궈 비벼 먹는다’는 충격적인 발상을 도입하여 40년간 비빔면 시장 점유율 1위를 수성했다.',
    canvasX: 330,
    canvasY: 920
  },
  {
    id: 'baehongdong',
    name: '배홍동 비빔면',
    brand: '배홍동',
    manufacturer: '농심',
    releaseYear: 2021,
    epochId: 'epoch-6',
    factionId: 'bibim-cold',
    factionName: '과채 숙성 비빔계',
    hanjaFaction: '冷排派',
    packageType: 'BAG',
    imageUrl: '/images/products/baehongdong.jpg',
    isVintagePhoto: false,
    historicalRole: '신흥 대항마',
    doctrineQuote: '“배, 홍고추, 동치미를 갈아 넣어 더 새콤달콤한 비빔의 신흥 강자”',
    editorialNote: '2021년 농심이 팔도의 독주를 저지하기 위해 출시. 배·홍고추·동치미 숙성 비빔장과 넉넉한 소스 양으로 3년 만에 시장 2위로 도약했다.',
    canvasX: 1280,
    canvasY: 920
  },

  // --- 비탕파: 화마 매운볶음계 (火魔派) & 퓨전계 (融合派) ---
  {
    id: 'buldak-original',
    name: '불닭볶음면',
    brand: '불닭볶음면',
    manufacturer: '삼양식품',
    releaseYear: 2012,
    epochId: 'epoch-6',
    factionId: 'fire-bokkeum',
    factionName: '화마 매운볶음계',
    hanjaFaction: '火魔派',
    packageType: 'BAG',
    imageUrl: '/images/products/buldak-original.png',
    isVintagePhoto: false,
    historicalRole: '화마 강림',
    doctrineQuote: '“국물 없이 졸여내는 4404 SHU의 불지옥, K-라면 세계 정복의 기수”',
    editorialNote: '2012년 4월 출시. 초기엔 너무 매워 실패작 소리를 들었으나 유튜브 ‘Fire Noodle Challenge’를 통해 전 세계적 문화 현상으로 폭발, 삼양식품을 시총 5조 대기업으로 이끌었다.',
    canvasX: 1050,
    canvasY: 780
  },
  {
    id: 'carbo-buldak',
    name: '까르보불닭볶음면',
    brand: '불닭볶음면',
    manufacturer: '삼양식품',
    releaseYear: 2017,
    epochId: 'epoch-6',
    factionId: 'cream-fusion',
    factionName: '크림·치즈 퓨전계',
    hanjaFaction: '融合派',
    packageType: 'BAG',
    imageUrl: '/images/products/carbo-buldak.png',
    isVintagePhoto: false,
    historicalRole: '크림 퓨전 혁명',
    doctrineQuote: '“매운 불닭에 부드러운 크림과 모짜렐라 치즈의 황금 배합”',
    editorialNote: '2017년 12월 10억 개 판매 기념 한정판으로 출시 후 역대급 대히트를 기록하며 정식 출시. 매운맛에 약한 서양인과 Z세대를 불닭 신도로 끌어들인 퓨전의 정점.',
    canvasX: 1280,
    canvasY: 730
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
    hanjaFaction: '融合派',
    packageType: 'BAG',
    imageUrl: '/images/products/shin-toomba.jpg',
    isVintagePhoto: false,
    historicalRole: '투움바 집대성',
    doctrineQuote: '“신라면의 칼칼한 매운맛에 생크림, 치즈를 더한 투움바 파스타의 공식화”',
    editorialNote: '인터넷 모디슈머 인기 레시피인 ‘신라면 투움바’를 농심이 공식 제품화. 2024년 가을 출시 후 2개월 만에 1100만 개를 판매하며 비국물 퓨전계의 주류성을 입증했다.',
    canvasX: 1280,
    canvasY: 820
  }
];

export const LINEAGE_LEGEND_NODES: LineageLegendNode[] = RAW_LINEAGE_LEGEND_NODES.map((n) => ({
  ...n,
  imageUrl: getAssetUrl(n.imageUrl),
}));

// ================= 4. 계보도 연결선 (Edges & Historical Branches) =================
export const LINEAGE_EDGES: LineageEdge[] = [
  // 1. 삼양라면 -> 안성탕면 (맛의 패러다임 이동: 닭육수 백탕 -> 소고기 장국)
  {
    id: 'edge-samyang-anseong',
    fromId: 'samyang-chicken-1963',
    toId: 'anseongtangmyeon',
    relationType: 'FACTION_SPLIT',
    label: '1983 장국 혁신',
    year: 1983,
    narrative: '닭고기 백탕 중심이던 초기 시장에서 한국인 전통의 된장·소고기 우거지장국으로 맛의 중심축 이동',
    factionColor: '#d97706'
  },
  // 2. 안성탕면 -> 신라면 (정통 소고기 국물의 얼큰 극대화)
  {
    id: 'edge-anseong-shin',
    fromId: 'anseongtangmyeon',
    toId: 'shin-ramyun',
    relationType: 'DIRECT_LINEAGE',
    label: '1986 辛라면 집권',
    year: 1986,
    narrative: '소고기 장국의 감칠맛에 고춧가루와 표고버섯의 매운맛을 폭발시켜 대한민국 라면의 40년 절대 권력 수립',
    factionColor: '#dc2626'
  },
  // 3. 신라면 vs 진라면 매운맛 (동시대 역사적 호적수)
  {
    id: 'edge-shin-jin',
    fromId: 'shin-ramyun',
    toId: 'jin-ramen-spicy',
    relationType: 'HISTORICAL_RIVALRY',
    label: '1988 영구적 라이벌',
    year: 1988,
    narrative: '신라면의 독주에 맞서 오뚜기 진라면이 부드럽고 진한 소고기 육수로 맞서며 형성된 라면사의 영구적 양강 대결',
    factionColor: '#2563eb'
  },
  // 4. 안성탕면 -> 육개장사발면 (소고기 육수의 사발면화)
  {
    id: 'edge-anseong-yukgaejang',
    fromId: 'anseongtangmyeon',
    toId: 'yukgaejang-sabal',
    relationType: 'FACTION_SPLIT',
    label: '1982 사발면 개척',
    year: 1982,
    narrative: '얼큰한 소고기 육개장 풍미를 얇은 꼬들면과 원형 용기에 담아 컵라면 1위 제국 건립',
    factionColor: '#e11d48'
  },
  // 5. 신라면 -> 신라면 건면 (건면 웰빙화)
  {
    id: 'edge-shin-nonfrying',
    fromId: 'shin-ramyun',
    toId: 'shin-non-frying',
    relationType: 'DIRECT_LINEAGE',
    label: '2019 건면 계승',
    year: 2019,
    narrative: '신라면 고유의 얼큰한 육수를 보존하며 비유탕 건면으로 칼로리를 350kcal로 혁신',
    factionColor: '#dc2626'
  },
  // 6. 신라면 -> 신라면 더 레드 (스코빌 극대화)
  {
    id: 'edge-shin-thered',
    fromId: 'shin-ramyun',
    toId: 'shin-the-red',
    relationType: 'DIRECT_LINEAGE',
    label: '2023 스코빌 2배 반격',
    year: 2023,
    narrative: '기존 신라면의 2배가 넘는 7500 SHU와 고기 고명을 더해 극초매운계 시장을 재평정',
    factionColor: '#991b1b'
  },

  // 7. 신라면 -> 열라면 (극초매운계의 반역)
  {
    id: 'edge-shin-yeol',
    fromId: 'shin-ramyun',
    toId: 'yeol-ramyun',
    relationType: 'REVOLUTIONARY_SCHISM',
    label: '1996 매운맛 반역',
    year: 1996,
    narrative: '신라면의 매운맛에 만족하지 못하는 마니아층을 겨냥해 5000 SHU 청양고추 칼칼함으로 극초매운계 개척',
    factionColor: '#b91c1c'
  },
  // 8. 열라면 -> 틈새라면 (골목 분식의 극강 스코빌)
  {
    id: 'edge-yeol-teumsae',
    fromId: 'yeol-ramyun',
    toId: 'teumsae-bbalggyettok',
    relationType: 'FACTION_SPLIT',
    label: '2009 9413 SHU 돌파',
    year: 2009,
    narrative: '명동 골목 빨계떡 레시피로 시판 라면 최고 스코빌을 기록하며 매운맛 경쟁의 극한을 시현',
    factionColor: '#7f1d1d'
  },
  // 9. 열라면 -> 마열라면 (마늘후추 융합)
  {
    id: 'edge-yeol-mayeol',
    fromId: 'yeol-ramyun',
    toId: 'ma-yeol',
    relationType: 'DIRECT_LINEAGE',
    label: '2023 마늘·후추 융합',
    year: 2023,
    narrative: '열라면의 매운 베이스에 마늘과 굵은 흑후추를 더해 알싸한 감칠맛으로 진화',
    factionColor: '#b91c1c'
  },

  // 10. 삼양라면 -> 너구리 (해물파의 분당)
  {
    id: 'edge-samyang-neoguri',
    fromId: 'samyang-chicken-1963',
    toId: 'neoguri',
    relationType: 'FACTION_SPLIT',
    label: '1982 해물계 분당',
    year: 1982,
    narrative: '육고기 국물 일색을 탈피하여 통다시마와 굵은 우동면으로 바다의 해물 라면 붕당 창설',
    factionColor: '#0284c7'
  },
  // 11. 너구리 -> 오징어짬뽕 (해물 짬뽕의 대중화)
  {
    id: 'edge-neoguri-ojingeo',
    fromId: 'neoguri',
    toId: 'ojingeo-jjamppong',
    relationType: 'FACTION_SPLIT',
    label: '1992 중화 짬뽕화',
    year: 1992,
    narrative: '시원한 해물 육수에 불맛과 오징어 건더기를 더해 중화 짬뽕을 대중 라면으로 승격',
    factionColor: '#ea580c'
  },
  // 12. 너구리 -> 멸치칼국수 (해물 맑은 장국)
  {
    id: 'edge-neoguri-kalguksu',
    fromId: 'neoguri',
    toId: 'myeolchi-kalguksu',
    relationType: 'FACTION_SPLIT',
    label: '1997 멸치 어육 건면',
    year: 1997,
    narrative: '빨간 해물탕에서 벗어나 남해안 멸치와 무의 맑고 투명한 감칠맛으로 승부',
    factionColor: '#0891b2'
  },
  // 13. 오징어짬뽕 -> 진짬뽕 (프리미엄 짬뽕 대전)
  {
    id: 'edge-ojingeo-jinjjamppong',
    fromId: 'ojingeo-jjamppong',
    toId: 'jin-jjamppong',
    relationType: 'REVOLUTIONARY_SCHISM',
    label: '2015 불맛 짬뽕 대전',
    year: 2015,
    narrative: '불맛 유성스프와 극후면으로 라면 시장의 가격 상한선과 맛의 눈높이를 완전히 바꾼 혁명',
    factionColor: '#c2410c'
  },

  // 14. 삼양라면 -> 사리곰탕면 (우골 사골 백탕 분화)
  {
    id: 'edge-samyang-gomtang',
    fromId: 'samyang-chicken-1963',
    toId: 'sari-gomtang',
    relationType: 'FACTION_SPLIT',
    label: '1988 사골 백탕 창설',
    year: 1988,
    narrative: '매운맛 경쟁 속에서 전통 곰탕의 깊은 뼈국물을 즉석면으로 재현한 백탕 명작',
    factionColor: '#d97706'
  },
  // 15. 사리곰탕면 -> 스낵면 (담백 밥말이계)
  {
    id: 'edge-gomtang-snack',
    fromId: 'sari-gomtang',
    toId: 'snack-myeon',
    relationType: 'FACTION_SPLIT',
    label: '1992 밥말이 명작',
    year: 1992,
    narrative: '얇은 면발과 자극 없는 맑은 소고기 육수로 밥 말았을 때 최고의 조화를 완성',
    factionColor: '#b45309'
  },

  // 16. 삼양라면 -> 꼬꼬면 (백탕의 난)
  {
    id: 'edge-samyang-kokomen',
    fromId: 'samyang-chicken-1963',
    toId: 'kkokko-myeon',
    relationType: 'REVOLUTIONARY_SCHISM',
    label: '2011 백탕의 난',
    year: 2011,
    narrative: '원조 닭육수의 유산을 청양고추 알싸함과 결합해 30년 빨간 국물 독재를 뒤흔든 사건',
    factionColor: '#10b981'
  },
  // 17. 꼬꼬면 -> 나가사끼짬뽕 (백탕 연합군)
  {
    id: 'edge-koko-nagasaki',
    fromId: 'kkokko-myeon',
    toId: 'nagasaki-jjamppong',
    relationType: 'HISTORICAL_RIVALRY',
    label: '2011 백탕 연합군',
    year: 2011,
    narrative: '닭고기 백탕(꼬꼬면)과 해물 돈골 백짬뽕(나가사끼)이 손잡고 라면 시장 점유율 15%를 강타',
    factionColor: '#059669'
  },

  // 18. 삼양라면 -> 짜파게티 (비탕파 춘장 분당)
  {
    id: 'edge-samyang-chapagetti',
    fromId: 'samyang-chicken-1963',
    toId: 'chapagetti',
    relationType: 'FACTION_SPLIT',
    label: '1984 춘장 비탕파 창설',
    year: 1984,
    narrative: '국물을 버리고 비벼 먹는 과립 춘장 기술을 도입하여 40년 짜장라면 왕국 개창',
    factionColor: '#451a03'
  },
  // 19. 짜파게티 -> 사천 짜파게티 (매콤 사천 분파)
  {
    id: 'edge-chapa-spicychapa',
    fromId: 'chapagetti',
    toId: 'spicy-chapagetti',
    relationType: 'DIRECT_LINEAGE',
    label: '2000 매운 사천화',
    year: 2000,
    narrative: '기존 짜장의 느끼함을 고추기름과 해물로 쇄신해 성인층 타깃 분파로 확장',
    factionColor: '#78350f'
  },

  // 20. 삼양라면 -> 팔도비빔면 (비탕파 냉비빔 분당)
  {
    id: 'edge-samyang-paldo',
    fromId: 'samyang-chicken-1963',
    toId: 'paldo-bibim',
    relationType: 'FACTION_SPLIT',
    label: '1984 냉비빔 혁명',
    year: 1984,
    narrative: '찬물에 면을 헹궈 초고추장에 비벼 먹는 역발상으로 사계절 비빔면 시장을 창조',
    factionColor: '#ea580c'
  },
  // 21. 팔도비빔면 vs 배홍동 (신구 비빔 대전)
  {
    id: 'edge-paldo-baehongdong',
    fromId: 'paldo-bibim',
    toId: 'baehongdong',
    relationType: 'HISTORICAL_RIVALRY',
    label: '2021 비빔 패권 전쟁',
    year: 2021,
    narrative: '팔도의 40년 아성에 배·홍고추·동치미 과채 비빔장으로 농심이 정면 도전장을 투척',
    factionColor: '#ea580c'
  },

  // 22. 신라면/열라면 매운맛 -> 불닭볶음면 (화마 매운볶음면 집권)
  {
    id: 'edge-spicy-buldak',
    fromId: 'yeol-ramyun',
    toId: 'buldak-original',
    relationType: 'REVOLUTIONARY_SCHISM',
    label: '2012 화마(火魔) 강림',
    year: 2012,
    narrative: '국물 없이 면을 바짝 볶아 혀를 마비시키는 4404 SHU 극강의 맛으로 글로벌 바이럴 신드롬 점화',
    factionColor: '#e11d48'
  },
  // 23. 불닭볶음면 -> 까르보불닭 (크림 퓨전 혁명)
  {
    id: 'edge-buldak-carbo',
    fromId: 'buldak-original',
    toId: 'carbo-buldak',
    relationType: 'DIRECT_LINEAGE',
    label: '2017 크림 퓨전 혁명',
    year: 2017,
    narrative: '매운 불닭에 부드러운 모짜렐라 치즈와 크림을 더해 전 세계 여성과 Z세대를 열광시킨 메가히트',
    factionColor: '#db2777'
  },
  // 24. 신라면/짜파게티 모디슈머 -> 신라면 툼바 (매콤 투움바 퓨전)
  {
    id: 'edge-shin-toomba',
    fromId: 'shin-ramyun',
    toId: 'shin-toomba',
    relationType: 'FACTION_SPLIT',
    label: '2024 투움바 퓨전 공식화',
    year: 2024,
    narrative: 'SNS를 달군 신라면 투움바 파스타 레시피를 농심이 공식화하며 비국물 퓨전계의 주류화 완성',
    factionColor: '#e11d48'
  }
];

// ================= 5. 10대 계파 연대기 상세 (Faction Chronicles) =================
export const FACTION_CHRONICLES: FactionChronicle[] = [
  {
    id: 'root-chicken',
    name: '원조 닭고기 백탕계',
    hanja: '始原鷄湯派',
    themeColor: { primary: '#b45309', bg: '#fef3c7', text: '#78350f', border: '#f59e0b' },
    riseDecade: '1960년대',
    hegemonyStatus: 'HISTORIC_ORIGIN',
    summary: '1963년 삼양라면에서 출발한 한국 라면의 단일 조종(祖宗). 닭육수와 소기름(우지)으로 서민을 구제한 시원.',
    doctrine: '“배고픈 서민의 한 끼를 책임지는 10원의 즉석 영양식이 라면의 태생적 소명이다.”',
    chronicleStory: [
      '1963년 9월 15일, 삼양식품 전중윤 회장이 남대문 시장의 ‘꿀꿀이죽’ 행렬을 보고 10원짜리 삼양라면을 출시하며 역사 개막.',
      '초기 일본 명성식품에서 들여온 닭고기 육수 백탕 레시피로 제조되었으며, 당시 쌀 중심 식문화 속에 정부의 혼분식 장려 운동과 맞물려 폭발적 보급.',
      '1970년대 후반 국민 소득 증가와 함께 소고기·고춧가루의 얼큰한 맛으로 주류가 교체되며 역사적 시원으로 물러남.'
    ],
    flagshipIds: ['samyang-chicken-1963']
  },
  {
    id: 'spicy-beef',
    name: '정통 소고기 얼큰계',
    hanja: '辛牛派',
    themeColor: { primary: '#dc2626', bg: '#fef2f2', text: '#991b1b', border: '#ef4444' },
    riseDecade: '1980년대',
    hegemonyStatus: 'RULING',
    summary: '안성탕면(1983)과 신라면(1986)으로 완성된 대한민국 라면의 40년 절대 종손(宗孫)이자 주류 정권.',
    doctrine: '“얼큰하고 칼칼한 소고기 국물과 쫄깃한 면발이야말로 대한민국 라면의 변치 않는 황금률이다.”',
    chronicleStory: [
      '1983년 안성탕면이 시골 소고기 우거지장국 맛으로 1980년대 초반 시장을 장악하며 소고기 육수 시대를 개막.',
      '1986년 10월, 고춧가루와 표고버섯의 얼큰함을 전면에 내건 신라면이 집권하며 40년간 라면 시장 1위 제국을 형성.',
      '1988년 오뚜기 진라면 매운맛이 등장하여 양강 체제를 확립, 2019년 건면과 2023년 신라면 더 레드로 진화하며 여전히 시장의 중심을 장악.'
    ],
    flagshipIds: ['shin-ramyun', 'anseongtangmyeon', 'jin-ramen-spicy', 'yukgaejang-sabal', 'shin-non-frying', 'shin-the-red']
  },
  {
    id: 'seafood-ocean',
    name: '해물 시원계',
    hanja: '海鮮派',
    themeColor: { primary: '#0284c7', bg: '#f0f9ff', text: '#075985', border: '#38bdf8' },
    riseDecade: '1982년',
    hegemonyStatus: 'MAINSTREAM',
    summary: '1982년 너구리가 완도 다시마로 창설한 바다의 계파. 1992년 오징어짬뽕을 거쳐 2015년 진짬뽕으로 만개.',
    doctrine: '“육고기의 기름진 텁텁함을 씻어내는 바다의 청량한 감칠맛과 두툼한 면발의 조화.”',
    chronicleStory: [
      '1982년 농심 너구리가 우동 굵기의 두툼한 면발과 완도산 다시마를 통째로 넣으며 소고기 일색이던 시장에 최초로 해물 붕당 창설.',
      '1992년 오징어짬뽕이 칼칼한 중화풍 오징어 건더기를 앞세워 짬뽕 라면의 원류를 정립.',
      '2015년 오뚜기 진짬뽕이 불맛 유성스프와 극후면으로 대흥행하며 1500원대 프리미엄 라면 시대를 열고 주류 세력으로 도약.'
    ],
    flagshipIds: ['neoguri', 'ojingeo-jjamppong', 'myeolchi-kalguksu', 'jin-jjamppong']
  },
  {
    id: 'bone-broth',
    name: '사골·우골 구수계',
    hanja: '牛骨派',
    themeColor: { primary: '#d97706', bg: '#fffbeb', text: '#92400e', border: '#f59e0b' },
    riseDecade: '1988년',
    hegemonyStatus: 'COEXISTING',
    summary: '사리곰탕면(1988)과 스낵면(1992)으로 대표되는 고춧가루 없는 순한 보신 국물의 계파.',
    doctrine: '“자극적인 매운맛에 기대지 않고 오직 뼈를 푹 고아낸 구수함으로 밥을 부른다.”',
    chronicleStory: [
      '1988년 서울올림픽 개최에 맞춰 한식 대표 보양식인 곰탕을 즉석면화한 사리곰탕면이 출시되며 백탕 보신계의 종손으로 안착.',
      '1992년 오뚜기 스낵면이 2분 완성 얇은 면발과 슴슴한 육수로 ‘밥 말아먹을 때 가장 맛있는 라면’ 1위에 선정되며 롱런.',
      '어린이, 노년층 및 매운맛을 기피하는 대중들의 든든한 안식처로 견고하게 공존.'
    ],
    flagshipIds: ['sari-gomtang', 'snack-myeon']
  },
  {
    id: 'white-broth-rebel',
    name: '백탕 혁명계',
    hanja: '白湯派',
    themeColor: { primary: '#059669', bg: '#ecfdf5', text: '#065f46', border: '#34d399' },
    riseDecade: '2011년',
    hegemonyStatus: 'EXPEDITIONARY',
    summary: '2011년 꼬꼬면과 나가사끼짬뽕이 일으킨 백탕의 난. 빨간 국물 30년 독재를 기습했던 전설적 혁명군.',
    doctrine: '“하얗다고 순하지 않다. 맑은 국물 속 청양고추의 알싸한 칼칼함이 기존 관념을 뒤엎는다.”',
    chronicleStory: [
      '2011년 여름 KBS ‘남자의 자격’ 라면 요리대회에서 이경규의 레시피로 탄생한 꼬꼬면이 출시 5개월 만에 1억 개 판매 돌파.',
      '삼양식품 나가사끼짬뽕이 가세하며 백탕 라면의 시장 점유율이 15%를 넘어서는 초유의 ‘하얀 국물 신드롬’ 발생.',
      '기존 라면 업계의 반격과 소비자 피로도로 1년 만에 주류에서는 퇴각했으나, 한국 라면의 맛 스펙트럼을 넓힌 결정적 변곡점으로 기록됨.'
    ],
    flagshipIds: ['kokomen', 'nagasaki-jjamppong']
  },
  {
    id: 'jjajang-chunjang',
    name: '정통 춘장 짜장계',
    hanja: '炸醬派',
    themeColor: { primary: '#451a03', bg: '#fef3c7', text: '#292524', border: '#78350f' },
    riseDecade: '1984년',
    hegemonyStatus: 'MAINSTREAM',
    summary: '1984년 짜파게티가 과립 춘장스프로 창설한 비탕파의 맹주. 40년간 짜장라면 시장의 절대권력.',
    doctrine: '“일요일은 내가 짜파게티 요리사. 고소한 춘장과 올리브유가 빚어내는 비탕의 정수.”',
    chronicleStory: [
      '1984년 3월 농심 짜파게티 출시. 물에 잘 풀어지는 과립형 춘장스프와 올리브유 조미유로 비탕 라면 시장을 개척.',
      '2000년 매운맛을 결합한 사천 짜파게티, 2013년 ‘짜파구리’ 모디슈머 열풍을 거치며 국민적 소울푸드로 격상.',
      '2024년 40주년을 맞아 건면을 채택한 ‘짜파게티 더 블랙’을 선보이며 진화를 거듭하는 중.'
    ],
    flagshipIds: ['chapagetti', 'spicy-chapagetti']
  },
  {
    id: 'bibim-cold',
    name: '초고추장 냉비빔계',
    hanja: '冷排派',
    themeColor: { primary: '#ea580c', bg: '#fff7ed', text: '#9a3412', border: '#fb923c' },
    riseDecade: '1984년',
    hegemonyStatus: 'MAINSTREAM',
    summary: '1984년 팔도비빔면이 창설한 찬물 헹굼 비빔면의 세계. 2021년 농심 배홍동과의 패권 다툼으로 진화.',
    doctrine: '“오른손으로 비비고 왼손으로 비비고, 여름철 입맛을 돋우는 새콤달콤 매콤한 유혹.”',
    chronicleStory: [
      '1984년 6월 팔도비빔면 출시. 라면을 차가운 물에 헹궈 매콤달콤한 비빔장에 비벼 먹는 사계절 냉라면 시장을 개척.',
      '40여 년간 시장 점유율 60~70%를 수성하며 비빔면의 대명사로 확고부동한 위치 유지.',
      '2021년 농심 배홍동 비빔면이 배·홍고추·동치미를 앞세워 맹렬히 추격하며 뜨거운 양강 비빔 대전 전개 중.'
    ],
    flagshipIds: ['paldo-bibimmyeon', 'baehongdong']
  },
  {
    id: 'fire-bokkeum',
    name: '화마 매운볶음계',
    hanja: '火魔派',
    themeColor: { primary: '#e11d48', bg: '#ffe4e6', text: '#881337', border: '#f43f5e' },
    riseDecade: '2012년',
    hegemonyStatus: 'RULING',
    summary: '2012년 불닭볶음면의 출현으로 촉발된 글로벌 화마. 국물 없는 매운 볶음면의 세계 패권 장악.',
    doctrine: '“국물 없이 바짝 졸인 화끈한 닭고기 매운맛으로 전 세계인의 입안을 태운다.”',
    chronicleStory: [
      '2012년 4월 삼양식품 불닭볶음면 출시. 초기엔 지나친 매운맛으로 외면당했으나 유튜브 먹방 챌린지를 통해 전 세계적 바이럴 신드롬 점화.',
      '핵불닭, 치즈, 4치즈, 야키소바, 하바네로라임 등 무수한 파생작을 거느리며 삼양식품의 주가를 수십 배 견인.',
      '라면을 단순한 식사에서 ‘놀이이자 문화’로 전환시킨 K-라면 세계화의 선봉장.'
    ],
    flagshipIds: ['buldak-original']
  },
  {
    id: 'extreme-spicy',
    name: '극초매운계',
    hanja: '極辛派',
    themeColor: { primary: '#991b1b', bg: '#fef2f2', text: '#450a0a', border: '#b91c1c' },
    riseDecade: '1996년',
    hegemonyStatus: 'MAINSTREAM',
    summary: '열라면(1996)과 틈새라면(2009)으로 신라면의 매운맛을 뛰어넘은 캡사이신 지옥의 전사들.',
    doctrine: '“맛있는 매운맛을 넘어선 얼얼한 통각의 카타르시스, 스코빌 수치가 계급이다.”',
    chronicleStory: [
      '1996년 열라면이 5000 SHU 매운맛을 내걸고 신라면 중심의 매운맛 상한선에 도전.',
      '2009년 팔도 틈새라면 빨계떡이 9413 SHU를 돌파하며 본격적인 ‘스코빌 전쟁’을 촉발.',
      '2023년 신라면 더 레드(7500 SHU)와 마열라면의 출시로 메이저 제조사들이 전면 참전하며 극초매운맛이 니치가 아닌 대세로 정착.'
    ],
    flagshipIds: ['yeol-ramyun', 'teumsae-ramen', 'shin-the-red', 'ma-yeol']
  },
  {
    id: 'cream-fusion',
    name: '크림 퓨전계',
    hanja: '融合派',
    themeColor: { primary: '#db2777', bg: '#fdf2f8', text: '#831843', border: '#f472b6' },
    riseDecade: '2017년',
    hegemonyStatus: 'MAINSTREAM',
    summary: '까르보불닭(2017)과 신라면 툼바(2024)가 이끄는 로제·크림·치즈와 매운맛의 현대적 융합.',
    doctrine: '“매운맛의 날을 크림과 치즈로 감싸 안아 남녀노소 국경 없이 매혹한다.”',
    chronicleStory: [
      '2017년 12월 불닭 10억 개 돌파 한정판으로 출시된 까르보불닭볶음면이 폭발적 인기로 정식 출시되며 크림 퓨전계 창설.',
      '모짜렐라 치즈와 크림 분말을 매운 소스와 결합하여 매운맛에 취약한 서양인과 Z세대를 완벽히 포섭.',
      '2024년 신라면 툼바가 대히트하며 크림 퓨전은 단발성 유행이 아닌 독자적인 대세 붕당으로 격상.'
    ],
    flagshipIds: ['carbo-buldak', 'shin-toomba']
  }
];

// Helper to get all products belonging to a faction
export function getHistoricalFactionProducts(factionId: string): RamenProduct[] {
  const faction = FACTION_CHRONICLES.find(f => f.id === factionId);
  if (!faction) return [];

  // Match products by brand, faction keywords, or explicit mapping
  return RAMEN_DATASET.filter(p => {
    if (faction.flagshipIds.includes(p.id)) return true;
    
    // Broad membership rules
    if (factionId === 'root-chicken') {
      return p.brand === '삼양라면' && (p.name.includes('1963') || p.id.includes('1963'));
    }
    if (factionId === 'spicy-beef') {
      return (p.brand === '신라면' && !p.id.includes('toomba') && !p.id.includes('the-red')) ||
             (p.brand === '진라면' && p.name.includes('매운')) ||
             p.brand === '안성탕면' || p.brand === '육개장';
    }
    if (factionId === 'seafood-ocean') {
      return p.brand === '너구리' || p.brand === '오징어짬뽕' || p.brand === '진짬뽕' || p.name.includes('칼국수') || p.brothType === 'SEAFOOD';
    }
    if (factionId === 'bone-broth') {
      return p.brand === '사리곰탕' || p.brand === '스낵면' || (p.brand === '진라면' && p.name.includes('순한'));
    }
    if (factionId === 'white-broth-rebel') {
      return p.name.includes('꼬꼬면') || p.name.includes('나가사끼') || p.name.includes('백면') || p.name.includes('백짬뽕');
    }
    if (factionId === 'jjajang-chunjang') {
      return p.brothType === 'JJAJANG' || p.brothType === 'DRY_JJAJANG' || p.brand === '짜파게티' || p.brand === '짜왕' || p.brand === '진짜장';
    }
    if (factionId === 'bibim-cold') {
      return p.productType === 'BIBIM' || p.brand === '팔도비빔면' || p.brand === '배홍동';
    }
    if (factionId === 'fire-bokkeum') {
      return p.brand === '불닭볶음면' && !p.id.includes('carbo') && !p.id.includes('cheese');
    }
    if (factionId === 'extreme-spicy') {
      return p.brand === '열라면' || p.brand === '틈새라면' || p.id.includes('the-red') || (p.spiciness.scovilleShu && p.spiciness.scovilleShu >= 5000);
    }
    if (factionId === 'cream-fusion') {
      return p.id.includes('carbo') || p.id.includes('cheese') || p.id.includes('toomba') || p.id.includes('rose');
    }

    return false;
  });
}
