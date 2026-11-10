import type { RamenProduct, DataProvenance } from '../types/ramen';
import { RAMEN_MAP } from '../data/ramenDataset';
import { getAllCombinations } from '../utils/dailyRecommendation';
import {
  Flame,
  ExternalLink,
  Layers,
  Sparkles,
  ChefHat,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: RamenProduct | null;
  onClose: () => void;
  onSendToLab: (a: RamenProduct, b: RamenProduct) => void;
  onSelectProduct: (p: RamenProduct) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onSendToLab,
  onSelectProduct,
}: ProductDetailModalProps) {
  if (!product) return null;

  // Find top compatible pairings for this ramen
  const allCombos = getAllCombinations();
  const topPairings = allCombos
    .filter((c) => c.ramenA.id === product.id || c.ramenB.id === product.id)
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 3);

  const getProvenanceBadge = (prov: DataProvenance) => {
    switch (prov) {
      case 'VERIFIED':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            VERIFIED 공식검증
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-300">
            CALCULATED 산출치
          </span>
        );
      case 'ESTIMATED':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
            ESTIMATED 추정치
          </span>
        );
      case 'MISSING':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-500 border border-stone-200">
            MISSING 자료없음
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-300 flex flex-col">
        {/* Header Bar */}
        <div
          className="p-6 text-white relative rounded-t-3xl"
          style={{ backgroundColor: product.packagingThemeColor.bg }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white/20 backdrop-blur-md">
              {product.manufacturer}
            </span>
            <span className="text-xs font-mono font-semibold">
              {product.releaseYear}년 출시
            </span>
            {!product.isActive && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/50">
                단종 제품
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif">
            {product.name}
          </h2>
          <p className="text-sm opacity-90 mt-1 font-medium">
            주요 풍미: {product.flavorProfile.primaryFlavors.join(' · ')}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 text-stone-800">
          {/* 1. Core Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-400 block mb-0.5">중량 / 열량</span>
              <span className="text-base font-black text-stone-900">
                {product.nutrition.weightG}g / {product.nutrition.caloriesKcal}kcal
              </span>
            </div>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-400 block mb-0.5">나트륨</span>
              <span className="text-base font-black text-stone-900">
                {product.nutrition.sodiumMg.toLocaleString()}mg
              </span>
              <span className="text-[10px] text-stone-400 block">
                (1일 권장량의 {Math.round((product.nutrition.sodiumMg / 2000) * 100)}%)
              </span>
            </div>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-400 block mb-0.5">권장 물의 양</span>
              <span className="text-base font-black text-stone-900">
                {product.cooking.waterMl}ml
              </span>
              {product.cooking.isDrainWater && (
                <span className="text-[10px] text-amber-700 block font-medium">
                  {product.cooking.drainWaterRetainSpoons || 8}스푼 남김
                </span>
              )}
            </div>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-400 block mb-0.5">조리 시간</span>
              <span className="text-base font-black text-stone-900">
                {Math.floor(product.cooking.cookTimeSec / 60)}분 {product.cooking.cookTimeSec % 60 > 0 ? `${product.cooking.cookTimeSec % 60}초` : ''}
              </span>
            </div>
          </div>

          {/* 2. Spiciness Analysis with KCA & Scoville Provenance */}
          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
                <h4 className="font-bold text-stone-900 text-sm">매운맛 상세 지표</h4>
              </div>
              <span className="text-xs font-semibold text-rose-700">
                단계: {product.spiciness.spicinessGrade}단계
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-700">제조사 스코빌 지수 (SHU)</span>
                  {getProvenanceBadge(product.spiciness.scovilleProvenance)}
                </div>
                <div className="text-lg font-black text-rose-600">
                  {product.spiciness.scovilleShu
                    ? `${product.spiciness.scovilleShu.toLocaleString()} SHU`
                    : '자료 없음 (공식 수치 미공개)'}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-700">소비자원 스프 캡사이신류</span>
                  {getProvenanceBadge(product.spiciness.capsaicinProvenance)}
                </div>
                <div className="text-lg font-black text-rose-600">
                  {product.spiciness.capsaicinSoupMgPerKg
                    ? `${product.spiciness.capsaicinSoupMgPerKg} mg/kg`
                    : '자료 없음 (시험 대상 외)'}
                </div>
                {product.spiciness.capsaicinPreparedMgPerL && (
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    조리 완성 국물 농도: {product.spiciness.capsaicinPreparedMgPerL} mg/L
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Detailed Nutrition Breakdown */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm mb-2">영양성분표</h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-[10px] text-stone-400 block">탄수화물</span>
                <span className="font-bold text-stone-900">{product.nutrition.carbsG}g</span>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <span className="text-[10px] text-stone-400 block">단백질</span>
                <span className="font-bold text-stone-900">{product.nutrition.proteinG}g</span>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <span className="text-[10px] text-stone-400 block">지방</span>
                <span className="font-bold text-stone-900">{product.nutrition.fatG}g</span>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <span className="text-[10px] text-stone-400 block">면/스프 나트륨 분리</span>
                <span className="font-bold text-stone-700">
                  {product.nutrition.sodiumSeparated ? '분리 표기' : '미분리(합산)'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <span className="text-[10px] text-stone-400 block">출고 가격</span>
                <span className="font-bold text-stone-900">
                  {product.priceKrw ? `약 ${product.priceKrw}원` : '변동'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Official Cooking Steps with Timers */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-stone-700" /> 공식 권장 조리 단계
            </h4>
            <div className="space-y-2">
              {product.cooking.steps.map((st, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700"
                >
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <p className="flex-1 leading-relaxed">{st}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Lineage Connections */}
          {product.lineage.length > 0 && (
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-700" /> 라면 계보 관계
              </h4>
              <div className="space-y-2">
                {product.lineage.map((edge, idx) => {
                  const target = RAMEN_MAP.get(edge.targetId);
                  return (
                    <div
                      key={idx}
                      onClick={() => target && onSelectProduct(target)}
                      className="bg-stone-50 p-3 rounded-xl border border-stone-200 hover:border-stone-400 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-stone-900">
                            {target ? target.name : edge.targetId}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ({edge.year}년)
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px]">{edge.description}</p>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold shrink-0">
                        클릭하여 보기 →
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Top Recommended Pairings for this product */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-600" /> 이 라면과 가장 어울리는 조합 TOP 3
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {topPairings.map((pair) => {
                const other = pair.ramenA.id === product.id ? pair.ramenB : pair.ramenA;
                return (
                  <div
                    key={other.id}
                    className="bg-white p-3 rounded-xl border border-stone-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-900">{other.name}</span>
                        <span className="text-xs font-black text-rose-600">
                          {pair.compositeScore}점
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight">
                        {pair.recommendationHook}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSendToLab(product, other);
                      }}
                      className="mt-2.5 text-[11px] font-bold text-rose-600 hover:underline cursor-pointer text-left"
                    >
                      연구소에서 섞어보기 →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. Data Provenance & Verification Metadata */}
          <div className="border-t border-stone-200 pt-4 text-[11px] text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-stone-700">공식 출처: </span>
              <span>{product.officialDataSource}</span>
              <span className="ml-2 font-mono">({product.verifiedDate} 확인)</span>
            </div>
            {product.officialRecipeLink && (
              <a
                href={product.officialRecipeLink}
                target="_blank"
                rel="noreferrer"
                className="text-stone-700 hover:underline flex items-center gap-1 font-semibold"
              >
                공식 페이지 <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
