import { VisitorCounter } from './VisitorCounter';

interface FooterProps {
  onOpenMethodology: () => void;
}

export function Footer({ onOpenMethodology }: FooterProps) {
  return (
    <footer className="border-t border-stone-300 bg-[#efebe1] py-12 text-stone-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-stone-900 text-lg font-serif">라면의 계보</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold">
              K-RAMEN ARCHIVE
            </span>
            <a
              href="https://raspos.github.io/databrew/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-rose-800 hover:text-stone-950 font-black underline underline-offset-2 ml-1"
            >
              by databrew
            </a>
          </div>
          <p className="text-stone-600 leading-relaxed">
            "60년 라면의 역사부터 오늘의 새로운 조합까지" — 한국 라면의 맛과 역사, 영양성분을 정밀 데이터로 기록하고 새로운 미식의 조합을 탐색하는 인터랙티브 데이터저널리즘 프로젝트입니다.
          </p>
          <div className="pt-2 text-[11px] text-stone-500">
            데이터 출처: 식품의약품안전처 · 한국소비자원(2026.11) · 농심 · 삼양식품 · 오뚜기 · 팔도
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
            데이터 원칙 및 고지
          </h4>
          <ul className="space-y-1.5 text-stone-600">
            <li>
              <button
                type="button"
                onClick={onOpenMethodology}
                className="hover:text-stone-900 underline cursor-pointer"
              >
                분석 방법론 및 신뢰도 기준
              </button>
            </li>
            <li>• 맛의 궁합은 실측 사실이 아닌 규칙 기반 예측 모델입니다.</li>
            <li>• 면/스프 미분리 제품의 나트륨 수치는 추정치 고지를 포함합니다.</li>
          </ul>
        </div>
      </div>

      {/* Visitor Counter Section (Hongdam Craft Style) */}
      <div className="max-w-6xl mx-auto px-4 mt-8 flex justify-center">
        <VisitorCounter />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 pt-6 border-t border-stone-300/70 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span>©</span>
          <a
            href="https://raspos.github.io/databrew/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-stone-800 hover:text-rose-700 underline underline-offset-2 transition-colors"
          >
            databrew
          </a>
          <span>· 라면의 계보 (The Genealogy of Korean Ramen). All rights reserved.</span>
        </div>
        <span className="flex items-center gap-1">
          한국 라면 60년의 맛과 역사에 헌정합니다.
        </span>
      </div>
    </footer>
  );
}
