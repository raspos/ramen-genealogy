import { getAssetUrl } from '../utils/imageUrl';
import { useState } from 'react';
import { X, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { FACTION_TAXONOMY, type FactionNode, getFactionMembers } from '../data/factionTaxonomy';
import type { RamenProduct } from '../types/ramen';

interface FactionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFaction: (factionId: string) => void;
  onSelectProduct: (product: RamenProduct) => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    branchWeight: { [key: string]: number };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: '당신이 가장 먼저 찾는 라면의 기본 형태는?',
    subtitle: '국물의 유무는 라면 철학의 가장 큰 갈림길입니다.',
    options: [
      {
        label: '뜨끈하고 깊은 국물파 (湯派)',
        description: '밥 한 숟갈 말아먹을 수 있는 시원하고 깊은 국물이 필수',
        branchWeight: { 'spicy-beef': 3, 'spicy-seafood': 3, 'mild-bone': 3, 'rich-jjamppong': 2 }
      },
      {
        label: '소스에 비비고 볶아내는 비국물파 (乾派)',
        description: '국물을 버리고 농축된 양념과 면발 본연의 식감에 집중',
        branchWeight: { 'dry-jjajang': 3, 'dry-bibim': 3, 'dry-fire': 3, 'dry-cream': 3 }
      }
    ]
  },
  {
    id: 2,
    title: '선호하는 매운맛의 강도와 성격은?',
    subtitle: '매운맛은 단순한 척도가 아니라 풍미의 균형점입니다.',
    options: [
      {
        label: '한국인의 정석, 칼칼하고 얼큰한 매운맛',
        description: '고춧가루와 쇠고기·해물이 조화된 대중적 얼큰함',
        branchWeight: { 'spicy-beef': 4, 'spicy-seafood': 3, 'spicy-kimchi': 3 }
      },
      {
        label: '혀끝이 얼얼한 극한의 불맛 챌린지',
        description: '스트레스가 확 풀리는 강렬한 캡사이신 소스',
        branchWeight: { 'dry-fire': 5, 'rich-jjamppong': 2 }
      },
      {
        label: '자극 없이 구수하고 담백한 순한맛',
        description: '사골이나 멸치, 닭육수처럼 깊고 부드러운 감칠맛',
        branchWeight: { 'mild-bone': 5, 'mild-fish': 4, 'mild-chicken': 4 }
      },
      {
        label: '매콤함을 부드럽게 감싼 크림·치즈 퓨전',
        description: '투움바나 까르보나라처럼 고소하고 꾸덕한 스타일',
        branchWeight: { 'dry-cream': 5, 'dry-jjajang': 2 }
      }
    ]
  },
  {
    id: 3,
    title: '국물이나 양념에서 가장 중시하는 핵심 풍미는?',
    subtitle: '원재료의 개성이 국물과 소스의 정체성을 결정합니다.',
    options: [
      {
        label: '진한 쇠고기와 표고버섯의 묵직한 감칠맛',
        description: '한국 전통 육개장과 장터국밥의 얼큰한 정서',
        branchWeight: { 'spicy-beef': 4, 'mild-bone': 2 }
      },
      {
        label: '바다의 시원함, 오징어와 홍합의 해물 향',
        description: '텁텁함 없이 속이 확 풀리는 개운한 해장 스타일',
        branchWeight: { 'spicy-seafood': 4, 'mild-fish': 3, 'rich-jjamppong': 2 }
      },
      {
        label: '달콤 짭조름한 춘장과 볶음 양파의 조화',
        description: '짜장라면만의 중독성 있는 기름진 풍미',
        branchWeight: { 'dry-jjajang': 5 }
      },
      {
        label: '사과·배 과일 농축액의 매콤새콤함',
        description: '입맛 없을 때 침샘을 자극하는 청량한 맛',
        branchWeight: { 'dry-bibim': 5 }
      }
    ]
  }
];

export function FactionQuizModal({
  isOpen,
  onClose,
  onSelectFaction,
  onSelectProduct,
}: FactionQuizModalProps) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [resultFaction, setResultFaction] = useState<FactionNode | null>(null);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[step];

  const handleSelectOption = (weights: { [key: string]: number }) => {
    const updated = { ...scores };
    Object.entries(weights).forEach(([fId, val]) => {
      updated[fId] = (updated[fId] || 0) + val;
    });
    setScores(updated);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate winner
      let highestId = 'spicy-beef';
      let maxScore = -1;
      Object.entries(updated).forEach(([fId, val]) => {
        if (val > maxScore) {
          maxScore = val;
          highestId = fId;
        }
      });
      const winning = FACTION_TAXONOMY.find((f) => f.id === highestId) || FACTION_TAXONOMY[0];
      setResultFaction(winning);
    }
  };

  const handleReset = () => {
    setStep(0);
    setScores({});
    setResultFaction(null);
  };

  const handleApplyResult = () => {
    if (resultFaction) {
      onSelectFaction(resultFaction.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {!resultFaction ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-stone-400 mb-1">
                <span>질문 {step + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}% 진행</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-900 transition-all duration-300"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-stone-950 font-serif mt-4">
                {currentQ.title}
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-1">
                {currentQ.subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.branchWeight)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:bg-stone-50/80 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                      {opt.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="text-xs text-stone-500 font-medium mt-1">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Result View */}
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-serif">
                취향 분석 완료
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif mt-3">
                당신은 <span className="text-rose-700">「{resultFaction.name}」</span> 체질!
              </h3>
              <p className="text-xs font-black text-stone-400 font-mono mt-0.5">
                {resultFaction.hanja} · {resultFaction.parentBranchId === 'SOUP' ? '국물파' : '비국물파'}
              </p>
            </div>

            <div
              className="p-4 rounded-2xl border mb-6 text-center"
              style={{
                backgroundColor: resultFaction.themeColor.bg,
                borderColor: resultFaction.themeColor.border,
              }}
            >
              <p className="text-sm text-stone-800 font-serif italic">
                {resultFaction.doctrine}
              </p>
              <p className="text-xs text-stone-600 mt-2 font-medium">
                {resultFaction.summary}
              </p>
            </div>

            {/* Representative Recommendations */}
            <div className="mb-6">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                맞춤 추천 깃발 라면
              </div>
              <div className="grid grid-cols-3 gap-2">
                {getFactionMembers(resultFaction.id)
                  .filter((p) => p.isActive)
                  .slice(0, 3)
                  .map((product) => {
                    const defaultSvg = getAssetUrl("/images/products/${product.id}.svg");
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-center cursor-pointer group"
                      >
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-white p-1 mb-1 flex items-center justify-center border border-stone-100">
                          <img
                            src={product.imageUrl || defaultSvg}
                            alt={product.name}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (!target.src.endsWith('.svg')) target.src = defaultSvg;
                            }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-[11px] font-black text-stone-900 line-clamp-1 group-hover:text-rose-700">
                          {product.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 하기</span>
              </button>
              <button
                onClick={handleApplyResult}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>계보도에서 계열 위치 확인하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
