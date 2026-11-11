import type { HistoricalEventMilestone, LineageLegendNode } from '../data/historicalGenealogyData';
import { getAssetUrl } from '../utils/imageUrl';
import {
  X,
  Calendar,
  Building2,
  Sparkles,
  Swords,
  Globe2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface LineageMilestoneModalProps {
  milestone: HistoricalEventMilestone;
  onClose: () => void;
  onSelectProductNode?: (node: LineageLegendNode) => void;
  getNodeById: (id: string) => LineageLegendNode | undefined;
}

export function LineageMilestoneModal({
  milestone,
  onClose,
  onSelectProductNode,
  getNodeById
}: LineageMilestoneModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition shadow-md"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 text-stone-950 text-xs font-black font-mono shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{milestone.year}년 라면사 분기점</span>
            </span>
            {milestone.hanjaTitle && (
              <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-amber-300 text-xs font-serif font-black border border-stone-700">
                {milestone.hanjaTitle}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight pr-10">
            {milestone.title}
          </h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-stone-800">
          {/* Summary Quote Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-stone-800 leading-relaxed text-sm font-medium">
            <p className="font-serif italic">“{milestone.summary}”</p>
          </div>

          {/* Key Product Cards */}
          <div>
            <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>이 사건의 핵심 주역 라면</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {milestone.keyProducts.map((pId) => {
                const node = getNodeById(pId);
                if (!node) return null;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      if (onSelectProductNode) onSelectProductNode(node);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/90 flex items-center justify-between gap-3 text-left cursor-pointer transition hover:border-amber-400 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-stone-200 flex items-center justify-center shrink-0">
                        <img
                          src={getAssetUrl(node.imageUrl)}
                          alt={node.name}
                          className="max-h-full max-w-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            {node.releaseYear}년
                          </span>
                          <span className="text-[10px] text-stone-500 font-bold truncate">
                            {node.manufacturer}
                          </span>
                        </div>
                        <h5 className="text-xs font-black text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                          {node.name}
                        </h5>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Deep Storytelling Pillars */}
          <div className="space-y-3 pt-1">
            {/* 1. 당시 라면 시장 상황 */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 font-serif">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>당시 라면 시장 상황</span>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed pl-6">
                {milestone.marketContext}
              </p>
            </div>

            {/* 2. 새롭게 등장한 제품과 특징 */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 font-serif">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>새롭게 등장한 제품과 특징</span>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed pl-6">
                {milestone.innovationFeatures}
              </p>
            </div>

            {/* 3. 기존 주류와 무엇이 달랐는지 */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 font-serif">
                <Swords className="w-4 h-4 text-rose-600" />
                <span>기존 주류와의 결정적 차이</span>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed pl-6">
                {milestone.distinctionFromMainstream}
              </p>
            </div>

            {/* 4. 이후 시장에 남긴 역사적 영향 */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 font-serif">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                <span>이후 시장에 남긴 역사적 영향</span>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed pl-6">
                {milestone.marketLegacy}
              </p>
            </div>
          </div>

          {/* Sources & Citations */}
          {milestone.sources && milestone.sources.length > 0 && (
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>근거 자료 및 역사 기록 출처</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-500 pl-1">
                {milestone.sources.map((src, idx) => (
                  <li key={idx} className="leading-tight">
                    {src}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer transition shadow-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
