
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export interface Question {
  num1: number;
  num2: number;
  answer: number;
}

export interface GameResult {
  score: number;
  correctCount: number;
  mistakes: string[];
  maxCombo: number;
}

export interface AIAnalysis {
  title: string;
  summary: string;
  advice: string;
}
