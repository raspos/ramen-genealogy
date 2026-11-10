import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from './ramenDataset';

export interface FactionNode {
  id: string;
  name: string;
  hanja: string;
  parentBranchId: 'SOUP' | 'NON_SOUP' | 'ROOT';
  subCategory: string;
  summary: string;
  doctrine: string; // 붕당 이념
  themeColor: {
    border: string;
    bg: string;
    text: string;
    badge: string;
  };
  representativeIds: string[]; // 1~3 대표 라면 ID
}

export const FACTION_TAXONOMY: FactionNode[] = [
  // ================= 1. 국물파 > 얼큰계 =================
  {
    id: 'spicy-beef',
    name: '소고기·표고 정통계',
    hanja: '辛牛派',
    parentBranchId: 'SOUP',
    subCategory: '얼큰계',
    summary: '진한 소고기 육수에 칼칼한 고춧가루와 표고버섯의 풍미가 어우러진 대한민국 라면의 주류',
    doctrine: '“얼큰하고 칼칼한 소고기 국물이야말로 라면의 으뜸이자 근본이다.”',
    themeColor: {
      border: '#dc2626',
      bg: '#fef2f2',
      text: '#991b1b',
      badge: '#b91c1c'
    },
    representativeIds: ['shin-ramyun', 'anseongtangmyeon', 'jin-ramen-spicy', 'yeol-ramyun']
  },
  {
    id: 'spicy-seafood',
    name: '해물·칼칼 시원계',
    hanja: '辛海派',
    parentBranchId: 'SOUP',
    subCategory: '얼큰계',
    summary: '오징어, 홍합, 다시마 등 해산물 베이스에 얼큰한 고추 양념으로 시원한 속풀이를 이끄는 계열',
    doctrine: '“육고기의 기름진 맛을 벗어나 동해의 시원함과 칼칼함을 함께 취한다.”',
    themeColor: {
      border: '#ea580c',
      bg: '#fff7ed',
      text: '#9a3412',
      badge: '#c2410c'
    },
    representativeIds: ['neoguri', 'ojingeo-jjamppong', 'ilpum-seafood']
  },
  {
    id: 'spicy-kimchi',
    name: '김치·사발 찌개계',
    hanja: '辛泡派',
    parentBranchId: 'SOUP',
    subCategory: '얼큰계',
    summary: '발효 김치의 시큼털털한 감칠맛과 쇠고기 육개장의 묵직한 얼큰함이 결합된 사발면의 대표',
    doctrine: '“잘 익은 김치 한 점과 칼칼한 육개장 국물은 밥 한 숟갈을 절로 부른다.”',
    themeColor: {
      border: '#e11d48',
      bg: '#fff1f2',
      text: '#9f1239',
      badge: '#be123c'
    },
    representativeIds: ['yukgaejang-sabal', 'kimchi-sabal', 'gs25-gonghwachun-jjamppong']
  },

  // ================= 2. 국물파 > 담백·구수계 =================
  {
    id: 'mild-bone',
    name: '사골·우육 구수계',
    hanja: '醇骨派',
    parentBranchId: 'SOUP',
    subCategory: '담백계',
    summary: '고춧가루의 자극 없이 우사골과 쇠고기를 오래 우려낸 진하고 순한 국물의 계열',
    doctrine: '“자극적인 매운맛에 기대지 않고 오직 뼈와 고기를 고아낸 구수함으로 승부한다.”',
    themeColor: {
      border: '#d97706',
      bg: '#fffbeb',
      text: '#92400e',
      badge: '#b45309'
    },
    representativeIds: ['sari-gomtang', 'snack-myeon', 'jin-ramen-mild']
  },
  {
    id: 'mild-fish',
    name: '멸치·어육 맑은계',
    hanja: '醇魚派',
    parentBranchId: 'SOUP',
    subCategory: '담백계',
    summary: '남해안 멸치와 무, 다시마를 우려내어 텁텁하지 않고 담백·개운한 칼국수 스타일',
    doctrine: '“한 방울의 잡내 없이 맑고 투명한 감칠맛이 진정한 국물의 절제미이다.”',
    themeColor: {
      border: '#0891b2',
      bg: '#ecfeff',
      text: '#155e75',
      badge: '#0e7490'
    },
    representativeIds: ['myeolchi-kalguksu']
  },
  {
    id: 'mild-chicken',
    name: '닭·백탕 이단계',
    hanja: '白湯派',
    parentBranchId: 'SOUP',
    subCategory: '담백계',
    summary: '1963년 최초 치킨라면의 맥을 잇거나 청양고추 칼칼함을 더한 백색 짬뽕 돌풍의 주역',
    doctrine: '“붉지 않아도 맵고, 맑아도 깊은 풍미를 내니 이것이 바로 백탕의 반란이다.”',
    themeColor: {
      border: '#16a34a',
      bg: '#f0fdf4',
      text: '#166534',
      badge: '#15803d'
    },
    representativeIds: ['samyang-ramen', 'kkokko-myeon', 'nagasaki-jjamppong']
  },

  // ================= 3. 국물파 > 진한 육수계 =================
  {
    id: 'rich-jjamppong',
    name: '불맛·진짬뽕계',
    hanja: '濃火派',
    parentBranchId: 'SOUP',
    subCategory: '진한 육수계',
    summary: '유성스프의 그윽한 웍 불맛과 넓은 칼국수 면발, 풍성한 목이버섯 건더기의 프리미엄 짬뽕',
    doctrine: '“중화 화력의 불맛을 한 그릇에 담아 분식의 한계를 뛰어넘는다.”',
    themeColor: {
      border: '#c026d3',
      bg: '#fdf4ff',
      text: '#86198f',
      badge: '#a21caf'
    },
    representativeIds: ['jin-jjamppong', 'wang-lid-original']
  },
  {
    id: 'rich-craft',
    name: '자연·건면 특화계',
    hanja: '自然派',
    parentBranchId: 'SOUP',
    subCategory: '진한 육수계',
    summary: '바람에 말린 쫄깃한 건면과 로스팅한 자연 식재료 육수로 기름기를 뺀 현대 웰빙파',
    doctrine: '“튀기지 않고 자연 그대로 말린 면과 농축 액상 육수가 라면의 미래다.”',
    themeColor: {
      border: '#65a30d',
      bg: '#f7fee7',
      text: '#3f6212',
      badge: '#4d7c0f'
    },
    representativeIds: ['pulmuone-hongmyeon', 'shin-non-frying']
  },

  // ================= 4. 비국물파 > 짜장계 =================
  {
    id: 'dry-jjajang',
    name: '정통 볶음 짜장계',
    hanja: '黑醬派',
    parentBranchId: 'NON_SOUP',
    subCategory: '짜장계',
    summary: '물을 따라버리고 과립스프와 유성스프로 자작하게 비벼내는 일요일의 대명사',
    doctrine: '“국물을 버림으로써 얻는 소스의 농축된 감칠맛이야말로 비국물파의 적통이다.”',
    themeColor: {
      border: '#44403c',
      bg: '#fafaf9',
      text: '#292524',
      badge: '#1c1917'
    },
    representativeIds: ['chapagetti', 'jin-jjajang', 'chapagetti-the-black']
  },

  // ================= 5. 비국물파 > 비빔·냉면계 =================
  {
    id: 'dry-bibim',
    name: '새콤달콤 비빔면계',
    hanja: '冷拌派',
    parentBranchId: 'NON_SOUP',
    subCategory: '비빔계',
    summary: '찬물에 면을 차갑게 헹군 뒤 사과·배 농축 과일 양념장으로 비비는 여름철의 절대 강자',
    doctrine: '“뜨거운 국물을 거부하고 얼음물에 면을 씻어 새콤달콤함으로 입맛을 돋운다.”',
    themeColor: {
      border: '#2563eb',
      bg: '#eff6ff',
      text: '#1e40af',
      badge: '#1d4ed8'
    },
    representativeIds: ['paldo-bibim', 'baehongdong']
  },

  // ================= 6. 비국물파 > 볶음계 =================
  {
    id: 'dry-fire',
    name: '극강 매운 볶음계',
    hanja: '極辛派',
    parentBranchId: 'NON_SOUP',
    subCategory: '볶음계',
    summary: 'K-라면 신드롬의 중심. 4400 SHU 이상의 극한 캡사이신 액상소스로 바짝 볶아낸 불맛',
    doctrine: '“혀가 타는 듯한 강렬한 매운맛의 전율이야말로 현대 라면 혁명의 깃발이다.”',
    themeColor: {
      border: '#be123c',
      bg: '#fff1f2',
      text: '#881337',
      badge: '#9f1239'
    },
    representativeIds: ['buldak', 'haek-buldak']
  },
  {
    id: 'dry-cream',
    name: '크림·치즈 퓨전계',
    hanja: '和洋派',
    parentBranchId: 'NON_SOUP',
    subCategory: '볶음계',
    summary: '부드러운 크림 분말과 치즈, 토마토 파스타 소스를 결합해 매운맛을 부드럽게 감싼 퓨전파',
    doctrine: '“동양의 면과 서양의 크림·치즈가 융합되어 국경을 초월한 조화를 완성한다.”',
    themeColor: {
      border: '#f59e0b',
      bg: '#fffbeb',
      text: '#b45309',
      badge: '#d97706'
    },
    representativeIds: ['carbo-buldak', 'shin-toomba', 'ottogi-spaghetti']
  }
];

