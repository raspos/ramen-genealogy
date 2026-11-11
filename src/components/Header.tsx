import { NavLink } from 'react-router-dom';
import { GitFork, FlaskConical, Trophy, BookOpen, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology?: () => void;
}

// 라면 면발 & 그릇 그래픽 로고 SVG
function RamenNoodleLogo() {
  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-rose-600 to-red-700 p-1.5 shadow-md shadow-rose-900/20 group-hover:scale-105 group-hover:rotate-[-2deg] transition-all duration-300">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* 모락모락 김 (Steam) */}
        <path
          d="M15 9C15 6 18 5 16 2"
          stroke="#fed7aa"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M24 9C24 5 28 4 25 1"
          stroke="#fef08a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M33 9C33 6 36 5 34 2"
          stroke="#fed7aa"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* 전통 라면 그릇 (Red Ceramic Bowl) */}
        <path
          d="M7 22C7 34 14.5 42 24 42C33.5 42 41 34 41 22H7Z"
          fill="#991b1b"
        />
        <path
          d="M6 21C6 19.5 9 19 24 19C39 19 42 19.5 42 21H6Z"
          fill="#7f1d1d"
        />
        {/* 그릇 굽 */}
        <path
          d="M18 42H30V44C30 44.5 29.5 45 29 45H19C18.5 45 18 44.5 18 44V42Z"
          fill="#450a0a"
        />

        {/* 얼큰한 라면 국물 (Soup Surface) */}
        <ellipse cx="24" cy="21" rx="15.5" ry="3.5" fill="#ea580c" />

        {/* 꼬불꼬불 황금빛 라면 면발 (Curling Ramen Noodles) */}
        {/* 1단 웨이브 면발 */}
        <path
          d="M11 20C12.5 16 15 17 17 20C19 23 21 16 23 20C25 24 28 17 30 20C32 23 34 18 36 20"
          stroke="#fde047"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 2단 웨이브 면발 */}
        <path
          d="M13 24C14.5 21 17 22 19 25C21 28 23 22 25 25C27 28 30 22 32 25C33.5 27 35 24 37 24"
          stroke="#facc15"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 3단 깊은 면발 */}
        <path
          d="M16 29C18 27 20 28 22 30C24 32 26 28 28 30C30 32 32 28 34 29"
          stroke="#eab308"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 젓가락 (Chopsticks) */}
        <path
          d="M39 6L21 21"
          stroke="#fef3c7"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M41 9L25 22"
          stroke="#fde68a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function Header({ onOpenMethodology: _onOpenMethodology }: HeaderProps) {
  // 라면의 계보 클릭 시 새로고침 (초기화)
  const handleReloadToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.hash === '#/' || window.location.hash === '') {
      window.location.reload();
    } else {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  return (
    <header className="border-b border-stone-200 bg-[#faf9f5] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Main Masthead & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo & databrew badge */}
        <div className="flex items-center gap-3">
          <a
            href="#/"
            onClick={handleReloadToHome}
            className="group flex items-center gap-3 select-none cursor-pointer"
            title="라면의 계보 홈으로 (클릭 시 새로고침)"
          >
            {/* 라면 면발 그래픽 로고 */}
            <RamenNoodleLogo />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest font-black uppercase text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60">
                  1963 — 2026 ARCHIVE
                </span>
                <span className="text-[10px] font-mono font-bold text-stone-500 hidden sm:inline">
                  대한민국 60년 라면 전사
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight font-serif mt-0.5 group-hover:text-rose-700 transition-colors flex items-center gap-1.5">
                <span>라면의 계보</span>
              </h1>
            </div>
          </a>
        </div>

        {/* 5 Independent Navigation Tabs (라면의 계보 + 농심 라면의 계보 상단 연결) */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 text-xs sm:text-sm font-medium">
          {/* 라면의 계보 (현재 아카이브) */}
          <NavLink
            to="/"
            end
            onClick={(e) => {
              if (window.location.hash === '#/' || window.location.hash === '') {
                handleReloadToHome(e);
              }
            }}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold ${
                isActive
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`
            }
          >
            <GitFork className="w-4 h-4" />
            <span>라면의 계보</span>
          </NavLink>

          {/* 농심 라면의 계보 (단독 60년 아카이브 바로가기) */}
          <a
            href="https://raspos.github.io/nongshim-genealogy/"
            title="한국 라면 40년 1위 종가 '농심 라면의 계보'로 이동"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold text-red-900 hover:text-red-950 hover:bg-red-100/70 border border-red-300/80 bg-red-50/70 shadow-2xs group"
          >
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>농심 라면의 계보</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200 font-bold group-hover:bg-red-200 flex items-center gap-0.5">
              <span>60년 족보</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>

          {/* 라면 조합 연구소 */}
          <NavLink
            to="/lab"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold ${
                isActive
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`
            }
          >
            <FlaskConical className="w-4 h-4" />
            <span>라면 조합 연구소</span>
          </NavLink>

          {/* 라면 랭킹 */}
          <NavLink
            to="/ranking"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold ${
                isActive
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`
            }
          >
            <Trophy className="w-4 h-4" />
            <span>라면 랭킹</span>
          </NavLink>

          {/* 라면 도감 */}
          <NavLink
            to="/encyclopedia"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold ${
                isActive
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>라면 도감</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
