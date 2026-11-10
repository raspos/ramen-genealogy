import { NavLink, Link } from 'react-router-dom';
import { HelpCircle, GitFork, FlaskConical, Trophy, BookOpen } from 'lucide-react';
import { getKSTDateString } from '../utils/dailyRecommendation';

interface HeaderProps {
  onOpenMethodology: () => void;
}

export function Header({ onOpenMethodology }: HeaderProps) {
  const kstDate = getKSTDateString();

  const navItems = [
    { to: '/', label: '라면의 계보', icon: GitFork, end: true },
    { to: '/lab', label: '라면 조합 연구소', icon: FlaskConical },
    { to: '/ranking', label: '라면 랭킹', icon: Trophy },
    { to: '/encyclopedia', label: '라면 도감', icon: BookOpen },
  ];

  return (
    <header className="border-b border-stone-200 bg-[#faf9f5] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Top Meta Strip */}
      <div className="border-b border-stone-200/80 px-4 py-1.5 text-xs text-stone-600 max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-rose-800 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
            데이터저널리즘
          </span>
          <span className="text-stone-300">|</span>
          <span className="font-mono text-stone-700 text-[11px]">KST {kstDate} (00:00 갱신)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-500 hidden md:inline text-[11px]">식품의약품안전처 · 한국소비자원 DB 검증</span>
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer underline underline-offset-2"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>분석 방법론</span>
          </button>
        </div>
      </div>

      {/* Main Masthead & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-baseline gap-2.5 select-none">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest font-black uppercase text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60">
                1963 — 2026 ARCHIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight font-serif mt-0.5 group-hover:text-rose-700 transition-colors">
              라면의 계보
            </h1>
          </div>
        </Link>

        {/* 4 Independent Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold ${
                    isActive
                      ? 'bg-stone-900 text-amber-300 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
