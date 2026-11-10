import { useState } from 'react';
import type { RamenProduct, TastePreferences, TasteMatchResult } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { matchRamenToPreferences } from '../utils/tasteMatchingAlgorithm';
import { ProductCardVisual } from './ProductCardVisual';
import { Compass, CheckCircle2, RotateCcw, ArrowLeft, Sparkles, ChefHat } from 'lucide-react';

interface TasteFinderProps {
  onSelectForLab?: (product: RamenProduct) => void;
  onViewProduct?: (product: RamenProduct) => void;
}

export function TasteFinder({ onSelectForLab, onViewProduct }: TasteFinderProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [preferences, setPreferences] = useState<TastePreferences>({
    brothPreference: 'ANY',
    spicinessLevel: 'ANY',
    flavorFocus: 'ANY',
    noodleStyle: 'ANY',
    healthFocus: 'ANY',
    cookTimePreference: 'ANY',
  });
  const [results, setResults] = useState<TasteMatchResult[] | null>(null);

  const totalSteps = 6;

  const handleSelectOption = (key: keyof TastePreferences, value: string) => {
    const nextPrefs = { ...preferences, [key]: value };
    setPreferences(nextPrefs);

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate TOP 5 results
      const matches = matchRamenToPreferences(nextPrefs, RAMEN_DATASET);
      setResults(matches);
    }
  };

  const handleReset = () => {
    setPreferences({
      brothPreference: 'ANY',
      spicinessLevel: 'ANY',
      flavorFocus: 'ANY',
      noodleStyle: 'ANY',
      healthFocus: 'ANY',
      cookTimePreference: 'ANY',
    });
    setCurrentStep(1);
    setResults(null);
  };

  return (
    <section id="taste-finder" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-900/40">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>경향신문 '랭면의 취향' 오마주 인터랙티브 인터뷰</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            내 라면 취향 찾기
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-300">
            6가지 질문으로 당신의 숨은 라면 취향을 진단하고, 197종 데이터베이스에서 가장 완벽한 라면 TOP 5를 찾아드립니다.
          </p>
        </div>

        {/* Progress Bar (Visible during questions) */}
        {!results && (
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex justify-between items-center text-xs text-amber-300/80 mb-2 font-semibold">
              <span>질문 {currentStep} / {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% 완료</span>
            </div>
            <div className="w-full bg-stone-700/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-rose-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* QUESTION SCREENS */}
        {!results && (
          <div className="max-w-2xl mx-auto">
            {/* Step 1: 국물 및 조리 방식 */}
            {currentStep === 1 && (
              <div className="animate-fadeIn space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Step 1</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                    오늘 끌리는 라면의 조리 형태는 무엇인가요?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'SOUP', title: '뜨끈한 국물 라면', desc: '온몸이 풀리는 얼큰하고 깊은 국물' },
                    { val: 'STIR_FRY', title: '자작한 볶음 라면', desc: '국물 없이 양념이 찰싹 붙은 볶음면' },
                    { val: 'BIBIM', title: '새콤달콤 비빔면', desc: '입맛 돋우는 매콤달콤한 비빔 소스' },
                    { val: 'COLD', title: '시원한 냉라면 / 소바', desc: '살얼음 띄운 냉면이나 시원한 쯔유' },
                    { val: 'ANY', title: '상관없음 (모두 좋아함)', desc: '맛있다면 어떤 조리법이든 환영' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('brothPreference', opt.val)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        preferences.brothPreference === opt.val
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/40'
                          : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-base text-amber-200">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: 맵기 강도 */}
            {currentStep === 2 && (
              <div className="animate-fadeIn space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Step 2</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                    원하시는 매운맛 강도는 어느 정도인가요?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'MILD', title: '순한맛 (0~1단계)', desc: '사리곰탕, 진라면 순한맛 등 맵지 않고 담백함' },
                    { val: 'MEDIUM', title: '신라면급 보통 (2단계)', desc: '한국인의 표준 매운맛 (약 3,400 SHU 내외)' },
                    { val: 'HOT', title: '열라면급 칼칼함 (3단계)', desc: '땀이 송글송글 맺히는 화끈한 매운맛 (5,000 SHU)' },
                    { val: 'EXTREME', title: '불닭·틈새급 극한 (4~5단계)', desc: '혀를 마비시키는 극강의 매운맛 (8,000+ SHU)' },
                    { val: 'ANY', title: '상관없음 (맵기 무관)', desc: '매운맛 여부는 크게 중요하지 않음' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('spicinessLevel', opt.val)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        preferences.spicinessLevel === opt.val
                          ? 'bg-rose-500/20 border-rose-400 text-white shadow-lg ring-2 ring-rose-400/40'
                          : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-base text-rose-200">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: 맛의 중심 풍미 */}
            {currentStep === 3 && (
              <div className="animate-fadeIn space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Step 3</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                    가장 선호하는 베이스 국물·양념 풍미는?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'BEEF', title: '소고기·사골 진국', desc: '진한 사골 육수와 소고기 장국 베이스' },
                    { val: 'SEAFOOD', title: '시원한 해물·오징어', desc: '꽃게, 오징어, 조개의 개운하고 시원한 바다 맛' },
                    { val: 'CHEESE', title: '고소한 치즈·크림', desc: '부드럽고 꾸덕꾸덕한 치즈와 크림소스' },
                    { val: 'JJAJANG', title: '정통 춘장 짜장', desc: '달콤 짭조름하게 볶아낸 진한 춘장맛' },
                    { val: 'VEG_CHICKEN', title: '깔끔 채소·닭육수', desc: '담백한 치킨 브로스 또는 산뜻한 버섯 채수' },
                    { val: 'ANY', title: '상관없음 (풍미 무관)', desc: '어떤 국물 베이스든 다채롭게 즐김' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('flavorFocus', opt.val)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        preferences.flavorFocus === opt.val
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/40'
                          : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-base text-amber-200">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: 면발 식감 */}
            {currentStep === 4 && (
              <div className="animate-fadeIn space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Step 4</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                    어떤 식감의 면발을 가장 좋아하시나요?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'THICK', title: '굵고 오동통한 굵은 면', desc: '너구리, 진짬뽕처럼 씹는 맛이 풍부한 면발' },
                    { val: 'STANDARD', title: '꼬들꼬들한 보통 면', desc: '신라면, 안성탕면 등 가장 친숙하고 탄력 있는 면' },
                    { val: 'THIN', title: '얇고 부드러운 가는 면', desc: '육개장 사발면, 스낵면처럼 후루룩 넘어가는 면' },
                    { val: 'NON_FRIED', title: '기름에 튀기지 않은 건면', desc: '바람에 말려 칼로리가 낮고 쫄깃한 생면 식감' },
                    { val: 'GLASS_RICE', title: '가벼운 당면 / 쌀면', desc: '컵누들, 쌀국수처럼 부담 없이 가벼운 면발' },
                    { val: 'ANY', title: '상관없음 (면발 무관)', desc: '면의 굵기와 공법에 구애받지 않음' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('noodleStyle', opt.val)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        preferences.noodleStyle === opt.val
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/40'
                          : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-base text-amber-200">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: 건강 및 영양 */}
            {currentStep === 5 && (
              <div className="animate-fadeIn space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Step 5</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                    칼로리와 나트륨에 대한 기준이 있으신가요?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: 'ANY', title: '상관없음', desc: '라면은 원래 진하고 맛있게 먹는 것!' },
                    { val: 'LOW_CALORIE', title: '저칼로리 우선', desc: '400kcal 이하 가벼운 한 끼 원함' },
                    { val: 'LOW_SODIUM', title: '나트륨 저감 우선', desc: '1,350mg 이하로 나트륨 부담 완화' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('healthFocus', opt.val)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        preferences.healthFocus === opt.val
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/40'
                          : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-base text-emerald-200">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: 조리 시간 */}
            {currentStep === 6 && (
              <div className="animate-fadeIn space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Step 6</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                    선호하는 조리 시간과 편의성은?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: 'ANY', title: '상관없음', desc: '맛만 있다면 2분이든 5분이든 OK' },
                    { val: 'FAST', title: '3분 이내 초스피드', desc: '컵라면처럼 물만 부어 바로 먹는 편리함' },
                    { val: 'STANDARD', title: '4~5분 정석 조리', desc: '냄비에 보글보글 끓여내는 깊은 조리' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('cookTimePreference', opt.val)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        preferences.cookTimePreference === opt.val
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/40'
                          : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-base text-amber-200">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-stone-700/50">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                이전 질문
              </button>
              <span className="text-xs text-stone-400">선택지를 클릭하면 자동으로 다음 단계로 넘어갑니다</span>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {results && (
          <div className="animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>취향 진단 알고리즘 매칭 완료</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                당신의 라면 취향 매칭 TOP 5
              </h3>
              <p className="text-sm text-stone-300 mt-1">
                선택하신 선호도와 197개 제품 데이터의 국물·맵기·면발·영양 성분을 다면 대조한 결과입니다.
              </p>
            </div>

            {/* Top 5 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {results.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="bg-stone-800/90 rounded-2xl p-4 border border-stone-700/80 flex flex-col justify-between hover:border-amber-400/60 transition-all hover:scale-[1.02] shadow-xl group"
                >
                  <div>
                    {/* Rank Badge & Match % */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          idx === 0
                            ? 'bg-amber-400 text-stone-900 shadow-md ring-2 ring-amber-300'
                            : 'bg-stone-700 text-stone-200'
                        }`}
                      >
                        TOP {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {item.matchPercentage}% 일치
                      </span>
                    </div>

                    {/* Product Visual Card */}
                    <ProductCardVisual
                      product={item.product}
                      size="sm"
                      showDetails={false}
                      onClick={() => onViewProduct?.(item.product)}
                    />

                    {/* Fit Reason Box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-stone-900/60 border border-stone-700/50 text-[11px] text-stone-300 leading-relaxed">
                      <span className="text-amber-400 font-bold block mb-1">추천 포인트</span>
                      {item.fitSummary}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-stone-700/60 flex flex-col gap-1.5">
                    {onSelectForLab && (
                      <button
                        onClick={() => onSelectForLab(item.product)}
                        className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>궁합 연구소 담기</span>
                      </button>
                    )}
                    {onViewProduct && (
                      <button
                        onClick={() => onViewProduct(item.product)}
                        className="w-full py-1 text-center text-stone-400 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        상세 정보 보기 →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Restart Button */}
            <div className="text-center mt-10">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm border border-stone-600 transition-all cursor-pointer shadow-lg hover:border-amber-400"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>취향 질문 다시 하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
