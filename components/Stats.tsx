
import React from 'react';

interface StatsProps {
  score: number;
  timeLeft: number;
  combo: number;
}

const Stats: React.FC<StatsProps> = ({ score, timeLeft, combo }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-md bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">내 점수</p>
        <p className="text-3xl font-black text-pink-500">{score.toLocaleString()}</p>
      </div>
      
      <div className="text-center relative">
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-colors duration-300 ${timeLeft < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-pink-100 text-slate-700'}`}>
          <span className="text-2xl font-black">{timeLeft}초</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">연속 정복</p>
        <div className="flex flex-col items-center">
          <p className={`text-3xl font-black transition-all duration-200 ${combo > 0 ? 'text-orange-500 scale-110' : 'text-slate-300'}`}>
            {combo}회
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
