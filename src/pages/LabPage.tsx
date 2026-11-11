import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { RamenProduct } from '../types/ramen';
import { DailyPairingHero } from '../components/DailyPairingHero';
import { ChemistryLab } from '../components/ChemistryLab';
import { PantryMatcher } from '../components/PantryMatcher';
import { Sparkles, Sliders, Layers } from 'lucide-react';

interface LabPageProps {
  onSelectProduct: (product: RamenProduct) => void;
}

export function LabPage({ onSelectProduct }: LabPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'daily';

  const [activeTab, setActiveTab] = useState<'daily' | 'custom' | 'pantry'>(
    initialTab === 'custom' ? 'custom' : initialTab === 'pantry' ? 'pantry' : 'daily'
  );

  const [customRamenA, setCustomRamenA] = useState<RamenProduct | null>(null);
  const [customRamenB, setCustomRamenB] = useState<RamenProduct | null>(null);

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'custom' || tabParam === 'pantry' || tabParam === 'daily') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'daily' | 'custom' | 'pantry') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSendToLab = (a: RamenProduct, b: RamenProduct) => {
    setCustomRamenA(a);
    setCustomRamenB(b);
    setActiveTab('custom');
    setSearchParams({ tab: 'custom' });
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-serif font-bold mb-3 shadow-xs">
            <span>라면 조합 연구소 · 의 </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-950 font-serif tracking-tight leading-tight">
            라면 조합 연구소
          </h1>

          <p className="mt-2 text-sm sm:text-base text-stone-600 font-medium max-w-2xl mx-auto">
            매일 선정되는 오늘의 추천 조합부터 스프·물의 양을 조절하는 실시간 실험실, 집에 있는 라면으로 찾는 찬장 최적 조합까지 하나의 연구소에서 탐험합니다.
          </p>

          {/* 3-in-1 Mode Segmented Control */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-stone-200/80 border border-stone-300 max-w-md w-full shadow-inner">
            <button
              onClick={() => handleTabChange('daily')}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'daily'
                  ? 'bg-stone-900 text-amber-300 shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>오늘의 조합</span>
            </button>

            <button
              onClick={() => handleTabChange('custom')}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-stone-900 text-amber-300 shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>직접 조합하기</span>
            </button>

            <button
              onClick={() => handleTabChange('pantry')}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'pantry'
                  ? 'bg-stone-900 text-amber-300 shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>내 찬장</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pb-16">
        {activeTab === 'daily' && (
          <DailyPairingHero
            onSelectProduct={onSelectProduct}
            onSendToLab={handleSendToLab}
          />
        )}

        {activeTab === 'custom' && (
          <ChemistryLab
            initialRamenA={customRamenA}
            initialRamenB={customRamenB}
            onOpenProductModal={onSelectProduct}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryMatcher
            onOpenProductModal={onSelectProduct}
            onSendToLab={handleSendToLab}
          />
        )}
      </div>
    </div>
  );
}
