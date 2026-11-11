import { useEffect, useRef, useState } from 'react';
import { Eye, Users } from 'lucide-react';
import { fetchVisitorStats, getLocalCachedStats, type VisitorStats } from '../utils/counterService';

export function VisitorCounter() {
  const fetchedRef = useRef(false);
  const [stats, setStats] = useState<VisitorStats>(() => getLocalCachedStats());

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchVisitorStats().then((data) => {
      setStats(data);
    });
  }, []);

  return (
    <div className="inline-flex items-center justify-center">
      <div
        className="inline-flex flex-wrap items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs shadow-inner select-none backdrop-blur-xs transition-all hover:border-stone-700"
        title={
          stats.isRemoteVerified
            ? '실시간 세션 공용 카운터 API 동기화'
            : '외부 카운터 동기화 대기 — 로컬 캐시 집계'
        }
      >
        {/* Today sessions */}
        <div className="flex items-center gap-1.5 text-stone-400">
          <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-[11px] font-bold text-stone-300">
            오늘 접속(세션)
          </span>
          <span className="font-mono font-bold text-amber-300 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-xs">
            {stats.today.toLocaleString()}
          </span>
        </div>

        <span className="text-stone-700 font-bold select-none">|</span>

        {/* Total sessions */}
        <div className="flex items-center gap-1.5 text-stone-400">
          <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-bold text-stone-300">
            누적 접속
          </span>
          <span className="font-mono font-bold text-emerald-300 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-xs">
            {stats.total.toLocaleString()}
          </span>
          {!stats.isRemoteVerified && (
            <span className="text-[10px] text-stone-500 px-1 rounded bg-stone-950 border border-stone-800">
              캐시
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
