import { useState } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { AlertCircle, Info } from 'lucide-react';

interface RamenRankingProps {
  onOpenProductModal: (product: RamenProduct) => void;
}

type RankingCategory =
  | 'SPICY_SCOVILLE'     // 제조사 스코빌지수
  | 'SPICY_CAPSAICIN'    // 한국소비자원(2026.11) 스프 캡사이신류 함량 (mg/kg)
  | 'SPICY_BROTH'        // 조리 후 국물/소스 캡사이신류 농도 (mg/L)
  | 'SODIUM'             // 나트륨 함량
  | 'CALORIES'           // 열량
  | 'WEIGHT'             // 중량
  | 'FASTEST_COOK'       // 빠른 조리시간
  | 'WATER_AMOUNT'       // 물의 양
  | 'OLDEST_ACTIVE';     // 가장 오래된 현역 라면

export function RamenRanking({ onOpenProductModal }: RamenRankingProps) {
  const [category, setCategory] = useState<RankingCategory>('SPICY_SCOVILLE');
  const [productTypeFilter, setProductTypeFilter] = useState<'ALL' | 'SOUP' | 'STIR_BIBIM'>('ALL');
  const [scovilleProvenanceFilter, setScovilleProvenanceFilter] = useState<'ALL' | 'VERIFIED' | 'ESTIMATED'>('ALL');

  // Filter products by type if needed
  const filterByType = (list: RamenProduct[]) => {
    let result = list;
    if (productTypeFilter === 'SOUP') result = result.filter((p) => p.productType === 'SOUP');
    else if (productTypeFilter === 'STIR_BIBIM') result = result.filter((p) => p.productType === 'STIR_FRY' || p.productType === 'BIBIM');

    if (category === 'SPICY_SCOVILLE' && scovilleProvenanceFilter !== 'ALL') {
      result = result.filter((p) => p.spiciness.scovilleProvenance === scovilleProvenanceFilter);
    }
    return result;
  };

  const getSortedRanking = (): {
    items: { product: RamenProduct; primaryValue: string; subValue?: string }[];
    standardText: string;
    dateText: string;
    warningNote?: string;
  } => {
    let pool = filterByType(RAMEN_DATASET);

    switch (category) {
      case 'SPICY_SCOVILLE': {
        const verified = pool
          .filter((p) => p.spiciness.scovilleShu !== null && p.spiciness.scovilleShu > 0)
          .sort((a, b) => (b.spiciness.scovilleShu || 0) - (a.spiciness.scovilleShu || 0));

        return {
          items: verified.map((p) => ({
            product: p,
            primaryValue: `${p.spiciness.scovilleShu?.toLocaleString()} SHU`,
            subValue: `출처: ${p.spiciness.scovilleProvenance === 'VERIFIED' ? '제조사 공식 공시' : '추정치'}`,
          })),
          standardText: '제조사가 공식 발표한 스코빌 지수(SHU, Scoville Heat Unit) 기준 정렬',
          dateText: '2026년 11월 기준 제조사 공시 취합',
          warningNote:
            '※ 스코빌지수는 원료 고추와 분말스프 농도에 따른 지표이며, 국물에 물을 탄 후 실제로 혀에 닿는 매운맛 체감과는 차이가 있을 수 있습니다.',
        };
      }

      case 'SPICY_CAPSAICIN': {
        // 한국소비자원 2026.11 시험 스프 캡사이신류 함량 (mg/kg)
        const verified = pool
          .filter((p) => p.spiciness.capsaicinSoupMgPerKg !== null)
          .sort((a, b) => (b.spiciness.capsaicinSoupMgPerKg || 0) - (a.spiciness.capsaicinSoupMgPerKg || 0));

        return {
          items: verified.map((p) => ({
            product: p,
            primaryValue: `${p.spiciness.capsaicinSoupMgPerKg?.toFixed(1)} mg/kg`,
            subValue: `스프 1kg당 캡사이신류 실측 함량`,
          })),
          standardText: '한국소비자원(2026.11 발표) 시험평가: 라면 분말/액상 스프 내 캡사이신류(Capsaicinoids) 정밀 실측치',
          dateText: '2026년 11월 10일 한국소비자원 라면 시험 결과',
          warningNote:
            '※ 국가공인 시험기관(소비자원)이 정밀 크로마토그래피로 측정한 스프 상태의 순수 매운 성분 함량입니다.',
        };
      }

      case 'SPICY_BROTH': {
        // 조리 후 국물/소스 캡사이신류 농도 (mg/L)
        const verified = pool
          .filter((p) => p.spiciness.capsaicinPreparedMgPerL !== null)
          .sort((a, b) => (b.spiciness.capsaicinPreparedMgPerL || 0) - (a.spiciness.capsaicinPreparedMgPerL || 0));

        return {
          items: verified.map((p) => ({
            product: p,
            primaryValue: `${p.spiciness.capsaicinPreparedMgPerL?.toFixed(1)} mg/L`,
            subValue: `조리 완성 국물/소스 리터당 농도`,
          })),
          standardText: '한국소비자원 기준 조리법대로 끓인 후 완성된 국물/소스 내 캡사이신류 농도',
          dateText: '2026년 11월 10일 한국소비자원 라면 시험 결과',
          warningNote:
            '※ 국물라면은 물 500~550ml로 희석되므로, 물을 버리고 비비는 볶음면(불닭 등)의 농도가 상대적으로 훨씬 높게 측정됩니다.',
        };
      }

      case 'SODIUM': {
        const sorted = [...pool].sort((a, b) => b.nutrition.sodiumMg - a.nutrition.sodiumMg);
        return {
          items: sorted.map((p) => ({
            product: p,
            primaryValue: `${p.nutrition.sodiumMg.toLocaleString()} mg`,
            subValue: `1일 권장량(2,000mg)의 ${Math.round((p.nutrition.sodiumMg / 2000) * 100)}%`,
          })),
          standardText: '식품의약품안전처 영양표시 및 제품 포장 영양성분표 기준 1봉당 나트륨 함량',
          dateText: '2026년 11월 기준',
        };
      }

      case 'CALORIES': {
        const sorted = [...pool].sort((a, b) => b.nutrition.caloriesKcal - a.nutrition.caloriesKcal);
        return {
          items: sorted.map((p) => ({
            product: p,
            primaryValue: `${p.nutrition.caloriesKcal} kcal`,
            subValue: `중량 ${p.nutrition.weightG}g (g당 ${(p.nutrition.caloriesKcal / p.nutrition.weightG).toFixed(1)}kcal)`,
          })),
          standardText: '제품 1봉당 총 열량(칼로리)',
          dateText: '2026년 11월 기준',
        };
      }

      case 'WEIGHT': {
        const sorted = [...pool].sort((a, b) => b.nutrition.weightG - a.nutrition.weightG);
        return {
          items: sorted.map((p) => ({
            product: p,
            primaryValue: `${p.nutrition.weightG} g`,
            subValue: `열량 ${p.nutrition.caloriesKcal} kcal`,
          })),
          standardText: '제품 1봉당 총 중량',
          dateText: '2026년 11월 기준',
        };
      }

      case 'FASTEST_COOK': {
        const sorted = [...pool].sort((a, b) => a.cooking.cookTimeSec - b.cooking.cookTimeSec);
        return {
          items: sorted.map((p) => ({
            product: p,
            primaryValue: `${Math.floor(p.cooking.cookTimeSec / 60)}분 ${p.cooking.cookTimeSec % 60 > 0 ? `${p.cooking.cookTimeSec % 60}초` : ''}`,
            subValue: `면 유형: ${p.noodleType}`,
          })),
          standardText: '제조사 공식 조리법상 끓는 물 투입 후 권장 조리 시간',
          dateText: '2026년 11월 기준',
        };
      }

      case 'WATER_AMOUNT': {
        const sorted = [...pool].sort((a, b) => b.cooking.waterMl - a.cooking.waterMl);
        return {
          items: sorted.map((p) => ({
            product: p,
            primaryValue: `${p.cooking.waterMl} ml`,
            subValue: p.cooking.isDrainWater ? `(조리 후 ${p.cooking.drainWaterRetainSpoons || 8}스푼 남기고 버림)` : '국물 전량 섭취',
          })),
          standardText: '제조사 공식 조리법에 표기된 권장 물의 양',
          dateText: '2026년 11월 기준',
        };
      }

      case 'OLDEST_ACTIVE': {
        const sorted = pool.filter((p) => p.isActive).sort((a, b) => a.releaseYear - b.releaseYear);
        return {
          items: sorted.map((p) => ({
            product: p,
            primaryValue: `${p.releaseYear}년 출시`,
            subValue: `${2026 - p.releaseYear}년째 현역 판매 중`,
          })),
          standardText: '현재 판매 중인 대한민국 장수 라면 출시 연도 순위',
          dateText: '2026년 11월 기준',
        };
      }
    }
  };

  const rankingData = getSortedRanking();

  const categories: { id: RankingCategory; label: string; icon: string }[] = [
    { id: 'SPICY_SCOVILLE', label: '스코빌지수 (제조사)', icon: '🔥' },
    { id: 'SPICY_CAPSAICIN', label: '스프 캡사이신 (소비자원 실측)', icon: '🧪' },
    { id: 'SPICY_BROTH', label: '완성 국물 캡사이신 농도', icon: '🍜' },
    { id: 'SODIUM', label: '나트륨 함량', icon: '🧂' },
    { id: 'CALORIES', label: '열량 (칼로리)', icon: '⚡' },
    { id: 'WEIGHT', label: '1봉 중량', icon: '⚖️' },
    { id: 'FASTEST_COOK', label: '초고속 조리', icon: '⏱️' },
    { id: 'WATER_AMOUNT', label: '권장 물의 양', icon: '💧' },
    { id: 'OLDEST_ACTIVE', label: '최장수 현역 라면', icon: '👑' },
  ];

  return (
    <section id="rankings" className="py-10 sm:py-16 border-b border-stone-300 bg-[#faf8f2]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-800 text-white tracking-wider">
            DATA-DRIVEN RANKINGS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 font-serif mt-2">
            라면 랭킹
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            공식 스코빌과 한국소비자원 실측 캡사이신, 나트륨, 조리속도 등 검증된 데이터 기준별 정렬
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-sm ${
                category === cat.id
                  ? 'bg-stone-900 text-white ring-2 ring-amber-400'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filters & Standard Meta Info Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-500" /> {rankingData.standardText}
              </span>
            </div>
            <span className="text-stone-500 font-mono block">
              기준일자: {rankingData.dateText}
            </span>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Scoville Provenance Filter (Only in SPICY_SCOVILLE category) */}
            {category === 'SPICY_SCOVILLE' && (
              <div className="flex items-center gap-1 bg-amber-50/80 p-1 rounded-xl border border-amber-200">
                <span className="text-amber-900 font-bold px-1.5">출처:</span>
                {[
                  { id: 'ALL', label: '전체 (공식+추정)' },
                  { id: 'VERIFIED', label: '공식 발표만' },
                  { id: 'ESTIMATED', label: '추정치만' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setScovilleProvenanceFilter(f.id as typeof scovilleProvenanceFilter)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      scovilleProvenanceFilter === f.id
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Soup vs Stir-fry filter */}
            <div className="flex items-center gap-1">
              <span className="text-stone-500 mr-1">분류:</span>
              {[
                { id: 'ALL', label: '전체' },
                { id: 'SOUP', label: '국물 라면' },
                { id: 'STIR_BIBIM', label: '볶음/비빔 라면' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setProductTypeFilter(f.id as typeof productTypeFilter)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    productTypeFilter === f.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Warning Alert Note for Spiciness/Conditions */}
        {rankingData.warningNote && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{rankingData.warningNote}</p>
          </div>
        )}

        {/* Ranking List Table */}
        <div className="bg-white rounded-3xl border border-stone-300 shadow-md overflow-hidden">
          <div className="divide-y divide-stone-100">
            {rankingData.items.map((item, index) => {
              const rank = index + 1;

              return (
                <div
                  key={item.product.id}
                  onClick={() => onOpenProductModal(item.product)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-50 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Number Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                        rank === 1
                          ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                          : rank === 2
                          ? 'bg-stone-300 text-stone-900'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {rank}
                    </div>

                    {/* Product Basic Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                          {item.product.manufacturer}
                        </span>
                        <span className="text-xs text-stone-400">
                          {item.product.releaseYear}년
                        </span>
                        {category === 'SPICY_SCOVILLE' && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              item.product.spiciness.scovilleProvenance === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {item.product.spiciness.scovilleProvenance === 'VERIFIED' ? '공식 발표' : '추정치'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-stone-900 text-base group-hover:text-rose-600 transition">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-stone-500 hidden sm:block">
                        {item.product.flavorProfile.primaryFlavors.join(' · ')}
                      </p>
                    </div>
                  </div>

                  {/* Value Column */}
                  <div className="text-right shrink-0">
                    <span className="text-lg sm:text-xl font-black text-stone-900 block font-mono">
                      {item.primaryValue}
                    </span>
                    {item.subValue && (
                      <span className="text-[11px] text-stone-500 font-medium">
                        {item.subValue}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {rankingData.items.length === 0 && (
              <div className="p-12 text-center text-stone-400 text-sm">
                해당 필터 조건에 부합하는 라면이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
