import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

interface CookingTimerProps {
  initialSeconds: number;
  label?: string;
}

export function CookingTimer({ initialSeconds, label }: CookingTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play pleasant chime on finish using Web Audio API
  const playChime = () => {
    try {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio playback might be restricted if no user interaction yet
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const toggleRun = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(initialSeconds);
      setIsFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setSecondsLeft(initialSeconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((initialSeconds - secondsLeft) / initialSeconds) * 100));

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${
      isFinished 
        ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
        : isRunning 
          ? 'bg-rose-50 border-rose-300 text-rose-900' 
          : 'bg-stone-50 border-stone-200 text-stone-700'
    }`}>
      {label && <span className="font-medium text-xs text-stone-500 mr-1">{label}</span>}
      <div className="flex items-center gap-1 font-mono font-bold tracking-wider">
        {isFinished ? (
          <span className="flex items-center gap-1 text-amber-700">
            <Bell className="w-3.5 h-3.5 animate-bounce" /> 완료!
          </span>
        ) : (
          <span>{formatTime(secondsLeft)}</span>
        )}
      </div>

      {/* Progress pill */}
      <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-rose-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-1 ml-1">
        <button
          type="button"
          onClick={toggleRun}
          className="p-1 rounded hover:bg-stone-200/70 text-stone-700 transition"
          title={isRunning ? '일시정지' : '시작'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="p-1 rounded hover:bg-stone-200/70 text-stone-500 transition"
          title="초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
