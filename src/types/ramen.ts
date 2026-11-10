export type DataProvenance = 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'MISSING';

export type BrothType = 
  | 'BEEF' 
  | 'SEAFOOD' 
  | 'CHICKEN' 
  | 'PORK_BONE' 
  | 'PORK'
  | 'MISO_SOY' 
  | 'VEGETABLE' 
  | 'DRY_JJAJANG' 
  | 'JJAJANG'
  | 'DRY_SPICY' 
  | 'SPICY_CHILI'
  | 'DRY_SWEET_SOUR' 
  | 'COLD_BROTH'
  | 'CHEESE_CREAM'
  | 'CHEESE'
  | 'CURRY'
  | 'KIMCHI';

export type NoodleType = 
  | 'THICK' 
  | 'STANDARD' 
  | 'THIN' 
  | 'NON_FRIED' 
  | 'KALGUKSU' 
  | 'NAENGMYEON'
  | 'RICE'
  | 'GLASS_NOODLE';

export type ProductType = 'SOUP' | 'STIR_FRY' | 'BIBIM' | 'COLD';

export type PackageType = 'BAG' | 'CUP_LARGE' | 'CUP_SMALL' | 'BOWL';

export type SalesChannel = 'ALL' | 'GS25' | 'CU' | 'EMART24' | 'SEVEN_ELEVEN' | 'DISCONTINUED';

export type DataPipelineStatus = 
  | 'DISCOVERED' 
  | 'IDENTIFIED' 
  | 'IMAGE_FOUND' 
  | 'NUTRITION_VERIFIED' 
  | 'COOKING_VERIFIED' 
  | 'READY_FOR_PAIRING' 
  | 'PUBLISHED';

export type GenealogyRelation = 
  | 'ORIGIN'            // 원조 제품
  | 'SUCCESSOR'         // 후속 제품
  | 'SPINOFF'           // 파생 제품
  | 'SPICY_VARIANT'     // 매운맛 확장 제품
  | 'METHOD_VARIANT'    // 조리 방식 변경 제품 (e.g. 건면/컵라면화)
  | 'DISCONTINUED'      // 단종 제품
  | 'ANCESTOR'          // 조상/초기 모태 제품
  | 'PREDECESSOR'       // 직전 선행 제품
  | 'CROSSOVER'         // 융합/크로스오버
  | 'RIVAL';            // 라이벌 대항마 제품

export interface NutritionInfo {
  weightG: number;
  caloriesKcal: number;
  sodiumMg: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  sodiumSeparated: boolean; // 면/스프 나트륨 분리 여부
  soupSodiumRatioEstimated?: number;
}

export interface SpicinessInfo {
  scovilleShu: number | null; // 제조사 공개 스코빌지수 (SHU)
  scovilleProvenance: DataProvenance;
  capsaicinSoupMgPerKg: number | null; // 한국소비자원 시험 스프 캡사이신류 (mg/kg)
  capsaicinPreparedMgPerL: number | null; // 조리 후 국물/소스 농도 (mg/L)
  capsaicinProvenance: DataProvenance;
  spicinessGrade: 0 | 1 | 2 | 3 | 4 | 5; // 0:안매움, 1:순한맛, 2:신라면급, 3:열라면급, 4:불닭급, 5:극한매움
}

export interface CookingInfo {
  waterMl: number;
  cookTimeSec: number;
  isDrainWater: boolean;
  drainWaterRetainSpoons?: number;
  soupAdditionTiming: 'BEFORE_BOIL' | 'WITH_NOODLE' | 'AFTER_BOIL_DRAIN' | 'FINISHING_POWDER';
  steps: string[];
}

export interface LineageLink {
  targetId: string;
  relation: GenealogyRelation;
  description: string;
  year: number;
}

export interface RamenProduct {
  id: string;
  name: string;
  manufacturer: '농심' | '삼양식품' | '오뚜기' | '팔도' | '풀무원' | '하림' | '빙그레' | '기타/PB' | '기타국내제조사';
  brand: string;
  releaseYear: number;
  productType: ProductType;
  packageType: PackageType;
  salesChannel: SalesChannel;
  isPB: boolean;
  pbBrand?: string; // e.g. '유어스', '헤이루', '아임이', '세븐셀렉트'
  brothType: BrothType;
  noodleType: NoodleType;
  isActive: boolean;
  packagingThemeColor: {
    bg: string;
    text: string;
    border: string;
  };
  imageUrl: string;
  imageSource: string;
  imageStatus: 'VERIFIED_PHOTO' | 'OFFICIAL_RENDER' | 'HISTORICAL_ARCHIVE' | 'ARCHIVE_MATCH';
  nutrition: NutritionInfo;
  spiciness: SpicinessInfo;
  cooking: CookingInfo;
  flavorProfile: {
    primaryFlavors: string[];
    savoryScore: number;     // 1~5 감칠맛
    oilinessScore: number;   // 1~5 고소함/유분
    saltinessScore: number;  // 1~5 짠맛 체감
    sweetnessScore: number;  // 1~5 단맛
  };
  lineage: LineageLink[];
  priceKrw: number | null;
  officialRecipeLink?: string;
  officialDataSource: string;
  verifiedDate: string;
  dataPipelineStatus: DataPipelineStatus;
}

export interface CombinationScore {
  ramenA: RamenProduct;
  ramenB: RamenProduct;
  compositeScore: number;       // 0~100 종합 궁합 점수
  tasteHarmonyScore: number;    // 0~100 맛의 조화
  cookCompatibilityScore: number;// 0~100 조리 적합성
  surpriseScore: number;        // 0~100 의외성 점수
  reliabilityScore: number;     // 0~100 데이터 신뢰도
  expectedTaste: string;        // 예상되는 맛
  recommendationHook: string;   // 추천 이유
  isOfficialRecipe: boolean;    // 공식 제조사 검증 레시피인지 여부
  tastePredictionType: 'RULE_BASED_PREDICTION';
}

export interface MixedRecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationSec?: number;
  tip?: string;
}

export interface MixedRecipe {
  title: string;
  isOfficial: boolean;
  officialSource?: string;
  totalWaterMl: number;
  totalCookTimeSec: number;
  recommendedSoupRatioA: number;
  recommendedSoupRatioB: number;
  cookingMethodType: 'SOUP_SOUP' | 'SOUP_STIR' | 'STIR_STIR' | 'COLD_MIX';
  steps: MixedRecipeStep[];
  tasteDescription: string;
}

// User Taste Preference Questionnaire State
export interface TastePreferences {
  brothPreference: string;
  spicinessLevel: string;
  flavorFocus: string;
  noodleStyle: string;
  healthFocus: string;
  cookTimePreference: string;
}

export interface TasteMatchResult {
  product: RamenProduct;
  matchPercentage: number;
  matchReasons: string[];
  fitSummary: string;
}
