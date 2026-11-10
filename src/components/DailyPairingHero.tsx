import { useState } from 'react';
import { ProductCardVisual } from './ProductCardVisual';
import { CookingTimer } from './CookingTimer';
import {
  getDailyRecommendation,
  getRecentRecommendations,
  getKSTDateString,
} from '../utils/dailyRecommendation';
import { generateMixedRecipe } from '../utils/pairingAlgorithm';
import type { RamenProduct } from '../types/ramen';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  Calendar,
  ChefHat,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface DailyPairingHeroProps {
  onSelectProduct: (product: RamenProduct) => void;
  onSendToLab: (a: RamenProduct, b: RamenProduct) => void;
}

export function DailyPairingHero({ onSelectProduct, onSendToLab }: DailyPairingHeroProps) {
  const [selectedDate, setSelectedDate] = useState<string>(getKSTDateString());
  const [isRecipeExpanded, setIsRecipeExpanded] = useState<boolean>(false);
  const [isNutritionExpanded, setIsNutritionExpanded] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const recommendation = getDailyRecommendation(selectedDate);
  const { combination } = recommendation;
  const { ramenA, ramenB } = combination;

  const recipe = generateMixedRecipe(ramenA, ramenB);
  const historyList = getRecentRecommendations(14, getKSTDateString());

  const formatCookTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}분 ${s}초` : `${m}분`;
  };

  return (
    <section id="daily" className="py-6 sm:py-10 border-b border-stone-300 bg-[#faf7f0]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> 오늘의 라면 조합
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {selectedDate} (KST 00:00 기준)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-medium hidden sm:inline">
              규칙 기반 예측 모델
            </span>
          </div>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1 text-xs text-stone-700 bg-white border border-stone-300 px-3 py-1 rounded-full hover:bg-stone-50 transition cursor-pointer font-medium"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            지난 조합 아카이브 ({historyList.length}일)
          </button>
        </div>

        {/* Hero Card Container */}
        <div className="bg-white rounded-3xl border-2 border-stone-900/10 shadow-xl overflow-hidden p-5 sm:p-8 relative">
          {/* Subtle Top Badge */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900 tracking-wide">
                총 {recommendation.totalPoolCount.toLocaleString()}개 조합 중 오늘 선정
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-500">
                적합 후보군 {recommendation.qualifiedCount}종 중 결정적 무작위 추출
              </span>
            </div>
            {combination.isOfficialRecipe ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> 공식 레시피 인증
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
                <ChefHat className="w-3 h-3 text-stone-500" /> 알고리즘 실험 레시피
              </span>
            )}
          </div>

          {/* Dual Product Stage with '+' */}
          <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 my-2">
            {/* Product A */}
            <div className="md:col-span-5">
              <ProductCardVisual
                product={ramenA}
                size="lg"
                onClick={() => onSelectProduct(ramenA)}
              />
            </div>

            {/* Large Center '+' sign */}
            <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-amber-300">
                +
              </div>
            </div>

            {/* Product B */}
            <div className="md:col-span-5">
              <ProductCardVisual
                product={ramenB}
                size="lg"
                onClick={() => onSelectProduct(ramenB)}
              />
            </div>
          </div>

          {/* Primary Summary Bar: Scores, Expected Taste, Hook, Cook Time */}
          <div className="mt-8 pt-6 border-t-2 border-stone-100">
            {/* Recommendation Hook Quote */}
            <div className="text-center max-w-2xl mx-auto mb-6">
              <p className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug">
                "{combination.recommendationHook}"
              </p>
              <p className="text-sm text-stone-600 mt-2 font-medium">
                {combination.expectedTaste}
              </p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-center mb-6">
              {/* Compatibility Score */}
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="block text-xs text-rose-700 font-semibold mb-0.5">궁합 점수</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-rose-700">{combination.compositeScore}</span>
                  <span className="text-xs text-rose-500 font-bold">/ 100</span>
                </div>
              </div>

              {/* Surprise Score */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="block text-xs text-amber-800 font-semibold mb-0.5">의외성 점수</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-amber-800">{combination.surpriseScore}</span>
                  <span className="text-xs text-amber-600 font-bold">/ 100</span>
                </div>
              </div>

              {/* Recommended Cooking Time */}
              <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col justify-center items-center">
                <span className="block text-xs text-stone-600 font-semibold mb-0.5">권장 조리 시간</span>
                <div className="flex items-center gap-1 text-stone-900 font-black text-xl">
                  <Clock className="w-4 h-4 text-stone-700" />
                  <span>{formatCookTime(recipe.totalCookTimeSec)}</span>
                </div>
              </div>
            </div>

            {/* Buttons: Expand Recipe & Open in Lab */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsRecipeExpanded(!isRecipeExpanded)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition shadow-md cursor-pointer text-sm"
              >
                <span>{isRecipeExpanded ? '레시피 접기' : '레시피 보기'}</span>
                {isRecipeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => onSendToLab(ramenA, ramenB)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition shadow-md cursor-pointer text-sm"
              >
                <span>궁합 연구소에서 직접 비율 조절</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Recipe Section */}
          {isRecipeExpanded && (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-stone-200 bg-stone-50/70 -mx-5 sm:-mx-8 -mb-5 sm:-mb-8 p-5 sm:p-8 animate-fadeIn">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      {recipe.isOfficial ? '공식 제조사 레시피' : '알고리즘 실험 레시피'}
                    </span>
                    <h4 className="text-xl font-black text-stone-900 mt-0.5">{recipe.title}</h4>
                  </div>
                  <span className="text-xs text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200">
                    권장 물 {recipe.totalWaterMl}ml
                  </span>
                </div>

                {recipe.officialSource && (
                  <p className="text-xs text-stone-500 mb-6 bg-white p-2.5 rounded-lg border border-stone-200">
                    출처: {recipe.officialSource}
                  </p>
                )}

                {/* Step-by-Step Instructions with Cooking Timer */}
                <div className="space-y-4">
                  {recipe.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <h5 className="font-bold text-stone-900 text-sm">{step.title}</h5>
                        </div>
                        <p className="text-sm text-stone-700 ml-7 leading-relaxed">
                          {step.instruction}
                        </p>
                        {step.tip && (
                          <p className="text-xs text-amber-700 ml-7 mt-1.5 font-medium bg-amber-50/80 px-2 py-1 rounded border border-amber-200/50">
                            💡 조리 팁: {step.tip}
                          </p>
                        )}
                      </div>

                      {/* Attached Step Countdown Timer */}
                      {step.durationSec && step.durationSec > 0 && (
                        <div className="sm:self-center ml-7 sm:ml-0 shrink-0">
                          <CookingTimer initialSeconds={step.durationSec} label={`STEP ${step.stepNumber}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Collapsible Nutrition & Data Provenance */}
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <button
                    onClick={() => setIsNutritionExpanded(!isNutritionExpanded)}
                    className="flex items-center justify-between w-full text-xs font-bold text-stone-600 hover:text-stone-900 py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      영양성분 및 알고리즘 분석 근거 (접기/펼치기)
                    </span>
                    {isNutritionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isNutritionExpanded && (
                    <div className="mt-3 bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pb-2 border-b border-stone-100">
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">총 열량(2봉 합산)</span>
                          <span className="font-bold text-sm">
                            {ramenA.nutrition.caloriesKcal + ramenB.nutrition.caloriesKcal} kcal
                          </span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">총 나트륨</span>
                          <span className="font-bold text-sm">
                            {(ramenA.nutrition.sodiumMg + ramenB.nutrition.sodiumMg).toLocaleString()} mg
                          </span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">1인분 열량(1/2)</span>
                          <span className="font-bold text-sm">
                            {Math.round((ramenA.nutrition.caloriesKcal + ramenB.nutrition.caloriesKcal) / 2)} kcal
                          </span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">1인분 나트륨(1/2)</span>
                          <span className="font-bold text-sm">
                            {Math.round((ramenA.nutrition.sodiumMg + ramenB.nutrition.sodiumMg) / 2).toLocaleString()} mg
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 leading-relaxed pt-1 space-y-1">
                        <p>
                          • <strong>맛의 조화 점수</strong>: {combination.tasteHarmonyScore}점 | <strong>조리 적합성</strong>: {combination.cookCompatibilityScore}점 | <strong>신뢰도</strong>: {combination.reliabilityScore}점
                        </p>
                        <p>
                          • <strong>데이터 구분</strong>: 맛의 궁합 지표는 실측 사실이 아니며, 육수 분류(Broth Type), 감칠맛 계수, 면 두께 차이를 종합한 <strong>규칙 기반 예측(RULE_BASED_PREDICTION)</strong>입니다.
                        </p>
                        <p className="text-amber-800">
                          • ※ 면/스프별 나트륨 분리 데이터가 미제공된 제품의 경우 스프 비율 조절 시 실제 나트륨 섭취량과 오차가 발생할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Past Archive Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-stone-900 text-lg">지난 추천 라면 조합 아카이브</h3>
                <p className="text-xs text-stone-500">최근 14일간 날짜별 결정적 알고리즘으로 선정된 조합 기록</p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {historyList.map((item) => (
                <div
                  key={item.date}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setShowHistoryModal(false);
                    setIsRecipeExpanded(false);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    selectedDate === item.date
                      ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {item.date}
                      </span>
                      {item.combination.isOfficialRecipe && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          공식
                        </span>
                      )}
                    </div>
                    <div className="font-black text-stone-900 text-base">
                      {item.combination.ramenA.name} + {item.combination.ramenB.name}
                    </div>
                    <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {item.combination.recommendationHook}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-stone-400 block">궁합</span>
                    <span className="text-lg font-black text-rose-600">
                      {item.combination.compositeScore}점
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
              <button
                onClick={() => {
                  setSelectedDate(getKSTDateString());
                  setShowHistoryModal(false);
                }}
                className="text-xs font-bold text-stone-700 hover:underline"
              >
                오늘({getKSTDateString()}) 날짜로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
