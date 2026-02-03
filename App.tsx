
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Question, GameResult } from './types';
import Stats from './components/Stats';
import GameOver from './components/GameOver';

const INITIAL_TIME = 30;
const BONUS_TIME = 1;

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateQuestion = useCallback(() => {
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCurrentQuestion({ num1, num2, answer: num1 * num2 });
    setUserInput('');
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setMistakes([]);
    setStatus(GameStatus.PLAYING);
    generateQuestion();
  };

  const endGame = useCallback(() => {
    setStatus(GameStatus.GAMEOVER);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (status === GameStatus.PLAYING && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, timeLeft, endGame]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      inputRef.current?.focus();
    }
  }, [status, currentQuestion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (currentQuestion && parseInt(val) === currentQuestion.answer) {
      handleCorrect();
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setScore((prev) => prev + (10 + combo * 2));
    setCombo((prev) => {
      const newCombo = prev + 1;
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      return newCombo;
    });
    setCorrectCount((prev) => prev + 1);
    setTimeLeft((prev) => Math.min(prev + BONUS_TIME, 99));
    
    setTimeout(() => {
      generateQuestion();
    }, 150);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentQuestion) {
      if (parseInt(userInput) !== currentQuestion.answer) {
        setFeedback('wrong');
        setCombo(0);
        setMistakes((prev) => [...prev, `${currentQuestion.num1}x${currentQuestion.num2}`]);
        setUserInput('');
        setTimeout(() => setFeedback(null), 300);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pink-50 overflow-hidden">
      {status === GameStatus.IDLE && (
        <div className="text-center max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-pink-500 rounded-3xl rotate-12 flex items-center justify-center mx-auto shadow-xl">
              <span className="text-white text-5xl font-black -rotate-12">9x9</span>
            </div>
            <div className="absolute -top-4 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <i className="fa-solid fa-heart text-white text-xl"></i>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">반짝반짝 구구단</h1>
          <p className="text-slate-500 mb-8 font-medium">얼마나 빨리 풀 수 있을까요? 재미있게 시작해봐요!</p>
          
          <div className="space-y-4 mb-10 text-left bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-clock"></i>
              </div>
              <p className="text-sm text-slate-600">30초 안에 최대한 많이 풀어요. 정답이면 시간이 늘어나요!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-fire"></i>
              </div>
              <p className="text-sm text-slate-600">연속해서 맞히면 점수가 쑥쑥! 콤보를 이어가보세요.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <p className="text-sm text-slate-600">게임이 끝나면 AI 선생님이 응원의 한마디를 해줘요.</p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-pink-200 active:scale-95"
          >
            모험 시작하기!
          </button>
        </div>
      )}

      {status === GameStatus.PLAYING && currentQuestion && (
        <div className="flex flex-col items-center w-full max-w-lg">
          <Stats score={score} timeLeft={timeLeft} combo={combo} />
          
          <div className={`w-full bg-white rounded-3xl p-10 shadow-xl border-4 transition-all duration-200 ${
            feedback === 'correct' ? 'border-green-400 scale-105' : 
            feedback === 'wrong' ? 'border-red-400 shake animate-bounce' : 'border-transparent'
          }`}>
            <div className="flex justify-center items-center gap-6 mb-8 select-none">
              <span className="text-6xl md:text-8xl font-black text-slate-800">{currentQuestion.num1}</span>
              <span className="text-4xl md:text-5xl font-bold text-pink-300">×</span>
              <span className="text-6xl md:text-8xl font-black text-slate-800">{currentQuestion.num2}</span>
            </div>
            
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="?"
                className="w-full text-center text-5xl font-black py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-pink-400 outline-none transition-all placeholder:text-slate-300"
                autoFocus
              />
              <p className="text-center mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">정답을 쓰고 '엔터'를 눌러도 돼요!</p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-500 ${timeLeft < 10 ? 'bg-red-500' : 'bg-pink-200'}`}></div>
            ))}
          </div>
        </div>
      )}

      {status === GameStatus.GAMEOVER && (
        <GameOver 
          result={{ score, correctCount, mistakes, maxCombo }} 
          onRestart={startGame} 
        />
      )}
      
      <footer className="fixed bottom-6 text-slate-400 text-sm font-medium">
        구구단 마스터 v2.0 • AI 선생님이 함께해요
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;
