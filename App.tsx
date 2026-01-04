import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY_COUNT = 'mantra_counter_v0_count';
const STORAGE_KEY_TARGET = 'mantra_counter_v0_target';
const AUDIO_PATH = '/audio/demo.mp3';

/**
 * Buddhist Mantra Chanting & Manual Counter (V0)
 * 包含目標選擇畫面與計數畫面
 */
export default function App() {
  // --- State ---
  const [target, setTarget] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TARGET);
    return saved ? parseInt(saved, 10) : null;
  });

  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COUNT);
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  
  // --- Refs ---
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Effects ---
  // 持久化狀態
  useEffect(() => {
    if (target !== null) {
      localStorage.setItem(STORAGE_KEY_TARGET, target.toString());
    }
  }, [target]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COUNT, count.toString());
  }, [count]);

  // --- Handlers ---
  const handleSelectTarget = (val: number) => {
    setTarget(val);
  };

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    if (isConfirmingReset) setIsConfirmingReset(false);
  };

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const startReset = () => setIsConfirmingReset(true);
  const cancelReset = () => setIsConfirmingReset(false);
  const confirmReset = () => {
    setCount(0);
    setIsConfirmingReset(false);
  };

  const handleChangeTarget = () => {
    if (window.confirm('重新選擇目標將保留目前進度，確定嗎？')) {
      setTarget(null);
    }
  };

  // --- Render Helpers ---
  if (target === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdfaf6] text-[#4a3f35]">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-widest text-[#8c6d52] mb-3">設定修持目標</h1>
          <p className="text-[#a08e7d]">請選擇本次伴誦的定課數量</p>
        </header>
        
        <div className="grid gap-4 w-full max-w-xs">
          {[7, 49, 108].map((val) => (
            <button
              key={val}
              onClick={() => handleSelectTarget(val)}
              className="group relative overflow-hidden bg-white border-2 border-[#e8dfd5] rounded-2xl p-6 text-center transition-all hover:border-[#8c6d52] hover:shadow-lg active:scale-95"
            >
              <span className="block text-4xl font-bold text-[#8c6d52] mb-1">{val}</span>
              <span className="text-sm text-[#a08e7d]">
                {val === 7 && '初階隨喜'}
                {val === 49 && '精進功德'}
                {val === 108 && '圓滿如意'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((count / target) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 px-6 select-none bg-[#fdfaf6] text-[#4a3f35]">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-[#8c6d52] mb-1">
          般若心經伴誦
        </h1>
        <p className="text-sm text-[#a08e7d]">目標：{target} 遍</p>
      </header>

      {/* Mantra Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-12">
        <div className="text-center space-y-6">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-[#e8dfd5]">
            <p className="text-3xl leading-relaxed tracking-[0.2em] font-medium text-[#5d4d3f]">
              揭諦揭諦<br />
              波羅揭諦<br />
              波羅僧揭諦<br />
              菩提薩婆訶
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button 
              type="button"
              onClick={handleToggleAudio}
              className="flex items-center space-x-2 px-6 py-2 bg-[#8c6d52] text-white rounded-full hover:bg-[#7a5f48] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>暫停伴誦</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>開始伴誦</span>
                </>
              )}
            </button>
            <audio 
              ref={audioRef} 
              src={AUDIO_PATH} 
              loop 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </div>

        {/* Counter Section */}
        <div className="w-full space-y-8 flex flex-col items-center">
          <div className="text-center">
            <span className="text-8xl font-bold text-[#8c6d52] tracking-tighter tabular-nums">
              {count}
            </span>
            <div className="text-[#a08e7d] mt-2 font-medium tracking-widest uppercase">
              進度 {count} / {target}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#e8dfd5] h-3 rounded-full overflow-hidden shadow-inner max-w-[280px]">
            <div 
              className="bg-[#8c6d52] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-48 h-48 rounded-full bg-[#8c6d52] text-white text-6xl font-bold shadow-2xl active:scale-90 transition-transform flex items-center justify-center border-[12px] border-[#fdfaf6] ring-2 ring-[#8c6d52] cursor-pointer"
          >
            +1
          </button>
        </div>
      </main>

      {/* Footer / Reset Actions */}
      <footer className="w-full max-w-md pt-8 border-t border-[#e8dfd5] flex flex-col items-center space-y-4">
        {!isConfirmingReset ? (
          <div className="flex space-x-8">
            <button 
              type="button"
              onClick={handleChangeTarget}
              className="text-xs text-[#a08e7d] hover:text-[#8c6d52] transition-colors flex items-center space-x-1"
            >
              <span>變更目標</span>
            </button>
            <button 
              type="button"
              onClick={startReset}
              className="text-xs text-[#a08e7d] hover:text-red-500 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>重新計數</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-sm font-bold text-red-600">確定歸零？</span>
            <button 
              onClick={confirmReset}
              className="px-4 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 shadow-sm"
            >
              確定
            </button>
            <button 
              onClick={cancelReset}
              className="px-4 py-1.5 bg-white text-gray-400 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              取消
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
