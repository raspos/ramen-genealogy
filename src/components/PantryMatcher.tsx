import { useState } from 'react';
import type { RamenProduct, CombinationScore } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { scoreCombination, generateMixedRecipe } from '../utils/pairingAlgorithm';
import { CookingTimer } from './CookingTimer';
import { Check, Plus, Trash2, Award, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface PantryMatcherProps {
  onOpenProductModal: (product: RamenProduct) => void;
  onSendToLab: (a: RamenProduct, b: RamenProduct) => void;
}

export function PantryMatcher({ onSendToLab }: PantryMatcherProps) {
  // Pre-select 3 popular ramens for immediate gratification
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'shin-ramyun',
    'sari-gomtang',
    'chapagetti',
  ]);
  const [expandedRecipeKey, setExpandedRecipeKey] = useState<string | null>(null);

  const activeRamens = RAMEN_DATASET.filter((p) => p.isActive);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 5) {
        alert('최대 5개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedProducts = selectedIds
    .map((id) => activeRamens.find((p) => p.id === id))
    .filter((p): p is RamenProduct => p !== undefined);

  // Compute all combinations of selected products: N * (N - 1) / 2
  const computedPairs: CombinationScore[] = [];
  for (let i = 0; i < selectedProducts.length; i++) {
    for (let j = i + 1; j < selectedProducts.length; j++) {
      computedPairs.push(scoreCombination(selectedProducts[i], selectedProducts[j]));
    }
  }

  // Find Best Match (highest composite score)
  const bestMatch =
    computedPairs.length > 0
      ? [...computedPairs].sort((a, b) => b.compositeScore - a.compositeScore)[0]
      : null;

  // Find Most Surprising Match (highest surprise score with decent composite >= 70)
  const mostSurprising =
    computedPairs.length > 1
      ? [...computedPairs]
          .filter((c) => c !== bestMatch && c.compositeScore >= 68)
          .sort((a, b) => b.surpriseScore - a.surpriseScore)[0] ||
        [...computedPairs]
          .filter((c) => c !== bestMatch)
          .sort((a, b) => b.surpriseScore - a.surpriseScore)[0]
      : null;

  return (
    <section id="pantry" className="py-10 sm:py-16 border-b border-stone-300 bg-[#f8f6f0]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-800 text-white tracking-wider">
            PANTRY COMBINATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 font-serif mt-2">
            내가 가진 라면으로 조합 찾기
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            찬장이나 서랍에 있는 라면을 3~5개 골라보세요. 가능한 모든 2개 조합을 계산하여 가장 조화로운 조합과 가장 뜻밖의 조합을 찾아드립니다.
          </p>
        </div>

        {/* Product Selector Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-300 shadow-md mb-8">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-xs font-bold text-stone-800">
              내 찬장의 라면 선택 ({selectedIds.length}/5개)
              <span className="text-stone-500 font-normal ml-2">
                (최소 3개, 최대 5개 선택)
              </span>
            </span>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> 모두 비우기
              </button>
            )}
          </div>

          {/* Quick Select Chips */}
          <div className="flex flex-wrap gap-2">
            {activeRamens.map((ramen) => {
              const isSelected = selectedIds.includes(ramen.id);
              return (
                <button
                  key={ramen.id}
                  type="button"
                  onClick={() => toggleSelect(ramen.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm ring-2 ring-emerald-500/50'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span>{ramen.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Computation Results */}
        {selectedIds.length < 3 ? (
          <div className="bg-white/70 border-2 border-dashed border-stone-300 rounded-3xl p-10 text-center text-stone-500 text-sm">
            라면을 최소 3개 이상 선택하시면 조합 분석이 시작됩니다. (현재 {selectedIds.length}개 선택됨)
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600">
                선택된 {selectedIds.length}개 라면으로 가능한 조합: 총 {computedPairs.length}가지
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Best Predicted Pairing */}
              {bestMatch && (
                <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/60 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-black px-4 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <Award className="w-3.5 h-3.5" /> 가장 잘 어울릴 것으로 예상되는 조합
                  </div>

                  <div>
                    <div className="flex items-center gap-3 my-3">
                      <span className="text-xl font-black text-stone-900">
                        {bestMatch.ramenA.name} + {bestMatch.ramenB.name}
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        궁합 {bestMatch.compositeScore}점
                      </span>
                    </div>

                    <p className="text-sm font-bold text-stone-800 font-serif leading-snug">
                      "{bestMatch.recommendationHook}"
                    </p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {bestMatch.expectedTaste}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center text-xs">
                      <div className="bg-stone-50 p-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 block">맛의 조화</span>
                        <span className="font-bold text-stone-800">{bestMatch.tasteHarmonyScore}점</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 block">조리 적합성</span>
                        <span className="font-bold text-stone-800">{bestMatch.cookCompatibilityScore}점</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 block">의외성</span>
                        <span className="font-bold text-stone-800">{bestMatch.surpriseScore}점</span>
                      </div>
                    </div>
                  </div>

                  {/* Expand Recipe button */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRecipeKey(
                          expandedRecipeKey === 'BEST' ? null : 'BEST'
                        )
                      }
                      className="text-xs font-bold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
                    >
                      {expandedRecipeKey === 'BEST' ? '레시피 닫기' : '상세 조리법 보기'}
                      {expandedRecipeKey === 'BEST' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendToLab(bestMatch.ramenA, bestMatch.ramenB)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer underline"
                    >
                      궁합 연구소에서 열기 →
                    </button>
                  </div>

                  {expandedRecipeKey === 'BEST' && (
                    <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2 animate-fadeIn">
                      {generateMixedRecipe(bestMatch.ramenA, bestMatch.ramenB).steps.map((st) => (
                        <div key={st.stepNumber} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {st.stepNumber}
                          </span>
                          <div className="flex-1">
                            <span className="font-bold text-stone-900">{st.title}: </span>
                            <span className="text-stone-700">{st.instruction}</span>
                          </div>
                          {st.durationSec && st.durationSec > 0 && (
                            <CookingTimer initialSeconds={st.durationSec} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Most Surprising Pairing */}
              {mostSurprising && (
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/60 shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-amber-600 text-white text-[11px] font-black px-4 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <Zap className="w-3.5 h-3.5" /> 가장 의외의 조합 (발견의 재미)
                  </div>

                  <div>
                    <div className="flex items-center gap-3 my-3">
                      <span className="text-xl font-black text-stone-900">
                        {mostSurprising.ramenA.name} + {mostSurprising.ramenB.name}
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        의외성 {mostSurprising.surpriseScore}점
                      </span>
                    </div>

                    <p className="text-sm font-bold text-stone-800 font-serif leading-snug">
                      "{mostSurprising.recommendationHook}"
                    </p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {mostSurprising.expectedTaste}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center text-xs">
                      <div className="bg-stone-50 p-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 block">맛의 조화</span>
                        <span className="font-bold text-stone-800">{mostSurprising.tasteHarmonyScore}점</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 block">조리 적합성</span>
                        <span className="font-bold text-stone-800">{mostSurprising.cookCompatibilityScore}점</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 block">종합 궁합</span>
                        <span className="font-bold text-amber-800">{mostSurprising.compositeScore}점</span>
                      </div>
                    </div>
                  </div>

                  {/* Expand Recipe button */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRecipeKey(
                          expandedRecipeKey === 'SURPRISE' ? null : 'SURPRISE'
                        )
                      }
                      className="text-xs font-bold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
                    >
                      {expandedRecipeKey === 'SURPRISE' ? '레시피 닫기' : '상세 조리법 보기'}
                      {expandedRecipeKey === 'SURPRISE' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendToLab(mostSurprising.ramenA, mostSurprising.ramenB)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer underline"
                    >
                      궁합 연구소에서 열기 →
                    </button>
                  </div>

                  {expandedRecipeKey === 'SURPRISE' && (
                    <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2 animate-fadeIn">
                      {generateMixedRecipe(mostSurprising.ramenA, mostSurprising.ramenB).steps.map((st) => (
                        <div key={st.stepNumber} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {st.stepNumber}
                          </span>
                          <div className="flex-1">
                            <span className="font-bold text-stone-900">{st.title}: </span>
                            <span className="text-stone-700">{st.instruction}</span>
                          </div>
                          {st.durationSec && st.durationSec > 0 && (
                            <CookingTimer initialSeconds={st.durationSec} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
