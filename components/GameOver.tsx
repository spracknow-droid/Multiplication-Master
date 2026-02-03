
import React, { useEffect, useState } from 'react';
import { GameResult, AIAnalysis } from '../types';
import { getGameAnalysis } from '../services/geminiService';

interface GameOverProps {
  result: GameResult;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ result, onRestart }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const data = await getGameAnalysis(result);
      setAnalysis(data);
      setLoading(false);
    };
    fetchAnalysis();
  }, [result]);

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-50 text-center">
        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-crown text-4xl"></i>
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">게임 끝!</h2>
        <div className="flex justify-center gap-8 my-6 py-4 border-y border-slate-50">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold">최종 점수</p>
            <p className="text-2xl font-black text-pink-600">{result.score}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold">최고 기록</p>
            <p className="text-2xl font-black text-orange-500">{result.maxCombo}회</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-6 h-6 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 italic">AI 선생님이 결과를 보고 있어요...</p>
          </div>
        ) : analysis && (
          <div className="bg-pink-50 rounded-2xl p-6 text-left mb-8 border border-pink-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <i className="fa-solid fa-sparkles text-4xl text-pink-500"></i>
            </div>
            <h3 className="font-black text-pink-700 mb-1">{analysis.title}</h3>
            <p className="text-sm text-pink-900 mb-3 leading-relaxed">{analysis.summary}</p>
            <div className="bg-white rounded-xl p-3 border border-pink-200">
              <p className="text-xs font-bold text-pink-600 uppercase mb-1">선생님의 꿀팁</p>
              <p className="text-sm text-slate-700">{analysis.advice}</p>
            </div>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-pink-200 active:scale-95"
        >
          다시 도전하기!
        </button>
      </div>
    </div>
  );
};

export default GameOver;