// Helper: match any RamenProduct to its closest FactionNode
export function getProductFaction(product: RamenProduct): FactionNode {
  // 1. Dry noodles
  if (product.productType === 'STIR_FRY' || product.productType === 'BIBIM') {
    if (product.flavorProfile.primaryFlavors.some(f => f.includes('짜장') || f.includes('춘장'))) {
      return FACTION_TAXONOMY.find(f => f.id === 'dry-jjajang')!;
    }
    if (product.productType === 'BIBIM' || product.flavorProfile.primaryFlavors.some(f => f.includes('비빔') || f.includes('과일') || f.includes('초고추장'))) {
      return FACTION_TAXONOMY.find(f => f.id === 'dry-bibim')!;
    }
    if (product.flavorProfile.primaryFlavors.some(f => f.includes('크림') || f.includes('치즈') || f.includes('투움바') || f.includes('스파게티'))) {
      return FACTION_TAXONOMY.find(f => f.id === 'dry-cream')!;
    }
    return FACTION_TAXONOMY.find(f => f.id === 'dry-fire')!;
  }

  // 2. Cold noodles
  if (product.productType === 'COLD') {
    return FACTION_TAXONOMY.find(f => f.id === 'dry-bibim')!;
  }

  // 3. Soup noodles
  if (product.flavorProfile.primaryFlavors.some(f => f.includes('짬뽕') || f.includes('불맛'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'rich-jjamppong')!;
  }
  if (product.noodleType === 'NON_FRIED' || product.flavorProfile.primaryFlavors.some(f => f.includes('건면') || f.includes('자연'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'rich-craft')!;
  }
  if (product.flavorProfile.primaryFlavors.some(f => f.includes('멸치') || f.includes('바지락') || f.includes('칼국수'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'mild-fish')!;
  }
  if (product.brothType === 'CHICKEN' || product.flavorProfile.primaryFlavors.some(f => f.includes('닭') || f.includes('백탕') || f.includes('치킨'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'mild-chicken')!;
  }
  if (product.brothType === 'PORK_BONE' || product.spiciness.spicinessGrade <= 1 || product.flavorProfile.primaryFlavors.some(f => f.includes('사골') || f.includes('곰탕') || f.includes('구수한'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'mild-bone')!;
  }
  if (product.flavorProfile.primaryFlavors.some(f => f.includes('김치') || f.includes('육개장') || f.includes('찌개') || f.includes('부대'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'spicy-kimchi')!;
  }
  if (product.brothType === 'SEAFOOD' || product.flavorProfile.primaryFlavors.some(f => f.includes('해물') || f.includes('해산물') || f.includes('오징어') || f.includes('새우'))) {
    return FACTION_TAXONOMY.find(f => f.id === 'spicy-seafood')!;
  }

  // Default soup: spicy beef
  return FACTION_TAXONOMY.find(f => f.id === 'spicy-beef')!;
}

// Map each faction to all its member products in RAMEN_DATASET
export function getFactionMembers(factionId: string): RamenProduct[] {
  return RAMEN_DATASET.filter(p => getProductFaction(p).id === factionId);
}
