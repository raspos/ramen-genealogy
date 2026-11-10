import { ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-300 flex flex-col text-stone-800">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              데이터 저널리즘 원칙
            </span>
            <h3 className="font-black text-stone-900 text-xl font-serif">
              분석 방법론 및 데이터 출처 고지
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm leading-relaxed">
          {/* Section 1 */}
          <div>
            <h4 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-stone-700" /> 1. 데이터 수집 출처
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm">
              본 서비스는 가공된 허위 정보나 임의 추정치를 지양하며, 아래의 공식 출처를 기반으로 데이터를 구축했습니다.
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>식품의약품안전처</strong> 식품영양성분 데이터베이스 (열량, 나트륨, 탄수화물, 단백질, 지방)</li>
              <li><strong>한국소비자원 라면 시험·평가</strong> (2026.11 발표 매운맛 라면 12종 캡사이신류 및 나트륨 실측 시험 결과)</li>
              <li><strong>제조사 공식 공시</strong> (농심, 삼양식품, 오뚜기, 팔도 제품 포장지 및 공식 홈페이지 기재 조리법)</li>
              <li><strong>기업 역사 사료집</strong> (농심 50년사, 삼양식품 역사 기록, 팔도 아카이브)</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. 4단계 데이터 신뢰도 구분
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900 block">VERIFIED (공식 검증)</span>
                <span className="text-emerald-800">식약처·소비자원·제조사 공시로 확인된 사실</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                <span className="font-bold text-sky-900 block">CALCULATED (검증 계산치)</span>
                <span className="text-sky-800">검증된 데이터 간 수학적 연산으로 도출된 수치</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block">ESTIMATED (알고리즘 추정치)</span>
                <span className="text-amber-800">미분리 나트륨 스프 비중 등 규칙 기반 예측치</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
                <span className="font-bold text-stone-700 block">MISSING (자료 없음)</span>
                <span className="text-stone-500">실측 데이터가 없는 항목 (임의 수치 부여 금지)</span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h4 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-rose-600" /> 3. 궁합 및 추천 알고리즘 원칙
            </h4>
            <div className="space-y-2 text-xs text-stone-700">
              <p>
                • <strong>선택 순서 불변성(대칭성)</strong>: 제품 A와 B를 선택하는 순서가 바뀌어도 궁합 점수 및 레시피 결과가 완벽히 동일합니다 ($f(A, B) = f(B, A)$).
              </p>
              <p>
                • <strong>일일 추천의 고정성</strong>: 한국 표준시(KST) 매일 00:00 기준 날짜 문자열 해시를 통해 모든 사용자에게 동일한 조합이 노출되며, 최근 60일 내 추천된 제품은 자동 배제됩니다.
              </p>
              <p>
                • <strong>매운맛과 나트륨의 정직성</strong>: 제조사 스코빌과 소비자원 실측 캡사이신은 측정 조건이 다르므로 하나의 순위로 왜곡하지 않고 분리 제공합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
