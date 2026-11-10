import { useState } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { ProductCardVisual } from './ProductCardVisual';
import { CookingTimer } from './CookingTimer';
import {
  scoreCombination,
  generateMixedRecipe,
  calculateDynamicNutrition,
} from '../utils/pairingAlgorithm';
import {
  Search,
  Sliders,
  ShieldCheck,
  ChefHat,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface ChemistryLabProps {
  initialRamenA?: RamenProduct | null;
  initialRamenB?: RamenProduct | null;
  onOpenProductModal: (product: RamenProduct) => void;
}

export function ChemistryLab({
  initialRamenA,
  initialRamenB,
  onOpenProductModal,
}: ChemistryLabProps) {
  // Default to Chapagetti + Neoguri if none provided
  const [ramenA, setRamenA] = useState<RamenProduct | null>(
    initialRamenA || RAMEN_DATASET.find((r) => r.id === 'chapagetti') || null
  );
  const [ramenB, setRamenB] = useState<RamenProduct | null>(
    initialRamenB || RAMEN_DATASET.find((r) => r.id === 'neoguri') || null
  );

  // User adjustable slider state
  const [soupRatioA, setSoupRatioA] = useState<number>(1.0);
  const [soupRatioB, setSoupRatioB] = useState<number>(0.5);
  const [waterMl, setWaterMl] = useState<number>(950);
  const [servings, setServings] = useState<number>(2);

  // Modal for selecting ramen
  const [selectingSlot, setSelectingSlot] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');

  // Animation trigger
  const [potAnimActive, setPotAnimActive] = useState<boolean>(false);

  // Derived scoring & recipe
  const combinationScore = ramenA && ramenB ? scoreCombination(ramenA, ramenB) : null;
  const mixedRecipe = ramenA && ramenB ? generateMixedRecipe(ramenA, ramenB) : null;
  const dynamicNutrition =
    ramenA && ramenB
      ? calculateDynamicNutrition(ramenA, ramenB, soupRatioA, soupRatioB, servings)
      : null;

  const handleSelectProduct = (product: RamenProduct) => {
    if (selectingSlot === 'A') {
      setRamenA(product);
      setPotAnimActive(true);
      setTimeout(() => setPotAnimActive(false), 900);
    } else if (selectingSlot === 'B') {
      setRamenB(product);
      setPotAnimActive(true);
      setTimeout(() => setPotAnimActive(false), 900);
    }
    setSelectingSlot(null);
    setSearchQuery('');
  };

  const handleResetSliders = () => {
    if (mixedRecipe) {
      setSoupRatioA(mixedRecipe.recommendedSoupRatioA);
      setSoupRatioB(mixedRecipe.recommendedSoupRatioB);
      setWaterMl(mixedRecipe.totalWaterMl);
      setServings(2);
    } else {
      setSoupRatioA(1.0);
      setSoupRatioB(0.8);
      setWaterMl(900);
      setServings(2);
    }
  };

  const filteredRamens = RAMEN_DATASET.filter((p) => {
    if (!p.isActive) return false;
    const matchSearch =
      p.name.includes(searchQuery) ||
      p.manufacturer.includes(searchQuery) ||
      p.flavorProfile.primaryFlavors.some((f) => f.includes(searchQuery));
    const matchBrand = brandFilter === 'ALL' || p.manufacturer === brandFilter;
    return matchSearch && matchBrand;
  });

  return (
    <section id="lab" className="py-10 sm:py-16 border-b border-stone-300 bg-[#f4f1e8]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-900 text-white tracking-wider">
            INTERACTIVE RAMEN LAB
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 font-serif mt-2">
            라면 궁합 연구소
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            원하는 두 제품을 선택하면 알고리즘이 풍미와 조리 방식을 분석하고, 스프 비율과 물의 양에 따른 영양과 조리법을 실시간 계산합니다.
          </p>
        </div>

        {/* The Two Slots & The Mixing Pot Animation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-10">
          {/* Slot A */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-stone-300 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  라면 A
                </span>
                <button
                  type="button"
                  onClick={() => setSelectingSlot('A')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 underline flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" /> 제품 변경
                </button>
              </div>

              {ramenA ? (
                <ProductCardVisual
                  product={ramenA}
                  size="md"
                  onClick={() => onOpenProductModal(ramenA)}
                />
              ) : (
                <button
                  onClick={() => setSelectingSlot('A')}
                  className="w-full h-48 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center text-stone-400 hover:border-stone-500 hover:text-stone-600 transition"
                >
                  <Search className="w-8 h-8 mb-2" />
                  <span className="text-sm font-bold">첫 번째 라면 선택하기</span>
                </button>
              )}
            </div>
          </div>

          {/* Central Mixing Pot Visual & Drop Animation */}
          <div className="md:col-span-2 flex flex-col items-center justify-center py-4">
            <div
              className={`relative w-24 h-24 rounded-full bg-stone-900 border-4 border-amber-400 flex items-center justify-center shadow-xl transition-all duration-500 ${
                potAnimActive ? 'scale-125 rotate-12 ring-8 ring-amber-300' : 'scale-100'
              }`}
            >
              {/* Pot Handle left */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-6 rounded-l-md bg-stone-800 border-2 border-stone-600" />
              {/* Pot Handle right */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-6 rounded-r-md bg-stone-800 border-2 border-stone-600" />

              {/* Pot Steam bubbles */}
              <div className="text-center">
                <div className="text-2xl font-black text-amber-300 font-serif">냄비</div>
                <div className="text-[10px] text-stone-300 font-bold tracking-tighter">합체 중</div>
              </div>
            </div>

            <span className="text-xs text-stone-500 font-medium mt-3 text-center">
              {ramenA && ramenB ? '궁합 알고리즘 가동 중' : '두 제품을 선택해주세요'}
            </span>
          </div>

          {/* Slot B */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-stone-300 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  라면 B
                </span>
                <button
                  type="button"
                  onClick={() => setSelectingSlot('B')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" /> 제품 변경
                </button>
              </div>

              {ramenB ? (
                <ProductCardVisual
                  product={ramenB}
                  size="md"
                  onClick={() => onOpenProductModal(ramenB)}
                />
              ) : (
                <button
                  onClick={() => setSelectingSlot('B')}
                  className="w-full h-48 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center text-stone-400 hover:border-stone-500 hover:text-stone-600 transition"
                >
                  <Search className="w-8 h-8 mb-2" />
                  <span className="text-sm font-bold">두 번째 라면 선택하기</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* If both products selected, display Full Interactive Workbench */}
        {ramenA && ramenB && combinationScore && mixedRecipe && dynamicNutrition && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Score Summary Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-stone-900 text-white">
                      궁합 분석 완료
                    </span>
                    {combinationScore.isOfficialRecipe ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5" /> 제조사 공식 레시피 인증
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
                        <ChefHat className="w-3.5 h-3.5" /> 알고리즘 실험 레시피
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif">
                    {ramenA.name} × {ramenB.name}
                  </h3>
                  <p className="text-stone-700 text-sm sm:text-base mt-1 font-medium">
                    "{combinationScore.recommendationHook}"
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    예상 풍미: {combinationScore.expectedTaste}
                  </p>
                </div>

                {/* Score Pills */}
                <div className="grid grid-cols-3 gap-3 shrink-0 text-center">
                  <div className="p-3 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 min-w-[90px]">
                    <span className="text-[11px] font-bold text-rose-700 block">종합 궁합</span>
                    <span className="text-3xl font-black text-rose-700">
                      {combinationScore.compositeScore}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-2xl bg-stone-100 border border-stone-200 min-w-[90px]">
                    <span className="text-[11px] font-bold text-stone-700 block">맛의 조화</span>
                    <span className="text-2xl font-black text-stone-800">
                      {combinationScore.tasteHarmonyScore}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 min-w-[90px]">
                    <span className="text-[11px] font-bold text-amber-800 block">의외성</span>
                    <span className="text-2xl font-black text-amber-800">
                      {combinationScore.surpriseScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Parameter Sliders */}
              <div className="mt-6 pt-2">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-stone-700" />
                    <h4 className="font-bold text-stone-900 text-base">
                      레시피 실시간 조절기
                    </h4>
                    <span className="text-xs text-stone-500 hidden sm:inline">
                      스프 비율과 물의 양을 조절하면 영양성분이 실시간으로 재계산됩니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetSliders}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 권장값으로 초기화
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  {/* Slider A */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>[{ramenA.name}] 스프</span>
                      <span className="text-rose-600">{Math.round(soupRatioA * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soupRatioA}
                      onChange={(e) => setSoupRatioA(parseFloat(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-500 block">
                      권장: {Math.round(mixedRecipe.recommendedSoupRatioA * 100)}%
                    </span>
                  </div>

                  {/* Slider B */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>[{ramenB.name}] 스프</span>
                      <span className="text-amber-700">{Math.round(soupRatioB * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soupRatioB}
                      onChange={(e) => setSoupRatioB(parseFloat(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-500 block">
                      권장: {Math.round(mixedRecipe.recommendedSoupRatioB * 100)}%
                    </span>
                  </div>

                  {/* Water Ml Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>물의 양</span>
                      <span className="text-sky-600">{waterMl} ml</span>
                    </div>
                    <input
                      type="range"
                      min="600"
                      max="1200"
                      step="50"
                      value={waterMl}
                      onChange={(e) => setWaterMl(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-500 block">
                      기준: {mixedRecipe.totalWaterMl}ml
                    </span>
                  </div>

                  {/* Servings Toggle */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>영양 계산 기준</span>
                      <span className="text-stone-900">{servings}인분</span>
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setServings(1)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          servings === 1
                            ? 'bg-stone-900 text-white'
                            : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        1인분 (절반)
                      </button>
                      <button
                        type="button"
                        onClick={() => setServings(2)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          servings === 2
                            ? 'bg-stone-900 text-white'
                            : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        2인분 (전량)
                      </button>
                    </div>
                    <span className="text-[10px] text-stone-500 block">
                      {servings === 1 ? '혼자 덜어 먹을 때' : '2봉 조리 전체 섭취 시'}
                    </span>
                  </div>
                </div>

                {/* 3. Real-time Recalculated Nutrition Output */}
                <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-800">
                      실시간 영양성분 산출 ({servings === 1 ? '1인분당 기준' : '2봉 전체 기준'})
                    </span>
                    <span className="text-xs font-semibold text-rose-700">
                      {dynamicNutrition.spicinessDescription}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">열량</span>
                      <span className="text-lg font-black text-stone-900">
                        {servings === 1 ? dynamicNutrition.perServingCalories : dynamicNutrition.totalCalories}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-0.5">kcal</span>
                    </div>

                    <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                      <span className="text-[10px] text-rose-700 font-semibold block">나트륨</span>
                      <span className="text-lg font-black text-rose-800">
                        {(servings === 1 ? dynamicNutrition.perServingSodiumMg : dynamicNutrition.totalSodiumMg).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-rose-600 ml-0.5">mg</span>
                      <span className="text-[9px] text-rose-500 block">
                        (1일 기준치의 {Math.round(((servings === 1 ? dynamicNutrition.perServingSodiumMg : dynamicNutrition.totalSodiumMg) / 2000) * 100)}%)
                      </span>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">탄수화물</span>
                      <span className="text-lg font-black text-stone-900">
                        {servings === 1 ? dynamicNutrition.perServingCarbsG : dynamicNutrition.totalCarbsG}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-0.5">g</span>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">단백질</span>
                      <span className="text-lg font-black text-stone-900">
                        {servings === 1 ? dynamicNutrition.perServingProteinG : dynamicNutrition.totalProteinG}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-0.5">g</span>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-stone-500 block">지방</span>
                      <span className="text-lg font-black text-stone-900">
                        {servings === 1 ? dynamicNutrition.perServingFatG : dynamicNutrition.totalFatG}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-0.5">g</span>
                    </div>
                  </div>

                  {/* Crucial Sodium Warning Note */}
                  <div className="mt-3 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{dynamicNutrition.sodiumWarningNote}</span>
                  </div>
                </div>
              </div>

              {/* 4. Actionable Step-by-Step Recipe with Countdown Timers */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-rose-600 tracking-wider">
                      주방 실전 조리법
                    </span>
                    <h4 className="text-xl font-black text-stone-900 font-serif">
                      {mixedRecipe.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-medium">
                      총 예상 소요: {Math.floor(mixedRecipe.totalCookTimeSec / 60)}분 {mixedRecipe.totalCookTimeSec % 60 > 0 ? `${mixedRecipe.totalCookTimeSec % 60}초` : ''}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {mixedRecipe.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {step.stepNumber}
                          </span>
                          <span className="font-bold text-stone-900 text-sm">{step.title}</span>
                        </div>
                        <p className="text-sm text-stone-700 ml-7 leading-relaxed">
                          {step.instruction}
                        </p>
                        {step.tip && (
                          <p className="text-xs text-amber-800 ml-7 mt-1 font-medium">
                            💡 {step.tip}
                          </p>
                        )}
                      </div>

                      {step.durationSec && step.durationSec > 0 && (
                        <div className="ml-7 sm:ml-0 shrink-0">
                          <CookingTimer initialSeconds={step.durationSec} label={`단계 ${step.stepNumber}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Select Ramen for Slot A or Slot B */}
        {selectingSlot && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
              <div className="p-5 border-b border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-stone-900 text-lg">
                    {selectingSlot === 'A' ? '첫 번째' : '두 번째'} 라면 선택
                  </h3>
                  <button
                    onClick={() => setSelectingSlot(null)}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="라면 이름, 제조사, 풍미 검색 (예: 짜파게티, 매운맛, 소고기)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50"
                  />
                </div>

                {/* Brand Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['ALL', '농심', '삼양식품', '오뚜기', '팔도'].map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setBrandFilter(brand)}
                      className={`px-3 py-1 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                        brandFilter === brand
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {brand === 'ALL' ? '전체' : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {filteredRamens.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="cursor-pointer"
                  >
                    <ProductCardVisual product={product} size="sm" />
                  </div>
                ))}
                {filteredRamens.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-stone-400 text-sm">
                    일치하는 라면이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
