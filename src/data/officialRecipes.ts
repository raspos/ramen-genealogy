import type { MixedRecipe } from '../types/ramen';

export interface OfficialRecipeDef {
  pairKey: string; // e.g. "chapagetti:neoguri" (sorted alphabetically)
  recipe: MixedRecipe;
  recommendationHook: string;
  expectedTaste: string;
}

export const OFFICIAL_RECIPES: Record<string, OfficialRecipeDef> = {
  'chapagetti:neoguri': {
    pairKey: 'chapagetti:neoguri',
    recommendationHook: '영화 기생충으로 전 세계를 사로잡은 대한민국 1호 공식 모디슈머 조합',
    expectedTaste: '진한 춘장의 감칠맛 뒤로 치고 나오는 너구리 다시마의 칼칼하고 시원한 해물 풍미',
    recipe: {
      title: '원조 황금비율 짜파구리',
      isOfficial: true,
      officialSource: '농심 공식 조리 가이드 (2020 기생충 기념 레시피)',
      totalWaterMl: 1000,
      totalCookTimeSec: 300,
      recommendedSoupRatioA: 1.0, // 짜파게티 스프 전부
      recommendedSoupRatioB: 0.5, // 너구리 분말스프 1/2 (취향에 따라 조절)
      cookingMethodType: 'SOUP_STIR',
      tasteDescription: '달콤 짭조름한 짜장과 얼큰한 해물 다시마 육수의 완벽한 밸런스',
      steps: [
        {
          stepNumber: 1,
          title: '물 끓이기 & 다시마 투입',
          instruction: '냄비에 물 1000ml와 너구리 다시마를 넣고 센 불로 팔팔 끓입니다.',
          durationSec: 180,
          tip: '찬물부터 다시마를 넣어야 감칠맛이 진하게 우러납니다.',
        },
        {
          stepNumber: 2,
          title: '면과 후레이크 투입',
          instruction: '물이 끓으면 짜파게티 면, 너구리 면, 그리고 양쪽 후레이크를 모두 넣고 4분 30초간 삶습니다.',
          durationSec: 270,
          tip: '두 면발 모두 굵은 편이므로 면을 들었다 놨다 하며 공기와 접촉시켜 쫄깃함을 살립니다.',
        },
        {
          stepNumber: 3,
          title: '물 따라내기 (8~10스푼 남기기)',
          instruction: '면이 알맞게 익으면 국물을 국자로 8~10스푼(약 120ml) 정도만 자작하게 남기고 따라 버립니다.',
          durationSec: 30,
          tip: '물을 너무 많이 버리면 퍽퍽해지고, 너무 많으면 싱거워지니 자작함이 핵심입니다.',
        },
        {
          stepNumber: 4,
          title: '스프 투입 및 30초 볶기',
          instruction: '짜파게티 과립스프 1봉과 너구리 분말스프 1/2봉, 올리브 조미유를 넣고 약불에서 30초간 골고루 볶아 비벼냅니다.',
          durationSec: 30,
          tip: '매운맛을 즐긴다면 너구리 스프를 2/3봉까지 늘려도 좋습니다.',
        },
      ],
    },
  },
  'sari-gomtang:shin-ramyun': {
    pairKey: 'sari-gomtang:shin-ramyun',
    recommendationHook: '진국 사골 육수에 칼칼한 신라면 매운맛이 녹아든 "신사리면"',
    expectedTaste: '입술에 감기는 뽀얗고 묵직한 우사골 베이스에 신라면의 표고버섯 얼큰함이 어우러진 명품 탕면',
    recipe: {
      title: '황금 비율 신사리면 (신라면 + 사리곰탕)',
      isOfficial: true,
      officialSource: '농심 모디슈머 추천 황금 레시피',
      totalWaterMl: 900,
      totalCookTimeSec: 270,
      recommendedSoupRatioA: 0.8,
      recommendedSoupRatioB: 0.8,
      cookingMethodType: 'SOUP_SOUP',
      tasteDescription: '사골 농축액으로 끓여낸 전문점 소고기 육개장의 묵직한 국물맛',
      steps: [
        {
          stepNumber: 1,
          title: '최적 물 계량 및 끓이기',
          instruction: '물 900ml를 냄비에 붓고 센 불로 끓입니다. (2봉 합산 1100ml보다 줄여야 사골 바디감이 살아납니다)',
          durationSec: 180,
          tip: '국물 2봉 조리 시 물을 10~15% 줄여야 간이 완벽합니다.',
        },
        {
          stepNumber: 2,
          title: '신라면 면 & 스프 선투입',
          instruction: '물이 끓으면 신라면 면과 신라면 분말스프 0.8봉, 사리곰탕 분말스프 0.8봉을 먼저 넣습니다.',
          durationSec: 30,
        },
        {
          stepNumber: 3,
          title: '사리곰탕 면 투입 및 4분간 끓이기',
          instruction: '사리곰탕 면과 양쪽 후레이크를 모두 넣고 4분간 면을 풀어가며 끓입니다.',
          durationSec: 240,
          tip: '사리곰탕 조리시간(4분)과 신라면(4분 30초)의 30초 시차를 맞춰 최상의 꼬들함을 완성합니다.',
        },
      ],
    },
  },
  'buldak:chapagetti': {
    pairKey: 'buldak:chapagetti',
    recommendationHook: '짜장의 달콤함과 하바네로의 극한 화력이 만난 중독성 1등 "불닭게티"',
    expectedTaste: '첫맛은 달달한 짜장 소스가 혀를 감싸고, 3초 뒤 불닭의 얼얼한 불향이 강렬하게 터지는 반전 풍미',
    recipe: {
      title: '사천풍 불닭게티',
      isOfficial: true,
      officialSource: '삼양식품 & 농심 모디슈머 공인 레시피',
      totalWaterMl: 1000,
      totalCookTimeSec: 300,
      recommendedSoupRatioA: 1.0,
      recommendedSoupRatioB: 0.7,
      cookingMethodType: 'STIR_STIR',
      tasteDescription: '고급 중식당 사천짜장의 화끈한 불맛을 완벽히 재현한 조합',
      steps: [
        {
          stepNumber: 1,
          title: '물 끓이기',
          instruction: '물 1000ml를 냄비에 붓고 센 불로 끓입니다.',
          durationSec: 180,
        },
        {
          stepNumber: 2,
          title: '두 면 동시 삶기',
          instruction: '물이 끓으면 짜파게티 면, 불닭 면, 짜파게티 후레이크를 넣고 4분 30초간 삶습니다.',
          durationSec: 270,
          tip: '두 라면 모두 표준 5분 조리면이므로 동시에 투입합니다.',
        },
        {
          stepNumber: 3,
          title: '물 따라내기 & 소스 볶기',
          instruction: '물 8~10스푼만 남기고 따라낸 뒤, 짜파게티 과립스프 1봉과 불닭 액상스프 0.7봉, 올리브유를 넣고 약불에서 30초 볶습니다.',
          durationSec: 30,
          tip: '불닭 소스를 처음부터 다 넣지 말고 70%부터 맛을 보며 조절하세요.',
        },
        {
          stepNumber: 4,
          title: '후첨 토핑',
          instruction: '불을 끄고 불닭 볶음참깨/김가루 후레이크를 솔솔 뿌려 완성합니다.',
          durationSec: 10,
        },
      ],
    },
  },
  'chamkkae:yeol-ramyun': {
    pairKey: 'chamkkae:yeol-ramyun',
    recommendationHook: '고소한 계란 참깨블록이 열라면의 매운 불꽃을 감싸안는 "참열라면"',
    expectedTaste: '열라면의 찌릿한 청양고추 국물에 참기름 향과 부드러운 달걀이 스며들어 매콤구수한 국물 완성',
    recipe: {
      title: '오뚜기 공식 추천 참열라면',
      isOfficial: true,
      officialSource: '오뚜기 공식 SNS 화제 레시피',
      totalWaterMl: 900,
      totalCookTimeSec: 240,
      recommendedSoupRatioA: 0.8,
      recommendedSoupRatioB: 0.8,
      cookingMethodType: 'SOUP_SOUP',
      tasteDescription: '순두부 열라면의 계보를 잇는 고소한 매운맛의 정점',
      steps: [
        {
          stepNumber: 1,
          title: '물 끓이기 및 건더기 투입',
          instruction: '물 900ml에 열라면 건더기스프를 넣고 팔팔 끓입니다.',
          durationSec: 180,
        },
        {
          stepNumber: 2,
          title: '면과 분말스프 & 계란블럭 투입',
          instruction: '물이 끓으면 두 라면의 면, 열라면 분말스프 0.8봉, 참깨라면 분말스프 0.8봉, 참깨 계란블럭을 넣고 4분간 끓입니다.',
          durationSec: 240,
          tip: '두 라면 모두 조리시간 4분으로 완벽하게 일치합니다.',
        },
        {
          stepNumber: 3,
          title: '유성스프 둘러 완성',
          instruction: '불을 끈 직후 참깨라면 참기름 유성스프를 둘러 국물에 고소한 풍미를 가둡니다.',
          durationSec: 10,
        },
      ],
    },
  },
  'chapagetti:myeolchi-kalguksu': {
    pairKey: 'chapagetti:myeolchi-kalguksu',
    recommendationHook: '멸치 육수의 깊은 감칠맛이 춘장에 배어드는 화제의 별미 "멸칼게티"',
    expectedTaste: '짜장의 고소하고 달큰한 소스에 멸치 칼국수의 개운한 해물 향이 녹아들어 고급 해물쟁반짜장 맛을 구현',
    recipe: {
      title: '해물풍미 멸칼게티 (멸치칼국수 + 짜파게티)',
      isOfficial: false,
      officialSource: '모디슈머 커뮤니티 검증 실험 레시피',
      totalWaterMl: 950,
      totalCookTimeSec: 300,
      recommendedSoupRatioA: 1.0,
      recommendedSoupRatioB: 0.35, // 멸치칼국수 스프는 30~40%만
      cookingMethodType: 'SOUP_STIR',
      tasteDescription: '멸치 칼국수 특유의 논프라잉 면발과 짜파게티 굵은 면발의 쫄깃한 식감 조화',
      steps: [
        {
          stepNumber: 1,
          title: '물 끓이기',
          instruction: '물 950ml를 센 불에 끓입니다.',
          durationSec: 180,
        },
        {
          stepNumber: 2,
          title: '두 면과 건더기 삶기',
          instruction: '끓는 물에 짜파게티 면과 멸치칼국수 면, 양쪽 후레이크를 넣고 5분간 삶습니다.',
          durationSec: 300,
          tip: '멸치칼국수 건면과 짜파게티 유탕면 모두 5분 조리로 완벽히 동기화됩니다.',
        },
        {
          stepNumber: 3,
          title: '물 따라내기 & 비법 조림',
          instruction: '물 10스푼 정도를 넉넉히 남기고 따라낸 뒤, 짜파게티 과립스프 1봉과 멸치칼국수 분말스프 1/3봉을 넣고 중약불에서 40초간 조립니다.',
          durationSec: 40,
          tip: '멸치칼국수 스프는 나트륨이 강하므로 1/3봉만 넣어야 황금비율입니다.',
        },
        {
          stepNumber: 4,
          title: '올리브유로 마무리',
          instruction: '불을 끄고 짜파게티 올리브조미유를 둘러 윤기나게 비벼냅니다.',
          durationSec: 15,
        },
      ],
    },
  },
  'anseongtangmyeon:neoguri': {
    pairKey: 'anseongtangmyeon:neoguri',
    recommendationHook: '된장 구수한 장국과 다시마 시원한 해물이 결합한 "안구리"',
    expectedTaste: '해물 된장찌개에 라면 사리를 넣은 듯한 깊고 시원하며 친근한 한국인의 소울 국물',
    recipe: {
      title: '해물된장 안구리 (안성탕면 + 너구리)',
      isOfficial: true,
      officialSource: '농심 사내 레시피북 추천 조합',
      totalWaterMl: 950,
      totalCookTimeSec: 300,
      recommendedSoupRatioA: 0.8,
      recommendedSoupRatioB: 0.8,
      cookingMethodType: 'SOUP_SOUP',
      tasteDescription: '안성탕면의 구수한 우거지 장국과 너구리의 칼칼한 통다시마 해물 육수의 시너지',
      steps: [
        {
          stepNumber: 1,
          title: '너구리 다시마와 물 끓이기',
          instruction: '물 950ml에 너구리 다시마를 넣고 센 불로 끓입니다.',
          durationSec: 180,
        },
        {
          stepNumber: 2,
          title: '너구리 면 선투입 (30초 먼저)',
          instruction: '물이 끓으면 굵은 너구리 면과 분말스프 0.8봉, 후레이크를 먼저 넣고 30초간 끓입니다.',
          durationSec: 30,
          tip: '너구리(5분)가 안성탕면(4분 30초)보다 30초 더 걸리므로 먼저 투입합니다.',
        },
        {
          stepNumber: 3,
          title: '안성탕면 면 및 스프 투입',
          instruction: '안성탕면 면과 안성탕면 스프 0.8봉을 넣고 4분 30초간 함께 끓입니다.',
          durationSec: 270,
        },
      ],
    },
  },
};
